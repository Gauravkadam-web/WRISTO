'use client';

import React from 'react';
import { SortOption } from '@/types/filter';

interface SortSelectProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

export default function SortSelect({ value, onChange }: SortSelectProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <label htmlFor="catalog-sort" style={{ fontSize: '13px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
        Sort:
      </label>
      <select
        id="catalog-sort"
        className="discovery-sort-select"
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        aria-label="Sort timepieces"
      >
        <option value="popularity">Curated Popularity</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="rating">Highest Rated</option>
        <option value="newest">Newest Arrivals</option>
      </select>
    </div>
  );
}
