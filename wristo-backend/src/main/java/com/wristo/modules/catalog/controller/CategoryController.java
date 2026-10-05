package com.wristo.modules.catalog.controller;

import com.wristo.common.dto.ApiResponse;
import com.wristo.modules.catalog.entity.Category;
import com.wristo.modules.catalog.service.CatalogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/categories")
@Tag(name = "Categories", description = "Public Horology Categories APIs")
public class CategoryController {

    private final CatalogService catalogService;

    public CategoryController(CatalogService catalogService) {
        this.catalogService = catalogService;
    }

    @GetMapping
    @Operation(summary = "Get all watch categories", description = "Retrieves all active timepiece categories")
    public ResponseEntity<ApiResponse<List<Category>>> getAllCategories() {
        List<Category> categories = catalogService.getAllCategories();
        return ResponseEntity.ok(ApiResponse.success("Categories retrieved successfully", categories));
    }
}
