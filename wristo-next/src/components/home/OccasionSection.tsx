'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface OccasionItem {
  id: string;
  title: string;
  count: string;
  image: string;
  link: string;
  tagline: string;
}

const OCCASIONS: OccasionItem[] = [
  {
    id: 'formal',
    title: 'Formal',
    count: '312 Items',
    image: '/assets/occasions/occasion-formal.png',
    link: '/watches?style=Formal',
    tagline: 'Boardrooms & Galas',
  },
  {
    id: 'casual',
    title: 'Casual',
    count: '489 Items',
    image: '/assets/occasions/occasion-casual.png',
    link: '/watches?style=Casual',
    tagline: 'Daily Sophistication',
  },
  {
    id: 'sports',
    title: 'Sports',
    count: '256 Items',
    image: '/assets/occasions/occasion-sports.png',
    link: '/watches?style=Sports',
    tagline: 'Chronographs & Divers',
  },
  {
    id: 'luxury',
    title: 'Luxury',
    count: '198 Items',
    image: '/assets/occasions/occasion-luxury.png',
    link: '/watches?style=Luxury',
    tagline: 'Haute Horlogerie',
  },
];

export default function OccasionSection() {
  const [activePage, setActivePage] = useState(1);
  const totalPages = 2;

  const handlePrev = () => {
    setActivePage((prev) => (prev > 1 ? prev - 1 : totalPages));
  };

  const handleNext = () => {
    setActivePage((prev) => (prev < totalPages ? prev + 1 : 1));
  };

  return (
    <section className="section occasion-section" aria-label="Curated Occasions">
      <div className="container">
        {/* Header Block with Left CTA & Right Carousel Controls */}
        <div className="occasion-header-wrap">
          <div className="occasion-header-left">
            <div className="section-label">CURATED COLLECTION</div>
            <h2 className="section-title">For Every Occasion</h2>
            <p className="section-subtitle">
              From boardrooms to weekend getaways, find a watch that matches your vibe.
            </p>
            <div className="occasion-cta-box">
              <Link href="/watches" className="btn btn-champagne">
                Explore Collection &rarr;
              </Link>
            </div>
          </div>

          <div className="occasion-controls">
            <span className="occasion-page-number">0{activePage}</span>
            <div className="occasion-nav-btns">
              <button
                type="button"
                className="occasion-nav-btn"
                onClick={handlePrev}
                aria-label="Previous occasions slide"
              >
                &larr;
              </button>
              <button
                type="button"
                className="occasion-nav-btn"
                onClick={handleNext}
                aria-label="Next occasions slide"
              >
                &rarr;
              </button>
            </div>
          </div>
        </div>

        {/* 4 Tall Photographic Cards Grid */}
        <div className="occasion-cards-grid">
          {OCCASIONS.map((item) => (
            <Link
              key={item.id}
              href={item.link}
              className="occasion-card"
              title={`Explore ${item.title} watches (${item.count})`}
            >
              <div
                className="occasion-card-img"
                style={{ backgroundImage: `url(${item.image})` }}
              />
              <div className="occasion-card-overlay" />
              <div className="occasion-card-content">
                <span className="occasion-card-tagline">{item.tagline}</span>
                <h3 className="occasion-card-title">{item.title}</h3>
                <span className="occasion-card-count">{item.count}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
