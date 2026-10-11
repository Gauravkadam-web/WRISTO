'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Play,
  Pause,
  Eye,
  Compass,
  Layers,
  Search,
  Move3d,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { Product } from '@/types/product';

interface Watch3DCanvasProps {
  product: Product;
  className?: string;
  onAngleChange?: (yaw: number) => void;
  onSwitchToMacro?: () => void;
}

export default function Watch3DCanvas({
  product,
  className = '',
  onAngleChange,
  onSwitchToMacro
}: Watch3DCanvasProps) {
  // If product has a 3D model asset, render the WebGL GLTF Stage
  // Otherwise, render Option B: Luxury Horological Digital Twin Vault Card
  const hasModel = Boolean(product.model3dUrl);

  return hasModel ? (
    <WebGLWatchStage
      product={product}
      className={className}
      onAngleChange={onAngleChange}
    />
  ) : (
    <OptionBVaultFallback
      product={product}
      className={className}
      onSwitchToMacro={onSwitchToMacro}
      onAngleChange={onAngleChange}
    />
  );
}

/* ==========================================================================
   1. WEBGL WATCH STAGE — Dynamic GLTF/GLB Asset Loader & 3D Stage
   ========================================================================== */
function WebGLWatchStage({
  product,
  className = '',
  onAngleChange
}: {
  product: Product;
  className?: string;
  onAngleChange?: (yaw: number) => void;
}) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isAutoSpin, setIsAutoSpin] = useState(true);
  const [currentYawDeg, setCurrentYawDeg] = useState(0);
  const [currentPitchDeg, setCurrentPitchDeg] = useState(0);
  const [zoomFactor, setZoomFactor] = useState(1);

  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);

  // Target camera position for smooth interpolation
  const targetCameraPosRef = useRef<THREE.Vector3 | null>(null);
  const targetLookAtRef = useRef<THREE.Vector3 | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container || !product.model3dUrl) return;

    let isMounted = true;
    setIsLoading(true);
    setLoadError(null);

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = null;

    // Camera setup
    const width = container.clientWidth || 500;
    const height = container.clientHeight || 500;
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0, 3.2);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Controls setup
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.8;
    controls.zoomSpeed = 0.8;
    controls.enablePan = false;
    controls.minDistance = 1.4;
    controls.maxDistance = 5.5;
    controls.autoRotate = isAutoSpin;
    controls.autoRotateSpeed = 1.2;
    controlsRef.current = controls;

    // Lighting setup (Luxury Horology Studio)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    // Key warm light (accentuating gold/steel indices)
    const keyLight = new THREE.DirectionalLight(0xffecd2, 1.4);
    keyLight.position.set(3, 4, 3);
    scene.add(keyLight);

    // Fill cool light (for metallic bezel reflections)
    const fillLight = new THREE.DirectionalLight(0xdbeafe, 0.9);
    fillLight.position.set(-3, -2, 2);
    scene.add(fillLight);

    // Rim light (highlighting case silhouette)
    const rimLight = new THREE.DirectionalLight(0xffffff, 1.2);
    rimLight.position.set(0, -3, -3);
    scene.add(rimLight);

    // GLTF Model Loader
    const loader = new GLTFLoader();
    loader.load(
      product.model3dUrl,
      (gltf) => {
        if (!isMounted) return;

        const model = gltf.scene;
        modelGroupRef.current = model;

        // Auto-center and fit to bounding box
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);

        // Normalize model size
        const scale = 2.0 / (maxDim || 1);
        model.scale.setScalar(scale);

        // Center pivot
        model.position.x = -center.x * scale;
        model.position.y = -center.y * scale;
        model.position.z = -center.z * scale;

        const wrapperGroup = new THREE.Group();
        wrapperGroup.add(model);
        scene.add(wrapperGroup);

        setIsLoading(false);
      },
      undefined,
      (err) => {
        if (!isMounted) return;
        console.error('Error loading 3D GLTF watch model:', err);
        setLoadError('Failed to load 3D CAD asset.');
        setIsLoading(false);
      }
    );

    // Animation Loop
    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      // Handle smooth camera preset lerp
      if (targetCameraPosRef.current && cameraRef.current) {
        cameraRef.current.position.lerp(targetCameraPosRef.current, 0.08);
        if (targetLookAtRef.current && controlsRef.current) {
          controlsRef.current.target.lerp(targetLookAtRef.current, 0.08);
        }
        if (cameraRef.current.position.distanceTo(targetCameraPosRef.current) < 0.01) {
          targetCameraPosRef.current = null;
        }
      }

      controls.update();

      // Update angle HUD readouts
      const spherical = new THREE.Spherical().setFromVector3(camera.position);
      const yawDeg = Math.round((spherical.theta * 180) / Math.PI) % 360;
      const normalizedYaw = yawDeg < 0 ? yawDeg + 360 : yawDeg;
      const pitchDeg = Math.round(((spherical.phi - Math.PI / 2) * 180) / Math.PI);

      setCurrentYawDeg(normalizedYaw);
      setCurrentPitchDeg(pitchDeg);
      setZoomFactor(Number((3.2 / camera.position.length()).toFixed(2)));

      if (onAngleChange) {
        onAngleChange(normalizedYaw);
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize observer
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    return () => {
      isMounted = false;
      resizeObserver.disconnect();
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      controls.dispose();
      renderer.dispose();
      container.innerHTML = '';
    };
  }, [product.model3dUrl, onAngleChange, isAutoSpin]);

  // Sync auto-spin with OrbitControls
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = isAutoSpin;
    }
  }, [isAutoSpin]);

  // Camera preset transitions
  const handlePreset = (azimuthDeg: number, polarDeg: number) => {
    setIsAutoSpin(false);
    const radius = cameraRef.current ? cameraRef.current.position.length() : 3.2;
    const phi = (90 - polarDeg) * (Math.PI / 180);
    const theta = azimuthDeg * (Math.PI / 180);

    const x = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.cos(theta);

    targetCameraPosRef.current = new THREE.Vector3(x, y, z);
    targetLookAtRef.current = new THREE.Vector3(0, 0, 0);
  };

  const handleReset = () => {
    handlePreset(0, 0);
    setIsAutoSpin(true);
  };

  return (
    <div className={`watch-3d-stage-container ${className}`}>
      {/* Loading & Error States */}
      {isLoading && (
        <div className="watch-3d-loading-overlay">
          <RotateCw className="animate-spin text-amber-300" size={32} />
          <span className="text-xs uppercase tracking-widest text-amber-200 font-medium">
            Resolving Caliber 3D CAD Mesh...
          </span>
        </div>
      )}

      {loadError && (
        <div className="watch-3d-error-overlay">
          <span className="text-xs text-rose-300">{loadError}</span>
        </div>
      )}

      {/* WebGL Canvas Viewport */}
      <div ref={mountRef} className="watch-3d-viewport" />

      {/* Floating Tactical HUD */}
      <div className="watch-3d-hud" aria-live="polite">
        <div className="watch-3d-hud-pill">
          <Compass size={13} className="spin-slow" />
          <span>{currentYawDeg}° AZIMUTH</span>
          <span className="watch-3d-hud-divider">•</span>
          <span>{currentPitchDeg > 0 ? `+${currentPitchDeg}°` : `${currentPitchDeg}°`} TILT</span>
          <span className="watch-3d-hud-divider">•</span>
          <span>{zoomFactor.toFixed(1)}X MAG</span>
        </div>
      </div>

      {/* Floating Camera Presets & Action Controls */}
      <div className="watch-3d-controls-overlay">
        <div className="watch-3d-preset-group">
          <button
            type="button"
            className="watch-3d-ctrl-btn"
            onClick={() => handlePreset(0, 0)}
            title="Dial View (0°)"
          >
            <Eye size={13} />
            <span>Dial</span>
          </button>
          <button
            type="button"
            className="watch-3d-ctrl-btn"
            onClick={() => handlePreset(90, 0)}
            title="Crown Profile (90°)"
          >
            <span>Crown</span>
          </button>
          <button
            type="button"
            className="watch-3d-ctrl-btn"
            onClick={() => handlePreset(45, 20)}
            title="Hero Isometric (45° / +20°)"
          >
            <span>Angle</span>
          </button>
          <button
            type="button"
            className="watch-3d-ctrl-btn"
            onClick={() => handlePreset(180, 0)}
            title="Caseback View (180°)"
          >
            <span>Back</span>
          </button>
        </div>

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
              if (cameraRef.current) {
                cameraRef.current.position.multiplyScalar(0.85);
              }
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
              if (cameraRef.current) {
                cameraRef.current.position.multiplyScalar(1.18);
              }
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
            title="Reset Orientation"
            aria-label="Reset orientation"
          >
            <RotateCcw size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   2. OPTION B: LUXURY HOROLOGICAL DIGITAL TWIN VAULT CARD
   ========================================================================== */
function OptionBVaultFallback({
  product,
  className = '',
  onSwitchToMacro,
  onAngleChange
}: {
  product: Product;
  className?: string;
  onSwitchToMacro?: () => void;
  onAngleChange?: (yaw: number) => void;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [azimuthDeg, setAzimuthDeg] = useState(0);
  const [glintPos, setGlintPos] = useState({ x: 50, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const [isAutoRocking, setIsAutoRocking] = useState(false);

  const startDragXRef = useRef(0);
  const startAzimuthRef = useRef(0);
  const animFrameRef = useRef<number | null>(null);

  // Auto-rocking turntable animation
  useEffect(() => {
    if (!isAutoRocking) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    let startTime = performance.now();
    const loop = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      const angle = Math.sin(elapsed * 1.5) * 22; // gentle -22 to +22 deg rocking
      const normalizedYaw = Math.round(angle < 0 ? angle + 360 : angle);
      setRotateY(angle);
      setRotateX(Math.cos(elapsed * 1.5) * 6);
      setAzimuthDeg(normalizedYaw);
      if (onAngleChange) onAngleChange(normalizedYaw);
      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isAutoRocking, onAngleChange]);

  // Mouse move perspective physics
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging || isAutoRocking) return;
    const stage = stageRef.current;
    if (!stage) return;

    const rect = stage.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;

    const nx = (x - cx) / cx;
    const ny = (y - cy) / cy;

    const rotX = -ny * 14;
    const rotY = nx * 18;
    setRotateX(rotX);
    setRotateY(rotY);

    const deg = Math.round(rotY * 2);
    const yaw = deg < 0 ? deg + 360 : deg;
    setAzimuthDeg(yaw);
    if (onAngleChange) onAngleChange(yaw);

    setGlintPos({
      x: Math.round((x / rect.width) * 100),
      y: Math.round((y / rect.height) * 100)
    });
  };

  const handleMouseLeave = () => {
    if (isDragging || isAutoRocking) return;
    setRotateX(0);
    setRotateY(0);
    setAzimuthDeg(0);
    if (onAngleChange) onAngleChange(0);
  };

  // Drag-to-spin interaction
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsAutoRocking(false);
    setIsDragging(true);
    startDragXRef.current = e.clientX;
    startAzimuthRef.current = azimuthDeg;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsAutoRocking(false);
      setIsDragging(true);
      startDragXRef.current = e.touches[0].clientX;
      startAzimuthRef.current = azimuthDeg;
    }
  };

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - startDragXRef.current;
      const newAzimuth = (startAzimuthRef.current + Math.round(deltaX * 0.8)) % 360;
      const normalizedYaw = newAzimuth < 0 ? newAzimuth + 360 : newAzimuth;
      setAzimuthDeg(normalizedYaw);
      setRotateY(Math.sin((normalizedYaw * Math.PI) / 180) * 16);
      if (onAngleChange) onAngleChange(normalizedYaw);
    };

    const handleGlobalTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - startDragXRef.current;
      const newAzimuth = (startAzimuthRef.current + Math.round(deltaX * 0.8)) % 360;
      const normalizedYaw = newAzimuth < 0 ? newAzimuth + 360 : newAzimuth;
      setAzimuthDeg(normalizedYaw);
      setRotateY(Math.sin((normalizedYaw * Math.PI) / 180) * 16);
      if (onAngleChange) onAngleChange(normalizedYaw);
    };

    const handleGlobalEnd = () => {
      if (isDragging) {
        setIsDragging(false);
      }
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('mouseup', handleGlobalEnd);
      window.addEventListener('touchmove', handleGlobalTouchMove);
      window.addEventListener('touchend', handleGlobalEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalEnd);
      window.removeEventListener('touchmove', handleGlobalTouchMove);
      window.removeEventListener('touchend', handleGlobalEnd);
    };
  }, [isDragging, onAngleChange]);

  const scrollToDimensions = () => {
    const elem = document.querySelector('.case-dimensions-wrapper');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  return (
    <div className={`watch-3d-stage-container vault-twin-stage ${className}`}>
      {/* Top Archival Status Banner */}
      <div className="vault-twin-header">
        <div className="vault-twin-status-badge">
          <ShieldCheck size={12} strokeWidth={2} className="vault-gold-icon" />
          <span>3D DIGITAL TWIN ARCHIVE</span>
        </div>
        <div className="vault-twin-stage-tag">
          <span className="vault-pulse-dot" />
          <span>PHOTOGRAMMETRY SCANNING</span>
        </div>
      </div>

      {/* Floating Tactical HUD */}
      <div className="watch-3d-hud" aria-live="polite">
        <div className="watch-3d-hud-pill">
          <Compass size={13} className={isAutoRocking ? 'spin-slow' : ''} />
          <span>{azimuthDeg}° AZIMUTH</span>
          <span className="watch-3d-hud-divider">•</span>
          <span>{rotateX > 0 ? `+${Math.round(rotateX)}°` : `${Math.round(rotateX)}°`} TILT</span>
          <span className="watch-3d-hud-divider">•</span>
          <span>DYNAMIC 2.5D</span>
        </div>
      </div>

      {/* Interactive 2.5D Dial Disc Aperture */}
      <div
        ref={stageRef}
        className={`vault-twin-aperture ${isDragging ? 'is-dragging' : ''}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        role="region"
        aria-label="Interactive 2.5D Watch Stage"
      >
        {/* Outer Circular Caliper Ring */}
        <div className="vault-twin-guilloche-ring" aria-hidden="true" />

        {/* Dynamic Watch Silhouette with Perspective Tilt */}
        <div
          className="vault-twin-image-wrap"
          style={{
            transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`,
            transition: isDragging ? 'none' : 'transform 160ms cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <img
            src={product.posterImageUrl || product.image}
            alt={`${product.brand} ${product.model} Vault 3D Twin`}
            className="vault-twin-img"
            draggable={false}
          />

          {/* Dynamic Sapphire Glint Shimmer */}
          <div
            className="vault-twin-glint"
            style={{
              background: `radial-gradient(circle at ${glintPos.x}% ${glintPos.y}%, rgba(255,255,255,0.4) 0%, rgba(222,192,149,0.2) 32%, transparent 68%)`
            }}
            aria-hidden="true"
          />
        </div>

        {/* Interactive Drag Hint Pill */}
        <div className="vault-twin-drag-hint">
          <Move3d size={12} strokeWidth={2} />
          <span>DRAG TO TILT &bull; 360° PREVIEW</span>
        </div>
      </div>

      {/* Vault Caliber Ledger Badges */}
      <div className="vault-twin-specs-row">
        <div className="vault-spec-pill">
          <span className="vault-spec-label">DIAMETER</span>
          <span className="vault-spec-val">{product.caseSize || '40mm'}</span>
        </div>
        <div className="vault-spec-pill">
          <span className="vault-spec-label">CALIBER</span>
          <span className="vault-spec-val">{product.movement}</span>
        </div>
        <div className="vault-spec-pill">
          <span className="vault-spec-label">LUG SPAN</span>
          <span className="vault-spec-val">{product.caseLugToLug || '47.5mm'}</span>
        </div>
      </div>

      {/* Vault Footer Action Controls */}
      <div className="vault-twin-footer-actions">
        {onSwitchToMacro && (
          <button
            type="button"
            className="vault-action-btn primary"
            onClick={onSwitchToMacro}
            title="Inspect Macro Dial Finish"
          >
            <Search size={13} strokeWidth={2} />
            <span>Macro Dial View</span>
          </button>
        )}

        <button
          type="button"
          className="vault-action-btn"
          onClick={scrollToDimensions}
          title="Jump to Case Dimension Calipers"
        >
          <Cpu size={13} strokeWidth={2} />
          <span>Caliper Specs</span>
        </button>

        <button
          type="button"
          className={`vault-action-btn icon-only ${isAutoRocking ? 'active' : ''}`}
          onClick={() => setIsAutoRocking(!isAutoRocking)}
          title={isAutoRocking ? 'Pause Turntable' : 'Play Auto-Rocking Turntable'}
          aria-label={isAutoRocking ? 'Pause turntable' : 'Play turntable'}
        >
          {isAutoRocking ? <Pause size={13} strokeWidth={2} /> : <Play size={13} strokeWidth={2} />}
        </button>

        <button
          type="button"
          className="vault-action-btn icon-only"
          onClick={() => {
            setIsAutoRocking(false);
            setRotateX(0);
            setRotateY(0);
            setAzimuthDeg(0);
            if (onAngleChange) onAngleChange(0);
          }}
          title="Reset Orientation"
          aria-label="Reset orientation"
        >
          <RotateCcw size={13} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
