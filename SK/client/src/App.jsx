import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { store } from './redux/store';

import Loader from './components/Loader';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';

import Home from './pages/Home';
import NewArrivals from './pages/NewArrivals';
import Collections from './pages/Collections';
import ProductDetail from './pages/ProductDetail';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Wishlist from './pages/Wishlist';
import MyOrders from './pages/MyOrders';
import Profile from './pages/Profile';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AdminDashboard from './pages/admin/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

function AppContent() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loader />;

  return (
    <>
      <Navbar />
      <CartDrawer />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/new-arrivals" element={<NewArrivals />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/collections/:category" element={<Collections />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/my-orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
        </Routes>
      </main>
      <Footer />
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        theme="colored"
        toastStyle={{ background: '#6D3B3B', color: '#FAF7F5' }}
      />
    </>
  );
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  );
}

export default App;
