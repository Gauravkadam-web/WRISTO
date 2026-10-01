'use client';

import React from 'react';
import { DeliveryTier } from '@/types/order';
import { DELIVERY_OPTIONS } from '@/services/orderService';

interface DeliveryStepProps {
  selectedDelivery: DeliveryTier;
  onSelect: (tier: DeliveryTier) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function DeliveryStep({
  selectedDelivery,
  onSelect,
  onNext,
  onBack
}: DeliveryStepProps) {
  return (
    <div className="checkout-step-card">
      <div className="checkout-card-header">
        <h2 className="checkout-card-title">02. Horological Delivery Tier</h2>
        <p className="checkout-card-subtitle">
          Select your transit protocol. Every WRISTO timepiece is dispatched in tamper-evident sealed packaging.
        </p>
      </div>

      <div className="checkout-options-list">
        {DELIVERY_OPTIONS.map(opt => {
          const isSelected = selectedDelivery === opt.id;

          return (
            <div
              key={opt.id}
              onClick={() => onSelect(opt.id)}
              className={`checkout-option-card ${isSelected ? 'selected' : ''}`}
            >
              <div className="checkout-radio-circle">
                {isSelected && <div className="checkout-radio-dot" />}
              </div>

              <div className="checkout-option-content">
                <div className="checkout-option-head">
                  <div className="checkout-option-title">
                    <span>{opt.title}</span>
                    {opt.badge && (
                      <span className="checkout-option-badge">{opt.badge}</span>
                    )}
                  </div>
                  <div className={`checkout-option-price ${opt.price === 0 ? 'complimentary' : ''}`}>
                    {opt.price === 0 ? 'Complimentary' : `+₹${opt.price.toLocaleString('en-IN')}`}
                  </div>
                </div>
                <p className="checkout-option-desc">{opt.description}</p>
                <div style={{ marginTop: '6px', fontSize: '12px', color: 'var(--color-text-muted)' }}>
                  Estimated Arrival: <strong>{opt.estimatedDelivery}</strong>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          type="button"
          onClick={onBack}
          className="btn btn-outline"
        >
          &larr; Back to Client Info
        </button>

        <button
          type="button"
          onClick={onNext}
          className="btn btn-primary btn-lg"
        >
          Continue to Secure Payment &rarr;
        </button>
      </div>
    </div>
  );
}
