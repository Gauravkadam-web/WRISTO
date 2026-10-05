package com.wristo.modules.coupon.dto;

import com.wristo.modules.coupon.entity.DiscountType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import java.math.BigDecimal;
import java.time.Instant;

public record CreateCouponRequest(
        @NotBlank(message = "Coupon code is required")
        String code,

        @NotBlank(message = "Coupon description is required")
        String description,

        @NotNull(message = "Discount type is required")
        DiscountType discountType,

        @NotNull(message = "Discount value is required")
        @Positive(message = "Discount value must be positive")
        BigDecimal discountValue,

        @PositiveOrZero(message = "Minimum subtotal must be positive or zero")
        BigDecimal minSubtotal,

        @Positive(message = "Maximum discount must be positive")
        BigDecimal maxDiscount,

        @Positive(message = "Usage limit must be positive")
        Integer usageLimit,

        Instant startsAt,
        Instant expiresAt
) {
}
