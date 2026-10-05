package com.wristo.modules.provenance.entity;

import com.wristo.common.entity.BaseAuditEntity;
import com.wristo.modules.auth.entity.User;
import com.wristo.modules.catalog.entity.Watch;
import com.wristo.modules.order.entity.Order;
import jakarta.persistence.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.Instant;

@Entity
@Table(name = "authenticity_certificates")
public class AuthenticityCertificate extends BaseAuditEntity {

    @Id
    @Column(name = "id", length = 36, nullable = false)
    private String id;

    @Column(name = "certificate_number", length = 32, nullable = false, unique = true)
    private String certificateNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    @OnDelete(action = OnDeleteAction.SET_NULL)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "watch_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Watch watch;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @OnDelete(action = OnDeleteAction.SET_NULL)
    private User user;

    @Column(name = "issued_at", nullable = false)
    private Instant issuedAt = Instant.now();

    @Column(name = "master_horologist", length = 255, nullable = false)
    private String masterHorologist = "Adrien de Beauharnais";

    @Column(name = "master_horologist_title", length = 255, nullable = false)
    private String masterHorologistTitle = "Master Horologist & Vault Director";

    @Column(name = "registrar_signatory", length = 255, nullable = false)
    private String registrarSignatory = "K. Singhania & Co.";

    @Column(name = "registrar_title", length = 255, nullable = false)
    private String registrarTitle = "Registrar of Horological Provenance";

    @Column(name = "qr_verification_hash", length = 255, nullable = false)
    private String qrVerificationHash;

    @Column(name = "guilloche_pattern_id", length = 64, nullable = false)
    private String guillochePatternId = "GUIL-ROSETTE-V1";

    @Column(name = "cryptographic_signature", length = 512, nullable = false)
    private String cryptographicSignature;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 32, nullable = false)
    private CertificateStatus status = CertificateStatus.ACTIVE;

    public AuthenticityCertificate() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCertificateNumber() {
        return certificateNumber;
    }

    public void setCertificateNumber(String certificateNumber) {
        this.certificateNumber = certificateNumber;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public Watch getWatch() {
        return watch;
    }

    public void setWatch(Watch watch) {
        this.watch = watch;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Instant getIssuedAt() {
        return issuedAt;
    }

    public void setIssuedAt(Instant issuedAt) {
        this.issuedAt = issuedAt;
    }

    public String getMasterHorologist() {
        return masterHorologist;
    }

    public void setMasterHorologist(String masterHorologist) {
        this.masterHorologist = masterHorologist;
    }

    public String getMasterHorologistTitle() {
        return masterHorologistTitle;
    }

    public void setMasterHorologistTitle(String masterHorologistTitle) {
        this.masterHorologistTitle = masterHorologistTitle;
    }

    public String getRegistrarSignatory() {
        return registrarSignatory;
    }

    public void setRegistrarSignatory(String registrarSignatory) {
        this.registrarSignatory = registrarSignatory;
    }

    public String getRegistrarTitle() {
        return registrarTitle;
    }

    public void setRegistrarTitle(String registrarTitle) {
        this.registrarTitle = registrarTitle;
    }

    public String getQrVerificationHash() {
        return qrVerificationHash;
    }

    public void setQrVerificationHash(String qrVerificationHash) {
        this.qrVerificationHash = qrVerificationHash;
    }

    public String getGuillochePatternId() {
        return guillochePatternId;
    }

    public void setGuillochePatternId(String guillochePatternId) {
        this.guillochePatternId = guillochePatternId;
    }

    public String getCryptographicSignature() {
        return cryptographicSignature;
    }

    public void setCryptographicSignature(String cryptographicSignature) {
        this.cryptographicSignature = cryptographicSignature;
    }

    public CertificateStatus getStatus() {
        return status;
    }

    public void setStatus(CertificateStatus status) {
        this.status = status;
    }
}
