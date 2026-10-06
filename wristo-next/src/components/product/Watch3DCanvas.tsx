'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { RotateCw, RotateCcw, ZoomIn, ZoomOut, Play, Pause, Eye, Compass } from 'lucide-react';
import { Product } from '@/types/product';

interface Watch3DCanvasProps {
  product: Product;
  className?: string;
  onAngleChange?: (yaw: number) => void;
}

export default function Watch3DCanvas({ product, className = '', onAngleChange }: Watch3DCanvasProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isAutoSpin, setIsAutoSpin] = useState(true);
  const [currentYawDeg, setCurrentYawDeg] = useState(0);
  const [currentPitchDeg, setCurrentPitchDeg] = useState(0);
  const [zoomFactor, setZoomFactor] = useState(1);
  const [isInteracting, setIsInteracting] = useState(false);

  // References for animation and control
  const animFrameIdRef = useRef<number | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const watchGroupRef = useRef<THREE.Group | null>(null);
  const handsGroupRef = useRef<{ hour: THREE.Mesh; minute: THREE.Mesh; second: THREE.Mesh } | null>(null);

  // Interaction state
  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef({ yaw: 0, pitch: 0 });
  const currentRotationRef = useRef({ yaw: 0, pitch: 0 });
  const targetZoomRef = useRef(1);
  const isAutoSpinRef = useRef(true);
  isAutoSpinRef.current = isAutoSpin;

  // Generate procedural high-resolution dial texture
  const createDialTexture = useCallback((prod: Product) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const cx = 512;
    const cy = 512;
    const radius = 480;

    const isSmart = prod.movement === 'Smart Digital' || prod.brand === 'PULSE';
    const isSkeleton = prod.movement === 'Mechanical Skeleton' || prod.style === 'Skeleton' || prod.model.includes('Skeleton') || prod.model.includes('Open Heart');
    const isChrono = prod.movement === 'Quartz' && (prod.model.includes('Chrono') || prod.model.includes('Apex') || prod.style === 'Chronograph');

    if (isSmart) {
      // AMOLED Smartwatch Digital Screen
      ctx.fillStyle = '#05070a';
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();

      // Outer active ring
      ctx.strokeStyle = '#22d3ee';
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.arc(cx, cy, radius - 20, -Math.PI * 0.5, Math.PI * 0.85);
      ctx.stroke();

      ctx.strokeStyle = '#ec4899';
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.arc(cx, cy, radius - 45, -Math.PI * 0.5, Math.PI * 0.5);
      ctx.stroke();

      // Digital Horology readout
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 150px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('10:08', cx, cy - 30);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '600 36px system-ui, sans-serif';
      ctx.fillText('WED 06 OCT', cx, cy + 85);

      // Heart rate / step pill
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 32px system-ui, sans-serif';
      ctx.fillText('♥ 74 BPM  •  8,420 STEPS', cx, cy + 160);

      // Brand mark
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 28px system-ui, sans-serif';
      ctx.letterSpacing = '6px';
      ctx.fillText(prod.brand, cx, cy - 180);

      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    }

    // Traditional Horology Dial (Mechanical / Quartz / Luxury)
    // 1. Dial base gradient / sunray
    const dialGradient = ctx.createRadialGradient(cx, cy, 10, cx, cy, radius);
    const dialName = prod.dial.toLowerCase();

    if (dialName.includes('black') || dialName.includes('obsidian') || dialName.includes('carbon')) {
      dialGradient.addColorStop(0, '#1c1c20');
      dialGradient.addColorStop(0.7, '#111114');
      dialGradient.addColorStop(1, '#08080a');
    } else if (dialName.includes('silver') || dialName.includes('white') || dialName.includes('chalk')) {
      dialGradient.addColorStop(0, '#fafafc');
      dialGradient.addColorStop(0.7, '#e4e7eb');
      dialGradient.addColorStop(1, '#c8cbd0');
    } else if (dialName.includes('blue') || dialName.includes('cobalt') || dialName.includes('royal')) {
      dialGradient.addColorStop(0, '#1e3a8a');
      dialGradient.addColorStop(0.65, '#0f172a');
      dialGradient.addColorStop(1, '#020617');
    } else if (dialName.includes('green') || dialName.includes('emerald') || dialName.includes('olive')) {
      dialGradient.addColorStop(0, '#065f46');
      dialGradient.addColorStop(0.7, '#022c22');
      dialGradient.addColorStop(1, '#011510');
    } else if (dialName.includes('gold') || dialName.includes('champagne') || dialName.includes('sand')) {
      dialGradient.addColorStop(0, '#fef3c7');
      dialGradient.addColorStop(0.65, '#d97706');
      dialGradient.addColorStop(1, '#78350f');
    } else if (dialName.includes('rose') || dialName.includes('pink') || dialName.includes('terra')) {
      dialGradient.addColorStop(0, '#ffe4e6');
      dialGradient.addColorStop(0.65, '#be185d');
      dialGradient.addColorStop(1, '#4c0519');
    } else {
      dialGradient.addColorStop(0, '#27272a');
      dialGradient.addColorStop(0.8, '#18181b');
      dialGradient.addColorStop(1, '#09090b');
    }

    ctx.fillStyle = dialGradient;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();

    // 2. Sunray radial lines
    ctx.save();
    ctx.translate(cx, cy);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 360; i += 2) {
      ctx.rotate((Math.PI / 180) * 2);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, radius - 10);
      ctx.stroke();
    }
    ctx.restore();

    // 3. Minute Track (60 ticks)
    ctx.save();
    ctx.translate(cx, cy);
    const tickColor = (dialName.includes('silver') || dialName.includes('white') || dialName.includes('ivory'))
      ? '#262626'
      : '#d4af37';

    for (let i = 0; i < 60; i++) {
      const isFive = i % 5 === 0;
      ctx.strokeStyle = isFive ? tickColor : 'rgba(200, 200, 200, 0.45)';
      ctx.lineWidth = isFive ? 4 : 1.8;
      ctx.beginPath();
      ctx.moveTo(0, -radius + (isFive ? 32 : 16));
      ctx.lineTo(0, -radius + 8);
      ctx.stroke();
      ctx.rotate((Math.PI / 180) * 6);
    }
    ctx.restore();

    // 4. Applied 12 Hour Indices
    ctx.save();
    ctx.translate(cx, cy);
    for (let i = 0; i < 12; i++) {
      const angle = (Math.PI / 6) * i;
      ctx.save();
      ctx.rotate(angle);

      // Baton index
      const markerW = i === 0 ? 18 : 12;
      const markerH = i === 0 ? 56 : 46;
      const markerY = -radius + 40;

      // Drop shadow for 3D depth
      ctx.fillStyle = 'rgba(0,0,0,0.45)';
      ctx.fillRect(-markerW / 2 + 2, markerY + 3, markerW, markerH);

      // Gold / Silver Metallic Gradient for index
      const indexGrad = ctx.createLinearGradient(-markerW / 2, markerY, markerW / 2, markerY + markerH);
      if (prod.material.includes('Gold') || dialName.includes('gold') || dialName.includes('champagne')) {
        indexGrad.addColorStop(0, '#fffbeb');
        indexGrad.addColorStop(0.5, '#d4af37');
        indexGrad.addColorStop(1, '#92400e');
      } else {
        indexGrad.addColorStop(0, '#ffffff');
        indexGrad.addColorStop(0.5, '#d1d5db');
        indexGrad.addColorStop(1, '#6b7280');
      }

      ctx.fillStyle = indexGrad;
      ctx.fillRect(-markerW / 2, markerY, markerW, markerH);

      // Lume Pip in center
      ctx.fillStyle = '#ecfdf5';
      ctx.fillRect(-markerW / 4, markerY + 4, markerW / 2, markerH - 8);

      ctx.restore();
    }
    ctx.restore();

    // 5. Sub-dials if Chronograph
    if (isChrono) {
      const subRadius = 105;
      const subCenters = [
        { x: cx - 170, y: cy },
        { x: cx + 170, y: cy },
        { x: cx, y: cy + 155 }
      ];

      subCenters.forEach((sub) => {
        // Sub-dial background with concentric tracks
        ctx.fillStyle = 'rgba(0,0,0,0.4)';
        ctx.beginPath();
        ctx.arc(sub.x, sub.y, subRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Sub-dial ticks
        ctx.save();
        ctx.translate(sub.x, sub.y);
        ctx.strokeStyle = 'rgba(255,255,255,0.6)';
        ctx.lineWidth = 1.5;
        for (let t = 0; t < 12; t++) {
          ctx.beginPath();
          ctx.moveTo(0, -subRadius + 12);
          ctx.lineTo(0, -subRadius + 4);
          ctx.stroke();
          ctx.rotate((Math.PI / 180) * 30);
        }
        ctx.restore();
      });
    }

    // 6. Skeleton / Open Heart Aperture
    if (isSkeleton) {
      ctx.save();
      const openX = cx;
      const openY = cy + 130;
      const openR = 125;

      // Aperture outer rim
      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(openX, openY, openR, 0, Math.PI * 2);
      ctx.stroke();

      // Mechanical gear escapement cutout
      ctx.fillStyle = '#18181b';
      ctx.fill();

      // Gear teeth
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(openX, openY, openR - 25, 0, Math.PI * 2);
      ctx.stroke();

      // Balance wheel ruby jewel
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(openX, openY, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 7. Horology Brand & Caliber Typography
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Brand Name
    const fontPrimaryColor = (dialName.includes('silver') || dialName.includes('white') || dialName.includes('ivory'))
      ? '#111827'
      : '#f8fafc';

    ctx.fillStyle = fontPrimaryColor;
    ctx.font = 'bold 36px "Cinzel", "Playfair Display", Georgia, serif';
    ctx.fillText(prod.brand, cx, cy - 170);

    // Model Name
    ctx.fillStyle = 'rgba(212, 175, 55, 0.9)';
    ctx.font = '500 22px system-ui, -apple-system, sans-serif';
    ctx.fillText(prod.model.toUpperCase(), cx, cy - 128);

    // Movement & Swiss Mark
    ctx.fillStyle = 'rgba(156, 163, 175, 0.85)';
    ctx.font = '600 18px system-ui, sans-serif';
    ctx.fillText(prod.movement.toUpperCase(), cx, cy + (isSkeleton || isChrono ? 245 : 170));

    ctx.font = '500 15px system-ui, sans-serif';
    ctx.fillText('SWISS ARCHIVE  •  100M / 330FT', cx, cy + (isSkeleton || isChrono ? 275 : 205));

    // Date Window at 3 o'clock (x: +300, y: 0)
    if (!isChrono && !isSkeleton) {
      const dwX = cx + 290;
      const dwY = cy;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(dwX - 24, dwY - 20, 48, 40);
      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 2;
      ctx.strokeRect(dwX - 24, dwY - 20, 48, 40);

      ctx.fillStyle = '#111827';
      ctx.font = 'bold 24px system-ui, sans-serif';
      ctx.fillText('06', dwX, dwY + 2);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    return texture;
  }, []);

  // Material builder based on product specifications
  const getCaseMaterial = useCallback((prod: Product) => {
    const mat = prod.material.toLowerCase();
    if (mat.includes('rose gold')) {
      return new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#d48b78'),
        metalness: 0.92,
        roughness: 0.16,
        clearcoat: 0.6,
        clearcoatRoughness: 0.12,
        reflectivity: 0.8
      });
    }
    if (mat.includes('gold')) {
      return new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#d4af37'),
        metalness: 0.94,
        roughness: 0.18,
        clearcoat: 0.6,
        clearcoatRoughness: 0.15,
        reflectivity: 0.85
      });
    }
    if (mat.includes('pvd') || mat.includes('black') || mat.includes('dlc') || mat.includes('matte black')) {
      return new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#1c1c22'),
        metalness: 0.88,
        roughness: 0.28,
        clearcoat: 0.35,
        clearcoatRoughness: 0.2
      });
    }
    if (mat.includes('bronze')) {
      return new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#9c6e3b'),
        metalness: 0.85,
        roughness: 0.35,
        clearcoat: 0.2
      });
    }
    if (mat.includes('titanium')) {
      return new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#a8a29e'),
        metalness: 0.82,
        roughness: 0.32,
        clearcoat: 0.3
      });
    }
    // Default 316L Stainless Steel
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#d4d4d8'),
      metalness: 0.96,
      roughness: 0.14,
      clearcoat: 0.65,
      clearcoatRoughness: 0.1
    });
  }, []);

  const getStrapMaterial = useCallback((prod: Product) => {
    const strap = prod.strap.toLowerCase();
    if (strap.includes('leather')) {
      let strapColor = '#261b17';
      if (strap.includes('brown') || strap.includes('tan') || strap.includes('terracotta')) strapColor = '#5c3317';
      if (strap.includes('navy') || strap.includes('blue')) strapColor = '#0f172a';
      if (strap.includes('beige') || strap.includes('cream')) strapColor = '#d6c5b0';
      if (strap.includes('pink') || strap.includes('rose')) strapColor = '#e29578';
      return new THREE.MeshStandardMaterial({
        color: new THREE.Color(strapColor),
        roughness: 0.72,
        metalness: 0.08
      });
    }
    if (strap.includes('mesh') || strap.includes('steel') || strap.includes('oyster') || strap.includes('link')) {
      return getCaseMaterial(prod);
    }
    if (strap.includes('silicone') || strap.includes('rubber') || strap.includes('fluororubber')) {
      let sColor = '#18181b';
      if (strap.includes('crimson') || strap.includes('red')) sColor = '#991b1b';
      if (strap.includes('blue') || strap.includes('navy')) sColor = '#1e3a8a';
      if (strap.includes('olive') || strap.includes('green')) sColor = '#166534';
      if (strap.includes('lilac')) sColor = '#c084fc';
      return new THREE.MeshStandardMaterial({
        color: new THREE.Color(sColor),
        roughness: 0.85,
        metalness: 0.02
      });
    }
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#27272a'),
      roughness: 0.8,
      metalness: 0.1
    });
  }, [getCaseMaterial]);

  // Main Three.js Scene Setup & Render Loop
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 550;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.8);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 2. Horology Studio 3-Point Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    // Main Studio Key Light (Top-Right)
    const keyLight = new THREE.DirectionalLight(0xfff7ed, 2.4);
    keyLight.position.set(4, 5, 4);
    scene.add(keyLight);

    // Fill Light (Bottom-Left)
    const fillLight = new THREE.DirectionalLight(0xe0f2fe, 1.4);
    fillLight.position.set(-4, -2, 3);
    scene.add(fillLight);

    // Specular Rim Light (Top Edge glint)
    const rimLight = new THREE.DirectionalLight(0xfef08a, 2.8);
    rimLight.position.set(0, 6, -3);
    scene.add(rimLight);

    // Back-facing backlight
    const backLight = new THREE.DirectionalLight(0xffffff, 1.2);
    backLight.position.set(0, -5, -4);
    scene.add(backLight);

    // 3. Watch Root Assembly Group
    const watchGroup = new THREE.Group();
    watchGroupRef.current = watchGroup;
    scene.add(watchGroup);

    // Materials
    const caseMat = getCaseMaterial(product);
    const strapMat = getStrapMaterial(product);

    // --- CASE MAIN CYLINDER ---
    const caseGeo = new THREE.CylinderGeometry(2.15, 2.1, 0.52, 64);
    caseGeo.rotateX(Math.PI / 2);
    const caseMesh = new THREE.Mesh(caseGeo, caseMat);
    watchGroup.add(caseMesh);

    // --- BEZEL STEPPED RING ---
    const bezelGeo = new THREE.TorusGeometry(2.12, 0.08, 16, 64);
    bezelGeo.rotateX(Math.PI / 2);
    const bezelMesh = new THREE.Mesh(bezelGeo, caseMat);
    bezelMesh.position.z = 0.28;
    watchGroup.add(bezelMesh);

    // Inner Bezel Chamfer
    const innerBezelGeo = new THREE.RingGeometry(1.98, 2.14, 64);
    const innerBezelMesh = new THREE.Mesh(innerBezelGeo, caseMat);
    innerBezelMesh.position.z = 0.27;
    watchGroup.add(innerBezelMesh);

    // --- 4 LUGS ---
    const lugGeo = new THREE.BoxGeometry(0.24, 0.95, 0.44);
    const lugPositions = [
      [-1.15, 2.2, -0.05],
      [1.15, 2.2, -0.05],
      [-1.15, -2.2, -0.05],
      [1.15, -2.2, -0.05]
    ];
    lugPositions.forEach(([lx, ly, lz]) => {
      const lug = new THREE.Mesh(lugGeo, caseMat);
      lug.position.set(lx, ly, lz);
      // Angle lugs inward slightly
      lug.rotation.z = (ly > 0 ? (lx > 0 ? -0.12 : 0.12) : (lx > 0 ? 0.12 : -0.12));
      lug.rotation.x = ly > 0 ? -0.18 : 0.18;
      watchGroup.add(lug);
    });

    // --- CROWN AT 3 O'CLOCK ---
    const crownGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.32, 24);
    crownGeo.rotateZ(Math.PI / 2);
    const crownMesh = new THREE.Mesh(crownGeo, caseMat);
    crownMesh.position.set(2.32, 0, 0);
    watchGroup.add(crownMesh);

    // Crown Cap
    const crownCapGeo = new THREE.SphereGeometry(0.18, 16, 16);
    crownCapGeo.scale(0.5, 1, 1);
    const crownCap = new THREE.Mesh(crownCapGeo, caseMat);
    crownCap.position.set(2.48, 0, 0);
    watchGroup.add(crownCap);

    // Chrono Pushers (if applicable)
    if (product.model.includes('Chrono') || product.movement === 'Chronograph') {
      const pusherGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.28, 16);
      pusherGeo.rotateZ(Math.PI / 2);

      const pusherTop = new THREE.Mesh(pusherGeo, caseMat);
      pusherTop.position.set(2.15, 1.05, 0);
      pusherTop.rotation.z = -0.4;
      watchGroup.add(pusherTop);

      const pusherBottom = new THREE.Mesh(pusherGeo, caseMat);
      pusherBottom.position.set(2.15, -1.05, 0);
      pusherBottom.rotation.z = 0.4;
      watchGroup.add(pusherBottom);
    }

    // --- DIAL PLANE ---
    const dialTex = createDialTexture(product);
    const dialMat = new THREE.MeshStandardMaterial({
      map: dialTex,
      roughness: 0.35,
      metalness: 0.15
    });
    const dialGeo = new THREE.CircleGeometry(2.0, 64);
    const dialMesh = new THREE.Mesh(dialGeo, dialMat);
    dialMesh.position.z = 0.15;
    watchGroup.add(dialMesh);

    // --- 3D WATCH HANDS ---
    const handsMaterial = (product.material.includes('Gold') || product.dial.toLowerCase().includes('gold'))
      ? new THREE.MeshPhysicalMaterial({ color: 0xd4af37, metalness: 0.95, roughness: 0.15 })
      : new THREE.MeshPhysicalMaterial({ color: 0xe5e7eb, metalness: 0.95, roughness: 0.15 });

    const secondHandMaterial = new THREE.MeshPhysicalMaterial({
      color: product.dial.toLowerCase().includes('blue') ? 0xef4444 : 0xd4af37,
      metalness: 0.9,
      roughness: 0.2
    });

    // Hour Hand
    const hourGeo = new THREE.ConeGeometry(0.09, 1.05, 4);
    hourGeo.translate(0, 0.52, 0);
    const hourHand = new THREE.Mesh(hourGeo, handsMaterial);
    hourHand.position.z = 0.20;
    hourHand.rotation.z = -Math.PI * 0.58; // 10 o'clock position
    watchGroup.add(hourHand);

    // Minute Hand
    const minuteGeo = new THREE.ConeGeometry(0.07, 1.55, 4);
    minuteGeo.translate(0, 0.77, 0);
    const minuteHand = new THREE.Mesh(minuteGeo, handsMaterial);
    minuteHand.position.z = 0.22;
    minuteHand.rotation.z = -Math.PI * 0.16; // 2 o'clock position (10:10 classic)
    watchGroup.add(minuteHand);

    // Second Hand
    const secondGeo = new THREE.CylinderGeometry(0.02, 0.02, 1.75, 8);
    secondGeo.translate(0, 0.65, 0);
    const secondHand = new THREE.Mesh(secondGeo, secondHandMaterial);
    secondHand.position.z = 0.24;
    watchGroup.add(secondHand);

    // Center Pin / Cap
    const centerPinGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.08, 16);
    centerPinGeo.rotateX(Math.PI / 2);
    const centerPin = new THREE.Mesh(centerPinGeo, handsMaterial);
    centerPin.position.z = 0.26;
    watchGroup.add(centerPin);

    handsGroupRef.current = { hour: hourHand, minute: minuteHand, second: secondHand };

    // --- CURVED SAPPHIRE CRYSTAL GLASS DOME ---
    const glassGeo = new THREE.CylinderGeometry(2.05, 2.05, 0.04, 64);
    glassGeo.rotateX(Math.PI / 2);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.94,
      opacity: 1,
      transparent: true,
      roughness: 0.04,
      ior: 1.77, // Sapphire crystal refractive index
      reflectivity: 0.55,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05
    });
    const glassMesh = new THREE.Mesh(glassGeo, glassMat);
    glassMesh.position.z = 0.32;
    watchGroup.add(glassMesh);

    // --- CURVED STRAPS (TOP & BOTTOM) ---
    const buildStrap = (isTop: boolean) => {
      const strapCurveGroup = new THREE.Group();
      const segments = 12;
      const length = 2.4;
      const width = 1.9;

      for (let i = 0; i < segments; i++) {
        const segGeo = new THREE.BoxGeometry(
          width - (i * 0.03), // Gentle taper
          length / segments,
          0.18
        );
        const segMesh = new THREE.Mesh(segGeo, strapMat);

        const progress = i / segments;
        const arcY = (isTop ? 1 : -1) * (2.1 + progress * 2.2);
        // Curve downward around wrist
        const arcZ = -0.15 - Math.pow(progress, 1.8) * 1.4;

        segMesh.position.set(0, arcY, arcZ);
        segMesh.rotation.x = (isTop ? -1 : 1) * progress * 0.85;

        strapCurveGroup.add(segMesh);
      }
      return strapCurveGroup;
    };

    watchGroup.add(buildStrap(true));
    watchGroup.add(buildStrap(false));

    // --- CONTACT SHADOW PLANE ---
    const shadowGeo = new THREE.PlaneGeometry(8, 8);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const sCtx = shadowCanvas.getContext('2d');
    if (sCtx) {
      const sGrad = sCtx.createRadialGradient(128, 128, 10, 128, 128, 120);
      sGrad.addColorStop(0, 'rgba(0, 0, 0, 0.45)');
      sGrad.addColorStop(0.5, 'rgba(0, 0, 0, 0.18)');
      sGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      sCtx.fillStyle = sGrad;
      sCtx.fillRect(0, 0, 256, 256);
    }
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.75,
      depthWrite: false
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.position.set(0, 0, -1.8);
    scene.add(shadowMesh);

    // Initial slight angle for beauty
    targetRotationRef.current.yaw = 0.25;
    targetRotationRef.current.pitch = 0.12;

    // 4. Render Animation Loop
    let lastTime = performance.now();

    const animate = (time: number) => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      // Auto-spin logic
      if (isAutoSpinRef.current && !isDraggingRef.current) {
        targetRotationRef.current.yaw += delta * 0.45;
      }

      // Smooth inertia damping
      currentRotationRef.current.yaw += (targetRotationRef.current.yaw - currentRotationRef.current.yaw) * 0.12;
      currentRotationRef.current.pitch += (targetRotationRef.current.pitch - currentRotationRef.current.pitch) * 0.12;
      const curZoom = camera.position.z;
      const targetZ = 7.8 / targetZoomRef.current;
      camera.position.z += (targetZ - curZoom) * 0.15;

      if (watchGroupRef.current) {
        watchGroupRef.current.rotation.y = currentRotationRef.current.yaw;
        watchGroupRef.current.rotation.x = currentRotationRef.current.pitch;
      }

      // Dynamic Hand Movements
      if (handsGroupRef.current) {
        const isAuto = product.movement === 'Automatic';
        if (isAuto) {
          // Smooth sweeping seconds hand (28,800 vph Swiss sweep)
          handsGroupRef.current.second.rotation.z -= delta * 1.05;
        } else {
          // Quartz crisp 1-second ticks
          const secondStep = Math.floor((time / 1000) * 1) % 60;
          handsGroupRef.current.second.rotation.z = - (secondStep / 60) * Math.PI * 2;
        }
      }

      // Readouts
      const degYaw = Math.round((((currentRotationRef.current.yaw * 180 / Math.PI) % 360) + 360) % 360);
      const degPitch = Math.round(currentRotationRef.current.pitch * 180 / Math.PI);
      setCurrentYawDeg(degYaw);
      setCurrentPitchDeg(degPitch);
      if (onAngleChange) onAngleChange(degYaw);

      renderer.render(scene, camera);
    };

    animFrameIdRef.current = requestAnimationFrame(animate);

    // 5. Responsive Resize
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newW, height: newH } = entry.contentRect;
        if (newW > 0 && newH > 0) {
          camera.aspect = newW / newH;
          camera.updateProjectionMatrix();
          renderer.setSize(newW, newH);
        }
      }
    });
    resizeObserver.observe(container);

    // 6. Cleanup
    return () => {
      resizeObserver.disconnect();
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      renderer.dispose();
      caseGeo.dispose();
      bezelGeo.dispose();
      innerBezelGeo.dispose();
      dialGeo.dispose();
      glassGeo.dispose();
      if (dialTex) dialTex.dispose();
      shadowTex.dispose();
      container.innerHTML = '';
    };
  }, [product, getCaseMaterial, getStrapMaterial, createDialTexture, onAngleChange]);

  // Pointer Interaction Handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    setIsInteracting(true);
    setIsAutoSpin(false);
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - lastMousePosRef.current.x;
    const deltaY = e.clientY - lastMousePosRef.current.y;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };

    targetRotationRef.current.yaw += deltaX * 0.009;
    targetRotationRef.current.pitch = Math.max(-0.65, Math.min(0.65, targetRotationRef.current.pitch + deltaY * 0.009));
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = false;
    setIsInteracting(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // safe fallback
    }
  };

  // Zoom Handlers
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const zoomDelta = e.deltaY * -0.0015;
    const newZoom = Math.max(0.7, Math.min(2.2, targetZoomRef.current + zoomDelta));
    targetZoomRef.current = newZoom;
    setZoomFactor(newZoom);
  };

  const handlePresetAngle = (yawDeg: number, pitchDeg: number) => {
    setIsAutoSpin(false);
    targetRotationRef.current.yaw = (yawDeg * Math.PI) / 180;
    targetRotationRef.current.pitch = (pitchDeg * Math.PI) / 180;
  };

  const handleReset = () => {
    setIsAutoSpin(false);
    targetRotationRef.current.yaw = 0;
    targetRotationRef.current.pitch = 0;
    targetZoomRef.current = 1;
    setZoomFactor(1);
  };

  return (
    <div className={`watch-3d-stage-container ${className}`}>
      {/* 3D WebGL Canvas Viewport */}
      <div
        ref={mountRef}
        className="watch-3d-viewport"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onWheel={handleWheel}
        style={{ cursor: isInteracting ? 'grabbing' : 'grab' }}
      />

      {/* Real-time Angle & Mode Floating HUD */}
      <div className="watch-3d-hud" aria-live="polite">
        <div className="watch-3d-hud-pill">
          <Compass size={13} className="spin-slow" />
          <span>{currentYawDeg}° AZIMUTH</span>
          <span className="watch-3d-hud-divider">•</span>
          <span>{currentPitchDeg > 0 ? `+${currentPitchDeg}°` : `${currentPitchDeg}°`} TILT</span>
          <span className="watch-3d-hud-divider">•</span>
          <span>{zoomFactor.toFixed(1)}X MACRO</span>
        </div>
      </div>

      {/* Floating Tactical Horology Control Bar */}
      <div className="watch-3d-controls-overlay">
        {/* Preset Angle Buttons */}
        <div className="watch-3d-preset-group">
          <button
            type="button"
            className="watch-3d-ctrl-btn"
            onClick={() => handlePresetAngle(0, 0)}
            title="Front Dial Face (0°)"
          >
            <Eye size={13} />
            <span>Dial</span>
          </button>
          <button
            type="button"
            className="watch-3d-ctrl-btn"
            onClick={() => handlePresetAngle(90, 0)}
            title="Crown Profile (90°)"
          >
            <span>Crown</span>
          </button>
          <button
            type="button"
            className="watch-3d-ctrl-btn"
            onClick={() => handlePresetAngle(45, 20)}
            title="Hero Isometric (45° / +20°)"
          >
            <span>Angle</span>
          </button>
          <button
            type="button"
            className="watch-3d-ctrl-btn"
            onClick={() => handlePresetAngle(180, 0)}
            title="Caseback View (180°)"
          >
            <span>Back</span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="watch-3d-action-group">
          <button
            type="button"
            className={`watch-3d-ctrl-btn icon-only ${isAutoSpin ? 'active' : ''}`}
            onClick={() => setIsAutoSpin(!isAutoSpin)}
            title={isAutoSpin ? 'Pause 360° Turntable' : 'Auto-Spin 360°'}
            aria-label={isAutoSpin ? 'Pause turntable' : 'Auto spin turntable'}
          >
            {isAutoSpin ? <Pause size={13} /> : <Play size={13} />}
          </button>

          <button
            type="button"
            className="watch-3d-ctrl-btn icon-only"
            onClick={() => {
              targetZoomRef.current = Math.min(2.2, targetZoomRef.current + 0.25);
              setZoomFactor(targetZoomRef.current);
            }}
            title="Zoom In"
            aria-label="Zoom in"
          >
            <ZoomIn size={13} />
          </button>

          <button
            type="button"
            className="watch-3d-ctrl-btn icon-only"
            onClick={() => {
              targetZoomRef.current = Math.max(0.7, targetZoomRef.current - 0.25);
              setZoomFactor(targetZoomRef.current);
            }}
            title="Zoom Out"
            aria-label="Zoom out"
          >
            <ZoomOut size={13} />
          </button>

          <button
            type="button"
            className="watch-3d-ctrl-btn icon-only reset"
            onClick={handleReset}
            title="Reset to 0°"
            aria-label="Reset orientation"
          >
            <RotateCcw size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
