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

// ----------------------------------------------------
// System 3: STRENGTH TRAINING & PROGRESSIVE OVERLOAD
// ----------------------------------------------------
export interface StrengthExerciseSet {
  setNumber: number;
  type: 'warmup' | 'working' | 'dropset' | 'failure';
  weightKg: number;
  reps: number;
  rpe?: number; // 1 - 10
  isCompleted: boolean;
  notes?: string;
}

export interface StrengthExercise {
  id: string;
  name: string;
  primaryMuscle: 'Chest' | 'Back' | 'Quads' | 'Hamstrings' | 'Shoulders' | 'Biceps' | 'Triceps' | 'Core' | 'Calves' | 'Glutes';
  secondaryMuscles: string[];
  equipment: 'Barbell' | 'Dumbbell' | 'Cable' | 'Machine' | 'Bodyweight' | 'Bands';
  estimatedOneRepMaxKg: number;
  personalRecord: { weightKg: number; reps: number; date: string };
  fourWeekVolumeProgressionPct: number; // e.g. +14.2%
  substitutions: { name: string; rationale: string }[];
  contraindications?: string[];
  historySets: StrengthExerciseSet[];
}

export interface StrengthWorkoutSession {
  id: string;
  title: string;
  date: string;
  durationMinutes: number;
  totalVolumeKg: number;
  rpeAverage: number;
  splitType: 'Push' | 'Pull' | 'Legs' | 'Upper' | 'Lower' | 'Full Body';
  exercises: {
    exercise: StrengthExercise;
    sets: StrengthExerciseSet[];
  }[];
  notes?: string;
  aiCoachInsight?: string;
}

// ----------------------------------------------------
// System 9: MEDICATION & SUPPLEMENT TRACKING
// ----------------------------------------------------
export interface MedicationSupplement {
  id: string;
  name: string;
  type: 'medication' | 'supplement' | 'vitamin';
  dosage: string;
  frequency: 'Daily' | 'Twice Daily' | 'As Needed' | 'Weekly' | 'Custom';
  timing: 'Morning' | 'With Breakfast' | 'Afternoon' | 'With Dinner' | 'Bedtime' | 'Pre-Workout';
  startDate: string;
  endDate?: string;
  purpose: string;
  adherencePercentage: number;
  stockRemainingPills?: number;
  interactionNotes?: string;
  synergies?: string;
  activeReminderTime?: string;
  takenToday?: boolean;
}

// ----------------------------------------------------
// System 10 & 11: BODY COMPOSITION & METABOLIC HEALTH
// ----------------------------------------------------
export interface BodyCompositionData {
  date: string;
  weightKg: number;
  bmi: number;
  bodyFatPercent: number;
  skeletalMuscleKg: number;
  bodyWaterPercent: number;
  boneMassKg: number;
  visceralFatRating: number;
  waistCircumferenceCm: number;
  source: string;
}

export interface MetabolicGlucosePoint {
  timestamp: string;
  glucoseMgDl: number;
  isPostprandial?: boolean;
  mealTag?: string;
}

// ----------------------------------------------------
// Systems 19 & 20: HEALTH EXPERIMENTS LAB & RESEARCH
// ----------------------------------------------------
export interface HealthExperiment {
  id: string;
  title: string;
  hypothesis: string;
  durationDays: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'draft';
  targetMetric: string;
  baselineValue: number;
  experimentValue: number;
  percentageChange: number;
  statisticalConfidence: 'High (p < 0.01)' | 'Moderate (p < 0.05)' | 'Inconclusive';
  sampleSizeDays: number;
  confoundingFactors: string[];
  verdict: string;
}

// ----------------------------------------------------
// Systems 21-25 & 45-47: ENVIRONMENTAL & CIRCADIAN
// ----------------------------------------------------
export interface EnvironmentalContext {
  timestamp: string;
  aqi: number; // Air Quality Index
  pm25: number; // ug/m3
  uvIndex: number;
  temperatureC: number;
  humidityPercent: number;
  ambientNoiseDb: number;
  outdoorTrainingRecommendation: 'Ideal' | 'Moderate (Reduce Intensity)' | 'Indoor Advised';
  sunExposureMinutesToday: number;
}

export interface CircadianRoutineMetric {
  typicalBedtime: string;
  typicalWakeTime: string;
  sleepConsistencyScore: number; // 0 - 100
  socialJetlagMinutes: number; // Weekend vs weekday variance
  morningLightExposureMinutes: number;
  eveningScreenTimeMinutes: number;
  recommendation: string;
}

