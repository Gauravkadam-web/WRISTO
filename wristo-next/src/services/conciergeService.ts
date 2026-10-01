import { PRODUCTS } from '@/data/products';
import { Product } from '@/types/product';
import {
  ConciergePreferences,
  ConciergeRecommendation,
  OccasionType,
  CaseErgonomics
} from '@/types/concierge';

export interface PrebakedInquiry {
  id: string;
  label: string;
  prompt: string;
  defaultPreferences: Partial<ConciergePreferences>;
}

export const PREBAKED_INQUIRIES: PrebakedInquiry[] = [
  {
    id: 'inq-green-dial',
    label: 'Emerald Dial Dress Watch',
    prompt: 'I desire an emerald green dial dress watch with stainless steel or leather, ideal for formal galas under ₹20,000.',
    defaultPreferences: {
      occasion: ['black_tie', 'executive_boardroom'],
      caseErgonomics: 'classic',
      movement: ['Automatic', 'Quartz'],
      budgetTier: '8k_to_15k',
      materials: ['Stainless Steel', 'Italian Leather']
    }
  },
  {
    id: 'inq-skeleton',
    label: 'Open-Heart Mechanical Caliber',
    prompt: 'Looking for a mechanical skeleton timepiece showcasing exposed balance wheels and Swiss-inspired finishing.',
    defaultPreferences: {
      occasion: ['heritage_heirloom', 'daily_luxury'],
      caseErgonomics: 'classic',
      movement: ['Mechanical Skeleton', 'Automatic'],
      budgetTier: '15k_to_30k',
      materials: ['Surgical 316L Steel']
    }
  },
  {
    id: 'inq-executive',
    label: 'Minimalist Boardroom Daily',
    prompt: 'A sleek, understated monochromatic watch suitable for daily corporate meetings and tailored suits.',
    defaultPreferences: {
      occasion: ['executive_boardroom', 'daily_luxury'],
      caseErgonomics: 'slim',
      movement: ['Quartz', 'Automatic'],
      budgetTier: 'under_8k',
      materials: ['Black Leather', 'Stainless Steel']
    }
  },
  {
    id: 'inq-chrono',
    label: 'Precision Aviator Chronograph',
    prompt: 'High-performance chronograph with sub-dials, tachymeter scale, and adventure-grade durability.',
    defaultPreferences: {
      occasion: ['aviation_adventure', 'daily_luxury'],
      caseErgonomics: 'bold',
      movement: ['Chronograph', 'Quartz'],
      budgetTier: '8k_to_15k',
      materials: ['Surgical 316L Steel', 'Brushed Titanium']
    }
  }
];

function parseCaseDiameter(caseSize: string): number {
  const match = caseSize.match(/\d+/);
  return match ? parseInt(match[0], 10) : 40;
}

function matchOccasion(product: Product, occasions: OccasionType[]): { score: number; matched: string[] } {
  if (!occasions || occasions.length === 0) return { score: 20, matched: ['Universal Versatility'] };

  let score = 0;
  const matched: string[] = [];
  const prodOccasions = (product.occasion || []).map(o => o.toLowerCase());
  const prodStyle = product.style.toLowerCase();

  for (const occ of occasions) {
    if (occ === 'black_tie') {
      if (prodStyle.includes('dress') || prodOccasions.some(o => o.includes('formal') || o.includes('party'))) {
        score += 25;
        matched.push('Black Tie & Formal Elegance');
      }
    } else if (occ === 'executive_boardroom') {
      if (prodStyle.includes('minimal') || prodStyle.includes('classic') || prodOccasions.some(o => o.includes('office') || o.includes('business'))) {
        score += 25;
        matched.push('Executive Boardroom Synergy');
      }
    } else if (occ === 'aviation_adventure') {
      if (prodStyle.includes('chronograph') || prodStyle.includes('sport') || prodOccasions.some(o => o.includes('sports') || o.includes('outdoor') || o.includes('travel'))) {
        score += 25;
        matched.push('Aviation & Adventure Durability');
      }
    } else if (occ === 'daily_luxury') {
      if (prodOccasions.some(o => o.includes('casual') || o.includes('everyday')) || prodStyle.includes('classic')) {
        score += 25;
        matched.push('Effortless Daily Luxury');
      }
    } else if (occ === 'heritage_heirloom') {
      if (product.movement.includes('Automatic') || product.movement.includes('Skeleton') || product.price > 12000) {
        score += 25;
        matched.push('Horological Heritage Investment');
      }
    }
  }

  return { score: Math.min(score, 30), matched };
}

function matchErgonomics(product: Product, preference: CaseErgonomics): { score: number; matchName?: string } {
  const diameter = parseCaseDiameter(product.caseSize);
  if (preference === 'any') return { score: 20, matchName: `${diameter}mm Balanced Case` };

  if (preference === 'slim') {
    if (diameter <= 39) return { score: 25, matchName: `Ultra-Slim ${diameter}mm Profile` };
    if (diameter === 40) return { score: 18, matchName: `Tailored 40mm Profile` };
    return { score: 5 };
  }
  if (preference === 'classic') {
    if (diameter >= 40 && diameter <= 42) return { score: 25, matchName: `Golden Ratio ${diameter}mm Case` };
    return { score: 12 };
  }
  if (preference === 'bold') {
    if (diameter >= 42) return { score: 25, matchName: `Authoritative ${diameter}mm Presence` };
    return { score: 10 };
  }
  return { score: 15 };
}

