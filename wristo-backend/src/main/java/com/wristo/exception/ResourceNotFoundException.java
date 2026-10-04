package com.wristo.exception;

public class ResourceNotFoundException extends BusinessException {

    public ResourceNotFoundException(String message) {
        super(ErrorCode.RESOURCE_NOT_FOUND, message);
    }

    public ResourceNotFoundException(ErrorCode errorCode) {
        super(errorCode);
    }

    public ResourceNotFoundException(ErrorCode errorCode, String message) {
        super(errorCode, message);
    }

    public ResourceNotFoundException(String resourceName, String fieldName, Object fieldValue) {
        super(ErrorCode.RESOURCE_NOT_FOUND, String.format("%s not found with %s: '%s'", resourceName, fieldName, fieldValue));
    }
}
