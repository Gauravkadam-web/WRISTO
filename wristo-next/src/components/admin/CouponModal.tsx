'use client';

import React, { useState, useEffect } from 'react';
import { X, Save, Tag } from 'lucide-react';
import { AdminCoupon } from '@/types/admin';

interface CouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (coupon: Partial<AdminCoupon>) => Promise<void>;
  couponToEdit?: AdminCoupon | null;
}

export default function CouponModal({
  isOpen,
  onClose,
  onSave,
  couponToEdit
}: CouponModalProps) {
  const [formData, setFormData] = useState<Partial<AdminCoupon>>({
    code: '',
    discountType: 'PERCENTAGE',
    discountValue: 10,
    minOrderAmount: 5000,
    maxDiscountAmount: 2000,
    validFrom: new Date().toISOString().split('T')[0],
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    usageLimit: 100,
    active: true
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (couponToEdit) {
      setFormData(couponToEdit);
    } else {
      setFormData({
        code: '',
        discountType: 'PERCENTAGE',
        discountValue: 10,
        minOrderAmount: 5000,
        maxDiscountAmount: 2000,
        validFrom: new Date().toISOString().split('T')[0],
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        usageLimit: 100,
        active: true
      });
    }
  }, [couponToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave({
        ...formData,
        code: (formData.code || '').trim().toUpperCase()
      });
      onClose();
    } catch (err) {
      console.error('Failed to save coupon:', err);
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
              <Tag size={16} strokeWidth={1.5} />
            </div>
            <h2 className="admin-modal-title">
              {couponToEdit ? 'Edit Privilege Code' : 'Issue New VIP Privilege Code'}
            </h2>
          </div>
          <button type="button" onClick={onClose} className="admin-action-btn" aria-label="Close modal">
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="admin-modal-body">
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px' }}>
              <div className="admin-form-group">
                <label className="admin-form-label">Privilege Code</label>
                <input
                  type="text"
                  required
                  value={formData.code || ''}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. VIPEXCLUSIVE10"
                  className="admin-form-input"
                  style={{ textTransform: 'uppercase', fontFamily: 'monospace', fontWeight: 600 }}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Discount Type</label>
                <select
                  value={formData.discountType || 'PERCENTAGE'}
                  onChange={(e) => setFormData({ ...formData, discountType: e.target.value as 'PERCENTAGE' | 'FIXED_AMOUNT' })}
                  className="admin-form-select"
                >
                  <option value="PERCENTAGE">Percentage (%)</option>
                  <option value="FIXED_AMOUNT">Fixed Value (₹ INR)</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div className="admin-form-group">
                <label className="admin-form-label">
                  {formData.discountType === 'PERCENTAGE' ? 'Discount Rate (%)' : 'Discount (₹)'}
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={formData.discountValue || ''}
                  onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                  className="admin-form-input"
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Min Spend (₹)</label>
                <input
                  type="number"
                  min={0}
                  value={formData.minOrderAmount || ''}
                  onChange={(e) => setFormData({ ...formData, minOrderAmount: Number(e.target.value) })}
                  className="admin-form-input"
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Max Concession (₹)</label>
                <input
                  type="number"
                  min={0}
                  value={formData.maxDiscountAmount || ''}
                  onChange={(e) => setFormData({ ...formData, maxDiscountAmount: Number(e.target.value) })}
                  className="admin-form-input"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div className="admin-form-group">
                <label className="admin-form-label">Valid From</label>
                <input
                  type="date"
                  required
                  value={formData.validFrom || ''}
                  onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                  className="admin-form-input"
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Valid Until</label>
                <input
                  type="date"
                  required
                  value={formData.validUntil || ''}
                  onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                  className="admin-form-input"
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Usage Cap</label>
                <input
                  type="number"
                  min={1}
                  value={formData.usageLimit || ''}
                  onChange={(e) => setFormData({ ...formData, usageLimit: Number(e.target.value) })}
                  className="admin-form-input"
                />
              </div>
            </div>

            <div style={{
              padding: '12px 16px',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '6px'
            }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                <input
                  type="checkbox"
                  checked={formData.active || false}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                />
                <span style={{ color: 'var(--brand-ivory)' }}>Active & Redeemable at Checkout</span>
              </label>
            </div>
          </div>

          <div className="admin-modal-footer">
            <button type="button" onClick={onClose} className="admin-btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={isSaving} className="admin-btn-primary">
              <Save size={14} strokeWidth={1.5} />
              <span>{isSaving ? 'Saving...' : 'Save Privilege Code'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
