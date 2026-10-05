package com.wristo.modules.provenance.service;

import com.wristo.exception.BusinessException;
import com.wristo.exception.ErrorCode;
import com.wristo.exception.ResourceNotFoundException;
import com.wristo.modules.auth.entity.User;
import com.wristo.modules.catalog.entity.Watch;
import com.wristo.modules.catalog.repository.WatchRepository;
import com.wristo.modules.order.entity.Order;
import com.wristo.modules.provenance.dto.CreateServiceRecordRequest;
import com.wristo.modules.provenance.dto.ProvenanceRecordResponse;
import com.wristo.modules.provenance.dto.WatchServiceRecordResponse;
import com.wristo.modules.provenance.entity.AuthenticityCertificate;
import com.wristo.modules.provenance.entity.ProvenanceRecord;
import com.wristo.modules.provenance.entity.TransferType;
import com.wristo.modules.provenance.entity.WatchServiceRecord;
import com.wristo.modules.provenance.repository.ProvenanceRecordRepository;
import com.wristo.modules.provenance.repository.WatchServiceRecordRepository;
import com.wristo.security.model.UserPrincipal;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.HexFormat;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class ProvenanceService {

    private static final Logger log = LoggerFactory.getLogger(ProvenanceService.class);

    private final ProvenanceRecordRepository provenanceRepository;
    private final WatchServiceRecordRepository serviceRecordRepository;
    private final WatchRepository watchRepository;

    public ProvenanceService(
            ProvenanceRecordRepository provenanceRepository,
            WatchServiceRecordRepository serviceRecordRepository,
            WatchRepository watchRepository
    ) {
        this.provenanceRepository = provenanceRepository;
        this.serviceRecordRepository = serviceRecordRepository;
        this.watchRepository = watchRepository;
    }

    @Transactional(readOnly = true)
    public List<ProvenanceRecordResponse> getMyVault(UserPrincipal principal) {
        if (principal == null) {
            throw new BusinessException(ErrorCode.UNAUTHORIZED_ACCESS, "Authentication required to view vault ledger");
        }

        List<ProvenanceRecord> records = provenanceRepository
                .findByCurrentUserIdAndIsCurrentOwnerTrueOrderByOwnershipStartDateDesc(principal.getId());

        return records.stream()
                .map(r -> ProvenanceRecordResponse.from(r, serviceRecordRepository.findByProvenanceRecordIdOrderByServiceDateDesc(r.getId())))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ProvenanceRecordResponse> getWatchHistory(String watchId) {
        List<ProvenanceRecord> records = provenanceRepository.findByWatchIdOrderByOwnershipStartDateAsc(watchId);
        return records.stream()
                .map(r -> ProvenanceRecordResponse.from(r, serviceRecordRepository.findByProvenanceRecordIdOrderByServiceDateDesc(r.getId())))
                .toList();
    }

    public ProvenanceRecord recordAcquisition(Order order, Watch watch, User user, AuthenticityCertificate cert, BigDecimal price) {
        String serialNum = "SN-" + (watch != null ? watch.getId() : "WRT") + "-" + UUID.randomUUID().toString().replace("-", "").substring(0, 6).toUpperCase();
        String provHash = generateProvenanceHash(watch != null ? watch.getId() : "WRT", serialNum, user != null && user.getId() != null ? user.getId().toString() : "GUEST");

        ProvenanceRecord record = new ProvenanceRecord();
        record.setId("prov_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16));
        record.setWatch(watch);
        record.setCertificate(cert);
        record.setOrder(order);
        record.setCurrentUser(user);
        record.setSerialNumber(serialNum);
        record.setOwnershipStartDate(Instant.now());
        record.setIsCurrentOwner(true);
        record.setTransferType(TransferType.BOUTIQUE_ACQUISITION);
        record.setAcquisitionPrice(price != null ? price : (watch != null ? watch.getPrice() : BigDecimal.ZERO));
        record.setProvenanceHash(provHash);

        ProvenanceRecord saved = provenanceRepository.save(record);

        // Record initial Swiss quality inspection service record
        WatchServiceRecord initialInspection = new WatchServiceRecord();
        initialInspection.setId("srv_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16));
        initialInspection.setProvenanceRecord(saved);
        initialInspection.setWatch(watch);
        initialInspection.setServiceDate(Instant.now());
        initialInspection.setServiceType(com.wristo.modules.provenance.entity.ServiceType.RATE_CALIBRATION);
        initialInspection.setServiceCenter("WRISTO Geneva Vault Atelier");
        initialInspection.setHorologistName("Adrien de Beauharnais");
        initialInspection.setInspectionNotes("Initial horological rate audit: +1.2 sec/day COSC tolerance verified. Case sealed.");
        initialInspection.setCertificateDocUrl("/assets/certificates/" + (cert != null ? cert.getCertificateNumber() : "CERT") + ".pdf");
        serviceRecordRepository.save(initialInspection);

        log.info("Recorded provenance entry: {} for watch: {}", saved.getProvenanceHash(), watch != null ? watch.getId() : "N/A");
        return saved;
    }

    public WatchServiceRecordResponse addServiceRecord(CreateServiceRecordRequest request, String adminUsername) {
        ProvenanceRecord provenance = provenanceRepository.findById(request.provenanceId())
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.RESOURCE_NOT_FOUND, "Provenance record not found"));

        Watch watch = watchRepository.findById(request.watchId())
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.WATCH_NOT_FOUND, "Watch not found"));

        WatchServiceRecord record = new WatchServiceRecord();
        record.setId("srv_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16));
        record.setProvenanceRecord(provenance);
        record.setWatch(watch);
        record.setServiceDate(Instant.now());
        record.setServiceType(request.serviceType());
        record.setServiceCenter(request.serviceCenter() != null && !request.serviceCenter().isBlank()
                ? request.serviceCenter()
                : "WRISTO Geneva Vault Atelier");
        record.setHorologistName(request.horologistName() != null && !request.horologistName().isBlank()
                ? request.horologistName()
                : (adminUsername != null ? adminUsername : "Master Horologist"));
        record.setInspectionNotes(request.inspectionNotes());
        record.setCertificateDocUrl(request.certificateDocUrl());

        WatchServiceRecord saved = serviceRecordRepository.save(record);
        log.info("Admin {} added watch service record for provenance {}", adminUsername, provenance.getId());
        return WatchServiceRecordResponse.from(saved);
    }

    private String generateProvenanceHash(String watchId, String serialNumber, String userId) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest((watchId + ":" + serialNumber + ":" + userId + ":" + System.currentTimeMillis()).getBytes(StandardCharsets.UTF_8));
            return "PROV-HASH-" + HexFormat.of().formatHex(hash).substring(0, 24).toUpperCase();
        } catch (Exception e) {
            return "PROV-HASH-" + UUID.randomUUID().toString().replace("-", "").substring(0, 24).toUpperCase();
        }
    }
}
