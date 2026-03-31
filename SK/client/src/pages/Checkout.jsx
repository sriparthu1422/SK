import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import { selectCartItems, selectCartTotal, clearCart } from '../redux/slices/cartSlice';
import { selectUser } from '../redux/slices/authSlice';
import { ShoppingBag, CreditCard, CheckCircle } from 'lucide-react';

const steps = ['Address', 'Review', 'Payment'];

export default function Checkout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const user = useSelector(selectUser);
  const shipping = total > 2999 ? 0 : 149;
  const grandTotal = total + shipping;

  const [step, setStep] = useState(0);
  const [address, setAddress] = useState({ name: user?.name || '', phone: '', street: '', city: '', state: '', pincode: '' });
  const [processing, setProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    if (!address.name || !address.phone || !address.street || !address.city || !address.state || !address.pincode) {
      toast.error('Please fill all address fields');
      return;
    }
    setStep(1);
  };

  const handlePayment = async () => {
    setProcessing(true);
    try {
      // 1. Create order in DB
      const { data: order } = await axios.post('/api/orders', {
        items: items.map(i => ({ product: i._id, name: i.name, image: i.images?.[0], price: i.price, quantity: i.quantity, color: i.selectedColor })),
        shippingAddress: address,
        itemsTotal: total,
        shippingPrice: shipping,
        taxPrice: 0,
        totalAmount: grandTotal,
      }, { headers: { Authorization: `Bearer ${user.token}` } });

      // 2. Create Razorpay order
      const { data: rzpOrder } = await axios.post('/api/payment/create-order', {
        amount: grandTotal,
        orderId: order._id,
      }, { headers: { Authorization: `Bearer ${user.token}` } });

      if (rzpOrder.demo) {
        // Demo mode: simulate payment success
        await axios.post('/api/payment/verify', {
          razorpay_order_id: rzpOrder.id,
          razorpay_payment_id: 'demo_payment_' + Date.now(),
          razorpay_signature: 'demo_sig',
          orderId: order._id,
        }, { headers: { Authorization: `Bearer ${user.token}` } });

        dispatch(clearCart());
        setOrderPlaced(true);
        setStep(2);
      } else {
        // Real Razorpay
        const { data: keyData } = await axios.get('/api/payment/key');
        const options = {
          key: keyData.key,
          amount: rzpOrder.amount,
          currency: 'INR',
          name: 'Sri Kanakadhara Designer Studio',
          description: `Order of ${items.length} saree(s)`,
          order_id: rzpOrder.id,
          handler: async (response) => {
            await axios.post('/api/payment/verify', {
              ...response,
              orderId: order._id,
            }, { headers: { Authorization: `Bearer ${user.token}` } });
            dispatch(clearCart());
            setOrderPlaced(true);
            setStep(2);
          },
          prefill: { name: user.name, email: user.email, contact: address.phone },
          theme: { color: '#6D3B3B' },
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '12px 16px', borderRadius: '12px',
    border: '1px solid #EAD7D7', fontFamily: 'Poppins', fontSize: '0.875rem',
    outline: 'none', color: '#2B1B1B', background: 'white',
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: '#FAF7F5' }}>
        <motion.div
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="text-center p-12 rounded-3xl bg-white shadow-lg max-w-md"
          style={{ border: '1px solid #EAD7D7' }}
        >
          <CheckCircle size={64} style={{ color: '#C8A96A', margin: '0 auto 1.5rem' }} />
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', color: '#2B1B1B', marginBottom: '1rem' }}>Order Placed!</h2>
          <p style={{ color: '#9B7878', fontFamily: 'Poppins', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '2rem' }}>
            Thank you for shopping with Sri Kanakadhara Designer Studio. Your order has been confirmed and will be delivered soon.
          </p>
          <button onClick={() => navigate('/')} className="px-8 py-3 rounded-full text-white font-semibold" style={{ background: '#6D3B3B', fontFamily: 'Poppins' }}>
            Continue Shopping
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ background: '#FAF7F5', minHeight: '100vh' }}>
      <div className="container-custom py-12">
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', color: '#2B1B1B', marginBottom: '2rem' }}>Checkout</h1>

        {/* Progress Steps */}
        <div className="flex items-center gap-4 mb-10">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold"
                style={{
                  background: i <= step ? '#6D3B3B' : '#EAD7D7',
                  color: i <= step ? 'white' : '#9B7878',
                  fontFamily: 'Poppins',
                }}>
                {i + 1}
              </div>
              <span style={{ fontFamily: 'Poppins', fontSize: '0.875rem', color: i === step ? '#2B1B1B' : '#9B7878' }}>{s}</span>
              {i < steps.length - 1 && <div style={{ width: '40px', height: '1px', background: '#EAD7D7' }} />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2">
            {/* Step 0: Address */}
            {step === 0 && (
              <motion.form
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                onSubmit={handleAddressSubmit}
                className="bg-white rounded-2xl p-8 shadow-sm"
                style={{ border: '1px solid #EAD7D7' }}
              >
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', color: '#2B1B1B', marginBottom: '1.5rem' }}>Delivery Address</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label style={{ color: '#9B7878', fontSize: '0.75rem', fontFamily: 'Poppins' }}>FULL NAME *</label>
                      <input value={address.name} onChange={e => setAddress(a => ({ ...a, name: e.target.value }))} placeholder="Full name" style={{ ...inputStyle, marginTop: '6px' }} required />
                    </div>
                    <div>
                      <label style={{ color: '#9B7878', fontSize: '0.75rem', fontFamily: 'Poppins' }}>PHONE *</label>
                      <input value={address.phone} onChange={e => setAddress(a => ({ ...a, phone: e.target.value }))} placeholder="+91 00000 00000" style={{ ...inputStyle, marginTop: '6px' }} required />
                    </div>
                  </div>
                  <div>
                    <label style={{ color: '#9B7878', fontSize: '0.75rem', fontFamily: 'Poppins' }}>STREET ADDRESS *</label>
                    <textarea value={address.street} onChange={e => setAddress(a => ({ ...a, street: e.target.value }))} placeholder="House/Flat, Street, Area" rows={2} style={{ ...inputStyle, marginTop: '6px', resize: 'none' }} required />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label style={{ color: '#9B7878', fontSize: '0.75rem', fontFamily: 'Poppins' }}>CITY *</label>
                      <input value={address.city} onChange={e => setAddress(a => ({ ...a, city: e.target.value }))} placeholder="City" style={{ ...inputStyle, marginTop: '6px' }} required />
                    </div>
                    <div>
                      <label style={{ color: '#9B7878', fontSize: '0.75rem', fontFamily: 'Poppins' }}>STATE *</label>
                      <input value={address.state} onChange={e => setAddress(a => ({ ...a, state: e.target.value }))} placeholder="State" style={{ ...inputStyle, marginTop: '6px' }} required />
                    </div>
                    <div>
                      <label style={{ color: '#9B7878', fontSize: '0.75rem', fontFamily: 'Poppins' }}>PINCODE *</label>
                      <input value={address.pincode} onChange={e => setAddress(a => ({ ...a, pincode: e.target.value }))} placeholder="6-digit" style={{ ...inputStyle, marginTop: '6px' }} maxLength={6} required />
                    </div>
                  </div>
                </div>
                <button type="submit" className="mt-6 w-full py-4 rounded-xl text-white font-semibold" style={{ background: 'linear-gradient(135deg, #6D3B3B, #8B5050)', fontFamily: 'Poppins' }}>
                  Continue to Review
                </button>
              </motion.form>
            )}

            {/* Step 1: Review */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl p-8 shadow-sm"
                style={{ border: '1px solid #EAD7D7' }}
              >
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', color: '#2B1B1B', marginBottom: '1.5rem' }}>Review Order</h2>
                <div className="space-y-3 mb-6">
                  {items.map(item => (
                    <div key={`${item._id}-${item.selectedColor}`} className="flex gap-3 p-3 rounded-xl" style={{ background: '#FAF7F5', border: '1px solid #EAD7D7' }}>
                      <img src={item.images?.[0]} alt={item.name} className="w-16 h-20 rounded-lg object-cover" />
                      <div className="flex-1">
                        <p style={{ fontFamily: "'Playfair Display', serif", color: '#2B1B1B', fontSize: '0.9rem' }}>{item.name}</p>
                        <p style={{ color: '#9B7878', fontSize: '0.8rem', fontFamily: 'Poppins' }}>{item.selectedColor} · Qty: {item.quantity}</p>
                        <p style={{ color: '#6D3B3B', fontFamily: 'Poppins', fontWeight: '600', marginTop: '4px' }}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 rounded-xl mb-6" style={{ background: '#EAD7D7' }}>
                  <p style={{ fontFamily: 'Poppins', fontWeight: '600', color: '#2B1B1B', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Delivery to:</p>
                  <p style={{ color: '#9B7878', fontFamily: 'Poppins', fontSize: '0.8rem', lineHeight: 1.6 }}>
                    {address.name} · {address.phone}<br />
                    {address.street}, {address.city}, {address.state} - {address.pincode}
                  </p>
                  <button onClick={() => setStep(0)} style={{ color: '#6D3B3B', fontFamily: 'Poppins', fontSize: '0.8rem', marginTop: '8px', fontWeight: '600' }}>Edit</button>
                </div>
                <button
                  onClick={handlePayment}
                  disabled={processing}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-xl text-white font-semibold disabled:opacity-70"
                  style={{ background: 'linear-gradient(135deg, #C8A96A, #b8923a)', fontFamily: 'Poppins' }}
                >
                  <CreditCard size={20} />
                  {processing ? 'Processing...' : `Pay ₹${grandTotal.toLocaleString('en-IN')} via Razorpay`}
                </button>
                <p style={{ color: '#9B7878', fontSize: '0.75rem', fontFamily: 'Poppins', textAlign: 'center', marginTop: '0.75rem' }}>
                  🔒 Secured by Razorpay · 100% safe payment
                </p>
              </motion.div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24" style={{ border: '1px solid #EAD7D7' }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", color: '#2B1B1B', fontSize: '1.2rem', marginBottom: '1rem' }}>
              <ShoppingBag size={18} className="inline mr-2" style={{ color: '#C8A96A' }} />
              Order Summary
            </h3>
            <div className="space-y-2 text-sm" style={{ fontFamily: 'Poppins', color: '#9B7878' }}>
              <div className="flex justify-between"><span>Subtotal</span><span style={{ color: '#2B1B1B' }}>₹{total.toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span style={{ color: shipping === 0 ? '#25D366' : '#2B1B1B' }}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span></div>
              <div className="flex justify-between pt-3 font-semibold text-base border-t" style={{ borderColor: '#EAD7D7', color: '#2B1B1B' }}>
                <span>Total</span>
                <span style={{ fontFamily: "'Playfair Display', serif", color: '#6D3B3B', fontSize: '1.3rem' }}>₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
