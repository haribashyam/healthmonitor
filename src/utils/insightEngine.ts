import {
  SleepRecord,
  Activity,
  Biomarker,
  VitalInsightAlert,
  VitalBaselineMetrics,
  InsightEngineReport,
  AlertSeverity
} from '../types';

export type SensitivityLevel = 'conservative' | 'standard' | 'aggressive';

export interface SimulationPreset {
  id: string;
  name: string;
  description: string;
  mockTodayRecord: Partial<SleepRecord>;
}

export const SIMULATION_PRESETS: SimulationPreset[] = [
  {
    id: 'normal',
    name: 'Normal Baseline (Optimal Recovery)',
    description: 'HRV at 64ms, Resting HR at 59 BPM, balanced autonomic nervous system.',
    mockTodayRecord: {
      date: '2026-08-25',
      hrvAvg: 64,
      restingHr: 59,
      sleepScore: 88,
      deepMinutes: 94,
      totalMinutes: 462,
      respiratoryRate: 14.2,
      spo2Avg: 98.4
    }
  },
  {
    id: 'overtraining_spike',
    name: 'Overtraining & Autonomic Crash',
    description: 'Acute HRV drop to 42ms (-34%), RHR surge to 67 BPM (+8 BPM), high autonomic strain.',
    mockTodayRecord: {
      date: '2026-08-25',
      hrvAvg: 42,
      restingHr: 67,
      sleepScore: 68,
      deepMinutes: 48,
      totalMinutes: 395,
      respiratoryRate: 15.6,
      spo2Avg: 96.8
    }
  },
  {
    id: 'illness_stress',
    name: 'Immune Activation / Impending Illness',
    description: 'Elevated nocturnal RHR (+9 BPM), suppressed HRV (45ms), elevated respiratory rate (16.2 rpm).',
    mockTodayRecord: {
      date: '2026-08-25',
      hrvAvg: 45,
      restingHr: 69,
      sleepScore: 62,
      deepMinutes: 42,
      totalMinutes: 430,
      respiratoryRate: 16.4,
      spo2Avg: 95.8
    }
  },
  {
    id: 'late_meal_alcohol',
    name: 'Late Meal & Sleep Fragmentation',
    description: 'Delayed resting HR dip, RHR 65 BPM (+6 BPM), reduced deep sleep (52m), HRV 51ms.',
    mockTodayRecord: {
      date: '2026-08-25',
      hrvAvg: 51,
      restingHr: 65,
      sleepScore: 71,
      deepMinutes: 52,
      totalMinutes: 410,
      respiratoryRate: 14.9,
      spo2Avg: 97.2
    }
  },
  {
    id: 'supercompensation',
    name: 'Supercompensation / Peak Adaptation',
    description: 'Breakthrough HRV (76ms, +18%), low resting HR (54 BPM), 118 mins deep restorative sleep.',
    mockTodayRecord: {
      date: '2026-08-25',
      hrvAvg: 76,
      restingHr: 54,
      sleepScore: 95,
      deepMinutes: 118,
      totalMinutes: 505,
      respiratoryRate: 13.8,
      spo2Avg: 99.2
    }
  }
];

// Helper statistical calculations
function calculateMean(numbers: number[]): number {
  if (!numbers.length) return 0;
  return numbers.reduce((acc, n) => acc + n, 0) / numbers.length;
}

function calculateStdDev(numbers: number[], mean: number): number {
  if (numbers.length <= 1) return 2.0; // fallback standard deviation
  const variance = numbers.reduce((acc, n) => acc + Math.pow(n - mean, 2), 0) / (numbers.length - 1);
  return Math.sqrt(variance) || 1.5;
}

