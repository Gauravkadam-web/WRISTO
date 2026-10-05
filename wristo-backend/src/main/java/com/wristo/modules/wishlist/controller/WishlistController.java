package com.wristo.modules.wishlist.controller;

import com.wristo.common.dto.ApiResponse;
import com.wristo.modules.cart.dto.CartResponse;
import com.wristo.modules.wishlist.dto.ToggleWishlistResponse;
import com.wristo.modules.wishlist.dto.WishlistResponse;
import com.wristo.modules.wishlist.service.WishlistService;
import com.wristo.security.model.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/wishlist")
@Tag(name = "Wishlist", description = "Collector Vault Wishlist Management APIs")
@SecurityRequirement(name = "bearerAuth")
@PreAuthorize("isAuthenticated()")
public class WishlistController {

    private final WishlistService wishlistService;

    public WishlistController(WishlistService wishlistService) {
        this.wishlistService = wishlistService;
    }

    @GetMapping
    @Operation(summary = "Get collector wishlist", description = "Retrieves saved timepieces with real-time stock and pricing")
    public ResponseEntity<ApiResponse<WishlistResponse>> getWishlist(@AuthenticationPrincipal UserPrincipal principal) {
        WishlistResponse response = wishlistService.getWishlist(principal.getId());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/toggle/{watchId}")
    @Operation(summary = "Toggle timepiece in wishlist", description = "Adds watch if not present, or removes if already in wishlist")
    public ResponseEntity<ApiResponse<ToggleWishlistResponse>> toggleWishlist(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable String watchId
    ) {
        ToggleWishlistResponse response = wishlistService.toggleWishlist(principal.getId(), watchId);
        return ResponseEntity.ok(ApiResponse.success(response.message(), response));
    }

    @PostMapping("/items/{watchId}")
    @Operation(summary = "Add timepiece to wishlist", description = "Explicitly saves timepiece to wishlist")
    public ResponseEntity<ApiResponse<WishlistResponse>> addItem(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable String watchId
    ) {
        WishlistResponse response = wishlistService.addItem(principal.getId(), watchId);
        return ResponseEntity.ok(ApiResponse.success("Timepiece added to wishlist", response));
    }

    @DeleteMapping("/items/{watchId}")
    @Operation(summary = "Remove timepiece from wishlist", description = "Removes specific timepiece from wishlist")
    public ResponseEntity<ApiResponse<WishlistResponse>> removeItem(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable String watchId
    ) {
        WishlistResponse response = wishlistService.removeItem(principal.getId(), watchId);
        return ResponseEntity.ok(ApiResponse.success("Timepiece removed from wishlist", response));
    }

    @DeleteMapping
    @Operation(summary = "Clear wishlist", description = "Removes all saved timepieces from wishlist")
    public ResponseEntity<ApiResponse<WishlistResponse>> clearWishlist(@AuthenticationPrincipal UserPrincipal principal) {
        WishlistResponse response = wishlistService.clearWishlist(principal.getId());
        return ResponseEntity.ok(ApiResponse.success("Wishlist cleared", response));
    }

    @GetMapping({"/check/{watchId}", "/has/{watchId}"})
    @Operation(summary = "Check if timepiece is in wishlist", description = "Returns true if watch is saved in collector wishlist")
    public ResponseEntity<ApiResponse<Boolean>> checkWishlist(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable String watchId
    ) {
        boolean inWishlist = wishlistService.isInWishlist(principal.getId(), watchId);
        return ResponseEntity.ok(ApiResponse.success(inWishlist));
    }

    @PostMapping({"/move-to-cart/{watchId}", "/items/{watchId}/move-to-cart"})
    @Operation(summary = "Move timepiece from wishlist to cart", description = "Atomically adds watch to shopping cart and removes it from wishlist")
    public ResponseEntity<ApiResponse<CartResponse>> moveToCart(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable String watchId
    ) {
        CartResponse response = wishlistService.moveToCart(principal.getId(), watchId);
        return ResponseEntity.ok(ApiResponse.success("Timepiece moved to shopping cart", response));
    }
}
