package com.wristo.modules.auth.controller;

import com.wristo.common.dto.ApiResponse;
import com.wristo.modules.auth.dto.UserAddressDto;
import com.wristo.modules.auth.dto.UserProfileResponse;
import com.wristo.modules.auth.service.UserService;
import com.wristo.security.model.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
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
@RequestMapping("/user")
@PreAuthorize("isAuthenticated()")
@Tag(name = "Customer & Addresses", description = "Endpoints for collector profile inspection, updates, and address book management.")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/profile")
    @Operation(summary = "Get Customer Profile", description = "Retrieves profile details for the authenticated user.")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getProfile(@AuthenticationPrincipal UserPrincipal principal) {
        UserProfileResponse profile = userService.getProfile(principal.getId());
        return ResponseEntity.ok(ApiResponse.success(profile));
    }

    @PutMapping("/profile")
    @Operation(summary = "Update Customer Profile", description = "Updates personal details (full name, phone, avatar) for authenticated user.")
    public ResponseEntity<ApiResponse<UserProfileResponse>> updateProfile(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false) String fullName,
            @RequestParam(required = false) String phone,
            @RequestParam(required = false) String avatarUrl
    ) {
        UserProfileResponse profile = userService.updateProfile(principal.getId(), fullName, phone, avatarUrl);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", profile));
    }

    @GetMapping("/addresses")
    @Operation(summary = "Get All Saved Delivery Addresses", description = "Retrieves all saved addresses for the authenticated customer.")
    public ResponseEntity<ApiResponse<List<UserAddressDto>>> getAddresses(@AuthenticationPrincipal UserPrincipal principal) {
        List<UserAddressDto> addresses = userService.getAddresses(principal.getId());
        return ResponseEntity.ok(ApiResponse.success(addresses));
    }

    @PostMapping("/addresses")
    @Operation(summary = "Add New Delivery Address", description = "Saves a new primary residence or vault address.")
    public ResponseEntity<ApiResponse<UserAddressDto>> addAddress(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody UserAddressDto dto
    ) {
        UserAddressDto saved = userService.addAddress(principal.getId(), dto);
        return new ResponseEntity<>(ApiResponse.success("Address added successfully", saved), HttpStatus.CREATED);
    }

    @PutMapping("/addresses/{id}")
    @Operation(summary = "Update Saved Address", description = "Modifies an existing saved delivery address.")
    public ResponseEntity<ApiResponse<UserAddressDto>> updateAddress(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID id,
            @Valid @RequestBody UserAddressDto dto
    ) {
        UserAddressDto updated = userService.updateAddress(principal.getId(), id, dto);
        return ResponseEntity.ok(ApiResponse.success("Address updated successfully", updated));
    }

    @DeleteMapping("/addresses/{id}")
    @Operation(summary = "Delete Saved Address", description = "Removes a saved address from the customer vault.")
    public ResponseEntity<ApiResponse<Void>> deleteAddress(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID id
    ) {
        userService.deleteAddress(principal.getId(), id);
        return ResponseEntity.ok(ApiResponse.success("Address deleted successfully", null));
    }

    @PatchMapping("/addresses/{id}/default")
    @Operation(summary = "Set Default Delivery Address", description = "Sets specified address as the default delivery destination.")
    public ResponseEntity<ApiResponse<UserAddressDto>> setDefaultAddress(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID id
    ) {
        UserAddressDto defaultAddr = userService.setDefaultAddress(principal.getId(), id);
        return ResponseEntity.ok(ApiResponse.success("Default address updated", defaultAddr));
    }
}
