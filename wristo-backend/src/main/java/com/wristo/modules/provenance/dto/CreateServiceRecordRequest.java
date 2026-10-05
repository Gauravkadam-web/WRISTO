package com.wristo.modules.provenance.dto;

import com.wristo.modules.provenance.entity.ServiceType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateServiceRecordRequest(
        @NotBlank(message = "Provenance ID is required")
        String provenanceId,

        @NotBlank(message = "Watch ID is required")
        String watchId,

        @NotNull(message = "Service type is required")
        ServiceType serviceType,

        String serviceCenter,
        String horologistName,
        String inspectionNotes,
        String certificateDocUrl
) {
}