// ----------------------------------------------------
// Systems 43-44: FAMILY / CAREGIVER & EMERGENCY HEALTH
// ----------------------------------------------------
export interface EmergencyHealthCard {
  fullName: string;
  dob: string;
  bloodType: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | 'Unknown';
  criticalAllergies: string[];
  chronicConditions: string[];
  activeMedications: string[];
  emergencyContacts: { name: string; relation: string; phone: string }[];
  primaryDoctor: { name: string; clinic: string; phone: string };
  organDonorStatus: boolean;
  notes: string;
  qrPayload: string;
}

export interface CaregiverProfile {
  id: string;
  name: string;
  role: 'Self' | 'Elderly Parent' | 'Child' | 'Spouse' | 'Dependent';
  avatarColor: string;
  vitalScore: number;
  unreadAlertsCount: number;
  medicationAdherencePct: number;
  emergencyContact: string;
  lastActive: string;
}

// ----------------------------------------------------
// Systems 50-52: INJURY & ACTIVE RECOVERY PROTOCOLS
// ----------------------------------------------------
export interface InjuryRecord {
  id: string;
  bodyRegion: 'Left Knee' | 'Right Knee' | 'Lower Back' | 'Right Shoulder' | 'Left Shoulder' | 'Right Ankle' | 'Neck' | 'Wrist';
  title: string;
  dateReported: string;
  painLevel: number; // 1-10
  severity: 'Mild Strain' | 'Moderate Sprain' | 'Chronic Overuse' | 'Post-Surgical';
  recoveryStage: 'Acute' | 'Subacute' | 'Strengthening' | 'Full Return';
  restrictedExercises: string[];
  allowedSubstitutions: string[];
  rehabProtocols: string[];
  notes: string;
}

export interface RecoveryToolSession {
  id: string;
  toolType: 'Sauna' | 'Cold Plunge' | 'Foam Rolling' | 'Compression Boots' | 'Percussive Massage' | 'Mobility Flow';
  durationMinutes: number;
  intensityOrTemp: string; // e.g. "85°C (185°F)" or "10°C (50°F)"
  date: string;
  subjectivePerceivedBenefit: number; // 1-10
}

// ----------------------------------------------------
// Systems 77-78: AI MODEL COMPARISON LAB & SYNTHESIS
// ----------------------------------------------------
export interface AIModelEvaluation {
  modelName: 'Gemini 2.5 Pro (Google)' | 'Claude 3.7 Sonnet (Anthropic)' | 'GPT-4o (OpenAI)';
  recommendationSummary: string;
  confidenceScorePct: number;
  primaryEvidenceCited: string;
  contradictionsOrHallucinations: string;
  riskAssessment: 'Safe & Evidence-Grounded' | 'Moderate Caution' | 'High Uncertainty';
}

export interface MultiModelConsensusReport {
  timestamp: string;
  userQueryOrContext: string;
  evaluations: AIModelEvaluation[];
  synthesizedActionPlan: string;
  modelAgreementScorePct: number;
}

// ----------------------------------------------------
// Systems 29-31: DATA QUALITY & SOURCE CONFLICTS
// ----------------------------------------------------
export interface DeviceConflictRecord {
  id: string;
  timestamp: string;
  metricName: string;
  deviceA: { name: string; value: string | number; confidenceScore: number };
  deviceB: { name: string; value: string | number; confidenceScore: number };
  resolvedValue: string | number;
  chosenSource: string;
  resolutionReason: string;
  status: 'auto_resolved' | 'manual_review' | 'flagged';
}

export interface DataQualityMetric {
  source: string;
  metricCategory: string;
  samplingFrequency: string;
  missingDataPercentage: number;
  anomalyCount: number;
  trustScore: number;
}

export interface SourceConflictItem {
  id: string;
  metric: string;
  date: string;
  sourceA: { name: string; value: string | number; rawPacket: string };
  sourceB: { name: string; value: string | number; rawPacket: string };
  discrepancyDescription: string;
  resolutionStrategy: 'Prefer Garmin (High Precision GPS)' | 'Prefer Apple Watch (Optical HR)' | 'Average Both' | 'Keep Separate';
  isResolved: boolean;
}


export interface DataCompletenessCategory {
  category: string;
  completenessPct: number;
  daysAvailable: number;
  status: 'Excellent' | 'Good' | 'Partial' | 'Conflicting';
  missingGaps: string[];
}
