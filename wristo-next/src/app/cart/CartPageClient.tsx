'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Lock, Clock } from 'lucide-react';
import { useCart, CartProductItem } from '@/context/CartContext';

export default function CartPageClient() {
  const {
    cartProducts,
    cartCount,
    updateQuantity,
    removeFromCart,
    clearCart,
    totals,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');

  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = await applyCoupon(promoInput.trim());
    if (!res.success) {
      setPromoError(res.message || 'Invalid coupon code. Try WRISTO10 or HOROLOGY20.');
    } else {
      setPromoError('');
      setPromoInput('');
    }
  };

  return (
    <div className="container cart-page-container">
      {/* Breadcrumbs */}
      <nav className="breadcrumb-nav" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">Shopping Cart</span>
      </nav>

      {/* Page Header (Panel 9 Parity) */}
      <div className="cart-page-header">
        <div>
          <div className="section-label">SHOPPING BAG</div>
          <h1 className="cart-page-title">
            Your Cart{' '}
            <span className="cart-count-badge">
              ({cartCount} {cartCount === 1 ? 'Item' : 'Items'})
            </span>
          </h1>
        </div>

        <Link href="/watches" className="cart-continue-link">
          Continue Shopping &rarr;
        </Link>
      </div>

      {cartProducts.length === 0 ? (
        /* Empty State */
        <div className="cart-empty-card">
          <div className="cart-empty-icon" aria-hidden="true">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </div>
          <h2 className="cart-empty-title">Your Cart is Empty</h2>
          <p className="cart-empty-subtitle">
            Discover luxury automatic calibers, elegant dress watches, and precision chronographs from our curated houses.
          </p>
          <Link href="/watches" className="btn btn-champagne">
            Explore Collection &rarr;
          </Link>
        </div>
      ) : (
        /* 2-Column Desktop Grid Layout (Panel 9 Parity) */
        <div className="cart-layout-grid">
          {/* Left Column: Item List */}
          <div className="cart-items-column">
            <div className="cart-items-card">
              <div className="cart-items-list">
                {cartProducts.map((item: CartProductItem) => {
                  const lineTotal = item.product.price * item.quantity;

                  return (
                    <div key={item.product.id} className="cart-item-row">
                      {/* Thumbnail */}
                      <Link href={`/product/${item.product.id}`} className="cart-item-thumb-wrap">
                        <Image
                          src={item.product.image}
                          alt={item.product.model}
                          width={88}
                          height={88}
                          className="cart-item-thumb-img"
                        />
                      </Link>

                      {/* Details */}
                      <div className="cart-item-details">
                        <div className="cart-item-brand">{item.product.brand}</div>
                        <Link href={`/product/${item.product.id}`} className="cart-item-title">
                          {item.product.model}
                        </Link>
                        <div className="cart-item-specs">
                          <span>Case: {item.product.caseSize}</span>
                          <span className="cart-spec-divider">&bull;</span>
                          <span>Strap: {item.product.strap}</span>
                          <span className="cart-spec-divider">&bull;</span>
                          <span>Movement: {item.product.movement}</span>
                        </div>
                        <div className="cart-item-unit-price tabular-nums">
                          ₹{item.product.price.toLocaleString('en-IN')} each
                        </div>
                      </div>

                      {/* Quantity Stepper */}
                      <div className="cart-item-stepper-wrap">
                        <div className="cart-stepper">
                          <button
                            type="button"
                            className="cart-stepper-btn"
                            onClick={() => updateQuantity(item.product.id, -1)}
                            disabled={item.quantity <= 1}
                            aria-label="Decrease quantity"
                          >
                            &minus;
                          </button>
                          <span className="cart-stepper-qty tabular-nums">{item.quantity}</span>
                          <button
                            type="button"
                            className="cart-stepper-btn"
                            onClick={() => updateQuantity(item.product.id, 1)}
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Line Total & Remove */}
                      <div className="cart-item-total-cell">
                        <span className="cart-item-line-total tabular-nums">
                          ₹{lineTotal.toLocaleString('en-IN')}
                        </span>
                        <button
                          type="button"
                          className="cart-item-remove-btn"
                          onClick={() => removeFromCart(item.product.id)}
                          title="Remove item"
                          aria-label={`Remove ${item.product.model} from cart`}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                            <path d="M3 6h18" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Cart Footer Actions */}
              <div className="cart-table-footer">
                <button
                  type="button"
                  className="cart-clear-all-link"
                  onClick={clearCart}
                >
                  Clear Shopping Bag
                </button>
                <Link href="/watches" className="cart-back-shopping-link">
                  &larr; Add More Timepieces
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Summary Box (Panel 9 Parity) */}
          <div className="cart-summary-column">
            <div className="cart-summary-sticky-card">
              <h2 className="cart-summary-heading">Order Summary</h2>

              {/* Line Items */}
              <div className="cart-summary-rows">
                <div className="cart-summary-row">
                  <span className="cart-summary-label">Subtotal</span>
                  <span className="cart-summary-val tabular-nums">₹{totals.subtotal.toLocaleString('en-IN')}</span>
                </div>

                {totals.discount > 0 && (
                  <div className="cart-summary-row discount-row">
                    <span className="cart-summary-label">
                      Promo Discount {appliedCoupon && `(${appliedCoupon.code})`}
                    </span>
                    <span className="cart-summary-val tabular-nums">&minus;₹{totals.discount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="cart-summary-row">
                  <span className="cart-summary-label">Shipping</span>
                  <span className="cart-summary-val free-tag tabular-nums">
                    {totals.shippingFee === 0 ? 'Free (Insured Courier)' : `₹${totals.shippingFee.toLocaleString('en-IN')}`}
                  </span>
                </div>

                <div className="cart-summary-row">
                  <span className="cart-summary-label">Estimated Tax</span>
                  <span className="cart-summary-val">Included (GST 18%)</span>
                </div>

                <div className="cart-summary-divider" />

                <div className="cart-summary-row total-row">
                  <span className="cart-total-label">Total Amount</span>
                  <span className="cart-total-val tabular-nums">₹{totals.total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className="cart-promo-form">
                {appliedCoupon ? (
                  <div className="applied-coupon-pill">
                    <span>
                      Code &apos;{appliedCoupon.code}&apos; applied (₹{totals.discount.toLocaleString('en-IN')} OFF)
                    </span>
                    <button type="button" onClick={removeCoupon} className="remove-coupon-btn">&times;</button>
                  </div>
                ) : (
                  <>
                    <div className="promo-input-group">
                      <input
                        type="text"
                        placeholder="Enter Promo Code (e.g. WRISTO10)"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                        className="promo-input"
                      />
                      <button type="submit" className="promo-apply-btn">Apply</button>
                    </div>
                    {promoError && <p className="promo-error-msg">{promoError}</p>}
                  </>
                )}
              </form>

              {/* Primary Checkout CTA */}
              <Link href="/checkout" className="btn btn-cart-checkout">
                Proceed to Checkout &rarr;
              </Link>

              {/* Trust Guarantees */}
              <div className="cart-trust-badges">
                <div className="cart-trust-item">
                  <span className="cart-trust-icon" style={{ display: 'inline-flex', alignItems: 'center' }}>
                    <ShieldCheck size={14} strokeWidth={1.5} />
                  </span>
                  <span>100% Authentic Guaranteed</span>
                </div>
                <div className="cart-trust-item">
                  <span className="cart-trust-icon" style={{ display: 'inline-flex', alignItems: 'center' }}>
                    <Lock size={14} strokeWidth={1.5} />
                  </span>
                  <span>Bank-Grade 256-Bit SSL Checkout</span>
                </div>
                <div className="cart-trust-item">
                  <span className="cart-trust-icon" style={{ display: 'inline-flex', alignItems: 'center' }}>
                    <Clock size={14} strokeWidth={1.5} />
                  </span>
                  <span>7-Day Inspection &amp; Returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
