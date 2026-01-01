
import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Store from './pages/Store';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import { CURRENT_USER } from './constants';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const Header = () => {
  const location = useLocation();
  const isTransparent = location.pathname === '/';
  const isOwner = CURRENT_USER.role === 'owner';

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${isTransparent ? 'bg-slate-50/80 backdrop-blur-md border-b border-slate-100' : 'bg-white border-b border-slate-100 shadow-sm'}`}>
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white rotate-3 group-hover:rotate-0 transition-transform">
            <i className="fas fa-cubes text-xl"></i>
          </div>
          <span className="text-xl font-black tracking-tight text-slate-900">Aashok<span className="text-indigo-600">Digital</span></span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link to="/store" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">Browse Marketplace</Link>
          {isOwner && (
            <Link to="/admin" className="text-sm font-bold text-indigo-600 flex items-center gap-1.5 px-3 py-1 bg-indigo-50 rounded-full border border-indigo-100">
              <i className="fas fa-crown text-[10px]"></i> Admin Panel
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50">
            <i className="fas fa-folder-open"></i> My Library
          </Link>
          <Link to="/store" className="hidden sm:inline-block bg-slate-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95">
            Store
          </Link>
        </div>
      </div>
    </header>
  );
};

const Footer = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setEmail('');
      setTimeout(() => setStatus('idle'), 3000);
    }, 1500);
  };

  return (
    <footer className="bg-white border-t border-slate-200 pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <div className="col-span-1 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                <i className="fas fa-cubes text-lg"></i>
              </div>
              <span className="text-xl font-black text-slate-900">AashokDigital</span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              Building the world's most trusted marketplace for premium digital assets. Join our community of 50,000+ creators.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-colors">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-colors">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-colors">
                <i className="fab fa-github"></i>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6 uppercase text-xs tracking-widest text-indigo-600">Categories</h4>
            <ul className="space-y-4">
              <li><Link to="/store?category=eBook" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors font-medium">Premium eBooks</Link></li>
              <li><Link to="/store?category=Template" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors font-medium">Design Templates</Link></li>
              <li><Link to="/store?category=Tool" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors font-medium">Automation Tools</Link></li>
              <li><Link to="/store?category=Course" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors font-medium">Video Courses</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6 uppercase text-xs tracking-widest text-indigo-600">Support</h4>
            <ul className="space-y-4">
              <li><a href="mailto:ashokk52170@gmail.com" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors font-medium">Direct Support</a></li>
              <li><a href="#" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors font-medium">Success Stories</a></li>
              <li><a href="#" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors font-medium">Affiliate Program</a></li>
              <li><a href="#" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors font-medium">Help Center</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6 uppercase text-xs tracking-widest text-indigo-600">Stay Updated</h4>
            <p className="text-sm text-slate-500 mb-4">Get the latest assets and growth tips weekly.</p>
            <form onSubmit={handleSubscribe} className="relative group">
              <input 
                required
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email" 
                className="bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl text-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all pr-12" 
              />
              <button 
                type="submit"
                disabled={status !== 'idle'}
                className="absolute right-1 top-1 bottom-1 bg-indigo-600 text-white px-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors disabled:bg-slate-300"
              >
                {status === 'loading' ? <i className="fas fa-spinner fa-spin"></i> : 
                 status === 'success' ? <i className="fas fa-check"></i> : 
                 <i className="fas fa-paper-plane"></i>}
              </button>
            </form>
            {status === 'success' && <p className="text-[10px] text-green-600 mt-2 font-bold animate-pulse">Successfully subscribed!</p>}
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-400">© 2024 AashokDigital Marketplace. Built for conversion.</p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-slate-400 hover:text-indigo-600">Privacy Policy</a>
            <a href="#" className="text-xs text-slate-400 hover:text-indigo-600">Terms of Service</a>
            <a href="#" className="text-xs text-slate-400 hover:text-indigo-600">Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col selection:bg-indigo-100 selection:text-indigo-600">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/store" element={<Store />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/checkout/:id" element={<Checkout />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;