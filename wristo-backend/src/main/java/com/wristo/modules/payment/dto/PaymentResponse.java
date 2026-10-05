package com.wristo.modules.payment.dto;

import com.wristo.modules.order.entity.PaymentMethod;
import com.wristo.modules.order.entity.PaymentStatus;
import com.wristo.modules.payment.entity.Payment;
import com.wristo.modules.payment.entity.PaymentGatewayType;
import java.math.BigDecimal;
import java.time.Instant;

public record PaymentResponse(
        String id,
        String orderId,
        PaymentGatewayType gateway,
        String transactionId,
        String gatewayOrderId,
        String gatewayPaymentId,
        BigDecimal amount,
        String currency,
        PaymentStatus status,
        PaymentMethod paymentMethod,
        String errorCode,
        String errorMessage,
        Instant createdAt,
        Instant updatedAt
) {
    public static PaymentResponse from(Payment payment) {
        return new PaymentResponse(
                payment.getId(),
                payment.getOrder() != null ? payment.getOrder().getId() : null,
                payment.getPaymentGateway(),
                payment.getTransactionId(),
                payment.getGatewayOrderId(),
                payment.getGatewayPaymentId(),
                payment.getAmount(),
                payment.getCurrency(),
                payment.getStatus(),
                payment.getPaymentMethod(),
                payment.getErrorCode(),
                payment.getErrorMessage(),
                payment.getCreatedAt(),
                payment.getUpdatedAt()
        );
    }
}
