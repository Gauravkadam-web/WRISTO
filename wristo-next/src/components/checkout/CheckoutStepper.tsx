'use client';

import React from 'react';
import { Check } from 'lucide-react';

interface CheckoutStepperProps {
  currentStep: number;
}

const STEPS = [
  { step: 1, label: 'Address & Contact' },
  { step: 2, label: 'Horological Delivery' },
  { step: 3, label: 'Secure Payment' },
  { step: 4, label: 'Review & Confirm' }
];

export default function CheckoutStepper({ currentStep }: CheckoutStepperProps) {
  return (
    <div className="checkout-stepper" aria-label="Checkout Progress">
      {STEPS.map((s, idx) => {
        const isCompleted = currentStep > s.step;
        const isActive = currentStep === s.step;

        return (
          <React.Fragment key={s.step}>
            <div className={`step-node ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
              <div className="step-circle" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                {isCompleted ? <Check size={12} strokeWidth={2.5} /> : s.step}
              </div>
              <span className="step-label">{s.label}</span>
            </div>

            {idx < STEPS.length - 1 && (
              <div className={`step-connector ${currentStep > s.step ? 'completed' : ''}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
