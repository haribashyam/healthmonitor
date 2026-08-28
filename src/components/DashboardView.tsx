import React, { useState, useMemo } from 'react';
import {
  Heart,
  Moon,
  Flame,
  Clock,
  ChevronRight,
  Radio,
  FileText,
  Sparkles,
  Zap,
  ShieldCheck,
  Activity,
  Dumbbell,
  Pill,
  Sun,
  Scale,
  Brain,
  FileSpreadsheet
} from 'lucide-react';
import {
  VitalScore,
  Activity as ActivityType,
  SleepRecord,
  Biomarker,
  AdaptivePlan,
  WorkoutPlanDay
} from '../types';
import { analyzeVitalData, SensitivityLevel } from '../utils/insightEngine';
import { HeroLead } from './HeroLead';
import { VitalSignals } from './VitalSignals';
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
  onOpenWorkspace?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
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
  onOpenDoctorReport,
  onOpenAsk,
  onOpenAskWithPrompt,
  onNavigateTab,
  onOpenWorkspace
}) => {
  const [sensitivity, setSensitivity] = useState<SensitivityLevel>('standard');
  const [activePresetId, setActivePresetId] = useState('normal');
  const [isScanning, setIsScanning] = useState(false);
  const [downgraded, setDowngraded] = useState(false);

  const insightReport = useMemo(
    () => analyzeVitalData(sleepRecords, activities, biomarkers, sensitivity),
    [sleepRecords, activities, biomarkers, sensitivity]
  );

  const latestSleep = sleepRecords[0] || {
    totalMinutes: 462,
    hrvAvg: 64,
    restingHr: 59,
    sleepScore: 88,
    deepMinutes: 94,
    remMinutes: 112,
    efficiency: 93
  };

  const handlePreset = (id: string) => {
    setActivePresetId(id);
    if (id === 'overtraining_spike' || id === 'illness_stress') setDowngraded(true);
    else if (id === 'normal' || id === 'supercompensation') setDowngraded(false);
  };

  const handleReScan = () => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 400);
  };

  const todayWorkout: WorkoutPlanDay = adaptivePlan.workoutSplit[2] || {
    day: 'Wednesday',
    title: 'Active Recovery & Mobility',
    duration: '30 mins',
    targetHR: '< 110 BPM',
    intensity: 'Recovery',
    sourceRationale: 'Mid-week HRV stabilization.'
  };

  return (
    <div className="space-y-8 text-[#F9F9F7]">
      {/* 1. Hero Lead Story with Vital Score Gauge */}
      <HeroLead
        vitalScore={vitalScore}
        liveBpm={liveBpm}
        latestSleep={latestSleep}
        bleDeviceName={bleDeviceName}
        onOpenLiveWorkout={onOpenLiveWorkout}
        onOpenWhatChanged={onOpenWhatChanged}
        onOpenDoctorReport={onOpenDoctorReport}
        onOpenAsk={onOpenAsk}
        onOpenWorkspace={onOpenWorkspace}
      />

      {/* 2. Automated Insight & Anomaly Wire Engine */}
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

      {/* 3. 4-Column Newspaper Vital Signals Grid */}
      <VitalSignals
        liveBpm={liveBpm}
        latestSleep={latestSleep}
        activities={activities}
        biomarkers={biomarkers}
        bleDeviceName={bleDeviceName}
        onNavigateTab={onNavigateTab}
        onOpenLiveWorkout={onOpenLiveWorkout}
      />

      {/* 4. Editorial Protocols & Specialized Intelligence Desks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Today's Calibrated Protocol Split */}
        <div className="lg:col-span-2 bg-[#141414] border border-[#262626] p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#262626] pb-3">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#888888] block">
                DAILY PRESCRIPTION
              </span>
              <h3 className="text-xl font-serif font-black uppercase text-white tracking-tight">
                TODAY&apos;S BIO-ADAPTIVE PROTOCOL
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab('coach')}
              className="text-xs font-mono font-bold uppercase text-[#CC0000] hover:text-white flex items-center gap-1 self-start sm:self-auto"
            >
              <span>FULL 7-DAY SCHEDULE</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
            {/* Workout Module */}
            <div
              className={`p-4 border border-[#2A2A2A] bg-[#181818] flex flex-col justify-between space-y-3 ${
                downgraded ? 'border-l-4 border-l-[#CC0000]' : ''
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-[#AAAAAA] uppercase tracking-wider text-[11px]">
                    TARGET SESSION
                  </span>
                  <span className="px-1.5 py-0.5 border border-[#333333] text-[10px] font-bold uppercase text-[#888888]">
                    {downgraded ? 'RECOVERY (DELOAD)' : todayWorkout.intensity.toUpperCase()}
                  </span>
                </div>

                <h4 className="font-serif font-bold text-base text-white">
                  {downgraded ? '30-Min Gentle Mobility & Zone 1 Flow' : todayWorkout.title}
                </h4>
                <p className="font-mono text-xs text-[#888888] mt-1 leading-relaxed">
                  {downgraded
                    ? 'Substituted high-strain cardiovascular block with soft-tissue mobility to accelerate parasympathetic recovery.'
                    : todayWorkout.sourceRationale}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-4 text-xs text-[#AAAAAA] py-2 border-t border-[#262626]">
                  <span>TIME: {downgraded ? '30 MINS' : todayWorkout.duration.toUpperCase()}</span>
                  <span>HR: {downgraded ? '< 110 BPM' : todayWorkout.targetHR}</span>
                </div>

                <button
                  onClick={onOpenLiveWorkout}
                  className="w-full py-2 bg-white text-[#111111] hover:bg-[#EAEAEA] border border-white transition-colors font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 text-xs"
                >
                  <Radio className="w-3.5 h-3.5 text-[#CC0000]" />
                  <span>START LIVE TELEMETRY HUD</span>
                </button>
              </div>
            </div>

            {/* Nutrition & Fueling Target */}
            <div className="p-4 border border-[#2A2A2A] bg-[#181818] flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-[#AAAAAA] uppercase tracking-wider text-[11px]">
                    MACRO ALLOCATION
                  </span>
                  <span className="px-1.5 py-0.5 border border-[#333333] text-[10px] font-bold text-white">
                    {adaptivePlan.nutritionTargets.dailyCalories} KCAL
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center my-3">
                  <div className="p-2 border border-[#2A2A2A] bg-[#141414]">
                    <span className="text-[9px] text-[#888888] uppercase block">PROTEIN</span>
                    <span className="text-base font-serif font-black text-white">{adaptivePlan.nutritionTargets.proteinGrams}G</span>
                  </div>
                  <div className="p-2 border border-[#2A2A2A] bg-[#141414]">
                    <span className="text-[9px] text-[#888888] uppercase block">CARBS</span>
                    <span className="text-base font-serif font-black text-white">{adaptivePlan.nutritionTargets.carbGrams}G</span>
                  </div>
                  <div className="p-2 border border-[#2A2A2A] bg-[#141414]">
                    <span className="text-[9px] text-[#888888] uppercase block">FATS</span>
                    <span className="text-base font-serif font-black text-white">{adaptivePlan.nutritionTargets.fatGrams}G</span>
                  </div>
                </div>

                <p className="font-mono text-xs text-[#888888] leading-snug">
                  Calibrated to sustain glycogen synthesis while keeping fasting interstitial glucose steady under 95 mg/dL.
                </p>
              </div>

              <button
                onClick={() => onNavigateTab('vitals')}
                className="w-full py-2 bg-[#202020] hover:bg-[#2A2A2A] text-white border border-[#333333] transition-colors font-bold uppercase tracking-wider flex items-center justify-center gap-1 text-xs"
              >
                <span>LOG MEAL &amp; GLYCEMIC RESPONSE</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Specialized Editorial Health Desks */}
        <div className="bg-[#141414] border border-[#262626] p-6 space-y-3">
          <div className="border-b border-[#262626] pb-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#888888] block">
              SPECIAL EDITIONS
            </span>
            <h3 className="text-base font-serif font-black uppercase text-white">
              SPECIALIZED DESKS &amp; HUBS
            </h3>
          </div>

          <div className="space-y-2 font-mono">
            <QuickDeskItem
              icon={FileSpreadsheet}
              label="GOOGLE WORKSPACE &amp; EHR"
              sub="Gmail Sync, Sheets Export, Drive Vault"
              onClick={onOpenWorkspace || (() => onNavigateTab('clinician'))}
            />
            <QuickDeskItem
              icon={Dumbbell}
              label="STRENGTH &amp; 1RM ARCHIVE"
              sub="Hypertrophy velocity &amp; load tracking"
              onClick={() => onNavigateTab('strength')}
            />
            <QuickDeskItem
              icon={Scale}
              label="BODY COMPOSITION &amp; DEXA"
              sub="Skeletal mass, visceral fat, bone index"
              onClick={() => onNavigateTab('metabolic')}
            />
            <QuickDeskItem
              icon={Pill}
              label="MEDICATION &amp; SUPPLEMENT MATRIX"
              sub="Pharmacokinetics &amp; interaction audit"
              onClick={() => onNavigateTab('supplements')}
            />
            <QuickDeskItem
              icon={Sun}
              label="CIRCADIAN &amp; ENVIRONMENT"
              sub="Sunlight timing, PM2.5 AQI &amp; therapy"
              onClick={() => onNavigateTab('circadian')}
            />
            <QuickDeskItem
              icon={Brain}
              label="COGNITIVE &amp; NEURO-WELLNESS"
              sub="Focus state, reaction speed &amp; EEG"
              onClick={() => onNavigateTab('focus')}
            />
          </div>
        </div>

      </div>
    </div>
  );
};

function QuickDeskItem({ icon: Icon, label, sub, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left p-2.5 bg-[#181818] hover:bg-[#222222] text-white border border-[#2A2A2A] transition-colors flex items-center justify-between group"
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-7 h-7 border border-[#333333] flex items-center justify-center bg-[#141414] text-white group-hover:bg-white group-hover:text-black transition-colors flex-shrink-0">
          <Icon className="w-3.5 h-3.5" />
        </div>
        <div className="truncate">
          <span className="text-xs font-bold font-mono uppercase block truncate text-white">
            {label}
          </span>
          <span className="text-[10px] text-[#888888] group-hover:text-[#AAAAAA] block truncate">
            {sub}
          </span>
        </div>
      </div>
      <ChevronRight className="w-3.5 h-3.5 text-[#888888] group-hover:text-white flex-shrink-0 ml-2" />
    </button>
  );
}
