import React from 'react';

export default function TrustStrip() {
  const trustItems = [
    {
      title: '100% Authentic',
      subtitle: 'Brand Warranty',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      ),
    },
    {
      title: 'Free Shipping',
      subtitle: 'Across India',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="3" width="15" height="13" />
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
          <circle cx="5.5" cy="18.5" r="2.5" />
          <circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
      ),
    },
    {
      title: 'Easy Returns',
      subtitle: 'Within 7 Days',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
          <path d="m12 7 0 5 3 2" />
        </svg>
      ),
    },
    {
      title: 'Secure',
      subtitle: 'Payments',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      ),
    },
  ];

  return (
    <section className="trust-strip-minimal" aria-label="Trust & Guarantees">
      <div className="container">
        <div className="trust-strip-grid">
          {trustItems.map((item, index) => (
            <div key={index} className="trust-strip-item">
              <span className="trust-strip-icon-box" aria-hidden="true">
                {item.icon}
              </span>
              <div className="trust-strip-text">
                <div className="trust-strip-title">{item.title}</div>
                <div className="trust-strip-subtitle">{item.subtitle}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
