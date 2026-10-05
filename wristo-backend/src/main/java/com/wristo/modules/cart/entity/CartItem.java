package com.wristo.modules.cart.entity;

import com.wristo.common.entity.BaseAuditEntity;
import com.wristo.modules.catalog.entity.Watch;
import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "cart_items", uniqueConstraints = {
        @UniqueConstraint(name = "uq_cart_watch", columnNames = {"cart_id", "watch_id"})
})
public class CartItem extends BaseAuditEntity {

    @Id
    @Column(name = "id", length = 36, nullable = false)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cart_id", nullable = false)
    private Cart cart;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "watch_id", nullable = false)
    private Watch watch;

    @Column(name = "quantity", nullable = false)
    private Integer quantity = 1;

    @Column(name = "unit_price", precision = 12, scale = 2, nullable = false)
    private BigDecimal unitPrice;

    public CartItem() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Cart getCart() {
        return cart;
    }

    public void setCart(Cart cart) {
        this.cart = cart;
    }

    public Watch getWatch() {
        return watch;
    }

    public void setWatch(Watch watch) {
        this.watch = watch;
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
}
