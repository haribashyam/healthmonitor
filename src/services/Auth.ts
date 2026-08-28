/**
 * ═══════════════════════════════════════════════════════════════════
 * VITALSYNC AUTHENTICATION & PROFILE SYNC ENGINE
 * File: /src/services/Auth.ts
 *
 * Manages Firebase Authentication state, Google Single Sign-On (SSO),
 * email credentials, and real-time Firestore user profile synchronization.
 * ═══════════════════════════════════════════════════════════════════
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  onAuthStateChanged,
  User as FirebaseUser,
  Unsubscribe
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  getDocFromServer,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize or retrieve Firebase App instance
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Firebase Services
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || undefined);

// Google OAuth Provider Configuration
export const googleAuthProvider = new GoogleAuthProvider();
googleAuthProvider.setCustomParameters({ prompt: 'select_account' });

// Add Google Workspace & Identity scopes
export const GOOGLE_WORKSPACE_SCOPES = [
  'https://mail.google.com/',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive.metadata.readonly',
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/tasks'
];

GOOGLE_WORKSPACE_SCOPES.forEach((scope) => {
  googleAuthProvider.addScope(scope);
});

// Cache access token in memory (never in localStorage)
let cachedAccessToken: string | null = null;
let currentAuthUserProfile: FirebaseUserProfile | null = null;

// Test connection on boot
(async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('[VitalSync Auth] Firestore connected to database:', firebaseConfig.firestoreDatabaseId);
  } catch (error: any) {
    if (error?.message && error.message.includes('the client is offline')) {
      console.warn('[VitalSync Auth] Firestore client is in offline mode or initializing.');
    }
  }
})();

export interface FirebaseUserProfile {
  uid: string;
  userId?: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  role: 'user' | 'clinician' | 'admin';
  targetReadiness?: number;
  restingHRBaseline?: number;
  hrvBaseline?: number;
  vo2MaxBaseline?: number;
  membershipTier?: 'free' | 'pro' | 'clinical' | 'enterprise';
  createdAt?: string;
  updatedAt?: string;
  lastLoginAt?: string;
}

export interface AuthResponse {
  user: FirebaseUserProfile | null;
  accessToken?: string | null;
  isNewUser?: boolean;
  error?: string;
}

/**
 * Maps raw Firebase User into normalized VitalSync FirebaseUserProfile
 */
export function mapFirebaseUserToProfile(fbUser: FirebaseUser, extraData?: Partial<FirebaseUserProfile>): FirebaseUserProfile {
  return {
    uid: fbUser.uid,
    userId: fbUser.uid,
    email: fbUser.email,
    displayName: fbUser.displayName || 'VitalSync Athlete',
    photoURL: fbUser.photoURL || null,
    emailVerified: fbUser.emailVerified,
    role: (extraData?.role as any) || 'user',
    targetReadiness: extraData?.targetReadiness ?? 85,
    restingHRBaseline: extraData?.restingHRBaseline ?? 61,
    hrvBaseline: extraData?.hrvBaseline ?? 64,
    vo2MaxBaseline: extraData?.vo2MaxBaseline ?? 48.5,
    membershipTier: extraData?.membershipTier || 'pro',
    createdAt: extraData?.createdAt || fbUser.metadata.creationTime || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString()
  };
}

/**
 * ═══════════════════════════════════════════════════════════════════
 * GOOGLE SINGLE SIGN-ON (SSO) AUTHENTICATION
 * Function: SignInWithGoogle & signInWithGoogle
 * ═══════════════════════════════════════════════════════════════════
 */
export async function SignInWithGoogle(): Promise<AuthResponse> {
  return signInWithGoogle();
}

