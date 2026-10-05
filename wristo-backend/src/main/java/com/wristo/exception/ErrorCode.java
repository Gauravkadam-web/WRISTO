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
    INVALID_INVENTORY_ADJUSTMENT("INVALID_INVENTORY_ADJUSTMENT", "Inventory quantity adjustment would cause negative stock", HttpStatus.BAD_REQUEST);

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
