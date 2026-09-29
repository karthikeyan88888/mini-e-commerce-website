import React, { useState } from 'react';
import { Cpu, Layers, Disc, Volume2, Shield, Info, Check, Radio } from 'lucide-react';

interface Hotspot {
  id: string;
  name: string;
  xPercent: number; // Position on image X %
  yPercent: number; // Position on image Y %
  subsystem: string;
  specs: string;
  description: string;
  metric: string;
}

const HOTSPOTS: Hotspot[] = [
  {
    id: 'driver',
    name: 'PLANAR MAGNETIC MATRIX',
    xPercent: 50,
    yPercent: 54,
    subsystem: 'Transducer Core // Layer 01',
    specs: '90mm Ultra-Thin Polyimide Planar Film & NdFeB Neodymium Array',
    description: 'Ultra-low mass diaphragm suspended between symmetrical push-pull magnetic fields, delivering sub-millisecond transient response and vanishingly low distortion across 4Hz - 52,000Hz.',
    metric: '< 0.0001% THD @ 1kHz',
  },
  {
    id: 'earcup',
    name: 'OPEN ACOUSTIC RESONANCE CHAMBER',
    xPercent: 68,
    yPercent: 52,
    subsystem: 'Acoustic Enclosure // Layer 02',
    specs: 'CNC Machined Aircraft-Grade Aluminum & Stainless Mesh',
    description: 'Laser-perforated acoustic rear baffle eliminating internal cavity reflections and pressure build-up, creating a natural open soundstage with holographic lateral separation.',
    metric: 'Zero Cavity Compression',
  },
  {
    id: 'headband',
    name: 'CRANIAL SUSPENSION ARCH',
    xPercent: 50,
    yPercent: 18,
    subsystem: 'Ergonomic Support // Layer 03',
    specs: 'Spring Steel Frame with Perforated Full-Grain Lambskin',
    description: 'Dual-axis weight distribution mechanism calibrated to disperse 365g of total mass evenly across the sagittal crest, preventing fatigue during multi-hour mastering sessions.',
    metric: '1.4 N Calibrated Clamp',
  },
  {
    id: 'interconnect',
    name: 'BALANCED TERMINAL ARRAY',
    xPercent: 32,
    yPercent: 82,
    subsystem: 'Signal Interconnect // Layer 04',
    specs: 'Dual 4-Pin Mini-XLR Gold-Plated Locking Sockets',
    description: 'Independent balanced ground returns isolate left and right channels to eliminate crosstalk and signal degradation across high-power balanced headphone amplifier outputs.',
    metric: '> 115dB Channel Separation',
  },
  {
    id: 'damping',
    name: 'CRYOGENIC RESONANCE DAMPING',
    xPercent: 30,
    yPercent: 44,
    subsystem: 'Vibration Control // Layer 05',
    specs: 'Sorbothane Acoustic Isolation & Viscoelastic Dampers',
    description: 'Decouples the planar driver assembly from the outer aluminum yoke, dissipating mechanical micro-vibrations before they color upper-mid harmonic clarity.',
    metric: '-24dB Mechanical Damping',
  },
];

interface ProductEngineeringHotspotsProps {
  imageUrl: string;
  productName: string;
}

export const ProductEngineeringHotspots: React.FC<ProductEngineeringHotspotsProps> = ({
  imageUrl,
  productName,
}) => {
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot>(HOTSPOTS[0]);

  return (
    <div className="bg-[#0c0d11] border border-purple-500/30 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-purple-500/15 border border-purple-500/40 text-[10px] font-mono font-black text-purple-300 uppercase tracking-widest mb-1.5 shadow-[0_0_10px_rgba(168,85,247,0.2)]">
            <Cpu className="w-3 h-3 text-purple-400" />
            <span>EXPLORE THE ENGINEERING // TELEMETRY HOTSPOTS</span>
          </div>
          <h3 className="text-xl font-black font-headline text-white tracking-tight">
            STRUCTURAL & ACOUSTIC ARCHITECTURE
          </h3>
        </div>

        <span className="text-[11px] font-mono text-white/50">
          SELECT A HOTSPOT ON THE SYSTEM
        </span>
      </div>

      {/* Hotspots Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left 7 cols: Image with Interactive Pulsing Pins */}
        <div className="lg:col-span-7 relative aspect-square sm:aspect-[4/3] rounded-xl overflow-hidden bg-black/60 border border-white/10 flex items-center justify-center p-4">
          <img
            src={imageUrl}
            alt={productName}
            className="w-full h-full object-contain pointer-events-none drop-shadow-[0_20px_40px_rgba(0,0,0,0.9)]"
            onError={(e) => {
              const target = e.currentTarget;
              const fallback = productName.toLowerCase().includes('bud') || productName.toLowerCase().includes('tws')
                ? '/images/products/fallback-earbuds.jpg'
                : '/images/products/fallback-headphones.jpg';
              if (target.src !== fallback && !target.src.endsWith(fallback)) {
                target.src = fallback;
              }
            }}
          />

          {/* Hotspot Pins */}
          {HOTSPOTS.map((spot, index) => {
            const isSelected = spot.id === selectedHotspot.id;
            return (
              <button
                key={spot.id}
                onClick={() => setSelectedHotspot(spot)}
                className="absolute z-20 -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                style={{ left: `${spot.xPercent}%`, top: `${spot.yPercent}%` }}
                aria-label={`Hotspot ${index + 1}: ${spot.name}`}
              >
                {/* Outer Pulsing Ring */}
                <span
                  className={`absolute inset-0 rounded-full animate-ping opacity-60 ${
                    isSelected ? 'bg-purple-400' : 'bg-copper'
                  }`}
                />

                {/* Inner Pin Button */}
                <span
                  className={`relative w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center font-mono text-[10px] font-black transition-transform duration-200 group-hover:scale-110 shadow-lg ${
                    isSelected
                      ? 'bg-purple-600 text-white border-white ring-4 ring-purple-500/40 scale-110'
                      : 'bg-[#15171e] text-copper border-copper/60 hover:border-white'
                  }`}
                >
                  0{index + 1}
                </span>

                {/* Floating Tooltip Label */}
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-0.5 rounded bg-black/90 border border-white/20 text-[9px] font-mono font-bold text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl">
                  {spot.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right 5 cols: Telemetry Information Panel */}
        <div className="lg:col-span-5 bg-[#0e1017] border border-white/10 rounded-xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <span className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-wider">
              {selectedHotspot.subsystem}
            </span>
            <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono text-[10px] font-bold">
              {selectedHotspot.metric}
            </span>
          </div>

          <div>
            <h4 className="text-base font-black font-headline text-white tracking-tight mb-1">
              {selectedHotspot.name}
            </h4>
            <p className="text-xs font-mono text-white/50 mb-3">
              {selectedHotspot.specs}
            </p>
            <p className="text-xs text-white/70 leading-relaxed font-sans">
              {selectedHotspot.description}
            </p>
          </div>

          {/* Hotspot Quick Select Strip */}
          <div className="pt-3 border-t border-white/[0.08]">
            <span className="text-[9px] font-mono text-white/40 uppercase block mb-2">
              ALL SUBSYSTEMS:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {HOTSPOTS.map((h, i) => (
                <button
                  key={h.id}
                  onClick={() => setSelectedHotspot(h)}
                  className={`px-2 py-1 rounded text-[10px] font-mono transition-colors ${
                    h.id === selectedHotspot.id
                      ? 'bg-purple-600 text-white font-bold'
                      : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                >
                  0{i + 1}. {h.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
