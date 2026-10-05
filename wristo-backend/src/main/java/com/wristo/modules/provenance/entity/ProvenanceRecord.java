package com.wristo.modules.provenance.entity;

import com.wristo.common.entity.BaseAuditEntity;
import com.wristo.modules.auth.entity.User;
import com.wristo.modules.catalog.entity.Watch;
import com.wristo.modules.order.entity.Order;
import jakarta.persistence.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "provenance_records")
public class ProvenanceRecord extends BaseAuditEntity {

    @Id
    @Column(name = "id", length = 36, nullable = false)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "watch_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Watch watch;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "certificate_id")
    @OnDelete(action = OnDeleteAction.SET_NULL)
    private AuthenticityCertificate certificate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    @OnDelete(action = OnDeleteAction.SET_NULL)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "current_user_id")
    @OnDelete(action = OnDeleteAction.SET_NULL)
    private User currentUser;

    @Column(name = "serial_number", length = 64, nullable = false)
    private String serialNumber;

    @Column(name = "ownership_start_date", nullable = false)
    private Instant ownershipStartDate = Instant.now();

    @Column(name = "ownership_end_date")
    private Instant ownershipEndDate;

    @Column(name = "is_current_owner", nullable = false)
    private Boolean isCurrentOwner = true;

    @Enumerated(EnumType.STRING)
    @Column(name = "transfer_type", length = 64, nullable = false)
    private TransferType transferType = TransferType.BOUTIQUE_ACQUISITION;

    @Column(name = "acquisition_price", precision = 12, scale = 2, nullable = false)
    private BigDecimal acquisitionPrice;

    @Column(name = "provenance_hash", length = 255, nullable = false, unique = true)
    private String provenanceHash;

    @OneToMany(mappedBy = "provenanceRecord", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<WatchServiceRecord> serviceRecords = new ArrayList<>();

    public ProvenanceRecord() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Watch getWatch() {
        return watch;
    }

    public void setWatch(Watch watch) {
        this.watch = watch;
    }

    public AuthenticityCertificate getCertificate() {
        return certificate;
    }

    public void setCertificate(AuthenticityCertificate certificate) {
        this.certificate = certificate;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public User getCurrentUser() {
        return currentUser;
    }

    public void setCurrentUser(User currentUser) {
        this.currentUser = currentUser;
    }

    public String getSerialNumber() {
        return serialNumber;
    }

    public void setSerialNumber(String serialNumber) {
        this.serialNumber = serialNumber;
    }

    public Instant getOwnershipStartDate() {
        return ownershipStartDate;
    }

    public void setOwnershipStartDate(Instant ownershipStartDate) {
        this.ownershipStartDate = ownershipStartDate;
    }

    public Instant getOwnershipEndDate() {
        return ownershipEndDate;
    }

    public void setOwnershipEndDate(Instant ownershipEndDate) {
        this.ownershipEndDate = ownershipEndDate;
    }

    public Boolean getIsCurrentOwner() {
        return isCurrentOwner;
    }

    public void setIsCurrentOwner(Boolean currentOwner) {
        isCurrentOwner = currentOwner;
    }

    public TransferType getTransferType() {
        return transferType;
    }

    public void setTransferType(TransferType transferType) {
        this.transferType = transferType;
    }

    public BigDecimal getAcquisitionPrice() {
        return acquisitionPrice;
    }

    public void setAcquisitionPrice(BigDecimal acquisitionPrice) {
        this.acquisitionPrice = acquisitionPrice;
    }

    public String getProvenanceHash() {
        return provenanceHash;
    }

    public void setProvenanceHash(String provenanceHash) {
        this.provenanceHash = provenanceHash;
    }

    public List<WatchServiceRecord> getServiceRecords() {
        return serviceRecords;
    }

    public void setServiceRecords(List<WatchServiceRecord> serviceRecords) {
        this.serviceRecords = serviceRecords;
    }
}
