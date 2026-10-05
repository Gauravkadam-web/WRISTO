package com.wristo.modules.notification.service;

import com.wristo.modules.notification.dto.LiveActivityEventDto;
import com.wristo.modules.notification.dto.OrderNotificationDto;
import com.wristo.modules.notification.dto.StockTelemetryEventDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.ConcurrentLinkedDeque;

@Service
public class NotificationPublisherService {

    private static final Logger log = LoggerFactory.getLogger(NotificationPublisherService.class);

    private final SimpMessagingTemplate messagingTemplate;
    private final ConcurrentLinkedDeque<LiveActivityEventDto> recentTickerEvents = new ConcurrentLinkedDeque<>();
    private static final int MAX_TICKER_HISTORY = 20;

    public NotificationPublisherService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
        seedInitialTickerEvents();
    }

    private void seedInitialTickerEvents() {
        recentTickerEvents.add(new LiveActivityEventDto("ORDER_PLACED", "A collector in Pune just reserved Atlas Chronograph Obsidian (WRT-001)", "WRT-001", "Atlas Chronograph Obsidian", "Pune"));
        recentTickerEvents.add(new LiveActivityEventDto("CERTIFICATE_MINTED", "Certificate of Provenance CERT-CHRONO-84920 issued for Regent Green Automatic", "WRT-005", "Regent Green Automatic", "Mumbai"));
        recentTickerEvents.add(new LiveActivityEventDto("SERVICE_COMPLETED", "Master Horologist completed 5-Year Overhaul for Royal Oak Chrono in Bangalore", "WRT-003", "Royal Oak Chronograph", "Bangalore"));
        recentTickerEvents.add(new LiveActivityEventDto("ORDER_PLACED", "A collector in New Delhi acquired AUREN Heritage Skeleton (WRT-002)", "WRT-002", "Heritage Skeleton Rose", "New Delhi"));
    }

    public void broadcastMarketTicker(LiveActivityEventDto event) {
        if (event == null) return;
        recentTickerEvents.addFirst(event);
        while (recentTickerEvents.size() > MAX_TICKER_HISTORY) {
            recentTickerEvents.removeLast();
        }
        log.info("Broadcasting market ticker event: {}", event.getMessage());
        messagingTemplate.convertAndSend("/topic/market-ticker", event);
    }

    public void broadcastInventoryTelemetry(String watchId, int availableStock, String changeType) {
        StockTelemetryEventDto event = new StockTelemetryEventDto(watchId, availableStock, changeType);
        log.info("Broadcasting inventory telemetry for watch {}: stock={}, change={}", watchId, availableStock, changeType);
        messagingTemplate.convertAndSend("/topic/inventory-updates", event);
    }

    public void sendUserOrderNotification(String userId, OrderNotificationDto notification) {
        if (userId == null || notification == null) return;
        log.info("Sending order notification to user {}: order={}, status={}", userId, notification.getOrderNumber(), notification.getStatus());
        messagingTemplate.convertAndSendToUser(userId, "/queue/notifications", notification);
    }

    public List<LiveActivityEventDto> getRecentTickerEvents() {
        return new ArrayList<>(recentTickerEvents);
    }
}
