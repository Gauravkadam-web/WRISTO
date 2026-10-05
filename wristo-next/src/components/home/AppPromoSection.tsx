import React from 'react';
import Image from 'next/image';
import { Check } from 'lucide-react';

export default function AppPromoSection() {
  return (
    <section className="section app-promo-section" aria-label="Mobile App Experience">
      <div className="container">
        <div className="app-promo-card">
          <div className="app-promo-grid">
            {/* Left Visual: 3D Smartphone Presentation */}
            <div className="app-promo-visual">
              <div className="app-promo-phone-wrap">
                <Image
                  src="/assets/banners/app-promo-banner.png"
                  alt="WRISTO Mobile App Interface on Smartphone"
                  width={520}
                  height={440}
                  className="app-promo-phone-img"
                  style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                />
              </div>
            </div>

            {/* Right Column: Copy & Store Badges */}
            <div className="app-promo-content">
              <div className="section-label">WRISTO ON MOBILE</div>
              <h2 className="app-promo-title">
                Take WRISTO Wherever You Go
              </h2>
              <p className="app-promo-subtitle">
                Discover, explore and shop premium watches on the go with our mobile app.
              </p>

              {/* Feature Highlights */}
              <div className="app-promo-features">
                <div className="app-promo-feature-item">
                  <span className="app-promo-check" aria-hidden="true" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Check size={13} strokeWidth={2.5} />
                  </span>
                  <span>Instant drop alerts for limited mechanical editions</span>
                </div>
                <div className="app-promo-feature-item">
                  <span className="app-promo-check" aria-hidden="true" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Check size={13} strokeWidth={2.5} />
                  </span>
                  <span>Interactive 3D dial inspection &amp; virtual wrist try-on</span>
                </div>
                <div className="app-promo-feature-item">
                  <span className="app-promo-check" aria-hidden="true" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Check size={13} strokeWidth={2.5} />
                  </span>
                  <span>Live insured custody tracking &amp; digital provenance certificates</span>
                </div>
              </div>

              {/* Store Download Badges */}
              <div className="app-promo-badges">
                <a
                  href="#download-ios"
                  className="store-badge-btn"
                  title="Download WRISTO on Apple App Store"
                >
                  <svg width="22" height="26" viewBox="0 0 170 170" fill="currentColor">
                    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.6-7.83-11.74-14.35-5.99-9.35-10.74-19.9-14.26-31.64-3.52-11.75-5.28-22.95-5.28-33.6 0-14.58 3.69-26.3 11.08-35.16 7.39-8.86 16.57-13.39 27.54-13.6 4.35 0 9.27 1.13 14.76 3.4 5.48 2.27 9.17 3.47 11.06 3.6 2.12-.27 5.92-1.54 11.41-3.82 5.49-2.28 10.15-3.32 13.98-3.13 12.18.67 21.84 5.11 28.98 13.33-10.66 6.47-15.88 15.35-15.65 26.63.22 8.78 3.59 16.03 10.11 21.75 6.53 5.72 14.16 9.04 22.9 9.96-2.12 6.53-4.63 13.23-7.53 20.1zM119.22 33.72c0-7.39 2.65-14.31 7.96-20.76 5.3-6.45 11.83-10.59 19.57-12.43 1.08 7.39-1.28 14.32-7.07 20.78-5.8 6.46-12.62 10.59-20.46 12.41z"/>
                  </svg>
                  <div className="store-badge-text">
                    <span className="store-badge-sub">Download on the</span>
                    <span className="store-badge-title">App Store</span>
                  </div>
                </a>

                <a
                  href="#download-android"
                  className="store-badge-btn"
                  title="Get WRISTO on Google Play Store"
                >
                  <svg width="22" height="26" viewBox="0 0 512 512" fill="currentColor">
                    <path fill="#4CAF50" d="M32.5 35.8c-2.4 3.7-3.8 8.6-3.8 14.4v411.6c0 5.8 1.4 10.7 3.8 14.4l228.8-220.2L32.5 35.8z"/>
                    <path fill="#FFC107" d="M336.8 328.7l-75.5-72.7 75.5-72.7 85.5 49.3c24.3 14 24.3 36.9 0 50.9l-85.5 45.2z"/>
                    <path fill="#FF3D00" d="M32.5 476.2l228.8-220.2 75.5 72.7-184.2 106.3c-24.3 14-44.2 2.5-44.2-25.5 0-1.8.3-3.6.9-5.3l123.2-123-90 90z"/>
                    <path fill="#00E5FF" d="M32.5 35.8l228.8 220.2 75.5-72.7L152.6 77C128.3 63 108.4 74.5 108.4 102.5c0 1.8.3 3.6.9 5.3l123.2 123-90-90z"/>
                  </svg>
                  <div className="store-badge-text">
                    <span className="store-badge-sub">GET IT ON</span>
                    <span className="store-badge-title">Google Play</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
