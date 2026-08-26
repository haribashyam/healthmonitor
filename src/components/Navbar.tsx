import React, { useState, useEffect, useRef } from 'react';
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
  Cookie,
  Mail,
  FileSpreadsheet,
  Cloud,
  Dumbbell,
  Pill,
  Scale,
  FlaskConical,
  Sun,
  Users,
  Brain,
  Cpu,
  GitMerge,
  Menu,
  X,
  Command
} from 'lucide-react';
import { WebBluetoothManager, BLEHeartRateData } from '../utils/bluetooth';
import { ThemeToggle } from './production/ThemeToggle';


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
  onOpenDataMap,
  onOpenWorkspace,
  onOpenGlobalSearch,
  searchQuery,
  setSearchQuery,
  liveBpm,
  isBleConnected,
  bleDeviceName,
  onOpenLifecycle,
  theme,
  onToggleTheme
}) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [syncTimeAgo, setSyncTimeAgo] = useState('Synced just now');
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const mins = Math.floor((Date.now() % 600000) / 60000);
      setSyncTimeAgo(mins === 0 ? 'Synced just now' : `Synced ${mins}m ago`);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Trap focus and handle escape on mobile drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  const navItems = [
    { id: 'command', label: 'Command Center', icon: Activity },
    { id: 'clinician', label: 'Clinician Portal (EHR)', icon: ShieldCheck },
    { id: 'strength', label: 'Strength & 1RM', icon: Dumbbell },
    { id: 'supplements', label: 'Meds & Supplements', icon: Pill },
    { id: 'metabolic', label: 'Body & Metabolic', icon: Scale },
    { id: 'experiments', label: 'Experiments Lab', icon: FlaskConical },
    { id: 'circadian', label: 'Circadian & Env', icon: Sun },
    { id: 'injury', label: 'Injury & Recovery', icon: ShieldCheck },
    { id: 'family', label: 'Family & Emergency', icon: ShieldAlert },
    { id: 'focus', label: 'Focus & Wellness', icon: Brain },
    { id: 'ai-lab', label: 'AI Multi-Model Lab', icon: Cpu },
    { id: 'clubs', label: 'Social Clubs & PRs', icon: Users },
    { id: 'data-quality', label: 'Data Quality & Provenance', icon: GitMerge },
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
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-200 ${
          isScrolled
            ? 'bg-slate-950/95 shadow-xl shadow-slate-950/50 border-b border-slate-700/80 backdrop-blur-md'
            : 'bg-slate-950/90 border-b border-slate-800 backdrop-blur-md'
        } text-slate-100`}
      >
        {/* Top Primary Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-3">
            
            {/* Mobile menu hamburger button */}
            <button
              id="mobile-menu-hamburger-btn"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={isMobileMenuOpen}
              className="lg:hidden p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>

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
                  <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hidden sm:flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    {syncTimeAgo}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium hidden sm:block">Personal Health Intelligence</p>
              </div>
            </div>

            {/* Global Search shortcut / bar */}
            <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
              <button
                onClick={onOpenGlobalSearch}
                className="w-full flex items-center justify-between pl-3 pr-3 py-1.5 text-xs bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-lg text-slate-400 hover:text-slate-200 transition-all text-left shadow-inner"
              >
                <div className="flex items-center gap-2">
                  <Search className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Search metrics, vitals, meds, workouts...</span>
                </div>
                <kbd className="hidden lg:inline-flex items-center gap-0.5 text-[10px] font-mono bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700">
                  <Command className="w-3 h-3" /> K
                </kbd>
              </button>
            </div>

            {/* Right Action Cluster */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              
              {/* Persona Switcher Pill (Patient vs Clinician) */}
              <div className="flex items-center p-0.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                <button
                  id="persona-patient-btn"
                  onClick={() => setActiveTab('command')}
                  className={`px-2.5 py-1 rounded-md transition-all font-medium flex items-center gap-1 ${
                    activeTab !== 'clinician'
                      ? 'bg-cyan-500/20 text-cyan-300 font-semibold shadow-xs'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Patient / Everyday Health Mode"
                >
                  <User className="w-3 h-3" />
                  <span className="hidden sm:inline">Patient</span>
                </button>
                <button
                  id="persona-clinician-btn"
                  onClick={() => setActiveTab('clinician')}
                  className={`px-2.5 py-1 rounded-md transition-all font-medium flex items-center gap-1 ${
                    activeTab === 'clinician'
                      ? 'bg-emerald-500/20 text-emerald-300 font-semibold shadow-xs'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Doctor / Clinician EHR Workstation"
                >
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span className="hidden sm:inline">Clinician</span>
                </button>
              </div>

              {/* Theme toggle */}
              <ThemeToggle theme={theme} onToggle={onToggleTheme} />

              {/* Mobile Quick Search Button */}
              <button
                onClick={onOpenGlobalSearch}
                aria-label="Open search"
                className="md:hidden p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
              >
                <Search className="w-4 h-4 text-cyan-400" />
              </button>

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
                  {isBleConnected ? `${liveBpm} BPM` : 'Live HUD'}
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

              {/* Google Workspace & Cloud Trigger */}
              {onOpenWorkspace && (
                <button
                  id="navbar-workspace-btn"
                  onClick={() => onOpenWorkspace('gmail')}
                  className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-red-500/15 via-emerald-500/15 to-blue-500/15 border border-slate-700 hover:border-cyan-500/40 text-slate-200 hover:text-white transition-all shadow-sm"
                  title="Google Workspace & Firebase Sync"
                >
                  <Cloud className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Workspace</span>
                </button>
              )}

              {/* Doctor Report Modal Trigger */}
              <button
                id="doctor-report-btn"
                onClick={onOpenDoctorReport}
                className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all"
              >
                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                <span>Doctor Export</span>
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

                    {onOpenWorkspace && (
                      <button
                        onClick={() => { onOpenWorkspace('gmail'); setShowUserDropdown(false); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-cyan-300 hover:bg-slate-800 font-medium"
                      >
                        <Cloud className="w-4 h-4 text-cyan-400" /> Google Workspace & Cloud
                      </button>
                    )}

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

      {/* Accessible Mobile Slide-in Drawer Menu (Part 2 Item 5) */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm lg:hidden animate-fadeIn"
          onClick={() => setIsMobileMenuOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation drawer"
        >
          <div
            ref={drawerRef}
            className="w-4/5 max-w-sm h-full bg-slate-900 border-r border-slate-800 p-4 shadow-2xl flex flex-col justify-between overflow-y-auto animate-slideRight text-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-cyan-400" />
                  <span className="font-bold text-white text-base">VITAL<span className="text-cyan-400">OS</span></span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-3 space-y-1">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenGlobalSearch?.();
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-cyan-300 text-xs font-semibold mb-2"
                >
                  <div className="flex items-center gap-2">
                    <Search className="w-4 h-4" />
                    <span>Search Health Systems</span>
                  </div>
                  <kbd className="font-mono text-[10px] bg-slate-900 px-1.5 py-0.5 rounded text-slate-400">⌘K</kbd>
                </button>

                <div className="text-[10px] uppercase font-bold text-slate-400 px-2 pt-2">
                  Health Intelligence Modules
                </div>

                <div className="space-y-0.5 max-h-[55vh] overflow-y-auto pr-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                          isActive
                            ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30'
                            : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 text-xs space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span>Theme Mode</span>
                <ThemeToggle theme={theme} onToggle={onToggleTheme} />
              </div>
              <p className="text-[10px] text-slate-400 text-center">
                VITALOS Personal Health Intelligence &copy; 2026
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};


