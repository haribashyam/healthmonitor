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
  Sliders,
  Calendar,
  Award,
  BookOpen,
  User,
  LifeBuoy,
  FileText,
  X,
  ArrowRight,
  Command
} from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: string) => void;
}

interface SearchItem {
  id: string;
  title: string;
  category: string;
  keywords: string[];
  tabId: string;
  icon: any;
  description: string;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectTab
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const searchDatabase: SearchItem[] = [
    { id: 'command', title: 'Command Center & Live Pulse', category: 'Core Dashboard', keywords: ['home', 'dashboard', 'live', 'heart rate', 'bpm', 'overview'], tabId: 'command', icon: Activity, description: 'Live biometric stream, quick vital alerts, and readiness status.' },
    { id: 'strength', title: 'Strength Training & 1RM Calculator', category: 'Fitness & Muscle', keywords: ['squat', 'bench', 'deadlift', 'rpe', '1rm', 'hypertrophy', 'volume'], tabId: 'strength', icon: Dumbbell, description: 'Track progressive overload, calculate estimated 1RM, and log lifting sets.' },
    { id: 'supplements', title: 'Medication & Supplement Matrix', category: 'Pharmacology', keywords: ['vitamins', 'magnesium', 'creatine', 'dosing', 'adherence', 'pills'], tabId: 'supplements', icon: Pill, description: 'Morning/bedtime dosing schedules, synergy flags, and refill reminders.' },
    { id: 'metabolic', title: 'Body Composition & Interstitial CGM', category: 'Metabolism', keywords: ['glucose', 'dexa', 'visceral fat', 'cgm', 'hba1c', 'homa-ir', 'muscle'], tabId: 'metabolic', icon: Scale, description: 'Continuous blood sugar curve, % time-in-range, and DEXA body scans.' },
    { id: 'experiments', title: 'N=1 Personal Health Experiments Lab', category: 'Research', keywords: ['trials', 'hypothesis', 'baseline', 'p-value', 'curfew', 'cold shower'], tabId: 'experiments', icon: FlaskConical, description: 'Design 14-day personal health trials and measure statistical significance.' },
    { id: 'circadian', title: 'Circadian Entrainment & Environmental AQI', category: 'Environment', keywords: ['sunlight', 'air quality', 'aqi', 'pm2.5', 'uv', 'jetlag', 'sleep midpoint'], tabId: 'circadian', icon: Sun, description: 'Ambient air quality, morning light timers, and circadian consistency.' },
    { id: 'injury', title: 'Injury Tracker & Joint Rehab Matrix', category: 'Recovery', keywords: ['pain', 'knee', 'shoulder', 'rehab', 'contraindications', 'mobility'], tabId: 'injury', icon: ShieldCheck, description: 'Anatomical injury tracking, return-to-sport phases, and safe exercise substitutes.' },
    { id: 'family', title: 'Universal Medical ID & Caregiver Network', category: 'Emergency', keywords: ['emergency', 'blood type', 'allergies', 'doctor', 'caregiver', 'qr'], tabId: 'family', icon: ShieldAlert, description: 'Lockscreen-ready emergency ID, physician contacts, and multi-profile switching.' },
    { id: 'focus', title: 'Cognitive Focus & Screen Latency Engine', category: 'Mental Wellness', keywords: ['pomodoro', 'deep focus', '20-20-20', 'screen time', 'blue light', 'fatigue'], tabId: 'focus', icon: Brain, description: 'Focus timer, eye break intervals, and screen-time sleep latency audit.' },
    { id: 'ai-lab', title: 'Multi-LLM Consensus Lab', category: 'AI Intelligence', keywords: ['gemini', 'claude', 'gpt', 'comparison', 'audit', 'consensus'], tabId: 'ai-lab', icon: Cpu, description: 'Side-by-side prompt audits of Gemini 2.5, Claude 3.7, and GPT-4o.' },
    { id: 'clubs', title: 'Athletic Clubs & Segment PRs', category: 'Community', keywords: ['social', 'segments', 'challenges', 'leaderboard', 'kudos', 'strava'], tabId: 'clubs', icon: Users, description: 'Join endurance challenges, celebrate segment PRs, and share achievements.' },
    { id: 'data-quality', title: 'Universal Data Quality & Provenance', category: 'Security & Audit', keywords: ['conflicts', 'sampling', 'kalman', 'sensors', 'bluetooth', 'provenance'], tabId: 'data-quality', icon: GitMerge, description: 'Multi-device conflict resolution with Bayesian confidence weighting.' },
    { id: 'vitals', title: 'Vitals & Lab Biomarkers', category: 'Clinical', keywords: ['blood pressure', 'cholesterol', 'ldl', 'crp', 'blood test', 'labcorp', 'quest'], tabId: 'vitals', icon: Heart, description: 'View comprehensive metabolic, lipid, and hormonal blood test biomarkers.' },
    { id: 'activity', title: 'Activity & Cardio Analytics', category: 'Fitness', keywords: ['running', 'cycling', 'vo2 max', 'training load', 'trimp', 'zones', 'strava'], tabId: 'activity', icon: Activity, description: 'Deep dive into training volume, HR zone distribution, and fitness trends.' },
    { id: 'sleep', title: 'Sleep Architecture & Recovery', category: 'Recovery', keywords: ['rem', 'deep sleep', 'hrv', 'recovery score', 'sleep debt', 'oura', 'whoop'], tabId: 'sleep', icon: Moon, description: 'Sleep stage breakdown, overnight HRV RMSSD, and autonomic nervous recovery.' },
    { id: 'nutrition', title: 'Precision Nutrition & Fueling', category: 'Nutrition', keywords: ['calories', 'protein', 'macros', 'carbs', 'fats', 'fiber', 'hydration'], tabId: 'nutrition', icon: Utensils, description: 'Daily macronutrient balancing, micronutrient targets, and meal timing logs.' },
    { id: 'plan', title: 'Adaptive AI Health Protocol', category: 'AI Intelligence', keywords: ['workout plan', 'shopping list', 'diet', 'coach', 'adaptive rules'], tabId: 'plan', icon: Sparkles, description: 'Personalized 7-day workout and nutrition split with grocery essentials.' },
    { id: 'ask', title: 'Ask My Data (Natural Language)', category: 'AI Intelligence', keywords: ['search data', 'chat', 'copilot', 'query', 'trends', 'questions'], tabId: 'ask', icon: Zap, description: 'Query your entire unified telemetry history in plain English.' },
    { id: 'sources', title: 'Universal Data Hub & Lab OCR', category: 'Integrations', keywords: ['apple health', 'garmin', 'oura', 'fitbit', 'upload', 'pdf', 'ocr'], tabId: 'sources', icon: Layers, description: 'Connect wearables and extract lab biomarkers from PDF / image reports.' },
    { id: 'simulator', title: 'What-If Physiological Simulator', category: 'Predictive', keywords: ['simulate', 'future', 'prediction', 'vo2 max', 'weight loss', 'steps'], tabId: 'simulator', icon: Sliders, description: 'Predict changes in cardiovascular and metabolic metrics from lifestyle shifts.' },
    { id: 'help', title: 'Help Center & Knowledge Base', category: 'Support', keywords: ['faq', 'support', 'contact', 'troubleshooting', 'sensors'], tabId: 'help', icon: LifeBuoy, description: 'Frequently asked questions, Bluetooth pairing guides, and support contact.' }
  ];

