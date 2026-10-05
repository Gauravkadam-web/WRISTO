package com.wristo.modules.order.entity;

import com.wristo.common.entity.BaseAuditEntity;
import com.wristo.modules.catalog.entity.Watch;
import com.wristo.modules.seller.entity.Seller;
import com.wristo.modules.seller.entity.SellerListing;
import jakarta.persistence.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
public class OrderItem extends BaseAuditEntity {

    @Id
    @Column(name = "id", length = 36, nullable = false)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "watch_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Watch watch;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id")
    @OnDelete(action = OnDeleteAction.SET_NULL)
    private Seller seller;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_listing_id")
    @OnDelete(action = OnDeleteAction.SET_NULL)
    private SellerListing sellerListing;

    @Column(name = "watch_model", length = 255, nullable = false)
    private String watchModel;

    @Column(name = "watch_brand", length = 100, nullable = false)
    private String watchBrand;

    @Column(name = "watch_image_url", length = 500)
    private String watchImageUrl;

    @Column(name = "movement_type", length = 50)
    private String movementType;

    @Column(name = "case_size", length = 50)
    private String caseSize;

    @Column(name = "quantity", nullable = false)
    private Integer quantity = 1;

    @Column(name = "unit_price", precision = 12, scale = 2, nullable = false)
    private BigDecimal unitPrice;

    @Column(name = "total_price", precision = 12, scale = 2, nullable = false)
    private BigDecimal totalPrice;

    public OrderItem() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public Watch getWatch() {
        return watch;
    }

    public void setWatch(Watch watch) {
        this.watch = watch;
    }

    public Seller getSeller() {
        return seller;
    }

    public void setSeller(Seller seller) {
        this.seller = seller;
    }

    public SellerListing getSellerListing() {
        return sellerListing;
    }

    public void setSellerListing(SellerListing sellerListing) {
        this.sellerListing = sellerListing;
    }

    public String getWatchModel() {
        return watchModel;
    }

    public void setWatchModel(String watchModel) {
        this.watchModel = watchModel;
    }

    public String getWatchBrand() {
        return watchBrand;
    }

    public void setWatchBrand(String watchBrand) {
        this.watchBrand = watchBrand;
    }

    public String getWatchImageUrl() {
        return watchImageUrl;
    }

    public void setWatchImageUrl(String watchImageUrl) {
        this.watchImageUrl = watchImageUrl;
    }

    public String getMovementType() {
        return movementType;
    }

    public void setMovementType(String movementType) {
        this.movementType = movementType;
    }

    public String getCaseSize() {
        return caseSize;
    }

    public void setCaseSize(String caseSize) {
        this.caseSize = caseSize;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(BigDecimal unitPrice) {
        this.unitPrice = unitPrice;
    }

    public BigDecimal getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(BigDecimal totalPrice) {
        this.totalPrice = totalPrice;
    }
}
