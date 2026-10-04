package com.wristo.modules.auth.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.wristo.common.entity.BaseAuditEntity;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "users")
public class User extends BaseAuditEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "email", length = 128, nullable = false, unique = true)
    private String email;

    @JsonIgnore
    @Column(name = "password_hash", length = 255, nullable = false)
    private String passwordHash;

    @Column(name = "full_name", length = 128, nullable = false)
    private String fullName;

    @Column(name = "phone", length = 32)
    private String phone;

    @Column(name = "avatar_url", length = 255)
    private String avatarUrl;

    @Column(name = "role", length = 32, nullable = false)
    private String role = "CUSTOMER"; // CUSTOMER, SELLER, SELLER_STAFF, ADMIN, SUPER_ADMIN

    @Column(name = "is_verified", nullable = false)
    private Boolean isVerified = false;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<UserAddress> addresses = new ArrayList<>();

    public User() {
    }

    public User(String email, String passwordHash, String fullName, String phone, String role) {
        this.email = email;
        this.passwordHash = passwordHash;
        this.fullName = fullName;
        this.phone = phone;
        this.role = role != null ? role : "CUSTOMER";
        this.isVerified = false;
        this.isActive = true;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Boolean getIsVerified() {
        return isVerified;
    }

    public void setIsVerified(Boolean verified) {
        isVerified = verified;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean active) {
        isActive = active;
    }

    public List<UserAddress> getAddresses() {
        return addresses;
    }

    public void setAddresses(List<UserAddress> addresses) {
        this.addresses = addresses;
    }
}
