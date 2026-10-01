'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

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
        <span className="error-boundary-icon" role="img" aria-label="Escapement Mechanism">
          ⚙️
        </span>
        <h1 className="error-boundary-title">Mechanism Disengaged</h1>
        <p className="error-boundary-desc">
          An unforeseen variance occurred in our digital timepiece rendering engine. The horological movement has been temporarily halted to preserve system integrity.
        </p>
        <div className="error-boundary-actions">
          <button
            type="button"
            onClick={() => reset()}
            className="not-found-btn-primary"
            style={{ cursor: 'pointer', border: 'none' }}
          >
            <span>Re-engage Escapement Mechanism</span>
            <span>↺</span>
          </button>
          <Link href="/" className="not-found-btn-secondary">
            <span>Return to Salon Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
