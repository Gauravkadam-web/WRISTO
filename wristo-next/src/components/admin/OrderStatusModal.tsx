'use client';

import React, { useState, useEffect } from 'react';
import { X, Save, ShoppingBag, Truck, CheckCircle2 } from 'lucide-react';
import { AdminOrder } from '@/types/admin';

interface OrderStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (orderId: string, status: string, trackingNumber?: string, courierName?: string) => Promise<void>;
  order: AdminOrder | null;
}

export default function OrderStatusModal({
  isOpen,
  onClose,
  onUpdate,
  order
}: OrderStatusModalProps) {
  const [status, setStatus] = useState<string>('PROCESSING');
  const [trackingNumber, setTrackingNumber] = useState<string>('');
  const [courierName, setCourierName] = useState<string>('Brinks Luxury Armored Logistics');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (order) {
      setStatus(order.orderStatus);
      setTrackingNumber(order.trackingNumber || '');
      setCourierName(order.courierName || 'Brinks Luxury Armored Logistics');
    }
  }, [order, isOpen]);

  if (!isOpen || !order) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await onUpdate(order.id, status, trackingNumber, courierName);
      onClose();
    } catch (err) {
      console.error('Failed to update order status:', err);
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
              <ShoppingBag size={16} strokeWidth={1.5} />
            </div>
            <div>
              <h2 className="admin-modal-title">Fulfillment Pipeline: {order.orderNumber}</h2>
              <p style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Acquisition Ledger Reference</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="admin-action-btn" aria-label="Close modal">
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="admin-modal-body">
            {/* Client Snapshot */}
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
                <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '11px' }}>Client</span>
                <strong style={{ color: 'var(--brand-ivory)' }}>{order.customerName}</strong>
                <div style={{ color: 'var(--color-text-secondary)', fontSize: '11.5px' }}>{order.customerEmail}</div>
              </div>
              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '11px' }}>Total Acquisition Amount</span>
                <strong className="tabular-nums" style={{ color: 'var(--color-accent-champagne)', fontSize: '15px' }}>
                  {formatCurrency(order.totalAmount)}
                </strong>
                <div style={{ color: 'var(--brand-bronze)', fontSize: '11px' }}>{order.paymentStatus} • {order.paymentMethod}</div>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <span className="admin-form-label" style={{ marginBottom: '8px', display: 'block' }}>Acquired Timepieces</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {order.items.map((item, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderRadius: '4px',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    fontSize: '12.5px'
                  }}>
                    <div>
                      <span style={{ fontWeight: 600, color: 'var(--brand-ivory)' }}>{item.brand}</span>
                      <span style={{ color: 'var(--color-text-secondary)', marginLeft: '6px' }}>{item.model}</span>
                      <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginLeft: '6px' }}>x{item.quantity}</span>
                    </div>
                    <span className="tabular-nums" style={{ fontWeight: 600, color: 'var(--color-accent-champagne)' }}>
                      {formatCurrency(item.unitPrice * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Lifecycle Pipeline Status */}
            <div className="admin-form-group">
              <label className="admin-form-label">Order Pipeline Lifecycle State</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="admin-form-select"
              >
                <option value="PENDING">PENDING — Order Received & Awaiting Verification</option>
                <option value="PROCESSING">PROCESSING — Watch Vault Authentication & Packaging</option>
                <option value="SHIPPED">SHIPPED — Dispatched with Armored White-Glove Courier</option>
                <option value="DELIVERED">DELIVERED — Successfully Handed Over to Client</option>
                <option value="CANCELLED">CANCELLED — Acquisition Revoked</option>
              </select>
            </div>

            {/* Armored Courier & Tracking */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="admin-form-group">
                <label className="admin-form-label">Armored Logistics Courier</label>
                <input
                  type="text"
                  value={courierName}
                  onChange={(e) => setCourierName(e.target.value)}
                  placeholder="e.g. Brinks Luxury Armored Logistics"
                  className="admin-form-input"
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Secure Tracking / Vault Seal</label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="e.g. BRK-88392019-CH"
                  className="admin-form-input"
                  style={{ fontFamily: 'monospace' }}
                />
              </div>
            </div>
          </div>

          <div className="admin-modal-footer">
            <button type="button" onClick={onClose} className="admin-btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={isUpdating} className="admin-btn-primary">
              <Save size={14} strokeWidth={1.5} />
              <span>{isUpdating ? 'Updating Ledger...' : 'Update Fulfillment Status'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
