'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/types/product';

interface SearchRecentAndPopularProps {
  recentSearches: string[];
  popularSearches: string[];
  trendingProducts: Product[];
  onSelectQuery: (query: string) => void;
  onRemoveRecent: (query: string) => void;
  onClearRecent: () => void;
  onClose: () => void;
}

export default function SearchRecentAndPopular({
  recentSearches,
  popularSearches,
  trendingProducts,
  onSelectQuery,
  onRemoveRecent,
  onClearRecent,
  onClose
}: SearchRecentAndPopularProps) {
  return (
    <div className="search-idle-panel">
      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <div className="search-section-block">
          <div className="search-section-header">
            <span className="search-section-title">Recent Searches</span>
            <button
              type="button"
              className="search-clear-history-btn"
              onClick={onClearRecent}
            >
              Clear History
            </button>
          </div>
          <div className="search-chips-row">
            {recentSearches.map((item) => (
              <div key={item} className="search-recent-chip-wrap">
                <button
                  type="button"
                  className="search-recent-chip"
                  onClick={() => onSelectQuery(item)}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span>{item}</span>
                </button>
                <button
                  type="button"
                  className="search-recent-del-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveRecent(item);
                  }}
                  title="Remove from history"
                  aria-label={`Remove ${item} from search history`}
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Popular Horological Terms */}
      <div className="search-section-block">
        <div className="search-section-header">
          <span className="search-section-title">Popular Horological Queries</span>
        </div>
        <div className="search-chips-row">
          {popularSearches.map((tag) => (
            <button
              key={tag}
              type="button"
              className="search-popular-chip"
              onClick={() => onSelectQuery(tag)}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                <polyline points="17 6 23 6 23 12" />
              </svg>
              <span>{tag}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Curated Trending Timepieces */}
      {trendingProducts.length > 0 && (
        <div className="search-section-block">
          <div className="search-section-header">
            <span className="search-section-title">Curated Trending Pieces</span>
          </div>
          <div className="search-trending-grid">
            {trendingProducts.map((p) => (
              <Link
                key={p.id}
                href={`/product/${p.id}`}
                className="search-trending-card"
                onClick={onClose}
              >
                <img src={p.image} alt={p.model} className="search-trending-img" />
                <div className="search-trending-info">
                  <span className="search-trending-brand">{p.brand}</span>
                  <span className="search-trending-model">{p.model}</span>
                  <span className="search-trending-price">₹{p.price.toLocaleString('en-IN')}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
