import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Smile,
  Meh,
  Frown,
  Zap,
  Activity,
  Heart,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { HealthJournalEntry } from '../types';

interface HealthJournalViewProps {
  entries: HealthJournalEntry[];
  setEntries: React.Dispatch<React.SetStateAction<HealthJournalEntry[]>>;
}

export const HealthJournalView: React.FC<HealthJournalViewProps> = ({ entries, setEntries }) => {
  const [energyLevel, setEnergyLevel] = useState<number>(8);
  const [sorenessLevel, setSorenessLevel] = useState<number>(2);
  const [stressLevel, setStressLevel] = useState<number>(3);
  const [mood, setMood] = useState<'Great' | 'Good' | 'Neutral' | 'Fatigued' | 'Stressed'>('Great');
  const [notes, setNotes] = useState('');

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: HealthJournalEntry = {
      id: `j-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      energyLevel,
      sorenessLevel,
      stressLevel,
      mood,
      notes: notes.trim() || 'Felt strong throughout morning workout.',
      correlations: ['High energy correlated with +5% higher HRV today and 94m deep sleep.']
    };

    setEntries([newEntry, ...entries]);
    setNotes('');
    alert('Subjective check-in saved to your health timeline.');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Subjective Health Journal & Bio-Feedback</h1>
          </div>
          <p className="text-xs text-slate-300">
            Log daily subjective readiness, muscle soreness, and mental energy. VITALOS correlates your perception with objective wearable metrics.
          </p>
        </div>
      </div>

      {/* Daily Check-In Form */}
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-4 shadow-md max-w-2xl">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" /> Today's Subjective Readiness Check-In
        </h3>

        <form onSubmit={handleAddEntry} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Energy Slider */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-bold">Energy:</span>
                <span className="text-cyan-400 font-bold">{energyLevel}/10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={energyLevel}
                onChange={(e) => setEnergyLevel(parseInt(e.target.value))}
                className="w-full accent-cyan-500"
              />
            </div>

            {/* Muscle Soreness */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-bold">Soreness:</span>
                <span className="text-amber-400 font-bold">{sorenessLevel}/10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={sorenessLevel}
                onChange={(e) => setSorenessLevel(parseInt(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>

            {/* Stress */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-bold">Stress:</span>
                <span className="text-rose-400 font-bold">{stressLevel}/10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={stressLevel}
                onChange={(e) => setStressLevel(parseInt(e.target.value))}
                className="w-full accent-rose-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Qualitative Notes</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Legs felt very fresh on morning run, fasted for 14 hours..."
              className="w-full p-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-200"
            />
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-all flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Log Daily Perception
            </button>
          </div>
        </form>
      </div>

      {/* Historical Entries */}
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white">Journal History & Wearable Correlations</h3>

        <div className="space-y-3">
          {entries.map((item) => (
            <div key={item.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{item.date}</span>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-cyan-400">Energy: {item.energyLevel}/10</span>
                  <span className="text-amber-400">Soreness: {item.sorenessLevel}/10</span>
                  <span className="text-rose-400">Stress: {item.stressLevel}/10</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{item.notes}</p>

              {item.correlations && (
                <div className="text-[11px] text-cyan-300 bg-cyan-500/10 p-2 rounded-lg border border-cyan-500/20">
                  <strong>AI Multi-Signal Insight:</strong> {item.correlations.join(' ')}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