export async function signInWithGoogle(): Promise<AuthResponse> {
  try {
    const result = await signInWithPopup(auth, googleAuthProvider);
    const fbUser = result.user;
    
    // Extract OAuth access token if available
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (credential?.accessToken) {
      cachedAccessToken = credential.accessToken;
    }

    // Sync or create user record in partitioned Firestore collection `/users/{userId}`
    const userDocRef = doc(db, 'users', fbUser.uid);
    const existingSnap = await getDoc(userDocRef);
    let isNewUser = false;
    let userProfile: FirebaseUserProfile;

    if (!existingSnap.exists()) {
      isNewUser = true;
      userProfile = mapFirebaseUserToProfile(fbUser, {
        role: 'user',
        membershipTier: 'pro',
        createdAt: new Date().toISOString()
      });

      // Save initial user profile to Firestore
      await setDoc(userDocRef, {
        userId: fbUser.uid,
        uid: fbUser.uid,
        email: fbUser.email || '',
        displayName: fbUser.displayName || 'VitalSync Athlete',
        photoURL: fbUser.photoURL || null,
        emailVerified: fbUser.emailVerified,
        role: 'user',
        membershipTier: 'pro',
        targetReadiness: 85,
        restingHRBaseline: 61,
        hrvBaseline: 64,
        vo2MaxBaseline: 48.5,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        serverCreatedAt: serverTimestamp()
      });

      // Initialize default user baseline goals in partitioned sub-collection
      try {
        const goalRef = doc(db, 'users', fbUser.uid, 'goals', 'goal_initial_vo2max');
        await setDoc(goalRef, {
          id: 'goal_initial_vo2max',
          userId: fbUser.uid,
          title: 'Target VO2 Max Optimization',
          category: 'Cardiovascular',
          targetValue: 52,
          currentValue: 48.5,
          unit: 'mL/kg/min',
          targetDate: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
          progressPercent: 75,
          status: 'in-progress',
          updatedAt: new Date().toISOString()
        });
      } catch (goalErr) {
        console.warn('[VitalSync Auth] Initial goal bootstrap warning:', goalErr);
      }
    } else {
      // Existing user profile sync
      const data = existingSnap.data();
      userProfile = {
        uid: fbUser.uid,
        userId: fbUser.uid,
        email: fbUser.email,
        displayName: data.displayName || fbUser.displayName || 'VitalSync Athlete',
        photoURL: data.photoURL || fbUser.photoURL,
        emailVerified: fbUser.emailVerified,
        role: data.role || 'user',
        targetReadiness: data.targetReadiness ?? 85,
        restingHRBaseline: data.restingHRBaseline ?? 61,
        hrvBaseline: data.hrvBaseline ?? 64,
        vo2MaxBaseline: data.vo2MaxBaseline ?? 48.5,
        membershipTier: data.membershipTier || 'pro',
        createdAt: data.createdAt || fbUser.metadata.creationTime,
        updatedAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      };

      await updateDoc(userDocRef, {
        displayName: fbUser.displayName || data.displayName,
        photoURL: fbUser.photoURL || data.photoURL,
        emailVerified: fbUser.emailVerified,
        lastLoginAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }

    currentAuthUserProfile = userProfile;
    return { user: userProfile, accessToken: cachedAccessToken, isNewUser };
  } catch (err: any) {
    console.error('[VitalSync Auth] Google Sign-In Error:', err);
    return { user: null, error: err.message || 'Google sign-in authorization failed.' };
  }
}

/**
 * ═══════════════════════════════════════════════════════════════════
 * EMAIL / PASSWORD AUTHENTICATION & ACCOUNT REGISTRATION
 * ═══════════════════════════════════════════════════════════════════
 */
export async function RegisterWithEmail(
  email: string,
  password: string,
  displayName: string,
  role: 'user' | 'clinician' = 'user'
): Promise<AuthResponse> {
  return registerWithEmail(email, password, displayName, role);
}

export async function registerWithEmail(
  email: string,
  password: string,
  displayName: string,
  role: 'user' | 'clinician' = 'user'
): Promise<AuthResponse> {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const fbUser = cred.user;

    await updateProfile(fbUser, { displayName });

    try {
      await sendEmailVerification(fbUser);
    } catch (verifErr) {
      console.warn('[VitalSync Auth] Verification dispatch warning:', verifErr);
    }

    const userDocRef = doc(db, 'users', fbUser.uid);
    const profile: FirebaseUserProfile = {
      uid: fbUser.uid,
      userId: fbUser.uid,
      email: fbUser.email,
      displayName: displayName || 'Athlete',
      photoURL: null,
      emailVerified: fbUser.emailVerified,
      role,
      membershipTier: 'pro',
      targetReadiness: 85,
      restingHRBaseline: 61,
      hrvBaseline: 64,
      vo2MaxBaseline: 48.5,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    };

    await setDoc(userDocRef, {
      userId: fbUser.uid,
      uid: fbUser.uid,
      email: fbUser.email || '',
      displayName: displayName || 'Athlete',
      photoURL: null,
      emailVerified: fbUser.emailVerified,
      role,
      membershipTier: 'pro',
      targetReadiness: 85,
      restingHRBaseline: 61,
      hrvBaseline: 64,
      vo2MaxBaseline: 48.5,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      serverCreatedAt: serverTimestamp()
    });

    currentAuthUserProfile = profile;
    return { user: profile, isNewUser: true };
  } catch (err: any) {
    console.error('[VitalSync Auth] Registration error:', err);
    return { user: null, error: err.message || 'Registration failed.' };
  }
}

export async function SignInWithEmail(email: string, password: string): Promise<AuthResponse> {
  return signInWithEmail(email, password);
}

export async function signInWithEmail(email: string, password: string): Promise<AuthResponse> {
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const fbUser = cred.user;

    const userDocRef = doc(db, 'users', fbUser.uid);
    const snap = await getDoc(userDocRef);

    let profile: FirebaseUserProfile;
    if (snap.exists()) {
      const data = snap.data();
      profile = {
        uid: fbUser.uid,
        userId: fbUser.uid,
        email: fbUser.email,
        displayName: data.displayName || fbUser.displayName || 'VitalSync Athlete',
        photoURL: data.photoURL || fbUser.photoURL,
        emailVerified: fbUser.emailVerified,
        role: data.role || 'user',
        targetReadiness: data.targetReadiness ?? 85,
        restingHRBaseline: data.restingHRBaseline ?? 61,
        hrvBaseline: data.hrvBaseline ?? 64,
        vo2MaxBaseline: data.vo2MaxBaseline ?? 48.5,
        membershipTier: data.membershipTier || 'pro',
        createdAt: data.createdAt,
        updatedAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      };

      await updateDoc(userDocRef, {
        lastLoginAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        emailVerified: fbUser.emailVerified
      });
    } else {
      profile = mapFirebaseUserToProfile(fbUser);
      await setDoc(userDocRef, {
        userId: fbUser.uid,
        uid: fbUser.uid,
        email: fbUser.email || '',
        displayName: fbUser.displayName || 'VitalSync Athlete',
        role: 'user',
        membershipTier: 'pro',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      });
    }

    currentAuthUserProfile = profile;
    return { user: profile };
  } catch (err: any) {
    console.error('[VitalSync Auth] Email Sign-In error:', err);
    return { user: null, error: err.message || 'Authentication failed.' };
  }
}

