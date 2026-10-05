package com.wristo.modules.cart.dto;

import com.wristo.modules.coupon.dto.CouponResponse;
import java.math.BigDecimal;

public record OrderTotalsResponse(
        BigDecimal subtotal,
        BigDecimal discount,
        BigDecimal giftWrapFee,
        BigDecimal shippingFee,
        BigDecimal taxAmount,
        BigDecimal totalAmount,
        CouponResponse appliedCoupon,
        Boolean giftPouchUnlocked,
        Boolean freeShippingEligible,
        String deliveryTier,
        String deliveryDescription,
        String estimatedDelivery
) {
}
