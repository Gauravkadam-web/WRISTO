package com.wristo.modules.wishlist.dto;

import java.util.List;

public record WishlistResponse(
        String id,
        List<WishlistItemResponse> items,
        Integer totalItems
) {
}
