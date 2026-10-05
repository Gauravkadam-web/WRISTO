package com.wristo.modules.provenance.controller;

import com.wristo.common.dto.ApiResponse;
import com.wristo.modules.provenance.dto.CreateServiceRecordRequest;
import com.wristo.modules.provenance.dto.WatchServiceRecordResponse;
import com.wristo.modules.provenance.service.ProvenanceService;
import com.wristo.security.model.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin/provenance")
@Tag(name = "Admin Provenance & Horological Service", description = "Admin entry for certified horological servicing, rate audits, and restorations")
public class AdminProvenanceController {

    private final ProvenanceService provenanceService;

    public AdminProvenanceController(ProvenanceService provenanceService) {
        this.provenanceService = provenanceService;
    }

    @PostMapping("/service-record")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @Operation(summary = "Append a certified Swiss watch service record to a timepiece provenance ledger")
    public ResponseEntity<ApiResponse<WatchServiceRecordResponse>> addServiceRecord(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CreateServiceRecordRequest request
    ) {
        String adminUsername = principal != null ? principal.getUsername() : "Vault Director";
        WatchServiceRecordResponse record = provenanceService.addServiceRecord(request, adminUsername);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Certified horological service record appended successfully", record));
    }
}
