import { Product, CategoryItem } from '@/types/product';
import { ProductQueryFilters, SortOption, CatalogQueryResult, CatalogFacetCounts } from '@/types/filter';
import { PRODUCTS } from '@/data/products';
import { CATEGORIES } from '@/data/categories';

/**
 * WRISTO Product Service
 * 
 * Production-ready service abstraction layer.
 * Currently backed by typed local domain datasets.
 * Designed to seamlessly transition to Spring Boot REST endpoints:
 * fetch(`${SPRING_BOOT_API_URL}/api/v1/watches?...`)
 * with zero UI component changes.
 */

export async function getCatalogProducts(
  filters: ProductQueryFilters = {},
  sortBy: SortOption = 'popularity',
  page: number = 1,
  pageSize: number = 12
): Promise<CatalogQueryResult> {
  // Simulate standard network micro-latency for smooth UI transitions if needed
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
      // Sort by rating count * rating
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

export async function getProductById(id: string): Promise<Product | undefined> {
  const normalized = id.toLowerCase().trim();
  return PRODUCTS.find(p => 
    p.id.toLowerCase() === normalized ||
    p.model.toLowerCase().replace(/[^a-z0-9]+/g, '-') === normalized
  );
}

export async function getAllProductIds(): Promise<string[]> {
  return PRODUCTS.map(p => p.id);
}

export async function getCategories(): Promise<CategoryItem[]> {
  return CATEGORIES;
}

export async function getCategoryBySlug(slug: string): Promise<CategoryItem | undefined> {
  return CATEGORIES.find(c => c.slug === slug);
}

export async function getFeaturedProducts(limit: number = 8): Promise<Product[]> {
  return PRODUCTS.slice(0, limit);
}

export async function getSimilarProducts(productId: string, limit: number = 4): Promise<Product[]> {
  const current = PRODUCTS.find(p => p.id === productId);
  if (!current) return PRODUCTS.slice(0, limit);

  return PRODUCTS
    .filter(p => p.id !== productId && (p.movement === current.movement || p.brand === current.brand || p.style === current.style))
    .slice(0, limit);
}
