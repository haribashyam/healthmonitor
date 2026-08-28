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
    <footer className="border-t border-[var(--border-edge)] font-mono select-none mt-16 transition-colors bg-[var(--bg-card)] text-[var(--text-main)]">
      
      {/* 1. Colophon Top Ornament & Wire Notice */}
      <div className="py-3 px-4 sm:px-8 border-b border-[var(--border-edge)] bg-[var(--bg-canvas)]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-3">
            <span className="font-serif font-black text-base tracking-tight uppercase text-[var(--text-main)]">
              THE VITALSYNC GAZETTE
            </span>
            <span className="text-[var(--text-dim)]">|</span>
            <span className="text-xs text-[var(--text-muted)]">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 border-b border-[var(--border-edge)] pb-10">
          
          {/* Col 1 & 2: Masthead Mission & Subscription */}
          <div className="lg:col-span-2 space-y-4 lg:pr-6 lg:border-r border-[var(--border-edge)]">
            <h3 className="font-serif font-black text-xl uppercase tracking-tight text-[var(--text-main)]">
              A PUBLICATION OF BIOMETRIC RECORD
            </h3>
            <p className="text-xs leading-relaxed text-[var(--text-muted)]">
              VitalSync is committed to delivering uncompromised physiological truth through continuous optical, electrical, and clinical lab telemetry.
            </p>

            {/* Newsletter Dispatch Subscription */}
            <div className="pt-2">
              <span className="text-[11px] font-bold uppercase tracking-widest block mb-2 text-[var(--text-main)]">
                SUBSCRIBE TO THE DAILY MORNING DISPATCH
              </span>
              {subscribed ? (
                <div className="p-3 border border-[var(--border-edge)] bg-[var(--bg-card-alt)] text-xs font-bold text-[#CC0000]">
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
                    className="flex-1 border-b border-[var(--border-edge)] px-3 py-2 text-xs bg-transparent focus:bg-[var(--bg-card-contrast)] placeholder:text-[var(--text-dim)] text-[var(--text-main)] focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-colors bg-[var(--text-main)] text-[var(--bg-canvas)] hover:opacity-90"
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
            <span className="font-bold text-xs uppercase tracking-wider block border-b border-[var(--border-edge)] pb-1 text-[var(--text-main)]">
              EDITORIAL DESKS
            </span>
            <ul className="space-y-2 text-[var(--text-muted)]">
              <li>
                <button onClick={() => onNavigateTab('command')} className="hover:text-[var(--text-main)]">
                  FRONT PAGE LEAD
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('vitals')} className="hover:text-[var(--text-main)]">
                  HEALTH &amp; VITALS WIRE
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('coach')} className="hover:text-[var(--text-main)]">
                  AI HEALTH COPILOT
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('sources')} className="hover:text-[var(--text-main)]">
                  DATA HUB &amp; LAB OCR
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('strength')} className="hover:text-[var(--text-main)]">
                  STRENGTH &amp; 1RM ARCHIVE
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Specialized Portals */}
          <div className="space-y-3 text-xs">
            <span className="font-bold text-xs uppercase tracking-wider block border-b border-[var(--border-edge)] pb-1 text-[var(--text-main)]">
              SPECIAL EDITIONS
            </span>
            <ul className="space-y-2 text-[var(--text-muted)]">
              <li>
                <button onClick={() => onNavigateTab('supplements')} className="hover:text-[var(--text-main)]">
                  MEDICATION MATRIX
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('metabolic')} className="hover:text-[var(--text-main)]">
                  BODY &amp; METABOLIC DEXA
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('experiments')} className="hover:text-[var(--text-main)]">
                  EXPERIMENTS LAB
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('circadian')} className="hover:text-[var(--text-main)]">
                  CIRCADIAN &amp; AQI DESK
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('twin')} className="hover:text-[var(--text-main)]">
                  DIGITAL RADAR TWIN
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Legal Charter & Standards */}
          <div className="space-y-3 text-xs">
            <span className="font-bold text-xs uppercase tracking-wider block border-b border-[var(--border-edge)] pb-1 text-[var(--text-main)]">
              COMMERCIAL &amp; TRUST
            </span>
            <ul className="space-y-2 text-[var(--text-muted)]">
              <li>
                <button onClick={() => onNavigateTab('pricing')} className="hover:text-[var(--text-main)]">
                  PRICING &amp; MEMBERSHIP
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('about')} className="hover:text-[var(--text-main)]">
                  EDITORIAL CHARTER &amp; ABOUT
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('security')} className="flex items-center gap-1 hover:text-[var(--text-main)]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#CC0000]" /> HIPAA &amp; TRUST CENTER
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('contact')} className="hover:text-[var(--text-main)]">
                  CONTACT CONCIERGE DESK
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('legal')} className="flex items-center gap-1 hover:text-[var(--text-main)]">
                  <Lock className="w-3.5 h-3.5" /> TERMS &amp; PRIVACY POLICY
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* 3. Colophon Bottom Imprint */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[var(--text-muted)] text-center md:text-left">
          <p className="text-[11px] leading-relaxed max-w-2xl">
            <strong className="font-bold uppercase text-[var(--text-main)]">EDITORIAL NOTICE:</strong> VitalSync is a personal health intelligence platform and telemetric recording device.
          </p>

          <div className="text-[10px] uppercase font-bold text-[var(--text-main)]">
            &copy; {new Date().getFullYear()} THE VITALSYNC GAZETTE. ALL RIGHTS RESERVED.
          </div>
        </div>

      </div>
    </footer>
  );
};
