import React, { useState } from 'react';
import { Palette, Check, Sparkles, Layers, ShieldCheck } from 'lucide-react';

interface FinishOption {
  id: string;
  name: string;
  hex: string;
  borderHex: string;
  accentHex: string;
  tagline: string;
  description: string;
  imageModifier: string; // CSS filter or backdrop tone
  composition: string;
  surfaceFinish: string;
}

const FINISHES: FinishOption[] = [
  {
    id: 'obsidian',
    name: 'OBSIDIAN',
    hex: '#0d0e12',
    borderHex: '#2a2d38',
    accentHex: '#9ca3af',
    tagline: 'Deep Matte Aerospace Black',
    description: 'Ultra-pure vapor-deposited matte obsidian coating with stealth acoustic chamber damping and gunmetal hardware.',
    imageModifier: 'brightness(0.92) contrast(1.15) saturate(0.85)',
    composition: 'Aerospace Grade 6061-T6 Billet Aluminum',
    surfaceFinish: 'Type III Hard Anodized 45μm Micro-Bead',
  },
  {
    id: 'champagne',
    name: 'CHAMPAGNE',
    hex: '#c5a059',
    borderHex: '#e6c888',
    accentHex: '#fef08a',
    tagline: 'Warm Champagne Gold & Titanium',
    description: 'PVD vapor-treated warm champagne titanium luster paired with hand-polished mirror chamfers and ivory leather pads.',
    imageModifier: 'sepia(0.35) hue-rotate(-15deg) contrast(1.1) brightness(1.05)',
    composition: 'Brushed Grade 5 Titanium & Billet Alloy',
    surfaceFinish: 'Physical Vapor Deposition (PVD) Titanium Nitride',
  },
  {
    id: 'graphite',
    name: 'GRAPHITE',
    hex: '#2d333b',
    borderHex: '#C8834A',
    accentHex: '#C8834A',
    tagline: 'Textured Graphite with Copper Accents',
    description: 'Architectural gunmetal graphite finish accented by warm hand-turned copper acoustic rings and carbon composite dampers.',
    imageModifier: 'contrast(1.2) hue-rotate(15deg) brightness(0.95)',
    composition: 'Forged Carbon Fiber & Structural Alloy',
    surfaceFinish: 'Electrophoretic High-Durability Satin Lacquer',
  },
];

interface ProductColorExplorerProps {
  baseImageUrl: string;
  productName: string;
  onFinishChange?: (finishId: string) => void;
}

export const ProductColorExplorer: React.FC<ProductColorExplorerProps> = ({
  baseImageUrl,
  productName,
  onFinishChange,
}) => {
  const [selectedFinish, setSelectedFinish] = useState<FinishOption>(FINISHES[0]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleSelectFinish = (finish: FinishOption) => {
    if (finish.id === selectedFinish.id) return;
    setIsTransitioning(true);
    setSelectedFinish(finish);
    if (onFinishChange) onFinishChange(finish.id);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  return (
    <div className="bg-[#0b0c0f] border border-amber-400/30 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
      {/* Subtle ambient finish glow */}
      <div
        className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none transition-all duration-700"
        style={{ backgroundColor: selectedFinish.accentHex }}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-amber-400/15 border border-amber-400/40 text-[10px] font-mono font-black text-amber-300 uppercase tracking-widest mb-1.5 shadow-[0_0_10px_rgba(251,191,36,0.2)]">
            <Palette className="w-3 h-3 text-amber-400" />
            <span>COLOR LAB // BESPOKE FINISHES</span>
          </div>
          <h3 className="text-xl font-black font-headline text-white tracking-tight">
            MATERIAL & FINISH EXPLORER
          </h3>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-mono text-white/40 uppercase block">ACTIVE FINISH</span>
          <span className="text-xs font-mono font-black text-amber-400 tracking-wider">
            {selectedFinish.name}
          </span>
        </div>
      </div>

      {/* Interactive Visual Preview Stage */}
      <div className="relative aspect-[16/10] sm:aspect-[2/1] rounded-xl overflow-hidden bg-black/60 border border-white/10 flex items-center justify-center p-6 group">
        <div
          className={`relative max-w-sm w-full transition-all duration-500 ease-out ${
            isTransitioning ? 'opacity-40 scale-95' : 'opacity-100 scale-100'
          }`}
          style={{ filter: selectedFinish.imageModifier }}
        >
          <img
            src={baseImageUrl}
            alt={`${productName} in ${selectedFinish.name} finish`}
            className="w-full h-auto object-contain rounded-lg drop-shadow-[0_20px_40px_rgba(0,0,0,0.95)]"
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
        </div>

        {/* Dynamic Watermark Badge */}
        <div className="absolute bottom-3 left-4 px-3 py-1 rounded bg-black/80 border border-white/15 text-[10px] font-mono text-white/70 backdrop-blur-md">
          {productName} &bull; <strong className="text-white font-bold">{selectedFinish.name} EDITION</strong>
        </div>
      </div>

      {/* Finish Selector Swatches */}
      <div>
        <label className="text-[10px] font-mono text-white/50 uppercase tracking-wider block mb-3">
          SELECT CHASSIS SURFACE FINISH:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {FINISHES.map((finish) => {
            const isSelected = finish.id === selectedFinish.id;
            return (
              <button
                key={finish.id}
                onClick={() => handleSelectFinish(finish)}
                className={`p-4 rounded-xl border text-left transition-all duration-300 flex items-center gap-3 relative cursor-pointer ${
                  isSelected
                    ? 'bg-white/[0.06] shadow-xl ring-2'
                    : 'bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]'
                }`}
                style={{
                  borderColor: isSelected ? finish.borderHex : undefined,
                  boxShadow: isSelected ? `0 0 20px ${finish.borderHex}33` : undefined,
                }}
              >
                {/* Color Swatch Circle */}
                <div
                  className="w-7 h-7 rounded-full border-2 flex items-center justify-center shadow-inner flex-shrink-0"
                  style={{
                    backgroundColor: finish.hex,
                    borderColor: finish.borderHex,
                  }}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                </div>

                <div className="flex-1 min-w-0">
                  <span className="text-xs font-black font-headline text-white block truncate tracking-wide">
                    {finish.name}
                  </span>
                  <span className="text-[10px] font-mono text-white/40 block truncate">
                    {finish.tagline}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Detailed Technical Finish Telemetry Panel */}
      <div className="p-4 rounded-xl bg-black/50 border border-white/[0.08] space-y-2 text-xs">
        <p className="text-xs text-white/70 leading-relaxed font-sans">
          {selectedFinish.description}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-white/[0.06] text-[11px] font-mono text-white/50">
          <div>
            <span className="text-white/30 uppercase block text-[9px]">SUBSTRATE</span>
            <span className="text-white/80 font-bold">{selectedFinish.composition}</span>
          </div>
          <div>
            <span className="text-white/30 uppercase block text-[9px]">SURFACE TREATMENT</span>
            <span className="text-white/80 font-bold">{selectedFinish.surfaceFinish}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
