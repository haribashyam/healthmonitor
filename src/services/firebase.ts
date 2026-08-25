import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
  signOut as fbSignOut
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  onSnapshot,
  getDocFromServer,
  query,
  orderBy,
  limit
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { Biomarker, LabReport, AdaptivePlan } from '../types';

// Initialize Firebase SDK
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Configure Google Auth Provider with all requested Workspace scopes
export const googleAuthProvider = new GoogleAuthProvider();
export const SCOPES = [
  'https://mail.google.com/',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.compose',
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/spreadsheets.readonly',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive.metadata.readonly',
  'https://www.googleapis.com/auth/drive.readonly',
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/tasks'
];

SCOPES.forEach(scope => {
  googleAuthProvider.addScope(scope);
});

// Cache access token in memory (never localStorage per guidelines)
let cachedAccessToken: string | null = null;
let isSigningIn = false;

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(p => ({
        providerId: p.providerId,
        email: p.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test connection on boot
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    if (auth.currentUser) {
      await getDocFromServer(doc(db, 'test', 'connection'));
    }
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore offline warning:', error.message);
    }
    return false;
  }
}

// Auth state management
export const initFirebaseAuth = (
  onAuthSuccess?: (user: User, token: string | null) => void,
  onAuthChange?: (user: User | null) => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (onAuthSuccess && cachedAccessToken) {
        onAuthSuccess(user, cachedAccessToken);
      }
      if (onAuthChange) {
        onAuthChange(user);
      }
      // Test server connection
      testFirestoreConnection().catch(console.warn);
    } else {
      cachedAccessToken = null;
      if (onAuthChange) {
        onAuthChange(null);
      }
    }
  });
};

export const signInWithGoogle = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, googleAuthProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential?.accessToken || null;
    
    if (token) {
      cachedAccessToken = token;
    }
    
    // Save or update user document in Firestore
    if (result.user) {
      await saveUserProfile(result.user);
    }

    return { user: result.user, accessToken: cachedAccessToken || '' };
  } catch (error: any) {
    console.error('Google Sign In Error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getCachedAccessToken = (): string | null => {
  return cachedAccessToken;
};

export const setCachedAccessToken = (token: string): void => {
  cachedAccessToken = token;
};

export const signOutUser = async (): Promise<void> => {
  await fbSignOut(auth);
  cachedAccessToken = null;
};

// Firestore User Profile operations
export async function saveUserProfile(user: User, preferences?: any): Promise<void> {
  const path = `users/${user.uid}`;
  try {
    const userDocRef = doc(db, 'users', user.uid);
    await setDoc(userDocRef, {
      userId: user.uid,
      email: user.email || '',
      displayName: user.displayName || 'VitalSync Athlete',
      targetReadiness: preferences?.targetReadiness || 85,
      restingHRBaseline: preferences?.restingHRBaseline || 61,
      hrvBaseline: preferences?.hrvBaseline || 64,
      vo2MaxBaseline: preferences?.vo2MaxBaseline || 48.5,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Firestore Health Metrics sync
export async function syncTelemetryToFirestore(userId: string, telemetryRecord: any): Promise<void> {
  const docId = telemetryRecord.id || `metric_${Date.now()}`;
  const path = `users/${userId}/metrics/${docId}`;
  try {
    const docRef = doc(db, 'users', userId, 'metrics', docId);
    await setDoc(docRef, {
      id: docId,
      userId,
      date: telemetryRecord.date || new Date().toISOString().split('T')[0],
      heartRate: telemetryRecord.heartRate || 68,
      restingHeartRate: telemetryRecord.restingHeartRate || 61,
      hrv: telemetryRecord.hrv || 64,
      sleepScore: telemetryRecord.sleepScore || 85,
      steps: telemetryRecord.steps || 9840,
      spo2: telemetryRecord.spo2 || 98,
      vo2Max: telemetryRecord.vo2Max || 48.5,
      deviceSource: telemetryRecord.deviceSource || 'Apple Watch Ultra',
      timestamp: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Firestore Adaptive Plan sync
export async function saveAdaptivePlanToFirestore(userId: string, plan: AdaptivePlan): Promise<void> {
  const planId = 'active_plan';
  const path = `users/${userId}/plans/${planId}`;
  try {
    const docRef = doc(db, 'users', userId, 'plans', planId);
    await setDoc(docRef, {
      id: planId,
      userId,
      planName: plan.planName || 'Adaptive Endurance Protocol',
      vitalScoreTarget: plan.vitalScoreTarget || 88,
      summary: plan.summary || '',
      workoutSplitJson: JSON.stringify(plan.workoutSplit || []),
      nutritionJson: JSON.stringify(plan.nutritionTargets || {}),
      groceryJson: JSON.stringify(plan.groceryEssentials || []),
      adaptiveRulesJson: JSON.stringify(plan.adaptiveRules || []),
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Firestore Lab Report sync
export async function saveLabReportToFirestore(userId: string, report: LabReport, biomarkers: Biomarker[]): Promise<void> {
  const reportId = report.id || `lab_${Date.now()}`;
  const path = `users/${userId}/labReports/${reportId}`;
  try {
    const docRef = doc(db, 'users', userId, 'labReports', reportId);
    await setDoc(docRef, {
      id: reportId,
      userId,
      title: report.title,
      laboratory: report.laboratory,
      collectionDate: report.date || new Date().toISOString(),
      summary: report.summary,
      biomarkersJson: JSON.stringify(biomarkers || []),
      source: report.laboratory || 'Quest Diagnostics',
      driveFileId: (report as any).driveFileId || '',
      createdAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Firestore Workspace Integration Logs sync
export async function logWorkspaceActivity(userId: string, action: {
  actionType: 'gmail_send' | 'sheets_export' | 'sheets_import' | 'picker_import' | 'calendar_sync' | 'tasks_sync';
  target: string;
  details: string;
  status: 'success' | 'pending' | 'error';
}): Promise<void> {
  const logId = `ws_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const path = `users/${userId}/workspaceLogs/${logId}`;
  try {
    const docRef = doc(db, 'users', userId, 'workspaceLogs', logId);
    await setDoc(docRef, {
      id: logId,
      userId,
      actionType: action.actionType,
      target: action.target,
      details: action.details,
      status: action.status,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}
