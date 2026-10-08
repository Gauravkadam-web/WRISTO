package com.wristo.modules.order.entity;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum PaymentMethod {
    UPI,
    CARD,
    NETBANKING,
    COD,
    RAZORPAY,
    STRIPE;

    @JsonCreator
    public static PaymentMethod fromString(String value) {
        if (value == null || value.isBlank()) {
            return CARD;
        }
        String clean = value.trim().toUpperCase();
        if (clean.contains("UPI")) {
            return UPI;
        }
        if (clean.contains("CARD") || clean.contains("CREDIT") || clean.contains("DEBIT") || clean.contains("STRIPE_CARD")) {
            return CARD;
        }
        if (clean.contains("NET") || clean.contains("BANKING")) {
            return NETBANKING;
        }
        if (clean.contains("COD") || clean.contains("CASH") || clean.contains("ESCROW")) {
            return COD;
        }
        try {
            return PaymentMethod.valueOf(clean);
        } catch (IllegalArgumentException ex) {
            return CARD;
        }
    }
}
