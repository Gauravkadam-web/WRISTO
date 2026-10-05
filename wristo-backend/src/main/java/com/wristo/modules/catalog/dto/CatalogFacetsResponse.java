package com.wristo.modules.catalog.dto;

import java.util.ArrayList;
import java.util.List;

public class CatalogFacetsResponse {

    private List<FacetItemResponse> brands = new ArrayList<>();
    private List<FacetItemResponse> movements = new ArrayList<>();
    private List<FacetItemResponse> styles = new ArrayList<>();
    private PriceRangeResponse priceRange;

    public CatalogFacetsResponse() {
    }

    public List<FacetItemResponse> getBrands() { return brands; }
    public void setBrands(List<FacetItemResponse> brands) { this.brands = brands; }

    public List<FacetItemResponse> getMovements() { return movements; }
    public void setMovements(List<FacetItemResponse> movements) { this.movements = movements; }

    public List<FacetItemResponse> getStyles() { return styles; }
    public void setStyles(List<FacetItemResponse> styles) { this.styles = styles; }

    public PriceRangeResponse getPriceRange() { return priceRange; }
    public void setPriceRange(PriceRangeResponse priceRange) { this.priceRange = priceRange; }
}
