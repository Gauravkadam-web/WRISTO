package com.wristo.modules.concierge.dto;

import java.util.List;

public class ConciergeChatResponse {
    private String reply;
    private List<ConciergeRecommendationDto> recommendations;

    public ConciergeChatResponse() {
    }

    public ConciergeChatResponse(String reply, List<ConciergeRecommendationDto> recommendations) {
        this.reply = reply;
        this.recommendations = recommendations;
    }

    public String getReply() {
        return reply;
    }

    public void setReply(String reply) {
        this.reply = reply;
    }

    public List<ConciergeRecommendationDto> getRecommendations() {
        return recommendations;
    }

    public void setRecommendations(List<ConciergeRecommendationDto> recommendations) {
        this.recommendations = recommendations;
    }
}
