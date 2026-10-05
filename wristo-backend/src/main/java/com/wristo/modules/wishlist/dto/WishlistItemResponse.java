package com.wristo.modules.wishlist.dto;

import com.wristo.modules.catalog.entity.Watch;
import com.wristo.modules.wishlist.entity.WishlistItem;
import java.math.BigDecimal;
import java.time.Instant;

public record WishlistItemResponse(
        String id,
        String watchId,
        String model,
        String brandName,
        BigDecimal price,
        BigDecimal originalPrice,
        String imageUrl,
        String categoryName,
        String movement,
        String style,
        BigDecimal rating,
        Integer stockCount,
        Boolean inStock,
        Instant addedAt
) {
    public static WishlistItemResponse from(WishlistItem item) {
        Watch watch = item.getWatch();
        boolean inStock = watch.getStockCount() != null && watch.getStockCount() > 0;

        return new WishlistItemResponse(
                item.getId(),
                watch.getId(),
                watch.getModel(),
                watch.getBrandName(),
                watch.getPrice(),
                watch.getOriginalPrice(),
                watch.getImageUrl(),
                watch.getCategoryName(),
                watch.getMovement(),
                watch.getStyle(),
                watch.getRating(),
                watch.getStockCount() != null ? watch.getStockCount() : 0,
                inStock,
                item.getCreatedAt()
        );
    }
}
