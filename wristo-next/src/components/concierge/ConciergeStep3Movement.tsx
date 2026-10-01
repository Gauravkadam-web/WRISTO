'use client';

import React from 'react';
import { MovementPreference } from '@/types/concierge';

interface Step3Props {
  selectedMovements: MovementPreference[];
  onChange: (movements: MovementPreference[]) => void;
  onBack: () => void;
  onNext: () => void;
}

interface MovementOption {
  id: MovementPreference;
  badge: string;
  title: string;
  tagline: string;
  mechanism: string;
  description: string;
}

const MOVEMENT_OPTIONS: MovementOption[] = [
  {
    id: 'Automatic',
    badge: 'MECHANICAL SWEEP',
    title: 'Self-Winding Automatic Caliber',
    tagline: 'Kinetic Energy & Continuous Smooth Sweep',
    mechanism: 'Powered entirely by the kinetic motion of your wrist rotor. No battery required.',
    description: 'The heartbeat of classical watchmaking. Features 21,600+ vibrations per hour (vph) for an uninterrupted sweeping second hand.'
  },
  {
    id: 'Mechanical Skeleton',
    badge: 'EXPOSED ARCHITECTURE',
    title: 'Open-Heart & Skeleton Complication',
    tagline: 'Visible Balance Wheel & Escapement Bridge',
    mechanism: 'Exhibition dial exposing intricate gearing, bridges, and jeweled bearings.',
    description: 'A miniature kinetic sculpture. Admire the rhythmic oscillation of the hairspring and balance wheel through sapphire crystal.'
  },
  {
    id: 'Chronograph',
    badge: 'HOROLOGICAL COMPLICATION',
    title: 'Precision Multi-Dial Chronograph',
    tagline: 'Independent Stop-Seconds & Tachymeter Bezel',
    mechanism: 'Twin pushers governing separate 60-second, 30-minute, and 24-hour totalizers.',
    description: 'Engineered for split-second timing. Pairs navigational functionality with multi-layered dial depth and athletic refinement.'
  },
  {
    id: 'Quartz',
    badge: 'PRECISION FREQUENCY',
    title: 'High-Torque Quartz Movement',
    tagline: '32,768 Hz Absolute Timing Fidelity',
    mechanism: 'Battery-powered synthetic quartz crystal oscillator with zero winding required.',
    description: 'Ultra-thin case profiles, zero maintenance winding, and pin-point accuracy within seconds per month.'
  }
];

export default function ConciergeStep3Movement({
  selectedMovements,
  onChange,
  onBack,
  onNext
}: Step3Props) {
  const toggleMovement = (id: MovementPreference) => {
    if (selectedMovements.includes(id)) {
      if (selectedMovements.length > 1) {
        onChange(selectedMovements.filter(m => m !== id));
      }
    } else {
      onChange([...selectedMovements, id]);
    }
  };

  return (
    <div className="concierge-step-container">
      <div className="concierge-step-lead">
        <span className="concierge-step-badge">STEP 3 OF 5</span>
        <h2 className="concierge-step-title">What caliber soul should beat within?</h2>
        <p className="concierge-step-desc">
          The movement defines the mechanical soul of a timepiece. Choose the horological engineering that resonates with you.
        </p>
      </div>

      <div className="concierge-tiles-grid">
        {MOVEMENT_OPTIONS.map((opt) => {
          const isSelected = selectedMovements.includes(opt.id);
          return (
            <button
              key={opt.id}
              type="button"
              className={`concierge-tile-card ${isSelected ? 'selected' : ''}`}
              onClick={() => toggleMovement(opt.id)}
            >
              <div className="concierge-tile-header">
                <span className="concierge-tech-badge">{opt.badge}</span>
                <span className={`concierge-check-circle ${isSelected ? 'checked' : ''}`}>
                  {isSelected ? '✓' : ''}
                </span>
              </div>
              <h3 className="concierge-tile-title">{opt.title}</h3>
              <span className="concierge-tile-tagline">{opt.tagline}</span>
              <p className="concierge-tile-desc">{opt.description}</p>
              <div className="concierge-mech-note">
                ⚙️ {opt.mechanism}
              </div>
            </button>
          );
        })}
      </div>

      <div className="concierge-actions-bar">
        <button type="button" className="btn btn-outline" onClick={onBack}>
          &larr; Back to Ergonomics
        </button>
        <button
          type="button"
          className="btn btn-primary btn-lg"
          onClick={onNext}
          disabled={selectedMovements.length === 0}
        >
          Set Investment & Metallurgy &rarr;
        </button>
      </div>
    </div>
  );
}
