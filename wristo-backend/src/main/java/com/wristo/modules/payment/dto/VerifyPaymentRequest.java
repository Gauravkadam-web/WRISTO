package com.wristo.modules.payment.dto;

import com.wristo.modules.payment.entity.PaymentGatewayType;
import jakarta.validation.constraints.NotNull;

public record VerifyPaymentRequest(
        @NotNull(message = "Payment gateway is required")
        PaymentGatewayType gateway,

        String orderId,
        String gatewayOrderId,
        String gatewayPaymentId,
        String gatewaySignature,
        String status
) {
}
