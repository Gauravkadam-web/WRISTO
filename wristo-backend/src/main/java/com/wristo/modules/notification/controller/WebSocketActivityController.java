package com.wristo.modules.notification.controller;

import com.wristo.modules.notification.dto.LiveActivityEventDto;
import com.wristo.modules.notification.service.NotificationPublisherService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketActivityController {

    private final NotificationPublisherService publisherService;

    public WebSocketActivityController(NotificationPublisherService publisherService) {
        this.publisherService = publisherService;
    }

    @MessageMapping("/ticker/ping")
    @SendTo("/topic/market-ticker")
    public LiveActivityEventDto handleTickerPing() {
        return new LiveActivityEventDto("SYSTEM_HEARTBEAT", "WRISTO Vault WebSocket Synchronized", "WRT-GLOBAL", "Platform Telemetry", "Vault");
    }
}
