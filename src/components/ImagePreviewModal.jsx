import React from 'react';
import { 
  X, 
  Store, 
  ShoppingBag, 
  MessageSquare, 
  CheckCircle2, 
  Sparkles,
  ShieldCheck,
  Trees,
  Hammer,
  Layers
} from 'lucide-react';

export default function ImagePreviewModal({ 
  isOpen, 
  onClose, 
  product, 
  onReserveProduct, 
  onOpenChat 
}) {
  if (!isOpen || !product) return null;

  // Infer or use owner-provided wood material specs
  const getWoodMaterialSpecs = (item) => {
    if (item.woodSpecies || item.durability || item.finishType || item.craftsmanship) {
      return {
        species: item.woodSpecies || 'Philippine Hardwood',
        durability: item.durability || 'Termite-Treated & Kiln-Dried',
        finish: item.finishType || 'Natural Clear Eco Polish',
        craftsmanship: item.craftsmanship || 'Master Carpenter Hand-Assembled'
      };
    }

    const text = `${item.name} ${item.description || ''} ${item.category || ''}`.toLowerCase();

    if (text.includes('yantok') || text.includes('rattan')) {
      return {
        species: 'Natural Palawan Yantok / Rattan',
        durability: 'High Flexibility & Moisture Resistant',
        finish: 'Natural Clear Eco-Matte Polish',
        craftsmanship: 'Hand-woven Traditional Weave'
      };
    } else if (text.includes('narra')) {
      return {
        species: 'Philippine Solid Narra Hardwood',
        durability: 'Class-A Termite & Rot Resistant',
        finish: 'Hand-Rubbed Deep Amber Satin Finish',
        craftsmanship: 'Mortise & Tenon Hardwood Joinery'
      };
    } else if (text.includes('acacia')) {
      return {
        species: 'Solid Grain Acacia Wood',
        durability: 'Dense Heavy-Duty Impact Structure',
        finish: 'Organic Protective Wood Wax',
        craftsmanship: 'Precision Beveled Edges'
      };
    }

    return {
      species: item.woodType || item.material || 'Kiln-Dried Philippine Mahogany',
      durability: item.durability || 'Termite-Treated & Heavy-Load Tested',
      finish: item.finishType || 'Protective UV-Resistant Polyurethane',
      craftsmanship: item.craftType || 'Master Carpenter Hand-Assembled'
    };
  };

  const woodSpecs = getWoodMaterialSpecs(product);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
      
      {/* Backdrop Overlay */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main Card Container - Organic Deep Timber & Earth Palette */}
      <div className="relative z-10 w-full max-w-sm sm:max-w-xl md:max-w-3xl bg-[#23120B] text-amber-50 rounded-3xl shadow-2xl border-2 border-[#522B15] overflow-hidden flex flex-col max-h-[94vh] my-auto">
        
        {/* Modal Header */}
        <div className="p-3 sm:p-4 bg-[#180C07] border-b border-[#3D1E0E] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <div className="p-1.5 bg-amber-500/20 text-amber-400 rounded-xl shrink-0 border border-amber-500/30">
              <Trees className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs sm:text-sm font-black text-amber-200 truncate">
                {product.name}
              </h3>
              <p className="text-[10px] text-amber-300/70 truncate flex items-center gap-1">
                <Store className="w-3 h-3 text-amber-400 shrink-0" />
                <span>{product.shopName || 'Maano Woodcraft Palawan'}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-[#3D1E0E] text-amber-200 hover:text-white hover:bg-[#522B15] transition shrink-0 border border-[#522B15]"
            aria-label="Close Material View"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-4">
          
          {/* 1. UNCLIPPED PRODUCT IMAGE PREVIEW CONTAINER */}
          <div className="relative w-full bg-[#130904] rounded-2xl border border-[#3D1E0E] flex items-center justify-center p-2 sm:p-4 min-h-[200px] max-h-[35vh] sm:max-h-[42vh] overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="max-w-full max-h-full object-contain rounded-xl shadow-lg"
            />

            {/* Badges Overlay */}
            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
              <span className="px-2.5 py-1 bg-amber-500 text-[#130904] text-[10px] sm:text-xs font-black rounded-lg shadow-md">
                ₱{product.price?.toLocaleString()}
              </span>
              <span className="px-2 py-1 bg-emerald-800/90 backdrop-blur-md text-emerald-100 text-[10px] font-bold rounded-lg shadow-md flex items-center gap-1 border border-emerald-600/40">
                <CheckCircle2 className="w-3 h-3 text-emerald-300" />
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
          </div>

          {/* 2. BUILT MATERIAL & WOOD SPECS CARD (Earthy Hardwood HUD) */}
          <div className="bg-[#1C0D06] border border-[#7A421D]/60 rounded-2xl p-3.5 sm:p-4 space-y-3 shadow-inner">
            <div className="flex items-center justify-between border-b border-[#3D1E0E] pb-2.5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <h4 className="text-xs sm:text-sm font-black text-amber-400 uppercase tracking-wider">
                  Built Material & Wood Specifications
                </h4>
              </div>
              <span className="text-[9px] sm:text-[10px] bg-amber-500/20 text-amber-300 font-extrabold px-2 py-0.5 rounded-md border border-amber-500/30">
                100% Authentic Wood
              </span>
            </div>

            {/* Specs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              
              {/* Wood Species */}
              <div className="p-2.5 bg-[#2C160B] rounded-xl border border-[#4D2713] flex items-start gap-2.5">
                <Trees className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-[10px] text-amber-400/80 font-bold uppercase">Wood Species / Material</p>
                  <p className="font-extrabold text-amber-100 text-xs mt-0.5">{woodSpecs.species}</p>
                </div>
              </div>

              {/* Durability */}
              <div className="p-2.5 bg-[#2C160B] rounded-xl border border-[#4D2713] flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-[10px] text-amber-400/80 font-bold uppercase">Durability & Treatment</p>
                  <p className="font-extrabold text-amber-100 text-xs mt-0.5">{woodSpecs.durability}</p>
                </div>
              </div>

              {/* Surface Finish */}
              <div className="p-2.5 bg-[#2C160B] rounded-xl border border-[#4D2713] flex items-start gap-2.5">
                <Layers className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-[10px] text-amber-400/80 font-bold uppercase">Surface Finish & Polish</p>
                  <p className="font-extrabold text-amber-100 text-xs mt-0.5">{woodSpecs.finish}</p>
                </div>
              </div>

              {/* Craftsmanship */}
              <div className="p-2.5 bg-[#2C160B] rounded-xl border border-[#4D2713] flex items-start gap-2.5">
                <Hammer className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-[10px] text-amber-400/80 font-bold uppercase">Joinery & Construction</p>
                  <p className="font-extrabold text-amber-100 text-xs mt-0.5">{woodSpecs.craftsmanship}</p>
                </div>
              </div>

            </div>

            {/* Description note */}
            <p className="text-[11px] text-amber-200/80 leading-relaxed pt-1">
              {product.description || 'Handcrafted actual furniture piece uploaded directly by shop owner using sustainable hardwood materials.'}
            </p>
          </div>

        </div>

        {/* Modal Actions Footer */}
        <div className="p-3 sm:p-4 bg-[#180C07] border-t border-[#3D1E0E] flex flex-col sm:flex-row items-center gap-2 shrink-0">
          <button
            onClick={() => {
              if (onReserveProduct) onReserveProduct(product);
              onClose();
            }}
            disabled={!product.inStock}
            className="w-full sm:flex-1 py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-[#130904] font-black text-xs rounded-xl transition shadow-md flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Reserve & Add to Cart</span>
          </button>

          <button
            onClick={() => {
              onClose();
              if (onOpenChat) onOpenChat();
            }}
            className="w-full sm:w-auto py-2.5 px-4 bg-[#3D1E0E] hover:bg-[#522B15] text-amber-200 font-extrabold text-xs rounded-xl transition border border-[#7A421D] flex items-center justify-center gap-1.5 shrink-0"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Inquire Shop</span>
          </button>
        </div>

      </div>
    </div>
  );
}