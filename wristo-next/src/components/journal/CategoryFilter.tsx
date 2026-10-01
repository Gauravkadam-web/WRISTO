'use client';

import React from 'react';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  counts: { [key: string]: number };
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
  counts
}: CategoryFilterProps) {
  return (
    <div className="journal-filter-bar">
      <div className="journal-filter-scroll">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          const count = counts[cat] || 0;

          return (
            <button
              key={cat}
              type="button"
              className={`journal-filter-pill ${isSelected ? 'active' : ''}`}
              onClick={() => onSelectCategory(cat)}
            >
              <span>{cat}</span>
              <span className="journal-filter-count">{count}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
