
import React from 'react';

interface AdSlotProps {
  className?: string;
  label?: string;
}

export const AdSlot: React.FC<AdSlotProps> = ({ className = '', label = 'Featured Partner' }) => {
  return (
    <div className={`relative overflow-hidden group bg-gradient-to-r from-slate-900 to-indigo-950 rounded-2xl p-6 shadow-xl border border-slate-800 ${className}`}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-500/20 transition-colors"></div>
      
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center border border-white/10">
            <i className="fas fa-rocket text-indigo-400 text-xl"></i>
          </div>
          <div>
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] block mb-1">{label}</span>
            <h4 className="text-white font-bold text-lg leading-tight">Host Your Digital Assets with 0% Fees</h4>
            <p className="text-slate-400 text-xs mt-1">Join the waitlist for AashokCloud hosting.</p>
          </div>
        </div>
        
        <button 
          onClick={() => alert("Redirecting to partner site...")}
          className="shrink-0 bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-black text-sm hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20 active:scale-95 whitespace-nowrap"
        >
          Learn More <i className="fas fa-external-link-alt ml-2 text-[10px]"></i>
        </button>
      </div>
    </div>
  );
};