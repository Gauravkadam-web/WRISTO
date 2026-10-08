'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { Scale, ArrowRight, Sparkles, Maximize2, RotateCcw } from 'lucide-react';
import { useComparison } from '@/context/ComparisonContext';
import { useCart } from '@/context/CartContext';
import { Product } from '@/types/product';
import { comparisonService } from '@/services/comparisonService';

export default function ComparisonClient() {
  const { comparison, removeFromComparison, clearComparison, maxItems } = useComparison();
  const { addToCart, openCartDrawer } = useCart();

  const [show3DStage, setShow3DStage] = useState(true);
  const [proportionalScale, setProportionalScale] = useState(false);
  const [tiltOffset, setTiltOffset] = useState({ x: 0, y: 0 });
  const stageRef = useRef<HTMLDivElement>(null);

  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

  React.useEffect(() => {
    async function loadWatches() {
      if (comparison.length === 0) {
        setSelectedProducts([]);
        return;
      }
      try {
        const resolved = await comparisonService.resolveWatches(comparison);
        setSelectedProducts(resolved || []);
      } catch {
        setSelectedProducts([]);
      }
    }
    loadWatches();
  }, [comparison]);

  const handleAddToCart = (productId: string) => {
    addToCart(productId, 1);
  };

  const handleBuyNow = (productId: string) => {
    addToCart(productId, 1);
    openCartDrawer();
  };

  // 3D Perspective Tilt on Mouse Movement over Showcase
  const handleStageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 16;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -16;
    setTiltOffset({ x, y });
  };

  const handleStageMouseLeave = () => {
    setTiltOffset({ x: 0, y: 0 });
  };

  // Helper to extract numeric case size (e.g. "41mm" -> 41)
  const getCaseDiameterMm = (caseSizeStr?: string): number => {
    if (!caseSizeStr) return 40;
    const match = caseSizeStr.match(/\d+(\.\d+)?/);
    return match ? parseFloat(match[0]) : 40;
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
              SPEC COMPARISON &bull; <span className="tabular-nums">{selectedProducts.length}</span> OF <span className="tabular-nums">{maxItems}</span> SELECTED
            </div>
            <h1 className="section-title" style={{ margin: '6px 0 10px 0' }}>
              Side-by-Side Horology Matrix
            </h1>
            <p className="section-subtitle" style={{ maxWidth: '640px', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
              Compare case diameters, mechanical calibers, and water resistance specifications to evaluate your next signature timepiece.
            </p>
          </div>

          {selectedProducts.length > 0 && (
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                className={`btn btn-sm ${show3DStage ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setShow3DStage(!show3DStage)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <Sparkles size={13} strokeWidth={2} />
                <span>{show3DStage ? '3D Showcase Active' : 'Show 3D Stage'}</span>
              </button>

              {show3DStage && (
                <button
                  type="button"
                  className={`btn btn-sm ${proportionalScale ? 'btn-champagne' : 'btn-outline'}`}
                  onClick={() => setProportionalScale(!proportionalScale)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  title="Scale watch representations proportionally by case diameter"
                >
                  <Maximize2 size={13} strokeWidth={2} />
                  <span>{proportionalScale ? 'Scaled (mm): Active' : 'Scale by mm'}</span>
                </button>
              )}

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
          <>
            {/* 3D Dual-Perspective Floating Showcase Stage */}
            {show3DStage && (
              <div
                className="comparison-3d-stage"
                ref={stageRef}
                onMouseMove={handleStageMouseMove}
                onMouseLeave={handleStageMouseLeave}
              >
                <div className="comparison-3d-stage-header">
                  <span className="comparison-stage-badge">
                    <Sparkles size={12} strokeWidth={2} />
                    <span>3D DUAL-PERSPECTIVE HOROLOGY STAGE</span>
                  </span>
                  <span className="comparison-stage-hint">
                    {proportionalScale ? 'True physical millimeter proportion active' : 'Interactive gyro-tilt stage &bull; Hover to inspect'}
                  </span>
                </div>

                <div className="comparison-3d-grid" style={{ gridTemplateColumns: `repeat(${selectedProducts.length}, 1fr)` }}>
                  {selectedProducts.map((watch) => {
                    if (!watch) return null;
                    const diameterMm = getCaseDiameterMm(watch.caseSize);
                    // 40mm is normal scale 1.0; 44mm is 1.10; 38mm is 0.95
                    const relativeScale = proportionalScale ? diameterMm / 40 : 1;

                    return (
                      <div
                        key={`3d-${watch.id}`}
                        className="comparison-3d-card"
                        style={{
                          transform: `perspective(900px) rotateX(${tiltOffset.y}deg) rotateY(${tiltOffset.x}deg)`,
                        }}
                      >
                        <div className="comparison-3d-pedestal">
                          <div className="pedestal-glow" />
                          <div className="pedestal-disc" />
                        </div>

                        <div
                          className="comparison-3d-watch-wrap"
                          style={{
                            transform: `scale(${relativeScale})`,
                            transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                          }}
                        >
                          <img
                            src={watch.image}
                            alt={`${watch.brand} ${watch.model}`}
                            className="comparison-3d-watch-img"
                          />
                        </div>

                        <div className="comparison-3d-info">
                          <span className="comparison-3d-brand">{watch.brand}</span>
                          <h4 className="comparison-3d-model">{watch.model}</h4>
                          <div className="comparison-3d-specs">
                            <span className="spec-pill tabular-nums">{watch.caseSize}</span>
                            <span className="spec-pill">{watch.movement}</span>
                          </div>
                          <div className="comparison-3d-price tabular-nums">
                            ₹{(watch.price ?? 0).toLocaleString('en-IN')}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Matrix Table Wrap */}
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
                          <div className="comparison-price tabular-nums">
                            ₹{(watch.price ?? 0).toLocaleString('en-IN')}
                            {Boolean(watch.originalPrice && watch.price && watch.originalPrice > watch.price) && (
                              <span className="tabular-nums" style={{ fontSize: '13px', color: '#999', textDecoration: 'line-through', marginLeft: '6px', fontWeight: 400 }}>
                                ₹{(watch.originalPrice ?? 0).toLocaleString('en-IN')}
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
                      <td key={`case-${w?.id}`} className="tabular-nums">{w?.caseSize}</td>
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
                        <span className="pill-badge black tabular-nums" style={{ fontSize: '11px', padding: '3px 8px' }}>
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
          </>
        )}
      </div>
    </main>
  );
}
