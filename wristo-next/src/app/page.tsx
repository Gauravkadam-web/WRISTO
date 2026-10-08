import React from 'react';
import Link from 'next/link';
import Hero from '@/components/home/Hero';
import TrustStrip from '@/components/home/TrustStrip';
import PopularBrands from '@/components/home/PopularBrands';
import OccasionSection from '@/components/home/OccasionSection';
import EditorialBanner from '@/components/home/EditorialBanner';
import AppPromoSection from '@/components/home/AppPromoSection';
import BlogPreviewSection from '@/components/home/BlogPreviewSection';
import ProductCard from '@/components/catalog/ProductCard';
import { getFeaturedProducts, getCatalogProducts } from '@/services/productService';

export default async function HomePage() {
  const [featuredWatches, automaticResult] = await Promise.all([
    getFeaturedProducts(8).catch(() => []),
    getCatalogProducts({ category: 'automatic' }, 'popularity', 1, 4).catch(() => ({
      items: [],
      total: 0,
      page: 1,
      pageSize: 4,
      totalPages: 0,
      facetCounts: { brands: {}, movements: {}, styles: {}, gender: {}, straps: {} }
    }))
  ]);

  const trendingWatches = featuredWatches || [];
  const automaticWatches = automaticResult?.items || [];

  return (
    <>
      {/* 1. Cinematic Hero Section */}
      <Hero />

      {/* 2. Luxury Trust Strip (4 Reference Points) */}
      <TrustStrip />

      {/* 3. Popular Brands & Bezel Banner (Panel 5 Parity) */}
      <PopularBrands />

      {/* 4. Trending Timepieces (8-Watch Catalog Grid) */}
      <section className="section" aria-label="Trending Timepieces">
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
            {trendingWatches.map((watch, index) => (
              <ProductCard key={watch?.id || `trending-${index}`} product={watch} priority={index < 4} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Curated Occasions (Panel 6 Parity: Formal, Casual, Sports, Luxury) */}
      <OccasionSection />

      {/* 6. Editorial Campaign Banner ("Modern Looks. Timeless Feel.") strictly after Trending/Occasions */}
      <EditorialBanner />

      {/* 7. Mobile App Promotion Section (Panel 7 Parity) */}
      <AppPromoSection />

      {/* 8. From Our Blog Section (Panel 11 Parity) */}
      <BlogPreviewSection />

      {/* 9. Mechanical & Skeleton Souls Showcase */}
      <section className="section section-dark" aria-label="Mechanical and Skeleton Calibers">
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
            {automaticWatches.map((watch, index) => (
              <ProductCard key={watch?.id || `auto-${index}`} product={watch} />
            ))}
          </div>
        </div>
      </section>

      {/* 10. AI Watch Concierge Interactive Prompt Teaser */}
      <section className="section" style={{ paddingBottom: 'var(--space-16)' }} aria-label="AI Concierge Assistant">
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
              <Link href="/concierge" className="btn btn-champagne btn-lg">
                Start AI Consultation &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
