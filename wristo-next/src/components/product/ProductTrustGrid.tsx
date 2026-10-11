'use client';

import React from 'react';
import { ShieldCheck, Truck, RotateCcw, Award } from 'lucide-react';

interface TrustItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}

const TRUST_ITEMS: TrustItem[] = [
  {
    id: 'authenticity',
    icon: <ShieldCheck size={18} strokeWidth={1.5} className="pdp-trust-icon" />,
    title: '100% Verified Authenticity',
    subtitle: 'Serialized certificate of provenance & authorized manufacture sourcing.'
  },
  {
    id: 'insured-shipping',
    icon: <Truck size={18} strokeWidth={1.5} className="pdp-trust-icon" />,
    title: 'Insured Armored Express',
    subtitle: 'Complimentary 2–4 day air courier in tamper-evident security vaults.'
  },
  {
    id: 'returns-escrow',
    icon: <RotateCcw size={18} strokeWidth={1.5} className="pdp-trust-icon" />,
    title: '30-Day Inspection Period',
    subtitle: 'Complimentary home pickup & prompt refund in pristine unworn condition.'
  },
  {
    id: 'caliber-warranty',
    icon: <Award size={18} strokeWidth={1.5} className="pdp-trust-icon" />,
    title: '2-Year Caliber Warranty',
    subtitle: 'Comprehensive internal movement protection by master watchmakers.'
  }
];

export default function ProductTrustGrid() {
  return (
    <section className="pdp-trust-grid-wrapper" aria-label="WRISTO Luxury Assurances">
      <div className="pdp-trust-grid-header">
        <span className="pdp-trust-grid-tag">WRISTO STANDARDS</span>
        <span className="pdp-trust-grid-divider">•</span>
        <span className="pdp-trust-grid-sub">WHITE-GLOVE CLIENT PROTECTION</span>
      </div>

      <div className="pdp-trust-grid">
        {TRUST_ITEMS.map((item) => (
          <div key={item.id} className="pdp-trust-card">
            <div className="pdp-trust-card-icon-wrap">
              {item.icon}
            </div>
            <div className="pdp-trust-card-body">
              <h4 className="pdp-trust-card-title">{item.title}</h4>
              <p className="pdp-trust-card-desc">{item.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