/**
 * Dispatch Password Reset Email
 */
export async function SendPasswordReset(email: string): Promise<{ success: boolean; error?: string }> {
  return sendPasswordReset(email);
}

export async function sendPasswordReset(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to dispatch password recovery email.' };
  }
}

/**
 * Sign out user session
 */
export async function SignOutUser(): Promise<{ success: boolean }> {
  return signOutUser();
}

export async function signOutUser(): Promise<{ success: boolean }> {
  try {
    await signOut(auth);
    cachedAccessToken = null;
    currentAuthUserProfile = null;
    return { success: true };
  } catch (err) {
    return { success: false };
  }
}

/**
 * ═══════════════════════════════════════════════════════════════════
 * AUTH STATE SUBSCRIPTION & GETTERS
 * ═══════════════════════════════════════════════════════════════════
 */
export function subscribeToAuthState(
  callback: (user: FirebaseUserProfile | null, fbUser: FirebaseUser | null) => void
): Unsubscribe {
  return onAuthStateChanged(auth, async (fbUser) => {
    if (fbUser) {
      try {
        const userDocRef = doc(db, 'users', fbUser.uid);
        const snap = await getDoc(userDocRef);
        if (snap.exists()) {
          const data = snap.data();
          currentAuthUserProfile = {
            uid: fbUser.uid,
            userId: fbUser.uid,
            email: fbUser.email,
            displayName: data.displayName || fbUser.displayName || 'VitalSync Athlete',
            photoURL: data.photoURL || fbUser.photoURL,
            emailVerified: fbUser.emailVerified,
            role: data.role || 'user',
            targetReadiness: data.targetReadiness ?? 85,
            restingHRBaseline: data.restingHRBaseline ?? 61,
            hrvBaseline: data.hrvBaseline ?? 64,
            vo2MaxBaseline: data.vo2MaxBaseline ?? 48.5,
            membershipTier: data.membershipTier || 'pro',
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            lastLoginAt: data.lastLoginAt
          };
        } else {
          currentAuthUserProfile = mapFirebaseUserToProfile(fbUser);
        }
      } catch (err) {
        currentAuthUserProfile = mapFirebaseUserToProfile(fbUser);
      }
      callback(currentAuthUserProfile, fbUser);
    } else {
      cachedAccessToken = null;
      currentAuthUserProfile = null;
      callback(null, null);
    }
  });
}

