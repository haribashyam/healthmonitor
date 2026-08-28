import React, { useState } from 'react';
import { ShieldCheck, Mail, ArrowRight, Award, Lock, BookOpen } from 'lucide-react';

interface FooterProps {
  onNavigateTab: (tab: string) => void;
  theme?: 'dark' | 'light';
}

export const Footer: React.FC<FooterProps> = ({ onNavigateTab, theme = 'dark' }) => {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');

  const isDark = theme === 'dark';

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
    }
  };

  return (
    <footer className={`border-t font-mono select-none mt-16 transition-colors ${
      isDark
        ? 'bg-[#111111] border-[#262626] text-[#F9F9F7]'
        : 'bg-[#FFFFFF] border-[#111111] text-[#111111]'
    }`}>
      
      {/* 1. Colophon Top Ornament & Wire Notice */}
      <div className={`py-3 px-4 sm:px-8 border-b ${
        isDark ? 'border-[#262626] bg-[#141414]' : 'border-[#111111] bg-[#F2F2EC]'
      }`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-3">
            <span className="font-serif font-black text-base tracking-tight uppercase">
              THE VITALSYNC GAZETTE
            </span>
            <span className={isDark ? 'text-[#555555]' : 'text-[#888888]'}>|</span>
            <span className={`text-xs ${isDark ? 'text-[#888888]' : 'text-[#666666]'}`}>
              ESTABLISHED MMXXVI • NEW YORK &amp; CYBERSPACE
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-[#CC0000]">
            <Award className="w-4 h-4" />
            <span>PULITZER-CALIBER BIOMETRIC INTEGRITY</span>
          </div>
        </div>
      </div>

      {/* 2. Main Multi-Column Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 border-b ${
          isDark ? 'border-[#262626]' : 'border-[#D4D4CE]'
        } pb-10`}>
          
          {/* Col 1 & 2: Masthead Mission & Subscription */}
          <div className={`lg:col-span-2 space-y-4 lg:pr-6 ${
            isDark ? 'lg:border-r border-[#262626]' : 'lg:border-r border-[#D4D4CE]'
          }`}>
            <h3 className="font-serif font-black text-xl uppercase tracking-tight">
              A PUBLICATION OF BIOMETRIC RECORD
            </h3>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-[#AAAAAA]' : 'text-[#555555]'}`}>
              VitalSync is committed to delivering uncompromised physiological truth through continuous optical, electrical, and clinical lab telemetry.
            </p>

            {/* Newsletter Dispatch Subscription */}
            <div className="pt-2">
              <span className="text-[11px] font-bold uppercase tracking-widest block mb-2">
                SUBSCRIBE TO THE DAILY MORNING DISPATCH
              </span>
              {subscribed ? (
                <div className={`p-3 border text-xs font-bold text-[#CC0000] ${
                  isDark ? 'border-[#333333] bg-[#181818]' : 'border-[#CCCCCC] bg-[#F2F2EC]'
                }`}>
                  ✓ SUBSCRIPTION CONFIRMED. MORNING TELEMETRY WILL ARRIVE AT 06:00 EST.
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ENTER EMAIL FOR MORNING DISPATCH..."
                    className={`flex-1 border-b px-3 py-2 text-xs focus:outline-none ${
                      isDark
                        ? 'border-[#444444] bg-transparent focus:bg-[#181818] placeholder:text-[#666666] text-white'
                        : 'border-[#111111] bg-transparent focus:bg-[#F2F2EC] placeholder:text-[#888888] text-black'
                    }`}
                  />
                  <button
                    type="submit"
                    className={`px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-colors ${
                      isDark
                        ? 'bg-white text-[#111111] hover:bg-[#EAEAEA]'
                        : 'bg-[#111111] text-white hover:bg-[#222222]'
                    }`}
                  >
                    <span>JOIN</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Col 3: Sections & Desks */}
          <div className="space-y-3 text-xs">
            <span className={`font-bold text-xs uppercase tracking-wider block border-b pb-1 ${
              isDark ? 'border-[#262626]' : 'border-[#D4D4CE]'
            }`}>
              EDITORIAL DESKS
            </span>
            <ul className={`space-y-2 ${isDark ? 'text-[#888888]' : 'text-[#666666]'}`}>
              <li>
                <button onClick={() => onNavigateTab('command')} className={isDark ? 'hover:text-white' : 'hover:text-black'}>
                  FRONT PAGE LEAD
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('vitals')} className={isDark ? 'hover:text-white' : 'hover:text-black'}>
                  HEALTH &amp; VITALS WIRE
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('coach')} className={isDark ? 'hover:text-white' : 'hover:text-black'}>
                  AI HEALTH COPILOT
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('sources')} className={isDark ? 'hover:text-white' : 'hover:text-black'}>
                  DATA HUB &amp; LAB OCR
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('strength')} className={isDark ? 'hover:text-white' : 'hover:text-black'}>
                  STRENGTH &amp; 1RM ARCHIVE
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Specialized Portals */}
          <div className="space-y-3 text-xs">
            <span className={`font-bold text-xs uppercase tracking-wider block border-b pb-1 ${
              isDark ? 'border-[#262626]' : 'border-[#D4D4CE]'
            }`}>
              SPECIAL EDITIONS
            </span>
            <ul className={`space-y-2 ${isDark ? 'text-[#888888]' : 'text-[#666666]'}`}>
              <li>
                <button onClick={() => onNavigateTab('supplements')} className={isDark ? 'hover:text-white' : 'hover:text-black'}>
                  MEDICATION MATRIX
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('metabolic')} className={isDark ? 'hover:text-white' : 'hover:text-black'}>
                  BODY &amp; METABOLIC DEXA
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('experiments')} className={isDark ? 'hover:text-white' : 'hover:text-black'}>
                  EXPERIMENTS LAB
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('circadian')} className={isDark ? 'hover:text-white' : 'hover:text-black'}>
                  CIRCADIAN &amp; AQI DESK
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('twin')} className={isDark ? 'hover:text-white' : 'hover:text-black'}>
                  DIGITAL RADAR TWIN
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Legal Charter & Standards */}
          <div className="space-y-3 text-xs">
            <span className={`font-bold text-xs uppercase tracking-wider block border-b pb-1 ${
              isDark ? 'border-[#262626]' : 'border-[#D4D4CE]'
            }`}>
              TRUST &amp; CHARTER
            </span>
            <ul className={`space-y-2 ${isDark ? 'text-[#888888]' : 'text-[#666666]'}`}>
              <li>
                <button onClick={() => onNavigateTab('legal')} className={`flex items-center gap-1 ${isDark ? 'hover:text-white' : 'hover:text-black'}`}>
                  <ShieldCheck className="w-3.5 h-3.5 text-[#CC0000]" /> HIPAA &amp; GDPR CHARTER
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('legal')} className={`flex items-center gap-1 ${isDark ? 'hover:text-white' : 'hover:text-black'}`}>
                  <Lock className="w-3.5 h-3.5" /> ZERO DATA-SALE PLEDGE
                </button>
              </li>
              <li>
                <span className={`text-[10px] block pt-2 ${isDark ? 'text-[#666666]' : 'text-[#888888]'}`}>
                  ISSN 2831-904X • VOL. 1 NO. 01
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* 3. Colophon Bottom Imprint */}
        <div className={`pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs ${
          isDark ? 'text-[#777777]' : 'text-[#666666]'
        } text-center md:text-left`}>
          <p className="text-[11px] leading-relaxed max-w-2xl">
            <strong className={`font-bold uppercase ${isDark ? 'text-[#AAAAAA]' : 'text-[#333333]'}`}>EDITORIAL NOTICE:</strong> VitalSync is a personal health intelligence platform and telemetric recording device.
          </p>

          <div className={`text-[10px] uppercase font-bold ${isDark ? 'text-[#AAAAAA]' : 'text-[#333333]'}`}>
            &copy; {new Date().getFullYear()} THE VITALSYNC GAZETTE. ALL RIGHTS RESERVED.
          </div>
        </div>

      </div>
    </footer>
  );
};
