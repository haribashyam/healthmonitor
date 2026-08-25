import React from 'react';
import {
  Moon,
  Heart,
  TrendingUp,
  Clock,
  Sparkles,
  Zap,
  Activity,
  ShieldCheck
} from 'lucide-react';
import { SleepRecord } from '../types';

interface SleepAndRecoveryViewProps {
  sleepRecords: SleepRecord[];
}

export const SleepAndRecoveryView: React.FC<SleepAndRecoveryViewProps> = ({ sleepRecords }) => {
  const latest = sleepRecords[0] || {
    totalMinutes: 462,
    deepMinutes: 94,
    remMinutes: 112,
    lightMinutes: 224,
    awakeMinutes: 32,
    efficiency: 93,
    hrvAvg: 64,
    restingHr: 59,
    sleepScore: 88,
    readinessScore: 88,
    date: '2026-08-25',
    source: 'Oura Ring Gen3'
  };

  const avgHrv = Math.round(sleepRecords.reduce((acc, s) => acc + s.hrvAvg, 0) / (sleepRecords.length || 1));
  const avgRestingHr = Math.round(sleepRecords.reduce((acc, s) => acc + s.restingHr, 0) / (sleepRecords.length || 1));

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Moon className="w-5 h-5 text-indigo-400" />
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Sleep Architecture & Autonomic Recovery</h1>
          </div>
          <p className="text-xs text-slate-300">
            Overnight heart rate variability (RMSSD), circadian sleep stages, and parasympathetic restoration telemetry.
          </p>
        </div>

        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center gap-4 text-xs">
          <div>
            <span className="text-slate-400 block">7-Day Avg HRV</span>
            <span className="text-base font-bold text-emerald-400">{avgHrv} ms</span>
          </div>
          <div className="border-l border-slate-800 pl-4">
            <span className="text-slate-400 block">7-Day Avg RHR</span>
            <span className="text-base font-bold text-cyan-400">{avgRestingHr} BPM</span>
          </div>
        </div>
      </div>

      {/* Latest Night Spotlight */}
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Latest Overnight Session ({latest.date})</span>
            <h3 className="text-base font-bold text-white">Optimal Restoration & High Parasympathetic Activation</h3>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
            Readiness Score: {latest.readinessScore}/100
          </span>
        </div>

        {/* Stage Visualization Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-300">Total Duration: {Math.floor(latest.totalMinutes / 60)}h {latest.totalMinutes % 60}m</span>
            <span className="text-emerald-400">{latest.efficiency}% Efficiency</span>
          </div>

          <div className="w-full bg-slate-950 h-5 rounded-xl overflow-hidden flex p-0.5 border border-slate-800">
            <div
              className="bg-indigo-600 h-full rounded-l-lg"
              style={{ width: `${(latest.deepMinutes / latest.totalMinutes) * 100}%` }}
              title={`Deep Sleep ${latest.deepMinutes}m`}
            />
            <div
              className="bg-cyan-500 h-full"
              style={{ width: `${(latest.remMinutes / latest.totalMinutes) * 100}%` }}
              title={`REM Sleep ${latest.remMinutes}m`}
            />
            <div
              className="bg-blue-400 h-full"
              style={{ width: `${(latest.lightMinutes / latest.totalMinutes) * 100}%` }}
              title={`Light/Core Sleep ${latest.lightMinutes}m`}
            />
            <div
              className="bg-amber-400 h-full rounded-r-lg"
              style={{ width: `${(latest.awakeMinutes / latest.totalMinutes) * 100}%` }}
              title={`Awake ${latest.awakeMinutes}m`}
            />
          </div>

          {/* Stage Legend */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs">
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" /> Deep (Physical)
              </span>
              <strong className="text-white">{latest.deepMinutes}m</strong>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" /> REM (Cognitive)
              </span>
              <strong className="text-white">{latest.remMinutes}m</strong>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-400" /> Light Sleep
              </span>
              <strong className="text-white">{latest.lightMinutes}m</strong>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Awake Time
              </span>
              <strong className="text-white">{latest.awakeMinutes}m</strong>
            </div>
          </div>
        </div>

        {/* HRV and Resting HR Telemetry */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase">HRV (RMSSD)</span>
              <span className="text-xs font-bold text-emerald-400">+5% vs Baseline</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">{latest.hrvAvg}</span>
              <span className="text-xs text-slate-400">ms</span>
            </div>
            <p className="text-xs text-slate-300">
              High parasympathetic dominance. Autonomic nervous system is primed for high training adaptations.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase">Resting Heart Rate</span>
              <span className="text-xs font-bold text-cyan-400">Lowest Dip: 52 BPM</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">{latest.restingHr}</span>
              <span className="text-xs text-slate-400">BPM</span>
            </div>
            <p className="text-xs text-slate-300">
              RHR dropped early in the sleep cycle (02:15 AM), indicating rapid clearing of metabolic stress.
            </p>
          </div>
        </div>
      </div>

      {/* Historical Sleep Log */}
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white">Historical Sleep & HRV Records</h3>
        <div className="space-y-2.5">
          {sleepRecords.map((s, idx) => (
            <div key={idx} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-white block">{s.date}</span>
                <span className="text-[11px] text-slate-400">Duration: {Math.floor(s.totalMinutes / 60)}h {s.totalMinutes % 60}m • {s.source}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-slate-300">HRV: <strong className="text-emerald-400">{s.hrvAvg} ms</strong></span>
                <span className="text-slate-300">RHR: <strong className="text-cyan-400">{s.restingHr} BPM</strong></span>
                <span className="font-bold px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                  Score: {s.sleepScore}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
