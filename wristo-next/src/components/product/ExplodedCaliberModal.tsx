'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Layers, X, RotateCcw, ShieldCheck, Sparkles, Sliders } from 'lucide-react';
import { Product } from '@/types/product';

interface ExplodedCaliberModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export default function ExplodedCaliberModal({ product, isOpen, onClose }: ExplodedCaliberModalProps) {
  const [explosionProgress, setExplosionProgress] = useState<number>(0.85); // 0 to 1
  const [rotationY, setRotationY] = useState<number>(-22);
  const [rotationX, setRotationX] = useState<number>(18);
  const [activeLayerInfo, setActiveLayerInfo] = useState<string | null>(null);
  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastMousePosRef.current.x;
    const dy = e.clientY - lastMousePosRef.current.y;
    setRotationY(prev => prev + dx * 0.4);
    setRotationX(prev => Math.max(-45, Math.min(45, prev - dy * 0.4)));
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  // 5 Anatomical Layers of Swiss Mechanical Caliber
  const layers = [
    {
      id: 'crystal',
      name: 'Anti-Reflective Sapphire Crystal',
      spec: 'Double-domed corundum sapphire • 9 Mohs hardness • Multi-layer anti-reflective treatment',
      baseZ: 160,
      opacity: 0.88,
      border: 'rgba(255, 255, 255, 0.4)',
      bg: 'radial-gradient(circle at 40% 40%, rgba(255,255,255,0.2) 0%, rgba(70,130,180,0.12) 60%, transparent 100%)',
    },
    {
      id: 'bezel',
      name: 'Precision Outer Bezel & Tachymeter',
      spec: `${product.caseSize} 316L Surgical Stainless Steel • Mirror-polished chamfers • Circular brushed bezel`,
      baseZ: 95,
      opacity: 0.95,
      border: 'rgba(222, 192, 149, 0.5)',
      bg: 'radial-gradient(circle, transparent 65%, rgba(222,192,149,0.25) 85%, rgba(222,192,149,0.4) 100%)',
    },
    {
      id: 'dial',
      name: 'Architectural Guilloché Dial Plate',
      spec: `${product.dial} dial • Hand-applied faceted hour markers • Framed date aperture at 3 o'clock`,
      baseZ: 30,
      opacity: 0.98,
      border: 'rgba(255, 255, 255, 0.2)',
      bg: 'radial-gradient(circle, #151515 0%, #0A0A0C 100%)',
    },
    {
      id: 'escapement',
      name: `${product.movement} Escapement & Hands`,
      spec: 'Diamond-cut faceted hands • 28,800 vibrations per hour (4Hz) • Synthetic ruby pallet fork',
      baseZ: -45,
      opacity: 0.95,
      border: 'rgba(222, 192, 149, 0.4)',
      bg: 'radial-gradient(circle at center, rgba(184,134,11,0.2) 0%, rgba(20,20,20,0.85) 80%)',
    },
    {
      id: 'rotor',
      name: 'Mainplate & Bidirectional Oscillating Rotor',
      spec: 'Circular Côtes de Genève finishing • Heavy metal tungsten winding mass • WRISTO heraldic crest',
      baseZ: -120,
      opacity: 0.92,
      border: 'rgba(255, 255, 255, 0.2)',
      bg: 'radial-gradient(circle at 50% 60%, rgba(222,192,149,0.18) 0%, #0E0E10 80%)',
    },
  ];

