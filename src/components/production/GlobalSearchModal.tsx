import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Activity,
  Heart,
  Moon,
  Utensils,
  Dumbbell,
  Pill,
  Scale,
  FlaskConical,
  Sun,
  ShieldCheck,
  ShieldAlert,
  Brain,
  Cpu,
  Users,
  GitMerge,
  Sparkles,
  Zap,
  Layers,
  FileSliders as Sliders,
  Calendar,
  Award,
  BookOpen,
  User,
  LifeBuoy,
  FileText,
  X,
  ArrowRight,
  Command,
  MapPin,
  Stethoscope,
  Compass,
  FileSpreadsheet,
  Clock,
  CheckCircle2,
  Lock,
  Radio,
  SlidersHorizontal
} from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: string) => void;
  theme?: 'dark' | 'light';
}

interface SearchItem {
  id: string;
  title: string;
  category: 'CORE INTELLIGENCE' | 'CLINICAL & LABS' | 'BIOMECHANICAL' | 'BIOCHEMICAL & RX' | 'CIRCADIAN & NEURO' | 'DATA SCIENCE & SYSTEMS';
  keywords: string[];
  tabId: string;
  icon: any;
  description: string;
  badge?: string;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectTab,
  theme = 'dark'
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const inputRef = useRef<HTMLInputElement>(null);

