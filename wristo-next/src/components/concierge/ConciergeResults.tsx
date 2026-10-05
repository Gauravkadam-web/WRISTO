'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ConciergeRecommendation } from '@/types/concierge';
import { useCart } from '@/context/CartContext';
import { Star, Crown, Check, Sparkles } from 'lucide-react';

interface ResultsProps {
  recommendations: ConciergeRecommendation[];
  onRefine: () => void;
  onReset: () => void;
}

export default function ConciergeResults({
  recommendations,
  onRefine,
  onReset
}: ResultsProps) {
  const { addToCart } = useCart();
  const [addedIds, setAddedIds] = useState<{ [key: string]: boolean }>({});

  const handleAdd = (rec: ConciergeRecommendation) => {
    addToCart(rec.watch.id);
    setAddedIds((prev) => ({ ...prev, [rec.watch.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [rec.watch.id]: false }));
    }, 2500);
  };

  return (
    <div className="concierge-results-container">
      <div className="concierge-results-header">
        <span className="concierge-results-eyebrow">NEURAL HOROLOGICAL SYNTHESIS</span>
        <h2 className="concierge-results-title">Your 3 Tailored Horological Allocations</h2>
        <p className="concierge-results-desc">
          Evaluated against your selected occasions, wrist anatomy, and mechanical criteria. Each timepiece represents supreme finishing and certified accuracy.
        </p>
      </div>

      <div className="concierge-results-grid">
        {recommendations.map((rec, index) => {
          const watch = rec.watch;
          const isAdded = !!addedIds[watch.id];
          const isTopMatch = index === 0;

          return (
            <div
              key={watch.id}
              className={`concierge-result-card ${isTopMatch ? 'top-match' : ''}`}
            >
              {isTopMatch && (
                <div className="concierge-top-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={13} strokeWidth={1.5} /> HIGHEST HOROLOGICAL COMPATIBILITY
                </div>
              )}

              <div className="concierge-result-top-bar">
                <span className="concierge-score-pill">
                  {rec.compatibilityScore}% Compatibility
                </span>
                <span className="concierge-highlight-tag">
                  {rec.highlightTag}
                </span>
              </div>

              <Link href={`/product/${watch.id}`} className="concierge-result-image-box">
                <Image
                  src={watch.image}
                  alt={`${watch.brand} ${watch.model}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 380px"
                  style={{ objectFit: 'contain', padding: '24px' }}
                />
              </Link>

              <div className="concierge-result-content">
                <div className="concierge-result-brand">{watch.brand}</div>
                <Link href={`/product/${watch.id}`} className="concierge-result-model">
                  {watch.model}
                </Link>

                <div className="concierge-result-price-row">
                  <span className="concierge-result-price">
                    ₹{watch.price.toLocaleString('en-IN')}
                  </span>
                  {watch.originalPrice && watch.originalPrice > watch.price && (
                    <span className="concierge-result-orig-price">
                      ₹{watch.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                  <span className="concierge-result-rating" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Star size={13} fill="currentColor" strokeWidth={0} style={{ color: 'var(--color-accent-gold)' }} /> {watch.rating.toFixed(1)} ({watch.reviewsCount})
                  </span>
                </div>

                <div className="concierge-result-specs-strip">
                  <span>{watch.movement}</span> &bull;{' '}
                  <span>{watch.caseSize}</span> &bull;{' '}
                  <span>{watch.material}</span> &bull;{' '}
                  <span>{watch.waterResistance}</span>
                </div>

                {/* Editorial Reason Narrative */}
                <div className="concierge-result-reason-card">
                  <div className="concierge-reason-label" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <Crown size={14} strokeWidth={1.5} style={{ color: 'var(--brand-bronze)' }} /> Concierge Editorial Reasoning:
                  </div>
                  <p className="concierge-reason-text">{rec.editorialReasoning}</p>
                </div>

                {/* Matched Attributes Pills */}
                {rec.matchedAttributes.length > 0 && (
                  <div className="concierge-matched-pills">
                    {rec.matchedAttributes.map((attr) => (
                      <span key={attr} className="concierge-match-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Check size={11} strokeWidth={2.5} /> {attr}
                      </span>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="concierge-result-actions">
                  <button
                    type="button"
                    className={`btn btn-sm ${isAdded ? 'btn-outline' : 'btn-primary'}`}
                    style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                    onClick={() => handleAdd(rec)}
                  >
                    {isAdded ? (
                      <>
                        <Check size={14} strokeWidth={2} /> Added to Bag
                      </>
                    ) : (
                      'Add to Shopping Bag'
                    )}
                  </button>
                  <Link
                    href={`/product/${watch.id}`}
                    className="btn btn-outline btn-sm"
                  >
                    Inspect PDP &rarr;
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Curation CTA */}
      <div className="concierge-results-footer">
        <div className="concierge-footer-box">
          <div className="concierge-footer-title">Need personalized human assistance?</div>
          <p className="concierge-footer-desc">
            Our certified master horologists and private client liaisons are available for private vault viewings and bespoke strap calibrations.
          </p>
          <div className="concierge-footer-buttons">
            <button
              type="button"
              className="btn btn-outline"
              onClick={onRefine}
            >
              &#x21bb; Refine Horological Criteria
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={onReset}
            >
              Start Fresh Consultation
            </button>
            <Link href="/watches" className="btn btn-primary">
              Explore Full 40-Piece Vault &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
