package com.wristo.modules.wishlist.entity;

import com.wristo.common.entity.BaseAuditEntity;
import com.wristo.modules.catalog.entity.Watch;
import jakarta.persistence.*;

@Entity
@Table(name = "wishlist_items", uniqueConstraints = {
        @UniqueConstraint(name = "uq_wishlist_watch", columnNames = {"wishlist_id", "watch_id"})
})
public class WishlistItem extends BaseAuditEntity {

    @Id
    @Column(name = "id", length = 36, nullable = false)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "wishlist_id", nullable = false)
    private Wishlist wishlist;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "watch_id", nullable = false)
    private Watch watch;

    public WishlistItem() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Wishlist getWishlist() {
        return wishlist;
    }

    public void setWishlist(Wishlist wishlist) {
        this.wishlist = wishlist;
    }

    public Watch getWatch() {
        return watch;
    }

    public void setWatch(Watch watch) {
        this.watch = watch;
    }
}
