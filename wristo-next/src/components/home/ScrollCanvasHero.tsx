'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const TOTAL_FRAMES = 240;

const getFramePath = (index: number): string => {
  const frameNum = (index + 1).toString().padStart(4, '0');
  return `/assets/hero-frames/frame_${frameNum}.jpg`;
};

interface ScrollCanvasHeroProps {
  heroSectionRef: React.RefObject<HTMLElement | null>;
}

export default function ScrollCanvasHero({ heroSectionRef }: ScrollCanvasHeroProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
  const activeFrameRef = useRef<number>(0);
  const animFrameIdRef = useRef<number | null>(null);

  const [bufferProgress, setBufferProgress] = useState<number>(0);
  const [isReady, setIsReady] = useState<boolean>(false);

  // High-DPI canvas render function with luxury aspect-ratio cover math
  const renderCanvasFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Pick target frame, or find nearest loaded frame, or fallback to frame 0
    let img = imagesRef.current[frameIndex];
    if (!img || !img.complete || img.naturalWidth === 0) {
      for (let b = frameIndex - 1; b >= 0; b--) {
        const candidate = imagesRef.current[b];
        if (candidate && candidate.complete && candidate.naturalWidth !== 0) {
          img = candidate;
          break;
        }
      }
    }
    if (!img || !img.complete || img.naturalWidth === 0) {
      img = imagesRef.current[0];
    }

    if (!img || !img.complete || img.naturalWidth === 0) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const imgW = img.naturalWidth;
    const imgH = img.naturalHeight;

    const canvasRatio = cw / ch;
    const imgRatio = imgW / imgH;

    let renderW: number;
    let renderH: number;
    let renderX: number;
    let renderY: number;

    if (canvasRatio > imgRatio) {
      renderW = cw;
      renderH = cw / imgRatio;
      renderX = 0;
      renderY = (ch - renderH) * 0.5;
    } else {
      renderH = ch;
      renderW = ch * imgRatio;
      // Desktop: bias towards 0.85 (right side) to showcase timepiece alongside left editorial typography
      // Mobile: center bias 0.50 for full dial prominence
      const isDesktop = typeof window !== 'undefined' ? window.innerWidth > 768 : true;
      const bias = isDesktop ? 0.82 : 0.50;
      renderX = (cw - renderW) * bias;
      renderY = 0;
    }

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, renderX, renderY, renderW, renderH);
  }, []);

  // Throttled requestAnimationFrame draw pipeline
  const requestFrameDraw = useCallback((frameIndex: number) => {
    activeFrameRef.current = frameIndex;
    if (animFrameIdRef.current !== null) {
      cancelAnimationFrame(animFrameIdRef.current);
    }
    animFrameIdRef.current = requestAnimationFrame(() => {
      renderCanvasFrame(activeFrameRef.current);
      animFrameIdRef.current = null;
    });
  }, [renderCanvasFrame]);

  // High-DPI canvas resizer
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1;

    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);

    renderCanvasFrame(activeFrameRef.current);
  }, [renderCanvasFrame]);

  // Frame Preloading Pipeline with Controlled Concurrency
  useEffect(() => {
    let isCancelled = false;

    // 1. Immediately load Frame 0001
    const firstImg = new Image();
    firstImg.src = getFramePath(0);
    firstImg.onload = () => {
      if (isCancelled) return;
      imagesRef.current[0] = firstImg;
      setIsReady(true);
      handleResize();
      renderCanvasFrame(0);

      // 2. Preload remaining 239 frames with 8 parallel worker queues
      let loadedCount = 1;
      setBufferProgress(Math.round((loadedCount / TOTAL_FRAMES) * 100));

      const concurrency = 8;
      let nextIdx = 1;

      const worker = async () => {
        while (!isCancelled && nextIdx < TOTAL_FRAMES) {
          const i = nextIdx++;
          await new Promise<void>((resolve) => {
            const img = new Image();
            img.src = getFramePath(i);
            img.onload = () => {
              if (!isCancelled) {
                imagesRef.current[i] = img;
                loadedCount++;
                setBufferProgress(Math.round((loadedCount / TOTAL_FRAMES) * 100));
              }
              resolve();
            };
            img.onerror = () => {
              loadedCount++;
              resolve();
            };
          });
        }
      };

      for (let c = 0; c < concurrency; c++) {
        worker();
      }
    };

    return () => {
      isCancelled = true;
      if (animFrameIdRef.current !== null) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [handleResize, renderCanvasFrame]);

  // Window resize observer
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  // GSAP ScrollTrigger Scrub Setup
  useEffect(() => {
    if (!isReady) return;

    const triggerEl = heroSectionRef.current;
    if (!triggerEl || typeof window === 'undefined') return;

    // Accessibility: Reduced motion check
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      renderCanvasFrame(0);
      return;
    }

    const ctx = gsap.context(() => {
      const playhead = { frame: 0 };

      gsap.to(playhead, {
        frame: TOTAL_FRAMES - 1,
        snap: 'frame',
        ease: 'none',
        scrollTrigger: {
          trigger: triggerEl,
          start: 'top top',
          end: '+=140%', // Unhurried 140% viewport scroll distance for luxury tactile pacing
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          onUpdate: () => {
            const nextFrame = Math.min(
              TOTAL_FRAMES - 1,
              Math.max(0, Math.round(playhead.frame))
            );
            requestFrameDraw(nextFrame);
          },
        },
      });

      ScrollTrigger.refresh();
    }, triggerEl);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === triggerEl) t.kill();
      });
    };
  }, [isReady, heroSectionRef, requestFrameDraw, renderCanvasFrame]);

  return (
    <div className="hero-scroll-canvas-wrap" aria-hidden="true">
      <canvas
        ref={canvasRef}
        className="hero-scroll-canvas"
        style={{ opacity: isReady ? 1 : 0, transition: 'opacity 0.4s ease' }}
      />

      {/* Subtle Hairline Buffer Progress Bar */}
      {bufferProgress < 100 && (
        <div className="hero-buffer-track" title={`Buffering 3D frames: ${bufferProgress}%`}>
          <div className="hero-buffer-bar" style={{ width: `${bufferProgress}%` }} />
        </div>
      )}
    </div>
  );
}
