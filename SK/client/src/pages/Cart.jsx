import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { selectCartItems, selectCartTotal, removeFromCart, updateQuantity, clearCart } from '../redux/slices/cartSlice';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';

export default function Cart() {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const shipping = total > 2999 ? 0 : 149;
  const grandTotal = total + shipping;

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: '#FAF7F5' }}>
        <ShoppingBag size={64} style={{ color: '#EAD7D7' }} />
        <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#2B1B1B', fontSize: '1.8rem', margin: '1rem 0 0.5rem' }}>Your Bag is Empty</h2>
        <p style={{ color: '#9B7878', fontFamily: 'Poppins' }}>Looks like you haven't added any sarees yet.</p>
        <Link to="/collections" className="mt-6 px-8 py-3 rounded-full text-white font-medium" style={{ background: '#6D3B3B', fontFamily: 'Poppins' }}>
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div style={{ background: '#FAF7F5', minHeight: '100vh' }}>
      <div className="container-custom py-12">
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', color: '#2B1B1B', marginBottom: '2rem' }}>
          Shopping Bag <span style={{ color: '#9B7878', fontSize: '1.5rem' }}>({items.length})</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <motion.div
                key={`${item._id}-${item.selectedColor}`}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex gap-4 p-4 bg-white rounded-2xl shadow-sm"
                style={{ border: '1px solid #EAD7D7' }}
              >
                <Link to={`/product/${item._id}`} className="w-28 h-36 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={item.images?.[0]} alt={item.name} className="w-full h-full object-cover" />
                </Link>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p style={{ color: '#C8A96A', fontSize: '0.7rem', fontFamily: 'Poppins', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{item.category}</p>
                      <Link to={`/product/${item._id}`}>
                        <h3 style={{ fontFamily: "'Playfair Display', serif", color: '#2B1B1B', fontSize: '1.1rem', marginTop: '2px' }}>{item.name}</h3>
                      </Link>
                      {item.selectedColor && <p style={{ color: '#9B7878', fontSize: '0.8rem', fontFamily: 'Poppins', marginTop: '4px' }}>Color: {item.selectedColor}</p>}
                    </div>
                    <button onClick={() => dispatch(removeFromCart({ _id: item._id, color: item.selectedColor }))} className="text-red-400 hover:text-red-600 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2 rounded-full border px-3 py-1" style={{ borderColor: '#EAD7D7' }}>
                      <button onClick={() => dispatch(updateQuantity({ _id: item._id, color: item.selectedColor, quantity: item.quantity - 1 }))} style={{ color: '#6D3B3B' }}>
                        <Minus size={14} />
                      </button>
                      <span className="w-6 text-center text-sm font-medium" style={{ fontFamily: 'Poppins' }}>{item.quantity}</span>
                      <button onClick={() => dispatch(updateQuantity({ _id: item._id, color: item.selectedColor, quantity: item.quantity + 1 }))} style={{ color: '#6D3B3B' }}>
                        <Plus size={14} />
                      </button>
                    </div>
                    <p style={{ fontFamily: "'Playfair Display', serif", color: '#6D3B3B', fontSize: '1.2rem', fontWeight: '700' }}>
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
            <button onClick={() => dispatch(clearCart())} className="text-sm text-red-400 hover:text-red-600 transition-colors" style={{ fontFamily: 'Poppins' }}>
              Clear bag
            </button>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24" style={{ border: '1px solid #EAD7D7' }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', color: '#2B1B1B', marginBottom: '1.5rem' }}>Order Summary</h2>
            <div className="space-y-3 text-sm" style={{ fontFamily: 'Poppins', color: '#9B7878' }}>
              <div className="flex justify-between">
                <span>Subtotal ({items.length} items)</span>
                <span style={{ color: '#2B1B1B' }}>₹{total.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span style={{ color: shipping === 0 ? '#25D366' : '#2B1B1B' }}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
              </div>
              {shipping > 0 && (
                <p className="text-xs" style={{ color: '#C8A96A' }}>Add ₹{(3000 - total).toLocaleString('en-IN')} more for free shipping</p>
              )}
              <div style={{ borderTop: '1px solid #EAD7D7', paddingTop: '1rem', marginTop: '1rem' }} className="flex justify-between items-center font-semibold text-base">
                <span style={{ color: '#2B1B1B' }}>Total</span>
                <span style={{ fontFamily: "'Playfair Display', serif", color: '#6D3B3B', fontSize: '1.4rem' }}>₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>
            <Link
              to="/checkout"
              className="block w-full text-center mt-6 py-4 rounded-xl text-white font-semibold"
              style={{ background: 'linear-gradient(135deg, #6D3B3B, #8B5050)', fontFamily: 'Poppins' }}
            >
              Proceed to Checkout <ArrowRight size={16} className="inline ml-1" />
            </Link>
            <Link to="/collections" className="block text-center mt-3 text-sm" style={{ color: '#9B7878', fontFamily: 'Poppins' }}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
