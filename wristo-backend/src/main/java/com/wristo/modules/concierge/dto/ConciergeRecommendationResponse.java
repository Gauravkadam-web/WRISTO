package com.wristo.modules.concierge.dto;

import java.util.List;

public class ConciergeRecommendationResponse {
    private List<ConciergeRecommendationDto> recommendations;
    private String summaryAdvice;

    public ConciergeRecommendationResponse() {
    }

    public ConciergeRecommendationResponse(List<ConciergeRecommendationDto> recommendations, String summaryAdvice) {
        this.recommendations = recommendations;
        this.summaryAdvice = summaryAdvice;
    }

    public List<ConciergeRecommendationDto> getRecommendations() {
        return recommendations;
    }

    public void setRecommendations(List<ConciergeRecommendationDto> recommendations) {
        this.recommendations = recommendations;
    }

    public String getSummaryAdvice() {
        return summaryAdvice;
    }

    public void setSummaryAdvice(String summaryAdvice) {
        this.summaryAdvice = summaryAdvice;
    }
}
