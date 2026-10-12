'use client';

import React from 'react';
import { Check, Clock, Truck, ShieldCheck, XCircle } from 'lucide-react';
import { OrderRecord } from '@/types/order';

interface OrderTrackingTimelineProps {
  order: OrderRecord;
}

export default function OrderTrackingTimeline({ order }: OrderTrackingTimelineProps) {
  const isCancelled = (order.status || '').toLowerCase() === 'cancelled';

  if (isCancelled) {
    return (
      <div style={{
        marginTop: '16px',
        padding: '14px 18px',
        borderRadius: '8px',
        background: 'rgba(239, 68, 68, 0.06)',
        border: '1px solid rgba(239, 68, 68, 0.2)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: 'rgba(239, 68, 68, 0.12)',
          color: '#ef4444',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <XCircle size={18} strokeWidth={1.5} />
        </div>
        <div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#f87171' }}>
            Acquisition Cancelled
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
            This reservation was retracted and the reserved timepiece has been securely returned to vault stock.
          </div>
        </div>
      </div>
    );
  }

  // Derive active step index
  // 0: CONFIRMED
  // 1: PROCESSING / PROCESSING_VAULT
  // 2: DISPATCHED / SHIPPED
  // 3: DELIVERED
  let currentStep = 0;
  const statusUpper = (order.status || '').toUpperCase();
  if (statusUpper === 'PROCESSING' || statusUpper === 'PROCESSING_VAULT') {
    currentStep = 1;
  } else if (statusUpper === 'DISPATCHED' || statusUpper === 'SHIPPED') {
    currentStep = 2;
  } else if (statusUpper === 'DELIVERED') {
    currentStep = 3;
  }

  const steps = [
    {
      title: 'Acquisition Confirmed',
      desc: 'Escrow settlement verified',
      icon: Check
    },
    {
      title: 'Vault Inspection',
      desc: 'Calibration & certificate seal',
      icon: Clock
    },
    {
      title: 'Armored Courier',
      desc: order.deliveryTier === 'white_glove' ? 'White-Glove Hand Escort' : 'Insured Express Transit',
      icon: Truck
    },
    {
      title: 'Custody Transferred',
      desc: 'Delivered & verified',
      icon: ShieldCheck
    }
  ];

  return (
    <div style={{
      marginTop: '16px',
      padding: '16px 20px',
      background: 'rgba(255, 255, 255, 0.02)',
      borderRadius: '8px',
      border: '1px solid rgba(255, 255, 255, 0.05)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '16px'
      }}>
        <span style={{
          fontSize: '11px',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'var(--brand-bronze)',
          fontWeight: 600
        }}>
          Horological Dispatch Protocol
        </span>
        <span style={{
          fontSize: '12px',
          color: 'var(--color-text-secondary)'
        }}>
          Status: <strong style={{ color: 'var(--color-text-primary)' }}>{steps[currentStep].title}</strong>
        </span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '8px',
        position: 'relative'
      }}>
        {steps.map((step, idx) => {
          const isComplete = idx <= currentStep;
          const isCurrent = idx === currentStep;
          const StepIcon = step.icon;

          return (
            <div key={idx} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              position: 'relative'
            }}>
              {/* Connector line */}
              {idx > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '14px',
                  right: '50%',
                  width: '100%',
                  height: '2px',
                  background: idx <= currentStep ? 'var(--brand-bronze)' : 'rgba(255, 255, 255, 0.08)',
                  zIndex: 1,
                  transition: 'background 0.3s ease'
                }} />
              )}

              {/* Icon circle */}
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: isComplete ? 'var(--brand-bronze)' : 'rgba(255, 255, 255, 0.04)',
                color: isComplete ? '#0E0E0E' : 'rgba(255, 255, 255, 0.4)',
                border: isCurrent ? '2px solid var(--color-gold-champagne, #d4af37)' : '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                zIndex: 2,
                boxShadow: isCurrent ? '0 0 12px rgba(176, 141, 107, 0.35)' : 'none',
                transition: 'all 0.3s ease'
              }}>
                <StepIcon size={14} strokeWidth={2} />
              </div>

              {/* Label */}
              <div style={{
                marginTop: '8px',
                fontSize: '12px',
                fontWeight: isComplete ? 600 : 400,
                color: isComplete ? 'var(--color-text-primary)' : 'var(--color-text-muted)'
              }}>
                {step.title}
              </div>
              <div style={{
                fontSize: '10px',
                color: 'var(--color-text-secondary)',
                marginTop: '2px',
                maxWidth: '120px'
              }}>
                {step.desc}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
