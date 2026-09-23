import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Volume2, ShieldCheck, Zap, Headphones, Cpu, Layers, Disc, Radio, Sliders, MessageSquare, LifeBuoy, Clock, CheckCircle2 } from 'lucide-react';
import { HeroCanvas } from '../components/HeroCanvas';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';
import { api } from '../api/client';

export const HomePage: React.FC = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [signatureAudio, setSignatureAudio] = useState<Product[]>([]);
  const [accessories, setAccessories] = useState<Product[]>([]);
  const [acoustics, setAcoustics] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api
      .get('/products')
      .then((res) => {
        const all: Product[] = res.data.products || [];
        setAllProducts(all);

        // Featured: flagship headphones & high-end amp
        setFeaturedProducts(all.slice(0, 4));

        // New Arrivals: newest 4 items
        setNewArrivals(all.slice(4, 8));

        // Signature Audio: Headphones & IEM
        const sig = all.filter((p) => p.category === 'HEADPHONES' || p.category === 'IEM');
        setSignatureAudio(sig.slice(0, 4));

        // Accessories
        const acc = all.filter((p) => p.category === 'ACCESSORIES');
        setAccessories(acc.slice(0, 4));

        // Acoustics
        const aco = all.filter((p) => p.category === 'ACOUSTICS');
        setAcoustics(aco.slice(0, 4));
      })
      .catch((err) => {
        console.error('Failed to load products for storefront', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="bg-[#070707] text-white selection:bg-copper selection:text-black">
      {/* 1. Signature 300-Frame Scroll Hero */}
      <HeroCanvas />

      {/* 2. SECTION: FEATURED COLLECTION */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-white/[0.08]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono font-bold text-copper uppercase tracking-widest mb-3">
              <span className="w-1.5 h-1.5 rounded-[1px] bg-copper shadow-[0_0_6px_#C8834A]" />
              <span>THE FLAGSHIP COLLECTION</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black font-headline tracking-tight text-white">
              FEATURED HARDWARE.
            </h2>
            <p className="text-xs sm:text-sm text-white/50 mt-2 max-w-lg leading-relaxed">
              Engineered with zero-tolerance beryllium diaphragms and pure Class-A linear amplification.
            </p>
          </div>
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-copper hover:text-copper-light transition-colors group"
          >
            <span>EXPLORE ENTIRE CATALOGUE ({allProducts.length} SYSTEMS)</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] rounded-lg bg-white/5 animate-pulse" />
              ))
            : featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
        </div>
      </section>

      {/* 3. SECTION: NEW ARRIVALS */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-white/[0.08]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono font-bold text-copper uppercase tracking-widest mb-3">
              <span className="w-1.5 h-1.5 rounded-[1px] bg-copper shadow-[0_0_6px_#C8834A]" />
              <span>FRESH RELEASES</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black font-headline tracking-tight text-white">
              NEW ARRIVALS.
            </h2>
            <p className="text-xs sm:text-sm text-white/50 mt-2 max-w-lg leading-relaxed">
              The latest additions to the NEXORO acoustic ecosystem, ready for immediate priority dispatch.
            </p>
          </div>
          <Link
            to="/catalog?sort=newest"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-copper hover:text-copper-light transition-colors group"
          >
            <span>VIEW ALL NEW RELEASES</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] rounded-lg bg-white/5 animate-pulse" />
              ))
            : newArrivals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
        </div>
      </section>

      {/* 4. SECTION: SIGNATURE AUDIO */}
      <section className="py-24 bg-[#0a0b0e] border-y border-white/[0.08] px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-[10px] font-mono tracking-[0.25em] text-copper uppercase font-bold block mb-2">
                TRANSDUCER DIVISIONS
              </span>
              <h2 className="text-3xl sm:text-5xl font-black font-headline tracking-tight text-white">
                SIGNATURE AUDIO.
              </h2>
              <p className="text-xs sm:text-sm text-white/50 mt-2 max-w-lg leading-relaxed">
                Open-back planar magnetics and multi-balanced-armature in-ear monitors tuned for absolute linear fidelity.
              </p>
            </div>
            <Link
              to="/catalog?category=HEADPHONES"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-copper hover:text-copper-light transition-colors group"
            >
              <span>EXPLORE HEADPHONES & IEMs</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="aspect-[3/4] rounded-lg bg-white/5 animate-pulse" />
                ))
              : signatureAudio.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
          </div>
        </div>
      </section>

      {/* 5. SECTION: BESPOKE ACCESSORIES */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono font-bold text-copper uppercase tracking-widest mb-3">
              <span className="w-1.5 h-1.5 rounded-[1px] bg-copper shadow-[0_0_6px_#C8834A]" />
              <span>CONDUCTOR & DOCKING</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black font-headline tracking-tight text-white">
              ACCESSORIES.
            </h2>
            <p className="text-xs sm:text-sm text-white/50 mt-2 max-w-lg leading-relaxed">
              7N OCC monocrystalline copper cables, magnetic inductive stands, and carbon fiber travel shells.
            </p>
          </div>
          <Link
            to="/catalog?category=ACCESSORIES"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-copper hover:text-copper-light transition-colors group"
          >
            <span>VIEW ALL ACCESSORIES</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] rounded-lg bg-white/5 animate-pulse" />
              ))
            : accessories.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
        </div>
      </section>

      {/* 6. SECTION: ARCHITECTURAL ACOUSTICS */}
      <section className="py-24 bg-[#0a0b0e] border-t border-white/[0.08] px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-[10px] font-mono tracking-[0.25em] text-copper uppercase font-bold block mb-2">
                ROOM TUNING MATRICES
              </span>
              <h2 className="text-3xl sm:text-5xl font-black font-headline tracking-tight text-white">
                ACOUSTICS.
              </h2>
              <p className="text-xs sm:text-sm text-white/50 mt-2 max-w-lg leading-relaxed">
                Quadratic residue diffusers, velocity absorbers, and reference calibration kits for studio listening environments.
              </p>
            </div>
            <Link
              to="/catalog?category=ACOUSTICS"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-copper hover:text-copper-light transition-colors group"
            >
              <span>VIEW ACOUSTIC SYSTEMS</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="aspect-[3/4] rounded-lg bg-white/5 animate-pulse" />
                ))
              : acoustics.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
          </div>
        </div>
      </section>

      {/* 7. SECTION: CUSTOMER CARE & CONCIERGE */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-white/[0.08]">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-copper/10 border border-copper/30 text-[11px] font-mono font-bold text-copper uppercase tracking-widest mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>NEXORO CARE // CONCIERGE & WARRANTY</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black font-headline tracking-tight text-white">
              CLIENT SERVICES.
            </h2>
            <p className="text-xs sm:text-sm text-white/50 mt-2 max-w-xl leading-relaxed">
              Every NEXORO system is accompanied by direct acoustic engineering support, three-year comprehensive mechanical warranty, and priority global dispatch.
            </p>
          </div>
          <Link
            to="/support"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-copper hover:text-copper-light transition-colors group"
          >
            <span>ACCESS SUPPORT CONCIERGE</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-8 rounded-2xl bg-[#0c0d10] border border-white/[0.06] hover:border-copper/40 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-copper/10 border border-copper/30 flex items-center justify-center text-copper mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-copper font-bold block mb-1">
                COVERAGE PROTOCOL
              </span>
              <h3 className="text-lg font-bold font-headline text-white mb-2">
                3-Year Studio Warranty
              </h3>
              <p className="text-xs text-white/50 leading-relaxed">
                Full mechanical, electronic, and driver coverage against any defects with expedited parts replacement and calibrated bench servicing.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-white/40">
              <span>ZERO DEDUCTIBLE</span>
              <span className="text-copper">BENCH CERTIFIED</span>
            </div>
          </div>

          <div className="p-8 rounded-2xl bg-[#0c0d10] border border-white/[0.06] hover:border-copper/40 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-copper/10 border border-copper/30 flex items-center justify-center text-copper mb-6">
                <Headphones className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-copper font-bold block mb-1">
                ENGINEERING ASSISTANCE
              </span>
              <h3 className="text-lg font-bold font-headline text-white mb-2">
                Acoustic Consultation
              </h3>
              <p className="text-xs text-white/50 leading-relaxed">
                Direct consultation with our lab engineers on DAC impedance pairing, reference DSP target curves, and room acoustic optimization.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-white/40">
              <span>AVG RESPONSE: &lt; 4H</span>
              <span className="text-copper">LAB ENGINEERS</span>
            </div>
          </div>

          <div className="p-8 rounded-2xl bg-[#0c0d10] border border-white/[0.06] hover:border-copper/40 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-copper/10 border border-copper/30 flex items-center justify-center text-copper mb-6">
                <LifeBuoy className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-copper font-bold block mb-1">
                DISPATCH & CLAIMS
              </span>
              <h3 className="text-lg font-bold font-headline text-white mb-2">
                Live Support Concierge
              </h3>
              <p className="text-xs text-white/50 leading-relaxed">
                Real-time ticket tracking, order telemetry status lookups, and global dispatch hubs in San Francisco, Tokyo, and Berlin.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-white/40">
              <span>24/7 DISPATCH</span>
              <span className="text-copper">GLOBAL HUBS</span>
            </div>
          </div>
        </div>

        {/* Quick Action Strip */}
        <div className="p-6 rounded-2xl bg-[#08090b] border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10B981]" />
            <span className="text-xs font-mono text-white/70">
              CONCIERGE STATUS: ALL REGIONAL HUBS OPERATIONAL
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/support"
              className="px-4 py-2 bg-copper hover:bg-copper-hover text-black font-black text-xs tracking-wider uppercase rounded-lg transition-colors"
            >
              Open Support Ticket
            </Link>
            <Link
              to="/orders"
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white font-bold text-xs tracking-wider uppercase rounded-lg border border-white/10 transition-colors"
            >
              Track Order
            </Link>
          </div>
        </div>
      </section>

      {/* 8. FULL CATALOGUE CALLOUT */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-white/[0.08] text-center">
        <div className="p-12 sm:p-16 rounded-2xl bg-gradient-to-b from-[#111216] to-[#070707] border border-white/10 relative overflow-hidden">
          <div className="max-w-2xl mx-auto relative z-10">
            <span className="text-[10px] font-mono tracking-[0.25em] text-copper uppercase font-bold block mb-3">
              COMPLETE ARCHITECTURE
            </span>
            <h2 className="text-3xl sm:text-5xl font-black font-headline tracking-tight text-white">
              DISCOVER ALL 27 SYSTEMS.
            </h2>
            <p className="mt-4 text-xs sm:text-sm text-white/60 leading-relaxed">
              Explore the entire NEXORO hardware suite — filter by division, search by SKU, audit stock telemetry, and configure your reference setup.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/catalog"
                className="px-8 py-4 bg-copper hover:bg-copper-hover text-black font-black text-xs tracking-widest uppercase rounded-lg shadow-xl shadow-copper/25 transition-all active:scale-95 flex items-center gap-2"
              >
                <span>OPEN FULL CATALOGUE</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/orders"
                className="px-6 py-4 bg-white/5 hover:bg-white/10 text-white font-bold text-xs tracking-widest uppercase rounded-lg border border-white/10 transition-colors"
              >
                TRACK EXISTING ORDER
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
