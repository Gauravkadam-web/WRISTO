package com.wristo.modules.inventory.service;

import com.wristo.common.dto.PageResponse;
import com.wristo.exception.BusinessException;
import com.wristo.exception.ErrorCode;
import com.wristo.exception.ResourceNotFoundException;
import com.wristo.modules.auth.entity.User;
import com.wristo.modules.auth.repository.UserRepository;
import com.wristo.modules.inventory.dto.*;
import com.wristo.modules.inventory.entity.*;
import com.wristo.modules.inventory.repository.InventoryMovementRepository;
import com.wristo.modules.inventory.repository.InventoryRepository;
import com.wristo.modules.inventory.repository.InventoryReservationRepository;
import com.wristo.modules.seller.entity.Seller;
import com.wristo.modules.seller.entity.SellerUser;
import com.wristo.modules.seller.repository.SellerUserRepository;
import com.wristo.security.model.UserPrincipal;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class InventoryService {

    private static final Logger log = LoggerFactory.getLogger(InventoryService.class);

    private final InventoryRepository inventoryRepository;
    private final InventoryMovementRepository movementRepository;
    private final InventoryReservationRepository reservationRepository;
    private final SellerUserRepository sellerUserRepository;
    private final UserRepository userRepository;

    public InventoryService(InventoryRepository inventoryRepository,
                            InventoryMovementRepository movementRepository,
                            InventoryReservationRepository reservationRepository,
                            SellerUserRepository sellerUserRepository,
                            UserRepository userRepository) {
        this.inventoryRepository = inventoryRepository;
        this.movementRepository = movementRepository;
        this.reservationRepository = reservationRepository;
        this.sellerUserRepository = sellerUserRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public PageResponse<InventoryResponse> getSellerInventory(UserPrincipal principal, Pageable pageable) {
        Seller seller = resolveSellerForUser(principal.getId());
        Page<Inventory> page = inventoryRepository.findAllBySellerListingSellerId(seller.getId(), pageable);
        return PageResponse.from(page.map(InventoryResponse::from));
    }

    @Transactional(readOnly = true)
    public InventoryResponse getInventoryByListing(UserPrincipal principal, UUID listingId) {
        Seller seller = resolveSellerForUser(principal.getId());
        Inventory inventory = inventoryRepository.findBySellerListingSellerIdAndSellerListingId(seller.getId(), listingId)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.INVENTORY_NOT_FOUND, "Inventory not found for listing: " + listingId));
        return InventoryResponse.from(inventory);
    }

    public InventoryResponse adjustStock(UserPrincipal principal, AdjustStockRequest request) {
        Seller seller = resolveSellerForUser(principal.getId());

        Inventory inventory = inventoryRepository.findBySellerListingIdWithLock(request.getSellerListingId())
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.INVENTORY_NOT_FOUND, "Inventory record not found for listing: " + request.getSellerListingId()));

        if (!inventory.getSellerListing().getSeller().getId().equals(seller.getId())) {
            throw new BusinessException(ErrorCode.FORBIDDEN_OPERATION, "You can only adjust inventory for your own boutique.");
        }

        int newAvailable = inventory.getAvailableQuantity() + request.getQuantityChange();
        int newTotal = inventory.getTotalQuantity() + request.getQuantityChange();

        if (newAvailable < 0 || newTotal < 0) {
            throw new BusinessException(ErrorCode.INVALID_INVENTORY_ADJUSTMENT,
                    "Cannot adjust stock by " + request.getQuantityChange() + ". Available stock would drop below zero (Current available: " + inventory.getAvailableQuantity() + ").");
        }

        inventory.setAvailableQuantity(newAvailable);
        inventory.setTotalQuantity(newTotal);

        Inventory saved = inventoryRepository.save(inventory);

        InventoryMovement movement = new InventoryMovement();
        movement.setInventory(saved);
        movement.setMovementType(request.getQuantityChange() > 0 ? MovementType.RESTOCK : MovementType.ADJUSTMENT);
        movement.setQuantity(request.getQuantityChange());
        movement.setReason(request.getReason());
        movement.setReferenceId("ADJUST-" + UUID.randomUUID().toString().substring(0, 8));
        movement.setCreatedBy(principal.getUsername());
        movementRepository.save(movement);

        log.info("Adjusted inventory for listing: {} by: {} (New available: {})", request.getSellerListingId(), request.getQuantityChange(), newAvailable);
        return InventoryResponse.from(saved);
    }

    @Transactional(readOnly = true)
    public PageResponse<InventoryMovementResponse> getListingMovements(UserPrincipal principal, UUID listingId, Pageable pageable) {
        Seller seller = resolveSellerForUser(principal.getId());
        Inventory inventory = inventoryRepository.findBySellerListingSellerIdAndSellerListingId(seller.getId(), listingId)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.INVENTORY_NOT_FOUND, "Inventory not found for listing: " + listingId));

        Page<InventoryMovement> movements = movementRepository.findAllByInventoryIdOrderByCreatedAtDesc(inventory.getId(), pageable);
        return PageResponse.from(movements.map(InventoryMovementResponse::from));
    }

    public StockReservationResponse reserveStock(UUID listingId, UUID userId, int quantity, long holdMinutes) {
        if (quantity <= 0) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST_DATA, "Reservation quantity must be at least 1");
        }

        Inventory inventory = inventoryRepository.findBySellerListingIdWithLock(listingId)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.INVENTORY_NOT_FOUND, "Inventory record not found for listing: " + listingId));

        if (inventory.getAvailableQuantity() < quantity) {
            throw new BusinessException(ErrorCode.INSUFFICIENT_INVENTORY,
                    "Insufficient available inventory for watch listing: " + listingId + " (Available: " + inventory.getAvailableQuantity() + ", Requested: " + quantity + ")");
        }

        inventory.setAvailableQuantity(inventory.getAvailableQuantity() - quantity);
        inventory.setReservedQuantity(inventory.getReservedQuantity() + quantity);
        inventoryRepository.save(inventory);

        InventoryReservation reservation = new InventoryReservation();
        reservation.setInventory(inventory);
        if (userId != null) {
            User user = userRepository.findById(userId).orElse(null);
            reservation.setUser(user);
        }
        reservation.setQuantity(quantity);
        reservation.setStatus(ReservationStatus.ACTIVE);
        reservation.setExpiresAt(Instant.now().plus(Duration.ofMinutes(holdMinutes > 0 ? holdMinutes : 15)));

        InventoryReservation savedReservation = reservationRepository.save(reservation);

        InventoryMovement movement = new InventoryMovement();
        movement.setInventory(inventory);
        movement.setMovementType(MovementType.RESERVATION);
        movement.setQuantity(quantity);
        movement.setReferenceId(savedReservation.getId().toString());
        movement.setReason("Checkout hold reservation");
        movement.setCreatedBy(userId != null ? userId.toString() : "GUEST");
        movementRepository.save(movement);

        log.info("Reserved {} units for listing: {} under reservation ID: {}", quantity, listingId, savedReservation.getId());
        return StockReservationResponse.from(savedReservation);
    }

    public void releaseReservation(UUID reservationId) {
        InventoryReservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.RESERVATION_NOT_FOUND, "Reservation not found: " + reservationId));

        if (reservation.getStatus() != ReservationStatus.ACTIVE) {
            return;
        }

        Inventory inventory = inventoryRepository.findByIdWithLock(reservation.getInventory().getId())
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.INVENTORY_NOT_FOUND, "Inventory not found"));

        inventory.setAvailableQuantity(inventory.getAvailableQuantity() + reservation.getQuantity());
        inventory.setReservedQuantity(Math.max(0, inventory.getReservedQuantity() - reservation.getQuantity()));
        inventoryRepository.save(inventory);

        reservation.setStatus(ReservationStatus.CANCELLED);
        reservationRepository.save(reservation);

        InventoryMovement movement = new InventoryMovement();
        movement.setInventory(inventory);
        movement.setMovementType(MovementType.RELEASE);
        movement.setQuantity(reservation.getQuantity());
        movement.setReferenceId(reservationId.toString());
        movement.setReason("Reservation expired or cancelled");
        movement.setCreatedBy("SYSTEM");
        movementRepository.save(movement);

        log.info("Released reservation ID: {} for listing: {}", reservationId, inventory.getSellerListing().getId());
    }

    public void completeReservation(UUID reservationId, String orderId) {
        InventoryReservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.RESERVATION_NOT_FOUND, "Reservation not found: " + reservationId));

        if (reservation.getStatus() != ReservationStatus.ACTIVE) {
            throw new BusinessException(ErrorCode.RESERVATION_EXPIRED, "Reservation is no longer active");
        }

        Inventory inventory = inventoryRepository.findByIdWithLock(reservation.getInventory().getId())
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.INVENTORY_NOT_FOUND, "Inventory not found"));

        inventory.setReservedQuantity(Math.max(0, inventory.getReservedQuantity() - reservation.getQuantity()));
        inventory.setSoldQuantity(inventory.getSoldQuantity() + reservation.getQuantity());
        inventoryRepository.save(inventory);

        reservation.setStatus(ReservationStatus.COMPLETED);
        reservationRepository.save(reservation);

        InventoryMovement movement = new InventoryMovement();
        movement.setInventory(inventory);
        movement.setMovementType(MovementType.SALE);
        movement.setQuantity(reservation.getQuantity());
        movement.setReferenceId(orderId != null ? orderId : reservationId.toString());
        movement.setReason("Order placed and payment confirmed");
        movement.setCreatedBy("ORDER_SERVICE");
        movementRepository.save(movement);

        log.info("Completed reservation ID: {} for order: {}", reservationId, orderId);
    }

    private Seller resolveSellerForUser(UUID userId) {
        List<SellerUser> sellerUsers = sellerUserRepository.findByUserId(userId);
        if (sellerUsers.isEmpty()) {
            throw new ResourceNotFoundException(ErrorCode.SELLER_NOT_FOUND, "Authenticated user is not affiliated with a registered seller boutique.");
        }
        return sellerUsers.get(0).getSeller();
    }
}
