'use client';

import React, { useState } from 'react';
import { PaymentMethodType } from '@/types/order';
import { PAYMENT_OPTIONS } from '@/services/orderService';
import { Check, ShieldCheck, Sparkles } from 'lucide-react';

interface PaymentStepProps {
  selectedPayment: PaymentMethodType;
  onSelect: (method: PaymentMethodType) => void;
  onNext: () => void;
  onBack: () => void;
  totalAmount: number;
}

export default function PaymentStep({
  selectedPayment,
  onSelect,
  onNext,
  onBack,
  totalAmount
}: PaymentStepProps) {
  const [upiId, setUpiId] = useState('');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    holder: '',
    expiry: '',
    cvv: ''
  });
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [emiTenure, setEmiTenure] = useState('3_months');

  const monthlyEmi3 = Math.round(totalAmount / 3);
  const monthlyEmi6 = Math.round(totalAmount / 6);

  return (
    <div className="checkout-step-card">
      <div className="checkout-card-header">
        <h2 className="checkout-card-title">03. Secure Horological Settlement</h2>
        <p className="checkout-card-subtitle">
          Select your preferred payment channel. All transactions are protected by bank-grade 256-bit encryption.
        </p>
      </div>

      <div className="checkout-options-list">
        {PAYMENT_OPTIONS.map(opt => {
          const isSelected = selectedPayment === opt.id;

          return (
            <div key={opt.id}>
              <div
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
                  </div>
                  <p className="checkout-option-desc">{opt.subtitle}</p>
                </div>
              </div>

              {/* Sub-panels when selected */}
              {isSelected && opt.id === 'upi' && (
                <div style={{
                  padding: '16px 20px',
                  backgroundColor: '#FAF8F5',
                  border: '1px solid var(--color-border-light)',
                  borderTop: 'none',
                  borderRadius: '0 0 8px 8px',
                  marginTop: '-4px',
                  marginBottom: '10px'
                }}>
                  <label className="checkout-label" style={{ fontSize: '11px' }}>
                    Enter Virtual Payment Address (UPI ID)
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      placeholder="e.g. collector@okhdfcbank"
                      value={upiId}
                      onChange={e => setUpiId(e.target.value)}
                      className="checkout-input"
                      style={{ fontSize: '13px' }}
                    />
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      style={{ whiteSpace: 'nowrap' }}
                      onClick={() => alert(`Simulated payment request initiated for ${upiId || 'collector@upi'}.`)}
                    >
                      Verify UPI
                    </button>
                  </div>
                  <div style={{ display: 'flex', gap: '16px', marginTop: '10px', fontSize: '11px', color: 'var(--color-text-muted)' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Check size={12} strokeWidth={2} style={{ color: 'var(--color-success)' }} /> Google Pay</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Check size={12} strokeWidth={2} style={{ color: 'var(--color-success)' }} /> PhonePe</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Check size={12} strokeWidth={2} style={{ color: 'var(--color-success)' }} /> Paytm</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Check size={12} strokeWidth={2} style={{ color: 'var(--color-success)' }} /> Cred UPI</span>
                  </div>
                </div>
              )}

              {isSelected && opt.id === 'card' && (
                <div style={{
                  padding: '16px 20px',
                  backgroundColor: '#FAF8F5',
                  border: '1px solid var(--color-border-light)',
                  borderTop: 'none',
                  borderRadius: '0 0 8px 8px',
                  marginTop: '-4px',
                  marginBottom: '10px'
                }}>
                  <div className="checkout-form-grid">
                    <div className="checkout-field-full">
                      <label className="checkout-label" style={{ fontSize: '11px' }}>Card Number</label>
                      <input
                        type="text"
                        placeholder="4532 •••• •••• 8912"
                        maxLength={19}
                        value={cardDetails.number}
                        onChange={e => setCardDetails({ ...cardDetails, number: e.target.value })}
                        className="checkout-input"
                        style={{ fontSize: '13px' }}
                      />
                    </div>
                    <div className="checkout-field-half">
                      <label className="checkout-label" style={{ fontSize: '11px' }}>Cardholder Name</label>
                      <input
                        type="text"
                        placeholder="Name on card"
                        value={cardDetails.holder}
                        onChange={e => setCardDetails({ ...cardDetails, holder: e.target.value })}
                        className="checkout-input"
                        style={{ fontSize: '13px' }}
                      />
                    </div>
                    <div className="checkout-field-half" style={{ display: 'flex', gap: '8px' }}>
                      <div style={{ flex: 1 }}>
                        <label className="checkout-label" style={{ fontSize: '11px' }}>Valid Thru</label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          maxLength={5}
                          value={cardDetails.expiry}
                          onChange={e => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                          className="checkout-input"
                          style={{ fontSize: '13px' }}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label className="checkout-label" style={{ fontSize: '11px' }}>CVV</label>
                        <input
                          type="password"
                          placeholder="•••"
                          maxLength={4}
                          value={cardDetails.cvv}
                          onChange={e => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                          className="checkout-input"
                          style={{ fontSize: '13px' }}
                        />
                      </div>
                    </div>

                    {totalAmount >= 10000 && (
                      <div className="checkout-field-full" style={{ marginTop: '8px', paddingTop: '10px', borderTop: '1px solid var(--color-border-light)' }}>
                        <label className="checkout-label" style={{ fontSize: '11px', color: 'var(--color-gold-hover)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <Sparkles size={14} strokeWidth={1.5} /> 0% No-Cost EMI Available for this timepiece:
                        </label>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                          <button
                            type="button"
                            onClick={() => setEmiTenure('full')}
                            className={`btn btn-sm ${emiTenure === 'full' ? 'btn-primary' : 'btn-outline'}`}
                            style={{ fontSize: '11px' }}
                          >
                            Full Payment (₹{totalAmount.toLocaleString('en-IN')})
                          </button>
                          <button
                            type="button"
                            onClick={() => setEmiTenure('3_months')}
                            className={`btn btn-sm ${emiTenure === '3_months' ? 'btn-primary' : 'btn-outline'}`}
                            style={{ fontSize: '11px' }}
                          >
                            3 Months × ₹{monthlyEmi3.toLocaleString('en-IN')}/mo
                          </button>
                          <button
                            type="button"
                            onClick={() => setEmiTenure('6_months')}
                            className={`btn btn-sm ${emiTenure === '6_months' ? 'btn-primary' : 'btn-outline'}`}
                            style={{ fontSize: '11px' }}
                          >
                            6 Months × ₹{monthlyEmi6.toLocaleString('en-IN')}/mo
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {isSelected && opt.id === 'netbanking' && (
                <div style={{
                  padding: '16px 20px',
                  backgroundColor: '#FAF8F5',
                  border: '1px solid var(--color-border-light)',
                  borderTop: 'none',
                  borderRadius: '0 0 8px 8px',
                  marginTop: '-4px',
                  marginBottom: '10px'
                }}>
                  <label className="checkout-label" style={{ fontSize: '11px' }}>Select Bank</label>
                  <select
                    value={selectedBank}
                    onChange={e => setSelectedBank(e.target.value)}
                    className="checkout-select"
                    style={{ fontSize: '13px' }}
                  >
                    <option value="HDFC Bank">HDFC Bank</option>
                    <option value="ICICI Bank">ICICI Bank</option>
                    <option value="State Bank of India">State Bank of India</option>
                    <option value="Axis Bank">Axis Bank</option>
                    <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                    <option value="Federal Bank">Federal Bank</option>
                  </select>
                </div>
              )}

              {isSelected && opt.id === 'cod' && (
                <div style={{
                  padding: '14px 20px',
                  backgroundColor: '#FFFDF9',
                  border: '1px solid rgba(176, 141, 107, 0.3)',
                  borderTop: 'none',
                  borderRadius: '0 0 8px 8px',
                  marginTop: '-4px',
                  marginBottom: '10px',
                  fontSize: '12px',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.5,
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'flex-start'
                }}>
                  <ShieldCheck size={18} strokeWidth={1.5} style={{ color: 'var(--brand-bronze)', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>Horological Inspection Protocol:</strong> Your timepiece arrives in an armored security box with a serialized tamper-evident seal. You are invited to inspect the outer seal and documentation with the courier before releasing payment via Cash or Mobile UPI.
                  </div>
                </div>
              )}
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
          &larr; Back to Delivery Tier
        </button>

        <button
          type="button"
          id="checkout-payment-continue-btn"
          onClick={onNext}
          className="btn btn-primary btn-lg"
        >
          Review Horological Order &rarr;
        </button>
      </div>
    </div>
  );
}
