'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Gift, Sparkles, Tag } from 'lucide-react';

export default function CartDrawer() {
  const {
    cartCount,
    cartProducts,
    totals,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    isGiftWrapped,
    setIsGiftWrapped,
    giftMessage,
    setGiftMessage,
    isCartDrawerOpen,
    closeCartDrawer,
    removeFromCart,
    updateQuantity
  } = useCart();

  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [promoFeedback, setPromoFeedback] = useState<{ error?: string; success?: string } | null>(null);

  // Keyboard accessibility: Close drawer on Escape key
  React.useEffect(() => {
    if (!isCartDrawerOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeCartDrawer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartDrawerOpen, closeCartDrawer]);

  if (!isCartDrawerOpen) return null;

  const thresholdPercent = Math.min(
    100,
    Math.round((totals.subtotal / totals.giftPouchThreshold) * 100)
  );

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCodeInput.trim()) return;

    const result = applyCoupon(promoCodeInput);
    if (result.success) {
      setPromoFeedback({ success: result.message });
      setPromoCodeInput('');
    } else {
      setPromoFeedback({ error: result.message });
    }
  };

  const handleRemovePromo = () => {
    removeCoupon();
    setPromoFeedback(null);
  };

  return (
    <div
      className="cart-drawer-overlay open"
      onClick={closeCartDrawer}
      role="presentation"
    >
      <div
        className="cart-drawer"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping Bag"
      >
        {/* Drawer Header */}
        <div className="drawer-header">
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <h3 className="drawer-title">Shopping Bag</h3>
            <span
              style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}
              aria-live="polite"
            >
              ({cartCount} {cartCount === 1 ? 'item' : 'items'})
            </span>
          </div>
          <button
            type="button"
            className="cart-close-btn"
            onClick={closeCartDrawer}
            aria-label="Close Shopping Bag"
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: 'var(--color-text-secondary)',
              lineHeight: 1
            }}
          >
            &times;
          </button>
        </div>

        {/* Complimentary Reward / Shipping Threshold */}
        {cartProducts.length > 0 && (
          <div className="cart-threshold-wrap">
            <div className="cart-threshold-header">
              <span className="cart-threshold-title" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Gift size={16} strokeWidth={1.5} style={{ color: 'var(--color-accent-gold)' }} />
                <span>Horological Reward</span>
              </span>
              <span className={`cart-threshold-badge ${totals.giftPouchUnlocked ? 'unlocked' : ''}`}>
                {totals.giftPouchUnlocked ? 'Unlocked' : `${thresholdPercent}% Reached`}
              </span>
            </div>
            <div className="cart-threshold-bar">
              <div
                className="cart-threshold-fill"
                style={{ width: `${thresholdPercent}%` }}
              />
            </div>
            <p className="cart-threshold-desc">
              {totals.giftPouchUnlocked ? (
                <span style={{ color: 'var(--color-success)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={15} strokeWidth={1.5} /> You have unlocked a Complimentary Handcrafted Leather Travel Case!
                </span>
              ) : (
                <>
                  Add <strong>₹{totals.amountNeededForGiftPouch.toLocaleString('en-IN')}</strong> more for a{' '}
                  <strong>Complimentary Leather Travel Case</strong> (₹15,000+).
                </>
              )}
            </p>
          </div>
        )}

        {/* Drawer Body (Items) */}
        <div className="drawer-body">
          {cartProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 16px', color: 'var(--color-text-secondary)' }}>
              <div style={{ fontSize: '36px', marginBottom: '16px' }}>⌚</div>
              <p style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px', color: 'var(--color-text-primary)' }}>
                Your shopping bag is empty
              </p>
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '24px', lineHeight: 1.5 }}>
                Discover hand-finished horological timepieces calibrated for your lifestyle.
              </p>
              <Link
                href="/watches"
                className="btn btn-primary btn-sm"
                onClick={closeCartDrawer}
              >
                Explore Curated Watches &rarr;
              </Link>
            </div>
          ) : (
            cartProducts.map(({ productId, quantity, model, brand, price, image }) => (
              <div key={productId} className="cart-item-row">
                <div className="cart-item-thumb" style={{ position: 'relative' }}>
                  <Image
                    src={image}
                    alt={model}
                    fill
                    sizes="72px"
                    style={{ objectFit: 'contain', padding: '4px' }}
                  />
                </div>
                <div className="cart-item-info">
                  <div className="cart-item-brand">{brand}</div>
                  <div className="cart-item-title">{model}</div>
                  <div className="cart-item-price">
                    ₹{price.toLocaleString('en-IN')}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                  <button
                    type="button"
                    onClick={() => removeFromCart(productId)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--color-text-muted)',
                      fontSize: '18px',
                      cursor: 'pointer',
                      lineHeight: 1,
                      padding: '2px'
                    }}
                    title="Remove timepiece"
                    aria-label={`Remove ${model} from cart`}
                  >
                    &times;
                  </button>
                  <div className="quantity-stepper" style={{ height: '28px', marginTop: '8px' }}>
                    <button
                      type="button"
                      className="stepper-btn"
                      style={{ width: '24px' }}
                      onClick={() => updateQuantity(productId, -1)}
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <div className="stepper-val" style={{ width: '24px', fontSize: '12px' }}>
                      {quantity}
                    </div>
                    <button
                      type="button"
                      className="stepper-btn"
                      style={{ width: '24px' }}
                      onClick={() => updateQuantity(productId, 1)}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Promo Code & Gift Section (When Cart has items) */}
        {cartProducts.length > 0 && (
          <>
            {/* Promo Code Input / Applied Badge */}
            <div className="cart-promo-container">
              {appliedCoupon ? (
                <div className="cart-coupon-pill">
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <Tag size={14} strokeWidth={1.5} style={{ color: 'var(--color-accent-gold)' }} />
                    <strong>{appliedCoupon.code}</strong> (Saving ₹{appliedCoupon.calculatedDiscount.toLocaleString('en-IN')})
                  </span>
                  <button
                    type="button"
                    onClick={handleRemovePromo}
                    title="Remove coupon"
                    aria-label="Remove coupon"
                  >
                    &times;
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="cart-promo-form">
                  <input
                    type="text"
                    value={promoCodeInput}
                    onChange={e => setPromoCodeInput(e.target.value)}
                    placeholder="Enter code (e.g. WRISTO10)"
                    className="cart-promo-input"
                  />
                  <button type="submit" className="cart-promo-btn">
                    Apply
                  </button>
                </form>
              )}
              {promoFeedback?.error && (
                <p style={{ color: '#D32F2F', fontSize: '11px', marginTop: '6px' }}>
                  {promoFeedback.error}
                </p>
              )}
              {promoFeedback?.success && (
                <p style={{ color: 'var(--color-success)', fontSize: '11px', marginTop: '6px' }}>
                  {promoFeedback.success}
                </p>
              )}
            </div>

            {/* Bespoke Gift Wrap Toggle */}
            <div className="cart-gift-container">
              <label className="cart-gift-label" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  checked={isGiftWrapped}
                  onChange={e => setIsGiftWrapped(e.target.checked)}
                />
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Gift size={15} strokeWidth={1.5} style={{ color: 'var(--color-accent-gold)' }} />
                  Bespoke Gift Box &amp; Handwritten Calligraphy Note (Free)
                </span>
              </label>
              {isGiftWrapped && (
                <div className="cart-gift-message-box">
                  <textarea
                    rows={2}
                    placeholder="Enter personalized note to accompany this timepiece..."
                    value={giftMessage}
                    onChange={e => setGiftMessage(e.target.value)}
                    className="cart-gift-textarea"
                  />
                </div>
              )}
            </div>
          </>
        )}

        {/* Drawer Footer (Summary & CTA) */}
        {cartProducts.length > 0 && (
          <div className="drawer-footer">
            <div className="cart-totals-row">
              <span style={{ color: 'var(--color-text-secondary)' }}>Subtotal</span>
              <span style={{ fontWeight: 600 }}>₹{totals.subtotal.toLocaleString('en-IN')}</span>
            </div>

            {totals.discount > 0 && (
              <div className="cart-totals-row" style={{ color: 'var(--color-gold-hover)' }}>
                <span>Collector Discount ({appliedCoupon?.code})</span>
                <span style={{ fontWeight: 600 }}>−₹{totals.discount.toLocaleString('en-IN')}</span>
              </div>
            )}

            <div className="cart-totals-row" style={{ fontSize: '13px' }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>Insured Air Delivery</span>
              <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>Complimentary</span>
            </div>

            {totals.giftPouchUnlocked && (
              <div className="cart-totals-row" style={{ fontSize: '13px', color: 'var(--color-gold-hover)' }}>
                <span>Leather Travel Case</span>
                <span style={{ fontWeight: 600 }}>Complimentary Gift</span>
              </div>
            )}

            <div className="cart-totals-row total-bold">
              <span>Estimated Total</span>
              <span style={{ color: 'var(--color-text-primary)' }}>
                ₹{totals.total.toLocaleString('en-IN')}
              </span>
            </div>

            <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '14px' }}>
              Inclusive of all luxury duties, insurance & GST.
            </p>

            <Link
              href="/checkout"
              className="btn btn-primary btn-block btn-lg"
              onClick={closeCartDrawer}
              style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
            >
              Proceed to Secure Checkout &rarr;
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
