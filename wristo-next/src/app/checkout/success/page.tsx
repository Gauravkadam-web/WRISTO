import React, { Suspense } from 'react';
import { Metadata } from 'next';
import SuccessClient from './SuccessClient';

export const metadata: Metadata = {
  title: 'Order Confirmed & Certificate of Provenance | WRISTO',
  description: 'Your luxury timepiece acquisition has been confirmed and registered into the WRISTO Horological Provenance Register.',
  robots: {
    index: false,
    follow: false
  }
};

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div style={{ textAlign: 'center', padding: '100px 20px', color: 'var(--color-text-secondary)' }}>
        <p>Loading Horological Provenance Certificate...</p>
      </div>
    }>
      <SuccessClient />
    </Suspense>
  );
}
