import React, { Suspense } from 'react';
import { Metadata } from 'next';
import CheckoutClient from './CheckoutClient';

export const metadata: Metadata = {
  title: 'Secure Horological Checkout | WRISTO',
  description: 'Complete your timepiece acquisition with 256-bit SSL encryption, complimentary insured air express transit, and individual Certificate of Provenance.',
  robots: {
    index: false,
    follow: false
  }
};

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div style={{ textAlign: 'center', padding: '100px 20px', color: 'var(--color-text-secondary)' }}>
        <p>Loading Secure Checkout...</p>
      </div>
    }>
      <CheckoutClient />
    </Suspense>
  );
}
