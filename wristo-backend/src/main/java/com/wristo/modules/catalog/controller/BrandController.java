package com.wristo.modules.catalog.controller;

import com.wristo.common.dto.ApiResponse;
import com.wristo.modules.catalog.entity.Brand;
import com.wristo.modules.catalog.service.CatalogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/brands")
@Tag(name = "Brands", description = "Public Horology Brand Houses APIs")
public class BrandController {

    private final CatalogService catalogService;

    public BrandController(CatalogService catalogService) {
        this.catalogService = catalogService;
    }

    @GetMapping
    @Operation(summary = "Get all curated brand houses", description = "Retrieves all active master horology brands")
    public ResponseEntity<ApiResponse<List<Brand>>> getAllBrands() {
        List<Brand> brands = catalogService.getAllBrands();
        return ResponseEntity.ok(ApiResponse.success("Brand houses retrieved successfully", brands));
    }
}
