import React from 'react';
import ProductCard from './ProductCard';
import { PackageOpen } from 'lucide-react';

export default function ProductGrid({ 
  products, 
  onSelectProduct, 
  onOpenChatWithShop,
  onOpenImagePreview 
}) {
  if (!products || products.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-woody-200/50 rounded-full flex items-center justify-center mx-auto mb-4 text-woody-600">
          <PackageOpen className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-woody-800">No furniture found</h3>
        <p className="text-xs text-woody-500 mt-1">Try searching for another category or style.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-12 py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id || product.name}
            product={product}
            onSelectProduct={onSelectProduct}
            onOpenChatWithShop={onOpenChatWithShop}
            onOpenImagePreview={onOpenImagePreview}
          />
        ))}
      </div>
    </div>
  );
}