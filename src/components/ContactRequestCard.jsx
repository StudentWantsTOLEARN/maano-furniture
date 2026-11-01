import React, { useState, useEffect } from 'react';
import { ShieldAlert, Phone, Clock, Check, X, Copy, Lock } from 'lucide-react';

export function ContactRequestCard({ 
  message, 
  chatId, 
  isAdmin = false, 
  ownerPhone = '+63 912 345 6789', 
  onRespond 
}) {
  const [timeLeft, setTimeLeft] = useState(0);
  const [selectedDuration, setSelectedDuration] = useState(5);
  const [customPhone, setCustomPhone] = useState(ownerPhone);
  const [copied, setCopied] = useState(false);

  // Keep customPhone synced if default ownerPhone changes
  useEffect(() => {
    if (ownerPhone) setCustomPhone(ownerPhone);
  }, [ownerPhone]);

  // Real-time countdown timer logic
  useEffect(() => {
    if (message?.status !== 'approved' || !message?.expiresAt) return;

    let expiryMs = 0;
    if (typeof message.expiresAt.toMillis === 'function') {
      expiryMs = message.expiresAt.toMillis();
    } else if (message.expiresAt.seconds) {
      expiryMs = message.expiresAt.seconds * 1000;
    } else if (message.expiresAt instanceof Date) {
      expiryMs = message.expiresAt.getTime();
    } else {
      expiryMs = new Date(message.expiresAt).getTime();
    }

    const updateTimer = () => {
      const remainingSecs = Math.max(0, Math.floor((expiryMs - Date.now()) / 1000));
      setTimeLeft(remainingSecs);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [message?.status, message?.expiresAt]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const isExpired = message?.status === 'approved' && timeLeft <= 0;

  const handleCopy = () => {
    if (message?.phoneNumber && !isExpired) {
      navigator.clipboard.writeText(message.phoneNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="my-3 p-4 rounded-2xl bg-stone-900 border-2 border-amber-600/60 text-white shadow-xl max-w-sm w-full mx-auto animate-fadeIn">
      {/* Card Header */}
      <div className="flex items-center justify-between border-b border-stone-700/80 pb-2.5 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
            <Phone className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-xs uppercase tracking-wider text-amber-300 truncate">
            Owner Contact Access
          </span>
        </div>

        {/* High Contrast Status Badge */}
        <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full shrink-0 shadow-sm ${
          message.status === 'pending' ? 'bg-amber-500/30 text-amber-200 border border-amber-400/50' :
          message.status === 'declined' ? 'bg-rose-500/30 text-rose-200 border border-rose-400/50' :
          isExpired ? 'bg-stone-800 text-stone-400 border border-stone-600' : 
          'bg-emerald-500/30 text-emerald-300 border border-emerald-400/50 animate-pulse'
        }`}>
          {message.status === 'pending' && 'Awaiting Owner'}
          {message.status === 'declined' && 'Declined'}
          {message.status === 'approved' && (isExpired ? 'Expired' : 'Active Access')}
        </span>
      </div>

      {/* 1. Pending View for Customer */}
      {!isAdmin && message.status === 'pending' && (
        <div className="text-center py-2 text-stone-300 text-xs leading-relaxed">
          <p className="font-semibold text-amber-200">Request submitted to store owner.</p>
          <p className="text-[11px] text-stone-400 mt-1">
            When approved, direct phone contact will appear here for a limited time.
          </p>
        </div>
      )}

      {/* 2. Active Approved View */}
      {message.status === 'approved' && !isExpired && (
        <div className="space-y-3">
          <div className="bg-black/80 p-3.5 rounded-xl border border-amber-500/40 flex items-center justify-between gap-2 shadow-inner">
            <div className="min-w-0">
              <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest">
                Direct Mobile Number
              </p>
              <p className="text-lg font-mono font-black text-emerald-400 tracking-wider truncate">
                {message.phoneNumber || ownerPhone}
              </p>
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className="p-2.5 bg-amber-600 hover:bg-amber-500 active:scale-95 text-stone-950 font-bold rounded-lg transition shrink-0 shadow-md"
              title="Copy Number"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-950 stroke-[3]" /> : <Copy className="w-4 h-4 stroke-[2.5]" />}
            </button>
          </div>

          <div className="flex items-center justify-between text-xs bg-stone-800/90 px-3 py-2 rounded-lg border border-stone-700">
            <span className="flex items-center gap-1.5 text-amber-200 text-[11px] font-bold">
              <Clock className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} /> 
              Auto-expires in:
            </span>
            <span className="font-mono font-black text-amber-300 text-sm">
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
      )}

      {/* 3. Expired View */}
      {message.status === 'approved' && isExpired && (
        <div className="text-center py-2 px-1 text-stone-300 text-xs flex flex-col items-center justify-center gap-1 bg-stone-950/60 rounded-xl border border-stone-800">
          <div className="flex items-center gap-1.5 text-amber-400/90 font-bold text-[11px]">
            <Lock className="w-3.5 h-3.5" />
            <span>Contact Link Expired</span>
          </div>
          <p className="text-[10px] text-stone-400 leading-snug">
            This direct contact card has timed out to protect store owner privacy. You can send a new request if needed.
          </p>
        </div>
      )}

      {/* 4. Declined View */}
      {message.status === 'declined' && (
        <div className="text-center py-2 text-stone-300 text-xs italic">
          The owner is currently unavailable for direct phone calls. Please leave your message in chat!
        </div>
      )}

      {/* 5. Owner Admin Controls (With Editable Phone Number Input) */}
      {isAdmin && message.status === 'pending' && (
        <div className="mt-2 space-y-3 border-t border-stone-700/80 pt-3">
          {/* Admin Custom Phone Number Input */}
          <div>
            <label className="block text-[10px] font-extrabold uppercase text-amber-300 mb-1">
              Owner Direct Phone Number
            </label>
            <input
              type="text"
              placeholder="+63 9XX XXX XXXX"
              value={customPhone}
              onChange={(e) => setCustomPhone(e.target.value)}
              className="w-full bg-stone-950 border border-stone-600 rounded-lg px-3 py-1.5 text-xs text-emerald-400 font-mono font-bold focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Access Timer Selection */}
          <div className="flex items-center justify-between text-xs">
            <label className="text-stone-300 font-medium text-[11px]">
              Active Access Duration:
            </label>
            <select
              value={selectedDuration}
              onChange={(e) => setSelectedDuration(Number(e.target.value))}
              className="bg-stone-950 text-amber-200 text-xs px-2 py-1 rounded-lg border border-stone-600 focus:outline-none font-bold"
            >
              <option value={2}>2 Minutes</option>
              <option value={5}>5 Minutes</option>
              <option value={10}>10 Minutes</option>
              <option value={15}>15 Minutes</option>
            </select>
          </div>

          {/* Approval Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => onRespond && onRespond(chatId, message.id, 'declined')}
              className="flex items-center justify-center gap-1 py-2 bg-rose-950 hover:bg-rose-900 text-rose-200 border border-rose-700 rounded-xl text-xs font-bold transition"
            >
              <X className="w-3.5 h-3.5" /> Decline
            </button>
            <button
              type="button"
              onClick={() => onRespond && onRespond(chatId, message.id, 'approved', customPhone, selectedDuration)}
              className="flex items-center justify-center gap-1 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl text-xs font-black transition shadow-md"
            >
              <Check className="w-3.5 h-3.5" /> Share Number
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ContactRequestCard;