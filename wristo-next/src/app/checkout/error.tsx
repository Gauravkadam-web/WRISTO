'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { RotateCcw, Lock } from 'lucide-react';

export default function CheckoutError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Checkout Transaction Variance:', error);
  }, [error]);

  return (
    <div className="error-boundary-wrapper" style={{ padding: '80px 20px', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="error-boundary-card" style={{ maxWidth: '520px', textAlign: 'center' }}>
        <span className="error-boundary-icon" aria-hidden="true" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
          <Lock size={36} strokeWidth={1.5} color="var(--brand-bronze, #B08D6B)" />
        </span>
        <h1 className="error-boundary-title" style={{ fontSize: '24px', fontWeight: 600, marginBottom: '12px' }}>
          Checkout Session Interrupted
        </h1>
        <p className="error-boundary-desc" style={{ color: 'var(--color-text-secondary)', fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>
          An error occurred while initializing your secure checkout session. Your bag contents remain securely stored in your session.
        </p>
        <div className="error-boundary-actions" style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => reset()}
            className="not-found-btn-primary"
            style={{ cursor: 'pointer', border: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <span>Resume Checkout</span>
            <RotateCcw size={14} strokeWidth={2} />
          </button>
          <Link href="/cart" className="not-found-btn-secondary">
            <span>View Shopping Bag</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
