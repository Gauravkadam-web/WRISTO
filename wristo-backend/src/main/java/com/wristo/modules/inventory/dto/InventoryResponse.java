package com.wristo.modules.inventory.dto;

import com.wristo.modules.inventory.entity.Inventory;

import java.time.Instant;
import java.util.UUID;

public class InventoryResponse {

    private UUID id;
    private UUID sellerListingId;
    private String sellerSku;
    private String watchId;
    private String watchModel;
    private String brandName;
    private Integer totalQuantity;
    private Integer availableQuantity;
    private Integer reservedQuantity;
    private Integer soldQuantity;
    private Integer lowStockThreshold;
    private Boolean isLowStock;
    private Instant createdAt;
    private Instant updatedAt;

    public InventoryResponse() {
    }

    public static InventoryResponse from(Inventory inventory) {
        if (inventory == null) return null;
        InventoryResponse dto = new InventoryResponse();
        dto.setId(inventory.getId());

        if (inventory.getSellerListing() != null) {
            dto.setSellerListingId(inventory.getSellerListing().getId());
            dto.setSellerSku(inventory.getSellerListing().getSellerSku());
            if (inventory.getSellerListing().getWatch() != null) {
                dto.setWatchId(inventory.getSellerListing().getWatch().getId());
                dto.setWatchModel(inventory.getSellerListing().getWatch().getModel());
                dto.setBrandName(inventory.getSellerListing().getWatch().getBrandName());
            }
        }

        dto.setTotalQuantity(inventory.getTotalQuantity());
        dto.setAvailableQuantity(inventory.getAvailableQuantity());
        dto.setReservedQuantity(inventory.getReservedQuantity());
        dto.setSoldQuantity(inventory.getSoldQuantity());
        dto.setLowStockThreshold(inventory.getLowStockThreshold());
        dto.setIsLowStock(inventory.getAvailableQuantity() <= inventory.getLowStockThreshold());
        dto.setCreatedAt(inventory.getCreatedAt());
        dto.setUpdatedAt(inventory.getUpdatedAt());
        return dto;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getSellerListingId() { return sellerListingId; }
    public void setSellerListingId(UUID sellerListingId) { this.sellerListingId = sellerListingId; }

    public String getSellerSku() { return sellerSku; }
    public void setSellerSku(String sellerSku) { this.sellerSku = sellerSku; }

    public String getWatchId() { return watchId; }
    public void setWatchId(String watchId) { this.watchId = watchId; }

    public String getWatchModel() { return watchModel; }
    public void setWatchModel(String watchModel) { this.watchModel = watchModel; }

    public String getBrandName() { return brandName; }
    public void setBrandName(String brandName) { this.brandName = brandName; }

    public Integer getTotalQuantity() { return totalQuantity; }
    public void setTotalQuantity(Integer totalQuantity) { this.totalQuantity = totalQuantity; }

    public Integer getAvailableQuantity() { return availableQuantity; }
    public void setAvailableQuantity(Integer availableQuantity) { this.availableQuantity = availableQuantity; }

    public Integer getReservedQuantity() { return reservedQuantity; }
    public void setReservedQuantity(Integer reservedQuantity) { this.reservedQuantity = reservedQuantity; }

    public Integer getSoldQuantity() { return soldQuantity; }
    public void setSoldQuantity(Integer soldQuantity) { this.soldQuantity = soldQuantity; }

    public Integer getLowStockThreshold() { return lowStockThreshold; }
    public void setLowStockThreshold(Integer lowStockThreshold) { this.lowStockThreshold = lowStockThreshold; }

    public Boolean getIsLowStock() { return isLowStock; }
    public void setIsLowStock(Boolean lowStock) { isLowStock = lowStock; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
