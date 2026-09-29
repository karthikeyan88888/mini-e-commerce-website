import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Film, Play, ChevronRight, Layers, Sparkles } from 'lucide-react';

interface ProductCinematicLauncherProps {
  productName: string;
  isEarbuds?: boolean;
}

export const ProductCinematicLauncher: React.FC<ProductCinematicLauncherProps> = ({
  productName,
  isEarbuds = false,
}) => {
  const navigate = useNavigate();

  const frameCount = isEarbuds ? 240 : 300;
  const targetHash = isEarbuds ? '#arc-tws-experience' : '';

  const handleLaunch = () => {
    navigate(`/${targetHash}`);
  };

  return (
    <div className="bg-gradient-to-r from-[#120e0a] via-[#1a130b] to-[#120e0a] border border-copper/40 rounded-2xl p-6 sm:p-8 space-y-4 shadow-2xl relative overflow-hidden group">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-copper/15 rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-700" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-copper/20 border border-copper/50 text-[10px] font-mono font-black text-copper uppercase tracking-widest mb-2 shadow-[0_0_12px_rgba(200,131,74,0.3)]">
            <Film className="w-3 h-3 text-copper" />
            <span>CINEMATIC EXPERIENCE &bull; {frameCount} FRAMES</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black font-headline text-white tracking-tight">
            EXPLORE THE FULL ANATOMY
          </h3>
          <p className="text-xs text-white/70 max-w-lg mt-1 leading-relaxed">
            Scroll through the {frameCount}-frame cinematic sequence revealing the complete mechanical disassembly, internal planar transducers, and precision electroacoustics of the {productName}.
          </p>
        </div>

        <button
          onClick={handleLaunch}
          className="self-start sm:self-auto px-6 py-3.5 bg-copper hover:bg-copper-hover text-black font-black text-xs tracking-widest uppercase rounded-xl shadow-xl shadow-copper/30 transition-all active:scale-95 flex items-center gap-2 whitespace-nowrap cursor-pointer group-hover:shadow-copper/50"
        >
          <Play className="w-4 h-4 fill-black" />
          <span>LAUNCH EXPERIENCE</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="pt-3 border-t border-white/[0.08] flex items-center gap-4 text-[10px] font-mono text-white/50">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-copper" />
          Full-Bleed Viewport Canvas
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-copper" />
          Scroll-Synchronized Telemetry
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-copper" />
          Exploded Architecture
        </span>
      </div>
    </div>
  );
};
