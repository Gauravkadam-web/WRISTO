package com.wristo.modules.inventory.controller;

import com.wristo.common.dto.ApiResponse;
import com.wristo.common.dto.PageResponse;
import com.wristo.modules.inventory.dto.AdjustStockRequest;
import com.wristo.modules.inventory.dto.InventoryMovementResponse;
import com.wristo.modules.inventory.dto.InventoryResponse;
import com.wristo.modules.inventory.service.InventoryService;
import com.wristo.security.model.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/seller/inventory")
@PreAuthorize("hasAnyRole('SELLER', 'SELLER_STAFF', 'ADMIN')")
@SecurityRequirement(name = "BearerAuth")
@Tag(name = "Seller Inventory", description = "Seller Boutique Stock Management, Adjustments & Audit Movements")
public class SellerInventoryController {

    private final InventoryService inventoryService;

    public SellerInventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @GetMapping
    @Operation(summary = "Get boutique inventory", description = "Retrieves stock levels, available units, and low-stock alerts for the seller")
    public ResponseEntity<ApiResponse<PageResponse<InventoryResponse>>> getSellerInventory(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit) {
        Pageable pageable = PageRequest.of(Math.max(0, page - 1), limit);
        PageResponse<InventoryResponse> response = inventoryService.getSellerInventory(principal, pageable);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/listings/{listingId}")
    @Operation(summary = "Get inventory by listing ID", description = "Retrieves current stock levels for a specific watch listing")
    public ResponseEntity<ApiResponse<InventoryResponse>> getInventoryByListing(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID listingId) {
        InventoryResponse response = inventoryService.getInventoryByListing(principal, listingId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/adjust")
    @Operation(summary = "Adjust inventory stock", description = "Performs an auditable stock increment or decrement with concurrency locking")
    public ResponseEntity<ApiResponse<InventoryResponse>> adjustStock(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody AdjustStockRequest request) {
        InventoryResponse response = inventoryService.adjustStock(principal, request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/listings/{listingId}/movements")
    @Operation(summary = "Get inventory audit movements", description = "Retrieves the complete historical audit log of all stock movements for a listing")
    public ResponseEntity<ApiResponse<PageResponse<InventoryMovementResponse>>> getListingMovements(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID listingId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit) {
        Pageable pageable = PageRequest.of(Math.max(0, page - 1), limit);
        PageResponse<InventoryMovementResponse> response = inventoryService.getListingMovements(principal, listingId, pageable);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
