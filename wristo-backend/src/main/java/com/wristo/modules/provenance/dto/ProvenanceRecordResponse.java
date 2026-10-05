package com.wristo.modules.provenance.dto;

import com.wristo.modules.provenance.entity.ProvenanceRecord;
import com.wristo.modules.provenance.entity.WatchServiceRecord;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record ProvenanceRecordResponse(
        String id,
        String watchId,
        String watchBrand,
        String watchModel,
        String watchImageUrl,
        String serialNumber,
        String certificateNumber,
        String orderNumber,
        Instant ownershipStartDate,
        Instant ownershipEndDate,
        Boolean isCurrentOwner,
        String transferType,
        BigDecimal acquisitionPrice,
        String provenanceHash,
        AuthenticityCertificateResponse certificate,
        List<WatchServiceRecordResponse> serviceRecords
) {
    public static ProvenanceRecordResponse from(ProvenanceRecord record) {
        return from(record, record.getServiceRecords());
    }

    public static ProvenanceRecordResponse from(ProvenanceRecord record, List<WatchServiceRecord> serviceRecordEntities) {
        List<WatchServiceRecordResponse> services = serviceRecordEntities != null
                ? serviceRecordEntities.stream().map(WatchServiceRecordResponse::from).toList()
                : (record.getServiceRecords() != null
                    ? record.getServiceRecords().stream().map(WatchServiceRecordResponse::from).toList()
                    : List.of());

        AuthenticityCertificateResponse certResponse = record.getCertificate() != null
                ? AuthenticityCertificateResponse.from(record.getCertificate())
                : null;

        return new ProvenanceRecordResponse(
                record.getId(),
                record.getWatch() != null ? record.getWatch().getId() : null,
                record.getWatch() != null ? record.getWatch().getBrandName() : null,
                record.getWatch() != null ? record.getWatch().getModel() : null,
                record.getWatch() != null ? record.getWatch().getImageUrl() : null,
                record.getSerialNumber(),
                record.getCertificate() != null ? record.getCertificate().getCertificateNumber() : null,
                record.getOrder() != null ? record.getOrder().getOrderNumber() : null,
                record.getOwnershipStartDate(),
                record.getOwnershipEndDate(),
                record.getIsCurrentOwner(),
                record.getTransferType() != null ? record.getTransferType().name() : null,
                record.getAcquisitionPrice(),
                record.getProvenanceHash(),
                certResponse,
                services
        );
    }
}
