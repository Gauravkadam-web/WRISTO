'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Tag, ShieldCheck, RotateCcw, Clock } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { CustomerAddress, DeliveryTier, OrderCartItem, OrderTotals } from '@/types/order';
import { DELIVERY_OPTIONS } from '@/services/orderService';

interface OrderSummarySidebarProps {
  deliveryTier: DeliveryTier;
  items?: OrderCartItem[];
  totals?: OrderTotals;
}

export default function OrderSummarySidebar({
  deliveryTier,
  items: propItems,
  totals: propTotals
}: OrderSummarySidebarProps) {
  const {
    cartCount: liveCartCount,
    cartProducts: liveCartProducts,
    totals: liveTotals,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    isGiftWrapped
  } = useCart();

  const cartProducts = propItems ?? liveCartProducts;
  const totals = propTotals ?? liveTotals;
  const cartCount = propItems ? propItems.reduce((acc, i) => acc + i.quantity, 0) : liveCartCount;

  const [promoInput, setPromoInput] = useState('');
  const [promoMsg, setPromoMsg] = useState<{ error?: string; success?: string } | null>(null);

  const selectedDelivery = DELIVERY_OPTIONS.find(d => d.id === deliveryTier);
  const deliveryFee = selectedDelivery ? selectedDelivery.price : 0;
  const finalTotal = Math.max(0, totals.subtotal - totals.discount + deliveryFee);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;

    const res = await applyCoupon(promoInput);
    if (res.success) {
      setPromoMsg({ success: res.message });
      setPromoInput('');
    } else {
      setPromoMsg({ error: res.message });
    }
  };

  return (
    <aside className="checkout-summary-card">
      <div className="checkout-summary-title">
        <span>Acquisition Summary</span>
        <span className="checkout-summary-count">({cartCount} {cartCount === 1 ? 'item' : 'items'})</span>
      </div>

      {/* Mini Items List */}
      <div className="checkout-summary-items">
        {cartProducts.map(({ productId, model, brand, price, quantity, image }) => (
          <div key={productId} className="checkout-mini-item">
            <div className="checkout-mini-thumb">
              <span className="checkout-mini-qty">{quantity}</span>
              <Image
                src={image}
                alt={model}
                fill
                sizes="52px"
                style={{ objectFit: 'contain', padding: '3px' }}
              />
            </div>
            <div className="checkout-mini-info">
              <div className="checkout-mini-brand">{brand}</div>
              <div className="checkout-mini-model">{model}</div>
            </div>
            <div className="checkout-mini-price">
              ₹{(price * quantity).toLocaleString('en-IN')}
            </div>
          </div>
        ))}
      </div>

      {/* Promo Code Input / Applied Badge */}
      <div style={{ marginBottom: '16px' }}>
        {appliedCoupon ? (
          <div className="cart-coupon-pill">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Tag size={13} strokeWidth={1.5} />
              <strong>{appliedCoupon.code}</strong> (−₹{appliedCoupon.calculatedDiscount.toLocaleString('en-IN')})
            </span>
            <button
              type="button"
              onClick={() => {
                removeCoupon();
                setPromoMsg(null);
              }}
              title="Remove coupon"
              aria-label="Remove coupon"
            >
              &times;
            </button>
          </div>
        ) : (
          <form onSubmit={handleApply} className="cart-promo-form">
            <input
              type="text"
              placeholder="Promo Code (e.g. WRISTO10)"
              value={promoInput}
              onChange={e => setPromoInput(e.target.value)}
              className="cart-promo-input"
              style={{ padding: '8px 12px', fontSize: '12px' }}
            />
            <button
              type="submit"
              className="cart-promo-btn"
              style={{ padding: '0 12px', fontSize: '11px' }}
            >
              Apply
            </button>
          </form>
        )}
        {promoMsg?.error && (
          <p style={{ color: '#D32F2F', fontSize: '11px', marginTop: '4px' }}>
            {promoMsg.error}
          </p>
        )}
        {promoMsg?.success && (
          <p style={{ color: 'var(--color-success)', fontSize: '11px', marginTop: '4px' }}>
            {promoMsg.success}
          </p>
        )}
      </div>

      {/* Totals Breakdown */}
      <div className="checkout-summary-totals">
        <div className="checkout-summary-row">
          <span>Subtotal</span>
          <span style={{ fontWeight: 600 }}>₹{totals.subtotal.toLocaleString('en-IN')}</span>
        </div>

        {totals.discount > 0 && (
          <div className="checkout-summary-row discount">
            <span>Privilege Discount ({appliedCoupon?.code})</span>
            <span>−₹{totals.discount.toLocaleString('en-IN')}</span>
          </div>
        )}

        <div className="checkout-summary-row">
          <span>Delivery Protocol</span>
          <span style={{ fontWeight: 600, color: deliveryFee === 0 ? 'var(--color-success)' : 'inherit' }}>
            {deliveryFee === 0 ? 'Complimentary' : `+₹${deliveryFee.toLocaleString('en-IN')}`}
          </span>
        </div>

        {isGiftWrapped && (
          <div className="checkout-summary-row" style={{ color: 'var(--color-gold-hover)' }}>
            <span>Bespoke Gift Box & Note</span>
            <span style={{ fontWeight: 600 }}>Complimentary</span>
          </div>
        )}

        {totals.giftPouchUnlocked && (
          <div className="checkout-summary-row" style={{ color: 'var(--color-gold-hover)' }}>
            <span>Leather Watch Travel Pouch</span>
            <span style={{ fontWeight: 600 }}>Complimentary Gift</span>
          </div>
        )}

        <div className="checkout-summary-row total">
          <span>Total Settlement</span>
          <span>₹{finalTotal.toLocaleString('en-IN')}</span>
        </div>
      </div>

      <div className="checkout-tax-note">
        All prices include 18% Horology GST, luxury excise duties, and 100% full-value courier insurance.
      </div>

      {/* Luxury Trust Indicators */}
      <div className="checkout-trust-box">
        <div className="checkout-trust-item">
          <span className="checkout-trust-icon" style={{ display: 'inline-flex', alignItems: 'center' }}>
            <ShieldCheck size={14} strokeWidth={1.5} />
          </span>
          <span>100% Authenticity Guarantee & Serialized Certificate</span>
        </div>
        <div className="checkout-trust-item">
          <span className="checkout-trust-icon" style={{ display: 'inline-flex', alignItems: 'center' }}>
            <RotateCcw size={14} strokeWidth={1.5} />
          </span>
          <span>30-Day Complimentary Inspection & Easy Return</span>
        </div>
        <div className="checkout-trust-item">
          <span className="checkout-trust-icon" style={{ display: 'inline-flex', alignItems: 'center' }}>
            <Clock size={14} strokeWidth={1.5} />
          </span>
          <span>2-Year International Movement Warranty</span>
        </div>
      </div>
    </aside>
  );
}