  return (
    <div className="exploded-modal-backdrop" onClick={onClose}>
      <div
        className="exploded-modal-container"
        onClick={e => e.stopPropagation()}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {/* Header */}
        <div className="exploded-modal-header">
          <div className="exploded-header-info">
            <span className="exploded-badge">
              <Layers size={13} strokeWidth={2} />
              <span>HOROLOGICAL ARCHITECTURE &bull; 3D CALIBER</span>
            </span>
            <h2 className="exploded-title">{product.brand} {product.model}</h2>
            <p className="exploded-desc">
              Interactive 5-layer mechanical Z-axis exploded stage. Drag horizontally to orbit; adjust separation to inspect internal horological metallurgy.
            </p>
          </div>

          <button
            type="button"
            className="exploded-close-btn"
            onClick={onClose}
            aria-label="Close exploded view"
          >
            <X size={20} strokeWidth={1.8} />
          </button>
        </div>

        {/* 3D Perspective Stage Area */}
        <div
          className="exploded-stage-viewport"
          onMouseDown={handleMouseDown}
          style={{ cursor: isDraggingRef.current ? 'grabbing' : 'grab' }}
        >
          <div
            className="exploded-3d-scene"
            style={{
              transform: `perspective(1200px) rotateX(${rotationX}deg) rotateY(${rotationY}deg)`,
            }}
          >
            {layers.map((layer, index) => {
              const currentZ = layer.baseZ * explosionProgress;
              return (
                <div
                  key={layer.id}
                  className={`exploded-layer-plate ${activeLayerInfo === layer.id ? 'active' : ''}`}
                  style={{
                    transform: `translateZ(${currentZ}px)`,
                    opacity: layer.opacity,
                    borderColor: layer.border,
                    background: layer.bg,
                  }}
                  onMouseEnter={() => setActiveLayerInfo(layer.id)}
                  onMouseLeave={() => setActiveLayerInfo(null)}
                >
                  {/* Layer Center Ring Visual */}
                  <div className="exploded-plate-inner">
                    {layer.id === 'crystal' && (
                      <div className="exploded-glint-line" />
                    )}
                    {layer.id === 'dial' && (
                      <div className="exploded-dial-indices">
                        <span className="dial-index top">XII</span>
                        <span className="dial-index right">III</span>
                        <span className="dial-index bottom">VI</span>
                        <span className="dial-index left">IX</span>
                      </div>
                    )}
                    {layer.id === 'escapement' && (
                      <div className="exploded-hands-graphic">
                        <div className="hand-hour" />
                        <div className="hand-minute" />
                        <div className="balance-wheel-dot" />
                      </div>
                    )}
                    {layer.id === 'rotor' && (
                      <div className="exploded-rotor-crest">
                        <span>W</span>
                        <small>GENÈVE 28,800 VPH</small>
                      </div>
                    )}
                  </div>

                  {/* Layer Label Anchor */}
                  <div
                    className="exploded-layer-callout"
                    style={{
                      transform: `rotateY(${-rotationY}deg) rotateX(${-rotationX}deg)`,
                    }}
                  >
                    <span className="exploded-callout-pill">L0{index + 1} &bull; {layer.name.split(' ')[0]}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Orbit Instruction Pill */}
          <div className="exploded-orbit-pill" aria-hidden="true">
            <Sparkles size={12} strokeWidth={2} />
            <span>Click &amp; Drag to Orbit 3D Caliber ({Math.round(rotationY)}°)</span>
          </div>
        </div>

        {/* Footer Inspector & Explode Slider */}
        <div className="exploded-modal-footer">
          <div className="exploded-slider-box">
            <div className="exploded-slider-label-row">
              <span className="exploded-slider-title">
                <Sliders size={13} strokeWidth={1.8} />
                <span>Exploded Separation (Z-Axis Depth)</span>
              </span>
              <span className="exploded-slider-val tabular-nums">{Math.round(explosionProgress * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1.5"
              step="0.02"
              value={explosionProgress}
              onChange={e => setExplosionProgress(parseFloat(e.target.value))}
              className="exploded-range-slider"
              aria-label="Adjust exploded caliber layer separation"
            />
          </div>

          {/* Quick Preset Buttons */}
          <div className="exploded-presets">
            <button
              type="button"
              className={`exploded-preset-btn ${explosionProgress === 0 ? 'active' : ''}`}
              onClick={() => setExplosionProgress(0)}
            >
              Assembled (0%)
            </button>
            <button
              type="button"
              className={`exploded-preset-btn ${explosionProgress === 0.85 ? 'active' : ''}`}
              onClick={() => setExplosionProgress(0.85)}
            >
              Standard (85%)
            </button>
            <button
              type="button"
              className={`exploded-preset-btn ${explosionProgress === 1.4 ? 'active' : ''}`}
              onClick={() => setExplosionProgress(1.4)}
            >
              Maximum (140%)
            </button>
            <button
              type="button"
              className="exploded-preset-btn reset"
              onClick={() => {
                setRotationX(18);
                setRotationY(-22);
                setExplosionProgress(0.85);
              }}
              title="Reset Orbit & Scale"
            >
              <RotateCcw size={13} strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
