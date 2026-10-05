package com.wristo.modules.provenance.dto;

import java.time.Instant;

public record PublicCertificateVerificationResponse(
        String certificateNumber,
        String watchId,
        String watchBrand,
        String watchModel,
        String serialNumber,
        Instant issuedAt,
        String masterHorologist,
        String masterHorologistTitle,
        String registrarSignatory,
        String registrarTitle,
        String status,
        boolean isValid,
        String qrVerificationHash
) {
}
