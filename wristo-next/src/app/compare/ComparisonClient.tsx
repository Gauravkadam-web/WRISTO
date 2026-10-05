'use client';

import React from 'react';
import Link from 'next/link';
import { Scale, ArrowRight } from 'lucide-react';
import { useComparison } from '@/context/ComparisonContext';
import { useCart } from '@/context/CartContext';
import { PRODUCTS } from '@/data/products';

export default function ComparisonClient() {
  const { comparison, removeFromComparison, clearComparison, maxItems } = useComparison();
  const { addToCart, openCartDrawer } = useCart();

  const selectedProducts = comparison
    .map(id => PRODUCTS.find(p => p.id.toLowerCase() === id.toLowerCase()))
    .filter(Boolean);

  const handleAddToCart = (productId: string) => {
    addToCart(productId, 1);
  };

  const handleBuyNow = (productId: string) => {
    addToCart(productId, 1);
    openCartDrawer();
  };

  return (
    <main className="comparison-view-page" style={{ paddingTop: 'var(--space-8)', paddingBottom: 'var(--space-20)' }}>
      <div className="container">
        {/* Section Header matching Prototype */}
        <div
          className="section-header"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: 'var(--space-8)',
            flexWrap: 'wrap',
            gap: '16px'
          }}
        >
          <div>
            <div className="section-label" style={{ color: 'var(--color-gold, #DEC095)' }}>
              SPEC COMPARISON &bull; {selectedProducts.length} OF {maxItems} SELECTED
            </div>
            <h1 className="section-title" style={{ margin: '6px 0 10px 0' }}>
              Side-by-Side Horology Matrix
            </h1>
            <p className="section-subtitle" style={{ maxWidth: '640px', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
              Compare case diameters, mechanical calibers, and water resistance specifications to evaluate your next signature timepiece.
            </p>
          </div>

          {selectedProducts.length > 0 && (
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              {selectedProducts.length < maxItems && (
                <Link href="/watches" className="btn btn-outline btn-sm">
                  + Add More Watches
                </Link>
              )}
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={clearComparison}
                style={{ borderColor: 'var(--color-border-medium)' }}
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* Empty State */}
        {selectedProducts.length === 0 ? (
          <div
            style={{
              background: 'var(--color-brand-paper, #FFFDF9)',
              border: '1px solid var(--color-border-light, #E8E3DC)',
              borderRadius: 'var(--radius-xl, 24px)',
              padding: '64px 24px',
              textAlign: 'center',
              maxWidth: '600px',
              margin: '40px auto',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: '#F6F1E9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px auto',
                color: 'var(--brand-bronze, #B08D6B)'
              }}
            >
              <Scale size={28} strokeWidth={1.5} />
            </div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: 600, marginBottom: '10px' }}>
              No Watches Selected for Comparison
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '28px', lineHeight: 1.6 }}>
              You can compare up to 4 watches side-by-side to evaluate calibers, diameters, materials, and pricing.
            </p>
            <Link href="/watches" className="btn btn-primary btn-lg" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <span>Select Timepieces</span>
              <ArrowRight size={15} strokeWidth={1.5} />
            </Link>
          </div>
        ) : (
          /* Matrix Table Wrap */
          <div className="comparison-table-wrap">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th style={{ width: '200px', verticalAlign: 'middle' }}>
                    <div style={{ padding: '8px 0' }}>
                      <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--brand-bronze, #B08D6B)' }}>
                        Timepiece Specs
                      </span>
                      <div style={{ fontSize: '16px', color: 'var(--color-text-primary)', marginTop: '4px', textTransform: 'none', fontFamily: 'var(--font-heading)' }}>
                        Feature Matrix
                      </div>
                    </div>
                  </th>
                  {selectedProducts.map((watch) => {
                    if (!watch) return null;
                    return (
                      <td key={watch.id} className="comparison-header-cell">
                        <Link href={`/product/${watch.id}`} tabIndex={-1} aria-hidden="true">
                          <img
                            src={watch.image}
                            alt={`${watch.brand} ${watch.model}`}
                            className="comparison-watch-img"
                          />
                        </Link>
                        <div className="comparison-brand">{watch.brand}</div>
                        <h3 className="comparison-model">
                          <Link href={`/product/${watch.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                            {watch.model}
                          </Link>
                        </h3>
                        <div className="comparison-price">
                          ₹{watch.price.toLocaleString('en-IN')}
                          {watch.originalPrice > watch.price && (
                            <span style={{ fontSize: '13px', color: '#999', textDecoration: 'line-through', marginLeft: '6px', fontWeight: 400 }}>
                              ₹{watch.originalPrice.toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                        <div className="comparison-actions">
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={() => handleAddToCart(watch.id)}
                          >
                            Add to Cart
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline btn-sm"
                            onClick={() => removeFromComparison(watch.id)}
                            title="Remove from comparison"
                          >
                            Remove
                          </button>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>Brand House</th>
                  {selectedProducts.map((w) => (
                    <td key={`brand-${w?.id}`}>
                      <strong style={{ color: 'var(--brand-bronze, #B08D6B)' }}>{w?.brand}</strong>
                    </td>
                  ))}
                </tr>
                <tr>
                  <th>Caliber Movement</th>
                  {selectedProducts.map((w) => (
                    <td key={`movement-${w?.id}`}>
                      <strong>{w?.movement}</strong>
                    </td>
                  ))}
                </tr>
                <tr>
                  <th>Case Diameter</th>
                  {selectedProducts.map((w) => (
                    <td key={`case-${w?.id}`}>{w?.caseSize}</td>
                  ))}
                </tr>
                <tr>
                  <th>Case Material</th>
                  {selectedProducts.map((w) => (
                    <td key={`mat-${w?.id}`}>{w?.material}</td>
                  ))}
                </tr>
                <tr>
                  <th>Strap Type</th>
                  {selectedProducts.map((w) => (
                    <td key={`strap-${w?.id}`}>{w?.strap}</td>
                  ))}
                </tr>
                <tr>
                  <th>Dial Finish</th>
                  {selectedProducts.map((w) => (
                    <td key={`dial-${w?.id}`}>{w?.dial}</td>
                  ))}
                </tr>
                <tr>
                  <th>Water Resistance</th>
                  {selectedProducts.map((w) => (
                    <td key={`water-${w?.id}`}>
                      <span className="pill-badge black" style={{ fontSize: '11px', padding: '3px 8px' }}>
                        {w?.waterResistance}
                      </span>
                    </td>
                  ))}
                </tr>
                <tr>
                  <th>Style Aesthetic</th>
                  {selectedProducts.map((w) => (
                    <td key={`style-${w?.id}`}>{w?.style}</td>
                  ))}
                </tr>
                <tr>
                  <th>Target Gender</th>
                  {selectedProducts.map((w) => (
                    <td key={`gender-${w?.id}`}>{w?.gender}</td>
                  ))}
                </tr>
                <tr>
                  <th>Recommended For</th>
                  {selectedProducts.map((w) => (
                    <td key={`occ-${w?.id}`}>
                      {w?.occasion?.join(', ') || 'Everyday'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <th>Direct Checkout</th>
                  {selectedProducts.map((w) => (
                    <td key={`buy-${w?.id}`}>
                      <button
                        type="button"
                        className="btn btn-champagne btn-sm"
                        style={{ width: '100%' }}
                        onClick={() => w && handleBuyNow(w.id)}
                      >
                        Buy Now &rarr;
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
