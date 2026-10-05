package com.wristo.modules.provenance.dto;

public record CertificateItemDto(
        String productId,
        String brand,
        String model,
        String image,
        Integer quantity
) {
}
