package com.wristo.modules.seller.dto;

import com.wristo.modules.seller.entity.ListingStatus;
import com.wristo.modules.seller.entity.SellerListing;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public class SellerListingResponse {

    private UUID id;
    private String sellerId;
    private String sellerName;
    private String watchId;
    private String watchModel;
    private String brandName;
    private String watchImageUrl;
    private String sellerSku;
    private BigDecimal price;
    private BigDecimal originalPrice;
    private String condition;
    private String warrantyType;
    private String warrantyPeriod;
    private String authenticityGuarantee;
    private ListingStatus status;
    private String rejectionReason;
    private Boolean isActive;
    private Integer availableQuantity;
    private Integer totalQuantity;
    private Instant createdAt;
    private Instant updatedAt;

    public SellerListingResponse() {
    }

    public static SellerListingResponse from(SellerListing listing) {
        if (listing == null) return null;
        SellerListingResponse dto = new SellerListingResponse();
        dto.setId(listing.getId());

        if (listing.getSeller() != null) {
            dto.setSellerId(listing.getSeller().getId());
            dto.setSellerName(listing.getSeller().getBusinessName());
        }

        if (listing.getWatch() != null) {
            dto.setWatchId(listing.getWatch().getId());
            dto.setWatchModel(listing.getWatch().getModel());
            dto.setBrandName(listing.getWatch().getBrandName());
            dto.setWatchImageUrl(listing.getWatch().getImageUrl());
        }

        dto.setSellerSku(listing.getSellerSku());
        dto.setPrice(listing.getPrice());
        dto.setOriginalPrice(listing.getOriginalPrice());
        dto.setCondition(listing.getCondition());
        dto.setWarrantyType(listing.getWarrantyType());
        dto.setWarrantyPeriod(listing.getWarrantyPeriod());
        dto.setAuthenticityGuarantee(listing.getAuthenticityGuarantee());
        dto.setStatus(listing.getStatus());
        dto.setRejectionReason(listing.getRejectionReason());
        dto.setIsActive(listing.getIsActive());
        dto.setCreatedAt(listing.getCreatedAt());
        dto.setUpdatedAt(listing.getUpdatedAt());

        if (listing.getInventory() != null) {
            dto.setAvailableQuantity(listing.getInventory().getAvailableQuantity());
            dto.setTotalQuantity(listing.getInventory().getTotalQuantity());
        } else {
            dto.setAvailableQuantity(0);
            dto.setTotalQuantity(0);
        }

        return dto;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getSellerId() { return sellerId; }
    public void setSellerId(String sellerId) { this.sellerId = sellerId; }

    public String getSellerName() { return sellerName; }
    public void setSellerName(String sellerName) { this.sellerName = sellerName; }

    public String getWatchId() { return watchId; }
    public void setWatchId(String watchId) { this.watchId = watchId; }

    public String getWatchModel() { return watchModel; }
    public void setWatchModel(String watchModel) { this.watchModel = watchModel; }

    public String getBrandName() { return brandName; }
    public void setBrandName(String brandName) { this.brandName = brandName; }

    public String getWatchImageUrl() { return watchImageUrl; }
    public void setWatchImageUrl(String watchImageUrl) { this.watchImageUrl = watchImageUrl; }

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

    public ListingStatus getStatus() { return status; }
    public void setStatus(ListingStatus status) { this.status = status; }

    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean active) { isActive = active; }

    public Integer getAvailableQuantity() { return availableQuantity; }
    public void setAvailableQuantity(Integer availableQuantity) { this.availableQuantity = availableQuantity; }

    public Integer getTotalQuantity() { return totalQuantity; }
    public void setTotalQuantity(Integer totalQuantity) { this.totalQuantity = totalQuantity; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
