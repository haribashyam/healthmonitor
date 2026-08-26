import React, { useState, useEffect, useRef } from 'react';
import { Search, Activity, Heart, Moon, Utensils, Dumbbell, Pill, Scale, FlaskConical, Sun, ShieldCheck, ShieldAlert, Brain, Cpu, Users, GitMerge, Sparkles, Zap, Layers, FileSliders as Sliders, Calendar, Award, BookOpen, User, LifeBuoy, FileText, X, ArrowRight, Command } from 'lucide-react';

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
    { id: 'dashboard', title: 'Dashboard & Live Pulse', category: 'Core', keywords: ['home', 'dashboard', 'live', 'heart rate', 'bpm', 'overview', 'vital score', 'readiness'], tabId: 'dashboard', icon: Activity, description: 'Live biometric stream, vital alerts, readiness status, and quick actions.' },
    { id: 'health', title: 'Health Metrics & Labs', category: 'Health', keywords: ['vitals', 'labs', 'biomarkers', 'blood pressure', 'cholesterol', 'sleep', 'activity', 'nutrition', 'macros', 'glucose', 'hrv', 'rem', 'deep sleep', 'steps', 'calories', 'protein'], tabId: 'health', icon: Heart, description: 'Clinical biomarkers, sleep architecture, activity analytics, and nutrition tracking.' },
    { id: 'coach', title: 'AI Coach & Adaptive Plan', category: 'AI', keywords: ['ask', 'plan', 'simulator', 'what-if', 'workout', 'grocery', 'adaptive', 'copilot', 'query', 'chat', 'predict', 'vo2 max'], tabId: 'coach', icon: Sparkles, description: 'Ask questions, view adaptive workout plan, and simulate lifestyle changes.' },
    { id: 'data', title: 'Data Hub & Connected Sources', category: 'Data', keywords: ['sources', 'upload', 'lab report', 'ocr', 'apple health', 'garmin', 'oura', 'fitbit', 'bluetooth', 'stream', 'telemetry', 'connect', 'wearable'], tabId: 'data', icon: Layers, description: 'Connect wearables, upload lab reports, and monitor live telemetry streams.' },
    { id: 'settings', title: 'Settings & Privacy', category: 'Account', keywords: ['settings', 'privacy', 'theme', 'dark', 'light', 'export', 'delete', 'cookies', 'account', 'data'], tabId: 'settings', icon: ShieldCheck, description: 'Manage theme, privacy, data export, cookie preferences, and account deletion.' },
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
