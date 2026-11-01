import React from 'react';
import { X, ShieldCheck } from 'lucide-react';

export default function TermsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-ios max-w-md w-full p-6 md:p-8 shadow-2xl border border-woody-200 relative max-h-[85vh] flex flex-col">
        
        <div className="flex items-center gap-3 border-b border-woody-200 pb-4 mb-4 shrink-0">
          <div className="p-2.5 bg-woody-600 text-white rounded-xl shadow-sm">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-woody-900">Terms & Conditions</h3>
            <p className="text-[11px] text-woody-500">Maano Furniture Platform Policy</p>
          </div>
          <button 
            onClick={onClose} 
            className="ml-auto p-1.5 rounded-full hover:bg-woody-100 text-woody-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 space-y-4 text-xs text-woody-700 leading-relaxed pr-1">
          <section>
            <h4 className="font-bold text-woody-900 mb-1">1. Account Registration</h4>
            <p>By registering an account via Email, Google, or Facebook, you agree to provide accurate details. Accounts used for spamming or unauthorized activities will be suspended.</p>
          </section>

          <section>
            <h4 className="font-bold text-woody-900 mb-1">2. Direct Real-Time Shop Inquiries</h4>
            <p>The messaging drawer connects buyers directly with registered furniture merchants. Respectful conduct is required. Fraudulent or abusive messages will result in account revocation.</p>
          </section>

          <section>
            <h4 className="font-bold text-woody-900 mb-1">3. Pricing & Inventory Accuracy</h4>
            <p>Product prices, stock levels, and specs are managed directly in real-time by store owners. Final sales transactions and custom order agreements occur between the merchant and the customer.</p>
          </section>

          <section>
            <h4 className="font-bold text-woody-900 mb-1">4. Privacy & Data Security</h4>
            <p>Your authentication credentials are secured using Firebase Authentication and protected by Firestore Security Rules. Your private information is never sold to third parties.</p>
          </section>
        </div>

        <div className="pt-4 border-t border-woody-200 mt-4 shrink-0">
          <button
            onClick={onClose}
            className="w-full bg-woody-700 hover:bg-woody-800 text-white font-bold py-2.5 rounded-xl text-xs shadow-md transition"
          >
            I Understand & Agree
          </button>
        </div>

      </div>
    </div>
  );
}