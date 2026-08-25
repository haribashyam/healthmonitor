import React, { useState } from 'react';
import {
  Activity,
  Flame,
  Snowflake,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  Plus,
  Play,
  Layers,
  ChevronRight,
  Info
} from 'lucide-react';
import { InjuryRecord, RecoveryToolSession } from '../types';

const INITIAL_INJURIES: InjuryRecord[] = [
  {
    id: 'inj-1',
    bodyRegion: 'Left Knee',
    title: 'Patellar Tendon Overuse Strain',
    dateReported: '2026-08-12',
    painLevel: 3,
    severity: 'Mild Strain',
    recoveryStage: 'Strengthening',
    restrictedExercises: ['Heavy Barbell Back Squats (>80% 1RM)', 'Box Jumps & Plyometrics', 'Downhill Hill Sprints'],
    allowedSubstitutions: ['Belt Squat Machine', 'Spanish Squats (Isometric Band Hold)', 'Leg Press (Mid-Foot Placement)'],
    rehabProtocols: ['Poliquin Step-Downs (3 × 15 reps)', 'Isometric Quad Wall Sits (4 × 45s)', 'VMO Foam Rolling'],
    notes: 'Knee shear force minimized during isometrics. Pain down from 6/10 to 3/10.'
  },
  {
    id: 'inj-2',
    bodyRegion: 'Lower Back',
    title: 'Erector Spinae Myofascial Tightness',
    dateReported: '2026-08-04',
    painLevel: 2,
    severity: 'Mild Strain',
    recoveryStage: 'Full Return',
    restrictedExercises: ['Conventional Heavy Deadlifts from Floor'],
    allowedSubstitutions: ['Trap Bar Deadlift (High Handles)', 'Chest-Supported Row'],
    rehabProtocols: ['McGill Big 3 (Bird-Dog, Side Plank, Curl-Up)', 'Cat-Cow Mobility'],
    notes: 'Nearly resolved. Core stiffness exercises maintain pelvic neutrality.'
  }
];

const INITIAL_RECOVERY_SESSIONS: RecoveryToolSession[] = [
  {
    id: 'rec-1',
    toolType: 'Sauna',
    durationMinutes: 20,
    intensityOrTemp: '85°C (185°F)',
    date: '2026-08-24',
    subjectivePerceivedBenefit: 9
  },
  {
    id: 'rec-2',
    toolType: 'Cold Plunge',
    durationMinutes: 4,
    intensityOrTemp: '10°C (50°F)',
    date: '2026-08-23',
    subjectivePerceivedBenefit: 8
  },
  {
    id: 'rec-3',
    toolType: 'Compression Boots',
    durationMinutes: 30,
    intensityOrTemp: 'Zone 4 (120 mmHg)',
    date: '2026-08-22',
    subjectivePerceivedBenefit: 9
  }
];

