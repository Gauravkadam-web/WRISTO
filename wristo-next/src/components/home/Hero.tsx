'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function Hero() {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  return (
    <>
      <section className="hero-section" id="hero-section">
        <div className="hero-backdrop-overlay" />
        <div className="container hero-container">
          <div className="hero-grid">
            <div className="hero-content">
              {/* Luxury Eyebrow Badge */}
              <div className="hero-eyebrow">
                <span className="hero-eyebrow-accent">SPRING / SUMMER 2026</span>
                <span className="hero-eyebrow-divider" />
                <span>NEW HOROLOGY</span>
              </div>

              {/* Verified Serif Headline */}
              <h1 className="hero-title">
                Your Time.<br />
                Your Style.
              </h1>

              {/* Sub-headline description */}
              <p className="hero-description">
                Curated luxury, automatic, and minimalist timepieces from trusted global watchmakers. Intelligent AI-powered watch styling for every wrist and occasion.
              </p>

              {/* Dual Action CTAs */}
              <div className="hero-actions">
                <Link href="/watches" className="btn btn-hero-primary">
                  Explore Collection <span className="btn-arrow">&rarr;</span>
                </Link>

                <button
                  type="button"
                  className="btn btn-hero-secondary"
                  onClick={() => setIsVideoModalOpen(true)}
                >
                  <span className="hero-play-icon">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="6 3 20 12 6 21 6 3" />
                    </svg>
                  </span>
                  Watch Video
                </button>
              </div>

              {/* Pagination Dots */}
              <div className="hero-carousel-meta">
                <div className="hero-carousel-indicator">
                  <span className="hero-dot active" />
                  <span className="hero-dot" />
                  <span className="hero-dot" />
                </div>
                <div className="hero-slide-num">01 / 03</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {isVideoModalOpen && (
        <div className="hero-video-modal-overlay open" onClick={() => setIsVideoModalOpen(false)}>
          <div className="hero-video-modal-box" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="hero-video-close-btn"
              onClick={() => setIsVideoModalOpen(false)}
              aria-label="Close video"
            >
              &times;
            </button>
            <div className="hero-video-frame-wrap">
              <div className="hero-video-placeholder">
                <div
                  className="hero-video-poster"
                  style={{ backgroundImage: "url('/assets/hero/hero-watch-dark.png')" }}
                />
                <div className="hero-video-play-layer">
                  <span className="hero-video-badge">WRISTO CINEMA &bull; 4K HOROLOGY</span>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', color: '#FFF', margin: '12px 0 8px 0' }}>
                    Precision in Motion
                  </h3>
                  <p style={{ fontSize: '14px', color: '#CCC', maxWidth: '440px', textAlign: 'center', marginBottom: '20px' }}>
                    Experience the hand-finished mechanical escapements, surgical-grade metallurgy, and timeless aesthetic restraint defining the WRISTO collection.
                  </p>
                  <Link href="/watches" className="btn btn-hero-primary" onClick={() => setIsVideoModalOpen(false)}>
                    Browse The Timepieces &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
