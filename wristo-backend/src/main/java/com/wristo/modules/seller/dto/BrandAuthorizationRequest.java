package com.wristo.modules.seller.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class BrandAuthorizationRequest {

    @NotBlank(message = "Brand ID is required")
    @Size(max = 32, message = "Brand ID must be at most 32 characters")
    private String brandId;

    @Size(max = 255, message = "Authorization document URL must be at most 255 characters")
    private String authorizationDocUrl;

    public BrandAuthorizationRequest() {
    }

    public BrandAuthorizationRequest(String brandId, String authorizationDocUrl) {
        this.brandId = brandId;
        this.authorizationDocUrl = authorizationDocUrl;
    }

    public String getBrandId() {
        return brandId;
    }

    public void setBrandId(String brandId) {
        this.brandId = brandId;
    }

    public String getAuthorizationDocUrl() {
        return authorizationDocUrl;
    }

    public void setAuthorizationDocUrl(String authorizationDocUrl) {
        this.authorizationDocUrl = authorizationDocUrl;
    }
}
