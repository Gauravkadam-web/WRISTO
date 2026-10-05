package com.wristo.modules.account.controller;

import com.wristo.common.dto.ApiResponse;
import com.wristo.modules.account.dto.CollectorDashboardResponse;
import com.wristo.modules.account.dto.CollectorProfileResponse;
import com.wristo.modules.account.dto.UpdateCollectorProfileRequest;
import com.wristo.modules.account.service.AccountService;
import com.wristo.security.model.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/account")
@Tag(name = "Collector Account & VIP", description = "Collector profile, VIP tiering, preferences, and dashboard stats")
public class AccountController {

    private final AccountService accountService;

    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    @GetMapping("/profile")
    @Operation(summary = "Get authenticated collector profile and VIP tier")
    public ResponseEntity<ApiResponse<CollectorProfileResponse>> getProfile(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        CollectorProfileResponse profile = accountService.getProfile(principal);
        return ResponseEntity.ok(ApiResponse.success("Collector profile retrieved successfully", profile));
    }

    @PutMapping("/profile")
    @Operation(summary = "Update collector profile, preferences, and concierge notifications")
    public ResponseEntity<ApiResponse<CollectorProfileResponse>> updateProfile(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody UpdateCollectorProfileRequest request
    ) {
        CollectorProfileResponse profile = accountService.updateProfile(principal, request);
        return ResponseEntity.ok(ApiResponse.success("Collector profile updated successfully", profile));
    }

    @GetMapping("/dashboard")
    @Operation(summary = "Get aggregated collector dashboard overview with vault count, orders, and VIP status")
    public ResponseEntity<ApiResponse<CollectorDashboardResponse>> getDashboard(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        CollectorDashboardResponse dashboard = accountService.getDashboard(principal);
        return ResponseEntity.ok(ApiResponse.success("Collector dashboard telemetry retrieved successfully", dashboard));
    }
}
