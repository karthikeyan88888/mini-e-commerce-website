import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Truck, ArrowLeft, Calendar, ShieldCheck, MapPin, Package, CheckCircle2 } from 'lucide-react';
import { Order } from '../types';
import { OrderStatusBadge } from '../components/StatusBadge';
import { OrderTimeline } from '../components/OrderTimeline';
import { api } from '../api/client';

export const OrderTrackingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);

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
      <div className="pt-32 pb-24 px-6 md:px-12 max-w-5xl mx-auto min-h-screen space-y-6">
        <div className="h-28 bg-white/5 rounded-xl animate-pulse" />
        <div className="h-64 bg-white/5 rounded-xl animate-pulse" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="pt-36 pb-24 px-6 text-center max-w-md mx-auto min-h-screen flex flex-col items-center justify-center text-white">
        <h2 className="text-2xl font-bold font-headline text-white mb-2">Order Not Located</h2>
        <p className="text-xs text-white/50 mb-6">
          The requested order ID does not match any current dispatch records in our database.
        </p>
        <Link
          to="/orders"
          className="px-6 py-3 bg-copper hover:bg-copper-hover text-black font-bold text-xs tracking-widest uppercase rounded-lg"
        >
          VIEW MY ORDERS
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-24 px-6 md:px-12 max-w-5xl mx-auto min-h-screen text-white">
      {/* Back button */}
      <div className="mb-8">
        <Link
          to="/orders"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-copper" />
          <span>BACK TO ALL ORDERS</span>
        </Link>
      </div>

      {/* Main Order Header Block */}
      <div className="p-6 sm:p-8 rounded-xl bg-[#0e0f13] border border-white/[0.08] shadow-2xl space-y-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[10px] font-mono font-bold text-copper uppercase tracking-widest mb-2">
              <Truck className="w-3 h-3 text-copper" />
              <span>COURIER TELEMETRY</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-headline text-white">
              TRACKING: {order.trackingNumber || 'NX-PENDING'}
            </h1>
            <p className="text-xs text-white/50 font-mono mt-1">
              Order ID: <span className="text-white">{order.id}</span> &bull; Placed on {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="flex flex-col sm:items-end">
            <span className="text-[10px] text-white/40 uppercase font-mono block mb-1">Status</span>
            <OrderStatusBadge status={order.status} />
          </div>
        </div>

        {/* 5-Stage Visual Progression */}
        <div className="pt-2">
          <OrderTimeline currentStatus={order.status} />
        </div>
      </div>

      {/* Details Grid: Products and Delivery Info */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Products in Order (7 cols) */}
        <div className="md:col-span-7 p-6 sm:p-8 rounded-xl bg-[#0e0f13] border border-white/[0.08] space-y-4">
          <h2 className="text-sm font-bold font-headline uppercase tracking-wider text-white pb-3 border-b border-white/[0.08]">
            PACKAGE CONTENTS ({order.items.length} HARDWARE ITEMS)
          </h2>

          <div className="divide-y divide-white/[0.06]">
            {order.items.map((item) => (
              <div key={item.id} className="py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={item.product?.imageUrl}
                    alt={item.product?.name}
                    className="w-14 h-14 rounded-lg object-cover bg-black/50 border border-white/10"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white font-headline">{item.product?.name}</h4>
                    <span className="text-[10px] text-white/40 font-mono block mt-0.5">
                      SKU: {item.product?.sku}
                    </span>
                    <span className="text-xs text-copper font-mono mt-1 block">
                      ${item.priceAtPurchase.toFixed(2)} &times; {item.quantity} units
                    </span>
                  </div>
                </div>

                <span className="text-sm font-bold text-white font-mono">
                  ${(item.priceAtPurchase * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-white/[0.08] flex justify-between items-baseline text-white">
            <span className="text-xs font-mono text-white/50 uppercase">Total Paid</span>
            <span className="text-2xl font-black font-headline text-copper">
              ${order.totalAmount.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Delivery Information (5 cols) */}
        <div className="md:col-span-5 p-6 sm:p-8 rounded-xl bg-[#0e0f13] border border-white/[0.08] space-y-6">
          <h2 className="text-sm font-bold font-headline uppercase tracking-wider text-white pb-3 border-b border-white/[0.08]">
            DESTINATION TELEMETRY
          </h2>

          <div className="space-y-4 text-xs">
            <div>
              <span className="text-[10px] font-mono uppercase text-white/40 block mb-1">
                Recipient
              </span>
              <p className="text-white font-bold">{order.customerName}</p>
              <p className="text-white/60 font-mono">{order.customerEmail}</p>
            </div>

            <div className="pt-3 border-t border-white/[0.06]">
              <span className="text-[10px] font-mono uppercase text-white/40 block mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-copper" />
                <span>Shipping Address</span>
              </span>
              <p className="text-white/90 leading-relaxed">
                {order.shippingAddress}<br />
                {order.city}, {order.postalCode}<br />
                {order.country}
              </p>
            </div>

            <div className="pt-3 border-t border-white/[0.06]">
              <span className="text-[10px] font-mono uppercase text-white/40 block mb-1">
                Courier Service
              </span>
              <p className="text-white/80">Priority Express Dispatch (Insured)</p>
            </div>
          </div>

          <div className="pt-4 border-t border-white/[0.08] space-y-2 text-[11px] text-white/50">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-copper flex-shrink-0" />
              <span>Full transit replacement insurance</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-copper flex-shrink-0" />
              <span>Direct signature required at delivery</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
