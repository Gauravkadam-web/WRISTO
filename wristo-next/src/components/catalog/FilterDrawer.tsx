'use client';

import React, { useEffect } from 'react';
import { ProductQueryFilters, CatalogFacetCounts } from '@/types/filter';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  filters: ProductQueryFilters;
  facetCounts: CatalogFacetCounts;
  onUpdateFilters: (newFilters: Partial<ProductQueryFilters>) => void;
  onResetFilters: () => void;
}

const ALL_BRANDS = ['AUREN', 'VELA', 'ORBITA', 'VANTA', 'NORDEN', 'PULSE'];
const ALL_MOVEMENTS = ['Quartz', 'Automatic', 'Smart Digital'];
const ALL_STYLES = ['Minimal', 'Classic', 'Chronograph', 'Dress', 'Sport'];

export default function FilterDrawer({
  isOpen,
  onClose,
  total,
  filters,
  facetCounts,
  onUpdateFilters,
  onResetFilters,
}: FilterDrawerProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const currentBrands = filters.brands || [];
  const currentMovements = filters.movements || [];
  const currentStyles = filters.styles || [];
  const maxPrice = typeof filters.maxPrice === 'number' ? filters.maxPrice : 25000;

  const toggleArrayFilter = (key: 'brands' | 'movements' | 'styles', val: string) => {
    const list = filters[key] || [];
    const updated = list.includes(val) ? list.filter(item => item !== val) : [...list, val];
    onUpdateFilters({ [key]: updated });
  };

  return (
    <div
      className="mobile-filter-drawer-overlay open"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        justifyContent: 'flex-end',
      }}
    >
      <div
        className="mobile-filter-drawer-box"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '85%',
          maxWidth: '380px',
          height: '100%',
          backgroundColor: 'var(--color-brand-paper)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-luxury)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--color-border-light)' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Filter Timepieces
          </h2>
          <button
            type="button"
            onClick={onClose}
            style={{ fontSize: '24px', lineHeight: 1, color: 'var(--color-text-secondary)', cursor: 'pointer' }}
            aria-label="Close filters"
          >
            &times;
          </button>
        </div>

        {/* Scrollable Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          {/* Price */}
          <div className="filter-group">
            <div className="filter-title" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Max Price</span>
              <span style={{ color: 'var(--brand-bronze)' }}>&le; ₹{maxPrice.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min="3999"
              max="25000"
              step="500"
              value={maxPrice}
              onChange={(e) => onUpdateFilters({ maxPrice: parseInt(e.target.value, 10) })}
              style={{ width: '100%', accentColor: 'var(--brand-charcoal)', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
              <span>₹3,999</span>
              <span>₹25,000+</span>
            </div>
          </div>

          {/* Brands */}
          <div className="filter-group">
            <div className="filter-title">Watch House</div>
            <div className="filter-options-list">
              {ALL_BRANDS.map(brand => {
                const count = facetCounts?.brands?.[brand] || 0;
                const isChecked = currentBrands.includes(brand);
                return (
                  <label key={brand} className="filter-checkbox-label">
                    <span>{brand} ({count})</span>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleArrayFilter('brands', brand)}
                    />
                  </label>
                );
              })}
            </div>
          </div>

          {/* Movements */}
          <div className="filter-group">
            <div className="filter-title">Movement Caliber</div>
            <div className="filter-options-list">
              {ALL_MOVEMENTS.map(mov => {
                const count = facetCounts?.movements?.[mov] || 0;
                const isChecked = currentMovements.includes(mov);
                return (
                  <label key={mov} className="filter-checkbox-label">
                    <span>{mov} ({count})</span>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleArrayFilter('movements', mov)}
                    />
                  </label>
                );
              })}
            </div>
          </div>

          {/* Styles */}
          <div className="filter-group">
            <div className="filter-title">Style</div>
            <div className="filter-options-list">
              {ALL_STYLES.map(style => {
                const count = facetCounts?.styles?.[style] || 0;
                const isChecked = currentStyles.includes(style);
                return (
                  <label key={style} className="filter-checkbox-label">
                    <span>{style} ({count})</span>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleArrayFilter('styles', style)}
                    />
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sticky Action Footer */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid var(--color-border-light)', display: 'flex', gap: '10px' }}>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={onResetFilters}
            style={{ flex: 1 }}
          >
            Reset
          </button>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={onClose}
            style={{ flex: 2 }}
          >
            View {total} {total === 1 ? 'Watch' : 'Watches'}
          </button>
        </div>
      </div>
    </div>
  );
}
