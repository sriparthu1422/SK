import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Mail, ArrowRight } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/auth/forgotpassword', { email });
      setSuccess(true);
      toast.success('Password reset email sent!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border outline-none text-sm transition-all bg-white";
  const inputStyle = { borderColor: '#EAD7D7', fontFamily: 'Poppins', color: '#2B1B1B' };

  if (success) {
    return (
      <div style={{ background: '#FAF7F5', minHeight: '100vh' }} className="flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl p-8 w-full max-w-md shadow-sm border text-center" style={{ borderColor: '#EAD7D7' }}>
          <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-6" style={{ background: '#dcfce7' }}>
            <Mail size={24} style={{ color: '#16a34a' }} />
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#2B1B1B', fontSize: '1.8rem', marginBottom: '1rem' }}>Check your email</h2>
          <p style={{ color: '#9B7878', fontFamily: 'Poppins', fontSize: '0.9rem', marginBottom: '2rem' }}>
            We've sent a password reset link to <strong>{email}</strong>.
          </p>
          <Link to="/login" className="inline-block w-full py-4 rounded-xl text-white font-semibold transition-all" style={{ background: 'linear-gradient(135deg, #6D3B3B, #8B5050)', fontFamily: 'Poppins' }}>
            Return to Login
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ background: '#FAF7F5', minHeight: '100vh' }} className="flex flex-col items-center justify-center p-4">
      <Link to="/" className="mb-8 flex flex-col items-center">
        <div className="w-14 h-14 rounded-full border-2 flex items-center justify-center shadow-sm" style={{ borderColor: '#C8A96A', background: 'linear-gradient(135deg, #FAF7F5, #EAD7D7)' }}>
          <span style={{ fontFamily: "'Playfair Display', serif", color: '#6D3B3B', fontSize: '1.2rem', fontWeight: '700' }}>SK</span>
        </div>
      </Link>
      
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl p-8 w-full max-w-md shadow-sm border" style={{ borderColor: '#EAD7D7' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#2B1B1B', fontSize: '2rem', textAlign: 'center', marginBottom: '0.5rem' }}>Reset Password</h2>
        <p style={{ color: '#9B7878', fontFamily: 'Poppins', fontSize: '0.85rem', textAlign: 'center', marginBottom: '2rem' }}>
          Enter your email address and we'll send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label style={{ color: '#9B7878', fontSize: '0.75rem', fontFamily: 'Poppins', letterSpacing: '0.05em', display: 'block', marginBottom: '6px' }}>EMAIL ADDRESS</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className={inputClass} style={inputStyle} placeholder="name@example.com" />
          </div>

          <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-4 rounded-xl text-white font-semibold transition-all hover:shadow-lg disabled:opacity-70 mt-4" style={{ background: 'linear-gradient(135deg, #6D3B3B, #8B5050)', fontFamily: 'Poppins' }}>
            {loading ? 'Sending...' : <>Send Reset Link <ArrowRight size={18} /></>}
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <Link to="/login" style={{ color: '#6D3B3B', fontFamily: 'Poppins', fontSize: '0.85rem', fontWeight: '500' }}>Back to Login</Link>
        </div>
      </motion.div>
    </div>
  );
}
