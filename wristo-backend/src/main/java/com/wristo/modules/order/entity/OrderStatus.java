package com.wristo.modules.order.entity;

public enum OrderStatus {
    PENDING_PAYMENT,
    PAYMENT_AUTHORIZED,
    CONFIRMED,
    PROCESSING_VAULT,
    DISPATCHED,
    DELIVERED,
    CANCELLED,
    REFUNDED
}
