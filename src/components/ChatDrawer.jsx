import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  Store, 
  MessageSquare, 
  MapPin, 
  Navigation, 
  ExternalLink, 
  Loader2, 
  Compass, 
  ChevronUp,
  Phone
} from 'lucide-react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { requestOwnerContact } from '../services/chatService';
import { ContactRequestCard } from './ContactRequestCard';

export default function ChatDrawer({
  isOpen,
  onClose,
  activeShop = 'Maano Woodcraft Palawan',
  shopLocation = 'Puerto Princesa, Palawan',
  chatId,
  messages = [],
  onCustomerSendMessage
}) {
  const [inputText, setInputText] = useState('');
  const [showMap, setShowMap] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [isRequestingNumber, setIsRequestingNumber] = useState(false);
  
  // Locations
  const [userCoords, setUserCoords] = useState(null);
  const [adminLiveCoords, setAdminLiveCoords] = useState(null);
  
  const messagesEndRef = useRef(null);

  // Default Shop Location link
  const DEFAULT_SHOP_LINK = 'https://maps.app.goo.gl/Z64wXze8PkSrKC327';
  const DEFAULT_SHOP_QUERY = 'Maano Woodcraft, Puerto Princesa City, Palawan, Philippines';

  // 1. Listen in real-time to Admin's Live GPS coordinates from Firestore
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'shopLocation', 'activeShop'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.lat && data.lng) {
          setAdminLiveCoords({ lat: data.lat, lng: data.lng, isLive: data.isLive });
        }
      }
    });

    return () => unsub();
  }, []);

  // 2. Auto-scroll chat feed
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, showMap]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    if (onCustomerSendMessage) {
      onCustomerSendMessage(inputText.trim());
    }
    setInputText('');
  };

  // Trigger Customer Phone Number Request (With Auto Chat Creation)
  const handleRequestNumber = async () => {
    setIsRequestingNumber(true);
    try {
      let activeChatId = chatId;

      // If no chat session ID exists yet, create the thread first
      if (!activeChatId && onCustomerSendMessage) {
        activeChatId = await onCustomerSendMessage("📱 Requested owner direct phone number.");
      }

      // If activeChatId exists (or was just returned), submit the request card
      if (activeChatId) {
        await requestOwnerContact(activeChatId);
      }
    } catch (err) {
      console.error("Failed to request owner number:", err);
      alert("Failed to submit request. Please try again.");
    } finally {
      setIsRequestingNumber(false);
    }
  };

  // Trigger Customer GPS Geolocation & Toggle Embedded Route Map
  const handleToggleRoute = () => {
    if (showMap) {
      setShowMap(false);
      return;
    }

    setShowMap(true);

    if (!navigator.geolocation) return;

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        setUserCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        setIsLocating(false);
        console.warn("Location permission fallback used:", error.message);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Determine Target Destination Coordinates (Live Admin GPS vs Static Address)
  const targetDestination = adminLiveCoords 
    ? `${adminLiveCoords.lat},${adminLiveCoords.lng}`
    : encodeURIComponent(DEFAULT_SHOP_QUERY);

  // Construct Embedded Google Maps Route URL
  const embedMapUrl = userCoords
    ? `https://maps.google.com/maps?saddr=${userCoords.lat},${userCoords.lng}&daddr=${targetDestination}&output=embed`
    : `https://maps.google.com/maps?q=${targetDestination}&output=embed`;

  // External App Route Link
  const externalRouteUrl = userCoords && adminLiveCoords
    ? `https://www.google.com/maps/dir/?api=1&origin=${userCoords.lat},${userCoords.lng}&destination=${adminLiveCoords.lat},${adminLiveCoords.lng}`
    : DEFAULT_SHOP_LINK;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div 
        onClick={onClose} 
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity" 
      />

      {/* Responsive Drawer Container */}
      <div className="absolute inset-y-0 right-0 max-w-full flex w-full sm:w-auto pl-0 sm:pl-10">
        <div className="w-full sm:w-96 md:w-[420px] bg-woody-50 shadow-2xl border-l border-woody-200 flex flex-col h-full">
          
          {/* Header */}
          <div className="p-4 bg-woody-800 text-white flex flex-col border-b border-woody-700 shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2.5 bg-woody-900 text-amber-400 rounded-xl border border-woody-700 shrink-0 shadow-inner">
                  <Store className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-extrabold tracking-tight text-white truncate">
                    {activeShop}
                  </h3>
                  <p className="text-[11px] text-amber-200/90 font-medium truncate flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                    <span>{shopLocation}</span>
                  </p>
                </div>
              </div>

              <button 
                onClick={onClose} 
                className="p-1.5 rounded-full hover:bg-woody-700 text-woody-200 hover:text-white transition shrink-0"
                aria-label="Close Chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Live Route Toggle Banner */}
            <div className="mt-3 bg-woody-900/90 p-2.5 rounded-xl border border-woody-700/80 flex items-center justify-between gap-2 shadow-inner">
              <div className="flex items-center gap-2 min-w-0">
                <Navigation className={`w-4 h-4 shrink-0 ${showMap ? 'text-amber-400 animate-pulse' : 'text-amber-400'}`} />
                <span className="text-[11px] text-woody-200 font-medium truncate">
                  {adminLiveCoords ? '⚡ Live Admin GPS Stream Active' : 'Get live route & ETA to shop'}
                </span>
              </div>

              <button
                type="button"
                onClick={handleToggleRoute}
                className={`px-3 py-1.5 rounded-lg font-extrabold text-[10px] transition flex items-center gap-1 shrink-0 shadow-sm ${
                  showMap 
                    ? 'bg-woody-700 text-amber-300 hover:bg-woody-600 border border-woody-600' 
                    : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                }`}
              >
                {isLocating ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" /> Locating...
                  </>
                ) : showMap ? (
                  <>
                    <span>Hide Map</span>
                    <ChevronUp className="w-3 h-3" />
                  </>
                ) : (
                  <>
                    <span>Get Route</span>
                    <Compass className="w-3 h-3" />
                  </>
                )}
              </button>
            </div>

            {/* Direct Contact Number Request Trigger */}
            <div className="mt-2 bg-woody-900/60 px-3 py-2 rounded-xl border border-woody-700/60 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="text-[11px] text-amber-100 font-medium truncate">
                  Need direct phone contact?
                </span>
              </div>
              <button
                type="button"
                onClick={handleRequestNumber}
                disabled={isRequestingNumber}
                className="px-2.5 py-1 rounded-lg font-bold text-[10px] bg-woody-700 hover:bg-woody-600 text-amber-200 border border-woody-600 transition flex items-center gap-1 shrink-0 disabled:opacity-50"
              >
                {isRequestingNumber ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" /> Requesting...
                  </>
                ) : (
                  'Request Number'
                )}
              </button>
            </div>
          </div>

          {/* IN-CHAT EMBEDDED LIVE ROUTER MINI-MAP */}
          {showMap && (
            <div className="bg-slate-900 border-b-2 border-amber-500 shadow-lg flex flex-col shrink-0 animate-fadeIn">
              <div className="px-3 py-2 bg-slate-950 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>
                    {adminLiveCoords ? 'Live Admin GPS Route Active' : 'Fixed Shop Location Route'}
                  </span>
                </div>
                
                <a 
                  href={externalRouteUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-amber-400 hover:text-amber-300 flex items-center gap-1 text-[10px] font-bold transition"
                >
                  Open in Google Maps <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="w-full h-60 relative bg-slate-800">
                <iframe
                  title="Shop Live Route Map"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  src={embedMapUrl}
                  className="w-full h-full"
                />
              </div>
            </div>
          )}

          {/* Messages Feed */}
          <div className="flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-3 bg-woody-50">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-woody-500">
                <div className="w-12 h-12 rounded-full bg-woody-200/60 flex items-center justify-center mb-3 text-woody-700">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h4 className="font-extrabold text-xs text-woody-800 mb-1">Start a Conversation</h4>
                <p className="text-[11px] text-woody-500 leading-relaxed max-w-xs">
                  Ask Maano Woodcraft Palawan about custom wood finishes, dimensions, availability, or delivery options in Palawan.
                </p>
              </div>
            ) : (
              messages.map((msg, idx) => {
                // Render Contact Request Card if message type matches
                if (msg.type === 'contact_request') {
                  return (
                    <ContactRequestCard 
                      key={msg.id || idx}
                      message={msg}
                      chatId={chatId}
                      isAdmin={false}
                    />
                  );
                }

                // Default standard message bubble
                return (
                  <div 
                    key={msg.id || idx} 
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[85%] sm:max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed shadow-xs ${
                        msg.sender === 'user'
                          ? 'bg-woody-800 text-white rounded-br-none'
                          : 'bg-white text-woody-900 border border-woody-200/80 rounded-bl-none'
                      }`}
                    >
                      <p className="font-semibold text-[10px] opacity-75 mb-0.5">
                        {msg.sender === 'user' ? 'You' : 'Maano Woodcraft Palawan'}
                      </p>
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                      <span className={`block text-[9px] mt-1 text-right ${msg.sender === 'user' ? 'text-woody-300' : 'text-woody-400'}`}>
                        {msg.time}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input Form */}
          <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-woody-200 flex items-center gap-2 shrink-0">
            <input
              type="text"
              placeholder="Type your inquiry to the shop owner..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-woody-50 border border-woody-200 rounded-full px-4 py-2.5 text-xs text-woody-900 focus:outline-none focus:ring-2 focus:ring-woody-600 placeholder:text-woody-400"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 rounded-full bg-woody-800 hover:bg-woody-900 text-white transition shadow-sm disabled:opacity-40 shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}