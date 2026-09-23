import React, { useState, useRef, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Center, Html } from '@react-three/drei';
import * as THREE from 'three';
import {
  X,
  RotateCw,
  Maximize2,
  Minimize2,
  RefreshCcw,
  ZoomIn,
  ZoomOut,
  AlertCircle,
  Shield,
  Layers,
} from 'lucide-react';

interface Product3DViewerProps {
  modelUrl: string;
  productName: string;
  isOpen: boolean;
  onClose: () => void;
}

// Error Boundary for Three.js Canvas
class CanvasErrorBoundary extends React.Component<
  { fallback: React.ReactNode; children: React.ReactNode; onError?: () => void },
  { hasError: boolean }
> {
  constructor(props: { fallback: React.ReactNode; children: React.ReactNode; onError?: () => void }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any) {
    console.error('3D Viewer Error:', error);
    this.props.onError?.();
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// 3D Model Renderer Component
const ModelRenderer: React.FC<{ url: string }> = ({ url }) => {
  const { scene } = useGLTF(url);

  // Apply soft material properties and shadows
  useEffect(() => {
    if (!scene) return;
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
  }, [scene]);

  return (
    <Center top position={[0, -0.4, 0]}>
      <primitive object={scene} scale={1.8} />
    </Center>
  );
};

// Fallback Loading Indicator inside Three Canvas
const CanvasLoader: React.FC = () => {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3 bg-[#0d0e12]/90 border border-white/10 px-6 py-4 rounded-xl backdrop-blur-md shadow-2xl text-center">
        <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-copper animate-spin" />
        <div>
          <span className="text-xs font-mono tracking-widest text-copper uppercase font-bold block">
            NEXORO ARCHITECTURE
          </span>
          <span className="text-[11px] text-white/60 font-mono mt-0.5 block">
            STREAMING 3D TELEMETRY...
          </span>
        </div>
      </div>
    </Html>
  );
};

export const Product3DViewer: React.FC<Product3DViewerProps> = ({
  modelUrl,
  productName,
  isOpen,
  onClose,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<any>(null);

  const [autoRotate, setAutoRotate] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isFullscreen) {
          document.exitFullscreen?.().catch(() => {});
          setIsFullscreen(false);
        } else {
          onClose();
        }
      }
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
  }, [isOpen, isFullscreen, onClose]);

  // Fullscreen Toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().then(() => {
        setIsFullscreen(true);
      }).catch(() => {});
    } else {
      document.exitFullscreen?.().then(() => {
        setIsFullscreen(false);
      }).catch(() => {});
    }
  };

  // Reset Camera View
  const handleResetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
      controlsRef.current.setAzimuthalAngle(Math.PI / 4);
      controlsRef.current.setPolarAngle(Math.PI / 2.3);
      controlsRef.current.object.position.set(0, 1.2, 3.8);
      controlsRef.current.update();
    }
  };

  // Zoom Adjustments
  const handleZoom = (delta: number) => {
    if (controlsRef.current) {
      const camera = controlsRef.current.object;
      camera.position.z = Math.min(Math.max(camera.position.z + delta, 1.8), 6.5);
      controlsRef.current.update();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 bg-[#070707] text-white flex flex-col justify-between overflow-hidden animate-fade-in select-none"
    >
      {/* 1. Header Bar: NEXORO | VIEW IN 3D | Close Button */}
      <header className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between bg-[#090a0d]/90 backdrop-blur-md z-30">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded bg-copper flex items-center justify-center font-bold text-black text-xs font-headline shadow-md shadow-copper/20">
            N
          </div>
          <div>
            <span className="text-sm font-extrabold font-headline tracking-widest text-white block leading-none">
              NEXORO
            </span>
            <span className="text-[9px] font-mono tracking-widest text-copper uppercase block mt-0.5">
              3D HARDWARE INSPECTOR
            </span>
          </div>
        </div>

        <div className="hidden sm:flex flex-col items-center">
          <span className="text-xs font-bold font-headline text-white uppercase tracking-wider">
            {productName}
          </span>
          <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
            PRECISION ENGINEERED MESH
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-white/70 hover:text-white border border-white/[0.08] transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            aria-label="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/[0.04] hover:bg-red-950/40 text-white/70 hover:text-red-400 border border-white/[0.08] hover:border-red-800/40 transition-colors"
            title="Close 3D Viewer (Esc)"
            aria-label="Close 3D Viewer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* 2. Main 3D Interactive Canvas Area */}
      <main className="relative flex-1 w-full h-full flex items-center justify-center bg-[#070707]">
        {/* Subtle Ambient Radial Studio Lighting backdrop */}
        <div className="absolute inset-0 bg-radial-gradient from-copper/15 via-transparent to-transparent opacity-40 pointer-events-none" />

        {hasError ? (
          /* Error State Fallback */
          <div className="p-8 rounded-2xl bg-[#0e0f13] border border-white/10 text-center max-w-sm z-20 space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-950/40 border border-red-800/40 flex items-center justify-center text-red-400 mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold font-headline text-white">
                3D VIEW UNAVAILABLE
              </h3>
              <p className="text-xs text-white/50 mt-1">
                The 3D hardware asset for this product could not be loaded at this time.
              </p>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-copper hover:bg-copper-hover text-black font-bold text-xs uppercase tracking-wider rounded-lg transition-all"
            >
              VIEW PRODUCT IMAGES
            </button>
          </div>
        ) : (
          /* Three.js Canvas with Studio Lighting & Orbit Controls */
          <Canvas
            shadows
            camera={{ position: [0, 1.2, 3.8], fov: 42 }}
            className="w-full h-full cursor-grab active:cursor-grabbing"
            onPointerDown={() => setIsInteracting(true)}
            onPointerUp={() => setIsInteracting(false)}
          >
            {/* Studio Lighting Setup */}
            <ambientLight intensity={0.5} />
            {/* Key Light */}
            <directionalLight
              position={[4, 5, 4]}
              intensity={1.4}
              castShadow
              shadow-mapSize-width={1024}
              shadow-mapSize-height={1024}
            />
            {/* Fill Light (Soft Warm Copper) */}
            <directionalLight
              position={[-4, 2, -2]}
              intensity={0.7}
              color="#C8834A"
            />
            {/* Rim Light (Cool White Outline) */}
            <directionalLight
              position={[0, 4, -4]}
              intensity={1.0}
              color="#ffffff"
            />
            {/* Under-glow Fill */}
            <pointLight position={[0, -2, 0]} intensity={0.4} color="#E5B98A" />

            <CanvasErrorBoundary
              fallback={
                <Html center>
                  <div className="p-6 bg-[#0e0f13] border border-white/10 rounded-xl text-center max-w-xs">
                    <p className="text-xs text-red-400 font-bold mb-1">Failed to load 3D Asset</p>
                    <p className="text-[11px] text-white/50">The model telemetry file could not be parsed.</p>
                  </div>
                </Html>
              }
              onError={() => setHasError(true)}
            >
              <Suspense fallback={<CanvasLoader />}>
                <ModelRenderer url={modelUrl} />
              </Suspense>
            </CanvasErrorBoundary>

            {/* Orbit Controls */}
            <OrbitControls
              ref={controlsRef}
              enablePan={false}
              enableZoom={true}
              minDistance={1.8}
              maxDistance={6.0}
              maxPolarAngle={Math.PI / 1.7}
              minPolarAngle={Math.PI / 4.5}
              autoRotate={autoRotate && !isInteracting}
              autoRotateSpeed={1.5}
              dampingFactor={0.06}
            />
          </Canvas>
        )}
      </main>

      {/* 3. Bottom Control Console */}
      <footer className="px-6 py-4 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#090a0d]/90 backdrop-blur-md z-30">
        {/* Subtle Guidance Instruction */}
        <div className="flex items-center gap-2 text-xs font-mono text-white/50">
          <span className="w-1.5 h-1.5 rounded-full bg-copper" />
          <span className="tracking-wider">DRAG TO ROTATE &bull; SCROLL TO ZOOM</span>
        </div>

        {/* Tactical Controls Pill */}
        <div className="flex items-center gap-2 bg-[#121317] border border-white/10 p-1 rounded-xl shadow-xl">
          {/* Zoom Out */}
          <button
            onClick={() => handleZoom(0.5)}
            className="p-2 text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            title="Zoom Out"
            aria-label="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          {/* Zoom In */}
          <button
            onClick={() => handleZoom(-0.5)}
            className="p-2 text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            title="Zoom In"
            aria-label="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <span className="w-px h-4 bg-white/10" />

          {/* Reset Camera */}
          <button
            onClick={handleResetCamera}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors font-mono"
            title="Reset to default camera orientation"
          >
            <RefreshCcw className="w-3.5 h-3.5 text-copper" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <span className="w-px h-4 bg-white/10" />

          {/* Auto Rotate Toggle */}
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg transition-all font-mono font-semibold ${
              autoRotate
                ? 'bg-copper text-black shadow-md shadow-copper/20'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
            title="Toggle continuous auto-rotation"
          >
            <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
            <span>Auto Rotate</span>
          </button>
        </div>

        {/* Quality Metadata */}
        <div className="hidden lg:flex items-center gap-2 text-[10px] font-mono text-white/40">
          <Shield className="w-3 h-3 text-copper" />
          <span>TRUE 3D PBR TRANSLATION</span>
        </div>
      </footer>
    </div>
  );
};
