package com.wristo.modules.seller.dto;

import com.wristo.modules.seller.entity.BrandAuthStatus;
import com.wristo.modules.seller.entity.DocumentVerificationStatus;
import com.wristo.modules.seller.entity.SellerStatus;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public class SellerResponse {

    private String id;
    private String businessName;
    private String legalEntityName;
    private String gstin;
    private String pan;
    private String bankAccountNumber;
    private String ifscCode;
    private SellerStatus status;
    private String rejectionReason;
    private BigDecimal commissionRate;
    private BigDecimal rating;
    private Boolean isActive;
    private Instant createdAt;
    private Instant updatedAt;
    private List<SellerDocumentDto> documents;
    private List<SellerBrandAuthDto> brandAuthorizations;
    private List<SellerStaffResponse> staff;

    public SellerResponse() {
    }

    public static class SellerDocumentDto {
        private UUID id;
        private String documentType;
        private String documentUrl;
        private DocumentVerificationStatus verificationStatus;
        private Instant createdAt;

        public SellerDocumentDto() {
        }

        public SellerDocumentDto(UUID id, String documentType, String documentUrl, DocumentVerificationStatus verificationStatus, Instant createdAt) {
            this.id = id;
            this.documentType = documentType;
            this.documentUrl = documentUrl;
            this.verificationStatus = verificationStatus;
            this.createdAt = createdAt;
        }

        public UUID getId() {
            return id;
        }

        public void setId(UUID id) {
            this.id = id;
        }

        public String getDocumentType() {
            return documentType;
        }

        public void setDocumentType(String documentType) {
            this.documentType = documentType;
        }

        public String getDocumentUrl() {
            return documentUrl;
        }

        public void setDocumentUrl(String documentUrl) {
            this.documentUrl = documentUrl;
        }

        public DocumentVerificationStatus getVerificationStatus() {
            return verificationStatus;
        }

        public void setVerificationStatus(DocumentVerificationStatus verificationStatus) {
            this.verificationStatus = verificationStatus;
        }

        public Instant getCreatedAt() {
            return createdAt;
        }

        public void setCreatedAt(Instant createdAt) {
            this.createdAt = createdAt;
        }
    }

    public static class SellerBrandAuthDto {
        private UUID id;
        private String brandId;
        private String brandName;
        private String authorizationDocUrl;
        private BrandAuthStatus status;
        private Instant createdAt;

        public SellerBrandAuthDto() {
        }

        public SellerBrandAuthDto(UUID id, String brandId, String brandName, String authorizationDocUrl, BrandAuthStatus status, Instant createdAt) {
            this.id = id;
            this.brandId = brandId;
            this.brandName = brandName;
            this.authorizationDocUrl = authorizationDocUrl;
            this.status = status;
            this.createdAt = createdAt;
        }

        public UUID getId() {
            return id;
        }

        public void setId(UUID id) {
            this.id = id;
        }

        public String getBrandId() {
            return brandId;
        }

        public void setBrandId(String brandId) {
            this.brandId = brandId;
        }

        public String getBrandName() {
            return brandName;
        }

        public void setBrandName(String brandName) {
            this.brandName = brandName;
        }

        public String getAuthorizationDocUrl() {
            return authorizationDocUrl;
        }

        public void setAuthorizationDocUrl(String authorizationDocUrl) {
            this.authorizationDocUrl = authorizationDocUrl;
        }

        public BrandAuthStatus getStatus() {
            return status;
        }

        public void setStatus(BrandAuthStatus status) {
            this.status = status;
        }

        public Instant getCreatedAt() {
            return createdAt;
        }

        public void setCreatedAt(Instant createdAt) {
            this.createdAt = createdAt;
        }
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

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }

    public List<SellerDocumentDto> getDocuments() {
        return documents;
    }

    public void setDocuments(List<SellerDocumentDto> documents) {
        this.documents = documents;
    }

    public List<SellerBrandAuthDto> getBrandAuthorizations() {
        return brandAuthorizations;
    }

    public void setBrandAuthorizations(List<SellerBrandAuthDto> brandAuthorizations) {
        this.brandAuthorizations = brandAuthorizations;
    }

    public List<SellerStaffResponse> getStaff() {
        return staff;
    }

    public void setStaff(List<SellerStaffResponse> staff) {
        this.staff = staff;
    }
}
