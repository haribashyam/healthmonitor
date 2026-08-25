export type HealthCategory = 'fitness' | 'vitals' | 'sleep' | 'nutrition' | 'clinical' | 'lifestyle';

export interface GranularScope {
  id: string;
  label: string;
  description: string;
  category: HealthCategory;
  isSensitive?: boolean;
}

export interface LiveTelemetryMetric {
  key: string;
  label: string;
  value: number | string;
  unit: string;
  delta?: string;
  trend?: 'up' | 'down' | 'stable';
  zone?: string;
}

export interface LiveTelemetryPacket {
  id: string;
  sourceId: string;
  sourceName: string;
  category: HealthCategory;
  timestamp: number;
  timeString: string;
  metrics: LiveTelemetryMetric[];
  status: 'active_stream' | 'buffered' | 'handshake';
  rssi?: number;
  batteryPct?: number;
}

export interface CustomSourceFormData {
  type: 'app' | 'upload' | 'measurement' | 'note' | 'webhook' | 'ble';
  name: string;
  category: HealthCategory;
  websiteUrl?: string;
  apiUrl?: string;
  authType: 'oauth' | 'ble' | 'manual' | 'document' | 'webhook';
  description: string;
  selectedScopes: string[];
  customMeasurement?: {
    metricName: string;
    value: string;
    unit: string;
    category: string;
  };
  noteContent?: string;
}

export interface DataSource {
  id: string;
  name: string;
  category: HealthCategory;
  icon: string;
  connected: boolean;
  authType: 'oauth' | 'ble' | 'manual' | 'document' | 'webhook';
  lastSync: string;
  recordCount: number;
  status: 'active' | 'syncing' | 'paused' | 'error' | 'disconnected';
  permissions: string[];
  description: string;
  websiteUrl?: string;
  apiUrl?: string;
  supportedScopes?: GranularScope[];
  grantedScopes?: string[];
  liveStreamingCapable?: boolean;
  isLiveActive?: boolean;
  liveThroughput?: string;
  isCustom?: boolean;
  error?: string;
}

export interface Biomarker {
  id: string;
  name: string;
  value: number | string;
  unit: string;
  referenceRange: string;
  status: 'optimal' | 'normal' | 'borderline' | 'abnormal';
  category: 'Metabolic' | 'Lipids' | 'Inflammation' | 'Vitamins' | 'Hormones' | 'Hematology' | 'Renal';
  date: string;
  source: string;
  historicalTrend?: 'improving' | 'stable' | 'concerning';
}

export interface LabReport {
  id: string;
  title: string;
  laboratory: string;
  date: string;
  summary: string;
  biomarkers: Biomarker[];
  clinicalInsights: string[];
  fileUrl?: string;
  disclaimer: string;
}

export interface Activity {
  id: string;
  title: string;
  type: 'Run' | 'Ride' | 'Swim' | 'Strength' | 'HIIT' | 'Walk' | 'Yoga' | 'Recovery';
  durationMinutes: number;
  distanceKm?: number;
  avgHeartRate: number;
  maxHeartRate: number;
  calories: number;
  elevationMeters?: number;
  date: string;
  time: string;
  source: string;
  trainingLoad: number;
  paceMinPerKm?: string;
  hrZones?: { zone: string; percentage: number; minutes: number }[];
  heartRateZones?: {
    zone1: number;
    zone2: number;
    zone3: number;
    zone4: number;
    zone5: number;
  };
}

export interface SleepRecord {
  date: string;
  totalMinutes: number;
  deepMinutes: number;
  remMinutes: number;
  coreMinutes: number;
  awakeMinutes: number;
  efficiencyPercent: number;
  hrvAvg: number;
  restingHr: number;
  sleepScore: number;
  source: string;
  respiratoryRate?: number;
  spo2Avg?: number;
}

export interface MealItem {
  id: string;
  name: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  time: string;
  verifiedSource?: string;
}

export interface NutritionDay {
  date: string;
  totalCalories: number;
  targetCalories: number;
  protein: number;
  targetProtein: number;
  carbs: number;
  targetCarbs: number;
  fats: number;
  targetFats: number;
  fiber: number;
  waterLiters: number;
  meals: MealItem[];
  adherencePercent: number;
}

export interface VitalScore {
  overall: number;
  recovery: number;
  activity: number;
  sleep: number;
  nutrition: number;
  consistency: number;
  status: 'Peak Condition' | 'Optimal Recovery' | 'Moderate Strain' | 'Rest Advised';
  deltaToday: number;
  whyExplanation: string;
}

export interface HealthGoal {
  id: string;
  title: string;
  category: HealthCategory;
  targetValue: number;
  currentValue: number;
  unit: string;
  targetDate: string;
  progressPercent: number;
  status: 'ahead' | 'on_track' | 'behind';
}

