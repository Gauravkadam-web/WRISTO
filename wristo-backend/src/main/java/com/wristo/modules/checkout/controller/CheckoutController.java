package com.wristo.modules.checkout.controller;

import com.wristo.common.dto.ApiResponse;
import com.wristo.modules.checkout.dto.CompleteCheckoutRequest;
import com.wristo.modules.checkout.dto.InitiateCheckoutRequest;
import com.wristo.modules.checkout.dto.InitiateCheckoutResponse;
import com.wristo.modules.checkout.service.CheckoutService;
import com.wristo.modules.order.dto.OrderResponse;
import com.wristo.security.model.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/checkout")
@Tag(name = "Checkout", description = "Luxury Multi-Step Checkout & State Machine APIs")
public class CheckoutController {

    private final CheckoutService checkoutService;

    public CheckoutController(CheckoutService checkoutService) {
        this.checkoutService = checkoutService;
    }

    @PostMapping("/initiate")
    @Operation(summary = "Initiate Luxury Checkout", description = "Validates items & coupon, calculates totals, and locks inventory in luxury escrow for 15 minutes.")
    public ResponseEntity<ApiResponse<InitiateCheckoutResponse>> initiateCheckout(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestHeader(value = "X-Session-ID", required = false) String sessionIdHeader1,
            @RequestHeader(value = "X-Session-Id", required = false) String sessionIdHeader2,
            @Valid @RequestBody InitiateCheckoutRequest request
    ) {
        String sessionId = sessionIdHeader1 != null ? sessionIdHeader1 : sessionIdHeader2;
        InitiateCheckoutResponse response = checkoutService.initiateCheckout(principal, sessionId, request);
        return ResponseEntity.ok(ApiResponse.success("Checkout session initiated with 15-minute luxury stock hold", response));
    }

    @PostMapping("/complete")
    @Operation(summary = "Complete Luxury Checkout", description = "Executes state transition, generates serialized order credentials and certificate of authenticity, clears shopping cart, and completes payment.")
    public ResponseEntity<ApiResponse<OrderResponse>> completeCheckout(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestHeader(value = "X-Session-ID", required = false) String sessionIdHeader1,
            @RequestHeader(value = "X-Session-Id", required = false) String sessionIdHeader2,
            @Valid @RequestBody CompleteCheckoutRequest request
    ) {
        String sessionId = sessionIdHeader1 != null ? sessionIdHeader1 : sessionIdHeader2;
        OrderResponse response = checkoutService.completeCheckout(principal, sessionId, request);
        return ResponseEntity.ok(ApiResponse.success("Timepiece acquisition confirmed and certified", response));
    }
}