export function computeVitalBaselines(records: SleepRecord[]): VitalBaselineMetrics {
  if (!records.length) {
    return {
      hrvBaseline: 64,
      hrvStdDev: 5.2,
      rhrBaseline: 59,
      rhrStdDev: 2.8,
      sleepScoreBaseline: 86,
      deepSleepBaseline: 90,
      consecutiveHrvDropDays: 0,
      consecutiveRhrRiseDays: 0
    };
  }

  // Use historical records (excluding today if more than 3 exist, or full sample)
  const sample = records.length > 3 ? records.slice(1) : records;
  
  const hrvValues = sample.map(r => r.hrvAvg).filter(v => typeof v === 'number' && v > 0);
  const rhrValues = sample.map(r => r.restingHr).filter(v => typeof v === 'number' && v > 0);
  const sleepScores = sample.map(r => r.sleepScore).filter(v => typeof v === 'number' && v > 0);
  const deepSleepMinutes = sample.map(r => r.deepMinutes).filter(v => typeof v === 'number' && v > 0);

  const hrvMean = calculateMean(hrvValues) || 64;
  const rhrMean = calculateMean(rhrValues) || 59;
  const sleepMean = calculateMean(sleepScores) || 86;
  const deepMean = calculateMean(deepSleepMinutes) || 90;

  const hrvStd = calculateStdDev(hrvValues, hrvMean);
  const rhrStd = calculateStdDev(rhrValues, rhrMean);

  // Consecutive trend tracking
  let consecutiveHrvDrop = 0;
  let consecutiveRhrRise = 0;
  
  for (let i = 0; i < records.length - 1; i++) {
    if (records[i].hrvAvg < records[i + 1].hrvAvg) {
      consecutiveHrvDrop++;
    } else {
      break;
    }
  }

  for (let i = 0; i < records.length - 1; i++) {
    if (records[i].restingHr > records[i + 1].restingHr) {
      consecutiveRhrRise++;
    } else {
      break;
    }
  }

  return {
    hrvBaseline: Math.round(hrvMean * 10) / 10,
    hrvStdDev: Math.round(hrvStd * 10) / 10,
    rhrBaseline: Math.round(rhrMean * 10) / 10,
    rhrStdDev: Math.round(rhrStd * 10) / 10,
    sleepScoreBaseline: Math.round(sleepMean),
    deepSleepBaseline: Math.round(deepMean),
    consecutiveHrvDropDays: consecutiveHrvDrop,
    consecutiveRhrRiseDays: consecutiveRhrRise
  };
}

/**
 * Core Automated Insight Engine
 * Analyzes multi-day vital telemetry, resting heart rate, HRV trends, and sleep architectures
 * to generate actionable clinical-grade alert cards.
 */