  const filteredItems = query.trim()
    ? searchDatabase.filter((item) => {
        const q = query.toLowerCase();
        return (
          item.title.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.keywords.some((k) => k.toLowerCase().includes(q))
        );
      })
    : searchDatabase.slice(0, 8);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onSelectTab(searchDatabase[0].tabId);
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

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-start justify-center pt-16 sm:pt-24 p-4 animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="global-search-title"
    >
      <div
        className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-slate-800 gap-3">
          <Search className="w-5 h-5 text-cyan-400 flex-shrink-0" />
          <input
            ref={inputRef}
            id="global-search-title"
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search features, biomarkers, vitals, meds, workouts (e.g., '1RM', 'glucose', 'HRV')..."
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
          />
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
            <kbd className="font-mono">ESC</kbd>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1" aria-label="Close search">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2 divide-y divide-slate-800/50">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              <Search className="w-8 h-8 mx-auto mb-2 text-slate-600" />
              <p className="text-sm font-medium">No health metrics or tools matched "{query}"</p>
              <p className="text-xs text-slate-400 mt-1">Try searching for "VO2 Max", "Sleep", "Creatine", "Blood Pressure", or "Experiments".</p>
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
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                    isSelected ? 'bg-cyan-500/15 border border-cyan-500/30' : 'hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-400'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold ${isSelected ? 'text-cyan-300' : 'text-slate-200'}`}>
                          {item.title}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{item.description}</p>
                    </div>
                  </div>
                  <ArrowRight className={`w-4 h-4 ${isSelected ? 'text-cyan-400' : 'text-slate-600'}`} />
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span><kbd className="font-mono bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">↑</kbd> <kbd className="font-mono bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">↓</kbd> to navigate</span>
            <span><kbd className="font-mono bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">↵</kbd> to select</span>
          </div>
          <span className="text-cyan-400 font-mono">VITALOS Instant Index</span>
        </div>
      </div>
    </div>
  );
};
