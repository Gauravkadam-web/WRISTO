package com.wristo.modules.seller.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class CreateSellerListingRequest {

    @NotBlank(message = "Watch canonical ID is required")
    private String watchId;

    @NotBlank(message = "Seller SKU is required")
    private String sellerSku;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "1.00", message = "Price must be greater than zero")
    private BigDecimal price;

    @NotNull(message = "Original price is required")
    @DecimalMin(value = "1.00", message = "Original price must be greater than zero")
    private BigDecimal originalPrice;

    private String condition = "NEW";
    private String warrantyType = "BRAND_WARRANTY";
    private String warrantyPeriod = "2-Year International Warranty";
    private String authenticityGuarantee = "100% Verified Swiss & Global Authenticity Guaranteed by WRISTO";

    @Min(value = 0, message = "Initial stock cannot be negative")
    private int initialStock = 10;

    public CreateSellerListingRequest() {
    }

    public String getWatchId() { return watchId; }
    public void setWatchId(String watchId) { this.watchId = watchId; }

    public String getSellerSku() { return sellerSku; }
    public void setSellerSku(String sellerSku) { this.sellerSku = sellerSku; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public BigDecimal getOriginalPrice() { return originalPrice; }
    public void setOriginalPrice(BigDecimal originalPrice) { this.originalPrice = originalPrice; }

    public String getCondition() { return condition; }
    public void setCondition(String condition) { this.condition = condition; }

    public String getWarrantyType() { return warrantyType; }
    public void setWarrantyType(String warrantyType) { this.warrantyType = warrantyType; }

    public String getWarrantyPeriod() { return warrantyPeriod; }
    public void setWarrantyPeriod(String warrantyPeriod) { this.warrantyPeriod = warrantyPeriod; }

    public String getAuthenticityGuarantee() { return authenticityGuarantee; }
    public void setAuthenticityGuarantee(String authenticityGuarantee) { this.authenticityGuarantee = authenticityGuarantee; }

    public int getInitialStock() { return initialStock; }
    public void setInitialStock(int initialStock) { this.initialStock = initialStock; }
}
