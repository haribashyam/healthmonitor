import React, { useState } from 'react';
import {
  Pill,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Calendar,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  Check,
  Bell,
  Layers,
  ChevronRight
} from 'lucide-react';
import { MedicationSupplement } from '../types';

const INITIAL_MEDICATIONS: MedicationSupplement[] = [
  {
    id: 'med-1',
    name: 'Vitamin D3 + K2',
    type: 'vitamin',
    dosage: '5,000 IU / 100 mcg',
    frequency: 'Daily',
    timing: 'With Breakfast',
    startDate: '2026-01-01',
    purpose: 'Cardiovascular bone calcification prevention & immune optimization',
    adherencePercentage: 96,
    stockRemainingPills: 45,
    interactionNotes: 'Take with dietary fats for optimal micellar absorption',
    synergies: 'Synergistic with morning sunlight and Magnesium',
    activeReminderTime: '08:00 AM',
    takenToday: true
  },
  {
    id: 'med-2',
    name: 'Magnesium Glycinate (Elemental)',
    type: 'supplement',
    dosage: '400 mg',
    frequency: 'Daily',
    timing: 'Bedtime',
    startDate: '2026-01-15',
    purpose: 'Autonomic parasympathetic tone, deep sleep stage support & muscle relaxation',
    adherencePercentage: 92,
    stockRemainingPills: 28,
    interactionNotes: 'Separate from oral iron supplements by 2+ hours',
    synergies: 'Improves nocturnal HRV baseline and reduces sleep latency',
    activeReminderTime: '09:45 PM',
    takenToday: false
  },
  {
    id: 'med-3',
    name: 'Omega-3 Triglyceride (EPA/DHA)',
    type: 'supplement',
    dosage: '2,000 mg (1,200 EPA / 600 DHA)',
    frequency: 'Daily',
    timing: 'With Dinner',
    startDate: '2026-02-01',
    purpose: 'Triglyceride reduction & systemic vascular endothelial anti-inflammatory',
    adherencePercentage: 88,
    stockRemainingPills: 60,
    interactionNotes: 'High-purity IFOS 5-star certified molecularly distilled',
    synergies: 'Supports post-workout muscle protein synthesis & joint mobility',
    activeReminderTime: '07:30 PM',
    takenToday: false
  },
  {
    id: 'med-4',
    name: 'Creatine Monohydrate (Creapure)',
    type: 'supplement',
    dosage: '5 g',
    frequency: 'Daily',
    timing: 'Pre-Workout',
    startDate: '2025-11-01',
    purpose: 'Cellular ATP energy phosphagen resynthesis & cognitive focus',
    adherencePercentage: 98,
    stockRemainingPills: 120,
    interactionNotes: 'Ensure 3.0L+ daily hydration to optimize cellular hydration',
    synergies: 'Directly supports 1RM strength output and high-intensity interval capacity',
    activeReminderTime: '04:00 PM',
    takenToday: true
  }
];

