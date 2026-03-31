import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Lock, CheckCircle } from 'lucide-react';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await axios.put(`/api/auth/resetpassword/${token}`, { password });
      setSuccess(true);
      toast.success('Password reset successful!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid or expired token');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full py-3 px-4 rounded-xl border outline-none text-sm transition-all bg-white";
  const inputStyle = { borderColor: '#EAD7D7', fontFamily: 'Poppins', color: '#2B1B1B' };
  const labelStyle = { color: '#9B7878', fontSize: '0.75rem', fontFamily: 'Poppins', letterSpacing: '0.05em', display: 'block', marginBottom: '6px' };

  if (success) {
    return (
      <div style={{ background: '#FAF7F5', minHeight: '100vh' }} className="flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl p-8 w-full max-w-md shadow-sm border text-center" style={{ borderColor: '#EAD7D7' }}>
          <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-6" style={{ background: '#dcfce7' }}>
            <CheckCircle size={24} style={{ color: '#16a34a' }} />
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#2B1B1B', fontSize: '1.8rem', marginBottom: '1rem' }}>Password Updated</h2>
          <p style={{ color: '#9B7878', fontFamily: 'Poppins', fontSize: '0.9rem', marginBottom: '2rem' }}>
            Your password has been successfully reset. Redirecting to login...
          </p>
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
        <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#2B1B1B', fontSize: '2rem', textAlign: 'center', marginBottom: '0.5rem' }}>New Password</h2>
        <p style={{ color: '#9B7878', fontFamily: 'Poppins', fontSize: '0.85rem', textAlign: 'center', marginBottom: '2rem' }}>
          Enter your new password below. Make sure it's at least 6 characters.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label style={labelStyle}>NEW PASSWORD</label>
            <input type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} className={inputClass} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>CONFIRM PASSWORD</label>
            <input type="password" required minLength={6} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className={inputClass} style={inputStyle} />
          </div>

          <button type="submit" disabled={loading} className="w-full py-4 rounded-xl text-white font-semibold flex items-center justify-center gap-2 mt-6 disabled:opacity-70 transition-all hover:shadow-lg" style={{ background: 'linear-gradient(135deg, #6D3B3B, #8B5050)', fontFamily: 'Poppins' }}>
            {loading ? 'Updating...' : <><Lock size={18} /> Reset Password</>}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
