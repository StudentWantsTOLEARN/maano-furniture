import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  MessageSquare, 
  ShieldAlert, 
  LogOut, 
  User, 
  ChevronDown, 
  Camera, 
  ShoppingBag
} from 'lucide-react';

export default function Navbar({
  searchQuery,
  setSearchQuery,
  user,
  onOpenAuth,
  onOpenChat,
  onOpenAdmin,
  onOpenReservations,
  onLogout,
  onUpdateAvatar,
  unreadCount = 0,
  userReservationsCount = 0
}) {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  // Strict user login check (prevents empty objects `{}` from bypassing auth state)
  const isUserLoggedIn = Boolean(user && (user.email || user.name || user.uid));

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAvatarFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const compressedAvatar = canvas.toDataURL('image/jpeg', 0.8);
        if (onUpdateAvatar) {
          onUpdateAvatar(compressedAvatar);
        }
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-900/10 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 bg-slate-900 text-amber-400 rounded-2xl flex items-center justify-center font-black text-base shadow-sm border border-slate-700">
            MF
          </div>
          <div className="hidden sm:block">
            <h1 className="font-black text-sm text-slate-900 leading-tight">Maano Furniture</h1>
            <p className="text-[10px] text-amber-800 font-semibold tracking-wide">Woody Nature Collection</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search furniture by class, category, or style..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-100/80 border border-slate-200/80 rounded-full pl-10 pr-4 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition"
          />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* 1. MY CART & RESERVATIONS BUTTON */}
          {isUserLoggedIn && (
            <button
              onClick={onOpenReservations}
              className="flex items-center gap-2 px-3 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-950 border border-amber-300 rounded-xl text-xs font-bold transition relative shadow-xs"
              title="View My Cart & Reserved Items"
            >
              <ShoppingBag className="w-4 h-4 text-amber-700" />
              <span className="hidden md:inline">My Cart</span>
              
              {userReservationsCount > 0 && (
                <span className="bg-amber-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {userReservationsCount}
                </span>
              )}
            </button>
          )}

          {/* 2. LIVE SHOP CHAT BUTTON */}
          <button
            onClick={onOpenChat}
            className="flex items-center gap-2 px-3.5 py-2 bg-amber-100/70 hover:bg-amber-200/80 text-amber-950 rounded-xl text-xs font-bold transition relative border border-amber-200/60"
          >
            <MessageSquare className="w-4 h-4 text-amber-800" />
            <span className="hidden sm:inline">Shop Chat</span>
            
            {user?.isAdmin && unreadCount > 0 && (
              <span className="w-2.5 h-2.5 bg-rose-600 rounded-full animate-ping" />
            )}
          </button>

          {/* 3. GOD-LEVEL ADMIN BUTTON */}
          {user?.isAdmin && (
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-extrabold shadow-xs transition"
            >
              <ShieldAlert className="w-4 h-4" />
              <span className="hidden md:inline">Admin Panel</span>
            </button>
          )}

          {/* 4. USER AUTHENTICATION / PROFILE DROPDOWN */}
          {isUserLoggedIn ? (
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 p-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-300 transition"
              >
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.name || 'User'} className="w-7 h-7 rounded-lg object-cover" />
                ) : (
                  <div className="w-7 h-7 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center font-bold text-xs">
                    {(user.name || user.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <span className="text-xs font-bold text-slate-800 max-w-[100px] truncate hidden sm:inline">
                  {user.name || user.email?.split('@')[0]}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-600" />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-fadeIn">
                  
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center gap-3">
                    <div className="relative group">
                      {user.photoURL ? (
                        <img src={user.photoURL} alt={user.name || 'User'} className="w-10 h-10 rounded-xl object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center font-bold text-sm">
                          {(user.name || user.email || 'U')[0].toUpperCase()}
                        </div>
                      )}
                      
                      <label className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition">
                        <Camera className="w-4 h-4 text-white" />
                        <input type="file" accept="image/*" onChange={handleAvatarFileChange} className="hidden" />
                      </label>
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-900 truncate">{user.name || 'Shop Customer'}</p>
                      <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        onOpenReservations();
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-800 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <ShoppingBag className="w-4 h-4 text-amber-600" />
                      <span>My Reservations & Cart</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        onOpenChat();
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-800 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4 text-slate-600" />
                      <span>Inquire Shop</span>
                    </button>

                    {user.isAdmin && (
                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          onOpenAdmin();
                        }}
                        className="w-full px-4 py-2 text-left text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                      >
                        <ShieldAlert className="w-4 h-4" />
                        <span>God-Level Admin Control</span>
                      </button>
                    )}
                  </div>

                  <div className="border-t border-slate-100 pt-1">
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        onLogout();
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>

                </div>
              )}
            </div>
          ) : (
            /* HIGH-CONTRAST ALWAYS-VISIBLE SIGN IN BUTTON */
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-amber-400 font-extrabold text-xs rounded-xl shadow-md border border-slate-700 transition cursor-pointer shrink-0"
            >
              <User className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-white font-bold">Sign In</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
}