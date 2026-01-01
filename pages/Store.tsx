
import React, { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { PRODUCTS, BUNDLES } from '../constants';
import { ProductCard } from '../components/ProductCard';
import { Category, Product, Bundle } from '../types';
import { AdSlot } from '../components/AdSlot';

const categories: (Category | 'All' | 'Bundles')[] = ['All', 'Bundles', 'eBook', 'Course', 'Template', 'Tool'];

const Store: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const activeCategory = (searchParams.get('category') as Category | 'All' | 'Bundles') || 'All';
  const [searchQuery, setSearchQuery] = useState('');

  const allProducts = useMemo(() => {
    const stored = localStorage.getItem('aashok_products');
    return stored ? JSON.parse(stored) : PRODUCTS;
  }, []);

  const allBundles = useMemo(() => {
    const stored = localStorage.getItem('aashok_bundles');
    return stored ? JSON.parse(stored) : BUNDLES;
  }, []);

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'Bundles') return [];
    return allProducts.filter((p: Product) => {
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery, allProducts]);

  const filteredBundles = useMemo(() => {
    if (activeCategory !== 'All' && activeCategory !== 'Bundles') return [];
    return allBundles.filter((b: Bundle) => {
      return b.title.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [activeCategory, searchQuery, allBundles]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 min-h-screen">
      {/* Marketplace Top Banner Ad */}
      <AdSlot label="Featured Marketplace Partner" className="mb-12 bg-slate-900 border-none rounded-3xl" />

      <div className="mb-12">
        <h1 className="text-4xl font-black text-slate-900 mb-4">Product Catalog</h1>
        <p className="text-slate-600">Discover premium digital assets to accelerate your career.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-64 shrink-0 flex flex-col gap-8">
          <div>
            <h3 className="font-bold text-slate-900 mb-4 uppercase text-xs tracking-widest">Search</h3>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search catalog..."
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-slate-900 mb-4 uppercase text-xs tracking-widest">Collections</h3>
            <div className="flex flex-col gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSearchParams({ category: cat })}
                  className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeCategory === cat 
                      ? 'bg-indigo-600 text-white shadow-md' 
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {cat === 'All' ? 'All Assets' : cat}
                </button>
              ))}
            </div>
          </div>

          <AdSlot label="Sponsored" />
        </div>

        <div className="flex-grow">
          {(activeCategory === 'All' || activeCategory === 'Bundles') && filteredBundles.length > 0 && (
            <div className="mb-12">
              <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">Featured Bundles</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 {filteredBundles.map(bundle => (
                   <div key={bundle.id} className="group bg-slate-900 rounded-3xl p-6 text-white overflow-hidden relative border border-slate-700 hover:border-indigo-500 transition-all">
                      <h3 className="text-xl font-black mb-2">{bundle.title}</h3>
                      <p className="text-slate-400 text-xs mb-6 line-clamp-2">{bundle.description}</p>
                      <div className="flex items-center justify-between">
                         <span className="text-2xl font-black">${bundle.price}</span>
                         <button onClick={() => navigate(`/checkout/bundle-${bundle.id}`)} className="bg-white text-slate-900 px-4 py-2 rounded-xl font-black text-xs">Buy Bundle</button>
                      </div>
                   </div>
                 ))}
              </div>
            </div>
          )}

          {activeCategory !== 'Bundles' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Store;
