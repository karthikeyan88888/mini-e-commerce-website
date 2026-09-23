import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Package, Truck, Calendar, MapPin } from 'lucide-react';
import { Order } from '../types';
import { OrderStatusBadge } from '../components/StatusBadge';
import { api } from '../api/client';

export const OrderConfirmationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    api
      .get(`/orders/${id}`)
      .then((res) => {
        setOrder(res.data.order);
      })
      .catch((err) => {
        console.error('Failed to load order', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  if (isLoading) {
    return (
      <div className="pt-36 pb-24 px-6 text-center max-w-md mx-auto min-h-screen">
        <div className="w-16 h-16 rounded-full bg-white/5 animate-pulse mx-auto mb-4" />
        <div className="h-6 w-48 bg-white/5 rounded mx-auto" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="pt-36 pb-24 px-6 text-center max-w-md mx-auto min-h-screen">
        <h2 className="text-2xl font-bold text-white mb-2">Order Not Found</h2>
        <Link to="/orders" className="text-copper underline text-xs">
          View My Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-24 px-6 md:px-12 max-w-4xl mx-auto min-h-screen">
      {/* Success Banner */}
      <div className="p-8 md:p-12 rounded-3xl bg-[#0c0d10] border border-copper/30 text-center relative overflow-hidden shadow-2xl shadow-copper/10 mb-10">
        <div className="w-16 h-16 rounded-full bg-copper/20 border border-copper text-copper flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-copper mb-3">
          <span className="w-1.5 h-1.5 rounded-[1px] bg-copper" />
          <span>ORDER CONFIRMED & ALLOCATED</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold font-headline tracking-tight text-white">
          THANK YOU FOR YOUR ORDER.
        </h1>

        <p className="text-sm text-white/60 mt-3 max-w-lg mx-auto">
          Your precision acoustic hardware has been reserved. A confirmation with dispatch telemetry has been generated.
        </p>

        {/* Quick Order Info Strip */}
        <div className="mt-8 pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
          <div className="p-3 rounded-xl bg-white/5">
            <span className="text-[10px] uppercase text-white/40 block font-mono">Order ID</span>
            <span className="text-xs font-bold text-white font-mono truncate block mt-0.5">
              {order.id.slice(0, 8)}...
            </span>
          </div>

          <div className="p-3 rounded-xl bg-white/5">
            <span className="text-[10px] uppercase text-white/40 block font-mono">Tracking No.</span>
            <span className="text-xs font-bold text-copper font-mono block mt-0.5">
              {order.trackingNumber || 'NX-PENDING'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-white/5">
            <span className="text-[10px] uppercase text-white/40 block font-mono">Date</span>
            <span className="text-xs font-bold text-white block mt-0.5">
              {new Date(order.createdAt).toLocaleDateString()}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-white/5">
            <span className="text-[10px] uppercase text-white/40 block font-mono">Total Paid</span>
            <span className="text-xs font-bold text-copper block mt-0.5 font-headline">
              ${order.totalAmount.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            to={`/orders/${order.id}`}
            className="px-8 py-3.5 bg-copper hover:bg-copper-hover text-black font-bold text-xs tracking-widest uppercase rounded-xl shadow-lg shadow-copper/25 transition-all flex items-center gap-2"
          >
            <Truck className="w-4 h-4" />
            <span>TRACK ORDER REAL-TIME</span>
          </Link>

          <Link
            to="/catalog"
            className="px-6 py-3.5 bg-white/5 hover:bg-white/10 text-white font-semibold text-xs tracking-widest uppercase rounded-xl border border-white/10 transition-colors"
          >
            CONTINUE SHOPPING
          </Link>
        </div>
      </div>

      {/* Items Summary Table */}
      <div className="p-6 md:p-8 rounded-2xl bg-[#0e0f13] border border-white/10 space-y-6">
        <h3 className="text-base font-bold font-headline text-white border-b border-white/10 pb-4">
          ORDER ITEMS BREAKDOWN
        </h3>

        <div className="space-y-4">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-4 py-2 border-b border-white/5 last:border-none"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.product?.imageUrl}
                  alt={item.product?.name || 'Product'}
                  className="w-14 h-14 rounded-lg object-cover bg-black/50"
                />
                <div>
                  <h4 className="text-sm font-semibold text-white font-headline">
                    {item.product?.name || 'Custom Hardware Unit'}
                  </h4>
                  <span className="text-xs text-white/50 font-mono">
                    Qty: {item.quantity} &times; ${item.priceAtPurchase.toFixed(2)}
                  </span>
                </div>
              </div>

              <span className="text-sm font-bold font-headline text-white">
                ${(item.quantity * item.priceAtPurchase).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {/* Shipping Destination */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between gap-4 text-xs text-white/70">
          <div className="flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-copper flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white block">Shipping Destination:</span>
              <p className="mt-0.5">
                {order.customerName}<br />
                {order.shippingAddress}<br />
                {order.city}, {order.postalCode}, {order.country}
              </p>
            </div>
          </div>

          <div className="sm:text-right">
            <span className="text-white/40 block text-[11px] uppercase">Current Lifecycle Status</span>
            <div className="mt-1">
              <OrderStatusBadge status={order.status} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
