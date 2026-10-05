package com.wristo.modules.order.dto;

import com.wristo.modules.order.entity.OrderStatus;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;

public record UpdateOrderStatusRequest(
        @NotNull(message = "Target order status is required")
        OrderStatus toStatus,

        String comment,
        String trackingNumber,
        String courierPartner,
        Instant estimatedDeliveryAt
) {
}
