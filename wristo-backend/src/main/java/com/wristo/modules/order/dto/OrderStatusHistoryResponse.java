package com.wristo.modules.order.dto;

import com.wristo.modules.order.entity.OrderStatusHistory;
import java.time.Instant;

public record OrderStatusHistoryResponse(
        String id,
        String fromStatus,
        String toStatus,
        String changedBy,
        String comment,
        Instant createdAt
) {
    public static OrderStatusHistoryResponse from(OrderStatusHistory history) {
        return new OrderStatusHistoryResponse(
                history.getId(),
                history.getFromStatus(),
                history.getToStatus(),
                history.getChangedBy(),
                history.getComment(),
                history.getCreatedAt()
        );
    }
}
