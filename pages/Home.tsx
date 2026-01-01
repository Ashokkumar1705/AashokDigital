
import React from 'react';
import { Link } from 'react-router-dom';
import { PRODUCTS, TESTIMONIALS } from '../constants';
import { ProductCard } from '../components/ProductCard';
import { AdSlot } from '../components/AdSlot';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col gap-16 md:gap-24 pb-20">
      {/* Hero Section */}
      <section className="relative pt-16 md:pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 hero-bg -z-10 opacity-10"></div>
        <div className="max-w-6xl mx-auto text-center">
          <span className="inline-block px-4 py-1.5 mb-6 text-sm font-bold tracking-wider text-indigo-600 uppercase bg-indigo-50 rounded-full">
            Premium Digital Marketplace
          </span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 mb-6">
            Level up your <span className="gradient-text">Digital Game</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-600 mb-10 leading-relaxed">
            Premium eBooks, design systems, and specialized tools built for creators, founders, and developers. Start scaling your business today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/store" 
              className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all hover:-translate-y-1 text-lg"
            >
              Browse Products
            </Link>
            <Link 
              to="/store?category=Course" 
              className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 border border-slate-200 font-bold rounded-xl hover:bg-slate-50 transition-all text-lg"
            >
              View Courses
            </Link>
          </div>
          
          <div className="mt-16 flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale">
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-8" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-6" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b7/Google_Pay_Logo.svg" alt="GPay" className="h-6" />
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-6 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-3xl font-black text-slate-900 mb-2">Editor's Choice</h2>
            <p className="text-slate-500">Hand-picked assets for maximum growth.</p>
          </div>
          <Link to="/store" className="text-indigo-600 font-bold hover:underline flex items-center gap-1">
            View All Products <i className="fas fa-chevron-right text-xs"></i>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRODUCTS.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-slate-900 text-white py-20 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="p-6">
            <div className="w-16 h-16 bg-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-indigo-400">
              <i className="fas fa-bolt text-3xl"></i>
            </div>
            <h3 className="text-xl font-bold mb-3">Instant Delivery</h3>
            <p className="text-slate-400">Get your downloads immediately after payment via secure link.</p>
          </div>
          <div className="p-6">
            <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-purple-400">
              <i className="fas fa-lock text-3xl"></i>
            </div>
            <h3 className="text-xl font-bold mb-3">Secure Payments</h3>
            <p className="text-slate-400">Industry standard 256-bit SSL encrypted payments for safety.</p>
          </div>
          <div className="p-6">
            <div className="w-16 h-16 bg-pink-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-pink-400">
              <i className="fas fa-rotate text-3xl"></i>
            </div>
            <h3 className="text-xl font-bold mb-3">Lifetime Updates</h3>
            <p className="text-slate-400">Buy once, get all future versions and fixes for free.</p>
          </div>
        </div>
      </section>

      {/* Ad Break */}
      <section className="max-w-4xl mx-auto px-6 w-full">
        <AdSlot />
      </section>

      {/* Testimonials */}
      <section className="max-w-6xl mx-auto px-6 w-full">
        <h2 className="text-3xl font-black text-slate-900 text-center mb-16">Trusted by 10,000+ Creators</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm relative">
              <div className="flex items-center gap-4 mb-6">
                <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full" />
                <div>
                  <h4 className="font-bold text-slate-900">{t.name}</h4>
                  <p className="text-sm text-slate-500">{t.role}</p>
                </div>
              </div>
              <p className="text-slate-600 italic leading-relaxed">"{t.content}"</p>
              <div className="absolute top-8 right-8 opacity-10">
                <i className="fas fa-quote-right text-4xl"></i>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-6xl mx-auto px-6 w-full pb-10">
        <div className="bg-indigo-600 rounded-[2rem] p-12 md:p-20 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
          <h2 className="text-4xl md:text-5xl font-black mb-6">Ready to upgrade your business?</h2>
          <p className="text-indigo-100 text-lg mb-10 max-w-xl mx-auto">
            Join thousands of satisfied customers and get instant access to our premium assets.
          </p>
          <Link 
            to="/store" 
            className="inline-block bg-white text-indigo-600 px-10 py-4 rounded-xl font-black text-lg shadow-xl hover:scale-105 transition-transform"
          >
            Go to Store
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;