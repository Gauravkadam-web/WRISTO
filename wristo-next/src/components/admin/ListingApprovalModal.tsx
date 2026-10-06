'use client';

import React, { useState, useEffect } from 'react';
import { X, Save, Watch, Check, AlertTriangle, ShieldCheck } from 'lucide-react';
import { AdminListing } from '@/types/admin';

interface ListingApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (listingId: string, status: 'APPROVED' | 'REJECTED' | 'PENDING', rejectionReason?: string) => Promise<void>;
  listing: AdminListing | null;
}

export default function ListingApprovalModal({
  isOpen,
  onClose,
  onUpdate,
  listing
}: ListingApprovalModalProps) {
  const [status, setStatus] = useState<'APPROVED' | 'REJECTED' | 'PENDING'>('APPROVED');
  const [rejectionReason, setRejectionReason] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (listing) {
      setStatus(listing.status);
      setRejectionReason(listing.rejectionReason || '');
    }
  }, [listing, isOpen]);

  if (!isOpen || !listing) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await onUpdate(listing.id, status, rejectionReason);
      onClose();
    } catch (err) {
      console.error('Failed to update listing status:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              background: 'rgba(176, 141, 107, 0.15)',
              color: 'var(--color-accent-champagne, #E8C89A)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Watch size={16} strokeWidth={1.5} />
            </div>
            <div>
              <h2 className="admin-modal-title">Authenticate Timepiece: {listing.brand} {listing.model}</h2>
              <p style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Horological Verification & Provenance Check</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="admin-action-btn" aria-label="Close modal">
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="admin-modal-body">
            {/* Visual & Specs Lockup */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '120px 1fr',
              gap: '16px',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '6px',
              padding: '16px'
            }}>
              <div style={{
                width: '120px',
                height: '120px',
                borderRadius: '6px',
                background: '#0F0F0F',
                backgroundImage: `url(${listing.images?.[0] || '/assets/watches/watch-patek-5711.png'})`,
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12.5px' }}>
                <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--brand-ivory)' }}>
                  {listing.brand} {listing.model}
                </div>
                <div style={{ color: 'var(--brand-bronze)', fontFamily: 'monospace' }}>
                  Ref: <span className="tabular-nums">{listing.referenceNumber}</span> • Serial: <span className="tabular-nums">{listing.serialNumber || 'VERIFIED-CH'}</span>
                </div>
                <div style={{ color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                  Condition: <strong style={{ color: 'var(--brand-ivory)' }}>{listing.condition}</strong> • Year: <span className="tabular-nums">{listing.year || 2023}</span>
                </div>
                <div className="tabular-nums" style={{ color: 'var(--color-accent-champagne)', fontSize: '16px', fontWeight: 700, marginTop: '4px' }}>
                  {formatCurrency(listing.price)}
                </div>
              </div>
            </div>

            {/* Moderation Decision */}
            <div className="admin-form-group">
              <label className="admin-form-label">Authentication Moderation Decision</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'APPROVED' | 'REJECTED' | 'PENDING')}
                className="admin-form-select"
              >
                <option value="APPROVED">APPROVED — Passed Swiss Horology Verification & Live in Catalog</option>
                <option value="PENDING">PENDING — Under Physical Vault Inspection & Dial Check</option>
                <option value="REJECTED">REJECTED — Failed Authentication or Provenance Anomaly</option>
              </select>
            </div>

            {status === 'REJECTED' && (
              <div className="admin-form-group">
                <label className="admin-form-label" style={{ color: '#E57373' }}>
                  Rejection Reason / Verification Anomaly
                </label>
                <textarea
                  rows={3}
                  required
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Specify why this timepiece listing was rejected (e.g., dial refinishing undisclosed, serial mismatch)..."
                  className="admin-form-textarea"
                />
              </div>
            )}
          </div>

          <div className="admin-modal-footer">
            <button type="button" onClick={onClose} className="admin-btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={isUpdating} className="admin-btn-primary">
              <Save size={14} strokeWidth={1.5} />
              <span>{isUpdating ? 'Saving...' : 'Apply Moderation Status'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
