import React, { useState } from 'react';
import {
  Activity,
  Droplets,
  Scale,
  TrendingDown,
  TrendingUp,
  Sparkles,
  Zap,
  ShieldCheck,
  Calendar,
  Layers,
  ChevronRight,
  Info,
  Clock
} from 'lucide-react';
import { BodyCompositionData, MetabolicGlucosePoint } from '../types';

const INITIAL_BODY_DATA: BodyCompositionData[] = [
  {
    date: '2026-08-20',
    weightKg: 76.4,
    bmi: 23.1,
    bodyFatPercent: 13.8,
    skeletalMuscleKg: 37.2,
    bodyWaterPercent: 61.4,
    boneMassKg: 3.4,
    visceralFatRating: 4,
    waistCircumferenceCm: 79.5,
    source: 'DEXA Scan • Hologic Horizon A'
  },
  {
    date: '2026-07-20',
    weightKg: 77.8,
    bmi: 23.5,
    bodyFatPercent: 15.2,
    skeletalMuscleKg: 36.5,
    bodyWaterPercent: 60.2,
    boneMassKg: 3.4,
    visceralFatRating: 5,
    waistCircumferenceCm: 81.0,
    source: 'InBody 770 Multi-Frequency'
  },
  {
    date: '2026-06-20',
    weightKg: 79.1,
    bmi: 23.9,
    bodyFatPercent: 16.5,
    skeletalMuscleKg: 36.0,
    bodyWaterPercent: 59.5,
    boneMassKg: 3.3,
    visceralFatRating: 6,
    waistCircumferenceCm: 82.5,
    source: 'Withings Body Scan Smart Scale'
  }
];

const CGM_HOURLY_CURVE: MetabolicGlucosePoint[] = [
  { timestamp: '06:00 AM', glucoseMgDl: 84, mealTag: 'Fasting Baseline' },
  { timestamp: '07:30 AM', glucoseMgDl: 88 },
  { timestamp: '08:15 AM', glucoseMgDl: 122, isPostprandial: true, mealTag: 'Breakfast: Oats, Chia & Whey' },
  { timestamp: '09:30 AM', glucoseMgDl: 104 },
  { timestamp: '11:00 AM', glucoseMgDl: 91 },
  { timestamp: '12:30 PM', glucoseMgDl: 89 },
  { timestamp: '01:15 PM', glucoseMgDl: 128, isPostprandial: true, mealTag: 'Lunch: Grilled Salmon & Quinoa' },
  { timestamp: '02:30 PM', glucoseMgDl: 98, mealTag: '15-min Post-Meal Zone 2 Walk' },
  { timestamp: '04:00 PM', glucoseMgDl: 92 },
  { timestamp: '05:30 PM', glucoseMgDl: 86, mealTag: 'Pre-Workout Strength' },
  { timestamp: '07:00 PM', glucoseMgDl: 94 },
  { timestamp: '08:00 PM', glucoseMgDl: 118, isPostprandial: true, mealTag: 'Dinner: Palak Paneer & Dal' },
  { timestamp: '09:30 PM', glucoseMgDl: 93 },
  { timestamp: '11:00 PM', glucoseMgDl: 85, mealTag: 'Nocturnal Sleep Baseline' }
];

