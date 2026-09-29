import { Product } from './product';

export type SortOption = 'popularity' | 'price-asc' | 'price-desc' | 'rating' | 'newest';

export interface ProductQueryFilters {
  category?: string;
  brands?: string[];
  movements?: string[];
  styles?: string[];
  gender?: string;
  minPrice?: number;
  maxPrice?: number;
  caseSizes?: string[];
  straps?: string[];
  inStockOnly?: boolean;
  searchQuery?: string;
}

export interface FacetOption {
  value: string;
  label: string;
  count: number;
}

export interface CatalogFacetCounts {
  brands: Record<string, number>;
  movements: Record<string, number>;
  styles: Record<string, number>;
  gender: Record<string, number>;
  straps: Record<string, number>;
}

export interface CatalogQueryResult {
  items: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  facetCounts: CatalogFacetCounts;
}
