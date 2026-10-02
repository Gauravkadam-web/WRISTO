'use client';

import React from 'react';
import Image from 'next/image';

export interface CategoryChipItem {
  id: string;
  title: string;
  count: string;
  image: string;
  type: 'category' | 'movement' | 'style';
  value: string;
}

const CATEGORY_CHIPS: CategoryChipItem[] = [
  {
    id: 'analog',
    title: 'Analog',
    count: '1,240 Items',
    image: '/assets/categories/cat-analog.png',
    type: 'movement',
    value: 'Quartz',
  },
  {
    id: 'chronograph',
    title: 'Chronograph',
    count: '852 Items',
    image: '/assets/categories/cat-chronograph.png',
    type: 'style',
    value: 'Chronograph',
  },
  {
    id: 'smart',
    title: 'Smart',
    count: '600 Items',
    image: '/assets/categories/cat-smart.png',
    type: 'movement',
    value: 'Smart Digital',
  },
  {
    id: 'dress',
    title: 'Dress',
    count: '716 Items',
    image: '/assets/categories/cat-dress.png',
    type: 'style',
    value: 'Dress',
  },
];

interface CircularCategoryChipsProps {
  activeMovement?: string;
  activeStyle?: string;
  onSelectChip: (type: 'category' | 'movement' | 'style', val: string) => void;
}

export default function CircularCategoryChips({
  activeMovement,
  activeStyle,
  onSelectChip,
}: CircularCategoryChipsProps) {
  return (
    <div className="circular-category-chips-container" aria-label="Quick Category Discovery">
      <div className="circular-category-chips-grid">
        {CATEGORY_CHIPS.map((chip) => {
          const isActive =
            (chip.type === 'movement' && activeMovement === chip.value) ||
            (chip.type === 'style' && activeStyle === chip.value);

          return (
            <button
              key={chip.id}
              type="button"
              className={`circular-chip-card ${isActive ? 'active' : ''}`}
              onClick={() => onSelectChip(chip.type, chip.value)}
              title={`Filter by ${chip.title} (${chip.count})`}
            >
              <div className="circular-chip-avatar-wrap">
                <Image
                  src={chip.image}
                  alt={chip.title}
                  width={96}
                  height={96}
                  className="circular-chip-img"
                  priority
                />
                {isActive && <div className="circular-chip-active-ring" />}
              </div>
              <div className="circular-chip-info">
                <span className="circular-chip-title">{chip.title}</span>
                <span className="circular-chip-count">{chip.count}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
