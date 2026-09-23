import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const CartDrawer: React.FC = () => {
  const { cart, isDrawerOpen, closeDrawer, updateQuantity, removeItem, isLoading } = useCart();
  const navigate = useNavigate();

  if (!isDrawerOpen) return null;

  const items = cart?.items || [];
  const hasItems = items.length > 0;

  const handleCheckout = () => {
    closeDrawer();
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={closeDrawer}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0c0d10] border-l border-white/10 text-white flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-copper" />
              <h2 className="text-lg font-bold font-headline tracking-wide">
                YOUR CART ({cart?.itemCount || 0})
              </h2>
            </div>
            <button
              onClick={closeDrawer}
              className="p-2 text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {!hasItems ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-4">
                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/30 mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-semibold font-headline text-white mb-1">
                  Your cart is empty
                </h3>
                <p className="text-xs text-white/50 max-w-[240px] mb-6">
                  Explore our precision-engineered acoustic systems and elevate your sound.
                </p>
                <button
                  onClick={() => {
                    closeDrawer();
                    navigate('/catalog');
                  }}
                  className="px-5 py-2.5 bg-copper hover:bg-copper-hover text-black text-xs font-bold tracking-wider rounded-lg transition-all"
                >
                  BROWSE PRODUCTS
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#141518] border border-white/[0.06] rounded-xl p-3.5 flex gap-3.5 items-center"
                >
                  <img
                    src={item.product?.imageUrl}
                    alt={item.product?.name}
                    className="w-16 h-16 rounded-lg object-cover bg-black/40 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-white truncate font-headline">
                      {item.product?.name}
                    </h4>
                    <span className="text-xs text-copper font-medium block mt-0.5">
                      ${item.product?.price.toFixed(2)}
                    </span>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border border-white/15 rounded bg-black/40">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 text-white/60 hover:text-white transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= (item.product?.stock || 99)}
                          className="p-1 text-white/60 hover:text-white disabled:opacity-30 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1.5 text-white/40 hover:text-red-400 transition-colors ml-auto"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout */}
          {hasItems && (
            <div className="p-6 bg-[#090a0c] border-t border-white/10 space-y-3">
              <div className="space-y-1.5 text-xs text-white/70">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-white font-medium">${cart?.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax (8%)</span>
                  <span className="text-white font-medium">${cart?.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-white font-medium">
                    {cart?.shipping === 0 ? (
                      <span className="text-emerald-400">FREE</span>
                    ) : (
                      `$${cart?.shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="pt-2 border-t border-white/10 flex justify-between text-sm font-bold text-white">
                  <span>Total</span>
                  <span className="text-copper font-headline text-base">
                    ${cart?.total.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={handleCheckout}
                  disabled={isLoading}
                  className="w-full py-3 bg-copper hover:bg-copper-hover text-black font-bold text-xs tracking-widest uppercase rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-copper/20 hover:shadow-copper/40 transition-all active:scale-[0.99]"
                >
                  <span>PROCEED TO CHECKOUT</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <Link
                  to="/cart"
                  onClick={closeDrawer}
                  className="w-full py-2.5 text-center text-xs text-white/60 hover:text-white font-medium transition-colors"
                >
                  Review Cart Details
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
