'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { RotateCw, Layers, ZoomIn, X, RotateCcw, Maximize2, Box } from 'lucide-react';
import { Product } from '@/types/product';
import ExplodedCaliberModal from './ExplodedCaliberModal';

const Watch3DCanvas = dynamic(() => import('./Watch3DCanvas'), {
  ssr: false,
  loading: () => (
    <div className="watch-3d-stage-container flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <RotateCw className="animate-spin text-amber-300" size={28} />
        <span className="text-xs uppercase tracking-widest text-amber-200 font-medium">
          Loading 3D Horology Stage...
        </span>
      </div>
    </div>
  ),
});

interface ProductGalleryProps {
  product: Product;
}

export default function ProductGallery({ product }: ProductGalleryProps) {
  // Gallery items: 1. Primary view, 2. Dial macro view, 3. 3D WebGL Stage, 4. WRISTO Authenticity Seal
  const galleryItems = [
    { id: 'main', src: product.image, alt: `${product.brand} ${product.model} Main View`, label: 'Primary View' },
    { id: 'dial', src: product.image, alt: `${product.brand} ${product.model} Dial Detail`, label: 'Dial Macro', isMacro: true },
    { id: '3d', src: product.image, alt: `${product.brand} ${product.model} 3D Model`, label: '3D WebGL Model', is3D: true },
    { id: 'seal', src: '/assets/brand/brand-seal.png', alt: 'WRISTO Certified Authenticity Seal', label: 'Horology Seal' }
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isExplodedOpen, setIsExplodedOpen] = useState(false);
  const [is360Mode, setIs360Mode] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [glintOffset, setGlintOffset] = useState({ x: 50, y: 50 });

  const stageRef = useRef<HTMLDivElement>(null);
  const activeItem = galleryItems[activeIndex] || galleryItems[0];

  // 3D Tilt Interaction (Level 3 Depth for PDP, desktop only, photo mode only)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.innerWidth < 1024) return;
    if (is360Mode) return;

    const el = stageRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Glint coordinates for sapphire crystal reflection
    setGlintOffset({
      x: Math.round((x / rect.width) * 100),
      y: Math.round((y / rect.height) * 100)
    });

    const rotateX = ((centerY - y) / centerY) * 3.2;
    const rotateY = ((x - centerX) / centerX) * 4.2;

    const img = el.querySelector<HTMLImageElement>('.pdp-main-img');
    if (img) {
      img.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    }
  };

  const handleMouseLeave = () => {
    const el = stageRef.current;
    if (!el || is360Mode) return;
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
        {galleryItems.map((item, idx) => {
          const isSelected = item.is3D ? is360Mode : (!is360Mode && activeIndex === idx);
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              aria-label={item.label}
              className={`pdp-thumb-btn ${isSelected ? 'active' : ''}`}
              onClick={() => {
                if (item.is3D) {
                  setIs360Mode(true);
                } else {
                  setIs360Mode(false);
                  setActiveIndex(idx);
                }
              }}
            >
              {item.is3D ? (
                <div className="pdp-thumb-3d-badge">
                  <Box size={18} strokeWidth={1.8} />
                  <span>3D VIEW</span>
                </div>
              ) : (
                <img
                  src={item.src}
                  alt={item.alt}
                  style={item.isMacro ? { transform: 'scale(1.45)', objectFit: 'cover' } : {}}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Main Interactive Stage */}
      <div className="pdp-stage-column">
        <div
          className={`pdp-main-image-stage ${is360Mode ? 'pdp-turntable-active' : ''}`}
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

          {/* Conditional Rendering: Real 3D WebGL Watch Model vs Studio Photo */}
          {is360Mode ? (
            <Watch3DCanvas product={product} />
          ) : (
            <>
              {/* Zoom Lightbox Trigger Button */}
              <button
                type="button"
                className="pdp-zoom-trigger-btn"
                onClick={() => setIsLightboxOpen(true)}
                title="Inspect Horological Finish (Click to Zoom)"
                aria-label="Enlarge image"
              >
                <ZoomIn size={16} strokeWidth={2} />
                <span className="pdp-zoom-btn-label">Inspect</span>
              </button>

              {/* Display High-Res Watch Studio Photography */}
              <div
                className="pdp-img-container"
                onClick={() => setIsLightboxOpen(true)}
              >
                <img
                  key={activeItem.src + (activeItem.isMacro ? '-macro' : '')}
                  src={activeItem.src}
                  alt={activeItem.alt}
                  className={`pdp-main-img ${activeItem.isMacro ? 'pdp-macro-crop' : ''}`}
                />

                {/* Dynamic Sapphire Crystal Glint Overlay */}
                <div
                  className="pdp-sapphire-glint-layer"
                  style={{
                    background: `radial-gradient(circle at ${glintOffset.x}% ${glintOffset.y}%, rgba(255,255,255,0.32) 0%, rgba(222,192,149,0.15) 30%, transparent 65%)`,
                  }}
                  aria-hidden="true"
                />
              </div>
            </>
          )}

          <div className="pdp-stage-watermark">
            SWISS HOROLOGY ARCHIVE &bull; WRISTO
          </div>
        </div>

        {/* Tactical 3D Inspection Action Toolbar */}
        <div className="pdp-stage-toolbar">
          <button
            type="button"
            className={`pdp-stage-tool-btn ${is360Mode ? 'active' : ''}`}
            onClick={() => setIs360Mode(!is360Mode)}
          >
            {is360Mode ? <RotateCcw size={14} strokeWidth={1.8} /> : <RotateCw size={14} strokeWidth={1.8} />}
            <span>{is360Mode ? 'Exit 3D Model Stage' : 'Launch 360° 3D Model'}</span>
          </button>

          <button
            type="button"
            className="pdp-stage-tool-btn"
            onClick={() => setIsExplodedOpen(true)}
          >
            <Layers size={14} strokeWidth={1.8} />
            <span>Exploded Caliber View</span>
          </button>
        </div>
      </div>

      {/* Exploded Caliber Modal */}
      <ExplodedCaliberModal
        product={product}
        isOpen={isExplodedOpen}
        onClose={() => setIsExplodedOpen(false)}
      />

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
                  <Maximize2 size={16} strokeWidth={2} />
                </button>
                <button
                  type="button"
                  className="pdp-lightbox-btn"
                  onClick={() => setZoomLevel(prev => Math.max(prev - 0.5, 1))}
                  title="Zoom Out"
                >
                  <RotateCcw size={16} strokeWidth={2} />
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
                  <X size={18} strokeWidth={2} />
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
