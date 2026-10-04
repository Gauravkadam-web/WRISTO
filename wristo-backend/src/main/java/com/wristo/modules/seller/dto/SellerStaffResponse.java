package com.wristo.modules.seller.dto;

import com.wristo.modules.seller.entity.SellerStaffRole;
import java.time.Instant;
import java.util.UUID;

public class SellerStaffResponse {

    private UUID id;
    private UUID userId;
    private String userEmail;
    private String fullName;
    private SellerStaffRole role;
    private Boolean isPrimary;
    private Instant createdAt;

    public SellerStaffResponse() {
    }

    public SellerStaffResponse(UUID id, UUID userId, String userEmail, String fullName, SellerStaffRole role, Boolean isPrimary, Instant createdAt) {
        this.id = id;
        this.userId = userId;
        this.userEmail = userEmail;
        this.fullName = fullName;
        this.role = role;
        this.isPrimary = isPrimary;
        this.createdAt = createdAt;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public SellerStaffRole getRole() {
        return role;
    }

    public void setRole(SellerStaffRole role) {
        this.role = role;
    }

    public Boolean getIsPrimary() {
        return isPrimary;
    }

    public void setIsPrimary(Boolean primary) {
        isPrimary = primary;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
