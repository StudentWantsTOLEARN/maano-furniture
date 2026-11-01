import React, { useState } from 'react';
import { X, Calendar, Key, Clock, CheckCircle2, XCircle, ShoppingBag, History } from 'lucide-react';

export default function MyReservationsModal({ isOpen, onClose, reservations = [], user }) {
  const [activeTab, setActiveTab] = useState('active');

  if (!isOpen) return null;

  const userReservations = reservations.filter(r => r.userId === user?.uid);
  const activeReservations = userReservations.filter(r => r.status === 'pending' || r.status === 'confirmed');
  const pastOrders = userReservations.filter(r => r.status === 'completed' || r.status === 'cancelled');

  const listToDisplay = activeTab === 'active' ? activeReservations : pastOrders;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-ios max-w-xl w-full p-6 md:p-8 shadow-2xl border border-woody-200 relative max-h-[85vh] flex flex-col">
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-woody-100 text-woody-600 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4 border-b border-woody-200 pb-4 shrink-0">
          <div className="p-3 bg-woody-800 text-amber-400 rounded-2xl shadow-sm">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-woody-900">My Order Cart & Reservations</h3>
            <p className="text-xs text-woody-500">Track active reservations and review your order history.</p>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-woody-100 p-1 rounded-xl mb-4 border border-woody-200 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('active')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-2 ${
              activeTab === 'active' ? 'bg-white text-woody-900 shadow-sm' : 'text-woody-600 hover:text-woody-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-amber-600" />
            <span>Active Reservations ({activeReservations.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-2 ${
              activeTab === 'history' ? 'bg-white text-woody-900 shadow-sm' : 'text-woody-600 hover:text-woody-900'
            }`}
          >
            <History className="w-3.5 h-3.5 text-woody-600" />
            <span>Past Orders ({pastOrders.length})</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {listToDisplay.length === 0 ? (
            <div className="text-center py-12 text-woody-400 space-y-2">
              <ShoppingBag className="w-12 h-12 mx-auto text-woody-300" />
              <p className="text-xs font-bold">
                {activeTab === 'active' ? 'No active reservations found.' : 'No past order history found.'}
              </p>
              <p className="text-[11px] text-woody-400">
                {activeTab === 'active' ? 'Reserve items directly from the store to hold them.' : 'Completed pickups will appear here.'}
              </p>
            </div>
          ) : (
            listToDisplay.map((res) => (
              <div 
                key={res.id} 
                className="p-4 bg-woody-50/80 border border-woody-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img 
                    src={res.productImage} 
                    alt={res.productName} 
                    className="w-14 h-14 rounded-xl object-cover shrink-0 border border-woody-200" 
                  />
                  <div className="min-w-0">
                    <h4 className="font-extrabold text-xs text-woody-900 truncate">{res.productName}</h4>
                    <p className="text-[11px] text-woody-600 font-semibold mt-0.5">
                      ₱{res.productPrice?.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-woody-400 mt-1">
                      Date: {res.dateStr || 'Recently'}
                    </p>
                  </div>
                </div>

                {/* Status & PIN Box */}
                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-woody-200/80">
                  {/* Status Badge */}
                  <div>
                    {res.status === 'pending' && (
                      <span className="inline-flex items-center gap-1 text-[10px] bg-amber-100 text-amber-800 font-bold px-2.5 py-1 rounded-full border border-amber-200">
                        <Clock className="w-3 h-3" /> Awaiting Confirmation
                      </span>
                    )}
                    {res.status === 'confirmed' && (
                      <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" /> Confirmed & Ready
                      </span>
                    )}
                    {res.status === 'completed' && (
                      <span className="inline-flex items-center gap-1 text-[10px] bg-woody-200 text-woody-800 font-bold px-2.5 py-1 rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> Claimed / Completed
                      </span>
                    )}
                    {res.status === 'cancelled' && (
                      <span className="inline-flex items-center gap-1 text-[10px] bg-rose-100 text-rose-700 font-bold px-2.5 py-1 rounded-full">
                        <XCircle className="w-3 h-3" /> Cancelled
                      </span>
                    )}
                  </div>

                  {/* High Contrast Verification PIN Badge */}
                  <div className="bg-slate-900 text-slate-100 px-3 py-1.5 rounded-xl border border-slate-700 flex items-center gap-2 shadow-md shrink-0">
                    <Key className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="text-[10px] text-amber-300 font-extrabold uppercase">PIN:</span>
                    <span className="text-xs font-black tracking-widest font-mono bg-amber-400 text-slate-950 px-2 py-0.5 rounded-md shadow-inner">
                      {res.pinCode || '******'}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}