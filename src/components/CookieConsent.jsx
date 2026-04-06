import React, { useState, useEffect } from 'react';
import { Cookie } from 'lucide-react';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setIsVisible(false);
  };

  const handleDecline = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
      <div className="bg-black rounded-xl shadow-2xl border border-gray-800 flex items-center gap-3 px-4 py-3 pointer-events-auto min-w-[320px] max-w-sm">
        
        <div className="flex-shrink-0 group/cookie cursor-pointer">
          <div className="p-1.5 bg-gray-800 dark:bg-gray-800 rounded-md group-hover:bg-amber-500 transition-colors">
            <Cookie className="text-white" size={14} strokeWidth={2.5} />
          </div>
        </div>

        {/* Text */}
        <p className="text-xs text-gray-300 flex-1 leading-snug">
          We use cookies to improve your experience.
        </p>

        {/* Buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleDecline}
            className="text-xs font-semibold text-gray-500 hover:text-gray-300 transition-colors px-2 py-1"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="text-xs font-bold px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-amber-500 text-white transition-all hover:scale-105 active:scale-95 shadow-sm shadow-black"
          >
            Accept
          </button>
        </div>

      </div>
    </div>
  );
}
