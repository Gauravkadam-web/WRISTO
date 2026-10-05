package com.wristo.modules.concierge.dto;

import java.util.ArrayList;
import java.util.List;

public class ConciergePreferencesRequest {

    private List<String> occasion = new ArrayList<>();
    private String caseErgonomics = "classic";
    private List<String> movement = new ArrayList<>();
    private String budgetTier = "8k_to_15k";
    private List<String> materials = new ArrayList<>();
    private String naturalPrompt = "";

    public ConciergePreferencesRequest() {
    }

    public ConciergePreferencesRequest(List<String> occasion, String caseErgonomics,
                                       List<String> movement, String budgetTier,
                                       List<String> materials, String naturalPrompt) {
        this.occasion = occasion != null ? occasion : new ArrayList<>();
        this.caseErgonomics = caseErgonomics != null ? caseErgonomics : "classic";
        this.movement = movement != null ? movement : new ArrayList<>();
        this.budgetTier = budgetTier != null ? budgetTier : "8k_to_15k";
        this.materials = materials != null ? materials : new ArrayList<>();
        this.naturalPrompt = naturalPrompt != null ? naturalPrompt : "";
    }

    public List<String> getOccasion() {
        return occasion;
    }

    public void setOccasion(List<String> occasion) {
        this.occasion = occasion;
    }

    public String getCaseErgonomics() {
        return caseErgonomics;
    }

    public void setCaseErgonomics(String caseErgonomics) {
        this.caseErgonomics = caseErgonomics;
    }

    public List<String> getMovement() {
        return movement;
    }

    public void setMovement(List<String> movement) {
        this.movement = movement;
    }

    public String getBudgetTier() {
        return budgetTier;
    }

    public void setBudgetTier(String budgetTier) {
        this.budgetTier = budgetTier;
    }

    public List<String> getMaterials() {
        return materials;
    }

    public void setMaterials(List<String> materials) {
        this.materials = materials;
    }

    public String getNaturalPrompt() {
        return naturalPrompt;
    }

    public void setNaturalPrompt(String naturalPrompt) {
        this.naturalPrompt = naturalPrompt;
    }
}
