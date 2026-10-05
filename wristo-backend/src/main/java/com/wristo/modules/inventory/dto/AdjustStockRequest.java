package com.wristo.modules.inventory.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public class AdjustStockRequest {

    @NotNull(message = "Seller listing ID is required")
    private UUID sellerListingId;

    @NotNull(message = "Quantity change is required")
    private Integer quantityChange;

    @NotBlank(message = "Reason for adjustment is required")
    private String reason;

    public AdjustStockRequest() {
    }

    public UUID getSellerListingId() { return sellerListingId; }
    public void setSellerListingId(UUID sellerListingId) { this.sellerListingId = sellerListingId; }

    public Integer getQuantityChange() { return quantityChange; }
    public void setQuantityChange(Integer quantityChange) { this.quantityChange = quantityChange; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}
