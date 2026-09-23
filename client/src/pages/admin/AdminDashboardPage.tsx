import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  ShoppingBag,
  Box,
  Clock,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  Plus,
  ArrowRight,
  Shield,
  Layers,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { OrderStatusBadge } from '../../components/StatusBadge';
import { api } from '../../api/client';

export const AdminDashboardPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api
      .get('/admin/dashboard')
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.error('Failed to load dashboard data', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-28 bg-white/5 rounded-xl" />
          ))}
        </div>
        <div className="h-80 bg-white/5 rounded-xl" />
      </div>
    );
  }

  const metrics = data?.metrics || {
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    pendingOrders: 0,
    lowStockCount: 0,
  };

  const salesTrend = data?.salesTrend || [];
  const statusDistribution = data?.orderStatusDistribution || [];
  const recentOrders = data?.recentOrders || [];
  const lowStockProducts = data?.lowStockProducts || [];

  const COLORS = ['#3B82F6', '#A855F7', '#F59E0B', '#C8834A', '#10B981'];

  return (
    <div className="space-y-8 max-w-7xl mx-auto text-white">
      {/* Brand Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[10px] font-mono font-bold text-copper uppercase tracking-widest mb-1.5">
            <Shield className="w-3 h-3 text-copper" />
            <span>NEXORO OPERATIONS SUITE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-headline text-white tracking-tight">
            EXECUTIVE CONTROL TELEMETRY
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/products"
            className="px-4 py-2.5 bg-copper hover:bg-copper-hover text-black font-black text-xs tracking-wider uppercase rounded-lg flex items-center gap-1.5 shadow-md shadow-copper/20 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>ADD PRODUCT</span>
          </Link>
          <Link
            to="/admin/orders"
            className="px-4 py-2.5 bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/10 hover:border-copper/40 font-bold text-xs tracking-wider uppercase rounded-lg transition-colors"
          >
            ORDERS
          </Link>
        </div>
      </div>

      {/* 5 Core Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* TOTAL REVENUE */}
        <div className="p-5 rounded-xl bg-[#0e0f13] border border-white/[0.08] hover:border-copper/40 transition-colors">
          <div className="flex items-center justify-between text-white/50 mb-3">
            <span className="text-[10px] font-mono tracking-widest uppercase">Total Revenue</span>
            <DollarSign className="w-4 h-4 text-copper" />
          </div>
          <span className="text-2xl font-black font-headline text-white block">
            ${metrics.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
          <span className="text-[10px] text-emerald-400 font-mono mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +14.8% vs last cycle
          </span>
        </div>

        {/* TOTAL ORDERS */}
        <div className="p-5 rounded-xl bg-[#0e0f13] border border-white/[0.08] hover:border-copper/40 transition-colors">
          <div className="flex items-center justify-between text-white/50 mb-3">
            <span className="text-[10px] font-mono tracking-widest uppercase">Total Orders</span>
            <ShoppingBag className="w-4 h-4 text-copper" />
          </div>
          <span className="text-2xl font-black font-headline text-white block">
            {metrics.totalOrders}
          </span>
          <span className="text-[10px] text-white/40 font-mono mt-1 block">
            Lifetime orders recorded
          </span>
        </div>

        {/* ACTIVE PRODUCTS */}
        <div className="p-5 rounded-xl bg-[#0e0f13] border border-white/[0.08] hover:border-copper/40 transition-colors">
          <div className="flex items-center justify-between text-white/50 mb-3">
            <span className="text-[10px] font-mono tracking-widest uppercase">Active Products</span>
            <Box className="w-4 h-4 text-copper" />
          </div>
          <span className="text-2xl font-black font-headline text-white block">
            {metrics.totalProducts}
          </span>
          <span className="text-[10px] text-white/40 font-mono mt-1 block">
            Active catalog systems
          </span>
        </div>

        {/* PENDING FULFILLMENT */}
        <div className="p-5 rounded-xl bg-[#0e0f13] border border-white/[0.08] hover:border-copper/40 transition-colors">
          <div className="flex items-center justify-between text-white/50 mb-3">
            <span className="text-[10px] font-mono tracking-widest uppercase text-amber-400">Pending Fulfillment</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-2xl font-black font-headline text-amber-300 block">
            {metrics.pendingOrders}
          </span>
          <span className="text-[10px] text-amber-400/70 font-mono mt-1 block">
            Placed / Confirmed / Packed
          </span>
        </div>

        {/* LOW STOCK */}
        <div className={`p-5 rounded-xl border transition-colors ${
          metrics.lowStockCount > 0
            ? 'bg-amber-950/20 border-amber-800/40'
            : 'bg-[#0e0f13] border-white/[0.08]'
        }`}>
          <div className="flex items-center justify-between text-white/50 mb-3">
            <span className="text-[10px] font-mono tracking-widest uppercase text-amber-400">Low Stock</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-2xl font-black font-headline text-amber-300 block">
            {metrics.lowStockCount}
          </span>
          <span className="text-[10px] text-amber-300/70 font-mono mt-1 block">
            SKUs &le; 5 units
          </span>
        </div>
      </div>

      {/* Analytics Charts: Revenue Overview & Order Lifecycle */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Overview (2 Cols) */}
        <div className="lg:col-span-2 p-6 rounded-xl bg-[#0e0f13] border border-white/[0.08] space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <div>
              <h3 className="text-sm font-bold font-headline uppercase tracking-wider text-white">
                Revenue Velocity (Weekly)
              </h3>
              <p className="text-xs text-white/40">Gross volume progression over the last 7 days</p>
            </div>
            <span className="text-xs font-mono text-copper font-bold">$ USD</span>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesTrend}>
                <defs>
                  <linearGradient id="copperAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C8834A" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#C8834A" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#ffffff30" fontSize={11} tickLine={false} />
                <YAxis stroke="#ffffff30" fontSize={11} tickLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#121317',
                    borderColor: '#ffffff15',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#C8834A"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#copperAreaGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Lifecycle (1 Col) */}
        <div className="p-6 rounded-xl bg-[#0e0f13] border border-white/[0.08] space-y-4 flex flex-col justify-between shadow-xl">
          <div>
            <h3 className="text-sm font-bold font-headline uppercase tracking-wider text-white">
              Order Lifecycle Breakdown
            </h3>
            <p className="text-xs text-white/40">Real-time status allocation</p>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="status"
                >
                  {statusDistribution.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#121317',
                    borderColor: '#ffffff15',
                    borderRadius: '8px',
                    fontSize: '11px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] pt-3 border-t border-white/[0.08]">
            {statusDistribution.map((item: any, idx: number) => (
              <div key={item.status} className="flex items-center gap-1.5 text-white/70">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                />
                <span className="font-mono">{item.status}: {item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tables Row: Recent Orders & Low Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders (2 Cols) */}
        <div className="lg:col-span-2 p-6 rounded-xl bg-[#0e0f13] border border-white/[0.08] space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <h3 className="text-sm font-bold font-headline uppercase tracking-wider text-white">
              Recent Customer Orders
            </h3>
            <Link to="/admin/orders" className="text-xs text-copper hover:underline flex items-center gap-1 font-mono">
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-white/40 border-b border-white/5 font-mono">
                  <th className="pb-3 font-medium">ORDER ID</th>
                  <th className="pb-3 font-medium">CUSTOMER</th>
                  <th className="pb-3 font-medium">AMOUNT</th>
                  <th className="pb-3 font-medium">STATUS</th>
                  <th className="pb-3 font-medium text-right">DATE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentOrders.map((o: any) => (
                  <tr key={o.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 font-mono font-bold text-copper">
                      {o.trackingNumber || o.id.slice(0, 8)}
                    </td>
                    <td className="py-3 text-white font-medium">{o.customerName}</td>
                    <td className="py-3 font-mono font-semibold text-white">${o.totalAmount.toFixed(2)}</td>
                    <td className="py-3">
                      <OrderStatusBadge status={o.status} />
                    </td>
                    <td className="py-3 text-white/50 text-right font-mono">
                      {new Date(o.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts (1 Col) */}
        <div className="p-6 rounded-xl bg-[#0e0f13] border border-white/[0.08] space-y-4 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <h3 className="text-sm font-bold font-headline uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>Restock Priorities</span>
              </h3>
              <Link to="/admin/inventory" className="text-xs text-copper hover:underline font-mono">
                Inventory
              </Link>
            </div>

            <div className="space-y-3 pt-3">
              {lowStockProducts.map((p: any) => (
                <div
                  key={p.id}
                  className="p-3 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between gap-3"
                >
                  <div className="truncate">
                    <h5 className="text-xs font-bold text-white truncate font-headline">{p.name}</h5>
                    <span className="text-[10px] text-white/40 font-mono">SKU: {p.sku}</span>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                    p.stock === 0 ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
                  }`}>
                    {p.stock === 0 ? 'OUT OF STOCK' : `${p.stock} UNITS`}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Link
            to="/admin/inventory"
            className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-wider rounded-lg text-center border border-white/10 transition-colors block mt-4"
          >
            OPEN INVENTORY MONITOR
          </Link>
        </div>
      </div>
    </div>
  );
};
