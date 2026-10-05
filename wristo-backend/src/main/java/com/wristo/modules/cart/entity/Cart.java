package com.wristo.modules.cart.entity;

import com.wristo.common.entity.BaseAuditEntity;
import com.wristo.modules.auth.entity.User;
import com.wristo.modules.coupon.entity.Coupon;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "carts")
public class Cart extends BaseAuditEntity {

    @Id
    @Column(name = "id", length = 36, nullable = false)
    private String id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", unique = true)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User user;

    @Column(name = "session_id", length = 64, unique = true)
    private String sessionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "coupon_id")
    private Coupon appliedCoupon;

    @Column(name = "is_gift_wrapped", nullable = false)
    private Boolean isGiftWrapped = false;

    @Column(name = "gift_message", length = 500)
    private String giftMessage;

    @Column(name = "delivery_tier", length = 32, nullable = false)
    private String deliveryTier = "insured_express";

    public Cart() {
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

    public Coupon getAppliedCoupon() {
        return appliedCoupon;
    }

    public void setAppliedCoupon(Coupon appliedCoupon) {
        this.appliedCoupon = appliedCoupon;
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

    public String getDeliveryTier() {
        return deliveryTier;
    }

    public void setDeliveryTier(String deliveryTier) {
        this.deliveryTier = deliveryTier;
    }
}
