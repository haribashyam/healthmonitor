import React, { useState } from 'react';
import {
  User,
  LogIn,
  UserPlus,
  Mail,
  Key,
  Lock,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  XCircle,
  HelpCircle,
  Activity,
  Layers,
  Heart,
  ShieldCheck,
  RefreshCw,
  Sliders,
  ChevronRight,
  Eye,
  EyeOff,
  Radio,
  FileText,
  Download,
  AlertTriangle,
  Flame
} from 'lucide-react';

export type LifecycleViewType =
  | 'login'
  | 'register'
  | 'email-verification'
  | 'forgot-password'
  | 'reset-password'
  | 'onboarding'
  | 'account-settings'
  | 'billing'
  | 'upgrade'
  | 'downgrade'
  | 'cancel-subscription'
  | 'payment-success'
  | 'payment-failed'
  | 'payment-pending';

interface CustomerLifecycleViewProps {
  initialView?: LifecycleViewType;
  onNavigateToTab?: (tab: string) => void;
}

export const CustomerLifecycleView: React.FC<CustomerLifecycleViewProps> = ({
  initialView = 'account-settings',
  onNavigateToTab
}) => {
  const [currentView, setCurrentView] = useState<LifecycleViewType>(initialView);

  // Form mock states
  const [email, setEmail] = useState('alex.vance@vitalos.health');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [verificationOtp, setVerificationOtp] = useState(['5', '9', '2', '8', '', '']);
  const [otpResendTimer, setOtpResendTimer] = useState(48);

  // Onboarding multi-step state
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState({
    name: 'Alex Vance',
    age: 32,
    weightKg: 74,
    heightCm: 181,
    primaryFocus: 'Cardiorespiratory Endurance & VO2 Max',
    connectedDevices: ['Apple Watch Ultra 2', 'Oura Ring Gen 3'],
    dailyStepTarget: 10000,
    targetSleepHours: 8.0
  });

  // Account Settings state
  const [profileName, setProfileName] = useState('Alex Vance');
  const [profileBio, setProfileBio] = useState('Amateur Triathlete & Longevity Enthusiast');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [biometricSyncFreq, setBiometricSyncFreq] = useState('continuous');
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Billing state
  const [currentPlan, setCurrentPlan] = useState<'free' | 'pro' | 'clinical'>('pro');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [cancelReason, setCancelReason] = useState('');
  const [isProcessingAction, setIsProcessingAction] = useState(false);

  const lifecycleTabs: { id: LifecycleViewType; label: string; group: string; icon: any }[] = [
    // Auth & Access
    { id: 'login', label: 'Login Screen', group: 'Authentication', icon: LogIn },
    { id: 'register', label: 'Registration / Sign Up', group: 'Authentication', icon: UserPlus },
    { id: 'email-verification', label: 'Email Verification', group: 'Authentication', icon: Mail },
    { id: 'forgot-password', label: 'Forgot Password', group: 'Authentication', icon: Key },
    { id: 'reset-password', label: 'Reset Password', group: 'Authentication', icon: Lock },
    // Onboarding & Profile
    { id: 'onboarding', label: '4-Step Health Onboarding', group: 'User Profile', icon: Sparkles },
    { id: 'account-settings', label: 'Account & Security Settings', group: 'User Profile', icon: User },
    // Subscriptions & Commerce
    { id: 'billing', label: 'Billing & Invoices', group: 'Subscription', icon: CreditCard },
    { id: 'upgrade', label: 'Upgrade Membership', group: 'Subscription', icon: ArrowUpRight },
    { id: 'downgrade', label: 'Downgrade Plan Flow', group: 'Subscription', icon: ArrowDownRight },
    { id: 'cancel-subscription', label: 'Cancel Subscription Survey', group: 'Subscription', icon: XCircle },
    // Payment Gateway Results
    { id: 'payment-success', label: 'Payment Success Confirmation', group: 'Checkout UX', icon: CheckCircle2 },
    { id: 'payment-failed', label: 'Payment Failed / Retry', group: 'Checkout UX', icon: AlertCircle },
    { id: 'payment-pending', label: 'Payment Pending / Wire Polling', group: 'Checkout UX', icon: Clock },
  ];

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fadeIn text-slate-100">
      
      {/* Top Header & Fast Switcher */}
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Customer Lifecycle & Account Hub</h1>
              <p className="text-xs text-slate-400">
                End-to-end user journeys: Auth, Onboarding, Subscription Billing, Downgrade/Cancel flows, and Payment UX.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-bold hidden sm:inline">Active Plan:</span>
          <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-mono font-bold uppercase border border-cyan-500/30">
            {currentPlan.toUpperCase()} TIER
          </span>
        </div>
      </div>

      {/* Main Grid: Navigator Sidebar & Lifecycle Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Navigator Sidebar */}
        <div className="lg:col-span-4 bg-slate-900 rounded-2xl p-4 border border-slate-800 space-y-4 shadow-md h-fit">
          <div className="flex items-center justify-between px-2 pb-2 border-b border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Lifecycle State Picker</span>
            <span className="text-[10px] text-cyan-400 font-mono">14 Pages</span>
          </div>

          <div className="space-y-1 max-h-[640px] overflow-y-auto pr-1">
            {lifecycleTabs.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-left text-xs transition-all ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 font-bold shadow-sm'
                      : 'text-slate-300 hover:bg-slate-950/80 hover:text-white border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                    <div>
                      <span className="block leading-tight">{item.label}</span>
                      <span className="text-[10px] text-slate-400 font-normal">{item.group}</span>
                    </div>
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-600'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Viewport Canvas */}
        <div className="lg:col-span-8 bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-md min-h-[580px] flex flex-col justify-center">
          
          {/* 1. LOGIN VIEW */}
          {currentView === 'login' && (
            <div className="max-w-md mx-auto w-full space-y-6 animate-scaleUp">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-emerald-400 p-[2px] mx-auto mb-3 shadow-lg shadow-cyan-500/20">
                  <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                    <Activity className="w-6 h-6 text-cyan-400" />
                  </div>
                </div>
                <h2 className="text-xl font-bold text-white">Welcome back to VITALOS</h2>
                <p className="text-xs text-slate-400">Access your personal health intelligence and live telemetry</p>
              </div>

              {/* Social Login Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentView('account-settings')}
                  className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-center gap-2"
                >
                  <span>Google SSO</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentView('account-settings')}
                  className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-center gap-2"
                >
                  <span>Apple ID</span>
                </button>
              </div>

              <div className="relative text-center">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800" /></div>
                <span className="relative bg-slate-900 px-3 text-[10px] uppercase font-bold text-slate-500">Or email & passkey</span>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); setCurrentView('account-settings'); }} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                    placeholder="name@example.com"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-slate-300 font-medium">Password / Passkey</label>
                    <button
                      type="button"
                      onClick={() => setCurrentView('forgot-password')}
                      className="text-[11px] text-cyan-400 hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full p-3 pr-10 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl font-bold text-xs bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" /> Sign In to Dashboard
                </button>
              </form>

              <div className="text-center text-xs text-slate-400">
                Don't have an account?{' '}
                <button onClick={() => setCurrentView('register')} className="text-cyan-400 font-bold hover:underline">
                  Create an account
                </button>
              </div>
            </div>
          )}

          {/* 2. REGISTER / SIGN UP VIEW */}
          {currentView === 'register' && (
            <div className="max-w-md mx-auto w-full space-y-6 animate-scaleUp">
              <div className="text-center space-y-1">
                <h2 className="text-xl font-bold text-white">Create your VITALOS Account</h2>
                <p className="text-xs text-slate-400">Join the self-sovereign health intelligence ecosystem</p>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); setCurrentView('email-verification'); }} className="space-y-3.5 text-xs">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Full Name</label>
                  <input
                    type="text"
                    defaultValue="Alex Vance"
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Create Password</label>
                  <input
                    type="password"
                    defaultValue="SecureBiometric2026!"
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-start gap-2.5">
                  <input type="checkbox" defaultChecked className="accent-cyan-500 mt-0.5" required />
                  <span className="text-[11px] text-slate-400">
                    I agree to the <strong className="text-slate-200">Terms of Service</strong>, <strong className="text-slate-200">Privacy Policy</strong>, and consent to biometric telemetry processing under Zero-Sale guarantees.
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl font-bold text-xs bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-4 h-4" /> Start 30-Day Free Pro Trial
                </button>
              </form>

              <div className="text-center text-xs text-slate-400">
                Already registered?{' '}
                <button onClick={() => setCurrentView('login')} className="text-cyan-400 font-bold hover:underline">
                  Sign In
                </button>
              </div>
            </div>
          )}

          {/* 3. EMAIL VERIFICATION VIEW */}
          {currentView === 'email-verification' && (
            <div className="max-w-md mx-auto w-full space-y-6 text-center animate-scaleUp">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center mx-auto">
                <Mail className="w-7 h-7" />
              </div>

              <div className="space-y-1">
                <h2 className="text-xl font-bold text-white">Verify Your Email Address</h2>
                <p className="text-xs text-slate-400">
                  We have sent a 6-digit cryptographic verification code to <strong className="text-slate-200">{email}</strong>
                </p>
              </div>

              {/* 6 Digit OTP input */}
              <div className="flex justify-center gap-2 my-4">
                {['5', '9', '2', '8', '3', '7'].map((digit, idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength={1}
                    defaultValue={digit}
                    className="w-11 h-12 text-center text-lg font-mono font-bold bg-slate-950 border border-slate-700 rounded-xl text-cyan-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                  />
                ))}
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => setCurrentView('onboarding')}
                  className="w-full py-3 rounded-xl font-bold text-xs bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" /> Confirm & Launch Health Onboarding
                </button>

                <div className="text-xs text-slate-400">
                  Didn't receive code?{' '}
                  <button className="text-cyan-400 font-bold hover:underline">
                    Resend code ({otpResendTimer}s)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 4. FORGOT PASSWORD VIEW */}
          {currentView === 'forgot-password' && (
            <div className="max-w-md mx-auto w-full space-y-6 animate-scaleUp">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto mb-2">
                  <Key className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-white">Reset Account Password</h2>
                <p className="text-xs text-slate-400">Enter your email and we will dispatch a secure recovery link</p>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); setCurrentView('reset-password'); }} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Registered Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl font-bold text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <Mail className="w-4 h-4" /> Send Secure Recovery Link
                </button>
              </form>

              <div className="text-center text-xs text-slate-400">
                Remember your credentials?{' '}
                <button onClick={() => setCurrentView('login')} className="text-cyan-400 font-bold hover:underline">
                  Back to Sign In
                </button>
              </div>
            </div>
          )}

          {/* 5. RESET PASSWORD VIEW */}
          {currentView === 'reset-password' && (
            <div className="max-w-md mx-auto w-full space-y-6 animate-scaleUp">
              <div className="text-center space-y-1">
                <h2 className="text-xl font-bold text-white">Set New Password</h2>
                <p className="text-xs text-slate-400">Choose a strong, unique passkey for your health dossier</p>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); setCurrentView('login'); }} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">New Password</label>
                  <input
                    type="password"
                    placeholder="Enter at least 10 characters"
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Confirm New Password</label>
                  <input
                    type="password"
                    placeholder="Re-enter new password"
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1 text-[11px] text-slate-400">
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 10+ characters with mixed symbols
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Checked against breached password lists
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl font-bold text-xs bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" /> Update Password & Re-authenticate
                </button>
              </form>
            </div>
          )}

          {/* 6. 4-STEP HEALTH ONBOARDING WIZARD */}
          {currentView === 'onboarding' && (
            <div className="max-w-lg mx-auto w-full space-y-6 animate-scaleUp">
              
              {/* Progress Indicator */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-cyan-400 uppercase tracking-wider">Step {onboardingStep} of 4</span>
                  <span className="text-slate-400">
                    {onboardingStep === 1 && 'Biometric Baseline'}
                    {onboardingStep === 2 && 'Connect Sensors'}
                    {onboardingStep === 3 && 'Primary Health Goals'}
                    {onboardingStep === 4 && 'Digital Twin Calibration'}
                  </span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full rounded-full transition-all duration-300"
                    style={{ width: `${(onboardingStep / 4) * 100}%` }}
                  />
                </div>
              </div>

              {/* Step 1: Body Metrics */}
              {onboardingStep === 1 && (
                <div className="space-y-4 text-xs">
                  <h3 className="text-base font-bold text-white">Tell us about your physical baseline</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-slate-300 font-medium">Age</label>
                      <input
                        type="number"
                        value={onboardingData.age}
                        onChange={(e) => setOnboardingData({ ...onboardingData, age: parseInt(e.target.value) })}
                        className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-300 font-medium">Weight (kg)</label>
                      <input
                        type="number"
                        value={onboardingData.weightKg}
                        onChange={(e) => setOnboardingData({ ...onboardingData, weightKg: parseInt(e.target.value) })}
                        className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-300 font-medium">Height (cm)</label>
                    <input
                      type="number"
                      value={onboardingData.heightCm}
                      onChange={(e) => setOnboardingData({ ...onboardingData, heightCm: parseInt(e.target.value) })}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Connect Wearables */}
              {onboardingStep === 2 && (
                <div className="space-y-3 text-xs">
                  <h3 className="text-base font-bold text-white">Select Wearables to Synchronize</h3>
                  <div className="space-y-2">
                    {['Apple Health / Watch Ultra', 'Oura Ring Gen 3 / Horizon', 'Garmin Connect (Forerunner)', 'Strava Athletic GPS', 'Whoop 4.0 Strap'].map((device) => (
                      <div key={device} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                        <span className="font-semibold text-slate-200">{device}</span>
                        <input type="checkbox" defaultChecked={device.includes('Apple') || device.includes('Oura')} className="accent-cyan-500 w-4 h-4" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Goals */}
              {onboardingStep === 3 && (
                <div className="space-y-3 text-xs">
                  <h3 className="text-base font-bold text-white">What is your primary athletic / longevity focus?</h3>
                  <div className="space-y-2">
                    {[
                      'VO2 Max Expansion & Aerobic Zone 2 Endurance',
                      'Autonomic Recovery, Deep Sleep & Stress Modulation',
                      'Metabolic Flexibility & Fasting Glucose Optimization',
                      'Hypertrophy, Lean Mass & Strength Progression'
                    ].map((goal, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setOnboardingData({ ...onboardingData, primaryFocus: goal })}
                        className={`w-full p-3 rounded-xl text-left border transition-all ${
                          onboardingData.primaryFocus === goal
                            ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold'
                            : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        {goal}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4: Digital Twin Calibration Complete */}
              {onboardingStep === 4 && (
                <div className="space-y-4 text-center text-xs animate-scaleUp">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-white">Digital Twin Initialized!</h3>
                    <p className="text-slate-400">
                      Your physiological baseline is established at <strong className="text-cyan-400">84.2 Vital Score</strong>. We've constructed your adaptive 7-day workout split.
                    </p>
                  </div>
                </div>
              )}

              {/* Wizard Nav Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                {onboardingStep > 1 ? (
                  <button
                    type="button"
                    onClick={() => setOnboardingStep(onboardingStep - 1)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                  >
                    Previous
                  </button>
                ) : <div />}

                {onboardingStep < 4 ? (
                  <button
                    type="button"
                    onClick={() => setOnboardingStep(onboardingStep + 1)}
                    className="px-6 py-2.5 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      if (onNavigateToTab) onNavigateToTab('command');
                      else setCurrentView('account-settings');
                    }}
                    className="px-6 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20"
                  >
                    Enter Live Command Center
                  </button>
                )}
              </div>

            </div>
          )}

          {/* 7. ACCOUNT SETTINGS */}
          {currentView === 'account-settings' && (
            <div className="space-y-6 max-w-2xl mx-auto w-full animate-scaleUp">
              <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white">Account & Security Preferences</h2>
                  <p className="text-xs text-slate-400">Manage identity, privacy boundaries, and OAuth credentials</p>
                </div>
                <button
                  onClick={() => setCurrentView('billing')}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-950 border border-slate-800 text-cyan-300 hover:border-cyan-500/50"
                >
                  Manage Billing
                </button>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-5 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-slate-300 font-medium">Display Name</label>
                    <input
                      type="text"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-300 font-medium">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Athletic Bio / Longevity Focus</label>
                  <input
                    type="text"
                    value={profileBio}
                    onChange={(e) => setProfileBio(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>

                {/* Security Section */}
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                  <span className="text-xs font-bold text-white uppercase tracking-wider block">Security & Multi-Factor Auth</span>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-slate-200 font-semibold block">Two-Factor Authentication (MFA)</span>
                      <span className="text-[11px] text-slate-400">Requires authenticator app code on each new session</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={twoFactorEnabled}
                      onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                      className="accent-cyan-500 w-4 h-4 cursor-pointer"
                    />
                  </div>
                </div>

                {settingsSaved && (
                  <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs text-center font-bold flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Account preferences saved successfully!
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setCurrentView('cancel-subscription')}
                    className="text-xs text-rose-400 hover:underline"
                  >
                    Cancel Subscription or Delete Account
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 8. BILLING & INVOICES */}
          {currentView === 'billing' && (
            <div className="space-y-6 max-w-2xl mx-auto w-full animate-scaleUp text-xs">
              <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white">Subscription & Billing Management</h2>
                  <p className="text-xs text-slate-400">Current plan, payment methods, and invoice receipt archive</p>
                </div>
                <button
                  onClick={() => setCurrentView('upgrade')}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400"
                >
                  Change Plan
                </button>
              </div>

              {/* Current Active Plan Card */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-white">VITALOS Pro Biohacker</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 uppercase">Annual ($190/yr)</span>
                  </div>
                  <p className="text-slate-400 text-[11px] mt-0.5">Next billing date: August 25, 2027 • Auto-renews via Visa ending in 4242</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentView('downgrade')}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
                  >
                    Downgrade
                  </button>
                  <button
                    onClick={() => setCurrentView('cancel-subscription')}
                    className="px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 hover:bg-rose-500/20"
                  >
                    Cancel
                  </button>
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-2">
                <span className="font-bold text-white uppercase tracking-wider block text-[11px]">Payment Method</span>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-cyan-400" />
                    <div>
                      <span className="font-semibold text-white">Visa ending in 4242</span>
                      <span className="text-slate-400 text-[11px] block">Expires 08/29 • Default Method</span>
                    </div>
                  </div>
                  <button className="text-xs text-cyan-400 font-bold hover:underline">Edit Card</button>
                </div>
              </div>

              {/* Invoice History */}
              <div className="space-y-2">
                <span className="font-bold text-white uppercase tracking-wider block text-[11px]">Invoice Receipts</span>
                <div className="space-y-1.5">
                  {[
                    { id: 'INV-2026-08-01', date: 'Aug 1, 2026', amount: '$190.00', status: 'Paid' },
                    { id: 'INV-2025-08-01', date: 'Aug 1, 2025', amount: '$190.00', status: 'Paid' }
                  ].map((inv) => (
                    <div key={inv.id} className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="font-mono font-bold text-slate-200">{inv.id}</span>
                        <span className="text-[11px] text-slate-400 block">{inv.date}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-white">{inv.amount}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 uppercase">{inv.status}</span>
                        <button className="p-1 text-slate-400 hover:text-white" title="Download PDF"><Download className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 9. UPGRADE MEMBERSHIP */}
          {currentView === 'upgrade' && (
            <div className="space-y-6 max-w-3xl mx-auto w-full animate-scaleUp text-xs">
              <div className="text-center space-y-1">
                <h2 className="text-xl font-bold text-white">Upgrade Your Health Intelligence Tier</h2>
                <p className="text-slate-400">Unlock continuous Gemini AI synthesis, OCR lab digestion, and multi-sensor streaming</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Free Tier */}
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                  <span className="text-xs font-bold text-slate-400 uppercase">Starter</span>
                  <div className="text-2xl font-black text-white">$0 <span className="text-xs font-normal text-slate-400">/mo</span></div>
                  <ul className="space-y-1.5 text-slate-300 text-[11px]">
                    <li>• 1 Connected wearable</li>
                    <li>• Basic 7-day history</li>
                    <li>• Manual workout logging</li>
                  </ul>
                  <button
                    onClick={() => setCurrentPlan('free')}
                    className="w-full py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white font-bold"
                  >
                    Current / Free
                  </button>
                </div>

                {/* Pro Biohacker Tier (Recommended) */}
                <div className="bg-slate-950 p-5 rounded-2xl border-2 border-cyan-500 relative space-y-3 shadow-lg shadow-cyan-500/10">
                  <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-cyan-500 text-slate-950 font-bold uppercase text-[9px]">
                    Most Popular
                  </div>
                  <span className="text-xs font-bold text-cyan-400 uppercase">Pro Biohacker</span>
                  <div className="text-2xl font-black text-white">$19 <span className="text-xs font-normal text-slate-400">/mo</span></div>
                  <ul className="space-y-1.5 text-slate-200 text-[11px]">
                    <li>• Unlimited wearables & live BLE</li>
                    <li>• Gemini OCR Lab Report Parser</li>
                    <li>• "Why Am I Different Today?" Engine</li>
                    <li>• Multivariable What-If Simulator</li>
                  </ul>
                  <button
                    onClick={() => { setCurrentPlan('pro'); setCurrentView('payment-success'); }}
                    className="w-full py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-md shadow-cyan-500/20"
                  >
                    Select Pro Plan
                  </button>
                </div>

                {/* Clinical Team Tier */}
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                  <span className="text-xs font-bold text-purple-400 uppercase">Clinical & Coach</span>
                  <div className="text-2xl font-black text-white">$49 <span className="text-xs font-normal text-slate-400">/mo</span></div>
                  <ul className="space-y-1.5 text-slate-300 text-[11px]">
                    <li>• Multi-athlete dashboard</li>
                    <li>• HL7 / FHIR clinical export</li>
                    <li>• Dedicated sports physiologist AI</li>
                    <li>• HIPAA BAA agreement</li>
                  </ul>
                  <button
                    onClick={() => { setCurrentPlan('clinical'); setCurrentView('payment-success'); }}
                    className="w-full py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-purple-500 text-purple-300 font-bold"
                  >
                    Select Clinical Tier
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* 10. DOWNGRADE PLAN FLOW */}
          {currentView === 'downgrade' && (
            <div className="max-w-md mx-auto w-full space-y-6 animate-scaleUp text-xs">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto mb-2">
                  <ArrowDownRight className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-white">Downgrade to Starter Plan?</h2>
                <p className="text-slate-400">You will retain Pro access until the end of your billing cycle on August 25, 2027.</p>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-slate-300">
                <span className="font-bold text-white block">Features you will lose:</span>
                <ul className="list-disc list-inside space-y-1 text-slate-400">
                  <li>Continuous real-time Web Bluetooth HR pulse HUD</li>
                  <li>Diagnostic OCR parser for Quest & LabCorp PDFs</li>
                  <li>90-Day Digital Twin Equilibrium time scrubber</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setCurrentView('billing')}
                  className="flex-1 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-300 font-bold"
                >
                  Keep Pro Membership
                </button>
                <button
                  onClick={() => { setCurrentPlan('free'); setCurrentView('billing'); }}
                  className="flex-1 py-2.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 hover:bg-rose-500/30 font-bold"
                >
                  Confirm Downgrade
                </button>
              </div>
            </div>
          )}

          {/* 11. CANCEL SUBSCRIPTION SURVEY */}
          {currentView === 'cancel-subscription' && (
            <div className="max-w-md mx-auto w-full space-y-6 animate-scaleUp text-xs">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto mb-2">
                  <XCircle className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-white">We're sorry to see you go</h2>
                <p className="text-slate-400">Please let us know why you're cancelling so we can improve VITALOS</p>
              </div>

              <div className="space-y-2">
                {[
                  'Not using wearable sensors enough',
                  'Too expensive for my current budget',
                  'Missing specific hardware integration',
                  'Switched to another platform'
                ].map((reason, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCancelReason(reason)}
                    className={`w-full p-3 rounded-xl text-left border transition-all ${
                      cancelReason === reason
                        ? 'bg-rose-500/20 border-rose-500 text-rose-200 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {reason}
                  </button>
                ))}
              </div>

              {/* Retention Offer */}
              <div className="p-4 bg-cyan-500/10 rounded-xl border border-cyan-500/30 text-cyan-300 space-y-1">
                <span className="font-bold block">Special Retention Offer: Pause for 3 Months at $0</span>
                <p className="text-[11px] text-cyan-200">
                  Freeze your membership for 90 days. Keep all historical biometric archives intact with zero billing.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setCurrentView('billing')}
                  className="flex-1 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold"
                >
                  Accept Pause Offer
                </button>
                <button
                  onClick={() => { setCurrentPlan('free'); setCurrentView('billing'); }}
                  className="flex-1 py-2.5 rounded-xl bg-slate-950 border border-rose-500/40 text-rose-400 hover:bg-rose-500/20 font-bold"
                >
                  Cancel Immediately
                </button>
              </div>
            </div>
          )}

          {/* 12. PAYMENT SUCCESS */}
          {currentView === 'payment-success' && (
            <div className="max-w-md mx-auto w-full space-y-6 text-center animate-scaleUp text-xs">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h2 className="text-xl font-bold text-white">Payment Successful!</h2>
                <p className="text-slate-400">Your Pro Biohacker membership is active with immediate feature unlock.</p>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-left">
                <div className="flex justify-between">
                  <span className="text-slate-400">Order ID:</span>
                  <span className="font-mono text-white font-bold">VOS-948102</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Amount Charged:</span>
                  <span className="font-mono text-emerald-400 font-bold">$190.00 USD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Next Billing Date:</span>
                  <span className="text-white">August 25, 2027</span>
                </div>
              </div>

              <button
                onClick={() => {
                  if (onNavigateToTab) onNavigateToTab('command');
                  else setCurrentView('account-settings');
                }}
                className="w-full py-3 rounded-xl font-bold text-xs bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20"
              >
                Return to Health Dashboard
              </button>
            </div>
          )}

          {/* 13. PAYMENT FAILED */}
          {currentView === 'payment-failed' && (
            <div className="max-w-md mx-auto w-full space-y-6 text-center animate-scaleUp text-xs">
              <div className="w-16 h-16 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center mx-auto">
                <AlertCircle className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h2 className="text-xl font-bold text-white">Payment Failed: Card Declined</h2>
                <p className="text-slate-400">Your bank or card issuer declined the transaction (Code: <em>do_not_honor</em>).</p>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-left">
                <span className="font-bold text-rose-300 block">Recommended actions:</span>
                <ul className="list-disc list-inside space-y-1 text-slate-400">
                  <li>Verify card details and billing zip code match.</li>
                  <li>Check if international transactions are enabled on your card.</li>
                  <li>Provide an alternate debit/credit card or PayPal.</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setCurrentView('billing')}
                  className="flex-1 py-3 rounded-xl font-bold text-xs bg-cyan-500 hover:bg-cyan-400 text-slate-950"
                >
                  Update Payment Method
                </button>
                <button
                  onClick={() => setCurrentView('payment-pending')}
                  className="flex-1 py-3 rounded-xl font-bold text-xs bg-slate-950 border border-slate-700 text-slate-300"
                >
                  Retry Charge
                </button>
              </div>
            </div>
          )}

          {/* 14. PAYMENT PENDING */}
          {currentView === 'payment-pending' && (
            <div className="max-w-md mx-auto w-full space-y-6 text-center animate-scaleUp text-xs">
              <div className="w-16 h-16 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center mx-auto">
                <RefreshCw className="w-8 h-8 animate-spin" />
              </div>

              <div className="space-y-1">
                <h2 className="text-xl font-bold text-white">Payment Processing / Bank Settlement</h2>
                <p className="text-slate-400">We are confirming ACH / Bank Wire clearance with your financial institution.</p>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="font-mono text-cyan-300 font-bold">Transaction Reference: TX-WIRE-84910</span>
                <p className="text-slate-400 text-[11px]">This typically takes 15–30 seconds. Your license key will activate automatically.</p>
              </div>

              <button
                onClick={() => setCurrentView('payment-success')}
                className="w-full py-3 rounded-xl font-bold text-xs bg-cyan-500 hover:bg-cyan-400 text-slate-950"
              >
                Simulate Instant Clearance
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
