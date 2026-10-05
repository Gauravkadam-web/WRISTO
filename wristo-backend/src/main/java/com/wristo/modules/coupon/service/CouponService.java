package com.wristo.modules.coupon.service;

import com.wristo.exception.BusinessException;
import com.wristo.exception.ErrorCode;
import com.wristo.modules.coupon.dto.CouponResponse;
import com.wristo.modules.coupon.dto.CreateCouponRequest;
import com.wristo.modules.coupon.dto.UpdateCouponRequest;
import com.wristo.modules.coupon.dto.ValidateCouponRequest;
import com.wristo.modules.coupon.entity.Coupon;
import com.wristo.modules.coupon.entity.DiscountType;
import com.wristo.modules.coupon.repository.CouponRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class CouponService {

    private static final Logger log = LoggerFactory.getLogger(CouponService.class);

    private final CouponRepository couponRepository;

    public CouponService(CouponRepository couponRepository) {
        this.couponRepository = couponRepository;
    }

    @Transactional(readOnly = true)
    public CouponResponse validateCoupon(ValidateCouponRequest request) {
        if (request.code() == null || request.code().isBlank()) {
            throw new BusinessException(ErrorCode.COUPON_NOT_FOUND, "Please enter a valid coupon code");
        }

        String normalizedCode = request.code().trim().toUpperCase();
        Coupon coupon = couponRepository.findByCodeIgnoreCaseAndIsActiveTrue(normalizedCode)
                .orElseThrow(() -> new BusinessException(ErrorCode.COUPON_NOT_FOUND,
                        "\"" + normalizedCode + "\" is not a valid horological promo code."));

        Instant now = Instant.now();
        if (coupon.getStartsAt() != null && now.isBefore(coupon.getStartsAt())) {
            throw new BusinessException(ErrorCode.COUPON_NOT_STARTED, "This promotional voucher is not yet active.");
        }

        if (coupon.getExpiresAt() != null && now.isAfter(coupon.getExpiresAt())) {
            throw new BusinessException(ErrorCode.COUPON_EXPIRED, "This promotional voucher has expired.");
        }

        if (coupon.getUsageLimit() != null && coupon.getTimesUsed() >= coupon.getUsageLimit()) {
            throw new BusinessException(ErrorCode.COUPON_USAGE_LIMIT_REACHED, "This promotional voucher usage limit has been reached.");
        }

        BigDecimal subtotal = request.subtotal() != null ? request.subtotal() : BigDecimal.ZERO;
        if (coupon.getMinSubtotal() != null && subtotal.compareTo(coupon.getMinSubtotal()) < 0) {
            throw new BusinessException(ErrorCode.COUPON_MIN_SUBTOTAL_NOT_MET,
                    String.format("Code \"%s\" requires a minimum order value of ₹%,.0f.",
                            coupon.getCode(), coupon.getMinSubtotal()));
        }

        BigDecimal calculatedDiscount = calculateDiscount(coupon, subtotal);
        String message = String.format("Privilege code %s applied: saved ₹%,.0f on your acquisition.",
                coupon.getCode(), calculatedDiscount);

        return CouponResponse.validated(coupon, calculatedDiscount, message);
    }

    public BigDecimal calculateDiscount(Coupon coupon, BigDecimal subtotal) {
        if (coupon == null || subtotal == null || subtotal.compareTo(BigDecimal.ZERO) <= 0) {
            return BigDecimal.ZERO;
        }

        BigDecimal discount;
        if (coupon.getDiscountType() == DiscountType.PERCENTAGE) {
            discount = subtotal.multiply(coupon.getDiscountValue())
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
            if (coupon.getMaxDiscount() != null && discount.compareTo(coupon.getMaxDiscount()) > 0) {
                discount = coupon.getMaxDiscount();
            }
        } else {
            discount = coupon.getDiscountValue().min(subtotal);
        }

        return discount.setScale(2, RoundingMode.HALF_UP);
    }

    @Transactional(readOnly = true)
    public List<CouponResponse> getActiveCoupons() {
        return couponRepository.findByIsActiveTrueOrderByCreatedAtDesc().stream()
                .map(CouponResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public Coupon getCouponEntity(String code) {
        if (code == null || code.isBlank()) {
            return null;
        }
        return couponRepository.findByCodeIgnoreCaseAndIsActiveTrue(code.trim().toUpperCase())
                .orElse(null);
    }

    @Transactional
    public void incrementUsage(Coupon coupon) {
        if (coupon != null) {
            coupon.setTimesUsed(coupon.getTimesUsed() + 1);
            couponRepository.save(coupon);
        }
    }

    @Transactional
    public CouponResponse createCoupon(CreateCouponRequest request) {
        String code = request.code().trim().toUpperCase();
        if (couponRepository.existsByCodeIgnoreCase(code)) {
            throw new BusinessException(ErrorCode.COUPON_ALREADY_EXISTS, "Coupon with code " + code + " already exists.");
        }

        Coupon coupon = new Coupon();
        coupon.setId("cpn-" + UUID.randomUUID().toString().substring(0, 8));
        coupon.setCode(code);
        coupon.setDescription(request.description());
        coupon.setDiscountType(request.discountType());
        coupon.setDiscountValue(request.discountValue());
        coupon.setMinSubtotal(request.minSubtotal() != null ? request.minSubtotal() : BigDecimal.ZERO);
        coupon.setMaxDiscount(request.maxDiscount());
        coupon.setUsageLimit(request.usageLimit());
        coupon.setTimesUsed(0);
        coupon.setStartsAt(request.startsAt() != null ? request.startsAt() : Instant.now());
        coupon.setExpiresAt(request.expiresAt());
        coupon.setIsActive(true);

        Coupon saved = couponRepository.save(coupon);
        log.info("Created promotional coupon code: {}", saved.getCode());
        return CouponResponse.from(saved);
    }

    @Transactional
    public CouponResponse updateCoupon(String idOrCode, UpdateCouponRequest request) {
        Coupon coupon = couponRepository.findById(idOrCode)
                .or(() -> couponRepository.findByCodeIgnoreCase(idOrCode))
                .orElseThrow(() -> new BusinessException(ErrorCode.COUPON_NOT_FOUND, "Coupon not found"));

        if (request.description() != null) coupon.setDescription(request.description());
        if (request.discountType() != null) coupon.setDiscountType(request.discountType());
        if (request.discountValue() != null) coupon.setDiscountValue(request.discountValue());
        if (request.minSubtotal() != null) coupon.setMinSubtotal(request.minSubtotal());
        if (request.maxDiscount() != null) coupon.setMaxDiscount(request.maxDiscount());
        if (request.usageLimit() != null) coupon.setUsageLimit(request.usageLimit());
        if (request.startsAt() != null) coupon.setStartsAt(request.startsAt());
        if (request.expiresAt() != null) coupon.setExpiresAt(request.expiresAt());
        if (request.isActive() != null) coupon.setIsActive(request.isActive());

        Coupon updated = couponRepository.save(coupon);
        log.info("Updated promotional coupon ID: {}", updated.getId());
        return CouponResponse.from(updated);
    }

    @Transactional
    public void deleteCoupon(String idOrCode) {
        Coupon coupon = couponRepository.findById(idOrCode)
                .or(() -> couponRepository.findByCodeIgnoreCase(idOrCode))
                .orElseThrow(() -> new BusinessException(ErrorCode.COUPON_NOT_FOUND, "Coupon not found"));
        coupon.setIsActive(false);
        couponRepository.save(coupon);
        log.info("Deactivated promotional coupon ID: {}", idOrCode);
    }
}
