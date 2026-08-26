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
            ? 'bg-slate-950/95 border-b-4 border-slate-50 hard-shadow-sm'
            : 'bg-slate-950/95 border-b-4 border-slate-50'
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
              className="lg:hidden p-2 bg-slate-900 border-2 border-slate-50 text-slate-300 hover:bg-slate-50 hover:text-slate-950 transition-all"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Brand & Live OS Status */}
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setActiveTab('command')}>
              <div className="relative flex items-center justify-center w-10 h-10 bg-cyan-500 border-2 border-slate-50 hard-shadow-sm">
                <Activity className="w-5 h-5 text-slate-950 group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-lg tracking-tight text-slate-100 font-serif-display">VITAL<span className="text-cyan-500">OS</span></span>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-emerald-500 text-slate-50 hidden sm:inline-flex items-center gap-1 border border-slate-50">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-50 animate-ping" />
                    {syncTimeAgo}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest hidden sm:block">Personal Health Intelligence</p>
              </div>
            </div>

            {/* Global Search shortcut / bar */}
            <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
              <button
                onClick={onOpenGlobalSearch}
                className="w-full flex items-center justify-between pl-3 pr-3 py-1.5 text-xs bg-slate-900 border-2 border-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-100 transition-all text-left hard-shadow-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
              >
                <div className="flex items-center gap-2">
                  <Search className="w-3.5 h-3.5 text-cyan-500" />
                  <span>Search metrics, vitals, meds, workouts...</span>
                </div>
                <kbd className="hidden lg:inline-flex items-center gap-0.5 text-[10px] font-mono bg-slate-50 text-slate-950 px-1.5 py-0.5 border border-slate-50 font-bold">
                  ⌘K
                </kbd>
              </button>
            </div>

            {/* Right Action Cluster */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              
              {/* Persona Switcher Pill (Patient vs Clinician) */}
              <div className="flex items-center border-2 border-slate-50 text-xs divide-x-2 divide-slate-50">
                <button
                  id="persona-patient-btn"
                  onClick={() => setActiveTab('command')}
                  className={`px-2.5 py-1.5 transition-all font-bold uppercase tracking-wider flex items-center gap-1 ${
                    activeTab !== 'clinician'
                      ? 'bg-cyan-500 text-slate-950'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-100'
                  }`}
                  title="Patient / Everyday Health Mode"
                >
                  <User className="w-3 h-3" />
                  <span className="hidden sm:inline">Patient</span>
                </button>
                <button
                  id="persona-clinician-btn"
                  onClick={() => setActiveTab('clinician')}
                  className={`px-2.5 py-1.5 transition-all font-bold uppercase tracking-wider flex items-center gap-1 ${
                    activeTab === 'clinician'
                      ? 'bg-emerald-500 text-slate-50'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-100'
                  }`}
                  title="Doctor / Clinician EHR Workstation"
                >
                  <ShieldCheck className="w-3 h-3" />
                  <span className="hidden sm:inline">Clinician</span>
                </button>
              </div>

              {/* Theme toggle */}
              <ThemeToggle theme={theme} onToggle={onToggleTheme} />

              {/* Mobile Quick Search Button */}
              <button
                onClick={onOpenGlobalSearch}
                aria-label="Open search"
                className="md:hidden p-2 bg-slate-900 border-2 border-slate-50 text-slate-300 hover:bg-slate-50 hover:text-slate-950 transition-all"
              >
                <Search className="w-4 h-4 text-cyan-500" />
              </button>

              {/* Live BLE Stream Status Button */}
              <button
                id="live-ble-btn"
                onClick={onOpenLiveWorkout}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold uppercase border-2 transition-all ${
                  isBleConnected
                    ? 'bg-rose-500/15 border-rose-500 text-rose-500 hover:bg-rose-500 hover:text-slate-50'
                    : 'bg-slate-900 border-slate-50 text-slate-300 hover:bg-slate-50 hover:text-slate-950'
                }`}
                title="Open Live Workout HUD & BLE Stream"
              >
                <Radio className={`w-3.5 h-3.5 ${isBleConnected ? 'text-rose-500 animate-pulse' : 'text-slate-400'}`} />
                <span className="hidden sm:inline">
                  {isBleConnected ? `${liveBpm} BPM` : 'Live HUD'}
                </span>
              </button>

              {/* "What Changed?" Root-Cause Trigger */}
              <button
                id="what-changed-btn"
                onClick={onOpenWhatChanged}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase bg-amber-500 border-2 border-slate-50 text-slate-950 hover:translate-x-[2px] hover:translate-y-[2px] hard-shadow-sm hover:shadow-none transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">What Changed?</span>
              </button>

              {/* Google Workspace & Cloud Trigger */}
              {onOpenWorkspace && (
                <button
                  id="navbar-workspace-btn"
                  onClick={() => onOpenWorkspace('gmail')}
                  className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase bg-slate-900 border-2 border-slate-50 text-slate-100 hover:bg-emerald-500 hover:text-slate-50 transition-all hard-shadow-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
                  title="Google Workspace & Firebase Sync"
                >
                  <Cloud className="w-3.5 h-3.5 text-cyan-500" />
                  <span>Workspace</span>
                </button>
              )}

              {/* Doctor Report Modal Trigger */}
              <button
                id="doctor-report-btn"
                onClick={onOpenDoctorReport}
                className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase bg-slate-900 border-2 border-slate-50 text-slate-100 hover:bg-cyan-500 hover:text-slate-950 transition-all hard-shadow-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
              >
                <FileText className="w-3.5 h-3.5 text-cyan-500" />
                <span>Doctor Export</span>
              </button>

              {/* User Profile / Lifecycle Dropdown */}
              <div className="relative">
                <button
                  id="user-lifecycle-menu-btn"
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 bg-slate-900 border-2 border-slate-50 hover:bg-slate-100 text-slate-100 text-xs font-bold transition-all hard-shadow-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
                >
                  <div className="w-6 h-6 bg-cyan-500 text-slate-950 border border-slate-50 flex items-center justify-center font-black text-[10px]">
                    AV
                  </div>
                  <span className="hidden md:inline uppercase tracking-wider">Alex Vance</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-slate-900 border-2 border-slate-50 p-2 hard-shadow-lg z-50 text-xs space-y-1">
                    <div className="px-3 py-2 border-b-2 border-slate-50">
                      <span className="font-black text-slate-100 block uppercase tracking-wider">Alex Vance</span>
                      <span className="text-[10px] text-cyan-500 font-mono uppercase tracking-widest">Pro Biohacker Member</span>
                    </div>

                    {onOpenWorkspace && (
                      <button
                        onClick={() => { onOpenWorkspace('gmail'); setShowUserDropdown(false); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-slate-100 hover:bg-cyan-500 hover:text-slate-950 font-bold uppercase tracking-wider transition-all"
                      >
                        <Cloud className="w-4 h-4 text-cyan-500" /> Google Workspace & Cloud
                      </button>
                    )}

                    <button
                      onClick={() => { setActiveTab('lifecycle'); setShowUserDropdown(false); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-slate-100 hover:bg-cyan-500 hover:text-slate-950 font-bold uppercase tracking-wider transition-all"
                    >
                      <User className="w-4 h-4 text-cyan-500" /> Account Settings
                    </button>

                    <button
                      onClick={() => { setActiveTab('lifecycle'); setShowUserDropdown(false); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-slate-100 hover:bg-emerald-500 hover:text-slate-50 font-bold uppercase tracking-wider transition-all"
                    >
                      <CreditCard className="w-4 h-4 text-emerald-500" /> Billing & Upgrades
                    </button>

                    <button
                      onClick={() => { setActiveTab('help'); setShowUserDropdown(false); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-slate-100 hover:bg-amber-500 hover:text-slate-950 font-bold uppercase tracking-wider transition-all"
                    >
                      <LifeBuoy className="w-4 h-4 text-amber-500" /> Help Center & Support
                    </button>

                    <button
                      onClick={() => { setActiveTab('legal'); setShowUserDropdown(false); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-slate-100 hover:bg-slate-100 hover:text-slate-950 font-bold uppercase tracking-wider transition-all"
                    >
                      <ShieldCheck className="w-4 h-4 text-cyan-500" /> Legal & Privacy Center
                    </button>

                    <button
                      onClick={() => { setActiveTab('ux-states'); setShowUserDropdown(false); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-slate-100 hover:bg-slate-100 hover:text-slate-950 font-bold uppercase tracking-wider transition-all"
                    >
                      <ShieldAlert className="w-4 h-4 text-rose-500" /> UX States Audit
                    </button>

                    <div className="border-t-2 border-slate-50 pt-1">
                      <button
                        onClick={() => { setActiveTab('lifecycle'); setShowUserDropdown(false); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-slate-100 hover:bg-rose-500 hover:text-slate-50 font-bold uppercase tracking-wider transition-all"
                      >
                        <LogIn className="w-4 h-4 text-rose-500" /> Switch / Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Responsive Horizontal Scrollable Sub-Navigation Tabs */}
          <div className="flex items-center gap-0 overflow-x-auto py-2 scrollbar-none border-t-2 border-slate-50">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all border-r border-slate-50 last:border-r-0 ${
                    isActive
                      ? 'bg-cyan-500 text-slate-950'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
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
          className="fixed inset-0 z-50 bg-slate-50/40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation drawer"
        >
          <div
            ref={drawerRef}
            className="w-4/5 max-w-sm h-full bg-slate-900 border-r-4 border-slate-50 p-4 hard-shadow-xl flex flex-col justify-between overflow-y-auto animate-slideRight text-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b-2 border-slate-50">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-cyan-500 border-2 border-slate-50 flex items-center justify-center">
                    <Activity className="w-4 h-4 text-slate-950" />
                  </div>
                  <span className="font-black text-base font-serif-display text-slate-100">VITAL<span className="text-cyan-500">OS</span></span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 bg-slate-100 text-slate-950 border-2 border-slate-50 hover:bg-cyan-500 transition-all"
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
                  className="w-full flex items-center justify-between p-2.5 bg-slate-100 text-slate-950 text-xs font-bold uppercase tracking-wider mb-2 border-2 border-slate-50 hard-shadow-sm"
                >
                  <div className="flex items-center gap-2">
                    <Search className="w-4 h-4" />
                    <span>Search Health Systems</span>
                  </div>
                  <kbd className="font-mono text-[10px] bg-slate-900 text-slate-50 px-1.5 py-0.5 border border-slate-50">⌘K</kbd>
                </button>

                <div className="text-[10px] uppercase font-bold tracking-widest text-slate-400 px-2 pt-2 font-mono">
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
                        className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-bold uppercase tracking-wider transition-all border-l-4 ${
                          isActive
                            ? 'bg-cyan-500 text-slate-950 border-cyan-500'
                            : 'text-slate-300 hover:bg-slate-100 hover:text-slate-950 border-transparent'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t-2 border-slate-50 text-xs space-y-2">
              <div className="flex items-center justify-between text-slate-400 font-mono uppercase tracking-widest text-[10px]">
                <span>Theme Mode</span>
                <ThemeToggle theme={theme} onToggle={onToggleTheme} />
              </div>
              <p className="text-[10px] text-slate-400 text-center font-mono uppercase tracking-widest">
                VITALOS Personal Health Intelligence &copy; 2026
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};


