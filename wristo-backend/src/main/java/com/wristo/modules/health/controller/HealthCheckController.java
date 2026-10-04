package com.wristo.modules.health.controller;

import com.wristo.common.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/health")
@Tag(name = "Health & Diagnostics", description = "Endpoints for service health, heartbeat, and diagnostics.")
public class HealthCheckController {

    @GetMapping
    @Operation(summary = "Service Heartbeat", description = "Returns the operational health status and server timestamp.")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getHealthStatus() {
        Map<String, Object> healthInfo = Map.of(
                "status", "UP",
                "service", "WRISTO Ultra-Luxury Marketplace Backend",
                "version", "1.0.0",
                "runtime", "Java 21 LTS + Spring Boot 3.3.4",
                "timestamp", Instant.now()
        );

        return ResponseEntity.ok(ApiResponse.success("WRISTO backend service is operational", healthInfo));
    }
}
