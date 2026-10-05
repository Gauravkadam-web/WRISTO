package com.wristo.modules.seller.dto;

import jakarta.validation.constraints.NotNull;

public class AdminListingApprovalRequest {

    @NotNull(message = "Approval decision is required")
    private Boolean approved;

    private String rejectionReason;

    public AdminListingApprovalRequest() {
    }

    public Boolean getApproved() { return approved; }
    public void setApproved(Boolean approved) { this.approved = approved; }

    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }
}
