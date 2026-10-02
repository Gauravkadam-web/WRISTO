import React from 'react';
import Link from 'next/link';
import { BRANDS } from '@/data/brands';

export default function PopularBrands() {
  return (
    <section className="section popular-brands-section" aria-label="Popular Brands">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div>
            <div className="section-label">CURATED HOUSES</div>
            <h2 className="section-title">Popular Brands</h2>
            <p className="section-subtitle">
              Shop from the most trusted watch brands.
            </p>
          </div>
          <Link href="/watches" className="view-all-link">
            View All &rarr;
          </Link>
        </div>

        {/* 6 Brand Cards Grid */}
        <div className="popular-brands-grid">
          {BRANDS.slice(0, 6).map((brand) => (
            <Link
              key={brand.name}
              href={`/watches?brand=${encodeURIComponent(brand.name)}`}
              className="popular-brand-card"
              title={`Explore ${brand.name} collection`}
            >
              <div className="brand-card-monogram" aria-hidden="true">
                {brand.name.slice(0, 1)}
              </div>
              <div className="brand-card-name">{brand.name}</div>
              <div className="brand-card-series">{brand.country}</div>
              <span className="brand-card-count">{brand.watchCount} Timepieces</span>
            </Link>
          ))}
        </div>

        {/* Dark Bezel Banner ("Explore Premium Brands") */}
        <div className="bezel-banner-card">
          <div className="bezel-banner-overlay" />
          <div className="bezel-banner-content">
            <h3 className="bezel-banner-title">
              Explore<br />Premium Brands
            </h3>
            <p className="bezel-banner-subtitle">
              Authentic. Trusted. Always.
            </p>
            <Link href="/watches" className="btn btn-champagne bezel-banner-btn">
              Browse Brands &rarr;
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
