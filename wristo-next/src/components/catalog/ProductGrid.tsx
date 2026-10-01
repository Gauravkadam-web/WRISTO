'use client';

import React from 'react';
import { Product } from '@/types/product';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  onResetFilters?: () => void;
}

export default function ProductGrid({ products, onResetFilters }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div
        className="catalog-empty-state"
        style={{
          background: 'var(--color-brand-paper)',
          border: '1px solid var(--color-border-light)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-16) var(--space-8)',
          textAlign: 'center',
          marginTop: 'var(--space-4)',
        }}
      >
        <div style={{ fontSize: '40px', marginBottom: '16px' }}>⌚</div>
        <h3 className="catalog-empty-title">
          No Matching Timepieces Found
        </h3>
        <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', maxWidth: '440px', margin: '0 auto 24px auto', lineHeight: 1.6 }}>
          We could not find any timepieces matching your active filter criteria. Try broadening your price range or clearing specific filter facets.
        </p>
        {onResetFilters && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={onResetFilters}
          >
            Reset All Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="product-grid" style={{ minHeight: '400px' }}>
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          priority={index < 4}
        />
      ))}
    </div>
  );
}