  const searchDatabase: SearchItem[] = [
    {
      id: 'command',
      title: 'FRONT PAGE (COMMAND CENTER)',
      category: 'CORE INTELLIGENCE',
      keywords: ['home', 'dashboard', 'live', 'heart rate', 'bpm', 'overview', 'vital score', 'readiness', 'lead', 'front page', 'newsprint'],
      tabId: 'command',
      icon: Activity,
      description: 'The authoritative daily health dispatch: Live biometric stream, readiness index, and bio-adaptive daily protocol.',
      badge: 'DISPATCH'
    },
    {
      id: 'vitals',
      title: 'HEALTH METRICS & LAB ARCHIVE',
      category: 'CLINICAL & LABS',
      keywords: ['vitals', 'labs', 'biomarkers', 'blood pressure', 'cholesterol', 'sleep', 'activity', 'nutrition', 'macros', 'glucose', 'hrv', 'rem', 'deep sleep', 'steps', 'calories', 'protein', 'vo2'],
      tabId: 'vitals',
      icon: Heart,
      description: 'Comprehensive biomarker telemetry, clinical blood panels, sleep architecture breakdown, and nutrition logs.',
      badge: 'CLINICAL'
    },
    {
      id: 'maps',
      title: 'MAPS & CLINICAL FACILITIES GPS',
      category: 'CLINICAL & LABS',
      keywords: ['maps', 'gps', 'hospital', 'clinic', 'urgent care', 'pharmacy', 'cardiology', 'routes', 'places', 'geolocation', 'workout path', 'emergency'],
      tabId: 'maps',
      icon: MapPin,
      description: 'Google Maps Platform health portal: Locate clinical cardiology labs, urgent care, hospitals, and outdoor workout routes.',
      badge: 'GPS ACTIVE'
    },
    {
      id: 'coach',
      title: 'AI COACH & ADAPTIVE PROTOCOL',
      category: 'CORE INTELLIGENCE',
      keywords: ['ask', 'plan', 'simulator', 'what-if', 'workout', 'grocery', 'adaptive', 'copilot', 'query', 'chat', 'predict', 'gemini', 'nutrition plan'],
      tabId: 'coach',
      icon: Sparkles,
      description: 'Server-side Gemini health intelligence: Inquire on health telemetry, simulate what-if scenarios, and generate adaptive schedules.',
      badge: 'BIO-AI'
    },
    {
      id: 'sources',
      title: 'DATA HUB & WEARABLES TELEMETRY',
      category: 'DATA SCIENCE & SYSTEMS',
      keywords: ['sources', 'upload', 'lab report', 'ocr', 'apple health', 'garmin', 'oura', 'fitbit', 'bluetooth', 'stream', 'telemetry', 'connect', 'wearable', 'whoop', 'polar'],
      tabId: 'sources',
      icon: Layers,
      description: 'Direct Web Bluetooth GATT pairing, OCR lab document ingestion, and multi-device wearable streaming sync.',
      badge: 'SYNC'
    },
    {
      id: 'clinician',
      title: 'CLINICIAN EHR & PATIENT AUDIT',
      category: 'CLINICAL & LABS',
      keywords: ['clinician', 'ehr', 'doctor', 'patient', 'consultation', 'pdf export', 'emr', 'soap notes', 'audit', 'cardiology review'],
      tabId: 'clinician',
      icon: Stethoscope,
      description: 'Physician EHR workspace with longitudinal trend graphs, HL7/FHIR export format, and clinical consult generator.',
      badge: 'EHR'
    },
    {
      id: 'strength',
      title: 'STRENGTH TRAINING & 1RM ARCHIVE',
      category: 'BIOMECHANICAL',
      keywords: ['strength', '1rm', 'squat', 'bench', 'deadlift', 'hypertrophy', 'rpe', 'progressive overload', 'weights', 'volume load', 'barbell'],
      tabId: 'strength',
      icon: Dumbbell,
      description: 'Neuromuscular fatigue modeling, 1-Rep Max percentage calculations, and hypertrophy tonnage tracking.',
      badge: '1RM MATRIX'
    },
    {
      id: 'metabolic',
      title: 'BODY METABOLIC & DEXA COMPOSITION',
      category: 'BIOMECHANICAL',
      keywords: ['dexa', 'body fat', 'visceral', 'skeletal muscle', 'ffmi', 'bone density', 'metabolic rate', 'bmr', 'tdee', 'composition'],
      tabId: 'metabolic',
      icon: Scale,
      description: 'Compartmental DEXA body composition: Visceral adipose tissue tracking, appendicular lean mass, and skeletal bone mineral density.',
      badge: 'DEXA'
    },
    {
      id: 'supplements',
      title: 'MEDICATION & SUPPLEMENT MATRIX',
      category: 'BIOCHEMICAL & RX',
      keywords: ['medication', 'supplements', 'pills', 'vitamins', 'creatine', 'omega 3', 'vitamin d', 'pharmacokinetics', 'interactions', 'dosing', 'timing'],
      tabId: 'supplements',
      icon: Pill,
      description: 'Pharmacokinetics timing tracker, supplement stack synergy verification, and automated drug-nutrient interaction audit.',
      badge: 'STACK'
    },
    {
      id: 'experiments',
      title: 'HEALTH EXPERIMENTS N=1 LAB',
      category: 'BIOCHEMICAL & RX',
      keywords: ['experiments', 'n=1', 'hypothesis', 'cold plunge', 'sauna', 'fasting', 'caffeine', 'zone 2 trial', 'biohacking', 'statistical test'],
      tabId: 'experiments',
      icon: FlaskConical,
      description: 'Self-directed N=1 clinical trials: Measure statistically significant biometric changes from sauna, cold exposure, or fasting.',
      badge: 'N=1 LAB'
    },
    {
      id: 'circadian',
      title: 'CIRCADIAN & ENVIRONMENTAL AQI',
      category: 'CIRCADIAN & NEURO',
      keywords: ['circadian', 'sunlight', 'lux', 'pm2.5', 'aqi', 'air quality', 'melatonin', 'blue light', 'uv index', 'temperature', 'weather'],
      tabId: 'circadian',
      icon: Sun,
      description: 'Sunlight timing optimization, environmental PM2.5 AQI monitoring, and phototherapy exposure scheduling.',
      badge: 'SOLAR'
    },
    {
      id: 'injury',
      title: 'INJURY & MOBILITY RECOVERY HUB',
      category: 'BIOMECHANICAL',
      keywords: ['injury', 'mobility', 'rehab', 'physical therapy', 'joint health', 'foam roll', 'stretching', 'fascia', 'tendon', 'range of motion'],
      tabId: 'injury',
      icon: ShieldAlert,
      description: 'Tissue rehabilitation routines, kinetic chain mobility assessments, and post-exertion recovery protocols.',
      badge: 'REHAB'
    },
    {
      id: 'focus',
      title: 'COGNITIVE & NEURO-WELLNESS DESK',
      category: 'CIRCADIAN & NEURO',
      keywords: ['cognitive', 'neuro', 'focus', 'brain', 'reaction time', 'eeg', 'meditation', 'stress', 'flow state', 'pomodoro', 'alpha waves'],
      tabId: 'focus',
      icon: Brain,
      description: 'Cognitive load tracking, autonomic nervous system stress mapping, and focus state optimization.',
      badge: 'NEURO'
    },
    {
      id: 'twin',
      title: 'DIGITAL TWIN & RADAR ENGINE',
      category: 'DATA SCIENCE & SYSTEMS',
      keywords: ['twin', 'radar', 'simulation', 'predictive', 'organ risk', 'longevity', 'cardiovascular risk', 'biological age', 'telemetry model'],
      tabId: 'twin',
      icon: Cpu,
      description: 'Real-time multi-organ digital twin simulation projecting biological age and 10-year cardiometabolic trajectory.',
      badge: 'RADAR'
    },
    {
      id: 'journal',
      title: 'HEALTH JOURNAL CHRONICLE',
      category: 'DATA SCIENCE & SYSTEMS',
      keywords: ['journal', 'log', 'diary', 'symptoms', 'notes', 'mood', 'energy', 'digestive', 'daily log', 'entries'],
      tabId: 'journal',
      icon: BookOpen,
      description: 'Chronological health diary linking subjective energy, mood ratings, and symptoms with objective telemetry.',
      badge: 'JOURNAL'
    },
    {
      id: 'timeline',
      title: 'LONGITUDINAL HEALTH TIMELINE',
      category: 'DATA SCIENCE & SYSTEMS',
      keywords: ['timeline', 'history', 'events', 'milestones', 'past records', 'annual trends', 'chrono', 'longitudinal'],
      tabId: 'timeline',
      icon: Clock,
      description: 'Chronological multi-year timeline of health milestones, lab tests, injury events, and breakthrough PRs.',
      badge: 'CHRONO'
    },
    {
      id: 'calendar',
      title: 'CALENDAR & ADAPTIVE SCHEDULE',
      category: 'CORE INTELLIGENCE',
      keywords: ['calendar', 'schedule', 'training schedule', 'planner', 'days', 'workout calendar', 'rest days'],
      tabId: 'calendar',
      icon: Calendar,
      description: 'Visual calendar of planned workouts, recovery cycles, lab appointments, and habit milestones.',
      badge: 'SCHEDULE'
    },
    {
      id: 'social',
      title: 'ACHIEVEMENTS & HEALTH BADGES',
      category: 'CORE INTELLIGENCE',
      keywords: ['achievements', 'badges', 'trophies', 'streaks', 'vital score milestones', 'levels', 'gamification'],
      tabId: 'social',
      icon: Award,
      description: 'Health vitality streaks, verified physiological milestones, and biomarker progress certifications.',
      badge: 'MEDALS'
    },
    {
      id: 'settings',
      title: 'SETTINGS, PRIVACY & EXPORT',
      category: 'DATA SCIENCE & SYSTEMS',
      keywords: ['settings', 'privacy', 'theme', 'dark', 'light', 'export', 'delete', 'cookies', 'account', 'data', 'security'],
      tabId: 'settings',
      icon: ShieldCheck,
      description: 'Manage appearance (Light / Dark mode), local storage cache, privacy preferences, and raw JSON export.',
      badge: 'SYSTEM'
    }
  ];

