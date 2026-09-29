import React from 'react';
import Link from 'next/link';

export default function EditorialBanner() {
  return (
    <section className="section" style={{ paddingTop: 0, paddingBottom: 'var(--space-16)' }}>
      <div className="container">
        <div className="banner-editorial-card">
          <div className="banner-editorial-content">
            <div className="banner-eyebrow">NEW ARRIVALS</div>
            <h2 className="banner-title">
              <span className="banner-title-line">Modern Looks.</span>
              <span className="banner-title-line">Timeless Feel.</span>
            </h2>
            <p className="banner-desc">
              Discover the latest watches from top brands, designed for every mood.
            </p>
            <div className="banner-actions">
              <Link href="/watches" className="btn btn-banner-primary">
                Explore Now <span className="btn-arrow">&rarr;</span>
              </Link>
            </div>
            <div className="banner-carousel-indicator" aria-hidden="true">
              <span className="carousel-num active">01</span>
              <span className="carousel-divider" />
              <span className="carousel-num">02</span>
              <span className="carousel-divider" />
              <span className="carousel-num">03</span>
            </div>
          </div>
          <div className="banner-editorial-visual">
            <div className="banner-editorial-visual-overlay" />
            <span className="banner-editorial-badge">
              STYLE IN EVERY DETAIL
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
