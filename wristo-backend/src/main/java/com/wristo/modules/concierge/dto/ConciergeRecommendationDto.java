package com.wristo.modules.concierge.dto;

import com.wristo.modules.catalog.dto.WatchResponse;

import java.util.List;

public class ConciergeRecommendationDto {
    private WatchResponse watch;
    private Integer compatibilityScore;
    private String editorialReasoning;
    private String highlightTag;
    private List<String> matchedAttributes;

    public ConciergeRecommendationDto() {
    }

    public ConciergeRecommendationDto(WatchResponse watch, Integer compatibilityScore,
                                      String editorialReasoning, String highlightTag,
                                      List<String> matchedAttributes) {
        this.watch = watch;
        this.compatibilityScore = compatibilityScore;
        this.editorialReasoning = editorialReasoning;
        this.highlightTag = highlightTag;
        this.matchedAttributes = matchedAttributes;
    }

    public WatchResponse getWatch() {
        return watch;
    }

    public void setWatch(WatchResponse watch) {
        this.watch = watch;
    }

    public Integer getCompatibilityScore() {
        return compatibilityScore;
    }

    public void setCompatibilityScore(Integer compatibilityScore) {
        this.compatibilityScore = compatibilityScore;
    }

    public String getEditorialReasoning() {
        return editorialReasoning;
    }

    public void setEditorialReasoning(String editorialReasoning) {
        this.editorialReasoning = editorialReasoning;
    }

    public String getHighlightTag() {
        return highlightTag;
    }

    public void setHighlightTag(String highlightTag) {
        this.highlightTag = highlightTag;
    }

    public List<String> getMatchedAttributes() {
        return matchedAttributes;
    }

    public void setMatchedAttributes(List<String> matchedAttributes) {
        this.matchedAttributes = matchedAttributes;
    }
}
