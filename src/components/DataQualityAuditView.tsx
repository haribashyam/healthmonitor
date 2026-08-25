import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  GitMerge,
  Cpu,
  Layers,
  Database,
  CheckCircle2,
  Sparkles,
  RotateCcw,
  Activity,
  Zap,
  Info
} from 'lucide-react';
import { DataQualityMetric, DeviceConflictRecord } from '../types';

const INITIAL_CONFLICTS: DeviceConflictRecord[] = [
  {
    id: 'conf-1',
    timestamp: '2026-08-25 07:42 AM',
    metricName: 'Peak Interval Heart Rate',
    deviceA: { name: 'Apple Watch Series 9 (Wrist PPG)', value: 142, confidenceScore: 82 },
    deviceB: { name: 'Polar H10 Chest Strap (ECG)', value: 157, confidenceScore: 99 },
    resolvedValue: 157,
    chosenSource: 'Polar H10 Chest Strap (ECG)',
    resolutionReason: 'ECG chest strap exhibits 99.4% gold-standard signal-to-noise ratio during rapid cadence arm swing motion artifacts.',
    status: 'auto_resolved'
  },
  {
    id: 'conf-2',
    timestamp: '2026-08-24 11:15 PM',
    metricName: 'Nocturnal Sleep Onset',
    deviceA: { name: 'Oura Ring Gen 3 (Finger PPG)', value: '10:48 PM', confidenceScore: 94 },
    deviceB: { name: 'Apple Watch Series 9 (Accelerometry)', value: '11:05 PM', confidenceScore: 84 },
    resolvedValue: '10:48 PM',
    chosenSource: 'Oura Ring Gen 3 (Finger PPG)',
    resolutionReason: 'Digital artery pulse amplitude and finger temperature nadir detect autonomic sleep onset 17 minutes earlier than wrist motion sensors.',
    status: 'auto_resolved'
  },
  {
    id: 'conf-3',
    timestamp: '2026-08-23 06:15 AM',
    metricName: 'Resting HRV (rMSSD)',
    deviceA: { name: 'Whoop 4.0 (Wrist PPG)', value: 62, confidenceScore: 88 },
    deviceB: { name: 'Oura Ring Gen 3 (Finger PPG)', value: 68, confidenceScore: 92 },
    resolvedValue: 65,
    chosenSource: 'Weighted Bayesian Composite (Oura 60% + Whoop 40%)',
    resolutionReason: 'Both devices demonstrated clean nocturnal signal stability; reconciled via weighted Bayesian kalman filter.',
    status: 'auto_resolved'
  }
];

const DATA_QUALITY_STATS: DataQualityMetric[] = [
  {
    source: 'Polar H10 (Bluetooth ECG)',
    metricCategory: 'Cardiac Vitals (HR, ECG, R-R intervals)',
    samplingFrequency: '1000 Hz',
    missingDataPercentage: 0.1,
    anomalyCount: 0,
    trustScore: 99.8
  },
  {
    source: 'Oura Ring Gen 3',
    metricCategory: 'Sleep Architecture, HRV, Skin Temp',
    samplingFrequency: '250 Hz (Nocturnal)',
    missingDataPercentage: 0.8,
    anomalyCount: 1,
    trustScore: 96.4
  },
  {
    source: 'Apple Watch Ultra 2',
    metricCategory: 'All-Day Activity, Steps, GPS, Active HR',
    samplingFrequency: 'Variable 1-5 Hz',
    missingDataPercentage: 2.1,
    anomalyCount: 3,
    trustScore: 93.2
  },
  {
    source: 'Withings Body Scan Smart Scale',
    metricCategory: 'Body Composition, Segmental Fat, PWV',
    samplingFrequency: 'Daily Spot Measurement',
    missingDataPercentage: 0.0,
    anomalyCount: 0,
    trustScore: 98.0
  }
];

export const DataQualityAuditView: React.FC = () => {
  const [conflicts] = useState<DeviceConflictRecord[]>(INITIAL_CONFLICTS);
  const [qualityStats] = useState<DataQualityMetric[]>(DATA_QUALITY_STATS);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/70 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Systems 29, 30 & 31 • Universal Data Quality, Multi-Source Reconciliation & Imputation</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              Data Quality & Device Reconciliation
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Deterministic multi-device conflict resolution engine. Cross-validates simultaneous sensor telemetry, filters optical PPG motion artifacts, and maintains a strict data provenance audit log.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 block font-mono uppercase">System Integrity</span>
              <span className="text-lg font-extrabold text-emerald-400 font-mono">98.6%</span>
            </div>
            <div className="px-4 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 block font-mono uppercase">Auto-Reconciled</span>
              <span className="text-lg font-extrabold text-indigo-400 font-mono">100% (3/3)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Device Provenance & Trust Scores Table */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-indigo-400" />
            Connected Sensor Trust & Sampling Hierarchy
          </h3>
          <span className="text-xs text-slate-400">Bayesian Kalman Weighting Active</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-sans">
                <th className="py-3 px-3">Device / Data Source</th>
                <th className="py-3 px-3">Primary Domain</th>
                <th className="py-3 px-3">Sampling Rate</th>
                <th className="py-3 px-3">Missing Data Gap</th>
                <th className="py-3 px-3">Artifacts Flagged</th>
                <th className="py-3 px-3">Provenance Trust Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {qualityStats.map((stat, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-3 font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    {stat.source}
                  </td>
                  <td className="py-3 px-3 text-slate-400 font-sans">{stat.metricCategory}</td>
                  <td className="py-3 px-3 text-cyan-400">{stat.samplingFrequency}</td>
                  <td className="py-3 px-3">{stat.missingDataPercentage}%</td>
                  <td className="py-3 px-3 text-amber-400">{stat.anomalyCount}</td>
                  <td className="py-3 px-3 text-emerald-400 font-bold">{stat.trustScore}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Multi-Device Conflict Resolution Log */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <GitMerge className="w-4 h-4 text-indigo-400" />
          Multi-Device Conflict Resolution Log ({conflicts.length} Events Reconciled)
        </h3>

        <div className="space-y-3">
          {conflicts.map(conf => (
            <div key={conf.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {conf.metricName}
                  </span>
                  <span className="text-xs font-bold text-white font-mono">{conf.timestamp}</span>
                </div>
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Auto-Reconciled
                </span>
              </div>

              {/* Devices Discrepancy Display */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block mb-1">{conf.deviceA.name}</span>
                  <div className="text-base font-bold font-mono text-white">
                    {String(conf.deviceA.value)} <span className="text-[11px] font-normal text-slate-400">(Conf: {conf.deviceA.confidenceScore}%)</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block mb-1">{conf.deviceB.name}</span>
                  <div className="text-base font-bold font-mono text-white">
                    {String(conf.deviceB.value)} <span className="text-[11px] font-normal text-slate-400">(Conf: {conf.deviceB.confidenceScore}%)</span>
                  </div>
                </div>
              </div>

              {/* Resolution Verdict */}
              <div className="p-3 rounded-lg bg-indigo-950/20 border border-indigo-800/30 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-indigo-300">Resolved Value: <strong className="text-white font-mono">{String(conf.resolvedValue)}</strong></span>
                  <span className="text-[11px] text-indigo-400 font-mono">Selected: {conf.chosenSource}</span>
                </div>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  {conf.resolutionReason}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
