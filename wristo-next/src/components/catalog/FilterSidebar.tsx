'use client';

import React from 'react';
import { ProductQueryFilters, CatalogFacetCounts } from '@/types/filter';
import ShopByCategoryList, { CategoryNavItem } from './ShopByCategoryList';

interface FilterSidebarProps {
  filters: ProductQueryFilters;
  facetCounts: CatalogFacetCounts;
  onUpdateFilters: (newFilters: Partial<ProductQueryFilters>) => void;
  onResetFilters: () => void;
}

const ALL_BRANDS = ['AUREN', 'VELA', 'ORBITA', 'VANTA', 'NORDEN', 'PULSE'];
const ALL_MOVEMENTS = ['Quartz', 'Automatic', 'Smart Digital'];
const ALL_STYLES = ['Minimal', 'Classic', 'Chronograph', 'Dress', 'Sport'];
const ALL_CASE_SIZES = [
  { value: '<39mm', label: 'Under 39mm' },
  { value: '39-41mm', label: '39mm – 41mm' },
  { value: '42mm+', label: '42mm and above' },
];
const ALL_STRAPS = ['Leather', 'Steel / Mesh', 'Silicone / Sport'];

export default function FilterSidebar({
  filters,
  facetCounts,
  onUpdateFilters,
  onResetFilters,
}: FilterSidebarProps) {
  const currentBrands = filters.brands || [];
  const currentMovements = filters.movements || [];
  const currentStyles = filters.styles || [];
  const currentCaseSizes = filters.caseSizes || [];
  const currentStraps = filters.straps || [];
  const maxPrice = typeof filters.maxPrice === 'number' ? filters.maxPrice : 25000;

  const handleSelectNavItem = (item: CategoryNavItem) => {
    if (item.filterKey === 'gender') {
      onUpdateFilters({ gender: filters.gender === item.filterValue ? 'All' : item.filterValue });
    } else if (item.filterKey === 'movement') {
      const isSelected = currentMovements.includes(item.filterValue);
      onUpdateFilters({ movements: isSelected ? [] : [item.filterValue] });
    } else if (item.filterKey === 'style') {
      const isSelected = currentStyles.includes(item.filterValue);
      onUpdateFilters({ styles: isSelected ? [] : [item.filterValue] });
    } else if (item.filterKey === 'category') {
      onUpdateFilters({ category: filters.category === item.filterValue ? undefined : item.filterValue });
    }
  };

  const toggleArrayFilter = (key: 'brands' | 'movements' | 'styles' | 'caseSizes' | 'straps', val: string) => {
    const list = filters[key] || [];
    const updated = list.includes(val) ? list.filter(item => item !== val) : [...list, val];
    onUpdateFilters({ [key]: updated });
  };

  return (
    <aside className="filter-sidebar" aria-label="Catalog Filters">
      {/* 0. Shop by Category Vertical Jump List (Panel 2 Parity) */}
      <ShopByCategoryList
        activeGender={filters.gender}
        activeMovement={currentMovements}
        activeStyle={currentStyles}
        activeCategory={filters.category}
        onSelectNavItem={handleSelectNavItem}
      />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid var(--color-border-light)' }}>
        <h2 style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-text-primary)' }}>
          Horological Filters
        </h2>
        <button
          type="button"
          onClick={onResetFilters}
          style={{ fontSize: '12px', color: 'var(--brand-bronze)', fontWeight: 600, cursor: 'pointer' }}
        >
          Reset All
        </button>
      </div>

      {/* 1. Price Range & Quick Brackets */}
      <div className="filter-group">
        <div className="filter-title" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Maximum Price</span>
          <span style={{ color: 'var(--brand-bronze)', fontWeight: 600 }}>
            &le; ₹{maxPrice.toLocaleString('en-IN')}
          </span>
        </div>
        <input
          type="range"
          min="3999"
          max="25000"
          step="500"
          value={maxPrice}
          onChange={(e) => onUpdateFilters({ maxPrice: parseInt(e.target.value, 10) })}
          style={{ width: '100%', accentColor: 'var(--brand-charcoal)', cursor: 'pointer' }}
          aria-label="Filter by maximum price"
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
          <span>₹3,999</span>
          <span>₹25,000+</span>
        </div>

        {/* Quick Price Bracket Chips */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '10px' }}>
          {[
            { label: '< ₹6K', max: 6000 },
            { label: '< ₹12K', max: 12000 },
            { label: '< ₹18K', max: 18000 },
            { label: 'All Prices', max: 25000 },
          ].map(b => (
            <button
              key={b.label}
              type="button"
              className={`filter-pill-bracket ${maxPrice === b.max ? 'active' : ''}`}
              onClick={() => onUpdateFilters({ maxPrice: b.max })}
              style={{
                fontSize: '11px',
                padding: '3px 8px',
                borderRadius: '4px',
                border: '1px solid var(--color-border-light)',
                background: maxPrice === b.max ? 'var(--brand-charcoal)' : 'transparent',
                color: maxPrice === b.max ? '#FFFFFF' : 'var(--color-text-secondary)',
                cursor: 'pointer',
              }}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Brand Houses */}
      <div className="filter-group">
        <div className="filter-title">Watch House</div>
        <div className="filter-options-list">
          {ALL_BRANDS.map(brand => {
            const count = facetCounts.brands[brand] || 0;
            const isChecked = currentBrands.includes(brand);
            return (
              <label key={brand} className="filter-checkbox-label">
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>{brand}</span>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>({count})</span>
                </span>
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

      {/* 3. Movement Caliber */}
      <div className="filter-group">
        <div className="filter-title">Movement Caliber</div>
        <div className="filter-options-list">
          {ALL_MOVEMENTS.map(mov => {
            const count = facetCounts.movements[mov] || 0;
            const isChecked = currentMovements.includes(mov);
            return (
              <label key={mov} className="filter-checkbox-label">
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>{mov}</span>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>({count})</span>
                </span>
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

      {/* 4. Style & Occasion */}
      <div className="filter-group">
        <div className="filter-title">Aesthetic Style</div>
        <div className="filter-options-list">
          {ALL_STYLES.map(style => {
            const count = facetCounts.styles[style] || 0;
            const isChecked = currentStyles.includes(style);
            return (
              <label key={style} className="filter-checkbox-label">
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>{style}</span>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>({count})</span>
                </span>
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

      {/* 5. Case Size */}
      <div className="filter-group">
        <div className="filter-title">Case Diameter</div>
        <div className="filter-options-list">
          {ALL_CASE_SIZES.map(cs => {
            const isChecked = currentCaseSizes.includes(cs.value);
            return (
              <label key={cs.value} className="filter-checkbox-label">
                <span>{cs.label}</span>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleArrayFilter('caseSizes', cs.value)}
                />
              </label>
            );
          })}
        </div>
      </div>

      {/* 6. Strap Material */}
      <div className="filter-group">
        <div className="filter-title">Strap Material</div>
        <div className="filter-options-list">
          {ALL_STRAPS.map(strap => {
            const count = facetCounts.straps[strap] || 0;
            const isChecked = currentStraps.includes(strap);
            return (
              <label key={strap} className="filter-checkbox-label">
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>{strap}</span>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>({count})</span>
                </span>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleArrayFilter('straps', strap)}
                />
              </label>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
