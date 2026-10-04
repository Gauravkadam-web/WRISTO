package com.wristo.modules.seller.controller;

import com.wristo.common.dto.ApiResponse;
import com.wristo.modules.seller.dto.*;
import com.wristo.modules.seller.service.SellerService;
import com.wristo.security.model.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/seller")
@Tag(name = "Seller Portal", description = "Endpoints for luxury watch boutique onboarding, profile management, and staff operations")
@SecurityRequirement(name = "bearerAuth")
public class SellerController {

    private final SellerService sellerService;

    public SellerController(SellerService sellerService) {
        this.sellerService = sellerService;
    }

    @PostMapping("/onboard")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Submit seller onboarding application", description = "Registers a new luxury watch boutique and sets current user as primary OWNER")
    public ResponseEntity<ApiResponse<SellerResponse>> onboardSeller(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody SellerOnboardRequest request) {
        SellerResponse response = sellerService.onboardSeller(currentUser, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Seller onboarding application submitted successfully", response));
    }

    @GetMapping("/me")
    @PreAuthorize("hasAnyRole('SELLER', 'SELLER_STAFF', 'ADMIN')")
    @Operation(summary = "Get current seller boutique profile", description = "Retrieves profile and verification details of the caller's affiliated seller organization")
    public ResponseEntity<ApiResponse<SellerResponse>> getMySellerProfile(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        SellerResponse response = sellerService.getMySellerProfile(currentUser);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/me")
    @PreAuthorize("hasAnyRole('SELLER', 'SELLER_STAFF', 'ADMIN')")
    @Operation(summary = "Update seller boutique profile", description = "Updates boutique details (requires OWNER or ADMIN staff role)")
    public ResponseEntity<ApiResponse<SellerResponse>> updateMySellerProfile(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody SellerOnboardRequest request) {
        SellerResponse response = sellerService.updateMySellerProfile(currentUser, request);
        return ResponseEntity.ok(ApiResponse.success("Boutique profile updated successfully", response));
    }

    @GetMapping("/staff")
    @PreAuthorize("hasAnyRole('SELLER', 'SELLER_STAFF', 'ADMIN')")
    @Operation(summary = "List boutique staff members", description = "Retrieves all authorized staff accounts under this boutique")
    public ResponseEntity<ApiResponse<List<SellerStaffResponse>>> getStaff(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        List<SellerStaffResponse> response = sellerService.getStaff(currentUser);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/staff")
    @PreAuthorize("hasAnyRole('SELLER', 'SELLER_STAFF', 'ADMIN')")
    @Operation(summary = "Add staff member to boutique", description = "Assigns an existing user to boutique staff with specific role (OWNER/ADMIN only)")
    public ResponseEntity<ApiResponse<SellerStaffResponse>> addStaff(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody SellerStaffRequest request) {
        SellerStaffResponse response = sellerService.addStaff(currentUser, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Staff member added successfully", response));
    }

    @DeleteMapping("/staff/{userId}")
    @PreAuthorize("hasAnyRole('SELLER', 'SELLER_STAFF', 'ADMIN')")
    @Operation(summary = "Remove staff member", description = "Revokes staff access for specified user (OWNER/ADMIN only)")
    public ResponseEntity<ApiResponse<Void>> removeStaff(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable UUID userId) {
        sellerService.removeStaff(currentUser, userId);
        return ResponseEntity.ok(ApiResponse.success("Staff member removed successfully", null));
    }

    @PostMapping("/documents")
    @PreAuthorize("hasAnyRole('SELLER', 'SELLER_STAFF', 'ADMIN')")
    @Operation(summary = "Upload verification document", description = "Attaches a KYC or business document URL for verification review")
    public ResponseEntity<ApiResponse<SellerResponse.SellerDocumentDto>> uploadDocument(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody DocumentUploadRequest request) {
        SellerResponse.SellerDocumentDto response = sellerService.uploadDocument(currentUser, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Document uploaded successfully for review", response));
    }

    @PostMapping("/brand-authorizations")
    @PreAuthorize("hasAnyRole('SELLER', 'SELLER_STAFF', 'ADMIN')")
    @Operation(summary = "Request brand authorization", description = "Submits authorization request to retail a specific luxury watch brand")
    public ResponseEntity<ApiResponse<SellerResponse.SellerBrandAuthDto>> requestBrandAuthorization(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody BrandAuthorizationRequest request) {
        SellerResponse.SellerBrandAuthDto response = sellerService.requestBrandAuthorization(currentUser, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Brand authorization request submitted", response));
    }
}