export const InjuryMobilityRecoveryView: React.FC = () => {
  const [injuries, setInjuries] = useState<InjuryRecord[]>(INITIAL_INJURIES);
  const [recoverySessions, setRecoverySessions] = useState<RecoveryToolSession[]>(INITIAL_RECOVERY_SESSIONS);
  const [selectedInjury, setSelectedInjury] = useState<InjuryRecord>(INITIAL_INJURIES[0]);
  const [activeTab, setActiveTab] = useState<'injury' | 'recovery-tools' | 'mobility'>('injury');

  const bodyRegions = [
    { name: 'Left Knee', active: true, pain: 3 },
    { name: 'Lower Back', active: true, pain: 2 },
    { name: 'Right Shoulder', active: false, pain: 0 },
    { name: 'Left Shoulder', active: false, pain: 0 },
    { name: 'Right Knee', active: false, pain: 0 },
    { name: 'Neck', active: false, pain: 0 },
    { name: 'Right Ankle', active: false, pain: 0 }
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/70 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Systems 50-52 • Injury Tracking, Mobility & Thermal Recovery Tools</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              Injury & Active Recovery Hub
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Maps anatomical joint restrictions, dynamically substitutes contraindicated exercises, and logs sauna, cold plunge, and mobility routines.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 block font-mono uppercase">Active Restrictions</span>
              <span className="text-lg font-extrabold text-amber-400 font-mono">2 Logged</span>
            </div>
            <div className="px-4 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 block font-mono uppercase">Recovery Sessions</span>
              <span className="text-lg font-extrabold text-emerald-400 font-mono">{recoverySessions.length} This Week</span>
            </div>
          </div>
        </div>
      </div>

      {/* Subtabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('injury')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'injury'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Activity className="w-4 h-4" />
          Anatomical Injury Map & Restrictions
        </button>

        <button
          onClick={() => setActiveTab('recovery-tools')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'recovery-tools'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Flame className="w-4 h-4" />
          Thermal & Recovery Tools (Sauna / Cold)
        </button>

        <button
          onClick={() => setActiveTab('mobility')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'mobility'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <RotateCcw className="w-4 h-4" />
          Guided Mobility & ROM Flows
        </button>
      </div>

      {/* TAB 1: Anatomical Injury Map & Contraindications */}
      {activeTab === 'injury' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Anatomical Regions Grid (4 Cols) */}
          <div className="lg:col-span-4 p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              Body Joint Regions
            </h3>

            <div className="space-y-2">
              {bodyRegions.map((reg, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    const match = injuries.find(i => i.bodyRegion === reg.name);
                    if (match) setSelectedInjury(match);
                  }}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    reg.active
                      ? selectedInjury.bodyRegion === reg.name
                        ? 'bg-emerald-950/40 border-emerald-500/50 shadow-md shadow-emerald-500/10'
                        : 'bg-amber-950/20 border-amber-500/30 text-slate-200'
                      : 'bg-slate-950/60 border-slate-800 text-slate-500'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${reg.active ? 'bg-amber-400 animate-pulse' : 'bg-slate-700'}`} />
                    <span className="text-xs font-bold">{reg.name}</span>
                  </div>

                  {reg.active ? (
                    <span className="text-[11px] font-mono font-bold text-amber-400">
                      Pain: {reg.pain}/10
                    </span>
                  ) : (
                    <span className="text-[10px] text-emerald-500/80 font-mono">100% Clear</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Injury Detail & Automated Workout Substitutions (8 Cols) */}
          <div className="lg:col-span-8 p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {selectedInjury.bodyRegion}
                  </span>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300">
                    Stage: {selectedInjury.recoveryStage}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mt-1.5">{selectedInjury.title}</h3>
                <span className="text-xs text-slate-400 font-mono">Logged: {selectedInjury.dateReported} • Current Pain: {selectedInjury.painLevel}/10</span>
              </div>
            </div>

            {/* Restricted Exercises Warning */}
            <div className="p-4 rounded-xl bg-red-950/20 border border-red-800/40 space-y-2">
              <span className="text-xs font-bold text-red-300 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                Automated Workout Engine Contraindications (Strictly Flagged)
              </span>
              <ul className="list-disc list-inside space-y-1 text-xs text-red-200">
                {selectedInjury.restrictedExercises.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>

            {/* Allowed Biomechanical Substitutions */}
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/40 space-y-2">
              <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                <RotateCcw className="w-4 h-4 text-emerald-400" />
                Auto-Injected Safe Exercise Substitutions
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedInjury.allowedSubstitutions.map((sub, i) => (
                  <div key={i} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-emerald-200 font-medium">
                    ✓ {sub}
                  </div>
                ))}
              </div>
            </div>

            {/* Rehab Protocols */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <span className="text-xs font-bold text-slate-300 block">Daily Physical Therapy & Rehab Routine</span>
              <div className="space-y-1.5">
                {selectedInjury.rehabProtocols.map((p, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>{p}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: Recovery Tools (Sauna & Cold Plunge) */}
      {activeTab === 'recovery-tools' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {recoverySessions.map(session => (
            <div key={session.id} className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-800 text-emerald-300 border border-slate-700">
                  {session.toolType}
                </span>
                <span className="text-xs font-mono text-slate-400">{session.date}</span>
              </div>
              <div className="text-2xl font-bold font-mono text-white">
                {session.durationMinutes} <span className="text-xs font-normal text-slate-400">mins</span>
              </div>
              <div className="text-xs text-slate-400">
                Exposure: <strong className="text-white font-mono">{session.intensityOrTemp}</strong>
              </div>
              <div className="text-xs text-emerald-400 font-medium">
                Perceived Recovery Score: {session.subjectivePerceivedBenefit}/10
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: Guided Mobility */}
      {activeTab === 'mobility' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md space-y-2">
            <h4 className="text-sm font-bold text-white">10-Min Thoracic Spine & Shoulder Opening</h4>
            <p className="text-xs text-slate-400">
              Improves overhead reach mobility, scapular upward rotation, and rib cage expansion for optimal breathing dynamics.
            </p>
            <button className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white mt-2 flex items-center gap-2">
              <Play className="w-3.5 h-3.5 fill-current" />
              Start Mobility Flow
            </button>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md space-y-2">
            <h4 className="text-sm font-bold text-white">12-Min 90/90 Hip Capsule & Ankle Dorsiflexion</h4>
            <p className="text-xs text-slate-400">
              Restores deep hip internal/external rotation and clears anterior ankle impingement before squats and running.
            </p>
            <button className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white mt-2 flex items-center gap-2">
              <Play className="w-3.5 h-3.5 fill-current" />
              Start Hip Flow
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
