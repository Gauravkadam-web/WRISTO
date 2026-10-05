package com.wristo.modules.provenance.controller;

import com.wristo.common.dto.ApiResponse;
import com.wristo.modules.provenance.dto.AuthenticityCertificateResponse;
import com.wristo.modules.provenance.dto.ProvenanceRecordResponse;
import com.wristo.modules.provenance.dto.PublicCertificateVerificationResponse;
import com.wristo.modules.provenance.service.CertificateService;
import com.wristo.modules.provenance.service.ProvenanceService;
import com.wristo.security.model.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/provenance")
@Tag(name = "Provenance & Digital Certificates", description = "Collector digital vault, authenticity certificates, provenance chain, and verification")
public class ProvenanceController {

    private final ProvenanceService provenanceService;
    private final CertificateService certificateService;

    public ProvenanceController(ProvenanceService provenanceService, CertificateService certificateService) {
        this.provenanceService = provenanceService;
        this.certificateService = certificateService;
    }

    @GetMapping("/my-vault")
    @Operation(summary = "Get current authenticated collector's vault timepieces with certificates & service records")
    public ResponseEntity<ApiResponse<List<ProvenanceRecordResponse>>> getMyVault(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        List<ProvenanceRecordResponse> vault = provenanceService.getMyVault(principal);
        return ResponseEntity.ok(ApiResponse.success("Collector vault ledger retrieved successfully", vault));
    }

    @GetMapping("/certificate/{certificateNumber}")
    @Operation(summary = "Get full digital authenticity certificate details by certificate number")
    public ResponseEntity<ApiResponse<AuthenticityCertificateResponse>> getCertificate(
            @PathVariable String certificateNumber,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        AuthenticityCertificateResponse cert = certificateService.getCertificateByNumber(certificateNumber, principal);
        return ResponseEntity.ok(ApiResponse.success("Authenticity certificate retrieved successfully", cert));
    }

    @GetMapping("/verify/{certificateNumber}")
    @Operation(summary = "Public cryptographic authenticity certificate verification for QR code scanners")
    public ResponseEntity<ApiResponse<PublicCertificateVerificationResponse>> verifyCertificate(
            @PathVariable String certificateNumber
    ) {
        PublicCertificateVerificationResponse verification = certificateService.verifyPublicCertificate(certificateNumber);
        return ResponseEntity.ok(ApiResponse.success("Public certificate verification resolved", verification));
    }

    @GetMapping("/watch/{watchId}/history")
    @Operation(summary = "Get complete chronological provenance ownership and service history of a watch")
    public ResponseEntity<ApiResponse<List<ProvenanceRecordResponse>>> getWatchHistory(
            @PathVariable String watchId
    ) {
        List<ProvenanceRecordResponse> history = provenanceService.getWatchHistory(watchId);
        return ResponseEntity.ok(ApiResponse.success("Watch provenance history chain retrieved successfully", history));
    }
}
