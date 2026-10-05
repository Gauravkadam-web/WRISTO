package com.wristo.modules.provenance.entity;

import com.wristo.common.entity.BaseAuditEntity;
import com.wristo.modules.catalog.entity.Watch;
import jakarta.persistence.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.Instant;

@Entity
@Table(name = "watch_service_records")
public class WatchServiceRecord extends BaseAuditEntity {

    @Id
    @Column(name = "id", length = 36, nullable = false)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "provenance_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private ProvenanceRecord provenanceRecord;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "watch_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Watch watch;

    @Column(name = "service_date", nullable = false)
    private Instant serviceDate = Instant.now();

    @Enumerated(EnumType.STRING)
    @Column(name = "service_type", length = 64, nullable = false)
    private ServiceType serviceType;

    @Column(name = "service_center", length = 255, nullable = false)
    private String serviceCenter = "WRISTO Geneva Vault Atelier";

    @Column(name = "horologist_name", length = 255, nullable = false)
    private String horologistName = "Adrien de Beauharnais";

    @Column(name = "inspection_notes", columnDefinition = "TEXT")
    private String inspectionNotes;

    @Column(name = "certificate_doc_url", length = 500)
    private String certificateDocUrl;

    public WatchServiceRecord() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public ProvenanceRecord getProvenanceRecord() {
        return provenanceRecord;
    }

    public void setProvenanceRecord(ProvenanceRecord provenanceRecord) {
        this.provenanceRecord = provenanceRecord;
    }

    public Watch getWatch() {
        return watch;
    }

    public void setWatch(Watch watch) {
        this.watch = watch;
    }

    public Instant getServiceDate() {
        return serviceDate;
    }

    public void setServiceDate(Instant serviceDate) {
        this.serviceDate = serviceDate;
    }

    public ServiceType getServiceType() {
        return serviceType;
    }

    public void setServiceType(ServiceType serviceType) {
        this.serviceType = serviceType;
    }

    public String getServiceCenter() {
        return serviceCenter;
    }

    public void setServiceCenter(String serviceCenter) {
        this.serviceCenter = serviceCenter;
    }

    public String getHorologistName() {
        return horologistName;
    }

    public void setHorologistName(String horologistName) {
        this.horologistName = horologistName;
    }

    public String getInspectionNotes() {
        return inspectionNotes;
    }

    public void setInspectionNotes(String inspectionNotes) {
        this.inspectionNotes = inspectionNotes;
    }

    public String getCertificateDocUrl() {
        return certificateDocUrl;
    }

    public void setCertificateDocUrl(String certificateDocUrl) {
        this.certificateDocUrl = certificateDocUrl;
    }
}
