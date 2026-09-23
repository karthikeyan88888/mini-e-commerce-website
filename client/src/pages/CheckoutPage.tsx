import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Lock, CheckCircle2, Truck, CreditCard, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';

export const CheckoutPage: React.FC = () => {
  const { cart, refreshCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customerName: user?.name || '',
    customerEmail: user?.email || '',
    shippingAddress: '742 Evergreen Terrace',
    city: 'Springfield',
    postalCode: '97477',
    country: 'United States',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const items = cart?.items || [];

  if (items.length === 0) {
    return (
      <div className="pt-36 pb-24 px-6 text-center max-w-md mx-auto min-h-screen flex flex-col items-center justify-center text-white">
        <h2 className="text-2xl font-black font-headline text-white mb-2">Cart is empty</h2>
        <p className="text-xs text-white/50 mb-6">
          Add products to your cart before proceeding to checkout.
        </p>
        <Link
          to="/catalog"
          className="px-6 py-3 bg-copper hover:bg-copper-hover text-black font-bold text-xs tracking-widest uppercase rounded-lg"
        >
          GO TO SHOP
        </Link>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await api.post('/orders', formData);
      const newOrder = res.data.order;
      await refreshCart();
      navigate(`/orders/${newOrder.id}/confirmation`, { state: { order: newOrder } });
    } catch (err: any) {
      console.error('Checkout failed', err);
      const msg = err.response?.data?.error || 'Order creation failed. Please verify your details.';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-28 pb-24 px-6 md:px-12 max-w-7xl mx-auto min-h-screen text-white">
      {/* Header */}
      <div className="mb-10 pb-6 border-b border-white/[0.08]">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[10px] font-mono font-bold text-copper uppercase tracking-widest mb-2">
          <Lock className="w-3 h-3 text-copper" />
          <span>STAGE 02 // SECURE ORDER FINALIZATION</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black font-headline text-white">
          CHECKOUT & DISPATCH
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 items-start">
        {/* LEFT: Checkout Form (8 cols) */}
        <form onSubmit={handleSubmitOrder} className="lg:col-span-8 space-y-8">
          {/* Section 1: Customer Details */}
          <div className="p-6 sm:p-8 rounded-xl bg-[#0e0f13] border border-white/[0.08] space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <h2 className="text-base font-bold font-headline uppercase tracking-wider text-white">
                1. CUSTOMER IDENTITY
              </h2>
              <span className="text-[10px] font-mono text-copper uppercase font-bold">REQUIRED</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-white/60 font-mono block mb-1.5 uppercase">
                  Full Legal Name
                </label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Alex Vance"
                  className="w-full px-4 py-3 bg-black/60 border border-white/10 rounded-lg text-xs text-white placeholder-white/30 focus:outline-none focus:border-copper font-sans"
                />
              </div>

              <div>
                <label className="text-xs text-white/60 font-mono block mb-1.5 uppercase">
                  Dispatch Email Address
                </label>
                <input
                  type="email"
                  name="customerEmail"
                  value={formData.customerEmail}
                  onChange={handleChange}
                  required
                  placeholder="e.g. alex@nexoro.io"
                  className="w-full px-4 py-3 bg-black/60 border border-white/10 rounded-lg text-xs text-white placeholder-white/30 focus:outline-none focus:border-copper font-sans"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Delivery Details */}
          <div className="p-6 sm:p-8 rounded-xl bg-[#0e0f13] border border-white/[0.08] space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <h2 className="text-base font-bold font-headline uppercase tracking-wider text-white">
                2. DELIVERY DESTINATION
              </h2>
              <span className="text-[10px] font-mono text-copper uppercase font-bold">EXPRESS COURIER</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-white/60 font-mono block mb-1.5 uppercase">
                  Street Address
                </label>
                <input
                  type="text"
                  name="shippingAddress"
                  value={formData.shippingAddress}
                  onChange={handleChange}
                  required
                  placeholder="e.g. 742 Evergreen Terrace"
                  className="w-full px-4 py-3 bg-black/60 border border-white/10 rounded-lg text-xs text-white placeholder-white/30 focus:outline-none focus:border-copper font-sans"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-white/60 font-mono block mb-1.5 uppercase">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Springfield"
                    className="w-full px-4 py-3 bg-black/60 border border-white/10 rounded-lg text-xs text-white placeholder-white/30 focus:outline-none focus:border-copper font-sans"
                  />
                </div>

                <div>
                  <label className="text-xs text-white/60 font-mono block mb-1.5 uppercase">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    required
                    placeholder="e.g. 97477"
                    className="w-full px-4 py-3 bg-black/60 border border-white/10 rounded-lg text-xs text-white placeholder-white/30 focus:outline-none focus:border-copper font-sans"
                  />
                </div>

                <div>
                  <label className="text-xs text-white/60 font-mono block mb-1.5 uppercase">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-black/60 border border-white/10 rounded-lg text-xs text-white placeholder-white/30 focus:outline-none focus:border-copper font-sans"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Order Review of Items */}
          <div className="p-6 sm:p-8 rounded-xl bg-[#0e0f13] border border-white/[0.08] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <h2 className="text-base font-bold font-headline uppercase tracking-wider text-white">
                3. ORDER REVIEW ({items.length} HARDWARE SYSTEMS)
              </h2>
              <Link to="/cart" className="text-xs text-copper hover:underline font-mono">
                Modify Cart
              </Link>
            </div>

            <div className="divide-y divide-white/[0.06]">
              {items.map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.product?.imageUrl}
                      alt={item.product?.name}
                      className="w-12 h-12 rounded object-cover bg-black/40 border border-white/10"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-white font-headline">{item.product?.name}</h4>
                      <span className="text-[10px] text-white/40 font-mono">
                        Qty: {item.quantity} &times; ${item.product?.price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-white font-mono">
                    ${item.itemTotal.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-4 rounded-lg bg-red-950/70 border border-red-800/50 text-xs text-red-300 font-semibold animate-fade-in">
              {errorMessage}
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <Link
              to="/cart"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/60 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-copper" />
              <span>RETURN TO BASKET</span>
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-4 bg-copper hover:bg-copper-hover text-black font-black text-xs tracking-widest uppercase rounded-lg shadow-xl shadow-copper/25 transition-all active:scale-[0.98] flex items-center gap-2"
            >
              <span>{isSubmitting ? 'AUTHORIZING & PLACING...' : 'CONFIRM & PLACE ORDER'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* RIGHT: Order Summary Sidebar (4 cols) */}
        <div className="lg:col-span-4 bg-[#0e0f13] border border-white/[0.08] rounded-xl p-6 sm:p-8 space-y-6 sticky top-28 shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="text-sm font-bold font-headline uppercase tracking-wider text-white">
              FINAL SUMMARY
            </h3>
            <span className="text-[10px] font-mono text-copper font-bold bg-copper/10 border border-copper/30 px-2 py-0.5 rounded">
              READY
            </span>
          </div>

          <div className="space-y-3.5 text-xs text-white/70">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-white font-mono font-medium">${cart?.subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span>Expedited Delivery</span>
              <span className="font-mono font-medium">
                {cart?.shipping === 0 ? (
                  <span className="text-emerald-400 font-bold">FREE</span>
                ) : (
                  `$${cart?.shipping.toFixed(2)}`
                )}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Sales Tax (8%)</span>
              <span className="text-white font-mono font-medium">${cart?.tax.toFixed(2)}</span>
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-between items-baseline text-white">
              <span className="text-sm font-black font-headline">Total Payable</span>
              <span className="text-3xl font-black font-headline text-copper">
                ${cart?.total.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="pt-4 space-y-2.5 text-[11px] text-white/50 border-t border-white/10">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-copper flex-shrink-0" />
              <span>Direct factory fulfillment</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-copper flex-shrink-0" />
              <span>Full warranty coverage registered automatically</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-3.5 h-3.5 text-copper flex-shrink-0" />
              <span>Real-time telemetry tracking code generated upon submit</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
