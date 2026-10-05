package com.wristo.modules.cart.controller;

import com.wristo.common.dto.ApiResponse;
import com.wristo.modules.cart.dto.*;
import com.wristo.modules.cart.service.CartService;
import com.wristo.security.model.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/cart")
@Tag(name = "Cart", description = "Shopping Cart & Real-time Calculation APIs")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    @Operation(summary = "Get active shopping cart", description = "Retrieves cart with real-time watch metadata, stock verification and calculated totals")
    public ResponseEntity<ApiResponse<CartResponse>> getCart(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestHeader(value = "X-Session-ID", required = false) String sessionIdHeader1,
            @RequestHeader(value = "X-Session-Id", required = false) String sessionIdHeader2
    ) {
        String sessionId = sessionIdHeader1 != null ? sessionIdHeader1 : sessionIdHeader2;
        UUID userId = principal != null ? principal.getId() : null;
        CartResponse response = cartService.getCart(userId, sessionId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/items")
    @Operation(summary = "Add timepiece to cart", description = "Adds watch to cart with stock validation")
    public ResponseEntity<ApiResponse<CartResponse>> addItem(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestHeader(value = "X-Session-ID", required = false) String sessionIdHeader1,
            @RequestHeader(value = "X-Session-Id", required = false) String sessionIdHeader2,
            @Valid @RequestBody AddToCartRequest request
    ) {
        String sessionId = sessionIdHeader1 != null ? sessionIdHeader1 : sessionIdHeader2;
        UUID userId = principal != null ? principal.getId() : null;
        CartResponse response = cartService.addItem(userId, sessionId, request);
        return ResponseEntity.ok(ApiResponse.success("Timepiece added to cart", response));
    }

    @PutMapping("/items/{itemId}")
    @Operation(summary = "Update cart item quantity", description = "Updates quantity with stock constraint check")
    public ResponseEntity<ApiResponse<CartResponse>> updateQuantity(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestHeader(value = "X-Session-ID", required = false) String sessionIdHeader1,
            @RequestHeader(value = "X-Session-Id", required = false) String sessionIdHeader2,
            @PathVariable String itemId,
            @Valid @RequestBody UpdateCartItemRequest request
    ) {
        String sessionId = sessionIdHeader1 != null ? sessionIdHeader1 : sessionIdHeader2;
        UUID userId = principal != null ? principal.getId() : null;
        CartResponse response = cartService.updateItemQuantity(userId, sessionId, itemId, request);
        return ResponseEntity.ok(ApiResponse.success("Cart updated", response));
    }

    @DeleteMapping("/items/{itemId}")
    @Operation(summary = "Remove item from cart", description = "Removes specific timepiece from active cart")
    public ResponseEntity<ApiResponse<CartResponse>> removeItem(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestHeader(value = "X-Session-ID", required = false) String sessionIdHeader1,
            @RequestHeader(value = "X-Session-Id", required = false) String sessionIdHeader2,
            @PathVariable String itemId
    ) {
        String sessionId = sessionIdHeader1 != null ? sessionIdHeader1 : sessionIdHeader2;
        UUID userId = principal != null ? principal.getId() : null;
        CartResponse response = cartService.removeItem(userId, sessionId, itemId);
        return ResponseEntity.ok(ApiResponse.success("Item removed from cart", response));
    }

    @DeleteMapping
    @Operation(summary = "Clear shopping cart", description = "Removes all items and resets cart preferences")
    public ResponseEntity<ApiResponse<CartResponse>> clearCart(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestHeader(value = "X-Session-ID", required = false) String sessionIdHeader1,
            @RequestHeader(value = "X-Session-Id", required = false) String sessionIdHeader2
    ) {
        String sessionId = sessionIdHeader1 != null ? sessionIdHeader1 : sessionIdHeader2;
        UUID userId = principal != null ? principal.getId() : null;
        CartResponse response = cartService.clearCart(userId, sessionId);
        return ResponseEntity.ok(ApiResponse.success("Cart cleared", response));
    }

    @PostMapping({"/apply-coupon", "/coupon"})
    @Operation(summary = "Apply promotional voucher", description = "Validates and attaches coupon to cart")
    public ResponseEntity<ApiResponse<CartResponse>> applyCoupon(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestHeader(value = "X-Session-ID", required = false) String sessionIdHeader1,
            @RequestHeader(value = "X-Session-Id", required = false) String sessionIdHeader2,
            @Valid @RequestBody ApplyCouponRequest request
    ) {
        String sessionId = sessionIdHeader1 != null ? sessionIdHeader1 : sessionIdHeader2;
        UUID userId = principal != null ? principal.getId() : null;
        CartResponse response = cartService.applyCoupon(userId, sessionId, request);
        return ResponseEntity.ok(ApiResponse.success("Coupon code applied successfully", response));
    }

    @DeleteMapping({"/remove-coupon", "/coupon"})
    @Operation(summary = "Remove active coupon", description = "Detaches coupon from cart")
    public ResponseEntity<ApiResponse<CartResponse>> removeCoupon(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestHeader(value = "X-Session-ID", required = false) String sessionIdHeader1,
            @RequestHeader(value = "X-Session-Id", required = false) String sessionIdHeader2
    ) {
        String sessionId = sessionIdHeader1 != null ? sessionIdHeader1 : sessionIdHeader2;
        UUID userId = principal != null ? principal.getId() : null;
        CartResponse response = cartService.removeCoupon(userId, sessionId);
        return ResponseEntity.ok(ApiResponse.success("Coupon removed", response));
    }

    @RequestMapping(value = "/gift-options", method = {RequestMethod.POST, RequestMethod.PUT})
    @Operation(summary = "Update luxury gift wrap options", description = "Updates gift wrapping preference and personalized message")
    public ResponseEntity<ApiResponse<CartResponse>> updateGiftOptions(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestHeader(value = "X-Session-ID", required = false) String sessionIdHeader1,
            @RequestHeader(value = "X-Session-Id", required = false) String sessionIdHeader2,
            @Valid @RequestBody CartGiftOptionRequest request
    ) {
        String sessionId = sessionIdHeader1 != null ? sessionIdHeader1 : sessionIdHeader2;
        UUID userId = principal != null ? principal.getId() : null;
        CartResponse response = cartService.updateGiftOptions(userId, sessionId, request);
        return ResponseEntity.ok(ApiResponse.success("Gift options updated", response));
    }

    @RequestMapping(value = {"/delivery-option", "/delivery-options"}, method = {RequestMethod.POST, RequestMethod.PUT})
    @Operation(summary = "Update delivery tier", description = "Selects delivery tier (insured_express or white_glove)")
    public ResponseEntity<ApiResponse<CartResponse>> updateDeliveryOption(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestHeader(value = "X-Session-ID", required = false) String sessionIdHeader1,
            @RequestHeader(value = "X-Session-Id", required = false) String sessionIdHeader2,
            @Valid @RequestBody CartDeliveryOptionRequest request
    ) {
        String sessionId = sessionIdHeader1 != null ? sessionIdHeader1 : sessionIdHeader2;
        UUID userId = principal != null ? principal.getId() : null;
        CartResponse response = cartService.updateDeliveryOption(userId, sessionId, request);
        return ResponseEntity.ok(ApiResponse.success("Delivery tier updated", response));
    }

    @PostMapping({"/calculate", "/calculate-totals"})
    @Operation(summary = "Calculate order totals (Stateless)", description = "Calculates instant totals, discounts, shipping and gift unlocks")
    public ResponseEntity<ApiResponse<OrderTotalsResponse>> calculateTotals(
            @Valid @RequestBody CalculateTotalsRequest request
    ) {
        OrderTotalsResponse response = cartService.calculateStatelessTotals(request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
