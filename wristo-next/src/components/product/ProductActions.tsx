'use client';

import React, { useState } from 'react';
import { Product } from '@/types/product';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

interface ProductActionsProps {
  product: Product;
  quantity: number;
  onQuantityChange: (qty: number) => void;
}

export default function ProductActions({
  product,
  quantity,
  onQuantityChange
}: ProductActionsProps) {
  const { addToCart, openCartDrawer } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [shareCopied, setShareCopied] = useState(false);
  const [compareActive, setCompareActive] = useState(false);

  const isFavorited = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product.id, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product.id, quantity);
    openCartDrawer();
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2400);
    }
  };

  const handleCompare = () => {
    setCompareActive(prev => !prev);
  };

  return (
    <div className="pdp-actions-container" id="pdp-actions-anchor">
      {/* Primary Actions Row (Stepper + Add to Cart + Buy Now) */}
      <div className="pdp-actions-row">
        {/* Quantity Stepper */}
        <div className="quantity-stepper" aria-label="Select Quantity">
          <button
            type="button"
            className="stepper-btn"
            onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
            aria-label="Decrease Quantity"
          >
            &minus;
          </button>
          <div className="stepper-val" aria-live="polite">
            {quantity}
          </div>
          <button
            type="button"
            className="stepper-btn"
            onClick={() => onQuantityChange(Math.min(5, quantity + 1))}
            disabled={quantity >= 5}
            aria-label="Increase Quantity"
          >
            &#43;
          </button>
        </div>

        {/* Primary Add to Cart Button */}
        <button
          type="button"
          className="btn btn-primary btn-lg pdp-btn-cart"
          onClick={handleAddToCart}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          Add to Cart
        </button>

        {/* Champagne Elevated CTA: Buy Now */}
        <button
          type="button"
          className="btn btn-champagne btn-lg pdp-btn-buy"
          onClick={handleBuyNow}
        >
          Buy Now &rarr;
        </button>
      </div>

      {/* Secondary Actions Bar (Wishlist, Compare, Share) */}
      <div className="pdp-secondary-actions-bar">
        <button
          type="button"
          className={`pdp-secondary-btn ${isFavorited ? 'active' : ''}`}
          onClick={() => toggleWishlist(product.id)}
          aria-label={isFavorited ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill={isFavorited ? '#B94A48' : 'none'} stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <span>{isFavorited ? 'Saved in Wishlist' : 'Save to Wishlist'}</span>
        </button>

        <button
          type="button"
          className={`pdp-secondary-btn ${compareActive ? 'active' : ''}`}
          onClick={handleCompare}
          aria-label="Compare Specifications"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="16 3 21 3 21 8" />
            <line x1="4" y1="20" x2="21" y2="3" />
            <polyline points="21 16 21 21 16 21" />
            <line x1="15" y1="15" x2="21" y2="21" />
            <line x1="4" y1="4" x2="9" y2="9" />
          </svg>
          <span>{compareActive ? 'In Comparison' : 'Compare Specs'}</span>
        </button>

        <button
          type="button"
          className="pdp-secondary-btn"
          onClick={handleShare}
          aria-label="Share Timepiece"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
          <span>{shareCopied ? 'Link Copied!' : 'Share'}</span>
        </button>
      </div>
    </div>
  );
}
