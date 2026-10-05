package com.wristo.modules.search.dto;

import com.wristo.modules.catalog.dto.WatchResponse;

import java.util.List;
import java.util.Map;

public class FullSearchResponse {
    private String query;
    private Long totalElements;
    private Integer totalPages;
    private Integer currentPage;
    private List<WatchResponse> content;
    private Map<String, Long> brandFacets;
    private Map<String, Long> movementFacets;
    private Map<String, Long> styleFacets;

    public FullSearchResponse() {
    }

    public FullSearchResponse(String query, Long totalElements, Integer totalPages,
                              Integer currentPage, List<WatchResponse> content,
                              Map<String, Long> brandFacets, Map<String, Long> movementFacets,
                              Map<String, Long> styleFacets) {
        this.query = query;
        this.totalElements = totalElements;
        this.totalPages = totalPages;
        this.currentPage = currentPage;
        this.content = content;
        this.brandFacets = brandFacets;
        this.movementFacets = movementFacets;
        this.styleFacets = styleFacets;
    }

    public String getQuery() {
        return query;
    }

    public void setQuery(String query) {
        this.query = query;
    }

    public Long getTotalElements() {
        return totalElements;
    }

    public void setTotalElements(Long totalElements) {
        this.totalElements = totalElements;
    }

    public Integer getTotalPages() {
        return totalPages;
    }

    public void setTotalPages(Integer totalPages) {
        this.totalPages = totalPages;
    }

    public Integer getCurrentPage() {
        return currentPage;
    }

    public void setCurrentPage(Integer currentPage) {
        this.currentPage = currentPage;
    }

    public List<WatchResponse> getContent() {
        return content;
    }

    public void setContent(List<WatchResponse> content) {
        this.content = content;
    }

    public Map<String, Long> getBrandFacets() {
        return brandFacets;
    }

    public void setBrandFacets(Map<String, Long> brandFacets) {
        this.brandFacets = brandFacets;
    }

    public Map<String, Long> getMovementFacets() {
        return movementFacets;
    }

    public void setMovementFacets(Map<String, Long> movementFacets) {
        this.movementFacets = movementFacets;
    }

    public Map<String, Long> getStyleFacets() {
        return styleFacets;
    }

    public void setStyleFacets(Map<String, Long> styleFacets) {
        this.styleFacets = styleFacets;
    }
}
