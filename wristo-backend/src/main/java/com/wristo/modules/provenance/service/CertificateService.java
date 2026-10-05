package com.wristo.modules.provenance.service;

import com.wristo.exception.ErrorCode;
import com.wristo.exception.ResourceNotFoundException;
import com.wristo.modules.auth.entity.User;
import com.wristo.modules.catalog.entity.Watch;
import com.wristo.modules.order.entity.Order;
import com.wristo.modules.provenance.dto.AuthenticityCertificateResponse;
import com.wristo.modules.provenance.dto.PublicCertificateVerificationResponse;
import com.wristo.modules.provenance.entity.AuthenticityCertificate;
import com.wristo.modules.provenance.entity.CertificateStatus;
import com.wristo.modules.provenance.repository.AuthenticityCertificateRepository;
import com.wristo.security.model.UserPrincipal;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.HexFormat;
import java.util.UUID;

@Service
@Transactional
public class CertificateService {

    private static final Logger log = LoggerFactory.getLogger(CertificateService.class);

    private final AuthenticityCertificateRepository certificateRepository;
    private final String hmacSecret;

    public CertificateService(
            AuthenticityCertificateRepository certificateRepository,
            @Value("${app.jwt.secret:default-wristo-luxury-vault-cryptographic-signing-key-9876543210}") String hmacSecret
    ) {
        this.certificateRepository = certificateRepository;
        this.hmacSecret = hmacSecret;
    }

    @Transactional(readOnly = true)
    public AuthenticityCertificateResponse getCertificateByNumber(String certificateNumber, UserPrincipal principal) {
        AuthenticityCertificate cert = certificateRepository.findByCertificateNumber(certificateNumber)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.RESOURCE_NOT_FOUND,
                        "Authenticity Certificate " + certificateNumber + " not found in Swiss archives"));

        return AuthenticityCertificateResponse.from(cert);
    }

    @Transactional(readOnly = true)
    public PublicCertificateVerificationResponse verifyPublicCertificate(String certificateNumber) {
        AuthenticityCertificate cert = certificateRepository.findByCertificateNumber(certificateNumber)
                .orElse(null);

        if (cert == null || cert.getStatus() != CertificateStatus.ACTIVE) {
            return new PublicCertificateVerificationResponse(
                    certificateNumber,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    cert != null ? cert.getStatus().name() : "INVALID_OR_NOT_FOUND",
                    false,
                    null
            );
        }

        return new PublicCertificateVerificationResponse(
                cert.getCertificateNumber(),
                cert.getWatch() != null ? cert.getWatch().getId() : null,
                cert.getWatch() != null ? cert.getWatch().getBrandName() : "AUREN",
                cert.getWatch() != null ? cert.getWatch().getModel() : "Atlas Chrono",
                cert.getOrder() != null ? cert.getOrder().getOrderNumber() : "WRT-2026",
                cert.getIssuedAt(),
                cert.getMasterHorologist(),
                cert.getMasterHorologistTitle(),
                cert.getRegistrarSignatory(),
                cert.getRegistrarTitle(),
                cert.getStatus().name(),
                true,
                cert.getQrVerificationHash()
        );
    }

    public AuthenticityCertificate issueCertificate(Order order, Watch watch, User user, String customCertNum) {
        String certNum = customCertNum != null && !customCertNum.isBlank()
                ? customCertNum
                : "CERT-CHRONO-" + UUID.randomUUID().toString().replace("-", "").substring(0, 6).toUpperCase();

        String qrHash = generateSha256(certNum + ":" + (watch != null ? watch.getId() : "WRT") + ":" + System.currentTimeMillis());
        String signature = generateHmacSignature(certNum, qrHash);

        AuthenticityCertificate cert = new AuthenticityCertificate();
        cert.setId("cert_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16));
        cert.setCertificateNumber(certNum);
        cert.setOrder(order);
        cert.setWatch(watch);
        cert.setUser(user);
        cert.setIssuedAt(Instant.now());
        cert.setMasterHorologist("Adrien de Beauharnais");
        cert.setMasterHorologistTitle("Master Horologist & Vault Director");
        cert.setRegistrarSignatory("K. Singhania & Co.");
        cert.setRegistrarTitle("Registrar of Horological Provenance");
        cert.setQrVerificationHash(qrHash);
        cert.setGuillochePatternId("GUIL-ROSETTE-V1");
        cert.setCryptographicSignature(signature);
        cert.setStatus(CertificateStatus.ACTIVE);

        AuthenticityCertificate saved = certificateRepository.save(cert);
        log.info("Issued serialized Authenticity Certificate: {} for order: {}", certNum, order != null ? order.getOrderNumber() : "N/A");
        return saved;
    }

    private String generateSha256(String data) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(data.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (Exception e) {
            return UUID.randomUUID().toString().replace("-", "");
        }
    }

    private String generateHmacSignature(String certNumber, String qrHash) {
        try {
            Mac sha256Hmac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(hmacSecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            sha256Hmac.init(secretKey);
            byte[] signed = sha256Hmac.doFinal((certNumber + ":" + qrHash).getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(signed);
        } catch (Exception e) {
            return "sig_" + UUID.randomUUID().toString().replace("-", "");
        }
    }
}
