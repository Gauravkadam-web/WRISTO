'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith('/checkout')) {
    return null;
  }
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top-grid">
          {/* Brand Summary */}
          <div className="footer-brand-col">
            <Link href="/" className="brand-logo-wrap" style={{ display: 'inline-block', marginBottom: '16px' }}>
              <Image
                src="/assets/brand/logo-horizontal-dark.png"
                alt="WRISTO"
                width={160}
                height={36}
                className="brand-logo-img"
              />
            </Link>
            <p>
              WRISTO is an ultra-luxury multi-brand watch marketplace bringing curated discovery, horological integrity, and verified brand warranties under one boutique destination.
            </p>
            <div style={{ marginTop: '18px', display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--color-accent-champagne)' }}>
                <span style={{ color: 'var(--color-accent-champagne)', fontSize: '14px', fontWeight: 'bold' }}>W</span>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--color-accent-champagne)', letterSpacing: '0.08em', fontWeight: 600 }}>
                CERTIFIED HOROLOGY DIRECT
              </span>
            </div>
          </div>

          {/* Collections */}
          <div>
            <div className="footer-heading">Curated Collections</div>
            <div className="footer-links-list">
              <Link href="/watches?category=dress">Quiet Luxury & Dress</Link>
              <Link href="/watches?category=men">Everyday Icons</Link>
              <Link href="/watches?category=automatic">Mechanical & Skeleton Souls</Link>
              <Link href="/watches?category=chronograph">Precision Chronographs</Link>
              <Link href="/watches?maxPrice=20000">Under ₹20,000</Link>
            </div>
          </div>

          {/* Partner Brands */}
          <div>
            <div className="footer-heading">Partner Houses</div>
            <div className="footer-links-list">
              <Link href="/watches?brand=AUREN">AUREN Horology</Link>
              <Link href="/watches?brand=VELA">VELA Classic</Link>
              <Link href="/watches?brand=ORBITA">ORBITA Automatic</Link>
              <Link href="/watches?brand=VANTA">VANTA Motorsports</Link>
              <Link href="/watches?brand=NORDEN">NORDEN Skeleton</Link>
              <Link href="/watches?brand=PULSE">PULSE Connected</Link>
            </div>
          </div>

          {/* Concierge & Trust */}
          <div>
            <div className="footer-heading">Concierge & Care</div>
            <div className="footer-links-list">
              <a href="#concierge">AI Style Advisor</a>
              <a href="#authenticity">100% Authentic Guarantee</a>
              <a href="#warranty">Manufacturer Warranty</a>
              <a href="#shipping">Complimentary Insured Shipping</a>
              <a href="#returns">30-Day Horological Returns</a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-row">
          <div className="footer-copyright">
            © {new Date().getFullYear()} WRISTO Horological Marketplace. All rights reserved. Your Time. Your Style.
          </div>
          <div className="footer-legal-links">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
            <a href="#security">Authenticity Ledger</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
