import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFeatured, fetchBestSellers } from '../redux/slices/productSlice';
import ProductCard from '../components/ProductCard';
import { ArrowRight, Star, Shield, Truck, RefreshCw } from 'lucide-react';

const categories = [
  { name: 'Silk Sarees', img: '/images/category-silk.png', path: '/collections/Silk%20Sarees', desc: 'Royal heritage weaves' },
  { name: 'Cotton Sarees', img: '/images/category-cotton.png', path: '/collections/Cotton%20Sarees', desc: 'Comfort meets style' },
  { name: 'Designer Sarees', img: '/images/category-designer.png', path: '/collections/Designer%20Sarees', desc: 'Contemporary elegance' },
  { name: 'Bridal Sarees', img: '/images/category-bridal.png', path: '/collections/Bridal%20Sarees', desc: 'For your special day' },
  { name: 'Traditional & Festive Wear', img: '/images/category-traditional.png', path: '/collections/Traditional%20Wear', desc: 'Cultural authenticity' },
];

const testimonials = [
  { name: 'Priya Sharma', city: 'Chennai', rating: 5, text: 'Absolutely stunning Kanjivaram saree! The quality is exceptional and the delivery was prompt. Sri Kanakadhara is my go-to for all festive occasions.' },
  { name: 'Ananya Krishnan', city: 'Bangalore', rating: 5, text: 'Ordered a bridal saree and it exceeded all my expectations. The zari work is exquisite. My wedding photos look absolutely gorgeous!' },
  { name: 'Meera Patel', city: 'Coimbatore', rating: 5, text: 'The Chanderi saree I ordered is so light and beautiful. Perfect for office wear. The packaging was also very premium and elegant.' },
];

const features = [
  { icon: <Shield size={24} />, title: 'Authentic Quality', desc: 'Every saree is handpicked and quality certified' },
  { icon: <Truck size={24} />, title: 'Free Shipping', desc: 'Complimentary delivery on orders above ₹2999' },
  { icon: <RefreshCw size={24} />, title: 'Easy Returns', desc: '7-day hassle-free return policy' },
  { icon: <Star size={24} />, title: 'Curated Collection', desc: 'Expertly curated from master weavers across India' },
];

const galleryImages = [
  '/images/category-silk.png',
  '/images/category-cotton.png',
  '/images/category-designer.png',
  '/images/category-bridal.png',
  '/images/category-traditional.png',
  '/images/hero-banner.png',
];

