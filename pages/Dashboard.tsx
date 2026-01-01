
import React, { useMemo, useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { PRODUCTS, BUNDLES, CURRENT_USER } from '../constants';
import { Product, Bundle } from '../types';
import { AdSlot } from '../components/AdSlot';

type DashboardTab = 'assets' | 'history' | 'support';

interface OrderRecord {
  orderId: string;
  date: string;
  title: string;
  price: number;
  status: string;
  method: string;
}

const Dashboard: React.FC = () => {
  const location = useLocation();
  const state = location.state as { purchasedId?: string; justPurchased?: boolean };
  const [userData, setUserData] = useState<{name: string, email: string} | null>(null);
  const [activeTab, setActiveTab] = useState<DashboardTab>('assets');
  const [readingProduct, setReadingProduct] = useState<Product | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  
  useEffect(() => {
    // If user is just guest or hasn't bought anything, we use CURRENT_USER as fallback for name/email
    const stored = localStorage.getItem('aashok_last_customer');
    if (stored) {
      setUserData(JSON.parse(stored));
    } else {
      setUserData({ name: CURRENT_USER.name, email: CURRENT_USER.email });
    }
  }, []);

  const allProducts = useMemo(() => {
    const stored = localStorage.getItem('aashok_products');
    return stored ? JSON.parse(stored) : PRODUCTS;
  }, []);

  const allBundles = useMemo(() => {
    const stored = localStorage.getItem('aashok_bundles');
    return stored ? JSON.parse(stored) : BUNDLES;
  }, []);

  const myPurchases = useMemo(() => {
    const storedIdsRaw = localStorage.getItem('aashok_purchased_assets');
    const purchasedIds: string[] = storedIdsRaw ? JSON.parse(storedIdsRaw) : [];
    const initial: Product[] = [];
    
    // Always include products already in CURRENT_USER.purchases for consistency
    const totalPurchased = [...new Set([...purchasedIds, ...CURRENT_USER.purchases])];

    totalPurchased.forEach(id => {
      if (id.startsWith('bundle-')) {
        const bId = id.replace('bundle-', '');
        const bundle = allBundles.find((b: Bundle) => b.id === bId);
        if (bundle) {
          bundle.productIds.forEach((pId: string) => {
            const p = allProducts.find((item: Product) => item.id === pId);
            if (p && !initial.find(existing => existing.id === p.id)) {
              initial.push(p);
            }
          });
        }
      } else {
        const p = allProducts.find((item: Product) => item.id === id);
        if (p && !initial.find(existing => existing.id === p.id)) {
          initial.push(p);
        }
      }
    });
    return initial;
  }, [allProducts, allBundles]);

  const purchaseHistory = useMemo((): OrderRecord[] => {
    const historyRaw = localStorage.getItem('aashok_purchase_history');
    return historyRaw ? JSON.parse(historyRaw) : [];
  }, [state]);

  const handleDownload = (p: Product) => {
    setDownloadingId(p.id);
    setTimeout(() => {
      const fileName = p.title.replace(/\s+/g, '-').toLowerCase() + (p.category === 'eBook' ? '.pdf' : '.zip');
      let fullContent = `AASHOKDIGITAL LICENSED ASSET\n\nLicensee: ${userData?.name || 'Owner'}\n\nAsset Title: ${p.title}\n\n${p.longDescription}\n\n[Full Secure Download Package - End of Document Content]`;
      const blob = new Blob([fullContent], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      setDownloadingId(null);
    }, 1500);
  };

  const getFileIcon = (category: string) => {
    switch (category) {
      case 'eBook': return 'fa-file-pdf text-red-500';
      case 'Course': return 'fa-file-video text-blue-500';
      case 'Template': return 'fa-file-code text-indigo-500';
      case 'Tool': return 'fa-file-zipper text-amber-500';
      default: return 'fa-file text-slate-400';
    }
  };

  const getFormatLabel = (category: string) => {
    switch (category) {
      case 'eBook': return 'PDF Document';
      case 'Course': return 'MP4 Video Pack';
      case 'Template': return 'Figma Source';
      case 'Tool': return 'Python/Zip Source';
      default: return 'Digital Asset';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 min-h-screen">
      {/* Top Banner Ad */}
      <AdSlot label="Limited Offer" className="mb-12" />

      <div className="flex flex-col md:flex-row gap-8 mb-12 items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-slate-900 mb-2">My Digital Workspace</h1>
          <p className="text-slate-500">Manage and access your high-performance assets.</p>
        </div>
        <div className="flex items-center gap-4 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
          <div className="text-right">
             <p className="font-black text-slate-900 text-sm">{userData?.name || 'User'}</p>
             <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest">{userData?.email || 'Individual Account'}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-indigo-100">
            {userData?.name ? userData.name.charAt(0) : 'U'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Nav */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-2 rounded-[2rem] border border-slate-100 shadow-sm space-y-1">
            <button onClick={() => setActiveTab('assets')} className={`w-full text-left px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.1em] flex items-center gap-3 transition-all ${activeTab === 'assets' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600'}`}>
               <i className="fas fa-layer-group text-sm"></i> My Assets
            </button>
            <button onClick={() => setActiveTab('history')} className={`w-full text-left px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.1em] flex items-center gap-3 transition-all ${activeTab === 'history' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600'}`}>
               <i className="fas fa-history text-sm"></i> Purchase History
            </button>
            <button onClick={() => setActiveTab('support')} className={`w-full text-left px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.1em] flex items-center gap-3 transition-all ${activeTab === 'support' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600'}`}>
               <i className="fas fa-headset text-sm"></i> Support
            </button>
          </div>
          <AdSlot label="Partner Network" className="bg-slate-900 border-none" />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {activeTab === 'assets' && (
            <div className="space-y-8 animate-fadeIn">
              {state?.justPurchased && (
                <div className="bg-green-50 border border-green-200 p-6 rounded-3xl flex items-center gap-4 animate-slideUp">
                  <div className="w-12 h-12 bg-green-500 text-white rounded-2xl flex items-center justify-center text-xl shadow-lg">
                    <i className="fas fa-check"></i>
                  </div>
                  <div>
                    <h3 className="font-black text-green-900">Purchase Authorized!</h3>
                    <p className="text-green-700 text-sm">Your new assets have been added to the library below.</p>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
                  <h2 className="font-black text-slate-900 uppercase text-xs tracking-[0.2em] flex items-center gap-2">
                    <i className="fas fa-shield-check text-indigo-600"></i> Licensed Assets
                  </h2>
                  <span className="bg-white px-3 py-1 rounded-full text-[10px] font-black text-slate-500 border border-slate-100">{myPurchases.length} Items</span>
                </div>
                
                <div className="divide-y divide-slate-100">
                  {myPurchases.length > 0 ? myPurchases.map((p) => (
                    <div key={p.id} className="p-8 group hover:bg-slate-50/30 transition-all duration-300">
                      <div className="flex flex-col md:flex-row items-center gap-8">
                        {/* Thumbnail */}
                        <div className="relative w-full md:w-32 h-40 shrink-0">
                          <img src={p.image} className="w-full h-full rounded-2xl object-cover shadow-2xl transition-transform duration-500 group-hover:scale-105" alt={p.title} />
                          <div className="absolute -bottom-3 -right-3 bg-white p-3 rounded-2xl shadow-xl border border-slate-100">
                            <i className={`fas ${getFileIcon(p.category)} text-xl`}></i>
                          </div>
                        </div>

                        {/* Details */}
                        <div className="flex-grow text-center md:text-left space-y-4">
                          <div>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                              <span className="bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border border-indigo-100">
                                {p.category}
                              </span>
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                <i className="fas fa-database text-[8px]"></i> {p.fileSize}
                              </span>
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                <i className="fas fa-file-signature text-[8px]"></i> {getFormatLabel(p.category)}
                              </span>
                            </div>
                            <h3 className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{p.title}</h3>
                            <p className="text-sm text-slate-500 line-clamp-2 mt-1">{p.description}</p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-3 w-full md:w-auto shrink-0">
                          <button 
                            onClick={() => setReadingProduct(p)} 
                            className="w-full px-8 py-3.5 bg-white text-slate-900 border border-slate-200 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 hover:border-indigo-200 transition-all flex items-center justify-center gap-2"
                          >
                             <i className="fas fa-eye text-indigo-600"></i> Preview Content
                          </button>
                          <button 
                            disabled={downloadingId === p.id} 
                            onClick={() => handleDownload(p)} 
                            className="w-full bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-indigo-600 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:bg-slate-400"
                          >
                             {downloadingId === p.id ? (
                               <><i className="fas fa-spinner fa-spin"></i> Fetching...</>
                             ) : (
                               <><i className="fas fa-download"></i> Secure Download</>
                             )}
                          </button>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="p-24 text-center">
                      <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-200 text-4xl mx-auto mb-6">
                        <i className="fas fa-folder-open"></i>
                      </div>
                      <p className="font-black uppercase text-xs tracking-widest text-slate-400 mb-6">No assets found in your library</p>
                      <Link to="/store" className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
                        Browse Marketplace
                      </Link>
                    </div>
                  )}
                </div>
              </div>
              <AdSlot label="Developer Tools" className="bg-slate-50 border-slate-200" />
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-8 animate-fadeIn">
              <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
                <div className="p-8 border-b border-slate-100 bg-slate-50/30 flex justify-between items-center">
                  <h2 className="font-black text-slate-900 uppercase text-xs tracking-widest flex items-center gap-2">
                    <i className="fas fa-receipt text-indigo-600"></i> Transaction History
                  </h2>
                </div>
                
                <div className="overflow-x-auto">
                  {purchaseHistory.length > 0 ? (
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                          <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Order Details</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Date</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Amount</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {purchaseHistory.map((order, i) => (
                          <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-8 py-6">
                              <p className="font-bold text-slate-900">{order.title}</p>
                              <p className="text-[10px] text-slate-400 uppercase font-black mt-1">ID: {order.orderId} • {order.method}</p>
                            </td>
                            <td className="px-8 py-6 text-sm text-slate-600 font-medium">
                              {order.date}
                            </td>
                            <td className="px-8 py-6 font-black text-slate-900">
                              ${order.price.toFixed(2)}
                            </td>
                            <td className="px-8 py-6">
                              <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-[10px] font-black uppercase border border-green-100">
                                {order.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="p-24 text-center text-slate-300">
                      <i className="fas fa-file-invoice-dollar text-5xl mb-4 opacity-20"></i>
                      <p className="font-black uppercase text-xs tracking-widest">No order history available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'support' && (
            <div className="bg-white rounded-[2.5rem] border border-slate-200 p-12 text-center shadow-sm space-y-6 animate-fadeIn">
               <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-[2rem] flex items-center justify-center text-3xl mx-auto border border-indigo-100 shadow-sm">
                  <i className="fas fa-headset"></i>
               </div>
               <div className="max-w-md mx-auto">
                 <h2 className="text-2xl font-black text-slate-900 mb-3">Premium Support</h2>
                 <p className="text-slate-500 mb-8 leading-relaxed">Our specialized support team is available 24/7 to assist with your digital assets and licensed products.</p>
                 <a href="mailto:ashokk52170@gmail.com" className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-indigo-600 transition-all flex items-center justify-center gap-3">
                   <i className="fas fa-paper-plane"></i> Contact Helpdesk
                 </a>
               </div>
            </div>
          )}
        </div>
      </div>

      {/* Improved Preview Modal */}
      {readingProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-[3rem] w-full max-w-6xl h-full flex flex-col overflow-hidden shadow-2xl animate-scaleIn">
             <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white z-10 shrink-0">
                <div className="flex items-center gap-5">
                  <div className={`w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 shadow-sm`}>
                    <i className={`fas ${getFileIcon(readingProduct.category)} text-2xl`}></i>
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 leading-tight">{readingProduct.title}</h2>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded-md">Preview Active</span>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{readingProduct.fileSize} • {getFormatLabel(readingProduct.category)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button 
                    disabled={downloadingId === readingProduct.id} 
                    onClick={() => handleDownload(readingProduct)} 
                    className="hidden sm:flex bg-indigo-600 text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all items-center gap-2"
                  >
                     <i className="fas fa-download"></i> {downloadingId === readingProduct.id ? 'Processing...' : 'Download Full File'}
                  </button>
                  <button onClick={() => setReadingProduct(null)} className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 border border-slate-200 transition-colors">
                    <i className="fas fa-times text-xl"></i>
                  </button>
                </div>
             </div>

             <div className="flex-grow bg-slate-50 overflow-y-auto p-4 md:p-12 scrollbar-hide">
                <div className="bg-white w-full max-w-4xl mx-auto shadow-2xl p-8 md:p-20 rounded-[3rem] border border-slate-100 min-h-full space-y-16">
                   <header className="pb-12 border-b-8 border-slate-50">
                     <div className="flex justify-between items-start mb-6">
                       <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.4em]">Confidential Production File</span>
                       <span className="text-[10px] font-black text-slate-300">REF-ID: {readingProduct.id.padStart(6, '0')}</span>
                     </div>
                     <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-[1.1] mb-8">{readingProduct.title}</h1>
                     <div className="flex flex-wrap gap-6 items-center text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                        <span className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 text-slate-600"><i className="fas fa-user-check text-indigo-500"></i> {userData?.name || 'Authorized Client'}</span>
                        <span className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 text-slate-600"><i className="fas fa-calendar text-indigo-500"></i> Issued {new Date().toLocaleDateString()}</span>
                        <span className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 text-slate-600"><i className="fas fa-tag text-indigo-500"></i> Lifetime License</span>
                     </div>
                   </header>

                   <section className="space-y-10">
                     <div className="p-10 bg-indigo-900 text-white rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        <h4 className="relative z-10 font-black text-indigo-300 text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                           <i className="fas fa-circle-info"></i> Abstract & Value Proposition
                        </h4>
                        <p className="relative z-10 text-xl font-medium leading-relaxed opacity-90 italic">
                          "{readingProduct.longDescription}"
                        </p>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-10">
                        <div className="space-y-6">
                           <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                              <i className="fas fa-list-check text-indigo-600"></i> Key Components
                           </h3>
                           <div className="space-y-4">
                             {readingProduct.features.map((f, i) => (
                               <div key={i} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-4 hover:border-indigo-200 transition-all group">
                                  <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white shadow-lg flex items-center justify-center font-black text-[10px] shrink-0">{i+1}</div>
                                  <p className="text-sm font-bold text-slate-700 leading-tight group-hover:text-indigo-900">{f}</p>
                               </div>
                             ))}
                           </div>
                        </div>
                        <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white flex flex-col justify-center items-center text-center space-y-6">
                           <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center text-3xl">
                             <i className="fas fa-microchip text-indigo-400"></i>
                           </div>
                           <h4 className="text-xl font-black">Ready for Production?</h4>
                           <p className="text-slate-400 text-sm max-w-xs">Download the full bundle to access technical blueprints, worksheets, and developer keys.</p>
                           <button onClick={() => handleDownload(readingProduct)} className="w-full py-4 bg-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-500 transition-all">
                              Start Full Download
                           </button>
                        </div>
                     </div>

                     <div className="pt-20 border-t border-slate-100 text-center opacity-30">
                        <p className="text-[10px] font-black uppercase tracking-[1.5em] text-slate-400">Secure AashokDigital Workspace Environment</p>
                     </div>
                   </section>
                </div>
             </div>
             
             {/* Bottom Ad In Preview */}
             <div className="bg-slate-950 p-6 border-t border-slate-800">
                <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                        <i className="fas fa-star text-sm"></i>
                      </div>
                      <p className="text-slate-300 text-xs font-medium">Looking for more? <strong>Upgrade to the Founder Bundle</strong> and save 40% on all future assets.</p>
                   </div>
                   <Link to="/store?category=Bundles" className="bg-white text-slate-900 px-6 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all">Explore Bundles</Link>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
