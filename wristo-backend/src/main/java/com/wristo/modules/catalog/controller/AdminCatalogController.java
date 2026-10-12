package com.wristo.modules.catalog.controller;

import com.wristo.common.dto.ApiResponse;
import com.wristo.common.dto.PageResponse;
import com.wristo.modules.catalog.dto.CreateWatchRequest;
import com.wristo.modules.catalog.dto.UpdateWatchRequest;
import com.wristo.modules.catalog.dto.WatchDetailResponse;
import com.wristo.modules.catalog.service.CatalogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/watches")
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
@SecurityRequirement(name = "BearerAuth")
@Tag(name = "Admin Master Catalog", description = "Back-office Master Watch Catalog Curation, Specifications & Lifecycle Governance")
public class AdminCatalogController {

    private final CatalogService catalogService;

    public AdminCatalogController(CatalogService catalogService) {
        this.catalogService = catalogService;
    }

    @GetMapping
    @Operation(summary = "List all canonical watches (Admin)", description = "Retrieves paginated list of all watches with filters for brand, search query, and active status")
    public ResponseEntity<ApiResponse<PageResponse<WatchDetailResponse>>> getAllWatches(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) Boolean active,
            @PageableDefault(size = 20, sort = "num", direction = Sort.Direction.ASC) Pageable pageable
    ) {
        Page<WatchDetailResponse> page = catalogService.getAllWatchesAdmin(search, brand, active, pageable);
        PageResponse<WatchDetailResponse> response = PageResponse.from(page);
        return ResponseEntity.ok(ApiResponse.success("Admin catalog retrieved successfully", response));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get single watch details (Admin)", description = "Retrieves complete watch and horological specifications by ID")
    public ResponseEntity<ApiResponse<WatchDetailResponse>> getWatchById(@PathVariable String id) {
        WatchDetailResponse response = catalogService.getWatchByIdAdmin(id);
        return ResponseEntity.ok(ApiResponse.success("Watch details retrieved successfully", response));
    }

    @PostMapping
    @Operation(summary = "Create a new canonical timepiece", description = "Adds a new master watch model and horological specifications into the catalog")
    public ResponseEntity<ApiResponse<WatchDetailResponse>> createWatch(@Valid @RequestBody CreateWatchRequest request) {
        WatchDetailResponse response = catalogService.createWatch(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Timepiece added to master catalog successfully", response));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing canonical timepiece", description = "Updates pricing, descriptions, dimensions, specifications, and 3D assets")
    public ResponseEntity<ApiResponse<WatchDetailResponse>> updateWatch(
            @PathVariable String id,
            @RequestBody UpdateWatchRequest request
    ) {
        WatchDetailResponse response = catalogService.updateWatch(id, request);
        return ResponseEntity.ok(ApiResponse.success("Timepiece updated successfully", response));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Archive / soft-delete a timepiece", description = "Sets watch active flag to false, removing from public storefront while preserving audit history")
    public ResponseEntity<ApiResponse<Void>> deleteWatch(@PathVariable String id) {
        catalogService.deleteWatch(id);
        return ResponseEntity.ok(ApiResponse.success("Timepiece archived successfully", null));
    }

    @PatchMapping("/{id}/toggle-status")
    @Operation(summary = "Toggle active status", description = "Switches watch between active storefront display and inactive draft")
    public ResponseEntity<ApiResponse<WatchDetailResponse>> toggleWatchStatus(@PathVariable String id) {
        WatchDetailResponse response = catalogService.toggleWatchActive(id);
        return ResponseEntity.ok(ApiResponse.success("Watch active status toggled", response));
    }
}
