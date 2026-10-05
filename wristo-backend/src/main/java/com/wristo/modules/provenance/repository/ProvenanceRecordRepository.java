package com.wristo.modules.provenance.repository;

import com.wristo.modules.provenance.entity.ProvenanceRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProvenanceRecordRepository extends JpaRepository<ProvenanceRecord, String> {
    List<ProvenanceRecord> findByCurrentUserIdAndIsCurrentOwnerTrueOrderByOwnershipStartDateDesc(UUID userId);
    List<ProvenanceRecord> findByWatchIdOrderByOwnershipStartDateAsc(String watchId);
    Optional<ProvenanceRecord> findByProvenanceHash(String provenanceHash);
    Optional<ProvenanceRecord> findBySerialNumber(String serialNumber);
    Optional<ProvenanceRecord> findByOrderId(String orderId);
}
