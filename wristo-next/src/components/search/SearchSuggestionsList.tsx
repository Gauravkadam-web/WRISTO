'use client';

import React from 'react';
import Link from 'next/link';
import { Product, Brand } from '@/types/product';

interface SearchSuggestionsListProps {
  query: string;
  products: Product[];
  brands: Brand[];
  totalMatches: number;
  selectedIndex: number;
  onSelectProduct: (product: Product) => void;
  onClose: () => void;
}

export default function SearchSuggestionsList({
  query,
  products,
  brands,
  totalMatches,
  selectedIndex,
  onSelectProduct,
  onClose
}: SearchSuggestionsListProps) {
  // Helper to highlight matching query text in string
  const highlightMatch = (text: string, q: string) => {
    if (!q.trim()) return text;
    const regex = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <span key={i} className="search-highlight">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="search-results-panel">
      {/* Matching Brands Row */}
      {brands.length > 0 && (
        <div className="search-brands-match-block">
          <span className="search-results-subheading">Matching Manufactures</span>
          <div className="search-brands-pills">
            {brands.map((b) => (
              <Link
                key={b.name}
                href={`/watches?brand=${encodeURIComponent(b.name)}`}
                className="search-brand-match-pill"
                onClick={onClose}
              >
                <span className="search-brand-pill-name">{b.name}</span>
                <span className="search-brand-pill-count">{b.watchCount} models</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Matching Timepieces List */}
      <div className="search-products-match-block">
        <div className="search-results-header">
          <span className="search-results-subheading">
            Suggested Timepieces ({totalMatches} Found)
          </span>
          <span className="search-nav-tip">Use &uarr;&darr; to navigate &bull; Enter to view</span>
        </div>

        <div className="search-products-list" role="listbox" aria-label="Search suggestions">
          {products.map((item, idx) => {
            const isSelected = selectedIndex === idx;
            return (
              <div
                key={item.id}
                role="option"
                aria-selected={isSelected}
                className={`search-product-item ${isSelected ? 'active' : ''}`}
                onClick={() => onSelectProduct(item)}
              >
                <div className="search-item-media">
                  <img src={item.image} alt={item.model} className="search-item-img" />
                </div>

                <div className="search-item-info">
                  <div className="search-item-brand">{item.brand}</div>
                  <h4 className="search-item-title">
                    {highlightMatch(`${item.brand} ${item.model}`, query)}
                  </h4>
                  <div className="search-item-specs">
                    <span>{item.movement}</span>
                    <span className="search-spec-dot">&bull;</span>
                    <span>{item.caseSize}</span>
                    <span className="search-spec-dot">&bull;</span>
                    <span>{item.dial}</span>
                  </div>
                </div>

                <div className="search-item-price-col">
                  <div className="search-item-price">
                    ₹{item.price.toLocaleString('en-IN')}
                  </div>
                  {item.price < item.originalPrice && (
                    <div className="search-item-original">
                      ₹{item.originalPrice.toLocaleString('en-IN')}
                    </div>
                  )}
                  <span className="search-item-arrow">&rarr;</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* View All In Catalog Footer Link */}
      <div className="search-results-footer">
        <Link
          href={`/watches?q=${encodeURIComponent(query)}`}
          className="search-view-all-btn"
          onClick={onClose}
        >
          <span>View all {totalMatches} timepieces matching &ldquo;{query}&rdquo;</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
