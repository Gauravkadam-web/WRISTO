package com.wristo.modules.seller.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class DocumentUploadRequest {

    @NotBlank(message = "Document type is required")
    @Size(max = 64, message = "Document type must be at most 64 characters")
    private String documentType;

    @NotBlank(message = "Document URL is required")
    @Size(max = 255, message = "Document URL must be at most 255 characters")
    private String documentUrl;

    public DocumentUploadRequest() {
    }

    public DocumentUploadRequest(String documentType, String documentUrl) {
        this.documentType = documentType;
        this.documentUrl = documentUrl;
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
}
