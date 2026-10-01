'use client';

import React, { useState } from 'react';
import { CustomerAddress } from '@/types/order';
import { lookupPincode } from '@/services/orderService';

interface AddressStepProps {
  address: CustomerAddress;
  onChange: (updated: Partial<CustomerAddress>) => void;
  onNext: () => void;
}

export default function AddressStep({ address, onChange, onNext }: AddressStepProps) {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handlePincodeChange = (val: string) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 6);
    onChange({ pincode: cleaned });

    if (cleaned.length === 6) {
      const match = lookupPincode(cleaned);
      if (match) {
        onChange({ city: match.city, state: match.state });
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!address.fullName.trim()) {
      setErrorMsg('Please enter your full name for the authenticity certificate.');
      return;
    }
    if (!address.email.trim() || !address.email.includes('@')) {
      setErrorMsg('Please enter a valid email address to receive dispatch telemetry.');
      return;
    }
    if (!address.phone.trim() || address.phone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number for secure courier OTP.');
      return;
    }
    if (!address.pincode.trim() || address.pincode.length !== 6) {
      setErrorMsg('Please enter a valid 6-digit postal PIN code.');
      return;
    }
    if (!address.addressLine1.trim()) {
      setErrorMsg('Please enter your street address / building details.');
      return;
    }
    if (!address.city.trim() || !address.state.trim()) {
      setErrorMsg('Please specify your city and state.');
      return;
    }

    setErrorMsg(null);
    onNext();
  };

  return (
    <div className="checkout-step-card">
      <div className="checkout-card-header">
        <h2 className="checkout-card-title">01. Client & Delivery Destination</h2>
        <p className="checkout-card-subtitle">
          Enter your delivery credentials for insured transit and serialized Certificate of Provenance generation.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="checkout-form-grid">
          {/* Full Name */}
          <div className="checkout-field-full">
            <label className="checkout-label">
              Full Legal Name <span className="required">*</span>
            </label>
            <input
              type="text"
              required
              value={address.fullName}
              onChange={e => onChange({ fullName: e.target.value })}
              placeholder="e.g. Lord Vikramaditya Singhania"
              className="checkout-input"
            />
            <span className="checkout-field-hint">
              This name will be formally inscribed onto the digital Certificate of Provenance.
            </span>
          </div>

          {/* Email */}
          <div className="checkout-field-half">
            <label className="checkout-label">
              Email Address <span className="required">*</span>
            </label>
            <input
              type="email"
              required
              value={address.email}
              onChange={e => onChange({ email: e.target.value })}
              placeholder="name@domain.com"
              className="checkout-input"
            />
          </div>

          {/* Phone */}
          <div className="checkout-field-half">
            <label className="checkout-label">
              Mobile Contact <span className="required">*</span>
            </label>
            <input
              type="tel"
              required
              value={address.phone}
              onChange={e => onChange({ phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
              placeholder="10-digit mobile number"
              className="checkout-input"
            />
            <span className="checkout-field-hint">Required for secure delivery PIN on dispatch.</span>
          </div>

          {/* PIN Code */}
          <div className="checkout-field-half">
            <label className="checkout-label">
              Postal PIN Code <span className="required">*</span>
            </label>
            <input
              type="text"
              required
              maxLength={6}
              value={address.pincode}
              onChange={e => handlePincodeChange(e.target.value)}
              placeholder="e.g. 400001"
              className="checkout-input"
            />
          </div>

          {/* City */}
          <div className="checkout-field-half">
            <label className="checkout-label">
              City <span className="required">*</span>
            </label>
            <input
              type="text"
              required
              value={address.city}
              onChange={e => onChange({ city: e.target.value })}
              placeholder="e.g. Mumbai"
              className="checkout-input"
            />
          </div>

          {/* Street Address */}
          <div className="checkout-field-full">
            <label className="checkout-label">
              Street Address, Building & Suite <span className="required">*</span>
            </label>
            <input
              type="text"
              required
              value={address.addressLine1}
              onChange={e => onChange({ addressLine1: e.target.value })}
              placeholder="Penthouse 4B, Horizon Towers, Altamount Road"
              className="checkout-input"
            />
          </div>

          {/* State */}
          <div className="checkout-field-half">
            <label className="checkout-label">
              State <span className="required">*</span>
            </label>
            <input
              type="text"
              required
              value={address.state}
              onChange={e => onChange({ state: e.target.value })}
              placeholder="e.g. Maharashtra"
              className="checkout-input"
            />
          </div>

          {/* Landmark */}
          <div className="checkout-field-half">
            <label className="checkout-label">Landmark (Optional)</label>
            <input
              type="text"
              value={address.landmark || ''}
              onChange={e => onChange({ landmark: e.target.value })}
              placeholder="Near Royal Opera House"
              className="checkout-input"
            />
          </div>

          {/* Delivery Instructions */}
          <div className="checkout-field-full">
            <label className="checkout-label">Bespoke Courier Instructions (Optional)</label>
            <textarea
              rows={2}
              value={address.deliveryNotes || ''}
              onChange={e => onChange({ deliveryNotes: e.target.value })}
              placeholder="e.g. Notify private security reception prior to arrival."
              className="checkout-textarea"
            />
          </div>
        </div>

        {errorMsg && (
          <div style={{
            marginTop: '16px',
            padding: '12px 16px',
            backgroundColor: '#FFEBEE',
            border: '1px solid #FFCDD2',
            borderRadius: '4px',
            color: '#C62828',
            fontSize: '13px'
          }}>
            ⚠️ {errorMsg}
          </div>
        )}

        <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" className="btn btn-primary btn-lg">
            Continue to Horological Delivery &rarr;
          </button>
        </div>
      </form>
    </div>
  );
}
