package com.wristo.modules.account.dto;

import java.math.BigDecimal;

public record CollectorDashboardResponse(
        CollectorProfileResponse profile,
        long vaultCount,
        long totalOrders,
        long activeOrders,
        BigDecimal totalSpend,
        long savedAddressesCount
) {
}