export interface WorkoutPlanDay {
  day: string;
  title: string;
  duration: string;
  targetHR: string;
  intensity: 'Low' | 'Moderate' | 'High' | 'Recovery';
  sourceRationale: string;
  completed?: boolean;
  isDowngraded?: boolean;
  downgradeReason?: string;
  exercises?: { name: string; sets: string; reps: string; targetRPE?: number }[];
}

export interface GroceryItemCategory {
  category: string;
  items: string[];
}

export interface AdaptivePlan {
  planName: string;
  vitalScoreTarget: number;
  timelineWeeks: number;
  summary: string;
  workoutSplit: WorkoutPlanDay[];
  nutritionTargets: {
    dailyCalories: number;
    proteinGrams: number;
    carbGrams: number;
    fatGrams: number;
    hydrationLiters: number;
    focusNotes: string;
  };
  groceryEssentials: GroceryItemCategory[];
  adaptiveRules: string[];
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  date: string;
  time: string;
  title: string;
  category: HealthCategory;
  value?: string;
  detail?: string;
  source: string;
  iconName?: string;
  confidence?: 'HIGH' | 'VERIFIED' | 'ESTIMATED';
  rawMetadata?: any;
}

export interface BluetoothDevice {
  id: string;
  name: string;
  connected: boolean;
  batteryLevel?: number;
  type: 'heart_rate' | 'blood_pressure' | 'oximeter' | 'cycling' | 'smart_scale';
  liveMetrics?: {
    heartRate?: number;
    hrZone?: number;
    systolic?: number;
    diastolic?: number;
    spo2?: number;
    cadence?: number;
    weightKg?: number;
    lastUpdated?: string;
  };
  gattStatus?: string;
  deviceInstance?: any;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  dateUnlocked?: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  time?: string;
  energyLevel: number; // 1-10
  mood?: any;
  muscleSoreness?: number; // 1-10
  sorenessLevel?: number; // 1-10
  stressLevel: number; // 1-10
  notes: string;
  tags?: string[];
  correlations?: string[];
  correlatedMetricImpact?: string;
}

export type HealthJournalEntry = JournalEntry;


export interface HealthRadarDimension {
  axis: string;
  current: number;
  baseline: number;
  goal: number;
  description: string;
}

export interface WhatIfScenarioResult {
  scenarioName: string;
  projectedVitalScore: number;
  projectedMetrics: {
    restingHeartRate: { current: number; projected: number; unit: string; delta: string };
    vo2Max: { current: number; projected: number; unit: string; delta: string };
    hrvBaseline: { current: number; projected: number; unit: string; delta: string };
    sleepRecoveryScore: { current: number; projected: number; unit: string; delta: string };
    estimatedFatLossKg: number;
  };
  physiologicalMechanism: string;
  confidenceScore: string;
  disclaimer: string;
}

export type AlertSeverity = 'critical' | 'warning' | 'advisory' | 'positive';
export type AlertCategory = 'hrv' | 'rhr' | 'autonomic_strain' | 'overtraining' | 'illness_risk' | 'recovery' | 'positive';

export interface AlertSuggestedAction {
  id: string;
  label: string;
  actionType: 'downgrade_workout' | 'open_simulator' | 'open_journal' | 'open_vitals' | 'open_ask' | 'open_doctor_report';
  variant?: 'primary' | 'secondary' | 'warning' | 'emerald';
}

export interface VitalInsightAlert {
  id: string;
  title: string;
  category: AlertCategory;
  severity: AlertSeverity;
  metricName: string;
  currentValue: number | string;
  baselineValue: number | string;
  deviationPercent: number; // e.g. -18.4%
  deviationText: string;
  zScore?: number;
  detectedDate: string;
  clinicalInsight: string;
  physiologicalMechanism: string;
  actionableRecommendation: string;
  suggestedActions: AlertSuggestedAction[];
  sparklineData?: { date: string; value: number; baseline: number; lowerBound?: number; upperBound?: number }[];
  timestamp: string;
  isDismissed?: boolean;
  isAcknowledged?: boolean;
  sourceDevice?: string;
}

export interface VitalBaselineMetrics {
  hrvBaseline: number;
  hrvStdDev: number;
  rhrBaseline: number;
  rhrStdDev: number;
  sleepScoreBaseline: number;
  deepSleepBaseline: number;
  consecutiveHrvDropDays: number;
  consecutiveRhrRiseDays: number;
  acuteChronicWorkloadRatio?: number;
}

export interface InsightEngineReport {
  timestamp: string;
  overallRiskLevel: 'low' | 'moderate' | 'elevated' | 'high';
  autonomicStressIndex: number; // 0 - 100
  baselines: VitalBaselineMetrics;
  alerts: VitalInsightAlert[];
  positiveSignals: string[];
  scannedDaysCount: number;
  engineVersion: string;
  sensitivityMode: 'conservative' | 'standard' | 'aggressive';
}
