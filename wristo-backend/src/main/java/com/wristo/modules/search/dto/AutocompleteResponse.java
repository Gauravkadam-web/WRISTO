package com.wristo.modules.search.dto;

import java.util.List;

public class AutocompleteResponse {
    private String query;
    private List<BrandSuggestionDto> brands;
    private List<SearchSuggestionItemDto> watches;
    private List<String> categories;
    private Integer totalMatches;

    public AutocompleteResponse() {
    }

    public AutocompleteResponse(String query, List<BrandSuggestionDto> brands,
                                List<SearchSuggestionItemDto> watches, List<String> categories,
                                Integer totalMatches) {
        this.query = query;
        this.brands = brands;
        this.watches = watches;
        this.categories = categories;
        this.totalMatches = totalMatches;
    }

    public String getQuery() {
        return query;
    }

    public void setQuery(String query) {
        this.query = query;
    }

    public List<BrandSuggestionDto> getBrands() {
        return brands;
    }

    public void setBrands(List<BrandSuggestionDto> brands) {
        this.brands = brands;
    }

    public List<SearchSuggestionItemDto> getWatches() {
        return watches;
    }

    public void setWatches(List<SearchSuggestionItemDto> watches) {
        this.watches = watches;
    }

    public List<String> getCategories() {
        return categories;
    }

    public void setCategories(List<String> categories) {
        this.categories = categories;
    }

    public Integer getTotalMatches() {
        return totalMatches;
    }

    public void setTotalMatches(Integer totalMatches) {
        this.totalMatches = totalMatches;
    }
}
