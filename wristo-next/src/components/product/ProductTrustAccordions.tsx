'use client';

import React, { useState } from 'react';

export default function ProductTrustAccordions() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const trustItems = [
    {
      id: 'auth',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
      title: '100% Guaranteed Horological Authenticity',
      content: 'Every timepiece on WRISTO is sourced directly from certified Swiss, Japanese, or authorized horological manufacturers. Each watch includes a serialized Certificate of Provenance, factory documentation, and official manufacturer packaging.'
    },
    {
      id: 'shipping',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="1" y="3" width="15" height="13" />
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
          <circle cx="5.5" cy="18.5" r="2.5" />
          <circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
      ),
      title: 'Complimentary Insured Express Delivery',
      content: 'Dispatched via premium insured air courier with real-time GPS tracking. Timepieces are secured within dual-sealed armored luxury vaults. Delivery spans 2 to 4 business days across all Indian metro & Tier-1 destinations.'
    },
    {
      id: 'returns',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="1 4 1 10 7 10" />
          <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
        </svg>
      ),
      title: '30-Day Complimentary Inspection & Returns',
      content: 'Experience your timepiece in person. If you are not entirely satisfied, request an insured home courier pickup within 30 days of receipt in unworn condition for a prompt 100% refund.'
    },
    {
      id: 'warranty',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      ),
      title: '2-Year Global Movement Warranty',
      content: 'Includes comprehensive coverage for internal movement calibers, balance spring accuracy, and manufacturing defects. Backed by certified watchmakers with official repair facilities.'
    }
  ];

  const toggleAccordion = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="pdp-trust-section">
      <div className="pdp-trust-accordion-list">
        {trustItems.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div className={`pdp-accordion-item ${isOpen ? 'open' : ''}`} key={item.id}>
              <button
                type="button"
                className="pdp-accordion-header"
                onClick={() => toggleAccordion(idx)}
                aria-expanded={isOpen}
              >
                <div className="pdp-accordion-title-wrap">
                  <span className="pdp-accordion-icon">{item.icon}</span>
                  <span className="pdp-accordion-title">{item.title}</span>
                </div>
                <span className="pdp-accordion-chevron">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points={isOpen ? "18 15 12 9 6 15" : "6 9 12 15 18 9"} />
                  </svg>
                </span>
              </button>
              {isOpen && (
                <div className="pdp-accordion-body">
                  <p>{item.content}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
