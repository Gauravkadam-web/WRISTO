import { Product, CategoryItem, Brand } from '@/types/product';
import { ProductQueryFilters, SortOption, CatalogQueryResult, CatalogFacetCounts } from '@/types/filter';
import { PRODUCTS } from '@/data/products';
import { CATEGORIES } from '@/data/categories';
import { BRANDS } from '@/data/brands';
import { apiClient } from './apiClient';

export interface SearchSuggestionsResult {
  products: Product[];
  brands: Brand[];
  totalMatches: number;
  popularSearches: string[];
}

/**
 * WRISTO Product Service
 * 
 * Production-grade resilient service abstraction layer.
 * Queries the live Spring Boot 3.3.4 + PostgreSQL backend on Render
 * with automatic, instant local domain dataset fallback for zero-downtime resilience.
 */

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

export function getLocalCatalogProducts(
  filters: ProductQueryFilters = {},
  sortBy: SortOption = 'popularity',
  page: number = 1,
  pageSize: number = 12
): CatalogQueryResult {
  let filtered = [...PRODUCTS];

  // 1. Category Filtering
  if (filters.category && filters.category !== 'all') {
    const cat = filters.category.toLowerCase();
    if (cat === 'men') {
      filtered = filtered.filter(p => p.gender === 'Men');
    } else if (cat === 'women') {
      filtered = filtered.filter(p => p.gender === 'Women');
    } else if (cat === 'automatic') {
      filtered = filtered.filter(p => p.movement === 'Automatic');
    } else if (cat === 'chronograph') {
      filtered = filtered.filter(p => p.style === 'Chronograph');
    } else if (cat === 'dress') {
      filtered = filtered.filter(p => p.style === 'Minimal' || p.style === 'Dress');
    } else if (cat === 'smart') {
      filtered = filtered.filter(p => p.movement === 'Smart Digital');
    }
  }

  // 2. Gender Filter
  if (filters.gender && filters.gender !== 'All') {
    filtered = filtered.filter(p => p.gender === filters.gender || p.gender === 'Unisex');
  }

  // 3. Brands Filter (Multi-select)
  if (filters.brands && filters.brands.length > 0) {
    filtered = filtered.filter(p => filters.brands!.includes(p.brand));
  }

  // 4. Movement Filter (Multi-select)
  if (filters.movements && filters.movements.length > 0) {
    filtered = filtered.filter(p => filters.movements!.includes(p.movement));
  }

  // 5. Style Filter (Multi-select)
  if (filters.styles && filters.styles.length > 0) {
    filtered = filtered.filter(p => filters.styles!.includes(p.style));
  }

  // 6. Price Range Filter
  if (typeof filters.minPrice === 'number') {
    filtered = filtered.filter(p => p.price >= filters.minPrice!);
  }
  if (typeof filters.maxPrice === 'number') {
    filtered = filtered.filter(p => p.price <= filters.maxPrice!);
  }

  // 7. Case Size Filter
  if (filters.caseSizes && filters.caseSizes.length > 0) {
    filtered = filtered.filter(p => {
      const sizeNum = parseInt(p.caseSize, 10);
      return filters.caseSizes!.some(cs => {
        if (cs === '<39mm') return sizeNum < 39;
        if (cs === '39-41mm') return sizeNum >= 39 && sizeNum <= 41;
        if (cs === '42mm+') return sizeNum >= 42;
        return false;
      });
    });
  }

  // 8. Strap Filter
  if (filters.straps && filters.straps.length > 0) {
    filtered = filtered.filter(p => {
      return filters.straps!.some(s => p.strap.toLowerCase().includes(s.toLowerCase()));
    });
  }

  // 9. Search Query
  if (filters.searchQuery && filters.searchQuery.trim().length > 0) {
    const q = filters.searchQuery.toLowerCase().trim();
    filtered = filtered.filter(p => 
      p.brand.toLowerCase().includes(q) ||
      p.model.toLowerCase().includes(q) ||
      p.tagline.toLowerCase().includes(q) ||
      p.movement.toLowerCase().includes(q) ||
      p.style.toLowerCase().includes(q)
    );
  }

  // Calculate dynamic facet counts for the current matching pool
  const facetCounts: CatalogFacetCounts = {
    brands: {},
    movements: {},
    styles: {},
    gender: {},
    straps: {}
  };

  filtered.forEach(p => {
    facetCounts.brands[p.brand] = (facetCounts.brands[p.brand] || 0) + 1;
    facetCounts.movements[p.movement] = (facetCounts.movements[p.movement] || 0) + 1;
    facetCounts.styles[p.style] = (facetCounts.styles[p.style] || 0) + 1;
    facetCounts.gender[p.gender] = (facetCounts.gender[p.gender] || 0) + 1;
    
    // Categorize strap
    const strapKey = p.strap.includes('Leather') ? 'Leather' :
                     (p.strap.includes('Mesh') || p.strap.includes('Steel') || p.strap.includes('Link')) ? 'Steel / Mesh' :
                     'Silicone / Sport';
    facetCounts.straps[strapKey] = (facetCounts.straps[strapKey] || 0) + 1;
  });

  // Apply Sorting
  switch (sortBy) {
    case 'price-asc':
      filtered.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      filtered.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      filtered.sort((a, b) => b.rating - a.rating);
      break;
    case 'newest':
      filtered.sort((a, b) => parseInt(b.num, 10) - parseInt(a.num, 10));
      break;
    case 'popularity':
    default:
      filtered.sort((a, b) => (b.rating * b.reviewsCount) - (a.rating * a.reviewsCount));
      break;
  }

  const total = filtered.length;
  const totalPages = Math.ceil(total / pageSize);
  const offset = (page - 1) * pageSize;
  const items = filtered.slice(offset, offset + pageSize);

  return {
    items,
    total,
    page,
    pageSize,
    totalPages,
    facetCounts
  };
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

    const res = await apiClient.get<any>(`/watches?${params.toString()}`);
    if (res && res.data && Array.isArray(res.data.products) && res.data.products.length > 0) {
      return {
        items: res.data.products,
        total: res.data.total || res.data.products.length,
        page: res.data.page || page,
        pageSize,
        totalPages: res.data.totalPages || Math.ceil((res.data.total || res.data.products.length) / pageSize),
        facetCounts: formatBackendFacets(res.data.facets)
      };
    }
  } catch {
    // Graceful fallback to local in-memory dataset
  }

  return getLocalCatalogProducts(filters, sortBy, page, pageSize);
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const normalized = id.toLowerCase().trim();

  try {
    const res = await apiClient.get<Product>(`/watches/${encodeURIComponent(normalized)}`);
    if (res && res.data && res.data.id) {
      return res.data;
    }
  } catch {
    // Fallback to local dataset
  }

  return PRODUCTS.find(p => 
    p.id.toLowerCase() === normalized ||
    p.model.toLowerCase().replace(/[^a-z0-9]+/g, '-') === normalized
  );
}

