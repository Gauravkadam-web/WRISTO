package com.wristo.modules.cart.dto;

import com.wristo.modules.cart.entity.CartItem;
import com.wristo.modules.catalog.entity.Watch;
import java.math.BigDecimal;

public record CartItemResponse(
        String id,
        String watchId,
        String model,
        String brandName,
        BigDecimal price,
        BigDecimal originalPrice,
        String imageUrl,
        String categoryName,
        String movement,
        String caseSize,
        String strap,
        String dial,
        Integer quantity,
        BigDecimal subtotal,
        Boolean inStock,
        Integer availableStock
) {
    public static CartItemResponse from(CartItem item) {
        Watch watch = item.getWatch();
        BigDecimal subtotal = item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
        boolean inStock = watch.getStockCount() != null && watch.getStockCount() >= item.getQuantity();

        return new CartItemResponse(
                item.getId(),
                watch.getId(),
                watch.getModel(),
                watch.getBrandName(),
                item.getUnitPrice(),
                watch.getOriginalPrice(),
                watch.getImageUrl(),
                watch.getCategoryName(),
                watch.getMovement(),
                watch.getCaseSize(),
                watch.getStrap(),
                watch.getDial(),
                item.getQuantity(),
                subtotal,
                inStock,
                watch.getStockCount() != null ? watch.getStockCount() : 0
        );
    }
}
