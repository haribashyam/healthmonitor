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
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to parse lab document: ${res.statusText}`);
  }
  return res.json();
}

export interface StoredFileRecord {
  id: string;
  storageKey: string;
  originalFilename: string;
  sanitizedFilename: string;
  mimeType: string;
  sizeBytes: number;
  sha256: string;
  uploadedAt: string;
  ownerUid?: string;
  category: string;
  objectStorageUrl: string;
  status: 'stored_and_scanned' | 'quarantined' | 'archived';
  metadata?: Record<string, any>;
}

export interface FileUploadResult {
  success: boolean;
  message?: string;
  object?: StoredFileRecord;
  error?: string;
  code?: string;
  details?: any;
}

export async function uploadAndValidateFileToStorage(params: {
  filename: string;
  fileBase64: string;
  claimedMimeType: string;
  category?: 'clinical_lab_report' | 'imaging_scan' | 'telemetry_archive' | 'general_doc';
  metadata?: Record<string, any>;
}): Promise<FileUploadResult> {
  const res = await fetch('/api/storage/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || `Upload validation error (${res.status}): ${res.statusText}`);
  }
  return data;
}

export async function listStoredFiles(): Promise<StoredFileRecord[]> {
  const res = await fetch('/api/storage/files');
  if (!res.ok) {
    throw new Error('Failed to list stored files');
  }
  const data = await res.json();
  return data.files || [];
}

export async function deleteStoredFile(id: string): Promise<boolean> {
  const res = await fetch(`/api/storage/files/${id}`, {
    method: 'DELETE',
  });
  return res.ok;
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

// ============================================================================
// AUTHENTICATION & SECURITY CLIENT API METHODS
// ============================================================================

export interface AuthUserProfile {
  id: string;
  email: string;
  displayName: string;
  role: 'user' | 'clinician' | 'admin';
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  expiresAt?: number;
  verificationToken?: string;
  user?: AuthUserProfile;
  error?: string;
  code?: string;
  attemptsRemaining?: number;
  remainingLockoutSeconds?: number;
  message?: string;
  resetToken?: string;
}

export interface SecurityEventRecord {
  id: string;
  timestamp: string;
  eventType: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  userId?: string;
  email?: string;
  ip: string;
  userAgent?: string;
  details: Record<string, any>;
}

// In-Memory Token Manager (Client side)
let memoryAuthToken: string | null = null;

export function setClientAuthToken(token: string | null) {
  memoryAuthToken = token;
  if (token) {
    sessionStorage.setItem('vitalos_session_token', token);
  } else {
    sessionStorage.removeItem('vitalos_session_token');
  }
}

export function getClientAuthToken(): string | null {
  if (memoryAuthToken) return memoryAuthToken;
  try {
    const saved = sessionStorage.getItem('vitalos_session_token');
    if (saved) {
      memoryAuthToken = saved;
      return saved;
    }
  } catch {}
  return null;
}

function getAuthHeaders(): HeadersInit {
  const token = getClientAuthToken();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export async function loginUser(credentials: { email: string; password: string }): Promise<AuthResponse> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  const data = await res.json();
  if (res.ok && data.token) {
    setClientAuthToken(data.token);
  }
  return data;
}

export async function registerUser(payload: { email: string; password: string; displayName: string; role?: 'user' | 'clinician' | 'admin' }): Promise<AuthResponse> {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (res.ok && data.token) {
    setClientAuthToken(data.token);
  }
  return data;
}

export async function verifyEmailAddress(token: string): Promise<AuthResponse> {
  const res = await fetch('/api/auth/verify-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token })
  });
  return res.json();
}

export async function requestPasswordResetLink(email: string): Promise<AuthResponse> {
  const res = await fetch('/api/auth/forgot-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  return res.json();
}

export async function submitPasswordReset(params: { token: string; newPassword: string }): Promise<AuthResponse> {
  const res = await fetch('/api/auth/reset-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });
  return res.json();
}

export async function logoutUser(): Promise<void> {
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      headers: getAuthHeaders()
    });
  } finally {
    setClientAuthToken(null);
  }
}

export async function fetchCurrentUser(): Promise<AuthUserProfile | null> {
  const token = getClientAuthToken();
  if (!token) return null;

  try {
    const res = await fetch('/api/auth/me', {
      headers: getAuthHeaders()
    });
    if (!res.ok) {
      if (res.status === 401) {
        setClientAuthToken(null);
      }
      return null;
    }
    const data = await res.json();
    return data.user || null;
  } catch {
    return null;
  }
}

export async function fetchSecurityAuditLogs(limit = 50): Promise<SecurityEventRecord[]> {
  const res = await fetch(`/api/admin/security-events?limit=${limit}`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) {
    throw new Error('Failed to retrieve security audit logs (admin access required)');
  }
  const data = await res.json();
  return data.events || [];
}

export async function fetchAdminSystemStats(): Promise<any> {
  const res = await fetch('/api/admin/audit-logs', {
    headers: getAuthHeaders()
  });
  if (!res.ok) {
    throw new Error('Failed to retrieve system stats');
  }
  return res.json();
}

