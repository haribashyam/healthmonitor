import React, { useState, useEffect } from 'react';
import { Cookie, ShieldCheck, X, Sliders } from 'lucide-react';

interface CookieBannerProps {
  onOpenPreferences: () => void;
}

export const CookieBanner: React.FC<CookieBannerProps> = ({ onOpenPreferences }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('vitalos_cookie_consent_dismissed');
    if (!dismissed) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('vitalos_cookie_consent_dismissed', 'true');
    setIsVisible(false);
  };

  const handleDeclineOptional = () => {
    localStorage.setItem('vitalos_cookie_consent_dismissed', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-2xl text-slate-100 animate-slideUp">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex-shrink-0 mt-0.5">
          <Cookie className="w-5 h-5" />
        </div>

        <div className="space-y-2 flex-1 text-xs">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-white text-xs">Self-Sovereign Cookie Notice</h4>
            <button
              onClick={handleDeclineOptional}
              className="text-slate-400 hover:text-white p-0.5"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-slate-400 leading-relaxed text-[11px]">
            We use essential local cache tokens to keep your Web Bluetooth streams and encrypted session state active. No ad trackers or third-party data sales ever.
          </p>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleAcceptAll}
              className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-sm"
            >
              Accept All
            </button>
            <button
              onClick={handleDeclineOptional}
              className="px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold"
            >
              Essential Only
            </button>
            <button
              onClick={() => {
                setIsVisible(false);
                onOpenPreferences();
              }}
              className="px-2.5 py-1.5 text-cyan-400 hover:underline text-xs flex items-center gap-1 font-semibold"
            >
              <Sliders className="w-3 h-3" /> Customize
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
