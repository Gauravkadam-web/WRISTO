'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { PRODUCTS } from '@/data/products';

export default function CartDrawer() {
  const { cart, isCartDrawerOpen, closeCartDrawer, removeFromCart, updateQuantity } = useCart();

  if (!isCartDrawerOpen) return null;

  const cartWithProducts = cart.map(item => {
    const product = PRODUCTS.find(p => p.id === item.id);
    return { ...item, product };
  }).filter(item => item.product !== undefined);

  const subtotal = cartWithProducts.reduce((sum, item) => {
    return sum + (item.product ? item.product.price * item.quantity : 0);
  }, 0);

  return (
    <div className="cart-drawer-overlay open" onClick={closeCartDrawer}>
      <div className="cart-drawer-box" onClick={e => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="cart-drawer-header">
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <h3 className="drawer-title">
              Shopping Bag
            </h3>
            <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
              ({cart.reduce((s, i) => s + i.quantity, 0)} items)
            </span>
          </div>
          <button
            type="button"
            className="cart-close-btn"
            onClick={closeCartDrawer}
            aria-label="Close Shopping Bag"
          >
            &times;
          </button>
        </div>

        {/* Drawer Body */}
        <div className="cart-drawer-items" id="cart-drawer-items">
          {cartWithProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 16px', color: 'var(--color-text-secondary)' }}>
              <div style={{ fontSize: '32px', marginBottom: '16px' }}>🛍️</div>
              <p style={{ fontSize: '16px', fontWeight: 500, marginBottom: '8px', color: 'var(--color-text-primary)' }}>
                Your shopping bag is empty
              </p>
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '24px' }}>
                Discover hand-finished horological timepieces calibrated for your lifestyle.
              </p>
              <Link
                href="/watches"
                className="btn btn-primary btn-sm"
                onClick={closeCartDrawer}
              >
                Explore Curated Watches
              </Link>
            </div>
          ) : (
            cartWithProducts.map(({ id, quantity, product }) => {
              if (!product) return null;
              return (
                <div key={id} className="cart-item-row">
                  <div style={{ position: 'relative', width: '64px', height: '64px', background: '#F8F6F2', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
                    <Image
                      src={product.image}
                      alt={product.model}
                      fill
                      sizes="64px"
                      style={{ objectFit: 'contain', padding: '4px' }}
                    />
                  </div>
                  <div className="cart-item-info" style={{ flex: 1, minWidth: 0 }}>
                    <div className="cart-item-brand">{product.brand}</div>
                    <div className="cart-item-title" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {product.model}
                    </div>
                    <div className="cart-item-price">
                      ₹{product.price.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between', height: '100%' }}>
                    <button
                      type="button"
                      onClick={() => removeFromCart(id)}
                      style={{ color: 'var(--color-text-muted)', fontSize: '16px', lineHeight: 1 }}
                      aria-label="Remove item"
                    >
                      &times;
                    </button>
                    <div className="quantity-stepper" style={{ height: '28px', marginTop: '10px' }}>
                      <button
                        type="button"
                        className="stepper-btn"
                        style={{ width: '24px' }}
                        onClick={() => updateQuantity(id, -1)}
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
                        onClick={() => updateQuantity(id, 1)}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer */}
        {cartWithProducts.length > 0 && (
          <div className="cart-drawer-footer">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>Subtotal</span>
              <span style={{ fontWeight: 600 }}>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '13px' }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>Insured Express Shipping</span>
              <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>Complimentary</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '16px', borderTop: '1px solid var(--color-border-light)', paddingTop: '12px' }}>
              <span style={{ fontWeight: 700 }}>Total</span>
              <span style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>
                ₹{subtotal.toLocaleString('en-IN')}
              </span>
            </div>
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
