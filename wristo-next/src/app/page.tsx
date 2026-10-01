import React from 'react';
import Link from 'next/link';
import Hero from '@/components/home/Hero';
import TrustStrip from '@/components/home/TrustStrip';
import EditorialBanner from '@/components/home/EditorialBanner';
import ProductCard from '@/components/catalog/ProductCard';
import { getFeaturedProducts } from '@/services/productService';
import { COLLECTIONS } from '@/data/collections';
import { PRODUCTS } from '@/data/products';

export default async function HomePage() {
  const featuredWatches = await getFeaturedProducts(8);
  const automaticWatches = PRODUCTS.filter(p => p.movement === 'Automatic').slice(0, 4);

  return (
    <>
      {/* 1. Cinematic Hero Section */}
      <Hero />

      {/* 2. Luxury Trust Strip */}
      <TrustStrip />

      {/* 3. AI Watch Concierge Interactive Prompt Teaser */}
      <section className="section" style={{ paddingBottom: 'var(--space-10)' }}>
        <div className="container">
          <div className="ai-teaser-banner">
            <div style={{ maxWidth: '640px' }}>
              <div className="pill-badge gold" style={{ marginBottom: '12px' }}>
                INTELLIGENT STYLING ASSISTANT
              </div>
              <h2 className="ai-teaser-title">
                Find Your Watch with AI Concierge
              </h2>
              <p style={{ fontSize: '14px', color: '#CCCCCC', lineHeight: 1.6, marginBottom: '20px' }}>
                Describe your desired movement, lifestyle aesthetic, or upcoming occasion. Our horological neural index matches your parameters across our 40-watch catalog.
              </p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <Link href="/watches?q=minimal" className="pill-badge black" style={{ background: '#222' }}>
                  &ldquo;Minimal dress watch under ₹10,000&rdquo;
                </Link>
                <Link href="/watches?category=automatic" className="pill-badge black" style={{ background: '#222' }}>
                  &ldquo;Mechanical automatic with sapphire crystal&rdquo;
                </Link>
                <Link href="/watches?category=chronograph" className="pill-badge black" style={{ background: '#222' }}>
                  &ldquo;Sport chronograph for weekend wear&rdquo;
                </Link>
              </div>
            </div>
            <div style={{ alignSelf: 'center' }}>
              <Link href="/watches" className="btn btn-champagne btn-lg">
                Explore All 40 Watches &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Trending Timepieces (8-Watch Catalog Grid) */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <div className="section-label">HOROLOGICAL EXCELLENCE</div>
              <h2 className="section-title">Trending Timepieces</h2>
              <p className="section-subtitle">
                The most sought-after mechanical calibers, classic dress watches, and architectural chronographs of the season.
              </p>
            </div>
            <Link href="/watches" className="view-all-link">
              View All 40 Watches &rarr;
            </Link>
          </div>

          <div className="product-grid">
            {featuredWatches.map((watch) => (
              <ProductCard key={watch.id} product={watch} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Editorial Campaign Banner ("Modern Looks. Timeless Feel.") strictly after Trending */}
      <EditorialBanner />

      {/* 6. Curated Editorial Collections */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-header">
            <div>
              <div className="section-label">CURATED NARRATIVES</div>
              <h2 className="section-title">Lifestyle Collections</h2>
              <p className="section-subtitle">
                Timepieces grouped by lifestyle occasion, architectural finish, and horological identity.
              </p>
            </div>
          </div>

          <div className="collections-grid">
            {COLLECTIONS.slice(0, 3).map((col) => (
              <div
                key={col.id}
                className="collection-card"
                style={{ background: col.bgGradient || 'linear-gradient(135deg, #1C1A17 0%, #2E2822 100%)' }}
              >
                <div className="collection-card-content">
                  <span className="collection-tag">{col.bannerTag}</span>
                  <h3 className="collection-title">{col.title}</h3>
                  <p className="collection-desc">{col.description}</p>
                  <Link
                    href={`/watches?style=${col.id === 'quiet-luxury' ? 'Minimal' : col.id === 'everyday-icons' ? 'Classic' : 'Automatic'}`}
                    className="btn btn-outline-white btn-sm"
                    style={{ alignSelf: 'flex-start', marginTop: '12px' }}
                  >
                    Explore Collection &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Mechanical & Skeleton Souls Showcase */}
      <section className="section section-dark">
        <div className="container">
          <div className="section-header">
            <div>
              <div className="section-label" style={{ color: 'var(--color-accent-champagne)' }}>
                HOROLOGICAL PURITY
              </div>
              <h2 className="section-title">Mechanical &amp; Skeleton Souls</h2>
              <p className="section-subtitle" style={{ color: '#999999' }}>
                Real automatic calibers with 21,600+ vibrations per hour, sapphire exhibition windows, and zero battery required.
              </p>
            </div>
            <Link
              href="/watches?category=automatic"
              className="view-all-link"
              style={{ color: 'var(--color-accent-champagne)' }}
            >
              See All Automatics &rarr;
            </Link>
          </div>

          <div className="product-grid">
            {automaticWatches.map((watch) => (
              <ProductCard key={watch.id} product={watch} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
