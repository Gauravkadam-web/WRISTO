'use client';

import React from 'react';
import { CaseErgonomics } from '@/types/concierge';

interface Step2Props {
  caseErgonomics: CaseErgonomics;
  onChange: (ergo: CaseErgonomics) => void;
  onBack: () => void;
  onNext: () => void;
}

interface ErgoOption {
  id: CaseErgonomics;
  sizeRange: string;
  title: string;
  tagline: string;
  wristRecommendation: string;
  description: string;
}

const ERGO_OPTIONS: ErgoOption[] = [
  {
    id: 'slim',
    sizeRange: '36mm – 39mm',
    title: 'Understated Dress Profile',
    tagline: 'Vintage Proportions & Slim Anatomy',
    wristRecommendation: 'Ideal for 150mm – 170mm wrist circumferences (5.9" – 6.7")',
    description: 'Restores mid-century proportion. Eliminates bulk, sitting flat against the wrist bone with refined discretion.'
  },
  {
    id: 'classic',
    sizeRange: '40mm – 42mm',
    title: 'The Contemporary Golden Ratio',
    tagline: 'Universal Horological Standard',
    wristRecommendation: 'Ideal for 170mm – 195mm wrist circumferences (6.7" – 7.7")',
    description: 'The defining luxury diameter of modern horology. Offers assertive legibility with balanced comfort under any cuff.'
  },
  {
    id: 'bold',
    sizeRange: '43mm+',
    title: 'Commanding Architectural Posture',
    tagline: 'High-Impact Horological Statement',
    wristRecommendation: 'Ideal for 190mm – 215mm+ wrist circumferences (7.5"+)',
    description: 'Expansive dials and bold bezels crafted for those who prefer uncompromised wrist presence and mechanical gravity.'
  },
  {
    id: 'any',
    sizeRange: 'All Diameters',
    title: 'Master Horologist’s Discretion',
    tagline: 'Open to Harmonic Aesthetics',
    wristRecommendation: 'Suitable across all wrist profiles',
    description: 'Allow our neural curation algorithm to balance case diameter against your movement and styling preferences.'
  }
];

export default function ConciergeStep2Ergonomics({
  caseErgonomics,
  onChange,
  onBack,
  onNext
}: Step2Props) {
  return (
    <div className="concierge-step-container">
      <div className="concierge-step-lead">
        <span className="concierge-step-badge">STEP 2 OF 5</span>
        <h2 className="concierge-step-title">What case diameter harmonizes with your wrist?</h2>
        <p className="concierge-step-desc">
          Case ergonomics dictate visual presence and long-term wearing comfort. Choose your ideal millimeter spectrum.
        </p>
      </div>

      <div className="concierge-tiles-grid ergo-grid">
        {ERGO_OPTIONS.map((opt) => {
          const isSelected = caseErgonomics === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              className={`concierge-tile-card ergo-card ${isSelected ? 'selected' : ''}`}
              onClick={() => onChange(opt.id)}
            >
              <div className="concierge-tile-header">
                <span className="concierge-size-badge">{opt.sizeRange}</span>
                <span className={`concierge-radio-circle ${isSelected ? 'checked' : ''}`}>
                  {isSelected ? '●' : ''}
                </span>
              </div>
              <h3 className="concierge-tile-title">{opt.title}</h3>
              <span className="concierge-tile-tagline">{opt.tagline}</span>
              <p className="concierge-tile-desc">{opt.description}</p>
              <div className="concierge-wrist-guide">
                <span>📏</span> {opt.wristRecommendation}
              </div>
            </button>
          );
        })}
      </div>

      <div className="concierge-actions-bar">
        <button type="button" className="btn btn-outline" onClick={onBack}>
          &larr; Back to Occasions
        </button>
        <button type="button" className="btn btn-primary btn-lg" onClick={onNext}>
          Select Movement Soul &rarr;
        </button>
      </div>
    </div>
  );
}