export function analyzeVitalData(
  sleepRecords: SleepRecord[],
  activities: Activity[] = [],
  biomarkers: Biomarker[] = [],
  sensitivity: SensitivityLevel = 'standard'
): InsightEngineReport {
  if (!sleepRecords || sleepRecords.length === 0) {
    return {
      timestamp: new Date().toISOString(),
      overallRiskLevel: 'low',
      autonomicStressIndex: 15,
      baselines: computeVitalBaselines([]),
      alerts: [],
      positiveSignals: ['Engine initialized. Ingestion streams active.'],
      scannedDaysCount: 0,
      engineVersion: '2.4.0-BioEngine',
      sensitivityMode: sensitivity
    };
  }

  const today = sleepRecords[0];
  const baselines = computeVitalBaselines(sleepRecords);
  
  // Multipliers based on sensitivity mode
  const zThreshold = sensitivity === 'aggressive' ? 1.1 : sensitivity === 'conservative' ? 1.9 : 1.45;
  const percentDropThreshold = sensitivity === 'aggressive' ? 12 : sensitivity === 'conservative' ? 22 : 16;
  const rhrBpmDeltaThreshold = sensitivity === 'aggressive' ? 3.5 : sensitivity === 'conservative' ? 6.5 : 4.5;

  const alerts: VitalInsightAlert[] = [];
  const positiveSignals: string[] = [];

  // 1. HRV Z-Score & Deviation Analysis
  const hrvDelta = today.hrvAvg - baselines.hrvBaseline;
  const hrvPercent = (hrvDelta / baselines.hrvBaseline) * 100;
  const hrvZScore = (today.hrvAvg - baselines.hrvBaseline) / (baselines.hrvStdDev || 1);

  // 2. RHR Z-Score & Deviation Analysis
  const rhrDelta = today.restingHr - baselines.rhrBaseline;
  const rhrPercent = (rhrDelta / baselines.rhrBaseline) * 100;
  const rhrZScore = (today.restingHr - baselines.rhrBaseline) / (baselines.rhrStdDev || 1);

  // Build sparkline histories for cards
  const hrvHistory = [...sleepRecords].reverse().map(r => ({
    date: r.date.slice(5),
    value: r.hrvAvg,
    baseline: baselines.hrvBaseline,
    lowerBound: Math.max(20, Math.round(baselines.hrvBaseline - 1.5 * baselines.hrvStdDev)),
    upperBound: Math.round(baselines.hrvBaseline + 1.5 * baselines.hrvStdDev)
  }));

  const rhrHistory = [...sleepRecords].reverse().map(r => ({
    date: r.date.slice(5),
    value: r.restingHr,
    baseline: baselines.rhrBaseline,
    lowerBound: Math.max(40, Math.round(baselines.rhrBaseline - 1.5 * baselines.rhrStdDev)),
    upperBound: Math.round(baselines.rhrBaseline + 1.5 * baselines.rhrStdDev)
  }));

  // Calculate Autonomic Stress Index (0-100 scale, higher = more autonomic stress)
  let autonomicStress = 18; // healthy baseline
  if (hrvZScore < 0) autonomicStress += Math.min(45, Math.abs(hrvZScore) * 22);
  if (rhrZScore > 0) autonomicStress += Math.min(35, rhrZScore * 18);
  if (today.deepMinutes < 60) autonomicStress += 12;
  if (today.respiratoryRate && today.respiratoryRate > 15.5) autonomicStress += 10;
  autonomicStress = Math.min(100, Math.max(5, Math.round(autonomicStress)));

  // SCENARIO A: Compound Autonomic Strain & Illness/Overtraining Anomaly
  // Both HRV down and RHR up simultaneously
  if ((hrvZScore <= -zThreshold || hrvPercent <= -percentDropThreshold) && 
      (rhrZScore >= zThreshold || rhrDelta >= rhrBpmDeltaThreshold)) {
    
    const isCritical = hrvPercent <= -25 || rhrDelta >= 7 || autonomicStress >= 70;
    
    alerts.push({
      id: 'alert-compound-autonomic-crash',
      title: isCritical 
        ? 'Severe Autonomic Nervous System Strain' 
        : 'Compound Autonomic Fatigue & Recovery Deficit',
      category: isCritical ? 'illness_risk' : 'autonomic_strain',
      severity: isCritical ? 'critical' : 'warning',
      metricName: 'HRV & Nocturnal Heart Rate',
      currentValue: `${today.hrvAvg} ms / ${today.restingHr} BPM`,
      baselineValue: `${baselines.hrvBaseline} ms / ${baselines.rhrBaseline} BPM`,
      deviationPercent: Math.round(hrvPercent),
      deviationText: `HRV ${hrvPercent > 0 ? '+' : ''}${Math.round(hrvPercent)}% (${Math.round(hrvDelta)}ms) & RHR +${Math.round(rhrDelta)} BPM (Z: ${hrvZScore.toFixed(1)})`,
      zScore: Number(hrvZScore.toFixed(2)),
      detectedDate: today.date,
      clinicalInsight: `Simultaneous suppression of parasympathetic tone (HRV ${today.hrvAvg}ms vs ${baselines.hrvBaseline}ms baseline) coupled with elevated resting cardiac workload (+${Math.round(rhrDelta)} BPM). This signature strongly correlates with high acute-to-chronic physiological stress, unrecovered central nervous system fatigue, or early innate immune activation.`,
      physiologicalMechanism: 'Sympathetic tone dominance during sleep prevents the nocturnal acetylcholine-mediated bradycardia dip. The heart rate variability interval irregularity is constrained, reflecting diminished vagal nerve activity.',
      actionableRecommendation: 'Mandatory active recovery. Downgrade any scheduled high-intensity (Zone 4/5) or heavy eccentric resistance workouts to Zone 1 parasympathetic mobility or gentle walking. Increase hydration by 600ml with electrolytes, avoid late meals within 3 hours of sleep, and extend target sleep window by +60 minutes.',
      suggestedActions: [
        {
          id: 'act-downgrade',
          label: 'Auto-Downgrade Today’s Workout Plan',
          actionType: 'downgrade_workout',
          variant: 'primary'
        },
        {
          id: 'act-ask',
          label: 'Ask AI Copilot for Recovery Protocol',
          actionType: 'open_ask',
          variant: 'secondary'
        },
        {
          id: 'act-sim',
          label: 'Simulate Sleep Recovery in What-If',
          actionType: 'open_simulator',
          variant: 'secondary'
        }
      ],
      sparklineData: hrvHistory,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sourceDevice: today.source || 'Oura Ring Gen3'
    });
  } 
  // SCENARIO B: Isolated HRV Autonomic Suppression Anomaly
  else if (hrvZScore <= -zThreshold || hrvPercent <= -percentDropThreshold) {
    alerts.push({
      id: 'alert-hrv-suppression',
      title: 'Autonomic Tone Suppression Detected',
      category: 'hrv',
      severity: hrvPercent <= -25 ? 'critical' : 'warning',
      metricName: 'Overnight HRV (RMSSD)',
      currentValue: `${today.hrvAvg} ms`,
      baselineValue: `${baselines.hrvBaseline} ms (14-day baseline)`,
      deviationPercent: Math.round(hrvPercent),
      deviationText: `${Math.round(hrvPercent)}% below baseline (Z-Score: ${hrvZScore.toFixed(1)})`,
      zScore: Number(hrvZScore.toFixed(2)),
      detectedDate: today.date,
      clinicalInsight: `Overnight Root Mean Square of Successive Differences (RMSSD) dropped to ${today.hrvAvg}ms, representing a significant negative departure from your normal ${baselines.hrvBaseline}ms baseline. This indicates incomplete autonomic recovery from recent cardiovascular or cognitive strain.`,
      physiologicalMechanism: 'Suppressed RMSSD indicates decreased vagal nerve stimulation of the sinoatrial node, signaling that the body has not fully shifted from a fight-or-flight sympathetic state into an anabolic repair state.',
      actionableRecommendation: 'Limit anaerobic threshold training today. Replace high-glycolytic intervals with aerobic base Zone 2 or restorative breathwork (e.g. 4-7-8 diaphragmatic cadence) to restore parasympathetic balance.',
      suggestedActions: [
        {
          id: 'act-downgrade',
          label: 'Downgrade to Zone 1 Recovery',
          actionType: 'downgrade_workout',
          variant: 'warning'
        },
        {
          id: 'act-vitals',
          label: 'View Full HRV Trend Analysis',
          actionType: 'open_vitals',
          variant: 'secondary'
        }
      ],
      sparklineData: hrvHistory,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sourceDevice: today.source || 'Oura Ring Gen3'
    });
  }

  // SCENARIO C: Isolated Elevated Resting Heart Rate Spike / Creep
  if ((rhrZScore >= zThreshold || rhrDelta >= rhrBpmDeltaThreshold) && 
      !alerts.some(a => a.id === 'alert-compound-autonomic-crash')) {
    alerts.push({
      id: 'alert-rhr-elevation',
      title: 'Elevated Resting Heart Rate Anomaly',
      category: 'rhr',
      severity: rhrDelta >= 7 ? 'warning' : 'advisory',
      metricName: 'Resting Heart Rate (RHR)',
      currentValue: `${today.restingHr} BPM`,
      baselineValue: `${baselines.rhrBaseline} BPM (normal baseline)`,
      deviationPercent: Math.round(rhrPercent),
      deviationText: `+${Math.round(rhrDelta)} BPM higher than 14-day baseline (+${Math.round(rhrPercent)}%)`,
      zScore: Number(rhrZScore.toFixed(2)),
      detectedDate: today.date,
      clinicalInsight: `Nocturnal lowest heart rate stayed elevated at ${today.restingHr} BPM (normal baseline is ${baselines.rhrBaseline} BPM). An elevated basal heart rate often stems from prolonged digestive thermogenesis (late night eating), mild dehydration, thermal strain, or accumulated muscular inflammation.`,
      physiologicalMechanism: 'Elevated nocturnal stroke volume and chronotropic cardiac drive suggest lingering metabolic clearance demands or elevated cortisol/catecholamine circulation.',
      actionableRecommendation: 'Front-load caloric intake today and cease food intake 3 hours before bed. Check hydration status with 500ml water + pinch of sea salt, and avoid caffeine past 14:00.',
      suggestedActions: [
        {
          id: 'act-journal',
          label: 'Log Meal Timing / Stress in Journal',
          actionType: 'open_journal',
          variant: 'secondary'
        },
        {
          id: 'act-vitals',
          label: 'Inspect Heart Rate Distribution',
          actionType: 'open_vitals',
          variant: 'secondary'
        }
      ],
      sparklineData: rhrHistory,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sourceDevice: today.source || 'Apple Watch / Oura'
    });
  }

  // SCENARIO D: Multi-Day Consecutive Negative Trajectory Alert
  if (baselines.consecutiveHrvDropDays >= 3 && !alerts.some(a => a.category === 'overtraining')) {
    alerts.push({
      id: 'alert-consecutive-trend',
      title: '3-Day Downward Recovery Trajectory',
      category: 'overtraining',
      severity: 'warning',
      metricName: 'Multi-Day Recovery Velocity',
      currentValue: `${baselines.consecutiveHrvDropDays} consecutive days`,
      baselineValue: 'Stable Baseline',
      deviationPercent: -18,
      deviationText: `${baselines.consecutiveHrvDropDays} consecutive days of declining HRV`,
      detectedDate: today.date,
      clinicalInsight: `HRV has steadily depreciated over ${baselines.consecutiveHrvDropDays} consecutive days. While a single-day dip is normal following intense workouts, a multi-day cascading decline is a classic marker of functional overreaching progressing toward non-functional overtraining.`,
      physiologicalMechanism: 'Progressive cumulative depletion of glycogen reserves, lingering neuromuscular micro-trauma, and chronic sympathetic activation without sufficient parasympathetic rebound windows.',
      actionableRecommendation: 'Implement a structured 48-hour recovery block. Suppress high training loads, prioritize sleep architecture, and consider a contrast shower or sauna-cold protocol to facilitate lymphatic drainage.',
      suggestedActions: [
        {
          id: 'act-downgrade',
          label: 'Schedule 48-Hour Deload Window',
          actionType: 'downgrade_workout',
          variant: 'primary'
        },
        {
          id: 'act-sim',
          label: 'Run 48-Hour Recovery Simulation',
          actionType: 'open_simulator',
          variant: 'secondary'
        }
      ],
      sparklineData: hrvHistory,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sourceDevice: 'VITALOS Biometric Engine'
    });
  }

  // SCENARIO E: Supercompensation / Positive Breakthrough Surge
  if (hrvZScore >= 1.5 && rhrDelta <= -1 && today.sleepScore >= 90) {
    alerts.push({
      id: 'alert-supercompensation',
      title: 'Supercompensation State: High Readiness Surge',
      category: 'positive',
      severity: 'positive',
      metricName: 'Autonomic Supercompensation',
      currentValue: `${today.hrvAvg} ms / ${today.restingHr} BPM`,
      baselineValue: `${baselines.hrvBaseline} ms / ${baselines.rhrBaseline} BPM`,
      deviationPercent: Math.round(hrvPercent),
      deviationText: `+${Math.round(hrvPercent)}% HRV surge with optimal ${today.restingHr} BPM basal floor`,
      zScore: Number(hrvZScore.toFixed(2)),
      detectedDate: today.date,
      clinicalInsight: `Cardiovascular and neuromuscular systems have achieved supercompensation. High parasympathetic tone (HRV ${today.hrvAvg}ms, +${Math.round(hrvPercent)}%) combined with deep restorative sleep (${today.deepMinutes}m) provides prime physiological readiness for high-output physical or cognitive challenges.`,
      physiologicalMechanism: 'High vagal tone with dense acetylcholine release, optimal mitochondrial recovery, and low systemic inflammation.',
      actionableRecommendation: 'Green light for high-intensity training, VO2 max intervals, or personal record (PR) attempts. Your physiological reserves are primed.',
      suggestedActions: [
        {
          id: 'act-live',
          label: 'Launch Live Workout HUD',
          actionType: 'open_vitals',
          variant: 'emerald'
        }
      ],
      sparklineData: hrvHistory,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sourceDevice: today.source || 'Oura Ring Gen3'
    });
  }

  // Record positive telemetry signals if everything is optimal
  if (alerts.length === 0 || alerts.every(a => a.severity === 'positive')) {
    positiveSignals.push(`HRV within healthy baseline corridor (${today.hrvAvg}ms vs ${baselines.hrvBaseline}ms baseline).`);
    positiveSignals.push(`Resting Heart Rate stable at ${today.restingHr} BPM with normal nocturnal dip.`);
    positiveSignals.push(`Autonomic Stress Index low (${autonomicStress}/100). Parasympathetic restoration active.`);
  }

  // Determine overall risk level
  let overallRisk: 'low' | 'moderate' | 'elevated' | 'high' = 'low';
  if (alerts.some(a => a.severity === 'critical')) {
    overallRisk = 'high';
  } else if (alerts.some(a => a.severity === 'warning')) {
    overallRisk = 'elevated';
  } else if (alerts.some(a => a.severity === 'advisory')) {
    overallRisk = 'moderate';
  }

  return {
    timestamp: new Date().toISOString(),
    overallRiskLevel: overallRisk,
    autonomicStressIndex: autonomicStress,
    baselines,
    alerts,
    positiveSignals,
    scannedDaysCount: sleepRecords.length,
    engineVersion: '2.4.0-BioEngine',
    sensitivityMode: sensitivity
  };
}
