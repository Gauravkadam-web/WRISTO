package com.wristo.modules.seller.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.util.List;

public class SellerOnboardRequest {

    @NotBlank(message = "Business boutique name is required")
    @Size(min = 2, max = 128, message = "Business name must be between 2 and 128 characters")
    private String businessName;

    @NotBlank(message = "Legal entity name is required")
    @Size(min = 2, max = 128, message = "Legal entity name must be between 2 and 128 characters")
    private String legalEntityName;

    @NotBlank(message = "GSTIN is required")
    @Pattern(regexp = "^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$", message = "Invalid GSTIN format")
    private String gstin;

    @NotBlank(message = "PAN is required")
    @Pattern(regexp = "^[A-Z]{5}[0-9]{4}[A-Z]{1}$", message = "Invalid PAN format")
    private String pan;

    @NotBlank(message = "Bank account number is required")
    @Size(min = 8, max = 64, message = "Bank account number must be between 8 and 64 characters")
    private String bankAccountNumber;

    @NotBlank(message = "IFSC code is required")
    @Pattern(regexp = "^[A-Z]{4}0[A-Z0-9]{6}$", message = "Invalid IFSC code format")
    private String ifscCode;

    private List<DocumentUploadRequest> documents;

    public SellerOnboardRequest() {
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

    public List<DocumentUploadRequest> getDocuments() {
        return documents;
    }

    public void setDocuments(List<DocumentUploadRequest> documents) {
        this.documents = documents;
    }
}
