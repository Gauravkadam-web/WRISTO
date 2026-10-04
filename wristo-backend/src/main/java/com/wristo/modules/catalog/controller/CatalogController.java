package com.wristo.modules.catalog.controller;

import com.wristo.common.dto.ApiResponse;
import com.wristo.common.dto.PageResponse;
import com.wristo.modules.catalog.entity.Brand;
import com.wristo.modules.catalog.entity.Category;
import com.wristo.modules.catalog.entity.Watch;
import com.wristo.modules.catalog.service.CatalogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Tag(name = "Watch Catalog", description = "Endpoints for luxury timepiece discovery, brands, categories, and specifications.")
public class CatalogController {

    private final CatalogService catalogService;

    public CatalogController(CatalogService catalogService) {
        this.catalogService = catalogService;
    }

    @GetMapping("/watches")
    @Operation(summary = "Get Catalog Watches (Paginated)", description = "Retrieves active luxury timepieces with pagination.")
    public ResponseEntity<ApiResponse<PageResponse<Watch>>> getWatches(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "12") int limit
    ) {
        PageResponse<Watch> response = catalogService.getAllWatches(page, limit);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/watches/{id}")
    @Operation(summary = "Get Watch by ID", description = "Retrieves a single luxury timepiece by its unique identifier.")
    public ResponseEntity<ApiResponse<Watch>> getWatchById(@PathVariable String id) {
        Watch watch = catalogService.getWatchById(id);
        return ResponseEntity.ok(ApiResponse.success(watch));
    }

    @GetMapping("/brands")
    @Operation(summary = "Get All Brand Houses", description = "Retrieves all certified luxury brand houses.")
    public ResponseEntity<ApiResponse<List<Brand>>> getBrands() {
        List<Brand> brands = catalogService.getAllBrands();
        return ResponseEntity.ok(ApiResponse.success(brands));
    }

    @GetMapping("/categories")
    @Operation(summary = "Get All Watch Categories", description = "Retrieves all timepiece classification categories.")
    public ResponseEntity<ApiResponse<List<Category>>> getCategories() {
        List<Category> categories = catalogService.getAllCategories();
        return ResponseEntity.ok(ApiResponse.success(categories));
    }
}
