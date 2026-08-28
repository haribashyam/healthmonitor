import React, { useState } from 'react';
import {
  AlertTriangle,
  AlertOctagon,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Activity,
  RotateCcw,
  CheckCircle2,
  FlaskConical,
  XCircle,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  Zap
} from 'lucide-react';
import {
  VitalInsightAlert,
  InsightEngineReport,
} from '../types';
import {
  SensitivityLevel,
  SIMULATION_PRESETS
} from '../utils/insightEngine';

interface VitalAlertCardsProps {
  report: InsightEngineReport;
  sensitivity: SensitivityLevel;
  onSelectSensitivity: (level: SensitivityLevel) => void;
  onApplySimulationPreset: (presetId: string) => void;
  activePresetId: string;
  onDowngradeWorkout: () => void;
  isWorkoutDowngraded: boolean;
  onNavigateTab: (tab: string) => void;
  onOpenAskWithPrompt?: (prompt: string) => void;
  onReScan: () => void;
  isScanning?: boolean;
  theme?: 'dark' | 'light';
}

export const VitalAlertCards: React.FC<VitalAlertCardsProps> = ({
  report,
  sensitivity,
  onSelectSensitivity,
  onApplySimulationPreset,
  activePresetId,
  onDowngradeWorkout,
  isWorkoutDowngraded,
  onNavigateTab,
  onOpenAskWithPrompt,
  onReScan,
  isScanning = false,
  theme = 'dark'
}) => {
  const [dismissedAlertIds, setDismissedAlertIds] = useState<string[]>([]);
  const isDark = theme === 'dark';

  const activeAlerts = report.alerts.filter(a => !dismissedAlertIds.includes(a.id));

  const handleDismiss = (id: string) => {
    setDismissedAlertIds(prev => [...prev, id]);
  };

  const handleActionClick = (action: any, alert: VitalInsightAlert) => {
    if (action.actionType === 'downgrade_workout') {
      onDowngradeWorkout();
    } else if (action.actionType === 'open_ask') {
      if (onOpenAskWithPrompt) {
        onOpenAskWithPrompt(
          `Explain my latest ${alert.metricName} anomaly (${alert.currentValue} vs ${alert.baselineValue} baseline) and recommend a personalized recovery protocol.`
        );
      } else {
        onNavigateTab('coach');
      }
    } else if (action.actionType === 'open_vitals') {
      onNavigateTab('vitals');
    } else if (action.actionType === 'open_doctor_report') {
      onNavigateTab('command');
    }
  };

  return (
    <section
      className={`${
        isDark ? 'bg-[#141414] border-[#262626] text-[#F9F9F7]' : 'bg-[#FFFFFF] border-[#111111] text-[#111111] hard-shadow-sm'
      } border-2 p-6 space-y-4 select-none transition-colors`}
      id="vital-insight-engine-section"
    >
      {/* Top Header Controls Bar */}
      <div className={`flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b ${isDark ? 'border-[#262626]' : 'border-[#E2E2DC]'} pb-4`}>
        {/* Left: Engine Info & Baseline text */}
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <h3 className="text-xl font-serif font-black uppercase tracking-tight">
              Automated Insight Engine
            </h3>
            <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 border ${
              isDark ? 'border-[#333333] bg-[#1E1E1E] text-[#AAAAAA]' : 'border-[#CCCCCC] bg-[#F2F2EC] text-[#555555]'
            }`}>
              {report.engineVersion || '1.4.0-BIOENGINE'}
            </span>

            {report.overallRiskLevel === 'high' ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 font-mono text-[10px] font-bold uppercase bg-[#CC0000] text-white">
                <AlertOctagon className="w-3 h-3" /> HIGH ANOMALY RISK
              </span>
            ) : report.overallRiskLevel === 'elevated' ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 font-mono text-[10px] font-bold uppercase bg-[#CC0000]/15 text-[#CC0000] border border-[#CC0000]/50">
                <AlertTriangle className="w-3 h-3 text-[#CC0000]" /> ELEVATED AUTONOMIC STRAIN
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-emerald-600 bg-emerald-500/10 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> AUTONOMIC HOMEOSTASIS
              </span>
            )}
          </div>

          <p className={`text-xs font-mono leading-relaxed max-w-4xl ${isDark ? 'text-[#888888]' : 'text-[#666666]'}`}>
            Continuously computing 14-day rolling baselines (HRV RMSSD: <strong className={isDark ? 'text-white' : 'text-black'}>{report.baselines?.hrvBaseline || 65.2}ms ± {report.baselines?.hrvStdDev || 4.8}</strong>, Resting HR: <strong className={isDark ? 'text-white' : 'text-black'}>{report.baselines?.rhrBaseline || 58.6} BPM</strong>) to detect autonomic strain and negative trends.
          </p>
        </div>

        {/* Right: Sensitivity Controls & Scan Button */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          <div className={`flex items-center border ${isDark ? 'border-[#333333] bg-[#1A1A1A]' : 'border-[#CCCCCC] bg-[#F2F2EC]'}`}>
            <span className={`text-[10px] font-bold uppercase px-2 ${isDark ? 'text-[#888888] border-r border-[#333333]' : 'text-[#666666] border-r border-[#CCCCCC]'}`}>
              SENSITIVITY:
            </span>
            {(['conservative', 'standard', 'aggressive'] as SensitivityLevel[]).map((level, idx) => (
              <button
                key={level}
                onClick={() => onSelectSensitivity(level)}
                className={`px-2.5 py-1 text-[10px] font-bold uppercase transition-colors ${idx !== 0 ? (isDark ? 'border-l border-[#333333]' : 'border-l border-[#CCCCCC]') : ''} ${
                  sensitivity === level
                    ? isDark ? 'bg-white text-[#111111]' : 'bg-[#111111] text-white'
                    : isDark ? 'bg-transparent text-[#888888] hover:text-white' : 'bg-transparent text-[#666666] hover:text-black'
                }`}
              >
                {level === 'conservative' ? 'STRICT (2.0σ)' : level === 'standard' ? 'STANDARD (1.5σ)' : 'SENSITIVE (1.1σ)'}
              </button>
            ))}
          </div>

          <button
            onClick={onReScan}
            disabled={isScanning}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 font-bold uppercase transition-all text-xs border ${
              isDark
                ? 'bg-white text-[#111111] hover:bg-[#EAEAEA] border-white'
                : 'bg-[#111111] text-white hover:bg-[#222222] border-[#111111]'
            }`}
          >
            <RotateCcw className={`w-3 h-3 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'SCANNING...' : 'SCAN NOW'}</span>
          </button>
        </div>
      </div>

      {/* Preset simulation buttons along bottom */}
      <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-xs">
        <span className={`text-[11px] font-bold uppercase mr-1 ${isDark ? 'text-[#888888]' : 'text-[#666666]'}`}>
          TEST PRESETS:
        </span>
        {SIMULATION_PRESETS.map((preset) => {
          const isActive = activePresetId === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => onApplySimulationPreset(preset.id)}
              className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition-colors border ${
                isActive
                  ? 'bg-[#CC0000] text-white border-[#CC0000]'
                  : isDark
                  ? 'bg-[#1C1C1C] text-[#AAAAAA] border-[#333333] hover:text-white hover:border-[#555555]'
                  : 'bg-[#F2F2EC] text-[#555555] border-[#CCCCCC] hover:text-black hover:border-black'
              }`}
            >
              {preset.id === 'normal' && '● NORMAL BASELINE'}
              {preset.id === 'overtraining_spike' && '⚡ OVERTRAINING CRASH'}
              {preset.id === 'illness_stress' && '🦠 IMMUNE STRESS'}
              {preset.id === 'late_meal_alcohol' && '🍷 LATE MEAL DIP'}
              {preset.id === 'supercompensation' && '🚀 SUPERCOMPENSATION'}
            </button>
          );
        })}
      </div>

      {/* Alert items if any */}
      {activeAlerts.length > 0 && (
        <div className={`space-y-3 pt-3 border-t ${isDark ? 'border-[#262626]' : 'border-[#E2E2DC]'}`}>
          {activeAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 border ${
                isDark ? 'bg-[#181818]' : 'bg-[#F9F9F6]'
              } ${
                alert.severity === 'critical' ? 'border-[#CC0000] border-l-4' : isDark ? 'border-[#333333] border-l-4 border-l-white' : 'border-[#CCCCCC] border-l-4 border-l-[#111111]'
              } space-y-3`}
            >
              <div className="flex flex-col sm:flex-row items-start justify-between gap-2 font-mono text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 font-bold uppercase text-[10px] ${
                      alert.severity === 'critical' ? 'bg-[#CC0000] text-white' : isDark ? 'bg-white text-[#111111]' : 'bg-[#111111] text-white'
                    }`}>
                      {alert.severity === 'critical' ? 'CRITICAL ANOMALY' : 'TREND WARNING'}
                    </span>
                    <span className={`font-bold ${isDark ? 'text-white' : 'text-black'}`}>{alert.title}</span>
                  </div>
                  <p className={`text-[11px] mt-1 ${isDark ? 'text-[#888888]' : 'text-[#666666]'}`}>
                    {alert.clinicalInsight}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start">
                  <span className="text-[#CC0000] font-bold text-xs">{alert.deviationText}</span>
                  <button
                    onClick={() => handleDismiss(alert.id)}
                    className={`p-1 ${isDark ? 'text-[#666666] hover:text-white' : 'text-[#888888] hover:text-black'}`}
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Action buttons inside alert */}
              <div className={`flex flex-wrap items-center gap-2 pt-2 border-t ${isDark ? 'border-[#2A2A2A]' : 'border-[#EAEAE4]'} font-mono text-xs`}>
                {alert.suggestedActions.map((act) => (
                  <button
                    key={act.id}
                    onClick={() => handleActionClick(act, alert)}
                    className={`px-3 py-1 font-bold uppercase text-[10px] border transition-colors ${
                      isDark
                        ? 'bg-white text-[#111111] hover:bg-[#E0E0E0] border-white'
                        : 'bg-[#111111] text-white hover:bg-[#222222] border-[#111111]'
                    }`}
                  >
                    {act.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
