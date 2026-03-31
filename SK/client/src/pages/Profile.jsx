import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { selectUser, updateUser, clearError } from '../redux/slices/authSlice';
import { toast } from 'react-toastify';
import { User, MapPin, Lock, Phone } from 'lucide-react';

export default function Profile() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const loading = useSelector(state => state.auth.loading);
  const error = useSelector(state => state.auth.error);

  const [form, setForm] = useState({
    name: '',
    phone: '',
    password: '',
    address: { street: '', city: '', state: '', pincode: '' }
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        phone: user.phone || '',
        password: '',
        address: user.address || { street: '', city: '', state: '', pincode: '' }
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (['street', 'city', 'state', 'pincode'].includes(name)) {
      setForm(f => ({ ...f, address: { ...f.address, [name]: value } }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    
    // Create an update payload
    const payload = {
      name: form.name,
      phone: form.phone,
      address: form.address,
    };
    if (form.password) payload.password = form.password;

    try {
      await dispatch(updateUser(payload)).unwrap();
      toast.success('Profile updated successfully!');
      setForm(f => ({ ...f, password: '' }));
    } catch (err) {
      toast.error(err || 'Failed to update profile');
    }
  };

  const inputClass = "w-full text-sm px-4 py-3 rounded-xl border outline-none transition-all duration-200 mt-1";
  const inputStyle = { borderColor: '#EAD7D7', fontFamily: 'Poppins', color: '#2B1B1B', background: 'white' };
  const labelStyle = { color: '#9B7878', fontSize: '0.75rem', fontFamily: 'Poppins', letterSpacing: '0.05em', textTransform: 'uppercase' };

  return (
    <div style={{ background: '#FAF7F5', minHeight: '100vh', paddingTop: '4rem' }}>
      <div className="container-custom py-16 max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 style={{ fontFamily: "'Playfair Display', serif", color: '#2B1B1B', fontSize: '2.5rem' }}>My Profile</h1>
          <p style={{ color: '#9B7878', fontFamily: 'Poppins', marginTop: '0.5rem' }}>Manage your account settings and preferences.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl p-8 shadow-sm border" style={{ borderColor: '#EAD7D7' }}>
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Personal Info */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <User size={18} style={{ color: '#6D3B3B' }} />
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', color: '#2B1B1B' }}>Personal Information</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label style={labelStyle}>Full Name</label>
                  <input name="name" value={form.name} onChange={handleChange} required className={inputClass} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Phone Number</label>
                  <input name="phone" value={form.phone} onChange={handleChange} className={inputClass} style={inputStyle} />
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <MapPin size={18} style={{ color: '#6D3B3B' }} />
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', color: '#2B1B1B' }}>Shipping Address</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label style={labelStyle}>Street Address</label>
                  <input name="street" value={form.address.street} onChange={handleChange} className={inputClass} style={inputStyle} />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-1">
                    <label style={labelStyle}>City</label>
                    <input name="city" value={form.address.city} onChange={handleChange} className={inputClass} style={inputStyle} />
                  </div>
                  <div className="col-span-1">
                    <label style={labelStyle}>State</label>
                    <input name="state" value={form.address.state} onChange={handleChange} className={inputClass} style={inputStyle} />
                  </div>
                  <div className="col-span-1">
                    <label style={labelStyle}>PIN Code</label>
                    <input name="pincode" value={form.address.pincode} onChange={handleChange} className={inputClass} style={inputStyle} />
                  </div>
                </div>
              </div>
            </div>

            {/* Security */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Lock size={18} style={{ color: '#6D3B3B' }} />
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', color: '#2B1B1B' }}>Security</h2>
              </div>
              <div>
                <label style={labelStyle}>Update Password</label>
                <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Leave blank to keep current password" minLength={6} className={inputClass} style={inputStyle} />
              </div>
            </div>

            <div className="pt-4 border-t" style={{ borderColor: '#EAD7D7' }}>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl text-white font-semibold transition-all disabled:opacity-70"
                style={{ background: 'linear-gradient(135deg, #6D3B3B, #8B5050)', fontFamily: 'Poppins' }}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
