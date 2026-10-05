package com.wristo.modules.provenance.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.wristo.modules.order.entity.Order;
import com.wristo.modules.provenance.entity.AuthenticityCertificate;

import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;

public record AuthenticityCertificateResponse(
        String id,
        String certificateNumber,
        @JsonProperty("certificateId") String certificateId,
        String orderNumber,
        @JsonProperty("orderId") String orderId,
        String watchId,
        String watchBrand,
        String watchModel,
        String inscribedCollector,
        String acquisitionDate,
        String formattedAcquisitionDate,
        String verifiedDestination,
        String masterHorologist,
        String masterHorologistTitle,
        String registrarSignatory,
        String registrarTitle,
        String qrVerificationHash,
        String guillochePatternId,
        String cryptographicSignature,
        String status,
        List<CertificateItemDto> items
) {
    private static final DateTimeFormatter LUXURY_DATE_FORMATTER = DateTimeFormatter.ofPattern("d MMMM yyyy");

    public static AuthenticityCertificateResponse from(AuthenticityCertificate cert) {
        Order order = cert.getOrder();
        String orderNum = order != null ? order.getOrderNumber() : "N/A";
        String collector = order != null ? order.getCustomerName() : (cert.getUser() != null ? cert.getUser().getFullName() : "Private Collector");
        String dest = order != null ? (order.getShippingCity() + ", " + order.getShippingState()) : "Geneva, Switzerland";

        String formattedDate = cert.getIssuedAt() != null
                ? cert.getIssuedAt().atZone(ZoneId.of("Asia/Kolkata")).format(LUXURY_DATE_FORMATTER)
                : "5 October 2026";

        List<CertificateItemDto> itemsList = List.of();
        if (order != null && order.getItems() != null && !order.getItems().isEmpty()) {
            itemsList = order.getItems().stream()
                    .map(item -> new CertificateItemDto(
                            item.getWatch() != null ? item.getWatch().getId() : "WRT-001",
                            item.getWatchBrand(),
                            item.getWatchModel(),
                            item.getWatchImageUrl(),
                            item.getQuantity()
                    ))
                    .toList();
        } else if (cert.getWatch() != null) {
            itemsList = List.of(new CertificateItemDto(
                    cert.getWatch().getId(),
                    cert.getWatch().getBrandName(),
                    cert.getWatch().getModel(),
                    cert.getWatch().getImageUrl(),
                    1
            ));
        }

        return new AuthenticityCertificateResponse(
                cert.getId(),
                cert.getCertificateNumber(),
                cert.getCertificateNumber(),
                orderNum,
                orderNum,
                cert.getWatch() != null ? cert.getWatch().getId() : null,
                cert.getWatch() != null ? cert.getWatch().getBrandName() : "AUREN",
                cert.getWatch() != null ? cert.getWatch().getModel() : "Atlas",
                collector,
                cert.getIssuedAt() != null ? cert.getIssuedAt().toString() : null,
                formattedDate,
                dest,
                cert.getMasterHorologist(),
                cert.getMasterHorologistTitle(),
                cert.getRegistrarSignatory(),
                cert.getRegistrarTitle(),
                cert.getQrVerificationHash(),
                cert.getGuillochePatternId(),
                cert.getCryptographicSignature(),
                cert.getStatus() != null ? cert.getStatus().name() : "ACTIVE",
                itemsList
        );
    }
}
