import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  X, 
  ShieldAlert, 
  Plus, 
  Upload, 
  Image as ImageIcon, 
  MessageSquare, 
  Package, 
  Send, 
  CheckCircle2, 
  User, 
  Loader2,
  Trash2,
  Calendar,
  Key,
  Check,
  XCircle,
  Navigation,
  ArrowLeft,
  Trees,
  Hammer,
  ShieldCheck,
  Layers,
  Tv,
  Flame,
  Radio,
  Video,
  Clock
} from 'lucide-react';

import { doc, setDoc, updateDoc, deleteDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { respondToContactRequest } from '../services/chatService';
import { ContactRequestCard } from './ContactRequestCard';

export default function AdminModal({ 
  isOpen, 
  onClose, 
  user,
  products = [], 
  onAddProduct, 
  onUpdateProduct,
  onDeleteProduct,
  chatThreads = [],
  onOwnerSendMessage,
  reservations = [],
  onUpdateReservationStatus
}) {
  const [activeTab, setActiveTab] = useState('inventory');
  
  // Owner Contact Config
  const OWNER_PHONE_NUMBER = "+63 912 345 6789"; // Replace with your actual mobile number

  // Basic Product Form State
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Living Room');
  const [shopName] = useState('Maano Woodcraft Palawan');
  const [stockCount, setStockCount] = useState(10);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80');

  // OWNER BUILT MATERIAL & WOOD SPECS FORM STATE
  const [woodSpecies, setWoodSpecies] = useState('Philippine Solid Narra Hardwood');
  const [durability, setDurability] = useState('Class-A Termite & Kiln-Dried Treated');
  const [finishType, setFinishType] = useState('Natural Satin Polyurethane Polish');
  const [craftsmanship, setCraftsmanship] = useState('Mortise & Tenon Hardwood Joinery');

  // OWNER PROMO VIDEO BROADCAST STATE
  const [promoTitle, setPromoTitle] = useState('30% OFF Special Woodcraft Sale');
  const [promoBadgeText, setPromoBadgeText] = useState('LIMITED TIME OFFER');
  const [promoVideoUrl, setPromoVideoUrl] = useState('');
  const [promoDescription, setPromoDescription] = useState('Check out our handcrafted furniture collection crafted from sustainable Palawan hardwoods.');
  const [promoDueDate, setPromoDueDate] = useState('');
  const [isPromoActive, setIsPromoActive] = useState(true);
  const [isPublishingPromo, setIsPublishingPromo] = useState(false);
  const [uploadingVideoFileName, setUploadingVideoFileName] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Live Location Broadcast State
  const [isBroadcastingLocation, setIsBroadcastingLocation] = useState(false);
  const [liveLocationStatus, setLiveLocationStatus] = useState('Static shop address active');

  // Chat Dashboard State
  const [selectedThreadId, setSelectedThreadId] = useState(null);
  const [ownerReplyText, setOwnerReplyText] = useState('');
  const [mobileShowChatConsole, setMobileShowChatConsole] = useState(false);
  const messagesEndRef = useRef(null);

  // Load existing live video promo settings from Firestore when Admin modal opens
  useEffect(() => {
    if (!isOpen) return;

    const promoRef = doc(db, 'promos', 'activePromo');
    const unsubscribe = onSnapshot(promoRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.title) setPromoTitle(data.title);
        if (data.badgeText) setPromoBadgeText(data.badgeText);
        if (data.videoUrl) setPromoVideoUrl(data.videoUrl);
        if (data.description) setPromoDescription(data.description);
        if (data.dueDate) setPromoDueDate(data.dueDate);
        if (typeof data.isActive === 'boolean') setIsPromoActive(data.isActive);
      } else {
        // Clear local inputs if promo was deleted
        setPromoVideoUrl('');
      }
    });

    return () => unsubscribe();
  }, [isOpen]);

  // Sort customer inquiry threads so unread threads always appear at the top
  const sortedChatThreads = useMemo(() => {
    return [...chatThreads].sort((a, b) => {
      if (a.unreadForOwner && !b.unreadForOwner) return -1;
      if (!a.unreadForOwner && b.unreadForOwner) return 1;
      return 0;
    });
  }, [chatThreads]);

  // Auto-select first thread if none is selected
  useEffect(() => {
    if (!selectedThreadId && sortedChatThreads.length > 0) {
      setSelectedThreadId(sortedChatThreads[0].id);
    }
  }, [sortedChatThreads, selectedThreadId]);

  const activeThread = chatThreads.find(t => t.id === selectedThreadId) || sortedChatThreads[0];

  // Auto-clear unread state in Firestore when admin views/selects the thread
  const handleSelectThread = async (threadId) => {
    setSelectedThreadId(threadId);
    setMobileShowChatConsole(true);

    const threadToMark = chatThreads.find(t => t.id === threadId);
    if (threadToMark && threadToMark.unreadForOwner) {
      try {
        await updateDoc(doc(db, 'chatThreads', threadId), {
          unreadForOwner: false
        });
      } catch (err) {
        console.error("Error clearing unread state:", err);
      }
    }
  };

  // Clear unread indicator when current active thread receives a message while opened
  useEffect(() => {
    if (activeTab === 'chats' && selectedThreadId) {
      const currentSelected = chatThreads.find(t => t.id === selectedThreadId);
      if (currentSelected && currentSelected.unreadForOwner) {
        updateDoc(doc(db, 'chatThreads', selectedThreadId), { unreadForOwner: false }).catch(() => {});
      }
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeThread?.messages, activeTab, selectedThreadId, chatThreads]);

  if (!isOpen) return null;

  // STRICT GUARD FOR NON-ADMIN ACCOUNT
  if (user && !user.isAdmin) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
        <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 text-center border-2 border-rose-600 shadow-2xl relative">
          <button onClick={onClose} className="absolute top-3 right-3 p-2 rounded-full hover:bg-woody-100 text-woody-800">
            <X className="w-5 h-5" />
          </button>
          
          <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-xl">
            ✕
          </div>
          <h3 className="text-base sm:text-lg font-extrabold text-rose-700">God-Level Authority Required</h3>
          <p className="text-xs text-woody-600 mt-2 leading-relaxed">
            Access Restricted. Only authorized God-Level Admin accounts can access real-time inventory management and shop inquiry channels.
          </p>
          <button
            onClick={onClose}
            className="mt-4 px-5 py-2.5 bg-woody-800 text-white text-xs font-bold rounded-xl hover:bg-woody-900 transition"
          >
            Return to Storefront
          </button>
        </div>
      </div>
    );
  }

  // Handle Admin Approval or Rejection of Contact Request
  const handleAdminRespond = async (chatId, messageId, status, phone, duration) => {
    try {
      await respondToContactRequest(chatId, messageId, status, phone, duration);
    } catch (err) {
      console.error("Failed to respond to contact request:", err);
      alert("Failed to respond to request. Please try again.");
    }
  };

  // Live Location Broadcaster Handler
  const handleBroadcastAdminLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setIsBroadcastingLocation(true);
    setLiveLocationStatus('Acquiring GPS coordinates...');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          await setDoc(doc(db, 'shopLocation', 'activeShop'), {
            lat: latitude,
            lng: longitude,
            isLive: true,
            updatedAt: serverTimestamp(),
            updatedBy: user?.email || 'Admin'
          }, { merge: true });

          setLiveLocationStatus('Live GPS broadcast active!');
          alert(`Live GPS location updated in Firestore!\n\nLatitude: ${latitude}\nLongitude: ${longitude}\n\nCustomers using "Get Route" will navigate directly to your live coordinates.`);
        } catch (err) {
          console.error("Firestore location broadcast error:", err);
          setLiveLocationStatus('Failed to broadcast location.');
        } finally {
          setIsBroadcastingLocation(false);
        }
      },
      (err) => {
        setIsBroadcastingLocation(false);
        setLiveLocationStatus('GPS permission denied.');
        alert("Unable to fetch GPS location. Please allow location permissions in browser settings.");
      },
      { enableHighAccuracy: true }
    );
  };

  // Local Device / Gallery Video Upload Handler
  const handleVideoFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 25 * 1024 * 1024) {
      alert("Video file size is too large for direct browser broadcast. Please choose a clip under 25MB or paste a video URL.");
      return;
    }

    setUploadingVideoFileName(file.name);
    setIsPublishingPromo(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      setPromoVideoUrl(event.target.result);
      setIsPublishingPromo(false);
    };
    reader.onerror = () => {
      alert("Failed to read video file from device.");
      setIsPublishingPromo(false);
    };
    reader.readAsDataURL(file);
  };

  // Video Broadcast Submit Handler
  const handleBroadcastVideo = async (e) => {
    e.preventDefault();
    if (!promoVideoUrl) {
      alert("Please upload a video from your gallery/device or paste a video link.");
      return;
    }

    setIsPublishingPromo(true);
    try {
      await setDoc(doc(db, 'promos', 'activePromo'), {
        title: promoTitle,
        badgeText: promoBadgeText,
        videoUrl: promoVideoUrl,
        description: promoDescription,
        dueDate: promoDueDate || null,
        isActive: isPromoActive,
        updatedAt: serverTimestamp(),
        updatedBy: user?.email || 'Admin'
      }, { merge: true });

      alert("Promotional Video broadcasted live to all users in real time!");
    } catch (err) {
      console.error("Video Broadcast Error:", err);
      alert(`Failed to broadcast video: ${err.message}`);
    } finally {
      setIsPublishingPromo(false);
    }
  };

  // Delete Promo Broadcast Handler
  const handleDeletePromo = async () => {
    if (!window.confirm("Are you sure you want to completely delete this promo video broadcast from the storefront?")) {
      return;
    }

    setIsPublishingPromo(true);
    try {
      await deleteDoc(doc(db, 'promos', 'activePromo'));
      setPromoVideoUrl('');
      setUploadingVideoFileName('');
      setPromoDueDate('');
      alert("Promo video broadcast successfully deleted!");
    } catch (err) {
      console.error("Delete Promo Error:", err);
      alert(`Failed to delete promo: ${err.message}`);
    } finally {
      setIsPublishingPromo(false);
    }
  };

  // Automatic Image Compression
  const handleImageFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
        setImageUrl(compressedDataUrl);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name || !price) return;

    setIsSubmitting(true);
    try {
      const newProd = {
        name,
        price: Number(price),
        originalPrice: Number(price) * 1.2,
        category,
        style: 'Modern Minimalist',
        shopId: 'shop-1',
        shopName,
        image: imageUrl,
        colors: ['#704214', '#8B5A2B'],
        availableColors: ['Natural Wood', 'Custom Finish'],
        inStock: Number(stockCount) > 0,
        stockCount: Number(stockCount),
        rating: 5.0,
        
        // OWNER DEFINED WOOD MATERIAL SPECS
        woodSpecies: woodSpecies || 'Philippine Solid Narra Hardwood',
        durability: durability || 'Class-A Termite & Rot Treated',
        finishType: finishType || 'Natural Clear Eco Polish',
        craftsmanship: craftsmanship || 'Master Carpenter Mortise & Tenon',

        description: description || 'Handcrafted actual product uploaded directly by shop owner.'
      };

      if (onAddProduct) {
        await onAddProduct(newProd);
      }
      
      setName('');
      setPrice('');
      setDescription('');
      alert(`"${name}" successfully published with complete Wood Species & Material specs!`);
    } catch (err) {
      console.error("Error creating product:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!ownerReplyText.trim() || !activeThread) return;

    const textToSend = ownerReplyText.trim();
    setOwnerReplyText('');

    if (onOwnerSendMessage) {
      await onOwnerSendMessage(activeThread.id, textToSend);
    }
  };

  const unreadThreadsCount = chatThreads.filter(t => t.unreadForOwner).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/60 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="bg-white rounded-2xl sm:rounded-ios max-w-4xl w-full p-3.5 sm:p-6 md:p-8 shadow-2xl border-2 border-rose-600 relative max-h-[95vh] flex flex-col my-auto overflow-hidden">
        
        {/* Floating Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-3 right-3 p-1.5 sm:p-2 rounded-full hover:bg-woody-100 text-woody-800 z-10 transition"
          aria-label="Close Admin Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col gap-3 mb-3 border-b border-woody-200 pb-3 shrink-0">
          <div className="flex items-center justify-between pr-8">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="p-2 sm:p-3 bg-rose-600 text-white rounded-xl sm:rounded-2xl shadow-md shrink-0">
                <ShieldAlert className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm sm:text-xl font-extrabold text-rose-700 truncate leading-tight">
                  GOD LEVEL ADMIN
                </h3>
                <p className="text-[10px] sm:text-xs text-woody-500 truncate">
                  Owner control panel & inquiry hub
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 sm:gap-1.5 bg-woody-100 p-1 rounded-xl sm:rounded-2xl border border-woody-200 overflow-x-auto w-full">
            <button
              onClick={() => setActiveTab('inventory')}
              className={`flex-1 min-w-[85px] flex items-center justify-center gap-1 sm:gap-1.5 px-2.5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition shrink-0 ${
                activeTab === 'inventory' ? 'bg-white text-woody-900 shadow-sm' : 'text-woody-600 hover:text-woody-900'
              }`}
            >
              <Package className="w-3.5 h-3.5 text-woody-600" />
              <span>Products</span>
            </button>

            <button
              onClick={() => setActiveTab('video')}
              className={`flex-1 min-w-[110px] flex items-center justify-center gap-1 sm:gap-1.5 px-2.5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition shrink-0 ${
                activeTab === 'video' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-amber-900 bg-amber-500/10 hover:bg-amber-500/20'
              }`}
            >
              <Tv className="w-3.5 h-3.5 text-amber-700" />
              <span>Video Broadcast</span>
            </button>

            <button
              onClick={() => setActiveTab('reservations')}
              className={`flex-1 min-w-[105px] flex items-center justify-center gap-1 sm:gap-1.5 px-2.5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition shrink-0 relative ${
                activeTab === 'reservations' ? 'bg-white text-amber-800 shadow-sm' : 'text-woody-600 hover:text-woody-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-amber-600" />
              <span>Reservations</span>
              {reservations.some(r => r.status === 'pending') && (
                <span className="w-2 h-2 bg-amber-500 rounded-full animate-ping" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('chats')}
              className={`flex-1 min-w-[90px] flex items-center justify-center gap-1 sm:gap-1.5 px-2.5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition shrink-0 relative ${
                activeTab === 'chats' ? 'bg-white text-woody-900 shadow-sm' : 'text-woody-600 hover:text-woody-900'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-rose-600" />
              <span>Inquiries</span>
              {unreadThreadsCount > 0 && (
                <span className="px-1.5 py-0.5 bg-amber-500 text-slate-950 text-[9px] font-black rounded-full animate-bounce shadow-xs">
                  {unreadThreadsCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* LIVE OWNER GPS BROADCAST CONTROL BAR */}
        <div className="bg-slate-900 text-white p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-md mb-3 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
            <div className="min-w-0">
              <h5 className="text-[11px] sm:text-xs font-black text-amber-400 truncate">Live Owner GPS Broadcast</h5>
              <p className="text-[9px] sm:text-[10px] text-slate-300 font-medium truncate">{liveLocationStatus}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleBroadcastAdminLocation}
            disabled={isBroadcastingLocation}
            className="w-full sm:w-auto px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-[10px] font-black rounded-lg sm:rounded-xl transition shrink-0 shadow-sm disabled:opacity-50 flex items-center justify-center gap-1.5"
          >
            {isBroadcastingLocation ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Broadcasting...
              </>
            ) : (
              <>
                <Navigation className="w-3.5 h-3.5" /> Broadcast My GPS
              </>
            )}
          </button>
        </div>

        {/* TAB 1: INVENTORY MANAGEMENT */}
        {activeTab === 'inventory' && (
          <div className="overflow-y-auto flex-1 pr-1 space-y-4 sm:space-y-6">
            
            {/* Form */}
            <form onSubmit={handleCreate} className="bg-woody-50 p-3.5 sm:p-5 rounded-2xl border border-woody-200 space-y-3 sm:space-y-4">
              <h4 className="text-[11px] sm:text-xs font-extrabold text-woody-800 uppercase tracking-wider">Publish New Product with Real Photo</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-woody-700 mb-1">Product Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Handmade Rattan Chair"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white border border-woody-200 rounded-xl px-3 py-2 text-xs text-woody-800"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-woody-700 mb-1">Price (PHP)</label>
                  <input
                    type="number"
                    placeholder="e.g. 4500"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-white border border-woody-200 rounded-xl px-3 py-2 text-xs text-woody-800"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-woody-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-white border border-woody-200 rounded-xl px-3 py-2 text-xs text-woody-800"
                  >
                    <option value="Living Room">Living Room</option>
                    <option value="Dining">Dining</option>
                    <option value="Bedroom">Bedroom</option>
                    <option value="Office">Office</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-woody-700 mb-1">Stock Availability</label>
                  <input
                    type="number"
                    value={stockCount}
                    onChange={(e) => setStockCount(e.target.value)}
                    className="w-full bg-white border border-woody-200 rounded-xl px-3 py-2 text-xs text-woody-800"
                  />
                </div>
              </div>

              {/* OWNER BUILT MATERIAL & WOOD SPECS SECTION */}
              <div className="bg-white p-3 sm:p-4 rounded-xl border border-woody-200/80 space-y-3">
                <div className="flex items-center gap-2 border-b border-woody-100 pb-2">
                  <Trees className="w-4 h-4 text-emerald-700" />
                  <h5 className="text-[11px] sm:text-xs font-black text-woody-900 uppercase tracking-wider">
                    Owner Material & Wood Species Spec Sheet
                  </h5>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] sm:text-[11px] font-bold text-woody-700 mb-1 flex items-center gap-1">
                      <Trees className="w-3 h-3 text-emerald-600" /> Wood Species / Material
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Solid Narra, Natural Yantok/Rattan, Acacia"
                      value={woodSpecies}
                      onChange={(e) => setWoodSpecies(e.target.value)}
                      className="w-full bg-woody-50/80 border border-woody-200 rounded-xl px-3 py-1.5 text-xs text-woody-900 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] sm:text-[11px] font-bold text-woody-700 mb-1 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-amber-600" /> Durability & Treatment
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Class-A Termite Treated, Kiln-Dried"
                      value={durability}
                      onChange={(e) => setDurability(e.target.value)}
                      className="w-full bg-woody-50/80 border border-woody-200 rounded-xl px-3 py-1.5 text-xs text-woody-900 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] sm:text-[11px] font-bold text-woody-700 mb-1 flex items-center gap-1">
                      <Layers className="w-3 h-3 text-sky-600" /> Surface Polish / Finish
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Eco-Matte Polish, UV Polyurethane Wax"
                      value={finishType}
                      onChange={(e) => setFinishType(e.target.value)}
                      className="w-full bg-woody-50/80 border border-woody-200 rounded-xl px-3 py-1.5 text-xs text-woody-900 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] sm:text-[11px] font-bold text-woody-700 mb-1 flex items-center gap-1">
                      <Hammer className="w-3 h-3 text-rose-600" /> Joinery & Craftsmanship
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Mortise & Tenon, Hand-Woven Craft"
                      value={craftsmanship}
                      onChange={(e) => setCraftsmanship(e.target.value)}
                      className="w-full bg-woody-50/80 border border-woody-200 rounded-xl px-3 py-1.5 text-xs text-woody-900 font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Photo Upload */}
              <div className="border-t border-woody-200/80 pt-3">
                <label className="block text-[11px] sm:text-xs font-bold text-woody-700 mb-2">Actual Product Photo</label>
                
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-dashed border-woody-300 bg-white flex items-center justify-center shrink-0 relative">
                    {imageUrl ? (
                      <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-woody-400" />
                    )}
                  </div>

                  <div className="flex-1 w-full space-y-2">
                    <label className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 bg-woody-200 hover:bg-woody-300 text-woody-800 text-xs font-bold rounded-xl cursor-pointer transition shadow-sm">
                      <Upload className="w-4 h-4" />
                      <span>Upload Photo from Device</span>
                      <input type="file" accept="image/*" onChange={handleImageFileUpload} className="hidden" />
                    </label>

                    <div>
                      <span className="text-[9px] text-woody-500 font-semibold uppercase">Or Paste Photo URL:</span>
                      <input
                        type="text"
                        placeholder="https://example.com/item.jpg"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="w-full bg-white border border-woody-200 rounded-xl px-3 py-1.5 text-xs text-woody-800 mt-0.5"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] sm:text-xs font-bold text-woody-700 mb-1">Item Description / Details</label>
                <textarea
                  placeholder="Provide measurements, material specs, or wood species..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-white border border-woody-200 rounded-xl px-3 py-2 text-xs text-woody-800 h-16 sm:h-20"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 sm:py-3 rounded-xl text-xs shadow-md transition flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Publishing...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" /> Publish Furniture Item with Wood Specs
                  </>
                )}
              </button>
            </form>

            {/* Inventory List */}
            <div>
              <h4 className="text-[11px] sm:text-xs font-extrabold text-woody-800 uppercase tracking-wider mb-2">Live Items & Availability Controls</h4>
              <div className="space-y-2 max-h-48 sm:max-h-60 overflow-y-auto">
                {products.length === 0 ? (
                  <p className="text-xs text-woody-400 italic text-center py-4">No published items found.</p>
                ) : (
                  products.map(prod => (
                    <div key={prod.id} className="flex items-center justify-between p-2.5 sm:p-3 bg-white border border-woody-200 rounded-xl gap-2 sm:gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img src={prod.image} alt={prod.name} className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover shrink-0 border border-woody-200" />
                        <div className="min-w-0">
                          <h5 className="font-bold text-xs text-woody-900 truncate">{prod.name}</h5>
                          <p className="text-[10px] sm:text-[11px] text-woody-500">
                            ₱{prod.price?.toLocaleString()} | Wood: {prod.woodSpecies || 'Hardwood'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => onUpdateProduct && onUpdateProduct(prod.id, { inStock: !prod.inStock })}
                          className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[9px] sm:text-[10px] font-bold transition ${
                            prod.inStock ? 'bg-nature-moss text-white' : 'bg-rose-100 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {prod.inStock ? 'In Stock' : 'Out of Stock'}
                        </button>

                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to permanently delete "${prod.name}"?`)) {
                              if (onDeleteProduct) onDeleteProduct(prod.id);
                            }
                          }}
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition border border-rose-200"
                          title="Delete Item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: PROMO VIDEO BROADCAST MANAGEMENT */}
        {activeTab === 'video' && (
          <div className="overflow-y-auto flex-1 space-y-4 pr-1">
            <form onSubmit={handleBroadcastVideo} className="bg-amber-500/10 p-4 sm:p-5 rounded-2xl border-2 border-amber-500/30 space-y-3.5">
              <div className="flex items-center justify-between border-b border-amber-500/20 pb-2.5">
                <div className="flex items-center gap-2">
                  <Tv className="w-5 h-5 text-amber-700" />
                  <h4 className="text-xs sm:text-sm font-black text-amber-950 uppercase tracking-wider">
                    Real-Time Promo Video Broadcast Controls
                  </h4>
                </div>

                <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-amber-300 shadow-xs">
                  <Radio className={`w-3.5 h-3.5 ${isPromoActive && promoVideoUrl ? 'text-emerald-600 animate-pulse' : 'text-slate-400'}`} />
                  <span className="text-[10px] font-bold text-slate-800">
                    {isPromoActive && promoVideoUrl ? 'Broadcasting LIVE' : 'Hidden / Inactive'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-woody-800 mb-1">Promo Title</label>
                  <input
                    type="text"
                    placeholder="e.g. 30% OFF Special Woodcraft Sale"
                    value={promoTitle}
                    onChange={(e) => setPromoTitle(e.target.value)}
                    className="w-full bg-white border border-woody-200 rounded-xl px-3 py-2 text-xs text-woody-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-woody-800 mb-1">Badge Text</label>
                  <input
                    type="text"
                    placeholder="e.g. FLASH SALE or NEW DESIGN"
                    value={promoBadgeText}
                    onChange={(e) => setPromoBadgeText(e.target.value)}
                    className="w-full bg-white border border-woody-200 rounded-xl px-3 py-2 text-xs text-woody-900"
                  />
                </div>
              </div>

              {/* VIDEO SOURCE SELECTION: GALLERY UPLOAD OR PASTE URL */}
              <div className="space-y-2 border-t border-amber-500/20 pt-3">
                <label className="block text-[11px] font-bold text-woody-800">
                  Promotional Video Source
                </label>

                <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-3 rounded-2xl border border-woody-200">
                  <label className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold rounded-xl cursor-pointer transition shadow-sm shrink-0">
                    <Video className="w-4 h-4" />
                    <span>Upload Video from Device / Gallery</span>
                    <input 
                      type="file" 
                      accept="video/*" 
                      onChange={handleVideoFileUpload} 
                      className="hidden" 
                    />
                  </label>

                  <div className="flex-1 w-full space-y-1">
                    <span className="text-[9px] text-woody-500 font-semibold uppercase">Or Paste Video URL (YouTube / Direct MP4):</span>
                    <input
                      type="text"
                      placeholder="https://www.youtube.com/watch?v=... or MP4 link"
                      value={promoVideoUrl}
                      onChange={(e) => {
                        setPromoVideoUrl(e.target.value);
                        setUploadingVideoFileName('');
                      }}
                      className="w-full bg-woody-50 border border-woody-200 rounded-xl px-3 py-1.5 text-xs text-woody-900 font-mono"
                    />
                  </div>
                </div>

                {uploadingVideoFileName && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-100/80 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span className="truncate">Selected from device: {uploadingVideoFileName}</span>
                  </div>
                )}
              </div>

              {/* AUTOMATIC EXPIRATION / DUE DATE INPUT */}
              <div>
                <label className="block text-[11px] font-bold text-woody-800 mb-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-700" />
                  <span>Promo Expiration Date & Time (Optional Auto-Remove)</span>
                </label>
                <input
                  type="datetime-local"
                  value={promoDueDate}
                  onChange={(e) => setPromoDueDate(e.target.value)}
                  className="w-full bg-white border border-woody-200 rounded-xl px-3 py-2 text-xs text-woody-900"
                />
                <span className="text-[9px] text-woody-500 mt-1 block">
                  When this date/time is reached, the video banner will automatically disappear from the storefront.
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-woody-800 mb-1">Promo Description / Announcement Note</label>
                <textarea
                  placeholder="Describe your sale, discount code, or new arrivals..."
                  value={promoDescription}
                  onChange={(e) => setPromoDescription(e.target.value)}
                  className="w-full bg-white border border-woody-200 rounded-xl px-3 py-2 text-xs text-woody-900 h-16"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between border-t border-amber-500/20 gap-3">
                <label className="flex items-center gap-2 cursor-pointer w-full sm:w-auto">
                  <input
                    type="checkbox"
                    checked={isPromoActive}
                    onChange={(e) => setIsPromoActive(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-woody-900">
                    Enable Live Video Banner
                  </span>
                </label>

                {/* ACTION BUTTONS: BROADCAST & DELETE */}
                <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                  {promoVideoUrl && (
                    <button
                      type="button"
                      onClick={handleDeletePromo}
                      disabled={isPublishingPromo}
                      className="flex-1 sm:flex-none px-3.5 py-2.5 bg-rose-100 hover:bg-rose-200 text-rose-700 border border-rose-300 font-bold text-xs rounded-xl transition shadow-xs flex items-center justify-center gap-1.5 disabled:opacity-50"
                      title="Permanently Delete Promo"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete Broadcast</span>
                    </button>
                  )}

                  <button
                    type="submit"
                    disabled={isPublishingPromo}
                    className="flex-1 sm:flex-none px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl transition shadow-md flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    {isPublishingPromo ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Processing...
                      </>
                    ) : (
                      <>
                        <Flame className="w-4 h-4" /> Broadcast Live Now
                      </>
                    )}
                  </button>
                </div>

              </div>
            </form>
          </div>
        )}

        {/* TAB 3: RESERVATIONS MANAGEMENT */}
        {activeTab === 'reservations' && (
          <div className="overflow-y-auto flex-1 space-y-2.5 sm:space-y-3 pr-1">
            <h4 className="text-[11px] sm:text-xs font-extrabold text-woody-800 uppercase tracking-wider mb-2">Customer Reservation Requests & Verification</h4>
            
            {reservations.length === 0 ? (
              <p className="text-xs text-woody-400 italic text-center py-10">No customer reservations found yet.</p>
            ) : (
              reservations.map((res) => (
                <div key={res.id} className="p-3 sm:p-4 bg-woody-50 border border-woody-200 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={res.productImage} alt={res.productName} className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover shrink-0 border border-woody-200" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h5 className="font-extrabold text-xs text-woody-900 truncate">{res.productName}</h5>
                        <span className="text-[10px] sm:text-[11px] font-black text-rose-700">₱{res.productPrice?.toLocaleString()}</span>
                      </div>
                      <p className="text-[10px] sm:text-[11px] text-woody-600 font-medium mt-0.5 truncate">
                        Customer: <span className="font-bold text-woody-900">{res.userName}</span> ({res.userEmail})
                      </p>
                      <p className="text-[9px] sm:text-[10px] text-woody-400 mt-0.5">Date: {res.dateStr || 'Recently'}</p>
                    </div>
                  </div>

                  {/* Verification PIN Badge */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0 justify-between md:justify-end border-t md:border-t-0 pt-2 md:pt-0 border-woody-200/80">
                    
                    <div className="bg-slate-900 text-slate-100 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl border border-slate-700 flex items-center gap-1.5 shadow-md shrink-0">
                      <Key className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="text-[9px] sm:text-[10px] text-amber-300 font-extrabold uppercase">PIN:</span>
                      <span className="text-xs font-black tracking-widest font-mono bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded-md">
                        {res.pinCode || '******'}
                      </span>
                    </div>

                    {/* Action Controls */}
                    <div className="flex items-center gap-1">
                      {res.status === 'pending' && (
                        <button
                          onClick={() => onUpdateReservationStatus && onUpdateReservationStatus(res.id, 'confirmed')}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 transition shadow-sm"
                        >
                          <Check className="w-3 h-3" /> Confirm
                        </button>
                      )}

                      {res.status === 'confirmed' && (
                        <button
                          onClick={() => onUpdateReservationStatus && onUpdateReservationStatus(res.id, 'completed')}
                          className="px-2.5 py-1 bg-woody-800 hover:bg-woody-900 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 transition shadow-sm"
                        >
                          <CheckCircle2 className="w-3 h-3 text-amber-400" /> Picked-Up
                        </button>
                      )}

                      {res.status !== 'cancelled' && res.status !== 'completed' && (
                        <button
                          onClick={() => onUpdateReservationStatus && onUpdateReservationStatus(res.id, 'cancelled')}
                          className="p-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-[10px] font-bold transition border border-rose-200"
                          title="Reject / Cancel"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {res.status === 'completed' && (
                        <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                          Completed
                        </span>
                      )}
                    </div>

                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 4: LIVE CUSTOMER INQUIRY CHAT CENTER */}
        {activeTab === 'chats' && (
          <div className="flex-1 flex flex-col md:flex-row gap-3 overflow-hidden min-h-0">
            
            {/* Customer List Sidebar */}
            <div className={`w-full md:w-1/3 bg-woody-50 rounded-2xl border border-woody-200 p-2.5 flex flex-col shrink-0 ${
              mobileShowChatConsole ? 'hidden md:flex' : 'flex flex-1 md:flex-none'
            }`}>
              <div className="flex items-center justify-between mb-2 px-1">
                <h4 className="text-[11px] font-extrabold text-woody-800 uppercase tracking-wider">Customer Inquiries</h4>
                {unreadThreadsCount > 0 && (
                  <span className="text-[9px] font-extrabold bg-amber-500/20 text-amber-900 border border-amber-500/30 px-2 py-0.5 rounded-full">
                    {unreadThreadsCount} Unread
                  </span>
                )}
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[160px] md:max-h-none">
                {sortedChatThreads.map(thread => {
                  const isSelected = (selectedThreadId || sortedChatThreads[0]?.id) === thread.id;
                  const isUnread = thread.unreadForOwner;

                  return (
                    <div
                      key={thread.id}
                      onClick={() => handleSelectThread(thread.id)}
                      className={`p-2.5 rounded-xl cursor-pointer transition border text-left relative ${
                        isSelected
                          ? 'bg-woody-600 text-white border-woody-600 shadow-sm'
                          : isUnread
                            ? 'bg-amber-500/10 hover:bg-amber-500/20 text-woody-900 border-amber-400/80 shadow-xs'
                            : 'bg-white hover:bg-woody-100 text-woody-800 border-woody-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-0.5 gap-1">
                        <div className="font-bold text-xs flex items-center gap-1.5 min-w-0">
                          <User className="w-3 h-3 shrink-0" />
                          <span className="truncate">{thread.customerName}</span>
                        </div>

                        {/* EARTHY PULSING UNREAD DOT INDICATOR */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          {isUnread && (
                            <div className="flex items-center gap-1 bg-amber-500 text-slate-950 px-1.5 py-0.5 rounded-full shadow-xs">
                              <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-900 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-950"></span>
                              </span>
                              <span className="text-[8px] font-black uppercase tracking-wider">NEW</span>
                            </div>
                          )}

                          <span className={`text-[9px] ${isSelected ? 'text-woody-200' : 'text-woody-400'}`}>
                            {thread.lastActive}
                          </span>
                        </div>
                      </div>

                      <p className={`text-[10px] line-clamp-1 ${
                        isSelected 
                          ? 'text-woody-100' 
                          : isUnread 
                            ? 'text-amber-950 font-bold' 
                            : 'text-woody-600'
                      }`}>
                        {thread.messages?.[thread.messages.length - 1]?.text || 'No messages yet'}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Chat Thread Console */}
            <div className={`flex-1 bg-white rounded-2xl border border-woody-200 flex flex-col overflow-hidden min-h-[260px] md:min-h-0 ${
              mobileShowChatConsole ? 'flex' : 'hidden md:flex'
            }`}>
              {activeThread ? (
                <>
                  {/* Thread Header */}
                  <div className="p-2.5 bg-woody-100 border-b border-woody-200 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <button
                        onClick={() => setMobileShowChatConsole(false)}
                        className="p-1 rounded-lg bg-white text-woody-800 md:hidden border border-woody-200"
                        title="Back to inquiries list"
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </button>

                      <div className="w-7 h-7 rounded-full bg-woody-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                        {activeThread.customerName ? activeThread.customerName[0] : 'U'}
                      </div>
                      <div className="min-w-0">
                        <h5 className="font-bold text-xs text-woody-900 truncate">{activeThread.customerName}</h5>
                        <p className="text-[9px] text-nature-forest font-semibold truncate">Active Customer Inquiry</p>
                      </div>
                    </div>

                    <span className="text-[9px] bg-nature-sage/20 text-nature-forest px-2 py-0.5 rounded-full font-bold flex items-center gap-1 shrink-0">
                      <CheckCircle2 className="w-3 h-3" /> Live
                    </span>
                  </div>

                  {/* Messages Feed */}
                  <div className="flex-1 p-3 overflow-y-auto space-y-2.5 bg-woody-50/50">
                    {activeThread.messages?.map((msg, idx) => {
                      // Render Contact Request Card with Owner Action Controls
                      if (msg.type === 'contact_request') {
                        return (
                          <ContactRequestCard 
                            key={msg.id || idx}
                            message={msg}
                            chatId={activeThread.id}
                            isAdmin={true}
                            ownerPhone={OWNER_PHONE_NUMBER}
                            onRespond={handleAdminRespond}
                          />
                        );
                      }

                      // Default standard message bubble
                      return (
                        <div key={msg.id || idx} className={`flex ${msg.sender === 'owner' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[88%] sm:max-w-[80%] p-2.5 rounded-2xl text-[11px] sm:text-xs leading-relaxed ${
                            msg.sender === 'owner'
                              ? 'bg-rose-600 text-white rounded-br-none shadow-sm'
                              : 'bg-white text-woody-800 border border-woody-200 rounded-bl-none shadow-sm'
                          }`}>
                            <p className="font-semibold text-[9px] opacity-75 mb-0.5">
                              {msg.sender === 'owner' ? 'Owner / You' : activeThread.customerName}
                            </p>
                            <p className="whitespace-pre-wrap">{msg.text}</p>
                            <span className={`block text-[8px] sm:text-[9px] mt-1 text-right ${msg.sender === 'owner' ? 'text-rose-100' : 'text-woody-400'}`}>
                              {msg.time}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Reply Input Form */}
                  <form onSubmit={handleSendReply} className="p-2.5 bg-white border-t border-woody-200 flex items-center gap-2 shrink-0">
                    <input
                      type="text"
                      placeholder={`Reply to ${activeThread.customerName}...`}
                      value={ownerReplyText}
                      onChange={(e) => setOwnerReplyText(e.target.value)}
                      className="flex-1 bg-woody-50 border border-woody-200 rounded-full px-3.5 py-2 text-xs text-woody-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                    <button
                      type="submit"
                      className="p-2 rounded-full bg-rose-600 text-white hover:bg-rose-700 transition shadow-sm shrink-0"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-xs text-woody-400">
                  Select a customer thread to start replying.
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}