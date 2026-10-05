package com.wristo.modules.concierge.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.wristo.config.GeminiAiConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.*;

@Component
public class GeminiClient {

    private static final Logger log = LoggerFactory.getLogger(GeminiClient.class);

    private final RestClient restClient;
    private final GeminiAiConfig geminiConfig;
    private final ObjectMapper objectMapper;

    public GeminiClient(RestClient geminiRestClient, GeminiAiConfig geminiConfig, ObjectMapper objectMapper) {
        this.restClient = geminiRestClient;
        this.geminiConfig = geminiConfig;
        this.objectMapper = objectMapper;
    }

    public Optional<String> generateAdvisorResponse(String systemPrompt, String userPrompt, List<Map<String, String>> history) {
        if (!geminiConfig.isConfigured()) {
            log.info("Gemini API key is unconfigured or blank; activating local deterministic Horological Advisor engine.");
            return Optional.empty();
        }

        try {
            List<Map<String, Object>> contents = new ArrayList<>();

            if (history != null) {
                for (Map<String, String> msg : history) {
                    String role = "assistant".equalsIgnoreCase(msg.get("role")) ? "model" : "user";
                    contents.add(Map.of(
                            "role", role,
                            "parts", List.of(Map.of("text", msg.getOrDefault("content", "")))
                    ));
                }
            }

            contents.add(Map.of(
                    "role", "user",
                    "parts", List.of(Map.of("text", userPrompt))
            ));

            Map<String, Object> requestPayload = new HashMap<>();
            if (systemPrompt != null && !systemPrompt.isBlank()) {
                requestPayload.put("system_instruction", Map.of(
                        "parts", List.of(Map.of("text", systemPrompt))
                ));
            }
            requestPayload.put("contents", contents);
            requestPayload.put("generationConfig", Map.of(
                    "temperature", 0.7,
                    "maxOutputTokens", 800
            ));

            String responseJson = restClient.post()
                    .uri(uriBuilder -> uriBuilder
                            .path("/" + geminiConfig.getModel() + ":generateContent")
                            .queryParam("key", geminiConfig.getApiKey())
                            .build())
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(requestPayload)
                    .retrieve()
                    .body(String.class);

            if (responseJson != null) {
                JsonNode root = objectMapper.readTree(responseJson);
                JsonNode candidates = root.path("candidates");
                if (candidates.isArray() && !candidates.isEmpty()) {
                    JsonNode parts = candidates.get(0).path("content").path("parts");
                    if (parts.isArray() && !parts.isEmpty()) {
                        String text = parts.get(0).path("text").asText("");
                        if (!text.isBlank()) {
                            return Optional.of(text.trim());
                        }
                    }
                }
            }
        } catch (Exception ex) {
            log.warn("Gemini API generation encountered an issue ({}). Delegating to local horological fallback.", ex.getMessage());
        }

        return Optional.empty();
    }
}
