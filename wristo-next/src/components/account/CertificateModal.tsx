'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { OrderRecord } from '@/types/order';

interface CertificateModalProps {
  order: OrderRecord | null;
  onClose: () => void;
}

export default function CertificateModal({ order, onClose }: CertificateModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!order) return null;

  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="cert-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="cert-modal-window" onClick={e => e.stopPropagation()}>
        <button
          type="button"
          onClick={onClose}
          className="cert-modal-close"
          aria-label="Close Certificate"
        >
          &times;
        </button>

        {/* Certificate Outer Frame */}
        <div className="cert-parchment-frame">
          <div className="cert-inner-border">
            {/* Header */}
            <div className="cert-header">
              <div className="cert-brand-mark">WRISTO</div>
              <div className="cert-sub-brand">GENÈVE &bull; MUMBAI &bull; LONDON</div>
              <h2 className="cert-main-title">Certificate of Provenance</h2>
              <div className="cert-registration-num">
                REGISTERED SERIAL: <strong>{order.certificateId}</strong>
              </div>
            </div>

            {/* Declaration Text */}
            <p className="cert-declaration">
              This document certifies that the horological creation(s) itemized below have been officially registered in the WRISTO Global Provenance Archives. Prior to dispatch, each movement underwent physical rate inspection and water-resistance certification by master horologists.
            </p>

            {/* Inscribed Metadata Grid */}
            <div className="cert-meta-grid">
              <div className="cert-meta-cell">
                <span className="cert-meta-label">INSCRIBED COLLECTOR</span>
                <span className="cert-meta-val">{order.address.fullName}</span>
              </div>
              <div className="cert-meta-cell">
                <span className="cert-meta-label">ACQUISITION DATE</span>
                <span className="cert-meta-val">{formattedDate}</span>
              </div>
              <div className="cert-meta-cell">
                <span className="cert-meta-label">ORDER REFERENCE</span>
                <span className="cert-meta-val">{order.orderId}</span>
              </div>
              <div className="cert-meta-cell">
                <span className="cert-meta-label">VERIFIED DESTINATION</span>
                <span className="cert-meta-val">{order.address.city}, {order.address.state}</span>
              </div>
            </div>

            {/* Certified Timepieces List */}
            <div className="cert-pieces-box">
              <div className="cert-pieces-heading">REGISTERED TIMEPIECES</div>
              {order.items.map((item, idx) => (
                <div key={idx} className="cert-piece-row">
                  <div className="cert-piece-thumb">
                    <Image
                      src={item.image}
                      alt={item.model}
                      fill
                      sizes="48px"
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                  <div className="cert-piece-details">
                    <div className="cert-piece-brand">{item.brand}</div>
                    <div className="cert-piece-model">{item.model}</div>
                    <div className="cert-piece-spec">Individual Reference: {item.productId} &bull; Qty: {item.quantity}</div>
                  </div>
                  <div className="cert-piece-provenance-status">
                    <span>✓ Authenticated</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Signatures & Seal Footer */}
            <div className="cert-footer">
              <div className="cert-sig-block">
                <div className="cert-sig-line">Adrien de Beauharnais</div>
                <span className="cert-sig-title">Master Horologist &amp; Vault Director</span>
              </div>

              <div className="cert-gold-seal">
                <div className="cert-seal-inner">
                  <span>W</span>
                  <small>OFFICIAL SEAL</small>
                </div>
              </div>

              <div className="cert-sig-block">
                <div className="cert-sig-line">K. Singhania &amp; Co.</div>
                <span className="cert-sig-title">Registrar of Horological Provenance</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="cert-modal-actions">
          <button
            type="button"
            className="btn btn-outline"
            onClick={onClose}
          >
            Close
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => window.print()}
          >
            🖨️ Print Certificate of Provenance
          </button>
        </div>
      </div>
    </div>
  );
}
