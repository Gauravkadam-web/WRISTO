package com.wristo.modules.seller.dto;

import com.wristo.modules.seller.entity.SellerStaffRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class SellerStaffRequest {

    @NotBlank(message = "Staff email address is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotNull(message = "Staff role is required")
    private SellerStaffRole role;

    private Boolean isPrimary = false;

    public SellerStaffRequest() {
    }

    public SellerStaffRequest(String email, SellerStaffRole role, Boolean isPrimary) {
        this.email = email;
        this.role = role;
        this.isPrimary = isPrimary != null ? isPrimary : false;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
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
}
