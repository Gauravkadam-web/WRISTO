'use client';

import React, { useState, useEffect } from 'react';
import { X, Save, Users, ShieldCheck, Check, AlertTriangle } from 'lucide-react';
import { AdminSeller } from '@/types/admin';

interface SellerReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (sellerId: string, isVerified: boolean, notes?: string) => Promise<void>;
  seller: AdminSeller | null;
}

export default function SellerReviewModal({
  isOpen,
  onClose,
  onSave,
  seller
}: SellerReviewModalProps) {
  const [isVerified, setIsVerified] = useState<boolean>(true);
  const [notes, setNotes] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (seller) {
      setIsVerified(seller.isVerified);
      setNotes('');
    }
  }, [seller, isOpen]);

  if (!isOpen || !seller) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(seller.id, isVerified, notes);
      onClose();
    } catch (err) {
      console.error('Failed to update seller:', err);
    } finally {
      setIsSaving(false);
    }
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
              <Users size={16} strokeWidth={1.5} />
            </div>
            <div>
              <h2 className="admin-modal-title">Boutique Dossier: {seller.boutiqueName}</h2>
              <p style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Horological Dealer Verification</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="admin-action-btn" aria-label="Close modal">
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="admin-modal-body">
            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '6px',
              padding: '16px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              fontSize: '12.5px'
            }}>
              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '11px' }}>Dealer / Contact</span>
                <strong style={{ color: 'var(--brand-ivory)' }}>{seller.sellerName}</strong>
                <div style={{ color: 'var(--color-text-secondary)', fontSize: '11.5px' }}>{seller.email} • {seller.phone}</div>
              </div>
              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '11px' }}>Jurisdiction / City</span>
                <strong style={{ color: 'var(--brand-ivory)' }}>{seller.city}, {seller.country}</strong>
                <div style={{ color: 'var(--brand-bronze)', fontSize: '11px' }}>Business Reg: {seller.businessRegistrationNumber}</div>
              </div>
            </div>

            <div>
              <span className="admin-form-label" style={{ marginBottom: '8px', display: 'block' }}>Authorized Brand Portfolio</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {seller.authorizedBrands.map((b, idx) => (
                  <span key={idx} style={{
                    fontSize: '11.5px',
                    fontWeight: 600,
                    color: 'var(--color-accent-champagne)',
                    background: 'rgba(232, 200, 154, 0.08)',
                    padding: '3px 10px',
                    borderRadius: '4px',
                    border: '1px solid rgba(232, 200, 154, 0.2)'
                  }}>
                    {b}
                  </span>
                ))}
              </div>
            </div>

            <div style={{
              padding: '12px 16px',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '6px'
            }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px' }}>
                <input
                  type="checkbox"
                  checked={isVerified}
                  onChange={(e) => setIsVerified(e.target.checked)}
                />
                <span style={{ color: 'var(--brand-ivory)', fontWeight: 600 }}>
                  Grant WRISTO Certified Horological Dealer Status
                </span>
              </label>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Verification Audit Notes</label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Log physical boutique inspection details, Swiss chamber credentials, or KYC authorization notes..."
                className="admin-form-textarea"
              />
            </div>
          </div>

          <div className="admin-modal-footer">
            <button type="button" onClick={onClose} className="admin-btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={isSaving} className="admin-btn-primary">
              <Save size={14} strokeWidth={1.5} />
              <span>{isSaving ? 'Updating...' : 'Save Authorization'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
