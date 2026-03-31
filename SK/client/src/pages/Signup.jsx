import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { registerUser } from '../redux/slices/authSlice';
import { Eye, EyeOff } from 'lucide-react';

export default function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(s => s.auth);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [valErr, setValErr] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { setValErr('Passwords do not match'); return; }
    if (form.password.length < 6) { setValErr('Password must be at least 6 characters'); return; }
    setValErr('');
    const result = await dispatch(registerUser({ name: form.name, email: form.email, password: form.password }));
    if (result.meta.requestStatus === 'fulfilled') navigate('/');
  };

  const inputStyle = {
    width: '100%', padding: '12px 16px', borderRadius: '12px',
    border: '1px solid #EAD7D7', fontFamily: 'Poppins', fontSize: '0.875rem',
    outline: 'none', color: '#2B1B1B', background: 'white', marginTop: '6px',
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#FAF7F5' }}>
      <div className="hidden lg:flex flex-1 items-center justify-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #6D3B3B 0%, #2B1B1B 100%)' }}>
        <img src="/images/hero-banner.png" alt="Saree" className="absolute inset-0 w-full h-full object-cover opacity-25" />
        <div className="relative z-10 text-center p-12">
          <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#FAF7F5', fontSize: '2.2rem', marginBottom: '1rem' }}>
            Join Our World of<br /><em style={{ color: '#C8A96A' }}>Elegance</em>
          </h2>
          <p style={{ color: 'rgba(250,247,245,0.7)', fontFamily: 'Poppins' }}>
            Create an account to enjoy exclusive offers, wishlist, and order tracking.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', color: '#2B1B1B' }}>Create Account</h1>
            <p style={{ color: '#9B7878', fontFamily: 'Poppins', fontSize: '0.875rem', marginTop: '0.5rem' }}>
              Join Sri Kanakadhara Designer Studio
            </p>
          </div>

          {(error || valErr) && (
            <div className="mb-4 p-3 rounded-xl text-sm" style={{ background: '#EAD7D7', color: '#6D3B3B', fontFamily: 'Poppins' }}>
              {error || valErr}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label style={{ color: '#9B7878', fontSize: '0.75rem', fontFamily: 'Poppins', letterSpacing: '0.05em' }}>FULL NAME</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your full name" required style={inputStyle} />
            </div>
            <div>
              <label style={{ color: '#9B7878', fontSize: '0.75rem', fontFamily: 'Poppins', letterSpacing: '0.05em' }}>EMAIL</label>
              <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="your@email.com" required style={inputStyle} />
            </div>
            <div>
              <label style={{ color: '#9B7878', fontSize: '0.75rem', fontFamily: 'Poppins', letterSpacing: '0.05em' }}>PASSWORD</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="Min 6 characters" required style={{ ...inputStyle, paddingRight: '48px' }} />
                <button type="button" onClick={() => setShowPw(s => !s)} className="absolute right-4 top-1/2 mt-2 -translate-y-1/2" style={{ color: '#9B7878' }}>
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div>
              <label style={{ color: '#9B7878', fontSize: '0.75rem', fontFamily: 'Poppins', letterSpacing: '0.05em' }}>CONFIRM PASSWORD</label>
              <input type="password" value={form.confirm} onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))} placeholder="Repeat password" required style={inputStyle} />
            </div>
            <motion.button
              type="submit" disabled={loading}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="w-full py-4 rounded-xl text-white font-semibold mt-2 disabled:opacity-70"
              style={{ background: 'linear-gradient(135deg, #6D3B3B, #8B5050)', fontFamily: 'Poppins' }}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </motion.button>
          </form>

          <p className="text-center mt-6" style={{ fontFamily: 'Poppins', color: '#9B7878', fontSize: '0.875rem' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#6D3B3B', fontWeight: '600' }}>Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
