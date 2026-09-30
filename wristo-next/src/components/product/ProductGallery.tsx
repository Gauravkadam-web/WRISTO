'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Product } from '@/types/product';

interface ProductGalleryProps {
  product: Product;
}

export default function ProductGallery({ product }: ProductGalleryProps) {
  // Gallery images: 1. Main watch, 2. Dial macro view, 3. WRISTO Authenticity Seal
  const galleryItems = [
    { id: 'main', src: product.image, alt: `${product.brand} ${product.model} Main View`, label: 'Primary View' },
    { id: 'dial', src: product.image, alt: `${product.brand} ${product.model} Dial Detail`, label: 'Dial Macro', isMacro: true },
    { id: 'seal', src: '/assets/brand/brand-seal.png', alt: 'WRISTO Certified Authenticity Seal', label: 'Horology Seal' }
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const stageRef = useRef<HTMLDivElement>(null);
  const activeItem = galleryItems[activeIndex] || galleryItems[0];

  // 3D Tilt Interaction (Level 3 Depth for PDP, desktop only)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.innerWidth < 1024) return;

    const el = stageRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Perspective: 1200px, rotateX: 1-3deg, rotateY: 2-4deg, scale: 1.01
    const rotateX = ((centerY - y) / centerY) * 2.8;
    const rotateY = ((x - centerX) / centerX) * 3.6;

    const img = el.querySelector<HTMLImageElement>('.pdp-main-img');
    if (img) {
      img.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    }
  };

  const handleMouseLeave = () => {
    const el = stageRef.current;
    if (!el) return;
    const img = el.querySelector<HTMLImageElement>('.pdp-main-img');
    if (img) {
      img.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale(1.0)';
    }
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsLightboxOpen(false);
    };
    if (isLightboxOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
      setZoomLevel(1);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isLightboxOpen]);

  return (
    <div className="pdp-gallery-wrap">
      {/* Left Thumbnail Rail */}
      <div className="pdp-thumbnail-col" role="tablist" aria-label="Watch Gallery Thumbnails">
        {galleryItems.map((item, idx) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={activeIndex === idx}
            aria-label={item.label}
            className={`pdp-thumb-btn ${activeIndex === idx ? 'active' : ''}`}
            onClick={() => setActiveIndex(idx)}
          >
            <img
              src={item.src}
              alt={item.alt}
              style={item.isMacro ? { transform: 'scale(1.45)', objectFit: 'cover' } : {}}
            />
          </button>
        ))}
      </div>

      {/* Main Interactive Stage with Level 3 Depth */}
      <div
        className="pdp-main-image-stage"
        ref={stageRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Badges */}
        <div className="pdp-stage-badges">
          <span className="pill-badge gold">
            {product.badge || 'VERIFIED AUTHENTIC'}
          </span>
          <span className="pdp-caliber-pill">
            {product.movement}
          </span>
        </div>

        {/* Zoom Lightbox Trigger Button */}
        <button
          type="button"
          className="pdp-zoom-trigger-btn"
          onClick={() => setIsLightboxOpen(true)}
          title="Inspect Horological Finish (Click to Zoom)"
          aria-label="Enlarge image"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="11" y1="8" x2="11" y2="14" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
          <span className="pdp-zoom-btn-label">Inspect</span>
        </button>

        {/* Display Watch Image with Crossfade */}
        <div className="pdp-img-container" onClick={() => setIsLightboxOpen(true)}>
          <img
            key={activeItem.src + (activeItem.isMacro ? '-macro' : '')}
            src={activeItem.src}
            alt={activeItem.alt}
            className={`pdp-main-img ${activeItem.isMacro ? 'pdp-macro-crop' : ''}`}
          />
        </div>

        <div className="pdp-stage-watermark">
          SWISS HOROLOGY ARCHIVE &bull; WRISTO
        </div>
      </div>

      {/* Fullscreen Horological Lightbox Modal */}
      {isLightboxOpen && (
        <div className="pdp-lightbox-overlay" onClick={() => setIsLightboxOpen(false)}>
          <div className="pdp-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <div className="pdp-lightbox-header">
              <div>
                <span className="pdp-lightbox-brand">{product.brand}</span>
                <h3 className="pdp-lightbox-title">{product.model} &bull; Horological Macro Inspection</h3>
              </div>
              <div className="pdp-lightbox-controls">
                <button
                  type="button"
                  className="pdp-lightbox-btn"
                  onClick={() => setZoomLevel(prev => Math.min(prev + 0.5, 3))}
                  title="Zoom In"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </button>
                <button
                  type="button"
                  className="pdp-lightbox-btn"
                  onClick={() => setZoomLevel(prev => Math.max(prev - 0.5, 1))}
                  title="Zoom Out"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </button>
                <button
                  type="button"
                  className="pdp-lightbox-btn"
                  onClick={() => setZoomLevel(1)}
                  title="Reset Zoom"
                >
                  Reset
                </button>
                <button
                  type="button"
                  className="pdp-lightbox-btn pdp-lightbox-close"
                  onClick={() => setIsLightboxOpen(false)}
                  title="Close Lightbox"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="pdp-lightbox-stage">
              <img
                src={activeItem.src}
                alt={activeItem.alt}
                className="pdp-lightbox-img"
                style={{ transform: `scale(${zoomLevel})` }}
              />
            </div>

            <div className="pdp-lightbox-footer">
              <span>{product.caseSize} &bull; {product.material} &bull; {product.movement}</span>
              <span>Press ESC to close</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
