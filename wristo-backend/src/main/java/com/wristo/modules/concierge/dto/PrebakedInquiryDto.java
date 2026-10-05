package com.wristo.modules.concierge.dto;

public class PrebakedInquiryDto {
    private String id;
    private String label;
    private String prompt;
    private ConciergePreferencesRequest defaultPreferences;

    public PrebakedInquiryDto() {
    }

    public PrebakedInquiryDto(String id, String label, String prompt, ConciergePreferencesRequest defaultPreferences) {
        this.id = id;
        this.label = label;
        this.prompt = prompt;
        this.defaultPreferences = defaultPreferences;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getPrompt() {
        return prompt;
    }

    public void setPrompt(String prompt) {
        this.prompt = prompt;
    }

    public ConciergePreferencesRequest getDefaultPreferences() {
        return defaultPreferences;
    }

    public void setDefaultPreferences(ConciergePreferencesRequest defaultPreferences) {
        this.defaultPreferences = defaultPreferences;
    }
}
