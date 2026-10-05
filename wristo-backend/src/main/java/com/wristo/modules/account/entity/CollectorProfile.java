package com.wristo.modules.account.entity;

import com.wristo.common.entity.BaseAuditEntity;
import com.wristo.modules.auth.entity.User;
import jakarta.persistence.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.springframework.data.domain.Persistable;

import java.util.UUID;

@Entity
@Table(name = "collector_profiles")
public class CollectorProfile extends BaseAuditEntity implements Persistable<UUID> {

    @Id
    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @MapsId
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User user;

    @Transient
    private boolean isNew = true;

    @Enumerated(EnumType.STRING)
    @Column(name = "salutation", length = 32, nullable = false)
    private Salutation salutation = Salutation.COLLECTOR;

    @Enumerated(EnumType.STRING)
    @Column(name = "vip_tier", length = 64, nullable = false)
    private VipTier vipTier = VipTier.GRAND_COMPLICATION_PATRON;

    @Column(name = "wrist_size_mm", nullable = false)
    private Integer wristSizeMm = 175;

    @Column(name = "currency", length = 3, nullable = false)
    private String currency = "INR";

    @Column(name = "order_telemetry", nullable = false)
    private Boolean orderTelemetry = true;

    @Column(name = "rare_allocations", nullable = false)
    private Boolean rareAllocations = true;

    @Column(name = "concierge_briefings", nullable = false)
    private Boolean conciergeBriefings = false;

    public CollectorProfile() {
    }

    public CollectorProfile(User user) {
        this.user = user;
        this.userId = user != null ? user.getId() : null;
        this.isNew = true;
    }

    @Override
    public UUID getId() {
        return userId;
    }

    @Override
    public boolean isNew() {
        return isNew || getCreatedAt() == null;
    }

    @PostLoad
    @PostPersist
    void markNotNew() {
        this.isNew = false;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
        if (user != null) {
            this.userId = user.getId();
        }
    }

    public Salutation getSalutation() {
        return salutation;
    }

    public void setSalutation(Salutation salutation) {
        this.salutation = salutation;
    }

    public VipTier getVipTier() {
        return vipTier;
    }

    public void setVipTier(VipTier vipTier) {
        this.vipTier = vipTier;
    }

    public Integer getWristSizeMm() {
        return wristSizeMm;
    }

    public void setWristSizeMm(Integer wristSizeMm) {
        this.wristSizeMm = wristSizeMm;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public Boolean getOrderTelemetry() {
        return orderTelemetry;
    }

    public void setOrderTelemetry(Boolean orderTelemetry) {
        this.orderTelemetry = orderTelemetry;
    }

    public Boolean getRareAllocations() {
        return rareAllocations;
    }

    public void setRareAllocations(Boolean rareAllocations) {
        this.rareAllocations = rareAllocations;
    }

    public Boolean getConciergeBriefings() {
        return conciergeBriefings;
    }

    public void setConciergeBriefings(Boolean conciergeBriefings) {
        this.conciergeBriefings = conciergeBriefings;
    }
}
