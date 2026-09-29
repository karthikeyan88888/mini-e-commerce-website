import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Layers, Sparkles, Shield, Cpu, Compass, Palette } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';
import { api } from '../api/client';

interface CuratedCollection {
  id: string;
  name: string;
  tagline: string;
  headline: string;
  description: string;
  badge: string;
  themeColor: string;
  borderClass: string;
  filterKey: string;
  productNames: string[];
}

const CURATED_COLLECTIONS: CuratedCollection[] = [
  {
    id: 'flagship',
    name: 'FLAGSHIP SERIES',
    tagline: 'ULTIMATE ELECTROACOUSTICS',
    headline: 'THE PINNACLE OF ACOUSTIC RESOLUTION.',
    description: 'Engineered with zero-compromise beryllium diaphragms, custom planar magnetic matrices, and full-bleed cinematic scroll anatomy.',
    badge: 'FLAGSHIP CLASS',
    themeColor: 'from-copper/20 via-copper/5 to-transparent',
    borderClass: 'border-copper/40',
    filterKey: 'flagship',
    productNames: ['NEXORO Apex X', 'NEXORO ARC TWS'],
  },
  {
    id: 'studio',
    name: 'STUDIO SERIES',
    tagline: 'SURGICAL REFERENCE & MONITORING',
    headline: 'ABSOLUTE ACOUSTIC TRANSPARENCY.',
    description: 'Engineered for mastering engineers and critical purists. Zero acoustic bleed, laser-machined resonance chambers, and flat-line electroacoustic response.',
    badge: 'STUDIO GRADE',
    themeColor: 'from-purple-600/20 via-purple-600/5 to-transparent',
    borderClass: 'border-purple-500/40',
    filterKey: 'studio',
    productNames: ['NEXORO Vector Studio', 'NEXORO Forge'],
  },
  {
    id: 'everyday',
    name: 'EVERYDAY SERIES',
    tagline: 'LIGHTWEIGHT DAILY FIDELITY',
    headline: 'ERGONOMIC COMFORT, IMMERSIVE SPEED.',
    description: 'Featherweight structural architectures engineered for extended sessions, low-latency transmission, and transparent spatial separation.',
    badge: 'DAILY DRIVER',
    themeColor: 'from-cyan-500/20 via-cyan-500/5 to-transparent',
    borderClass: 'border-cyan-500/40',
    filterKey: 'everyday',
    productNames: [
      'NEXORO Halo X1',
      'NEXORO Halo Buds',
      'NEXORO Pulse Buds',
      'NEXORO Flux',
      'NEXORO Flux Buds',
      'NEXORO Core TWS',
    ],
  },
  {
    id: 'luxury',
    name: 'LUXURY SERIES',
    tagline: 'BESPOKE ARTISAN FINISHES',
    headline: 'HAND-CRAFTED ACOUSTIC SCULPTURES.',
    description: 'Zirconia ceramic and aerospace alloy enclosures hand-finished in Obsidian, Champagne, and Graphite. Paired with cryogenic internal wiring.',
    badge: 'ARTISAN EDITION',
    themeColor: 'from-amber-400/20 via-amber-400/5 to-transparent',
    borderClass: 'border-amber-400/40',
    filterKey: 'luxury',
    productNames: ['NEXORO Zenith', 'NEXORO Zenith TWS'],
  },
];

