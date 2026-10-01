'use client';

import React from 'react';

interface ConciergeHeaderProps {
  currentStep: number;
  totalSteps: number;
  onStepClick?: (step: number) => void;
  showResults: boolean;
  onReset: () => void;
}

const STEP_LABELS = [
  'Occasion',
  'Ergonomics',
  'Movement',
  'Investment',
  'Inquiry'
];

export default function ConciergeHeader({
  currentStep,
  totalSteps,
  onStepClick,
  showResults,
  onReset
}: ConciergeHeaderProps) {
  return (
    <div className="concierge-header-banner">
      <div className="concierge-header-top">
        <div className="concierge-badge">
          <span className="concierge-pulse-dot" />
          <span>AI HOROLOGICAL ADVISOR &bull; LIVE CONSULTATION</span>
        </div>
        {showResults && (
          <button
            type="button"
            className="btn btn-outline btn-sm concierge-reset-btn"
            onClick={onReset}
          >
            &#x21bb; Refine Criteria
          </button>
        )}
      </div>

      <h1 className="concierge-main-title">Bespoke Horological Concierge</h1>
      <p className="concierge-subtitle">
        Consult our neural horological advisor to discover the exact timepiece tailored to your anatomy, occasion, and mechanical preferences.
      </p>

      {!showResults && (
        <div className="concierge-stepper-wrapper">
          <div className="concierge-stepper">
            {STEP_LABELS.map((label, idx) => {
              const stepNumber = idx + 1;
              const isCompleted = stepNumber < currentStep;
              const isActive = stepNumber === currentStep;

              return (
                <div
                  key={label}
                  className={`concierge-step-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                  onClick={() => isCompleted && onStepClick && onStepClick(stepNumber)}
                  style={{ cursor: isCompleted ? 'pointer' : 'default' }}
                >
                  <div className="concierge-step-circle">
                    {isCompleted ? '✓' : stepNumber}
                  </div>
                  <span className="concierge-step-label">{label}</span>
                </div>
              );
            })}
          </div>
          <div className="concierge-progress-track">
            <div
              className="concierge-progress-bar"
              style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
