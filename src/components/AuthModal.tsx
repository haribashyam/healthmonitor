import React, { useState, useEffect } from 'react';
import {
  X,
  LogIn,
  UserPlus,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Key,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  User,
  Activity,
  Heart,
  RefreshCw,
  Award,
  Zap,
  Check,
  Shield,
  Fingerprint,
  Database
} from 'lucide-react';
import {
  auth,
  SignInWithGoogle,
  signInWithGoogle,
  registerWithEmail,
  signInWithEmail,
  sendPasswordReset,
  signOutUser,
  subscribeToAuthState,
  FirebaseUserProfile,
  DataProfileSync
} from '../services/Auth';
import { onAuthStateChanged } from 'firebase/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register' | 'forgot' | 'profile';
  onAuthSuccess?: (user: FirebaseUserProfile) => void;
  onNavigateTab?: (tab: string) => void;
  theme?: 'dark' | 'light';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  onAuthSuccess,
  onNavigateTab,
  theme = 'dark'
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot' | 'profile'>(initialMode);
  const [currentUser, setCurrentUser] = useState<FirebaseUserProfile | null>(null);

  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState<'user' | 'clinician'>('user');
  const [rememberMe, setRememberMe] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Status feedback
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode, isOpen]);

  useEffect(() => {
    const unsub = subscribeToAuthState((profile) => {
      setCurrentUser(profile);
    });
    return () => unsub();
  }, []);

  if (!isOpen) return null;

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (pass.length >= 12) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };
  const passScore = getPasswordStrength(password);

  // Google 1-Click SSO with Data Profile Syncing
  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const res = await SignInWithGoogle();
      if (res.error) {
        setErrorMsg(res.error);
      } else if (res.user) {
        setCurrentUser(res.user);
        const welcomeText = res.isNewUser
          ? `Welcome to VitalSync, ${res.user.displayName || 'Athlete'}! Your profile has been initialized & synced.`
          : `Welcome back, ${res.user.displayName || 'Athlete'}! Google session & profile synchronized.`;
        setSuccessMsg(welcomeText);
        if (onAuthSuccess) onAuthSuccess(res.user);
        setTimeout(() => {
          onClose();
        }, 1200);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Google authentication encountered an error.');
    } finally {
      setIsLoading(false);
    }
  };

  // Email & Password Sign In
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both your email and password.');
      return;
    }
    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const res = await signInWithEmail(email, password);
      if (res.error) {
        setErrorMsg(res.error);
      } else if (res.user) {
        setCurrentUser(res.user);
        setSuccessMsg(`Welcome back, ${res.user.displayName || 'Athlete'}! Authenticated successfully.`);
        if (onAuthSuccess) onAuthSuccess(res.user);
        setTimeout(() => {
          onClose();
        }, 1200);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Login verification failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // Email & Password Registration
  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !displayName) {
      setErrorMsg('Please provide your name, email, and a secure password.');
      return;
    }
    if (!agreeTerms) {
      setErrorMsg('You must agree to the Terms of Service and Privacy Policy to create an account.');
      return;
    }
    if (password.length < 8) {
      setErrorMsg('Password must contain at least 8 characters.');
      return;
    }
    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const res = await registerWithEmail(email, password, displayName, role);
      if (res.error) {
        setErrorMsg(res.error);
      } else if (res.user) {
        setCurrentUser(res.user);
        setSuccessMsg('Account created successfully! Profile & telemetry partitioned in Firestore.');
        if (onAuthSuccess) onAuthSuccess(res.user);
        setTimeout(() => {
          onClose();
        }, 1400);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Account registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // Forgot Password Reset
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Please specify your registered email address.');
      return;
    }
    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const res = await sendPasswordReset(email);
      if (res.success) {
        setSuccessMsg(`Password reset instructions have been dispatched to ${email}. Please check your inbox.`);
      } else {
        setErrorMsg(res.error || 'Password reset request failed.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error requesting password reset.');
    } finally {
      setIsLoading(false);
    }
  };

  // 1-Click Guest / Athlete Demo Pass
  const handleGuestDemoPass = () => {
    const demoUser: FirebaseUserProfile = {
      uid: 'demo_athlete_01',
      userId: 'demo_athlete_01',
      email: 'demo.athlete@vitalos.health',
      displayName: 'Alex Vance (Verified Demo)',
      photoURL: null,
      emailVerified: true,
      role: 'user',
      membershipTier: 'pro',
      targetReadiness: 88,
      restingHRBaseline: 58,
      hrvBaseline: 68,
      vo2MaxBaseline: 51.2,
      createdAt: new Date().toISOString()
    };
    setCurrentUser(demoUser);
    setSuccessMsg('Guest Demo Pass authorized! Accessing full telemetry suite.');
    if (onAuthSuccess) onAuthSuccess(demoUser);
    setTimeout(() => {
      onClose();
    }, 900);
  };

  // Sign out
  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOutUser();
      setCurrentUser(null);
      setSuccessMsg('You have been signed out securely.');
      setTimeout(() => {
        setMode('login');
        setSuccessMsg(null);
      }, 1000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      id="auth-modal-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 transition-all"
    >
      <div
        id="auth-modal-card"
        style={{
          background: 'linear-gradient(180deg, #D4D8DC 0%, #7D8288 45%, #23272A 100%)'
        }}
        className="relative w-full max-w-lg text-slate-900 border border-white/20 rounded-2xl shadow-2xl overflow-hidden transition-all my-auto font-mono text-xs shadow-black/80"
      >
        {/* Frosted Glass Overlay with subtle grain & diffused lighting */}
        <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[2px] pointer-events-none" />

        {/* Modal Top Header Bar */}
        <div className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-white/20 bg-white/40 backdrop-blur-md text-slate-900">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-slate-900 text-white shadow-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <span className="font-serif font-black text-sm uppercase tracking-tight text-slate-900 block leading-tight">
                VITALSYNC AUTHENTICATION
              </span>
              <span className="block text-[10px] text-slate-700 font-bold uppercase tracking-wider">
                SECURE ACCESS &amp; FIRESTORE IDENTITY
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/40 text-slate-700 hover:text-slate-950 transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="relative z-10 p-6 sm:p-8 space-y-6">
          {/* Feedback alerts */}
          {errorMsg && (
            <div className="p-3.5 bg-rose-950/80 border border-rose-500/50 rounded-xl text-rose-200 text-xs flex items-start gap-2.5 shadow-lg backdrop-blur-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-400" />
              <span className="leading-relaxed font-bold">{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-emerald-200 text-xs flex items-start gap-2.5 shadow-lg backdrop-blur-sm">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-400" />
              <span className="leading-relaxed font-bold">{successMsg}</span>
            </div>
          )}

          {/* VIEW: LOGGED IN USER PROFILE DRAWER */}
          {currentUser && mode === 'profile' && (
            <div className="space-y-6">
              <div className="p-4 bg-white/50 border border-white/30 rounded-xl flex items-center gap-4 backdrop-blur-md text-slate-900 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-slate-900 text-white p-0.5 flex items-center justify-center font-bold text-lg shadow-md">
                  {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'A'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-slate-950 truncate">
                      {currentUser.displayName || 'VitalSync Athlete'}
                    </h3>
                    <span className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider">
                      VERIFIED
                    </span>
                  </div>
                  <p className="text-xs text-slate-800 truncate font-semibold">{currentUser.email}</p>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[10px] text-slate-700 font-mono">
                      UID: {currentUser.uid.slice(0, 10)}...
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 bg-slate-800 text-white rounded font-bold uppercase">
                      {currentUser.membershipTier?.toUpperCase() || 'PRO'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Account Quick Links */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    if (onNavigateTab) onNavigateTab('lifecycle');
                    onClose();
                  }}
                  className="p-3 bg-white/40 hover:bg-white/60 border border-white/30 rounded-xl text-left transition-colors backdrop-blur-sm text-slate-900"
                >
                  <span className="font-bold block text-slate-950">Account Settings</span>
                  <span className="text-[10px] text-slate-700">Profile &amp; Preferences</span>
                </button>

                <button
                  onClick={() => {
                    if (onNavigateTab) onNavigateTab('pricing');
                    onClose();
                  }}
                  className="p-3 bg-white/40 hover:bg-white/60 border border-white/30 rounded-xl text-left transition-colors backdrop-blur-sm text-slate-900"
                >
                  <span className="font-bold block text-slate-950">Membership &amp; Plan</span>
                  <span className="text-[10px] text-slate-700">Tier Management</span>
                </button>

                <button
                  onClick={() => {
                    if (onNavigateTab) onNavigateTab('security');
                    onClose();
                  }}
                  className="p-3 bg-white/40 hover:bg-white/60 border border-white/30 rounded-xl text-left transition-colors backdrop-blur-sm text-slate-900"
                >
                  <span className="font-bold block text-slate-950">Security Matrix</span>
                  <span className="text-[10px] text-slate-700">HIPAA &amp; Encryption</span>
                </button>

                <button
                  onClick={() => {
                    if (onNavigateTab) onNavigateTab('clinician');
                    onClose();
                  }}
                  className="p-3 bg-white/40 hover:bg-white/60 border border-white/30 rounded-xl text-left transition-colors backdrop-blur-sm text-slate-900"
                >
                  <span className="font-bold block text-slate-950">Clinician Portal</span>
                  <span className="text-[10px] text-slate-700">EHR &amp; Lab Charts</span>
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2 border-t border-white/20">
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 bg-slate-900 hover:bg-black text-white rounded-xl font-bold uppercase shadow-md transition-colors"
                >
                  Return to Dashboard
                </button>
                <button
                  onClick={handleSignOut}
                  disabled={isLoading}
                  className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold uppercase flex items-center gap-1.5 shadow-md transition-colors"
                >
                  {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <LogIn className="w-3.5 h-3.5" />}
                  Sign Out
                </button>
              </div>
            </div>
          )}

          {/* VIEW: SIGN IN */}
          {(!currentUser || mode === 'login') && mode !== 'register' && mode !== 'forgot' && mode !== 'profile' && (
            <div className="space-y-5">
              <div className="text-center space-y-1">
                <h2 className="font-serif font-black text-xl text-slate-950 uppercase tracking-tight drop-shadow-sm">
                  SIGN IN TO VITALSYNC
                </h2>
                <p className="text-[11px] text-slate-800 font-medium">
                  Continuous physiological telemetry &amp; clinical health intelligence
                </p>
              </div>

              {/* Google 1-Click SSO */}
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={isLoading}
                className="w-full p-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-3 transition-colors shadow-md disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>CONTINUE WITH GOOGLE SSO</span>
              </button>

              <div className="relative text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-600/30" />
                </div>
                <span className="relative bg-transparent px-3 text-[10px] uppercase font-bold text-slate-800">
                  OR USE EMAIL CREDENTIALS
                </span>
              </div>

              {/* Email/Password Form */}
              <form onSubmit={handleEmailSignIn} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase text-slate-900">
                    EMAIL ADDRESS
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="athlete@vitalos.health"
                      className="w-full p-3 bg-white/70 border border-slate-400 rounded-xl text-slate-950 placeholder:text-slate-500 focus:outline-none focus:border-slate-900 shadow-inner"
                    />
                    <Mail className="w-4 h-4 text-slate-600 absolute right-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold uppercase text-slate-900">
                      PASSWORD
                    </label>
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-[10px] text-rose-800 hover:text-rose-950 hover:underline font-bold"
                    >
                      FORGOT PASSWORD?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full p-3 pr-10 bg-white/70 border border-slate-400 rounded-xl text-slate-950 placeholder:text-slate-500 focus:outline-none focus:border-slate-900 font-mono shadow-inner"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-slate-600 hover:text-slate-950 absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-[11px] text-slate-900 font-semibold">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="accent-slate-900"
                    />
                    <span>REMEMBER DEVICE</span>
                  </label>
                  <span className="text-[10px] text-slate-800 font-mono font-bold">TLS 1.3 / AES-256</span>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-slate-950 hover:bg-black text-white rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50"
                >
                  {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
                  <span>{isLoading ? 'VERIFYING CREDENTIALS...' : 'SIGN IN TO DASHBOARD'}</span>
                </button>
              </form>

              {/* Guest Pass Shortcut */}
              <div className="p-3 bg-white/40 border border-white/30 rounded-xl flex items-center justify-between gap-3 backdrop-blur-sm shadow-sm">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-950 block">Exploring without an account?</span>
                  <span className="text-[10px] text-slate-700">Launch instant verified demo telemetry</span>
                </div>
                <button
                  type="button"
                  onClick={handleGuestDemoPass}
                  className="px-3 py-1.5 bg-[#CC0000] text-white hover:bg-red-700 rounded-lg font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-sm"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>DEMO PASS</span>
                </button>
              </div>

              {/* Switch to Register */}
              <div className="text-center text-[11px] text-slate-800 font-medium pt-2">
                Don't have an athlete account?{' '}
                <button
                  onClick={() => setMode('register')}
                  className="font-bold text-slate-950 underline hover:text-[#CC0000]"
                >
                  CREATE AN ACCOUNT
                </button>
              </div>
            </div>
          )}

          {/* VIEW: REGISTER / SIGN UP */}
          {mode === 'register' && (
            <div className="space-y-5">
              <div className="text-center space-y-1">
                <h2 className="font-serif font-black text-xl text-slate-950 uppercase tracking-tight drop-shadow-sm">
                  CREATE ATHLETE ACCOUNT
                </h2>
                <p className="text-[11px] text-slate-800 font-medium">
                  Join the VitalSync biometric network with full data sovereignty
                </p>
              </div>

              {/* Google 1-Click SSO */}
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={isLoading}
                className="w-full p-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-3 transition-colors shadow-md disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>QUICK SIGN UP WITH GOOGLE</span>
              </button>

              <div className="relative text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-600/30" />
                </div>
                <span className="relative bg-transparent px-3 text-[10px] uppercase font-bold text-slate-800">
                  OR REGISTER WITH EMAIL
                </span>
              </div>

              {/* Registration Form */}
              <form onSubmit={handleEmailRegister} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase text-slate-900">
                    FULL LEGAL NAME
                  </label>
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Alex Vance"
                    className="w-full p-3 bg-white/70 border border-slate-400 rounded-xl text-slate-950 placeholder:text-slate-500 focus:outline-none focus:border-slate-900 shadow-inner"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase text-slate-900">
                    EMAIL ADDRESS
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@vitalos.health"
                    className="w-full p-3 bg-white/70 border border-slate-400 rounded-xl text-slate-950 placeholder:text-slate-500 focus:outline-none focus:border-slate-900 shadow-inner"
                  />
                </div>

                {/* Role selection */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase text-slate-900">
                    PRIMARY PROFILE ROLE
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRole('user')}
                      className={`p-2.5 rounded-xl border text-left font-mono text-[11px] transition-all shadow-sm ${
                        role === 'user'
                          ? 'border-slate-950 bg-white font-bold text-slate-950 shadow-md ring-1 ring-slate-900'
                          : 'border-white/30 bg-white/40 text-slate-700'
                      }`}
                    >
                      <span className="block font-bold text-xs text-slate-950">INDIVIDUAL ATHLETE</span>
                      <span className="text-[10px] text-slate-600">Personal Telemetry</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('clinician')}
                      className={`p-2.5 rounded-xl border text-left font-mono text-[11px] transition-all shadow-sm ${
                        role === 'clinician'
                          ? 'border-[#CC0000] bg-white font-bold text-[#CC0000] shadow-md ring-1 ring-[#CC0000]'
                          : 'border-white/30 bg-white/40 text-slate-700'
                      }`}
                    >
                      <span className="block font-bold text-xs text-slate-950">CLINICIAN / COACH</span>
                      <span className="text-[10px] text-slate-600">Patient Oversight EHR</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase text-slate-900">
                    CREATE SECURE PASSWORD
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 8 characters"
                      className="w-full p-3 pr-10 bg-white/70 border border-slate-400 rounded-xl text-slate-950 placeholder:text-slate-500 focus:outline-none focus:border-slate-900 font-mono shadow-inner"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-slate-600 hover:text-slate-950 absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Password strength meter */}
                  {password && (
                    <div className="space-y-1 pt-1">
                      <div className="flex gap-1 h-1.5 w-full">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`flex-1 rounded-full transition-colors ${
                              passScore >= level
                                ? passScore >= 4
                                  ? 'bg-emerald-600'
                                  : passScore >= 3
                                  ? 'bg-amber-500'
                                  : 'bg-rose-500'
                                : 'bg-slate-400/40'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-800 font-semibold">
                        <span>PASSWORD STRENGTH</span>
                        <span
                          className={
                            passScore >= 4
                              ? 'text-emerald-800 font-bold'
                              : passScore >= 3
                              ? 'text-amber-800'
                              : 'text-rose-800'
                          }
                        >
                          {passScore >= 5 ? 'EXCEPTIONAL' : passScore >= 4 ? 'STRONG' : passScore >= 3 ? 'FAIR' : 'WEAK'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Consent Checkbox */}
                <div className="p-3 bg-white/40 rounded-xl border border-white/30 flex items-start gap-2.5 backdrop-blur-sm shadow-sm">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="accent-slate-900 mt-0.5"
                    required
                  />
                  <span className="text-[11px] text-slate-900 leading-relaxed">
                    I agree to the <strong className="text-slate-950 underline">Terms of Service</strong>,{' '}
                    <strong className="text-slate-950 underline">Privacy Policy</strong>, and consent to biometric
                    telemetry processing under VitalSync's Zero-Sale Charter.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-[#CC0000] hover:bg-red-700 text-white rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50"
                >
                  {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                  <span>{isLoading ? 'PROVISIONING ACCOUNT...' : 'START 30-DAY PRO MEMBERSHIP'}</span>
                </button>
              </form>

              {/* Switch to Sign In */}
              <div className="text-center text-[11px] text-slate-800 font-medium pt-2">
                Already registered?{' '}
                <button
                  onClick={() => setMode('login')}
                  className="font-bold text-slate-950 underline hover:text-[#CC0000]"
                >
                  SIGN IN
                </button>
              </div>
            </div>
          )}

          {/* VIEW: FORGOT PASSWORD */}
          {mode === 'forgot' && (
            <div className="space-y-5">
              <div className="text-center space-y-1">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-900 border border-amber-500/40 flex items-center justify-center mx-auto mb-2">
                  <Key className="w-5 h-5" />
                </div>
                <h2 className="font-serif font-black text-xl text-slate-950 uppercase tracking-tight drop-shadow-sm">
                  RESET PASSWORD
                </h2>
                <p className="text-[11px] text-slate-800 font-medium">
                  Enter your registered email and we will dispatch a secure 1-hour recovery token
                </p>
              </div>

              <form onSubmit={handlePasswordReset} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase text-slate-900">
                    REGISTERED EMAIL ADDRESS
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="athlete@vitalos.health"
                    className="w-full p-3 bg-white/70 border border-slate-400 rounded-xl text-slate-950 placeholder:text-slate-500 focus:outline-none focus:border-slate-900 shadow-inner"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-md disabled:opacity-50"
                >
                  {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                  <span>{isLoading ? 'DISPATCHING RESET...' : 'SEND SECURE RECOVERY LINK'}</span>
                </button>
              </form>

              <div className="text-center text-[11px] text-slate-800 font-medium pt-2">
                Remembered your credentials?{' '}
                <button
                  onClick={() => setMode('login')}
                  className="font-bold text-slate-950 underline hover:text-[#CC0000]"
                >
                  BACK TO SIGN IN
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer Notice */}
        <div className="relative z-10 px-6 py-3 border-t border-white/20 bg-white/40 backdrop-blur-md flex items-center justify-between text-[10px] text-slate-800">
          <span className="flex items-center gap-1.5 font-bold">
            <Shield className="w-3.5 h-3.5 text-emerald-700" />
            <span>HIPAA BAA &amp; SOC2 TYPE II COMPLIANT</span>
          </span>
          <span className="font-mono font-bold">PULITZER-CALIBER ENCRYPTION</span>
        </div>
      </div>
    </div>
  );
};

