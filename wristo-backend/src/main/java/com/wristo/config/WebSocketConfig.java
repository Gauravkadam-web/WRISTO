package com.wristo.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import java.util.Arrays;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Value("${wristo.cors.allowed-origins:http://localhost:3000,http://127.0.0.1:3000}")
    private String allowedOrigins;

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Enable in-memory broker for public broadcasts (/topic) and user-specific queues (/queue)
        config.enableSimpleBroker("/topic", "/queue");
        // Prefix for messages routed to @MessageMapping controller methods
        config.setApplicationDestinationPrefixes("/app");
        // Prefix for user-targeted private destinations (/user/queue/...)
        config.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        String[] origins = Arrays.stream(allowedOrigins.split(","))
                .map(String::trim)
                .toArray(String[]::new);

        // Native WebSocket endpoint
        registry.addEndpoint("/ws-wristo")
                .setAllowedOriginPatterns(origins.length > 0 ? origins : new String[]{"*"})
                .withSockJS();

        // Direct WebSocket without SockJS fallback wrapper
        registry.addEndpoint("/ws-wristo")
                .setAllowedOriginPatterns(origins.length > 0 ? origins : new String[]{"*"});
    }
}
