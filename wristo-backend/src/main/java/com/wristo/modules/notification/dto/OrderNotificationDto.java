package com.wristo.modules.notification.dto;

import java.time.Instant;

public class OrderNotificationDto {
    private String orderNumber;
    private String status;
    private String title;
    private String message;
    private String timestamp;

    public OrderNotificationDto() {
        this.timestamp = Instant.now().toString();
    }

    public OrderNotificationDto(String orderNumber, String status, String title, String message) {
        this.orderNumber = orderNumber;
        this.status = status;
        this.title = title;
        this.message = message;
        this.timestamp = Instant.now().toString();
    }

    public String getOrderNumber() {
        return orderNumber;
    }

    public void setOrderNumber(String orderNumber) {
        this.orderNumber = orderNumber;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }
}
