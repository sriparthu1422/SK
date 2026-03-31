import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, MessageCircle, Clock, Send } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    // Simulate submission (replace with real email API)
    await new Promise(r => setTimeout(r, 1500));
    toast.success('Message sent! We will get back to you soon.');
    setForm({ name: '', email: '', phone: '', message: '' });
    setSending(false);
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border outline-none transition-all duration-200 text-sm";
  const inputStyle = { borderColor: '#EAD7D7', fontFamily: 'Poppins', color: '#2B1B1B', background: 'white' };

  return (
    <div style={{ background: '#FAF7F5', minHeight: '100vh' }}>
      {/* Header */}
      <section
        style={{ background: 'linear-gradient(135deg, #2B1B1B 0%, #6D3B3B 100%)' }}
        className="py-20 text-center"
      >
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p style={{ color: '#C8A96A', fontSize: '0.8rem', letterSpacing: '0.3em', textTransform: 'uppercase', fontFamily: 'Poppins' }}>We'd Love to Hear from You</p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", color: '#FAF7F5', fontSize: '3rem', marginTop: '0.5rem' }}>Contact Us</h1>
          <div style={{ width: '60px', height: '1px', background: 'linear-gradient(90deg, transparent, #C8A96A, transparent)', margin: '1rem auto' }} />
        </motion.div>
      </section>

      <div className="container-custom py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* ─── CONTACT FORM ─── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl p-8 shadow-sm"
            style={{ border: '1px solid #EAD7D7' }}
          >
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', color: '#2B1B1B', marginBottom: '0.5rem' }}>Send a Message</h2>
            <p style={{ color: '#9B7878', fontFamily: 'Poppins', fontSize: '0.875rem', marginBottom: '2rem' }}>
              Have a question about a saree? Want to place a custom order? We're here to help.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label style={{ color: '#9B7878', fontSize: '0.75rem', fontFamily: 'Poppins', letterSpacing: '0.05em' }}>FULL NAME *</label>
                <input
                  name="name" value={form.name} onChange={handleChange} required
                  placeholder="Your name"
                  className={inputClass}
                  style={{ ...inputStyle, marginTop: '6px' }}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={{ color: '#9B7878', fontSize: '0.75rem', fontFamily: 'Poppins', letterSpacing: '0.05em' }}>EMAIL *</label>
                  <input
                    name="email" type="email" value={form.email} onChange={handleChange} required
                    placeholder="your@email.com"
                    className={inputClass}
                    style={{ ...inputStyle, marginTop: '6px' }}
                  />
                </div>
                <div>
                  <label style={{ color: '#9B7878', fontSize: '0.75rem', fontFamily: 'Poppins', letterSpacing: '0.05em' }}>PHONE</label>
                  <input
                    name="phone" value={form.phone} onChange={handleChange}
                    placeholder="+91 00000 00000"
                    className={inputClass}
                    style={{ ...inputStyle, marginTop: '6px' }}
                  />
                </div>
              </div>
              <div>
                <label style={{ color: '#9B7878', fontSize: '0.75rem', fontFamily: 'Poppins', letterSpacing: '0.05em' }}>MESSAGE *</label>
                <textarea
                  name="message" value={form.message} onChange={handleChange} required
                  placeholder="Tell us about your enquiry..."
                  rows={5}
                  className={inputClass}
                  style={{ ...inputStyle, marginTop: '6px', resize: 'vertical' }}
                />
              </div>
              <motion.button
                type="submit"
                disabled={sending}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl text-white font-semibold transition-all disabled:opacity-70"
                style={{ background: 'linear-gradient(135deg, #6D3B3B, #8B5050)', fontFamily: 'Poppins' }}
              >
                {sending ? 'Sending...' : <><Send size={18} /> Send Message</>}
              </motion.button>
            </form>
          </motion.div>

          {/* ─── CONTACT INFO ─── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* WhatsApp */}
            <a
              href="https://wa.me/919999999999?text=Hi%20Sri%20Kanakadhara!%20I%20have%20a%20query."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group"
              style={{ background: '#25D366', border: '1px solid #25D366' }}
            >
              <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <MessageCircle size={28} color="white" />
              </div>
              <div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", color: 'white', fontSize: '1.1rem' }}>Chat on WhatsApp</h3>
                <p style={{ color: 'rgba(255,255,255,0.85)', fontFamily: 'Poppins', fontSize: '0.875rem' }}>Quick replies · +91 99999 99999</p>
              </div>
            </a>

            {/* Store Info */}
            <div className="bg-white rounded-2xl p-6 shadow-sm" style={{ border: '1px solid #EAD7D7' }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", color: '#2B1B1B', fontSize: '1.3rem', marginBottom: '1.5rem' }}>Visit Our Studio</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#EAD7D7' }}>
                    <MapPin size={18} style={{ color: '#6D3B3B' }} />
                  </div>
                  <div>
                    <p style={{ fontFamily: 'Poppins', fontWeight: '600', color: '#2B1B1B', fontSize: '0.875rem' }}>Address</p>
                    <p style={{ color: '#9B7878', fontFamily: 'Poppins', fontSize: '0.875rem', lineHeight: 1.6, marginTop: '2px' }}>
                      Sri Kanakadhara Designer Studio<br />
                      Main Street, Coimbatore<br />
                      Tamil Nadu - 641001
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#EAD7D7' }}>
                    <Phone size={18} style={{ color: '#6D3B3B' }} />
                  </div>
                  <div>
                    <p style={{ fontFamily: 'Poppins', fontWeight: '600', color: '#2B1B1B', fontSize: '0.875rem' }}>Phone</p>
                    <a href="tel:+919999999999" style={{ color: '#9B7878', fontFamily: 'Poppins', fontSize: '0.875rem' }}>+91 99999 99999</a>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#EAD7D7' }}>
                    <Mail size={18} style={{ color: '#6D3B3B' }} />
                  </div>
                  <div>
                    <p style={{ fontFamily: 'Poppins', fontWeight: '600', color: '#2B1B1B', fontSize: '0.875rem' }}>Email</p>
                    <a href="mailto:hello@srikanakadhara.com" style={{ color: '#9B7878', fontFamily: 'Poppins', fontSize: '0.875rem' }}>hello@srikanakadhara.com</a>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#EAD7D7' }}>
                    <Clock size={18} style={{ color: '#6D3B3B' }} />
                  </div>
                  <div>
                    <p style={{ fontFamily: 'Poppins', fontWeight: '600', color: '#2B1B1B', fontSize: '0.875rem' }}>Store Hours</p>
                    <p style={{ color: '#9B7878', fontFamily: 'Poppins', fontSize: '0.875rem' }}>Mon–Sat: 10AM – 8PM</p>
                    <p style={{ color: '#9B7878', fontFamily: 'Poppins', fontSize: '0.875rem' }}>Sunday: 11AM – 6PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map placeholder */}
            <div className="rounded-2xl overflow-hidden shadow-sm" style={{ height: '220px', background: '#EAD7D7', border: '1px solid #EAD7D7' }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125322.72513993898!2d76.91348!3d11.00683!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba8578059e5e729%3A0x79d28bce1a82c5f2!2sCoimbatore%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1610000000000!5m2!1sen!2sin"
                width="100%" height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title="Store Location"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
