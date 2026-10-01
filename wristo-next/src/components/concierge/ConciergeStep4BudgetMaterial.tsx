'use client';

import React from 'react';
import { BudgetTier } from '@/types/concierge';

interface Step4Props {
  budgetTier: BudgetTier;
  onBudgetChange: (budget: BudgetTier) => void;
  selectedMaterials: string[];
  onMaterialsChange: (materials: string[]) => void;
  onBack: () => void;
  onNext: () => void;
}

interface BudgetOption {
  id: BudgetTier;
  label: string;
  sublabel: string;
}

const BUDGET_PRESETS: BudgetOption[] = [
  { id: 'under_8k', label: 'Under ₹8,000', sublabel: 'Accessible Entry Luxury' },
  { id: '8k_to_15k', label: '₹8,000 – ₹15,000', sublabel: 'Contemporary Heritage' },
  { id: '15k_to_30k', label: '₹15,000 – ₹30,000', sublabel: 'Connoisseur Complications' },
  { id: 'above_30k', label: '₹30,000+', sublabel: 'High Horology Tier' },
  { id: 'all', label: 'Any Investment Tier', sublabel: 'Pure Aesthetic Curation' }
];

const MATERIAL_CHIPS = [
  { id: 'Stainless Steel', label: 'Surgical 316L Stainless Steel', desc: 'Hypoallergenic, corrosion-proof brushed luster' },
  { id: 'Italian Leather', label: 'Vegetable-Tanned Italian Leather', desc: 'Handcrafted patina that matures with time' },
  { id: 'Brushed Titanium', label: 'Aviation-Grade Grade 5 Titanium', desc: 'Ultra-lightweight with exceptional strength' },
  { id: 'Rose Gold', label: 'Rose Gold Ion-PVD Finish', desc: 'Warm 18K luster with durable scratch protection' },
  { id: 'Sapphire Crystal', label: 'Anti-Reflective Sapphire Crystal', desc: 'Mohs hardness 9 diamond-level scratch resistance' },
  { id: 'Ceramic', label: 'High-Tech Zirconia Ceramic', desc: 'Silky ceramic bezel impervious to thermal shock' }
];

export default function ConciergeStep4BudgetMaterial({
  budgetTier,
  onBudgetChange,
  selectedMaterials,
  onMaterialsChange,
  onBack,
  onNext
}: Step4Props) {
  const toggleMaterial = (mat: string) => {
    if (selectedMaterials.includes(mat)) {
      if (selectedMaterials.length > 1) {
        onMaterialsChange(selectedMaterials.filter(m => m !== mat));
      }
    } else {
      onMaterialsChange([...selectedMaterials, mat]);
    }
  };

  return (
    <div className="concierge-step-container">
      <div className="concierge-step-lead">
        <span className="concierge-step-badge">STEP 4 OF 5</span>
        <h2 className="concierge-step-title">Specify your investment tier and case metallurgy</h2>
        <p className="concierge-step-desc">
          Calibrate your acquisition budget and choose premium tactile materials for the case, bezel, and bracelet.
        </p>
      </div>

      <div className="concierge-section-block">
        <h3 className="concierge-sub-heading">Acquisition Investment Range</h3>
        <div className="concierge-budget-grid">
          {BUDGET_PRESETS.map((b) => {
            const isSelected = budgetTier === b.id;
            return (
              <button
                key={b.id}
                type="button"
                className={`concierge-budget-card ${isSelected ? 'selected' : ''}`}
                onClick={() => onBudgetChange(b.id)}
              >
                <div className="concierge-budget-title">{b.label}</div>
                <div className="concierge-budget-sub">{b.sublabel}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="concierge-section-block" style={{ marginTop: '32px' }}>
        <h3 className="concierge-sub-heading">Preferred Metallurgy & Strap Materials</h3>
        <div className="concierge-materials-grid">
          {MATERIAL_CHIPS.map((mat) => {
            const isSelected = selectedMaterials.includes(mat.id);
            return (
              <button
                key={mat.id}
                type="button"
                className={`concierge-mat-chip ${isSelected ? 'selected' : ''}`}
                onClick={() => toggleMaterial(mat.id)}
              >
                <div className="concierge-mat-header">
                  <span className="concierge-mat-name">{mat.label}</span>
                  <span className={`concierge-check-circle ${isSelected ? 'checked' : ''}`}>
                    {isSelected ? '✓' : ''}
                  </span>
                </div>
                <span className="concierge-mat-desc">{mat.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="concierge-actions-bar">
        <button type="button" className="btn btn-outline" onClick={onBack}>
          &larr; Back to Movement
        </button>
        <button type="button" className="btn btn-primary btn-lg" onClick={onNext}>
          Conversational Inquiry &rarr;
        </button>
      </div>
    </div>
  );
}
