package com.wristo.modules.order.dto;

import com.wristo.modules.order.entity.OrderItem;
import java.math.BigDecimal;

public record OrderItemResponse(
        String id,
        String watchId,
        String productId,
        String sellerId,
        String sellerListingId,
        String watchModel,
        String model,
        String watchBrand,
        String brand,
        String watchImageUrl,
        String image,
        String movementType,
        String caseSize,
        Integer quantity,
        BigDecimal unitPrice,
        BigDecimal price,
        BigDecimal totalPrice
) {
    public static OrderItemResponse from(OrderItem item) {
        String watchId = item.getWatch() != null ? item.getWatch().getId() : null;
        return new OrderItemResponse(
                item.getId(),
                watchId,
                watchId,
                item.getSeller() != null ? item.getSeller().getId() : null,
                item.getSellerListing() != null ? item.getSellerListing().getId().toString() : null,
                item.getWatchModel(),
                item.getWatchModel(),
                item.getWatchBrand(),
                item.getWatchBrand(),
                item.getWatchImageUrl(),
                item.getWatchImageUrl(),
                item.getMovementType(),
                item.getCaseSize(),
                item.getQuantity(),
                item.getUnitPrice(),
                item.getUnitPrice(),
                item.getTotalPrice()
        );
    }
}
