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
  isScanning = false
}) => {
  const [dismissedAlertIds, setDismissedAlertIds] = useState<string[]>([]);
  const [expandedMechanismId, setExpandedMechanismId] = useState<string | null>(null);
  const [showDismissedArchive, setShowDismissedArchive] = useState<boolean>(false);

  const activeAlerts = report.alerts.filter(a => !dismissedAlertIds.includes(a.id));
  const dismissedAlerts = report.alerts.filter(a => dismissedAlertIds.includes(a.id));

  const handleDismiss = (id: string) => {
    setDismissedAlertIds(prev => [...prev, id]);
  };

  const handleRestore = (id: string) => {
    setDismissedAlertIds(prev => prev.filter(item => item !== id));
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

  const renderSparkline = (data?: { date: string; value: number; baseline: number }[]) => {
    if (!data || data.length < 2) return null;

    const values = data.map(d => d.value);
    const baselines = data.map(d => d.baseline);
    const minVal = Math.min(...values, ...baselines) - 4;
    const maxVal = Math.max(...values, ...baselines) + 4;
    const range = maxVal - minVal || 1;

    const width = 220;
    const height = 40;
    const padding = 4;

    const getX = (idx: number) => padding + (idx / (data.length - 1)) * (width - 2 * padding);
    const getY = (val: number) => height - padding - ((val - minVal) / range) * (height - 2 * padding);

    const baselineY = getY(data[0].baseline);
    const pointsStr = data.map((d, i) => `${getX(i)},${getY(d.value)}`).join(' ');
    const latestPoint = { x: getX(data.length - 1), y: getY(data[data.length - 1].value), val: data[data.length - 1].value };

    return (
      <div className="bg-[#181818] p-2 border border-[#2A2A2A]">
        <svg width={width} height={height} className="overflow-visible w-full">
          <line
            x1={padding}
            y1={baselineY}
            x2={width - padding}
            y2={baselineY}
            stroke="#555555"
            strokeDasharray="2 2"
            strokeWidth="1"
          />
          <polyline
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2"
            points={pointsStr}
          />
          <circle
            cx={latestPoint.x}
            cy={latestPoint.y}
            r="4"
            className="fill-[#CC0000] stroke-white stroke-1"
          />
        </svg>
        <div className="flex justify-between text-[9px] text-[#888888] font-mono mt-1">
          <span>{data[0].date}</span>
          <span>BASE ({Math.round(data[0].baseline)})</span>
          <span className="font-bold text-[#CC0000]">NOW ({latestPoint.val})</span>
        </div>
      </div>
    );
  };

  return (
    <section className="bg-[#141414] border border-[#262626] p-6 text-[#F9F9F7] space-y-4 select-none" id="vital-insight-engine-section">
      
      {/* Top Header Controls Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#262626] pb-4">
        
        {/* Left: Engine Info & Baseline text */}
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <h3 className="text-xl font-serif font-black text-white uppercase tracking-tight">
              Automated Insight Engine
            </h3>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 border border-[#333333] bg-[#1E1E1E] text-[#AAAAAA]">
              {report.engineVersion || '1.4.0-BIOENGINE'}
            </span>

            {report.overallRiskLevel === 'high' ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 font-mono text-[10px] font-bold uppercase bg-[#CC0000] text-white">
                <AlertOctagon className="w-3 h-3" /> HIGH ANOMALY RISK
              </span>
            ) : report.overallRiskLevel === 'elevated' ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 font-mono text-[10px] font-bold uppercase bg-[#CC0000]/20 text-[#CC0000] border border-[#CC0000]/50">
                <AlertTriangle className="w-3 h-3 text-[#CC0000]" /> ELEVATED AUTONOMIC STRAIN
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-[#4ADE80] bg-[#4ADE80]/10 border border-[#4ADE80]/30">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80]" /> AUTONOMIC HOMEOSTASIS
              </span>
            )}
          </div>

          <p className="text-xs font-mono text-[#888888] leading-relaxed max-w-4xl">
            Continuously computing 14-day rolling baselines (HRV RMSSD: <strong className="text-white">{report.baselines?.hrvBaseline || 65.2}ms ± {report.baselines?.hrvStdDev || 4.8}</strong>, Resting HR: <strong className="text-white">{report.baselines?.rhrBaseline || 58.6} BPM</strong>) to detect autonomic strain and negative trends.
          </p>
        </div>

        {/* Right: Sensitivity Controls & Scan Button */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          
          <div className="flex items-center border border-[#333333] bg-[#1A1A1A]">
            <span className="text-[10px] font-bold uppercase px-2 text-[#888888] border-r border-[#333333]">
              SENSITIVITY:
            </span>
            {(['conservative', 'standard', 'aggressive'] as SensitivityLevel[]).map((level, idx) => (
              <button
                key={level}
                onClick={() => onSelectSensitivity(level)}
                className={`px-2.5 py-1 text-[10px] font-bold uppercase transition-colors ${idx !== 0 ? 'border-l border-[#333333]' : ''} ${
                  sensitivity === level
                    ? 'bg-white text-[#111111]'
                    : 'bg-transparent text-[#888888] hover:text-white'
                }`}
              >
                {level === 'conservative' ? 'STRICT (2.0σ)' : level === 'standard' ? 'STANDARD (1.5σ)' : 'SENSITIVE (1.1σ)'}
              </button>
            ))}
          </div>

          <button
            onClick={onReScan}
            disabled={isScanning}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 font-bold uppercase bg-white text-[#111111] hover:bg-[#EAEAEA] border border-white transition-all text-xs"
          >
            <RotateCcw className={`w-3 h-3 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'SCANNING...' : 'SCAN NOW'}</span>
          </button>
        </div>

      </div>

      {/* Preset simulation buttons along bottom */}
      <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-xs">
        <span className="text-[11px] font-bold text-[#888888] uppercase mr-1">
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
                  : 'bg-[#1C1C1C] text-[#AAAAAA] border-[#333333] hover:text-white hover:border-[#555555]'
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
        <div className="space-y-3 pt-3 border-t border-[#262626]">
          {activeAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 bg-[#181818] border ${
                alert.severity === 'critical' ? 'border-[#CC0000] border-l-4' : 'border-[#333333] border-l-4 border-l-white'
              } space-y-3`}
            >
              <div className="flex flex-col sm:flex-row items-start justify-between gap-2 font-mono text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 font-bold uppercase text-[10px] ${
                      alert.severity === 'critical' ? 'bg-[#CC0000] text-white' : 'bg-white text-[#111111]'
                    }`}>
                      {alert.severity === 'critical' ? 'CRITICAL ANOMALY' : 'TREND WARNING'}
                    </span>
                    <span className="text-white font-bold">{alert.title}</span>
                  </div>
                  <p className="text-[#888888] text-[11px] mt-1">
                    {alert.clinicalInsight}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start">
                  <span className="text-[#CC0000] font-bold text-xs">{alert.deviationText}</span>
                  <button
                    onClick={() => handleDismiss(alert.id)}
                    className="text-[#666666] hover:text-white p-1"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Action buttons inside alert */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#2A2A2A] font-mono text-xs">
                {alert.suggestedActions.map((act) => (
                  <button
                    key={act.id}
                    onClick={() => handleActionClick(act, alert)}
                    className="px-3 py-1 bg-white text-[#111111] hover:bg-[#E0E0E0] font-bold uppercase text-[10px]"
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
