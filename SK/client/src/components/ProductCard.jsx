import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, openDrawer } from '../redux/slices/cartSlice';
import { toggleWishlist, selectIsWishlisted } from '../redux/slices/wishlistSlice';
import { toast } from 'react-toastify';
import { ShoppingBag, Star, Eye, Heart } from 'lucide-react';

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const [hovered, setHovered] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);
  const isWishlisted = useSelector(state => selectIsWishlisted(state, product._id));

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart({ product, color: product.colors?.[0], quantity: 1 }));
    dispatch(openDrawer());
    toast.success(`${product.name} added to bag!`);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleWishlist(product));
    if (!isWishlisted) {
      toast.success('Added to wishlist ❤️');
    } else {
      toast.info('Removed from wishlist');
    }
  };

  const discount = product.discount || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      onMouseEnter={() => { setHovered(true); setImgIdx(1); }}
      onMouseLeave={() => { setHovered(false); setImgIdx(0); }}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-400"
      style={{ border: '1px solid #EAD7D7' }}
    >
      {/* Image */}
      <Link to={`/product/${product._id}`} className="block relative overflow-hidden aspect-[3/4]">
        <motion.img
          src={product.images?.[imgIdx] || product.images?.[0]}
          alt={product.name}
          className="w-full h-full object-cover"
          animate={{ scale: hovered ? 1.07 : 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {discount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-white text-xs font-semibold" style={{ background: '#6D3B3B' }}>
              -{discount}%
            </span>
          )}
          {product.isNewArrival && (
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: '#C8A96A', color: '#2B1B1B' }}>
              New
            </span>
          )}
          {product.isBestSeller && (
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold text-white" style={{ background: '#8B5050' }}>
              Best Seller
            </span>
          )}
          {product.stock === 0 && (
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-500 text-white">Sold Out</span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <motion.button
          onClick={handleWishlist}
          whileTap={{ scale: 0.85 }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
          style={{
            background: isWishlisted ? 'rgba(200,50,50,0.92)' : 'rgba(250,247,245,0.9)',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
          }}
          aria-label="Toggle wishlist"
        >
          <Heart
            size={14}
            fill={isWishlisted ? 'white' : 'none'}
            stroke={isWishlisted ? 'white' : '#6D3B3B'}
          />
        </motion.button>

        {/* Quick actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 10 }}
          className="absolute bottom-4 left-4 right-4 flex gap-2"
        >
          <motion.button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            whileTap={{ scale: 0.95 }}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: 'rgba(109, 59, 59, 0.95)', fontFamily: 'Poppins', backdropFilter: 'blur(8px)' }}
          >
            <ShoppingBag size={15} />
            Add to Bag
          </motion.button>
          <div
            className="w-10 h-10 flex items-center justify-center rounded-full"
            style={{ background: 'rgba(250, 247, 245, 0.9)', backdropFilter: 'blur(8px)' }}
          >
            <Eye size={16} style={{ color: '#6D3B3B' }} />
          </div>
        </motion.div>
      </Link>

      {/* Info */}
      <div className="p-3">
        <p style={{ color: '#9B7878', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px', fontFamily: 'Poppins' }}>
          {product.category} {product.fabric ? `· ${product.fabric}` : ''}
        </p>
        <Link to={`/product/${product._id}`}>
          <h3 className="font-medium leading-snug hover:text-primary transition-colors line-clamp-2"
            style={{ fontFamily: "'Playfair Display', serif", color: '#2B1B1B', fontSize: '0.95rem' }}>
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        {product.numReviews > 0 && (
          <div className="flex items-center gap-1 mt-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={11} fill={i < Math.round(product.rating) ? '#C8A96A' : 'none'} stroke="#C8A96A" />
            ))}
            <span style={{ color: '#9B7878', fontSize: '0.7rem' }}>({product.numReviews})</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mt-2">
          <span className="font-bold" style={{ color: '#6D3B3B', fontFamily: 'Poppins', fontSize: '1rem' }}>
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-xs line-through" style={{ color: '#9B7878', fontFamily: 'Poppins' }}>
              ₹{product.originalPrice.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        {/* Color dots */}
        {product.colors?.length > 0 && (
          <div className="flex gap-1.5 mt-2">
            {product.colors.slice(0, 4).map((c) => (
              <div key={c} title={c} className="w-3.5 h-3.5 rounded-full border border-white shadow-sm" style={{ background: c.toLowerCase().replace(' ', '') }} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
