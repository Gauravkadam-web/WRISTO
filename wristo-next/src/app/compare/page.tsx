import React from 'react';
import type { Metadata } from 'next';
import ComparisonClient from './ComparisonClient';
import { BreadcrumbsJsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Side-by-Side Horology Matrix | Compare Timepieces | WRISTO',
  description: 'Compare case diameters, mechanical calibers, water resistance, and specifications across up to 4 luxury timepieces side-by-side.',
};

export default function ComparePage() {
  return (
    <>
      <BreadcrumbsJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Timepieces', url: '/watches' },
          { name: 'Spec Comparison Matrix', url: '/compare' },
        ]}
      />
      <ComparisonClient />
    </>
  );
}
