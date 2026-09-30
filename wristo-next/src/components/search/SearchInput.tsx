'use client';

import React, { useRef, useEffect } from 'react';

interface SearchInputProps {
  value: string;
  onChange: (val: string) => void;
  onClear: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onClose: () => void;
}

export default function SearchInput({
  value,
  onChange,
  onClear,
  onKeyDown,
  onClose
}: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Auto-focus with small micro-delay for smooth modal entrance
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="search-input-wrapper">
      <div className="search-input-icon">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </div>

      <input
        ref={inputRef}
        type="text"
        className="search-input-field"
        placeholder="Search by brand, caliber, movement, or style..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        aria-label="Search watches"
        autoComplete="off"
        spellCheck="false"
      />

      <div className="search-input-actions">
        {value.length > 0 && (
          <button
            type="button"
            className="search-clear-btn"
            onClick={onClear}
            title="Clear search query"
            aria-label="Clear input"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}

        <button
          type="button"
          className="search-close-badge"
          onClick={onClose}
          title="Close search (Escape)"
        >
          ESC
        </button>
      </div>
    </div>
  );
}