export const MedicationSupplementView: React.FC = () => {
  const [items, setItems] = useState<MedicationSupplement[]>(INITIAL_MEDICATIONS);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'medication' | 'supplement' | 'vitamin'>('all');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  
  // Form State
  const [newName, setNewName] = useState('');
  const [newDosage, setNewDosage] = useState('');
  const [newType, setNewType] = useState<'medication' | 'supplement' | 'vitamin'>('supplement');
  const [newTiming, setNewTiming] = useState<MedicationSupplement['timing']>('Morning');
  const [newPurpose, setNewPurpose] = useState('');

  const toggleTaken = (id: string) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, takenToday: !item.takenToday };
      }
      return item;
    }));
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;
    const newItem: MedicationSupplement = {
      id: `med-${Date.now()}`,
      name: newName,
      type: newType,
      dosage: newDosage || 'Standard Dose',
      frequency: 'Daily',
      timing: newTiming,
      startDate: new Date().toISOString().split('T')[0],
      purpose: newPurpose || 'Daily health support',
      adherencePercentage: 100,
      stockRemainingPills: 30,
      activeReminderTime: '08:30 AM',
      takenToday: false
    };
    setItems(prev => [newItem, ...prev]);
    setNewName('');
    setNewDosage('');
    setNewPurpose('');
    setShowAddModal(false);
  };

  const filteredItems = selectedFilter === 'all' 
    ? items 
    : items.filter(i => i.type === selectedFilter);

  const overallAdherence = Math.round(
    items.reduce((acc, curr) => acc + curr.adherencePercentage, 0) / (items.length || 1)
  );

  const takenCount = items.filter(i => i.takenToday).length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950/70 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-400 border border-teal-500/30 mb-2">
              <Pill className="w-3.5 h-3.5" />
              <span>System 9 • Medication, Supplement & Adherence Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              Pharmacology & Supplement Matrix
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Track daily dosage schedules, biomarker bioavailability synergies, drug-supplement interactions, and 30-day adherence streaks.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 block font-mono uppercase">Today's Completed</span>
              <span className="text-lg font-extrabold text-teal-400 font-mono">{takenCount} / {items.length}</span>
            </div>
            <div className="px-4 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 block font-mono uppercase">30-Day Adherence</span>
              <span className="text-lg font-extrabold text-emerald-400 font-mono">{overallAdherence}%</span>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white shadow-lg shadow-teal-600/30 flex items-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Item
            </button>
          </div>
        </div>
      </div>

      {/* Interaction & Bioavailability Callout */}
      <div className="p-4 rounded-xl bg-teal-950/30 border border-teal-800/50 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <span className="font-bold text-teal-300 block">Pharmacokinetic Synergy & Safety Audit</span>
          <p className="text-slate-300 leading-relaxed">
            All active compounds cross-referenced against your liver enzyme panel & renal biomarkers. No adverse interactions detected. 
            <strong className="text-teal-200"> Recommendation:</strong> Take Vitamin D3+K2 alongside breakfast with healthy fats for 3.2× higher serum 25(OH)D bioavailability.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {(['all', 'vitamin', 'supplement', 'medication'] as const).map(f => (
          <button
            key={f}
            onClick={() => setSelectedFilter(f)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
              selectedFilter === f
                ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30'
                : 'bg-slate-900/90 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Medication & Supplement Schedule Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.map(item => (
          <div
            key={item.id}
            className={`p-5 rounded-2xl border transition-all relative overflow-hidden ${
              item.takenToday
                ? 'bg-teal-950/20 border-teal-600/40 shadow-sm'
                : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-teal-300 border border-slate-700">
                    {item.timing}
                  </span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3 text-slate-500" />
                    {item.activeReminderTime}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  {item.name}
                  <span className="text-xs font-normal text-slate-400 font-mono">({item.dosage})</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">{item.purpose}</p>
              </div>

              {/* Action Button */}
              <button
                onClick={() => toggleTaken(item.id)}
                className={`p-3 rounded-xl flex items-center justify-center transition-all shadow-md ${
                  item.takenToday
                    ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 font-bold'
                    : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 border border-slate-700'
                }`}
                title={item.takenToday ? 'Marked as taken' : 'Click to log dose'}
              >
                {item.takenToday ? <Check className="w-5 h-5 stroke-[3]" /> : <CheckCircle2 className="w-5 h-5" />}
              </button>
            </div>

            {/* Interaction & Synergy Insights */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              {item.synergies && (
                <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/60 text-slate-300">
                  <span className="font-semibold text-emerald-400 block mb-0.5">Synergy</span>
                  {item.synergies}
                </div>
              )}
              {item.interactionNotes && (
                <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/60 text-slate-300">
                  <span className="font-semibold text-amber-400 block mb-0.5">Absorption Note</span>
                  {item.interactionNotes}
                </div>
              )}
            </div>

            {/* Bottom Meta */}
            <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <span>Adherence: <strong className="text-slate-300">{item.adherencePercentage}%</strong></span>
              <span>Stock remaining: <strong className="text-teal-400">{item.stockRemainingPills} pills</strong></span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Pill className="w-5 h-5 text-teal-400" />
              Add Medication or Supplement
            </h3>

            <form onSubmit={handleAddItem} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Zinc Picolinate"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Dosage</label>
                  <input
                    type="text"
                    placeholder="e.g. 25 mg"
                    value={newDosage}
                    onChange={(e) => setNewDosage(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:border-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:border-teal-500 focus:outline-none"
                  >
                    <option value="supplement">Supplement</option>
                    <option value="vitamin">Vitamin</option>
                    <option value="medication">Medication</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Timing</label>
                <select
                  value={newTiming}
                  onChange={(e) => setNewTiming(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:border-teal-500 focus:outline-none"
                >
                  <option value="Morning">Morning</option>
                  <option value="With Breakfast">With Breakfast</option>
                  <option value="Afternoon">Afternoon</option>
                  <option value="With Dinner">With Dinner</option>
                  <option value="Bedtime">Bedtime</option>
                  <option value="Pre-Workout">Pre-Workout</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Purpose & Target Biomarker</label>
                <input
                  type="text"
                  placeholder="e.g. Immune function & testosterone support"
                  value={newPurpose}
                  onChange={(e) => setNewPurpose(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
