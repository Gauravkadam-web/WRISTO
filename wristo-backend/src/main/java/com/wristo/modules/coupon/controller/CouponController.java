package com.wristo.modules.coupon.controller;

import com.wristo.common.dto.ApiResponse;
import com.wristo.modules.coupon.dto.CouponResponse;
import com.wristo.modules.coupon.dto.ValidateCouponRequest;
import com.wristo.modules.coupon.service.CouponService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/coupons")
@Tag(name = "Coupons", description = "Public Promotional & Discount Vouchers APIs")
public class CouponController {

    private final CouponService couponService;

    public CouponController(CouponService couponService) {
        this.couponService = couponService;
    }

    @PostMapping("/validate")
    @Operation(summary = "Validate promotional coupon", description = "Validates promo code against order subtotal and computes discount")
    public ResponseEntity<ApiResponse<CouponResponse>> validateCoupon(@Valid @RequestBody ValidateCouponRequest request) {
        CouponResponse response = couponService.validateCoupon(request);
        return ResponseEntity.ok(ApiResponse.success(response.message(), response));
    }

    @GetMapping("/active")
    @Operation(summary = "Get active promotional vouchers", description = "Retrieves all currently active marketing vouchers")
    public ResponseEntity<ApiResponse<List<CouponResponse>>> getActiveCoupons() {
        List<CouponResponse> response = couponService.getActiveCoupons();
        return ResponseEntity.ok(ApiResponse.success("Active promotional vouchers retrieved", response));
    }
}
