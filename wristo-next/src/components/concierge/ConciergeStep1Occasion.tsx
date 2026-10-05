'use client';

import React from 'react';
import { OccasionType } from '@/types/concierge';
import { Wine, Landmark, Compass, Watch, Hourglass, Check } from 'lucide-react';

interface Step1Props {
  selectedOccasions: OccasionType[];
  onChange: (occasions: OccasionType[]) => void;
  onNext: () => void;
}

interface TileOption {
  id: OccasionType;
  icon: React.ReactNode;
  title: string;
  tagline: string;
  description: string;
}

const OCCASION_TILES: TileOption[] = [
  {
    id: 'black_tie',
    icon: <Wine size={22} strokeWidth={1.5} />,
    title: 'Black Tie & Gala',
    tagline: 'Evening Soirées & Formal Dining',
    description: 'Slender gold or steel profiles designed to slip unencumbered beneath a double-cuffed tuxedo shirt.'
  },
  {
    id: 'executive_boardroom',
    icon: <Landmark size={22} strokeWidth={1.5} />,
    title: 'Executive Boardroom',
    tagline: 'Corporate Leadership & Mergers',
    description: 'Understated horological gravitas with unblemished dials and commanding mechanical precision.'
  },
  {
    id: 'aviation_adventure',
    icon: <Compass size={22} strokeWidth={1.5} />,
    title: 'Aviation & Expedition',
    tagline: 'Regattas, Chronographs & Globetrotting',
    description: 'High-contrast luminescent markers, tachymeter bezels, and adventure-proof water resistance.'
  },
  {
    id: 'daily_luxury',
    icon: <Watch size={22} strokeWidth={1.5} />,
    title: 'Minimalist Daily Luxury',
    tagline: 'Effortless Contemporary Style',
    description: 'Versatile monochrome watches engineered for seamless transitions from casual weekends to fine dining.'
  },
  {
    id: 'heritage_heirloom',
    icon: <Hourglass size={22} strokeWidth={1.5} />,
    title: 'Heritage Heirloom',
    tagline: 'Generational Investment & Art',
    description: 'Exposed balance wheels, intricate skeleton dials, and self-winding automatic calibers built to outlast generations.'
  }
];

export default function ConciergeStep1Occasion({
  selectedOccasions,
  onChange,
  onNext
}: Step1Props) {
  const toggleOccasion = (id: OccasionType) => {
    if (selectedOccasions.includes(id)) {
      if (selectedOccasions.length > 1) {
        onChange(selectedOccasions.filter(o => o !== id));
      }
    } else {
      onChange([...selectedOccasions, id]);
    }
  };

  return (
    <div className="concierge-step-container">
      <div className="concierge-step-lead">
        <span className="concierge-step-badge">STEP 1 OF 5</span>
        <h2 className="concierge-step-title">What occasions will command this timepiece?</h2>
        <p className="concierge-step-desc">
          Select one or more lifestyle environments to establish the horological silhouette, case finish, and dial character.
        </p>
      </div>

      <div className="concierge-tiles-grid">
        {OCCASION_TILES.map((tile) => {
          const isSelected = selectedOccasions.includes(tile.id);
          return (
            <button
              key={tile.id}
              type="button"
              className={`concierge-tile-card ${isSelected ? 'selected' : ''}`}
              onClick={() => toggleOccasion(tile.id)}
            >
              <div className="concierge-tile-header">
                <span className="concierge-tile-icon" style={{ display: 'inline-flex', alignItems: 'center', color: 'var(--brand-bronze)' }}>{tile.icon}</span>
                <span className={`concierge-check-circle ${isSelected ? 'checked' : ''}`}>
                  {isSelected ? <Check size={12} strokeWidth={2.5} /> : ''}
                </span>
              </div>
              <h3 className="concierge-tile-title">{tile.title}</h3>
              <span className="concierge-tile-tagline">{tile.tagline}</span>
              <p className="concierge-tile-desc">{tile.description}</p>
            </button>
          );
        })}
      </div>

      <div className="concierge-actions-bar">
        <div className="concierge-selection-summary">
          {selectedOccasions.length} environment{selectedOccasions.length > 1 ? 's' : ''} selected
        </div>
        <button
          type="button"
          className="btn btn-primary btn-lg"
          onClick={onNext}
          disabled={selectedOccasions.length === 0}
        >
          Calibrate Case Ergonomics &rarr;
        </button>
      </div>
    </div>
  );
}
