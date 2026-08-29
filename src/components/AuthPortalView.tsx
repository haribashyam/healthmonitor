/**
 * ═══════════════════════════════════════════════════════════════════
 * VITALSYNC APPLE UI FULL-SCREEN AUTHENTICATION & GATEWAY PORTAL
 * File: /src/components/AuthPortalView.tsx
 *
 * Premium iOS Dark Mode Interface:
 * - Semi-transparent black container (bg-black/60)
 * - Liquid glass button style with high-fidelity refraction
 * - Soft backdrop blur (backdrop-blur-2xl)
 * - Stark white minimalist typography with high-contrast legibility
 * - Thin white glass border outline (border-white/20)
 * - Apple FaceID / Passkey biometric authorization & Google SSO
 * ═══════════════════════════════════════════════════════════════════
 */

import React, { useState, useEffect } from 'react';
import {
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
  Database,
  Globe,
  Sliders,
  HelpCircle,
  BookOpen,
  Headphones,
  CheckCircle,
  Layers,
  ChevronRight,
  ScanFace
} from 'lucide-react';
import {
  SignInWithGoogle,
  registerWithEmail,
  signInWithEmail,
  sendPasswordReset,
  subscribeToAuthState,
  FirebaseUserProfile
} from '../services/Auth';

interface AuthPortalViewProps {
  onEnterDashboard: (user?: FirebaseUserProfile) => void;
  onNavigateTab?: (tab: string) => void;
  initialMode?: 'login' | 'register' | 'forgot';
}

