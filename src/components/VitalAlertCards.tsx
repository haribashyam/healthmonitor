import React, { useState } from 'react';
import {
  AlertTriangle,
  AlertOctagon,
  ShieldAlert,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Activity,
  Heart,
  Moon,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  CheckCircle2,
  SlidersHorizontal,
  Info,
  ArrowRight,
  Zap,
  BookOpen,
  FlaskConical,
  XCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import {
  VitalInsightAlert,
  InsightEngineReport,
  SleepRecord
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
  const [showSettingsDropdown, setShowSettingsDropdown] = useState<boolean>(false);
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
        onNavigateTab('ask');
      }
    } else if (action.actionType === 'open_simulator') {
      onNavigateTab('simulator');
    } else if (action.actionType === 'open_journal') {
      onNavigateTab('journal');
    } else if (action.actionType === 'open_vitals') {
      onNavigateTab('vitals');
    } else if (action.actionType === 'open_doctor_report') {
      onNavigateTab('command');
    }
  };

  // Helper for sparkline rendering
  const renderSparkline = (data?: { date: string; value: number; baseline: number; lowerBound?: number; upperBound?: number }[]) => {
    if (!data || data.length < 2) return null;

    const values = data.map(d => d.value);
    const baselines = data.map(d => d.baseline);
    const minVal = Math.min(...values, ...baselines) - 4;
    const maxVal = Math.max(...values, ...baselines) + 4;
    const range = maxVal - minVal || 1;

    const width = 220;
    const height = 48;
    const padding = 6;

    const getX = (idx: number) => padding + (idx / (data.length - 1)) * (width - 2 * padding);
    const getY = (val: number) => height - padding - ((val - minVal) / range) * (height - 2 * padding);

    const baselineY = getY(data[0].baseline);

    const pointsStr = data.map((d, i) => `${getX(i)},${getY(d.value)}`).join(' ');
    const latestPoint = { x: getX(data.length - 1), y: getY(data[data.length - 1].value), val: data[data.length - 1].value };

    return (
      <div className="flex flex-col items-end space-y-1">
        <div className="relative bg-slate-950/70 p-1.5 rounded-lg border border-slate-800/80">
          <svg width={width} height={height} className="overflow-visible">
            {/* Baseline Reference Line */}
            <line
              x1={padding}
              y1={baselineY}
              x2={width - padding}
              y2={baselineY}
              stroke="#64748b"
              strokeDasharray="3 3"
              strokeWidth="1.2"
            />
            {/* Data Line */}
            <polyline
              fill="none"
              stroke="url(#sparklineGrad)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={pointsStr}
            />
            {/* Anomaly Endpoint Circle */}
            <circle
              cx={latestPoint.x}
              cy={latestPoint.y}
              r="4.5"
              className="fill-rose-400 stroke-slate-950 stroke-2 animate-pulse"
            />
            <defs>
              <linearGradient id="sparklineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="70%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#f43f5e" />
              </linearGradient>
            </defs>
          </svg>
          <div className="flex justify-between text-[9px] text-slate-400 font-mono px-1 mt-0.5">
            <span>{data[0].date}</span>
            <span className="text-slate-400 font-semibold">Baseline ({Math.round(data[0].baseline)})</span>
            <span className="font-bold text-rose-400">Today ({latestPoint.val})</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="space-y-4" id="vital-insight-engine-section">
      
      {/* INSIGHT ENGINE CONTROL BANNER */}
      <div className="bg-slate-900/90 rounded-2xl p-4 sm:p-5 border border-slate-800 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Left: Engine Identity & Live Status */}
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center">
                <Activity className="w-4 h-4 animate-pulse" />
              </div>
              <h2 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
                Automated Insight Engine
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  {report.engineVersion}
                </span>
              </h2>

              {/* Overall Risk Level Badge */}
              {report.overallRiskLevel === 'high' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">
                  <AlertOctagon className="w-3.5 h-3.5" /> High Anomaly Risk
                </span>
              )}
              {report.overallRiskLevel === 'elevated' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  <AlertTriangle className="w-3.5 h-3.5" /> Elevated Autonomic Stress
                </span>
              )}
              {report.overallRiskLevel === 'low' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Autonomic Homeostasis
                </span>
              )}
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Continuously computing 14-day rolling baselines (HRV RMSSD: <strong className="text-slate-200">{report.baselines.hrvBaseline}ms ± {report.baselines.hrvStdDev}</strong>, Resting HR: <strong className="text-slate-200">{report.baselines.rhrBaseline} BPM</strong>) to detect autonomic strain and negative trends.
            </p>
          </div>

          {/* Right: Interactive Engine Controls */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1 lg:pt-0">
            
            {/* Sensitivity Selector */}
            <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs">
              <span className="text-[11px] font-semibold text-slate-400 px-2 flex items-center gap-1">
                <SlidersHorizontal className="w-3 h-3 text-cyan-400" />
                Sensitivity:
              </span>
              {(['conservative', 'standard', 'aggressive'] as SensitivityLevel[]).map((level) => (
                <button
                  key={level}
                  onClick={() => onSelectSensitivity(level)}
                  className={`px-2.5 py-1 rounded-lg font-semibold capitalize text-xs transition-all ${
                    sensitivity === level
                      ? 'bg-cyan-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {level === 'conservative' ? 'Strict (2.0σ)' : level === 'standard' ? 'Standard (1.5σ)' : 'Sensitive (1.1σ)'}
                </button>
              ))}
            </div>

            {/* Run Re-Scan Trigger */}
            <button
              onClick={onReScan}
              disabled={isScanning}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all disabled:opacity-50"
            >
              <RotateCcw className={`w-3.5 h-3.5 text-cyan-400 ${isScanning ? 'animate-spin' : ''}`} />
              {isScanning ? 'Scanning Telemetry...' : 'Scan Now'}
            </button>
          </div>

        </div>

        {/* TEST ANOMALY SCENARIOS (Interactive Simulation Presets) */}
        <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <FlaskConical className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-semibold text-slate-300">Test Telemetry Presets:</span>
            <span className="text-[11px] text-slate-400 hidden md:inline">
              (Simulate physiological anomalies to see real-time alert generation)
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {SIMULATION_PRESETS.map((preset) => {
              const isActive = activePresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => onApplySimulationPreset(preset.id)}
                  title={preset.description}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 border ${
                    isActive
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                      : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  {preset.id === 'overtraining_spike' && '⚡ Overtraining Crash'}
                  {preset.id === 'illness_stress' && '🦠 Immune Stress'}
                  {preset.id === 'late_meal_alcohol' && '🍷 Late Meal Dip'}
                  {preset.id === 'normal' && '✓ Normal Baseline'}
                  {preset.id === 'supercompensation' && '🚀 Supercompensation'}
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* ACTIVE ANOMALY ALERT CARDS */}
      {activeAlerts.length > 0 ? (
        <div className="space-y-3.5">
          {activeAlerts.map((alert) => {
            const isCritical = alert.severity === 'critical';
            const isWarning = alert.severity === 'warning';
            const isPositive = alert.severity === 'positive';
            const isExpanded = expandedMechanismId === alert.id;

            return (
              <div
                key={alert.id}
                id={`alert-card-${alert.id}`}
                className={`relative overflow-hidden rounded-2xl border p-4 sm:p-5 transition-all shadow-lg ${
                  isCritical
                    ? 'bg-gradient-to-br from-rose-950/40 via-slate-900 to-slate-900 border-rose-500/50 shadow-rose-950/20'
                    : isWarning
                    ? 'bg-gradient-to-br from-amber-950/35 via-slate-900 to-slate-900 border-amber-500/40 shadow-amber-950/20'
                    : isPositive
                    ? 'bg-gradient-to-br from-emerald-950/35 via-slate-900 to-slate-900 border-emerald-500/40 shadow-emerald-950/20'
                    : 'bg-slate-900 border-slate-800 shadow-slate-950/20'
                }`}
              >
                {/* Decorative subtle ambient blur */}
                <div
                  className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20 ${
                    isCritical ? 'bg-rose-500/10' : isWarning ? 'bg-amber-500/10' : 'bg-cyan-500/10'
                  }`}
                />

                <div className="relative z-10 space-y-4">
                  
                  {/* Top Bar: Alert Title, Severity Badge, Deviation Pill, Dismiss */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        {isCritical && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">
                            <AlertOctagon className="w-3.5 h-3.5" /> Critical Anomaly
                          </span>
                        )}
                        {isWarning && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
                            <AlertTriangle className="w-3.5 h-3.5" /> Negative Trend Warning
                          </span>
                        )}
                        {isPositive && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                            <Sparkles className="w-3.5 h-3.5" /> Readiness Breakthrough
                          </span>
                        )}

                        <span className="text-xs text-slate-400 font-mono">
                          {alert.metricName} • {alert.detectedDate} ({alert.timestamp})
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
                        {alert.title}
                      </h3>
                    </div>

                    {/* Right: Deviation Badge & Dismiss */}
                    <div className="flex items-center gap-2 self-start">
                      <div
                        className={`px-3 py-1 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 border ${
                          isCritical
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                            : isWarning
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        }`}
                      >
                        {alert.deviationPercent < 0 ? (
                          <TrendingDown className="w-3.5 h-3.5" />
                        ) : (
                          <TrendingUp className="w-3.5 h-3.5" />
                        )}
                        <span>{alert.deviationText}</span>
                      </div>

                      <button
                        onClick={() => handleDismiss(alert.id)}
                        title="Dismiss Alert"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-all"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Middle Row: Physiological Findings, Sparkline & Baseline Comparison */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-1">
                    
                    {/* 2 Cols: Clinical Diagnostic Insight */}
                    <div className="lg:col-span-2 space-y-2.5">
                      <div className="bg-slate-950/60 rounded-xl p-3.5 border border-slate-800/80 space-y-1.5">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
                          <Info className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Clinical Diagnostic Finding:</span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {alert.clinicalInsight}
                        </p>
                      </div>

                      {/* Actionable Protocol */}
                      <div className="bg-slate-950/40 rounded-xl p-3 border border-slate-800/60 flex items-start gap-2.5">
                        <Zap className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                        <div className="text-xs space-y-0.5">
                          <span className="font-bold text-slate-200">Recommended Action Protocol:</span>
                          <p className="text-slate-300 leading-relaxed">
                            {alert.actionableRecommendation}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* 1 Col: Sparkline & Sensor Context */}
                    <div className="bg-slate-950/70 rounded-xl p-3.5 border border-slate-800/80 flex flex-col justify-between space-y-3">
                      <div>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                          7-Day Trend vs Baseline
                        </span>
                        {renderSparkline(alert.sparklineData)}
                      </div>

                      <div className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-2 flex items-center justify-between">
                        <span>Source: <strong className="text-slate-300">{alert.sourceDevice || 'Biometric Ingestion'}</strong></span>
                        {alert.zScore && <span>Z-Score: <strong className="text-cyan-400">{alert.zScore}σ</strong></span>}
                      </div>
                    </div>

                  </div>

                  {/* Expandable Deep Physiological Mechanism */}
                  {isExpanded && (
                    <div className="mt-2 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-2 animate-fadeIn">
                      <div className="flex items-center gap-1.5 font-bold text-cyan-400">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Autonomic Nervous System & Cellular Mechanism:</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed">
                        {alert.physiologicalMechanism}
                      </p>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2 pt-1">
                        <span className="font-mono">Reference:</span> Task Force of ESC & NASPE (Standards of HRV Measurement & Clinical Use).
                      </div>
                    </div>
                  )}

                  {/* Bottom Action Triggers */}
                  <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      {alert.suggestedActions.map((action) => {
                        const isDowngradeAction = action.actionType === 'downgrade_workout';
                        
                        return (
                          <button
                            key={action.id}
                            onClick={() => handleActionClick(action, alert)}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                              isDowngradeAction && isWorkoutDowngraded
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : action.variant === 'primary'
                                ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white hover:from-rose-500 hover:to-amber-500 shadow-rose-950/50'
                                : action.variant === 'warning'
                                ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40'
                                : action.variant === 'emerald'
                                ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40'
                                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                            }`}
                          >
                            {isDowngradeAction && isWorkoutDowngraded ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                Workout Downgraded to Recovery
                              </>
                            ) : (
                              <>
                                <Zap className="w-3.5 h-3.5" />
                                {action.label}
                              </>
                            )}
                          </button>
                        );
                      })}

                      <button
                        onClick={() => setExpandedMechanismId(isExpanded ? null : alert.id)}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all flex items-center gap-1"
                      >
                        {isExpanded ? (
                          <>Hide Mechanism <ChevronUp className="w-3.5 h-3.5" /></>
                        ) : (
                          <>Clinical Mechanism <ChevronDown className="w-3.5 h-3.5" /></>
                        )}
                      </button>
                    </div>

                    <div className="text-xs text-slate-400 font-mono">
                      Baseline Target: {alert.baselineValue}
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* REASSURING HOMEOSTASIS STATE (When no negative anomalies are active) */
        <div className="bg-slate-900/80 rounded-2xl p-5 border border-slate-800 shadow-md">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mt-0.5">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white tracking-wide">
                    Autonomic Homeostasis Maintained
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    No Critical Anomalies
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Your overnight HRV (64ms) and resting heart rate (59 BPM) are tracking tightly within your 14-day physiological corridor (±1.5σ). No acute overtraining or autonomic suppression detected.
                </p>
                <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 pt-1">
                  <span>HRV Stability: <strong className="text-emerald-400">98% in corridor</strong></span>
                  <span>Resting HR Dip: <strong className="text-cyan-400">Optimal (-14% sleep dip)</strong></span>
                  <span>Autonomic Stress Index: <strong className="text-slate-200">18/100 (Low)</strong></span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onApplySimulationPreset('overtraining_spike')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 transition-all flex-shrink-0"
            >
              <FlaskConical className="w-3.5 h-3.5 text-amber-400" />
              Test Anomaly Spike
            </button>
          </div>
        </div>
      )}

      {/* DISMISSED ALERTS ARCHIVE DRAWER */}
      {dismissedAlerts.length > 0 && (
        <div className="pt-1">
          <button
            onClick={() => setShowDismissedArchive(!showDismissedArchive)}
            className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1.5 font-medium"
          >
            {showDismissedArchive ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {showDismissedArchive ? 'Hide' : 'Show'} Acknowledged Alerts Archive ({dismissedAlerts.length})
          </button>

          {showDismissedArchive && (
            <div className="mt-2 space-y-2 pl-4 border-l-2 border-slate-800">
              {dismissedAlerts.map(alert => (
                <div key={alert.id} className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-300">{alert.title}</span>
                    <span className="text-slate-400 text-[11px] block">{alert.deviationText} • {alert.detectedDate}</span>
                  </div>
                  <button
                    onClick={() => handleRestore(alert.id)}
                    className="text-cyan-400 hover:text-cyan-300 text-xs font-semibold underline"
                  >
                    Restore to Dashboard
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </section>
  );
};
