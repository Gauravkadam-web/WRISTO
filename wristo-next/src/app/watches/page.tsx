import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { getCategories, getCatalogProducts } from '@/services/productService';
import { SortOption } from '@/types/filter';
import WatchesClient from './WatchesClient';

export const metadata: Metadata = {
  title: 'Explore All Timepieces | WRISTO Catalog & Horological Discovery',
  description: 'Browse our complete collection of 40 luxury, classic, automatic, chronograph, and connected timepieces. Filter by brand, movement caliber, case diameter, and style.',
};

export default async function WatchesPage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = searchParams ? await searchParams : {};
  const category = typeof params?.category === 'string' ? params.category : undefined;
  const gender = typeof params?.gender === 'string' ? params.gender : undefined;
  const brands = Array.isArray(params?.brand) ? params.brand : (typeof params?.brand === 'string' ? [params.brand] : undefined);
  const movements = Array.isArray(params?.movement) ? params.movement : (typeof params?.movement === 'string' ? [params.movement] : undefined);
  const styles = Array.isArray(params?.style) ? params.style : (typeof params?.style === 'string' ? [params.style] : undefined);
  
  const parsedMaxPrice = typeof params?.maxPrice === 'string' ? parseInt(params.maxPrice, 10) : undefined;
  const maxPrice = typeof parsedMaxPrice === 'number' && !isNaN(parsedMaxPrice) ? parsedMaxPrice : undefined;
  const sort = (typeof params?.sort === 'string' ? params.sort : 'popularity') as SortOption;

  const filters = { category, gender, brands, movements, styles, maxPrice };

  const [categories, initialResult] = await Promise.all([
    getCategories().catch(() => []),
    getCatalogProducts(filters, sort, 1, 12).catch(() => ({
      items: [],
      total: 0,
      page: 1,
      pageSize: 12,
      totalPages: 0,
      facetCounts: { brands: {}, movements: {}, styles: {}, gender: {}, straps: {} }
    })),
  ]);

  return (
    <Suspense fallback={
      <div style={{ padding: '80px 20px', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
        <p>Loading Curated Timepiece Catalog...</p>
      </div>
    }>
      <WatchesClient categories={categories || []} initialResult={initialResult} />
    </Suspense>
  );
}
