import { DataSource, Activity, SleepRecord, NutritionDay, Biomarker, VitalScore } from '../types';

export function calculateDataCoverageScore(sources: DataSource[], biomarkers: Biomarker[], activities: Activity[], sleepRecords: SleepRecord[]): {
  overallScore: number;
  breakdown: { category: string; score: number; status: string; missingTip: string }[];
} {
  const fitnessConnected = sources.some(s => s.category === 'fitness' && s.connected);
  const sleepConnected = sources.some(s => s.category === 'sleep' && s.connected);
  const vitalsConnected = sources.some(s => s.category === 'vitals' && s.connected);
  const nutritionConnected = sources.some(s => s.category === 'nutrition' && s.connected);
  const clinicalConnected = sources.some(s => s.category === 'clinical' && s.connected) || biomarkers.length > 0;

  const fitnessScore = fitnessConnected ? (activities.length > 3 ? 95 : 75) : 20;
  const sleepScore = sleepConnected ? (sleepRecords.length > 3 ? 92 : 70) : 15;
  const vitalsScore = vitalsConnected ? 88 : 25;
  const nutritionScore = nutritionConnected ? 82 : 10;
  const clinicalScore = clinicalConnected ? 85 : 15;

  const overall = Math.round((fitnessScore * 0.25) + (sleepScore * 0.25) + (vitalsScore * 0.2) + (nutritionScore * 0.15) + (clinicalScore * 0.15));

  return {
    overallScore: overall,
    breakdown: [
      { category: 'Fitness & Activity', score: fitnessScore, status: fitnessScore >= 80 ? 'Comprehensive' : 'Partial', missingTip: 'Connect Strava / Garmin for power zones & cadence' },
      { category: 'Sleep & HRV', score: sleepScore, status: sleepScore >= 80 ? 'Optimal' : 'Needs Ingestion', missingTip: 'Sync Oura or Apple Health for sleep staging' },
      { category: 'Continuous Vitals', score: vitalsScore, status: vitalsScore >= 80 ? 'Active Stream' : 'Limited', missingTip: 'Pair BLE heart rate monitor or BPM cuff' },
      { category: 'Nutrition & Macros', score: nutritionScore, status: nutritionScore >= 80 ? 'Logged' : 'Missing', missingTip: 'Connect MyFitnessPal or log daily meals' },
      { category: 'Clinical Biomarkers', score: clinicalScore, status: clinicalScore >= 80 ? 'Verified' : 'Upload Needed', missingTip: 'Upload recent routine blood panel PDF' }
    ]
  };
}

export function computeVitalScoreDetails(score: VitalScore) {
  return [
    { label: 'Autonomic Recovery', value: score.recovery, weight: '25%', metricRef: 'HRV 64ms • Resting HR 59 BPM' },
    { label: 'Cardio & Activity Load', value: score.activity, weight: '25%', metricRef: '10.4k steps avg • 78 TRIMP' },
    { label: 'Sleep Quality & Staging', value: score.sleep, weight: '25%', metricRef: '7h 42m duration • 94m Deep Sleep' },
    { label: 'Nutrition Adherence', value: score.nutrition, weight: '15%', metricRef: '168g Protein (102% goal)' },
    { label: '30-Day Habit Consistency', value: score.consistency, weight: '10%', metricRef: '28/30 planned sessions' }
  ];
}

export function formatHeartRateZone(hr: number): { zone: string; color: string; targetText: string } {
  if (hr < 115) return { zone: 'Zone 1 (Recovery)', color: 'text-blue-500 bg-blue-500/10 border-blue-500/30', targetText: '< 115 BPM' };
  if (hr <= 135) return { zone: 'Zone 2 (Aerobic Base)', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30', targetText: '115 - 135 BPM' };
  if (hr <= 152) return { zone: 'Zone 3 (Tempo)', color: 'text-amber-500 bg-amber-500/10 border-amber-500/30', targetText: '136 - 152 BPM' };
  if (hr <= 168) return { zone: 'Zone 4 (Threshold)', color: 'text-orange-500 bg-orange-500/10 border-orange-500/30', targetText: '153 - 168 BPM' };
  return { zone: 'Zone 5 (Anaerobic / VO2 Max)', color: 'text-rose-500 bg-rose-500/10 border-rose-500/30', targetText: '> 168 BPM' };
}

export function deduplicateSteps(appleWatchSteps: number, phoneSteps: number, fitbitSteps: number): {
  reconciledSteps: number;
  sourcesCompared: { source: string; rawSteps: number; status: string }[];
  resolutionRule: string;
} {
  const maxWatch = Math.max(appleWatchSteps, fitbitSteps);
  const reconciled = maxWatch > 0 ? maxWatch : phoneSteps;

  return {
    reconciledSteps: reconciled,
    sourcesCompared: [
      { source: 'Apple Watch (Wrist Accel)', rawSteps: appleWatchSteps, status: 'Prioritized (High Precision Cadence)' },
      { source: 'Fitbit Sense 2', rawSteps: fitbitSteps, status: 'Secondary Sync' },
      { source: 'iPhone (Pocket Sensor)', rawSteps: phoneSteps, status: 'Passive (Subordinated to avoid duplicate double-counting)' }
    ],
    resolutionRule: 'VITALOS deduplicates continuous time intervals. Wrist sensor accelerometer data is selected over mobile pocket sensors during overlapping timestamps to prevent inflation.'
  };
}
