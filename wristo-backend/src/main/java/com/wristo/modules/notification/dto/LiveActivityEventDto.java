package com.wristo.modules.notification.dto;

import java.time.Instant;
import java.util.UUID;

public class LiveActivityEventDto {
    private String id;
    private String type;
    private String message;
    private String watchId;
    private String watchModel;
    private String city;
    private String timestamp;

    public LiveActivityEventDto() {
        this.id = UUID.randomUUID().toString();
        this.timestamp = Instant.now().toString();
    }

    public LiveActivityEventDto(String type, String message, String watchId, String watchModel, String city) {
        this.id = UUID.randomUUID().toString();
        this.type = type;
        this.message = message;
        this.watchId = watchId;
        this.watchModel = watchModel;
        this.city = city;
        this.timestamp = Instant.now().toString();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getWatchId() {
        return watchId;
    }

    public void setWatchId(String watchId) {
        this.watchId = watchId;
    }

    public String getWatchModel() {
        return watchModel;
    }

    public void setWatchModel(String watchModel) {
        this.watchModel = watchModel;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }
}
