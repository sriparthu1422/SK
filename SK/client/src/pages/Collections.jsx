import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { fetchProducts } from '../redux/slices/productSlice';
import ProductCard from '../components/ProductCard';
import { ArrowRight } from 'lucide-react';

const allCategories = [
  { name: 'All', path: '/collections', img: '/images/hero-banner.png', desc: 'The complete collection' },
  { name: 'Silk Sarees', path: '/collections/Silk%20Sarees', img: '/images/category-silk.png', desc: 'Royal heritage weaves' },
  { name: 'Cotton Sarees', path: '/collections/Cotton%20Sarees', img: '/images/category-cotton.png', desc: 'Natural comfort' },
  { name: 'Designer Sarees', path: '/collections/Designer%20Sarees', img: '/images/category-designer.png', desc: 'Contemporary fusion' },
  { name: 'Bridal Sarees', path: '/collections/Bridal%20Sarees', img: '/images/category-bridal.png', desc: 'Bridal elegance' },
  { name: 'Traditional Wear', path: '/collections/Traditional%20Wear', img: '/images/category-traditional.png', desc: 'Cultural authenticity' },
];

export default function Collections() {
  const { category } = useParams();
  const dispatch = useDispatch();
  const { items: products, loading } = useSelector(s => s.products);

  useEffect(() => {
    const params = category ? { category, limit: 20 } : { limit: 20 };
    dispatch(fetchProducts(params));
  }, [category, dispatch]);

  const activeCategory = allCategories.find(c => c.name === category);

  return (
    <div style={{ background: '#FAF7F5', minHeight: '100vh' }}>
      {/* Header */}
      <section style={{ background: 'linear-gradient(135deg, #2B1B1B 0%, #6D3B3B 100%)' }} className="py-16 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p style={{ color: '#C8A96A', fontSize: '0.8rem', letterSpacing: '0.3em', textTransform: 'uppercase', fontFamily: 'Poppins' }}>
            Woven with Love
          </p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", color: '#FAF7F5', fontSize: '3rem', marginTop: '0.5rem' }}>
            {category ? `${category} Sarees` : 'All Collections'}
          </h1>
          {activeCategory && (
            <p style={{ color: 'rgba(250,247,245,0.6)', fontFamily: 'Poppins', marginTop: '0.5rem' }}>{activeCategory.desc}</p>
          )}
        </motion.div>
      </section>

      {/* Category Grid (show when no specific category) */}
      {!category && (
        <section className="container-custom py-16">
          <div className="text-center mb-12">
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', color: '#2B1B1B' }}>Browse by Collection</h2>
            <div className="divider-gold" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {allCategories.filter(c => c.name !== 'All').map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Link to={cat.path} className="group block relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                  <div className="aspect-[3/4]">
                    <img src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(43,27,27,0.85) 0%, transparent 50%)' }} />
                    <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                      <div>
                        <p style={{ color: '#C8A96A', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: 'Poppins' }}>{cat.desc}</p>
                        <h3 style={{ fontFamily: "'Playfair Display', serif", color: '#FAF7F5', fontSize: '1.1rem' }}>{cat.name}</h3>
                      </div>
                      <ArrowRight size={18} style={{ color: '#C8A96A' }} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Products */}
      <section className="container-custom pb-16">
        {category && (
          <>
            <div className="flex items-center gap-2 mb-8 text-sm" style={{ fontFamily: 'Poppins', color: '#9B7878' }}>
              <Link to="/collections" className="hover:text-primary transition-colors">Collections</Link>
              <span>/</span>
              <span style={{ color: '#6D3B3B' }}>{category}</span>
            </div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', color: '#2B1B1B', marginBottom: '2rem' }}>
              {products.length} Sarees in {category}
            </h2>
          </>
        )}

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded-2xl animate-pulse" style={{ background: '#EAD7D7', aspectRatio: '3/4' }} />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        ) : category ? (
          <div className="text-center py-16">
            <p style={{ fontFamily: "'Playfair Display', serif", color: '#9B7878', fontSize: '1.5rem' }}>No products in this category yet</p>
            <Link to="/collections" className="inline-block mt-4 px-6 py-2.5 rounded-full text-white" style={{ background: '#6D3B3B' }}>
              Browse All
            </Link>
          </div>
        ) : null}
      </section>
    </div>
  );
}
