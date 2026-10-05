package com.wristo.modules.coupon.entity;

import com.wristo.common.entity.BaseAuditEntity;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "coupons")
public class Coupon extends BaseAuditEntity {

    @Id
    @Column(name = "id", length = 36, nullable = false)
    private String id;

    @Column(name = "code", length = 32, nullable = false, unique = true)
    private String code;

    @Column(name = "description", length = 255, nullable = false)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "discount_type", length = 16, nullable = false)
    private DiscountType discountType;

    @Column(name = "discount_value", precision = 10, scale = 2, nullable = false)
    private BigDecimal discountValue;

    @Column(name = "min_subtotal", precision = 12, scale = 2, nullable = false)
    private BigDecimal minSubtotal = BigDecimal.ZERO;

    @Column(name = "max_discount", precision = 12, scale = 2)
    private BigDecimal maxDiscount;

    @Column(name = "usage_limit")
    private Integer usageLimit;

    @Column(name = "times_used", nullable = false)
    private Integer timesUsed = 0;

    @Column(name = "starts_at")
    private Instant startsAt;

    @Column(name = "expires_at")
    private Instant expiresAt;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    public Coupon() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public DiscountType getDiscountType() {
        return discountType;
    }

    public void setDiscountType(DiscountType discountType) {
        this.discountType = discountType;
    }

    public BigDecimal getDiscountValue() {
        return discountValue;
    }

    public void setDiscountValue(BigDecimal discountValue) {
        this.discountValue = discountValue;
    }

    public BigDecimal getMinSubtotal() {
        return minSubtotal;
    }

    public void setMinSubtotal(BigDecimal minSubtotal) {
        this.minSubtotal = minSubtotal;
    }

    public BigDecimal getMaxDiscount() {
        return maxDiscount;
    }

    public void setMaxDiscount(BigDecimal maxDiscount) {
        this.maxDiscount = maxDiscount;
    }

    public Integer getUsageLimit() {
        return usageLimit;
    }

    public void setUsageLimit(Integer usageLimit) {
        this.usageLimit = usageLimit;
    }

    public Integer getTimesUsed() {
        return timesUsed;
    }

    public void setTimesUsed(Integer timesUsed) {
        this.timesUsed = timesUsed;
    }

    public Instant getStartsAt() {
        return startsAt;
    }

    public void setStartsAt(Instant startsAt) {
        this.startsAt = startsAt;
    }

    public Instant getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(Instant expiresAt) {
        this.expiresAt = expiresAt;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean active) {
        isActive = active;
    }
}
