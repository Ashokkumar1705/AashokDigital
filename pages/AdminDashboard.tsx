
import React, { useState, useEffect } from 'react';
import { PRODUCTS, BUNDLES, CURRENT_USER } from '../constants';
import { Product, Category, Bundle } from '../types';
import { Link, useNavigate } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'products' | 'bundles'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingBundle, setEditingBundle] = useState<Bundle | null>(null);

  // Form states (Products)
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [category, setCategory] = useState<Category>('eBook');
  const [image, setImage] = useState('');
  const [features, setFeatures] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [author, setAuthor] = useState('');
  const [pageCount, setPageCount] = useState('');

  // Form states (Bundles)
  const [bundleTitle, setBundleTitle] = useState('');
  const [bundleDesc, setBundleDesc] = useState('');
  const [bundlePrice, setBundlePrice] = useState('');
  const [bundleOriginal, setBundleOriginal] = useState('');
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  useEffect(() => {
    // SECURITY: Strictly allow only 'owner' role
    if (CURRENT_USER.role !== 'owner') {
      console.warn("Unauthorized access attempt to Admin Panel.");
      navigate('/dashboard');
      return;
    }
    const storedP = localStorage.getItem('aashok_products');
    setProducts(storedP ? JSON.parse(storedP) : PRODUCTS);
    const storedB = localStorage.getItem('aashok_bundles');
    setBundles(storedB ? JSON.parse(storedB) : BUNDLES);
  }, [navigate]);

  const resetProductForm = () => {
    setEditingProduct(null);
    setTitle('');
    setDescription('');
    setPrice('');
    setOriginalPrice('');
    setCategory('eBook');
    setImage('https://picsum.photos/seed/new/800/600');
    setFeatures('');
    setDownloadUrl('');
    setAuthor('');
    setPageCount('');
  };

  const resetBundleForm = () => {
    setEditingBundle(null);
    setBundleTitle('');
    setBundleDesc('');
    setBundlePrice('');
    setBundleOriginal('');
    setSelectedProductIds([]);
  };

  const openAddModal = () => {
    if (activeTab === 'products') {
      resetProductForm();
    } else {
      resetBundleForm();
    }
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setTitle(p.title || '');
    setDescription(p.description || '');
    setPrice(p.price?.toString() || '0');
    setOriginalPrice(p.originalPrice?.toString() || '0');
    setCategory(p.category || 'eBook');
    setImage(p.image || '');
    setFeatures(p.features ? p.features.join(', ') : '');
    setDownloadUrl(p.downloadUrl || '');
    setAuthor(p.author || '');
    setPageCount(p.pageCount?.toString() || '');
    setIsModalOpen(true);
  };

  const openEditBundleModal = (b: Bundle) => {
    setEditingBundle(b);
    setBundleTitle(b.title || '');
    setBundleDesc(b.description || '');
    setBundlePrice(b.price?.toString() || '0');
    setBundleOriginal(b.originalPrice?.toString() || '0');
    setSelectedProductIds(b.productIds || []);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this product? This will also remove it from any bundles.')) {
      const updatedP = products.filter(p => p.id !== id);
      const updatedB = bundles.map(b => ({
        ...b,
        productIds: b.productIds.filter(pid => pid !== id)
      }));
      setProducts(updatedP);
      setBundles(updatedB);
      localStorage.setItem('aashok_products', JSON.stringify(updatedP));
      localStorage.setItem('aashok_bundles', JSON.stringify(updatedB));
    }
  };

  const handleDeleteBundle = (id: string) => {
    if (window.confirm('Delete this bundle?')) {
      const updatedB = bundles.filter(b => b.id !== id);
      setBundles(updatedB);
      localStorage.setItem('aashok_bundles', JSON.stringify(updatedB));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'products') {
      const newProduct: Product = {
        id: editingProduct ? editingProduct.id : 'p-' + Date.now(),
        title,
        description,
        price: parseFloat(price) || 0,
        originalPrice: parseFloat(originalPrice) || 0,
        category,
        image,
        features: features.split(',').map(f => f.trim()).filter(f => f),
        rating: editingProduct ? editingProduct.rating : 5,
        reviewsCount: editingProduct ? editingProduct.reviewsCount : 0,
        longDescription: description,
        fileSize: category === 'eBook' ? '12MB PDF' : '45MB ZIP',
        downloadUrl,
        author,
        pageCount: parseInt(pageCount) || undefined,
        reviews: editingProduct ? editingProduct.reviews : []
      };

      let updatedP = editingProduct 
        ? products.map(p => p.id === editingProduct.id ? newProduct : p)
        : [newProduct, ...products];

      setProducts(updatedP);
      localStorage.setItem('aashok_products', JSON.stringify(updatedP));
    } else {
      const newBundle: Bundle = {
        id: editingBundle ? editingBundle.id : 'b-' + Date.now(),
        title: bundleTitle,
        description: bundleDesc,
        price: parseFloat(bundlePrice) || 0,
        originalPrice: parseFloat(bundleOriginal) || 0,
        productIds: selectedProductIds,
        image: editingBundle ? editingBundle.image : 'https://picsum.photos/seed/bundle/800/600'
      };

      let updatedB = editingBundle
        ? bundles.map(b => b.id === editingBundle.id ? newBundle : b)
        : [newBundle, ...bundles];

      setBundles(updatedB);
      localStorage.setItem('aashok_bundles', JSON.stringify(updatedB));
    }
    setIsModalOpen(false);
  };

  const toggleProductInBundle = (id: string) => {
    setSelectedProductIds(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Inventory Control</h1>
          <p className="text-slate-500">Authorized administrative dashboard for product management.</p>
        </div>
        <div className="flex gap-4">
           <div className="flex bg-slate-100 p-1 rounded-2xl">
              <button 
                onClick={() => setActiveTab('products')}
                className={`px-8 py-2.5 rounded-xl text-sm font-black transition-all ${activeTab === 'products' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-indigo-600'}`}
              >
                Products
              </button>
              <button 
                onClick={() => setActiveTab('bundles')}
                className={`px-8 py-2.5 rounded-xl text-sm font-black transition-all ${activeTab === 'bundles' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-indigo-600'}`}
              >
                Bundles
              </button>
           </div>
           <button 
             onClick={openAddModal}
             className="bg-indigo-600 text-white px-8 py-2.5 rounded-xl font-black flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
           >
             <i className="fas fa-plus"></i> New {activeTab === 'products' ? 'Product' : 'Bundle'}
           </button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          {activeTab === 'products' ? (
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Product Identity</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Category</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Revenue (Price)</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map(product => (
                  <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <img src={product.image} className="w-12 h-12 rounded-xl object-cover shadow-sm" alt={product.title} />
                        <div>
                          <p className="font-black text-slate-900 leading-tight">{product.title}</p>
                          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mt-1">ID: {product.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-lg uppercase tracking-widest border border-indigo-100">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                             {product.downloadUrl ? <><i className="fas fa-check-circle text-green-500"></i> Active Link</> : <><i className="fas fa-times-circle text-red-500"></i> Missing Link</>}
                          </span>
                       </div>
                    </td>
                    <td className="px-8 py-6 font-black text-slate-900 text-lg">
                      ${(product.price || 0).toFixed(2)}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openEditModal(product)} className="w-10 h-10 flex items-center justify-center text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"><i className="fas fa-edit"></i></button>
                        <button onClick={() => handleDelete(product.id)} className="w-10 h-10 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-xl transition-all"><i className="fas fa-trash-can"></i></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Bundle Identity</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Composition</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Price</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bundles.map(bundle => (
                  <tr key={bundle.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <img src={bundle.image} className="w-12 h-12 rounded-xl object-cover shadow-sm" alt={bundle.title} />
                        <div>
                          <p className="font-black text-slate-900 leading-tight">{bundle.title}</p>
                          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mt-1">Bundle-ID: {bundle.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                         <span className="font-black text-slate-900 bg-slate-100 px-3 py-1 rounded-lg text-xs">{bundle.productIds?.length || 0}</span>
                         <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Digital Items</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 font-black text-slate-900 text-lg">
                      ${(bundle.price || 0).toFixed(2)}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openEditBundleModal(bundle)} className="w-10 h-10 flex items-center justify-center text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"><i className="fas fa-edit"></i></button>
                        <button onClick={() => handleDeleteBundle(bundle.id)} className="w-10 h-10 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-xl transition-all"><i className="fas fa-trash-can"></i></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Unified Management Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-[3rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-scaleIn scrollbar-hide">
            <div className="p-10 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-3xl font-black text-slate-900">
                {activeTab === 'products' 
                  ? (editingProduct ? 'Edit Product' : 'Add New Product')
                  : (editingBundle ? 'Edit Bundle' : 'Create Bundle')}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-100 text-slate-400 hover:text-slate-900 hover:bg-slate-200 transition-all">
                 <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-10 space-y-8">
              {activeTab === 'products' ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Internal Title</label>
                      <input required type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Category</label>
                      <select value={category} onChange={e => setCategory(e.target.value as Category)} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all font-bold">
                        <option value="eBook">Premium eBook</option>
                        <option value="Course">Video Course</option>
                        <option value="Template">Design Template</option>
                        <option value="Tool">Automation Tool</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Image Source URL</label>
                      <input required type="text" value={image} onChange={e => setImage(e.target.value)} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none" placeholder="https://..." />
                    </div>
                    
                    {category === 'eBook' && (
                      <>
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Author Name</label>
                          <input type="text" value={author} onChange={e => setAuthor(e.target.value)} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Page Count</label>
                          <input type="number" value={pageCount} onChange={e => setPageCount(e.target.value)} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none" />
                        </div>
                      </>
                    )}

                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Download Path/URL</label>
                      <input required type="text" value={downloadUrl} onChange={e => setDownloadUrl(e.target.value)} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none" placeholder="/assets/download.zip" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Sale Price ($)</label>
                      <input required type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-lg" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Full Description</label>
                      <textarea required value={description} onChange={e => setDescription(e.target.value)} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none h-40 resize-none" />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Bundle Campaign Title</label>
                      <input required type="text" value={bundleTitle} onChange={e => setBundleTitle(e.target.value)} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl" placeholder="E.g. Full Growth Suite" />
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Discounted Price ($)</label>
                        <input required type="number" step="0.01" value={bundlePrice} onChange={e => setBundlePrice(e.target.value)} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-black text-xl text-indigo-600" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Full Value Price ($)</label>
                        <input required type="number" step="0.01" value={bundleOriginal} onChange={e => setBundleOriginal(e.target.value)} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Bundle Composition (Select Items)</label>
                      <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto p-6 border border-slate-100 rounded-[2rem] bg-slate-50 shadow-inner">
                        {products.map(p => (
                          <label key={p.id} className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all border-2 ${selectedProductIds.includes(p.id) ? 'bg-white border-indigo-600 shadow-md' : 'bg-transparent border-transparent hover:bg-white'}`}>
                             <input 
                               type="checkbox" 
                               checked={selectedProductIds.includes(p.id)} 
                               onChange={() => toggleProductInBundle(p.id)}
                               className="w-5 h-5 rounded-lg text-indigo-600 focus:ring-indigo-500"
                             />
                             <div className="flex-grow">
                                <span className="text-sm font-black text-slate-900 block">{p.title}</span>
                                <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">${(p.price || 0).toFixed(2)} • {p.category}</span>
                             </div>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Bundle Description</label>
                      <textarea required value={bundleDesc} onChange={e => setBundleDesc(e.target.value)} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl h-32 resize-none" />
                    </div>
                  </div>
                </>
              )}
              <div className="flex justify-end gap-4 pt-8 border-t border-slate-50">
                 <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-4 font-black text-slate-500 hover:text-slate-900 transition-colors uppercase text-xs tracking-widest">Discard</button>
                 <button type="submit" className="bg-slate-900 text-white px-12 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-indigo-600 transition-all hover:scale-105">
                    {editingProduct || editingBundle ? 'Sync Changes' : 'Initialize Asset'}
                 </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
