'use client';

import React, { useEffect, useRef } from 'react';
import { Watch } from 'lucide-react';
import gsap from 'gsap';
import { Product } from '@/types/product';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  onResetFilters?: () => void;
}

export default function ProductGrid({ products, onResetFilters }: ProductGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  // Subtle luxury stagger reveal when products are loaded or filtered
  useEffect(() => {
    if (!gridRef.current || typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const cards = gridRef.current.querySelectorAll('.product-card');
    if (cards.length > 0) {
      gsap.fromTo(
        cards,
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          stagger: 0.035,
          ease: 'power2.out',
        }
      );
    }
  }, [products]);

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
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'rgba(176, 141, 107, 0.1)',
          color: 'var(--brand-bronze, #B08D6B)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px auto'
        }}>
          <Watch size={32} strokeWidth={1.5} />
        </div>
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
    <div className="product-grid" ref={gridRef} style={{ minHeight: '400px' }}>
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
