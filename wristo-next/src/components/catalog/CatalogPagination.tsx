'use client';

import React from 'react';

interface CatalogPaginationProps {
  currentCount: number;
  total: number;
  hasMore: boolean;
  onLoadMore: () => void;
  isLoading?: boolean;
}

export default function CatalogPagination({
  currentCount,
  total,
  hasMore,
  onLoadMore,
  isLoading = false,
}: CatalogPaginationProps) {
  if (total === 0) return null;

  const percentage = Math.min(100, Math.round((currentCount / total) * 100));
  const remaining = Math.max(0, total - currentCount);

  return (
    <div className="catalog-pagination-wrap" style={{ marginTop: 'var(--space-12)', textAlign: 'center' }}>
      {/* Progress text */}
      <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '10px' }}>
        Showing <strong>{currentCount}</strong> of <strong>{total}</strong> timepieces
      </div>

      {/* Progress bar */}
      <div
        style={{
          width: '240px',
          height: '3px',
          background: 'var(--color-border-light)',
          margin: '0 auto 24px auto',
          borderRadius: '3px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: '100%',
            background: 'var(--brand-bronze)',
            transition: 'width 0.4s ease',
          }}
        />
      </div>

      {/* CTA Button or Completion mark */}
      {hasMore ? (
        <button
          type="button"
          className="btn btn-champagne btn-lg"
          onClick={onLoadMore}
          disabled={isLoading}
          style={{ minWidth: '220px' }}
        >
          {isLoading ? 'Loading Timepieces...' : `Load More Timepieces (${remaining} remaining) ↓`}
        </button>
      ) : (
        <div style={{ fontSize: '11.5px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--brand-bronze)', fontWeight: 600 }}>
          All Curated Timepieces Loaded
        </div>
      )}
    </div>
  );
}
