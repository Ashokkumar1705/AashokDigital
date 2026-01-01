
import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PRODUCTS, BUNDLES } from '../constants';
import { Product, Bundle } from '../types';

type PaymentMethod = 'card' | 'paypal' | 'upi';
type CheckoutStage = 'form' | 'processing' | 'success';

const Checkout: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [stage, setStage] = useState<CheckoutStage>('form');
  const [processStep, setProcessStep] = useState(0);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

  const processingTexts = [
    "Connecting to secure payment gateway...",
    "Verifying payment credentials with bank...",
    "Authorizing transaction amount...",
    "Finalizing digital asset allocation...",
    "Generating secure license keys..."
  ];

  const allProducts = useMemo(() => {
    const stored = localStorage.getItem('aashok_products');
    return stored ? JSON.parse(stored) : PRODUCTS;
  }, []);

  const allBundles = useMemo(() => {
    const stored = localStorage.getItem('aashok_bundles');
    return stored ? JSON.parse(stored) : BUNDLES;
  }, []);

  const checkoutData = useMemo(() => {
    if (!id) return null;
    if (id.startsWith('bundle-')) {
      const bId = id.replace('bundle-', '');
      const bundle = allBundles.find((b: Bundle) => b.id === bId);
      if (!bundle) return null;
      return { id: bId, type: 'bundle', title: bundle.title, price: bundle.price || 0, image: bundle.image };
    } else {
      const product = allProducts.find((p: Product) => p.id === id);
      if (!product) return null;
      return { id: product.id, type: 'product', title: product.title, price: product.price || 0, image: product.image };
    }
  }, [id, allProducts, allBundles]);

  const handleCompletePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) return;
    
    if (paymentMethod === 'card' && (cardNumber.length < 16 || cvc.length < 3)) {
      alert("Please enter valid card details.");
      return;
    }

    setStage('processing');
    
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep >= processingTexts.length) {
        clearInterval(interval);
        
        // Final registration after all steps
        const existingPurchasesRaw = localStorage.getItem('aashok_purchased_assets');
        const purchasedIds: string[] = existingPurchasesRaw ? JSON.parse(existingPurchasesRaw) : [];
        if (!purchasedIds.includes(id || '')) {
          purchasedIds.push(id || '');
          localStorage.setItem('aashok_purchased_assets', JSON.stringify(purchasedIds));
        }

        // Detailed Transaction History
        const existingHistoryRaw = localStorage.getItem('aashok_purchase_history');
        const history = existingHistoryRaw ? JSON.parse(existingHistoryRaw) : [];
        const newOrder = {
          orderId: `NX-${Math.floor(Math.random() * 9000000) + 1000000}`,
          date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
          title: checkoutData?.title,
          price: checkoutData?.price,
          status: 'Paid & Delivered',
          method: paymentMethod.toUpperCase()
        };
        history.unshift(newOrder); // Newest first
        localStorage.setItem('aashok_purchase_history', JSON.stringify(history));

        localStorage.setItem('aashok_last_customer', JSON.stringify({ email, name }));
        setStage('success');
      } else {
        setProcessStep(currentStep);
      }
    }, 800);
  };

  if (!checkoutData) return <div className="p-20 text-center">Item not found</div>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 min-h-screen">
      {stage === 'form' && (
        <div className="flex flex-col lg:flex-row gap-12 animate-fadeIn">
          <div className="lg:w-2/3">
            <h1 className="text-3xl font-black text-slate-900 mb-8">Finalize Purchase</h1>
            <div className="bg-white rounded-[2.5rem] border border-slate-200 p-10 shadow-sm relative overflow-hidden">
              <form onSubmit={handleCompletePayment} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Name</label>
                    <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600/10" placeholder="Full Name" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Email</label>
                    <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600/10" placeholder="delivery@email.com" />
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <h3 className="font-bold text-slate-900 mb-6">Payment Method</h3>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {(['card', 'paypal', 'upi'] as const).map(m => (
                      <button key={m} type="button" onClick={() => setPaymentMethod(m)} className={`p-4 border-2 rounded-2xl flex flex-col items-center gap-2 transition-all ${paymentMethod === m ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-50 text-slate-400'}`}>
                        <i className={`fas ${m === 'card' ? 'fa-credit-card' : m === 'paypal' ? 'fa-paypal' : 'fa-mobile'} text-xl`}></i>
                        <span className="text-[10px] font-black uppercase">{m}</span>
                      </button>
                    ))}
                  </div>
                  
                  {paymentMethod === 'card' && (
                    <div className="space-y-4 animate-fadeIn">
                       <input required type="text" value={cardNumber} onChange={e => setCardNumber(e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-mono" placeholder="Card Number (16 Digits)" maxLength={16} />
                       <div className="grid grid-cols-2 gap-4">
                         <input required type="text" placeholder="MM/YY" className="px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl" />
                         <input required type="text" value={cvc} onChange={e => setCvc(e.target.value)} className="px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl" placeholder="CVC" maxLength={3} />
                       </div>
                    </div>
                  )}
                </div>

                <button type="submit" className="w-full bg-slate-900 text-white py-6 rounded-[1.75rem] font-black text-xl hover:bg-indigo-600 transition-all shadow-xl">
                  Pay Now & Unlock Assets
                </button>
              </form>
            </div>
          </div>
          <div className="lg:w-1/3">
            <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm sticky top-24">
              <h2 className="font-black text-indigo-600 mb-6 uppercase text-[10px] tracking-widest">Order Summary</h2>
              <div className="flex gap-4 mb-6">
                 <img src={checkoutData.image} className="w-20 h-20 rounded-xl object-cover" />
                 <div>
                    <h4 className="font-bold text-slate-900 text-sm leading-tight">{checkoutData.title}</h4>
                    <p className="text-2xl font-black mt-2">${checkoutData.price.toFixed(2)}</p>
                 </div>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed italic">By completing this purchase, you agree to our digital license terms.</p>
            </div>
          </div>
        </div>
      )}

      {stage === 'processing' && (
        <div className="flex flex-col items-center justify-center py-32 animate-fadeIn">
           <div className="relative w-24 h-24 mb-12">
              <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center text-indigo-600">
                 <i className="fas fa-shield-halved text-2xl"></i>
              </div>
           </div>
           <h2 className="text-2xl font-black text-slate-900 mb-3">Secure Gateway Processing</h2>
           <p className="text-slate-500 animate-pulse font-medium">{processingTexts[processStep]}</p>
        </div>
      )}

      {stage === 'success' && (
        <div className="flex flex-col items-center justify-center py-20 text-center animate-fadeIn">
           <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-5xl mb-8 shadow-xl shadow-green-100">
              <i className="fas fa-check"></i>
           </div>
           <h2 className="text-4xl font-black text-slate-900 mb-4">Payment Successful!</h2>
           <p className="text-slate-500 max-w-md mb-12">Your premium assets have been authorized and deployed to your personal library.</p>
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
              <button 
                onClick={() => navigate('/dashboard', { state: { justPurchased: true } })}
                className="bg-slate-900 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:scale-105 transition-all"
              >
                 Go to My Library
              </button>
              <Link to="/store" className="bg-white text-slate-900 border border-slate-200 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-50 transition-all text-center">
                 Store
              </Link>
           </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
