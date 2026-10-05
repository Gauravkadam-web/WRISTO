package com.wristo.modules.order.dto;

import com.wristo.modules.order.entity.OrderItem;
import java.math.BigDecimal;

public record OrderItemResponse(
        String id,
        String watchId,
        String sellerId,
        String sellerListingId,
        String watchModel,
        String watchBrand,
        String watchImageUrl,
        String movementType,
        String caseSize,
        Integer quantity,
        BigDecimal unitPrice,
        BigDecimal totalPrice
) {
    public static OrderItemResponse from(OrderItem item) {
        return new OrderItemResponse(
                item.getId(),
                item.getWatch() != null ? item.getWatch().getId() : null,
                item.getSeller() != null ? item.getSeller().getId() : null,
                item.getSellerListing() != null ? item.getSellerListing().getId().toString() : null,
                item.getWatchModel(),
                item.getWatchBrand(),
                item.getWatchImageUrl(),
                item.getMovementType(),
                item.getCaseSize(),
                item.getQuantity(),
                item.getUnitPrice(),
                item.getTotalPrice()
        );
    }
}
