import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchProducts } from '../redux/slices/productSlice';
import ProductCard from '../components/ProductCard';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';

const COLORS = ['Red', 'Maroon', 'Gold', 'Blue', 'Green', 'Pink', 'Purple', 'Black', 'White', 'Orange', 'Yellow', 'Ivory'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'name_asc', label: 'Name: A → Z' },
  { value: 'name_desc', label: 'Name: Z → A' },
];

export default function NewArrivals() {
  const dispatch = useDispatch();
  const { items: products, count, loading, pages, page } = useSelector(s => s.products);
  const location = useLocation();
  const querySearch = new URLSearchParams(location.search).get('search') || '';

  const [filters, setFilters] = useState({
    minPrice: '', maxPrice: '', colors: [], inStock: false,
    sort: 'newest', search: querySearch, page: 1,
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 50000]);

  useEffect(() => {
    setFilters(f => ({ ...f, search: querySearch, page: 1 }));
  }, [querySearch]);

  useEffect(() => {
    const params = {
      ...(filters.minPrice && { minPrice: filters.minPrice }),
      ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
      ...(filters.colors.length && { colors: filters.colors.join(',') }),
      ...(filters.inStock && { inStock: 'true' }),
      ...(filters.search && { search: filters.search }),
      sort: filters.sort,
      page: filters.page,
      limit: 12,
    };
    dispatch(fetchProducts(params));
  }, [filters, dispatch]);

  const toggleColor = (color) => {
    setFilters(f => ({
      ...f,
      colors: f.colors.includes(color) ? f.colors.filter(c => c !== color) : [...f.colors, color],
      page: 1,
    }));
  };

  const clearFilters = () => {
    setFilters({ minPrice: '', maxPrice: '', colors: [], inStock: false, sort: 'newest', search: '', page: 1 });
    setPriceRange([0, 50000]);
  };

  const hasFilters = filters.colors.length > 0 || filters.inStock || filters.minPrice || filters.maxPrice;

  return (
    <div style={{ background: '#FAF7F5', minHeight: '100vh' }}>
      {/* Page Header */}
      <section style={{ background: 'linear-gradient(135deg, #2B1B1B 0%, #4a2525 100%)' }} className="py-16 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p style={{ color: '#C8A96A', fontSize: '0.8rem', letterSpacing: '0.3em', textTransform: 'uppercase', fontFamily: 'Poppins' }}>Fresh from the Loom</p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", color: '#FAF7F5', fontSize: '3rem', marginTop: '0.5rem' }}>New Arrivals</h1>
          <div style={{ width: '60px', height: '1px', background: 'linear-gradient(90deg, transparent, #C8A96A, transparent)', margin: '1rem auto' }} />
          <p style={{ color: 'rgba(250,247,245,0.6)', fontFamily: 'Poppins', fontSize: '0.95rem' }}>{count} sarees available</p>
        </motion.div>
      </section>

      <div className="container-custom py-10">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full border font-medium text-sm transition-colors"
            style={{ borderColor: '#6D3B3B', color: '#6D3B3B', fontFamily: 'Poppins', background: hasFilters ? '#EAD7D7' : 'white' }}
          >
            <SlidersHorizontal size={16} /> Filters {hasFilters && `(${filters.colors.length + (filters.inStock ? 1 : 0)})`}
          </button>

          <div className="flex items-center gap-3">
            {hasFilters && (
              <button onClick={clearFilters} className="flex items-center gap-1 text-sm" style={{ color: '#9B7878', fontFamily: 'Poppins' }}>
                <X size={14} /> Clear all
              </button>
            )}
            <div className="relative">
              <select
                value={filters.sort}
                onChange={e => setFilters(f => ({ ...f, sort: e.target.value, page: 1 }))}
                className="appearance-none pl-4 pr-10 py-2.5 rounded-full border text-sm outline-none cursor-pointer"
                style={{ borderColor: '#EAD7D7', fontFamily: 'Poppins', color: '#2B1B1B', background: 'white' }}
              >
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#9B7878' }} />
            </div>
          </div>
        </div>

        {/* Filter Chips */}
        {filters.colors.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-6">
            {filters.colors.map(c => (
              <button
                key={c}
                onClick={() => toggleColor(c)}
                className="flex items-center gap-1 px-3 py-1 rounded-full text-sm"
                style={{ background: '#EAD7D7', color: '#6D3B3B', fontFamily: 'Poppins' }}
              >
                {c} <X size={12} />
              </button>
            ))}
          </div>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden animate-pulse" style={{ background: '#EAD7D7', aspectRatio: '3/4' }} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p style={{ fontFamily: "'Playfair Display', serif", color: '#9B7878', fontSize: '1.5rem' }}>No sarees found</p>
            <p style={{ color: '#9B7878', fontFamily: 'Poppins', marginTop: '0.5rem', fontSize: '0.9rem' }}>Try adjusting your filters</p>
            <button onClick={clearFilters} className="mt-4 px-6 py-2.5 rounded-full text-white" style={{ background: '#6D3B3B' }}>
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex justify-center gap-2 mt-12">
            {[...Array(pages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setFilters(f => ({ ...f, page: i + 1 }))}
                className="w-10 h-10 rounded-full text-sm font-medium transition-all"
                style={{
                  background: filters.page === i + 1 ? '#6D3B3B' : 'white',
                  color: filters.page === i + 1 ? 'white' : '#6D3B3B',
                  border: '1px solid #6D3B3B',
                  fontFamily: 'Poppins',
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Filter Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-50"
              style={{ background: 'rgba(43,27,27,0.5)', backdropFilter: 'blur(4px)' }}
            />
            <motion.aside
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30 }}
              className="fixed left-0 top-0 h-full z-50 w-80 overflow-y-auto p-6 bg-white"
              style={{ borderRight: '1px solid #EAD7D7' }}
            >
              <div className="flex items-center justify-between mb-8">
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', color: '#2B1B1B' }}>Filters</h3>
                <button onClick={() => setSidebarOpen(false)} style={{ color: '#9B7878' }}><X size={20} /></button>
              </div>

              {/* In Stock */}
              <div className="mb-8">
                <h4 style={{ fontFamily: 'Poppins', fontWeight: '600', color: '#2B1B1B', marginBottom: '1rem', fontSize: '0.9rem' }}>Availability</h4>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.inStock}
                    onChange={e => setFilters(f => ({ ...f, inStock: e.target.checked, page: 1 }))}
                    style={{ accentColor: '#6D3B3B', width: '16px', height: '16px' }}
                  />
                  <span style={{ fontFamily: 'Poppins', color: '#2B1B1B', fontSize: '0.875rem' }}>In Stock Only</span>
                </label>
              </div>

              {/* Price Range */}
              <div className="mb-8">
                <h4 style={{ fontFamily: 'Poppins', fontWeight: '600', color: '#2B1B1B', marginBottom: '1rem', fontSize: '0.9rem' }}>Price Range</h4>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label style={{ color: '#9B7878', fontSize: '0.75rem', fontFamily: 'Poppins' }}>Min (₹)</label>
                    <input
                      type="number"
                      value={filters.minPrice}
                      onChange={e => setFilters(f => ({ ...f, minPrice: e.target.value, page: 1 }))}
                      placeholder="0"
                      className="w-full mt-1 px-3 py-2 rounded-lg border text-sm outline-none"
                      style={{ borderColor: '#EAD7D7', fontFamily: 'Poppins' }}
                    />
                  </div>
                  <div className="flex-1">
                    <label style={{ color: '#9B7878', fontSize: '0.75rem', fontFamily: 'Poppins' }}>Max (₹)</label>
                    <input
                      type="number"
                      value={filters.maxPrice}
                      onChange={e => setFilters(f => ({ ...f, maxPrice: e.target.value, page: 1 }))}
                      placeholder="50000"
                      className="w-full mt-1 px-3 py-2 rounded-lg border text-sm outline-none"
                      style={{ borderColor: '#EAD7D7', fontFamily: 'Poppins' }}
                    />
                  </div>
                </div>
              </div>

              {/* Colors */}
              <div className="mb-8">
                <h4 style={{ fontFamily: 'Poppins', fontWeight: '600', color: '#2B1B1B', marginBottom: '1rem', fontSize: '0.9rem' }}>Colors</h4>
                <div className="flex flex-wrap gap-2">
                  {COLORS.map(c => (
                    <button
                      key={c}
                      onClick={() => toggleColor(c)}
                      className="px-3 py-1.5 rounded-full text-xs border transition-all duration-200"
                      style={{
                        fontFamily: 'Poppins',
                        borderColor: filters.colors.includes(c) ? '#6D3B3B' : '#EAD7D7',
                        background: filters.colors.includes(c) ? '#6D3B3B' : 'white',
                        color: filters.colors.includes(c) ? 'white' : '#2B1B1B',
                      }}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={clearFilters} className="flex-1 py-2.5 rounded-full border text-sm" style={{ borderColor: '#6D3B3B', color: '#6D3B3B', fontFamily: 'Poppins' }}>
                  Clear
                </button>
                <button onClick={() => setSidebarOpen(false)} className="flex-1 py-2.5 rounded-full text-white text-sm" style={{ background: '#6D3B3B', fontFamily: 'Poppins' }}>
                  Apply
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
