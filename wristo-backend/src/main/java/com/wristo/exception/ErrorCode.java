package com.wristo.exception;

import org.springframework.http.HttpStatus;

public enum ErrorCode {

    // Common & Validation
    INTERNAL_SERVER_ERROR("INTERNAL_SERVER_ERROR", "An unexpected internal server error occurred", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_REQUEST_DATA("INVALID_REQUEST_DATA", "The provided request data contains validation errors", HttpStatus.BAD_REQUEST),
    RESOURCE_NOT_FOUND("RESOURCE_NOT_FOUND", "The requested resource was not found", HttpStatus.NOT_FOUND),
    UNAUTHORIZED_ACCESS("UNAUTHORIZED_ACCESS", "Authentication token is missing, invalid or expired", HttpStatus.UNAUTHORIZED),
    FORBIDDEN_OPERATION("FORBIDDEN_OPERATION", "You do not possess sufficient permissions for this operation", HttpStatus.FORBIDDEN),

    // Catalog & Watch Domain
    WATCH_NOT_FOUND("WATCH_NOT_FOUND", "Timepiece record was not found in catalog", HttpStatus.NOT_FOUND),
    BRAND_NOT_FOUND("BRAND_NOT_FOUND", "Brand house not found", HttpStatus.NOT_FOUND),
    CATEGORY_NOT_FOUND("CATEGORY_NOT_FOUND", "Watch category not found", HttpStatus.NOT_FOUND),
    INSUFFICIENT_INVENTORY("INSUFFICIENT_INVENTORY", "Insufficient inventory available to fulfill reservation", HttpStatus.CONFLICT),

    // Auth & Identity Domain
    USER_ALREADY_EXISTS("USER_ALREADY_EXISTS", "A user account with this email address already exists", HttpStatus.CONFLICT),
    INVALID_CREDENTIALS("INVALID_CREDENTIALS", "Invalid email or password combination", HttpStatus.UNAUTHORIZED),

    // Seller Domain
    SELLER_ALREADY_EXISTS("SELLER_ALREADY_EXISTS", "A seller boutique with this GSTIN or business entity already exists", HttpStatus.CONFLICT),
    SELLER_NOT_FOUND("SELLER_NOT_FOUND", "Seller organization record was not found", HttpStatus.NOT_FOUND),
    SELLER_NOT_APPROVED("SELLER_NOT_APPROVED", "Seller organization is not verified for marketplace trading", HttpStatus.FORBIDDEN),
    SELLER_STAFF_ALREADY_EXISTS("SELLER_STAFF_ALREADY_EXISTS", "User is already affiliated with this seller organization", HttpStatus.CONFLICT),
    SELLER_STAFF_NOT_FOUND("SELLER_STAFF_NOT_FOUND", "Staff member not found in seller organization", HttpStatus.NOT_FOUND),
    DOCUMENT_NOT_FOUND("DOCUMENT_NOT_FOUND", "Seller verification document was not found", HttpStatus.NOT_FOUND),
    BRAND_AUTHORIZATION_ALREADY_EXISTS("BRAND_AUTHORIZATION_ALREADY_EXISTS", "Brand authorization already requested or granted for this brand", HttpStatus.CONFLICT),
    BRAND_AUTHORIZATION_NOT_FOUND("BRAND_AUTHORIZATION_NOT_FOUND", "Brand authorization record not found", HttpStatus.NOT_FOUND),
    SELLER_NOT_AUTHORIZED_FOR_BRAND("SELLER_NOT_AUTHORIZED_FOR_BRAND", "Seller is not authorized to sell this brand", HttpStatus.FORBIDDEN),

    // Listing & Inventory Domain
    SELLER_LISTING_NOT_FOUND("SELLER_LISTING_NOT_FOUND", "Seller listing not found", HttpStatus.NOT_FOUND),
    SELLER_LISTING_ALREADY_EXISTS("SELLER_LISTING_ALREADY_EXISTS", "A listing with this SKU already exists for this seller", HttpStatus.CONFLICT),
    INVENTORY_NOT_FOUND("INVENTORY_NOT_FOUND", "Inventory record not found", HttpStatus.NOT_FOUND),
    RESERVATION_NOT_FOUND("RESERVATION_NOT_FOUND", "Stock reservation record not found", HttpStatus.NOT_FOUND),
    RESERVATION_EXPIRED("RESERVATION_EXPIRED", "Stock reservation has expired", HttpStatus.CONFLICT),
    INVALID_INVENTORY_ADJUSTMENT("INVALID_INVENTORY_ADJUSTMENT", "Inventory quantity adjustment would cause negative stock", HttpStatus.BAD_REQUEST),

    // Coupon & Promotion Domain
    COUPON_NOT_FOUND("COUPON_NOT_FOUND", "Promotional coupon code not found or inactive", HttpStatus.NOT_FOUND),
    COUPON_EXPIRED("COUPON_EXPIRED", "Promotional coupon code has expired", HttpStatus.BAD_REQUEST),
    COUPON_NOT_STARTED("COUPON_NOT_STARTED", "Promotional coupon is not yet active", HttpStatus.BAD_REQUEST),
    COUPON_MIN_SUBTOTAL_NOT_MET("COUPON_MIN_SUBTOTAL_NOT_MET", "Order subtotal does not meet the minimum requirement for this coupon", HttpStatus.BAD_REQUEST),
    COUPON_MIN_ORDER_UNMET("COUPON_MIN_ORDER_UNMET", "Order subtotal does not meet the minimum requirement for this coupon", HttpStatus.BAD_REQUEST),
    COUPON_USAGE_LIMIT_REACHED("COUPON_USAGE_LIMIT_REACHED", "Promotional coupon usage limit has been reached", HttpStatus.BAD_REQUEST),
    COUPON_ALREADY_EXISTS("COUPON_ALREADY_EXISTS", "A coupon with this code already exists", HttpStatus.CONFLICT),

    // Cart Domain
    CART_NOT_FOUND("CART_NOT_FOUND", "Shopping cart not found", HttpStatus.NOT_FOUND),
    CART_ITEM_NOT_FOUND("CART_ITEM_NOT_FOUND", "Item was not found in shopping cart", HttpStatus.NOT_FOUND),
    CART_EMPTY("CART_EMPTY", "Shopping cart is currently empty", HttpStatus.BAD_REQUEST),
    INSUFFICIENT_STOCK_FOR_CART("INSUFFICIENT_STOCK_FOR_CART", "Requested quantity exceeds available stock for this timepiece", HttpStatus.CONFLICT),

    // Wishlist Domain
    WISHLIST_NOT_FOUND("WISHLIST_NOT_FOUND", "Collector wishlist not found", HttpStatus.NOT_FOUND),
    WISHLIST_ITEM_NOT_FOUND("WISHLIST_ITEM_NOT_FOUND", "Timepiece not found in collector wishlist", HttpStatus.NOT_FOUND),
    WISHLIST_ITEM_ALREADY_EXISTS("WISHLIST_ITEM_ALREADY_EXISTS", "Timepiece is already saved in collector wishlist", HttpStatus.CONFLICT),

    // Comparison Domain
    COMPARE_MIN_LIMIT("COMPARE_MIN_LIMIT", "At least 2 watches are required for side-by-side comparison", HttpStatus.BAD_REQUEST),
    COMPARE_MAX_LIMIT("COMPARE_MAX_LIMIT", "Comparison is limited to a maximum of 4 watches", HttpStatus.BAD_REQUEST),

    // Checkout & Order Domain
    CHECKOUT_SESSION_EXPIRED("CHECKOUT_SESSION_EXPIRED", "Checkout session has expired. Please re-initiate checkout", HttpStatus.BAD_REQUEST),
    CHECKOUT_SESSION_NOT_FOUND("CHECKOUT_SESSION_NOT_FOUND", "Checkout session not found", HttpStatus.NOT_FOUND),
    CHECKOUT_INSUFFICIENT_STOCK("CHECKOUT_INSUFFICIENT_STOCK", "One or more timepieces in checkout are no longer available in the requested quantity", HttpStatus.CONFLICT),
    ORDER_NOT_FOUND("ORDER_NOT_FOUND", "Order reference was not located", HttpStatus.NOT_FOUND),
    ORDER_INVALID_STATE_TRANSITION("ORDER_INVALID_STATE_TRANSITION", "Invalid order status transition requested", HttpStatus.BAD_REQUEST),
    ORDER_CANCEL_NOT_ALLOWED("ORDER_CANCEL_NOT_ALLOWED", "Order cannot be cancelled in its current fulfillment status", HttpStatus.BAD_REQUEST),

    // Payment Domain
    PAYMENT_NOT_FOUND("PAYMENT_NOT_FOUND", "Payment record not found", HttpStatus.NOT_FOUND),
    PAYMENT_SIGNATURE_INVALID("PAYMENT_SIGNATURE_INVALID", "Payment signature verification failed", HttpStatus.BAD_REQUEST),
    PAYMENT_GATEWAY_ERROR("PAYMENT_GATEWAY_ERROR", "Payment gateway provider returned an error", HttpStatus.BAD_GATEWAY),
    PAYMENT_ALREADY_PROCESSED("PAYMENT_ALREADY_PROCESSED", "Payment has already been processed for this order", HttpStatus.CONFLICT);

    private final String code;
    private final String message;
    private final HttpStatus httpStatus;

    ErrorCode(String code, String message, HttpStatus httpStatus) {
        this.code = code;
        this.message = message;
        this.httpStatus = httpStatus;
    }

    public String getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }

    public HttpStatus getHttpStatus() {
        return httpStatus;
    }
}
