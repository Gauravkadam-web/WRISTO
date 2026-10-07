import { apiClient } from './apiClient';
import { Product } from '@/types/product';
import { productService } from './productService';

export interface ComparisonSpecEntry {
  axis: string;
  label: string;
  values: Record<string, string | number>;
}

export interface ComparisonMatrixData {
  watchIds: string[];
  specs: ComparisonSpecEntry[];
}

export const comparisonService = {
  async getComparisonMatrix(ids: string[]): Promise<ComparisonMatrixData | null> {
    if (!ids || ids.length === 0) return null;
    const query = ids.map(encodeURIComponent).join(',');
    const res = await apiClient.get<ComparisonMatrixData>(`/compare?ids=${query}`);
    if (res && res.data && res.data.specs) {
      return res.data;
    }
    return null;
  },

  async resolveWatches(ids: string[]): Promise<Product[]> {
    const products: Product[] = [];
    for (const id of ids) {
      try {
        const p = await productService.getProductById(id);
        if (p) products.push(p);
      } catch {
        // Skip missing
      }
    }
    return products;
  }
};
