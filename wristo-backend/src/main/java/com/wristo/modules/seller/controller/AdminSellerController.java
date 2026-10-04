package com.wristo.modules.seller.controller;

import com.wristo.common.dto.ApiResponse;
import com.wristo.common.dto.PageResponse;
import com.wristo.modules.seller.dto.SellerResponse;
import com.wristo.modules.seller.dto.SellerStatusUpdateRequest;
import com.wristo.modules.seller.entity.BrandAuthStatus;
import com.wristo.modules.seller.entity.DocumentVerificationStatus;
import com.wristo.modules.seller.entity.SellerStatus;
import com.wristo.modules.seller.service.AdminSellerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/admin/sellers")
@Tag(name = "Admin - Seller Management", description = "Administrative endpoints for reviewing, approving, and regulating seller boutique accounts")
@SecurityRequirement(name = "bearerAuth")
@PreAuthorize("hasRole('ADMIN')")
public class AdminSellerController {

    private final AdminSellerService adminSellerService;

    public AdminSellerController(AdminSellerService adminSellerService) {
        this.adminSellerService = adminSellerService;
    }

    @GetMapping
    @Operation(summary = "List all seller boutiques", description = "Administrative listing of sellers with optional status filter and pagination")
    public ResponseEntity<ApiResponse<PageResponse<SellerResponse>>> getAllSellers(
            @RequestParam(required = false) SellerStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDirection) {
        Sort sort = Sort.by(Sort.Direction.fromString(sortDirection), sortBy);
        PageResponse<SellerResponse> response = adminSellerService.getAllSellers(status, PageRequest.of(page, size, sort));
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get seller details", description = "Retrieves full seller profile with KYC documents, staff and brand authorizations")
    public ResponseEntity<ApiResponse<SellerResponse>> getSellerById(@PathVariable String id) {
        SellerResponse response = adminSellerService.getSellerById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update seller review status", description = "Approves (VERIFIED), rejects, or suspends a seller boutique account")
    public ResponseEntity<ApiResponse<SellerResponse>> updateSellerStatus(
            @PathVariable String id,
            @Valid @RequestBody SellerStatusUpdateRequest request) {
        SellerResponse response = adminSellerService.updateSellerStatus(id, request);
        return ResponseEntity.ok(ApiResponse.success("Seller status updated successfully", response));
    }

    @PatchMapping("/{id}/documents/{docId}/verify")
    @Operation(summary = "Verify KYC document", description = "Marks a seller KYC document as APPROVED or REJECTED")
    public ResponseEntity<ApiResponse<SellerResponse.SellerDocumentDto>> verifyDocument(
            @PathVariable String id,
            @PathVariable UUID docId,
            @RequestParam DocumentVerificationStatus status) {
        SellerResponse.SellerDocumentDto response = adminSellerService.verifyDocument(id, docId, status);
        return ResponseEntity.ok(ApiResponse.success("Document verification updated", response));
    }

    @PatchMapping("/{id}/brand-authorizations/{authId}/verify")
    @Operation(summary = "Verify brand authorization", description = "Approves or rejects seller authorization for a luxury watch brand")
    public ResponseEntity<ApiResponse<SellerResponse.SellerBrandAuthDto>> verifyBrandAuthorization(
            @PathVariable String id,
            @PathVariable UUID authId,
            @RequestParam BrandAuthStatus status) {
        SellerResponse.SellerBrandAuthDto response = adminSellerService.verifyBrandAuthorization(id, authId, status);
        return ResponseEntity.ok(ApiResponse.success("Brand authorization status updated", response));
    }
}
