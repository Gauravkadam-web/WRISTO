package com.wristo.modules.seller.entity;

import com.wristo.common.entity.BaseAuditEntity;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "sellers")
public class Seller extends BaseAuditEntity {

    @Id
    @Column(name = "id", length = 32, nullable = false)
    private String id;

    @Column(name = "business_name", length = 128, nullable = false)
    private String businessName;

    @Column(name = "legal_entity_name", length = 128, nullable = false)
    private String legalEntityName;

    @Column(name = "gstin", length = 32, nullable = false, unique = true)
    private String gstin;

    @Column(name = "pan", length = 32, nullable = false)
    private String pan;

    @Column(name = "bank_account_number", length = 64, nullable = false)
    private String bankAccountNumber;

    @Column(name = "ifsc_code", length = 32, nullable = false)
    private String ifscCode;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 32, nullable = false)
    private SellerStatus status = SellerStatus.PENDING;

    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;

    @Column(name = "commission_rate", precision = 5, scale = 2, nullable = false)
    private BigDecimal commissionRate = new BigDecimal("12.50");

    @Column(name = "rating", precision = 3, scale = 2, nullable = false)
    private BigDecimal rating = new BigDecimal("5.00");

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @OneToMany(mappedBy = "seller", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<SellerDocument> documents = new ArrayList<>();

    @OneToMany(mappedBy = "seller", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<SellerBrandAuthorization> brandAuthorizations = new ArrayList<>();

    @OneToMany(mappedBy = "seller", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<SellerUser> sellerUsers = new ArrayList<>();

    public Seller() {
    }

    public Seller(String id, String businessName, String legalEntityName, String gstin, String pan, String bankAccountNumber, String ifscCode) {
        this.id = id;
        this.businessName = businessName;
        this.legalEntityName = legalEntityName;
        this.gstin = gstin;
        this.pan = pan;
        this.bankAccountNumber = bankAccountNumber;
        this.ifscCode = ifscCode;
        this.status = SellerStatus.PENDING;
        this.commissionRate = new BigDecimal("12.50");
        this.rating = new BigDecimal("5.00");
        this.isActive = true;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getBusinessName() {
        return businessName;
    }

    public void setBusinessName(String businessName) {
        this.businessName = businessName;
    }

    public String getLegalEntityName() {
        return legalEntityName;
    }

    public void setLegalEntityName(String legalEntityName) {
        this.legalEntityName = legalEntityName;
    }

    public String getGstin() {
        return gstin;
    }

    public void setGstin(String gstin) {
        this.gstin = gstin;
    }

    public String getPan() {
        return pan;
    }

    public void setPan(String pan) {
        this.pan = pan;
    }

    public String getBankAccountNumber() {
        return bankAccountNumber;
    }

    public void setBankAccountNumber(String bankAccountNumber) {
        this.bankAccountNumber = bankAccountNumber;
    }

    public String getIfscCode() {
        return ifscCode;
    }

    public void setIfscCode(String ifscCode) {
        this.ifscCode = ifscCode;
    }

    public SellerStatus getStatus() {
        return status;
    }

    public void setStatus(SellerStatus status) {
        this.status = status;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }

    public BigDecimal getCommissionRate() {
        return commissionRate;
    }

    public void setCommissionRate(BigDecimal commissionRate) {
        this.commissionRate = commissionRate;
    }

    public BigDecimal getRating() {
        return rating;
    }

    public void setRating(BigDecimal rating) {
        this.rating = rating;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean active) {
        isActive = active;
    }

    public List<SellerDocument> getDocuments() {
        return documents;
    }

    public void setDocuments(List<SellerDocument> documents) {
        this.documents = documents;
    }

    public List<SellerBrandAuthorization> getBrandAuthorizations() {
        return brandAuthorizations;
    }

    public void setBrandAuthorizations(List<SellerBrandAuthorization> brandAuthorizations) {
        this.brandAuthorizations = brandAuthorizations;
    }

    public List<SellerUser> getSellerUsers() {
        return sellerUsers;
    }

    public void setSellerUsers(List<SellerUser> sellerUsers) {
        this.sellerUsers = sellerUsers;
    }
}
