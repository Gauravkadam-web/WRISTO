'use client';

import React, { useState, useEffect, useTransition, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Product, CategoryItem } from '@/types/product';
import { ProductQueryFilters, SortOption, CatalogQueryResult } from '@/types/filter';
import { getCatalogProducts } from '@/services/productService';
import CategoryNav from '@/components/catalog/CategoryNav';
import ActiveFilterBar from '@/components/catalog/ActiveFilterBar';
import FilterSidebar from '@/components/catalog/FilterSidebar';
import FilterDrawer from '@/components/catalog/FilterDrawer';
import SortSelect from '@/components/catalog/SortSelect';
import ProductGrid from '@/components/catalog/ProductGrid';
import CatalogPagination from '@/components/catalog/CatalogPagination';

interface WatchesClientProps {
  categories: CategoryItem[];
  initialResult: CatalogQueryResult;
}

export default function WatchesClient({ categories, initialResult }: WatchesClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  // Parse state from URL params
  const activeCategory = searchParams.get('category') || 'all';
  const sortParam = (searchParams.get('sort') as SortOption) || 'popularity';
  const genderParam = searchParams.get('gender') || 'All';
  const brandParams = searchParams.getAll('brand');
  const movementParams = searchParams.getAll('movement');
  const styleParams = searchParams.getAll('style');
  const maxPriceParam = searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!, 10) : 25000;
  const searchParam = searchParams.get('q') || '';

  // Local pagination state
  const [pageSize, setPageSize] = useState(12);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [queryResult, setQueryResult] = useState<CatalogQueryResult>(initialResult);
  const [isLoading, setIsLoading] = useState(false);

  // Active category item
  const currentCategoryItem = categories.find(c => c.slug.toLowerCase() === activeCategory.toLowerCase()) || categories[0];

  // Helper to build URL params
  const updateUrlParams = useCallback((newParams: Record<string, string | string[] | number | null>) => {
    const current = new URLSearchParams(searchParams.toString());

    Object.entries(newParams).forEach(([key, val]) => {
      current.delete(key);
      if (val === null || val === undefined || val === '') {
        // deleted
      } else if (Array.isArray(val)) {
        val.forEach(v => current.append(key, v));
      } else {
        current.set(key, String(val));
      }
    });

    startTransition(() => {
      router.push(`${pathname}?${current.toString()}`, { scroll: false });
    });
  }, [searchParams, router, pathname]);

  // Execute query on filter or page change
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const filters: ProductQueryFilters = {
      category: activeCategory,
      brands: brandParams.length > 0 ? brandParams : undefined,
      movements: movementParams.length > 0 ? movementParams : undefined,
      styles: styleParams.length > 0 ? styleParams : undefined,
      gender: genderParam !== 'All' ? genderParam : undefined,
      maxPrice: maxPriceParam,
      searchQuery: searchParam || undefined,
    };

    getCatalogProducts(filters, sortParam, 1, pageSize).then(result => {
      if (isMounted) {
        setQueryResult(result);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [activeCategory, sortParam, genderParam, brandParams.join(','), movementParams.join(','), styleParams.join(','), maxPriceParam, searchParam, pageSize]);

  // Handlers
  const handleCategorySelect = (slug: string) => {
    setPageSize(12);
    updateUrlParams({ category: slug === 'all' ? null : slug });
  };

  const handleSortChange = (newSort: SortOption) => {
    updateUrlParams({ sort: newSort === 'popularity' ? null : newSort });
  };

  const handleUpdateFilters = (newFilters: Partial<ProductQueryFilters>) => {
    setPageSize(12);
    const updates: Record<string, string | string[] | number | null> = {};
    if ('brands' in newFilters) updates.brand = newFilters.brands && newFilters.brands.length > 0 ? newFilters.brands : null;
    if ('movements' in newFilters) updates.movement = newFilters.movements && newFilters.movements.length > 0 ? newFilters.movements : null;
    if ('styles' in newFilters) updates.style = newFilters.styles && newFilters.styles.length > 0 ? newFilters.styles : null;
    if ('gender' in newFilters) updates.gender = newFilters.gender && newFilters.gender !== 'All' ? newFilters.gender : null;
    if ('maxPrice' in newFilters) updates.maxPrice = newFilters.maxPrice && newFilters.maxPrice < 25000 ? newFilters.maxPrice : null;
    updateUrlParams(updates);
  };

  const handleResetFilters = () => {
    setPageSize(12);
    router.push(pathname, { scroll: false });
  };

  const handleLoadMore = () => {
    setPageSize(prev => prev + 12);
  };

  // Calculate active filter count for badge
  const activeFilterCount =
    (brandParams.length) +
    (movementParams.length) +
    (styleParams.length) +
    (genderParam !== 'All' ? 1 : 0) +
    (maxPriceParam < 25000 ? 1 : 0) +
    (searchParam ? 1 : 0);

  const currentFilters: ProductQueryFilters = {
    category: activeCategory,
    brands: brandParams,
    movements: movementParams,
    styles: styleParams,
    gender: genderParam,
    maxPrice: maxPriceParam,
    searchQuery: searchParam,
  };

  return (
    <div className="container" style={{ paddingTop: 'var(--space-8)', paddingBottom: 'var(--space-20)' }}>
      {/* Category Narrative Header */}
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <div className="section-label" style={{ color: 'var(--brand-bronze)' }}>
          CURATED CATALOGUE &bull; {queryResult.total} PIECES
        </div>
        <h1 className="section-title" style={{ margin: '4px 0 12px 0' }}>
          {currentCategoryItem.title}
        </h1>
        <p className="section-subtitle" style={{ maxWidth: '680px', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
          {currentCategoryItem.description}
        </p>
      </div>

      {/* Category Pills Navigation */}
      <CategoryNav
        categories={categories}
        selectedCategory={activeCategory}
        onSelectCategory={handleCategorySelect}
      />

      {/* Main 2-Column Discovery Layout */}
      <div className="discovery-layout">
        {/* Desktop Filter Rail */}
        <FilterSidebar
          filters={currentFilters}
          facetCounts={queryResult.facetCounts}
          onUpdateFilters={handleUpdateFilters}
          onResetFilters={handleResetFilters}
        />

        {/* Right Main Grid Area */}
        <main style={{ minWidth: 0, flex: 1 }}>
          {/* Top Bar with Sort and Active Filters */}
          <div
            className="discovery-top-bar"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
              paddingBottom: '16px',
              borderBottom: '1px solid var(--color-border-light)',
              marginBottom: '16px',
            }}
          >
            <ActiveFilterBar
              total={queryResult.total}
              filters={currentFilters}
              onRemoveBrand={(b) => handleUpdateFilters({ brands: brandParams.filter(x => x !== b) })}
              onRemoveMovement={(m) => handleUpdateFilters({ movements: movementParams.filter(x => x !== m) })}
              onRemoveStyle={(s) => handleUpdateFilters({ styles: styleParams.filter(x => x !== s) })}
              onRemoveGender={() => handleUpdateFilters({ gender: 'All' })}
              onResetPrice={() => handleUpdateFilters({ maxPrice: 25000 })}
              onRemoveCaseSize={() => {}}
              onRemoveSearch={() => updateUrlParams({ q: null })}
              onClearAll={handleResetFilters}
              onOpenMobileFilters={() => setIsMobileDrawerOpen(true)}
              activeFilterCount={activeFilterCount}
            />

            <SortSelect
              value={sortParam}
              onChange={handleSortChange}
            />
          </div>

          {/* Product Grid */}
          <ProductGrid
            products={queryResult.items}
            onResetFilters={handleResetFilters}
          />

          {/* Progressive Pagination */}
          <CatalogPagination
            currentCount={queryResult.items.length}
            total={queryResult.total}
            hasMore={queryResult.items.length < queryResult.total}
            onLoadMore={handleLoadMore}
            isLoading={isLoading}
          />
        </main>
      </div>

      {/* Mobile & Tablet Filter Drawer */}
      <FilterDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        total={queryResult.total}
        filters={currentFilters}
        facetCounts={queryResult.facetCounts}
        onUpdateFilters={handleUpdateFilters}
        onResetFilters={handleResetFilters}
      />
    </div>
  );
}