export const BodyMetabolicView: React.FC = () => {
  const [history] = useState<BodyCompositionData[]>(INITIAL_BODY_DATA);
  const [cgmData] = useState<MetabolicGlucosePoint[]>(CGM_HOURLY_CURVE);
  const [activeTab, setActiveTab] = useState<'dexa' | 'cgm' | 'lipids'>('dexa');

  const latest = history[0];
  const previous = history[1];

  const fatDelta = (latest.bodyFatPercent - previous.bodyFatPercent).toFixed(1);
  const muscleDelta = (latest.skeletalMuscleKg - previous.skeletalMuscleKg).toFixed(1);
  const weightDelta = (latest.weightKg - previous.weightKg).toFixed(1);

  // Time in Range (70 - 140 mg/dL)
  const inRangeCount = cgmData.filter(d => d.glucoseMgDl >= 70 && d.glucoseMgDl <= 140).length;
  const timeInRangePct = Math.round((inRangeCount / cgmData.length) * 100);
  const meanGlucose = Math.round(cgmData.reduce((acc, curr) => acc + curr.glucoseMgDl, 0) / cgmData.length);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-rose-950/70 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30 mb-2">
              <Scale className="w-3.5 h-3.5" />
              <span>Systems 10 & 11 • Body Composition & Metabolic Health Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              Metabolic & Body Trajectory
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Integrates multi-frequency DEXA scans, skeletal muscle accretion, continuous glucose monitoring (CGM), HOMA-IR insulin sensitivity, and lipid particle subfractions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 block font-mono uppercase">Body Fat %</span>
              <span className="text-lg font-extrabold text-emerald-400 font-mono">{latest.bodyFatPercent}%</span>
            </div>
            <div className="px-4 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 block font-mono uppercase">CGM Time-In-Range</span>
              <span className="text-lg font-extrabold text-rose-400 font-mono">{timeInRangePct}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Subtabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('dexa')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'dexa'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Scale className="w-4 h-4" />
          Body Composition & DEXA
        </button>

        <button
          onClick={() => setActiveTab('cgm')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'cgm'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Activity className="w-4 h-4" />
          Continuous Glucose (CGM)
        </button>

        <button
          onClick={() => setActiveTab('lipids')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'lipids'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Droplets className="w-4 h-4" />
          Metabolic Biomarkers & HOMA-IR
        </button>
      </div>

      {/* TAB 1: DEXA & Body Composition */}
      {activeTab === 'dexa' && (
        <div className="space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
              <span className="text-xs text-slate-400 block mb-1 font-medium">Total Mass</span>
              <div className="text-2xl font-bold font-mono text-white flex items-baseline gap-2">
                {latest.weightKg} <span className="text-xs font-normal text-slate-400">kg</span>
              </div>
              <span className="text-[11px] text-emerald-400 font-mono mt-1 block">
                {weightDelta} kg vs last month
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
              <span className="text-xs text-slate-400 block mb-1 font-medium">Body Fat %</span>
              <div className="text-2xl font-bold font-mono text-emerald-400 flex items-baseline gap-2">
                {latest.bodyFatPercent} <span className="text-xs font-normal text-slate-400">%</span>
              </div>
              <span className="text-[11px] text-emerald-400 font-mono mt-1 block">
                {fatDelta}% fat loss trajectory
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
              <span className="text-xs text-slate-400 block mb-1 font-medium">Skeletal Muscle</span>
              <div className="text-2xl font-bold font-mono text-cyan-400 flex items-baseline gap-2">
                {latest.skeletalMuscleKg} <span className="text-xs font-normal text-slate-400">kg</span>
              </div>
              <span className="text-[11px] text-cyan-400 font-mono mt-1 block">
                +{muscleDelta} kg lean mass gain
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
              <span className="text-xs text-slate-400 block mb-1 font-medium">Waist Circumference</span>
              <div className="text-2xl font-bold font-mono text-white flex items-baseline gap-2">
                {latest.waistCircumferenceCm} <span className="text-xs font-normal text-slate-400">cm</span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono mt-1 block">
                Waist-to-Height: 0.44 (Optimal)
              </span>
            </div>
          </div>

          {/* Historical Scans Table */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-rose-400" />
              Body Composition Trajectory (DEXA & Hydrostatic Multi-Month Ledger)
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-sans">
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3">Weight (kg)</th>
                    <th className="py-3 px-3">Body Fat %</th>
                    <th className="py-3 px-3">Skeletal Muscle</th>
                    <th className="py-3 px-3">Body Water %</th>
                    <th className="py-3 px-3">Visceral Rating</th>
                    <th className="py-3 px-3">Diagnostic Source</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {history.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-3 font-bold text-white">{row.date}</td>
                      <td className="py-3 px-3">{row.weightKg} kg</td>
                      <td className="py-3 px-3 text-emerald-400 font-bold">{row.bodyFatPercent}%</td>
                      <td className="py-3 px-3 text-cyan-400 font-bold">{row.skeletalMuscleKg} kg</td>
                      <td className="py-3 px-3">{row.bodyWaterPercent}%</td>
                      <td className="py-3 px-3">Level {row.visceralFatRating}</td>
                      <td className="py-3 px-3 text-slate-400 font-sans">{row.source}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Continuous Glucose Monitoring (CGM) */}
      {activeTab === 'cgm' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-rose-400" />
                  Live Interstitial Glucose Telemetry (CGM Sensor)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Target Range: 70 - 140 mg/dL • Mean daily glucose: {meanGlucose} mg/dL
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  {timeInRangePct}% Time-In-Range
                </span>
              </div>
            </div>

            {/* Glucose Sparkline & Points */}
            <div className="space-y-3 pt-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                {cgmData.map((pt, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-xl border text-xs ${
                      pt.isPostprandial 
                        ? 'bg-rose-950/20 border-rose-500/40 text-rose-200'
                        : 'bg-slate-950 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="text-[10px] text-slate-500 font-mono mb-1">{pt.timestamp}</div>
                    <div className="text-lg font-bold font-mono text-white">
                      {pt.glucoseMgDl} <span className="text-[10px] text-slate-400 font-normal">mg/dL</span>
                    </div>
                    {pt.mealTag && (
                      <div className="text-[10px] text-slate-400 mt-1 line-clamp-1" title={pt.mealTag}>
                        {pt.mealTag}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Metabolic Response Insight */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
              <span className="font-bold text-rose-300 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-rose-400" />
                Postprandial Glycemic Excursion Analysis
              </span>
              <p className="leading-relaxed">
                Following your 15-minute Zone 2 post-lunch walk at 02:30 PM, glucose returned from 128 mg/dL to 98 mg/dL in 45 minutes, demonstrating rapid GLUT-4 non-insulin-mediated glucose disposal.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Metabolic Biomarkers & HOMA-IR */}
      {activeTab === 'lipids' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md space-y-2">
              <span className="text-xs text-slate-400 block">HOMA-IR Insulin Sensitivity</span>
              <div className="text-2xl font-bold font-mono text-emerald-400">1.04</div>
              <span className="text-xs text-slate-400 block">Optimal (&lt; 1.5 indicates high insulin sensitivity)</span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md space-y-2">
              <span className="text-xs text-slate-400 block">HbA1c (Glycated Hemoglobin)</span>
              <div className="text-2xl font-bold font-mono text-emerald-400">5.2%</div>
              <span className="text-xs text-slate-400 block">Optimal (Ref: &lt; 5.7%)</span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md space-y-2">
              <span className="text-xs text-slate-400 block">ApoB (Apolipoprotein B)</span>
              <div className="text-2xl font-bold font-mono text-cyan-400">72 mg/dL</div>
              <span className="text-xs text-slate-400 block">Low Atherogenic Particle Burden (Ref: &lt; 80)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
