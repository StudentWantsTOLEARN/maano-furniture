import React from 'react';
import { MessageSquare, Flame, Clock } from 'lucide-react';

export default function PromoVideoBanner({ promoData, onOpenChat }) {
  if (!promoData || !promoData.isActive || !promoData.videoUrl) return null;

  // AUTO-REMOVE: Check if the promo has passed its scheduled Due Date / Expiration
  if (promoData.dueDate) {
    const currentTime = new Date();
    const expirationTime = new Date(promoData.dueDate);
    if (currentTime > expirationTime) {
      return null; // Automatically hides from storefront when expired
    }
  }

  const isYouTube = promoData.videoUrl.includes('youtube.com') || promoData.videoUrl.includes('youtu.be');

  const getYouTubeEmbedUrl = (url) => {
    let videoId = '';
    if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0];
    } else if (url.includes('watch?v=')) {
      videoId = url.split('watch?v=')[1]?.split('&')[0];
    }
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=1`;
  };

  // Format Due Date for display
  const formattedDueDate = promoData.dueDate 
    ? new Date(promoData.dueDate).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : null;

  return (
    <section className="max-w-7xl mx-auto px-4 lg:px-12 py-4 animate-fadeIn">
      <div className="bg-[#23120B] border-2 border-[#522B15] rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-6 p-4 sm:p-6 text-amber-50 relative">
        
        {/* Real-time Live Badge */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 flex items-center gap-2 bg-amber-500/20 backdrop-blur-md text-amber-300 px-3 py-1 rounded-full border border-amber-500/40">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
          </span>
          <span className="text-[10px] font-black uppercase tracking-wider">Live Owner Broadcast</span>
        </div>

        {/* Video Player Box */}
        <div className="w-full lg:w-3/5 bg-[#130904] rounded-2xl overflow-hidden border border-[#3D1E0E] shadow-inner relative aspect-video flex items-center justify-center">
          {isYouTube ? (
            <iframe
              src={getYouTubeEmbedUrl(promoData.videoUrl)}
              title="Promotional Video"
              className="w-full h-full border-0"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          ) : (
            <video
              src={promoData.videoUrl}
              autoPlay
              loop
              muted
              playsInline
              controls
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Content & Call to Action */}
        <div className="w-full lg:w-2/5 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500 text-[#130904] text-xs font-black rounded-xl shadow-md uppercase tracking-wide">
                <Flame className="w-3.5 h-3.5" />
                <span>{promoData.badgeText || 'SPECIAL ANNOUNCEMENT'}</span>
              </div>

              {formattedDueDate && (
                <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-950/80 text-rose-300 text-[10px] font-bold rounded-xl border border-rose-800/50">
                  <Clock className="w-3 h-3 text-rose-400" />
                  <span>Ends: {formattedDueDate}</span>
                </div>
              )}
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-amber-200 leading-tight">
              {promoData.title || 'Exclusive New Design Release'}
            </h3>

            <p className="text-xs sm:text-sm text-amber-200/80 leading-relaxed">
              {promoData.description || 'Check out our latest handcrafted woodcraft items and limited discount offers directly from the workshop.'}
            </p>
          </div>

          <div className="pt-2 border-t border-[#3D1E0E] flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenChat}
              className="flex-1 py-3 px-4 bg-amber-500 hover:bg-amber-400 text-[#130904] font-black text-xs rounded-xl transition shadow-md flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Inquire Shop Now</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}