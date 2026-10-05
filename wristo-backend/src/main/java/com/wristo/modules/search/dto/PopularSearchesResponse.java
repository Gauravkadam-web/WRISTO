package com.wristo.modules.search.dto;

import java.util.List;

public class PopularSearchesResponse {
    private List<String> popularSearches;
    private List<String> trendingBrands;
    private List<String> trendingStyles;

    public PopularSearchesResponse() {
    }

    public PopularSearchesResponse(List<String> popularSearches, List<String> trendingBrands, List<String> trendingStyles) {
        this.popularSearches = popularSearches;
        this.trendingBrands = trendingBrands;
        this.trendingStyles = trendingStyles;
    }

    public List<String> getPopularSearches() {
        return popularSearches;
    }

    public void setPopularSearches(List<String> popularSearches) {
        this.popularSearches = popularSearches;
    }

    public List<String> getTrendingBrands() {
        return trendingBrands;
    }

    public void setTrendingBrands(List<String> trendingBrands) {
        this.trendingBrands = trendingBrands;
    }

    public List<String> getTrendingStyles() {
        return trendingStyles;
    }

    public void setTrendingStyles(List<String> trendingStyles) {
        this.trendingStyles = trendingStyles;
    }
}
