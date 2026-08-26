import React, { useState, useMemo } from 'react';
import {
  Heart, Moon, Flame, Clock, ChevronRight, Radio,
  FileText, Sparkles, Zap, Info, ShieldCheck, Activity, TrendingDown
} from 'lucide-react';
import {
  VitalScore, Activity as ActivityType, SleepRecord, Biomarker, AdaptivePlan, WorkoutPlanDay
} from '../types';
import { formatHeartRateZone, computeVitalScoreDetails } from '../utils/healthCalculations';
import { analyzeVitalData, SensitivityLevel } from '../utils/insightEngine';
import { VitalAlertCards } from './VitalAlertCards';

interface DashboardViewProps {
  vitalScore: VitalScore;
  liveBpm: number;
  isBleConnected: boolean;
  bleDeviceName: string;
  activities: ActivityType[];
  sleepRecords: SleepRecord[];
  biomarkers: Biomarker[];
  adaptivePlan: AdaptivePlan;
  onOpenLiveWorkout: () => void;
  onOpenWhatChanged: () => void;
  onOpenDoctorReport: () => void;
  onOpenAsk: () => void;
  onOpenAskWithPrompt?: (prompt: string) => void;
  onNavigateTab: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  vitalScore, liveBpm, isBleConnected, bleDeviceName,
  activities, sleepRecords, biomarkers, adaptivePlan,
  onOpenLiveWorkout, onOpenWhatChanged, onOpenDoctorReport,
  onOpenAsk, onOpenAskWithPrompt, onNavigateTab
}) => {
  const [showFormula, setShowFormula] = useState(false);
  const [sensitivity, setSensitivity] = useState<SensitivityLevel>('standard');
  const [activePresetId, setActivePresetId] = useState('normal');
  const [isScanning, setIsScanning] = useState(false);
  const [downgraded, setDowngraded] = useState(false);

  const insightReport = useMemo(() => analyzeVitalData(sleepRecords, activities, biomarkers, sensitivity), [sleepRecords, activities, biomarkers, sensitivity]);

  const latestSleep = sleepRecords[0] || { totalMinutes: 462, hrvAvg: 64, restingHr: 59, sleepScore: 88, deepMinutes: 94, remMinutes: 112 };
  const formula = computeVitalScoreDetails(vitalScore);

  const handlePreset = (id: string) => {
    setActivePresetId(id);
    if (id === 'overtraining_spike' || id === 'illness_stress') setDowngraded(true);
    else if (id === 'normal' || id === 'supercompensation') setDowngraded(false);
  };

  const handleReScan = () => { setIsScanning(true); setTimeout(() => setIsScanning(false), 450); };

  const todayWorkout: WorkoutPlanDay = adaptivePlan.workoutSplit[2] || {
    day: 'Wednesday', title: 'Active Recovery & Mobility', duration: '30 mins',
    targetHR: '< 110 BPM', intensity: 'Recovery', sourceRationale: 'Mid-week HRV stabilization.'
  };

  return (
    <div className="space-y-6">
      {/* Hero status */}
      <div className={`rounded-2xl border p-5 sm:p-6 shadow-xl ${
        vitalScore.status === 'Rest Advised' || vitalScore.status === 'Moderate Strain'
          ? 'bg-gradient-to-br from-slate-900 to-rose-950/40 border-rose-500/40'
          : 'bg-gradient-to-br from-slate-900 to-cyan-950/40 border-slate-800'
      }`}>
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                vitalScore.status === 'Peak Condition' || vitalScore.status === 'Optimal Recovery'
                  ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                  : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
              }`}>
                <span className={`w-2 h-2 rounded-full ${vitalScore.status === 'Peak Condition' ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400 animate-pulse'}`} />
                {vitalScore.status}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Updated just now
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {vitalScore.status === 'Rest Advised' || vitalScore.status === 'Moderate Strain'
                ? <>Recovery <span className="text-rose-400">attention needed</span></>
                : <>Ready for <span className="text-cyan-400">targeted output</span></>}
            </h1>
            <p className="text-sm text-slate-300">
              HRV <strong className="text-emerald-400">{latestSleep.hrvAvg}ms</strong> • Resting HR <strong className="text-amber-400">{latestSleep.restingHr} BPM</strong> • Sleep score <strong className="text-indigo-400">{latestSleep.sleepScore}/100</strong>
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <button onClick={onOpenDoctorReport} className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 transition-all flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" /> Export Clinical PDF
              </button>
              <button onClick={onOpenWhatChanged} className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/25 transition-all flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Why Am I Different?
              </button>
              <button onClick={onOpenLiveWorkout} className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:brightness-110 shadow-md shadow-cyan-500/20 transition-all flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5" /> Start Live Workout
              </button>
              <button onClick={onOpenAsk} className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700 hover:text-white hover:bg-slate-700 transition-all flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-cyan-400" /> Ask AI
              </button>
            </div>
          </div>

          {/* Vital Score ring */}
          <div className="flex items-center gap-4 bg-slate-950/60 backdrop-blur p-4 rounded-xl border border-slate-800">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-800" />
                <circle cx="50" cy="50" r="42" stroke="url(#vs)" strokeWidth="8" strokeDasharray="264" strokeDashoffset={264 - (264 * vitalScore.overall) / 100} strokeLinecap="round" fill="transparent" className="transition-all duration-1000" />
                <defs>
                  <linearGradient id="vs" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={vitalScore.overall < 70 ? '#f43f5e' : '#06b6d4'} />
                    <stop offset="100%" stopColor={vitalScore.overall < 70 ? '#f59e0b' : '#10b981'} />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-white">{vitalScore.overall}</span>
                <span className="text-[10px] text-slate-400 uppercase">Vital Score</span>
              </div>
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between gap-3"><span className="text-slate-400">Recovery:</span><span className={vitalScore.recovery < 60 ? 'text-rose-400' : 'text-emerald-400'}>{vitalScore.recovery}/100</span></div>
              <div className="flex justify-between gap-3"><span className="text-slate-400">Activity:</span><span className="text-cyan-400">{vitalScore.activity}/100</span></div>
              <div className="flex justify-between gap-3"><span className="text-slate-400">Sleep:</span><span className={vitalScore.sleep < 70 ? 'text-amber-400' : 'text-indigo-400'}>{vitalScore.sleep}/100</span></div>
              <button onClick={() => setShowFormula(true)} className="pt-1 text-[11px] text-cyan-400 hover:text-cyan-300 underline flex items-center gap-0.5">
                <Info className="w-3 h-3" /> View formula
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Alert cards */}
      <VitalAlertCards
        report={insightReport}
        sensitivity={sensitivity}
        onSelectSensitivity={setSensitivity}
        onApplySimulationPreset={handlePreset}
        activePresetId={activePresetId}
        onDowngradeWorkout={() => setDowngraded(true)}
        isWorkoutDowngraded={downgraded}
        onNavigateTab={onNavigateTab}
        onOpenAskWithPrompt={onOpenAskWithPrompt}
        onReScan={handleReScan}
        isScanning={isScanning}
      />

      {/* Vital tiles */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-white">Live Vital Signals</h2>
          <button onClick={() => onNavigateTab('health')} className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
            All metrics <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <VitalTile icon={Heart} color="text-rose-400" label="Resting HR" value={latestSleep.restingHr} unit="BPM" sub={`Live: ${liveBpm} BPM`} device={bleDeviceName} onClick={() => onNavigateTab('health')} />
          <VitalTile icon={Activity} color="text-cyan-400" label="Blood Pressure" value="116/74" unit="mmHg" sub="Normotensive" device="Withings BPM Core" onClick={() => onNavigateTab('health')} />
          <VitalTile icon={Moon} color="text-indigo-400" label="Sleep" value={`${Math.floor(latestSleep.totalMinutes / 60)}h ${latestSleep.totalMinutes % 60}m`} unit="" sub={`Score: ${latestSleep.sleepScore}/100`} device="Oura Ring Gen3" onClick={() => onNavigateTab('health')} />
          <VitalTile icon={Flame} color="text-orange-400" label="Daily Steps" value="11,420" unit="" sub="114% of 10k goal" device="Apple Watch + Strava" onClick={() => onNavigateTab('health')} />
        </div>
      </div>

      {/* Today's plan + Quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900 rounded-2xl p-5 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white">Today's Adaptive Plan</h3>
            <button onClick={() => onNavigateTab('coach')} className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
              Full plan <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className={`rounded-xl p-4 border ${downgraded ? 'bg-slate-950/90 border-emerald-500/30' : 'bg-slate-950/70 border-slate-800'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-cyan-400 uppercase">Workout</span>
                <span className={`text-[10px] px-2 py-0.5 rounded ${downgraded ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-300'}`}>
                  {downgraded ? 'Recovery (Downgraded)' : todayWorkout.intensity}
                </span>
              </div>
              <h4 className="text-sm font-bold text-white mb-1">{downgraded ? '30-Min Gentle Mobility' : todayWorkout.title}</h4>
              <p className="text-xs text-slate-400 mb-2">{downgraded ? 'Substituted to allow CNS recovery.' : todayWorkout.sourceRationale}</p>
              <div className="flex gap-3 text-xs text-slate-400">
                <span>⏱ {downgraded ? '30 mins' : todayWorkout.duration}</span>
                <span>❤️ {downgraded ? '< 110 BPM' : todayWorkout.targetHR}</span>
              </div>
              <button onClick={onOpenLiveWorkout} className="mt-3 w-full px-3 py-1.5 rounded-lg text-xs font-bold bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/40 transition-all flex items-center justify-center gap-1">
                <Radio className="w-3.5 h-3.5" /> Track in Live HUD
              </button>
            </div>
            <div className="bg-slate-950/70 rounded-xl p-4 border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-400 uppercase">Nutrition</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">{adaptivePlan.nutritionTargets.dailyCalories} kcal target</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block">Protein</span>
                  <span className="text-sm font-bold text-white">{adaptivePlan.nutritionTargets.proteinGrams}g</span>
                </div>
                <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block">Carbs</span>
                  <span className="text-sm font-bold text-white">{adaptivePlan.nutritionTargets.carbGrams}g</span>
                </div>
                <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block">Fats</span>
                  <span className="text-sm font-bold text-white">{adaptivePlan.nutritionTargets.fatGrams}g</span>
                </div>
              </div>
              <button onClick={() => onNavigateTab('health')} className="mt-3 w-full text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center justify-center gap-1">
                Meal logs <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" /> Quick Actions
          </h3>
          <QuickAction icon={FileText} label="Upload Lab Report" sub="OCR extraction for blood markers" onClick={() => onNavigateTab('data')} color="cyan" />
          <QuickAction icon={Sparkles} label="Run What-If Simulator" sub="Model lifestyle changes" onClick={() => onNavigateTab('coach')} color="amber" />
          <QuickAction icon={ShieldCheck} label="Export Clinical Report" sub="Summary for doctor visit" onClick={onOpenDoctorReport} color="emerald" />
        </div>
      </div>

      {/* Formula modal */}
      {showFormula && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowFormula(false)}>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-cyan-400" /> Vital Score Formula</h3>
              <button onClick={() => setShowFormula(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <div className="space-y-3">
              {formula.map((item, i) => (
                <div key={i} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white">{item.label}</span>
                    <span className="text-[10px] text-slate-400 block">{item.metricRef}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-cyan-400">{item.value}/100</span>
                    <span className="text-[10px] text-slate-500 block">Weight: {item.weight}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400">
              Overall: <strong className="text-white">{vitalScore.overall}/100</strong> ({vitalScore.status})
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function VitalTile({ icon: Icon, color, label, value, unit, sub, device, onClick }: any) {
  return (
    <div onClick={onClick} className="bg-slate-900/80 rounded-xl p-4 border border-slate-800 hover:border-cyan-500/40 cursor-pointer transition-all flex flex-col justify-between shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Icon className={`w-3.5 h-3.5 ${color}`} />
          <span className="text-xs font-semibold text-slate-300 uppercase">{label}</span>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">In Range</span>
      </div>
      <div className="my-2 flex items-baseline gap-2">
        <span className="text-3xl font-extrabold text-white">{value}</span>
        {unit && <span className="text-xs text-slate-400">{unit}</span>}
      </div>
      <div className="text-[11px] text-slate-400">{sub}</div>
      <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-500">{device}</div>
    </div>
  );
}

function QuickAction({ icon: Icon, label, sub, onClick, color }: any) {
  const colors: Record<string, string> = {
    cyan: 'hover:border-cyan-500/40',
    amber: 'hover:border-amber-500/40',
    emerald: 'hover:border-emerald-500/40',
  };
  const iconColors: Record<string, string> = {
    cyan: 'text-cyan-400',
    amber: 'text-amber-400',
    emerald: 'text-emerald-400',
  };
  return (
    <button onClick={onClick} className={`w-full text-left p-3 rounded-xl bg-slate-950/70 border border-slate-800 ${colors[color]} transition-all flex items-center justify-between group`}>
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-slate-800/50"><Icon className={`w-4 h-4 ${iconColors[color]}`} /></div>
        <div>
          <span className="text-xs font-bold text-white block">{label}</span>
          <span className="text-[11px] text-slate-400">{sub}</span>
        </div>
      </div>
      <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400" />
    </button>
  );
}
