package com.wristo.modules.order.dto;

import com.wristo.modules.checkout.dto.CustomerAddressDto;
import com.wristo.modules.order.entity.Order;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record OrderResponse(
        String id,
        String orderNumber,
        String orderId,
        String certificateNumber,
        String certificateId,
        String userId,
        String customerName,
        String customerEmail,
        String customerPhone,
        CustomerAddressDto address,
        String deliveryTier,
        String deliveryNotes,
        Boolean isGiftWrapped,
        String giftMessage,
        String couponCode,
        BigDecimal subtotalAmount,
        BigDecimal subtotal,
        BigDecimal discountAmount,
        BigDecimal discount,
        BigDecimal giftWrapFee,
        BigDecimal shippingFee,
        BigDecimal taxAmount,
        BigDecimal totalAmount,
        BigDecimal total,
        String currency,
        String status,
        String paymentStatus,
        String paymentMethod,
        String trackingNumber,
        String courierPartner,
        Instant estimatedDeliveryAt,
        Instant placedAt,
        Instant createdAt,
        Instant updatedAt,
        List<OrderItemResponse> items,
        List<OrderStatusHistoryResponse> statusHistory
) {
    public static OrderResponse from(Order order) {
        CustomerAddressDto addressDto = new CustomerAddressDto(
                order.getCustomerName(),
                order.getCustomerEmail(),
                order.getCustomerPhone(),
                order.getShippingPincode(),
                order.getShippingAddressLine1(),
                order.getShippingAddressLine2(),
                order.getShippingCity(),
                order.getShippingState(),
                order.getShippingLandmark(),
                order.getDeliveryNotes()
        );

        List<OrderItemResponse> itemResponses = order.getItems() != null
                ? order.getItems().stream().map(OrderItemResponse::from).toList()
                : List.of();

        List<OrderStatusHistoryResponse> historyResponses = order.getStatusHistory() != null
                ? order.getStatusHistory().stream().map(OrderStatusHistoryResponse::from).toList()
                : List.of();

        return new OrderResponse(
                order.getId(),
                order.getOrderNumber(),
                order.getOrderNumber(),
                order.getCertificateNumber(),
                order.getCertificateNumber(),
                order.getUser() != null ? order.getUser().getId().toString() : null,
                order.getCustomerName(),
                order.getCustomerEmail(),
                order.getCustomerPhone(),
                addressDto,
                order.getDeliveryTier(),
                order.getDeliveryNotes(),
                order.getIsGiftWrapped(),
                order.getGiftMessage(),
                order.getCouponCode(),
                order.getSubtotalAmount(),
                order.getSubtotalAmount(),
                order.getDiscountAmount(),
                order.getDiscountAmount(),
                order.getGiftWrapFee(),
                order.getShippingFee(),
                order.getTaxAmount(),
                order.getTotalAmount(),
                order.getTotalAmount(),
                order.getCurrency(),
                order.getStatus() != null ? order.getStatus().name() : null,
                order.getPaymentStatus() != null ? order.getPaymentStatus().name() : null,
                order.getPaymentMethod() != null ? order.getPaymentMethod().name() : null,
                order.getTrackingNumber(),
                order.getCourierPartner(),
                order.getEstimatedDeliveryAt(),
                order.getPlacedAt(),
                order.getCreatedAt(),
                order.getUpdatedAt(),
                itemResponses,
                historyResponses
        );
    }
}
