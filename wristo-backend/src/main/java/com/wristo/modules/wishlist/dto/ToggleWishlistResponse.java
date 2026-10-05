package com.wristo.modules.wishlist.dto;

public record ToggleWishlistResponse(
        String watchId,
        Boolean added,
        Boolean inWishlist,
        String message
) {
}