export function getCurrentUser(): FirebaseUserProfile | null {
  return currentAuthUserProfile;
}

export function getCachedAccessToken(): string | null {
  return cachedAccessToken;
}

export function setCachedAccessToken(token: string | null): void {
  cachedAccessToken = token;
}

/**
 * ═══════════════════════════════════════════════════════════════════
 * USER PARTITIONED FIRESTORE DATA PROFILE SYNC HELPERS
 * ═══════════════════════════════════════════════════════════════════
 */
export const DataProfileSync = {
  /**
   * Updates user profile attributes in `/users/{userId}`
   */
  async updateProfileData(uid: string, updates: Partial<FirebaseUserProfile>): Promise<void> {
    const userDocRef = doc(db, 'users', uid);
    await updateDoc(userDocRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
    if (currentAuthUserProfile && currentAuthUserProfile.uid === uid) {
      currentAuthUserProfile = { ...currentAuthUserProfile, ...updates, updatedAt: new Date().toISOString() };
    }
  },

  /**
   * Syncs a blood biomarker or laboratory record
   */
  async syncBiomarker(uid: string, biomarker: {
    id: string;
    name: string;
    value: string;
    unit: string;
    referenceRange?: string;
    status: 'optimal' | 'normal' | 'borderline' | 'abnormal';
    category: string;
    date: string;
    source?: string;
  }): Promise<void> {
    const ref = doc(db, 'users', uid, 'biomarkers', biomarker.id);
    await setDoc(ref, {
      ...biomarker,
      userId: uid,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  },

  /**
   * Syncs subjective daily recovery, mood and journal log
   */
  async syncJournalEntry(uid: string, entry: {
    id: string;
    date: string;
    energyLevel: number;
    stressLevel: number;
    muscleSoreness?: number;
    notes?: string;
    tags?: string[];
  }): Promise<void> {
    const ref = doc(db, 'users', uid, 'journal', entry.id);
    await setDoc(ref, {
      ...entry,
      userId: uid,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  },

  /**
   * Syncs fitness activity or endurance workout
   */
  async syncActivity(uid: string, activity: {
    id: string;
    title: string;
    type: string;
    durationMinutes: number;
    calories: number;
    avgHeartRate?: number;
    maxHeartRate?: number;
    date: string;
    time?: string;
    source?: string;
  }): Promise<void> {
    const ref = doc(db, 'users', uid, 'activities', activity.id);
    await setDoc(ref, {
      ...activity,
      userId: uid,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  },

  /**
   * Syncs a target health or biomarker goal
   */
  async syncHealthGoal(uid: string, goal: {
    id: string;
    title: string;
    category: string;
    targetValue: number;
    currentValue?: number;
    unit: string;
    targetDate?: string;
    progressPercent?: number;
    status?: string;
  }): Promise<void> {
    const ref = doc(db, 'users', uid, 'goals', goal.id);
    await setDoc(ref, {
      ...goal,
      userId: uid,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  }
};
