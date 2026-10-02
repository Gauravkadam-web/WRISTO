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
                alt="WRISTO — Your Time. Your Style."
                width={160}
                height={36}
                className="brand-logo-img"
              />
            </Link>
            <p className="footer-brand-tagline">
              Your Time. Your Style.
            </p>
            <p className="footer-brand-desc">
              A premium multi-brand watch store bringing the best watches from around the world. Every timepiece in the WRISTO vault is 100% authentic with official international warranty.
            </p>
            <div className="footer-certified-badge">
              <div className="footer-certified-icon">
                <span>W</span>
              </div>
              <span className="footer-certified-text">
                100% AUTHENTIC GUARANTEED
              </span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <div className="footer-heading">Quick Links</div>
            <div className="footer-links-list">
              <Link href="/">Home</Link>
              <Link href="/watches?gender=Men">Men&apos;s Watches</Link>
              <Link href="/watches?gender=Women">Women&apos;s Watches</Link>
              <Link href="/watches">Collections</Link>
              <Link href="/brands">Curated Brands</Link>
              <Link href="/journal">Journal &amp; Guides</Link>
              <Link href="/concierge">AI Watch Concierge</Link>
            </div>
          </div>

          {/* Customer Care */}
          <div>
            <div className="footer-heading">Customer Care</div>
            <div className="footer-links-list">
              <Link href="/account?tab=orders">Track Your Order</Link>
              <Link href="/account?tab=provenance">Provenance Ledger</Link>
              <Link href="/compare">Compare Timepieces</Link>
              <Link href="/wishlist">Saved Wishlist</Link>
              <a href="#shipping">Complimentary Insured Shipping</a>
              <a href="#returns">7-Day Easy Returns</a>
              <a href="#warranty">Official Brand Warranty</a>
            </div>
          </div>

          {/* Get In Touch */}
          <div>
            <div className="footer-heading">Get In Touch</div>
            <div className="footer-contact-list">
              <div className="footer-contact-item">
                <span className="footer-contact-icon">📍</span>
                <span>Pune, Maharashtra, India</span>
              </div>
              <div className="footer-contact-item">
                <span className="footer-contact-icon">📞</span>
                <a href="tel:+919876543210">+91 98765 43210</a>
              </div>
              <div className="footer-contact-item">
                <span className="footer-contact-icon">✉️</span>
                <a href="mailto:support@wristo.com">support@wristo.com</a>
              </div>
              <div className="footer-contact-item">
                <span className="footer-contact-icon">🕒</span>
                <span>Mon – Sat: 9:00 AM – 8:00 PM IST</span>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="footer-social-row">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer-social-btn" aria-label="Instagram">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="footer-social-btn" aria-label="Twitter / X">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
                  <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
                </svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="footer-social-btn" aria-label="YouTube">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Payment Badges */}
        <div className="footer-bottom-row">
          <div className="footer-copyright">
            &copy; {new Date().getFullYear()} WRISTO. All rights reserved. Your Time. Your Style.
          </div>

          {/* Payment Method Badges */}
          <div className="footer-payment-badges">
            <span className="payment-badge-pill">VISA</span>
            <span className="payment-badge-pill">Mastercard</span>
            <span className="payment-badge-pill">Maestro</span>
            <span className="payment-badge-pill">UPI</span>
            <span className="payment-badge-pill">Net Banking</span>
          </div>

          <div className="footer-legal-links">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
            <a href="#authenticity">Authenticity Ledger</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
