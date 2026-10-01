import { Product } from './product';

export type OccasionType =
  | 'black_tie'
  | 'executive_boardroom'
  | 'aviation_adventure'
  | 'daily_luxury'
  | 'heritage_heirloom';

export type CaseErgonomics = 'slim' | 'classic' | 'bold' | 'any';

export type BudgetTier = 'under_8k' | '8k_to_15k' | '15k_to_30k' | 'above_30k' | 'all';

export type MovementPreference = 'Automatic' | 'Quartz' | 'Mechanical Skeleton' | 'Chronograph' | 'any';

export interface ConciergePreferences {
  occasion: OccasionType[];
  caseErgonomics: CaseErgonomics;
  movement: MovementPreference[];
  budgetTier: BudgetTier;
  materials: string[];
  naturalPrompt: string;
}

export interface ConciergeRecommendation {
  watch: Product;
  compatibilityScore: number; // e.g., 98 for 98%
  editorialReasoning: string;
  highlightTag: string;
  matchedAttributes: string[];
}

export interface ConciergeAnalysisState {
  isAnalyzing: boolean;
  stepName: string;
  progressPercent: number;
}
