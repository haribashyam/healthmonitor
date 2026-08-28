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
  FileSpreadsheet,
  Maximize2
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
  isConnecting?: boolean;
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
  onOpenSpecialDesks?: () => void;
  theme?: 'dark' | 'light';
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  vitalScore,
  liveBpm,
  isBleConnected,
  bleDeviceName,
  isConnecting = false,
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
  onOpenWorkspace,
  onOpenSpecialDesks,
  theme = 'dark'
}) => {
  const [sensitivity, setSensitivity] = useState<SensitivityLevel>('standard');
  const [activePresetId, setActivePresetId] = useState('normal');
  const [isScanning, setIsScanning] = useState(false);
  const [downgraded, setDowngraded] = useState(false);

  const isDark = theme === 'dark';

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
    <div className={`space-y-8 ${isDark ? 'text-[#F9F9F7]' : 'text-[#111111]'}`}>
      {/* 1. Hero Lead Story with Vital Score Gauge */}
      <HeroLead
        vitalScore={vitalScore}
        liveBpm={liveBpm}
        latestSleep={latestSleep}
        bleDeviceName={bleDeviceName}
        isBleConnected={isBleConnected}
        isConnecting={isConnecting}
        onOpenLiveWorkout={onOpenLiveWorkout}
        onOpenWhatChanged={onOpenWhatChanged}
        onOpenDoctorReport={onOpenDoctorReport}
        onOpenAsk={onOpenAsk}
        onOpenWorkspace={onOpenWorkspace}
        theme={theme}
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
        theme={theme}
      />

      {/* 3. 4-Column Newspaper Vital Signals Grid */}
      <VitalSignals
        liveBpm={liveBpm}
        latestSleep={latestSleep}
        activities={activities}
        biomarkers={biomarkers}
        bleDeviceName={bleDeviceName}
        isBleConnected={isBleConnected}
        isConnecting={isConnecting}
        onNavigateTab={onNavigateTab}
        onOpenLiveWorkout={onOpenLiveWorkout}
        theme={theme}
      />

      {/* 4. Editorial Protocols & Specialized Intelligence Desks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Today's Calibrated Protocol Split */}
        <div className={`lg:col-span-2 border ${
          isDark ? 'bg-[#141414] border-[#262626]' : 'bg-[#FFFFFF] border-[#111111] hard-shadow-sm'
        } p-6 space-y-5 transition-colors`}>
          <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b ${isDark ? 'border-[#262626]' : 'border-[#E2E2DC]'} pb-3`}>
            <div>
              <span className={`text-[10px] font-mono font-bold uppercase tracking-widest ${isDark ? 'text-[#888888]' : 'text-[#666666]'} block`}>
                DAILY PRESCRIPTION
              </span>
              <h3 className={`text-xl font-serif font-black uppercase ${isDark ? 'text-white' : 'text-[#111111]'} tracking-tight`}>
                TODAY&apos;S BIO-ADAPTIVE PROTOCOL
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab('coach')}
              className="text-xs font-mono font-bold uppercase text-[#CC0000] hover:text-black dark:hover:text-white flex items-center gap-1 self-start sm:self-auto transition-colors"
            >
              <span>FULL 7-DAY SCHEDULE</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
            {/* Workout Module */}
            <div
              className={`p-4 border flex flex-col justify-between space-y-3 ${
                isDark ? 'bg-[#181818] border-[#2A2A2A]' : 'bg-[#F9F9F6] border-[#D4D4CE]'
              } ${downgraded ? 'border-l-4 border-l-[#CC0000]' : ''}`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className={`font-bold uppercase tracking-wider text-[11px] ${isDark ? 'text-[#AAAAAA]' : 'text-[#555555]'}`}>
                    TARGET SESSION
                  </span>
                  <span className={`px-1.5 py-0.5 border text-[10px] font-bold uppercase ${
                    isDark ? 'border-[#333333] text-[#888888]' : 'border-[#CCCCCC] text-[#666666]'
                  }`}>
                    {downgraded ? 'RECOVERY (DELOAD)' : todayWorkout.intensity.toUpperCase()}
                  </span>
                </div>

                <h4 className={`font-serif font-bold text-base ${isDark ? 'text-white' : 'text-[#111111]'}`}>
                  {downgraded ? '30-Min Gentle Mobility & Zone 1 Flow' : todayWorkout.title}
                </h4>
                <p className={`font-mono text-xs mt-1 leading-relaxed ${isDark ? 'text-[#888888]' : 'text-[#666666]'}`}>
                  {downgraded
                    ? 'Substituted high-strain cardiovascular block with soft-tissue mobility to accelerate parasympathetic recovery.'
                    : todayWorkout.sourceRationale}
                </p>
              </div>

              <div>
                <div className={`flex items-center gap-4 text-xs py-2 border-t ${
                  isDark ? 'border-[#262626] text-[#AAAAAA]' : 'border-[#EAEAE4] text-[#666666]'
                }`}>
                  <span>TIME: {downgraded ? '30 MINS' : todayWorkout.duration.toUpperCase()}</span>
                  <span>HR: {downgraded ? '< 110 BPM' : todayWorkout.targetHR}</span>
                </div>

                <button
                  onClick={onOpenLiveWorkout}
                  className={`w-full py-2 border transition-colors font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 text-xs ${
                    isDark
                      ? 'bg-white text-[#111111] hover:bg-[#EAEAEA] border-white'
                      : 'bg-[#111111] text-white hover:bg-[#222222] border-[#111111]'
                  }`}
                >
                  <Radio className="w-3.5 h-3.5 text-[#CC0000]" />
                  <span>START LIVE TELEMETRY HUD</span>
                </button>
              </div>
            </div>

            {/* Nutrition & Fueling Target */}
            <div className={`p-4 border flex flex-col justify-between space-y-3 ${
              isDark ? 'bg-[#181818] border-[#2A2A2A]' : 'bg-[#F9F9F6] border-[#D4D4CE]'
            }`}>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className={`font-bold uppercase tracking-wider text-[11px] ${isDark ? 'text-[#AAAAAA]' : 'text-[#555555]'}`}>
                    MACRO ALLOCATION
                  </span>
                  <span className={`px-1.5 py-0.5 border text-[10px] font-bold ${
                    isDark ? 'border-[#333333] text-white' : 'border-[#CCCCCC] text-black'
                  }`}>
                    {adaptivePlan.nutritionTargets.dailyCalories} KCAL
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center my-3">
                  <div className={`p-2 border ${isDark ? 'border-[#2A2A2A] bg-[#141414]' : 'border-[#D4D4CE] bg-white'}`}>
                    <span className={`text-[9px] uppercase block ${isDark ? 'text-[#888888]' : 'text-[#666666]'}`}>PROTEIN</span>
                    <span className={`text-base font-serif font-black ${isDark ? 'text-white' : 'text-[#111111]'}`}>{adaptivePlan.nutritionTargets.proteinGrams}G</span>
                  </div>
                  <div className={`p-2 border ${isDark ? 'border-[#2A2A2A] bg-[#141414]' : 'border-[#D4D4CE] bg-white'}`}>
                    <span className={`text-[9px] uppercase block ${isDark ? 'text-[#888888]' : 'text-[#666666]'}`}>CARBS</span>
                    <span className={`text-base font-serif font-black ${isDark ? 'text-white' : 'text-[#111111]'}`}>{adaptivePlan.nutritionTargets.carbGrams}G</span>
                  </div>
                  <div className={`p-2 border ${isDark ? 'border-[#2A2A2A] bg-[#141414]' : 'border-[#D4D4CE] bg-white'}`}>
                    <span className={`text-[9px] uppercase block ${isDark ? 'text-[#888888]' : 'text-[#666666]'}`}>FATS</span>
                    <span className={`text-base font-serif font-black ${isDark ? 'text-white' : 'text-[#111111]'}`}>{adaptivePlan.nutritionTargets.fatGrams}G</span>
                  </div>
                </div>

                <p className={`font-mono text-xs leading-snug ${isDark ? 'text-[#888888]' : 'text-[#666666]'}`}>
                  Calibrated to sustain glycogen synthesis while keeping fasting interstitial glucose steady under 95 mg/dL.
                </p>
              </div>

              <button
                onClick={() => onNavigateTab('vitals')}
                className={`w-full py-2 border transition-colors font-bold uppercase tracking-wider flex items-center justify-center gap-1 text-xs ${
                  isDark
                    ? 'bg-[#202020] hover:bg-[#2A2A2A] text-white border-[#333333]'
                    : 'bg-[#EAEAE4] hover:bg-[#DCDCD4] text-[#111111] border-[#CCCCCC]'
                }`}
              >
                <span>LOG MEAL &amp; GLYCEMIC RESPONSE</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Specialized Editorial Health Desks */}
        <div className={`border ${
          isDark ? 'bg-[#141414] border-[#262626]' : 'bg-[#FFFFFF] border-[#111111] hard-shadow-sm'
        } p-6 space-y-3 transition-colors`}>
          <div className={`border-b ${isDark ? 'border-[#262626]' : 'border-[#E2E2DC]'} pb-2 flex items-center justify-between`}>
            <div>
              <span className={`text-[10px] font-mono font-bold uppercase tracking-widest ${isDark ? 'text-[#888888]' : 'text-[#666666]'} block`}>
                SPECIAL EDITIONS
              </span>
              <h3 className={`text-base font-serif font-black uppercase ${isDark ? 'text-white' : 'text-[#111111]'}`}>
                SPECIALIZED DESKS &amp; HUBS
              </h3>
            </div>

            {onOpenSpecialDesks && (
              <button
                onClick={onOpenSpecialDesks}
                className="px-2 py-1 bg-[#CC0000] text-white text-[10px] font-mono font-bold uppercase flex items-center gap-1 hover:bg-red-700 transition-colors"
                title="Enlarge all desks into full-screen directory"
              >
                <Maximize2 className="w-3 h-3" />
                <span>ENLARGE ⛶</span>
              </button>
            )}
          </div>

          <div className="space-y-2 font-mono">
            <QuickDeskItem
              icon={FileSpreadsheet}
              label="GOOGLE WORKSPACE &amp; EHR"
              sub="Gmail Sync, Sheets Export, Drive Vault"
              onClick={onOpenWorkspace || (() => onNavigateTab('clinician'))}
              isDark={isDark}
            />
            <QuickDeskItem
              icon={Dumbbell}
              label="STRENGTH &amp; 1RM ARCHIVE"
              sub="Hypertrophy velocity &amp; load tracking"
              onClick={() => onNavigateTab('strength')}
              isDark={isDark}
            />
            <QuickDeskItem
              icon={Scale}
              label="BODY COMPOSITION &amp; DEXA"
              sub="Skeletal mass, visceral fat, bone index"
              onClick={() => onNavigateTab('metabolic')}
              isDark={isDark}
            />
            <QuickDeskItem
              icon={Pill}
              label="MEDICATION &amp; SUPPLEMENT MATRIX"
              sub="Pharmacokinetics &amp; interaction audit"
              onClick={() => onNavigateTab('supplements')}
              isDark={isDark}
            />
            <QuickDeskItem
              icon={Sun}
              label="CIRCADIAN &amp; ENVIRONMENT"
              sub="Sunlight timing, PM2.5 AQI &amp; therapy"
              onClick={() => onNavigateTab('circadian')}
              isDark={isDark}
            />
            <QuickDeskItem
              icon={Brain}
              label="COGNITIVE &amp; NEURO-WELLNESS"
              sub="Focus state, reaction speed &amp; EEG"
              onClick={() => onNavigateTab('focus')}
              isDark={isDark}
            />
          </div>
        </div>

      </div>
    </div>
  );
};

function QuickDeskItem({ icon: Icon, label, sub, onClick, isDark }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-2.5 border transition-colors flex items-center justify-between group ${
        isDark
          ? 'bg-[#181818] hover:bg-[#222222] text-white border-[#2A2A2A]'
          : 'bg-[#F9F9F6] hover:bg-[#EFEFEA] text-[#111111] border-[#D4D4CE]'
      }`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div className={`w-7 h-7 border flex items-center justify-center transition-colors flex-shrink-0 ${
          isDark
            ? 'border-[#333333] bg-[#141414] text-white group-hover:bg-white group-hover:text-black'
            : 'border-[#CCCCCC] bg-[#FFFFFF] text-[#111111] group-hover:bg-[#111111] group-hover:text-white'
        }`}>
          <Icon className="w-3.5 h-3.5" />
        </div>
        <div className="truncate">
          <span className={`text-xs font-bold font-mono uppercase block truncate ${isDark ? 'text-white' : 'text-[#111111]'}`}>
            {label}
          </span>
          <span className={`text-[10px] block truncate ${isDark ? 'text-[#888888] group-hover:text-[#AAAAAA]' : 'text-[#666666] group-hover:text-[#333333]'}`}>
            {sub}
          </span>
        </div>
      </div>
      <ChevronRight className={`w-3.5 h-3.5 flex-shrink-0 ml-2 ${isDark ? 'text-[#888888] group-hover:text-white' : 'text-[#888888] group-hover:text-black'}`} />
    </button>
  );
}
