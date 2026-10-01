'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types/product';
import { useCart } from '@/context/CartContext';

interface CarouselProps {
  products: Product[];
}

export default function FeaturedTimepiecesCarousel({ products }: CarouselProps) {
  const { addToCart } = useCart();
  const [addedIds, setAddedIds] = useState<{ [key: string]: boolean }>({});

  const handleAdd = (id: string) => {
    addToCart(id);
    setAddedIds((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [id]: false }));
    }, 2500);
  };

  return (
    <section className="journal-featured-watches-section">
      <div className="journal-featured-header">
        <span className="journal-featured-eyebrow">CURATED ALLOCATIONS</span>
        <h3 className="journal-featured-title">Timepieces Featured in this Story</h3>
        <p className="journal-featured-desc">
          Acquire or inspect the certified horological references examined throughout this essay.
        </p>
      </div>

      <div className="journal-featured-grid">
        {products.map((watch) => {
          const isAdded = !!addedIds[watch.id];

          return (
            <div key={watch.id} className="journal-featured-card">
              <Link href={`/product/${watch.id}`} className="journal-featured-img-box">
                <Image
                  src={watch.image}
                  alt={`${watch.brand} ${watch.model}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 320px"
                  style={{ objectFit: 'contain', padding: '18px' }}
                />
              </Link>

              <div className="journal-featured-card-body">
                <span className="journal-featured-brand">{watch.brand}</span>
                <Link href={`/product/${watch.id}`} className="journal-featured-model">
                  {watch.model}
                </Link>

                <div className="journal-featured-price-row">
                  <span className="journal-featured-price">
                    ₹{watch.price.toLocaleString('en-IN')}
                  </span>
                  {watch.originalPrice && watch.originalPrice > watch.price && (
                    <span className="journal-featured-orig-price">
                      ₹{watch.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>

                <div className="journal-featured-specs">
                  {watch.movement} &bull; {watch.caseSize} &bull; {watch.waterResistance}
                </div>

                <div className="journal-featured-actions">
                  <button
                    type="button"
                    className={`btn btn-sm ${isAdded ? 'btn-outline' : 'btn-primary'}`}
                    style={{ flex: 1 }}
                    onClick={() => handleAdd(watch.id)}
                  >
                    {isAdded ? '✓ Added' : 'Add to Bag'}
                  </button>
                  <Link
                    href={`/product/${watch.id}`}
                    className="btn btn-outline btn-sm"
                  >
                    Inspect &rarr;
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
