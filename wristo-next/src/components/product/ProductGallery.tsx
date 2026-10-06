'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { RotateCw, Layers, ZoomIn, X, RotateCcw, Maximize2 } from 'lucide-react';
import { Product } from '@/types/product';
import ExplodedCaliberModal from './ExplodedCaliberModal';

interface ProductGalleryProps {
  product: Product;
}

export default function ProductGallery({ product }: ProductGalleryProps) {
  // Gallery items: 1. Primary view, 2. Dial macro view, 3. WRISTO Authenticity Seal
  const galleryItems = [
    { id: 'main', src: product.image, alt: `${product.brand} ${product.model} Main View`, label: 'Primary View' },
    { id: 'dial', src: product.image, alt: `${product.brand} ${product.model} Dial Detail`, label: 'Dial Macro', isMacro: true },
    { id: 'seal', src: '/assets/brand/brand-seal.png', alt: 'WRISTO Certified Authenticity Seal', label: 'Horology Seal' }
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isExplodedOpen, setIsExplodedOpen] = useState(false);
  const [is360Mode, setIs360Mode] = useState(false);
  const [turntableAngle, setTurntableAngle] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [glintOffset, setGlintOffset] = useState({ x: 50, y: 50 });

  const stageRef = useRef<HTMLDivElement>(null);
  const isDragging360Ref = useRef(false);
  const startDragXRef = useRef(0);
  const startAngleRef = useRef(0);

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

    // Glint coordinates for sapphire crystal reflection
    setGlintOffset({
      x: Math.round((x / rect.width) * 100),
      y: Math.round((y / rect.height) * 100)
    });

    if (is360Mode) {
      if (isDragging360Ref.current) {
        const deltaX = e.clientX - startDragXRef.current;
        setTurntableAngle(startAngleRef.current + deltaX * 0.65);
      }
      return;
    }

    // Standard subtle gyro-tilt when not in 360 mode
    const rotateX = ((centerY - y) / centerY) * 3.2;
    const rotateY = ((x - centerX) / centerX) * 4.2;

    const img = el.querySelector<HTMLImageElement>('.pdp-main-img');
    if (img) {
      img.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!is360Mode) return;
    isDragging360Ref.current = true;
    startDragXRef.current = e.clientX;
    startAngleRef.current = turntableAngle;
  };

  const handleMouseUp = () => {
    isDragging360Ref.current = false;
  };

  const handleMouseLeave = () => {
    isDragging360Ref.current = false;
    const el = stageRef.current;
    if (!el || is360Mode) return;
    const img = el.querySelector<HTMLImageElement>('.pdp-main-img');
    if (img) {
      img.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale(1.0)';
    }
  };

  // Touch Support for 360° Drag
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!is360Mode || e.touches.length === 0) return;
    isDragging360Ref.current = true;
    startDragXRef.current = e.touches[0].clientX;
    startAngleRef.current = turntableAngle;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!is360Mode || !isDragging360Ref.current || e.touches.length === 0) return;
    const deltaX = e.touches[0].clientX - startDragXRef.current;
    setTurntableAngle(startAngleRef.current + deltaX * 0.7);
  };

  const handleTouchEnd = () => {
    isDragging360Ref.current = false;
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
            onClick={() => {
              setActiveIndex(idx);
              setIs360Mode(false);
            }}
          >
            <img
              src={item.src}
              alt={item.alt}
              style={item.isMacro ? { transform: 'scale(1.45)', objectFit: 'cover' } : {}}
            />
          </button>
        ))}
      </div>

      {/* Main Interactive Stage */}
      <div className="pdp-stage-column">
        <div
          className={`pdp-main-image-stage ${is360Mode ? 'pdp-turntable-active' : ''}`}
          ref={stageRef}
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{ cursor: is360Mode ? (isDragging360Ref.current ? 'grabbing' : 'grab') : 'default' }}
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
            <ZoomIn size={16} strokeWidth={2} />
            <span className="pdp-zoom-btn-label">Inspect</span>
          </button>

          {/* Display Watch Image with 360 Turntable Transform */}
          <div
            className="pdp-img-container"
            onClick={() => {
              if (!is360Mode) setIsLightboxOpen(true);
            }}
          >
            <img
              key={activeItem.src + (activeItem.isMacro ? '-macro' : '')}
              src={activeItem.src}
              alt={activeItem.alt}
              className={`pdp-main-img ${activeItem.isMacro ? 'pdp-macro-crop' : ''}`}
              style={
                is360Mode
                  ? {
                      transform: `perspective(1200px) rotateY(${turntableAngle}deg)`,
                      transition: isDragging360Ref.current ? 'none' : 'transform 0.15s ease-out',
                    }
                  : undefined
              }
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

          {/* 360 Turntable Instruction Floating Pill */}
          {is360Mode && (
            <div className="pdp-turntable-instruction-pill" aria-hidden="true">
              <RotateCw size={13} strokeWidth={2} className="spin-slow" />
              <span>Drag to rotate timepiece &bull; {Math.round(((turntableAngle % 360) + 360) % 360)}°</span>
            </div>
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
            onClick={() => {
              setIs360Mode(!is360Mode);
              if (!is360Mode) setTurntableAngle(0);
            }}
          >
            <RotateCw size={14} strokeWidth={1.8} />
            <span>{is360Mode ? 'Exit 360° Stage' : '360° Turntable Mode'}</span>
          </button>

          <button
            type="button"
            className="pdp-stage-tool-btn"
            onClick={() => setIsExplodedOpen(true)}
          >
            <Layers size={14} strokeWidth={1.8} />
            <span>Exploded Caliber View</span>
          </button>

          {is360Mode && (
            <button
              type="button"
              className="pdp-stage-tool-btn reset"
              onClick={() => setTurntableAngle(0)}
              title="Reset angle to 0°"
            >
              <RotateCcw size={13} strokeWidth={2} />
              <span>Reset 0°</span>
            </button>
          )}
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
