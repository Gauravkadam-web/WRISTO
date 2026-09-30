'use client';

import React from 'react';
import Link from 'next/link';

interface SearchEmptyStateProps {
  query: string;
  popularSearches: string[];
  onSelectQuery: (query: string) => void;
  onClear: () => void;
  onClose: () => void;
}

export default function SearchEmptyState({
  query,
  popularSearches,
  onSelectQuery,
  onClear,
  onClose
}: SearchEmptyStateProps) {
  return (
    <div className="search-empty-state">
      <div className="search-empty-icon-wrap">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
          <line x1="8" y1="11" x2="14" y2="11" />
        </svg>
      </div>

      <h3 className="search-empty-title">
        No timepieces located for &ldquo;{query}&rdquo;
      </h3>

      <p className="search-empty-desc">
        We could not find an exact horological match. Try searching by manufacture (e.g. <em>AUREN</em>, <em>VANGUARD</em>), movement caliber (<em>Automatic</em>), or dial finish.
      </p>

      {/* Suggested Quick Recovery Chips */}
      <div className="search-empty-suggestions">
        <span className="search-empty-suggestions-label">Try searching for:</span>
        <div className="search-chips-row" style={{ justifyContent: 'center' }}>
          {popularSearches.slice(0, 5).map((term) => (
            <button
              key={term}
              type="button"
              className="search-popular-chip"
              onClick={() => onSelectQuery(term)}
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      <div className="search-empty-actions">
        <button
          type="button"
          className="btn btn-outline btn-sm"
          onClick={onClear}
        >
          Clear Query
        </button>
        <Link
          href="/watches"
          className="btn btn-primary btn-sm"
          onClick={onClose}
        >
          Explore All 40 Watches &rarr;
        </Link>
      </div>
    </div>
  );
}
