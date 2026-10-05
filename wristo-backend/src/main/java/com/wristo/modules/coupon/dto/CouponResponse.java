package com.wristo.modules.coupon.dto;

import com.wristo.modules.coupon.entity.Coupon;
import com.wristo.modules.coupon.entity.DiscountType;
import java.math.BigDecimal;
import java.time.Instant;

public record CouponResponse(
        String id,
        String code,
        String description,
        DiscountType discountType,
        BigDecimal discountValue,
        BigDecimal minSubtotal,
        BigDecimal maxDiscount,
        BigDecimal calculatedDiscount,
        Integer usageLimit,
        Integer timesUsed,
        Instant startsAt,
        Instant expiresAt,
        Boolean isActive,
        Boolean isValid,
        String message
) {
    public static CouponResponse from(Coupon coupon) {
        return new CouponResponse(
                coupon.getId(),
                coupon.getCode(),
                coupon.getDescription(),
                coupon.getDiscountType(),
                coupon.getDiscountValue(),
                coupon.getMinSubtotal(),
                coupon.getMaxDiscount(),
                null,
                coupon.getUsageLimit(),
                coupon.getTimesUsed(),
                coupon.getStartsAt(),
                coupon.getExpiresAt(),
                coupon.getIsActive(),
                coupon.getIsActive(),
                "Active promotional coupon"
        );
    }

    public static CouponResponse validated(Coupon coupon, BigDecimal calculatedDiscount, String message) {
        return new CouponResponse(
                coupon.getId(),
                coupon.getCode(),
                coupon.getDescription(),
                coupon.getDiscountType(),
                coupon.getDiscountValue(),
                coupon.getMinSubtotal(),
                coupon.getMaxDiscount(),
                calculatedDiscount,
                coupon.getUsageLimit(),
                coupon.getTimesUsed(),
                coupon.getStartsAt(),
                coupon.getExpiresAt(),
                coupon.getIsActive(),
                true,
                message
        );
    }
}
