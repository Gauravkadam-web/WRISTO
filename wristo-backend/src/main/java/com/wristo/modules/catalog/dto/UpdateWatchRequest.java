package com.wristo.modules.catalog.dto;

import java.math.BigDecimal;

public class UpdateWatchRequest {

    private String brandName;
    private String brandId;
    private String model;
    private BigDecimal price;
    private BigDecimal originalPrice;
    private String imageUrl;
    private String categoryName;
    private String categoryId;
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

    // Technical Horology Specifications
    private String caseDiameterMm;
    private String caseMaterial;
    private String dialFinish;
    private String strapMaterial;
    private String waterResistanceAtm;
    private String powerReserveHours;
    private String glassCrystal;
    private String claspType;
    private String warrantyPeriod;

    // 3D CAD & Dimensional Blueprint Assets
    private String model3dUrl;
    private String posterImageUrl;
    private String caseLugToLug;
    private String caseThickness;
    private String lugWidth;

    public UpdateWatchRequest() {
    }

    public String getBrandName() {
        return brandName;
    }

    public void setBrandName(String brandName) {
        this.brandName = brandName;
    }

    public String getBrandId() {
        return brandId;
    }

    public void setBrandId(String brandId) {
        this.brandId = brandId;
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

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public String getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(String categoryId) {
        this.categoryId = categoryId;
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

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public String getCaseDiameterMm() {
        return caseDiameterMm;
    }

    public void setCaseDiameterMm(String caseDiameterMm) {
        this.caseDiameterMm = caseDiameterMm;
    }

    public String getCaseMaterial() {
        return caseMaterial;
    }

    public void setCaseMaterial(String caseMaterial) {
        this.caseMaterial = caseMaterial;
    }

    public String getDialFinish() {
        return dialFinish;
    }

    public void setDialFinish(String dialFinish) {
        this.dialFinish = dialFinish;
    }

    public String getStrapMaterial() {
        return strapMaterial;
    }

    public void setStrapMaterial(String strapMaterial) {
        this.strapMaterial = strapMaterial;
    }

    public String getWaterResistanceAtm() {
        return waterResistanceAtm;
    }

    public void setWaterResistanceAtm(String waterResistanceAtm) {
        this.waterResistanceAtm = waterResistanceAtm;
    }

    public String getPowerReserveHours() {
        return powerReserveHours;
    }

    public void setPowerReserveHours(String powerReserveHours) {
        this.powerReserveHours = powerReserveHours;
    }

    public String getGlassCrystal() {
        return glassCrystal;
    }

    public void setGlassCrystal(String glassCrystal) {
        this.glassCrystal = glassCrystal;
    }

    public String getClaspType() {
        return claspType;
    }

    public void setClaspType(String claspType) {
        this.claspType = claspType;
    }

    public String getWarrantyPeriod() {
        return warrantyPeriod;
    }

    public void setWarrantyPeriod(String warrantyPeriod) {
        this.warrantyPeriod = warrantyPeriod;
    }

    public String getModel3dUrl() {
        return model3dUrl;
    }

    public void setModel3dUrl(String model3dUrl) {
        this.model3dUrl = model3dUrl;
    }

    public String getPosterImageUrl() {
        return posterImageUrl;
    }

    public void setPosterImageUrl(String posterImageUrl) {
        this.posterImageUrl = posterImageUrl;
    }

    public String getCaseLugToLug() {
        return caseLugToLug;
    }

    public void setCaseLugToLug(String caseLugToLug) {
        this.caseLugToLug = caseLugToLug;
    }

    public String getCaseThickness() {
        return caseThickness;
    }

    public void setCaseThickness(String caseThickness) {
        this.caseThickness = caseThickness;
    }

    public String getLugWidth() {
        return lugWidth;
    }

    public void setLugWidth(String lugWidth) {
        this.lugWidth = lugWidth;
    }
}
