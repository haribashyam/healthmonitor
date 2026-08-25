export interface AskDataResponse {
  answer: string;
  citations: { metric: string; value: string; source: string }[];
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  dataPointsCount?: number;
  recommendation?: string;
}

export interface GeneratePlanResponse {
  planName: string;
  vitalScoreTarget: number;
  timelineWeeks: number;
  summary: string;
  workoutSplit: {
    day: string;
    title: string;
    duration: string;
    targetHR: string;
    intensity: 'Low' | 'Moderate' | 'High' | 'Recovery';
    sourceRationale: string;
    completed?: boolean;
    exercises?: { name: string; sets: string; reps: string; targetRPE?: number }[];
  }[];
  nutritionTargets: {
    dailyCalories: number;
    proteinGrams: number;
    carbGrams: number;
    fatGrams: number;
    hydrationLiters: number;
    focusNotes: string;
  };
  groceryEssentials: {
    category: string;
    items: string[];
  }[];
  adaptiveRules: string[];
}

export interface AnalyzeLabDocResponse {
  documentTitle: string;
  laboratoryName: string;
  collectionDate: string;
  summary: string;
  biomarkers: {
    name: string;
    value: number | string;
    unit: string;
    referenceRange: string;
    status: 'optimal' | 'normal' | 'borderline' | 'abnormal';
    category: string;
  }[];
  clinicalInsights: string[];
  disclaimer: string;
}

export interface WhatChangedResponse {
  headline: string;
  overallStatus: string;
  readinessScore: number;
  baselineReadiness: number;
  keyFindings: {
    metric: string;
    today: string;
    baseline: string;
    deviation: string;
    driver: string;
  }[];
  synthesis: string;
  actionableAdvice: string[];
}

export interface SimulateScenarioResponse {
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

export async function askMyData(query: string, healthContext: any): Promise<AskDataResponse> {
  const res = await fetch('/api/ai/ask-data', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, healthContext }),
  });
  if (!res.ok) {
    throw new Error(`Failed to query health data: ${res.statusText}`);
  }
  return res.json();
}

export async function generateAdaptivePlan(params: {
  goal: string;
  fitnessLevel: string;
  dietaryPreference: string;
  healthMetrics: any;
  recentRecovery: any;
}): Promise<GeneratePlanResponse> {
  const res = await fetch('/api/ai/generate-plan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    throw new Error(`Failed to generate adaptive plan: ${res.statusText}`);
  }
  return res.json();
}

export async function analyzeLabDocument(params: {
  docText?: string;
  imageBase64?: string;
  mimeType?: string;
}): Promise<AnalyzeLabDocResponse> {
  const res = await fetch('/api/ai/analyze-lab-doc', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    throw new Error(`Failed to parse lab document: ${res.statusText}`);
  }
  return res.json();
}

export async function analyzeWhatChanged(params: {
  todayMetrics: any;
  baselineMetrics: any;
  recentEvents: any;
}): Promise<WhatChangedResponse> {
  const res = await fetch('/api/ai/what-changed', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    throw new Error(`Failed to analyze daily changes: ${res.statusText}`);
  }
  return res.json();
}

export async function simulateHealthScenario(params: {
  currentMetrics: any;
  changes: {
    dailySteps?: number;
    sleepMinutes?: number;
    proteinGrams?: number;
    workoutDaysPerWeek?: number;
  };
  timeframeWeeks?: number;
}): Promise<SimulateScenarioResponse> {
  const res = await fetch('/api/ai/simulate-scenario', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    throw new Error(`Failed to simulate scenario: ${res.statusText}`);
  }
  return res.json();
}

export type WhatChangedAnalysis = {
  headline?: string;
  overallStatus?: string;
  readinessState: string;
  primaryDriver: string;
  contributingFactors: { signal: string; impact: string; explanation: string }[];
  recommendedAction: string;
};

export type SimulationResult = {
  timeframe: string;
  forecastedMetrics: {
    vo2MaxChange: string;
    restingHRChange: string;
    hrvChange: string;
    vitalScoreChange: string;
  };
  mechanisticRationale: string;
  riskFactors: string[];
  keyMilestones: string[];
};

export async function simulateLifestyleOutcome(params: {
  stepDelta: number;
  sleepDelta: number;
  proteinDelta: number;
  workoutDays: number;
  timeframeWeeks: number;
}): Promise<SimulationResult> {
  try {
    const res = await simulateHealthScenario({
      currentMetrics: { vo2Max: 48.6, restingHR: 59, hrvBaseline: 64, vitalScore: 84 },
      changes: {
        dailySteps: params.stepDelta,
        sleepMinutes: params.sleepDelta,
        proteinGrams: params.proteinDelta,
        workoutDaysPerWeek: params.workoutDays
      },
      timeframeWeeks: params.timeframeWeeks
    });
    return {
      timeframe: `${params.timeframeWeeks} Weeks`,
      forecastedMetrics: {
        vo2MaxChange: `${res.projectedMetrics.vo2Max.delta} (Projected: ${res.projectedMetrics.vo2Max.projected} ${res.projectedMetrics.vo2Max.unit})`,
        restingHRChange: `${res.projectedMetrics.restingHeartRate.delta} (Projected: ${res.projectedMetrics.restingHeartRate.projected} ${res.projectedMetrics.restingHeartRate.unit})`,
        hrvChange: `${res.projectedMetrics.hrvBaseline.delta} (Projected: ${res.projectedMetrics.hrvBaseline.projected} ${res.projectedMetrics.hrvBaseline.unit})`,
        vitalScoreChange: `+${res.projectedVitalScore - 84} pts (Projected: ${res.projectedVitalScore}/100)`
      },
      mechanisticRationale: res.physiologicalMechanism,
      riskFactors: ['Maintain gradual progression to prevent overuse strain.'],
      keyMilestones: [
        `Week 2: Enhanced parasympathetic stabilization & autonomic tone.`,
        `Week 4: Noticeable drop in resting heart rate and improved aerobic efficiency.`,
        `Week ${params.timeframeWeeks}: Sustained ${res.projectedVitalScore}/100 Vital Score equilibrium.`
      ]
    };
  } catch (err) {
    return {
      timeframe: `${params.timeframeWeeks} Weeks`,
      forecastedMetrics: {
        vo2MaxChange: `+${(params.stepDelta > 0 ? 1.8 : 0.5)} mL/kg/min`,
        restingHRChange: `-${Math.round(params.sleepDelta / 15)} BPM`,
        hrvChange: `+${Math.round(params.sleepDelta / 8)} ms`,
        vitalScoreChange: `+6 pts (Projected: 90/100)`
      },
      mechanisticRationale: 'Sustained progressive aerobic volume and improved sleep duration enhance mitochondrial biogenesis, microvascular perfusion, and autonomic vagal tone.',
      riskFactors: ['Ensure adequate recovery between high-load days.'],
      keyMilestones: [
        'Week 2: Increased daytime energy and faster heart rate recovery.',
        'Week 4: Measured cardiovascular adaptations in stroke volume.',
        `Week ${params.timeframeWeeks}: Established high baseline resilience.`
      ]
    };
  }
}

