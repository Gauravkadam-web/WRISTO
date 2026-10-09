'use client';

import React from 'react';
import { PaymentMethodType } from '@/types/order';
import { PAYMENT_OPTIONS } from '@/services/orderService';
import { ShieldCheck, Lock, CreditCard, Smartphone, Building2, Sparkles, CheckCircle2 } from 'lucide-react';

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
  // Normalize selection: if it was upi/card/netbanking, map to razorpay
  const activeMethod = selectedPayment === 'cod' ? 'cod' : 'razorpay';

  const monthlyEmi3 = Math.round(totalAmount / 3);
  const monthlyEmi6 = Math.round(totalAmount / 6);

  return (
    <div className="checkout-step-card">
      <div className="checkout-card-header">
        <h2 className="checkout-card-title">03. Secure Horological Settlement</h2>
        <p className="checkout-card-subtitle">
          Select your settlement gateway. All transactions are protected with bank-grade 256-bit encryption and horological escrow protection.
        </p>
      </div>

      <div className="checkout-options-list">
        {PAYMENT_OPTIONS.map(opt => {
          const isSelected = activeMethod === opt.id;

          return (
            <div key={opt.id} style={{ marginBottom: '16px' }}>
              <div
                onClick={() => onSelect(opt.id)}
                className={`checkout-option-card ${isSelected ? 'selected' : ''}`}
                style={{
                  cursor: 'pointer',
                  transition: 'all 200ms ease',
                  border: isSelected ? '1.5px solid var(--brand-bronze, #B08D6B)' : '1px solid var(--color-border-light, #E5E5E5)',
                  backgroundColor: isSelected ? 'rgba(176, 141, 107, 0.04)' : '#FFFFFF'
                }}
              >
                <div className="checkout-radio-circle">
                  {isSelected && <div className="checkout-radio-dot" />}
                </div>

                <div className="checkout-option-content" style={{ width: '100%' }}>
                  <div className="checkout-option-head" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                    <div className="checkout-option-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontWeight: 600, fontSize: '15px' }}>{opt.title}</span>
                      {opt.badge && (
                        <span className="checkout-option-badge" style={{ backgroundColor: 'var(--brand-bronze)', color: '#FFFFFF', fontSize: '10px', padding: '2px 8px', borderRadius: '999px', fontWeight: 700 }}>
                          {opt.badge}
                        </span>
                      )}
                    </div>

                    {opt.id === 'razorpay' && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--color-success, #3F8A62)', fontWeight: 600 }}>
                        <Lock size={12} strokeWidth={2.2} /> 256-Bit SSL Encrypted
                      </span>
                    )}
                  </div>

                  <p className="checkout-option-desc" style={{ marginTop: '6px', fontSize: '13px', color: 'var(--color-text-secondary, #666666)', lineHeight: 1.5 }}>
                    {opt.subtitle}
                  </p>

                  {/* Luxury Gateway Trust Chips for Razorpay */}
                  {opt.id === 'razorpay' && (
                    <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid rgba(0, 0, 0, 0.06)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                        <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Supported Channels:
                        </span>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11.5px', padding: '3px 8px', background: '#F5F3EF', borderRadius: '4px', border: '1px solid #E6E1D8', color: '#333333' }}>
                          <Smartphone size={12} strokeWidth={1.8} style={{ color: 'var(--brand-bronze)' }} /> UPI (GPay, PhonePe, Paytm, Cred)
                        </div>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11.5px', padding: '3px 8px', background: '#F5F3EF', borderRadius: '4px', border: '1px solid #E6E1D8', color: '#333333' }}>
                          <CreditCard size={12} strokeWidth={1.8} style={{ color: 'var(--brand-bronze)' }} /> Visa, Mastercard, Amex, RuPay
                        </div>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11.5px', padding: '3px 8px', background: '#F5F3EF', borderRadius: '4px', border: '1px solid #E6E1D8', color: '#333333' }}>
                          <Building2 size={12} strokeWidth={1.8} style={{ color: 'var(--brand-bronze)' }} /> 50+ Premier Banks NetBanking
                        </div>
                      </div>

                      {totalAmount >= 10000 && (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontSize: '12px',
                          color: '#8A6D3B',
                          background: 'rgba(232, 200, 154, 0.15)',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          border: '1px solid rgba(176, 141, 107, 0.25)'
                        }}>
                          <Sparkles size={13} strokeWidth={2} style={{ color: 'var(--brand-bronze)' }} />
                          <span><strong>0% No-Cost EMI Available:</strong> ₹{monthlyEmi3.toLocaleString('en-IN')}/mo (3 mos) or ₹{monthlyEmi6.toLocaleString('en-IN')}/mo (6 mos) selectable in Razorpay.</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* COD Inspection Protocol */}
                  {opt.id === 'cod' && (
                    <div style={{
                      marginTop: '12px',
                      padding: '12px 14px',
                      backgroundColor: '#FFFDF9',
                      border: '1px solid rgba(176, 141, 107, 0.25)',
                      borderRadius: '6px',
                      fontSize: '12px',
                      color: 'var(--color-text-secondary)',
                      lineHeight: 1.5,
                      display: 'flex',
                      gap: '10px',
                      alignItems: 'flex-start'
                    }}>
                      <ShieldCheck size={18} strokeWidth={1.8} style={{ color: 'var(--brand-bronze)', flexShrink: 0, marginTop: '2px' }} />
                      <div>
                        <strong>Horological Inspection Protocol:</strong> Your timepiece arrives in an armored security case with a serialized tamper-evident seal. You are invited to inspect the seal and documentation with our courier before releasing payment.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Security Assurance Guarantee */}
      <div style={{
        marginTop: '16px',
        padding: '14px 18px',
        background: '#FAFAFA',
        border: '1px solid #EEEEEE',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <CheckCircle2 size={18} strokeWidth={2} style={{ color: 'var(--color-success, #3F8A62)', flexShrink: 0 }} />
        <span style={{ fontSize: '12px', color: '#666666', lineHeight: 1.4 }}>
          <strong>WRISTO Escrow Protection:</strong> Funds are held securely in escrow until physical delivery and certification are fulfilled by our master horology boutique.
        </span>
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
