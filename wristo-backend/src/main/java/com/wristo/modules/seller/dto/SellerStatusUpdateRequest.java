package com.wristo.modules.seller.dto;

import com.wristo.modules.seller.entity.SellerStatus;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class SellerStatusUpdateRequest {

    @NotNull(message = "Target seller status is required")
    private SellerStatus status;

    private String rejectionReason;

    private BigDecimal commissionRate;

    public SellerStatusUpdateRequest() {
    }

    public SellerStatusUpdateRequest(SellerStatus status, String rejectionReason, BigDecimal commissionRate) {
        this.status = status;
        this.rejectionReason = rejectionReason;
        this.commissionRate = commissionRate;
    }

    public SellerStatus getStatus() {
        return status;
    }

    public void setStatus(SellerStatus status) {
        this.status = status;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }

    public BigDecimal getCommissionRate() {
        return commissionRate;
    }

    public void setCommissionRate(BigDecimal commissionRate) {
        this.commissionRate = commissionRate;
    }
}
