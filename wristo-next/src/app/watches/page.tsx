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
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const category = typeof params.category === 'string' ? params.category : undefined;
  const gender = typeof params.gender === 'string' ? params.gender : undefined;
  const brands = Array.isArray(params.brand) ? params.brand : params.brand ? [params.brand] : undefined;
  const movements = Array.isArray(params.movement) ? params.movement : params.movement ? [params.movement] : undefined;
  const styles = Array.isArray(params.style) ? params.style : params.style ? [params.style] : undefined;
  const maxPrice = typeof params.maxPrice === 'string' ? parseInt(params.maxPrice, 10) : undefined;
  const sort = (typeof params.sort === 'string' ? params.sort : 'popularity') as SortOption;

  const filters = { category, gender, brands, movements, styles, maxPrice };

  const [categories, initialResult] = await Promise.all([
    getCategories(),
    getCatalogProducts(filters, sort, 1, 12),
  ]);

  return (
    <Suspense>
      <WatchesClient categories={categories} initialResult={initialResult} />
    </Suspense>
  );
}
