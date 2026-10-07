import { Product, CategoryItem, Brand } from '@/types/product';
import { ProductQueryFilters, SortOption, CatalogQueryResult, CatalogFacetCounts } from '@/types/filter';
import { apiClient } from './apiClient';

export interface SearchSuggestionsResult {
  products: Product[];
  brands: Brand[];
  totalMatches: number;
  popularSearches: string[];
}

function formatBackendFacets(facets: any): CatalogFacetCounts {
  const formatted: CatalogFacetCounts = {
    brands: {},
    movements: {},
    styles: {},
    gender: {},
    straps: {}
  };

  if (!facets) return formatted;

  if (Array.isArray(facets.brands)) {
    facets.brands.forEach((b: any) => {
      if (b.name) formatted.brands[b.name] = b.count || 0;
    });
  }
  if (Array.isArray(facets.movements)) {
    facets.movements.forEach((m: any) => {
      if (m.name) formatted.movements[m.name] = m.count || 0;
    });
  }
  if (Array.isArray(facets.styles)) {
    facets.styles.forEach((s: any) => {
      if (s.name) formatted.styles[s.name] = s.count || 0;
    });
  }
  if (Array.isArray(facets.gender)) {
    facets.gender.forEach((g: any) => {
      if (g.name) formatted.gender[g.name] = g.count || 0;
    });
  }
  if (Array.isArray(facets.straps)) {
    facets.straps.forEach((st: any) => {
      if (st.name) formatted.straps[st.name] = st.count || 0;
    });
  }

  return formatted;
}

export async function getCatalogProducts(
  filters: ProductQueryFilters = {},
  sortBy: SortOption = 'popularity',
  page: number = 1,
  pageSize: number = 12
): Promise<CatalogQueryResult> {
  try {
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('limit', String(pageSize));
    params.set('sortBy', sortBy);

    if (filters.category && filters.category !== 'all') params.set('category', filters.category);
    if (filters.gender && filters.gender !== 'All') params.set('gender', filters.gender);
    if (filters.searchQuery) params.set('search', filters.searchQuery);
    if (typeof filters.minPrice === 'number') params.set('minPrice', String(filters.minPrice));
    if (typeof filters.maxPrice === 'number') params.set('maxPrice', String(filters.maxPrice));
    if (filters.brands && filters.brands.length > 0) params.set('brands', filters.brands.join(','));
    if (filters.movements && filters.movements.length > 0) params.set('movements', filters.movements.join(','));
    if (filters.styles && filters.styles.length > 0) params.set('styles', filters.styles.join(','));

    const res = await apiClient.get<any>(`/watches?${params.toString()}`).catch(() => null);
    if (res && res.data) {
      const products = Array.isArray(res.data.products) ? res.data.products : (Array.isArray(res.data) ? res.data : []);
      const total = res.data.total ?? products.length;
      return {
        items: products,
        total,
        page: res.data.page || page,
        pageSize,
        totalPages: res.data.totalPages || Math.ceil(total / pageSize),
        facetCounts: formatBackendFacets(res.data.facets)
      };
    }
  } catch {
    // Return empty catalog on network error
  }

  return {
    items: [],
    total: 0,
    page: 1,
    pageSize,
    totalPages: 0,
    facetCounts: { brands: {}, movements: {}, styles: {}, gender: {}, straps: {} }
  };
}

export async function getProductById(id: string): Promise<Product | undefined> {
  try {
    const normalized = id.toLowerCase().trim();
    const res = await apiClient.get<Product>(`/watches/${encodeURIComponent(normalized)}`).catch(() => null);
    if (res && res.data && res.data.id) {
      return res.data;
    }
  } catch {
    return undefined;
  }
  return undefined;
}

export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  const products: Product[] = [];
  for (const id of ids) {
    try {
      const p = await getProductById(id);
      if (p) products.push(p);
    } catch {
      // Ignore not found
    }
  }
  return products;
}

export async function getAllProductIds(): Promise<string[]> {
  try {
    const res = await apiClient.get<any>('/watches?page=1&limit=100').catch(() => null);
    if (res && res.data) {
      const products = Array.isArray(res.data.products) ? res.data.products : (Array.isArray(res.data) ? res.data : []);
      return products.map((p: Product) => p.id);
    }
  } catch {
    return [];
  }
  return [];
}

export async function getCategories(): Promise<CategoryItem[]> {
  try {
    const res = await apiClient.get<CategoryItem[]>('/categories').catch(() => null);
    if (res && res.data && Array.isArray(res.data)) {
      return res.data;
    }
  } catch {
    return [];
  }
  return [];
}

export async function getCategoryBySlug(slug: string): Promise<CategoryItem | undefined> {
  const categories = await getCategories();
  return categories.find(c => c.slug === slug);
}

export async function getFeaturedProducts(limit: number = 8): Promise<Product[]> {
  try {
    const res = await apiClient.get<any>(`/watches?page=1&limit=${limit}&sortBy=popularity`).catch(() => null);
    if (res && res.data) {
      const products = Array.isArray(res.data.products) ? res.data.products : (Array.isArray(res.data) ? res.data : []);
      return products.slice(0, limit);
    }
  } catch {
    return [];
  }
  return [];
}

export async function getSimilarProducts(productId: string, limit: number = 4): Promise<Product[]> {
  try {
    const current = await getProductById(productId);
    if (!current) return [];

    const res = await apiClient.get<any>(`/watches?category=${encodeURIComponent(current.gender || 'men')}&limit=${limit + 1}`).catch(() => null);
    if (res && res.data) {
      const products: Product[] = Array.isArray(res.data.products) ? res.data.products : (Array.isArray(res.data) ? res.data : []);
      return products.filter(p => p.id !== productId).slice(0, limit);
    }
  } catch {
    return [];
  }
  return [];
}

export async function getSearchSuggestions(query: string): Promise<SearchSuggestionsResult> {
  const cleanQ = query.toLowerCase().trim();
  const popularSearches = [
    'Automatic',
    'Chronograph',
    'Emerald Green',
    'Skeleton',
    'Minimal Leather',
    'AUREN',
    'Mesh Strap',
    'Titanium'
  ];

  if (!cleanQ) {
    return {
      products: [],
      brands: [],
      totalMatches: 0,
      popularSearches
    };
  }

  const [watchesRes, brandsRes] = await Promise.all([
    apiClient.get<any>(`/watches?search=${encodeURIComponent(cleanQ)}&limit=6`).catch(() => null),
    apiClient.get<Brand[]>('/brands').catch(() => null)
  ]);

  const products: Product[] = watchesRes?.data?.products || (Array.isArray(watchesRes?.data) ? watchesRes?.data : []);
  const allBrands: Brand[] = brandsRes?.data || [];
  const matchedBrands = allBrands.filter(b => b.name.toLowerCase().includes(cleanQ));

  return {
    products: products.slice(0, 6),
    brands: matchedBrands,
    totalMatches: watchesRes?.data?.total || products.length,
    popularSearches
  };
}

export const productService = {
  getProductById,
  getProductsByIds,
  getAllProductIds,
  getCatalogProducts,
  getCategories,
  getSimilarProducts,
  getSearchSuggestions
};