function matchMovement(product: Product, movements: string[]): { score: number; matchName?: string } {
  if (!movements || movements.length === 0 || movements.includes('any')) {
    return { score: 20, matchName: product.movement };
  }

  const pMov = product.movement.toLowerCase();
  for (const m of movements) {
    if (m === 'Automatic' && pMov.includes('automatic')) return { score: 25, matchName: 'Mechanical Sweep Automatic' };
    if (m === 'Mechanical Skeleton' && (pMov.includes('skeleton') || product.style.toLowerCase().includes('skeleton'))) {
      return { score: 25, matchName: 'Exposed Mechanical Architecture' };
    }
    if (m === 'Chronograph' && (product.style.toLowerCase().includes('chronograph') || pMov.includes('chronograph'))) {
      return { score: 25, matchName: 'Precision Multi-Dial Chrono' };
    }
    if (m === 'Quartz' && pMov.includes('quartz')) return { score: 25, matchName: 'High-Torque Quartz Caliber' };
  }
  return { score: 10 };
}

function matchBudget(product: Product, budgetTier: string): number {
  const price = product.price;
  if (budgetTier === 'all') return 15;
  if (budgetTier === 'under_8k' && price <= 8000) return 20;
  if (budgetTier === '8k_to_15k' && price >= 8000 && price <= 15000) return 20;
  if (budgetTier === '15k_to_30k' && price >= 15000 && price <= 30000) return 20;
  if (budgetTier === 'above_30k' && price > 30000) return 20;
  return 8;
}

function matchPromptKeywords(product: Product, query: string): { score: number; matches: string[] } {
  if (!query || !query.trim()) return { score: 10, matches: [] };
  const tokens = query.toLowerCase().split(/\s+/).filter(t => t.length > 2);
  let hits = 0;
  const matches: string[] = [];

  const textCorpus = `${product.brand} ${product.model} ${product.description} ${product.tagline} ${product.dial} ${product.material} ${product.strap} ${product.colors.join(' ')}`.toLowerCase();

  for (const token of tokens) {
    if (textCorpus.includes(token)) {
      hits++;
      matches.push(token);
    }
  }

  return { score: Math.min(hits * 6, 25), matches };
}

export function computeRecommendationsSync(
  preferences: ConciergePreferences
): ConciergeRecommendation[] {
  const scoredWatches = PRODUCTS.map((watch) => {
    const occ = matchOccasion(watch, preferences.occasion);
    const ergo = matchErgonomics(watch, preferences.caseErgonomics);
    const mov = matchMovement(watch, preferences.movement);
    const bud = matchBudget(watch, preferences.budgetTier);
    const prompt = matchPromptKeywords(watch, preferences.naturalPrompt);

    const totalRawScore = occ.score + ergo.score + mov.score + bud + prompt.score;
    // Map raw score into a credible luxury compatibility percentage (87% - 99%)
    const compatibilityScore = Math.min(99, Math.max(86, Math.round(75 + (totalRawScore / 125) * 24)));

    // Generate dynamic editorial horological reasoning
    let reasoning = watch.aiReason || watch.tagline;
    if (ergo.matchName && mov.matchName) {
      reasoning = `Features a ${ergo.matchName} coupled with a ${mov.matchName}. Perfectly tailored to your lifestyle parameters, offering exquisite wrist presence and certified accuracy.`;
    } else if (occ.matched.length > 0) {
      reasoning = `Curated specifically for ${occ.matched[0]}. The ${watch.caseSize} ${watch.material} architecture ensures effortless elegance under any tailored cuff.`;
    }

    const highlightTag =
      prompt.matches.length > 0
        ? `Inquiry Match: "${prompt.matches[0]}"`
        : ergo.matchName || occ.matched[0] || 'Horologist Selected';

    const matchedAttributes = [
      ...occ.matched,
      ergo.matchName,
      mov.matchName
    ].filter(Boolean) as string[];

    return {
      watch,
      compatibilityScore,
      editorialReasoning: reasoning,
      highlightTag,
      matchedAttributes
    };
  });

  // Sort descending by compatibility score and rating
  scoredWatches.sort((a, b) => b.compatibilityScore - a.compatibilityScore || b.watch.rating - a.watch.rating);

  // Return the top 3 bespoke recommendations
  return scoredWatches.slice(0, 3);
}

export async function generateRecommendations(
  preferences: ConciergePreferences
): Promise<ConciergeRecommendation[]> {
  // Simulate intelligent neural processing latency for luxury consultative feel
  await new Promise(res => setTimeout(res, 800));
  return computeRecommendationsSync(preferences);
}

