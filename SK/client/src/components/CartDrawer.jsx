import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react';
import { selectCartItems, selectCartTotal, selectDrawerOpen, closeDrawer, removeFromCart, updateQuantity } from '../redux/slices/cartSlice';

export default function CartDrawer() {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const isOpen = useSelector(selectDrawerOpen);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch(closeDrawer())}
            className="fixed inset-0 z-50"
            style={{ background: 'rgba(43, 27, 27, 0.5)', backdropFilter: 'blur(4px)' }}
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full z-50 w-full max-w-md bg-light shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: '#EAD7D7' }}>
              <div className="flex items-center gap-3">
                <ShoppingBag size={22} style={{ color: '#6D3B3B' }} />
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', color: '#2B1B1B' }}>
                  Your Bag ({items.length})
                </h2>
              </div>
              <button onClick={() => dispatch(closeDrawer())} className="hover:text-primary transition-colors" style={{ color: '#9B7878' }}>
                <X size={22} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <ShoppingBag size={48} style={{ color: '#EAD7D7' }} />
                  <p style={{ fontFamily: "'Playfair Display', serif", color: '#9B7878', fontSize: '1.1rem' }}>
                    Your bag is empty
                  </p>
                  <p style={{ color: '#9B7878', fontSize: '0.875rem' }}>Add sarees to begin your journey</p>
                  <button
                    onClick={() => dispatch(closeDrawer())}
                    className="mt-2 px-6 py-2.5 rounded-full text-white text-sm font-medium"
                    style={{ background: '#6D3B3B' }}
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <AnimatePresence>
                  {items.map((item) => (
                    <motion.div
                      key={`${item._id}-${item.selectedColor}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex gap-3 p-3 rounded-xl bg-white shadow-sm"
                      style={{ border: '1px solid #EAD7D7' }}
                    >
                      {/* Image */}
                      <div className="w-20 h-24 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={item.images?.[0]} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm leading-tight mb-1" style={{ color: '#2B1B1B', fontFamily: "'Playfair Display', serif" }}>
                          {item.name}
                        </p>
                        {item.selectedColor && (
                          <p style={{ color: '#9B7878', fontSize: '0.75rem' }}>{item.selectedColor}</p>
                        )}
                        <p className="font-semibold mt-1" style={{ color: '#6D3B3B', fontFamily: 'Poppins' }}>
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </p>
                        {/* Qty controls */}
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => dispatch(updateQuantity({ _id: item._id, color: item.selectedColor, quantity: item.quantity - 1 }))}
                            className="w-6 h-6 rounded-full border flex items-center justify-center hover:bg-secondary transition-colors"
                            style={{ borderColor: '#EAD7D7' }}
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => dispatch(updateQuantity({ _id: item._id, color: item.selectedColor, quantity: item.quantity + 1 }))}
                            className="w-6 h-6 rounded-full border flex items-center justify-center hover:bg-secondary transition-colors"
                            style={{ borderColor: '#EAD7D7' }}
                          >
                            <Plus size={12} />
                          </button>
                          <button
                            onClick={() => dispatch(removeFromCart({ _id: item._id, color: item.selectedColor }))}
                            className="ml-2 text-red-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t bg-white" style={{ borderColor: '#EAD7D7' }}>
                <div className="flex justify-between items-center mb-4">
                  <span style={{ color: '#9B7878', fontFamily: 'Poppins', fontSize: '0.9rem' }}>Subtotal</span>
                  <span className="text-xl font-bold" style={{ fontFamily: "'Playfair Display', serif", color: '#2B1B1B' }}>
                    ₹{total.toLocaleString('en-IN')}
                  </span>
                </div>
                <Link
                  to="/checkout"
                  onClick={() => dispatch(closeDrawer())}
                  className="block w-full text-center py-3.5 rounded-full text-white font-semibold transition-all duration-300 hover:shadow-lg"
                  style={{ background: 'linear-gradient(135deg, #6D3B3B, #8B5050)', fontFamily: 'Poppins' }}
                >
                  Proceed to Checkout
                </Link>
                <Link
                  to="/cart"
                  onClick={() => dispatch(closeDrawer())}
                  className="block w-full text-center py-3 mt-2 rounded-full text-sm font-medium border transition-colors"
                  style={{ borderColor: '#6D3B3B', color: '#6D3B3B', fontFamily: 'Poppins' }}
                >
                  View Full Cart
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
