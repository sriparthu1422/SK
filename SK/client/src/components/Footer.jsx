import { Link } from 'react-router-dom';
import { Share2, Phone, MapPin, Mail, Heart } from 'lucide-react';

const footerCategories = ['Kanjivaram Silk', 'Banarasi', 'Designer', 'Bridal', 'Cotton', 'Chanderi', 'Daily Wear'];

export default function Footer() {
  return (
    <footer style={{ background: '#2B1B1B', color: '#EAD7D7' }}>
      {/* Main Footer */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-full border-2 flex items-center justify-center" style={{ borderColor: '#C8A96A' }}>
                <span style={{ fontFamily: "'Playfair Display', serif", color: '#C8A96A', fontSize: '1rem', fontWeight: '700' }}>SK</span>
              </div>
              <div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", color: '#FAF7F5', fontSize: '1rem' }}>Sri Kanakadhara</h3>
                <p style={{ color: '#C8A96A', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Designer Studio</p>
              </div>
            </div>
            <p style={{ color: '#9B7878', fontSize: '0.875rem', lineHeight: '1.7', fontFamily: 'Poppins' }}>
              Elegance woven into every thread. Bringing you the finest collection of traditional and contemporary Indian sarees since 2010.
            </p>
            <div style={{ width: '50px', height: '1px', background: 'linear-gradient(90deg, transparent, #C8A96A, transparent)', margin: '1.5rem 0' }} />
            <div className="flex gap-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors" style={{ color: '#9B7878' }}>
                <Share2 size={20} />
              </a>
              <a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors" style={{ color: '#9B7878' }}>
                <Phone size={20} />
              </a>
            </div>
          </div>

          {/* Collections */}
          <div>
            <h4 style={{ fontFamily: "'Playfair Display', serif", color: '#FAF7F5', fontSize: '1rem', marginBottom: '1rem' }}>Collections</h4>
            <ul className="space-y-2.5">
              {footerCategories.map((cat) => (
                <li key={cat}>
                  <Link
                    to={`/collections/${cat}`}
                    style={{ color: '#9B7878', fontSize: '0.875rem', fontFamily: 'Poppins' }}
                    className="hover:text-accent transition-colors"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontFamily: "'Playfair Display', serif", color: '#FAF7F5', fontSize: '1rem', marginBottom: '1rem' }}>Quick Links</h4>
            <ul className="space-y-2.5">
              {[
                { to: '/new-arrivals', label: 'New Arrivals' },
                { to: '/collections', label: 'All Collections' },
                { to: '/contact', label: 'Contact Us' },
                { to: '/login', label: 'My Account' },
                { to: '/cart', label: 'Shopping Bag' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} style={{ color: '#9B7878', fontSize: '0.875rem', fontFamily: 'Poppins' }} className="hover:text-accent transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontFamily: "'Playfair Display', serif", color: '#FAF7F5', fontSize: '1rem', marginBottom: '1rem' }}>Visit Us</h4>
            <div className="space-y-3">
              <div className="flex gap-3">
                <MapPin size={16} style={{ color: '#C8A96A', flexShrink: 0, marginTop: '2px' }} />
                <p style={{ color: '#9B7878', fontSize: '0.875rem', fontFamily: 'Poppins', lineHeight: '1.6' }}>
                  Sri Kanakadhara Designer Studio,<br />
                  Main Street, Coimbatore,<br />
                  Tamil Nadu - 641001
                </p>
              </div>
              <div className="flex gap-3 items-center">
                <Phone size={16} style={{ color: '#C8A96A', flexShrink: 0 }} />
                <a href="tel:+919999999999" style={{ color: '#9B7878', fontSize: '0.875rem', fontFamily: 'Poppins' }} className="hover:text-accent transition-colors">
                  +91 99999 99999
                </a>
              </div>
              <div className="flex gap-3 items-center">
                <Mail size={16} style={{ color: '#C8A96A', flexShrink: 0 }} />
                <a href="mailto:hello@srikanakadhara.com" style={{ color: '#9B7878', fontSize: '0.875rem', fontFamily: 'Poppins' }} className="hover:text-accent transition-colors">
                  hello@srikanakadhara.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ borderTop: '1px solid rgba(155, 120, 120, 0.2)' }}>
        <div className="container-custom py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p style={{ color: '#9B7878', fontSize: '0.8rem', fontFamily: 'Poppins' }}>
            © {new Date().getFullYear()} Sri Kanakadhara Designer Studio. All rights reserved.
          </p>
          <p style={{ color: '#9B7878', fontSize: '0.8rem', fontFamily: 'Poppins' }} className="flex items-center gap-1">
            Made with <Heart size={12} fill="#C8A96A" stroke="#C8A96A" /> in India
          </p>
        </div>
      </div>
    </footer>
  );
}
