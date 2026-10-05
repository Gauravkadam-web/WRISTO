package com.wristo.modules.notification.controller;

import com.wristo.common.dto.ApiResponse;
import com.wristo.modules.notification.dto.LiveActivityEventDto;
import com.wristo.modules.notification.service.NotificationPublisherService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/notifications")
@Tag(name = "Notifications & Telemetry", description = "Real-time Live Activity, Market Ticker & Telemetry APIs")
public class NotificationController {

    private final NotificationPublisherService publisherService;

    public NotificationController(NotificationPublisherService publisherService) {
        this.publisherService = publisherService;
    }

    @GetMapping("/ticker")
    @Operation(summary = "Get latest market ticker events", description = "Returns recent luxury marketplace activity ticker events for initial UI hydration")
    public ResponseEntity<ApiResponse<List<LiveActivityEventDto>>> getRecentTickerEvents() {
        List<LiveActivityEventDto> events = publisherService.getRecentTickerEvents();
        return ResponseEntity.ok(ApiResponse.success(events));
    }
}
