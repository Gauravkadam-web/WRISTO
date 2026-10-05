package com.wristo.modules.provenance.dto;

import com.wristo.modules.provenance.entity.WatchServiceRecord;

import java.time.Instant;

public record WatchServiceRecordResponse(
        String id,
        String provenanceId,
        String watchId,
        Instant serviceDate,
        String serviceType,
        String serviceCenter,
        String horologistName,
        String inspectionNotes,
        String certificateDocUrl
) {
    public static WatchServiceRecordResponse from(WatchServiceRecord record) {
        return new WatchServiceRecordResponse(
                record.getId(),
                record.getProvenanceRecord() != null ? record.getProvenanceRecord().getId() : null,
                record.getWatch() != null ? record.getWatch().getId() : null,
                record.getServiceDate(),
                record.getServiceType() != null ? record.getServiceType().name() : null,
                record.getServiceCenter(),
                record.getHorologistName(),
                record.getInspectionNotes(),
                record.getCertificateDocUrl()
        );
    }
}
