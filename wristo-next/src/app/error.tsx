'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Cog, RotateCcw } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log unexpected exceptions for diagnostic telemetry
    console.error('Horological Execution Deviation:', error);
  }, [error]);

  return (
    <div className="error-boundary-wrapper">
      <div className="error-boundary-card">
        <span className="error-boundary-icon" aria-hidden="true" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          <Cog size={36} strokeWidth={1.5} color="var(--brand-bronze)" />
        </span>
        <h1 className="error-boundary-title">Something Went Wrong</h1>
        <p className="error-boundary-desc">
          We encountered an issue loading this section. Please try reloading the page or return to the home page.
        </p>
        <div className="error-boundary-actions">
          <button
            type="button"
            onClick={() => reset()}
            className="not-found-btn-primary"
            style={{ cursor: 'pointer', border: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <span>Try Again</span>
            <RotateCcw size={14} strokeWidth={2} />
          </button>
          <Link href="/" className="not-found-btn-secondary">
            <span>Return to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
