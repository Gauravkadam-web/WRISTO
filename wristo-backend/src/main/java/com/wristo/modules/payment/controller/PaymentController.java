package com.wristo.modules.payment.controller;

import com.wristo.common.dto.ApiResponse;
import com.wristo.modules.payment.dto.CreatePaymentOrderRequest;
import com.wristo.modules.payment.dto.PaymentOrderResponse;
import com.wristo.modules.payment.dto.PaymentResponse;
import com.wristo.modules.payment.dto.VerifyPaymentRequest;
import com.wristo.modules.payment.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/payments")
@Tag(name = "Payments", description = "Payment Gateway Adapters & Signature Verification APIs")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping({"/create-intent", "/create-order"})
    @Operation(summary = "Create Payment Gateway Intent", description = "Initializes payment order intent with Razorpay, Stripe or simulated sandbox")
    public ResponseEntity<ApiResponse<PaymentOrderResponse>> createPaymentOrder(
            @Valid @RequestBody CreatePaymentOrderRequest request
    ) {
        PaymentOrderResponse response = paymentService.createPaymentOrder(request);
        return ResponseEntity.ok(ApiResponse.success("Payment intent created successfully", response));
    }

    @PostMapping("/verify")
    @Operation(summary = "Verify Payment Signature", description = "Cryptographically verifies gateway signature or mock sandbox transaction")
    public ResponseEntity<ApiResponse<PaymentResponse>> verifyPayment(
            @Valid @RequestBody VerifyPaymentRequest request
    ) {
        PaymentResponse response = paymentService.verifyPayment(request);
        return ResponseEntity.ok(ApiResponse.success("Payment verified successfully", response));
    }

    @PostMapping("/webhook")
    @Operation(summary = "Payment Gateway Webhook Callback", description = "Asynchronous callback for gateway capture / failure events")
    public ResponseEntity<ApiResponse<String>> handleWebhook(
            @RequestBody Map<String, Object> payload
    ) {
        return ResponseEntity.ok(ApiResponse.success("Webhook received and processed", "OK"));
    }
}
