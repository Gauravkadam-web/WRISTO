import React from 'react';
import type { Metadata } from 'next';
import CartPageClient from './CartPageClient';

export const metadata: Metadata = {
  title: 'Your Cart | WRISTO Luxury Timepieces',
  description: 'Review your selected luxury timepieces, apply promotional savings, and proceed to secure checkout.',
};

export default function CartPage() {
  return <CartPageClient />;
}
