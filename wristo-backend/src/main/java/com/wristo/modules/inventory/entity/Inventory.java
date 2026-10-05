package com.wristo.modules.inventory.entity;

import com.wristo.common.entity.BaseAuditEntity;
import com.wristo.modules.seller.entity.SellerListing;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "inventories")
public class Inventory extends BaseAuditEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_listing_id", nullable = false, unique = true)
    private SellerListing sellerListing;

    @Column(name = "total_quantity", nullable = false)
    private Integer totalQuantity = 0;

    @Column(name = "available_quantity", nullable = false)
    private Integer availableQuantity = 0;

    @Column(name = "reserved_quantity", nullable = false)
    private Integer reservedQuantity = 0;

    @Column(name = "sold_quantity", nullable = false)
    private Integer soldQuantity = 0;

    @Column(name = "low_stock_threshold", nullable = false)
    private Integer lowStockThreshold = 2;

    @OneToMany(mappedBy = "inventory", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<InventoryMovement> movements = new ArrayList<>();

    @OneToMany(mappedBy = "inventory", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<InventoryReservation> reservations = new ArrayList<>();

    public Inventory() {
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public SellerListing getSellerListing() { return sellerListing; }
    public void setSellerListing(SellerListing sellerListing) { this.sellerListing = sellerListing; }

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

    public List<InventoryMovement> getMovements() { return movements; }
    public void setMovements(List<InventoryMovement> movements) { this.movements = movements; }

    public List<InventoryReservation> getReservations() { return reservations; }
    public void setReservations(List<InventoryReservation> reservations) { this.reservations = reservations; }
}
