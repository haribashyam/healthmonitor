import React, { useState, useEffect } from 'react';
import {
  Activity,
  Radio,
  Sparkles,
  Layers,
  Heart,
  Moon,
  Utensils,
  Compass,
  FileText,
  Calendar,
  Award,
  BookOpen,
  Search,
  Sliders,
  Share2,
  ShieldCheck,
  Zap,
  CheckCircle2,
  ChevronDown,
  Bell,
  RefreshCw,
  User,
  LifeBuoy,
  ShieldAlert,
  CreditCard,
  LogIn,
  Cookie
} from 'lucide-react';
import { WebBluetoothManager, BLEHeartRateData } from '../utils/bluetooth';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenLiveWorkout: () => void;
  onOpenWhatChanged: () => void;
  onOpenDoctorReport: () => void;
  onOpenDataMap: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  liveBpm: number;
  isBleConnected: boolean;
  bleDeviceName: string;
  onOpenLifecycle?: (view: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenLiveWorkout,
  onOpenWhatChanged,
  onOpenDoctorReport,
  onOpenDataMap,
  searchQuery,
  setSearchQuery,
  liveBpm,
  isBleConnected,
  bleDeviceName,
  onOpenLifecycle
}) => {
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const navItems = [
    { id: 'command', label: 'Command Center', icon: Activity },
    { id: 'plan', label: 'Adaptive Plan', icon: Sparkles },
    { id: 'ask', label: 'Ask My Data', icon: Zap },
    { id: 'sources', label: 'Data Hub & OCR', icon: Layers },
    { id: 'vitals', label: 'Vitals & Labs', icon: Heart },
    { id: 'activity', label: 'Activity Analytics', icon: Compass },
    { id: 'sleep', label: 'Sleep & Recovery', icon: Moon },
    { id: 'nutrition', label: 'Nutrition', icon: Utensils },
    { id: 'simulator', label: 'What-If Sim', icon: Sliders },
    { id: 'twin', label: 'Health Radar', icon: ShieldCheck },
    { id: 'timeline', label: 'Timeline', icon: FileText },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'social', label: 'Achievements', icon: Award },
    { id: 'journal', label: 'Journal', icon: BookOpen },
    { id: 'legal', label: 'Legal & Trust', icon: ShieldCheck },
    { id: 'lifecycle', label: 'Account Hub', icon: User },
    { id: 'help', label: 'Help Center', icon: LifeBuoy },
    { id: 'ux-states', label: 'UX States', icon: ShieldAlert },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 text-slate-100">
      {/* Top Primary Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand & Live OS Status */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('command')}>
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-400 p-[2px] shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Activity className="w-5 h-5 text-cyan-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-wider text-white">VITAL<span className="text-cyan-400">OS</span></span>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Live Sync
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Personal Health Intelligence</p>
            </div>
          </div>

          {/* Search bar & Quick Context Actions */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="global-health-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search metrics, runs, lab results, meals (e.g. 'glucose', 'Zone 2', 'HRV')..."
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-900/80 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-300"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Right Action Cluster */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Live BLE Stream Status Button */}
            <button
              id="live-ble-btn"
              onClick={onOpenLiveWorkout}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                isBleConnected
                  ? 'bg-rose-500/10 border-rose-500/40 text-rose-300 hover:bg-rose-500/20'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
              title="Open Live Workout HUD & BLE Stream"
            >
              <Radio className={`w-3.5 h-3.5 ${isBleConnected ? 'text-rose-400 animate-pulse' : 'text-slate-400'}`} />
              <span className="hidden sm:inline">
                {isBleConnected ? `${liveBpm} BPM` : 'Live Workout HUD'}
              </span>
            </button>

            {/* "What Changed?" Root-Cause Trigger */}
            <button
              id="what-changed-btn"
              onClick={onOpenWhatChanged}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 text-amber-300 hover:brightness-110 transition-all shadow-sm shadow-amber-500/10"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">What Changed?</span>
            </button>

            {/* Doctor Report Modal Trigger */}
            <button
              id="doctor-report-btn"
              onClick={onOpenDoctorReport}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all"
            >
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              <span>Doctor Export</span>
            </button>

            {/* Data Map / Privacy Ledger */}
            <button
              id="data-map-btn"
              onClick={onOpenDataMap}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-all"
              title="View Data Map & Provenance"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="hidden xl:inline">My Data Map</span>
            </button>

            {/* User Profile / Lifecycle Dropdown */}
            <div className="relative">
              <button
                id="user-lifecycle-menu-btn"
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs transition-all"
              >
                <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-bold text-[10px]">
                  AV
                </div>
                <span className="hidden md:inline font-medium">Alex Vance</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl p-2 shadow-2xl z-50 text-xs space-y-1 animate-scaleUp">
                  <div className="px-3 py-2 border-b border-slate-800">
                    <span className="font-bold text-white block">Alex Vance</span>
                    <span className="text-[10px] text-cyan-400 font-mono">Pro Biohacker Member</span>
                  </div>

                  <button
                    onClick={() => { setActiveTab('lifecycle'); setShowUserDropdown(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-slate-300 hover:bg-slate-800 hover:text-white"
                  >
                    <User className="w-4 h-4 text-cyan-400" /> Account Settings
                  </button>

                  <button
                    onClick={() => { setActiveTab('lifecycle'); setShowUserDropdown(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-slate-300 hover:bg-slate-800 hover:text-white"
                  >
                    <CreditCard className="w-4 h-4 text-emerald-400" /> Billing & Upgrades
                  </button>

                  <button
                    onClick={() => { setActiveTab('help'); setShowUserDropdown(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-slate-300 hover:bg-slate-800 hover:text-white"
                  >
                    <LifeBuoy className="w-4 h-4 text-amber-400" /> Help Center & Support
                  </button>

                  <button
                    onClick={() => { setActiveTab('legal'); setShowUserDropdown(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-slate-300 hover:bg-slate-800 hover:text-white"
                  >
                    <ShieldCheck className="w-4 h-4 text-cyan-400" /> Legal & Privacy Center
                  </button>

                  <button
                    onClick={() => { setActiveTab('ux-states'); setShowUserDropdown(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-slate-300 hover:bg-slate-800 hover:text-white"
                  >
                    <ShieldAlert className="w-4 h-4 text-rose-400" /> UX States Audit
                  </button>

                  <div className="border-t border-slate-800 pt-1">
                    <button
                      onClick={() => { setActiveTab('lifecycle'); setShowUserDropdown(false); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-rose-400 hover:bg-rose-500/10 font-medium"
                    >
                      <LogIn className="w-4 h-4 text-rose-400" /> Switch / Logout
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Responsive Horizontal Scrollable Sub-Navigation Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-none border-t border-slate-900">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-500/10 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

