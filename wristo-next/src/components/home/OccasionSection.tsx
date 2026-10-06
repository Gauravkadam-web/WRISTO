'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

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
  const sectionRef = useRef<HTMLElement>(null);

  const handlePrev = () => {
    setActivePage((prev) => (prev > 1 ? prev - 1 : totalPages));
  };

  const handleNext = () => {
    setActivePage((prev) => (prev < totalPages ? prev + 1 : 1));
  };

  // ScrollTrigger luxury stagger reveal
  useEffect(() => {
    if (!sectionRef.current || typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      const cards = sectionRef.current?.querySelectorAll('.occasion-card');
      if (cards && cards.length > 0) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="section occasion-section" aria-label="Curated Occasions" ref={sectionRef}>
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
