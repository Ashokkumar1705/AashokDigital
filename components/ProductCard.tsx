
import React from 'react';
import { Product } from '../types';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <Link to={`/product/${product.id}`} className="block relative aspect-video overflow-hidden">
        <img 
          src={product.image} 
          alt={product.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="bg-white/90 backdrop-blur px-2 py-1 rounded-md text-xs font-bold text-slate-800 shadow-sm">
            {product.category}
          </span>
          {discount > 0 && (
            <span className="bg-green-500 px-2 py-1 rounded-md text-xs font-bold text-white shadow-sm">
              {discount}% OFF
            </span>
          )}
        </div>
      </Link>
      
      <div className="p-5">
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <i key={i} className={`fas fa-star text-[10px] ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-slate-300'}`}></i>
          ))}
          <span className="text-xs text-slate-500 ml-1">({product.reviewsCount})</span>
        </div>
        
        <Link to={`/product/${product.id}`}>
          <h3 className="font-bold text-lg text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
            {product.title}
          </h3>
        </Link>
        
        <p className="text-sm text-slate-600 line-clamp-2 mb-4">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
          <div className="flex flex-col">
            <span className="text-2xl font-black text-slate-900">${product.price.toFixed(2)}</span>
            <span className="text-xs text-slate-400 line-through">${product.originalPrice.toFixed(2)}</span>
          </div>
          <Link 
            to={`/product/${product.id}`}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold text-sm transition-all hover:bg-indigo-700 active:scale-95 flex items-center gap-2"
          >
            Buy Now <i className="fas fa-arrow-right text-[10px]"></i>
          </Link>
        </div>
      </div>
    </div>
  );
};
