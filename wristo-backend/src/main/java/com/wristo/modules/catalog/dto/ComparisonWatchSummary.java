package com.wristo.modules.catalog.dto;

import com.wristo.modules.catalog.entity.Watch;
import java.math.BigDecimal;

public record ComparisonWatchSummary(
        String id,
        String model,
        String brandName,
        BigDecimal price,
        BigDecimal originalPrice,
        String imageUrl,
        String categoryName,
        BigDecimal rating,
        Boolean inStock,
        Integer stockCount
) {
    public static ComparisonWatchSummary from(Watch watch) {
        boolean inStock = watch.getStockCount() != null && watch.getStockCount() > 0;
        return new ComparisonWatchSummary(
                watch.getId(),
                watch.getModel(),
                watch.getBrandName(),
                watch.getPrice(),
                watch.getOriginalPrice(),
                watch.getImageUrl(),
                watch.getCategoryName(),
                watch.getRating(),
                inStock,
                watch.getStockCount() != null ? watch.getStockCount() : 0
        );
    }
}
