import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Star, Check } from 'lucide-react';
import { Product } from '../types';
import { StockBadge } from './StatusBadge';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock <= 0) return;

    setIsAdding(true);
    const res = await addToCart(product.id, 1);
    setIsAdding(false);
    if (res.success) {
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 2000);
    } else if (res.message && res.message.toLowerCase().includes('log in')) {
      navigate('/login');
    }
  };

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="group relative bg-[#0e0f13] border border-white/[0.08] hover:border-copper/50 rounded-lg overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-black/80 hover:-translate-y-1">
      {/* 1. Large Product Image with Overlay Badges */}
      <div>
        <Link
          to={`/products/${product.id}`}
          className="block relative aspect-square sm:aspect-[4/3] bg-[#141519] overflow-hidden"
        >
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-[1.04] transition-transform duration-500 ease-out"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e0f13] via-transparent to-black/30 opacity-75 pointer-events-none" />

          {/* Stock Badge Overlay (Top Left) */}
          <div className="absolute top-3.5 left-3.5 z-10">
            <StockBadge stock={product.stock} />
          </div>

          {/* Category & 3D Badges Overlay (Top Right) */}
          <div className="absolute top-3.5 right-3.5 z-10 flex items-center gap-1.5">
            {product.has3DModel && (
              <span className="bg-copper/25 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono font-black text-copper tracking-wider border border-copper/50 shadow-sm">
                3D
              </span>
            )}
            <div className="bg-black/75 backdrop-blur-md px-2.5 py-1 rounded text-[10px] font-mono font-bold text-white/90 uppercase tracking-widest border border-white/10">
              {product.category}
            </div>
          </div>
        </Link>

        {/* 2. Content Details: SKU -> Name -> Short Description -> Rating */}
        <div className="p-5">
          {/* SKU */}
          <div className="mb-1">
            <span className="text-[11px] text-copper font-mono font-bold tracking-widest uppercase">
              {product.sku}
            </span>
          </div>

          {/* Product Name */}
          <Link to={`/products/${product.id}`} className="block group-hover:text-copper-light transition-colors">
            <h3 className="text-base font-black font-headline text-white leading-snug tracking-tight">
              {product.name}
            </h3>
          </Link>

          {/* Short Description */}
          <p className="mt-2 text-xs text-white/60 line-clamp-2 leading-relaxed font-sans">
            {product.description}
          </p>

          {/* Rating */}
          <div className="mt-3.5 flex items-center gap-1.5 text-xs text-amber-400 font-semibold font-mono">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(product.rating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'fill-white/10 text-white/20'
                  }`}
                />
              ))}
            </div>
            <span className="text-white/80 font-mono text-[11px] ml-1">
              {product.rating.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Bottom Row: Price + Add to Cart */}
      <div className="px-5 pb-5 pt-3 border-t border-white/[0.06] flex items-center justify-between mt-1">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-white/40 block font-mono">
            Price
          </span>
          <span className="text-xl font-black font-headline text-white tracking-tight">
            ${product.price.toFixed(2)}
          </span>
        </div>

        <button
          onClick={handleQuickAdd}
          disabled={isOutOfStock || isAdding}
          className={`px-4 py-2.5 rounded-lg text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-1.5 ${
            isOutOfStock
              ? 'bg-white/5 text-white/30 cursor-not-allowed border border-white/5'
              : addedSuccess
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
              : 'bg-copper hover:bg-copper-hover text-black shadow-md shadow-copper/20 hover:shadow-copper/40 active:scale-95'
          }`}
        >
          {addedSuccess ? (
            <>
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>ADDED</span>
            </>
          ) : isOutOfStock ? (
            'SOLD OUT'
          ) : (
            <>
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{isAdding ? 'ADDING...' : 'ADD TO CART'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
