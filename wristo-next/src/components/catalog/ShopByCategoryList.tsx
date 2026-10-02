'use client';

import React from 'react';

export interface CategoryNavItem {
  id: string;
  label: string;
  icon: string;
  filterKey: 'gender' | 'movement' | 'style' | 'category';
  filterValue: string;
}

const CATEGORY_NAV_ITEMS: CategoryNavItem[] = [
  { id: 'men', label: 'Men', icon: '👔', filterKey: 'gender', filterValue: 'Men' },
  { id: 'women', label: 'Women', icon: '👗', filterKey: 'gender', filterValue: 'Women' },
  { id: 'unisex', label: 'Unisex', icon: '👥', filterKey: 'gender', filterValue: 'Unisex' },
  { id: 'analog', label: 'Analog', icon: '⏱️', filterKey: 'movement', filterValue: 'Quartz' },
  { id: 'automatic', label: 'Automatic', icon: '⚙️', filterKey: 'movement', filterValue: 'Automatic' },
  { id: 'chronograph', label: 'Chronograph', icon: '⏱️', filterKey: 'style', filterValue: 'Chronograph' },
  { id: 'smart', label: 'Smart Watches', icon: '⌚', filterKey: 'movement', filterValue: 'Smart Digital' },
  { id: 'accessories', label: 'Accessories', icon: '👓', filterKey: 'category', filterValue: 'accessories' },
];

interface ShopByCategoryListProps {
  activeGender?: string;
  activeMovement?: string[];
  activeStyle?: string[];
  activeCategory?: string;
  onSelectNavItem: (item: CategoryNavItem) => void;
}

export default function ShopByCategoryList({
  activeGender,
  activeMovement = [],
  activeStyle = [],
  activeCategory,
  onSelectNavItem,
}: ShopByCategoryListProps) {
  return (
    <div className="shop-by-category-nav-group">
      <div className="shop-by-category-header">
        <span className="shop-by-category-heading">Shop by Category</span>
      </div>
      <div className="shop-by-category-list">
        {CATEGORY_NAV_ITEMS.map((item) => {
          let isActive = false;
          if (item.filterKey === 'gender' && activeGender === item.filterValue) {
            isActive = true;
          } else if (item.filterKey === 'movement' && activeMovement.includes(item.filterValue)) {
            isActive = true;
          } else if (item.filterKey === 'style' && activeStyle.includes(item.filterValue)) {
            isActive = true;
          } else if (item.filterKey === 'category' && activeCategory === item.filterValue) {
            isActive = true;
          }

          return (
            <button
              key={item.id}
              type="button"
              className={`shop-by-category-item ${isActive ? 'active' : ''}`}
              onClick={() => onSelectNavItem(item)}
            >
              <div className="category-item-left">
                <span className="category-item-icon" aria-hidden="true">
                  {item.icon}
                </span>
                <span className="category-item-label">{item.label}</span>
              </div>
              <span className="category-item-arrow" aria-hidden="true">
                &rarr;
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
