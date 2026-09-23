import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, ArrowUpDown, Layers, SlidersHorizontal, RefreshCw } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';
import { api } from '../api/client';

export const CatalogPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(['All', 'HEADPHONES', 'IEM', 'AMPLIFICATION', 'ACCESSORIES', 'ACOUSTICS']);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [stockFilter, setStockFilter] = useState('all');
  const [sortOption, setSortOption] = useState('newest');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const cat = searchParams.get('category');
    setSelectedCategory(cat || 'All');
  }, [searchParams]);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const params: Record<string, string> = {};
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (searchQuery.trim()) params.search = searchQuery.trim();
      if (stockFilter !== 'all') params.stockStatus = stockFilter;
      if (sortOption !== 'newest') params.sort = sortOption;

      const res = await api.get('/products', { params });
      setProducts(res.data.products || []);
      if (res.data.categories && res.data.categories.length > 0) {
        // Ensure standard unique categories
        const dynamicCats = ['All', ...Array.from(new Set(res.data.categories as string[]))];
        setCategories(dynamicCats);
      }
    } catch (err) {
      console.error('Failed to fetch products', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, stockFilter, sortOption]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    if (cat === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="pt-28 pb-24 px-6 md:px-12 max-w-7xl mx-auto min-h-screen text-white">
      {/* Editorial Header */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono font-semibold text-copper mb-3">
          <span className="w-1.5 h-1.5 rounded-[1px] bg-copper" />
          <span>SYSTEM CATALOGUE // {selectedCategory.toUpperCase()}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-headline tracking-tight text-white">
          THE NEXORO AUDIO ECOSYSTEM
        </h1>
        <p className="text-xs sm:text-sm text-white/50 mt-2 max-w-xl leading-relaxed">
          Explore our complete catalogue of precision-tuned planar headphones, balanced amplification matrices, and bespoke acoustic treatments.
        </p>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-[#0d0e12] border border-white/[0.07] rounded-2xl p-4 sm:p-6 mb-8 space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by system name, SKU (e.g. NXR-APX-01), or spec..."
              className="w-full pl-10 pr-24 py-2.5 bg-black/50 border border-white/10 rounded-xl text-xs text-white placeholder-white/40 focus:outline-none focus:border-copper transition-colors font-sans"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-copper hover:bg-copper-hover text-black text-[10px] font-extrabold rounded-lg tracking-wider transition-colors"
            >
              SEARCH
            </button>
          </form>

          {/* Right Controls: Stock and Sort */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Stock Filter Dropdown */}
            <div className="flex items-center gap-2 bg-black/40 border border-white/10 px-3 py-1.5 rounded-xl text-xs text-white">
              <span className="text-white/40 text-[10px] uppercase font-mono">Stock:</span>
              <select
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
                className="bg-transparent text-white text-xs font-semibold focus:outline-none cursor-pointer"
              >
                <option value="all" className="bg-[#121317]">All Availability</option>
                <option value="inStock" className="bg-[#121317]">In Stock (&gt;5)</option>
                <option value="lowStock" className="bg-[#121317]">Low Stock (&le;5)</option>
                <option value="outOfStock" className="bg-[#121317]">Out of Stock (0)</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 bg-black/40 border border-white/10 px-3 py-1.5 rounded-xl text-xs text-white">
              <ArrowUpDown className="w-3.5 h-3.5 text-copper" />
              <span className="text-white/40 text-[10px] uppercase font-mono">Sort:</span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="bg-transparent text-white text-xs font-semibold focus:outline-none cursor-pointer"
              >
                <option value="newest" className="bg-[#121317]">Newest Release</option>
                <option value="price-asc" className="bg-[#121317]">Price: Low to High</option>
                <option value="price-desc" className="bg-[#121317]">Price: High to Low</option>
                <option value="name-asc" className="bg-[#121317]">Model Name (A-Z)</option>
                <option value="rating-desc" className="bg-[#121317]">Top Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Dynamic Category Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pt-3 border-t border-white/[0.05] pb-1 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory.toUpperCase() === cat.toUpperCase();
            return (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold tracking-wider uppercase whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-copper text-black shadow-md shadow-copper/20'
                    : 'bg-white/[0.03] hover:bg-white/[0.08] text-white/70 hover:text-white border border-white/[0.05]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Product Count Strip */}
      <div className="flex items-center justify-between text-xs text-white/50 mb-6 font-mono">
        <span>
          SHOWING <strong className="text-white font-bold">{products.length}</strong> ACTIVE SYSTEMS
        </span>
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery('');
              fetchProducts();
            }}
            className="text-copper hover:underline text-[11px]"
          >
            Clear Search Filter
          </button>
        )}
      </div>

      {/* Product Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] rounded-xl bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="p-16 rounded-3xl bg-[#0d0e12] border border-white/[0.07] text-center flex flex-col items-center">
          <Layers className="w-12 h-12 text-white/20 mb-4" />
          <h3 className="text-lg font-bold font-headline text-white mb-1">
            No NEXORO products match your search
          </h3>
          <p className="text-xs text-white/50 max-w-sm mb-6">
            Try adjusting your search keywords, stock availability, or explore our full collections.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
              setStockFilter('all');
              setSortOption('newest');
            }}
            className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold tracking-wider rounded-xl transition-colors uppercase"
          >
            RESET ALL FILTERS
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
