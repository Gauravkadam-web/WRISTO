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
    INVALID_CREDENTIALS("INVALID_CREDENTIALS", "Invalid email or password combination", HttpStatus.UNAUTHORIZED);

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
