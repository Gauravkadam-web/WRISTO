package com.wristo.modules.coupon.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import java.math.BigDecimal;

public record ValidateCouponRequest(
        @NotBlank(message = "Coupon code is required")
        String code,

        @NotNull(message = "Subtotal is required")
        @PositiveOrZero(message = "Subtotal must be positive or zero")
        BigDecimal subtotal
) {
}
