package com.wristo.modules.seller.controller;

import com.wristo.common.dto.ApiResponse;
import com.wristo.common.dto.PageResponse;
import com.wristo.modules.seller.dto.AdminListingApprovalRequest;
import com.wristo.modules.seller.dto.SellerListingResponse;
import com.wristo.modules.seller.entity.ListingStatus;
import com.wristo.modules.seller.service.AdminListingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/admin/listings")
@PreAuthorize("hasRole('ADMIN')")
@SecurityRequirement(name = "BearerAuth")
@Tag(name = "Admin Listings", description = "Admin Catalog Listing Governance, Audits & Approvals")
public class AdminListingController {

    private final AdminListingService adminListingService;

    public AdminListingController(AdminListingService adminListingService) {
        this.adminListingService = adminListingService;
    }

    @GetMapping
    @Operation(summary = "Get all marketplace listings", description = "Retrieves paginated listings across all seller boutiques with optional status filter")
    public ResponseEntity<ApiResponse<PageResponse<SellerListingResponse>>> getAllListings(
            @RequestParam(required = false) ListingStatus status,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit) {
        Pageable pageable = PageRequest.of(Math.max(0, page - 1), limit);
        PageResponse<SellerListingResponse> response = adminListingService.getAllListings(status, pageable);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/{id}/approve")
    @Operation(summary = "Approve seller listing", description = "Approves a pending commercial listing for live marketplace trading")
    public ResponseEntity<ApiResponse<SellerListingResponse>> approveListing(@PathVariable UUID id) {
        SellerListingResponse response = adminListingService.approveListing(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/{id}/reject")
    @Operation(summary = "Reject seller listing", description = "Rejects a seller listing with a descriptive reason")
    public ResponseEntity<ApiResponse<SellerListingResponse>> rejectListing(
            @PathVariable UUID id,
            @Valid @RequestBody AdminListingApprovalRequest request) {
        SellerListingResponse response = adminListingService.rejectListing(id, request.getRejectionReason());
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
