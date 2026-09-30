import React from 'react';
import { Product } from '@/types/product';
import ProductCard from '@/components/catalog/ProductCard';

interface CoordinatedWatchesProps {
  products: Product[];
  currentBrand: string;
}

export default function CoordinatedWatches({ products, currentBrand }: CoordinatedWatchesProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="pdp-coordinated-section" aria-labelledby="coordinated-heading">
      <div className="container">
        <div className="section-header pdp-coordinated-header">
          <div>
            <div className="section-label">COORDINATED HOROLOGY</div>
            <h2 className="section-title" id="coordinated-heading">
              Similar &amp; Alternative Timepieces
            </h2>
            <p className="section-subtitle">
              Carefully curated watches sharing mechanical calibers, case finishing, or horological heritage from {currentBrand} and companion manufactures.
            </p>
          </div>
        </div>

        <div className="product-grid pdp-coordinated-grid">
          {products.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
