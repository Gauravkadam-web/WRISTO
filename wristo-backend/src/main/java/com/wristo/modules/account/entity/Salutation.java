package com.wristo.modules.account.entity;

public enum Salutation {
    MR("Mr."),
    MS("Ms."),
    DR("Dr."),
    LORD("Lord"),
    COLLECTOR("Collector");

    private final String displayName;

    Salutation(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
