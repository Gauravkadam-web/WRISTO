'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Brand } from '@/types/product';
import { brandService } from '@/services/brandService';

export default function BrandsClient() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadBrands() {
      try {
        const liveBrands = await brandService.getAllBrands();
        setBrands(liveBrands || []);
      } catch {
        setBrands([]);
      } finally {
        setIsLoading(false);
      }
    }
    loadBrands();
  }, []);

  return (
    <div className="container brands-page-container">
      {/* Breadcrumb */}
      <nav className="breadcrumb-nav" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">Brand Houses</span>
      </nav>

      {/* Page Header */}
      <div className="brands-page-header">
        <div className="section-label">CURATED HOUSES</div>
        <h1 className="brands-page-title">Curated Brand Houses</h1>
        <p className="brands-page-subtitle">
          Discover the master watchmakers and heritage manufactures shaping global horology. Every house in the WRISTO vault is 100% certified with international brand warranty.
        </p>
      </div>

      {/* Brand Houses Showcase Grid */}
      <div className="brand-houses-grid">
        {brands.map((brand) => (
          <div key={brand.name} className="brand-house-card">
            <div className="brand-house-top">
              <div className="brand-house-monogram" aria-hidden="true">
                {brand.name.slice(0, 1)}
              </div>
              <div className="brand-house-badge">
                {brand.country}
              </div>
            </div>

            <div className="brand-house-body">
              <h2 className="brand-house-name">{brand.name}</h2>
              <div className="brand-house-tagline">{brand.headline}</div>
              <p className="brand-house-desc">{brand.description}</p>
            </div>

            <div className="brand-house-footer">
              <span className="brand-house-count">
                {brand.watchCount} Timepieces Available
              </span>
              <Link
                href={`/watches?brand=${encodeURIComponent(brand.name)}`}
                className="btn btn-brand-explore"
              >
                Explore Collection &rarr;
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
