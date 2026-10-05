package com.wristo.modules.order.controller;

import com.wristo.common.dto.ApiResponse;
import com.wristo.common.dto.PageResponse;
import com.wristo.modules.order.dto.OrderResponse;
import com.wristo.modules.order.dto.UpdateOrderStatusRequest;
import com.wristo.modules.order.entity.OrderStatus;
import com.wristo.modules.order.entity.PaymentStatus;
import com.wristo.modules.order.service.AdminOrderService;
import com.wristo.security.model.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/orders")
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin Orders", description = "Boutique Order Moderation, Fulfillment & Lifecycle State Machine")
public class AdminOrderController {

    private final AdminOrderService adminOrderService;

    public AdminOrderController(AdminOrderService adminOrderService) {
        this.adminOrderService = adminOrderService;
    }

    @GetMapping
    @Operation(summary = "List all orders", description = "Admin order search and filtering by status, payment status, customer or serial number")
    public ResponseEntity<ApiResponse<PageResponse<OrderResponse>>> getAllOrders(
            @RequestParam(required = false) OrderStatus status,
            @RequestParam(required = false) PaymentStatus paymentStatus,
            @RequestParam(required = false) String search,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        PageResponse<OrderResponse> response = adminOrderService.getAllOrders(status, paymentStatus, search, pageable);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PatchMapping("/{orderNumber}/status")
    @Operation(summary = "Transition order lifecycle state", description = "Progresses order status (PROCESSING_VAULT, DISPATCHED, DELIVERED, CANCELLED, REFUNDED) with audit trail")
    public ResponseEntity<ApiResponse<OrderResponse>> updateOrderStatus(
            @PathVariable String orderNumber,
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody UpdateOrderStatusRequest request
    ) {
        OrderResponse response = adminOrderService.updateOrderStatus(orderNumber, principal, request);
        return ResponseEntity.ok(ApiResponse.success("Order status updated successfully", response));
    }
}