export default function Home() {
  const dispatch = useDispatch();
  const { featured, bestSellers } = useSelector(s => s.products);

  useEffect(() => {
    dispatch(fetchFeatured());
    dispatch(fetchBestSellers());
  }, [dispatch]);

  return (
    <>
      {/* ─── HERO SECTION ─── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('/images/hero-banner.png')` }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(43,27,27,0.85) 0%, rgba(109,59,59,0.5) 50%, rgba(43,27,27,0.75) 100%)' }} />

        <div className="relative z-10 container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              style={{ color: '#C8A96A', fontSize: '0.85rem', letterSpacing: '0.4em', textTransform: 'uppercase', fontFamily: 'Poppins', marginBottom: '1.5rem' }}
            >
              Sri Kanakadhara Designer Studio
            </motion.p>
            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                color: '#FAF7F5',
                fontSize: 'clamp(2.5rem, 6vw, 5rem)',
                fontWeight: '700',
                lineHeight: 1.15,
                marginBottom: '1.5rem',
                maxWidth: '800px',
                margin: '0 auto 1.5rem',
              }}
            >
              Elegance Woven Into<br />
              <em style={{ color: '#C8A96A' }}>Every Thread</em>
            </h1>
            <p style={{
              color: 'rgba(250,247,245,0.8)', fontFamily: 'Poppins', fontSize: '1.1rem',
              maxWidth: '500px', margin: '0 auto 2.5rem', lineHeight: 1.7,
            }}>
              Discover our exclusive collection of handcrafted sarees — where tradition meets timeless beauty.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/collections"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold"
                  style={{ background: 'linear-gradient(135deg, #C8A96A, #E8D5A3)', color: '#2B1B1B', fontFamily: 'Poppins' }}
                >
                  Shop Now <ArrowRight size={18} />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/new-arrivals"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold border-2"
                  style={{ borderColor: '#FAF7F5', color: '#FAF7F5', fontFamily: 'Poppins' }}
                >
                  New Arrivals
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
          >
            <div style={{ width: '1px', height: '60px', background: 'linear-gradient(to bottom, transparent, #C8A96A)', margin: '0 auto' }} />
          </motion.div>
        </div>
      </section>

      {/* ─── FEATURES BAR ─── */}
      <section style={{ background: '#FAF7F5', borderTop: '1px solid #EAD7D7', borderBottom: '1px solid #EAD7D7' }}>
        <div className="container-custom py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div style={{ color: '#C8A96A' }}>{f.icon}</div>
                <div>
                  <p style={{ fontFamily: 'Poppins', fontWeight: '600', fontSize: '0.875rem', color: '#2B1B1B' }}>{f.title}</p>
                  <p style={{ fontFamily: 'Poppins', fontSize: '0.75rem', color: '#9B7878' }}>{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BRAND STORY ─── */}
      <section className="section-padding" style={{ background: '#FAF7F5' }}>
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <p style={{ color: '#C8A96A', fontSize: '0.8rem', letterSpacing: '0.3em', textTransform: 'uppercase', fontFamily: 'Poppins', marginBottom: '1rem' }}>
                Our Story
              </p>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', color: '#2B1B1B', lineHeight: 1.2, marginBottom: '1.5rem' }}>
                A Legacy of <em>Craftsmanship</em>
              </h2>
              <div style={{ width: '60px', height: '2px', background: 'linear-gradient(90deg, #C8A96A, transparent)', marginBottom: '1.5rem' }} />
              <p style={{ fontFamily: 'Poppins', color: '#9B7878', lineHeight: 1.8, marginBottom: '1rem', fontSize: '0.95rem' }}>
                Sri Kanakadhara Designer Studio was born from a deep reverence for India's textile heritage. For over a decade, we have been curating the finest handcrafted sarees from master weavers across India.
              </p>
              <p style={{ fontFamily: 'Poppins', color: '#9B7878', lineHeight: 1.8, fontSize: '0.95rem' }}>
                From the lustrous silks of Kanjivaram to the delicate weaves of Chanderi — each piece in our collection tells a story of devotion, skill, and timeless beauty.
              </p>
              <Link
                to="/collections"
                className="inline-flex items-center gap-2 mt-6 font-semibold"
                style={{ color: '#6D3B3B', fontFamily: 'Poppins' }}
              >
                Explore Collections <ArrowRight size={16} />
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="aspect-[4/5] rounded-2xl overflow-hidden">
                <img
                  src="/images/category-silk.png"
                  alt="Premium saree craftsmanship weaving design"
                  className="w-full h-full object-cover"
                />
              </div>
              <div
                className="absolute -bottom-6 -left-6 w-40 h-40 rounded-2xl overflow-hidden shadow-xl"
                style={{ border: '4px solid #FAF7F5' }}
              >
                <img src="/images/category-designer.png" alt="Saree texture detail" className="w-full h-full object-cover" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── FEATURED CATEGORIES ─── */}
      <section className="section-padding" style={{ background: '#EAD7D7' }}>
        <div className="container-custom">
          <div className="text-center mb-12">
            <p style={{ color: '#C8A96A', fontSize: '0.8rem', letterSpacing: '0.3em', textTransform: 'uppercase', fontFamily: 'Poppins' }}>
              Curated for You
            </p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.2rem', color: '#2B1B1B', marginTop: '0.5rem' }}>
              Shop by Category
            </h2>
            <div className="divider-gold" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <Link to={cat.path} className="group block relative rounded-2xl overflow-hidden aspect-[3/4] shadow-md hover:shadow-xl transition-shadow duration-300">
                  <img src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(43,27,27,0.8) 0%, transparent 50%)' }} />
                  <div className="absolute bottom-4 left-4 right-4">
                    <p style={{ color: '#C8A96A', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'Poppins' }}>{cat.desc}</p>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", color: '#FAF7F5', fontSize: '1.15rem', marginTop: '4px' }}>{cat.name}</h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BEST SELLERS ─── */}
      {bestSellers.length > 0 && (
        <section className="section-padding" style={{ background: '#FAF7F5' }}>
          <div className="container-custom">
            <div className="text-center mb-12">
              <p style={{ color: '#C8A96A', fontSize: '0.8rem', letterSpacing: '0.3em', textTransform: 'uppercase', fontFamily: 'Poppins' }}>Most Loved</p>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.2rem', color: '#2B1B1B', marginTop: '0.5rem' }}>Best Sellers</h2>
              <div className="divider-gold" />
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {bestSellers.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
            <div className="text-center mt-10">
              <Link to="/collections" className="inline-flex items-center gap-2 px-8 py-3 rounded-full border-2 font-medium transition-all hover:bg-primary hover:text-white hover:border-primary"
                style={{ borderColor: '#6D3B3B', color: '#6D3B3B', fontFamily: 'Poppins' }}>
                View All <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ─── FEATURED ─── */}
      {featured.length > 0 && (
        <section className="section-padding" style={{ background: '#EAD7D7' }}>
          <div className="container-custom">
            <div className="text-center mb-12">
              <p style={{ color: '#C8A96A', fontSize: '0.8rem', letterSpacing: '0.3em', textTransform: 'uppercase', fontFamily: 'Poppins' }}>Handpicked</p>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.2rem', color: '#2B1B1B', marginTop: '0.5rem' }}>Featured Collection</h2>
              <div className="divider-gold" />
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* ─── GOLD BANNER ─── */}
      <section style={{ background: 'linear-gradient(135deg, #6D3B3B 0%, #4a2525 100%)' }} className="py-20">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <p style={{ color: '#C8A96A', fontSize: '0.8rem', letterSpacing: '0.4em', textTransform: 'uppercase', fontFamily: 'Poppins' }}>New Arrivals</p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#FAF7F5', fontSize: '2.5rem', margin: '1rem 0' }}>
              Freshly Woven Stories
            </h2>
            <p style={{ color: 'rgba(250,247,245,0.7)', fontFamily: 'Poppins', maxWidth: '500px', margin: '0 auto 2rem', fontSize: '0.95rem' }}>
              Discover our latest additions — premium sarees crafted for the contemporary Indian woman.
            </p>
            <Link
              to="/new-arrivals"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold"
              style={{ background: 'linear-gradient(135deg, #C8A96A, #E8D5A3)', color: '#2B1B1B', fontFamily: 'Poppins' }}
            >
              Explore New Arrivals <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="section-padding" style={{ background: '#FAF7F5' }}>
        <div className="container-custom">
          <div className="text-center mb-12">
            <p style={{ color: '#C8A96A', fontSize: '0.8rem', letterSpacing: '0.3em', textTransform: 'uppercase', fontFamily: 'Poppins' }}>What Our Customers Say</p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.2rem', color: '#2B1B1B', marginTop: '0.5rem' }}>Testimonials</h2>
            <div className="divider-gold" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="bg-white rounded-2xl p-6 shadow-sm"
                style={{ border: '1px solid #EAD7D7' }}
              >
                <div className="flex gap-0.5 mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} size={16} fill="#C8A96A" stroke="#C8A96A" />
                  ))}
                </div>
                <p style={{ color: '#9B7878', fontFamily: 'Poppins', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '1rem', fontStyle: 'italic' }}>
                  "{t.text}"
                </p>
                <div>
                  <p style={{ fontFamily: "'Playfair Display', serif", color: '#2B1B1B', fontWeight: '600' }}>{t.name}</p>
                  <p style={{ color: '#C8A96A', fontSize: '0.8rem', fontFamily: 'Poppins' }}>{t.city}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── INSTAGRAM GALLERY ─── */}
      <section className="section-padding" style={{ background: '#EAD7D7' }}>
        <div className="container-custom">
          <div className="text-center mb-10">
            <p style={{ color: '#C8A96A', fontSize: '0.8rem', letterSpacing: '0.3em', textTransform: 'uppercase', fontFamily: 'Poppins' }}>@srikanakadhara</p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.2rem', color: '#2B1B1B', marginTop: '0.5rem' }}>Follow Our Journey</h2>
          </div>
          <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
            {galleryImages.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="aspect-square rounded-xl overflow-hidden group cursor-pointer"
              >
                <img src={img} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
