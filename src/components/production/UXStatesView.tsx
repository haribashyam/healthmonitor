import React, { useState } from 'react';
import {
  AlertTriangle,
  Lock,
  ServerCrash,
  Wrench,
  WifiOff,
  Inbox,
  SearchX,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Clock,
  RefreshCw,
  ArrowRight,
  ShieldAlert,
  ChevronRight,
  Search,
  Activity,
  Layers,
  Sparkles,
  Key
} from 'lucide-react';

export type UXStateType =
  | '404'
  | '403'
  | '500'
  | 'maintenance'
  | 'offline'
  | 'empty-state'
  | 'no-search-results'
  | 'loading-state'
  | 'error-state'
  | 'success-state'
  | 'session-expired';

interface UXStatesViewProps {
  initialState?: UXStateType;
  onNavigateToTab?: (tab: string) => void;
}

export const UXStatesView: React.FC<UXStatesViewProps> = ({
  initialState = '404',
  onNavigateToTab
}) => {
  const [selectedState, setSelectedState] = useState<UXStateType>(initialState);
  const [searchQuerySample, setSearchQuerySample] = useState('hypertrophic cardiomyopathy v02');
  const [sessionPassword, setSessionPassword] = useState('');
  const [isRetrying, setIsRetrying] = useState(false);
  const [recoveredMessage, setRecoveredMessage] = useState(false);

  const stateDefinitions: { id: UXStateType; title: string; category: string; icon: any }[] = [
    { id: '404', title: '404 Not Found Page', category: 'HTTP Status', icon: SearchX },
    { id: '403', title: '403 Forbidden / Access Denied', category: 'HTTP Status', icon: Lock },
    { id: '500', title: '500 Internal Server Error', category: 'HTTP Status', icon: ServerCrash },
    { id: 'maintenance', title: 'Scheduled Maintenance Mode', category: 'System Status', icon: Wrench },
    { id: 'offline', title: 'Offline Network State', category: 'System Status', icon: WifiOff },
    { id: 'empty-state', title: 'Empty Telemetry State', category: 'Data & Search', icon: Inbox },
    { id: 'no-search-results', title: 'No Search Results Found', category: 'Data & Search', icon: SearchX },
    { id: 'loading-state', title: 'Biometric Skeleton Loader', category: 'Feedback & Motion', icon: Loader2 },
    { id: 'error-state', title: 'Inline Component Error Boundary', category: 'Feedback & Motion', icon: AlertCircle },
    { id: 'success-state', title: 'Transaction / Sync Success State', category: 'Feedback & Motion', icon: CheckCircle2 },
    { id: 'session-expired', title: 'Session Expired / Passkey Challenge', category: 'Security & Auth', icon: Clock },
  ];

  const handleSimulateRetry = () => {
    setIsRetrying(true);
    setTimeout(() => {
      setIsRetrying(false);
      setRecoveredMessage(true);
      setTimeout(() => setRecoveredMessage(false), 2500);
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-fadeIn text-slate-100">
      
      {/* Header Banner */}
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Production UX & Edge States</h1>
              <p className="text-xs text-slate-400">
                Audit and preview all 11 critical edge-case views: HTTP codes, offline queues, loaders, and session recovery.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-bold hidden sm:inline">Selected View:</span>
          <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-mono font-bold uppercase border border-cyan-500/30">
            {selectedState.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Main Grid: Edge-State Selector & Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Selector Sidebar */}
        <div className="lg:col-span-4 bg-slate-900 rounded-2xl p-4 border border-slate-800 space-y-4 shadow-md h-fit">
          <div className="flex items-center justify-between px-2 pb-2 border-b border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">UX State Catalog</span>
            <span className="text-[10px] text-cyan-400 font-mono">11 States</span>
          </div>

          <div className="space-y-1 max-h-[620px] overflow-y-auto pr-1">
            {stateDefinitions.map((item) => {
              const Icon = item.icon;
              const isActive = selectedState === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedState(item.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-left text-xs transition-all ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 font-bold shadow-sm'
                      : 'text-slate-300 hover:bg-slate-950/80 hover:text-white border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                    <div>
                      <span className="block leading-tight">{item.title}</span>
                      <span className="text-[10px] text-slate-400 font-normal">{item.category}</span>
                    </div>
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-600'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Canvas: Rendered UX State */}
        <div className="lg:col-span-8 bg-slate-900 rounded-2xl p-6 sm:p-10 border border-slate-800 shadow-md min-h-[580px] flex items-center justify-center relative overflow-hidden">
          
          {/* 1. 404 NOT FOUND */}
          {selectedState === '404' && (
            <div className="max-w-md w-full text-center space-y-6 animate-scaleUp">
              <div className="relative inline-block">
                <span className="text-7xl sm:text-8xl font-black text-slate-800 tracking-tighter select-none">404</span>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="p-3 bg-slate-950 rounded-2xl border border-cyan-500/40 text-cyan-400 shadow-lg shadow-cyan-500/20">
                    <Activity className="w-8 h-8 animate-pulse" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-bold text-white">Health Metric or Route Not Found</h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  The requested telemetry record, biomarker panel, or analytics page does not exist or has been archived.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => onNavigateToTab && onNavigateToTab('command')}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-md shadow-cyan-500/20 flex items-center justify-center gap-2"
                >
                  <Activity className="w-4 h-4" /> Return to Command Center
                </button>
                <button
                  onClick={() => onNavigateToTab && onNavigateToTab('sources')}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold"
                >
                  Check Data Sources
                </button>
              </div>
            </div>
          )}

          {/* 2. 403 FORBIDDEN */}
          {selectedState === '403' && (
            <div className="max-w-md w-full text-center space-y-6 animate-scaleUp">
              <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto shadow-lg shadow-rose-500/10">
                <Lock className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-rose-400">403 Access Denied</span>
                <h2 className="text-xl font-bold text-white">Clinical Role Authorization Required</h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  You do not possess the necessary cryptographic credentials or HIPAA BAA permissions to view this athlete's raw genomic or multi-patient panel.
                </p>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400 text-left font-mono">
                ErrorCode: ERR_RBAC_INSUFFICIENT_PRIVILEGES<br />
                RequiredScope: athlete:clinical:write
              </div>

              <button
                onClick={() => onNavigateToTab && onNavigateToTab('account')}
                className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-md shadow-cyan-500/20"
              >
                Request Role Escalation
              </button>
            </div>
          )}

          {/* 3. 500 INTERNAL SERVER ERROR */}
          {selectedState === '500' && (
            <div className="max-w-md w-full text-center space-y-6 animate-scaleUp">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/10">
                <ServerCrash className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">500 Server Error</span>
                <h2 className="text-xl font-bold text-white">Biometric Telemetry Pipeline Timeout</h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Our downstream high-frequency heart rate streaming cluster timed out during regression calculation. Your local raw data remains secure.
                </p>
              </div>

              {recoveredMessage && (
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Cluster reconnection established!
                </div>
              )}

              <button
                onClick={handleSimulateRetry}
                disabled={isRetrying}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 mx-auto"
              >
                <RefreshCw className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} />
                {isRetrying ? 'Reconnecting to Cluster...' : 'Retry Ingestion'}
              </button>
            </div>
          )}

          {/* 4. MAINTENANCE MODE */}
          {selectedState === 'maintenance' && (
            <div className="max-w-md w-full text-center space-y-6 animate-scaleUp">
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center mx-auto shadow-lg shadow-cyan-500/10">
                <Wrench className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold uppercase">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" /> Scheduled Upgrade Window
                </div>
                <h2 className="text-xl font-bold text-white">VITALOS Core Maintenance</h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  We are deploying Gemini 2.5 Flash neural models for enhanced ECG arrhythmia detection. Estimated window completion in <strong>22 minutes</strong>.
                </p>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 grid grid-cols-3 gap-2 text-center text-xs">
                <div><span className="text-lg font-black text-cyan-400 block">00</span><span className="text-[10px] text-slate-400">Hours</span></div>
                <div><span className="text-lg font-black text-cyan-400 block">22</span><span className="text-[10px] text-slate-400">Minutes</span></div>
                <div><span className="text-lg font-black text-cyan-400 block">45</span><span className="text-[10px] text-slate-400">Seconds</span></div>
              </div>
            </div>
          )}

          {/* 5. OFFLINE STATE */}
          {selectedState === 'offline' && (
            <div className="max-w-md w-full text-center space-y-6 animate-scaleUp">
              <div className="w-16 h-16 rounded-2xl bg-slate-800 text-slate-400 border border-slate-700 flex items-center justify-center mx-auto">
                <WifiOff className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-bold text-white">No Internet Connection Detected</h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  VITALOS has switched to <strong>Offline Edge Mode</strong>. Continuous Web Bluetooth heart rate metrics are queuing locally in IndexedDB and will sync when reconnected.
                </p>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-300">Queued Offline Telemetry Packets:</span>
                <span className="font-mono text-cyan-400 font-bold">1,842 samples</span>
              </div>

              <button
                onClick={handleSimulateRetry}
                className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center justify-center gap-2 mx-auto"
              >
                <RefreshCw className="w-4 h-4" /> Check Network Connectivity
              </button>
            </div>
          )}

          {/* 6. EMPTY STATE */}
          {selectedState === 'empty-state' && (
            <div className="max-w-md w-full text-center space-y-6 animate-scaleUp">
              <div className="w-16 h-16 rounded-2xl bg-slate-800/80 text-slate-400 border border-slate-700 flex items-center justify-center mx-auto">
                <Inbox className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-bold text-white">No Activities or Workouts Logged Yet</h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Connect your Apple Watch, Strava, or start a live Bluetooth heart rate session to populate your cardiovascular analytics.
                </p>
              </div>

              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => onNavigateToTab && onNavigateToTab('sources')}
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-md shadow-cyan-500/20 flex items-center gap-1.5"
                >
                  <Layers className="w-4 h-4" /> Connect Data Sources
                </button>
              </div>
            </div>
          )}

          {/* 7. NO SEARCH RESULTS */}
          {selectedState === 'no-search-results' && (
            <div className="max-w-md w-full text-center space-y-6 animate-scaleUp">
              <div className="w-16 h-16 rounded-2xl bg-slate-800/80 text-slate-400 border border-slate-700 flex items-center justify-center mx-auto">
                <SearchX className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-bold text-white">No Matching Health Metrics Found</h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  We couldn't find anything matching <strong className="text-white">"{searchQuerySample}"</strong> in your active logs, lab panels, or workouts.
                </p>
              </div>

              <div className="space-y-2 text-xs">
                <span className="text-slate-400 font-medium block">Suggested searches:</span>
                <div className="flex flex-wrap justify-center gap-2">
                  {['Resting Heart Rate', 'HRV RMSSD', 'Zone 2 Run', 'Fasting Glucose', 'Sleep Stage'].map((term) => (
                    <button
                      key={term}
                      onClick={() => setSearchQuerySample(term)}
                      className="px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-cyan-300 hover:border-cyan-500/50"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 8. LOADING SKELETON STATE */}
          {selectedState === 'loading-state' && (
            <div className="max-w-md w-full space-y-6 animate-scaleUp">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center mx-auto">
                  <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
                </div>
                <h2 className="text-base font-bold text-white">Hydrating Biometric Multiverse Engine...</h2>
                <p className="text-xs text-slate-400">Synthesizing 90-day time-series across 6 wearable streams</p>
              </div>

              {/* Skeleton Mock Components */}
              <div className="space-y-3">
                <div className="h-16 bg-slate-950 rounded-xl border border-slate-800/80 animate-pulse flex items-center px-4 justify-between">
                  <div className="space-y-2 w-2/3">
                    <div className="h-3 bg-slate-800 rounded w-3/4" />
                    <div className="h-2 bg-slate-800/60 rounded w-1/2" />
                  </div>
                  <div className="w-12 h-6 bg-slate-800 rounded" />
                </div>

                <div className="h-24 bg-slate-950 rounded-xl border border-slate-800/80 animate-pulse flex items-center px-4 gap-3">
                  <div className="w-12 h-12 rounded-full bg-slate-800" />
                  <div className="space-y-2 flex-1">
                    <div className="h-3 bg-slate-800 rounded w-5/6" />
                    <div className="h-2 bg-slate-800/60 rounded w-4/6" />
                    <div className="h-2 bg-slate-800/40 rounded w-2/6" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 9. ERROR BOUNDARY */}
          {selectedState === 'error-state' && (
            <div className="max-w-md w-full text-center space-y-6 animate-scaleUp">
              <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto">
                <AlertCircle className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-bold text-white">Component Error Caught</h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  An unexpected parsing error occurred while rendering the SVG Radar chart. The rest of the app continues safely.
                </p>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-left font-mono text-[10px] text-rose-300 overflow-x-auto">
                TypeError: Cannot read property 'coordinates' of undefined<br />
                at DigitalTwinRadar.render (RadarView.tsx:142:19)
              </div>

              <button
                onClick={handleSimulateRetry}
                className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-2 mx-auto"
              >
                <RefreshCw className="w-4 h-4" /> Reset Error Boundary
              </button>
            </div>
          )}

          {/* 10. SUCCESS STATE */}
          {selectedState === 'success-state' && (
            <div className="max-w-md w-full text-center space-y-6 animate-scaleUp">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Verification Complete</span>
                <h2 className="text-xl font-bold text-white">Quest Lab Panel Ingested & Verified</h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  All 18 lipid, metabolic, and hormone biomarkers have been successfully parsed with 100% OCR confidence and linked to your digital twin.
                </p>
              </div>

              <button
                onClick={() => onNavigateToTab && onNavigateToTab('vitals')}
                className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 mx-auto"
              >
                View Updated Biomarker Panel <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* 11. SESSION EXPIRED */}
          {selectedState === 'session-expired' && (
            <div className="max-w-md w-full space-y-6 text-center animate-scaleUp text-xs">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/10">
                <Clock className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-bold text-white">Session Inactivity Timeout</h2>
                <p className="text-slate-400 leading-relaxed">
                  For your biometric data privacy, sessions auto-lock after 15 minutes of inactivity. Re-enter your passkey to resume without losing in-flight workouts.
                </p>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleSimulateRetry(); }} className="space-y-3">
                <input
                  type="password"
                  value={sessionPassword}
                  onChange={(e) => setSessionPassword(e.target.value)}
                  placeholder="Enter your master passkey..."
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500 font-mono"
                  required
                />
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl font-bold text-xs bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20 flex items-center justify-center gap-2"
                >
                  <Key className="w-4 h-4" /> Unlock Session
                </button>
              </form>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
