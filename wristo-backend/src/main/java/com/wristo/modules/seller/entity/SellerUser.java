package com.wristo.modules.seller.entity;

import com.wristo.common.entity.BaseAuditEntity;
import com.wristo.modules.auth.entity.User;
import jakarta.persistence.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import java.util.UUID;

@Entity
@Table(name = "seller_users", uniqueConstraints = {
        @UniqueConstraint(name = "uq_seller_user", columnNames = {"seller_id", "user_id"})
})
public class SellerUser extends BaseAuditEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", nullable = false, updatable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "seller_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Seller seller;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", length = 32, nullable = false)
    private SellerStaffRole role = SellerStaffRole.OWNER;

    @Column(name = "is_primary", nullable = false)
    private Boolean isPrimary = false;

    public SellerUser() {
    }

    public SellerUser(Seller seller, User user, SellerStaffRole role, Boolean isPrimary) {
        this.seller = seller;
        this.user = user;
        this.role = role;
        this.isPrimary = isPrimary;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Seller getSeller() {
        return seller;
    }

    public void setSeller(Seller seller) {
        this.seller = seller;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public SellerStaffRole getRole() {
        return role;
    }

    public void setRole(SellerStaffRole role) {
        this.role = role;
    }

    public Boolean getIsPrimary() {
        return isPrimary;
    }

    public void setIsPrimary(Boolean primary) {
        isPrimary = primary;
    }
}
