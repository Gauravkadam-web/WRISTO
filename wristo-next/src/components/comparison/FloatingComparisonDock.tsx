'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useComparison } from '@/context/ComparisonContext';
import { PRODUCTS } from '@/data/products';
import { Sparkles } from 'lucide-react';

export default function FloatingComparisonDock() {
  const pathname = usePathname();
  const {
    comparison,
    comparisonCount,
    maxItems,
    removeFromComparison,
    clearComparison,
    toastMessage,
    dismissToast,
    isDockOpen,
    setIsDockOpen,
  } = useComparison();

  // Hide dock if on /checkout or on /compare itself (since the user is already on the comparison page)
  if (pathname?.startsWith('/checkout') || pathname === '/compare') {
    return (
      <>
        {/* Still render toasts if triggered */}
        {toastMessage && (
          <div className="toast-container" role="status" aria-live="polite">
            <div className="toast">
              <span style={{ display: 'inline-flex', alignItems: 'center', color: 'var(--color-gold, #DEC095)' }}><Sparkles size={14} strokeWidth={1.5} /></span>
              <span>{toastMessage}</span>
              <button
                type="button"
                onClick={dismissToast}
                style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', marginLeft: '8px' }}
                aria-label="Dismiss toast"
              >
                &times;
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Find products currently in comparison
  const selectedProducts = comparison
    .map(id => PRODUCTS.find(p => p.id.toLowerCase() === id.toLowerCase()))
    .filter(Boolean);

  return (
    <>
      {/* Toast Notification Container */}
      {toastMessage && (
        <div className="toast-container" role="status" aria-live="polite">
          <div className="toast">
            <span style={{ display: 'inline-flex', alignItems: 'center', color: 'var(--color-gold, #DEC095)' }}><Sparkles size={14} strokeWidth={1.5} /></span>
            <span>{toastMessage}</span>
            <button
              type="button"
              onClick={dismissToast}
              style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', marginLeft: '8px', fontSize: '16px' }}
              aria-label="Dismiss toast"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {/* Floating Dock for Desktop */}
      {comparisonCount > 0 && (
        <aside
          className={`comparison-floating-dock ${isDockOpen ? 'open' : 'minimized'}`}
          aria-label="Side-by-side Watch Comparison Tray"
        >
          {/* Minimized Pill Toggle */}
          {!isDockOpen ? (
            <button
              type="button"
              className="comparison-dock-minimized-btn"
              onClick={() => setIsDockOpen(true)}
              aria-label={`Open Comparison Tray (${comparisonCount} watches)`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="16 3 21 3 21 8" />
                <line x1="4" y1="20" x2="21" y2="3" />
                <polyline points="21 16 21 21 16 21" />
                <line x1="15" y1="15" x2="21" y2="21" />
                <line x1="4" y1="4" x2="9" y2="9" />
              </svg>
              <span>Compare ({comparisonCount}/{maxItems})</span>
              <span className="dock-chevron-up">&uarr;</span>
            </button>
          ) : (
            <div className="comparison-dock-content">
              {/* Left Meta Information */}
              <div className="dock-meta-col">
                <div className="dock-eyebrow">
                  <span className="dock-eyebrow-dot" />
                  <span>HOROLOGY MATRIX</span>
                </div>
                <div className="dock-title">
                  Compare Specs <span className="dock-count-badge">({comparisonCount}/{maxItems})</span>
                </div>
                <div className="dock-subtitle">
                  Calibers, diameters &amp; water resistance
                </div>
              </div>

              {/* Center Slots (4 Slots) */}
              <div className="dock-slots-row">
                {Array.from({ length: maxItems }).map((_, index) => {
                  const product = selectedProducts[index];
                  if (product) {
                    return (
                      <div key={product.id} className="dock-slot filled">
                        <img
                          src={product.image}
                          alt={product.model}
                          className="dock-slot-img"
                        />
                        <div className="dock-slot-info">
                          <span className="dock-slot-brand">{product.brand}</span>
                          <span className="dock-slot-model" title={product.model}>
                            {product.model}
                          </span>
                          <span className="dock-slot-price">₹{product.price.toLocaleString('en-IN')}</span>
                        </div>
                        <button
                          type="button"
                          className="dock-slot-remove-btn"
                          onClick={() => removeFromComparison(product.id)}
                          title={`Remove ${product.model} from comparison`}
                          aria-label={`Remove ${product.model}`}
                        >
                          &times;
                        </button>
                      </div>
                    );
                  }

                  return (
                    <div key={`empty-${index}`} className="dock-slot empty">
                      <div className="dock-slot-empty-icon">+</div>
                      <span className="dock-slot-empty-label">Select Watch</span>
                    </div>
                  );
                })}
              </div>

              {/* Right Action Buttons */}
              <div className="dock-actions-col">
                <Link
                  href="/compare"
                  className="btn btn-champagne btn-sm dock-compare-btn"
                >
                  <span>Compare Now</span>
                  <span className="btn-arrow">&rarr;</span>
                </Link>

                <div className="dock-secondary-links">
                  <button
                    type="button"
                    className="dock-clear-btn"
                    onClick={clearComparison}
                  >
                    Clear All
                  </button>
                  <span className="dock-divider">|</span>
                  <button
                    type="button"
                    className="dock-minimize-btn"
                    onClick={() => setIsDockOpen(false)}
                    title="Minimize Tray"
                  >
                    Minimize &darr;
                  </button>
                </div>
              </div>
            </div>
          )}
        </aside>
      )}
    </>
  );
}
