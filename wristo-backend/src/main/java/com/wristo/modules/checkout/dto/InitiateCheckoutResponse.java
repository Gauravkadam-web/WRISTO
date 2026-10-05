package com.wristo.modules.checkout.dto;

import com.wristo.modules.cart.dto.OrderTotalsResponse;
import java.time.Instant;

public record InitiateCheckoutResponse(
        String checkoutSessionId,
        Instant expiresAt,
        OrderTotalsResponse totals,
        String message
) {
}
