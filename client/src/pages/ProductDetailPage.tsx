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
} from 'lucide-react';
import { Product } from '../types';
import { StockBadge } from '../components/StatusBadge';
import { ProductCard } from '../components/ProductCard';
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
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-copper" />
          <span>BACK TO COLLECTION</span>
        </button>
      </div>

      {/* Main Product Layout (2 Columns: Left 7 cols Media, Right 5 cols Actions) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 items-start">
        {/* LEFT: Product Media */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-square sm:aspect-[4/3] lg:aspect-square rounded-xl overflow-hidden bg-[#0d0e12] border border-white/[0.08] shadow-2xl">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            {/* Overlay badges */}
            <div className="absolute top-4 left-4 z-10">
              <StockBadge stock={product.stock} />
            </div>
            <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
              {product.has3DModel && (
                <span className="bg-copper/25 backdrop-blur-md px-2.5 py-1 rounded text-xs font-mono font-black text-copper tracking-wider border border-copper/50">
                  3D INSPECTABLE
                </span>
              )}
              <div className="bg-black/80 backdrop-blur-md px-3 py-1 rounded text-xs font-mono font-bold text-white/90 uppercase border border-white/10">
                SKU: {product.sku}
              </div>
            </div>
          </div>

          {/* VIEW IN 3D Button (Only rendered when product has 3D model) */}
          {product.has3DModel && product.modelUrl && (
            <button
              onClick={() => setIs3DModalOpen(true)}
              className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-[#111318] via-[#161822] to-[#111318] hover:from-[#191c28] hover:to-[#191c28] border border-copper/40 hover:border-copper text-white text-xs font-bold font-mono tracking-widest uppercase flex items-center justify-center gap-3 transition-all shadow-xl shadow-black/60 group"
            >
              <Box className="w-4 h-4 text-copper group-hover:scale-110 transition-transform" />
              <span>VIEW IN 3D</span>
              <span className="text-[10px] text-copper/80 font-normal ml-1">
                (Interactive Studio)
              </span>
            </button>
          )}
        </div>

        {/* RIGHT: Details & Purchase */}
        <div className="lg:col-span-5 space-y-6">
          {/* Category */}
          <div>
            <span className="text-[11px] font-mono tracking-[0.25em] text-copper uppercase font-bold block mb-1">
              {product.category}
            </span>
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

      {/* Tabs Below: Overview / Specifications / Availability */}
      <div className="mt-20 pt-10 border-t border-white/[0.08]">
        {/* Tab Headers */}
        <div className="flex items-center gap-3 border-b border-white/[0.08] pb-4 mb-8">
          {(['overview', 'specifications', 'availability'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
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

      {/* Related Products */}
      {related.length > 0 && (
        <div className="mt-20 pt-16 border-t border-white/[0.08]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-[10px] font-mono tracking-[0.25em] text-copper uppercase font-bold block mb-1">
                COMPATIBLE HARDWARE
              </span>
              <h2 className="text-2xl font-bold font-headline text-white">
                RELATED SYSTEMS
              </h2>
            </div>
            <Link to="/catalog" className="text-xs font-bold text-copper hover:underline uppercase font-mono">
              VIEW FULL CATALOGUE &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
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
