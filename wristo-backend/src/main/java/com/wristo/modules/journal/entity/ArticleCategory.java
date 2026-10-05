package com.wristo.modules.journal.entity;

public enum ArticleCategory {
    HOROLOGICAL_HERITAGE("Horological Heritage"),
    TECHNICAL_CALIBERS("Technical Calibers"),
    COLLECTOR_GUIDE("Collector Guide"),
    DESIGN_METALLURGY("Design & Metallurgy");

    private final String displayName;

    ArticleCategory(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    public static ArticleCategory fromString(String text) {
        if (text == null || text.trim().isEmpty()) {
            return null;
        }
        for (ArticleCategory c : ArticleCategory.values()) {
            if (c.name().equalsIgnoreCase(text) || c.displayName.equalsIgnoreCase(text)) {
                return c;
            }
        }
        return null;
    }
}
