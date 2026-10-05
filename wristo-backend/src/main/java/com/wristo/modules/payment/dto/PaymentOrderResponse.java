package com.wristo.modules.payment.dto;

import com.wristo.modules.payment.entity.PaymentGatewayType;
import java.math.BigDecimal;

public record PaymentOrderResponse(
        String gatewayOrderId,
        PaymentGatewayType gateway,
        BigDecimal amount,
        String currency,
        String keyId,
        String orderId,
        String clientSecret,
        String status
) {
}
