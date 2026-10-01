'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { Product } from '@/types/product';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { useComparison } from '@/context/ComparisonContext';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { isInComparison, toggleComparison } = useComparison();
  const cardRef = useRef<HTMLDivElement>(null);
  const isFavorited = isInWishlist(product.id);
  const isCompared = isInComparison(product.id);

  // 3D Tilt Interaction (Desktop only, respects prefers-reduced-motion)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.innerWidth < 1024) return;

    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((centerY - y) / centerY) * 2.5;
    const rotateY = ((x - centerX) / centerX) * 3.5;

    const img = el.querySelector<HTMLImageElement>('.card-watch-img');
    if (img) {
      img.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    }
  };

  const handleMouseLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    const img = el.querySelector<HTMLImageElement>('.card-watch-img');
    if (img) {
      img.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale(1.0)';
    }
  };

  const discountPercent = Math.round((1 - product.price / product.originalPrice) * 100);

  return (
    <article className="product-card" ref={cardRef}>
      <div
        className="card-media tilt-element"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Badges */}
        {product.badge && (
          <span className="pill-badge card-badge-tag gold">
            {product.badge}
          </span>
        )}

        {/* Wishlist Button */}
        <button
          type="button"
          className={`card-wishlist-btn ${isFavorited ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          title={isFavorited ? 'Remove from Wishlist' : 'Save to Wishlist'}
          aria-label={isFavorited ? `Remove ${product.model} from Wishlist` : `Save ${product.model} to Wishlist`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill={isFavorited ? '#B94A48' : 'none'} stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        {/* Direct Watch Image matching CSS specifications */}
        <Link href={`/product/${product.id}`} className="card-media-link" tabIndex={-1} aria-hidden="true">
          <img
            src={product.image}
            alt={`${product.brand} ${product.model} - ${product.caseSize} ${product.movement} Watch`}
            className="card-watch-img"
            loading={priority ? 'eager' : 'lazy'}
          />
        </Link>

        {/* Quick Actions Hover Layer */}
        <div className="card-quick-actions">
          <button
            type="button"
            className="quick-action-btn"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToCart(product.id);
            }}
          >
            Quick Add
          </button>
          <button
            type="button"
            className="quick-action-btn"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
          >
            {isFavorited ? 'Saved' : 'Wishlist'}
          </button>
          <button
            type="button"
            className={`quick-action-btn ${isCompared ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleComparison(product.id);
            }}
            title={isCompared ? 'Remove from Comparison' : 'Compare Specifications'}
            aria-label={isCompared ? `Remove ${product.model} from comparison` : `Compare ${product.model}`}
          >
            {isCompared ? 'Compared' : 'Compare'}
          </button>
        </div>
      </div>

      {/* Card Information */}
      <div className="card-info">
        <div className="card-brand">
          {product.brand} &bull; {product.movement} &bull; {product.caseSize}
        </div>
        <h3 className="card-title">
          <Link href={`/product/${product.id}`}>
            {product.model}
          </Link>
        </h3>

        {/* Rating Row */}
        <div className="card-rating-row">
          <span className="star-icon">★</span>
          <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{product.rating}</span>
          <span>({product.reviewsCount})</span>
          <span style={{ margin: '0 4px', color: '#D9C9B8' }}>&bull;</span>
          <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{product.strap}</span>
        </div>

        {/* Price Row */}
        <div className="card-price-row">
          <span className="card-price">₹{product.price.toLocaleString('en-IN')}</span>
          <span className="card-original-price">₹{product.originalPrice.toLocaleString('en-IN')}</span>
          {discountPercent > 0 && (
            <span className="card-discount-badge">{discountPercent}% off</span>
          )}
        </div>
      </div>
    </article>
  );
}
