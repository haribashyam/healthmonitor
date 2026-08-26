import React from 'react';
import { Activity, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onNavigateTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateTab }) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-emerald-400 p-[1.5px]">
              <div className="w-full h-full bg-slate-950 rounded-[6px] flex items-center justify-center">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
              </div>
            </div>
            <span className="font-bold text-sm text-white tracking-wider">VITAL<span className="text-cyan-400">OS</span></span>
            <span className="text-slate-600 ml-2">v3.4.2</span>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => onNavigateTab('dashboard')} className="hover:text-cyan-300 transition-colors">Dashboard</button>
            <button onClick={() => onNavigateTab('health')} className="hover:text-cyan-300 transition-colors">Health</button>
            <button onClick={() => onNavigateTab('coach')} className="hover:text-cyan-300 transition-colors">AI Coach</button>
            <button onClick={() => onNavigateTab('data')} className="hover:text-cyan-300 transition-colors">Data Hub</button>
            <button onClick={() => onNavigateTab('settings')} className="hover:text-cyan-300 transition-colors">Settings</button>
          </div>

          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px]">Zero-Sale Privacy • HIPAA & GDPR</span>
          </div>
        </div>

        <div className="border-t border-slate-900 mt-6 pt-4 text-center text-[11px] text-slate-500">
          © {new Date().getFullYear()} VITALOS Health Intelligence Inc. Not a medical device. Consult your physician for clinical advice.
        </div>
      </div>
    </footer>
  );
};
