import React, { useState, useEffect } from 'react';
import {
  Search,
  Radio,
  Sparkles,
  FileText,
  Sliders,
  Activity,
  Heart,
  Zap,
  Layers,
  Settings as SettingsIcon,
  ChevronDown,
  User,
  Plus,
  ShieldCheck,
  Calendar,
  Award,
  BookOpen,
  Sun,
  Moon
} from 'lucide-react';
import { auth, FirebaseUserProfile, signOutUser } from '../services/firebaseAuth';
import { onAuthStateChanged } from 'firebase/auth';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenLiveWorkout: () => void;
  onOpenWhatChanged: () => void;
  onOpenDoctorReport: () => void;
  onOpenDataMap: () => void;
  onOpenWorkspace?: (tab?: 'gmail' | 'sheets' | 'picker' | 'firebase') => void;
  onOpenGlobalSearch?: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  liveBpm: number;
  isBleConnected: boolean;
  bleDeviceName: string;
  onOpenLifecycle?: (view: string) => void;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenLiveWorkout,
  onOpenWhatChanged,
  onOpenDoctorReport,
  onOpenWorkspace,
  onOpenGlobalSearch,
  searchQuery,
  setSearchQuery,
  liveBpm,
  isBleConnected,
  bleDeviceName,
  onOpenLifecycle,
  theme = 'dark',
  onToggleTheme
}) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUserProfile | null>(null);
  const [showMoreDesks, setShowMoreDesks] = useState(false);

  const currentDateFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).toUpperCase();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) {
        setFirebaseUser({
          uid: u.uid,
          email: u.email,
          displayName: u.displayName || 'Dr. Vance',
          photoURL: u.photoURL,
          emailVerified: u.emailVerified,
          role: 'user'
        });
      } else {
        setFirebaseUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const primaryTabs = [
    { id: 'command', label: 'FRONT PAGE' },
    { id: 'vitals', label: 'HEALTH' },
    { id: 'coach', label: 'AI COACH' },
    { id: 'sources', label: 'DATA HUB' },
    { id: 'settings', label: 'SETTINGS' },
  ];

  const secondaryDesks = [
    { id: 'clinician', label: 'CLINICIAN EHR' },
    { id: 'strength', label: 'STRENGTH & 1RM' },
    { id: 'metabolic', label: 'METABOLIC & DEXA' },
    { id: 'supplements', label: 'MEDS & SUPPLEMENTS' },
    { id: 'circadian', label: 'CIRCADIAN & AQI' },
    { id: 'experiments', label: 'EXPERIMENTS LAB' },
    { id: 'twin', label: 'DIGITAL RADAR' },
    { id: 'journal', label: 'HEALTH JOURNAL' },
  ];

  const isDark = theme === 'dark';

  return (
    <header className={`${isDark ? 'bg-[#111111] text-[#F9F9F7] border-[#262626]' : 'bg-[#FFFFFF] text-[#111111] border-[#D4D4CE]'} border-b select-none transition-colors`}>
      
      {/* 1. Sub-Header Newspaper Volume Bar */}
      <div className={`border-b ${isDark ? 'border-[#262626] bg-[#0d0d0d] text-[#A3A3A3]' : 'border-[#E2E2DC] bg-[#F8F8F5] text-[#666666]'} text-[11px] font-mono py-1 px-4 sm:px-8`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className={`font-bold tracking-wider ${isDark ? 'text-[#CCCCCC]' : 'text-[#222222]'}`}>VOL. 1 - NO. 01</span>
          <span className="tracking-widest uppercase text-center hidden sm:inline font-medium">
            PERSONAL HEALTH INTELLIGENCE • PRINTED DAILY
          </span>
          <span className={`font-bold tracking-wider ${isDark ? 'text-[#CCCCCC]' : 'text-[#222222]'}`}>NEW YORK EDITION</span>
        </div>
      </div>

      {/* 2. Main Masthead */}
      <div className={`max-w-7xl mx-auto px-4 sm:px-8 py-4 border-b ${isDark ? 'border-[#262626]' : 'border-[#E2E2DC]'}`}>
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          
          {/* Left: Date Display */}
          <div className={`text-xs font-mono font-medium tracking-wider ${isDark ? 'text-[#A3A3A3]' : 'text-[#666666]'} w-full lg:w-auto text-center lg:text-left`}>
            {currentDateFormatted}
          </div>

          {/* Center: Title Brand */}
          <div
            onClick={() => setActiveTab('command')}
            className="cursor-pointer text-center flex items-baseline justify-center gap-2 group"
          >
            <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-serif font-black tracking-tight ${isDark ? 'text-white group-hover:text-[#F0F0ED]' : 'text-[#111111] group-hover:text-[#333333]'} uppercase transition-colors`}>
              VitalSync
            </h1>
            <span className={`text-xs font-serif italic ${isDark ? 'text-[#A3A3A3]' : 'text-[#777777]'} tracking-normal lowercase`}>
              est. 2026
            </span>
          </div>

          {/* Right: Search, Theme Toggle & Action Pills */}
          <div className="flex flex-wrap items-center justify-center lg:justify-end gap-2 text-xs font-mono w-full lg:w-auto">
            
            {/* Search Button */}
            <button
              onClick={onOpenGlobalSearch}
              className={`flex items-center gap-2 px-3 py-1.5 ${isDark ? 'bg-[#1C1C1C] hover:bg-[#282828] text-[#A3A3A3] hover:text-white border-[#333333]' : 'bg-[#F2F2EC] hover:bg-[#E8E8E0] text-[#555555] hover:text-[#111111] border-[#D4D4CE]'} border transition-colors`}
            >
              <Search className="w-3.5 h-3.5" />
              <span className="text-[11px] uppercase tracking-wider font-bold">SEARCH ARCHIVE</span>
              <kbd className={`text-[10px] ${isDark ? 'bg-[#111111] border-[#444444] text-[#888888]' : 'bg-[#E5E5DE] border-[#C8C8BE] text-[#555555]'} px-1 border`}>⌘K</kbd>
            </button>

            {/* Light / Dark Mode Toggle */}
            <button
              onClick={onToggleTheme}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className={`flex items-center gap-1.5 px-3 py-1.5 ${isDark ? 'bg-[#1C1C1C] hover:bg-[#282828] text-[#F9F9F7] border-[#333333]' : 'bg-[#111111] hover:bg-[#222222] text-[#FFFFFF] border-[#111111]'} border transition-colors font-bold uppercase text-[11px] tracking-wider`}
            >
              {isDark ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>LIGHT</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-cyan-300" />
                  <span>DARK</span>
                </>
              )}
            </button>

            {/* Live HR Pill */}
            <button
              onClick={onOpenLiveWorkout}
              className={`flex items-center gap-1.5 px-3 py-1.5 ${isDark ? 'bg-[#1C1C1C] hover:bg-[#282828] text-white border-[#333333]' : 'bg-[#F2F2EC] hover:bg-[#E8E8E0] text-[#111111] border-[#D4D4CE]'} border transition-colors`}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#CC0000] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#CC0000]"></span>
              </span>
              <span className="font-bold text-[11px] text-[#CC0000]">{liveBpm || 145} BPM</span>
            </button>

            {/* What Changed Button */}
            <button
              onClick={onOpenWhatChanged}
              className={`flex items-center gap-1.5 px-3 py-1.5 ${isDark ? 'bg-[#1C1C1C] hover:bg-[#282828] text-white border-[#333333]' : 'bg-[#F2F2EC] hover:bg-[#E8E8E0] text-[#111111] border-[#D4D4CE]'} border transition-colors font-bold uppercase text-[11px] tracking-wider`}
            >
              <Sparkles className="w-3 h-3 text-[#CC0000]" />
              <span>WHAT CHANGED?</span>
            </button>

            {/* Doctor Export Button */}
            <button
              onClick={onOpenDoctorReport}
              className={`flex items-center gap-1.5 px-3 py-1.5 ${isDark ? 'bg-[#1C1C1C] hover:bg-[#282828] text-white border-[#333333]' : 'bg-[#F2F2EC] hover:bg-[#E8E8E0] text-[#111111] border-[#D4D4CE]'} border transition-colors font-bold uppercase text-[11px] tracking-wider`}
            >
              <Plus className="w-3 h-3 text-[#CC0000]" />
              <span>DOCTOR EXPORT</span>
            </button>

          </div>

        </div>
      </div>

      {/* 3. Primary Navigation Tabs Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between overflow-x-auto no-scrollbar">
          <nav className="flex items-center gap-1 sm:gap-2 py-2">
            {primaryTabs.map((tab) => {
              const isActive =
                activeTab === tab.id ||
                (tab.id === 'vitals' && (activeTab === 'health' || activeTab === 'vitals' || activeTab === 'metabolic' || activeTab === 'circadian')) ||
                (tab.id === 'coach' && (activeTab === 'coach' || activeTab === 'ask' || activeTab === 'experiments')) ||
                (tab.id === 'sources' && (activeTab === 'sources' || activeTab === 'clinician' || activeTab === 'strength')) ||
                (tab.id === 'settings' && (activeTab === 'settings' || activeTab === 'lifecycle' || activeTab === 'legal' || activeTab === 'help'));

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider transition-colors border ${
                    isActive
                      ? isDark
                        ? 'bg-white text-[#111111] border-white'
                        : 'bg-[#111111] text-white border-[#111111]'
                      : isDark
                        ? 'bg-transparent text-[#A3A3A3] border-transparent hover:text-white hover:border-[#333333]'
                        : 'bg-transparent text-[#666666] border-transparent hover:text-[#111111] hover:border-[#CCCCCC]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Quick Desks Dropdown on Right */}
          <div className="relative">
            <button
              onClick={() => setShowMoreDesks(!showMoreDesks)}
              className={`px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider ${isDark ? 'text-[#A3A3A3] hover:text-white border-[#333333]' : 'text-[#666666] hover:text-[#111111] border-[#CCCCCC]'} border flex items-center gap-1`}
            >
              <span>SPECIAL DESKS</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {showMoreDesks && (
              <div className={`absolute right-0 mt-1 w-56 ${isDark ? 'bg-[#161616] border-[#333333]' : 'bg-[#FFFFFF] border-[#D4D4CE]'} border z-50 py-1 hard-shadow font-mono text-xs`}>
                {secondaryDesks.map(d => (
                  <button
                    key={d.id}
                    onClick={() => {
                      setActiveTab(d.id);
                      setShowMoreDesks(false);
                    }}
                    className={`w-full text-left px-3 py-2 ${isDark ? 'hover:bg-[#242424]' : 'hover:bg-[#F2F2EC]'} transition-colors flex items-center justify-between ${
                      activeTab === d.id ? 'text-[#CC0000] font-bold' : isDark ? 'text-[#CCCCCC]' : 'text-[#333333]'
                    }`}
                  >
                    <span>{d.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

    </header>
  );
};
