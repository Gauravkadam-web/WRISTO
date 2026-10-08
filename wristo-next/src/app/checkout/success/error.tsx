'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle2, ShoppingBag, UserCheck } from 'lucide-react';
import CheckoutHeader from '@/components/checkout/CheckoutHeader';

export default function OrderSuccessErrorBoundary({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Success screen rendering notice:', error);
  }, [error]);

  return (
    <div className="checkout-page-wrapper">
      <CheckoutHeader />
      <div className="checkout-container" style={{ textAlign: 'center', padding: '80px 20px', maxWidth: '600px', margin: '0 auto' }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'rgba(40, 167, 69, 0.1)',
          color: 'var(--color-success, #28a745)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px auto'
        }}>
          <CheckCircle2 size={36} strokeWidth={2} />
        </div>

        <h1 className="checkout-card-title" style={{ fontSize: '26px', marginBottom: '12px' }}>
          Order Successfully Placed
        </h1>

        <p style={{ fontSize: '15px', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '28px' }}>
          Your timepiece acquisition has been registered and verified in our horological ledger. You can inspect your active orders and digital certificates anytime in your Collector Account.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href="/account"
            className="btn btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <UserCheck size={16} strokeWidth={1.5} />
            <span>View Orders &amp; Certificates</span>
          </Link>

          <Link
            href="/watches"
            className="btn btn-outline"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <ShoppingBag size={16} strokeWidth={1.5} />
            <span>Continue Browsing</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
