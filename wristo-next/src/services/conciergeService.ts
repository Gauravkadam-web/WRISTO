import { apiClient } from './apiClient';
import {
  ConciergePreferences,
  ConciergeRecommendation
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
      movement: ['Chronograph', 'Automatic'],
      budgetTier: '8k_to_15k',
      materials: ['Aerospace Titanium', 'Stainless Steel']
    }
  }
];

export function computeRecommendationsSync(
  preferences: ConciergePreferences
): ConciergeRecommendation[] {
  return [];
}

export async function getPrebakedInquiries(): Promise<PrebakedInquiry[]> {
  const res = await apiClient.get<any>('/concierge/prebaked-inquiries').catch(() => null);
  if (res && res.data) {
    const list = Array.isArray(res.data) ? res.data : (res.data.inquiries || []);
    if (list.length > 0) return list;
  }
  return PREBAKED_INQUIRIES;
}

export async function generateRecommendations(
  preferences: ConciergePreferences
): Promise<ConciergeRecommendation[]> {
  const res = await apiClient.post<any>('/concierge/recommendations', preferences);
  if (res && res.data) {
    if (Array.isArray(res.data.recommendations)) return res.data.recommendations;
    if (Array.isArray(res.data)) return res.data;
  }
  return [];
}

export async function sendConciergeChatMessage(
  message: string,
  history: Array<{ role: 'user' | 'model'; content: string }> = []
): Promise<{ reply: string; recommendedWatchIds?: string[] }> {
  const res = await apiClient.post<any>('/concierge/chat', { message, history });
  if (res && res.data) {
    return {
      reply: res.data.reply || 'Your private horological inquiry has been processed by our master advisor.',
      recommendedWatchIds: res.data.recommendedWatchIds || []
    };
  }
  return {
    reply: 'Our horological advisor is currently synchronizing with the master archive.'
  };
}

export const conciergeService = {
  getPrebakedInquiries,
  generateRecommendations,
  sendConciergeChatMessage,
  computeRecommendationsSync
};
