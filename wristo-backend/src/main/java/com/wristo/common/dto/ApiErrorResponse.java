package com.wristo.common.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.Instant;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiErrorResponse {

    private boolean success = false;
    private ErrorDetails error;
    private Instant timestamp = Instant.now();

    public ApiErrorResponse() {
    }

    public ApiErrorResponse(boolean success, ErrorDetails error, Instant timestamp) {
        this.success = success;
        this.error = error;
        this.timestamp = timestamp != null ? timestamp : Instant.now();
    }

    public static class ErrorDetails {
        private String code;
        private String message;
        private Map<String, String> fieldErrors;

        public ErrorDetails() {
        }

        public ErrorDetails(String code, String message) {
            this.code = code;
            this.message = message;
        }

        public ErrorDetails(String code, String message, Map<String, String> fieldErrors) {
            this.code = code;
            this.message = message;
            this.fieldErrors = fieldErrors;
        }

        public String getCode() {
            return code;
        }

        public void setCode(String code) {
            this.code = code;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }

        public Map<String, String> getFieldErrors() {
            return fieldErrors;
        }

        public void setFieldErrors(Map<String, String> fieldErrors) {
            this.fieldErrors = fieldErrors;
        }
    }

    public static ApiErrorResponse of(String code, String message) {
        return new ApiErrorResponse(false, new ErrorDetails(code, message), Instant.now());
    }

    public static ApiErrorResponse of(String code, String message, Map<String, String> fieldErrors) {
        return new ApiErrorResponse(false, new ErrorDetails(code, message, fieldErrors), Instant.now());
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public ErrorDetails getError() {
        return error;
    }

    public void setError(ErrorDetails error) {
        this.error = error;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }
}