  const categories = ['ALL', 'CORE INTELLIGENCE', 'CLINICAL & LABS', 'BIOMECHANICAL', 'BIOCHEMICAL & RX', 'CIRCADIAN & NEURO', 'DATA SCIENCE & SYSTEMS'];

  const filteredItems = searchDatabase.filter((item) => {
    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    if (!matchesCategory) return false;

    if (!query.trim()) return true;

    const q = query.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.keywords.some((k) => k.toLowerCase().includes(q))
    );
  });

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
      setSelectedCategory('ALL');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          onSelectTab(filteredItems[selectedIndex].tabId);
          onClose();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex]);

  if (!isOpen) return null;

  const isDark = theme === 'dark';

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center pt-12 sm:pt-20 p-3 sm:p-4 animate-fadeIn select-none font-mono"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="global-search-title"
    >
      <div
        className={`w-full max-w-3xl ${
          isDark
            ? 'bg-[#141414] text-[#F9F9F7] border-2 border-[#333333]'
            : 'bg-[#FFFFFF] text-[#111111] border-2 border-[#111111] hard-shadow'
        } overflow-hidden transition-colors`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Masthead Header Bar */}
        <div className={`px-4 sm:px-6 py-3 border-b ${isDark ? 'border-[#2A2A2A] bg-[#0E0E0E]' : 'border-[#E5E5DE] bg-[#F7F7F4]'} flex items-center justify-between`}>
          <div className="flex items-center gap-2">
            <span className="bg-[#CC0000] text-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider font-mono">
              ARCHIVE INDEX
            </span>
            <h2 id="global-search-title" className="text-sm font-serif font-black uppercase tracking-tight">
              Vitasync Universal Health Chronicle Archive
            </h2>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-mono">
            <span className={isDark ? 'text-[#888888]' : 'text-[#666666]'}>PRESS ESC TO CLOSE</span>
            <button
              onClick={onClose}
              className={`p-1 ${isDark ? 'hover:bg-[#222222] text-[#888888] hover:text-white' : 'hover:bg-[#E5E5DE] text-[#666666] hover:text-black'} transition-colors`}
              aria-label="Close search archive"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search Input Bar */}
        <div className={`flex items-center px-4 sm:px-6 py-3.5 border-b ${isDark ? 'border-[#262626] bg-[#181818]' : 'border-[#D4D4CE] bg-[#FFFFFF]'} gap-3`}>
          <Search className={`w-4 h-4 ${isDark ? 'text-[#AAAAAA]' : 'text-[#555555]'} flex-shrink-0`} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search intelligence desks, biomarkers, labs, meds, DEXA, GPS (e.g. 'VO2', '1RM', 'glucose', 'DEXA')..."
            className={`w-full bg-transparent text-sm ${isDark ? 'text-white placeholder-[#666666]' : 'text-[#111111] placeholder-[#888888]'} font-mono focus:outline-none tracking-tight`}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className={`text-xs ${isDark ? 'text-[#888888] hover:text-white' : 'text-[#777777] hover:text-black'} px-1.5 py-0.5 border ${isDark ? 'border-[#333333]' : 'border-[#CCCCCC]'}`}
            >
              CLEAR
            </button>
          )}
          <div className={`hidden sm:flex items-center gap-1 text-[10px] ${isDark ? 'bg-[#111111] text-[#888888] border-[#333333]' : 'bg-[#F0F0EB] text-[#555555] border-[#CCCCCC]'} px-2 py-1 border font-bold uppercase`}>
            <span>ENTER ↵</span>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className={`px-4 sm:px-6 py-2 border-b ${isDark ? 'border-[#222222] bg-[#111111]' : 'border-[#EAEAEA] bg-[#FAFAF8]'} flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[10px] font-mono font-bold uppercase`}>
          <span className={`${isDark ? 'text-[#777777]' : 'text-[#888888]'} mr-1 flex-shrink-0`}>SECTION:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setSelectedIndex(0);
              }}
              className={`px-2 py-1 border transition-colors whitespace-nowrap flex-shrink-0 ${
                selectedCategory === cat
                  ? isDark
                    ? 'bg-white text-black border-white'
                    : 'bg-[#111111] text-white border-[#111111]'
                  : isDark
                    ? 'bg-[#181818] text-[#888888] border-[#2A2A2A] hover:text-white hover:border-[#444444]'
                    : 'bg-[#F2F2EC] text-[#666666] border-[#DCDCD5] hover:text-black hover:border-[#999999]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className={`max-h-[55vh] overflow-y-auto divide-y ${isDark ? 'divide-[#222222] bg-[#141414]' : 'divide-[#EAEAE5] bg-[#FFFFFF]'}`}>
          {filteredItems.length === 0 ? (
            <div className="p-10 text-center space-y-2">
              <Search className={`w-8 h-8 mx-auto ${isDark ? 'text-[#444444]' : 'text-[#AAAAAA]'}`} />
              <p className={`text-sm font-bold uppercase ${isDark ? 'text-[#888888]' : 'text-[#666666]'}`}>
                No intelligence desks or metrics matching &ldquo;{query}&rdquo;
              </p>
              <p className={`text-xs ${isDark ? 'text-[#666666]' : 'text-[#888888]'}`}>
                Try querying &ldquo;VO2 Max&rdquo;, &ldquo;DEXA&rdquo;, &ldquo;1RM&rdquo;, &ldquo;Glucose&rdquo;, &ldquo;Clinician&rdquo;, or &ldquo;Maps GPS&rdquo;.
              </p>
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.tabId);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-start sm:items-center justify-between p-3 sm:p-4 cursor-pointer transition-colors border-l-4 ${
                    isSelected
                      ? isDark
                        ? 'bg-[#222222] border-l-[#CC0000]'
                        : 'bg-[#F2F2EB] border-l-[#CC0000]'
                      : 'border-l-transparent hover:bg-[#1A1A1A] dark:hover:bg-[#1A1A1A] hover:bg-zinc-50'
                  }`}
                >
                  <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                    <div
                      className={`w-8 h-8 border flex items-center justify-center flex-shrink-0 ${
                        isSelected
                          ? 'bg-[#CC0000] text-white border-[#CC0000]'
                          : isDark
                            ? 'bg-[#1C1C1C] text-[#AAAAAA] border-[#333333]'
                            : 'bg-[#EAEAE4] text-[#333333] border-[#CCCCCC]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="min-w-0 flex-1 pr-2">
                      <div className="flex flex-wrap items-center gap-2 mb-0.5">
                        <span
                          className={`text-xs font-bold uppercase tracking-tight font-mono ${
                            isSelected
                              ? isDark ? 'text-white' : 'text-black'
                              : isDark ? 'text-[#E0E0DC]' : 'text-[#222222]'
                          }`}
                        >
                          {item.title}
                        </span>

                        <span
                          className={`text-[9px] px-1.5 py-0.2 border font-mono font-semibold uppercase ${
                            isDark
                              ? 'bg-[#181818] text-[#888888] border-[#333333]'
                              : 'bg-[#F4F4EE] text-[#666666] border-[#D0D0CA]'
                          }`}
                        >
                          {item.category}
                        </span>

                        {item.badge && (
                          <span className="text-[9px] px-1 py-0.2 bg-[#CC0000]/20 text-[#CC0000] border border-[#CC0000]/40 font-mono font-bold uppercase">
                            {item.badge}
                          </span>
                        )}
                      </div>

                      <p
                        className={`text-xs leading-relaxed truncate sm:whitespace-normal font-sans ${
                          isDark ? 'text-[#888888]' : 'text-[#666666]'
                        }`}
                      >
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0 self-center">
                    <ArrowRight
                      className={`w-4 h-4 transition-transform ${
                        isSelected
                          ? 'text-[#CC0000] translate-x-1'
                          : isDark ? 'text-[#444444]' : 'text-[#BBBBBB]'
                      }`}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Navigation Hints */}
        <div className={`px-4 sm:px-6 py-2.5 border-t ${isDark ? 'border-[#2A2A2A] bg-[#0E0E0E] text-[#777777]' : 'border-[#E5E5DE] bg-[#F7F7F4] text-[#666666]'} flex flex-wrap items-center justify-between text-[10px] font-mono gap-2`}>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className={`px-1 border ${isDark ? 'border-[#333333] bg-[#181818]' : 'border-[#CCCCCC] bg-[#FFFFFF]'}`}>↑</kbd>
              <kbd className={`px-1 border ${isDark ? 'border-[#333333] bg-[#181818]' : 'border-[#CCCCCC] bg-[#FFFFFF]'}`}>↓</kbd>
              <span>NAVIGATE</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className={`px-1.5 border ${isDark ? 'border-[#333333] bg-[#181818]' : 'border-[#CCCCCC] bg-[#FFFFFF]'}`}>ENTER</kbd>
              <span>LAUNCH DESK</span>
            </span>
          </div>

          <div className="font-bold tracking-widest text-[#CC0000]">
            VITALOS INTELLIGENCE SUITE
          </div>
        </div>

      </div>
    </div>
  );
};
