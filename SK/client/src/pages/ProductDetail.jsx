import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { fetchProductById } from '../redux/slices/productSlice';
import { addToCart, openDrawer } from '../redux/slices/cartSlice';
import { selectUser } from '../redux/slices/authSlice';
import { toast } from 'react-toastify';
import { ShoppingBag, Star, ChevronLeft, ChevronRight, Truck, Shield, RefreshCw, Check, Heart, MessageSquare } from 'lucide-react';
import { toggleWishlist, selectIsWishlisted } from '../redux/slices/wishlistSlice';

export default function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentProduct: product, loading } = useSelector(s => s.products);

  const [activeImg, setActiveImg] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState('');
  const [pincodeMsg, setPincodeMsg] = useState('');
  const [addedToCart, setAddedToCart] = useState(false);

  // Reviews state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  const user = useSelector(selectUser);
  const isWishlisted = useSelector(state => selectIsWishlisted(state, product?._id));

  useEffect(() => {
    dispatch(fetchProductById(id));
    setActiveImg(0);
    setSelectedColor('');
  }, [id, dispatch]);

  useEffect(() => {
    if (product?.colors?.length) setSelectedColor(product.colors[0]);
  }, [product]);

  const handleAddToCart = () => {
    if (!selectedColor) { toast.error('Please select a color'); return; }
    dispatch(addToCart({ product, color: selectedColor, quantity }));
    dispatch(openDrawer());
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
    toast.success(`${product.name} added to bag!`);
  };

  const handleBuyNow = () => {
    if (!selectedColor) { toast.error('Please select a color'); return; }
    dispatch(addToCart({ product, color: selectedColor, quantity }));
    navigate('/checkout');
  };

  const handleWishlist = () => {
    dispatch(toggleWishlist(product));
    toast[isWishlisted ? 'info' : 'success'](isWishlisted ? 'Removed from wishlist' : 'Added to wishlist ❤️');
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) { toast.error('Please write a comment'); return; }
    setSubmittingReview(true);
    try {
      await axios.post(`/api/products/${id}/reviews`, { rating: reviewRating, comment: reviewComment }, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      toast.success('Review submitted! Thank you 🌟');
      setReviewComment('');
      setReviewRating(5);
      dispatch(fetchProductById(id));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const checkPincode = () => {
    if (pincode.length === 6) {
      setPincodeMsg('✅ Delivery available in 3-5 business days');
    } else {
      setPincodeMsg('Please enter a valid 6-digit pincode');
    }
  };

  if (loading) return (
    <div className="container-custom py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="aspect-square rounded-2xl animate-pulse" style={{ background: '#EAD7D7' }} />
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => <div key={i} className="h-6 rounded animate-pulse" style={{ background: '#EAD7D7', width: `${80 - i * 10}%` }} />)}
        </div>
      </div>
    </div>
  );

  if (!product) return null;

  const savings = product.originalPrice ? product.originalPrice - product.price : 0;

  return (
    <div style={{ background: '#FAF7F5', minHeight: '100vh' }}>
      <div className="container-custom py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-8" style={{ fontFamily: 'Poppins', color: '#9B7878' }}>
          <button onClick={() => navigate(-1)} className="hover:text-primary transition-colors">← Back</button>
          <span>/</span>
          <span>{product.category}</span>
          <span>/</span>
          <span style={{ color: '#6D3B3B' }} className="truncate max-w-[200px]">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* ─── IMAGE GALLERY ─── */}
          <div>
            {/* Main image */}
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden group" style={{ border: '1px solid #EAD7D7' }}>
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImg}
                  src={product.images?.[activeImg]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                />
              </AnimatePresence>

              {/* Nav arrows */}
              {product.images?.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImg(i => (i === 0 ? product.images.length - 1 : i - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronLeft size={18} style={{ color: '#6D3B3B' }} />
                  </button>
                  <button
                    onClick={() => setActiveImg(i => (i === product.images.length - 1 ? 0 : i + 1))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronRight size={18} style={{ color: '#6D3B3B' }} />
                  </button>
                </>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4">
                {product.discount > 0 && (
                  <span className="block px-3 py-1 rounded-full text-white text-sm font-semibold mb-2" style={{ background: '#6D3B3B' }}>
                    {product.discount}% OFF
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnails */}
            {product.images?.length > 1 && (
              <div className="flex gap-3 mt-4">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className="w-20 h-24 rounded-xl overflow-hidden transition-all duration-200"
                    style={{ border: i === activeImg ? '2px solid #6D3B3B' : '2px solid transparent', opacity: i === activeImg ? 1 : 0.6 }}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ─── PRODUCT INFO ─── */}
          <div>
            <p style={{ color: '#C8A96A', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'Poppins', marginBottom: '0.5rem' }}>
              {product.category} {product.fabric ? `· ${product.fabric}` : ''}
            </p>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', color: '#2B1B1B', lineHeight: 1.2, marginBottom: '1rem' }}>
              {product.name}
            </h1>

            {/* Rating */}
            {product.numReviews > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={15} fill={i < Math.round(product.rating) ? '#C8A96A' : 'none'} stroke="#C8A96A" />
                  ))}
                </div>
                <span style={{ color: '#9B7878', fontSize: '0.875rem', fontFamily: 'Poppins' }}>({product.numReviews} reviews)</span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-end gap-3 mb-6">
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.2rem', color: '#6D3B3B', fontWeight: '700' }}>
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && (
                <span className="text-lg line-through mb-1" style={{ color: '#9B7878', fontFamily: 'Poppins' }}>
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
              {savings > 0 && (
                <span className="mb-1 text-sm font-semibold px-2 py-0.5 rounded" style={{ background: '#EAD7D7', color: '#6D3B3B', fontFamily: 'Poppins' }}>
                  Save ₹{savings.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            <div style={{ width: '100%', height: '1px', background: '#EAD7D7', marginBottom: '1.5rem' }} />

            {/* Color Selection */}
            {product.colors?.length > 0 && (
              <div className="mb-6">
                <p style={{ fontFamily: 'Poppins', fontWeight: '600', color: '#2B1B1B', marginBottom: '0.75rem', fontSize: '0.9rem' }}>
                  Color: <span style={{ color: '#6D3B3B' }}>{selectedColor}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map(c => (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      className="px-4 py-2 rounded-full text-sm border-2 transition-all duration-200 font-medium"
                      style={{
                        fontFamily: 'Poppins',
                        borderColor: selectedColor === c ? '#6D3B3B' : '#EAD7D7',
                        background: selectedColor === c ? '#6D3B3B' : 'white',
                        color: selectedColor === c ? 'white' : '#2B1B1B',
                      }}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <p style={{ fontFamily: 'Poppins', fontWeight: '600', color: '#2B1B1B', marginBottom: '0.75rem', fontSize: '0.9rem' }}>Quantity</p>
              <div className="flex items-center gap-3 w-fit rounded-full border px-4 py-2" style={{ borderColor: '#EAD7D7' }}>
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="text-xl font-light" style={{ color: '#6D3B3B' }}>−</button>
                <span className="w-8 text-center font-medium" style={{ fontFamily: 'Poppins' }}>{quantity}</span>
                <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} className="text-xl font-light" style={{ color: '#6D3B3B' }}>+</button>
              </div>
              <p style={{ color: '#9B7878', fontSize: '0.8rem', fontFamily: 'Poppins', marginTop: '0.5rem' }}>
                {product.stock > 0 ? `${product.stock} pieces available` : 'Out of stock'}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-3 mb-8">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 flex items-center justify-center gap-2 py-4 rounded-full font-semibold transition-all disabled:opacity-50"
                style={{
                  background: addedToCart ? '#5a2d2d' : 'linear-gradient(135deg, #6D3B3B, #8B5050)',
                  color: 'white',
                  fontFamily: 'Poppins',
                }}
              >
                {addedToCart ? <><Check size={18} /> Added!</> : <><ShoppingBag size={18} /> Add to Bag</>}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="flex-1 py-4 rounded-full font-semibold border-2 transition-all disabled:opacity-50"
                style={{ borderColor: '#6D3B3B', color: '#6D3B3B', fontFamily: 'Poppins' }}
              >
                Buy Now
              </motion.button>
              {/* Wishlist button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleWishlist}
                className="w-14 h-14 flex-shrink-0 flex items-center justify-center rounded-full border-2 transition-all"
                style={{
                  borderColor: isWishlisted ? '#C8696B' : '#EAD7D7',
                  background: isWishlisted ? '#FFF0F0' : 'white',
                }}
                aria-label="Toggle wishlist"
              >
                <Heart size={20} fill={isWishlisted ? '#C8696B' : 'none'} stroke={isWishlisted ? '#C8696B' : '#6D3B3B'} />
              </motion.button>
            </div>

            {/* Delivery Check */}
            <div className="p-4 rounded-xl mb-6" style={{ background: '#EAD7D7' }}>
              <p style={{ fontFamily: 'Poppins', fontWeight: '600', color: '#2B1B1B', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
                🚚 Check Delivery
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={e => { setPincode(e.target.value); setPincodeMsg(''); }}
                  placeholder="Enter pincode"
                  className="flex-1 px-3 py-2 rounded-lg border text-sm outline-none"
                  style={{ borderColor: '#EAD7D7', fontFamily: 'Poppins' }}
                />
                <button onClick={checkPincode} className="px-4 py-2 rounded-lg text-white text-sm" style={{ background: '#6D3B3B' }}>Check</button>
              </div>
              {pincodeMsg && <p style={{ color: '#6D3B3B', fontSize: '0.8rem', fontFamily: 'Poppins', marginTop: '0.5rem' }}>{pincodeMsg}</p>}
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: <Truck size={16} />, label: 'Free Delivery', sub: 'Above ₹2999' },
                { icon: <RefreshCw size={16} />, label: '7-Day Return', sub: 'Hassle free' },
                { icon: <Shield size={16} />, label: 'Authentic', sub: 'Quality certified' },
              ].map((f, i) => (
                <div key={i} className="text-center p-3 rounded-xl bg-white" style={{ border: '1px solid #EAD7D7' }}>
                  <div style={{ color: '#C8A96A', marginBottom: '4px' }} className="flex justify-center">{f.icon}</div>
                  <p style={{ fontFamily: 'Poppins', fontSize: '0.7rem', fontWeight: '600', color: '#2B1B1B' }}>{f.label}</p>
                  <p style={{ fontFamily: 'Poppins', fontSize: '0.65rem', color: '#9B7878' }}>{f.sub}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            <div style={{ borderTop: '1px solid #EAD7D7', marginTop: '1.5rem', paddingTop: '1.5rem' }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", color: '#2B1B1B', fontSize: '1.1rem', marginBottom: '0.75rem' }}>About this Saree</h3>
              <p style={{ color: '#9B7878', fontFamily: 'Poppins', fontSize: '0.9rem', lineHeight: 1.8 }}>{product.description}</p>
              {product.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {product.tags.map(tag => (
                    <span key={tag} className="px-2.5 py-1 rounded-full text-xs" style={{ background: '#EAD7D7', color: '#6D3B3B', fontFamily: 'Poppins' }}>
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ─── REVIEWS SECTION ─── */}
        <div className="mt-16 border-t pt-12" style={{ borderColor: '#EAD7D7' }}>
          <div className="flex items-center gap-3 mb-8">
            <MessageSquare size={22} style={{ color: '#C8A96A' }} />
            <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#2B1B1B', fontSize: '1.8rem' }}>Customer Reviews</h2>
            {product.numReviews > 0 && (
              <span className="px-3 py-1 rounded-full text-sm" style={{ background: '#EAD7D7', color: '#6D3B3B', fontFamily: 'Poppins' }}>
                {product.numReviews} review{product.numReviews !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left: Write a review */}
            <div className="lg:col-span-1">
              {/* Overall rating summary */}
              {product.numReviews > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm mb-6" style={{ border: '1px solid #EAD7D7' }}>
                  <p style={{ fontFamily: 'Poppins', fontSize: '0.75rem', color: '#9B7878', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Overall Rating</p>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '3.5rem', color: '#2B1B1B', lineHeight: 1 }}>{product.rating?.toFixed(1)}</p>
                  <div className="flex gap-1 my-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={18} fill={i < Math.round(product.rating) ? '#C8A96A' : 'none'} stroke="#C8A96A" />
                    ))}
                  </div>
                  <p style={{ color: '#9B7878', fontFamily: 'Poppins', fontSize: '0.8rem' }}>Based on {product.numReviews} reviews</p>
                </div>
              )}

              {/* Review form */}
              {user ? (
                <div className="bg-white rounded-2xl p-6 shadow-sm" style={{ border: '1px solid #EAD7D7' }}>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", color: '#2B1B1B', fontSize: '1.2rem', marginBottom: '1rem' }}>Write a Review</h3>
                  <form onSubmit={handleSubmitReview}>
                    {/* Star rating picker */}
                    <div className="mb-4">
                      <p style={{ fontFamily: 'Poppins', fontWeight: '600', color: '#2B1B1B', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Your Rating</p>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                          >
                            <Star
                              size={28}
                              fill={(hoverRating || reviewRating) >= star ? '#C8A96A' : 'none'}
                              stroke="#C8A96A"
                              className="transition-all duration-100"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="mb-4">
                      <p style={{ fontFamily: 'Poppins', fontWeight: '600', color: '#2B1B1B', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Your Review</p>
                      <textarea
                        value={reviewComment}
                        onChange={e => setReviewComment(e.target.value)}
                        rows={4}
                        placeholder="Share your experience with this saree..."
                        className="w-full px-4 py-3 rounded-xl border outline-none text-sm resize-none"
                        style={{ borderColor: '#EAD7D7', fontFamily: 'Poppins', color: '#2B1B1B' }}
                      />
                    </div>
                    <motion.button
                      type="submit"
                      disabled={submittingReview}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      className="w-full py-3 rounded-full text-white font-semibold text-sm disabled:opacity-70"
                      style={{ background: 'linear-gradient(135deg, #6D3B3B, #8B5050)', fontFamily: 'Poppins' }}
                    >
                      {submittingReview ? 'Submitting...' : 'Submit Review'}
                    </motion.button>
                  </form>
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-6 shadow-sm text-center" style={{ border: '1px solid #EAD7D7' }}>
                  <Star size={32} style={{ color: '#C8A96A', margin: '0 auto 1rem' }} />
                  <p style={{ fontFamily: "'Playfair Display', serif", color: '#2B1B1B', marginBottom: '0.5rem' }}>Share your experience</p>
                  <p style={{ color: '#9B7878', fontFamily: 'Poppins', fontSize: '0.85rem', marginBottom: '1rem' }}>Login to leave a review</p>
                  <a href="/login" className="inline-block px-6 py-2.5 rounded-full text-white text-sm font-medium" style={{ background: '#6D3B3B', fontFamily: 'Poppins' }}>Login</a>
                </div>
              )}
            </div>

            {/* Right: Existing reviews */}
            <div className="lg:col-span-2">
              {!product.reviews || product.reviews.length === 0 ? (
                <div className="text-center py-12">
                  <p style={{ color: '#9B7878', fontFamily: 'Poppins', fontSize: '0.95rem' }}>No reviews yet. Be the first to review!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {product.reviews.map((review, i) => (
                    <motion.div
                      key={review._id || i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07 }}
                      className="bg-white rounded-2xl p-5 shadow-sm"
                      style={{ border: '1px solid #EAD7D7' }}
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <p style={{ fontFamily: "'Playfair Display', serif", color: '#2B1B1B', fontWeight: '600' }}>{review.name}</p>
                          <p style={{ color: '#9B7878', fontFamily: 'Poppins', fontSize: '0.75rem' }}>
                            {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </p>
                        </div>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, j) => (
                            <Star key={j} size={14} fill={j < review.rating ? '#C8A96A' : 'none'} stroke="#C8A96A" />
                          ))}
                        </div>
                      </div>
                      <p style={{ color: '#9B7878', fontFamily: 'Poppins', fontSize: '0.9rem', lineHeight: 1.7, fontStyle: 'italic' }}>
                        "{review.comment}"
                      </p>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
