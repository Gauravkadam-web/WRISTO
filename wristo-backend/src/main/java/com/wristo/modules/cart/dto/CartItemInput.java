package com.wristo.modules.cart.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CartItemInput(
        @NotBlank(message = "Watch ID is required")
        @JsonProperty("watchId")
        @JsonAlias({"productId", "product_id", "watch_id", "id"})
        String watchId,

        @NotNull(message = "Quantity is required")
        @Min(value = 1, message = "Quantity must be at least 1")
        @JsonProperty("quantity")
        Integer quantity
) {
}
