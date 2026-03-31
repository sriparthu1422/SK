import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { selectWishlistItems, removeFromWishlist, clearWishlist } from '../redux/slices/wishlistSlice';
import { addToCart, openDrawer } from '../redux/slices/cartSlice';
import { toast } from 'react-toastify';
import { Heart, Trash2, ShoppingBag, ArrowRight, HeartOff } from 'lucide-react';

export default function Wishlist() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector(selectWishlistItems);

  const handleMoveToCart = (product) => {
    dispatch(addToCart({ product, color: product.colors?.[0], quantity: 1 }));
    dispatch(removeFromWishlist(product._id));
    dispatch(openDrawer());
    toast.success(`${product.name} moved to cart!`);
  };

  const handleRemove = (productId) => {
    dispatch(removeFromWishlist(productId));
    toast.info('Removed from wishlist');
  };

  return (
    <div style={{ background: '#FAF7F5', minHeight: '100vh' }}>
      {/* Page Header */}
      <section style={{ background: 'linear-gradient(135deg, #2B1B1B 0%, #4a2525 100%)' }} className="py-16 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p style={{ color: '#C8A96A', fontSize: '0.8rem', letterSpacing: '0.3em', textTransform: 'uppercase', fontFamily: 'Poppins' }}>
            Saved for Later
          </p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", color: '#FAF7F5', fontSize: '3rem', marginTop: '0.5rem' }}>
            My Wishlist
          </h1>
          <div style={{ width: '60px', height: '1px', background: 'linear-gradient(90deg, transparent, #C8A96A, transparent)', margin: '1rem auto' }} />
          <p style={{ color: 'rgba(250,247,245,0.6)', fontFamily: 'Poppins', fontSize: '0.95rem' }}>
            {items.length} {items.length === 1 ? 'saree' : 'sarees'} saved
          </p>
        </motion.div>
      </section>

      <div className="container-custom py-12">
        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ background: '#EAD7D7' }}>
              <HeartOff size={40} style={{ color: '#9B7878' }} />
            </div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#2B1B1B', fontSize: '1.8rem', marginBottom: '0.75rem' }}>
              Your wishlist is empty
            </h2>
            <p style={{ color: '#9B7878', fontFamily: 'Poppins', fontSize: '0.95rem', marginBottom: '2rem' }}>
              Discover beautiful sarees and save your favourites here.
            </p>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/collections"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-semibold"
                style={{ background: 'linear-gradient(135deg, #6D3B3B, #8B5050)', fontFamily: 'Poppins' }}
              >
                Explore Collections <ArrowRight size={18} />
              </Link>
            </motion.div>
          </motion.div>
        ) : (
          <>
            {/* Header actions */}
            <div className="flex items-center justify-between mb-8">
              <p style={{ fontFamily: 'Poppins', color: '#9B7878', fontSize: '0.9rem' }}>
                <Heart size={14} className="inline mr-1" style={{ color: '#C8696B' }} />
                {items.length} items in your wishlist
              </p>
              <button
                onClick={() => { dispatch(clearWishlist()); toast.info('Wishlist cleared'); }}
                className="flex items-center gap-2 text-sm px-4 py-2 rounded-full border transition-colors"
                style={{ borderColor: '#EAD7D7', color: '#9B7878', fontFamily: 'Poppins' }}
              >
                <Trash2 size={14} /> Clear All
              </button>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence>
                {items.map((product, i) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm group"
                    style={{ border: '1px solid #EAD7D7' }}
                  >
                    {/* Image */}
                    <Link to={`/product/${product._id}`} className="block relative overflow-hidden aspect-[3/4]">
                      <img
                        src={product.images?.[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1">
                        {product.isNewArrival && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: '#C8A96A', color: '#2B1B1B' }}>New</span>
                        )}
                        {product.isBestSeller && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-semibold text-white" style={{ background: '#8B5050' }}>Best Seller</span>
                        )}
                      </div>
                      {/* Remove heart */}
                      <motion.button
                        onClick={(e) => { e.preventDefault(); handleRemove(product._id); }}
                        whileTap={{ scale: 0.85 }}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ background: 'rgba(200,50,50,0.92)', backdropFilter: 'blur(8px)' }}
                        aria-label="Remove from wishlist"
                      >
                        <Heart size={14} fill="white" stroke="white" />
                      </motion.button>
                    </Link>

                    {/* Info */}
                    <div className="p-4">
                      <p style={{ color: '#9B7878', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'Poppins', marginBottom: '4px' }}>
                        {product.category}
                      </p>
                      <Link to={`/product/${product._id}`}>
                        <h3 className="font-medium leading-snug line-clamp-2 hover:text-primary transition-colors mb-2"
                          style={{ fontFamily: "'Playfair Display', serif", color: '#2B1B1B', fontSize: '0.95rem' }}>
                          {product.name}
                        </h3>
                      </Link>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="font-bold" style={{ color: '#6D3B3B', fontFamily: 'Poppins' }}>
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-xs line-through" style={{ color: '#9B7878', fontFamily: 'Poppins' }}>
                            ₹{product.originalPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <motion.button
                          onClick={() => handleMoveToCart(product)}
                          disabled={product.stock === 0}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-white text-sm font-medium disabled:opacity-50"
                          style={{ background: 'linear-gradient(135deg, #6D3B3B, #8B5050)', fontFamily: 'Poppins' }}
                        >
                          <ShoppingBag size={14} />
                          {product.stock === 0 ? 'Out of Stock' : 'Move to Bag'}
                        </motion.button>
                        <motion.button
                          onClick={() => handleRemove(product._id)}
                          whileTap={{ scale: 0.9 }}
                          className="w-10 h-10 flex items-center justify-center rounded-full border"
                          style={{ borderColor: '#EAD7D7', color: '#9B7878' }}
                          aria-label="Remove"
                        >
                          <Trash2 size={14} />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Bottom CTA */}
            <div className="text-center mt-12">
              <Link
                to="/collections"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-full border-2 font-medium transition-colors"
                style={{ borderColor: '#6D3B3B', color: '#6D3B3B', fontFamily: 'Poppins' }}
              >
                Continue Shopping <ArrowRight size={16} />
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
