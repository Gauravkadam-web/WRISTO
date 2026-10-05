package com.wristo.modules.checkout.dto;

import com.wristo.modules.cart.dto.CartItemInput;
import com.wristo.modules.order.entity.PaymentMethod;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record CompleteCheckoutRequest(
        String checkoutSessionId,

        // Optional direct items fallback if checkoutSessionId was not used
        @Valid
        List<CartItemInput> items,

        @NotNull(message = "Customer delivery address is required")
        @Valid
        CustomerAddressDto address,

        @NotNull(message = "Payment method is required")
        PaymentMethod paymentMethod,

        String deliveryTier,
        Boolean isGiftWrapped,
        String giftMessage,
        String couponCode,

        // Payment gateway transaction verification payload (optional for COD / simulated sandbox)
        String paymentTransactionId,
        String gatewayOrderId,
        String gatewayPaymentId,
        String gatewaySignature
) {
}
