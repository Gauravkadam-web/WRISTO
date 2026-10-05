'use client';

import React from 'react';
import { Product } from '@/types/product';
import { Check } from 'lucide-react';

interface ProductVariantsProps {
  product: Product;
  selectedColor: string;
  onSelectColor: (color: string) => void;
  selectedStrap: string;
  onSelectStrap: (strap: string) => void;
}

export default function ProductVariants({
  product,
  selectedColor,
  onSelectColor,
  selectedStrap,
  onSelectStrap
}: ProductVariantsProps) {
  // Strap variants derived from product strap
  const strapOptions = [
    { id: 'standard', name: `${product.strap} (Fitted)` },
    { id: 'alternate', name: product.strap.includes('Leather') ? 'Milanese Stainless Steel (Optional)' : 'Italian Calfskin (Optional)' }
  ];

  return (
    <div className="pdp-variants-wrap">
      {/* Dial & Color Swatches */}
      {product.colors && product.colors.length > 0 && (
        <div className="pdp-variant-group">
          <div className="pdp-variant-label-row">
            <span className="pdp-variant-label">Dial Palette</span>
            <span className="pdp-variant-val-preview">{product.dial}</span>
          </div>
          <div className="pdp-swatch-list">
            {product.colors.map((color, idx) => (
              <button
                key={color + idx}
                type="button"
                className={`pdp-color-swatch-btn ${selectedColor === color ? 'active' : ''}`}
                style={{ backgroundColor: color }}
                onClick={() => onSelectColor(color)}
                title={`Finish Palette: ${color}`}
                aria-label={`Select color ${color}`}
              >
                {selectedColor === color && (
                  <span className="pdp-swatch-check" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Check size={10} strokeWidth={3} />
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Strap Material Selector */}
      <div className="pdp-variant-group">
        <div className="pdp-variant-label-row">
          <span className="pdp-variant-label">Strap &amp; Clasp Configuration</span>
        </div>
        <div className="pdp-strap-options-list">
          {strapOptions.map((opt) => (
            <button
              key={opt.id}
              type="button"
              className={`pdp-strap-pill-btn ${selectedStrap === opt.id ? 'active' : ''}`}
              onClick={() => onSelectStrap(opt.id)}
            >
              <span>{opt.name}</span>
              {selectedStrap === opt.id && (
                <span className="pdp-strap-active-dot" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Wrist Sizing Advisory Chip */}
      <div className="pdp-size-advisor-chip">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
        <span>
          <strong>Horological Proportion:</strong> {product.caseSize} diameter case &bull; Recommended for wrists 6.2&quot; to 7.8&quot; circumference.
        </span>
      </div>
    </div>
  );
}
