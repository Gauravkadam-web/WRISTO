import React from 'react';
import Link from 'next/link';
import { Clock } from 'lucide-react';
import { PRODUCTS } from '@/data/products';
import ProductCard from '@/components/catalog/ProductCard';

export const metadata = {
  title: '404 — Horological Deviation | WRISTO Luxury Watches',
  description: 'The requested time caliber or editorial reference could not be located in our salon archives.',
};

export default function NotFound() {
  const showcaseProducts = PRODUCTS.slice(0, 3);

  return (
    <div className="not-found-wrapper">
      <div className="not-found-card">
        <div className="not-found-deviation-badge">
          <Clock size={13} strokeWidth={1.5} />
          <span>Archive Deviation Notice</span>
        </div>

        <div className="not-found-dial-graphic">
          <span className="not-found-code">404</span>
        </div>

        <h1 className="not-found-title">Horological Deviation</h1>
        <p className="not-found-desc">
          The reference caliber or editorial archival record you are seeking has deviated from our catalog timeline or does not exist.
        </p>

        <div className="not-found-actions">
          <Link href="/watches" className="not-found-btn-primary">
            <span>Explore Curated Catalog</span>
            <span>&rarr;</span>
          </Link>
          <Link href="/concierge" className="not-found-btn-secondary">
            <span>Consult AI Watch Concierge</span>
          </Link>
          <Link href="/" className="not-found-btn-secondary">
            <span>Return to Salon Home</span>
          </Link>
        </div>
      </div>

      <div className="not-found-curated-showcase">
        <h2 className="not-found-showcase-title">Exemplary Timepieces Recommended for You</h2>
        <div className="not-found-showcase-grid">
          {showcaseProducts.map((watch) => (
            <ProductCard key={watch.id} product={watch} />
          ))}
        </div>
      </div>
    </div>
  );
}
