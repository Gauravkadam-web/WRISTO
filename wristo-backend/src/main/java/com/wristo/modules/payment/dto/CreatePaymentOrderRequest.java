package com.wristo.modules.payment.dto;

import com.wristo.modules.order.entity.PaymentMethod;
import com.wristo.modules.payment.entity.PaymentGatewayType;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record CreatePaymentOrderRequest(
        String checkoutSessionId,
        String orderId,

        @NotNull(message = "Payment amount is required")
        BigDecimal amount,

        String currency,

        @NotNull(message = "Payment gateway type is required")
        PaymentGatewayType gateway,

        @NotNull(message = "Payment method is required")
        PaymentMethod paymentMethod,

        String customerEmail,
        String customerPhone
) {
}
