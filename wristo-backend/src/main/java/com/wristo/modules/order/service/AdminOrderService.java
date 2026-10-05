package com.wristo.modules.order.service;

import com.wristo.common.dto.PageResponse;
import com.wristo.exception.BusinessException;
import com.wristo.exception.ErrorCode;
import com.wristo.exception.ResourceNotFoundException;
import com.wristo.modules.inventory.entity.MovementType;
import com.wristo.modules.inventory.repository.InventoryMovementRepository;
import com.wristo.modules.inventory.repository.InventoryRepository;
import com.wristo.modules.order.dto.OrderResponse;
import com.wristo.modules.order.dto.UpdateOrderStatusRequest;
import com.wristo.modules.order.entity.Order;
import com.wristo.modules.order.entity.OrderItem;
import com.wristo.modules.order.entity.OrderStatus;
import com.wristo.modules.order.entity.OrderStatusHistory;
import com.wristo.modules.order.entity.PaymentMethod;
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
public class AdminOrderService {

    private static final Logger log = LoggerFactory.getLogger(AdminOrderService.class);

    private final OrderRepository orderRepository;
    private final OrderStatusHistoryRepository statusHistoryRepository;
    private final InventoryRepository inventoryRepository;
    private final InventoryMovementRepository movementRepository;

    public AdminOrderService(
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
    public PageResponse<OrderResponse> getAllOrders(OrderStatus status, PaymentStatus paymentStatus, String search, Pageable pageable) {
        Page<Order> page;
        if (status != null && paymentStatus != null) {
            page = orderRepository.findByStatusAndPaymentStatusOrderByCreatedAtDesc(status, paymentStatus, pageable);
        } else if (status != null) {
            page = orderRepository.findByStatusOrderByCreatedAtDesc(status, pageable);
        } else if (paymentStatus != null) {
            page = orderRepository.findByPaymentStatusOrderByCreatedAtDesc(paymentStatus, pageable);
        } else if (search != null && !search.isBlank()) {
            page = orderRepository.searchOrders(search.trim(), pageable);
        } else {
            page = orderRepository.findAllByOrderByCreatedAtDesc(pageable);
        }

        return PageResponse.from(page.map(OrderResponse::from));
    }

    public OrderResponse updateOrderStatus(String orderNumberOrId, UserPrincipal principal, UpdateOrderStatusRequest request) {
        Order order = orderRepository.findByOrderNumber(orderNumberOrId)
                .or(() -> orderRepository.findById(orderNumberOrId))
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.ORDER_NOT_FOUND,
                        "Order with reference " + orderNumberOrId + " not found"));

        OrderStatus currentStatus = order.getStatus();
        OrderStatus targetStatus = request.toStatus();

        validateStateTransition(currentStatus, targetStatus);

        order.setStatus(targetStatus);

        if (request.trackingNumber() != null && !request.trackingNumber().isBlank()) {
            order.setTrackingNumber(request.trackingNumber());
        }
        if (request.courierPartner() != null && !request.courierPartner().isBlank()) {
            order.setCourierPartner(request.courierPartner());
        }
        if (request.estimatedDeliveryAt() != null) {
            order.setEstimatedDeliveryAt(request.estimatedDeliveryAt());
        }

        // Status-specific state machine side effects
        if (targetStatus == OrderStatus.DELIVERED) {
            if (order.getPaymentMethod() == PaymentMethod.COD) {
                order.setPaymentStatus(PaymentStatus.PAID);
            }
        } else if (targetStatus == OrderStatus.CANCELLED) {
            order.setCancelledAt(Instant.now());
            if (order.getPaymentStatus() == PaymentStatus.UNPAID || order.getPaymentStatus() == PaymentStatus.PENDING) {
                order.setPaymentStatus(PaymentStatus.CANCELLED);
            }
            restockOrderItems(order, "Admin cancellation: " + request.comment());
        } else if (targetStatus == OrderStatus.REFUNDED) {
            order.setPaymentStatus(PaymentStatus.REFUNDED);
            restockOrderItems(order, "Admin refund: " + request.comment());
        }

        Order saved = orderRepository.save(order);

        // Audit Trail
        OrderStatusHistory history = new OrderStatusHistory();
        history.setId("osh_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16));
        history.setOrder(saved);
        history.setFromStatus(currentStatus != null ? currentStatus.name() : null);
        history.setToStatus(targetStatus.name());
        history.setChangedBy(principal != null ? principal.getUsername() : "ADMIN");
        history.setComment(request.comment());
        history.setCreatedAt(Instant.now());
        statusHistoryRepository.save(history);

        log.info("Admin updated order {} status from {} to {}", saved.getOrderNumber(), currentStatus, targetStatus);
        return OrderResponse.from(saved);
    }

    private void validateStateTransition(OrderStatus current, OrderStatus target) {
        if (current == target) {
            return;
        }

        if (current == OrderStatus.CANCELLED || current == OrderStatus.REFUNDED) {
            throw new BusinessException(ErrorCode.ORDER_INVALID_STATE_TRANSITION,
                    "Cannot change status of an order that is already in terminal state " + current);
        }

        boolean valid = switch (current) {
            case PENDING_PAYMENT -> target == OrderStatus.CONFIRMED || target == OrderStatus.CANCELLED;
            case CONFIRMED -> target == OrderStatus.PROCESSING_VAULT || target == OrderStatus.CANCELLED || target == OrderStatus.REFUNDED;
            case PROCESSING_VAULT -> target == OrderStatus.DISPATCHED || target == OrderStatus.CANCELLED;
            case DISPATCHED -> target == OrderStatus.DELIVERED || target == OrderStatus.CANCELLED;
            case DELIVERED -> target == OrderStatus.REFUNDED;
            case null, default -> false;
        };

        if (!valid) {
            throw new BusinessException(ErrorCode.ORDER_INVALID_STATE_TRANSITION,
                    String.format("Invalid order state transition from %s to %s", current, target));
        }
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
                            movement.setCreatedBy("ADMIN_ORDER_SERVICE");
                            movementRepository.save(movement);
                        });
            }
        }
    }
}
