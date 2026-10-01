'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { PRODUCTS } from '@/data/products';

export default function WishlistTab() {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart, openCartDrawer } = useCart();

  const savedWatches = PRODUCTS.filter(p => wishlist.includes(p.id));

  const handleMoveToBag = (productId: string) => {
    addToCart(productId, 1);
    openCartDrawer();
  };

  return (
    <div className="account-wishlist-content">
      <div className="account-orders-header">
        <div>
          <h2 className="account-section-title">Private Collector Vault</h2>
          <p className="account-section-subtitle">
            Curated selection of coveted timepieces reserved for future acquisition and technical comparison.
          </p>
        </div>
      </div>

      {savedWatches.length === 0 ? (
        <div className="account-orders-empty">
          <div style={{ fontSize: '42px', marginBottom: '16px' }}>💎</div>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', marginBottom: '8px' }}>
            Your Private Vault is Empty
          </h3>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', maxWidth: '440px', margin: '0 auto 24px' }}>
            You haven&apos;t earmarked any timepieces for your private collection. Explore our curated master archives to save rare pieces.
          </p>
          <Link href="/watches" className="btn btn-primary">
            Explore Master Archive &rarr;
          </Link>
        </div>
      ) : (
        <div className="account-wishlist-grid">
          {savedWatches.map(watch => (
            <div key={watch.id} className="account-wishlist-card">
              <button
                type="button"
                className="account-wishlist-remove-btn"
                onClick={() => toggleWishlist(watch.id)}
                title="Remove from Vault"
                aria-label="Remove from Vault"
              >
                &times;
              </button>

              <Link href={`/product/${watch.id}`} className="account-wishlist-img-box">
                <Image
                  src={watch.image}
                  alt={`${watch.brand} ${watch.model}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 320px"
                  style={{ objectFit: 'contain', padding: '16px' }}
                />
              </Link>

              <div className="account-wishlist-details">
                <span className="account-wishlist-brand">{watch.brand}</span>
                <Link href={`/product/${watch.id}`} className="account-wishlist-name">
                  {watch.model}
                </Link>
                <div className="account-wishlist-specs">
                  {watch.movement} &bull; {watch.caseSize}mm
                </div>
                <div className="account-wishlist-price">
                  ₹{watch.price.toLocaleString('en-IN')}
                </div>

                <div className="account-wishlist-actions">
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    style={{ width: '100%' }}
                    onClick={() => handleMoveToBag(watch.id)}
                  >
                    Move to Shopping Bag &rarr;
                  </button>
                  <Link
                    href={`/product/${watch.id}`}
                    className="btn btn-outline btn-sm"
                    style={{ width: '100%', textAlign: 'center' }}
                  >
                    Inspect Timepiece
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
