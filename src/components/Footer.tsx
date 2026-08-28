import React, { useState } from 'react';
import { ShieldCheck, Mail, ArrowRight, Award, Lock, BookOpen } from 'lucide-react';

interface FooterProps {
  onNavigateTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateTab }) => {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
    }
  };

  return (
    <footer className="bg-[#111111] border-t border-[#262626] text-[#F9F9F7] mt-16 font-mono select-none">
      
      {/* 1. Colophon Top Ornament & Wire Notice */}
      <div className="border-b border-[#262626] py-3 px-4 sm:px-8 bg-[#141414]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-3">
            <span className="font-serif font-black text-base tracking-tight uppercase text-white">
              THE VITALSYNC GAZETTE
            </span>
            <span className="text-[#555555]">|</span>
            <span className="text-xs text-[#888888]">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 border-b border-[#262626] pb-10">
          
          {/* Col 1 & 2: Masthead Mission & Subscription */}
          <div className="lg:col-span-2 space-y-4 lg:pr-6 lg:border-r border-[#262626]">
            <h3 className="font-serif font-black text-xl uppercase tracking-tight text-white">
              A PUBLICATION OF BIOMETRIC RECORD
            </h3>
            <p className="text-xs text-[#AAAAAA] leading-relaxed">
              VitalSync is committed to delivering uncompromised physiological truth through continuous optical, electrical, and clinical lab telemetry.
            </p>

            {/* Newsletter Dispatch Subscription */}
            <div className="pt-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-white block mb-2">
                SUBSCRIBE TO THE DAILY MORNING DISPATCH
              </span>
              {subscribed ? (
                <div className="p-3 border border-[#333333] bg-[#181818] text-xs font-bold text-[#CC0000]">
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
                    className="flex-1 border-b border-[#444444] bg-transparent px-3 py-2 text-xs focus:bg-[#181818] focus:outline-none placeholder:text-[#666666] text-white"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-white text-[#111111] hover:bg-[#EAEAEA] transition-colors text-xs font-bold uppercase tracking-wider flex items-center gap-1"
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
            <span className="font-bold text-xs uppercase tracking-wider block border-b border-[#262626] pb-1 text-white">
              EDITORIAL DESKS
            </span>
            <ul className="space-y-2 text-[#888888]">
              <li>
                <button onClick={() => onNavigateTab('command')} className="hover:text-white">
                  FRONT PAGE LEAD
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('vitals')} className="hover:text-white">
                  HEALTH &amp; VITALS WIRE
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('coach')} className="hover:text-white">
                  AI HEALTH COPILOT
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('sources')} className="hover:text-white">
                  DATA HUB &amp; LAB OCR
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('strength')} className="hover:text-white">
                  STRENGTH &amp; 1RM ARCHIVE
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Specialized Portals */}
          <div className="space-y-3 text-xs">
            <span className="font-bold text-xs uppercase tracking-wider block border-b border-[#262626] pb-1 text-white">
              SPECIAL EDITIONS
            </span>
            <ul className="space-y-2 text-[#888888]">
              <li>
                <button onClick={() => onNavigateTab('supplements')} className="hover:text-white">
                  MEDICATION MATRIX
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('metabolic')} className="hover:text-white">
                  BODY &amp; METABOLIC DEXA
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('experiments')} className="hover:text-white">
                  EXPERIMENTS LAB
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('circadian')} className="hover:text-white">
                  CIRCADIAN &amp; AQI DESK
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('twin')} className="hover:text-white">
                  DIGITAL RADAR TWIN
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Legal Charter & Standards */}
          <div className="space-y-3 text-xs">
            <span className="font-bold text-xs uppercase tracking-wider block border-b border-[#262626] pb-1 text-white">
              TRUST &amp; CHARTER
            </span>
            <ul className="space-y-2 text-[#888888]">
              <li>
                <button onClick={() => onNavigateTab('legal')} className="hover:text-white flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> HIPAA &amp; GDPR CHARTER
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('legal')} className="hover:text-white flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5" /> ZERO DATA-SALE PLEDGE
                </button>
              </li>
              <li>
                <span className="text-[10px] text-[#666666] block pt-2">
                  ISSN 2831-904X • VOL. 1 NO. 01
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* 3. Colophon Bottom Imprint */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#777777] text-center md:text-left">
          <p className="text-[11px] leading-relaxed max-w-2xl">
            <strong className="font-bold uppercase text-[#AAAAAA]">EDITORIAL NOTICE:</strong> VitalSync is a personal health intelligence platform and telemetric recording device.
          </p>

          <div className="text-[10px] uppercase font-bold text-[#AAAAAA]">
            &copy; {new Date().getFullYear()} THE VITALSYNC GAZETTE. ALL RIGHTS RESERVED.
          </div>
        </div>

      </div>
    </footer>
  );
};
