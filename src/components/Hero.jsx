import React from 'react';
import { Sparkles, Shield, Clock } from 'lucide-react';

export default function Hero({ selectedCategory, setSelectedCategory, categories }) {
  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-12 pt-8 pb-4">
      {/* Banner */}
      <div className="relative rounded-ios overflow-hidden bg-gradient-to-r from-woody-700 via-woody-600 to-nature-dark text-white p-8 md:p-12 shadow-xl">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80')] opacity-15 bg-cover bg-center mix-blend-overlay"></div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-nature-sage/30 backdrop-blur-md text-nature-cream text-xs font-medium mb-4 border border-nature-sage/40">
            <Sparkles className="w-3.5 h-3.5" /> iOS Designed Woody Nature Showroom
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-3">
            Handcrafted Organic Living & Furniture
          </h2>
          <p className="text-woody-200 text-sm md:text-base leading-relaxed mb-6">
            Explore authentic furniture crafted from sustainable woods. Interact directly with verified local shops, check live prices, and chat in real-time.
          </p>
          <div className="flex flex-wrap gap-4 text-xs font-medium text-woody-100">
            <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-lg backdrop-blur-sm">
              <Shield className="w-4 h-4 text-nature-sage" /> Verified Local Shops
            </div>
            <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-lg backdrop-blur-sm">
              <Clock className="w-4 h-4 text-nature-sage" /> Real-time Pricing & Stock
            </div>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto py-6 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shadow-sm ${
              selectedCategory === cat
                ? 'bg-woody-600 text-white shadow-md scale-105'
                : 'bg-white hover:bg-woody-100 text-woody-700 border border-woody-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}