export const CollectionsPage: React.FC = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [activeSeriesFilter, setActiveSeriesFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    api
      .get('/products')
      .then((res) => {
        setAllProducts(res.data.products || []);
      })
      .catch((err) => {
        console.error('Failed to load products for collections', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const visibleCollections =
    activeSeriesFilter === 'all'
      ? CURATED_COLLECTIONS
      : CURATED_COLLECTIONS.filter((c) => c.id === activeSeriesFilter);

  return (
    <div className="pt-28 pb-24 px-6 md:px-12 max-w-7xl mx-auto min-h-screen text-white">
      {/* Editorial Header */}
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono font-bold text-copper mb-3">
          <span className="w-1.5 h-1.5 rounded-[1px] bg-copper shadow-[0_0_6px_#C8834A]" />
          <span>CURATED SERIES // ARCHITECTURAL TIERS</span>
        </div>
        <h1 className="text-3xl sm:text-6xl font-black font-headline tracking-tight text-white">
          THE NEXORO COLLECTIONS
        </h1>
        <p className="text-xs sm:text-base text-white/60 mt-3 max-w-2xl leading-relaxed">
          Four distinct engineering philosophies designed for discerning listeners. From flagship planar transducers and studio reference instruments to everyday daily drivers and bespoke artisan finishes.
        </p>

        {/* Series Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pt-6 pb-2 scrollbar-none">
          <button
            onClick={() => setActiveSeriesFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-mono tracking-wider uppercase transition-all cursor-pointer ${
              activeSeriesFilter === 'all'
                ? 'bg-copper text-black shadow-lg shadow-copper/25'
                : 'bg-white/[0.04] hover:bg-white/[0.08] text-white/70 border border-white/10'
            }`}
          >
            ALL COLLECTIONS ({CURATED_COLLECTIONS.length})
          </button>
          {CURATED_COLLECTIONS.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveSeriesFilter(c.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-mono tracking-wider uppercase transition-all whitespace-nowrap cursor-pointer ${
                activeSeriesFilter === c.id
                  ? 'bg-copper text-black shadow-lg shadow-copper/25'
                  : 'bg-white/[0.04] hover:bg-white/[0.08] text-white/70 border border-white/10'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Series Sections */}
      <div className="space-y-20">
        {visibleCollections.map((collection) => {
          // Find matching products for this series
          const matchingProducts = allProducts.filter((p) =>
            collection.productNames.some((name) =>
              p.name.toLowerCase().includes(name.toLowerCase().replace('nexoro ', ''))
            )
          );

          return (
            <section
              key={collection.id}
              className={`rounded-3xl bg-[#090a0d] border ${collection.borderClass} p-6 sm:p-10 relative overflow-hidden shadow-2xl`}
            >
              {/* Top Atmospheric Gradient */}
              <div
                className={`absolute inset-x-0 top-0 h-48 bg-gradient-to-b ${collection.themeColor} pointer-events-none opacity-50`}
              />

              {/* Collection Header Banner */}
              <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 pb-8 border-b border-white/[0.08]">
                <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/15 text-[10px] font-mono font-bold text-white uppercase tracking-widest mb-3">
                    <span>{collection.badge}</span>
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-black font-headline tracking-tight text-white">
                    {collection.name}
                  </h2>
                  <p className="text-xs sm:text-sm font-mono text-copper uppercase tracking-wider mt-1">
                    {collection.tagline}
                  </p>
                  <p className="text-xs sm:text-sm text-white/60 mt-3 leading-relaxed">
                    {collection.description}
                  </p>
                </div>

                <Link
                  to={`/catalog?search=${encodeURIComponent(collection.name.split(' ')[0])}`}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 hover:border-copper/40 text-xs font-mono font-bold uppercase tracking-wider text-white transition-all self-start lg:self-auto group cursor-pointer"
                >
                  <span>EXPLORE {collection.name}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-copper" />
                </Link>
              </div>

              {/* Products in this Collection */}
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {Array.from({ length: collection.productNames.length }).map((_, i) => (
                    <div key={i} className="aspect-[3/4] rounded-2xl bg-white/5 animate-pulse" />
                  ))}
                </div>
              ) : matchingProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative z-10">
                  {matchingProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative z-10">
                  {allProducts
                    .filter((p) => p.category === 'HEADPHONES' || p.category === 'EARBUDS')
                    .slice(0, collection.productNames.length)
                    .map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                </div>
              )}
            </section>
          );
        })}
      </div>

      {/* Catalogue Callout */}
      <div className="mt-20 p-8 sm:p-12 rounded-3xl bg-[#0e0f13] border border-white/10 text-center flex flex-col items-center">
        <h3 className="text-xl sm:text-2xl font-black font-headline text-white mb-2">
          LOOKING FOR OUR COMPLETE CATALOGUE?
        </h3>
        <p className="text-xs sm:text-sm text-white/50 max-w-md mb-6 leading-relaxed">
          Filter all 12 precision headphone and wireless earbud systems by stock availability, sorting order, and technical specifications.
        </p>
        <Link
          to="/catalog"
          className="px-8 py-3.5 bg-copper hover:bg-copper-hover text-black font-black text-xs tracking-widest uppercase rounded-xl shadow-xl shadow-copper/25 transition-all active:scale-95"
        >
          VIEW COMPLETE SHOP
        </Link>
      </div>
    </div>
  );
};
