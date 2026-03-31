import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { selectUser } from '../redux/slices/authSlice';
import { ShoppingBag, Package, ChevronRight, Clock, CheckCircle, Truck, Star } from 'lucide-react';

const STATUS_CONFIG = {
  processing:  { label: 'Processing',  color: '#C8A96A', bg: '#FBF5E6', icon: <Clock size={14} /> },
  confirmed:   { label: 'Confirmed',   color: '#2563eb', bg: '#EFF6FF', icon: <CheckCircle size={14} /> },
  shipped:     { label: 'Shipped',     color: '#7c3aed', bg: '#F5F3FF', icon: <Truck size={14} /> },
  delivered:   { label: 'Delivered',   color: '#16a34a', bg: '#F0FDF4', icon: <Star size={14} /> },
  cancelled:   { label: 'Cancelled',   color: '#dc2626', bg: '#FEF2F2', icon: null },
};

export default function MyOrders() {
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    const fetch = async () => {
      try {
        const { data } = await axios.get('/api/orders/myorders', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setOrders(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [user, navigate]);

  const fmt = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  if (loading) {
    return (
      <div style={{ background: '#FAF7F5', minHeight: '100vh' }}>
        <div className="container-custom py-16">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-2xl animate-pulse" style={{ background: '#EAD7D7', height: '120px' }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#FAF7F5', minHeight: '100vh' }}>
      {/* Header */}
      <section style={{ background: 'linear-gradient(135deg, #2B1B1B 0%, #4a2525 100%)' }} className="py-16 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p style={{ color: '#C8A96A', fontSize: '0.8rem', letterSpacing: '0.3em', textTransform: 'uppercase', fontFamily: 'Poppins' }}>
            Your Purchases
          </p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", color: '#FAF7F5', fontSize: '3rem', marginTop: '0.5rem' }}>
            My Orders
          </h1>
          <div style={{ width: '60px', height: '1px', background: 'linear-gradient(90deg, transparent, #C8A96A, transparent)', margin: '1rem auto' }} />
          <p style={{ color: 'rgba(250,247,245,0.6)', fontFamily: 'Poppins', fontSize: '0.95rem' }}>
            {orders.length} {orders.length === 1 ? 'order' : 'orders'} placed
          </p>
        </motion.div>
      </section>

      <div className="container-custom py-10 max-w-4xl mx-auto">
        {orders.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
            <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: '#EAD7D7' }}>
              <ShoppingBag size={40} style={{ color: '#9B7878' }} />
            </div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#2B1B1B', fontSize: '1.8rem', marginBottom: '0.75rem' }}>
              No orders yet
            </h2>
            <p style={{ color: '#9B7878', fontFamily: 'Poppins', fontSize: '0.95rem', marginBottom: '2rem' }}>
              Your order history will appear here after your first purchase.
            </p>
            <Link
              to="/collections"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-semibold"
              style={{ background: 'linear-gradient(135deg, #6D3B3B, #8B5050)', fontFamily: 'Poppins' }}
            >
              Start Shopping
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, i) => {
              const status = STATUS_CONFIG[order.orderStatus] || STATUS_CONFIG.processing;
              const isExpanded = selected === order._id;

              return (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm"
                  style={{ border: '1px solid #EAD7D7' }}
                >
                  {/* Order Header */}
                  <button
                    onClick={() => setSelected(isExpanded ? null : order._id)}
                    className="w-full text-left p-5 flex flex-wrap gap-4 items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: '#EAD7D7' }}>
                        <Package size={20} style={{ color: '#6D3B3B' }} />
                      </div>
                      <div>
                        <p style={{ fontFamily: 'Poppins', fontSize: '0.75rem', color: '#9B7878', marginBottom: '2px' }}>
                          Order #{order._id.slice(-8).toUpperCase()}
                        </p>
                        <p style={{ fontFamily: "'Playfair Display', serif", color: '#2B1B1B', fontSize: '1rem' }}>
                          {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}
                        </p>
                        <p style={{ fontFamily: 'Poppins', fontSize: '0.75rem', color: '#9B7878' }}>
                          Placed on {fmt(order.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p style={{ fontFamily: 'Poppins', fontWeight: '700', color: '#6D3B3B', fontSize: '1.1rem' }}>
                          ₹{order.totalAmount?.toLocaleString('en-IN')}
                        </p>
                        <span
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold mt-1"
                          style={{ background: status.bg, color: status.color }}
                        >
                          {status.icon} {status.label}
                        </span>
                      </div>
                      <ChevronRight
                        size={18}
                        style={{ color: '#9B7878', transform: isExpanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}
                      />
                    </div>
                  </button>

                  {/* Expanded Order Details */}
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      style={{ borderTop: '1px solid #EAD7D7' }}
                    >
                      <div className="p-5 space-y-4">
                        {/* Items */}
                        <div className="space-y-3">
                          {order.items?.map((item, j) => (
                            <div key={j} className="flex gap-4 items-center p-3 rounded-xl" style={{ background: '#FAF7F5', border: '1px solid #EAD7D7' }}>
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-16 h-20 rounded-xl object-cover flex-shrink-0"
                              />
                              <div className="flex-1">
                                <p style={{ fontFamily: "'Playfair Display', serif", color: '#2B1B1B', fontSize: '0.95rem', lineHeight: 1.3 }}>
                                  {item.name}
                                </p>
                                <p style={{ color: '#9B7878', fontSize: '0.8rem', fontFamily: 'Poppins', marginTop: '4px' }}>
                                  {item.color && `${item.color} · `}Qty: {item.quantity}
                                </p>
                                <p style={{ color: '#6D3B3B', fontFamily: 'Poppins', fontWeight: '600', marginTop: '4px' }}>
                                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Shipping + Price Breakdown */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Shipping address */}
                          <div className="p-4 rounded-xl" style={{ background: '#EAD7D7' }}>
                            <p style={{ fontFamily: 'Poppins', fontWeight: '600', color: '#2B1B1B', fontSize: '0.8rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                              🏠 Delivery Address
                            </p>
                            <p style={{ color: '#9B7878', fontFamily: 'Poppins', fontSize: '0.82rem', lineHeight: 1.7 }}>
                              {order.shippingAddress?.name}<br />
                              {order.shippingAddress?.street},<br />
                              {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}<br />
                              📞 {order.shippingAddress?.phone}
                            </p>
                          </div>

                          {/* Price breakdown */}
                          <div className="p-4 rounded-xl" style={{ background: '#EAD7D7' }}>
                            <p style={{ fontFamily: 'Poppins', fontWeight: '600', color: '#2B1B1B', fontSize: '0.8rem', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                              💳 Payment Summary
                            </p>
                            <div className="space-y-1.5 text-sm" style={{ fontFamily: 'Poppins' }}>
                              <div className="flex justify-between">
                                <span style={{ color: '#9B7878' }}>Subtotal</span>
                                <span style={{ color: '#2B1B1B' }}>₹{order.itemsTotal?.toLocaleString('en-IN')}</span>
                              </div>
                              <div className="flex justify-between">
                                <span style={{ color: '#9B7878' }}>Shipping</span>
                                <span style={{ color: order.shippingPrice === 0 ? '#16a34a' : '#2B1B1B' }}>
                                  {order.shippingPrice === 0 ? 'FREE' : `₹${order.shippingPrice}`}
                                </span>
                              </div>
                              <div className="flex justify-between pt-2 border-t font-semibold" style={{ borderColor: '#d0bfbf' }}>
                                <span style={{ color: '#2B1B1B' }}>Total Paid</span>
                                <span style={{ color: '#6D3B3B', fontFamily: "'Playfair Display', serif", fontSize: '1.05rem' }}>
                                  ₹{order.totalAmount?.toLocaleString('en-IN')}
                                </span>
                              </div>
                            </div>
                            {/* Payment status */}
                            <div className="mt-3 flex items-center gap-2">
                              <span
                                className="px-2 py-0.5 rounded-full text-xs font-semibold"
                                style={{
                                  background: order.paymentStatus === 'paid' ? '#dcfce7' : '#fee2e2',
                                  color: order.paymentStatus === 'paid' ? '#16a34a' : '#dc2626',
                                }}
                              >
                                {order.paymentStatus === 'paid' ? '✓ Paid' : 'Pending'}
                              </span>
                              <span style={{ color: '#9B7878', fontSize: '0.75rem', fontFamily: 'Poppins' }}>via Razorpay</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
