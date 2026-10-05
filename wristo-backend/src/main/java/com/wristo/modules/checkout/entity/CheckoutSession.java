package com.wristo.modules.checkout.entity;

import com.wristo.common.entity.BaseAuditEntity;
import com.wristo.modules.auth.entity.User;
import jakarta.persistence.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import java.time.Instant;

@Entity
@Table(name = "checkout_sessions")
public class CheckoutSession extends BaseAuditEntity {

    @Id
    @Column(name = "id", length = 36, nullable = false)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @OnDelete(action = OnDeleteAction.SET_NULL)
    private User user;

    @Column(name = "session_id", length = 128)
    private String sessionId;

    @Column(name = "reservation_ids", columnDefinition = "TEXT")
    private String reservationIds;

    @Column(name = "coupon_code", length = 32)
    private String couponCode;

    @Column(name = "delivery_tier", length = 32, nullable = false)
    private String deliveryTier = "insured_express";

    @Column(name = "is_gift_wrapped", nullable = false)
    private Boolean isGiftWrapped = false;

    @Column(name = "gift_message", length = 500)
    private String giftMessage;

    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    @Column(name = "is_completed", nullable = false)
    private Boolean isCompleted = false;

    public CheckoutSession() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public String getReservationIds() {
        return reservationIds;
    }

    public void setReservationIds(String reservationIds) {
        this.reservationIds = reservationIds;
    }

    public String getCouponCode() {
        return couponCode;
    }

    public void setCouponCode(String couponCode) {
        this.couponCode = couponCode;
    }

    public String getDeliveryTier() {
        return deliveryTier;
    }

    public void setDeliveryTier(String deliveryTier) {
        this.deliveryTier = deliveryTier;
    }

    public Boolean getIsGiftWrapped() {
        return isGiftWrapped;
    }

    public void setIsGiftWrapped(Boolean giftWrapped) {
        isGiftWrapped = giftWrapped;
    }

    public String getGiftMessage() {
        return giftMessage;
    }

    public void setGiftMessage(String giftMessage) {
        this.giftMessage = giftMessage;
    }

    public Instant getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(Instant expiresAt) {
        this.expiresAt = expiresAt;
    }

    public Boolean getIsCompleted() {
        return isCompleted;
    }

    public void setIsCompleted(Boolean completed) {
        isCompleted = completed;
    }

    public boolean isExpired() {
        return Instant.now().isAfter(expiresAt);
    }
}
