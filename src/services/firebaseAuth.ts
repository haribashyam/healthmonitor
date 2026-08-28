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
  User as FirebaseUser
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
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Firebase Services
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || undefined);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Test connection on boot
(async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('[Firebase] Firestore initialized successfully with database:', firebaseConfig.firestoreDatabaseId);
  } catch (error: any) {
    if (error?.message && error.message.includes('the client is offline')) {
      console.warn('[Firebase] Firestore client is in offline mode or database is initializing.');
    }
  }
})();

export interface FirebaseUserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  role: 'user' | 'clinician' | 'admin';
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Sign in with Google Popup
 */
export async function signInWithGoogle(): Promise<{ user: FirebaseUserProfile | null; error?: string }> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const fbUser = result.user;
    
    // Sync or create user record in partitioned Firestore collection `/users/{userId}`
    const userDocRef = doc(db, 'users', fbUser.uid);
    const existingSnap = await getDoc(userDocRef);
    
    let userProfile: FirebaseUserProfile;
    if (!existingSnap.exists()) {
      userProfile = {
        uid: fbUser.uid,
        email: fbUser.email,
        displayName: fbUser.displayName || 'VitalSync Athlete',
        photoURL: fbUser.photoURL,
        emailVerified: fbUser.emailVerified,
        role: 'user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      await setDoc(userDocRef, {
        userId: fbUser.uid,
        ...userProfile,
        serverCreatedAt: serverTimestamp()
      });
    } else {
      const data = existingSnap.data();
      userProfile = {
        uid: fbUser.uid,
        email: fbUser.email,
        displayName: data.displayName || fbUser.displayName,
        photoURL: data.photoURL || fbUser.photoURL,
        emailVerified: fbUser.emailVerified,
        role: data.role || 'user',
        createdAt: data.createdAt,
        updatedAt: new Date().toISOString()
      };
      await updateDoc(userDocRef, {
        updatedAt: new Date().toISOString(),
        emailVerified: fbUser.emailVerified
      });
    }

    return { user: userProfile };
  } catch (err: any) {
    console.error('Google Sign-In Error:', err);
    return { user: null, error: err.message || 'Google sign-in failed' };
  }
}

/**
 * Register user with Email and Password
 */
export async function registerWithEmail(
  email: string, 
  password: string, 
  displayName: string,
  role: 'user' | 'clinician' = 'user'
): Promise<{ user: FirebaseUserProfile | null; error?: string }> {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const fbUser = cred.user;

    // Update Firebase Auth profile
    await updateProfile(fbUser, { displayName });

    // Send email verification
    try {
      await sendEmailVerification(fbUser);
    } catch (e) {
      console.warn('Email verification send warning:', e);
    }

    // Provision user document in Firestore `/users/{userId}`
    const userDocRef = doc(db, 'users', fbUser.uid);
    const profile: FirebaseUserProfile = {
      uid: fbUser.uid,
      email: fbUser.email,
      displayName: displayName || 'Athlete',
      photoURL: null,
      emailVerified: fbUser.emailVerified,
      role: role,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await setDoc(userDocRef, {
      userId: fbUser.uid,
      ...profile,
      serverCreatedAt: serverTimestamp()
    });

    return { user: profile };
  } catch (err: any) {
    console.error('Registration error:', err);
    return { user: null, error: err.message || 'Registration failed' };
  }
}

/**
 * Sign in with Email and Password
 */
export async function signInWithEmail(
  email: string, 
  password: string
): Promise<{ user: FirebaseUserProfile | null; error?: string }> {
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
        email: fbUser.email,
        displayName: data.displayName || fbUser.displayName,
        photoURL: data.photoURL || fbUser.photoURL,
        emailVerified: fbUser.emailVerified,
        role: data.role || 'user',
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
      };
    } else {
      profile = {
        uid: fbUser.uid,
        email: fbUser.email,
        displayName: fbUser.displayName || 'VitalSync Athlete',
        photoURL: fbUser.photoURL,
        emailVerified: fbUser.emailVerified,
        role: 'user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      await setDoc(userDocRef, {
        userId: fbUser.uid,
        ...profile
      });
    }

    return { user: profile };
  } catch (err: any) {
    console.error('Email sign-in error:', err);
    return { user: null, error: err.message || 'Authentication failed' };
  }
}

/**
 * Send password reset email
 */
export async function sendPasswordReset(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to dispatch reset email' };
  }
}

/**
 * Sign out of current session
 */
export async function signOutUser(): Promise<{ success: boolean }> {
  try {
    await signOut(auth);
    return { success: true };
  } catch (err) {
    return { success: false };
  }
}

/**
 * User-partitioned Firestore Data Helpers:
 * Guarantees all data read/writes are partitioned strictly under `/users/{uid}/*`
 */
export const UserFirestoreService = {
  // Biomarkers
  async saveBiomarker(uid: string, biomarker: any) {
    const ref = doc(db, 'users', uid, 'biomarkers', biomarker.id);
    await setDoc(ref, {
      ...biomarker,
      userId: uid,
      updatedAt: new Date().toISOString()
    });
  },

  async getBiomarkers(uid: string) {
    const colRef = collection(db, 'users', uid, 'biomarkers');
    const snap = await getDocs(colRef);
    return snap.docs.map(d => d.data());
  },

  // Daily Journal
  async saveJournalEntry(uid: string, entry: any) {
    const ref = doc(db, 'users', uid, 'journal', entry.id);
    await setDoc(ref, {
      ...entry,
      userId: uid,
      updatedAt: new Date().toISOString()
    });
  },

  async getJournalEntries(uid: string) {
    const colRef = collection(db, 'users', uid, 'journal');
    const snap = await getDocs(colRef);
    return snap.docs.map(d => d.data());
  },

  // Activities
  async saveActivity(uid: string, activity: any) {
    const ref = doc(db, 'users', uid, 'activities', activity.id);
    await setDoc(ref, {
      ...activity,
      userId: uid,
      updatedAt: new Date().toISOString()
    });
  },

  async getActivities(uid: string) {
    const colRef = collection(db, 'users', uid, 'activities');
    const snap = await getDocs(colRef);
    return snap.docs.map(d => d.data());
  },

  // Health Goals
  async saveHealthGoal(uid: string, goal: any) {
    const ref = doc(db, 'users', uid, 'goals', goal.id);
    await setDoc(ref, {
      ...goal,
      userId: uid,
      updatedAt: new Date().toISOString()
    });
  },

  async getHealthGoals(uid: string) {
    const colRef = collection(db, 'users', uid, 'goals');
    const snap = await getDocs(colRef);
    return snap.docs.map(d => d.data());
  }
};
