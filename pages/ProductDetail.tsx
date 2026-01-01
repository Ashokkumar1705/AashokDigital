
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { PRODUCTS, BUNDLES, CURRENT_USER } from '../constants';
import { AdSlot } from '../components/AdSlot';
import { Review, Product, Bundle } from '../types';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const allProducts = useMemo(() => {
    const stored = localStorage.getItem('aashok_products');
    return stored ? JSON.parse(stored) : PRODUCTS;
  }, []);

  const allBundles = useMemo(() => {
    const stored = localStorage.getItem('aashok_bundles');
    return stored ? JSON.parse(stored) : BUNDLES;
  }, []);

  const [product, setProduct] = useState<Product | undefined>(() => {
    return allProducts.find((p: Product) => p.id === id);
  });
  
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'faq'>('overview');
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Find bundles containing this product
  const relevantBundles = useMemo(() => {
    if (!product) return [];
    return allBundles.filter((b: Bundle) => b.productIds.includes(product.id));
  }, [product, allBundles]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h1 className="text-3xl font-bold">Product not found</h1>
        <Link to="/store" className="mt-4 inline-block text-indigo-600 font-bold">Back to Store</Link>
      </div>
    );
  }

  const hasPurchased = CURRENT_USER.purchases.includes(product.id);
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  const handlePurchase = () => {
    navigate(`/checkout/${product.id}`);
  };

  const handleBundlePurchase = (bundleId: string) => {
    navigate(`/checkout/bundle-${bundleId}`);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userComment.trim()) return;

    setIsSubmitting(true);
    
    setTimeout(() => {
      const newReview: Review = {
        id: 'rev-' + Date.now(),
        userName: CURRENT_USER.name,
        userAvatar: CURRENT_USER.avatar,
        rating: userRating,
        comment: userComment,
        date: new Date().toISOString().split('T')[0]
      };

      const updatedReviews = [newReview, ...product.reviews];
      const newReviewsCount = updatedReviews.length;
      const newRating = Number(((product.rating * product.reviewsCount + userRating) / newReviewsCount).toFixed(1));

      const updatedProduct = {
        ...product,
        reviews: updatedReviews,
        reviewsCount: newReviewsCount,
        rating: newRating
      };

      const index = allProducts.findIndex((p: Product) => p.id === product.id);
      if (index !== -1) {
        allProducts[index] = updatedProduct;
      } else {
        allProducts.push(updatedProduct);
      }
      localStorage.setItem('aashok_products', JSON.stringify(allProducts));

      setProduct(updatedProduct);
      setUserComment('');
      setUserRating(5);
      setIsSubmitting(false);
      setActiveTab('reviews');
    }, 800);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col lg:flex-row gap-12 mb-16">
        {/* Left: Visuals */}
        <div className="lg:w-2/3">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-white aspect-video mb-8">
            <img 
              src={product.image} 
              alt={product.title} 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex gap-4 border-b border-slate-200 mb-8">
            {['overview', 'reviews', 'faq'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`pb-4 px-2 font-bold capitalize transition-all border-b-2 ${
                  activeTab === tab ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500'
                }`}
              >
                {tab === 'reviews' ? `Reviews (${product.reviewsCount})` : tab}
              </button>
            ))}
          </div>

          <div className="prose prose-slate max-w-none mb-12">
            {activeTab === 'overview' && (
              <div className="animate-fadeIn">
                <h2 className="text-2xl font-bold mb-4">Detailed Description</h2>
                <p className="text-slate-600 leading-relaxed mb-6">
                  {product.longDescription}
                </p>
                {product.category === 'eBook' && (
                   <div className="bg-slate-50 p-6 rounded-2xl mb-8 flex flex-wrap gap-8">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Author</span>
                        <span className="font-bold text-slate-800">{product.author || 'Unknown'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Page Count</span>
                        <span className="font-bold text-slate-800">{product.pageCount || '--'} Pages</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">File Format</span>
                        <span className="font-bold text-slate-800">PDF / ePub</span>
                      </div>
                   </div>
                )}
                <h3 className="text-xl font-bold mb-4">Key Features</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-slate-700 m-0">
                      <i className="fas fa-check-circle text-green-500"></i>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {activeTab === 'reviews' && (
              <div className="animate-fadeIn space-y-10">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold">Customer Reviews</h2>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-black">{product.rating}</span>
                    <div className="flex flex-col">
                       <div className="flex text-yellow-400 text-xs">
                        {[...Array(5)].map((_, i) => <i key={i} className={`fas fa-star ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-slate-200'}`}></i>)}
                       </div>
                       <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tight">{product.reviewsCount} total</span>
                    </div>
                  </div>
                </div>

                {hasPurchased ? (
                  <div className="bg-white border border-slate-100 p-8 rounded-2xl shadow-sm mb-12">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Write a Review</h3>
                    <form onSubmit={handleSubmitReview} className="space-y-4">
                      <div className="flex items-center gap-4 mb-4">
                        <span className="text-sm font-bold text-slate-700">Your Rating:</span>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setUserRating(star)}
                              className={`text-xl transition-colors ${star <= userRating ? 'text-yellow-400' : 'text-slate-200'}`}
                            >
                              <i className="fas fa-star"></i>
                            </button>
                          ))}
                        </div>
                      </div>
                      <textarea
                        required
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition-all h-32"
                        placeholder="Tell us what you think about this product..."
                        value={userComment}
                        onChange={(e) => setUserComment(e.target.value)}
                      ></textarea>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold text-sm shadow-md hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center gap-2"
                      >
                        {isSubmitting ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-paper-plane"></i>}
                        Submit Review
                      </button>
                    </form>
                  </div>
                ) : (
                  <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl text-center mb-12">
                    <p className="text-slate-500 text-sm italic">You must purchase this product to leave a review.</p>
                  </div>
                )}

                <div className="space-y-6">
                  {product.reviews.length > 0 ? (
                    product.reviews.map(review => (
                      <div key={review.id} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <img src={review.userAvatar} className="w-10 h-10 rounded-full bg-slate-100" />
                            <div>
                              <span className="font-bold text-slate-900 block leading-tight">{review.userName}</span>
                              <span className="text-[10px] text-slate-400 uppercase tracking-widest">{review.date}</span>
                            </div>
                          </div>
                          <div className="flex text-yellow-400 text-[10px]">
                             {[...Array(5)].map((_, j) => <i key={j} className={`fas fa-star ${j < review.rating ? 'text-yellow-400' : 'text-slate-100'}`}></i>)}
                          </div>
                        </div>
                        <p className="text-slate-600 text-sm leading-relaxed">
                          "{review.comment}"
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10 opacity-40">
                      <i className="fas fa-comments text-4xl mb-3"></i>
                      <p>No reviews yet. Be the first!</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Bundle Upsell Section */}
          {relevantBundles.length > 0 && (
            <div className="mt-12 bg-gradient-to-br from-indigo-600 to-purple-700 p-8 rounded-[2.5rem] text-white shadow-xl shadow-indigo-100">
               <div className="flex items-center gap-2 mb-6">
                 <i className="fas fa-layer-group text-indigo-200"></i>
                 <span className="text-xs font-black uppercase tracking-widest text-indigo-100">Frequently Bought Together</span>
               </div>
               
               {relevantBundles.map(bundle => (
                 <div key={bundle.id} className="flex flex-col md:flex-row items-center gap-8">
                    <div className="flex -space-x-6">
                      {bundle.productIds.slice(0, 3).map((pId, idx) => {
                        const p = allProducts.find((item: Product) => item.id === pId);
                        return (
                          <div key={pId} className="w-24 h-32 rounded-xl overflow-hidden border-4 border-white shadow-lg rotate-[5deg] transition-transform hover:rotate-0 hover:z-10" style={{ transform: `rotate(${(idx - 1) * 5}deg)` }}>
                             <img src={p?.image} className="w-full h-full object-cover" />
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="flex-grow text-center md:text-left">
                       <h3 className="text-2xl font-black mb-2">{bundle.title}</h3>
                       <p className="text-indigo-100 text-sm mb-6 line-clamp-2 opacity-80">{bundle.description}</p>
                       <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
                          <span className="text-3xl font-black">${bundle.price}</span>
                          <span className="text-lg text-indigo-200 line-through opacity-60">${bundle.originalPrice}</span>
                          <span className="bg-white text-indigo-600 text-[10px] font-black px-2 py-1 rounded">BUNDLE & SAVE {Math.round((1 - bundle.price/bundle.originalPrice)*100)}%</span>
                       </div>
                    </div>
                    
                    <button 
                      onClick={() => handleBundlePurchase(bundle.id)}
                      className="shrink-0 bg-white text-indigo-600 px-8 py-4 rounded-2xl font-black shadow-lg hover:scale-105 active:scale-95 transition-all"
                    >
                      Buy Bundle
                    </button>
                 </div>
               ))}
            </div>
          )}
        </div>

        {/* Right: Conversion Sidebar */}
        <div className="lg:w-1/3">
          <div className="sticky top-24 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full uppercase tracking-widest">
                {product.category}
              </span>
              <div className="flex items-center text-xs text-slate-400">
                 <i className="fas fa-clock mr-1"></i> Instant Delivery
              </div>
            </div>

            <h1 className="text-3xl font-black text-slate-900 mb-4">{product.title}</h1>
            
            <div className="flex items-baseline gap-3 mb-8">
              <span className="text-4xl font-black text-slate-900">${product.price.toFixed(2)}</span>
              <span className="text-lg text-slate-400 line-through">${product.originalPrice.toFixed(2)}</span>
              <span className="text-green-600 font-bold text-sm bg-green-50 px-2 py-0.5 rounded">Save {discount}%</span>
            </div>

            <button 
              onClick={handlePurchase}
              className="w-full bg-indigo-600 text-white py-4 rounded-xl font-black text-lg shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all hover:-translate-y-1 mb-6 flex items-center justify-center gap-3"
            >
              Get Instant Access <i className="fas fa-bolt text-sm"></i>
            </button>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-indigo-600">
                   <i className="fas fa-file-arrow-down"></i>
                </div>
                <div>
                  <p className="font-bold text-slate-900">Digital Download</p>
                  <p className="text-xs">{product.fileSize}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-indigo-600">
                   <i className="fas fa-shield-halved"></i>
                </div>
                <div>
                  <p className="font-bold text-slate-900">Secure Purchase</p>
                  <p className="text-xs">SSL Encrypted Checkout</p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex justify-center gap-4 opacity-40">
              <i className="fab fa-cc-visa text-2xl"></i>
              <i className="fab fa-cc-mastercard text-2xl"></i>
              <i className="fab fa-cc-paypal text-2xl"></i>
              <i className="fab fa-cc-apple-pay text-2xl"></i>
            </div>
          </div>
          
          <AdSlot className="mt-8" label="Suggested Product" />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;