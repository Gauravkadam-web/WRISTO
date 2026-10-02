import React from 'react';
import type { Metadata } from 'next';
import BrandsClient from './BrandsClient';

export const metadata: Metadata = {
  title: 'Brand Houses | WRISTO Curated Watchmakers',
  description: 'Explore our certified luxury brand houses, from Swiss automatic manufactures to Nordic minimalist and precision motorsport chronographs.',
};

export default function BrandsPage() {
  return <BrandsClient />;
}
