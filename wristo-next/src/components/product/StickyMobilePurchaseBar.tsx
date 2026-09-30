'use client';

import React, { useEffect, useState } from 'react';
import { Product } from '@/types/product';
import { useCart } from '@/context/CartContext';

interface StickyMobilePurchaseBarProps {
  product: Product;
  quantity: number;
}

export default function StickyMobilePurchaseBar({
  product,
  quantity
}: StickyMobilePurchaseBarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { addToCart, openCartDrawer } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      // Trigger when scrolled down past 450px
      if (window.scrollY > 450) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <aside className="pdp-sticky-mobile-bar" aria-label="Quick Purchase Bar">
      <div className="pdp-sticky-mobile-inner">
        <div className="pdp-sticky-mobile-meta">
          <img
            src={product.image}
            alt={product.model}
            className="pdp-sticky-thumb"
          />
          <div className="pdp-sticky-info">
            <span className="pdp-sticky-brand">{product.brand}</span>
            <span className="pdp-sticky-model">{product.model}</span>
            <span className="pdp-sticky-price">₹{product.price.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div className="pdp-sticky-mobile-btns">
          <button
            type="button"
            className="btn btn-primary btn-sm pdp-sticky-btn"
            onClick={() => addToCart(product.id, quantity)}
          >
            Add
          </button>
          <button
            type="button"
            className="btn btn-champagne btn-sm pdp-sticky-btn"
            onClick={() => {
              addToCart(product.id, quantity);
              openCartDrawer();
            }}
          >
            Buy Now
          </button>
        </div>
      </div>
    </aside>
  );
}
