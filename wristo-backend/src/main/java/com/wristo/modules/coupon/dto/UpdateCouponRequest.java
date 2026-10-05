package com.wristo.modules.coupon.dto;

import com.wristo.modules.coupon.entity.DiscountType;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import java.math.BigDecimal;
import java.time.Instant;

public record UpdateCouponRequest(
        String description,
        DiscountType discountType,
        @Positive(message = "Discount value must be positive")
        BigDecimal discountValue,
        @PositiveOrZero(message = "Minimum subtotal must be positive or zero")
        BigDecimal minSubtotal,
        @Positive(message = "Maximum discount must be positive")
        BigDecimal maxDiscount,
        @Positive(message = "Usage limit must be positive")
        Integer usageLimit,
        Instant startsAt,
        Instant expiresAt,
        Boolean isActive
) {
}
