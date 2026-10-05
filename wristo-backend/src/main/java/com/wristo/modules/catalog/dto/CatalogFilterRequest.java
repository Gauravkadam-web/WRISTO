package com.wristo.modules.catalog.dto;

import java.math.BigDecimal;

public class CatalogFilterRequest {

    private String brand;
    private String movement;
    private String style;
    private String gender;
    private String category;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private String sort; // 'featured', 'price-low', 'price-high', 'rating', 'newest'
    private String q;

    public CatalogFilterRequest() {
    }

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public String getMovement() { return movement; }
    public void setMovement(String movement) { this.movement = movement; }

    public String getStyle() { return style; }
    public void setStyle(String style) { this.style = style; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public BigDecimal getMinPrice() { return minPrice; }
    public void setMinPrice(BigDecimal minPrice) { this.minPrice = minPrice; }

    public BigDecimal getMaxPrice() { return maxPrice; }
    public void setMaxPrice(BigDecimal maxPrice) { this.maxPrice = maxPrice; }

    public String getSort() { return sort; }
    public void setSort(String sort) { this.sort = sort; }

    public String getQ() { return q; }
    public void setQ(String q) { this.q = q; }
}
