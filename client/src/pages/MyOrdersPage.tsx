import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ArrowRight, Truck, Calendar, ShoppingBag, ArrowUpRight } from 'lucide-react';
import { Order } from '../types';
import { OrderStatusBadge } from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';

export const MyOrdersPage: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    api
      .get('/orders')
      .then((res) => {
        setOrders(res.data.orders || []);
      })
      .catch((err) => {
        console.error('Failed to load orders', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [user]);

  if (!user) {
    return (
      <div className="pt-36 pb-24 px-6 text-center max-w-md mx-auto min-h-screen flex flex-col items-center justify-center text-white">
        <h2 className="text-2xl font-black font-headline text-white mb-2">Account Required</h2>
        <p className="text-xs text-white/50 mb-6">
          Please log in to view and track your hardware orders.
        </p>
        <Link
          to="/login"
          className="px-6 py-3 bg-copper hover:bg-copper-hover text-black font-bold text-xs tracking-widest uppercase rounded-lg"
        >
          SIGN IN TO ACCOUNT
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="pt-32 pb-24 px-6 md:px-12 max-w-5xl mx-auto min-h-screen space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-32 bg-white/5 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="pt-28 pb-24 px-6 md:px-12 max-w-6xl mx-auto min-h-screen text-white">
      {/* Header */}
      <div className="mb-10 pb-6 border-b border-white/[0.08] flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono tracking-[0.25em] text-copper uppercase font-bold block mb-1">
            CLIENT ACCOUNT TELEMETRY
          </span>
          <h1 className="text-3xl sm:text-4xl font-black font-headline text-white">
            ORDER HISTORY & LOGISTICS
          </h1>
          <p className="text-xs text-white/50 mt-1 max-w-md">
            Review your purchase history, examine item breakdown, and inspect live courier telemetry for each order.
          </p>
        </div>

        <Link
          to="/catalog"
          className="px-5 py-2.5 bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/10 hover:border-copper/40 rounded-lg text-xs font-bold uppercase tracking-wider transition-all self-start sm:self-auto"
        >
          BROWSE SHOP
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="p-16 rounded-2xl bg-[#0e0f13] border border-white/[0.08] text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-white/30 mb-4">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold font-headline text-white mb-1">
            No orders placed yet
          </h3>
          <p className="text-xs text-white/50 max-w-xs mb-6">
            When you purchase NEXORO acoustic systems, your tracking telemetry will appear here.
          </p>
          <Link
            to="/catalog"
            className="px-6 py-3 bg-copper hover:bg-copper-hover text-black font-bold text-xs tracking-widest uppercase rounded-lg"
          >
            BROWSE COLLECTION
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const itemCount = order.items.reduce((acc, item) => acc + item.quantity, 0);

            return (
              <div
                key={order.id}
                className="p-6 rounded-xl bg-[#0e0f13] border border-white/[0.08] hover:border-copper/50 transition-all shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                {/* Left Block: Order ID, Date, Tracking, Status */}
                <div className="space-y-3.5 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <OrderStatusBadge status={order.status} />

                    <span className="text-xs font-mono text-white/50">
                      ID: <strong className="text-white font-mono">{order.id.slice(0, 8)}</strong>
                    </span>

                    <span className="text-white/20">&bull;</span>

                    <span className="text-xs text-white/50 font-mono">
                      Tracking: <strong className="text-copper font-mono">{order.trackingNumber || 'NX-PENDING'}</strong>
                    </span>

                    <span className="text-white/20">&bull;</span>

                    <span className="text-xs text-white/50 flex items-center gap-1 font-mono">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Thumbnail Strip of Items */}
                  <div className="flex items-center gap-2.5 overflow-x-auto py-1">
                    {order.items.slice(0, 4).map((item) => (
                      <div key={item.id} className="relative group/thumb flex-shrink-0">
                        <img
                          src={item.product?.imageUrl}
                          alt={item.product?.name || 'Product'}
                          title={item.product?.name}
                          className="w-14 h-14 rounded-lg object-cover bg-black/50 border border-white/10"
                        />
                        <span className="absolute -bottom-1 -right-1 bg-black/80 px-1 py-0.2 text-[9px] font-mono text-white rounded border border-white/20">
                          &times;{item.quantity}
                        </span>
                      </div>
                    ))}
                    {order.items.length > 4 && (
                      <span className="w-14 h-14 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xs font-mono text-white/60">
                        +{order.items.length - 4}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-white/70">
                    <span className="font-bold text-white">{itemCount} items</span> total &bull; Dispatched to <span className="text-white font-medium">{order.customerName}</span> ({order.city}, {order.postalCode})
                  </p>
                </div>

                {/* Right Block: Total + Track Order Action */}
                <div className="flex sm:flex-col items-center lg:items-end justify-between gap-4 pt-4 lg:pt-0 border-t lg:border-t-0 border-white/[0.08]">
                  <div className="text-left lg:text-right">
                    <span className="text-[10px] text-white/40 uppercase font-mono block">Order Total</span>
                    <span className="text-2xl font-black font-headline text-copper">
                      ${order.totalAmount.toFixed(2)}
                    </span>
                  </div>

                  <Link
                    to={`/orders/${order.id}`}
                    className="px-6 py-2.5 bg-copper hover:bg-copper-hover text-black text-xs font-black tracking-widest uppercase rounded-lg transition-all flex items-center gap-1.5 shadow-md shadow-copper/20"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>TRACK ORDER</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
