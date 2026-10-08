'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { RotateCcw, ShieldAlert } from 'lucide-react';

export default function AdminJournalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Editorial CMS Access Variance:', error);
  }, [error]);

  return (
    <div className="admin-error-canvas">
      <div className="admin-error-card">
        {/* Shield Icon inside Themed Amber Pill */}
        <div className="admin-error-icon-pill" aria-hidden="true">
          <ShieldAlert size={24} strokeWidth={2} />
        </div>

        {/* Editorial Access Restricted Headline */}
        <h1 className="admin-error-title">
          Editorial Access Restricted
        </h1>

        {/* Telemetry Message */}
        <p className="admin-error-body">
          Unable to initialize administrative controls. Your session token may have expired or requires elevated credentials.
        </p>

        {/* Standardized Buttons Row */}
        <div className="admin-error-actions">
          <button
            type="button"
            onClick={() => reset()}
            className="admin-btn-white"
          >
            <RotateCcw size={14} strokeWidth={2} />
            <span>Reload Console</span>
          </button>
          <Link href="/account" className="admin-btn-muted">
            <span>Account Portal</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