export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  const normalizedIds = ids.map(id => id.toLowerCase().trim());
  return PRODUCTS.filter(p => normalizedIds.includes(p.id.toLowerCase().trim()));
}

export async function getAllProductIds(): Promise<string[]> {
  return PRODUCTS.map(p => p.id);
}

export async function getCategories(): Promise<CategoryItem[]> {
  try {
    const res = await apiClient.get<CategoryItem[]>('/categories');
    if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
      const hasAll = res.data.some(c => c.slug === 'all');
      const allCategory: CategoryItem = {
        id: 'all',
        slug: 'all',
        title: 'All Curated Timepieces',
        shortTitle: 'All Watches',
        description: 'Explore our full catalog of 40 luxury, classic, automatic, chronograph, and connected timepieces.',
        count: 40
      };

      const enriched = res.data.map(cat => ({
        ...cat,
        count: cat.count || (cat.slug === 'men' ? 20 : cat.slug === 'women' ? 8 : cat.slug === 'automatic' ? 7 : cat.slug === 'chronograph' ? 2 : cat.slug === 'dress' ? 10 : cat.slug === 'smart' ? 4 : 40)
      }));

      return hasAll ? enriched : [allCategory, ...enriched];
    }
  } catch {
    // Fallback
  }
  return CATEGORIES;
}

export async function getCategoryBySlug(slug: string): Promise<CategoryItem | undefined> {
  const categories = await getCategories();
  return categories.find(c => c.slug === slug);
}

export async function getFeaturedProducts(limit: number = 8): Promise<Product[]> {
  try {
    const res = await apiClient.get<any>(`/watches?page=1&limit=${limit}&sortBy=popularity`);
    if (res && res.data && Array.isArray(res.data.products) && res.data.products.length > 0) {
      return res.data.products.slice(0, limit);
    }
  } catch {
    // Fallback
  }
  return PRODUCTS.slice(0, limit);
}

export async function getSimilarProducts(productId: string, limit: number = 4): Promise<Product[]> {
  const current = await getProductById(productId);
  if (!current) return PRODUCTS.slice(0, limit);

  return PRODUCTS
    .filter(p => p.id !== productId && (p.movement === current.movement || p.brand === current.brand || p.style === current.style))
    .slice(0, limit);
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
      products: PRODUCTS.slice(0, 3),
      brands: [],
      totalMatches: 0,
      popularSearches
    };
  }

  try {
    const res = await apiClient.get<any>(`/watches?search=${encodeURIComponent(cleanQ)}&limit=6`);
    if (res && res.data && Array.isArray(res.data.products)) {
      const matchedBrands = BRANDS.filter(b =>
        b.name.toLowerCase().includes(cleanQ) ||
        b.styles.some(s => s.toLowerCase().includes(cleanQ))
      );

      return {
        products: res.data.products.slice(0, 6),
        brands: matchedBrands,
        totalMatches: res.data.total || res.data.products.length,
        popularSearches
      };
    }
  } catch {
    // Fallback
  }

  const matchedProducts = PRODUCTS.filter(p =>
    p.brand.toLowerCase().includes(cleanQ) ||
    p.model.toLowerCase().includes(cleanQ) ||
    p.movement.toLowerCase().includes(cleanQ) ||
    p.style.toLowerCase().includes(cleanQ) ||
    p.dial.toLowerCase().includes(cleanQ) ||
    p.strap.toLowerCase().includes(cleanQ) ||
    p.material.toLowerCase().includes(cleanQ) ||
    p.tagline.toLowerCase().includes(cleanQ) ||
    p.occasion.some(o => o.toLowerCase().includes(cleanQ))
  );

  const matchedBrands = BRANDS.filter(b =>
    b.name.toLowerCase().includes(cleanQ) ||
    b.styles.some(s => s.toLowerCase().includes(cleanQ))
  );

  return {
    products: matchedProducts.slice(0, 6),
    brands: matchedBrands,
    totalMatches: matchedProducts.length,
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


