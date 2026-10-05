package com.wristo.modules.notification.dto;

import java.time.Instant;

public class StockTelemetryEventDto {
    private String watchId;
    private Integer availableStock;
    private String changeType; // "RESERVED", "PURCHASED", "RESTOCKED"
    private String timestamp;

    public StockTelemetryEventDto() {
        this.timestamp = Instant.now().toString();
    }

    public StockTelemetryEventDto(String watchId, Integer availableStock, String changeType) {
        this.watchId = watchId;
        this.availableStock = availableStock;
        this.changeType = changeType;
        this.timestamp = Instant.now().toString();
    }

    public String getWatchId() {
        return watchId;
    }

    public void setWatchId(String watchId) {
        this.watchId = watchId;
    }

    public Integer getAvailableStock() {
        return availableStock;
    }

    public void setAvailableStock(Integer availableStock) {
        this.availableStock = availableStock;
    }

    public String getChangeType() {
        return changeType;
    }

    public void setChangeType(String changeType) {
        this.changeType = changeType;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }
}
