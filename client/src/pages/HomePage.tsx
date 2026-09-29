import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Volume2, ShieldCheck, Zap, Headphones, Cpu, Layers, Disc, Radio, Sliders, MessageSquare, LifeBuoy, Clock, CheckCircle2 } from 'lucide-react';
import { HeroCanvas } from '../components/HeroCanvas';
import { CollectionTransition } from '../components/CollectionTransition';
import { ArcTwsCanvas } from '../components/ArcTwsCanvas';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';
import { api } from '../api/client';

export const HomePage: React.FC = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [headphoneProducts, setHeadphoneProducts] = useState<Product[]>([]);
  const [earbudProducts, setEarbudProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api
      .get('/products')
      .then((res) => {
        const all: Product[] = res.data.products || [];
        setAllProducts(all);

        // Featured products (top flagships)
        setFeaturedProducts(all.slice(0, 4));

        // Headphones
        const hp = all.filter((p) => p.category === 'HEADPHONES');
        setHeadphoneProducts(hp);

        // Wireless Earbuds
        const eb = all.filter((p) => p.category === 'EARBUDS' || p.category === 'WIRELESS EARBUDS');
        setEarbudProducts(eb);
      })
      .catch((err) => {
        console.error('Failed to load products for storefront', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const arcTwsProduct = allProducts.find(
    (p) => p.sku === 'NXR-ARC-01' || p.name.toLowerCase().includes('arc tws')
  );

  return (
    <div className="bg-[#070707] text-white selection:bg-copper selection:text-black">
      {/* 1. Signature 300-Frame Headphone Scroll Hero */}
      <HeroCanvas />

      {/* 2. Short Cinematic NEXORO Collection Transition */}
      <CollectionTransition />

      {/* 3. Signature 240-Frame ARC TWS Wireless Earbuds Scroll Hero */}
      <ArcTwsCanvas product={arcTwsProduct} />

      {/* 4. SECTION: FEATURED HARDWARE */}
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
              Engineered with zero-tolerance beryllium diaphragms and pure planar magnetic transducer arrays.
            </p>
          </div>
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-copper hover:text-copper-light transition-colors group cursor-pointer"
          >
            <span>EXPLORE ENTIRE CATALOGUE ({allProducts.length} SYSTEMS)</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] rounded-xl bg-white/5 animate-pulse" />
              ))
            : featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
        </div>
      </section>

      {/* 5. SECTION: HEADPHONES DIVISION */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-white/[0.08]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono font-bold text-copper uppercase tracking-widest mb-3">
              <Headphones className="w-3.5 h-3.5 text-copper" />
              <span>TRANSDUCER ARCHITECTURE</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black font-headline tracking-tight text-white">
              HEADPHONES.
            </h2>
            <p className="text-xs sm:text-sm text-white/50 mt-2 max-w-lg leading-relaxed">
              Open-back planar magnetics, closed-back monitoring, and flagship over-ear listening systems.
            </p>
          </div>
          <Link
            to="/catalog?category=HEADPHONES"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-copper hover:text-copper-light transition-colors group cursor-pointer"
          >
            <span>VIEW ALL HEADPHONES ({headphoneProducts.length})</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] rounded-xl bg-white/5 animate-pulse" />
              ))
            : headphoneProducts.slice(0, 3).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
        </div>
      </section>

      {/* 6. SECTION: WIRELESS EARBUDS DIVISION */}
      <section className="py-24 bg-[#0a0b0e] border-y border-white/[0.08] px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-[10px] font-mono tracking-[0.25em] text-copper uppercase font-bold block mb-2">
                MICRO-ELECTROACOUSTICS
              </span>
              <h2 className="text-3xl sm:text-5xl font-black font-headline tracking-tight text-white">
                WIRELESS EARBUDS.
              </h2>
              <p className="text-xs sm:text-sm text-white/50 mt-2 max-w-lg leading-relaxed">
                Liquid crystal polymer drivers, Bluetooth 5.4 LE Audio, and active noise suppression in sculptured obsidian cradles.
              </p>
            </div>
            <Link
              to="/catalog?category=WIRELESS+EARBUDS"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-copper hover:text-copper-light transition-colors group cursor-pointer"
            >
              <span>EXPLORE ALL WIRELESS EARBUDS ({earbudProducts.length})</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="aspect-[3/4] rounded-xl bg-white/5 animate-pulse" />
                ))
              : earbudProducts.slice(0, 3).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
          </div>
        </div>
      </section>

      {/* 7. SECTION: CURATED COLLECTIONS HERO CALLOUT */}
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-r from-[#121318] via-[#161822] to-[#121318] border border-copper/30 flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative overflow-hidden shadow-2xl">
          <div className="max-w-xl relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-copper/15 border border-copper/40 text-[10px] font-mono font-bold text-copper uppercase tracking-widest mb-3">
              <Layers className="w-3.5 h-3.5 text-copper" />
              <span>DEDICATED SERIES ARCHITECTURE</span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-black font-headline tracking-tight text-white">
              DISCOVER OUR FOUR CURATED COLLECTIONS.
            </h3>
            <p className="text-xs sm:text-sm text-white/60 mt-3 leading-relaxed">
              Explore Flagship, Studio Reference, Everyday Ergonomics, and Luxury Artisan series organized by engineering intent.
            </p>
          </div>
          <div className="relative z-10 flex flex-wrap items-center gap-3">
            <Link
              to="/collections"
              className="px-7 py-4 bg-copper hover:bg-copper-hover text-black font-black text-xs tracking-widest uppercase rounded-xl shadow-xl shadow-copper/25 transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <span>EXPLORE COLLECTIONS</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/catalog"
              className="px-6 py-4 bg-white/5 hover:bg-white/10 text-white font-bold text-xs tracking-widest uppercase rounded-xl border border-white/10 transition-colors"
            >
              VIEW FULL SHOP
            </Link>
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
