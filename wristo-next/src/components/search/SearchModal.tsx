'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSearch } from '@/context/SearchContext';
import { getSearchSuggestions, getFeaturedProducts, SearchSuggestionsResult } from '@/services/productService';
import { Product } from '@/types/product';
import SearchInput from './SearchInput';
import SearchRecentAndPopular from './SearchRecentAndPopular';
import SearchSuggestionsList from './SearchSuggestionsList';
import SearchEmptyState from './SearchEmptyState';

const RECENT_SEARCHES_KEY = 'wristo_recent_searches';
const DEFAULT_POPULAR = [
  'Automatic',
  'Chronograph',
  'Emerald Green',
  'Skeleton',
  'Minimal Leather',
  'AUREN',
  'Titanium',
  'Rose Gold'
];

export default function SearchModal() {
  const { isSearchOpen, closeSearch } = useSearch();
  const router = useRouter();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchSuggestionsResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);

  // Load recent searches from localStorage & load trending products on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch {
      // ignore storage errors
    }

    getFeaturedProducts(3).then((prods) => setTrendingProducts(prods));
  }, []);

  // Reset query and selected index whenever modal opens or closes
  useEffect(() => {
    if (isSearchOpen) {
      setQuery('');
      setResults(null);
      setSelectedIndex(-1);

      const handleGlobalKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          closeSearch();
        }
      };
      window.addEventListener('keydown', handleGlobalKeyDown);
      return () => window.removeEventListener('keydown', handleGlobalKeyDown);
    }
  }, [isSearchOpen, closeSearch]);

  // Save query to recent searches
  const saveRecentSearch = useCallback((q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    setRecentSearches((prev) => {
      const filtered = prev.filter((item) => item.toLowerCase() !== trimmed.toLowerCase());
      const updated = [trimmed, ...filtered].slice(0, 6);
      try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      } catch {
        // storage disabled
      }
      return updated;
    });
  }, []);

  const handleRemoveRecent = (term: string) => {
    setRecentSearches((prev) => {
      const updated = prev.filter((item) => item !== term);
      try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleClearRecent = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch {}
  };

  // Debounced Search Suggestions
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults(null);
      setIsLoading(false);
      setSelectedIndex(-1);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(async () => {
      const res = await getSearchSuggestions(trimmed);
      setResults(res);
      setIsLoading(false);
      setSelectedIndex(-1);
    }, 150);

    return () => clearTimeout(timer);
  }, [query]);

  // Navigate to product or full catalog
  const handleSelectProduct = (product: Product) => {
    saveRecentSearch(product.model);
    closeSearch();
    router.push(`/product/${product.id}`);
  };

  const handleSelectQuery = (q: string) => {
    setQuery(q);
  };

  const handleExecuteSearch = (q: string) => {
    const term = q.trim();
    if (!term) return;
    saveRecentSearch(term);
    closeSearch();
    router.push(`/watches?q=${encodeURIComponent(term)}`);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!results || results.products.length === 0) {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleExecuteSearch(query);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.products.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.products.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < results.products.length) {
        handleSelectProduct(results.products[selectedIndex]);
      } else {
        handleExecuteSearch(query);
      }
    }
  };

  if (!isSearchOpen) return null;

  const popularList = results?.popularSearches || DEFAULT_POPULAR;
  const hasQuery = query.trim().length > 0;
  const hasResults = results && (results.products.length > 0 || results.brands.length > 0);
  const isEmpty = hasQuery && !isLoading && results && results.products.length === 0 && results.brands.length === 0;

  return (
    <div
      className="search-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          closeSearch();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Instant search overlay"
    >
      <div className="search-modal-container">
        {/* Search Input Bar */}
        <SearchInput
          value={query}
          onChange={setQuery}
          onClear={() => {
            setQuery('');
            setResults(null);
            setSelectedIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          onClose={closeSearch}
        />

        {/* Modal Body */}
        <div className="search-modal-body">
          {isLoading && (
            <div className="search-loading-bar">
              <div className="search-loading-line" />
            </div>
          )}

          {!hasQuery && (
            <SearchRecentAndPopular
              recentSearches={recentSearches}
              popularSearches={popularList}
              trendingProducts={trendingProducts}
              onSelectQuery={handleSelectQuery}
              onRemoveRecent={handleRemoveRecent}
              onClearRecent={handleClearRecent}
              onClose={closeSearch}
            />
          )}

          {hasResults && (
            <SearchSuggestionsList
              query={query}
              products={results.products}
              brands={results.brands}
              totalMatches={results.totalMatches}
              selectedIndex={selectedIndex}
              onSelectProduct={handleSelectProduct}
              onClose={closeSearch}
            />
          )}

          {isEmpty && (
            <SearchEmptyState
              query={query}
              popularSearches={popularList}
              onSelectQuery={handleSelectQuery}
              onClear={() => {
                setQuery('');
                setResults(null);
              }}
              onClose={closeSearch}
            />
          )}
        </div>

        {/* Search Footer Tips */}
        <div className="search-modal-footer">
          <div className="search-footer-hint">
            <kbd className="search-key-badge">ESC</kbd> to close
          </div>
          <div className="search-footer-hint">
            <kbd className="search-key-badge">&uarr;</kbd> <kbd className="search-key-badge">&darr;</kbd> to navigate
          </div>
          <div className="search-footer-hint">
            <kbd className="search-key-badge">&crarr;</kbd> to select
          </div>
        </div>
      </div>
    </div>
  );
}
