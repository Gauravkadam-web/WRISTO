'use client';

import React, { useState } from 'react';
import { CustomerAddress, DeliveryTier, PaymentMethodType } from '@/types/order';
import { DELIVERY_OPTIONS, PAYMENT_OPTIONS } from '@/services/orderService';
import { Gift, Award } from 'lucide-react';

interface ReviewStepProps {
  address: CustomerAddress;
  deliveryTier: DeliveryTier;
  paymentMethod: PaymentMethodType;
  isGiftWrapped: boolean;
  giftMessage?: string;
  totalAmount: number;
  onEditStep: (step: number) => void;
  onPlaceOrder: () => void;
  onBack: () => void;
  isPlacing: boolean;
}

export default function ReviewStep({
  address,
  deliveryTier,
  paymentMethod,
  isGiftWrapped,
  giftMessage,
  totalAmount,
  onEditStep,
  onPlaceOrder,
  onBack,
  isPlacing
}: ReviewStepProps) {
  const [agreedToTerms, setAgreedToTerms] = useState(true);

  const selectedDeliveryObj = DELIVERY_OPTIONS.find(d => d.id === deliveryTier);
  const selectedPaymentObj = PAYMENT_OPTIONS.find(p => p.id === paymentMethod);

  return (
    <div className="checkout-step-card">
      <div className="checkout-card-header">
        <h2 className="checkout-card-title">04. Final Horological Verification</h2>
        <p className="checkout-card-subtitle">
          Please review your acquisition details before securing allocation from the brand vaults.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Client & Address Box */}
        <div style={{
          padding: '16px 20px',
          border: '1px solid var(--color-border-light)',
          borderRadius: '8px',
          backgroundColor: '#FAF8F5'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, color: 'var(--color-text-muted)' }}>
              Client & Delivery Destination
            </span>
            <button
              type="button"
              onClick={() => onEditStep(1)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-gold-hover)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Modify &rarr;
            </button>
          </div>
          <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
            {address.fullName}
          </div>
          <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
            {address.addressLine1}
            {address.addressLine2 ? `, ${address.addressLine2}` : ''}
          </div>
          <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
            {address.city}, {address.state} — {address.pincode}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
            {address.email} • +91 {address.phone}
          </div>
        </div>

        {/* Delivery Method Box */}
        <div style={{
          padding: '16px 20px',
          border: '1px solid var(--color-border-light)',
          borderRadius: '8px',
          backgroundColor: '#FAF8F5'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, color: 'var(--color-text-muted)' }}>
              Delivery Tier & Packaging
            </span>
            <button
              type="button"
              onClick={() => onEditStep(2)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-gold-hover)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Modify &rarr;
            </button>
          </div>
          <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
            {selectedDeliveryObj?.title}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
            {selectedDeliveryObj?.description} (ETA: {selectedDeliveryObj?.estimatedDelivery})
          </div>
        </div>

        {/* Payment Method Box */}
        <div style={{
          padding: '16px 20px',
          border: '1px solid var(--color-border-light)',
          borderRadius: '8px',
          backgroundColor: '#FAF8F5'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, color: 'var(--color-text-muted)' }}>
              Settlement Channel
            </span>
            <button
              type="button"
              onClick={() => onEditStep(3)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-gold-hover)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Modify &rarr;
            </button>
          </div>
          <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
            {selectedPaymentObj?.title}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
            {selectedPaymentObj?.subtitle}
          </div>
        </div>

        {/* Bespoke Gift Packaging (if selected) */}
        {isGiftWrapped && (
          <div style={{
            padding: '14px 20px',
            border: '1px dashed var(--color-gold-primary)',
            borderRadius: '8px',
            backgroundColor: '#FFFDF9'
          }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-gold-hover)', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Gift size={15} strokeWidth={1.5} /> Complimentary Bespoke Gift Packaging
            </div>
            {giftMessage && (
              <p style={{ fontSize: '13px', fontStyle: 'italic', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                &ldquo;{giftMessage}&rdquo;
              </p>
            )}
          </div>
        )}

        {/* Horological Provenance Pledge */}
        <div style={{
          padding: '16px 20px',
          border: '1px solid rgba(176, 141, 107, 0.25)',
          borderRadius: '8px',
          backgroundColor: '#FCFAF7',
          display: 'flex',
          gap: '12px',
          alignItems: 'flex-start'
        }}>
          <Award size={22} strokeWidth={1.5} style={{ color: 'var(--brand-bronze)', flexShrink: 0, marginTop: '2px' }} />
          <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
            <strong style={{ color: 'var(--color-text-primary)' }}>Horological Provenance Guarantee:</strong> Every timepiece is physically inspected by certified horologists before shipment. An individual serialized Certificate of Provenance is officially registered in your name upon order placement.
          </div>
        </div>

        {/* Terms Checkbox */}
        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', cursor: 'pointer', userSelect: 'none', marginTop: '8px' }}>
          <input
            type="checkbox"
            id="checkout-terms-checkbox"
            checked={agreedToTerms}
            onChange={e => setAgreedToTerms(e.target.checked)}
            style={{ width: '16px', height: '16px', accentColor: 'var(--color-gold-primary)' }}
          />
          <span>I agree to WRISTO&apos;s Horological Terms of Acquisition &amp; 30-Day Inspection Policy.</span>
        </label>
      </div>

      <div style={{ marginTop: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          type="button"
          onClick={onBack}
          disabled={isPlacing}
          className="btn btn-outline"
        >
          &larr; Back to Payment
        </button>

        <button
          type="button"
          id="checkout-place-order-btn"
          onClick={onPlaceOrder}
          disabled={!agreedToTerms || isPlacing}
          className="btn btn-primary btn-lg"
          style={{ minWidth: '260px' }}
        >
          {isPlacing ? (
            <span>Securing Timepiece...</span>
          ) : (
            <span>Place Order &bull; ₹{totalAmount.toLocaleString('en-IN')} &rarr;</span>
          )}
        </button>
      </div>
    </div>
  );
}
