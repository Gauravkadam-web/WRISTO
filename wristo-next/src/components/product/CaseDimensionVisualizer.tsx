'use client';

import React, { useState, useMemo } from 'react';
import { Compass, CheckCircle2, Sliders } from 'lucide-react';
import { Product } from '@/types/product';

interface CaseDimensionVisualizerProps {
  product: Product;
}

type WristSize = 'slim' | 'standard' | 'broad';

interface WristProfile {
  id: WristSize;
  label: string;
  circumference: string;
  flatWidthMm: number;
}

const WRIST_PROFILES: WristProfile[] = [
  { id: 'slim', label: 'Slim', circumference: '6.0" (15.2 cm)', flatWidthMm: 52 },
  { id: 'standard', label: 'Standard', circumference: '6.75" (17.1 cm)', flatWidthMm: 58 },
  { id: 'broad', label: 'Broad', circumference: '7.5" (19.0 cm)', flatWidthMm: 65 }
];

export default function CaseDimensionVisualizer({ product }: CaseDimensionVisualizerProps) {
  const [selectedWrist, setSelectedWrist] = useState<WristSize>('standard');

  // Parse numerical case dimensions with safe horological defaults
  const caseDiameterNum = useMemo(() => {
    const parsed = parseFloat(product.caseSize || '40');
    return isNaN(parsed) ? 40 : parsed;
  }, [product.caseSize]);

  const lugToLugNum = useMemo(() => {
    if (product.caseLugToLug) {
      const parsed = parseFloat(product.caseLugToLug);
      if (!isNaN(parsed)) return parsed;
    }
    return Math.round((caseDiameterNum * 1.18) * 10) / 10;
  }, [product.caseLugToLug, caseDiameterNum]);

  const thicknessNum = useMemo(() => {
    if (product.caseThickness) {
      const parsed = parseFloat(product.caseThickness);
      if (!isNaN(parsed)) return parsed;
    }
    return product.movement.includes('Automatic') ? 12.4 : 10.2;
  }, [product.caseThickness, product.movement]);

  const lugWidthNum = useMemo(() => {
    if (product.lugWidth) {
      const parsed = parseFloat(product.lugWidth);
      if (!isNaN(parsed)) return parsed;
    }
    return caseDiameterNum >= 42 ? 22 : 20;
  }, [product.lugWidth, caseDiameterNum]);

  // Selected wrist profile & fit ratio
  const activeProfile = WRIST_PROFILES.find((p) => p.id === selectedWrist) || WRIST_PROFILES[1];
  const coverageRatio = Math.round((lugToLugNum / activeProfile.flatWidthMm) * 100);

  const fitAssessment = useMemo(() => {
    if (coverageRatio < 76) {
      return {
        badge: 'Classic Understated Proportion',
        desc: 'Lug span sits comfortably within the wrist boundary, evoking mid-century vintage elegance.'
      };
    }
    if (coverageRatio <= 88) {
      return {
        badge: 'Optimal Modern Balance',
        desc: 'Contemporary wrist presence with zero lug overhang; ideal proportion for everyday luxury.'
      };
    }
    return {
      badge: 'Commanding Sport Silhouette',
      desc: 'Bold wrist footprint with pronounced tactile authority and high wrist visibility.'
    };
  }, [coverageRatio]);

  return (
    <section className="case-dimensions-wrapper" aria-label="Case Dimensions and Wrist Scale Visualizer">
      <div className="case-dim-header">
        <div className="case-dim-title-group">
          <Compass className="case-dim-icon" size={16} />
          <h3 className="case-dim-heading">Proportions & Wrist Scale</h3>
        </div>
        <span className="case-dim-model-tag">{product.caseSize} Caliber</span>
      </div>

      {/* SVG Caliper & Watch Architecture Diagram */}
      <div className="case-dim-diagram-card">
        <svg
          className="case-dim-svg"
          viewBox="0 0 400 170"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle Grid Backdrop */}
          <line x1="40" y1="20" x2="360" y2="20" stroke="rgba(255,255,255,0.04)" strokeDasharray="2 4" />
          <line x1="40" y1="85" x2="360" y2="85" stroke="rgba(255,255,255,0.04)" strokeDasharray="2 4" />
          <line x1="40" y1="150" x2="360" y2="150" stroke="rgba(255,255,255,0.04)" strokeDasharray="2 4" />

          {/* Watch Silhouette - Case & Lugs */}
          {/* Upper Lug */}
          <path
            d="M178 30 L184 56 H216 L222 30 Z"
            fill="rgba(176,141,107,0.12)"
            stroke="rgba(176,141,107,0.3)"
            strokeWidth="1.2"
          />
          {/* Lower Lug */}
          <path
            d="M178 140 L184 114 H216 L222 140 Z"
            fill="rgba(176,141,107,0.12)"
            stroke="rgba(176,141,107,0.3)"
            strokeWidth="1.2"
          />

          {/* Main Round Case */}
          <circle cx="200" cy="85" r="42" fill="#111113" stroke="#B08D6B" strokeWidth="1.8" />
          {/* Inner Bezel Ring */}
          <circle cx="200" cy="85" r="36" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
          {/* Dial Center Guilloché */}
          <circle cx="200" cy="85" r="26" fill="none" stroke="rgba(176,141,107,0.2)" strokeDasharray="1.5 2" />

          {/* Winding Crown at 3 o'clock */}
          <rect x="243" y="80" width="7" height="10" rx="1.5" fill="#B08D6B" />

          {/* Hands */}
          <line x1="200" y1="85" x2="200" y2="60" stroke="#F7F3EC" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="200" y1="85" x2="218" y2="85" stroke="#F7F3EC" strokeWidth="1.4" strokeLinecap="round" />
          <circle cx="200" cy="85" r="2.5" fill="#B08D6B" />

          {/* Diameter Dimension Caliper (Horizontal) */}
          <line x1="158" y1="85" x2="90" y2="85" stroke="#B08D6B" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="90" y1="72" x2="90" y2="98" stroke="#B08D6B" strokeWidth="1.2" />
          <text x="82" y="89" fill="#F7F3EC" fontSize="12" fontWeight="600" textAnchor="end" fontFamily="inherit">
            Ø {caseDiameterNum} mm
          </text>
          <text x="82" y="103" fill="rgba(255,255,255,0.4)" fontSize="9" textAnchor="end" fontFamily="inherit">
            CASE DIAMETER
          </text>

          {/* Lug-to-Lug Caliper (Vertical Right) */}
          <line x1="260" y1="30" x2="310" y2="30" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          <line x1="260" y1="140" x2="310" y2="140" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          <line x1="305" y1="30" x2="305" y2="140" stroke="#B08D6B" strokeWidth="1.2" />
          <polygon points="305,30 302,36 308,36" fill="#B08D6B" />
          <polygon points="305,140 302,134 308,134" fill="#B08D6B" />
          <text x="316" y="82" fill="#F7F3EC" fontSize="12" fontWeight="600" textAnchor="start" fontFamily="inherit">
            {lugToLugNum} mm
          </text>
          <text x="316" y="96" fill="rgba(255,255,255,0.4)" fontSize="9" textAnchor="start" fontFamily="inherit">
            LUG TO LUG
          </text>
        </svg>

        {/* Dimension Metric Badges */}
        <div className="case-dim-specs-row">
          <div className="case-dim-spec-cell">
            <span className="case-dim-spec-label">Diameter</span>
            <span className="case-dim-spec-val">{caseDiameterNum} mm</span>
          </div>
          <div className="case-dim-spec-cell">
            <span className="case-dim-spec-label">Lug-to-Lug</span>
            <span className="case-dim-spec-val">{lugToLugNum} mm</span>
          </div>
          <div className="case-dim-spec-cell">
            <span className="case-dim-spec-label">Thickness</span>
            <span className="case-dim-spec-val">{thicknessNum} mm</span>
          </div>
          <div className="case-dim-spec-cell">
            <span className="case-dim-spec-label">Lug Width</span>
            <span className="case-dim-spec-val">{lugWidthNum} mm</span>
          </div>
        </div>
      </div>

      {/* Interactive Wrist Proportion Estimator */}
      <div className="wrist-scale-card">
        <div className="wrist-scale-header">
          <div className="wrist-scale-title-wrap">
            <Sliders size={14} className="text-amber-300" />
            <span className="wrist-scale-title">Wrist Fit Estimator</span>
          </div>
          <span className="wrist-scale-ratio-badge">
            {coverageRatio}% Wrist Span
          </span>
        </div>

        {/* Wrist selector buttons */}
        <div className="wrist-pills-row" role="radiogroup" aria-label="Wrist Circumference">
          {WRIST_PROFILES.map((p) => {
            const isSelected = selectedWrist === p.id;
            return (
              <button
                key={p.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                className={`wrist-pill-btn ${isSelected ? 'active' : ''}`}
                onClick={() => setSelectedWrist(p.id)}
              >
                <span className="wrist-pill-name">{p.label}</span>
                <span className="wrist-pill-sub">{p.circumference}</span>
              </button>
            );
          })}
        </div>

        {/* Fit feedback statement */}
        <div className="wrist-assessment-box">
          <div className="wrist-assessment-badge-row">
            <CheckCircle2 size={13} className="text-emerald-400" />
            <span className="wrist-assessment-badge">{fitAssessment.badge}</span>
          </div>
          <p className="wrist-assessment-desc">{fitAssessment.desc}</p>
        </div>
      </div>
    </section>
  );
}
