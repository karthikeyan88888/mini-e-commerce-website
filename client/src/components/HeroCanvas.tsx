import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Volume2, ArrowDown, ShieldCheck } from 'lucide-react';

const TOTAL_FRAMES = 300;

export const HeroCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loadProgress, setLoadProgress] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isInitialLoaded, setIsInitialLoaded] = useState(false);

  // Frame URL generator
  const getFrameUrl = (index: number) => {
    const pad = String(index).padStart(3, '0');
    return `/hero/frames/ezgif-frame-001.jpg`.replace('001', pad);
  };

  // Preload frames progressively
  useEffect(() => {
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
              resolve();
            };
          })
        );
      }
      await Promise.all(promises);
    };

    const loadAllFrames = async () => {
      // First high-priority batch (frames 1-30)
      await loadBatch(1, 30);
      if (isCancelled) return;
      setIsInitialLoaded(true);
      setImages([...loadedImages]);

      // Second batch (31 - 150)
      await loadBatch(31, 150);
      if (isCancelled) return;
      setImages([...loadedImages]);

      // Final batch (151 - 300)
      await loadBatch(151, TOTAL_FRAMES);
      if (isCancelled) return;
      setImages([...loadedImages]);
    };

    loadAllFrames();

    return () => {
      isCancelled = true;
    };
  }, []);

  // Handle scroll progress
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

  // Canvas drawing routine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const targetFrameIndex = Math.min(
      Math.max(Math.floor(scrollProgress * (TOTAL_FRAMES - 1)), 0),
      TOTAL_FRAMES - 1
    );

    // Find nearest loaded frame if current frame is loading
    let frameToRender = images[targetFrameIndex];
    if (!frameToRender) {
      for (let offset = 1; offset < 25; offset++) {
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

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.fillStyle = '#070707';
    ctx.fillRect(0, 0, width, height);

    if (frameToRender && frameToRender.complete && frameToRender.naturalWidth > 0) {
      const imgRatio = frameToRender.naturalWidth / frameToRender.naturalHeight;
      const canvasRatio = width / height;

      let drawWidth = width;
      let drawHeight = height;
      let offsetX = 0;
      let offsetY = 0;

      if (canvasRatio > imgRatio) {
        drawHeight = height * 0.92;
        drawWidth = drawHeight * imgRatio;
        offsetX = (width - drawWidth) / 2;
        offsetY = (height - drawHeight) / 2;
      } else {
        drawWidth = width * 0.96;
        drawHeight = drawWidth / imgRatio;
        offsetX = (width - drawWidth) / 2;
        offsetY = (height - drawHeight) / 2;
      }

      ctx.drawImage(frameToRender, offsetX, offsetY, drawWidth, drawHeight);
    }

    ctx.restore();
  }, [scrollProgress, images]);

  // Story phases precisely synchronized with user requirements
  const phase1 = scrollProgress >= 0 && scrollProgress < 0.15;
  const phase2 = scrollProgress >= 0.15 && scrollProgress < 0.35;
  const phase3 = scrollProgress >= 0.35 && scrollProgress < 0.55;
  const phase4 = scrollProgress >= 0.55 && scrollProgress < 0.75;
  const phase5 = scrollProgress >= 0.75 && scrollProgress < 0.90;
  const phase6 = scrollProgress >= 0.90;

  const currentFrameNumber = Math.min(Math.floor(scrollProgress * (TOTAL_FRAMES - 1)) + 1, TOTAL_FRAMES);
  const formattedFrameNumber = String(currentFrameNumber).padStart(3, '0');

  const scrollToStore = () => {
    if (containerRef.current) {
      window.scrollTo({
        top: containerRef.current.clientHeight + 80,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div ref={containerRef} className="relative h-[480vh] bg-[#070707] text-white">
      {/* Sticky Fullscreen Canvas Viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        {/* Render Canvas */}
        <canvas
          ref={canvasRef}
          className="w-full h-full object-contain pointer-events-none transition-opacity duration-500"
        />

        {/* Ambient radial glow subtle backdrop */}
        <div className="absolute inset-0 bg-radial-gradient from-copper/10 via-transparent to-transparent pointer-events-none opacity-30" />

        {/* Narrative Overlays Container */}
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 sm:p-10 md:p-14 max-w-7xl mx-auto z-20">
          {/* Top Engineering Telemetry Bar */}
          <div className="flex items-center justify-between pt-16 sm:pt-14 pointer-events-auto">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono tracking-[0.25em] text-copper uppercase font-bold">
                NEXORO ARCHITECTURE
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

          {/* Left-Aligned Story Text Area (Leaves Headphone Visually Center-Right & Dominant) */}
          <div className="my-auto max-w-md lg:max-w-xl pointer-events-auto">
            {/* 0–15%: Hero Title */}
            <div
              className={`transition-all duration-700 ease-out ${
                phase1 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8 pointer-events-none absolute'
              }`}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[10px] font-mono font-bold text-copper uppercase tracking-widest mb-4">
                <span className="w-1.5 h-1.5 rounded-[1px] bg-copper shadow-[0_0_6px_#C8834A]" />
                <span>NEXORO ACOUSTICS</span>
              </div>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black font-headline tracking-tighter leading-[0.95] text-white">
                SOUND,<br />
                <span className="copper-gradient-text">RE-ENGINEERED.</span>
              </h1>
              <p className="mt-5 text-sm sm:text-base text-white/70 font-normal leading-relaxed max-w-md">
                Acoustic precision engineered for effortless transient speed, master-grade planar resolution, and zero enclosure distortion.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  onClick={scrollToStore}
                  className="px-7 py-3.5 bg-copper hover:bg-copper-hover text-black font-black text-xs tracking-widest uppercase rounded-lg shadow-xl shadow-copper/30 transition-all active:scale-95 flex items-center gap-2"
                >
                  <span>EXPLORE THE COLLECTION</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <Link
                  to="/catalog"
                  className="px-6 py-3.5 bg-white/[0.04] hover:bg-white/[0.08] text-white font-bold text-xs tracking-widest uppercase rounded-lg border border-white/10 hover:border-copper/40 transition-colors"
                >
                  SHOP CATALOGUE
                </Link>
              </div>
            </div>

            {/* 15–35%: Phase 01 */}
            <div
              className={`transition-all duration-700 ease-out ${
                phase2 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8 pointer-events-none absolute'
              }`}
            >
              <span className="text-[10px] font-mono tracking-[0.25em] text-copper uppercase font-bold block mb-2">
                STRUCTURAL ARCHITECTURE // 01
              </span>
              <h2 className="text-3xl sm:text-5xl font-black font-headline tracking-tight text-white leading-tight">
                ENGINEERED FROM THE INSIDE OUT.
              </h2>
              <p className="mt-4 text-xs sm:text-sm text-white/70 leading-relaxed max-w-md">
                Every component is sculpted from structural grade alloys, isolating mechanical resonances and delivering absolute transparency across all musical registers.
              </p>
              <div className="mt-6 flex items-center gap-6 text-[11px] font-mono text-white/50">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-copper rounded-full" />
                  <span>AEROSPACE ALLOY CHASSIS</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-copper rounded-full" />
                  <span>DUAL-PORT RESONATORS</span>
                </div>
              </div>
            </div>

            {/* 35–55%: Phase 02 */}
            <div
              className={`transition-all duration-700 ease-out ${
                phase3 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8 pointer-events-none absolute'
              }`}
            >
              <span className="text-[10px] font-mono tracking-[0.25em] text-copper uppercase font-bold block mb-2">
                TRANSDUCER MATRIX // 02
              </span>
              <h2 className="text-3xl sm:text-5xl font-black font-headline tracking-tight text-white leading-tight">
                EVERY COMPONENT HAS A PURPOSE.
              </h2>
              <p className="mt-4 text-xs sm:text-sm text-white/70 leading-relaxed max-w-md">
                From cryogenic voice coils to calibrated beryllium membranes, zero mass is wasted. Each physical layer serves a defined electroacoustic goal.
              </p>
              <div className="mt-6 inline-flex items-center gap-3 px-4 py-2.5 rounded-lg bg-[#0e0f13] border border-copper/30 backdrop-blur-md text-xs text-white/90">
                <Volume2 className="w-4 h-4 text-copper" />
                <span>50mm Pure Beryllium Diaphragm &bull; <strong className="text-copper font-mono">&lt; 0.0001% THD</strong></span>
              </div>
            </div>

            {/* 55–75%: Phase 03 */}
            <div
              className={`transition-all duration-700 ease-out ${
                phase4 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8 pointer-events-none absolute'
              }`}
            >
              <span className="text-[10px] font-mono tracking-[0.25em] text-copper uppercase font-bold block mb-2">
                DISCRETE DSP ENGINE // 03
              </span>
              <h2 className="text-3xl sm:text-5xl font-black font-headline tracking-tight text-white leading-tight">
                TECHNOLOGY YOU CAN HEAR.
              </h2>
              <div className="mt-5 space-y-2.5 text-xs text-white/80 max-w-md">
                <div className="flex items-center gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-copper" />
                  <span>Ultra-linear 64-bit floating-point audio engine with zero jitter</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-copper" />
                  <span>Adaptive beamforming microphone array for studio clarity</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-copper" />
                  <span>Direct-drive balanced output stage capable of powering 600&Omega; loads</span>
                </div>
              </div>
            </div>

            {/* 75–90%: Phase 04 */}
            <div
              className={`transition-all duration-700 ease-out ${
                phase5 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8 pointer-events-none absolute'
              }`}
            >
              <span className="text-[10px] font-mono tracking-[0.25em] text-copper uppercase font-bold block mb-2">
                EXPLODED HARMONY // 04
              </span>
              <h2 className="text-3xl sm:text-5xl font-black font-headline tracking-tight text-white leading-tight">
                PRECISION IN EVERY LAYER.
              </h2>
              <p className="mt-4 text-xs sm:text-sm text-white/70 leading-relaxed max-w-md">
                142 meticulously machined components working in concert. Experience total dimensional imaging where every instrument occupies its true spatial coordinates.
              </p>
            </div>

            {/* 90–100%: Phase 05 Conclusion */}
            <div
              className={`transition-all duration-700 ease-out ${
                phase6 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8 pointer-events-none absolute'
              }`}
            >
              <span className="text-[10px] font-mono tracking-[0.25em] text-copper uppercase font-bold block mb-2">
                THE NEXORO STANDARD
              </span>
              <h2 className="text-3xl sm:text-5xl font-black font-headline tracking-tight text-white leading-tight">
                NOTHING UNNECESSARY.<br />
                <span className="copper-gradient-text">EVERYTHING INTENTIONAL.</span>
              </h2>
              <div className="mt-8 flex items-center gap-4">
                <button
                  onClick={scrollToStore}
                  className="px-8 py-3.5 bg-copper hover:bg-copper-hover text-black font-black text-xs tracking-widest uppercase rounded-lg shadow-xl shadow-copper/30 transition-all active:scale-95 flex items-center gap-2"
                >
                  <span>EXPLORE STOREFRONT</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <Link
                  to="/catalog"
                  className="px-6 py-3.5 bg-white/[0.04] hover:bg-white/[0.08] text-white font-bold text-xs tracking-widest uppercase rounded-lg border border-white/10 hover:border-copper/40 transition-colors"
                >
                  CATALOGUE (27 SYSTEMS)
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Telemetry & Subtle Copper Progress Bar */}
          <div className="flex items-center justify-between pt-6 border-t border-white/[0.08] pointer-events-auto">
            <div className="flex items-center gap-3 text-xs text-white/50 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-copper animate-ping" />
              <span className="tracking-wider">SCROLL TO EXPLORE THE ANATOMY</span>
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
