package com.wristo.modules.order.controller;

import com.wristo.common.dto.ApiResponse;
import com.wristo.common.dto.PageResponse;
import com.wristo.modules.order.dto.CancelOrderRequest;
import com.wristo.modules.order.dto.OrderResponse;
import com.wristo.modules.order.service.OrderService;
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
@RequestMapping("/orders")
@Tag(name = "Orders", description = "Customer Order History & Horological Tracking APIs")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping("/my-orders")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get authenticated client order history", description = "Retrieves paginated acquisition history for authenticated client")
    public ResponseEntity<ApiResponse<PageResponse<OrderResponse>>> getMyOrders(
            @AuthenticationPrincipal UserPrincipal principal,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        PageResponse<OrderResponse> response = orderService.getMyOrders(principal, pageable);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{orderNumber}")
    @Operation(summary = "Get order tracking details", description = "Retrieves order status, line items, delivery logistics and authenticity certificate")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderByNumber(
            @PathVariable String orderNumber,
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false) String email
    ) {
        OrderResponse response = orderService.getOrderByNumber(orderNumber, principal, email);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/{orderNumber}/cancel")
    @Operation(summary = "Cancel timepiece order", description = "Cancels order and releases/restocks inventory if status allows cancellation")
    public ResponseEntity<ApiResponse<OrderResponse>> cancelOrder(
            @PathVariable String orderNumber,
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CancelOrderRequest request
    ) {
        OrderResponse response = orderService.cancelOrder(orderNumber, principal, request);
        return ResponseEntity.ok(ApiResponse.success("Order cancelled successfully", response));
    }
}
