import { apiClient } from './apiClient';
import { Brand } from '@/types/product';

export interface BrandItem {
  id?: string;
  name: string;
  country: string;
  headline: string;
  description: string;
  watchCount: number;
  established?: string;
  featuredWatchId?: string;
  priceRange?: string;
  styles?: string[];
}

export const brandService = {
  async getAllBrands(): Promise<Brand[]> {
    try {
      const res = await apiClient.get<BrandItem[]>('/brands').catch(() => null);
      if (res && res.data && Array.isArray(res.data)) {
        return res.data.map((b) => ({
          name: b.name,
          country: b.country || 'Switzerland',
          headline: b.headline || 'Master Horological Manufacture',
          description: b.description || 'Certified luxury timepiece manufacture with international warranty.',
          watchCount: b.watchCount || 0,
          styles: b.styles || ['Luxury', 'Classic'],
          priceRange: b.priceRange || '₹4,999 – ₹49,999',
          established: b.established || 'Est. 2020',
          featuredWatchId: b.featuredWatchId || ''
        }));
      }
    } catch {
      return [];
    }
    return [];
  }
};
