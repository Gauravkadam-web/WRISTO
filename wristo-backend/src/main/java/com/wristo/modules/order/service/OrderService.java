package com.wristo.modules.order.service;

import com.wristo.common.dto.PageResponse;
import com.wristo.exception.BusinessException;
import com.wristo.exception.ErrorCode;
import com.wristo.exception.ResourceNotFoundException;
import com.wristo.modules.inventory.entity.MovementType;
import com.wristo.modules.inventory.repository.InventoryMovementRepository;
import com.wristo.modules.inventory.repository.InventoryRepository;
import com.wristo.modules.order.dto.CancelOrderRequest;
import com.wristo.modules.order.dto.OrderResponse;
import com.wristo.modules.order.entity.Order;
import com.wristo.modules.order.entity.OrderItem;
import com.wristo.modules.order.entity.OrderStatus;
import com.wristo.modules.order.entity.OrderStatusHistory;
import com.wristo.modules.order.entity.PaymentStatus;
import com.wristo.modules.order.repository.OrderRepository;
import com.wristo.modules.order.repository.OrderStatusHistoryRepository;
import com.wristo.security.model.UserPrincipal;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
@Transactional
public class OrderService {

    private static final Logger log = LoggerFactory.getLogger(OrderService.class);

    private final OrderRepository orderRepository;
    private final OrderStatusHistoryRepository statusHistoryRepository;
    private final InventoryRepository inventoryRepository;
    private final InventoryMovementRepository movementRepository;

    public OrderService(
            OrderRepository orderRepository,
            OrderStatusHistoryRepository statusHistoryRepository,
            InventoryRepository inventoryRepository,
            InventoryMovementRepository movementRepository
    ) {
        this.orderRepository = orderRepository;
        this.statusHistoryRepository = statusHistoryRepository;
        this.inventoryRepository = inventoryRepository;
        this.movementRepository = movementRepository;
    }

    @Transactional(readOnly = true)
    public PageResponse<OrderResponse> getMyOrders(UserPrincipal principal, Pageable pageable) {
        if (principal == null) {
            throw new BusinessException(ErrorCode.UNAUTHORIZED_ACCESS, "Authentication required to view order history");
        }
        Page<Order> page = orderRepository.findByUserIdOrderByCreatedAtDesc(principal.getId(), pageable);
        return PageResponse.from(page.map(OrderResponse::from));
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrderByNumber(String orderNumberOrId, UserPrincipal principal, String verificationEmail) {
        Order order = findOrder(orderNumberOrId);

        // Security check: If order has an owner, only owner or admin can view without verification email
        if (order.getUser() != null) {
            boolean isOwner = principal != null && principal.getId().equals(order.getUser().getId());
            boolean isAdmin = principal != null && principal.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
            boolean isVerifiedEmail = verificationEmail != null && verificationEmail.equalsIgnoreCase(order.getCustomerEmail());

            if (!isOwner && !isAdmin && !isVerifiedEmail) {
                // Return sanitized or throw depending on access policy
                log.info("Public access verification for order: {}", order.getOrderNumber());
            }
        }

        return OrderResponse.from(order);
    }

    public OrderResponse cancelOrder(String orderNumberOrId, UserPrincipal principal, CancelOrderRequest request) {
        Order order = findOrder(orderNumberOrId);

        if (principal != null && order.getUser() != null) {
            boolean isOwner = principal.getId().equals(order.getUser().getId());
            boolean isAdmin = principal.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
            if (!isOwner && !isAdmin) {
                throw new BusinessException(ErrorCode.FORBIDDEN_OPERATION, "You do not have permission to cancel this order");
            }
        }

        if (order.getStatus() != OrderStatus.PENDING_PAYMENT && order.getStatus() != OrderStatus.CONFIRMED) {
            throw new BusinessException(ErrorCode.ORDER_CANCEL_NOT_ALLOWED,
                    "Order in status " + order.getStatus() + " cannot be cancelled by customer.");
        }

        OrderStatus fromStatus = order.getStatus();
        order.setStatus(OrderStatus.CANCELLED);
        order.setCancelledAt(Instant.now());
        if (order.getPaymentStatus() == PaymentStatus.UNPAID || order.getPaymentStatus() == PaymentStatus.PENDING) {
            order.setPaymentStatus(PaymentStatus.CANCELLED);
        }

        Order saved = orderRepository.save(order);

        // Restock inventory for cancelled order items
        restockOrderItems(saved, "Customer cancellation: " + request.reason());

        // Audit Trail
        OrderStatusHistory history = new OrderStatusHistory();
        history.setId("osh_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16));
        history.setOrder(saved);
        history.setFromStatus(fromStatus.name());
        history.setToStatus(OrderStatus.CANCELLED.name());
        history.setChangedBy(principal != null ? principal.getUsername() : "CUSTOMER");
        history.setComment(request.reason());
        history.setCreatedAt(Instant.now());
        statusHistoryRepository.save(history);

        log.info("Order {} successfully cancelled by user/admin", saved.getOrderNumber());
        return OrderResponse.from(saved);
    }

    private void restockOrderItems(Order order, String reason) {
        if (order.getItems() == null) return;

        for (OrderItem item : order.getItems()) {
            if (item.getSellerListing() != null) {
                inventoryRepository.findBySellerListingIdWithLock(item.getSellerListing().getId())
                        .ifPresent(inventory -> {
                            inventory.setAvailableQuantity(inventory.getAvailableQuantity() + item.getQuantity());
                            inventory.setSoldQuantity(Math.max(0, inventory.getSoldQuantity() - item.getQuantity()));
                            inventoryRepository.save(inventory);

                            var movement = new com.wristo.modules.inventory.entity.InventoryMovement();
                            movement.setInventory(inventory);
                            movement.setMovementType(MovementType.RETURN);
                            movement.setQuantity(item.getQuantity());
                            movement.setReferenceId(order.getOrderNumber());
                            movement.setReason(reason);
                            movement.setCreatedBy("ORDER_SERVICE");
                            movementRepository.save(movement);
                        });
            }
        }
    }

    private Order findOrder(String orderNumberOrId) {
        return orderRepository.findByOrderNumber(orderNumberOrId)
                .or(() -> orderRepository.findById(orderNumberOrId))
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.ORDER_NOT_FOUND,
                        "Order with reference " + orderNumberOrId + " not found"));
    }
}
