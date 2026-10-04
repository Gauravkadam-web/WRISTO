package com.wristo.modules.auth.controller;

import com.wristo.common.dto.ApiResponse;
import com.wristo.modules.auth.dto.AuthResponse;
import com.wristo.modules.auth.dto.LoginRequest;
import com.wristo.modules.auth.dto.RefreshTokenRequest;
import com.wristo.modules.auth.dto.RegisterRequest;
import com.wristo.modules.auth.service.AuthService;
import com.wristo.security.model.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@Tag(name = "Authentication & Identity", description = "Endpoints for collector registration, JWT authentication, token refresh, and identity verification.")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    @Operation(summary = "Register New Collector Account", description = "Creates a new client collector account and returns a JWT access & refresh token pair.")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return new ResponseEntity<>(ApiResponse.success("Account registered successfully", response), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    @Operation(summary = "Authenticate & Obtain JWT Tokens", description = "Authenticates client credentials and returns JWT access & refresh tokens.")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Authentication successful", response));
    }

    @PostMapping("/refresh-token")
    @Operation(summary = "Rotate Access Token", description = "Exchanges a valid refresh token for a newly signed access token.")
    public ResponseEntity<ApiResponse<AuthResponse>> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        AuthResponse response = authService.refreshToken(request.getRefreshToken());
        return ResponseEntity.ok(ApiResponse.success("Access token refreshed successfully", response));
    }

    @PostMapping("/logout")
    @Operation(summary = "Revoke Active Session", description = "Revokes active refresh token.")
    public ResponseEntity<ApiResponse<Void>> logout(@RequestBody(required = false) RefreshTokenRequest request) {
        if (request != null && request.getRefreshToken() != null) {
            authService.logout(request.getRefreshToken());
        }
        return ResponseEntity.ok(ApiResponse.success("Session logged out successfully", null));
    }

    @GetMapping("/me")
    @Operation(summary = "Get Current Collector Identity", description = "Returns the identity details of the authenticated bearer token.")
    public ResponseEntity<ApiResponse<AuthResponse.UserDetailsDto>> getCurrentUser(@AuthenticationPrincipal UserPrincipal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        AuthResponse.UserDetailsDto userDto = new AuthResponse.UserDetailsDto(
                principal.getId(),
                principal.getUsername(),
                principal.getFullName(),
                principal.getRole(),
                null,
                null
        );
        return ResponseEntity.ok(ApiResponse.success(userDto));
    }
}
