import React from 'react';
import type { Metadata } from 'next';
import WishlistClient from './WishlistClient';

export const metadata: Metadata = {
  title: 'My Wishlist | WRISTO Vault Reserves',
  description: 'Manage and review your saved luxury timepieces, reserves, and collector favorites.',
};

export default function WishlistPage() {
  return <WishlistClient />;
}
