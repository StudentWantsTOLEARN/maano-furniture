import React, { useState } from 'react';
import { 
  X, 
  ShoppingBag, 
  Store, 
  CheckCircle2, 
  ShieldCheck, 
  Star, 
  Sparkles, 
  MapPin,
  ChevronRight,
  Clock
} from 'lucide-react';

export default function ProductModal({ 
  product, 
  isOpen, 
  onClose, 
  onReserveProduct,
  onOpenChat 
}) {
  const [selectedColor, setSelectedColor] = useState(0);

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/65 backdrop-blur-md animate-fadeIn overflow-y-auto">
      
      {/* Modal Card Wrapper */}
      <div className="relative w-full max-w-md sm:max-w-xl md:max-w-3xl lg:max-w-4xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-woody-200 overflow-hidden my-auto max-h-[92vh] flex flex-col md:flex-row">
        
        {/* Floating Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 z-20 p-2 rounded-full bg-slate-900/70 text-white hover:bg-slate-900 transition shadow-md backdrop-blur-xs"
          aria-label="Close Product View"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* 1. PRODUCT IMAGE CONTAINER (Responsive Scale) */}
        <div className="w-full md:w-1/2 bg-stone-100 flex items-center justify-center relative min-h-[220px] max-h-[35vh] md:max-h-none shrink-0 overflow-hidden">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover object-center"
          />
          
          {/* Category & Stock Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
            <span className="px-2.5 py-1 bg-white/90 backdrop-blur-md text-woody-900 text-[10px] sm:text-xs font-black rounded-lg shadow-sm border border-woody-200 uppercase tracking-wider">
              {product.category || 'Living Room'}
            </span>
            <span className={`px-2.5 py-1 text-[10px] sm:text-xs font-extrabold rounded-lg shadow-sm flex items-center gap-1 ${
              product.inStock 
                ? 'bg-emerald-600 text-white' 
                : 'bg-rose-600 text-white'
            }`}>
              <CheckCircle2 className="w-3 h-3" />
              {product.inStock ? `In Stock (${product.stockCount || 10})` : 'Out of Stock'}
            </span>
          </div>

          {/* Shop Tag */}
          <div className="absolute bottom-3 left-3 right-3 bg-slate-900/80 backdrop-blur-md text-white p-2 sm:p-2.5 rounded-xl border border-slate-700/80 flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <Store className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="text-[11px] sm:text-xs font-bold truncate">
                {product.shopName || 'Maano Woodcraft Palawan'}
              </span>
            </div>
            <span className="text-[9px] sm:text-[10px] bg-amber-400/20 text-amber-300 font-extrabold px-2 py-0.5 rounded-md border border-amber-400/30 shrink-0">
              Verified Shop
            </span>
          </div>
        </div>

        {/* 2. PRODUCT DETAILS & ACTIONS (Scrollable Viewport) */}
        <div className="w-full md:w-1/2 p-4 sm:p-6 flex flex-col justify-between overflow-y-auto max-h-[55vh] md:max-h-[92vh] bg-white">
          
          <div className="space-y-3.5 sm:space-y-5">
            
            {/* Header / Title */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-[10px] sm:text-xs font-bold text-amber-800 tracking-wider uppercase flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  Authentic Handcrafted Wood
                </span>
                
                {/* Rating */}
                <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span className="text-[11px] font-extrabold text-amber-950">{product.rating || '5.0'}</span>
                </div>
              </div>

              <h2 className="text-lg sm:text-2xl font-black text-slate-900 leading-tight">
                {product.name}
              </h2>
            </div>

            {/* Pricing Section */}
            <div className="flex items-baseline gap-2 bg-stone-50 p-3 rounded-2xl border border-stone-200">
              <span className="text-xl sm:text-2xl font-black text-rose-700">
                ₱{product.price?.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-xs sm:text-sm text-slate-400 line-through font-medium">
                  ₱{product.originalPrice?.toLocaleString()}
                </span>
              )}
              <span className="ml-auto text-[10px] sm:text-xs font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                Direct Shop Price
              </span>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-[11px] sm:text-xs font-black text-slate-800 uppercase tracking-wider mb-1">
                Product Description
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {product.description || 'Handcrafted actual product uploaded directly by shop owner using sustainable hardwood materials.'}
              </p>
            </div>

            {/* Finish Options */}
            {product.availableColors && product.availableColors.length > 0 && (
              <div>
                <h4 className="text-[11px] sm:text-xs font-black text-slate-800 uppercase tracking-wider mb-1.5">
                  Available Finish Options
                </h4>
                <div className="flex flex-wrap gap-2">
                  {product.availableColors.map((colorName, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedColor(idx)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition ${
                        selectedColor === idx
                          ? 'bg-slate-900 text-amber-400 border border-slate-700 shadow-sm'
                          : 'bg-stone-100 text-slate-700 border border-stone-200 hover:bg-stone-200'
                      }`}
                    >
                      {colorName}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Shop Pickup & Guarantee Notes */}
            <div className="space-y-1.5 pt-1 border-t border-stone-100">
              <div className="flex items-center gap-2 text-[11px] sm:text-xs text-slate-600">
                <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Pickup Location: <strong>Puerto Princesa City, Palawan</strong></span>
              </div>
              <div className="flex items-center gap-2 text-[11px] sm:text-xs text-slate-600">
                <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Instant reservation with verification PIN</span>
              </div>
            </div>

          </div>

          {/* 3. FOOTER ACTION BUTTONS */}
          <div className="pt-4 mt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center gap-2">
            
            {/* Reserve Item / Add to Cart */}
            <button
              onClick={() => {
                if (onReserveProduct) onReserveProduct(product);
                onClose();
              }}
              disabled={!product.inStock}
              className="w-full sm:flex-1 py-3 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl transition shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Reserve & Add to Cart</span>
            </button>

            {/* Directly Inquire Shop Owner */}
            <button
              onClick={() => {
                onClose();
                if (onOpenChat) onOpenChat();
              }}
              className="w-full sm:w-auto py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-900 font-extrabold text-xs sm:text-sm rounded-xl transition border border-slate-300 flex items-center justify-center gap-1.5 shrink-0"
            >
              <span>Inquire Shop</span>
              <ChevronRight className="w-4 h-4" />
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}