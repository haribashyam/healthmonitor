import React, { useState } from 'react';
import {
  Heart,
  Moon,
  Flame,
  Clock,
  TrendingDown,
  TrendingUp,
  Minus,
  FileText,
  ChevronRight,
  Activity,
  Utensils,
  CircleCheck as CheckCircle2,
  Sparkles,
  ShieldCheck,
  Plus,
  ArrowUpRight,
  Filter
} from 'lucide-react';
import { Biomarker, LabReport, Activity as ActivityType, SleepRecord, NutritionDay, AdaptivePlan } from '../types';

interface HealthViewProps {
  biomarkers: Biomarker[];
  labReports: LabReport[];
  activities: ActivityType[];
  sleepRecords: SleepRecord[];
  nutritionDays: NutritionDay[];
  adaptivePlan: AdaptivePlan;
  onOpenDoctorReport: () => void;
  onOpenDataHub: () => void;
}

type SubTab = 'vitals' | 'sleep' | 'activity' | 'nutrition';

export const HealthView: React.FC<HealthViewProps> = ({
  biomarkers,
  labReports,
  activities,
  sleepRecords,
  nutritionDays,
  adaptivePlan,
  onOpenDoctorReport,
  onOpenDataHub
}) => {
  const [subTab, setSubTab] = useState<SubTab>('vitals');
  const [bioFilter, setBioFilter] = useState('all');

  const tabs: { id: SubTab; label: string; icon: any }[] = [
    { id: 'vitals', label: 'SECTION 1: CLINICAL VITALS & LABS', icon: Heart },
    { id: 'sleep', label: 'SECTION 2: SLEEP ARCHITECTURE', icon: Moon },
    { id: 'activity', label: 'SECTION 3: METABOLIC LOAD & ACTIVITY', icon: Activity },
    { id: 'nutrition', label: 'SECTION 4: MACRONUTRIENTS & FUEL', icon: Utensils },
  ];

  const categories = ['all', 'Cardiovascular', 'Metabolic', 'Lipids', 'Hormones', 'Inflammation', 'Vitamins'];
  const filteredBios = bioFilter === 'all' ? biomarkers : biomarkers.filter(b => b.category === bioFilter);

  const latestSleep = sleepRecords[0] || {
    totalMinutes: 462,
    deepMinutes: 94,
    remMinutes: 112,
    lightMinutes: 224,
    awakeMinutes: 32,
    efficiency: 93,
    hrvAvg: 64,
    restingHr: 59,
    sleepScore: 88,
    date: '2026-08-25',
    source: 'Oura Ring Gen3'
  };

  const totalDistance = activities.reduce((acc, a) => acc + (a.distanceKm || 0), 0);
  const totalCalories = activities.reduce((acc, a) => acc + a.calories, 0);
  const totalMinutes = activities.reduce((acc, a) => acc + a.durationMinutes, 0);

  const nutrition = nutritionDays[0] || {
    totalCalories: 2350,
    targetCalories: 2450,
    protein: 168,
    targetProtein: 165,
    carbs: 260,
    targetCarbs: 280,
    fats: 72,
    targetFats: 75,
    waterLiters: 3.2,
    meals: [],
    adherencePercent: 94
  };

  return (
    <div className="space-y-6 font-mono">
      
      {/* 1. Header Section - Editorial Masthead */}
      <div className="bg-[#141414] text-[#F9F9F7] border border-[#262626] p-6 lg:p-8 hard-shadow">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#262626] pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-[#CC0000] text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
                CLINICAL DISPATCH
              </span>
              <span className="text-xs text-[#888888] uppercase tracking-wider">
                ARCHIVE NO. 402-A • COMPREHENSIVE BIOLOGY
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black tracking-tight text-white uppercase">
              Health Metrics & Laboratory Records
            </h1>
            <p className="text-xs text-[#A3A3A3] mt-1 max-w-2xl font-mono">
              Aggregated serum biomarkers, nocturnal sleep architecture, cardiorespiratory exertion load, and biochemical macro adherence.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={onOpenDoctorReport}
              className="px-4 py-2 bg-[#CC0000] hover:bg-[#b30000] text-white text-xs font-bold uppercase tracking-wider border border-[#111111] flex items-center gap-1.5 transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>EXPORT DOCTOR DOSSIER</span>
            </button>
            <button
              onClick={onOpenDataHub}
              className="px-4 py-2 bg-[#222222] hover:bg-[#2c2c2c] text-white text-xs font-bold uppercase tracking-wider border border-[#383838] flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>CONNECT SOURCE</span>
            </button>
          </div>
        </div>

        {/* Quick Top Statistics Bar with Dark Grey Contrast Boxes */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-2">
          <div className="bg-[#1C1C1C] border border-[#2D2D2D] p-3 text-center">
            <span className="text-[10px] text-[#888888] uppercase font-bold block">TRACKED BIOMARKERS</span>
            <span className="text-xl sm:text-2xl font-black text-white font-mono">{biomarkers.length}</span>
            <span className="text-[9px] text-[#4ADE80] block mt-0.5">92% IN OPTIMAL BAND</span>
          </div>
          <div className="bg-[#1C1C1C] border border-[#2D2D2D] p-3 text-center">
            <span className="text-[10px] text-[#888888] uppercase font-bold block">RESTING HEART RATE</span>
            <span className="text-xl sm:text-2xl font-black text-white font-mono">{latestSleep.restingHr} <span className="text-xs font-normal text-[#888888]">BPM</span></span>
            <span className="text-[9px] text-[#4ADE80] block mt-0.5">-3 BPM BELOW BASELINE</span>
          </div>
          <div className="bg-[#1C1C1C] border border-[#2D2D2D] p-3 text-center">
            <span className="text-[10px] text-[#888888] uppercase font-bold block">NOCTURNAL HRV</span>
            <span className="text-xl sm:text-2xl font-black text-white font-mono">{latestSleep.hrvAvg} <span className="text-xs font-normal text-[#888888]">MS</span></span>
            <span className="text-[9px] text-[#4ADE80] block mt-0.5">+8% PARASYMPATHETIC</span>
          </div>
          <div className="bg-[#1C1C1C] border border-[#2D2D2D] p-3 text-center">
            <span className="text-[10px] text-[#888888] uppercase font-bold block">SLEEP EFFICIENCY</span>
            <span className="text-xl sm:text-2xl font-black text-white font-mono">{latestSleep.efficiency}%</span>
            <span className="text-[9px] text-[#4ADE80] block mt-0.5">SCORE: {latestSleep.sleepScore}/100</span>
          </div>
        </div>
      </div>

      {/* 2. Sub-Tab Section Switcher Bar */}
      <div className="bg-[#111111] border border-[#262626] p-1 flex items-center gap-1 overflow-x-auto">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const active = subTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold whitespace-nowrap uppercase tracking-wider transition-colors border ${
                active
                  ? 'bg-white text-[#111111] border-white font-black'
                  : 'bg-transparent text-[#888888] border-transparent hover:text-white hover:bg-[#1A1A1A]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 1: CLINICAL VITALS & LABS
         ═══════════════════════════════════════════════════════════════════ */}
      {subTab === 'vitals' && (
        <div className="space-y-6">
          
          {/* Category Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#141414] p-3 border border-[#262626]">
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-[#888888]" />
              <span className="text-[11px] text-[#888888] uppercase font-bold">SERUM PANEL CATEGORIES:</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setBioFilter(cat)}
                  className={`px-3 py-1 text-[11px] uppercase font-bold tracking-wider transition-colors border ${
                    bioFilter === cat
                      ? 'bg-[#CC0000] text-white border-[#CC0000]'
                      : 'bg-[#1C1C1C] text-[#888888] hover:text-white border-[#2E2E2E]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Biomarkers Grid with Dark Grey Contrast Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBios.map(bio => {
              const isOpt = bio.status === 'optimal';
              const isBorder = bio.status === 'borderline';
              return (
                <div
                  key={bio.id}
                  className="bg-[#151515] border border-[#262626] p-5 flex flex-col justify-between hover:border-[#404040] transition-colors hard-shadow-sm"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2 border-b border-[#262626] pb-2">
                      <div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                          {bio.name}
                        </h3>
                        <span className="text-[10px] text-[#888888] uppercase tracking-wider">
                          PANEL: {bio.category}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider border ${
                          isOpt
                            ? 'bg-[#122A1A] text-[#4ADE80] border-[#22C55E]/40'
                            : isBorder
                            ? 'bg-[#2A2412] text-[#FACC15] border-[#EAB308]/40'
                            : 'bg-[#2E1215] text-[#F87171] border-[#EF4444]/40'
                        }`}
                      >
                        {bio.status}
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between pt-1">
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black text-white font-mono">{bio.value}</span>
                        <span className="text-xs text-[#888888] font-bold">{bio.unit}</span>
                      </div>
                      {bio.historicalTrend && (
                        <div className="text-xs flex items-center gap-1 font-bold">
                          {bio.historicalTrend === 'improving' && (
                            <span className="text-[#4ADE80] flex items-center gap-0.5 text-[11px]">
                              <TrendingUp className="w-3.5 h-3.5" /> IMPR.
                            </span>
                          )}
                          {bio.historicalTrend === 'declining' && (
                            <span className="text-[#F87171] flex items-center gap-0.5 text-[11px]">
                              <TrendingDown className="w-3.5 h-3.5" /> DECL.
                            </span>
                          )}
                          {bio.historicalTrend === 'stable' && (
                            <span className="text-[#888888] flex items-center gap-0.5 text-[11px]">
                              <Minus className="w-3.5 h-3.5" /> STABLE
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Dark Grey Contrast Reference Box */}
                    <div className="bg-[#1F1F1F] p-2.5 border border-[#303030] text-xs">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-[#888888] uppercase font-bold">CLINICAL REFERENCE:</span>
                        <span className="font-mono text-white font-bold">{bio.referenceRange} {bio.unit}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-[#262626] flex items-center justify-between text-[10px] text-[#888888] uppercase tracking-wider">
                    <span>RECORDED: {bio.date}</span>
                    <span className="text-[#CCCCCC] font-bold">{bio.source}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Diagnostic Lab Reports Table */}
          {labReports.length > 0 && (
            <div className="bg-[#141414] border border-[#262626] p-6 hard-shadow">
              <div className="flex items-center justify-between border-b border-[#262626] pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#CC0000]" />
                  <h3 className="text-base font-serif font-black uppercase text-white tracking-wide">
                    Certified Pathology & Blood Chemistry Reports
                  </h3>
                </div>
                <span className="text-[10px] text-[#888888] uppercase tracking-wider">
                  CLIA / CAP ACCREDITED
                </span>
              </div>

              <div className="space-y-3">
                {labReports.map(rep => (
                  <div
                    key={rep.id}
                    className="bg-[#1C1C1C] border border-[#2D2D2D] p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:border-[#444444] transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="bg-[#CC0000] text-white text-[9px] font-bold px-1.5 py-0.5 uppercase">
                          LAB OCR VERIFIED
                        </span>
                        <h4 className="text-sm font-bold text-white uppercase">{rep.title}</h4>
                      </div>
                      <p className="text-xs text-[#A3A3A3] max-w-3xl">{rep.summary}</p>
                    </div>
                    <div className="text-left md:text-right flex-shrink-0 text-xs font-mono">
                      <span className="text-white font-bold block">{rep.date}</span>
                      <span className="text-[11px] text-[#888888] block">{rep.laboratory}</span>
                      <button
                        onClick={onOpenDoctorReport}
                        className="mt-2 text-[10px] text-[#CC0000] hover:underline font-bold uppercase flex items-center gap-0.5 md:justify-end"
                      >
                        VIEW FULL FOLIO <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 2: SLEEP ARCHITECTURE & NOCTURNAL RECOVERY
         ═══════════════════════════════════════════════════════════════════ */}
      {subTab === 'sleep' && (
        <div className="space-y-6">
          
          <div className="bg-[#141414] border border-[#262626] p-6 lg:p-8 hard-shadow space-y-6">
            
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#262626] pb-4">
              <div>
                <span className="bg-[#CC0000] text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
                  POLYSOMNOGRAPHY TELEMETRY
                </span>
                <h3 className="text-xl sm:text-2xl font-serif font-black uppercase text-white tracking-tight mt-1">
                  Sleep Hypnogram & Stage Distribution ({latestSleep.date})
                </h3>
              </div>
              <div className="bg-[#1E1E1E] border border-[#333333] px-4 py-2 text-right">
                <span className="text-[10px] text-[#888888] uppercase font-bold block">RECOVERY INDEX</span>
                <span className="text-xl font-black text-[#4ADE80] font-mono">{latestSleep.sleepScore}/100</span>
              </div>
            </div>

            {/* Sleep Stages Proportional Bar */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-white font-bold uppercase">
                  TOTAL DURATION: {Math.floor(latestSleep.totalMinutes / 60)}H {latestSleep.totalMinutes % 60}M
                </span>
                <span className="text-[#4ADE80] font-bold uppercase">
                  {latestSleep.efficiency}% SLEEP EFFICIENCY
                </span>
              </div>

              <div className="w-full bg-[#0e0e0e] h-8 border border-[#333333] flex overflow-hidden p-0.5">
                <div
                  className="bg-[#3B82F6] h-full flex items-center justify-center text-[10px] text-white font-bold"
                  style={{ width: `${(latestSleep.deepMinutes / latestSleep.totalMinutes) * 100}%` }}
                  title="Deep Sleep"
                >
                  DEEP
                </div>
                <div
                  className="bg-[#A855F7] h-full flex items-center justify-center text-[10px] text-white font-bold"
                  style={{ width: `${(latestSleep.remMinutes / latestSleep.totalMinutes) * 100}%` }}
                  title="REM Sleep"
                >
                  REM
                </div>
                <div
                  className="bg-[#64748B] h-full flex items-center justify-center text-[10px] text-white font-bold"
                  style={{ width: `${(latestSleep.lightMinutes / latestSleep.totalMinutes) * 100}%` }}
                  title="Light Sleep"
                >
                  LIGHT
                </div>
                <div
                  className="bg-[#EF4444] h-full flex items-center justify-center text-[10px] text-white font-bold"
                  style={{ width: `${(latestSleep.awakeMinutes / latestSleep.totalMinutes) * 100}%` }}
                  title="Awake"
                >
                  AWK
                </div>
              </div>

              {/* Stage Detail Cards in Dark Grey */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                <div className="bg-[#1C1C1C] border border-[#2D2D2D] p-3">
                  <div className="flex items-center gap-1.5 text-[10px] text-[#888888] uppercase font-bold">
                    <span className="w-2 h-2 bg-[#3B82F6]" /> DEEP REPAIR
                  </div>
                  <div className="text-xl font-black text-white font-mono mt-1">{latestSleep.deepMinutes}m</div>
                  <span className="text-[10px] text-[#4ADE80] block">Growth hormone release</span>
                </div>
                <div className="bg-[#1C1C1C] border border-[#2D2D2D] p-3">
                  <div className="flex items-center gap-1.5 text-[10px] text-[#888888] uppercase font-bold">
                    <span className="w-2 h-2 bg-[#A855F7]" /> REM COGNITIVE
                  </div>
                  <div className="text-xl font-black text-white font-mono mt-1">{latestSleep.remMinutes}m</div>
                  <span className="text-[10px] text-[#4ADE80] block">Memory consolidation</span>
                </div>
                <div className="bg-[#1C1C1C] border border-[#2D2D2D] p-3">
                  <div className="flex items-center gap-1.5 text-[10px] text-[#888888] uppercase font-bold">
                    <span className="w-2 h-2 bg-[#64748B]" /> LIGHT SLEEP
                  </div>
                  <div className="text-xl font-black text-white font-mono mt-1">{latestSleep.lightMinutes}m</div>
                  <span className="text-[10px] text-[#888888] block">Metabolic transition</span>
                </div>
                <div className="bg-[#1C1C1C] border border-[#2D2D2D] p-3">
                  <div className="flex items-center gap-1.5 text-[10px] text-[#888888] uppercase font-bold">
                    <span className="w-2 h-2 bg-[#EF4444]" /> AWAKE LATENCY
                  </div>
                  <div className="text-xl font-black text-white font-mono mt-1">{latestSleep.awakeMinutes}m</div>
                  <span className="text-[10px] text-[#888888] block">Minimal interruptions</span>
                </div>
              </div>
            </div>

            {/* Autonomic Nervous System Telemetry (HRV & RHR) in High Contrast Dark Grey */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="bg-[#1C1C1C] border border-[#2D2D2D] p-5 space-y-2">
                <div className="flex items-center justify-between border-b border-[#2D2D2D] pb-2">
                  <span className="text-xs font-bold text-[#A3A3A3] uppercase">AUTONOMIC HRV (RMSSD)</span>
                  <span className="text-xs font-bold text-[#4ADE80]">+5% ABOVE BASELINE</span>
                </div>
                <div className="flex items-baseline gap-2 pt-1">
                  <span className="text-4xl font-black text-white font-mono">{latestSleep.hrvAvg}</span>
                  <span className="text-xs text-[#888888] font-bold">MS</span>
                </div>
                <p className="text-xs text-[#A3A3A3] font-mono leading-relaxed">
                  Elevated nocturnal parasympathetic tone indicates full central nervous system restoration following high-intensity training.
                </p>
              </div>

              <div className="bg-[#1C1C1C] border border-[#2D2D2D] p-5 space-y-2">
                <div className="flex items-center justify-between border-b border-[#2D2D2D] pb-2">
                  <span className="text-xs font-bold text-[#A3A3A3] uppercase">NOCTURNAL BASAL RHR</span>
                  <span className="text-xs font-bold text-[#4ADE80]">NADIR: 52 BPM</span>
                </div>
                <div className="flex items-baseline gap-2 pt-1">
                  <span className="text-4xl font-black text-white font-mono">{latestSleep.restingHr}</span>
                  <span className="text-xs text-[#888888] font-bold">BPM</span>
                </div>
                <p className="text-xs text-[#A3A3A3] font-mono leading-relaxed">
                  Heart rate reached nadir in first third of sleep cycle, verifying prompt clearance of metabolic byproducts and zero late-evening stress.
                </p>
              </div>
            </div>

          </div>

          {/* Historical Sleep Dispatch Log */}
          <div className="bg-[#141414] border border-[#262626] p-6 hard-shadow">
            <h3 className="text-base font-serif font-black uppercase text-white tracking-wide border-b border-[#262626] pb-3 mb-4">
              Historical Polysomnography Logs
            </h3>
            <div className="space-y-2 font-mono">
              {sleepRecords.map((s, i) => (
                <div
                  key={i}
                  className="bg-[#1C1C1C] border border-[#2D2D2D] p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                >
                  <div>
                    <span className="font-bold text-white uppercase">{s.date}</span>
                    <span className="text-[11px] text-[#888888] ml-2">
                      {Math.floor(s.totalMinutes / 60)}h {s.totalMinutes % 60}m • {s.source}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="text-[#A3A3A3]">HRV: <strong className="text-[#4ADE80]">{s.hrvAvg} ms</strong></span>
                    <span className="text-[#A3A3A3]">RHR: <strong className="text-white">{s.restingHr} BPM</strong></span>
                    <span className="bg-[#242424] text-white px-2 py-0.5 border border-[#383838] font-bold">
                      INDEX: {s.sleepScore}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 3: METABOLIC LOAD & ACTIVITY
         ═══════════════════════════════════════════════════════════════════ */}
      {subTab === 'activity' && (
        <div className="space-y-6">
          
          {/* Top Aggregate Activity Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-[#141414] border border-[#262626] p-4 text-center hard-shadow-sm">
              <span className="text-[10px] text-[#888888] uppercase font-bold block">COMPLETED SESSIONS</span>
              <span className="text-3xl font-black text-white font-mono">{activities.length}</span>
              <span className="text-[9px] text-[#4ADE80] block mt-0.5">THIS MICROCYCLE</span>
            </div>
            <div className="bg-[#141414] border border-[#262626] p-4 text-center hard-shadow-sm">
              <span className="text-[10px] text-[#888888] uppercase font-bold block">DISTANCE COVERED</span>
              <span className="text-3xl font-black text-white font-mono">{totalDistance.toFixed(1)} <span className="text-xs text-[#888888]">KM</span></span>
              <span className="text-[9px] text-[#4ADE80] block mt-0.5">ZONE 2 & INTERVALS</span>
            </div>
            <div className="bg-[#141414] border border-[#262626] p-4 text-center hard-shadow-sm">
              <span className="text-[10px] text-[#888888] uppercase font-bold block">CALORIC EXPENDITURE</span>
              <span className="text-3xl font-black text-[#CC0000] font-mono">{totalCalories.toLocaleString()} <span className="text-xs text-[#888888]">KCAL</span></span>
              <span className="text-[9px] text-[#888888] block mt-0.5">ACTIVE METABOLISM</span>
            </div>
            <div className="bg-[#141414] border border-[#262626] p-4 text-center hard-shadow-sm">
              <span className="text-[10px] text-[#888888] uppercase font-bold block">TIME UNDER LOAD</span>
              <span className="text-3xl font-black text-white font-mono">{Math.round(totalMinutes / 60)} <span className="text-xs text-[#888888]">HRS</span></span>
              <span className="text-[9px] text-[#4ADE80] block mt-0.5">OPTIMAL STIMULUS</span>
            </div>
          </div>

          {/* Activity Cards Grid with Dark Grey Contrast */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activities.map(act => (
              <div
                key={act.id}
                className="bg-[#151515] border border-[#262626] p-5 space-y-3 hover:border-[#404040] transition-colors hard-shadow-sm"
              >
                <div className="flex items-start justify-between border-b border-[#262626] pb-2">
                  <div>
                    <span className="bg-[#CC0000] text-white text-[9px] font-bold px-1.5 py-0.5 uppercase tracking-wider">
                      {act.type} • {act.source}
                    </span>
                    <h3 className="text-base font-bold text-white uppercase mt-1 font-mono">{act.title}</h3>
                  </div>
                  <span className="text-xs text-[#888888] font-mono">{act.date}</span>
                </div>

                {/* Dark Grey Contrast 3-Column Box */}
                <div className="grid grid-cols-3 gap-2 text-center bg-[#1F1F1F] p-3 border border-[#303030] text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-[#888888] block uppercase">DURATION</span>
                    <span className="font-black text-white text-sm">{act.durationMinutes}m</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#888888] block uppercase">AVG HR</span>
                    <span className="font-black text-[#CC0000] text-sm">{act.avgHeartRate} BPM</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#888888] block uppercase">ENERGY</span>
                    <span className="font-black text-white text-sm">{act.calories} kcal</span>
                  </div>
                </div>

                {act.heartRateZones && (
                  <div className="space-y-1">
                    <span className="text-[10px] text-[#888888] uppercase font-bold block">HEART RATE INTENSITY ZONES:</span>
                    <div className="grid grid-cols-5 gap-1 text-[10px] text-center font-mono font-bold">
                      <div className="bg-[#1C2A3A] text-[#93C5FD] p-1 border border-[#2A3F55]">Z1: {act.heartRateZones.zone1}m</div>
                      <div className="bg-[#122A1A] text-[#4ADE80] p-1 border border-[#22C55E]/40 font-black">Z2: {act.heartRateZones.zone2}m</div>
                      <div className="bg-[#2A2412] text-[#FACC15] p-1 border border-[#EAB308]/40">Z3: {act.heartRateZones.zone3}m</div>
                      <div className="bg-[#2E1A12] text-[#FB923C] p-1 border border-[#F97316]/40">Z4: {act.heartRateZones.zone4}m</div>
                      <div className="bg-[#2E1215] text-[#F87171] p-1 border border-[#EF4444]/40">Z5: {act.heartRateZones.zone5}m</div>
                    </div>
                  </div>
                )}

                <div className="pt-2 border-t border-[#262626] flex items-center justify-between text-xs text-[#888888] font-mono">
                  <span>TRAINING IMPULSE (TRIMP): <strong className="text-white">{act.trainingLoad}</strong></span>
                  {act.distanceKm && <span>DISTANCE: <strong className="text-white">{act.distanceKm} km</strong></span>}
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 4: MACRONUTRIENTS & FUEL
         ═══════════════════════════════════════════════════════════════════ */}
      {subTab === 'nutrition' && (
        <div className="space-y-6">
          
          <div className="bg-[#141414] border border-[#262626] p-6 lg:p-8 hard-shadow space-y-6">
            
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#262626] pb-4">
              <div>
                <span className="bg-[#CC0000] text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
                  METABOLIC NUTRITION TARGETS
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <h3 className="text-2xl sm:text-3xl font-serif font-black uppercase text-white">
                    {nutrition.totalCalories} / {nutrition.targetCalories}
                  </h3>
                  <span className="text-xs text-[#888888] font-mono font-bold">KCAL INTAKE</span>
                </div>
              </div>
              <div className="bg-[#1E1E1E] border border-[#333333] px-4 py-2 text-right">
                <span className="text-[10px] text-[#888888] uppercase font-bold block">MACRO ADHERENCE</span>
                <span className="text-xl font-black text-[#4ADE80] font-mono">{nutrition.adherencePercent}%</span>
              </div>
            </div>

            {/* 4 Macro Breakdown Cards in High Contrast Dark Grey */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'ENERGY CALORIES', value: nutrition.totalCalories, target: nutrition.targetCalories, unit: 'kcal', color: 'text-white', barColor: 'bg-white' },
                { label: 'PROTEIN SYNTHESIS', value: nutrition.protein, target: nutrition.targetProtein, unit: 'g', color: 'text-[#4ADE80]', barColor: 'bg-[#4ADE80]' },
                { label: 'GLYCOGEN CARBS', value: nutrition.carbs, target: nutrition.targetCarbs, unit: 'g', color: 'text-[#60A5FA]', barColor: 'bg-[#60A5FA]' },
                { label: 'LIPIDS & HORMONES', value: nutrition.fats, target: nutrition.targetFats, unit: 'g', color: 'text-[#FACC15]', barColor: 'bg-[#FACC15]' },
              ].map(m => (
                <div key={m.label} className="bg-[#1C1C1C] border border-[#2D2D2D] p-4 text-center space-y-2">
                  <span className="text-[10px] text-[#888888] uppercase font-bold block">{m.label}</span>
                  <span className={`text-2xl font-black ${m.color} font-mono block`}>
                    {m.value}{m.unit !== 'kcal' ? 'g' : ''}
                  </span>
                  <div className="w-full bg-[#0e0e0e] h-2 border border-[#333333] p-0.5">
                    <div
                      className={`${m.barColor} h-full transition-all`}
                      style={{ width: `${Math.min(100, (m.value / m.target) * 100)}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-[#888888] font-mono block">
                    TARGET: {m.target}{m.unit !== 'kcal' ? 'g' : ''}
                  </span>
                </div>
              ))}
            </div>

            {/* Cellular Hydration Desk in Dark Grey */}
            <div className="bg-[#1C1C1C] border border-[#2D2D2D] p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#CC0000] text-white">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white uppercase block">
                    CELLULAR HYDRATION: {nutrition.waterLiters.toFixed(1)} LITERS
                  </span>
                  <span className="text-[11px] text-[#888888]">
                    Optimal target: 3.4L electrolyte balance for plasma volume and Zone 2 thermo-regulation.
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold text-[#4ADE80] font-mono">94% ON TARGET</span>
            </div>

            {/* AI Nutrition Strategy Callout */}
            <div className="bg-[#1F1F1F] border border-[#383838] p-4 text-xs font-mono flex items-start gap-3">
              <Sparkles className="w-4 h-4 text-[#CC0000] flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white uppercase block mb-1">
                  AI CLINICAL NUTRITION DIRECTIVE:
                </span>
                <p className="text-[#CCCCCC] leading-relaxed">
                  {adaptivePlan.nutritionTargets.focusNotes}
                </p>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
