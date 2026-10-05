package com.wristo.modules.inventory.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public class ReserveStockRequest {

    @NotNull(message = "Seller listing ID is required")
    private UUID sellerListingId;

    @Min(value = 1, message = "Quantity to reserve must be at least 1")
    private int quantity = 1;

    private long holdMinutes = 15;

    public ReserveStockRequest() {
    }

    public UUID getSellerListingId() { return sellerListingId; }
    public void setSellerListingId(UUID sellerListingId) { this.sellerListingId = sellerListingId; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public long getHoldMinutes() { return holdMinutes; }
    public void setHoldMinutes(long holdMinutes) { this.holdMinutes = holdMinutes; }
}
