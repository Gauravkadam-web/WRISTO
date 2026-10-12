'use client';

import React, { useState } from 'react';
import { X, AlertTriangle, ShieldCheck, Check } from 'lucide-react';
import { OrderRecord } from '@/types/order';
import { cancelOrder } from '@/services/orderService';

interface OrderCancellationModalProps {
  order: OrderRecord;
  isOpen: boolean;
  onClose: () => void;
  onCancelled: (orderId: string) => void;
}

const CANCELLATION_REASONS = [
  'Change of acquisition intent / Ordered in error',
  'Need to modify delivery address or recipient protocol',
  'Prefer an alternative horological reference or caliber',
  'Financial timing or payment method reconsideration',
  'Delivery timeline incompatibility',
  'Other bespoke reasoning'
];

export default function OrderCancellationModal({
  order,
  isOpen,
  onClose,
  onCancelled
}: OrderCancellationModalProps) {
  const [selectedReason, setSelectedReason] = useState(CANCELLATION_REASONS[0]);
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConfirmCancel = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);

    const fullReason = additionalNotes.trim()
      ? `${selectedReason}: ${additionalNotes.trim()}`
      : selectedReason;

    try {
      const res = await cancelOrder(order.orderId, fullReason);
      if (res.success) {
        onCancelled(order.orderId);
        onClose();
      } else {
        setErrorMessage(res.message);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to cancel order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      background: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(8px)'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '520px',
        background: '#121212',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        padding: '28px',
        position: 'relative',
        boxShadow: '0 24px 48px rgba(0, 0, 0, 0.7)'
      }}>
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'transparent',
            border: 'none',
            color: 'var(--color-text-secondary)',
            cursor: 'pointer',
            padding: '4px'
          }}
          aria-label="Close"
        >
          <X size={18} strokeWidth={1.5} />
        </button>

        {/* Warning Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '16px'
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'rgba(239, 68, 68, 0.12)',
            color: '#ef4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <AlertTriangle size={20} strokeWidth={1.5} />
          </div>
          <div>
            <h3 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '20px',
              fontWeight: 500,
              color: 'var(--color-text-primary)'
            }}>
              Cancel Timepiece Acquisition
            </h3>
            <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }} className="tabular-nums">
              Reference: {order.orderId}
            </span>
          </div>
        </div>

        {/* Explanation */}
        <p style={{
          fontSize: '13px',
          color: 'var(--color-text-secondary)',
          lineHeight: 1.6,
          marginBottom: '20px'
        }}>
          Cancelling will immediately release the reserved serial piece back to the public catalog archive. If already settled, any electronic payment holds will be credited back per standard banking timelines.
        </p>

        {/* Reason Selector */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{
            display: 'block',
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--brand-bronze)',
            fontWeight: 600,
            marginBottom: '8px'
          }}>
            Reason for Cancellation
          </label>
          <select
            value={selectedReason}
            onChange={(e) => setSelectedReason(e.target.value)}
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '6px',
              background: '#1A1A1A',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: 'var(--color-text-primary)',
              fontSize: '13px',
              outline: 'none'
            }}
          >
            {CANCELLATION_REASONS.map((r, idx) => (
              <option key={idx} value={r} style={{ background: '#1A1A1A', color: '#fff' }}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* Additional Notes */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'block',
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--color-text-secondary)',
            marginBottom: '6px'
          }}>
            Additional Specifications (Optional)
          </label>
          <textarea
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            disabled={isSubmitting}
            placeholder="Share any specific notes for our concierge team..."
            rows={2}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '6px',
              background: '#1A1A1A',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: 'var(--color-text-primary)',
              fontSize: '13px',
              resize: 'none',
              outline: 'none'
            }}
          />
        </div>

        {/* Error message if any */}
        {errorMessage && (
          <div style={{
            padding: '10px 14px',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            borderRadius: '6px',
            color: '#f87171',
            fontSize: '12px',
            marginBottom: '16px'
          }}>
            {errorMessage}
          </div>
        )}

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px'
        }}>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="btn btn-outline btn-sm"
            style={{ padding: '8px 18px', fontSize: '13px' }}
          >
            Keep Reservation
          </button>
          <button
            type="button"
            onClick={handleConfirmCancel}
            disabled={isSubmitting}
            style={{
              padding: '8px 20px',
              fontSize: '13px',
              fontWeight: 600,
              borderRadius: '6px',
              background: '#ef4444',
              color: '#ffffff',
              border: 'none',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              opacity: isSubmitting ? 0.7 : 1,
              transition: 'background 0.2s ease'
            }}
          >
            {isSubmitting ? 'Cancelling...' : 'Confirm Cancellation'}
          </button>
        </div>
      </div>
    </div>
  );
}
