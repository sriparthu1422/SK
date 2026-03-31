import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Search, User, Menu, X, ChevronDown, LogOut, Heart, ArrowRight } from 'lucide-react';
import { selectCartCount, openDrawer } from '../redux/slices/cartSlice';
import { selectUser, logout } from '../redux/slices/authSlice';
import { selectWishlistCount } from '../redux/slices/wishlistSlice';

const categories = [
  { name: 'All Collections', path: '/collections', img: '/images/hero-banner.png' },
  { name: 'Silk Sarees', path: '/collections/Silk%20Sarees', img: '/images/category-silk.png' },
  { name: 'Cotton Sarees', path: '/collections/Cotton%20Sarees', img: '/images/category-cotton.png' },
  { name: 'Designer Sarees', path: '/collections/Designer%20Sarees', img: '/images/category-designer.png' },
  { name: 'Bridal Sarees', path: '/collections/Bridal%20Sarees', img: '/images/category-bridal.png' },
  { name: 'Festive Wear', path: '/collections/Traditional%20Wear', img: '/images/category-traditional.png' },
];

const POPULAR_SEARCHES = ['Kanjivaram Silk', 'Bridal Saree', 'Banarasi', 'Cotton Daily Wear', 'Designer Embroidered'];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [searchOverlayOpen, setSearchOverlayOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [userDropOpen, setUserDropOpen] = useState(false);
  const megaRef = useRef(null);
  const searchInputRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartCount = useSelector(selectCartCount);
  const wishlistCount = useSelector(selectWishlistCount);
  const user = useSelector(selectUser);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Focus search input when overlay opens
  useEffect(() => {
    if (searchOverlayOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [searchOverlayOpen]);

  // Close overlay on Escape key
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setSearchOverlayOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleSearch = (term) => {
    const q = (term || searchTerm).trim();
    if (q) {
      navigate(`/new-arrivals?search=${encodeURIComponent(q)}`);
      setSearchOverlayOpen(false);
      setSearchTerm('');
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors duration-200 relative group ${isActive ? 'text-accent' : 'text-dark hover:text-primary'}`;

  return (
    <>
      {/* ─── FULL-SCREEN SEARCH OVERLAY ─── */}
      <AnimatePresence>
        {searchOverlayOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[200] flex flex-col items-center justify-center px-6"
            style={{ background: 'rgba(43,27,27,0.97)', backdropFilter: 'blur(16px)' }}
          >
            {/* Close button */}
            <motion.button
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.15 }}
              onClick={() => { setSearchOverlayOpen(false); setSearchTerm(''); }}
              className="absolute top-8 right-8 w-12 h-12 rounded-full flex items-center justify-center border-2 text-white transition-all hover:bg-white hover:text-primary"
              style={{ borderColor: 'rgba(200,169,106,0.4)' }}
              aria-label="Close search"
            >
              <X size={22} />
            </motion.button>

            {/* Overlay content */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="w-full max-w-2xl"
            >
              <p style={{ color: '#C8A96A', fontSize: '0.8rem', letterSpacing: '0.3em', textTransform: 'uppercase', fontFamily: 'Poppins', textAlign: 'center', marginBottom: '1.5rem' }}>
                What are you looking for?
              </p>

              {/* Search Form */}
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Search sarees, fabrics, occasions..."
                  className="w-full text-xl outline-none bg-transparent border-b-2 pb-4 pr-14"
                  style={{
                    borderColor: '#C8A96A',
                    color: '#FAF7F5',
                    fontFamily: "'Playfair Display', serif",
                    caretColor: '#C8A96A',
                  }}
                />
                <button
                  type="submit"
                  className="absolute right-0 bottom-4 flex items-center gap-1 text-sm font-medium transition-all"
                  style={{ color: '#C8A96A', fontFamily: 'Poppins' }}
                >
                  <ArrowRight size={20} />
                </button>
              </form>

              {/* Popular searches */}
              <div className="mt-10">
                <p style={{ color: 'rgba(250,247,245,0.4)', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'Poppins', marginBottom: '1rem' }}>
                  Popular Searches
                </p>
                <div className="flex flex-wrap gap-3">
                  {POPULAR_SEARCHES.map(term => (
                    <motion.button
                      key={term}
                      onClick={() => handleSearch(term)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 rounded-full text-sm border transition-all"
                      style={{
                        borderColor: 'rgba(200,169,106,0.35)',
                        color: 'rgba(250,247,245,0.7)',
                        fontFamily: 'Poppins',
                        background: 'rgba(200,169,106,0.07)',
                      }}
                    >
                      {term}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── NAVBAR ─── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'bg-glass shadow-md py-2' : 'bg-white/95 py-4'
        }`}
        style={{ borderBottom: scrolled ? '1px solid #EAD7D7' : 'none' }}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between gap-4">

            {/* LEFT NAV */}
            <nav className="hidden lg:flex items-center gap-8 flex-1">
              <NavLink to="/" className={navLinkClass}>
                Home
                <span className="absolute -bottom-1 left-0 h-0.5 bg-accent w-0 group-hover:w-full transition-all duration-300" />
              </NavLink>
              <NavLink to="/new-arrivals" className={navLinkClass}>
                New Arrivals
                <span className="absolute -bottom-1 left-0 h-0.5 bg-accent w-0 group-hover:w-full transition-all duration-300" />
              </NavLink>
              <div
                className="relative"
                onMouseEnter={() => setMegaOpen(true)}
                onMouseLeave={() => setMegaOpen(false)}
                ref={megaRef}
              >
                <button className={`flex items-center gap-1 text-sm font-medium transition-colors duration-200 ${megaOpen ? 'text-primary' : 'text-dark hover:text-primary'}`}>
                  Collections <ChevronDown size={14} className={`transition-transform duration-200 ${megaOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {megaOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[600px] bg-white rounded-2xl shadow-2xl border border-secondary p-6"
                      style={{ borderColor: '#EAD7D7' }}
                    >
                      <div className="grid grid-cols-3 gap-3">
                        {categories.map((cat) => (
                          <Link
                            key={cat.name}
                            to={cat.path}
                            onClick={() => setMegaOpen(false)}
                            className="group flex flex-col items-center gap-2 p-2 rounded-xl hover:bg-secondary transition-colors duration-200"
                          >
                            <div className="w-16 h-16 rounded-xl overflow-hidden">
                              <img src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                            </div>
                            <span className="text-xs text-center font-medium text-dark group-hover:text-primary transition-colors">{cat.name}</span>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <NavLink to="/contact" className={navLinkClass}>
                Contact
                <span className="absolute -bottom-1 left-0 h-0.5 bg-accent w-0 group-hover:w-full transition-all duration-300" />
              </NavLink>
            </nav>

            {/* CENTER LOGO */}
            <Link to="/" className="flex-shrink-0 flex flex-col items-center">
              <div
                className="w-12 h-12 rounded-full border-2 flex items-center justify-center"
                style={{ borderColor: '#C8A96A', background: 'linear-gradient(135deg, #FAF7F5, #EAD7D7)' }}
              >
                <span style={{ fontFamily: "'Playfair Display', serif", color: '#6D3B3B', fontSize: '1.1rem', fontWeight: '700' }}>SK</span>
              </div>
              <span style={{
                fontFamily: "'Playfair Display', serif",
                color: '#2B1B1B',
                fontSize: '0.65rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                marginTop: '2px',
              }}>
                Sri Kanakadhara
              </span>
            </Link>

            {/* RIGHT ICONS */}
            <div className="hidden lg:flex items-center gap-2 flex-1 justify-end">
              {/* Always-visible desktop search bar */}
              <form
                onSubmit={handleSearchSubmit}
                className="flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-200 mr-2"
                style={{ borderColor: '#EAD7D7', background: '#FAF7F5', width: '210px' }}
              >
                <Search size={15} style={{ color: '#9B7878', flexShrink: 0 }} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Search sarees..."
                  onFocus={() => setSearchOverlayOpen(true)}
                  className="bg-transparent outline-none text-sm flex-1 min-w-0"
                  style={{ fontFamily: 'Poppins', color: '#2B1B1B' }}
                  readOnly
                />
              </form>

              {/* Wishlist */}
              <Link to="/wishlist" className="relative flex items-center justify-center w-9 h-9 rounded-full hover:bg-secondary transition-colors" aria-label="Wishlist">
                <Heart size={20} style={{ color: wishlistCount > 0 ? '#C8696B' : '#2B1B1B' }} fill={wishlistCount > 0 ? '#C8696B' : 'none'} />
                {wishlistCount > 0 && (
                  <motion.span
                    key={wishlistCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-white text-xs flex items-center justify-center font-bold"
                    style={{ background: '#C8696B', fontSize: '0.6rem' }}
                  >
                    {wishlistCount}
                  </motion.span>
                )}
              </Link>

              {/* User */}
              <div className="relative">
                <button
                  onClick={() => setUserDropOpen(!userDropOpen)}
                  className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-secondary transition-colors text-dark hover:text-primary"
                  aria-label="Account"
                >
                  <User size={20} />
                </button>
                <AnimatePresence>
                  {userDropOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl border"
                      style={{ borderColor: '#EAD7D7' }}
                    >
                      {user ? (
                        <>
                          <div className="px-4 py-3 border-b" style={{ borderColor: '#EAD7D7' }}>
                            <p className="text-xs font-semibold text-dark">{user.name}</p>
                            <p className="text-xs text-muted truncate">{user.email}</p>
                          </div>
                          <Link to="/profile" onClick={() => setUserDropOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-secondary transition-colors">
                            <User size={14} style={{ color: '#6D3B3B' }} /> My Profile
                          </Link>
                          <Link to="/my-orders" onClick={() => setUserDropOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-secondary transition-colors">
                            <ShoppingBag size={14} style={{ color: '#6D3B3B' }} /> My Orders
                          </Link>
                          <Link to="/wishlist" onClick={() => setUserDropOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-secondary transition-colors">
                            <Heart size={14} style={{ color: '#C8696B' }} /> Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
                          </Link>
                          {user.role === 'admin' && (
                            <Link to="/admin" onClick={() => setUserDropOpen(false)} className="block px-4 py-2.5 text-sm hover:bg-secondary transition-colors border-t" style={{ borderColor: '#EAD7D7' }}>Admin Panel</Link>
                          )}
                          <button
                            onClick={() => { dispatch(logout()); setUserDropOpen(false); }}
                            className="w-full text-left px-4 py-2.5 text-sm text-primary flex items-center gap-2 hover:bg-secondary transition-colors border-t"
                            style={{ borderColor: '#EAD7D7' }}
                          >
                            <LogOut size={14} /> Logout
                          </button>
                        </>
                      ) : (
                        <>
                          <Link to="/login" onClick={() => setUserDropOpen(false)} className="block px-4 py-3 text-sm hover:bg-secondary transition-colors">Login</Link>
                          <Link to="/signup" onClick={() => setUserDropOpen(false)} className="block px-4 py-3 text-sm hover:bg-secondary transition-colors border-t" style={{ borderColor: '#EAD7D7' }}>Create Account</Link>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Cart */}
              <button onClick={() => dispatch(openDrawer())} className="relative flex items-center justify-center w-9 h-9 rounded-full hover:bg-secondary transition-colors text-dark hover:text-primary" aria-label="Cart">
                <ShoppingBag size={22} />
                {cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-white text-xs flex items-center justify-center font-bold"
                    style={{ background: '#6D3B3B' }}
                  >
                    {cartCount}
                  </motion.span>
                )}
              </button>
            </div>

            {/* Mobile: search icon + menu button */}
            <div className="flex lg:hidden items-center gap-3">
              <button onClick={() => setSearchOverlayOpen(true)} className="text-dark" aria-label="Search">
                <Search size={22} />
              </button>
              <button onClick={() => setMenuOpen(!menuOpen)} className="text-dark" aria-label="Menu">
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden bg-white border-t overflow-hidden"
              style={{ borderColor: '#EAD7D7' }}
            >
              <div className="container-custom py-4 flex flex-col gap-1">
                {[
                  { to: '/', label: 'Home' },
                  { to: '/new-arrivals', label: 'New Arrivals' },
                  { to: '/collections', label: 'Collections' },
                  { to: '/wishlist', label: `Wishlist${wishlistCount > 0 ? ` (${wishlistCount})` : ''}` },
                  { to: '/contact', label: 'Contact' },
                ].map(({ to, label }) => (
                  <NavLink key={to} to={to} onClick={() => setMenuOpen(false)}
                    className="text-dark font-medium text-sm py-3 border-b"
                    style={{ borderColor: '#EAD7D7', fontFamily: 'Poppins' }}>
                    {label}
                  </NavLink>
                ))}
                {user && (
                  <>
                    <NavLink to="/profile" onClick={() => setMenuOpen(false)}
                      className="text-dark font-medium text-sm py-3 border-b"
                      style={{ borderColor: '#EAD7D7', fontFamily: 'Poppins' }}>
                      My Profile
                    </NavLink>
                    <NavLink to="/my-orders" onClick={() => setMenuOpen(false)}
                      className="text-dark font-medium text-sm py-3 border-b"
                      style={{ borderColor: '#EAD7D7', fontFamily: 'Poppins' }}>
                      My Orders
                    </NavLink>
                  </>
                )}
                <div className="flex gap-4 pt-3">
                  {user ? (
                    <button onClick={() => { dispatch(logout()); setMenuOpen(false); }}
                      className="text-sm font-medium text-primary flex items-center gap-1" style={{ fontFamily: 'Poppins' }}>
                      <LogOut size={14} /> Logout
                    </button>
                  ) : (
                    <Link to="/login" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-primary" style={{ fontFamily: 'Poppins' }}>Login</Link>
                  )}
                  <button onClick={() => { dispatch(openDrawer()); setMenuOpen(false); }} className="flex items-center gap-1 text-sm font-medium text-dark" style={{ fontFamily: 'Poppins' }}>
                    <ShoppingBag size={16} /> Cart {cartCount > 0 && `(${cartCount})`}
                  </button>
                </div>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>
      <div style={{ height: '80px' }} />
    </>
  );
}
