'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { Printer, ShieldCheck, Check, Award, X } from 'lucide-react';
import gsap from 'gsap';
import { OrderRecord } from '@/types/order';

interface CertificateModalProps {
  order: OrderRecord | null;
  onClose: () => void;
}

export default function CertificateModal({ order, onClose }: CertificateModalProps) {
  const modalContainerRef = useRef<HTMLDivElement>(null);
  const sealRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // GSAP Guilloché Stroke-Draw & Gold Holographic Seal Stamp Impact
  useEffect(() => {
    if (!order || !modalContainerRef.current) return;

    const ctx = gsap.context(() => {
      const paths = svgRef.current?.querySelectorAll<SVGPathElement>('.guilloche-path');

      if (paths && paths.length > 0) {
        paths.forEach(path => {
          const length = path.getTotalLength();
          gsap.set(path, {
            strokeDasharray: length,
            strokeDashoffset: length,
          });
        });

        // 1. Draw Guilloché security paths
        gsap.to(paths, {
          strokeDashoffset: 0,
          duration: 1.1,
          ease: 'power2.out',
          stagger: 0.08,
        });
      }

      // 2. Holographic Gold Seal Stamp Impact
      if (sealRef.current) {
        gsap.fromTo(
          sealRef.current,
          {
            scale: 2.4,
            opacity: 0,
            rotation: -30,
            boxShadow: '0 0 0px rgba(222, 192, 149, 0)',
          },
          {
            scale: 1,
            opacity: 1,
            rotation: 0,
            duration: 0.65,
            delay: 0.45,
            ease: 'back.out(1.8)',
            boxShadow: '0 8px 24px rgba(222, 192, 149, 0.45)',
          }
        );
      }

      // 3. Staggered Typewriter Fade-in for Credentials
      gsap.fromTo(
        '.cert-stagger-item',
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.06,
          delay: 0.2,
          ease: 'power2.out',
        }
      );
    }, modalContainerRef);

    return () => ctx.revert();
  }, [order]);

  if (!order) return null;

  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="cert-modal-backdrop" onClick={onClose}>
      <div className="cert-modal-container" ref={modalContainerRef} onClick={e => e.stopPropagation()}>
        <button
          type="button"
          className="cert-modal-close-btn"
          onClick={onClose}
          aria-label="Close certificate modal"
        >
          <X size={18} strokeWidth={2} />
        </button>

        {/* Certificate Frame */}
        <div className="cert-frame">
          {/* Animated SVG Swiss Guilloché Security Watermark */}
          <div className="cert-guilloche-bg" aria-hidden="true">
            <svg
              ref={svgRef}
              viewBox="0 0 800 600"
              className="cert-guilloche-svg"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer Security Rosette Waves */}
              <path
                className="guilloche-path"
                d="M 40,40 Q 200,10 400,40 T 760,40 Q 790,200 760,400 T 760,560 Q 600,590 400,560 T 40,560 Q 10,400 40,240 Z"
                stroke="rgba(222, 192, 149, 0.28)"
                strokeWidth="1.2"
              />
              <path
                className="guilloche-path"
                d="M 55,55 Q 200,28 400,55 T 745,55 Q 772,200 745,400 T 745,545 Q 600,572 400,545 T 55,545 Q 28,400 55,255 Z"
                stroke="rgba(222, 192, 149, 0.18)"
                strokeWidth="0.8"
              />
              {/* Central Parametric Spirograph Rosette */}
              <circle
                className="guilloche-path"
                cx="400"
                cy="300"
                r="160"
                stroke="rgba(222, 192, 149, 0.15)"
                strokeWidth="1"
              />
              <path
                className="guilloche-path"
                d="M 400,140 C 490,140 560,210 560,300 C 560,390 490,460 400,460 C 310,460 240,390 240,300 C 240,210 310,140 400,140 Z M 300,240 C 350,190 450,190 500,240 C 550,290 550,390 500,440 C 450,490 350,490 300,440 C 250,390 250,290 300,240 Z"
                stroke="rgba(222, 192, 149, 0.18)"
                strokeWidth="0.9"
              />
              <path
                className="guilloche-path"
                d="M 400,180 C 430,220 480,250 520,300 C 480,350 430,380 400,420 C 370,380 320,350 280,300 C 320,250 370,220 400,180 Z"
                stroke="rgba(222, 192, 149, 0.22)"
                strokeWidth="1"
              />
              {/* Corner Horological Filigree Accents */}
              <path className="guilloche-path" d="M 50,90 Q 90,50 130,50" stroke="rgba(222, 192, 149, 0.3)" strokeWidth="1" />
              <path className="guilloche-path" d="M 750,90 Q 710,50 670,50" stroke="rgba(222, 192, 149, 0.3)" strokeWidth="1" />
              <path className="guilloche-path" d="M 50,510 Q 90,550 130,550" stroke="rgba(222, 192, 149, 0.3)" strokeWidth="1" />
              <path className="guilloche-path" d="M 750,510 Q 710,550 670,550" stroke="rgba(222, 192, 149, 0.3)" strokeWidth="1" />
            </svg>
          </div>

          <div className="cert-content">
            {/* Header Lockup */}
            <div className="cert-header cert-stagger-item">
              <span className="cert-crest">W</span>
              <h2 className="cert-title">WRISTO</h2>
              <div className="cert-subtitle">CERTIFICATE OF PROVENANCE &amp; AUTHENTICITY</div>
              <div className="cert-seal-number tabular-nums">Register No. {order.certificateId}</div>
            </div>

            {/* Master Statement */}
            <p className="cert-statement cert-stagger-item">
              This official document affirms that the mechanical timepiece(s) enumerated below have undergone comprehensive optical, chronometric, and metallurgical inspection within our master vault atelier. All calibers and serial numbers are hereby registered permanently in the WRISTO Horological Provenance Archive.
            </p>

            {/* Order & Patron Meta */}
            <div className="cert-meta-grid cert-stagger-item">
              <div className="cert-meta-col">
                <span className="cert-meta-label">Registered Collector</span>
                <span className="cert-meta-val">{order.address.fullName}</span>
              </div>
              <div className="cert-meta-col">
                <span className="cert-meta-label">Acquisition Date</span>
                <span className="cert-meta-val tabular-nums">{formattedDate}</span>
              </div>
              <div className="cert-meta-col">
                <span className="cert-meta-label">Order Ledger Ref</span>
                <span className="cert-meta-val tabular-nums">{order.orderId}</span>
              </div>
              <div className="cert-meta-col">
                <span className="cert-meta-label">Sanctioned Dispatch</span>
                <span className="cert-meta-val">
                  {order.deliveryTier === 'white_glove' ? 'White-Glove Courier' : 'Insured Air Express'}
                </span>
              </div>
            </div>

            {/* Timepiece List */}
            <div className="cert-pieces-list cert-stagger-item">
              {order.items.map((item, idx) => (
                <div key={idx} className="cert-piece-item">
                  <div className="cert-piece-thumb">
                    <Image
                      src={item.image}
                      alt={item.model}
                      fill
                      sizes="48px"
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                  <div className="cert-piece-details">
                    <div className="cert-piece-brand">{item.brand}</div>
                    <div className="cert-piece-model">{item.model}</div>
                    <div className="cert-piece-spec tabular-nums">Individual Reference: {item.productId} &bull; Qty: {item.quantity}</div>
                  </div>
                  <div className="cert-piece-provenance-status">
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Check size={13} strokeWidth={2.5} />
                      <span>Authenticated</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Signatures & Seal Footer */}
            <div className="cert-footer cert-stagger-item">
              <div className="cert-sig-block">
                <div className="cert-sig-line">Adrien de Beauharnais</div>
                <span className="cert-sig-title">Master Horologist &amp; Vault Director</span>
              </div>

              {/* Stamped Gold Holographic Seal */}
              <div className="cert-gold-seal" ref={sealRef}>
                <div className="cert-seal-inner">
                  <span>W</span>
                  <small>OFFICIAL SEAL</small>
                </div>
              </div>

              <div className="cert-sig-block">
                <div className="cert-sig-line">K. Singhania &amp; Co.</div>
                <span className="cert-sig-title">Registrar of Horological Provenance</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="cert-modal-actions">
          <button
            type="button"
            className="btn btn-outline"
            onClick={onClose}
          >
            Close
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => window.print()}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <Printer size={15} strokeWidth={1.8} />
            <span>Print Official Dossier</span>
          </button>
        </div>
      </div>
    </div>
  );
}
