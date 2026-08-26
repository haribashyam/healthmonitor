import React, { useState, useEffect } from 'react';
import { Activity, Radio, Sparkles, Search, Menu, X, Command } from 'lucide-react';
import { ThemeToggle } from './production/ThemeToggle';
import type { TabId } from '../App';

interface NavbarProps {
  activeTab: TabId;
  setActiveTab: (t: TabId) => void;
  onOpenLiveWorkout: () => void;
  onOpenWhatChanged: () => void;
  onOpenDoctorReport: () => void;
  onOpenGlobalSearch: () => void;
  liveBpm: number;
  isBleConnected: boolean;
  bleDeviceName: string;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

const TABS: { id: TabId; label: string; icon: any }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: Activity },
  { id: 'health', label: 'Health', icon: Activity },
  { id: 'coach', label: 'AI Coach', icon: Sparkles },
  { id: 'data', label: 'Data Hub', icon: Search },
  { id: 'settings', label: 'Settings', icon: Activity },
];

export const Navbar: React.FC<NavbarProps> = ({
  activeTab, setActiveTab, onOpenLiveWorkout, onOpenWhatChanged, onOpenDoctorReport,
  onOpenGlobalSearch, liveBpm, isBleConnected, bleDeviceName, theme, onToggleTheme
}) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileOpen]);

  return (
    <>
      <header className={`sticky top-0 z-40 transition-all duration-200 ${
        isScrolled ? 'bg-slate-950/95 shadow-lg border-b border-slate-800 backdrop-blur-md' : 'bg-slate-950 border-b border-slate-900'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-3">
            <button onClick={() => setIsMobileOpen(true)} className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white" aria-label="Open menu">
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-400 p-[2px] shadow-lg shadow-cyan-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Activity className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <span className="font-bold text-lg tracking-wider text-white hidden sm:block">
                VITAL<span className="text-cyan-400">OS</span>
              </span>
            </div>

            <nav className="hidden lg:flex items-center gap-1">
              {TABS.map(tab => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      active ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                    }`}>
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>

            <div className="flex items-center gap-2">
              <button onClick={onOpenGlobalSearch} className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-400 hover:text-slate-200 transition-all">
                <Search className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden lg:inline">Search...</span>
                <kbd className="hidden lg:inline-flex items-center gap-0.5 text-[10px] font-mono bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
                  <Command className="w-2.5 h-2.5" />K
                </kbd>
              </button>

              <button onClick={onOpenGlobalSearch} className="md:hidden p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300" aria-label="Search">
                <Search className="w-4 h-4 text-cyan-400" />
              </button>

              <button onClick={onOpenLiveWorkout}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  isBleConnected ? 'bg-rose-500/10 border-rose-500/40 text-rose-300' : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}>
                <Radio className={`w-3.5 h-3.5 ${isBleConnected ? 'text-rose-400 animate-pulse' : ''}`} />
                <span className="hidden sm:inline">{isBleConnected ? `${liveBpm} BPM` : 'Live'}</span>
              </button>

              <ThemeToggle theme={theme} onToggle={onToggleTheme} />

              <button onClick={onOpenWhatChanged}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500/25 transition-all">
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden xl:inline">What Changed?</span>
              </button>

              <button onClick={onOpenDoctorReport}
                className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-all">
                Doctor Export
              </button>
            </div>
          </div>
        </div>
      </header>

      {isMobileOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm lg:hidden" onClick={() => setIsMobileOpen(false)}>
          <div className="w-72 h-full bg-slate-900 border-r border-slate-800 p-4 flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <span className="font-bold text-white">VITAL<span className="text-cyan-400">OS</span></span>
              <button onClick={() => setIsMobileOpen(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="py-3 space-y-1">
              {TABS.map(tab => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button key={tab.id} onClick={() => { setActiveTab(tab.id); setIsMobileOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      active ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-300 hover:bg-slate-800'
                    }`}>
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
