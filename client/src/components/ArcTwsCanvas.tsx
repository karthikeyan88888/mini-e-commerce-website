import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Volume2, ShieldCheck, Cpu, Radio, Sparkles, Layers } from 'lucide-react';
import { Product } from '../types';

interface ArcTwsCanvasProps {
  product?: Product;
}

const TOTAL_FRAMES = 240;

export const ArcTwsCanvas: React.FC<ArcTwsCanvasProps> = ({ product }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();

  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loadProgress, setLoadProgress] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isPreloadStarted, setIsPreloadStarted] = useState(false);
  const [isInitialBatchLoaded, setIsInitialBatchLoaded] = useState(false);
  const [resizeTrigger, setResizeTrigger] = useState(0);

  // Determine target link for "EXPLORE ARC TWS"
  const targetProductPath = product ? `/products/${product.id}` : '/catalog?search=Arc+TWS';

  // Frame URL generator for earbuds sequence
  const getFrameUrl = useCallback((index: number) => {
    const pad = String(index).padStart(3, '0');
    return `/hero/frames/earbuds/ezgif-frame-${pad}.jpg`;
  }, []);

  // Lazy loading observer: start preloading only when user approaches this section
  useEffect(() => {
    if (!containerRef.current || isPreloadStarted) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        // Start preloading when within 800px of viewport
        if (entry.isIntersecting || entry.boundingClientRect.top < window.innerHeight + 800) {
          setIsPreloadStarted(true);
          observer.disconnect();
        }
      },
      { rootMargin: '800px 0px' }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [isPreloadStarted]);

  // Progressive frame loader
  useEffect(() => {
    if (!isPreloadStarted) return;

    let isCancelled = false;
    const loadedImages: HTMLImageElement[] = new Array(TOTAL_FRAMES);
    let loadedCount = 0;

    const loadBatch = async (start: number, end: number) => {
      const promises = [];
      for (let i = start; i <= end; i++) {
        promises.push(
          new Promise<void>((resolve) => {
            const img = new Image();
            img.src = getFrameUrl(i);
            img.onload = () => {
              if (!isCancelled) {
                loadedImages[i - 1] = img;
                loadedCount++;
                setLoadProgress(Math.round((loadedCount / TOTAL_FRAMES) * 100));
              }
              resolve();
            };
            img.onerror = () => {
              // Gracefully resolve on error so remaining frames continue loading
              resolve();
            };
          })
        );
      }
      await Promise.all(promises);
    };

    const loadSequence = async () => {
      // 1. High-priority interactive batch: frames 1-30 (closed case & initial reveal)
      await loadBatch(1, 30);
      if (isCancelled) return;
      setIsInitialBatchLoaded(true);
      setImages([...loadedImages]);

      // 2. Mid batch: frames 31-120 (emergence & assembled hero)
      await loadBatch(31, 120);
      if (isCancelled) return;
      setImages([...loadedImages]);

      // 3. Final batch: frames 121-240 (disassembly & full exploded view)
      await loadBatch(121, TOTAL_FRAMES);
      if (isCancelled) return;
      setImages([...loadedImages]);
    };

    loadSequence();

    return () => {
      isCancelled = true;
    };
  }, [isPreloadStarted, getFrameUrl]);

  // Scroll listener for sticky sequence
  useEffect(() => {
    let animationFrameId: number | null = null;

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalScrollable = containerRef.current.clientHeight - window.innerHeight;
      if (totalScrollable <= 0) return;

      const currentScroll = -rect.top;
      const progress = Math.min(Math.max(currentScroll / totalScrollable, 0), 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  // Window resize handler
  useEffect(() => {
    const handleResize = () => {
      setResizeTrigger((prev) => prev + 1);
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Canvas drawing routine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Calculate active frame index (0..239)
    const targetFrameIndex = Math.min(
      Math.max(Math.floor(scrollProgress * (TOTAL_FRAMES - 1)), 0),
      TOTAL_FRAMES - 1
    );

    // Fallback to nearest loaded frame if current frame is still buffering
    let frameToRender = images[targetFrameIndex];
    if (!frameToRender) {
      for (let offset = 1; offset < 40; offset++) {
        if (images[targetFrameIndex - offset]) {
          frameToRender = images[targetFrameIndex - offset];
          break;
        }
        if (images[targetFrameIndex + offset]) {
          frameToRender = images[targetFrameIndex + offset];
          break;
        }
      }
    }

    const width = canvas.clientWidth || window.innerWidth;
    const height = canvas.clientHeight || window.innerHeight;
    const dpr = window.devicePixelRatio || 1;

    // High-DPI backing buffer
    const targetWidth = Math.round(width * dpr);
    const targetHeight = Math.round(height * dpr);

    if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
      canvas.width = targetWidth;
      canvas.height = targetHeight;
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Seamless obsidian background (#070707)
    ctx.fillStyle = '#070707';
    ctx.fillRect(0, 0, width, height);

    if (frameToRender && frameToRender.complete && frameToRender.naturalWidth > 0) {
      const imgWidth = frameToRender.naturalWidth;
      const imgHeight = frameToRender.naturalHeight;

      // COVER-style scaling: fill viewport width and height, preserving aspect ratio
      const scale = Math.max(width / imgWidth, height / imgHeight);
      const drawWidth = imgWidth * scale;
      const drawHeight = imgHeight * scale;

      // Center frame precisely
      const offsetX = (width - drawWidth) / 2;
      const offsetY = (height - drawHeight) / 2;

      ctx.drawImage(frameToRender, offsetX, offsetY, drawWidth, drawHeight);
    }

    ctx.restore();
  }, [scrollProgress, images, resizeTrigger]);

  // Story phases precisely synchronized with the 240 ARC TWS frames
  // 0–15%: Closed charging case
  // 15–40%: Case opens & earbuds emerge
  // 40–70%: Assembled hero position & mechanical disassembly begins
  // 70–100%: Internal technology reveal & full exploded view
  const phase1 = scrollProgress >= 0 && scrollProgress < 0.18;
  const phase2 = scrollProgress >= 0.18 && scrollProgress < 0.45;
  const phase3 = scrollProgress >= 0.45 && scrollProgress < 0.75;
  const phase4 = scrollProgress >= 0.75;

  const currentFrameNumber = Math.min(Math.floor(scrollProgress * (TOTAL_FRAMES - 1)) + 1, TOTAL_FRAMES);
  const formattedFrameNumber = String(currentFrameNumber).padStart(3, '0');

  const scrollToNextSection = () => {
    if (containerRef.current) {
      window.scrollTo({
        top: containerRef.current.offsetTop + containerRef.current.clientHeight + 60,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div
      id="arc-tws-experience"
      ref={containerRef}
      className="relative h-[440vh] w-full max-w-full bg-[#070707] text-white overflow-x-clip"
      aria-label="NEXORO ARC TWS interactive product anatomy experience"
    >
      {/* Sticky Fullscreen Canvas Viewport (100vw / 100svh / 100vh fallback) */}
      <div className="sticky top-0 w-full w-screen max-w-full h-screen h-[100svh] min-h-[100vh] overflow-hidden flex items-center justify-center">
        {/* Render Canvas: full-bleed cover display */}
        <canvas
          ref={canvasRef}
          className="w-full h-full block pointer-events-none transition-opacity duration-300"
          style={{ width: '100%', height: '100%', display: 'block' }}
        />

        {/* Ambient radial glow subtle backdrop */}
        <div className="absolute inset-0 bg-radial-gradient from-copper/10 via-transparent to-transparent pointer-events-none opacity-25" />

        {/* Narrative Overlays Container (Text is constrained for readability, canvas is NOT) */}
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 sm:p-10 md:p-14 max-w-7xl mx-auto z-20">
          {/* Top Engineering Telemetry Bar */}
          <div className="flex items-center justify-between pt-16 sm:pt-14 pointer-events-auto">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono tracking-[0.25em] text-copper uppercase font-bold">
                NEXORO ARC TWS
              </span>
              <span className="text-white/20">/</span>
              <span className="text-[10px] font-mono text-white/50 tracking-wider">
                FRAME {formattedFrameNumber} / {TOTAL_FRAMES}
              </span>
            </div>

            {loadProgress < 100 && (
              <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono text-white/40">
                <span>BUFFERING</span>
                <span className="text-copper font-bold">{loadProgress}%</span>
              </div>
            )}
          </div>

          {/* Left-Aligned Story Text Area (Leaves Earbuds Visually Centered & Dominant) */}
          <div className="my-auto max-w-[85vw] sm:max-w-md lg:max-w-xl pointer-events-auto">
            {/* Phase 1 (0–18%): Initial Closed Case & Reveal */}
            <div
              className={`transition-all duration-700 ease-out ${
                phase1 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8 pointer-events-none absolute'
              }`}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[10px] font-mono font-bold text-copper uppercase tracking-widest mb-3 sm:mb-4">
                <span className="w-1.5 h-1.5 rounded-[1px] bg-copper shadow-[0_0_6px_#C8834A]" />
                <span>NEXORO WIRELESS ACOUSTICS</span>
              </div>
              <h2 className="text-3xl sm:text-6xl lg:text-7xl font-black font-headline tracking-tighter leading-[0.95] text-white">
                SMALL FORM.<br />
                <span className="copper-gradient-text">ENGINEERED DEEP.</span>
              </h2>
              <p className="mt-3.5 sm:mt-5 text-xs sm:text-base text-white/70 font-normal leading-relaxed max-w-sm sm:max-w-md">
                Compact wireless audio engineered around precision, comfort and control.
              </p>
              <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
                <Link
                  to={targetProductPath}
                  className="px-5 py-3 sm:px-7 sm:py-3.5 bg-copper hover:bg-copper-hover text-black font-black text-[11px] sm:text-xs tracking-widest uppercase rounded-lg shadow-xl shadow-copper/30 transition-all active:scale-95 flex items-center gap-2"
                >
                  <span>EXPLORE ARC TWS</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
                <button
                  onClick={scrollToNextSection}
                  className="px-4 py-3 sm:px-6 sm:py-3.5 bg-white/[0.04] hover:bg-white/[0.08] text-white font-bold text-[11px] sm:text-xs tracking-widest uppercase rounded-lg border border-white/10 hover:border-copper/40 transition-colors"
                >
                  HARDWARE SUITE
                </button>
              </div>
            </div>

            {/* Phase 2 (18–45%): Case Opens & Emergence */}
            <div
              className={`transition-all duration-700 ease-out ${
                phase2 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8 pointer-events-none absolute'
              }`}
            >
              <span className="text-[10px] font-mono tracking-[0.25em] text-copper uppercase font-bold block mb-2">
                CHASSIS ARCHITECTURE // 01
              </span>
              <h3 className="text-3xl sm:text-5xl font-black font-headline tracking-tight text-white leading-tight">
                EVERY MILLIMETER HAS A PURPOSE.
              </h3>
              <p className="mt-4 text-xs sm:text-sm text-white/70 leading-relaxed max-w-md">
                From acoustic chamber geometry to magnetic induction docking, zero space is wasted in the sculptured obsidian charging case.
              </p>
              <div className="mt-6 inline-flex items-center gap-3 px-4 py-2.5 rounded-lg bg-[#0e0f13] border border-copper/30 backdrop-blur-md text-xs text-white/90">
                <Volume2 className="w-4 h-4 text-copper" />
                <span>11mm Liquid Crystal Polymer Driver &bull; <strong className="text-copper font-mono">Dynamic Environment ANC</strong></span>
              </div>
            </div>

            {/* Phase 3 (45–75%): Micro-Engineering & Disassembly */}
            <div
              className={`transition-all duration-700 ease-out ${
                phase3 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8 pointer-events-none absolute'
              }`}
            >
              <span className="text-[10px] font-mono tracking-[0.25em] text-copper uppercase font-bold block mb-2">
                MICRO-ENGINEERING // 02
              </span>
              <h3 className="text-3xl sm:text-5xl font-black font-headline tracking-tight text-white leading-tight">
                PRECISION, REDUCED.
              </h3>
              <div className="mt-5 space-y-2.5 text-xs text-white/80 max-w-md">
                <div className="flex items-center gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-copper" />
                  <span>Ultra-low power Bluetooth 5.4 LE Audio architecture with lossless codec streaming</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-copper" />
                  <span>Dual MEMS beamforming microphone array for studio vocal clarity</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-copper" />
                  <span>Active environmental suppression neutralizing ambient acoustic turbulence</span>
                </div>
              </div>
            </div>

            {/* Phase 4 (75–100%): Full Exploded Architecture Reveal */}
            <div
              className={`transition-all duration-700 ease-out ${
                phase4 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8 pointer-events-none absolute'
              }`}
            >
              <span className="text-[10px] font-mono tracking-[0.25em] text-copper uppercase font-bold block mb-2">
                INTERNAL TECHNOLOGY REVEAL // 03
              </span>
              <h3 className="text-3xl sm:text-5xl font-black font-headline tracking-tight text-white leading-tight">
                ENGINEERED FROM THE INSIDE OUT.
              </h3>
              <p className="mt-4 text-xs sm:text-sm text-white/70 leading-relaxed max-w-md">
                Complete exploded architecture revealing acoustic nozzle, ceramic acoustic mesh, discrete DSP engine, and high-efficiency induction cell.
              </p>
              <div className="mt-8 flex items-center gap-4">
                <Link
                  to={targetProductPath}
                  className="px-8 py-3.5 bg-copper hover:bg-copper-hover text-black font-black text-xs tracking-widest uppercase rounded-lg shadow-xl shadow-copper/30 transition-all active:scale-95 flex items-center gap-2"
                >
                  <span>EXPLORE ARC TWS</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
                <button
                  onClick={scrollToNextSection}
                  className="px-6 py-3.5 bg-white/[0.04] hover:bg-white/[0.08] text-white font-bold text-xs tracking-widest uppercase rounded-lg border border-white/10 hover:border-copper/40 transition-colors"
                >
                  CONTINUE TO STORE
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Telemetry & Subtle Copper Progress Bar */}
          <div className="flex items-center justify-between pt-6 border-t border-white/[0.08] pointer-events-auto">
            <div className="flex items-center gap-3 text-xs text-white/50 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-copper animate-ping" />
              <span className="tracking-wider">SCROLL TO EXPLORE MICRO-ANATOMY</span>
            </div>

            {/* Thin Premium Copper Progress Bar */}
            <div className="flex items-center gap-3">
              <div className="w-36 h-[2px] bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-copper shadow-[0_0_8px_#C8834A] transition-all duration-150"
                  style={{ width: `${scrollProgress * 100}%` }}
                />
              </div>
              <span className="text-[11px] font-mono text-copper font-bold w-10 text-right">
                {Math.round(scrollProgress * 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
