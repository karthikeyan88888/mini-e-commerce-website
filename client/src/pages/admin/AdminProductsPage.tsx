import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Search, X, Check, AlertCircle, Box, Shield } from 'lucide-react';
import { Product } from '../../types';
import { StockBadge } from '../../components/StatusBadge';
import { api } from '../../api/client';

export const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [categories, setCategories] = useState<string[]>(['All', 'HEADPHONES', 'IEM', 'AMPLIFICATION', 'ACCESSORIES', 'ACOUSTICS']);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'HEADPHONES',
    price: 299,
    imageUrl: '',
    stock: 10,
    sku: '',
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE',
    rating: 4.9,
  });

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/products', {
        params: {
          includeInactive: 'true',
          search: searchQuery.trim() || undefined,
          category: categoryFilter !== 'All' ? categoryFilter : undefined,
        },
      });
      setProducts(res.data.products || []);
      if (res.data.categories && res.data.categories.length > 0) {
        setCategories(['All', ...Array.from(new Set(res.data.categories as string[]))]);
      }
    } catch (err) {
      console.error('Failed to load products', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [categoryFilter]);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      category: 'HEADPHONES',
      price: 299,
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      stock: 15,
      sku: `NXR-${Math.floor(100 + Math.random() * 900)}`,
      status: 'ACTIVE',
      rating: 4.9,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      description: p.description,
      category: p.category,
      price: p.price,
      imageUrl: p.imageUrl,
      stock: p.stock,
      sku: p.sku,
      status: p.status,
      rating: p.rating,
    });
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, formData);
        setFeedbackMessage({ type: 'success', text: `Product "${formData.name}" updated successfully` });
      } else {
        await api.post('/products', formData);
        setFeedbackMessage({ type: 'success', text: `Product "${formData.name}" added to catalogue` });
      }
      setIsModalOpen(false);
      fetchProducts();
      setTimeout(() => setFeedbackMessage(null), 4000);
    } catch (err: any) {
      setFeedbackMessage({
        type: 'error',
        text: err.response?.data?.error || 'Failed to save product.',
      });
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const res = await api.delete(`/products/${id}`);
      setFeedbackMessage({
        type: 'success',
        text: res.data.message || 'Product action executed',
      });
      setDeleteConfirmId(null);
      fetchProducts();
      setTimeout(() => setFeedbackMessage(null), 4000);
    } catch (err: any) {
      setFeedbackMessage({
        type: 'error',
        text: err.response?.data?.error || 'Failed to delete product',
      });
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono tracking-widest text-copper uppercase font-bold">
            MERCHANT CATALOGUE
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-headline text-white mt-1">
            PRODUCT MANAGEMENT
          </h1>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 bg-copper hover:bg-copper-hover text-black font-extrabold text-xs tracking-wider uppercase rounded-xl flex items-center gap-1.5 shadow-md shadow-copper/20 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>ADD NEW HARDWARE</span>
        </button>
      </div>

      {/* Feedback Alert */}
      {feedbackMessage && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2.5 animate-fade-in ${
            feedbackMessage.type === 'success'
              ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
              : 'bg-red-950/80 text-red-300 border border-red-800'
          }`}
        >
          {feedbackMessage.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{feedbackMessage.text}</span>
        </div>
      )}

      {/* Filter and Search Controls */}
      <div className="p-4 rounded-2xl bg-[#0d0e12] border border-white/[0.08] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        {/* Search */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchProducts();
          }}
          className="relative flex-1 max-w-md"
        >
          <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by SKU, title, or category..."
            className="w-full pl-10 pr-20 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-copper"
          />
          <button
            type="submit"
            className="absolute right-1 top-1 bottom-1 px-3 bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold rounded-lg"
          >
            FILTER
          </button>
        </form>

        {/* Category Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                categoryFilter.toUpperCase() === cat.toUpperCase()
                  ? 'bg-copper text-black'
                  : 'bg-white/[0.03] hover:bg-white/[0.08] text-white/70'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="p-6 rounded-2xl bg-[#0d0e12] border border-white/[0.08] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-white/40 border-b border-white/10 font-mono">
                <th className="pb-3.5 font-medium">PRODUCT</th>
                <th className="pb-3.5 font-medium">SKU</th>
                <th className="pb-3.5 font-medium">CATEGORY</th>
                <th className="pb-3.5 font-medium">PRICE</th>
                <th className="pb-3.5 font-medium">INVENTORY</th>
                <th className="pb-3.5 font-medium">STATUS</th>
                <th className="pb-3.5 font-medium text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-white/5 transition-colors">
                  {/* Image & Title */}
                  <td className="py-3.5 pr-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-10 h-10 rounded-lg object-cover bg-black/40 border border-white/10 flex-shrink-0"
                      />
                      <div className="max-w-[220px]">
                        <span className="text-xs font-bold text-white block truncate font-headline">
                          {product.name}
                        </span>
                        <span className="text-[10px] text-white/40 block truncate">
                          {product.description}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 font-mono text-copper font-semibold">{product.sku}</td>

                  <td className="py-3.5 text-white/80">
                    <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] uppercase font-mono">
                      {product.category}
                    </span>
                  </td>

                  <td className="py-3.5 font-mono font-bold text-white">${product.price.toFixed(2)}</td>

                  <td className="py-3.5">
                    <StockBadge stock={product.stock} />
                  </td>

                  <td className="py-3.5">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        product.status === 'ACTIVE'
                          ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                          : 'bg-gray-800 text-gray-400 border border-gray-700'
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEditModal(product)}
                        className="p-1.5 text-white/60 hover:text-copper bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                        title="Edit Product"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setDeleteConfirmId(product.id)}
                        className="p-1.5 text-white/60 hover:text-red-400 bg-white/5 hover:bg-red-950/30 rounded-lg transition-colors"
                        title="Remove / Safe Deactivate"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0e0f13] border border-white/10 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <h2 className="text-lg font-bold font-headline text-white uppercase tracking-wider">
                {editingProduct ? 'EDIT HARDWARE SYSTEM' : 'ADD NEW CATALOGUE SYSTEM'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-white/60 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-white/70 uppercase tracking-wider mb-1.5">
                  Hardware Model Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. NEXORO Studio Reference V2"
                  className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white focus:outline-none focus:border-copper"
                />
              </div>

              <div>
                <label className="block font-semibold text-white/70 uppercase tracking-wider mb-1.5">
                  Acoustic & Structural Description
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed engineering summary..."
                  className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white focus:outline-none focus:border-copper resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-white/70 uppercase tracking-wider mb-1.5">
                    Category Division
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white focus:outline-none focus:border-copper"
                  >
                    <option value="HEADPHONES" className="bg-[#121317]">HEADPHONES</option>
                    <option value="IEM" className="bg-[#121317]">IEM</option>
                    <option value="AMPLIFICATION" className="bg-[#121317]">AMPLIFICATION</option>
                    <option value="ACCESSORIES" className="bg-[#121317]">ACCESSORIES</option>
                    <option value="ACOUSTICS" className="bg-[#121317]">ACOUSTICS</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-white/70 uppercase tracking-wider mb-1.5">
                    SKU Identifier
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="NXR-XXX-01"
                    className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white font-mono focus:outline-none focus:border-copper"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-white/70 uppercase tracking-wider mb-1.5">
                    Price ($ USD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white font-mono focus:outline-none focus:border-copper"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-white/70 uppercase tracking-wider mb-1.5">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white font-mono focus:outline-none focus:border-copper"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-white/70 uppercase tracking-wider mb-1.5">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white focus:outline-none focus:border-copper"
                  >
                    <option value="ACTIVE" className="bg-[#121317]">ACTIVE</option>
                    <option value="INACTIVE" className="bg-[#121317]">INACTIVE</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-white/70 uppercase tracking-wider mb-1.5">
                  Product Photography Image URL
                </label>
                <input
                  type="url"
                  required
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white focus:outline-none focus:border-copper"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-white/60 hover:text-white font-semibold"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-copper hover:bg-copper-hover text-black font-extrabold uppercase tracking-wider rounded-xl shadow-lg shadow-copper/20"
                >
                  {editingProduct ? 'UPDATE PRODUCT' : 'CREATE PRODUCT'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Safe Deletion Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0e0f13] border border-red-500/30 rounded-2xl max-w-md p-6 space-y-4">
            <h3 className="text-base font-bold font-headline text-white">Confirm Safe Deletion</h3>
            <p className="text-xs text-white/60 leading-relaxed">
              If this product is associated with previous customer orders, NEXORO will safely mark it as INACTIVE to protect historical receipts.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-xs text-white/60 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteProduct(deleteConfirmId)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg shadow-md"
              >
                Confirm Action
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
