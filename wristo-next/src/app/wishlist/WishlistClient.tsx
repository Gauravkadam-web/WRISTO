'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { PRODUCTS } from '@/data/products';

export default function WishlistClient() {
  const { wishlist, toggleWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  const wishlistProducts = PRODUCTS.filter((p) => wishlist.includes(p.id));

  return (
    <div className="container wishlist-page-container">
      {/* Breadcrumb Navigation */}
      <nav className="breadcrumb-nav" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">My Wishlist</span>
      </nav>

      {/* Page Header */}
      <div className="wishlist-page-header">
        <div>
          <div className="section-label">COLLECTOR RESERVES</div>
          <h1 className="wishlist-page-title">
            My Wishlist{' '}
            <span className="wishlist-count-badge">
              ({wishlistProducts.length} {wishlistProducts.length === 1 ? 'Item' : 'Items'})
            </span>
          </h1>
        </div>

        {wishlistProducts.length > 0 && (
          <button
            type="button"
            className="wishlist-clear-btn"
            onClick={clearWishlist}
            title="Remove all saved watches"
          >
            Clear All &rarr;
          </button>
        )}
      </div>

      {wishlistProducts.length === 0 ? (
        /* Empty State */
        <div className="wishlist-empty-card">
          <div className="wishlist-empty-icon" aria-hidden="true">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </div>
          <h2 className="wishlist-empty-title">Your Wishlist is Empty</h2>
          <p className="wishlist-empty-subtitle">
            Explore our curated catalogue of luxury mechanical and minimalist timepieces and save your favorites to review later.
          </p>
          <Link href="/watches" className="btn btn-champagne">
            Explore Timepieces &rarr;
          </Link>
        </div>
      ) : (
        /* Desktop Table / Row Layout (Panel 8 Parity) */
        <div className="wishlist-table-wrap">
          <table className="wishlist-table" aria-label="Wishlist items table">
            <thead>
              <tr>
                <th scope="col" style={{ width: '44%' }}>Timepiece</th>
                <th scope="col" style={{ width: '18%' }}>Price</th>
                <th scope="col" style={{ width: '16%' }}>Stock Status</th>
                <th scope="col" style={{ width: '14%' }}>Action</th>
                <th scope="col" style={{ width: '8%', textAlign: 'center' }}>Remove</th>
              </tr>
            </thead>
            <tbody>
              {wishlistProducts.map((watch) => {
                const discount = Math.round((1 - watch.price / watch.originalPrice) * 100);
                const isLowStock = watch.price > 12000;

                return (
                  <tr key={watch.id} className="wishlist-row">
                    {/* Timepiece Info */}
                    <td>
                      <div className="wishlist-product-cell">
                        <Link href={`/product/${watch.id}`} className="wishlist-thumbnail-wrap">
                          <Image
                            src={watch.image}
                            alt={watch.model}
                            width={72}
                            height={72}
                            className="wishlist-thumbnail-img"
                          />
                        </Link>
                        <div className="wishlist-info">
                          <span className="wishlist-brand-tag">{watch.brand} &bull; {watch.movement}</span>
                          <Link href={`/product/${watch.id}`} className="wishlist-model-title">
                            {watch.model}
                          </Link>
                          <span className="wishlist-specs-sub">Case: {watch.caseSize} &bull; {watch.strap}</span>
                        </div>
                      </div>
                    </td>

                    {/* Pricing */}
                    <td>
                      <div className="wishlist-price-cell">
                        <span className="wishlist-price-current">
                          ₹{watch.price.toLocaleString('en-IN')}
                        </span>
                        {watch.originalPrice > watch.price && (
                          <div className="wishlist-price-meta">
                            <span className="wishlist-price-orig">
                              ₹{watch.originalPrice.toLocaleString('en-IN')}
                            </span>
                            <span className="wishlist-discount-tag">{discount}% OFF</span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Stock Status Pill */}
                    <td>
                      {isLowStock ? (
                        <span className="stock-pill low-stock">
                          <span className="stock-dot" />
                          Low Stock
                        </span>
                      ) : (
                        <span className="stock-pill in-stock">
                          <span className="stock-dot" />
                          In Stock
                        </span>
                      )}
                    </td>

                    {/* Add to Cart Action */}
                    <td>
                      <button
                        type="button"
                        className="btn btn-wishlist-cart"
                        onClick={() => addToCart(watch.id)}
                        title={`Add ${watch.model} to shopping cart`}
                      >
                        Add to Cart 🛒
                      </button>
                    </td>

                    {/* Remove Action */}
                    <td style={{ textAlign: 'center' }}>
                      <button
                        type="button"
                        className="wishlist-delete-btn"
                        onClick={() => toggleWishlist(watch.id)}
                        title={`Remove ${watch.model} from wishlist`}
                        aria-label={`Remove ${watch.model}`}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <path d="M3 6h18" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
