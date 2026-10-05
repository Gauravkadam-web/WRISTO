package com.wristo.modules.cart.dto;

import jakarta.validation.constraints.NotBlank;

public record CartDeliveryOptionRequest(
        @NotBlank(message = "Delivery tier is required")
        String deliveryTier
) {
}
