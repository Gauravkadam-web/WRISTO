package com.wristo.modules.seller.controller;

import com.wristo.common.dto.ApiResponse;
import com.wristo.common.dto.PageResponse;
import com.wristo.modules.seller.dto.CreateSellerListingRequest;
import com.wristo.modules.seller.dto.SellerListingResponse;
import com.wristo.modules.seller.dto.UpdateSellerListingRequest;
import com.wristo.modules.seller.service.SellerListingService;
import com.wristo.security.model.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/seller/listings")
@PreAuthorize("hasAnyRole('SELLER', 'SELLER_STAFF', 'ADMIN')")
@SecurityRequirement(name = "BearerAuth")
@Tag(name = "Seller Listings", description = "Seller Boutique Watch Offer & Commercial Listing APIs")
public class SellerListingController {

    private final SellerListingService sellerListingService;

    public SellerListingController(SellerListingService sellerListingService) {
        this.sellerListingService = sellerListingService;
    }

    @PostMapping
    @Operation(summary = "Create watch offer listing", description = "Publishes a commercial watch offer by a verified seller boutique with initial inventory")
    public ResponseEntity<ApiResponse<SellerListingResponse>> createListing(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CreateSellerListingRequest request) {
        SellerListingResponse listing = sellerListingService.createListing(principal, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Seller listing created successfully", listing));
    }

    @GetMapping
    @Operation(summary = "Get boutique listings", description = "Retrieves paginated commercial watch listings for the authenticated seller")
    public ResponseEntity<ApiResponse<PageResponse<SellerListingResponse>>> getSellerListings(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit) {
        Pageable pageable = PageRequest.of(Math.max(0, page - 1), limit);
        PageResponse<SellerListingResponse> response = sellerListingService.getSellerListings(principal, pageable);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get listing by ID", description = "Retrieves details of a specific commercial listing owned by the seller")
    public ResponseEntity<ApiResponse<SellerListingResponse>> getListingById(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID id) {
        SellerListingResponse response = sellerListingService.getListingById(principal, id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update watch offer listing", description = "Updates price, warranty, condition, and commercial details for an existing listing")
    public ResponseEntity<ApiResponse<SellerListingResponse>> updateListing(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID id,
            @Valid @RequestBody UpdateSellerListingRequest request) {
        SellerListingResponse response = sellerListingService.updateListing(principal, id, request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Toggle listing active status", description = "Activates or deactivates an existing commercial watch listing")
    public ResponseEntity<ApiResponse<SellerListingResponse>> toggleListingStatus(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID id,
            @RequestParam boolean active) {
        SellerListingResponse response = sellerListingService.toggleListingStatus(principal, id, active);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
