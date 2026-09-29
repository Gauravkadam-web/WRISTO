import React from 'react';

export default function TrustStrip() {
  const trustItems = [
    { title: '100% Authentic Timepieces', subtitle: 'Direct from certified brand houses', icon: '✦' },
    { title: 'Complimentary Insured Delivery', subtitle: 'Dispatched in security cases', icon: '✦' },
    { title: '30-Day Horological Returns', subtitle: 'No questions asked inspection', icon: '✦' },
    { title: 'Official Brand Warranty', subtitle: '2-Year minimum manufacturer cover', icon: '✦' },
  ];

  return (
    <section className="trust-strip-minimal" aria-label="Trust & Guarantees">
      <div className="container">
        <div className="trust-strip-grid">
          {trustItems.map((item, index) => (
            <div key={index} className="trust-strip-item">
              <span className="trust-strip-accent" aria-hidden="true">{item.icon}</span>
              <div>
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
