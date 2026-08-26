import React from 'react';
import {
  Activity,
  ShieldCheck,
  FileText,
  LifeBuoy,
  User,
  Sliders,
  Sparkles,
  Lock,
  Heart,
  ExternalLink,
  ChevronRight,
  Cookie,
  AlertTriangle
} from 'lucide-react';
import { LegalDocType } from './production/LegalPagesView';
import { LifecycleViewType } from './production/CustomerLifecycleView';
import { UXStateType } from './production/UXStatesView';

interface FooterProps {
  onOpenLegalDoc: (doc: LegalDocType) => void;
  onOpenLifecycle: (view: LifecycleViewType) => void;
  onOpenHelpCenter: () => void;
  onOpenUXState: (state: UXStateType) => void;
  onOpenCookiePreferences: () => void;
  onNavigateTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenLegalDoc,
  onOpenLifecycle,
  onOpenHelpCenter,
  onOpenUXState,
  onOpenCookiePreferences,
  onNavigateTab
}) => {
  return (
    <footer className="bg-slate-50 border-t-4 border-slate-50 text-slate-700 text-xs mt-0">

      {/* Masthead strip: edition metadata */}
      <div className="border-b-2 border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center justify-between gap-2 font-mono uppercase tracking-widest text-[10px] text-slate-600">
          <span>Vol. 3 · No. 42 · {new Date().getFullYear()} Edition</span>
          <span className="text-cyan-500">VITALSYNC HEALTH INTELLIGENCE</span>
          <span>Printed {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
        </div>
      </div>

      {/* Top Banner: Trust, HIPAA & Zero-Sale Guarantee */}
      <div className="border-b-2 border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-slate-900 font-bold uppercase tracking-wider">Zero-Sale Biometric Privacy:</span>
            <span className="text-slate-600">Your health data is never sold, licensed, or shared with third parties.</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenLegalDoc('security')}
              className="hover:text-cyan-500 flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider"
            >
              <Lock className="w-3 h-3 text-cyan-500" /> SOC 2 & HIPAA Ready
            </button>
            <span className="text-slate-600">•</span>
            <button
              onClick={onOpenCookiePreferences}
              className="hover:text-cyan-500 flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider"
            >
              <Cookie className="w-3 h-3 text-cyan-500" /> Cookie Preferences
            </button>
          </div>
        </div>
      </div>

      {/* Main 5-Column Navigation Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          
          {/* Col 1: Brand & Overview */}
          <div className="col-span-2 md:col-span-1 space-y-3">
            <div className="flex items-center gap-2 cursor-pointer group" onClick={() => onNavigateTab('command')}>
              <div className="w-8 h-8 bg-cyan-500 border-2 border-slate-900 flex items-center justify-center">
                <Activity className="w-4 h-4 text-slate-950" />
              </div>
              <span className="font-black text-base text-slate-900 tracking-tight font-serif-display">VITAL<span className="text-cyan-500">OS</span></span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed font-body-serif">
              Unified health intelligence, continuous Web Bluetooth sync, lab OCR analysis, and personalized adaptive planning.
            </p>
            <div className="pt-1 text-[10px] text-slate-600 font-mono uppercase tracking-widest border-t border-slate-800">
              Build v3.4.2-prod · Self-Sovereign Core
            </div>
          </div>

          {/* Col 2: Legal & Governance (15 Pages) */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> Legal & Trust
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li><button onClick={() => onOpenLegalDoc('privacy')} className="hover:text-cyan-500">Privacy Policy</button></li>
              <li><button onClick={() => onOpenLegalDoc('terms')} className="hover:text-cyan-500">Terms of Service</button></li>
              <li><button onClick={() => onOpenLegalDoc('disclaimer')} className="hover:text-cyan-500">Medical & AI Disclaimer</button></li>
              <li><button onClick={() => onOpenLegalDoc('cookie-policy')} className="hover:text-cyan-500">Cookie Policy</button></li>
              <li><button onClick={onOpenCookiePreferences} className="hover:text-cyan-500">Cookie Preferences</button></li>
              <li><button onClick={() => onOpenLegalDoc('dpa')} className="hover:text-cyan-500">Data Processing (DPA)</button></li>
              <li><button onClick={() => onOpenLegalDoc('acceptable-use')} className="hover:text-cyan-500">Acceptable Use Policy</button></li>
              <li><button onClick={() => onOpenLegalDoc('security')} className="hover:text-cyan-500">Security Policy</button></li>
              <li><button onClick={() => onOpenLegalDoc('responsible-disclosure')} className="hover:text-cyan-500">Responsible Disclosure</button></li>
              <li><button onClick={() => onOpenLegalDoc('community-guidelines')} className="hover:text-cyan-500">Community Guidelines</button></li>
              <li><button onClick={() => onOpenLegalDoc('accessibility')} className="hover:text-cyan-500">Accessibility Statement</button></li>
            </ul>
          </div>

          {/* Col 3: Hardware & Commerce Policies */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-cyan-400" /> Hardware & Orders
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li><button onClick={() => onOpenLegalDoc('refund')} className="hover:text-cyan-500">Refund Policy (30-Day)</button></li>
              <li><button onClick={() => onOpenLegalDoc('cancellation')} className="hover:text-cyan-500">Cancellation Policy</button></li>
              <li><button onClick={() => onOpenLegalDoc('shipping')} className="hover:text-cyan-500">Shipping & Sensor Logistics</button></li>
              <li><button onClick={() => onOpenLegalDoc('return-exchange')} className="hover:text-cyan-500">Return & Wear Trial Policy</button></li>
              <li><button onClick={() => onOpenLifecycle('billing')} className="hover:text-cyan-500">Invoice History</button></li>
              <li><button onClick={() => onOpenLifecycle('upgrade')} className="hover:text-cyan-500">Pro & Clinical Pricing</button></li>
            </ul>
          </div>

          {/* Col 4: Customer Lifecycle & Auth */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-cyan-400" /> Account Lifecycle
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li><button onClick={() => onOpenLifecycle('login')} className="hover:text-cyan-500">Login</button></li>
              <li><button onClick={() => onOpenLifecycle('register')} className="hover:text-cyan-500">Register</button></li>
              <li><button onClick={() => onOpenLifecycle('email-verification')} className="hover:text-cyan-500">Email Verification</button></li>
              <li><button onClick={() => onOpenLifecycle('forgot-password')} className="hover:text-cyan-500">Forgot Password</button></li>
              <li><button onClick={() => onOpenLifecycle('reset-password')} className="hover:text-cyan-500">Reset Password</button></li>
              <li><button onClick={() => onOpenLifecycle('onboarding')} className="hover:text-cyan-500">4-Step Onboarding</button></li>
              <li><button onClick={() => onOpenLifecycle('account-settings')} className="hover:text-cyan-500">Account Settings</button></li>
              <li><button onClick={() => onOpenLifecycle('cancel-subscription')} className="hover:text-cyan-500">Cancel / Pause Plan</button></li>
              <li><button onClick={onOpenHelpCenter} className="hover:text-cyan-500">Help Center & Support</button></li>
            </ul>
          </div>

          {/* Col 5: UX Edge States Audit */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-cyan-400" /> UX States Directory
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li><button onClick={() => onOpenUXState('404')} className="hover:text-cyan-500">404 Not Found</button></li>
              <li><button onClick={() => onOpenUXState('403')} className="hover:text-cyan-500">403 Forbidden</button></li>
              <li><button onClick={() => onOpenUXState('500')} className="hover:text-cyan-500">500 Server Error</button></li>
              <li><button onClick={() => onOpenUXState('maintenance')} className="hover:text-cyan-500">Maintenance Window</button></li>
              <li><button onClick={() => onOpenUXState('offline')} className="hover:text-cyan-500">Offline Queue State</button></li>
              <li><button onClick={() => onOpenUXState('empty-state')} className="hover:text-cyan-500">Empty Telemetry</button></li>
              <li><button onClick={() => onOpenUXState('no-search-results')} className="hover:text-cyan-500">No Search Results</button></li>
              <li><button onClick={() => onOpenUXState('loading-state')} className="hover:text-cyan-500">Skeleton Loader</button></li>
              <li><button onClick={() => onOpenUXState('error-state')} className="hover:text-cyan-500">Component Error State</button></li>
              <li><button onClick={() => onOpenUXState('success-state')} className="hover:text-cyan-500">Sync Success State</button></li>
              <li><button onClick={() => onOpenUXState('session-expired')} className="hover:text-cyan-500">Session Expired</button></li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright & Disclaimer */}
        <div className="border-t-2 border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-600 font-mono uppercase tracking-widest">
          <p>© {new Date().getFullYear()} VITALOS Health Intelligence Inc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => onOpenLegalDoc('disclaimer')} className="hover:text-slate-900 hover:underline">
              Not Medical Advice
            </button>
            <span>•</span>
            <button onClick={() => onOpenLegalDoc('privacy')} className="hover:text-slate-900 hover:underline">
              HIPAA & GDPR Enclave
            </button>
            <span>•</span>
            <button onClick={onOpenHelpCenter} className="hover:text-slate-900 hover:underline">
              System Status: Operational (99.98%)
            </button>
          </div>
        </div>
      </div>

    </footer>
  );
};
