package com.wristo.modules.seller.entity;

import com.wristo.modules.catalog.entity.Brand;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "seller_brand_authorizations", uniqueConstraints = {
        @UniqueConstraint(name = "uq_seller_brand_auth", columnNames = {"seller_id", "brand_id"})
})
public class SellerBrandAuthorization {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", nullable = false, updatable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "seller_id", nullable = false)
    private Seller seller;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "brand_id", nullable = false)
    private Brand brand;

    @Column(name = "authorization_doc_url", length = 255)
    private String authorizationDocUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 32, nullable = false)
    private BrandAuthStatus status = BrandAuthStatus.PENDING;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public SellerBrandAuthorization() {
    }

    public SellerBrandAuthorization(Seller seller, Brand brand, String authorizationDocUrl) {
        this.seller = seller;
        this.brand = brand;
        this.authorizationDocUrl = authorizationDocUrl;
        this.status = BrandAuthStatus.PENDING;
        this.createdAt = Instant.now();
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

    public Brand getBrand() {
        return brand;
    }

    public void setBrand(Brand brand) {
        this.brand = brand;
    }

    public String getAuthorizationDocUrl() {
        return authorizationDocUrl;
    }

    public void setAuthorizationDocUrl(String authorizationDocUrl) {
        this.authorizationDocUrl = authorizationDocUrl;
    }

    public BrandAuthStatus getStatus() {
        return status;
    }

    public void setStatus(BrandAuthStatus status) {
        this.status = status;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
