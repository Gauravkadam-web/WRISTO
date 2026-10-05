package com.wristo.modules.catalog.dto;

import com.wristo.modules.catalog.entity.Watch;

import java.math.BigDecimal;

public class WatchResponse {

    private String id;
    private String num;
    private String brand;
    private String model;
    private BigDecimal price;
    private BigDecimal originalPrice;
    private BigDecimal rating;
    private Integer reviewsCount;
    private String image;
    private String category;
    private String gender;
    private String movement;
    private String style;
    private String caseSize;
    private String strap;
    private String dial;
    private String material;
    private String waterResistance;
    private String badge;
    private String tagline;
    private String description;
    private Integer aiMatchScore;
    private String aiReason;
    private Integer stockCount;
    private Boolean isActive;

    public WatchResponse() {
    }

    public static WatchResponse from(Watch watch) {
        if (watch == null) return null;
        WatchResponse dto = new WatchResponse();
        dto.setId(watch.getId());
        dto.setNum(watch.getNum());
        dto.setBrand(watch.getBrandName());
        dto.setModel(watch.getModel());
        dto.setPrice(watch.getPrice());
        dto.setOriginalPrice(watch.getOriginalPrice());
        dto.setRating(watch.getRating());
        dto.setReviewsCount(watch.getReviewsCount());
        dto.setImage(watch.getImageUrl());
        dto.setCategory(watch.getCategoryName());
        dto.setGender(watch.getGender());
        dto.setMovement(watch.getMovement());
        dto.setStyle(watch.getStyle());
        dto.setCaseSize(watch.getCaseSize());
        dto.setStrap(watch.getStrap());
        dto.setDial(watch.getDial());
        dto.setMaterial(watch.getMaterial());
        dto.setWaterResistance(watch.getWaterResistance());
        dto.setBadge(watch.getBadge());
        dto.setTagline(watch.getTagline());
        dto.setDescription(watch.getDescription());
        dto.setAiMatchScore(watch.getAiMatchScore());
        dto.setAiReason(watch.getAiReason());
        dto.setStockCount(watch.getStockCount());
        dto.setIsActive(watch.getIsActive());
        return dto;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getNum() { return num; }
    public void setNum(String num) { this.num = num; }

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public BigDecimal getOriginalPrice() { return originalPrice; }
    public void setOriginalPrice(BigDecimal originalPrice) { this.originalPrice = originalPrice; }

    public BigDecimal getRating() { return rating; }
    public void setRating(BigDecimal rating) { this.rating = rating; }

    public Integer getReviewsCount() { return reviewsCount; }
    public void setReviewsCount(Integer reviewsCount) { this.reviewsCount = reviewsCount; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getMovement() { return movement; }
    public void setMovement(String movement) { this.movement = movement; }

    public String getStyle() { return style; }
    public void setStyle(String style) { this.style = style; }

    public String getCaseSize() { return caseSize; }
    public void setCaseSize(String caseSize) { this.caseSize = caseSize; }

    public String getStrap() { return strap; }
    public void setStrap(String strap) { this.strap = strap; }

    public String getDial() { return dial; }
    public void setDial(String dial) { this.dial = dial; }

    public String getMaterial() { return material; }
    public void setMaterial(String material) { this.material = material; }

    public String getWaterResistance() { return waterResistance; }
    public void setWaterResistance(String waterResistance) { this.waterResistance = waterResistance; }

    public String getBadge() { return badge; }
    public void setBadge(String badge) { this.badge = badge; }

    public String getTagline() { return tagline; }
    public void setTagline(String tagline) { this.tagline = tagline; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Integer getAiMatchScore() { return aiMatchScore; }
    public void setAiMatchScore(Integer aiMatchScore) { this.aiMatchScore = aiMatchScore; }

    public String getAiReason() { return aiReason; }
    public void setAiReason(String aiReason) { this.aiReason = aiReason; }

    public Integer getStockCount() { return stockCount; }
    public void setStockCount(Integer stockCount) { this.stockCount = stockCount; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean active) { isActive = active; }
}
