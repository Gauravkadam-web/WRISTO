package com.wristo.modules.catalog.entity;

import com.wristo.common.entity.BaseAuditEntity;
import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "watches")
public class Watch extends BaseAuditEntity {

    @Id
    @Column(name = "id", length = 32, nullable = false)
    private String id;

    @Column(name = "num", length = 8, nullable = false)
    private String num;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "brand_id", nullable = false)
    private Brand brand;

    @Column(name = "brand_name", length = 64, nullable = false)
    private String brandName;

    @Column(name = "model", length = 128, nullable = false)
    private String model;

    @Column(name = "price", precision = 12, scale = 2, nullable = false)
    private BigDecimal price;

    @Column(name = "original_price", precision = 12, scale = 2, nullable = false)
    private BigDecimal originalPrice;

    @Column(name = "rating", precision = 3, scale = 2, nullable = false)
    private BigDecimal rating = BigDecimal.valueOf(5.00);

    @Column(name = "reviews_count", nullable = false)
    private Integer reviewsCount = 0;

    @Column(name = "image_url", length = 255, nullable = false)
    private String imageUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(name = "category_name", length = 32, nullable = false)
    private String categoryName;

    @Column(name = "gender", length = 16, nullable = false)
    private String gender;

    @Column(name = "movement", length = 64, nullable = false)
    private String movement;

    @Column(name = "style", length = 64, nullable = false)
    private String style;

    @Column(name = "case_size", length = 32, nullable = false)
    private String caseSize;

    @Column(name = "strap", length = 64, nullable = false)
    private String strap;

    @Column(name = "dial", length = 64, nullable = false)
    private String dial;

    @Column(name = "material", length = 64, nullable = false)
    private String material;

    @Column(name = "water_resistance", length = 32, nullable = false)
    private String waterResistance;

    @Column(name = "badge", length = 32)
    private String badge;

    @Column(name = "tagline", length = 255, nullable = false)
    private String tagline;

    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "ai_match_score")
    private Integer aiMatchScore = 95;

    @Column(name = "ai_reason", columnDefinition = "TEXT")
    private String aiReason;

    @Column(name = "stock_count", nullable = false)
    private Integer stockCount = 10;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @OneToOne(mappedBy = "watch", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private WatchSpec specs;

    public Watch() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getNum() {
        return num;
    }

    public void setNum(String num) {
        this.num = num;
    }

    public Brand getBrand() {
        return brand;
    }

    public void setBrand(Brand brand) {
        this.brand = brand;
    }

    public String getBrandName() {
        return brandName;
    }

    public void setBrandName(String brandName) {
        this.brandName = brandName;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public BigDecimal getOriginalPrice() {
        return originalPrice;
    }

    public void setOriginalPrice(BigDecimal originalPrice) {
        this.originalPrice = originalPrice;
    }

    public BigDecimal getRating() {
        return rating;
    }

    public void setRating(BigDecimal rating) {
        this.rating = rating;
    }

    public Integer getReviewsCount() {
        return reviewsCount;
    }

    public void setReviewsCount(Integer reviewsCount) {
        this.reviewsCount = reviewsCount;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getMovement() {
        return movement;
    }

    public void setMovement(String movement) {
        this.movement = movement;
    }

    public String getStyle() {
        return style;
    }

    public void setStyle(String style) {
        this.style = style;
    }

    public String getCaseSize() {
        return caseSize;
    }

    public void setCaseSize(String caseSize) {
        this.caseSize = caseSize;
    }

    public String getStrap() {
        return strap;
    }

    public void setStrap(String strap) {
        this.strap = strap;
    }

    public String getDial() {
        return dial;
    }

    public void setDial(String dial) {
        this.dial = dial;
    }

    public String getMaterial() {
        return material;
    }

    public void setMaterial(String material) {
        this.material = material;
    }

    public String getWaterResistance() {
        return waterResistance;
    }

    public void setWaterResistance(String waterResistance) {
        this.waterResistance = waterResistance;
    }

    public String getBadge() {
        return badge;
    }

    public void setBadge(String badge) {
        this.badge = badge;
    }

    public String getTagline() {
        return tagline;
    }

    public void setTagline(String tagline) {
        this.tagline = tagline;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getAiMatchScore() {
        return aiMatchScore;
    }

    public void setAiMatchScore(Integer aiMatchScore) {
        this.aiMatchScore = aiMatchScore;
    }

    public String getAiReason() {
        return aiReason;
    }

    public void setAiReason(String aiReason) {
        this.aiReason = aiReason;
    }

    public Integer getStockCount() {
        return stockCount;
    }

    public void setStockCount(Integer stockCount) {
        this.stockCount = stockCount;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean active) {
        isActive = active;
    }

    public WatchSpec getSpecs() {
        return specs;
    }

    public void setSpecs(WatchSpec specs) {
        this.specs = specs;
    }
}
