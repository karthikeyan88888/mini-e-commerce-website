import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ArrowLeft, ShoppingBag, ShieldCheck, Truck, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const CartPage: React.FC = () => {
  const { cart, updateQuantity, removeItem, clearCart, isLoading } = useCart();
  const navigate = useNavigate();

  const items = cart?.items || [];
  const hasItems = items.length > 0;

  if (!hasItems) {
    return (
      <div className="pt-36 pb-24 px-6 max-w-lg mx-auto text-center min-h-[70vh] flex flex-col items-center justify-center text-white">
        <div className="w-20 h-20 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white/30 mb-6">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-black font-headline text-white mb-2">
          YOUR CART IS EMPTY
        </h1>
        <p className="text-xs text-white/50 mb-8 max-w-sm leading-relaxed">
          Your listening setup is waiting. Browse our collection of precision planar transducers and amplification systems.
        </p>
        <Link
          to="/catalog"
          className="px-8 py-3.5 bg-copper hover:bg-copper-hover text-black font-black text-xs tracking-widest uppercase rounded-lg shadow-xl shadow-copper/25 transition-all"
        >
          EXPLORE CATALOGUE
        </Link>
      </div>
    );
  }

  const freeShippingThreshold = 150;
  const currentSubtotal = cart?.subtotal || 0;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - currentSubtotal);

  return (
    <div className="pt-28 pb-24 px-6 md:px-12 max-w-7xl mx-auto min-h-screen text-white">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-6 border-b border-white/[0.08]">
        <div>
          <span className="text-[10px] font-mono tracking-[0.25em] text-copper uppercase font-bold block mb-1">
            STAGE 01 // BASKET ALLOCATION
          </span>
          <h1 className="text-3xl sm:text-4xl font-black font-headline text-white">
            SHOPPING CART ({cart?.itemCount || 0} ITEMS)
          </h1>
        </div>

        <button
          onClick={clearCart}
          className="text-xs text-red-400/80 hover:text-red-300 transition-colors flex items-center gap-1.5 self-start sm:self-auto font-mono"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear All Items</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 items-start">
        {/* LEFT: Cart Items (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Free Shipping Alert Bar */}
          <div className="p-4 rounded-xl bg-[#0e0f13] border border-white/[0.08] flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-copper" />
              <span>
                {amountToFreeShipping > 0 ? (
                  <>Add <strong className="text-copper">${amountToFreeShipping.toFixed(2)}</strong> more for free expedited shipping</>
                ) : (
                  <span className="text-emerald-400 font-bold">You have unlocked FREE priority courier shipping!</span>
                )}
              </span>
            </div>
            <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden hidden sm:block">
              <div
                className="h-full bg-copper transition-all duration-300"
                style={{ width: `${Math.min(100, (currentSubtotal / freeShippingThreshold) * 100)}%` }}
              />
            </div>
          </div>

          {items.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-xl bg-[#0e0f13] border border-white/[0.08] hover:border-copper/40 flex flex-col sm:flex-row items-start sm:items-center gap-5 justify-between transition-all"
            >
              {/* Product Info */}
              <div className="flex items-center gap-4">
                <Link to={`/products/${item.productId}`} className="flex-shrink-0">
                  <img
                    src={item.product?.imageUrl}
                    alt={item.product?.name}
                    className="w-20 h-20 rounded-lg object-cover bg-black/50 border border-white/10"
                  />
                </Link>
                <div>
                  <span className="text-[10px] font-mono uppercase text-copper block font-bold">
                    {item.product?.category} &bull; {item.product?.sku}
                  </span>
                  <Link
                    to={`/products/${item.productId}`}
                    className="text-base font-bold font-headline text-white hover:text-copper transition-colors block mt-0.5"
                  >
                    {item.product?.name}
                  </Link>
                  <span className="text-xs text-white/50 block mt-1 font-mono">
                    Unit: ${item.product?.price.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Quantity Controls & Total */}
              <div className="flex items-center justify-between w-full sm:w-auto gap-6 sm:gap-8 pt-4 sm:pt-0 border-t sm:border-t-0 border-white/10">
                <div className="flex items-center border border-white/20 rounded-lg bg-black/60 p-1">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-1.5 text-white/60 hover:text-white transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-bold text-white font-mono min-w-[28px] text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    disabled={item.quantity >= (item.product?.stock || 99)}
                    className="p-1.5 text-white/60 hover:text-white disabled:opacity-30 transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-right min-w-[80px]">
                  <span className="text-lg font-black font-headline text-white block">
                    ${item.itemTotal.toFixed(2)}
                  </span>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-[11px] text-white/40 hover:text-red-400 transition-colors inline-block mt-0.5 font-mono"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="pt-4 flex items-center justify-between">
            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/60 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-copper" />
              <span>CONTINUE BROWSING</span>
            </Link>
          </div>
        </div>

        {/* RIGHT: Order Summary (4 cols) */}
        <div className="lg:col-span-4 bg-[#0e0f13] border border-white/[0.08] rounded-xl p-6 sm:p-8 space-y-6 sticky top-28 shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="text-sm font-bold font-headline uppercase tracking-wider text-white">
              ORDER SUMMARY
            </h3>
            <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded">
              VERIFIED
            </span>
          </div>

          <div className="space-y-3.5 text-xs text-white/70">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-white font-mono font-medium">${cart?.subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span>Delivery</span>
              <span className="font-mono font-medium">
                {cart?.shipping === 0 ? (
                  <span className="text-emerald-400 font-bold">FREE COURIER</span>
                ) : (
                  `$${cart?.shipping.toFixed(2)}`
                )}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Estimated Sales Tax (8%)</span>
              <span className="text-white font-mono font-medium">${cart?.tax.toFixed(2)}</span>
            </div>

            {/* Total Row with Strong Visual Hierarchy */}
            <div className="pt-5 border-t border-white/10 flex justify-between items-baseline text-white">
              <div>
                <span className="text-sm font-black font-headline block">Total</span>
                <span className="text-[10px] text-white/40 font-mono">Includes tax & shipping</span>
              </div>
              <span className="text-3xl font-black font-headline text-copper tracking-tight">
                ${cart?.total.toFixed(2)}
              </span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            disabled={isLoading}
            className="w-full py-4 bg-copper hover:bg-copper-hover text-black font-black text-xs tracking-widest uppercase rounded-lg flex items-center justify-center gap-2 shadow-xl shadow-copper/25 transition-all active:scale-[0.98]"
          >
            <span>PROCEED TO CHECKOUT</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="pt-2 space-y-2.5 text-[11px] text-white/50 border-t border-white/10">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-copper flex-shrink-0" />
              <span>Real-time warehouse stock verified</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-copper flex-shrink-0" />
              <span>3-Year official NEXORO factory warranty</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-3.5 h-3.5 text-copper flex-shrink-0" />
              <span>Expedited dispatch within 24 hours</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
