import React from 'react';
import Link from 'next/link';
import { Clock } from 'lucide-react';
import { getFeaturedProducts } from '@/services/productService';
import ProductCard from '@/components/catalog/ProductCard';

export const metadata = {
  title: '404 — Page Not Found | WRISTO Luxury Watches',
  description: 'The timepiece or page you are looking for could not be found.',
};

export default async function NotFound() {
  const showcaseProducts = await getFeaturedProducts(3);

  return (
    <div className="not-found-wrapper">
      <div className="not-found-card">
        <div className="not-found-deviation-badge">
          <Clock size={13} strokeWidth={1.5} />
          <span>PAGE NOT FOUND</span>
        </div>

        <div className="not-found-dial-graphic">
          <span className="not-found-code">404</span>
        </div>

        <h1 className="not-found-title">We Couldn&apos;t Find That Watch</h1>
        <p className="not-found-desc">
          The watch you are looking for is currently unavailable, out of stock, or has been removed.
        </p>

        <div className="not-found-actions">
          <Link href="/watches" className="not-found-btn-primary">
            <span>Explore All Watches</span>
            <span>&rarr;</span>
          </Link>
          <Link href="/concierge" className="not-found-btn-secondary">
            <span>AI Concierge</span>
          </Link>
          <Link href="/" className="not-found-btn-secondary">
            <span>Return to Home</span>
          </Link>
        </div>
      </div>

      <div className="not-found-curated-showcase">
        <h2 className="not-found-showcase-title">Recommended Watches</h2>
        <div className="not-found-showcase-grid">
          {showcaseProducts.map((watch) => (
            <ProductCard key={watch.id} product={watch} />
          ))}
        </div>
      </div>
    </div>
  );
}
