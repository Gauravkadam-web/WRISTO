import React from 'react';
import Link from 'next/link';
import { Product } from '@/types/product';

interface ProductHeaderProps {
  product: Product;
}

export default function ProductHeader({ product }: ProductHeaderProps) {
  return (
    <div className="pdp-header-section">
      {/* Editorial Breadcrumbs */}
      <nav className="pdp-breadcrumb" aria-label="Breadcrumb">
        <Link href="/" className="pdp-breadcrumb-link">Home</Link>
        <span className="pdp-breadcrumb-sep">/</span>
        <Link href="/watches" className="pdp-breadcrumb-link">Watches</Link>
        <span className="pdp-breadcrumb-sep">/</span>
        <Link href={`/watches?brand=${encodeURIComponent(product.brand)}`} className="pdp-breadcrumb-link">
          {product.brand}
        </Link>
        <span className="pdp-breadcrumb-sep">/</span>
        <span className="pdp-breadcrumb-current" aria-current="page">{product.model}</span>
      </nav>

      {/* Brand Eyebrow & Model Title */}
      <div className="pdp-brand-title">
        <Link href={`/watches?brand=${encodeURIComponent(product.brand)}`}>
          {product.brand}
        </Link>
      </div>

      <h1 className="pdp-model-title">
        {product.brand} {product.model}
      </h1>

      <p className="pdp-tagline-text">
        {product.tagline}
      </p>

      {/* Rating & In-Stock Availability Row */}
      <div className="card-rating-row pdp-rating-strip">
        <div className="pdp-stars-wrap">
          <span className="star-icon">★</span>
          <span className="pdp-rating-num">{product.rating.toFixed(1)}</span>
        </div>
        <span className="pdp-reviews-count">({product.reviewsCount} verified owner reviews)</span>
        <span className="pdp-dot-divider">&bull;</span>
        <span className="pdp-stock-badge">
          <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor">
            <circle cx="4" cy="4" r="4" />
          </svg>
          IN STOCK &amp; READY TO SHIP
        </span>
      </div>
    </div>
  );
}
