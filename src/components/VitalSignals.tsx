import React, { useState } from 'react';
import {
  Heart,
  Moon,
  Activity,
  Flame,
  ShieldCheck,
  Zap,
  TrendingUp,
  Radio,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { SleepRecord, Activity as ActivityType, Biomarker } from '../types';

interface VitalSignalsProps {
  liveBpm: number;
  latestSleep?: SleepRecord;
  activities?: ActivityType[];
  biomarkers?: Biomarker[];
  bleDeviceName: string;
  onNavigateTab: (tab: string) => void;
  onOpenLiveWorkout?: () => void;
}

export const VitalSignals: React.FC<VitalSignalsProps> = ({
  liveBpm,
  latestSleep,
  activities = [],
  biomarkers = [],
  bleDeviceName,
  onNavigateTab,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'cardio' | 'recovery' | 'metabolic' | 'blood'>('all');

  const sleepData = latestSleep || {
    restingHr: 59,
    hrvAvg: 64,
    sleepScore: 88,
    totalMinutes: 462,
    deepMinutes: 94,
    remMinutes: 112,
    efficiency: 93
  };

  const signalCards = [
    {
      id: 'rhr',
      title: 'Resting Heart Rate',
      value: `${sleepData.restingHr}`,
      unit: 'BPM',
      subtext: `Live: ${liveBpm} BPM`,
      status: 'OPTIMAL BASELINE',
      trendText: '-2 BPM vs 7d avg',
      device: bleDeviceName || 'Apple Watch Ultra 2',
      category: 'cardio',
      icon: Heart,
      sparkline: 'M0,25 Q15,10 30,22 T60,15 T90,20 T120,8 T150,18 T180,12 T200,10',
      range: '48 - 62 BPM (Clinical Norm)'
    },
    {
      id: 'hrv',
      title: 'Heart Rate Variability',
      value: `${sleepData.hrvAvg}`,
      unit: 'MS',
      subtext: 'RMSSD Autonomic Tone',
      status: 'PARASYMPATHETIC SURGE',
      trendText: '+5% vs baseline',
      device: 'Oura Ring Gen3',
      category: 'recovery',
      icon: Activity,
      sparkline: 'M0,30 Q20,35 40,20 T80,15 T120,10 T160,8 T200,5',
      range: '52 - 78 ms (Athlete Range)'
    },
    {
      id: 'bp',
      title: 'Blood Pressure',
      value: '116/74',
      unit: 'MMHG',
      subtext: 'Mean Arterial: 88 mmHg',
      status: 'NORMOTENSIVE',
      trendText: 'Optimal vascular tone',
      device: 'Withings BPM Core',
      category: 'cardio',
      icon: ShieldCheck,
      sparkline: 'M0,18 Q30,15 60,20 T120,17 T160,19 T200,18',
      range: '< 120/80 mmHg (AHA Guideline)'
    },
    {
      id: 'sleep',
      title: 'Sleep Architecture',
      value: `${Math.floor(sleepData.totalMinutes / 60)}h ${sleepData.totalMinutes % 60}m`,
      unit: '',
      subtext: `Deep: ${sleepData.deepMinutes}m • REM: ${sleepData.remMinutes}m`,
      status: `SCORE ${sleepData.sleepScore}/100`,
      trendText: 'Restorative phase +18m',
      device: 'Oura Ring Gen3',
      category: 'recovery',
      icon: Moon,
      sparkline: 'M0,28 Q25,32 50,15 T100,20 T150,10 T200,8',
      range: '7.0 - 9.0 hrs / night'
    },
    {
      id: 'cgm',
      title: 'Interstitial Glucose',
      value: '94',
      unit: 'MG/DL',
      subtext: '96% Time in Target (70-120)',
      status: 'OPTIMAL GLYCEMIC',
      trendText: 'GMI Est. HbA1c: 5.1%',
      device: 'Dexcom G7 CGM',
      category: 'metabolic',
      icon: Flame,
      sparkline: 'M0,20 Q20,12 40,22 T80,18 T120,15 T160,24 T200,19',
      range: '70 - 99 mg/dL Fasting'
    },
    {
      id: 'vo2',
      title: 'Cardiorespiratory Fitness',
      value: '48.6',
      unit: 'ML/KG',
      subtext: 'Superior Aerobic Tier (Top 10%)',
      status: 'PEAK TIER',
      trendText: '+1.2 over 90 days',
      device: 'Garmin Forerunner 965',
      category: 'cardio',
      icon: TrendingUp,
      sparkline: 'M0,32 Q30,28 60,25 T120,20 T160,15 T200,10',
      range: 'Age-Adjusted: 44.0 - 52.0'
    },
    {
      id: 'crp',
      title: 'High-Sensitivity CRP',
      value: '0.74',
      unit: 'MG/L',
      subtext: 'Systemic Inflammation Index',
      status: 'LOW RISK TIER',
      trendText: '-0.32 vs prior lab',
      device: 'Quest Diagnostics (OCR)',
      category: 'blood',
      icon: Sparkles,
      sparkline: 'M0,10 Q40,15 80,22 T140,26 T200,30',
      range: '< 1.0 mg/L (Low Risk)'
    },
    {
      id: 'trimp',
      title: 'Daily Training Volume',
      value: '11,420',
      unit: 'STEPS',
      subtext: 'TRIMP Strain: 148 • 2,410 kcal',
      status: '114% OF TARGET',
      trendText: 'Zone 2 Base: 42 mins',
      device: 'Apple Watch + Strava',
      category: 'metabolic',
      icon: Zap,
      sparkline: 'M0,35 Q20,30 40,25 T80,18 T120,12 T160,8 T200,5',
      range: '10,000 Step Benchmark'
    }
  ];

  const filteredCards = signalCards.filter((c) => {
    if (selectedFilter === 'all') return true;
    return c.category === selectedFilter;
  });

  return (
    <div className="space-y-4 select-none">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#262626] pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-white text-[#111111] px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest">
              TELEMETRY DESK
            </span>
            <h3 className="text-xl sm:text-2xl font-serif font-black uppercase text-white tracking-tight">
              CONTINUOUS VITAL SIGNALS
            </h3>
          </div>
          <p className="text-xs font-mono text-[#888888] mt-0.5">
            Real-time biometric telemetric readings synchronized across 5 wearable nodes and clinical laboratory OCR dispatches.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center border border-[#333333] text-xs font-mono bg-[#141414]">
          {[
            { id: 'all', label: 'ALL SIGNALS' },
            { id: 'cardio', label: 'CARDIO' },
            { id: 'recovery', label: 'RECOVERY' },
            { id: 'metabolic', label: 'METABOLIC' },
            { id: 'blood', label: 'BLOOD LABS' }
          ].map((f, idx) => (
            <button
              key={f.id}
              onClick={() => setSelectedFilter(f.id as any)}
              className={`px-3 py-1.5 font-bold uppercase transition-colors ${idx !== 0 ? 'border-l border-[#333333]' : ''} ${
                selectedFilter === f.id
                  ? 'bg-white text-[#111111]'
                  : 'bg-transparent text-[#888888] hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4-Column Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border border-[#262626] bg-[#141414] divide-y sm:divide-y-0 sm:divide-x divide-[#262626]">
        {filteredCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              onClick={() => onNavigateTab('vitals')}
              className={`p-5 flex flex-col justify-between space-y-4 hover:bg-[#1A1A1A] transition-colors cursor-pointer group ${
                idx >= 4 ? 'border-t sm:border-t border-[#262626]' : ''
              }`}
            >
              {/* Header inside Card */}
              <div className="flex items-start justify-between gap-2 border-b border-[#222222] pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 border border-[#333333] flex items-center justify-center bg-[#1A1A1A] text-white group-hover:bg-white group-hover:text-black transition-colors">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-mono text-[9px] uppercase font-bold text-[#666666] block">
                      FIG. 1.{idx + 1}
                    </span>
                    <h4 className="font-serif font-bold text-sm text-white leading-tight">
                      {card.title}
                    </h4>
                  </div>
                </div>

                <span className="px-1.5 py-0.5 bg-[#1E1E1E] border border-[#333333] text-[9px] font-mono font-bold uppercase text-[#AAAAAA]">
                  {card.category}
                </span>
              </div>

              {/* Central Value */}
              <div>
                <div className="flex items-baseline gap-1.5 font-mono">
                  <span className="text-3xl sm:text-4xl font-black font-serif tracking-tight text-white">
                    {card.value}
                  </span>
                  <span className="text-xs font-bold text-[#888888] uppercase">
                    {card.unit}
                  </span>
                </div>
                <p className="text-[11px] font-mono text-[#888888] mt-0.5 truncate">
                  {card.subtext}
                </p>
              </div>

              {/* Sparkline Graphic */}
              <div className="h-10 w-full border-t border-b border-[#222222] py-1 bg-[#101010]">
                <svg className="w-full h-full" viewBox="0 0 200 40" preserveAspectRatio="none">
                  <path
                    d={card.sparkline}
                    fill="none"
                    stroke="#888888"
                    strokeWidth="1.75"
                  />
                  <circle cx="200" cy="10" r="3" fill="#CC0000" />
                </svg>
              </div>

              {/* Footer Meta */}
              <div className="pt-1 text-[10px] font-mono flex items-center justify-between text-[#777777]">
                <span className="truncate max-w-[120px]">
                  SRC: {card.device.toUpperCase()}
                </span>
                <span className="font-bold text-[#CC0000] flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                  EXPLORE <ChevronRight className="w-3 h-3" />
                </span>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
