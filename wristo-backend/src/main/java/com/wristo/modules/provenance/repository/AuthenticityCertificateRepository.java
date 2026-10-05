package com.wristo.modules.provenance.repository;

import com.wristo.modules.provenance.entity.AuthenticityCertificate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AuthenticityCertificateRepository extends JpaRepository<AuthenticityCertificate, String> {
    Optional<AuthenticityCertificate> findByCertificateNumber(String certificateNumber);
    Optional<AuthenticityCertificate> findByOrderId(String orderId);
    List<AuthenticityCertificate> findByUserIdOrderByIssuedAtDesc(UUID userId);
    List<AuthenticityCertificate> findByWatchId(String watchId);
}
