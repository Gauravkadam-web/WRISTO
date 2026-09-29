'use client';

import React from 'react';
import { ProductQueryFilters } from '@/types/filter';

interface ActiveFilterBarProps {
  total: number;
  filters: ProductQueryFilters;
  onRemoveBrand: (brand: string) => void;
  onRemoveMovement: (movement: string) => void;
  onRemoveStyle: (style: string) => void;
  onRemoveGender: () => void;
  onResetPrice: () => void;
  onRemoveCaseSize: (size: string) => void;
  onRemoveSearch: () => void;
  onClearAll: () => void;
  onOpenMobileFilters: () => void;
  activeFilterCount: number;
}

export default function ActiveFilterBar({
  total,
  filters,
  onRemoveBrand,
  onRemoveMovement,
  onRemoveStyle,
  onRemoveGender,
  onResetPrice,
  onRemoveCaseSize,
  onRemoveSearch,
  onClearAll,
  onOpenMobileFilters,
  activeFilterCount,
}: ActiveFilterBarProps) {
  const hasActiveFilters = activeFilterCount > 0;

  return (
    <div className="active-filters-container" style={{ marginBottom: 'var(--space-6)' }}>
      {/* Top Bar with Count & Mobile Filter Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div className="discovery-count-text" aria-live="polite">
          Showing <strong>{total}</strong> {total === 1 ? 'Timepiece' : 'Timepieces'}
        </div>

        {/* Mobile Filter Trigger Button (hidden on desktop via CSS) */}
        <button
          type="button"
          className="btn btn-outline btn-sm mobile-filter-trigger"
          onClick={onOpenMobileFilters}
          style={{ alignItems: 'center', gap: '8px' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" />
            <line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" />
            <line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" />
            <line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" /><line x1="17" y1="16" x2="23" y2="16" />
          </svg>
          Filters & Sort {activeFilterCount > 0 && `(${activeFilterCount})`}
        </button>
      </div>

      {/* Filter Chips Bar */}
      {hasActiveFilters && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '12px' }}>
          <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)', fontWeight: 600 }}>Active:</span>

          {/* Search Query Chip */}
          {filters.searchQuery && (
            <span className="filter-pill-chip">
              Search: &ldquo;{filters.searchQuery}&rdquo;
              <button type="button" onClick={onRemoveSearch} aria-label="Remove search filter">&times;</button>
            </span>
          )}

          {/* Gender Chip */}
          {filters.gender && filters.gender !== 'All' && (
            <span className="filter-pill-chip">
              {filters.gender}
              <button type="button" onClick={onRemoveGender} aria-label={`Remove gender ${filters.gender}`}>&times;</button>
            </span>
          )}

          {/* Brands Chips */}
          {filters.brands?.map(brand => (
            <span key={brand} className="filter-pill-chip">
              {brand}
              <button type="button" onClick={() => onRemoveBrand(brand)} aria-label={`Remove brand ${brand}`}>&times;</button>
            </span>
          ))}

          {/* Movement Chips */}
          {filters.movements?.map(mov => (
            <span key={mov} className="filter-pill-chip">
              {mov}
              <button type="button" onClick={() => onRemoveMovement(mov)} aria-label={`Remove movement ${mov}`}>&times;</button>
            </span>
          ))}

          {/* Style Chips */}
          {filters.styles?.map(sty => (
            <span key={sty} className="filter-pill-chip">
              {sty}
              <button type="button" onClick={() => onRemoveStyle(sty)} aria-label={`Remove style ${sty}`}>&times;</button>
            </span>
          ))}

          {/* Case Size Chips */}
          {filters.caseSizes?.map(cs => (
            <span key={cs} className="filter-pill-chip">
              Case {cs}
              <button type="button" onClick={() => onRemoveCaseSize(cs)} aria-label={`Remove case size ${cs}`}>&times;</button>
            </span>
          ))}

          {/* Max Price Chip */}
          {typeof filters.maxPrice === 'number' && filters.maxPrice < 25000 && (
            <span className="filter-pill-chip">
              &le; ₹{filters.maxPrice.toLocaleString('en-IN')}
              <button type="button" onClick={onResetPrice} aria-label="Reset max price">&times;</button>
            </span>
          )}

          {/* Clear All CTA */}
          <button
            type="button"
            onClick={onClearAll}
            style={{
              fontSize: '12px',
              color: 'var(--brand-bronze)',
              fontWeight: 600,
              marginLeft: '4px',
              textDecoration: 'underline',
              cursor: 'pointer',
            }}
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  );
}
