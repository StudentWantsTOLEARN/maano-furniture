import React from 'react';
import { MessageSquare, CheckCircle, AlertCircle, Eye } from 'lucide-react';

export default function ProductCard({ 
  product, 
  onSelectProduct, 
  onOpenChatWithShop,
  onOpenImagePreview 
}) {
  const handleEyeClick = (e) => {
    e.stopPropagation(); // Prevents bubbling up to card-level click events
    if (onOpenImagePreview) {
      onOpenImagePreview(product);
    } else if (onSelectProduct) {
      onSelectProduct(product);
    }
  };

  const handleChatClick = (e) => {
    e.stopPropagation();
    if (onOpenChatWithShop) {
      onOpenChatWithShop(product.shopName || product);
    }
  };

  return (
    <div className="group bg-white rounded-ios border border-woody-200/80 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between">
      
      {/* Image & Badges */}
      <div 
        className="relative aspect-[4/3] overflow-hidden bg-woody-100 cursor-pointer" 
        onClick={() => onSelectProduct && onSelectProduct(product)}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <span className="bg-white/90 backdrop-blur-md text-woody-800 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
            {product.category}
          </span>
        </div>

        {/* Stock Badge */}
        <div className="absolute top-3 right-3">
          {product.inStock ? (
            <span className="bg-nature-moss/90 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
              <CheckCircle className="w-3 h-3" /> In Stock ({product.stockCount})
            </span>
          ) : (
            <span className="bg-rose-600/90 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
              <AlertCircle className="w-3 h-3" /> Sold Out
            </span>
          )}
        </div>
      </div>

      {/* Body Info */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="text-xs text-nature-forest font-semibold mb-1">{product.shopName}</div>
          <h3 
            onClick={() => onSelectProduct && onSelectProduct(product)}
            className="font-bold text-woody-900 text-base line-clamp-1 hover:text-woody-600 cursor-pointer transition"
          >
            {product.name}
          </h3>
          <p className="text-xs text-woody-500 mt-1 line-clamp-2">{product.description}</p>
        </div>

        <div className="mt-4 pt-4 border-t border-woody-100 flex items-center justify-between">
          <div>
            {product.originalPrice && (
              <span className="text-xs text-woody-400 line-through">
                ₱{product.originalPrice.toLocaleString()}
              </span>
            )}
            <div className="text-lg font-extrabold text-woody-800">
              ₱{product.price?.toLocaleString()}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* EYE BUTTON: Dedicated Built Material & Wood Specs Preview */}
            <button
              type="button"
              onClick={handleEyeClick}
              className="p-2.5 rounded-full bg-woody-100 hover:bg-woody-200 text-woody-700 transition cursor-pointer hover:scale-105"
              title="View Built Materials & Wood Specs"
            >
              <Eye className="w-4 h-4" />
            </button>

            {/* CHAT BUTTON */}
            <button
              type="button"
              onClick={handleChatClick}
              className="p-2.5 rounded-full bg-woody-600 hover:bg-woody-700 text-white transition shadow-sm cursor-pointer hover:scale-105"
              title="Chat with Shop Owner"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}