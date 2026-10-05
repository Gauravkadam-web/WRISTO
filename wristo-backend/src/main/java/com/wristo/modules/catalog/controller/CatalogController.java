package com.wristo.modules.catalog.controller;

import com.wristo.common.dto.ApiResponse;
import com.wristo.modules.catalog.dto.CatalogFilterRequest;
import com.wristo.modules.catalog.dto.CatalogPageResponse;
import com.wristo.modules.catalog.dto.WatchDetailResponse;
import com.wristo.modules.catalog.dto.WatchResponse;
import com.wristo.modules.catalog.entity.Brand;
import com.wristo.modules.catalog.entity.Category;
import com.wristo.modules.catalog.service.CatalogService;
import com.wristo.modules.seller.dto.SellerListingResponse;
import com.wristo.modules.seller.service.SellerListingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/watches")
@Tag(name = "Catalog", description = "Public Horology Catalog, Watches, Brands & Categories APIs")
public class CatalogController {

    private final CatalogService catalogService;
    private final SellerListingService sellerListingService;

    public CatalogController(CatalogService catalogService, SellerListingService sellerListingService) {
        this.catalogService = catalogService;
        this.sellerListingService = sellerListingService;
    }

    @GetMapping
    @Operation(summary = "Get filtered watch catalog", description = "Retrieves paginated, filtered, and sorted timepieces with dynamic facet aggregation")
    public ResponseEntity<ApiResponse<CatalogPageResponse>> getCatalog(
            @ModelAttribute CatalogFilterRequest filter,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "12") int limit) {
        Pageable pageable = PageRequest.of(Math.max(0, page - 1), limit);
        CatalogPageResponse catalog = catalogService.getCatalog(filter, pageable);
        return ResponseEntity.ok(ApiResponse.success(catalog));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get watch details", description = "Retrieves complete technical horology specifications and details for a single timepiece")
    public ResponseEntity<ApiResponse<WatchDetailResponse>> getWatchById(@PathVariable String id) {
        WatchDetailResponse watch = catalogService.getWatchById(id);
        return ResponseEntity.ok(ApiResponse.success(watch));
    }

    @GetMapping("/{id}/similar")
    @Operation(summary = "Get similar watches", description = "Retrieves companion timepieces matching brand, movement, or style tier")
    public ResponseEntity<ApiResponse<List<WatchResponse>>> getSimilarWatches(@PathVariable String id) {
        List<WatchResponse> similar = catalogService.getSimilarWatches(id);
        return ResponseEntity.ok(ApiResponse.success(similar));
    }

    @GetMapping("/{id}/listings")
    @Operation(summary = "Get active seller listings for a watch", description = "Retrieves all verified seller boutique offers for a canonical watch")
    public ResponseEntity<ApiResponse<List<SellerListingResponse>>> getWatchListings(@PathVariable String id) {
        List<SellerListingResponse> listings = sellerListingService.getPublicListingsForWatch(id);
        return ResponseEntity.ok(ApiResponse.success(listings));
    }

    @GetMapping("/brands")
    @Operation(summary = "Get all watch brands", description = "Retrieves all active master horology houses")
    public ResponseEntity<ApiResponse<List<Brand>>> getAllBrands() {
        List<Brand> brands = catalogService.getAllBrands();
        return ResponseEntity.ok(ApiResponse.success(brands));
    }

    @GetMapping("/categories")
    @Operation(summary = "Get all watch categories", description = "Retrieves all active watch categories and styles")
    public ResponseEntity<ApiResponse<List<Category>>> getAllCategories() {
        List<Category> categories = catalogService.getAllCategories();
        return ResponseEntity.ok(ApiResponse.success(categories));
    }
}
