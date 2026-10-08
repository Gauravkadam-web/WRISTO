'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { RotateCcw, Scale } from 'lucide-react';

export default function CompareError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Comparison Matrix Variance:', error);
  }, [error]);

  return (
    <div className="error-boundary-wrapper" style={{ padding: '80px 20px', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="error-boundary-card" style={{ maxWidth: '520px', textAlign: 'center' }}>
        <span className="error-boundary-icon" aria-hidden="true" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
          <Scale size={36} strokeWidth={1.5} color="var(--brand-bronze, #B08D6B)" />
        </span>
        <h1 className="error-boundary-title" style={{ fontSize: '24px', fontWeight: 600, marginBottom: '12px' }}>
          Horology Matrix Temporarily Offline
        </h1>
        <p className="error-boundary-desc" style={{ color: 'var(--color-text-secondary)', fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>
          We encountered an issue synchronizing the comparison matrix for your selected timepieces.
        </p>
        <div className="error-boundary-actions" style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => reset()}
            className="not-found-btn-primary"
            style={{ cursor: 'pointer', border: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <span>Reload Matrix</span>
            <RotateCcw size={14} strokeWidth={2} />
          </button>
          <Link href="/watches" className="not-found-btn-secondary">
            <span>Browse Timepieces</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
