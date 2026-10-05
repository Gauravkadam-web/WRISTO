package com.wristo.modules.catalog.dto;

import java.util.ArrayList;
import java.util.List;

public class CatalogPageResponse {

    private List<WatchResponse> products = new ArrayList<>();
    private long total;
    private int page;
    private int totalPages;
    private boolean hasMore;
    private CatalogFacetsResponse facets;

    public CatalogPageResponse() {
    }

    public List<WatchResponse> getProducts() { return products; }
    public void setProducts(List<WatchResponse> products) { this.products = products; }

    public long getTotal() { return total; }
    public void setTotal(long total) { this.total = total; }

    public int getPage() { return page; }
    public void setPage(int page) { this.page = page; }

    public int getTotalPages() { return totalPages; }
    public void setTotalPages(int totalPages) { this.totalPages = totalPages; }

    public boolean isHasMore() { return hasMore; }
    public void setHasMore(boolean hasMore) { this.hasMore = hasMore; }

    public CatalogFacetsResponse getFacets() { return facets; }
    public void setFacets(CatalogFacetsResponse facets) { this.facets = facets; }
}
