package com.wristo.modules.checkout.dto;

import com.wristo.modules.cart.dto.CartItemInput;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public record InitiateCheckoutRequest(
        @NotEmpty(message = "Checkout items cannot be empty")
        @Valid
        List<CartItemInput> items,

        String couponCode,
        String deliveryTier,
        Boolean isGiftWrapped,
        String giftMessage
) {
}
