import React, { useState, useMemo } from 'react';
import {
  Activity,
  Heart,
  Moon,
  Flame,
  Utensils,
  Sparkles,
  Radio,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  Zap,
  Clock,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
  AlertOctagon,
  Layers,
  FileText,
  Sliders,
  Info,
  Mail,
  FileSpreadsheet,
  Database
} from 'lucide-react';
import {
  VitalScore,
  Activity as ActivityType,
  SleepRecord,
  Biomarker,
  AdaptivePlan,
  WorkoutPlanDay
} from '../types';
import { formatHeartRateZone, computeVitalScoreDetails } from '../utils/healthCalculations';
import { analyzeVitalData, SensitivityLevel, SIMULATION_PRESETS } from '../utils/insightEngine';
import { VitalAlertCards } from './VitalAlertCards';

interface CommandCenterProps {
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
  onOpenAskData: () => void;
  onOpenAskWithPrompt?: (prompt: string) => void;
  onOpenDataSources: () => void;
  onOpenSimulator: () => void;
  onOpenDoctorReport: () => void;
  onOpenWorkspace?: (tab?: 'gmail' | 'sheets' | 'picker' | 'firebase') => void;
  onNavigateTab: (tab: string) => void;
}

export const CommandCenter: React.FC<CommandCenterProps> = ({
  vitalScore,
  liveBpm,
  isBleConnected,
  bleDeviceName,
  activities,
  sleepRecords,
  biomarkers,
  adaptivePlan,
  onOpenLiveWorkout,
  onOpenWhatChanged,
  onOpenAskData,
  onOpenAskWithPrompt,
  onOpenDataSources,
  onOpenSimulator,
  onOpenDoctorReport,
  onOpenWorkspace,
  onNavigateTab
}) => {
  const [showFormulaModal, setShowFormulaModal] = useState(false);
  const [downgradedWorkout, setDowngradedWorkout] = useState(false);

  // Automated Insight Engine State
  const [activeSleepRecords, setActiveSleepRecords] = useState<SleepRecord[]>(sleepRecords);
  const [sensitivity, setSensitivity] = useState<SensitivityLevel>('standard');
  const [activePresetId, setActivePresetId] = useState<string>('normal');
  const [isScanning, setIsScanning] = useState<boolean>(false);

  // Compute insight report on live vital data
  const insightReport = useMemo(() => {
    return analyzeVitalData(activeSleepRecords, activities, biomarkers, sensitivity);
  }, [activeSleepRecords, activities, biomarkers, sensitivity]);

  const hrZoneInfo = formatHeartRateZone(liveBpm);
  const latestSleep = activeSleepRecords[0] || { totalMinutes: 462, hrvAvg: 64, restingHr: 59, sleepScore: 88, deepMinutes: 94 };
  const latestRun = activities.find(a => a.type === 'Run') || activities[0];
  
  // Calculate dynamic vital score based on simulated or real sleep records
  const dynamicVitalScore = useMemo(() => {
    if (activePresetId === 'overtraining_spike') {
      return {
        ...vitalScore,
        overall: 61,
        recovery: 48,
        sleep: 68,
        status: 'Moderate Strain' as const,
        deltaToday: -18
      };
    }
    if (activePresetId === 'illness_stress') {
      return {
        ...vitalScore,
        overall: 54,
        recovery: 38,
        sleep: 62,
        status: 'Rest Advised' as const,
        deltaToday: -24
      };
    }
    if (activePresetId === 'late_meal_alcohol') {
      return {
        ...vitalScore,
        overall: 72,
        recovery: 64,
        sleep: 71,
        status: 'Moderate Strain' as const,
        deltaToday: -9
      };
    }
    if (activePresetId === 'supercompensation') {
      return {
        ...vitalScore,
        overall: 94,
        recovery: 98,
        sleep: 95,
        status: 'Peak Condition' as const,
        deltaToday: +8
      };
    }
    return vitalScore;
  }, [vitalScore, activePresetId]);

  const formulaBreakdown = computeVitalScoreDetails(dynamicVitalScore);

  const handleApplyPreset = (presetId: string) => {
    const preset = SIMULATION_PRESETS.find(p => p.id === presetId);
    if (!preset) return;

    setActivePresetId(presetId);
    setActiveSleepRecords(prev => {
      const updated = [...prev];
      updated[0] = {
        ...updated[0],
        ...preset.mockTodayRecord
      };
      return updated;
    });

    if (presetId === 'overtraining_spike' || presetId === 'illness_stress') {
      setDowngradedWorkout(true);
    } else if (presetId === 'normal' || presetId === 'supercompensation') {
      setDowngradedWorkout(false);
    }
  };

  const handleReScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 450);
  };

  const todayWorkout: WorkoutPlanDay = adaptivePlan.workoutSplit[2] || {
    day: 'Wednesday',
    title: 'Active Recovery & Parasympathetic Mobility',
    duration: '30 mins',
    targetHR: '< 110 BPM',
    intensity: 'Recovery',
    sourceRationale: 'Matches mid-week HRV stabilization target.'
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* HERO STATUS BANNER: Apple Health x Garmin x Futuristic OS */}
      <div className={`relative overflow-hidden rounded-2xl border p-5 sm:p-6 lg:p-7 shadow-xl transition-all ${
        dynamicVitalScore.status === 'Rest Advised' || dynamicVitalScore.status === 'Moderate Strain'
          ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-rose-950/40 border-rose-500/40'
          : 'bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 border-slate-800'
      }`}>
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Left: Overall Health Readiness Status */}
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                dynamicVitalScore.status === 'Peak Condition' || dynamicVitalScore.status === 'Optimal Recovery'
                  ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                  : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
              }`}>
                <span className={`w-2 h-2 rounded-full ${
                  dynamicVitalScore.status === 'Peak Condition' || dynamicVitalScore.status === 'Optimal Recovery'
                    ? 'bg-emerald-400 animate-pulse'
                    : 'bg-rose-400 animate-pulse'
                }`} />
                {dynamicVitalScore.status}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Updated Just Now from 4 Connected Streams
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {dynamicVitalScore.status === 'Rest Advised' || dynamicVitalScore.status === 'Moderate Strain' ? (
                <>Autonomic Recovery <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-amber-400">Deficit & Fatigue Detected</span></>
              ) : (
                <>Ready for <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">Targeted Aerobic Output</span></>
              )}
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed">
              {dynamicVitalScore.status === 'Rest Advised' || dynamicVitalScore.status === 'Moderate Strain' ? (
                <>Your overnight HRV dropped to <strong className="text-rose-400">{latestSleep.hrvAvg}ms</strong> with resting heart rate elevated to <strong className="text-amber-400">{latestSleep.restingHr} BPM</strong>. Active recovery is prioritized.</>
              ) : (
                <>Your autonomic recovery is <span className="text-emerald-400 font-semibold">+5% above your 14-day baseline</span>. Overnight HRV normalized to {latestSleep.hrvAvg}ms with {latestSleep.deepMinutes} minutes in deep restoration.</>
              )}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                id="hero-clinical-pdf-btn"
                onClick={onOpenDoctorReport}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 transition-all shadow-md shadow-emerald-500/10"
                title="Export comprehensive medical brief & plan for doctor consultation"
              >
                <FileText className="w-3.5 h-3.5 text-emerald-400" />
                Export Clinical PDF Report
              </button>
              {onOpenWorkspace && (
                <button
                  id="hero-workspace-cloud-btn"
                  onClick={() => onOpenWorkspace('gmail')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-red-500/20 via-emerald-500/20 to-blue-500/20 text-slate-200 border border-slate-700 hover:border-cyan-400/50 hover:text-white transition-all shadow-sm"
                  title="Google Workspace (Gmail, Sheets, Drive) & Cloud Sync"
                >
                  <Mail className="w-3.5 h-3.5 text-red-400" />
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Workspace & Cloud</span>
                </button>
              )}
              <button
                onClick={onOpenWhatChanged}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/25 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Why Am I Different Today?
              </button>
              <button
                onClick={onOpenLiveWorkout}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 shadow-md shadow-cyan-500/20 transition-all"
              >
                <Radio className="w-3.5 h-3.5" />
                Start Live Workout HUD
              </button>
              <button
                onClick={() => {
                  if (onOpenAskWithPrompt && insightReport.alerts.length > 0) {
                    onOpenAskWithPrompt(
                      `Analyze my current ${insightReport.alerts[0].metricName} reading (${insightReport.alerts[0].currentValue}) and advise on my athletic recovery plan.`
                    );
                  } else {
                    onOpenAskData();
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-all border border-slate-700"
              >
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                Ask My Data Copilot
              </button>
            </div>
          </div>

          {/* Right: Interactive Vital Score Ring */}
          <div className="flex items-center gap-4 bg-slate-950/60 backdrop-blur-md p-4 rounded-xl border border-slate-800/80 shadow-lg">
            <div className="relative flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-slate-800"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="url(#vitalScoreGrad)"
                  strokeWidth="8"
                  strokeDasharray="264"
                  strokeDashoffset={264 - (264 * dynamicVitalScore.overall) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
                <defs>
                  <linearGradient id="vitalScoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={dynamicVitalScore.overall < 70 ? '#f43f5e' : '#06b6d4'} />
                    <stop offset="100%" stopColor={dynamicVitalScore.overall < 70 ? '#f59e0b' : '#10b981'} />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl sm:text-3xl font-black text-white">{dynamicVitalScore.overall}</span>
                <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">Vital Score</span>
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between gap-3 text-slate-300">
                <span className="text-slate-400">Recovery:</span>
                <span className={`font-semibold ${dynamicVitalScore.recovery < 60 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {dynamicVitalScore.recovery}/100
                </span>
              </div>
              <div className="flex items-center justify-between gap-3 text-slate-300">
                <span className="text-slate-400">Activity Load:</span>
                <span className="font-semibold text-cyan-400">{dynamicVitalScore.activity}/100</span>
              </div>
              <div className="flex items-center justify-between gap-3 text-slate-300">
                <span className="text-slate-400">Sleep Quality:</span>
                <span className={`font-semibold ${dynamicVitalScore.sleep < 70 ? 'text-amber-400' : 'text-indigo-400'}`}>
                  {dynamicVitalScore.sleep}/100
                </span>
              </div>
              <button
                onClick={() => setShowFormulaModal(true)}
                className="pt-1 text-[11px] text-cyan-400 hover:text-cyan-300 underline flex items-center gap-0.5"
              >
                <Info className="w-3 h-3" /> View transparent formula
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AUTOMATED INSIGHT ENGINE ALERT CARDS SECTION */}
      <VitalAlertCards
        report={insightReport}
        sensitivity={sensitivity}
        onSelectSensitivity={setSensitivity}
        onApplySimulationPreset={handleApplyPreset}
        activePresetId={activePresetId}
        onDowngradeWorkout={() => setDowngradedWorkout(true)}
        isWorkoutDowngraded={downgradedWorkout}
        onNavigateTab={onNavigateTab}
        onOpenAskWithPrompt={onOpenAskWithPrompt}
        onReScan={handleReScan}
        isScanning={isScanning}
      />

      {/* LIVE HEALTH STREAMING MATRIX: High Density, Real Time */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white tracking-wide">Live Vital Signals & Baselines</h2>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              Normalized Feed
            </span>
          </div>
          <button
            onClick={() => onNavigateTab('vitals')}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            All Vitals & Lab Panels <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          
          {/* Tile 1: Heart Rate & Live Pulse */}
          <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Heart Rate</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${hrZoneInfo.color}`}>
                {hrZoneInfo.zone}
              </span>
            </div>

            <div className="my-2 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white tracking-tight">{liveBpm}</span>
              <span className="text-xs text-slate-400 font-medium">BPM</span>
              <span className="text-[11px] text-emerald-400 font-medium ml-auto flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> Stable
              </span>
            </div>

            {/* Live animated waveform bar */}
            <div className="h-6 flex items-end gap-1 my-1 overflow-hidden">
              {[40, 60, 30, 80, 50, 95, 45, 70, 85, 35, 65, 90, 50, 75, 40, 85].map((h, i) => (
                <div
                  key={i}
                  className="w-full bg-rose-500/60 rounded-t-sm transition-all duration-300"
                  style={{ height: `${(h * (liveBpm / 140)) % 100}%` }}
                />
              ))}
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span>Resting: <strong className={latestSleep.restingHr > 63 ? 'text-amber-400' : 'text-slate-300'}>{latestSleep.restingHr} BPM</strong></span>
              <span className="text-slate-400 font-medium">
                {isBleConnected ? `LIVE • ${bleDeviceName}` : 'LIVE • Apple Watch'}
              </span>
            </div>
          </div>

          {/* Tile 2: Autonomic Recovery / HRV */}
          <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">HRV (RMSSD)</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                latestSleep.hrvAvg < 55
                  ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              }`}>
                {latestSleep.hrvAvg < 55 ? `${Math.round(((latestSleep.hrvAvg - 64) / 64) * 100)}% Drop` : '+5% vs Baseline'}
              </span>
            </div>

            <div className="my-2 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white tracking-tight">{latestSleep.hrvAvg}</span>
              <span className="text-xs text-slate-400 font-medium">ms</span>
              <span className="text-[11px] text-slate-400 ml-auto">Baseline: 64 ms</span>
            </div>

            <p className="text-xs text-slate-300 my-1 line-clamp-2">
              {latestSleep.hrvAvg < 55
                ? 'Parasympathetic suppression. Body is in sympathetic dominance recovering from fatigue.'
                : 'Parasympathetic tone is optimal. Cardiovascular recovery is ready for interval loading.'}
            </p>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span>Readiness: <strong className={latestSleep.sleepScore < 75 ? 'text-amber-400' : 'text-slate-300'}>{latestSleep.sleepScore}/100</strong></span>
              <span className="text-slate-400 font-medium">Oura Ring Gen3</span>
            </div>
          </div>

          {/* Tile 3: Sleep Staging & Duration */}
          <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Sleep Recovery</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                Score: {latestSleep.sleepScore}
              </span>
            </div>

            <div className="my-2 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white tracking-tight">
                {Math.floor(latestSleep.totalMinutes / 60)}h {latestSleep.totalMinutes % 60}m
              </span>
              <span className="text-xs text-slate-400 font-medium">Total</span>
              <span className="text-[11px] text-emerald-400 ml-auto">{latestSleep.efficiencyPercent || 93}% Efficiency</span>
            </div>

            {/* Stage bar */}
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex my-2">
              <div className="bg-indigo-600 h-full" style={{ width: `${(latestSleep.deepMinutes / latestSleep.totalMinutes) * 100}%` }} title={`Deep Sleep ${latestSleep.deepMinutes}m`} />
              <div className="bg-cyan-500 h-full" style={{ width: `${(latestSleep.remMinutes / latestSleep.totalMinutes) * 100}%` }} title={`REM Sleep ${latestSleep.remMinutes}m`} />
              <div className="bg-blue-400 h-full" style={{ width: '45%' }} title="Core Sleep" />
              <div className="bg-amber-400 h-full" style={{ width: '8%' }} title="Awake" />
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span>Deep: <strong className="text-slate-300">{latestSleep.deepMinutes}m</strong> • REM: <strong className="text-slate-300">{latestSleep.remMinutes}m</strong></span>
              <span className="text-slate-400 font-medium">Oura Ring</span>
            </div>
          </div>

          {/* Tile 4: Daily Steps & Activity Fusion */}
          <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Daily Movement</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                Verified Fusion
              </span>
            </div>

            <div className="my-2 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white tracking-tight">11,420</span>
              <span className="text-xs text-slate-400 font-medium">steps</span>
              <span className="text-[11px] text-emerald-400 font-semibold ml-auto">Goal 10k ✓</span>
            </div>

            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden my-2">
              <div className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full rounded-full" style={{ width: '100%' }} />
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span>Active Energy: 680 kcal</span>
              <span className="text-slate-400 font-medium">Apple Watch + Strava</span>
            </div>
          </div>

        </div>
      </div>

      {/* PHYSICIAN & MEDICAL PROFESSIONAL CLINICAL PDF REPORT BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 rounded-2xl p-5 border border-emerald-500/30 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex-shrink-0 mt-0.5">
            <FileText className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-wide">
                Physician & Medical Professional Health Brief
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
                PDF Export
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
              Generate a comprehensive clinical report synthesizing your 90-day multi-device biometrics, Quest lab diagnostic panels, and AI-adapted training & nutrition plan for sharing with your doctor, cardiologist, or trainer.
            </p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-400 pt-0.5">
              <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-400" /> Cardiovascular & HRV Baselines</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-400" /> Quest Lab Reference Intervals</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-400" /> 7-Day Workout Split Rationale</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-400" /> EHR/EMR Copy Support</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 w-full md:w-auto flex-shrink-0">
          <button
            onClick={onOpenDoctorReport}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 hover:from-emerald-400 hover:to-cyan-400 flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-500/20 font-sans"
          >
            <FileText className="w-4 h-4" />
            Generate Doctor PDF Report
          </button>
        </div>
      </div>

      {/* SECONDARY ROW: Today's Adaptive Action Protocol & Real-Time Ingestion */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Adaptive Health Protocol for Today */}
        <div className="lg:col-span-2 bg-slate-900/90 rounded-2xl p-5 sm:p-6 border border-slate-800 space-y-4 shadow-md">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-wide">Today's Adaptive Plan</h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  downgradedWorkout
                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                    : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                }`}>
                  {downgradedWorkout ? '✓ Deload Adjusted' : 'AI Calibrated Daily'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {downgradedWorkout
                  ? 'Dynamically adjusted to protect autonomic reserves and reduce sympathetic strain.'
                  : `Dynamically tuned to today's ${latestSleep.sleepScore} sleep score and ${latestSleep.restingHr} BPM resting heart rate.`}
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('plan')}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              Full 7-Day Protocol & Groceries <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Workout Card */}
            <div className={`rounded-xl p-4 border flex flex-col justify-between transition-all ${
              downgradedWorkout
                ? 'bg-slate-950/90 border-emerald-500/30 shadow-inner'
                : 'bg-slate-950/70 border-slate-800/80'
            }`}>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Scheduled Workout</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                    downgradedWorkout ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {downgradedWorkout ? 'Active Recovery (Downgraded)' : todayWorkout.intensity}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white">
                  {downgradedWorkout ? '30-Min Gentle Mobility & Parasympathetic Breathwork' : todayWorkout.title}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {downgradedWorkout
                    ? 'Substituted high-intensity cardiovascular load with parasympathetic joint mobility and nasal breathing to allow central nervous system recovery.'
                    : todayWorkout.sourceRationale}
                </p>
                <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                  <span>⏱ {downgradedWorkout ? '30 mins' : todayWorkout.duration}</span>
                  <span>❤️ Target HR: {downgradedWorkout ? '< 110 BPM (Zone 1)' : todayWorkout.targetHR}</span>
                </div>
              </div>

              <div className="pt-4 mt-3 border-t border-slate-800/80 flex items-center justify-between">
                <button
                  onClick={() => setDowngradedWorkout(!downgradedWorkout)}
                  className="text-xs text-slate-400 hover:text-slate-200 underline"
                >
                  {downgradedWorkout ? 'Revert to Original Workout' : 'Downgrade for Fatigue'}
                </button>
                <button
                  onClick={onOpenLiveWorkout}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/40 transition-all flex items-center gap-1"
                >
                  <Radio className="w-3.5 h-3.5" /> Track in Live HUD
                </button>
              </div>
            </div>

            {/* Nutrition Target Card */}
            <div className="bg-slate-950/70 rounded-xl p-4 border border-slate-800/80 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Nutrition & Macros</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    Target: {adaptivePlan.nutritionTargets.dailyCalories} kcal
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center pt-1">
                  <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase block">Protein</span>
                    <span className="text-sm font-bold text-white">{adaptivePlan.nutritionTargets.proteinGrams}g</span>
                    <span className="text-[10px] text-emerald-400 block">102% logged</span>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase block">Carbs</span>
                    <span className="text-sm font-bold text-white">{adaptivePlan.nutritionTargets.carbGrams}g</span>
                    <span className="text-[10px] text-cyan-400 block">95% logged</span>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase block">Fats</span>
                    <span className="text-sm font-bold text-white">{adaptivePlan.nutritionTargets.fatGrams}g</span>
                    <span className="text-[10px] text-slate-400 block">96% logged</span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 pt-1 line-clamp-2">
                  {adaptivePlan.nutritionTargets.focusNotes}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400">💧 Water Target: 3.4L</span>
                <button
                  onClick={() => onNavigateTab('nutrition')}
                  className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
                >
                  Meal Logs <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            </div>

          </div>

          {/* Quick AI Explanation Rationale Accordion */}
          <div className="bg-slate-950/40 rounded-xl p-3.5 border border-slate-800/60 flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <span className="font-bold text-slate-200">Why this recommendation?</span>
              <p className="text-slate-400 leading-relaxed">
                {downgradedWorkout
                  ? 'Insight Engine detected an autonomic stress signature. Cardiovascular training intensity has been scaled down to Zone 1 to prevent overreaching.'
                  : `Your resting heart rate (${latestSleep.restingHr} BPM) and sustained sleep score (${latestSleep.sleepScore}/100) indicate that recent aerobic workload has cleared. Today is structured to consolidate mitochondrial adaptations.`}
              </p>
            </div>
          </div>
        </div>

        {/* Right Col: Quick Health OS Modules & Actions */}
        <div className="space-y-4">
          
          {/* Quick Launch Control Hub */}
          <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 space-y-3 shadow-md">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              Quick Actions
            </h3>

            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={onOpenDataSources}
                className="w-full text-left p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-950 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white group-hover:text-cyan-300 block">Upload Lab Report PDF</span>
                    <span className="text-[11px] text-slate-400">OCR extraction for blood markers</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400" />
              </button>

              <button
                onClick={onOpenSimulator}
                className="w-full text-left p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-amber-500/40 hover:bg-slate-950 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                    <Sliders className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white group-hover:text-amber-300 block">Run "What-If" Simulator</span>
                    <span className="text-[11px] text-slate-400">Model +2000 steps or +45m sleep</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400" />
              </button>

              <button
                onClick={onOpenDoctorReport}
                className="w-full text-left p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-emerald-500/40 hover:bg-slate-950 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white group-hover:text-emerald-300 block">Export Clinical Report</span>
                    <span className="text-[11px] text-slate-400">Formatted summary for doctor visit</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400" />
              </button>

              {onOpenWorkspace && (
                <button
                  id="quick-action-workspace-btn"
                  onClick={() => onOpenWorkspace('gmail')}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-950 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-red-500/10 text-red-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white group-hover:text-cyan-300 block">Google Workspace & Cloud Hub</span>
                      <span className="text-[11px] text-slate-400">Gmail doctor reports, Sheets export, Drive picker</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400" />
                </button>
              )}
            </div>
          </div>

          {/* Connected Streams Quick Ledger */}
          <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 space-y-3 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Connected Ecosystem</span>
              <button
                onClick={onOpenDataSources}
                className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300"
              >
                Manage Hub
              </button>
            </div>

            <div className="space-y-2">
              {[
                { name: 'Strava API', status: 'Active (428 records)', time: '12m ago', color: 'text-orange-400' },
                { name: 'Apple HealthKit', status: 'Continuous Sync', time: 'Just now', color: 'text-red-400' },
                { name: 'Oura Ring Gen3', status: 'Sleep & HRV Verified', time: '42m ago', color: 'text-indigo-400' },
                { name: 'Quest Diagnostics', status: '10 Biomarkers Parsed', time: 'Aug 15', color: 'text-emerald-400' }
              ].map((s, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-slate-800/60 last:border-0">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${s.color} bg-current`} />
                    <span className="font-medium text-slate-200">{s.name}</span>
                  </div>
                  <span className="text-slate-400 text-[11px]">{s.time}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* MODAL: Transparent Vital Score Calculation Formula */}
      {showFormulaModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">Vital Score Formula Transparency</h3>
              </div>
              <button
                onClick={() => setShowFormulaModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Unlike black-box fitness algorithms, VITALOS computes your daily readiness using verifiable, weighted physiological dimensions:
            </p>

            <div className="space-y-3">
              {formulaBreakdown.map((item, idx) => (
                <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{item.label}</span>
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400">
                        Weight: {item.weight}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 mt-0.5 block">{item.metricRef}</span>
                  </div>
                  <span className="text-sm font-black text-cyan-400">{item.value}/100</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Overall: <strong className="text-white">{dynamicVitalScore.overall} / 100</strong> ({dynamicVitalScore.status})</span>
              <button
                onClick={() => setShowFormulaModal(false)}
                className="px-3 py-1 rounded bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
