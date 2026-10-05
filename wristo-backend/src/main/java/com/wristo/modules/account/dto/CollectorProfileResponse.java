package com.wristo.modules.account.dto;

import com.wristo.modules.account.entity.CollectorProfile;
import com.wristo.modules.auth.entity.User;

import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Map;

public record CollectorProfileResponse(
        String id,
        String fullName,
        String email,
        String phone,
        String salutation,
        String vipTier,
        String joinedDate,
        Integer wristSizeMm,
        String currency,
        Map<String, Boolean> notifications
) {
    private static final DateTimeFormatter MONTH_YEAR_FORMATTER = DateTimeFormatter.ofPattern("MMMM yyyy");

    public static CollectorProfileResponse from(User user, CollectorProfile profile) {
        String joinedDateStr = user.getCreatedAt() != null
                ? user.getCreatedAt().atZone(ZoneId.of("Asia/Kolkata")).format(MONTH_YEAR_FORMATTER)
                : "October 2026";

        String salutationStr = profile != null && profile.getSalutation() != null
                ? profile.getSalutation().getDisplayName()
                : "Collector";

        String vipTierStr = profile != null && profile.getVipTier() != null
                ? profile.getVipTier().getDisplayName()
                : "Grand Complication Patron";

        Integer wristSize = profile != null ? profile.getWristSizeMm() : 175;
        String currencyStr = profile != null && profile.getCurrency() != null ? profile.getCurrency() : "INR";

        Map<String, Boolean> notifs = Map.of(
                "orderTelemetry", profile == null || profile.getOrderTelemetry() == null || profile.getOrderTelemetry(),
                "rareAllocations", profile == null || profile.getRareAllocations() == null || profile.getRareAllocations(),
                "conciergeBriefings", profile != null && Boolean.TRUE.equals(profile.getConciergeBriefings())
        );

        return new CollectorProfileResponse(
                user.getId() != null ? user.getId().toString() : null,
                user.getFullName(),
                user.getEmail(),
                user.getPhone() != null ? user.getPhone() : "+91 98765 43210",
                salutationStr,
                vipTierStr,
                joinedDateStr,
                wristSize,
                currencyStr,
                notifs
        );
    }
}
