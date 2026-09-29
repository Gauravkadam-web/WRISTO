'use client';

import React from 'react';
import { CategoryItem } from '@/types/product';

interface CategoryNavProps {
  categories: CategoryItem[];
  selectedCategory: string;
  onSelectCategory: (slug: string) => void;
}

export default function CategoryNav({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryNavProps) {
  return (
    <nav className="category-pill-nav" aria-label="Watch Categories" style={{ marginBottom: 'var(--space-8)' }}>
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', scrollbarWidth: 'none' }}>
        {categories.map((cat) => {
          const isActive = selectedCategory.toLowerCase() === cat.slug.toLowerCase();
          return (
            <button
              key={cat.id}
              type="button"
              className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-outline'}`}
              style={{
                whiteSpace: 'nowrap',
                borderRadius: 'var(--radius-pill)',
                padding: '8px 18px',
                fontSize: '13px',
                fontWeight: isActive ? 600 : 500,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
              }}
              onClick={() => onSelectCategory(cat.slug)}
            >
              <span>{cat.shortTitle}</span>
              <span
                style={{
                  fontSize: '11px',
                  opacity: isActive ? 0.9 : 0.6,
                  background: isActive ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.06)',
                  padding: '1px 6px',
                  borderRadius: '10px',
                }}
              >
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
