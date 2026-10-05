package com.wristo.modules.cart.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public record CalculateTotalsRequest(
        @NotEmpty(message = "Items list cannot be empty")
        @Valid
        List<CartItemInput> items,

        String couponCode,
        String deliveryTier,
        Boolean isGiftWrapped
) {
}
