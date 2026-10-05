package com.wristo.modules.seller.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class UpdateSellerListingRequest {

    @NotNull(message = "Price is required")
    @DecimalMin(value = "1.00", message = "Price must be greater than zero")
    private BigDecimal price;

    @NotNull(message = "Original price is required")
    @DecimalMin(value = "1.00", message = "Original price must be greater than zero")
    private BigDecimal originalPrice;

    private String condition;
    private String warrantyType;
    private String warrantyPeriod;
    private String authenticityGuarantee;

    public UpdateSellerListingRequest() {
    }

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
}
