package com.wristo.modules.cart.dto;

import jakarta.validation.constraints.NotNull;

public record CartGiftOptionRequest(
        @NotNull(message = "Gift wrapped flag is required")
        Boolean isGiftWrapped,
        String giftMessage
) {
}
