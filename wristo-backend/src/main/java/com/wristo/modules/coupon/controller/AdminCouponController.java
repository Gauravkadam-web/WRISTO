package com.wristo.modules.coupon.controller;

import com.wristo.common.dto.ApiResponse;
import com.wristo.modules.coupon.dto.CouponResponse;
import com.wristo.modules.coupon.dto.CreateCouponRequest;
import com.wristo.modules.coupon.dto.UpdateCouponRequest;
import com.wristo.modules.coupon.service.CouponService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/coupons")
@Tag(name = "Admin Coupons", description = "Promotional Campaigns Governance APIs")
@SecurityRequirement(name = "bearerAuth")
@PreAuthorize("hasRole('ADMIN')")
public class AdminCouponController {

    private final CouponService couponService;

    public AdminCouponController(CouponService couponService) {
        this.couponService = couponService;
    }

    @GetMapping
    @Operation(summary = "List all coupons", description = "Retrieves all promotional coupons including inactive ones")
    public ResponseEntity<ApiResponse<List<CouponResponse>>> getAllCoupons() {
        List<CouponResponse> response = couponService.getActiveCoupons();
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping
    @Operation(summary = "Create promotional coupon", description = "Creates a new marketing campaign coupon code")
    public ResponseEntity<ApiResponse<CouponResponse>> createCoupon(@Valid @RequestBody CreateCouponRequest request) {
        CouponResponse response = couponService.createCoupon(request);
        return new ResponseEntity<>(ApiResponse.created("Coupon created successfully", response), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update promotional coupon", description = "Updates discount rules, limits or active status of a coupon")
    public ResponseEntity<ApiResponse<CouponResponse>> updateCoupon(
            @PathVariable String id,
            @Valid @RequestBody UpdateCouponRequest request
    ) {
        CouponResponse response = couponService.updateCoupon(id, request);
        return ResponseEntity.ok(ApiResponse.success("Coupon updated successfully", response));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Deactivate promotional coupon", description = "Deactivates a promotional coupon")
    public ResponseEntity<ApiResponse<Void>> deleteCoupon(@PathVariable String id) {
        couponService.deleteCoupon(id);
        return ResponseEntity.ok(ApiResponse.success("Coupon deactivated successfully", null));
    }
}
