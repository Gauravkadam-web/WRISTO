package com.wristo.modules.concierge.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.ArrayList;
import java.util.List;

public class ConciergeChatRequest {

    @NotBlank(message = "Inquiry message is required")
    private String message;

    private List<ChatMessageDto> conversationHistory = new ArrayList<>();

    public ConciergeChatRequest() {
    }

    public ConciergeChatRequest(String message, List<ChatMessageDto> conversationHistory) {
        this.message = message;
        this.conversationHistory = conversationHistory != null ? conversationHistory : new ArrayList<>();
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public List<ChatMessageDto> getConversationHistory() {
        return conversationHistory;
    }

    public void setConversationHistory(List<ChatMessageDto> conversationHistory) {
        this.conversationHistory = conversationHistory;
    }
}
