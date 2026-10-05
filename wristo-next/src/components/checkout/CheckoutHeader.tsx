'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck } from 'lucide-react';

export default function CheckoutHeader() {
  return (
    <header className="checkout-site-header">
      <div className="checkout-container" style={{ padding: '0 24px' }}>
        <div className="checkout-header-inner">
          <Link href="/" className="checkout-header-logo" title="Return to WRISTO Home">
            <Image
              src="/assets/brand/logo-horizontal-dark.png"
              alt="WRISTO"
              width={130}
              height={26}
              style={{ objectFit: 'contain' }}
              priority
            />
          </Link>

          <div className="checkout-security-badge">
            <span className="checkout-security-icon" style={{ display: 'inline-flex', alignItems: 'center' }}>
              <ShieldCheck size={16} strokeWidth={1.5} style={{ color: 'var(--color-accent-gold)' }} />
            </span>
            <span style={{ fontWeight: 600, color: '#FFFFFF' }}>256-Bit SSL Encrypted</span>
            <span style={{ color: '#666666' }}>•</span>
            <span style={{ color: '#A0A0A0' }}>Concierge: +91 (800) 974-786</span>
          </div>
        </div>
      </div>
    </header>
  );
}
