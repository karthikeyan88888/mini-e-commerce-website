import React, { useEffect, useState } from 'react';
import { Layers, AlertTriangle, CheckCircle, Search, Save, Check, RefreshCw } from 'lucide-react';
import { Product } from '../../types';
import { StockBadge } from '../../components/StatusBadge';
import { api } from '../../api/client';

export const AdminInventoryPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [metrics, setMetrics] = useState<any>({});
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingStock, setEditingStock] = useState<Record<string, number>>({});
  const [savedSuccessId, setSavedSuccessId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchInventory = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/inventory', {
        params: {
          status: statusFilter !== 'all' ? statusFilter : undefined,
          search: searchQuery.trim() || undefined,
        },
      });
      setProducts(res.data.products || []);
      setMetrics(res.data.metrics || {});
    } catch (err) {
      console.error('Failed to load inventory', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [statusFilter]);

  const handleStockChange = (productId: string, val: number) => {
    setEditingStock((prev) => ({
      ...prev,
      [productId]: Math.max(0, val),
    }));
  };

  const handleSaveStock = async (product: Product) => {
    const newStock = editingStock[product.id] ?? product.stock;
    try {
      await api.patch(`/inventory/${product.id}/stock`, { stock: newStock });
      setSavedSuccessId(product.id);
      fetchInventory();
      setTimeout(() => setSavedSuccessId(null), 2500);
    } catch (err) {
      console.error('Failed to update stock', err);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono tracking-widest text-copper uppercase font-bold">
            OPERATIONAL LOGISTICS
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-headline text-white mt-1">
            INVENTORY TELEMETRY
          </h1>
        </div>

        <button
          onClick={fetchInventory}
          className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white font-semibold text-xs tracking-wider uppercase rounded-xl border border-white/10 flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5 text-copper" />
          <span>REFRESH STOCK DATA</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#0e0f13] border border-white/10">
          <span className="text-[10px] text-white/40 font-mono uppercase block">Total SKUs</span>
          <span className="text-2xl font-extrabold font-headline text-white mt-1 block">
            {metrics.totalProducts || 0}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0e0f13] border border-white/10">
          <span className="text-[10px] text-emerald-400 font-mono uppercase block">Fully In Stock (&gt;5)</span>
          <span className="text-2xl font-extrabold font-headline text-emerald-400 mt-1 block">
            {metrics.inStockCount || 0}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-800/40">
          <span className="text-[10px] text-amber-400 font-mono uppercase block">Low Stock Alert (&le;5)</span>
          <span className="text-2xl font-extrabold font-headline text-amber-300 mt-1 block">
            {metrics.lowStockCount || 0}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-red-950/20 border border-red-800/40">
          <span className="text-[10px] text-red-400 font-mono uppercase block">Out of Stock (0)</span>
          <span className="text-2xl font-extrabold font-headline text-red-400 mt-1 block">
            {metrics.outOfStockCount || 0}
          </span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="p-4 rounded-2xl bg-[#0e0f13] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchInventory();
          }}
          className="relative flex-1 max-w-md"
        >
          <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search SKU or Model..."
            className="w-full pl-10 pr-20 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-copper"
          />
        </form>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { label: 'All Inventory', value: 'all' },
            { label: 'In Stock', value: 'in' },
            { label: 'Low Stock (<= 5)', value: 'low' },
            { label: 'Out of Stock', value: 'out' },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                statusFilter === tab.value
                  ? 'bg-copper text-black'
                  : 'bg-white/5 hover:bg-white/10 text-white/70'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="p-6 rounded-2xl bg-[#0e0f13] border border-white/10 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-white/40 border-b border-white/10 font-mono">
                <th className="pb-3.5 font-medium">HARDWARE SYSTEM</th>
                <th className="pb-3.5 font-medium">SKU</th>
                <th className="pb-3.5 font-medium">CATEGORY</th>
                <th className="pb-3.5 font-medium">STATUS</th>
                <th className="pb-3.5 font-medium">LIVE STOCK</th>
                <th className="pb-3.5 font-medium text-right">QUICK ADJUST</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {products.map((p) => {
                const currentVal = editingStock[p.id] ?? p.stock;
                const isChanged = currentVal !== p.stock;
                const isSaved = savedSuccessId === p.id;

                return (
                  <tr key={p.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 pr-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="w-10 h-10 rounded-lg object-cover bg-black/40 border border-white/10"
                        />
                        <span className="font-bold text-white font-headline max-w-[220px] truncate block">
                          {p.name}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 font-mono text-copper font-semibold">{p.sku}</td>

                    <td className="py-3.5 text-white/70 font-mono text-[11px] uppercase">{p.category}</td>

                    <td className="py-3.5">
                      <StockBadge stock={p.stock} />
                    </td>

                    <td className="py-3.5 font-mono font-bold text-white">{p.stock} units</td>

                    <td className="py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <input
                          type="number"
                          min="0"
                          value={currentVal}
                          onChange={(e) => handleStockChange(p.id, parseInt(e.target.value) || 0)}
                          className="w-16 px-2 py-1 bg-black/60 border border-white/20 rounded text-center text-xs font-mono text-white focus:outline-none focus:border-copper"
                        />

                        <button
                          onClick={() => handleSaveStock(p)}
                          disabled={!isChanged && !isSaved}
                          className={`px-3 py-1 rounded text-xs font-bold font-mono transition-all flex items-center gap-1 ${
                            isSaved
                              ? 'bg-emerald-600 text-white'
                              : isChanged
                              ? 'bg-copper hover:bg-copper-hover text-black shadow-md shadow-copper/20'
                              : 'bg-white/5 text-white/30 cursor-not-allowed'
                          }`}
                        >
                          {isSaved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                          <span>{isSaved ? 'SAVED' : 'UPDATE'}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
