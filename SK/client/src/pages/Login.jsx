import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { loginUser } from '../redux/slices/authSlice';
import { Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(s => s.auth);
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser(form));
    if (result.meta.requestStatus === 'fulfilled') navigate('/');
  };

  const inputStyle = {
    width: '100%', padding: '12px 16px', borderRadius: '12px',
    border: '1px solid #EAD7D7', fontFamily: 'Poppins', fontSize: '0.875rem',
    outline: 'none', color: '#2B1B1B', background: 'white',
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#FAF7F5' }}>
      {/* Left Panel */}
      <div className="hidden lg:flex flex-1 items-center justify-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #2B1B1B 0%, #6D3B3B 100%)' }}>
        <img src="/images/hero-banner.png" alt="Saree" className="absolute inset-0 w-full h-full object-cover opacity-30" />
        <div className="relative z-10 text-center p-12">
          <div className="w-20 h-20 rounded-full border-2 flex items-center justify-center mx-auto mb-6" style={{ borderColor: '#C8A96A' }}>
            <span style={{ fontFamily: "'Playfair Display', serif", color: '#C8A96A', fontSize: '1.5rem', fontWeight: '700' }}>SK</span>
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#FAF7F5', fontSize: '2rem', marginBottom: '1rem' }}>
            Welcome Back
          </h2>
          <p style={{ color: 'rgba(250,247,245,0.7)', fontFamily: 'Poppins', fontSize: '0.95rem' }}>
            Sign in to access your exclusive saree collection and track your orders.
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', color: '#2B1B1B' }}>Sign In</h1>
            <p style={{ color: '#9B7878', fontFamily: 'Poppins', fontSize: '0.875rem', marginTop: '0.5rem' }}>
              Welcome to Sri Kanakadhara
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl text-sm" style={{ background: '#EAD7D7', color: '#6D3B3B', fontFamily: 'Poppins' }}>
              {error}
            </div>
          )}

          {/* Demo credentials */}
          <div className="mb-6 p-4 rounded-xl text-xs space-y-1" style={{ background: '#EAD7D7', fontFamily: 'Poppins', color: '#6D3B3B' }}>
            <p className="font-semibold">Demo Credentials:</p>
            <p>User: test@example.com / Test@1234</p>
            <p>Admin: admin@srikanakadhara.com / Admin@1234</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label style={{ color: '#9B7878', fontSize: '0.75rem', fontFamily: 'Poppins', letterSpacing: '0.05em' }}>EMAIL</label>
              <input
                type="email" value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="your@email.com" required
                style={{ ...inputStyle, marginTop: '6px' }}
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1" style={{ marginTop: '6px' }}>
                <label style={{ color: '#9B7878', fontSize: '0.75rem', fontFamily: 'Poppins', letterSpacing: '0.05em' }}>PASSWORD</label>
                <Link to="/forgot-password" style={{ color: '#6D3B3B', fontSize: '0.75rem', fontFamily: 'Poppins', fontWeight: '500' }}>Forgot password?</Link>
              </div>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••" required
                  style={{ ...inputStyle, paddingRight: '48px' }}
                />
                <button type="button" onClick={() => setShowPw(s => !s)} className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: '#9B7878' }}>
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <motion.button
              type="submit" disabled={loading}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="w-full py-4 rounded-xl text-white font-semibold mt-2 disabled:opacity-70"
              style={{ background: 'linear-gradient(135deg, #6D3B3B, #8B5050)', fontFamily: 'Poppins' }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </motion.button>
          </form>

          <p className="text-center mt-6" style={{ fontFamily: 'Poppins', color: '#9B7878', fontSize: '0.875rem' }}>
            New to Sri Kanakadhara?{' '}
            <Link to="/signup" style={{ color: '#6D3B3B', fontWeight: '600' }}>Create an account</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
