package com.wristo.modules.seller.entity;

import com.wristo.common.entity.BaseAuditEntity;
import com.wristo.modules.catalog.entity.Watch;
import com.wristo.modules.inventory.entity.Inventory;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "seller_listings", uniqueConstraints = {
        @UniqueConstraint(name = "uq_seller_watch_sku", columnNames = {"seller_id", "seller_sku"})
})
public class SellerListing extends BaseAuditEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id", nullable = false)
    private Seller seller;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "watch_id", nullable = false)
    private Watch watch;

    @Column(name = "seller_sku", length = 64, nullable = false)
    private String sellerSku;

    @Column(name = "price", precision = 12, scale = 2, nullable = false)
    private BigDecimal price;

    @Column(name = "original_price", precision = 12, scale = 2, nullable = false)
    private BigDecimal originalPrice;

    @Column(name = "condition", length = 32, nullable = false)
    private String condition = "NEW";

    @Column(name = "warranty_type", length = 64, nullable = false)
    private String warrantyType = "BRAND_WARRANTY";

    @Column(name = "warranty_period", length = 64, nullable = false)
    private String warrantyPeriod = "2-Year International Warranty";

    @Column(name = "authenticity_guarantee", length = 255, nullable = false)
    private String authenticityGuarantee = "100% Verified Swiss & Global Authenticity Guaranteed by WRISTO";

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 32, nullable = false)
    private ListingStatus status = ListingStatus.PENDING_APPROVAL;

    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @OneToOne(mappedBy = "sellerListing", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Inventory inventory;

    public SellerListing() {
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Seller getSeller() { return seller; }
    public void setSeller(Seller seller) { this.seller = seller; }

    public Watch getWatch() { return watch; }
    public void setWatch(Watch watch) { this.watch = watch; }

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

    public Inventory getInventory() { return inventory; }
    public void setInventory(Inventory inventory) { this.inventory = inventory; }
}
