'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { Printer, ShieldCheck, Check } from 'lucide-react';
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
    <div className="cert-modal-backdrop" onClick={onClose}>
      <div className="cert-modal-container" onClick={e => e.stopPropagation()}>
        <button
          type="button"
          className="cert-modal-close-btn"
          onClick={onClose}
          aria-label="Close certificate modal"
        >
          &times;
        </button>

        {/* Certificate Frame */}
        <div className="cert-frame">
          <div className="cert-guilloche-bg" />

          <div className="cert-content">
            {/* Header Lockup */}
            <div className="cert-header">
              <span className="cert-crest">W</span>
              <h2 className="cert-title">WRISTO</h2>
              <div className="cert-subtitle">CERTIFICATE OF PROVENANCE &amp; AUTHENTICITY</div>
              <div className="cert-seal-number">Register No. {order.certificateId}</div>
            </div>

            {/* Master Statement */}
            <p className="cert-statement">
              This official document affirms that the mechanical timepiece(s) enumerated below have undergone comprehensive optical, chronometric, and metallurgical inspection within our master vault atelier. All calibers and serial numbers are hereby registered permanently in the WRISTO Horological Provenance Archive.
            </p>

            {/* Order & Patron Meta */}
            <div className="cert-meta-grid">
              <div className="cert-meta-col">
                <span className="cert-meta-label">Registered Collector</span>
                <span className="cert-meta-val">{order.address.fullName}</span>
              </div>
              <div className="cert-meta-col">
                <span className="cert-meta-label">Acquisition Date</span>
                <span className="cert-meta-val">{formattedDate}</span>
              </div>
              <div className="cert-meta-col">
                <span className="cert-meta-label">Order Ledger Ref</span>
                <span className="cert-meta-val">{order.orderId}</span>
              </div>
              <div className="cert-meta-col">
                <span className="cert-meta-label">Sanctioned Dispatch</span>
                <span className="cert-meta-val">
                  {order.deliveryTier === 'white_glove' ? 'White-Glove Courier' : 'Insured Air Express'}
                </span>
              </div>
            </div>

            {/* Timepiece List */}
            <div className="cert-pieces-list">
              {order.items.map((item, idx) => (
                <div key={idx} className="cert-piece-item">
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
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Check size={13} strokeWidth={2.5} />
                      <span>Authenticated</span>
                    </span>
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
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <Printer size={15} strokeWidth={1.5} />
            <span>Print Certificate of Provenance</span>
          </button>
        </div>
      </div>
    </div>
  );
}
