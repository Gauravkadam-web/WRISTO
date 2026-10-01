'use client';

import React, { useState } from 'react';
import {
  ConciergePreferences,
  ConciergeRecommendation,
  OccasionType,
  CaseErgonomics,
  BudgetTier,
  MovementPreference
} from '@/types/concierge';
import { generateRecommendations, computeRecommendationsSync, PrebakedInquiry } from '@/services/conciergeService';

import ConciergeHeader from '@/components/concierge/ConciergeHeader';
import ConciergeStep1Occasion from '@/components/concierge/ConciergeStep1Occasion';
import ConciergeStep2Ergonomics from '@/components/concierge/ConciergeStep2Ergonomics';
import ConciergeStep3Movement from '@/components/concierge/ConciergeStep3Movement';
import ConciergeStep4BudgetMaterial from '@/components/concierge/ConciergeStep4BudgetMaterial';
import ConciergeStep5NaturalLanguage from '@/components/concierge/ConciergeStep5NaturalLanguage';
import ConciergeLoadingState from '@/components/concierge/ConciergeLoadingState';
import ConciergeResults from '@/components/concierge/ConciergeResults';

const DEFAULT_PREFERENCES: ConciergePreferences = {
  occasion: ['black_tie', 'executive_boardroom'],
  caseErgonomics: 'classic',
  movement: ['Automatic'],
  budgetTier: '8k_to_15k',
  materials: ['Stainless Steel', 'Italian Leather'],
  naturalPrompt: ''
};

interface ConciergeClientProps {
  initialStep?: number;
  initialResults?: boolean;
}

export default function ConciergeClient({
  initialStep = 1,
  initialResults = false
}: ConciergeClientProps) {
  const [currentStep, setCurrentStep] = useState<number>(initialStep);
  const [preferences, setPreferences] = useState<ConciergePreferences>(DEFAULT_PREFERENCES);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [recommendations, setRecommendations] = useState<ConciergeRecommendation[] | null>(
    initialResults ? computeRecommendationsSync(DEFAULT_PREFERENCES) : null
  );

  const handleNextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 5));
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const handleBackStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const handleApplyPrebaked = (inq: PrebakedInquiry) => {
    setPreferences((prev) => ({
      ...prev,
      naturalPrompt: inq.prompt,
      ...(inq.defaultPreferences.occasion ? { occasion: inq.defaultPreferences.occasion } : {}),
      ...(inq.defaultPreferences.caseErgonomics ? { caseErgonomics: inq.defaultPreferences.caseErgonomics } : {}),
      ...(inq.defaultPreferences.movement ? { movement: inq.defaultPreferences.movement } : {}),
      ...(inq.defaultPreferences.budgetTier ? { budgetTier: inq.defaultPreferences.budgetTier } : {}),
      ...(inq.defaultPreferences.materials ? { materials: inq.defaultPreferences.materials } : {})
    }));
  };

  const handleSubmit = async () => {
    setIsAnalyzing(true);
    setRecommendations(null);

    try {
      const results = await generateRecommendations(preferences);
      setRecommendations(results);
    } catch (err) {
      console.error('Failed to generate recommendations:', err);
    } finally {
      setIsAnalyzing(false);
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 100, behavior: 'smooth' });
      }
    }
  };

  const handleRefine = () => {
    setRecommendations(null);
    setCurrentStep(1);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 100, behavior: 'smooth' });
    }
  };

  const handleReset = () => {
    setPreferences(DEFAULT_PREFERENCES);
    setRecommendations(null);
    setCurrentStep(1);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 100, behavior: 'smooth' });
    }
  };

  return (
    <div className="concierge-page-wrapper">
      <div className="container">
        <ConciergeHeader
          currentStep={currentStep}
          totalSteps={5}
          onStepClick={(step) => setCurrentStep(step)}
          showResults={!!recommendations}
          onReset={handleReset}
        />

        <div className="concierge-body-content">
          {isAnalyzing ? (
            <ConciergeLoadingState />
          ) : recommendations ? (
            <ConciergeResults
              recommendations={recommendations}
              onRefine={handleRefine}
              onReset={handleReset}
            />
          ) : (
            <div className="concierge-wizard-card">
              {currentStep === 1 && (
                <ConciergeStep1Occasion
                  selectedOccasions={preferences.occasion}
                  onChange={(occasions: OccasionType[]) =>
                    setPreferences((prev) => ({ ...prev, occasion: occasions }))
                  }
                  onNext={handleNextStep}
                />
              )}

              {currentStep === 2 && (
                <ConciergeStep2Ergonomics
                  caseErgonomics={preferences.caseErgonomics}
                  onChange={(ergo: CaseErgonomics) =>
                    setPreferences((prev) => ({ ...prev, caseErgonomics: ergo }))
                  }
                  onBack={handleBackStep}
                  onNext={handleNextStep}
                />
              )}

              {currentStep === 3 && (
                <ConciergeStep3Movement
                  selectedMovements={preferences.movement}
                  onChange={(movements: MovementPreference[]) =>
                    setPreferences((prev) => ({ ...prev, movement: movements }))
                  }
                  onBack={handleBackStep}
                  onNext={handleNextStep}
                />
              )}

              {currentStep === 4 && (
                <ConciergeStep4BudgetMaterial
                  budgetTier={preferences.budgetTier}
                  onBudgetChange={(tier: BudgetTier) =>
                    setPreferences((prev) => ({ ...prev, budgetTier: tier }))
                  }
                  selectedMaterials={preferences.materials}
                  onMaterialsChange={(mats: string[]) =>
                    setPreferences((prev) => ({ ...prev, materials: mats }))
                  }
                  onBack={handleBackStep}
                  onNext={handleNextStep}
                />
              )}

              {currentStep === 5 && (
                <ConciergeStep5NaturalLanguage
                  preferences={preferences}
                  onPromptChange={(prompt: string) =>
                    setPreferences((prev) => ({ ...prev, naturalPrompt: prompt }))
                  }
                  onApplyPrebaked={handleApplyPrebaked}
                  onBack={handleBackStep}
                  onSubmit={handleSubmit}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
