package com.wristo.modules.cart.dto;

import java.util.List;

public record CartResponse(
        String id,
        List<CartItemResponse> items,
        Integer totalItems,
        Boolean isGiftWrapped,
        String giftMessage,
        String deliveryTier,
        OrderTotalsResponse totals
) {
}
