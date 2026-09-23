import React, { useEffect, useState } from 'react';
import { ShoppingBag, Search, Eye, Check, RefreshCw, X, MapPin, Truck } from 'lucide-react';
import { Order, OrderStatus } from '../../types';
import { OrderStatusBadge } from '../../components/StatusBadge';
import { api } from '../../api/client';

export const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updateFeedbackId, setUpdateFeedbackId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/admin/orders', {
        params: {
          status: statusFilter !== 'ALL' ? statusFilter : undefined,
          search: searchQuery.trim() || undefined,
        },
      });
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error('Failed to load admin orders', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await api.put(`/admin/orders/${orderId}/status`, { status: newStatus });
      setUpdateFeedbackId(orderId);
      // Update local state immediately
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
      setTimeout(() => setUpdateFeedbackId(null), 2500);
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const statusOptions: OrderStatus[] = ['PLACED', 'CONFIRMED', 'PACKED', 'SHIPPED', 'DELIVERED'];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono tracking-widest text-copper uppercase font-bold">
            FULFILLMENT TELEMETRY
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-headline text-white mt-1">
            CUSTOMER ORDERS & LIFECYCLE
          </h1>
        </div>

        <button
          onClick={fetchOrders}
          className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white font-semibold text-xs tracking-wider uppercase rounded-xl border border-white/10 flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5 text-copper" />
          <span>SYNC ALL ORDERS</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="p-4 rounded-2xl bg-[#0e0f13] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchOrders();
          }}
          className="relative flex-1 max-w-md"
        >
          <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Order ID, Customer, or Tracking..."
            className="w-full pl-10 pr-20 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-copper"
          />
        </form>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {['ALL', 'PLACED', 'CONFIRMED', 'PACKED', 'SHIPPED', 'DELIVERED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                statusFilter === st
                  ? 'bg-copper text-black'
                  : 'bg-white/5 hover:bg-white/10 text-white/70'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="p-6 rounded-2xl bg-[#0e0f13] border border-white/10 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-white/40 border-b border-white/10 font-mono">
                <th className="pb-3.5 font-medium">DISPATCH / ID</th>
                <th className="pb-3.5 font-medium">CUSTOMER</th>
                <th className="pb-3.5 font-medium">ITEMS</th>
                <th className="pb-3.5 font-medium">TOTAL</th>
                <th className="pb-3.5 font-medium">CURRENT STATUS</th>
                <th className="pb-3.5 font-medium">UPDATE STATUS</th>
                <th className="pb-3.5 font-medium text-right">INSPECT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {orders.map((order) => {
                const isUpdated = updateFeedbackId === order.id;

                return (
                  <tr key={order.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 font-mono">
                      <span className="font-bold text-copper block">{order.trackingNumber || 'NX-PENDING'}</span>
                      <span className="text-[10px] text-white/40 block">{order.id.slice(0, 8)}...</span>
                    </td>

                    <td className="py-3.5 text-white">
                      <span className="font-semibold block">{order.customerName}</span>
                      <span className="text-[10px] text-white/40 block">{order.customerEmail}</span>
                    </td>

                    <td className="py-3.5 font-mono text-white/70">
                      {order.items.reduce((acc, it) => acc + it.quantity, 0)} units
                    </td>

                    <td className="py-3.5 font-mono font-bold text-white">${order.totalAmount.toFixed(2)}</td>

                    <td className="py-3.5">
                      <OrderStatusBadge status={order.status} />
                    </td>

                    {/* Status Dropdown Modifier */}
                    <td className="py-3.5">
                      <div className="flex items-center gap-2">
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateStatus(order.id, e.target.value as OrderStatus)}
                          className="bg-black/60 border border-white/20 text-white text-xs font-semibold px-2.5 py-1 rounded-lg focus:outline-none focus:border-copper cursor-pointer"
                        >
                          {statusOptions.map((opt) => (
                            <option key={opt} value={opt} className="bg-[#121317]">
                              {opt}
                            </option>
                          ))}
                        </select>
                        {isUpdated && (
                          <span className="text-[11px] text-emerald-400 flex items-center gap-0.5 font-mono">
                            <Check className="w-3.5 h-3.5" />
                            <span>Saved</span>
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Inspect Modal Trigger */}
                    <td className="py-3.5 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-1.5 text-white/60 hover:text-copper bg-white/5 hover:bg-white/10 rounded-lg transition-colors inline-flex items-center gap-1 text-xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Details</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Inspection Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0e0f13] border border-white/10 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-copper uppercase block">
                  ORDER SPECIFICATION
                </span>
                <h3 className="text-xl font-bold font-headline text-white mt-0.5">
                  {selectedOrder.trackingNumber || selectedOrder.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 text-white/60 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer & Destination Strip */}
            <div className="p-4 rounded-xl bg-black/40 border border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-white/40 block text-[10px] uppercase font-mono">Customer</span>
                <span className="font-bold text-white block mt-0.5">{selectedOrder.customerName}</span>
                <span className="text-white/60 block">{selectedOrder.customerEmail}</span>
              </div>
              <div>
                <span className="text-white/40 block text-[10px] uppercase font-mono">Destination</span>
                <span className="text-white/80 block mt-0.5">
                  {selectedOrder.shippingAddress}, {selectedOrder.city}, {selectedOrder.postalCode}
                </span>
              </div>
            </div>

            {/* Items List */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-white/60 block">
                Purchased Hardware Items
              </span>
              <div className="space-y-2 max-h-56 overflow-y-auto">
                {selectedOrder.items.map((it) => (
                  <div
                    key={it.id}
                    className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between gap-4 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={it.product?.imageUrl}
                        alt={it.product?.name || 'Hardware'}
                        className="w-12 h-12 rounded-lg object-cover bg-black/40"
                      />
                      <div>
                        <h5 className="font-bold text-white font-headline">
                          {it.product?.name || 'Acoustic Unit'}
                        </h5>
                        <span className="text-copper font-mono text-[11px]">
                          ${it.priceAtPurchase.toFixed(2)} &times; {it.quantity}
                        </span>
                      </div>
                    </div>

                    <span className="font-mono font-bold text-white">
                      ${(it.priceAtPurchase * it.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Total */}
            <div className="pt-4 border-t border-white/10 flex justify-between items-baseline">
              <span className="text-xs font-bold text-white/60 uppercase">Settled Order Total</span>
              <span className="text-2xl font-extrabold font-headline text-copper">
                ${selectedOrder.totalAmount.toFixed(2)}
              </span>
            </div>

            <div className="pt-2 flex items-center justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
