import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/slices/authSlice';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Plus, Edit, Trash2, X, Package, ShoppingBag, Users, TrendingUp, Upload, Check } from 'lucide-react';

const CATEGORIES = ['Silk', 'Cotton', 'Designer', 'Bridal', 'Daily Wear', 'Kanjivaram', 'Chanderi', 'Banarasi'];
const COLORS = ['Red', 'Maroon', 'Gold', 'Blue', 'Green', 'Pink', 'Purple', 'Black', 'White', 'Orange', 'Yellow', 'Ivory'];

const emptyProduct = {
  name: '', description: '', price: '', originalPrice: '', discount: '', category: 'Silk',
  fabric: '', colors: [], images: [''], stock: '', isFeatured: false, isBestSeller: false, isNewArrival: true, tags: '',
};

export default function AdminDashboard() {
  const user = useSelector(selectUser);
  const headers = { Authorization: `Bearer ${user?.token}` };

  const [tab, setTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyProduct);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('/api/products?limit=100');
      setProducts(data.products);
    } catch (e) { toast.error('Failed to load products'); }
  };

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get('/api/orders', { headers });
      setOrders(data);
    } catch (e) { console.error(e); }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`/api/orders/${orderId}/status`, { orderStatus: newStatus }, { headers });
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, orderStatus: newStatus } : o));
      toast.success('Order status updated');
    } catch (e) {
      toast.error('Failed to update status');
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchProducts(), fetchOrders()]).finally(() => setLoading(false));
  }, []);

  const openCreate = () => { setEditing(null); setForm(emptyProduct); setModalOpen(true); };
  const openEdit = (p) => {
    setEditing(p._id);
    setForm({ ...p, tags: p.tags?.join(', ') || '', images: p.images?.length ? p.images : [''] });
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        originalPrice: Number(form.originalPrice) || undefined,
        discount: Number(form.discount) || 0,
        stock: Number(form.stock),
        images: form.images.filter(Boolean),
        tags: typeof form.tags === 'string' ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : form.tags,
      };
      if (editing) {
        await axios.put(`/api/products/${editing}`, payload, { headers });
        toast.success('Product updated!');
      } else {
        await axios.post('/api/products', payload, { headers });
        toast.success('Product created!');
      }
      setModalOpen(false);
      await fetchProducts();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/products/${id}`, { headers });
      toast.success('Product deleted');
      setConfirmDelete(null);
      await fetchProducts();
    } catch (e) {
      toast.error('Delete failed');
    }
  };

  const toggleColor = (c) => {
    setForm(f => ({ ...f, colors: f.colors.includes(c) ? f.colors.filter(x => x !== c) : [...f.colors, c] }));
  };

  const stats = [
    { label: 'Total Products', value: products.length, icon: <Package size={22} />, color: '#6D3B3B' },
    { label: 'Total Orders', value: orders.length, icon: <ShoppingBag size={22} />, color: '#C8A96A' },
    { label: 'Revenue', value: `₹${orders.filter(o => o.paymentStatus === 'paid').reduce((s, o) => s + o.totalAmount, 0).toLocaleString('en-IN')}`, icon: <TrendingUp size={22} />, color: '#25D366' },
    { label: 'In Stock', value: products.filter(p => p.stock > 0).length, icon: <Check size={22} />, color: '#8B5050' },
  ];

  const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #EAD7D7', fontFamily: 'Poppins', fontSize: '0.85rem', outline: 'none', color: '#2B1B1B', background: 'white' };

  return (
    <div style={{ background: '#FAF7F5', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #2B1B1B, #6D3B3B)' }} className="py-8">
        <div className="container-custom">
          <h1 style={{ fontFamily: "'Playfair Display', serif", color: '#FAF7F5', fontSize: '2rem' }}>Admin Dashboard</h1>
          <p style={{ color: '#C8A96A', fontFamily: 'Poppins', fontSize: '0.875rem', marginTop: '4px' }}>Sri Kanakadhara Designer Studio</p>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4"
              style={{ border: '1px solid #EAD7D7' }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${s.color}22`, color: s.color }}>
                {s.icon}
              </div>
              <div>
                <p style={{ fontFamily: "'Playfair Display', serif", color: '#2B1B1B', fontSize: '1.4rem', fontWeight: '700' }}>{s.value}</p>
                <p style={{ color: '#9B7878', fontFamily: 'Poppins', fontSize: '0.75rem' }}>{s.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {['products', 'orders'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="px-5 py-2.5 rounded-full text-sm font-medium capitalize transition-all"
              style={{
                background: tab === t ? '#6D3B3B' : 'white',
                color: tab === t ? 'white' : '#2B1B1B',
                fontFamily: 'Poppins',
                border: '1px solid #EAD7D7',
              }}
            >
              {t === 'products' ? `Products (${products.length})` : `Orders (${orders.length})`}
            </button>
          ))}
        </div>

        {/* Products Tab */}
        {tab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#2B1B1B', fontSize: '1.5rem' }}>Products</h2>
              <button
                onClick={openCreate}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-sm font-medium"
                style={{ background: '#6D3B3B', fontFamily: 'Poppins' }}
              >
                <Plus size={16} /> Add Product
              </button>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => <div key={i} className="rounded-2xl animate-pulse" style={{ background: '#EAD7D7', height: '200px' }} />)}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map(p => (
                  <motion.div
                    key={p._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm"
                    style={{ border: '1px solid #EAD7D7' }}
                  >
                    <div className="aspect-[4/3] overflow-hidden">
                      <img src={p.images?.[0]} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-3">
                      <p style={{ fontFamily: "'Playfair Display', serif", color: '#2B1B1B', fontSize: '0.9rem', lineHeight: 1.3 }} className="line-clamp-2">{p.name}</p>
                      <p style={{ color: '#6D3B3B', fontFamily: 'Poppins', fontWeight: '600', marginTop: '4px' }}>₹{p.price.toLocaleString('en-IN')}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span style={{ background: p.stock > 0 ? '#EAD7D7' : '#fee2e2', color: p.stock > 0 ? '#6D3B3B' : '#ef4444', fontFamily: 'Poppins', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '999px' }}>
                          {p.stock > 0 ? `Stock: ${p.stock}` : 'Out of Stock'}
                        </span>
                        <div className="flex gap-2">
                          <button onClick={() => openEdit(p)} style={{ color: '#C8A96A' }}><Edit size={15} /></button>
                          <button onClick={() => setConfirmDelete(p._id)} style={{ color: '#ef4444' }}><Trash2 size={15} /></button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {tab === 'orders' && (
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#2B1B1B', fontSize: '1.5rem', marginBottom: '1rem' }}>Orders</h2>
            {orders.length === 0 ? (
              <p style={{ color: '#9B7878', fontFamily: 'Poppins' }}>No orders yet</p>
            ) : (
              <div className="space-y-3">
                {orders.map(o => (
                  <div key={o._id} className="bg-white rounded-2xl p-4 shadow-sm flex flex-wrap gap-4 items-center justify-between" style={{ border: '1px solid #EAD7D7' }}>
                    <div>
                      <p style={{ fontFamily: 'Poppins', fontSize: '0.75rem', color: '#9B7878' }}>#{o._id.slice(-8).toUpperCase()}</p>
                      <p style={{ fontFamily: "'Playfair Display', serif", color: '#2B1B1B' }}>{o.user?.name || 'Customer'}</p>
                      <p style={{ color: '#9B7878', fontFamily: 'Poppins', fontSize: '0.8rem' }}>{new Date(o.createdAt).toLocaleDateString('en-IN')}</p>
                    </div>
                    <div>
                      <p style={{ fontFamily: 'Poppins', fontWeight: '600', color: '#6D3B3B' }}>₹{o.totalAmount?.toLocaleString('en-IN')}</p>
                      <p style={{ fontFamily: 'Poppins', fontSize: '0.8rem', color: '#9B7878' }}>{o.items?.length} item(s)</p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span style={{
                        padding: '4px 12px', borderRadius: '999px', fontFamily: 'Poppins', fontSize: '0.75rem',
                        background: o.paymentStatus === 'paid' ? '#dcfce7' : '#EAD7D7',
                        color: o.paymentStatus === 'paid' ? '#16a34a' : '#9B7878',
                      }}>
                        {o.paymentStatus}
                      </span>
                      {/* Status Update Dropdown */}
                      <select
                        value={o.orderStatus}
                        onChange={e => updateOrderStatus(o._id, e.target.value)}
                        className="text-xs rounded-full px-3 py-1 outline-none cursor-pointer border"
                        style={{
                          fontFamily: 'Poppins',
                          borderColor: '#EAD7D7',
                          background: {
                            processing: '#FBF5E6', confirmed: '#EFF6FF',
                            shipped: '#F5F3FF', delivered: '#F0FDF4', cancelled: '#FEF2F2'
                          }[o.orderStatus] || '#EAD7D7',
                          color: {
                            processing: '#C8A96A', confirmed: '#2563eb',
                            shipped: '#7c3aed', delivered: '#16a34a', cancelled: '#dc2626'
                          }[o.orderStatus] || '#6D3B3B',
                          fontWeight: '600',
                        }}
                      >
                        {['processing', 'confirmed', 'shipped', 'delivered', 'cancelled'].map(s => (
                          <option key={s} value={s} style={{ background: 'white', color: '#2B1B1B' }}>
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Product Modal */}
      <AnimatePresence>
        {modalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModalOpen(false)} className="fixed inset-0 z-50" style={{ background: 'rgba(43,27,27,0.6)', backdropFilter: 'blur(4px)' }} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-4 md:inset-10 z-50 bg-white rounded-3xl overflow-y-auto shadow-2xl"
              style={{ border: '1px solid #EAD7D7' }}
            >
              <div className="p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', color: '#2B1B1B' }}>
                    {editing ? 'Edit Product' : 'Add New Product'}
                  </h2>
                  <button onClick={() => setModalOpen(false)} style={{ color: '#9B7878' }}><X size={22} /></button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label style={{ color: '#9B7878', fontSize: '0.75rem', fontFamily: 'Poppins' }}>PRODUCT NAME *</label>
                      <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={{ ...inputStyle, marginTop: '6px' }} placeholder="Saree name" />
                    </div>
                    <div>
                      <label style={{ color: '#9B7878', fontSize: '0.75rem', fontFamily: 'Poppins' }}>DESCRIPTION *</label>
                      <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} style={{ ...inputStyle, marginTop: '6px', resize: 'vertical' }} placeholder="Describe the saree" />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label style={{ color: '#9B7878', fontSize: '0.75rem', fontFamily: 'Poppins' }}>PRICE *</label>
                        <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} style={{ ...inputStyle, marginTop: '6px' }} placeholder="₹" />
                      </div>
                      <div>
                        <label style={{ color: '#9B7878', fontSize: '0.75rem', fontFamily: 'Poppins' }}>MRP</label>
                        <input type="number" value={form.originalPrice} onChange={e => setForm(f => ({ ...f, originalPrice: e.target.value }))} style={{ ...inputStyle, marginTop: '6px' }} placeholder="₹" />
                      </div>
                      <div>
                        <label style={{ color: '#9B7878', fontSize: '0.75rem', fontFamily: 'Poppins' }}>STOCK *</label>
                        <input type="number" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} style={{ ...inputStyle, marginTop: '6px' }} placeholder="Qty" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label style={{ color: '#9B7878', fontSize: '0.75rem', fontFamily: 'Poppins' }}>CATEGORY</label>
                        <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={{ ...inputStyle, marginTop: '6px' }}>
                          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={{ color: '#9B7878', fontSize: '0.75rem', fontFamily: 'Poppins' }}>FABRIC</label>
                        <input value={form.fabric} onChange={e => setForm(f => ({ ...f, fabric: e.target.value }))} style={{ ...inputStyle, marginTop: '6px' }} placeholder="e.g. Pure Silk" />
                      </div>
                    </div>
                    <div>
                      <label style={{ color: '#9B7878', fontSize: '0.75rem', fontFamily: 'Poppins' }}>TAGS (comma separated)</label>
                      <input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} style={{ ...inputStyle, marginTop: '6px' }} placeholder="silk, wedding, traditional" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label style={{ color: '#9B7878', fontSize: '0.75rem', fontFamily: 'Poppins' }}>IMAGE URLs</label>
                      {form.images.map((img, idx) => (
                        <div key={idx} className="flex gap-2 mt-2">
                          <input value={img} onChange={e => {
                            const imgs = [...form.images];
                            imgs[idx] = e.target.value;
                            setForm(f => ({ ...f, images: imgs }));
                          }} style={inputStyle} placeholder={`Image ${idx + 1} URL`} />
                          {idx > 0 && <button onClick={() => setForm(f => ({ ...f, images: f.images.filter((_, i) => i !== idx) }))} style={{ color: '#ef4444' }}><X size={16} /></button>}
                        </div>
                      ))}
                      <button onClick={() => setForm(f => ({ ...f, images: [...f.images, ''] }))} className="mt-2 text-sm flex items-center gap-1" style={{ color: '#6D3B3B', fontFamily: 'Poppins' }}>
                        <Plus size={14} /> Add Image
                      </button>
                    </div>

                    <div>
                      <label style={{ color: '#9B7878', fontSize: '0.75rem', fontFamily: 'Poppins' }}>COLORS</label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {COLORS.map(c => (
                          <button
                            key={c} type="button"
                            onClick={() => toggleColor(c)}
                            className="px-3 py-1 rounded-full text-xs border transition-all"
                            style={{
                              fontFamily: 'Poppins',
                              borderColor: form.colors.includes(c) ? '#6D3B3B' : '#EAD7D7',
                              background: form.colors.includes(c) ? '#6D3B3B' : 'white',
                              color: form.colors.includes(c) ? 'white' : '#2B1B1B',
                            }}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label style={{ color: '#9B7878', fontSize: '0.75rem', fontFamily: 'Poppins', marginBottom: '0.75rem', display: 'block' }}>FLAGS</label>
                      <div className="space-y-2">
                        {[
                          { key: 'isFeatured', label: 'Featured' },
                          { key: 'isBestSeller', label: 'Best Seller' },
                          { key: 'isNewArrival', label: 'New Arrival' },
                        ].map(({ key, label }) => (
                          <label key={key} className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" checked={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.checked }))}
                              style={{ accentColor: '#6D3B3B', width: '16px', height: '16px' }} />
                            <span style={{ fontFamily: 'Poppins', fontSize: '0.875rem', color: '#2B1B1B' }}>{label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-8 pt-6 border-t" style={{ borderColor: '#EAD7D7' }}>
                  <button onClick={() => setModalOpen(false)} className="flex-1 py-3 rounded-xl border text-sm font-medium" style={{ borderColor: '#EAD7D7', color: '#9B7878', fontFamily: 'Poppins' }}>
                    Cancel
                  </button>
                  <button onClick={handleSave} disabled={saving} className="flex-1 py-3 rounded-xl text-white text-sm font-semibold disabled:opacity-70" style={{ background: 'linear-gradient(135deg, #6D3B3B, #8B5050)', fontFamily: 'Poppins' }}>
                    {saving ? 'Saving...' : (editing ? 'Update Product' : 'Create Product')}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Confirm */}
      <AnimatePresence>
        {confirmDelete && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setConfirmDelete(null)} className="fixed inset-0 z-50" style={{ background: 'rgba(43,27,27,0.5)' }} />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-80 bg-white rounded-2xl p-6 shadow-2xl"
              style={{ border: '1px solid #EAD7D7' }}
            >
              <h3 style={{ fontFamily: "'Playfair Display', serif", color: '#2B1B1B', fontSize: '1.2rem', marginBottom: '0.5rem' }}>Delete Product?</h3>
              <p style={{ color: '#9B7878', fontFamily: 'Poppins', fontSize: '0.875rem', marginBottom: '1.5rem' }}>This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmDelete(null)} className="flex-1 py-2.5 rounded-xl border text-sm" style={{ borderColor: '#EAD7D7', fontFamily: 'Poppins' }}>Cancel</button>
                <button onClick={() => handleDelete(confirmDelete)} className="flex-1 py-2.5 rounded-xl text-white text-sm" style={{ background: '#ef4444', fontFamily: 'Poppins' }}>Delete</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
