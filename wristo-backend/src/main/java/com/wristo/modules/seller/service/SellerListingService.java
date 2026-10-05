package com.wristo.modules.seller.service;

import com.wristo.common.dto.PageResponse;
import com.wristo.exception.BusinessException;
import com.wristo.exception.ErrorCode;
import com.wristo.exception.ResourceNotFoundException;
import com.wristo.modules.catalog.entity.Watch;
import com.wristo.modules.catalog.repository.WatchRepository;
import com.wristo.modules.inventory.entity.Inventory;
import com.wristo.modules.inventory.entity.InventoryMovement;
import com.wristo.modules.inventory.entity.MovementType;
import com.wristo.modules.inventory.repository.InventoryMovementRepository;
import com.wristo.modules.inventory.repository.InventoryRepository;
import com.wristo.modules.seller.dto.CreateSellerListingRequest;
import com.wristo.modules.seller.dto.SellerListingResponse;
import com.wristo.modules.seller.dto.UpdateSellerListingRequest;
import com.wristo.modules.seller.entity.*;
import com.wristo.modules.seller.repository.SellerBrandAuthorizationRepository;
import com.wristo.modules.seller.repository.SellerListingRepository;
import com.wristo.modules.seller.repository.SellerRepository;
import com.wristo.modules.seller.repository.SellerUserRepository;
import com.wristo.security.model.UserPrincipal;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class SellerListingService {

    private static final Logger log = LoggerFactory.getLogger(SellerListingService.class);

    private final SellerListingRepository sellerListingRepository;
    private final SellerUserRepository sellerUserRepository;
    private final SellerRepository sellerRepository;
    private final WatchRepository watchRepository;
    private final SellerBrandAuthorizationRepository brandAuthorizationRepository;
    private final InventoryRepository inventoryRepository;
    private final InventoryMovementRepository inventoryMovementRepository;

    public SellerListingService(SellerListingRepository sellerListingRepository,
                                SellerUserRepository sellerUserRepository,
                                SellerRepository sellerRepository,
                                WatchRepository watchRepository,
                                SellerBrandAuthorizationRepository brandAuthorizationRepository,
                                InventoryRepository inventoryRepository,
                                InventoryMovementRepository inventoryMovementRepository) {
        this.sellerListingRepository = sellerListingRepository;
        this.sellerUserRepository = sellerUserRepository;
        this.sellerRepository = sellerRepository;
        this.watchRepository = watchRepository;
        this.brandAuthorizationRepository = brandAuthorizationRepository;
        this.inventoryRepository = inventoryRepository;
        this.inventoryMovementRepository = inventoryMovementRepository;
    }

    public SellerListingResponse createListing(UserPrincipal principal, CreateSellerListingRequest request) {
        Seller seller = resolveSellerForUser(principal.getId());

        if (seller.getStatus() != SellerStatus.VERIFIED) {
            throw new BusinessException(ErrorCode.SELLER_NOT_APPROVED, "Only verified seller boutiques can create marketplace listings.");
        }

        Watch watch = watchRepository.findByIdAndIsActiveTrue(request.getWatchId())
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.WATCH_NOT_FOUND, "Canonical watch not found: " + request.getWatchId()));

        if (sellerListingRepository.existsBySellerIdAndSellerSku(seller.getId(), request.getSellerSku())) {
            throw new BusinessException(ErrorCode.SELLER_LISTING_ALREADY_EXISTS, "A listing with SKU '" + request.getSellerSku() + "' already exists for your boutique.");
        }

        SellerListing listing = new SellerListing();
        listing.setSeller(seller);
        listing.setWatch(watch);
        listing.setSellerSku(request.getSellerSku());
        listing.setPrice(request.getPrice());
        listing.setOriginalPrice(request.getOriginalPrice());
        listing.setCondition(request.getCondition() != null ? request.getCondition() : "NEW");
        listing.setWarrantyType(request.getWarrantyType() != null ? request.getWarrantyType() : "BRAND_WARRANTY");
        listing.setWarrantyPeriod(request.getWarrantyPeriod() != null ? request.getWarrantyPeriod() : "2-Year International Warranty");
        listing.setAuthenticityGuarantee(request.getAuthenticityGuarantee() != null ? request.getAuthenticityGuarantee() : "100% Verified Swiss & Global Authenticity Guaranteed by WRISTO");
        listing.setStatus(ListingStatus.ACTIVE);
        listing.setIsActive(true);

        SellerListing savedListing = sellerListingRepository.save(listing);

        // Initialize associated inventory
        Inventory inventory = new Inventory();
        inventory.setSellerListing(savedListing);
        inventory.setTotalQuantity(request.getInitialStock());
        inventory.setAvailableQuantity(request.getInitialStock());
        inventory.setReservedQuantity(0);
        inventory.setSoldQuantity(0);
        inventory.setLowStockThreshold(2);
        Inventory savedInventory = inventoryRepository.save(inventory);

        savedListing.setInventory(savedInventory);

        // Record initial inventory movement audit
        if (request.getInitialStock() > 0) {
            InventoryMovement movement = new InventoryMovement();
            movement.setInventory(savedInventory);
            movement.setMovementType(MovementType.RESTOCK);
            movement.setQuantity(request.getInitialStock());
            movement.setReferenceId("INBOUND-INIT-" + savedListing.getId().toString().substring(0, 8));
            movement.setReason("Initial listing creation deposit");
            movement.setCreatedBy(principal.getUsername());
            inventoryMovementRepository.save(movement);
        }

        log.info("Created seller listing ID: {} for watch: {} by seller: {}", savedListing.getId(), watch.getId(), seller.getId());
        return SellerListingResponse.from(savedListing);
    }

    @Transactional(readOnly = true)
    public PageResponse<SellerListingResponse> getSellerListings(UserPrincipal principal, Pageable pageable) {
        Seller seller = resolveSellerForUser(principal.getId());
        Page<SellerListing> page = sellerListingRepository.findAllBySellerId(seller.getId(), pageable);
        return PageResponse.from(page.map(SellerListingResponse::from));
    }

    @Transactional(readOnly = true)
    public SellerListingResponse getListingById(UserPrincipal principal, UUID listingId) {
        Seller seller = resolveSellerForUser(principal.getId());
        SellerListing listing = sellerListingRepository.findByIdAndSellerId(listingId, seller.getId())
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.SELLER_LISTING_NOT_FOUND, "Seller listing not found: " + listingId));
        return SellerListingResponse.from(listing);
    }

    public SellerListingResponse updateListing(UserPrincipal principal, UUID listingId, UpdateSellerListingRequest request) {
        Seller seller = resolveSellerForUser(principal.getId());
        SellerListing listing = sellerListingRepository.findByIdAndSellerId(listingId, seller.getId())
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.SELLER_LISTING_NOT_FOUND, "Seller listing not found: " + listingId));

        listing.setPrice(request.getPrice());
        listing.setOriginalPrice(request.getOriginalPrice());
        if (request.getCondition() != null) listing.setCondition(request.getCondition());
        if (request.getWarrantyType() != null) listing.setWarrantyType(request.getWarrantyType());
        if (request.getWarrantyPeriod() != null) listing.setWarrantyPeriod(request.getWarrantyPeriod());
        if (request.getAuthenticityGuarantee() != null) listing.setAuthenticityGuarantee(request.getAuthenticityGuarantee());

        SellerListing updated = sellerListingRepository.save(listing);
        log.info("Updated seller listing ID: {} for seller: {}", updated.getId(), seller.getId());
        return SellerListingResponse.from(updated);
    }

    public SellerListingResponse toggleListingStatus(UserPrincipal principal, UUID listingId, boolean isActive) {
        Seller seller = resolveSellerForUser(principal.getId());
        SellerListing listing = sellerListingRepository.findByIdAndSellerId(listingId, seller.getId())
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.SELLER_LISTING_NOT_FOUND, "Seller listing not found: " + listingId));

        listing.setIsActive(isActive);
        if (!isActive) {
            listing.setStatus(ListingStatus.INACTIVE);
        } else if (listing.getStatus() == ListingStatus.INACTIVE) {
            listing.setStatus(ListingStatus.ACTIVE);
        }

        SellerListing updated = sellerListingRepository.save(listing);
        log.info("Toggled seller listing ID: {} active state to: {}", updated.getId(), isActive);
        return SellerListingResponse.from(updated);
    }

    @Transactional(readOnly = true)
    public List<SellerListingResponse> getPublicListingsForWatch(String watchId) {
        List<SellerListing> listings = sellerListingRepository.findActiveOffersForWatch(watchId, ListingStatus.ACTIVE);
        return listings.stream().map(SellerListingResponse::from).collect(Collectors.toList());
    }

    private Seller resolveSellerForUser(UUID userId) {
        List<SellerUser> sellerUsers = sellerUserRepository.findByUserId(userId);
        if (sellerUsers.isEmpty()) {
            throw new ResourceNotFoundException(ErrorCode.SELLER_NOT_FOUND, "Authenticated user is not affiliated with a registered seller boutique.");
        }
        return sellerUsers.get(0).getSeller();
    }
}
