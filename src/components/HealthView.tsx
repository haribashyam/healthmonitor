import React, { useState } from 'react';
import { Heart, Moon, Flame, Clock, TrendingDown, TrendingUp, Minus, FileText, ChevronRight, Activity, Utensils, CircleCheck as CheckCircle2, Sparkles } from 'lucide-react';
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
  biomarkers, labReports, activities, sleepRecords, nutritionDays, adaptivePlan,
  onOpenDoctorReport, onOpenDataHub
}) => {
  const [subTab, setSubTab] = useState<SubTab>('vitals');
  const [bioFilter, setBioFilter] = useState('all');

  const tabs: { id: SubTab; label: string; icon: any }[] = [
    { id: 'vitals', label: 'Vitals & Labs', icon: Heart },
    { id: 'sleep', label: 'Sleep & Recovery', icon: Moon },
    { id: 'activity', label: 'Activity', icon: Activity },
    { id: 'nutrition', label: 'Nutrition', icon: Utensils },
  ];

  const categories = ['all', 'Cardiovascular', 'Metabolic', 'Lipids', 'Hormones', 'Inflammation', 'Vitamins'];
  const filteredBios = bioFilter === 'all' ? biomarkers : biomarkers.filter(b => b.category === bioFilter);

  const latestSleep = sleepRecords[0] || { totalMinutes: 462, deepMinutes: 94, remMinutes: 112, lightMinutes: 224, awakeMinutes: 32, efficiency: 93, hrvAvg: 64, restingHr: 59, sleepScore: 88, date: '2026-08-25', source: 'Oura Ring Gen3' };

  const totalDistance = activities.reduce((acc, a) => acc + (a.distanceKm || 0), 0);
  const totalCalories = activities.reduce((acc, a) => acc + a.calories, 0);
  const totalMinutes = activities.reduce((acc, a) => acc + a.durationMinutes, 0);

  const nutrition = nutritionDays[0] || { totalCalories: 2350, targetCalories: 2450, protein: 168, targetProtein: 165, carbs: 260, targetCarbs: 280, fats: 72, targetFats: 75, waterLiters: 3.2, meals: [], adherencePercent: 94 };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-md">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Health Metrics</h1>
          <p className="text-xs text-slate-400 mt-1">Clinical biomarkers, sleep architecture, activity load, and nutrition tracking.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={onOpenDoctorReport} className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 transition-all flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" /> Export Doctor PDF
          </button>
          <button onClick={onOpenDataHub} className="px-3.5 py-2 rounded-xl text-xs font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-all">
            Add Data Source
          </button>
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const active = subTab === tab.id;
          return (
            <button key={tab.id} onClick={() => setSubTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                active ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
              }`}>
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* VITALS & LABS */}
      {subTab === 'vitals' && (
        <div className="space-y-4">
          {/* Category filter */}
          <div className="flex items-center gap-2 overflow-x-auto text-xs">
            {categories.map(cat => (
              <button key={cat} onClick={() => setBioFilter(cat)}
                className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-all ${
                  bioFilter === cat ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}>
                {cat === 'all' ? 'All' : cat}
              </button>
            ))}
          </div>

          {/* Biomarker grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBios.map(bio => {
              const isOpt = bio.status === 'optimal';
              const isBorder = bio.status === 'borderline';
              return (
                <div key={bio.id} className="bg-slate-900 rounded-xl p-5 border border-slate-800 hover:border-slate-700 transition-all shadow-sm flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-white">{bio.name}</h3>
                        <span className="text-[10px] font-semibold text-slate-400 uppercase">{bio.category}</span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                        isOpt ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : isBorder ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      }`}>{bio.status}</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-white">{bio.value}</span>
                      <span className="text-xs text-slate-400">{bio.unit}</span>
                      {bio.historicalTrend && (
                        <span className="ml-auto text-xs flex items-center gap-1">
                          {bio.historicalTrend === 'improving' && <span className="text-emerald-400 flex items-center gap-0.5"><TrendingUp className="w-3.5 h-3.5" /></span>}
                          {bio.historicalTrend === 'declining' && <span className="text-rose-400 flex items-center gap-0.5"><TrendingDown className="w-3.5 h-3.5" /></span>}
                          {bio.historicalTrend === 'stable' && <span className="text-slate-400"><Minus className="w-3.5 h-3.5" /></span>}
                        </span>
                      )}
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 text-xs">
                      <span className="text-slate-400">Ref: </span>
                      <span className="font-mono text-slate-200">{bio.referenceRange} {bio.unit}</span>
                    </div>
                  </div>
                  <div className="pt-3 mt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                    <span>{bio.date}</span>
                    <span>{bio.source}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Lab reports */}
          {labReports.length > 0 && (
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" /> Diagnostic Lab Reports
              </h3>
              {labReports.map(rep => (
                <div key={rep.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">{rep.title}</span>
                    <span className="text-xs text-slate-400">{rep.date} • {rep.laboratory}</span>
                  </div>
                  <p className="text-xs text-slate-300">{rep.summary}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SLEEP */}
      {subTab === 'sleep' && (
        <div className="space-y-4">
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-bold text-indigo-400 uppercase">Latest Night ({latestSleep.date})</span>
                <h3 className="text-base font-bold text-white">Sleep Architecture & Recovery</h3>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                Score: {latestSleep.sleepScore}/100
              </span>
            </div>

            {/* Stage bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-semibold">Total: {Math.floor(latestSleep.totalMinutes / 60)}h {latestSleep.totalMinutes % 60}m</span>
                <span className="text-emerald-400">{latestSleep.efficiency}% Efficiency</span>
              </div>
              <div className="w-full bg-slate-950 h-5 rounded-xl overflow-hidden flex p-0.5 border border-slate-800">
                <div className="bg-indigo-600 h-full rounded-l-lg" style={{ width: `${(latestSleep.deepMinutes / latestSleep.totalMinutes) * 100}%` }} />
                <div className="bg-cyan-500 h-full" style={{ width: `${(latestSleep.remMinutes / latestSleep.totalMinutes) * 100}%` }} />
                <div className="bg-blue-400 h-full" style={{ width: `${(latestSleep.lightMinutes / latestSleep.totalMinutes) * 100}%` }} />
                <div className="bg-amber-400 h-full rounded-r-lg" style={{ width: `${(latestSleep.awakeMinutes / latestSleep.totalMinutes) * 100}%` }} />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs">
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-300"><span className="w-2.5 h-2.5 rounded-full bg-indigo-600" /> Deep</span>
                  <strong className="text-white">{latestSleep.deepMinutes}m</strong>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-300"><span className="w-2.5 h-2.5 rounded-full bg-cyan-500" /> REM</span>
                  <strong className="text-white">{latestSleep.remMinutes}m</strong>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-300"><span className="w-2.5 h-2.5 rounded-full bg-blue-400" /> Light</span>
                  <strong className="text-white">{latestSleep.lightMinutes}m</strong>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-300"><span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Awake</span>
                  <strong className="text-white">{latestSleep.awakeMinutes}m</strong>
                </div>
              </div>
            </div>

            {/* HRV & RHR */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase">HRV (RMSSD)</span>
                  <span className="text-xs font-bold text-emerald-400">+5% vs Baseline</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-white">{latestSleep.hrvAvg}</span>
                  <span className="text-xs text-slate-400">ms</span>
                </div>
                <p className="text-xs text-slate-300">High parasympathetic dominance. Primed for training adaptations.</p>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase">Resting Heart Rate</span>
                  <span className="text-xs font-bold text-cyan-400">Lowest: 52 BPM</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-white">{latestSleep.restingHr}</span>
                  <span className="text-xs text-slate-400">BPM</span>
                </div>
                <p className="text-xs text-slate-300">RHR dipped early, indicating rapid metabolic stress clearing.</p>
              </div>
            </div>
          </div>

          {/* History */}
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-3">
            <h3 className="text-base font-bold text-white">Historical Sleep Records</h3>
            {sleepRecords.map((s, i) => (
              <div key={i} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-white block">{s.date}</span>
                  <span className="text-[11px] text-slate-400">{Math.floor(s.totalMinutes / 60)}h {s.totalMinutes % 60}m • {s.source}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-slate-300">HRV: <strong className="text-emerald-400">{s.hrvAvg} ms</strong></span>
                  <span className="text-slate-300">RHR: <strong className="text-cyan-400">{s.restingHr} BPM</strong></span>
                  <span className="font-bold px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">Score: {s.sleepScore}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ACTIVITY */}
      {subTab === 'activity' && (
        <div className="space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-center">
              <span className="text-xs text-slate-400 uppercase font-bold block">Workouts</span>
              <span className="text-2xl font-black text-white">{activities.length}</span>
            </div>
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-center">
              <span className="text-xs text-slate-400 uppercase font-bold block">Distance</span>
              <span className="text-2xl font-black text-cyan-400">{totalDistance.toFixed(1)} km</span>
            </div>
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-center">
              <span className="text-xs text-slate-400 uppercase font-bold block">Energy</span>
              <span className="text-2xl font-black text-amber-400">{totalCalories.toLocaleString()} kcal</span>
            </div>
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-center">
              <span className="text-xs text-slate-400 uppercase font-bold block">Time</span>
              <span className="text-2xl font-black text-indigo-400">{Math.round(totalMinutes / 60)} hrs</span>
            </div>
          </div>

          {/* Activity cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activities.map(act => (
              <div key={act.id} className="bg-slate-900 rounded-xl p-5 border border-slate-800 hover:border-slate-700 transition-all space-y-3 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-cyan-400 uppercase">{act.type} • {act.source}</span>
                    <h3 className="text-sm font-bold text-white mt-0.5">{act.title}</h3>
                  </div>
                  <span className="text-xs text-slate-400">{act.date}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 text-xs">
                  <div><span className="text-[10px] text-slate-400 block">Duration</span><span className="font-bold text-white">{act.durationMinutes}m</span></div>
                  <div><span className="text-[10px] text-slate-400 block">Avg HR</span><span className="font-bold text-rose-400">{act.avgHeartRate} BPM</span></div>
                  <div><span className="text-[10px] text-slate-400 block">Calories</span><span className="font-bold text-amber-400">{act.calories} kcal</span></div>
                </div>
                {act.heartRateZones && (
                  <div className="grid grid-cols-5 gap-1 text-[10px] text-center font-mono">
                    <div className="bg-blue-950/60 text-blue-300 p-1 rounded">Z1: {act.heartRateZones.zone1}m</div>
                    <div className="bg-emerald-950/60 text-emerald-300 p-1 rounded font-bold">Z2: {act.heartRateZones.zone2}m</div>
                    <div className="bg-amber-950/60 text-amber-300 p-1 rounded">Z3: {act.heartRateZones.zone3}m</div>
                    <div className="bg-orange-950/60 text-orange-300 p-1 rounded">Z4: {act.heartRateZones.zone4}m</div>
                    <div className="bg-rose-950/60 text-rose-300 p-1 rounded">Z5: {act.heartRateZones.zone5}m</div>
                  </div>
                )}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span>TRIMP: <strong className="text-cyan-400">{act.trainingLoad}</strong></span>
                  {act.distanceKm && <span>Distance: <strong className="text-white">{act.distanceKm} km</strong></span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* NUTRITION */}
      {subTab === 'nutrition' && (
        <div className="space-y-4">
          {/* Macro targets vs actual */}
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase">Target vs Actual</span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <h3 className="text-2xl font-black text-white">{nutrition.totalCalories} / {nutrition.targetCalories}</h3>
                  <span className="text-xs text-slate-400">kcal</span>
                </div>
              </div>
              <span className="text-xs font-bold px-3 py-1.5 rounded-full border bg-emerald-500/10 text-emerald-300 border-emerald-500/30">
                {nutrition.adherencePercent}% Adherence
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Calories', value: nutrition.totalCalories, target: nutrition.targetCalories, color: 'text-white', barColor: 'bg-emerald-400' },
                { label: 'Protein', value: nutrition.protein, target: nutrition.targetProtein, color: 'text-emerald-400', barColor: 'bg-emerald-500' },
                { label: 'Carbs', value: nutrition.carbs, target: nutrition.targetCarbs, color: 'text-cyan-400', barColor: 'bg-cyan-500' },
                { label: 'Fats', value: nutrition.fats, target: nutrition.targetFats, color: 'text-amber-400', barColor: 'bg-amber-500' },
              ].map(m => (
                <div key={m.label} className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center space-y-2">
                  <span className="text-[11px] text-slate-400 uppercase font-bold block">{m.label}</span>
                  <span className={`text-2xl font-black ${m.color}`}>{m.value}{m.label !== 'Calories' ? 'g' : ''}</span>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className={`${m.barColor} h-full rounded-full transition-all`} style={{ width: `${Math.min(100, (m.value / m.target) * 100)}%` }} />
                  </div>
                  <span className="text-[11px] text-slate-400 block">Target: {m.target}{m.label !== 'Calories' ? 'g' : ''}</span>
                </div>
              ))}
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400"><Flame className="w-5 h-5" /></div>
                <div>
                  <span className="text-xs font-bold text-white block">Hydration: {nutrition.waterLiters.toFixed(1)} Liters</span>
                  <span className="text-[11px] text-slate-400">Target: 3.4L for cellular recovery</span>
                </div>
              </div>
            </div>
          </div>

          {/* AI nutrition strategy */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-200">AI Fueling Strategy:</span>
              <p className="text-slate-400 leading-relaxed mt-0.5">{adaptivePlan.nutritionTargets.focusNotes}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
