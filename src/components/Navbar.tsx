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
  Moon,
  Maximize2
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
  onOpenSpecialDesks?: () => void;
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
  onOpenSpecialDesks,
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
    { id: 'maps', label: 'MAPS & GPS' },
    { id: 'coach', label: 'AI COACH' },
    { id: 'sources', label: 'DATA HUB' },
    { id: 'settings', label: 'SETTINGS' },
  ];

  const secondaryDesks = [
    { id: 'maps', label: 'MAPS & CLINICAL GPS' },
    { id: 'clinician', label: 'CLINICIAN EHR' },
    { id: 'strength', label: 'STRENGTH & 1RM' },
    { id: 'metabolic', label: 'METABOLIC & DEXA' },
    { id: 'supplements', label: 'MEDS & SUPPLEMENTS' },
    { id: 'circadian', label: 'CIRCADIAN & AQI' },
    { id: 'experiments', label: 'EXPERIMENTS LAB' },
    { id: 'twin', label: 'DIGITAL RADAR' },
    { id: 'focus', label: 'COGNITIVE WELLNESS' },
    { id: 'injury', label: 'INJURY & REHAB' },
    { id: 'journal', label: 'HEALTH JOURNAL' },
    { id: 'timeline', label: 'LONGITUDINAL TIMELINE' },
  ];

  const isDark = theme === 'dark';

  return (
    <header className="bg-[var(--bg-card)] text-[var(--text-main)] border-b border-[var(--border-edge)] select-none transition-colors">
      
      {/* 1. Sub-Header Newspaper Volume Bar */}
      <div className="border-b border-[var(--border-edge)] bg-[var(--bg-canvas)] text-[var(--text-muted)] text-[11px] font-mono py-1 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="font-bold tracking-wider text-[var(--text-main)]">VOL. 1 - NO. 01</span>
          <span className="tracking-widest uppercase text-center hidden sm:inline font-medium">
            PERSONAL HEALTH INTELLIGENCE • PRINTED DAILY
          </span>
          <span className="font-bold tracking-wider text-[var(--text-main)]">NEW YORK EDITION</span>
        </div>
      </div>

      {/* 2. Main Masthead */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 border-b border-[var(--border-edge)]">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          
          {/* Left: Date Display */}
          <div className="text-xs font-mono font-medium tracking-wider text-[var(--text-muted)] w-full lg:w-auto text-center lg:text-left">
            {currentDateFormatted}
          </div>

          {/* Center: Title Brand */}
          <div
            onClick={() => setActiveTab('command')}
            className="cursor-pointer text-center flex items-baseline justify-center gap-2 group"
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black tracking-tight text-[var(--text-main)] uppercase transition-colors">
              VitalSync
            </h1>
            <span className="text-xs font-serif italic text-[var(--text-muted)] tracking-normal lowercase">
              est. 2026
            </span>
          </div>

          {/* Right: Search, Theme Toggle & Action Pills */}
          <div className="flex flex-wrap items-center justify-center lg:justify-end gap-2 text-xs font-mono w-full lg:w-auto">
            
            {/* Search Button */}
            <button
              onClick={onOpenGlobalSearch}
              className="flex items-center gap-2 px-3 py-1.5 bg-[var(--bg-card-alt)] hover:bg-[var(--bg-card-contrast)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-edge)] transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="text-[11px] uppercase tracking-wider font-bold">SEARCH ARCHIVE</span>
              <kbd className="text-[10px] bg-[var(--bg-card)] border border-[var(--border-edge)] text-[var(--text-muted)] px-1">⌘K</kbd>
            </button>

            {/* Light / Dark Mode Toggle */}
            <button
              onClick={onToggleTheme}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--text-main)] hover:opacity-90 text-[var(--bg-canvas)] border border-[var(--text-main)] transition-colors font-bold uppercase text-[11px] tracking-wider"
            >
              {isDark ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>LIGHT MODE</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-cyan-300" />
                  <span>DARK MODE</span>
                </>
              )}
            </button>

            {/* Live HR Pill */}
            <button
              onClick={onOpenLiveWorkout}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--bg-card-alt)] hover:bg-[var(--bg-card-contrast)] text-[var(--text-main)] border border-[var(--border-edge)] transition-colors"
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
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--bg-card-alt)] hover:bg-[var(--bg-card-contrast)] text-[var(--text-main)] border border-[var(--border-edge)] transition-colors font-bold uppercase text-[11px] tracking-wider"
            >
              <Sparkles className="w-3 h-3 text-[#CC0000]" />
              <span>WHAT CHANGED?</span>
            </button>

            {/* Doctor Export Button */}
            <button
              onClick={onOpenDoctorReport}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--bg-card-alt)] hover:bg-[var(--bg-card-contrast)] text-[var(--text-main)] border border-[var(--border-edge)] transition-colors font-bold uppercase text-[11px] tracking-wider"
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
                      ? 'bg-[var(--text-main)] text-[var(--bg-canvas)] border-[var(--text-main)] font-black'
                      : 'bg-transparent text-[var(--text-muted)] border-transparent hover:text-[var(--text-main)] hover:border-[var(--border-edge)]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Quick Desks Dropdown + Enlarge Button */}
          <div className="relative flex items-center gap-1">
            <button
              onClick={() => {
                if (onOpenSpecialDesks) onOpenSpecialDesks();
                else setShowMoreDesks(!showMoreDesks);
              }}
              className="px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider bg-[var(--bg-card-alt)] text-[var(--text-main)] border border-[var(--border-edge)] hover:border-[var(--text-main)] flex items-center gap-1.5 transition-colors"
              title="Open Enlarged Special Desks Directory"
            >
              <Maximize2 className="w-3.5 h-3.5 text-[#CC0000]" />
              <span>SPECIAL DESKS</span>
              <ChevronDown className="w-3.5 h-3.5 ml-0.5" />
            </button>

            {showMoreDesks && (
              <div className="absolute right-0 top-full mt-1 w-64 bg-[var(--bg-card)] border border-[var(--border-edge)] z-50 py-1 hard-shadow font-mono text-xs">
                <div className="px-3 py-2 border-b border-[var(--border-edge)] bg-[var(--bg-card-alt)] flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#CC0000] uppercase">INTELLIGENCE DESKS</span>
                  {onOpenSpecialDesks && (
                    <button
                      onClick={() => {
                        setShowMoreDesks(false);
                        onOpenSpecialDesks();
                      }}
                      className="text-[10px] font-bold underline text-[var(--text-main)] hover:text-[#CC0000]"
                    >
                      ENLARGE DIRECTORY ⛶
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto">
                  {secondaryDesks.map(d => (
                    <button
                      key={d.id}
                      onClick={() => {
                        setActiveTab(d.id);
                        setShowMoreDesks(false);
                      }}
                      className={`w-full text-left px-3 py-2 hover:bg-[var(--bg-card-contrast)] transition-colors flex items-center justify-between ${
                        activeTab === d.id ? 'text-[#CC0000] font-bold bg-[#CC0000]/10' : 'text-[var(--text-main)]'
                      }`}
                    >
                      <span>{d.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

    </header>
  );
};