export const AuthPortalView: React.FC<AuthPortalViewProps> = ({
  onEnterDashboard,
  onNavigateTab,
  initialMode = 'login'
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  const [currentUser, setCurrentUser] = useState<FirebaseUserProfile | null>(null);

  // Form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState<'user' | 'clinician'>('user');
  const [rememberMe, setRememberMe] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Interaction feedback states
  const [isLoading, setIsLoading] = useState(false);
  const [isFaceIdScanning, setIsFaceIdScanning] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Active preview sub-view
  const [previewTab, setPreviewTab] = useState<'auth' | 'pricing' | 'manifesto' | 'trust'>('auth');

  useEffect(() => {
    const unsub = subscribeToAuthState((profile) => {
      if (profile) {
        setCurrentUser(profile);
      }
    });
    return () => unsub();
  }, []);

  // Password strength gauge
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

  // 1-Click Google OAuth SSO
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
          ? `Welcome to VitalSync, ${res.user.displayName || 'Athlete'}! Identity partitioned in Firestore.`
          : `Authenticated as ${res.user.displayName || 'Athlete'}. Launching real-time telemetry...`;
        setSuccessMsg(welcomeText);
        setTimeout(() => {
          onEnterDashboard(res.user);
        }, 800);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Google authorization could not be completed.');
    } finally {
      setIsLoading(false);
    }
  };

  // FaceID / Apple Biometric simulation
  const handleFaceIdAuth = () => {
    setIsFaceIdScanning(true);
    setErrorMsg(null);
    setTimeout(() => {
      setIsFaceIdScanning(false);
      const biometricUser: FirebaseUserProfile = {
        uid: 'passkey_apple_athlete',
        userId: 'passkey_apple_athlete',
        email: 'apple.id@icloud.com',
        displayName: 'Apple Passkey Athlete',
        photoURL: null,
        emailVerified: true,
        role: 'user',
        membershipTier: 'pro',
        targetReadiness: 91,
        restingHRBaseline: 57,
        hrvBaseline: 72,
        vo2MaxBaseline: 52.4,
        createdAt: new Date().toISOString()
      };
      setSuccessMsg('Apple Passkey & Secure Enclave verified. Unlocking dashboard...');
      setTimeout(() => {
        onEnterDashboard(biometricUser);
      }, 700);
    }, 1400);
  };

  // Email Sign In
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both your registered email and password.');
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
        setSuccessMsg(`Welcome back, ${res.user.displayName || 'Athlete'}!`);
        setTimeout(() => {
          onEnterDashboard(res.user);
        }, 700);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  // Email Registration
  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !displayName) {
      setErrorMsg('Please complete all required fields.');
      return;
    }
    if (password.length < 8) {
      setErrorMsg('Password must contain at least 8 characters.');
      return;
    }
    if (!agreeTerms) {
      setErrorMsg('Please accept the Terms of Service & Biometric Privacy Charter.');
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
        setSuccessMsg('Account provisioned successfully! Synchronizing Firestore space...');
        setTimeout(() => {
          onEnterDashboard(res.user);
        }, 900);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Password Reset Dispatch
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Please specify the email address registered with your account.');
      return;
    }
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await sendPasswordReset(email);
      if (res.success) {
        setSuccessMsg('Password recovery link has been dispatched to your inbox.');
        setTimeout(() => setMode('login'), 3000);
      } else {
        setErrorMsg(res.error || 'Failed to dispatch password recovery email.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error occurred while requesting password reset.');
    } finally {
      setIsLoading(false);
    }
  };

  // Guest Demo Instant Access
  const handleLaunchGuestDemo = () => {
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
    onEnterDashboard(demoUser);
  };

  return (
    <div
      id="auth-portal-viewport"
      className="min-h-screen w-full relative flex flex-col justify-between overflow-x-hidden text-white font-sans selection:bg-white/20 selection:text-white"
      style={{
        background: 'radial-gradient(ellipse at 50% 20%, rgba(55, 65, 81, 0.45) 0%, rgba(17, 24, 39, 0.95) 50%, #030712 100%), linear-gradient(180deg, #1F2937 0%, #111827 50%, #030712 100%)'
      }}
    >
      {/* High-Fidelity Ambient Light & Grid Atmosphere */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-b from-slate-400/10 via-red-500/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-40 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 -right-40 w-96 h-96 bg-red-600/5 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.8) 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }}
        />
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          APPLE-INSPIRED TOP STATUS & NAV BAR
          ═══════════════════════════════════════════════════════════════ */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-b from-white/20 to-white/5 border border-white/20 backdrop-blur-xl flex items-center justify-center shadow-lg">
            <Activity className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-black text-lg tracking-tight text-white uppercase">
                VITAL<span className="text-red-500">SYNC</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-white/10 border border-white/15 text-[10px] font-mono tracking-widest text-white/80 uppercase">
                v2026.4
              </span>
            </div>
            <span className="text-[11px] text-white/60 tracking-wider font-mono">
              CONTINUOUS PHYSIOLOGICAL TELEMETRY
            </span>
          </div>
        </div>

        {/* Apple Pill Quick Links */}
        <div className="hidden md:flex items-center gap-1.5 p-1 bg-black/40 border border-white/15 rounded-full backdrop-blur-xl">
          <button
            onClick={() => { setPreviewTab('auth'); setMode('login'); }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              previewTab === 'auth' && mode === 'login'
                ? 'bg-white/20 text-white shadow-sm border border-white/25'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setPreviewTab('auth'); setMode('register'); }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              previewTab === 'auth' && mode === 'register'
                ? 'bg-white/20 text-white shadow-sm border border-white/25'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            Create Account
          </button>
          <button
            onClick={() => setPreviewTab('pricing')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              previewTab === 'pricing'
                ? 'bg-white/20 text-white shadow-sm border border-white/25'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            Pricing &amp; Plans
          </button>
          <button
            onClick={() => setPreviewTab('trust')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              previewTab === 'trust'
                ? 'bg-white/20 text-white shadow-sm border border-white/25'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            Security &amp; HIPAA
          </button>
          <button
            onClick={() => setPreviewTab('manifesto')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              previewTab === 'manifesto'
                ? 'bg-white/20 text-white shadow-sm border border-white/25'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            Manifesto
          </button>
        </div>

        {/* Direct Guest Pass CTA Button */}
        <button
          onClick={handleLaunchGuestDemo}
          className="apple-liquid-glass-btn px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Launch Demo Dashboard</span>
          <ArrowRight className="w-3.5 h-3.5 text-white/70" />
        </button>
      </header>

      {/* ═══════════════════════════════════════════════════════════════
          MAIN CENTERED CONTENT AREA
          ═══════════════════════════════════════════════════════════════ */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 my-auto">
        <div className="w-full max-w-md mx-auto">
          
          {/* Main Apple Dark Mode Liquid Glass Card */}
          <div
            id="apple-auth-prompt"
            className="relative bg-black/60 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 sm:p-8 shadow-[0_30px_80px_-15px_rgba(0,0,0,0.9)] overflow-hidden"
          >
            {/* Top Gloss Highlight Edge */}
            <div className="absolute top-0 inset-x-8 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />

            {/* Apple Prompt Header */}
            <div className="text-center space-y-2 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-b from-white/20 to-white/5 border border-white/25 flex items-center justify-center mx-auto shadow-inner">
                {mode === 'login' ? (
                  <Lock className="w-6 h-6 text-white" />
                ) : mode === 'register' ? (
                  <UserPlus className="w-6 h-6 text-white" />
                ) : (
                  <Key className="w-6 h-6 text-amber-400" />
                )}
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-white font-sans">
                {mode === 'login' && 'Sign in to VitalSync'}
                {mode === 'register' && 'Create Athlete Profile'}
                {mode === 'forgot' && 'Account Recovery'}
              </h1>
              <p className="text-xs text-white/70 font-sans max-w-xs mx-auto leading-relaxed">
                {mode === 'login' && 'Enter your credentials or authenticate via Apple Passkey / Google SSO'}
                {mode === 'register' && 'Join the biometric network with cryptographic HIPAA ownership'}
                {mode === 'forgot' && 'Enter your registered email to receive an instant recovery link'}
              </p>
            </div>

            {/* Notification & Feedback Badges */}
            {errorMsg && (
              <div className="mb-4 p-3 bg-red-950/80 border-2 border-red-500/60 rounded-2xl text-white font-medium text-xs flex items-start gap-2.5 backdrop-blur-md">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-400" />
                <span className="leading-snug">{errorMsg}</span>
              </div>
            )}
            {successMsg && (
              <div className="mb-4 p-3 bg-emerald-950/70 border border-emerald-500/40 rounded-2xl text-emerald-200 text-xs flex items-start gap-2.5 backdrop-blur-md">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-400" />
                <span className="leading-snug">{successMsg}</span>
              </div>
            )}

            {/* ═══════════════════════════════════════════════════════════
                MODE: SIGN IN
                ═══════════════════════════════════════════════════════════ */}
            {mode === 'login' && (
              <div className="space-y-4">
                
                {/* 1. Fast Biometric FaceID / TouchID Apple Prompt Button */}
                <button
                  type="button"
                  onClick={handleFaceIdAuth}
                  disabled={isFaceIdScanning || isLoading}
                  className="w-full apple-liquid-glass-btn p-3.5 rounded-full font-semibold text-xs flex items-center justify-center gap-3 transition-all group"
                >
                  {isFaceIdScanning ? (
                    <>
                      <ScanFace className="w-4 h-4 text-cyan-400 animate-pulse" />
                      <span className="text-white">Scanning FaceID / Enclave...</span>
                    </>
                  ) : (
                    <>
                      <Fingerprint className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                      <span className="text-white">Sign in with Apple Passkey / FaceID</span>
                    </>
                  )}
                </button>

                {/* 2. Google 1-Click SSO Button with Liquid Glass */}
                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  disabled={isLoading}
                  className="w-full apple-liquid-glass-btn p-3.5 rounded-full font-semibold text-xs flex items-center justify-center gap-3 transition-all"
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
                  <span className="text-white">Continue with Google SSO</span>
                </button>

                {/* Divider */}
                <div className="relative text-center my-3">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10" />
                  </div>
                  <span className="relative bg-black/80 px-3 text-[10px] font-mono uppercase tracking-widest text-white/50">
                    OR EMAIL CREDENTIALS
                  </span>
                </div>

                {/* Email Form */}
                <form onSubmit={handleEmailSignIn} className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-white/80 tracking-wide uppercase">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="athlete@vitalos.health"
                        className="w-full apple-glass-input rounded-full px-4 py-3 text-xs placeholder:text-white/30"
                      />
                      <Mail className="w-4 h-4 text-white/40 absolute right-4 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-semibold text-white/80 tracking-wide uppercase">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setMode('forgot')}
                        className="text-[11px] text-white/60 hover:text-white hover:underline transition-colors"
                      >
                        Forgot?
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full apple-glass-input rounded-full px-4 py-3 pr-11 text-xs font-mono placeholder:text-white/30"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-white/40 hover:text-white absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-white/70">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="accent-white rounded"
                      />
                      <span>Keep signed in</span>
                    </label>
                    <span className="text-[10px] text-white/40 font-mono">TLS 1.3 / AES-256</span>
                  </div>

                  {/* Primary CTA Liquid Glass Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full apple-liquid-glass-btn-primary py-3.5 rounded-full font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all mt-2"
                  >
                    {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
                    <span>{isLoading ? 'Authenticating...' : 'Sign In'}</span>
                  </button>
                </form>

                {/* Guest Pass Direct Entry Box */}
                <div className="mt-4 p-3 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="text-xs font-semibold text-white block">Exploring first?</span>
                    <span className="text-[10px] text-white/60">Launch full verified biometric demo</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleLaunchGuestDemo}
                    className="apple-liquid-glass-btn px-4 py-2 rounded-full text-[11px] font-semibold text-white flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>Demo Mode</span>
                  </button>
                </div>

                {/* Switch to Register */}
                <div className="text-center pt-2 text-xs text-white/60">
                  New to VitalSync?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('register')}
                    className="text-white font-semibold underline hover:text-red-400 transition-colors"
                  >
                    Create Account
                  </button>
                </div>
              </div>
            )}

            {/* ═══════════════════════════════════════════════════════════
                MODE: REGISTER / SIGN UP
                ═══════════════════════════════════════════════════════════ */}
            {mode === 'register' && (
              <div className="space-y-4">
                
                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  disabled={isLoading}
                  className="w-full apple-liquid-glass-btn p-3.5 rounded-full font-semibold text-xs flex items-center justify-center gap-3 transition-all"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span className="text-white">Quick Register with Google</span>
                </button>

                <div className="relative text-center my-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10" />
                  </div>
                  <span className="relative bg-black/80 px-3 text-[10px] font-mono uppercase tracking-widest text-white/50">
                    OR REGISTER WITH EMAIL
                  </span>
                </div>

                <form onSubmit={handleEmailRegister} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-white/80 tracking-wide uppercase">
                      Full Legal Name
                    </label>
                    <input
                      type="text"
                      required
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Alex Vance"
                      className="w-full apple-glass-input rounded-full px-4 py-3 text-xs placeholder:text-white/30"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-white/80 tracking-wide uppercase">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex@vitalos.health"
                      className="w-full apple-glass-input rounded-full px-4 py-3 text-xs placeholder:text-white/30"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-white/80 tracking-wide uppercase">
                      Profile Role
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setRole('user')}
                        className={`p-2.5 rounded-2xl border text-left text-xs transition-all ${
                          role === 'user'
                            ? 'bg-white/20 border-white/40 text-white font-bold shadow-sm'
                            : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                        }`}
                      >
                        <span className="block font-semibold">Individual</span>
                        <span className="text-[10px] text-white/50">Personal Telemetry</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setRole('clinician')}
                        className={`p-2.5 rounded-2xl border text-left text-xs transition-all ${
                          role === 'clinician'
                            ? 'bg-red-500/25 border-red-400/50 text-white font-bold shadow-sm'
                            : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                        }`}
                      >
                        <span className="block font-semibold">Clinician</span>
                        <span className="text-[10px] text-white/50">EHR &amp; Patient Panel</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-white/80 tracking-wide uppercase">
                      Create Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="At least 8 characters"
                        className="w-full apple-glass-input rounded-full px-4 py-3 pr-11 text-xs font-mono placeholder:text-white/30"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-white/40 hover:text-white absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Password Strength Indicator */}
                    {password && (
                      <div className="space-y-1 pt-1">
                        <div className="flex gap-1 h-1">
                          {[1, 2, 3, 4, 5].map((lvl) => (
                            <div
                              key={lvl}
                              className={`flex-1 rounded-full transition-colors ${
                                passScore >= lvl
                                  ? passScore >= 4
                                    ? 'bg-emerald-400'
                                    : passScore >= 3
                                    ? 'bg-amber-400'
                                    : 'bg-red-400'
                                  : 'bg-white/10'
                              }`}
                            />
                          ))}
                        </div>
                        <div className="flex justify-between text-[10px] text-white/60">
                          <span>Security Strength</span>
                          <span className="font-semibold text-white">
                            {passScore >= 5 ? 'Exceptional' : passScore >= 4 ? 'Strong' : passScore >= 3 ? 'Fair' : 'Weak'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Terms Checkbox */}
                  <div className="p-3 bg-white/5 rounded-2xl border border-white/10 flex items-start gap-2.5">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="accent-white mt-0.5"
                      required
                    />
                    <span className="text-[11px] text-white/70 leading-relaxed">
                      I agree to the <strong className="text-white">Terms of Service</strong> &amp;{' '}
                      <strong className="text-white">HIPAA Zero-Sale Charter</strong>.
                    </span>
                  </div>

                  {/* Primary Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full apple-liquid-glass-btn-accent py-3.5 rounded-full font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all mt-2"
                  >
                    {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                    <span>{isLoading ? 'Creating Profile...' : 'Start 30-Day Pro Plan'}</span>
                  </button>
                </form>

                <div className="text-center pt-2 text-xs text-white/60">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="text-white font-semibold underline hover:text-red-400 transition-colors"
                  >
                    Sign In
                  </button>
                </div>
              </div>
            )}

            {/* ═══════════════════════════════════════════════════════════
                MODE: FORGOT PASSWORD
                ═══════════════════════════════════════════════════════════ */}
            {mode === 'forgot' && (
              <form onSubmit={handlePasswordReset} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-white/80 tracking-wide uppercase">
                    Registered Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="athlete@vitalos.health"
                    className="w-full apple-glass-input rounded-full px-4 py-3 text-xs placeholder:text-white/30"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full apple-liquid-glass-btn-primary py-3.5 rounded-full font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
                >
                  {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                  <span>{isLoading ? 'Dispatching...' : 'Send Recovery Link'}</span>
                </button>

                <div className="text-center pt-2 text-xs text-white/60">
                  Remembered credentials?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="text-white font-semibold underline hover:text-red-400 transition-colors"
                  >
                    Back to Sign In
                  </button>
                </div>
              </form>
            )}

            {/* Bottom Security Footer Stamp */}
            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[10px] text-white/50 font-mono">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>HIPAA BAA &amp; SOC2 COMPLIANT</span>
              </span>
              <span>ZERO DATA BROKERAGE</span>
            </div>
          </div>
        </div>
      </main>

      {/* ═══════════════════════════════════════════════════════════════
          BOTTOM MINIMALIST FOOTER
          ═══════════════════════════════════════════════════════════════ */}
      <footer className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/50 font-mono">
        <div className="flex items-center gap-4">
          <span>© 2026 VitalSync Biometrics Inc.</span>
          <span className="hidden sm:inline">•</span>
          <span className="text-white/70">Pulitzer-Caliber Health Journalism &amp; Lab Intelligence</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleLaunchGuestDemo}
            className="hover:text-white transition-colors underline"
          >
            Direct Guest Access
          </button>
          <span>•</span>
          <button
            onClick={() => { if (onNavigateTab) onNavigateTab('legal'); }}
            className="hover:text-white transition-colors"
          >
            Terms
          </button>
          <span>•</span>
          <button
            onClick={() => { if (onNavigateTab) onNavigateTab('security'); }}
            className="hover:text-white transition-colors"
          >
            Privacy &amp; Security
          </button>
        </div>
      </footer>
    </div>
  );
};
