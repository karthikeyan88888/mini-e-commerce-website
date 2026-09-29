import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Star,
  Check,
  Truck,
  ShieldCheck,
  RotateCcw,
  ArrowLeft,
  Minus,
  Plus,
  Zap,
  Layers,
  Clock,
  Box,
  RotateCw,
  Palette,
  Cpu,
  Film,
} from 'lucide-react';
import { Product } from '../types';
import { StockBadge } from '../components/StatusBadge';
import { ProductCard } from '../components/ProductCard';
import { Product360Viewer } from '../components/Product360Viewer';
import { ProductColorExplorer } from '../components/ProductColorExplorer';
import { ProductEngineeringHotspots } from '../components/ProductEngineeringHotspots';
import { ProductCinematicLauncher } from '../components/ProductCinematicLauncher';
import { getProductMechanic, getBadgeInfo } from '../utils/productMechanics';
import { getProductImageUrl, getCategoryFallback } from '../utils/productImages';
import { useCart } from '../context/CartContext';
import { api } from '../api/client';

// Lazy load the 3D viewer component
const Product3DViewer = React.lazy(() =>
  import('../components/Product3DViewer').then((module) => ({
    default: module.Product3DViewer,
  }))
);

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [addFeedback, setAddFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'specifications' | 'availability'>('overview');
  const [is3DModalOpen, setIs3DModalOpen] = useState(false);
  const [is360ModalOpen, setIs360ModalOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    setQuantity(1);
    setAddFeedback(null);

    api
      .get(`/products/${id}`)
      .then((res) => {
        setProduct(res.data.product);
        setRelated(res.data.related || []);
      })
      .catch((err) => {
        console.error('Failed to load product details', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  const handleAddToCart = async () => {
    if (!product || product.stock <= 0) return;
    setIsAdding(true);
    const res = await addToCart(product.id, quantity);
    setIsAdding(false);
    setAddFeedback(res);
    setTimeout(() => {
      setAddFeedback(null);
    }, 4000);
  };

  if (isLoading) {
    return (
      <div className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-pulse">
          <div className="lg:col-span-7 aspect-square bg-white/5 rounded-xl" />
          <div className="lg:col-span-5 space-y-6">
            <div className="h-6 w-32 bg-white/5 rounded" />
            <div className="h-10 w-3/4 bg-white/5 rounded" />
            <div className="h-8 w-24 bg-white/5 rounded" />
            <div className="h-32 w-full bg-white/5 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-36 pb-24 px-6 text-center max-w-md mx-auto min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold font-headline text-white mb-2">Product Not Found</h2>
        <p className="text-xs text-white/50 mb-6">
          The requested audio system does not exist or has been retired from the catalogue.
        </p>
        <Link
          to="/catalog"
          className="px-6 py-3 bg-copper hover:bg-copper-hover text-black font-bold text-xs tracking-widest uppercase rounded-lg"
        >
          RETURN TO CATALOGUE
        </Link>
      </div>
    );
  }

  const mechanic = getProductMechanic(product);
  const badgeInfo = getBadgeInfo(mechanic);
  const displayCategory = product.category === 'EARBUDS' ? 'WIRELESS EARBUDS' : product.category;
  const canonicalImageUrl = getProductImageUrl(product);
  const resolvedModelUrl = product.modelUrl || (
    product.name.toLowerCase().includes('halo x1') ? '/models/nexoro-halo-x1.glb' :
    product.name.toLowerCase().includes('apex') ? '/models/nexoro-apex-pro.glb' :
    product.name.toLowerCase().includes('vector') ? '/models/nexoro-vector-studio.glb' :
    null
  );

  // Parse specifications
  let specsObj: Record<string, string> = {};
  if (product.specs) {
    try {
      specsObj = JSON.parse(product.specs);
    } catch (e) {
      // ignore
    }
  }

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="pt-28 pb-24 px-6 md:px-12 max-w-7xl mx-auto min-h-screen text-white">
      {/* Back Link */}
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/60 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-copper" />
          <span>BACK TO COLLECTION</span>
        </button>
      </div>

      {/* Main Product Layout (2 Columns: Left 7 cols Media, Right 5 cols Actions) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 items-start">
        {/* LEFT: Product Media */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-square sm:aspect-[4/3] lg:aspect-square rounded-2xl overflow-hidden bg-[#0d0e12] border border-white/[0.08] shadow-2xl">
            <img
              src={canonicalImageUrl}
              alt={product.name}
              className="w-full h-full object-cover object-center"
              onError={(e) => {
                const target = e.currentTarget;
                const fallback = getCategoryFallback(product.category);
                if (target.src !== fallback && !target.src.endsWith(fallback)) {
                  target.src = fallback;
                }
              }}
            />
            {/* Overlay badges */}
            <div className="absolute top-4 left-4 z-10">
              <StockBadge stock={product.stock} />
            </div>
            <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-2">
              {badgeInfo && (
                <span className={`backdrop-blur-md px-3 py-1 rounded text-xs font-mono font-black tracking-wider border shadow-md ${badgeInfo.badgeClass}`}>
                  [{badgeInfo.label}]
                </span>
              )}
              <div className="bg-black/80 backdrop-blur-md px-3 py-1 rounded text-xs font-mono font-bold text-white/90 uppercase border border-white/10">
                SKU: {product.sku}
              </div>
            </div>
          </div>

          {/* Interactive Feature Action Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {mechanic === '360_VIEW' && (
              <button
                onClick={() => setIs360ModalOpen(true)}
                className="col-span-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-cyan-950/40 via-cyan-900/30 to-cyan-950/40 hover:from-cyan-900/50 hover:to-cyan-900/50 border border-cyan-500/50 hover:border-cyan-400 text-white text-xs font-bold font-mono tracking-widest uppercase flex items-center justify-center gap-3 transition-all shadow-xl shadow-cyan-950/40 group cursor-pointer"
              >
                <RotateCw className="w-4 h-4 text-cyan-400 group-hover:rotate-180 transition-transform duration-500" />
                <span>LAUNCH 360° INTERACTIVE VIEW</span>
              </button>
            )}

            {mechanic === 'CINEMATIC' && (
              <div className="col-span-full">
                <ProductCinematicLauncher
                  productName={product.name}
                  isEarbuds={product.category === 'EARBUDS' || product.name.toLowerCase().includes('arc')}
                />
              </div>
            )}

            {/* VIEW IN 3D Button (When 3D model GLB exists) */}
            {product.has3DModel && product.modelUrl && (
              <button
                onClick={() => setIs3DModalOpen(true)}
                className="py-3 px-4 rounded-xl bg-[#111318] hover:bg-[#161822] border border-copper/40 hover:border-copper text-white text-xs font-bold font-mono tracking-widest uppercase flex items-center justify-center gap-2.5 transition-all shadow-lg group cursor-pointer"
              >
                <Box className="w-4 h-4 text-copper group-hover:scale-110 transition-transform" />
                <span>INSPECT 3D MODEL</span>
              </button>
            )}
          </div>
        </div>

        {/* RIGHT: Details & Purchase */}
        <div className="lg:col-span-5 space-y-6">
          {/* Category */}
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-mono tracking-[0.25em] text-copper uppercase font-bold">
                {displayCategory}
              </span>
              {badgeInfo && (
                <>
                  <span className="text-white/20">&bull;</span>
                  <span className="text-[10px] font-mono text-white/50 tracking-wider">
                    {badgeInfo.label} ENABLED
                  </span>
                </>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl font-black font-headline tracking-tight text-white leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="mt-3 flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5 text-amber-400 font-mono font-bold">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{product.rating.toFixed(2)}</span>
              </div>
              <span className="text-white/20">|</span>
              <span className="text-white/60 font-mono text-[11px]">
                {product.stock > 0 ? `${product.stock} UNITS IN STOCK` : 'OUT OF STOCK'}
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="p-4 rounded-xl bg-[#0e0f13] border border-white/[0.08] flex items-baseline justify-between">
            <div>
              <span className="text-xs text-white/40 block font-mono uppercase">Unit Price</span>
              <span className="text-3xl font-black font-headline text-white tracking-tight">
                ${product.price.toFixed(2)}
              </span>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 font-bold bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded">
              FREE SHIPPING
            </span>
          </div>

          {/* Short Description */}
          <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-sans">
            {product.description}
          </p>

          {/* Stock state indicator */}
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-white/40">AVAILABILITY:</span>
            {product.stock > 5 ? (
              <span className="text-emerald-400 font-bold">IN STOCK &bull; DISPATCH READY</span>
            ) : product.stock > 0 ? (
              <span className="text-amber-400 font-bold">LOW STOCK &bull; {product.stock} UNITS REMAINING</span>
            ) : (
              <span className="text-red-400 font-bold">CURRENTLY BACKORDERED</span>
            )}
          </div>

          {/* Quantity and Add to Cart */}
          <div className="pt-4 border-t border-white/[0.08] space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold uppercase tracking-wider text-white/60">
                Quantity
              </span>
              <div className="flex items-center border border-white/20 rounded-lg bg-black/60 p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="p-1.5 text-white/60 hover:text-white disabled:opacity-30 transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 text-xs font-bold text-white min-w-[32px] text-center font-mono">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock || isOutOfStock}
                  className="p-1.5 text-white/60 hover:text-white disabled:opacity-30 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock || isAdding}
              className={`w-full py-4 rounded-lg text-xs font-black tracking-widest uppercase transition-all flex items-center justify-center gap-2 shadow-xl ${
                isOutOfStock
                  ? 'bg-white/5 text-white/30 cursor-not-allowed border border-white/10'
                  : 'bg-copper hover:bg-copper-hover text-black shadow-copper/25 hover:shadow-copper/40 active:scale-[0.98]'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{isAdding ? 'ALLOCATING TO CART...' : isOutOfStock ? 'OUT OF STOCK' : 'ADD TO CART'}</span>
            </button>

            {addFeedback && (
              <div
                className={`p-3.5 rounded-lg text-xs font-bold flex items-center gap-2 animate-fade-in ${
                  addFeedback.success
                    ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-800/50'
                    : 'bg-red-950/70 text-red-300 border border-red-800/50'
                }`}
              >
                {addFeedback.success ? <Check className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
                <span className="flex-1">{addFeedback.message}</span>
                {!addFeedback.success && addFeedback.message.toLowerCase().includes('log in') && (
                  <Link to="/login" className="underline text-copper hover:text-white font-bold ml-2">
                    LOG IN &rarr;
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Guarantees */}
          <div className="grid grid-cols-3 gap-3 pt-6 border-t border-white/[0.08] text-center">
            <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
              <Truck className="w-4 h-4 text-copper mx-auto mb-1.5" />
              <span className="text-[11px] text-white/90 font-bold block">Expedited</span>
              <span className="text-[9px] text-white/40 block">Within 24 Hours</span>
            </div>
            <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
              <ShieldCheck className="w-4 h-4 text-copper mx-auto mb-1.5" />
              <span className="text-[11px] text-white/90 font-bold block">3-Year Cover</span>
              <span className="text-[9px] text-white/40 block">Factory Warranty</span>
            </div>
            <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
              <RotateCcw className="w-4 h-4 text-copper mx-auto mb-1.5" />
              <span className="text-[11px] text-white/90 font-bold block">30-Day Trial</span>
              <span className="text-[9px] text-white/40 block">Risk Free Returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Experience Showcase Section (Based on Product Mechanic) */}
      <div className="mt-16 space-y-12">
        {mechanic === '360_VIEW' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <span className="text-[10px] font-mono tracking-[0.25em] text-cyan-400 uppercase font-bold">
                INTERACTIVE ROTATIONAL STUDIO
              </span>
              <span className="text-[11px] font-mono text-white/40">
                DRAG TO ROTATE &bull; SCROLL TO ZOOM
              </span>
            </div>
            <Product360Viewer
              imageUrl={canonicalImageUrl}
              productName={product.name}
              isInline={true}
              modelUrl={resolvedModelUrl}
              category={product.category}
            />
          </div>
        )}

        {mechanic === 'COLOR_LAB' && (
          <ProductColorExplorer
            baseImageUrl={canonicalImageUrl}
            productName={product.name}
          />
        )}

        {mechanic === 'ENGINEERING' && (
          <ProductEngineeringHotspots
            imageUrl={canonicalImageUrl}
            productName={product.name}
          />
        )}
      </div>

      {/* Tabs Below: Overview / Specifications / Availability */}
      <div className="mt-16 pt-10 border-t border-white/[0.08]">
        {/* Tab Headers */}
        <div className="flex items-center gap-3 border-b border-white/[0.08] pb-4 mb-8">
          {(['overview', 'specifications', 'availability'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === tab
                  ? 'bg-copper text-black shadow-md shadow-copper/20'
                  : 'text-white/60 hover:text-white bg-white/[0.03] border border-white/[0.06]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="max-w-3xl space-y-4 text-sm text-white/70 leading-relaxed">
            <h3 className="text-xl font-bold font-headline text-white">
              Acoustic Profile & Engineering Intent
            </h3>
            <p>
              The {product.name} is engineered to achieve transparent electroacoustic linearity. Standard commercial headphones rely on heavy signal EQ to correct for mechanical cavity resonances; NEXORO tackles resonance at the source with laser-machined acoustic chambers, custom dampening compounds, and hand-matched drivers.
            </p>
            <p>
              Whether connected to high-resolution desktop amplification or mobile USB-C DAC dongles, the {product.name} reveals micro-dynamics and space with effortless speed.
            </p>
          </div>
        )}

        {/* Tab 2: Specifications */}
        {activeTab === 'specifications' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.keys(specsObj).length > 0 ? (
              Object.entries(specsObj).map(([k, v]) => (
                <div
                  key={k}
                  className="p-4 rounded-lg bg-[#0e0f13] border border-white/[0.08] flex justify-between items-center"
                >
                  <span className="text-xs text-white/50 font-mono uppercase">{k}</span>
                  <span className="text-xs text-white font-mono font-bold">{v}</span>
                </div>
              ))
            ) : (
              <div className="p-4 rounded-lg bg-[#0e0f13] border border-white/[0.08] col-span-2">
                <span className="text-xs text-white/60">Standard NEXORO reference specifications apply. 5Hz - 45kHz frequency response, &lt;0.0001% THD.</span>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Availability */}
        {activeTab === 'availability' && (
          <div className="p-6 rounded-xl bg-[#0e0f13] border border-white/[0.08] max-w-2xl space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-copper" />
              <h4 className="text-sm font-bold text-white font-headline">Live Warehouse Telemetry</h4>
            </div>
            <p className="text-xs text-white/60 leading-relaxed">
              Current allocated units: <strong className="text-copper font-mono">{product.stock}</strong>. Orders placed before 3:00 PM EST qualify for same-day dispatch from our central logistics facility.
            </p>
          </div>
        )}
      </div>

      {/* COMPLETE YOUR NEXORO SETUP */}
      {related.length > 0 && (
        <div className="mt-20 pt-16 border-t border-white/[0.08]">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[10px] font-mono font-bold text-copper uppercase tracking-widest mb-2">
                <span className="w-1.5 h-1.5 rounded-[1px] bg-copper shadow-[0_0_6px_#C8834A]" />
                <span>ECOSYSTEM COMPATIBILITY</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black font-headline text-white">
                COMPLETE YOUR NEXORO SETUP
              </h2>
              <p className="text-xs text-white/50 mt-1 font-mono">
                {product.category === 'HEADPHONES'
                  ? 'Recommended true wireless earbuds for mobile on-the-go acoustic continuity'
                  : 'Recommended studio reference over-ear headphones for critical desktop listening'}
              </p>
            </div>
            <Link to="/catalog" className="text-xs font-bold text-copper hover:underline uppercase font-mono self-start sm:self-auto">
              EXPLORE FULL CATALOGUE &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related
              .filter((p) => p.status === 'ACTIVE' && (p.category === 'HEADPHONES' || p.category === 'EARBUDS'))
              .slice(0, 3)
              .map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
          </div>
        </div>
      )}

      {/* Interactive 360 Viewer Modal */}
      {mechanic === '360_VIEW' && is360ModalOpen && (
        <Product360Viewer
          imageUrl={canonicalImageUrl}
          productName={product.name}
          isOpen={is360ModalOpen}
          onClose={() => setIs360ModalOpen(false)}
          modelUrl={resolvedModelUrl}
          category={product.category}
        />
      )}

      {/* Interactive 3D Product Viewer Modal */}
      {product.has3DModel && product.modelUrl && is3DModalOpen && (
        <React.Suspense fallback={null}>
          <Product3DViewer
            modelUrl={product.modelUrl}
            productName={product.name}
            isOpen={is3DModalOpen}
            onClose={() => setIs3DModalOpen(false)}
          />
        </React.Suspense>
      )}
    </div>
  );
};
