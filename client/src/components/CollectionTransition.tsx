import React from 'react';
import { ArrowDown, ChevronRight } from 'lucide-react';

interface CollectionTransitionProps {
  onSelectDivision?: (division: string) => void;
  arcTwsSectionRef?: React.RefObject<HTMLDivElement>;
}

export const CollectionTransition: React.FC<CollectionTransitionProps> = ({ arcTwsSectionRef }) => {
  const scrollToArcTws = () => {
    if (arcTwsSectionRef?.current) {
      arcTwsSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    } else {
      const el = document.getElementById('arc-tws-experience');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const divisions = [
    { name: 'HEADPHONES', label: 'Planar & Beryllium', action: scrollToTop, active: false, badge: 'Flagship' },
    { name: 'ARC TWS', label: 'True Wireless Audio', action: scrollToArcTws, active: true, badge: 'Exploring Next' },
    { name: 'AMPLIFICATION', label: 'Pure Class-A DAC', active: false },
    { name: 'ACCESSORIES', label: '7N Monocrystal', active: false },
    { name: 'ACOUSTICS', label: 'Room Matrices', active: false },
  ];

  return (
    <section className="relative w-full bg-[#070707] border-y border-white/[0.08] py-14 sm:py-18 px-6 md:px-12 text-white overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute inset-0 bg-radial-gradient from-copper/5 via-transparent to-transparent pointer-events-none opacity-40" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[10px] font-mono font-bold text-copper uppercase tracking-widest mb-2.5">
              <span className="w-1.5 h-1.5 rounded-[1px] bg-copper shadow-[0_0_6px_#C8834A]" />
              <span>NEXORO COLLECTION</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-headline tracking-tight text-white uppercase">
              ACOUSTIC DIVISIONS &bull; CINEMATIC SERIES
            </h2>
          </div>

          <button
            onClick={scrollToArcTws}
            className="inline-flex items-center gap-2 text-xs font-mono tracking-wider text-copper hover:text-copper-hover transition-colors group cursor-pointer self-start sm:self-auto"
          >
            <span>CONTINUE TO ARC TWS SEQUENCE</span>
            <ArrowDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>

        {/* Division Navigation Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {divisions.map((div) => {
            const isClickable = Boolean(div.action);
            return (
              <div
                key={div.name}
                onClick={div.action}
                className={`p-4 rounded-xl border transition-all duration-300 flex flex-col justify-between ${
                  div.active
                    ? 'bg-copper/[0.08] border-copper/50 shadow-[0_0_20px_rgba(200,131,74,0.15)] ring-1 ring-copper/40 cursor-pointer'
                    : isClickable
                    ? 'bg-white/[0.02] border-white/[0.08] hover:border-white/20 hover:bg-white/[0.04] cursor-pointer'
                    : 'bg-white/[0.02] border-white/[0.06] hover:border-copper/30 hover:bg-white/[0.03]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[11px] font-black font-headline tracking-wider uppercase ${div.active ? 'text-copper' : 'text-white/80'}`}>
                    {div.name}
                  </span>
                  {div.badge && (
                    <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded tracking-widest ${
                      div.active
                        ? 'bg-copper text-black font-bold'
                        : 'bg-white/10 text-white/60'
                    }`}>
                      {div.badge}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono text-white/40">
                  <span>{div.label}</span>
                  {div.active && <ChevronRight className="w-3 h-3 text-copper animate-pulse" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
