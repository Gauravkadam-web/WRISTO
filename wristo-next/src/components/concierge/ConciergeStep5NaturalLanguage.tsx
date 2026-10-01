'use client';

import React from 'react';
import { ConciergePreferences } from '@/types/concierge';
import { PREBAKED_INQUIRIES, PrebakedInquiry } from '@/services/conciergeService';

interface Step5Props {
  preferences: ConciergePreferences;
  onPromptChange: (prompt: string) => void;
  onApplyPrebaked: (inq: PrebakedInquiry) => void;
  onBack: () => void;
  onSubmit: () => void;
}

export default function ConciergeStep5NaturalLanguage({
  preferences,
  onPromptChange,
  onApplyPrebaked,
  onBack,
  onSubmit
}: Step5Props) {
  return (
    <div className="concierge-step-container">
      <div className="concierge-step-lead">
        <span className="concierge-step-badge">STEP 5 OF 5 &bull; FINAL CONSULTATION</span>
        <h2 className="concierge-step-title">Express your horological inquiry in your own words</h2>
        <p className="concierge-step-desc">
          Describe any specific dial color, historical inspiration, case geometry, or gifting context. Our neural engine will cross-reference your prompt against our 40 master catalog models.
        </p>
      </div>

      <div className="concierge-prompt-box">
        <label htmlFor="concierge-freeform" className="concierge-prompt-label">
          Bespoke Horological Prompt (Optional)
        </label>
        <textarea
          id="concierge-freeform"
          className="concierge-textarea"
          rows={3}
          placeholder="e.g. Seeking an emerald green dial dress watch with sapphire crystal for a black-tie gala under ₹20,000..."
          value={preferences.naturalPrompt}
          onChange={(e) => onPromptChange(e.target.value)}
        />

        <div className="concierge-prebaked-section">
          <span className="concierge-prebaked-title">Or select an iconic horological theme:</span>
          <div className="concierge-chips-list">
            {PREBAKED_INQUIRIES.map((inq) => (
              <button
                key={inq.id}
                type="button"
                className="concierge-inquiry-chip"
                onClick={() => onApplyPrebaked(inq)}
              >
                <span>💡</span> {inq.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary of Calibrated Profile */}
      <div className="concierge-summary-card">
        <h4 className="concierge-summary-title">Calibrated Horological Criteria</h4>
        <div className="concierge-summary-tags">
          <span className="concierge-sum-tag">
            🎯 Occasions: {preferences.occasion.join(', ').replace(/_/g, ' ')}
          </span>
          <span className="concierge-sum-tag">
            📐 Case: {preferences.caseErgonomics}
          </span>
          <span className="concierge-sum-tag">
            ⚙️ Caliber: {preferences.movement.join(', ')}
          </span>
          <span className="concierge-sum-tag">
            💰 Tier: {preferences.budgetTier.replace(/_/g, ' ')}
          </span>
          {preferences.materials.length > 0 && (
            <span className="concierge-sum-tag">
              ✨ Materials: {preferences.materials.join(', ')}
            </span>
          )}
        </div>
      </div>

      <div className="concierge-actions-bar">
        <button type="button" className="btn btn-outline" onClick={onBack}>
          &larr; Back to Investment
        </button>
        <button
          type="button"
          className="btn btn-primary btn-lg concierge-submit-btn"
          onClick={onSubmit}
        >
          <span>✨</span> Consult Master Horologist AI &rarr;
        </button>
      </div>
    </div>
  );
}
