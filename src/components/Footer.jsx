import React, { useState } from 'react';

export default function Footer({ onTriggerAdmin, user }) {
  const [clickCount, setClickCount] = useState(0);

  const handleSecretClick = () => {
    // HARD CHECK: Ignore clicks completely if not a God-Level Admin
    if (!user || !user.isAdmin) return;

    const nextCount = clickCount + 1;
    if (nextCount >= 5) {
      onTriggerAdmin();
      setClickCount(0);
    } else {
      setClickCount(nextCount);
    }
  };

  return (
    <footer className="bg-woody-900 text-woody-300 py-8 border-t border-woody-800 text-xs mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <p className="font-extrabold text-sm text-white"></p>
          <p className="text-[11px] text-woody-400 mt-0.5">
            Direct Shop-to-Customer Real-Time Furniture Showroom
          </p>
        </div>

        <div className="text-center md:text-right text-[11px] text-woody-400">
          <p
            onClick={handleSecretClick}
            className={`transition-colors select-none ${
              user?.isAdmin ? 'cursor-pointer hover:text-woody-200' : 'cursor-default'
            }`}
            title={user?.isAdmin ? 'God-Level Secret Trigger' : undefined}
          >
            © 2026 Maano Furniture. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}