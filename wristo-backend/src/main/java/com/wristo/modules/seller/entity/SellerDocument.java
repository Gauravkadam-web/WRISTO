package com.wristo.modules.seller.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "seller_documents")
public class SellerDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", nullable = false, updatable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "seller_id", nullable = false)
    private Seller seller;

    @Column(name = "document_type", length = 64, nullable = false)
    private String documentType;

    @Column(name = "document_url", length = 255, nullable = false)
    private String documentUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "verification_status", length = 32, nullable = false)
    private DocumentVerificationStatus verificationStatus = DocumentVerificationStatus.PENDING;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public SellerDocument() {
    }

    public SellerDocument(Seller seller, String documentType, String documentUrl) {
        this.seller = seller;
        this.documentType = documentType;
        this.documentUrl = documentUrl;
        this.verificationStatus = DocumentVerificationStatus.PENDING;
        this.createdAt = Instant.now();
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Seller getSeller() {
        return seller;
    }

    public void setSeller(Seller seller) {
        this.seller = seller;
    }

    public String getDocumentType() {
        return documentType;
    }

    public void setDocumentType(String documentType) {
        this.documentType = documentType;
    }

    public String getDocumentUrl() {
        return documentUrl;
    }

    public void setDocumentUrl(String documentUrl) {
        this.documentUrl = documentUrl;
    }

    public DocumentVerificationStatus getVerificationStatus() {
        return verificationStatus;
    }

    public void setVerificationStatus(DocumentVerificationStatus verificationStatus) {
        this.verificationStatus = verificationStatus;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
