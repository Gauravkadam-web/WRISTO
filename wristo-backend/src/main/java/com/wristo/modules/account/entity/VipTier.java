package com.wristo.modules.account.entity;

public enum VipTier {
    PATRON_CONNOISSEUR("Patron Connoisseur"),
    GRAND_COMPLICATION_PATRON("Grand Complication Patron"),
    HOROLOGICAL_FELLOW("Horological Fellow");

    private final String displayName;

    VipTier(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
