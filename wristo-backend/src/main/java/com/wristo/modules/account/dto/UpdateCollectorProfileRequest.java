package com.wristo.modules.account.dto;

import java.util.Map;

public record UpdateCollectorProfileRequest(
        String fullName,
        String phone,
        String salutation,
        Integer wristSizeMm,
        String currency,
        Map<String, Boolean> notifications
) {
}
