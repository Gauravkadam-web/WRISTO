package com.wristo.modules.search.dto;

import java.math.BigDecimal;

public class SearchSuggestionItemDto {
    private String id;
    private String model;
    private String brand;
    private BigDecimal price;
    private BigDecimal originalPrice;
    private String imageUrl;
    private String movement;
    private String style;
    private BigDecimal rating;

    public SearchSuggestionItemDto() {
    }

    public SearchSuggestionItemDto(String id, String model, String brand, BigDecimal price,
                                   BigDecimal originalPrice, String imageUrl, String movement,
                                   String style, BigDecimal rating) {
        this.id = id;
        this.model = model;
        this.brand = brand;
        this.price = price;
        this.originalPrice = originalPrice;
        this.imageUrl = imageUrl;
        this.movement = movement;
        this.style = style;
        this.rating = rating;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
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

    public BigDecimal getRating() {
        return rating;
    }

    public void setRating(BigDecimal rating) {
        this.rating = rating;
    }
}
