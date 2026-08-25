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
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs mt-16">
      
      {/* Top Banner: Trust, HIPAA & Zero-Sale Guarantee */}
      <div className="border-b border-slate-900 bg-slate-950/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-slate-300 font-semibold">Zero-Sale Biometric Privacy:</span>
            <span className="text-slate-400">Your health data is never sold, licensed, or shared with third parties.</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenLegalDoc('security')}
              className="hover:text-cyan-300 flex items-center gap-1 text-[11px]"
            >
              <Lock className="w-3 h-3 text-cyan-400" /> SOC 2 & HIPAA Ready
            </button>
            <span className="text-slate-700">•</span>
            <button
              onClick={onOpenCookiePreferences}
              className="hover:text-cyan-300 flex items-center gap-1 text-[11px]"
            >
              <Cookie className="w-3 h-3 text-cyan-400" /> Cookie Preferences
            </button>
          </div>
        </div>
      </div>

      {/* Main 5-Column Navigation Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          
          {/* Col 1: Brand & Overview */}
          <div className="col-span-2 md:col-span-1 space-y-3">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigateTab('command')}>
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-emerald-400 p-[1.5px]">
                <div className="w-full h-full bg-slate-950 rounded-[6px] flex items-center justify-center">
                  <Activity className="w-3.5 h-3.5 text-cyan-400" />
                </div>
              </div>
              <span className="font-black text-sm text-white tracking-wider">VITAL<span className="text-cyan-400">OS</span></span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Unified health intelligence, continuous Web Bluetooth sync, lab OCR analysis, and personalized adaptive planning.
            </p>
            <div className="pt-1 text-[10px] text-slate-400 font-mono">
              Build v3.4.2-prod • Self-Sovereign Core
            </div>
          </div>

          {/* Col 2: Legal & Governance (15 Pages) */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> Legal & Trust
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li><button onClick={() => onOpenLegalDoc('privacy')} className="hover:text-cyan-300">Privacy Policy</button></li>
              <li><button onClick={() => onOpenLegalDoc('terms')} className="hover:text-cyan-300">Terms of Service</button></li>
              <li><button onClick={() => onOpenLegalDoc('disclaimer')} className="hover:text-cyan-300">Medical & AI Disclaimer</button></li>
              <li><button onClick={() => onOpenLegalDoc('cookie-policy')} className="hover:text-cyan-300">Cookie Policy</button></li>
              <li><button onClick={onOpenCookiePreferences} className="hover:text-cyan-300">Cookie Preferences</button></li>
              <li><button onClick={() => onOpenLegalDoc('dpa')} className="hover:text-cyan-300">Data Processing (DPA)</button></li>
              <li><button onClick={() => onOpenLegalDoc('acceptable-use')} className="hover:text-cyan-300">Acceptable Use Policy</button></li>
              <li><button onClick={() => onOpenLegalDoc('security')} className="hover:text-cyan-300">Security Policy</button></li>
              <li><button onClick={() => onOpenLegalDoc('responsible-disclosure')} className="hover:text-cyan-300">Responsible Disclosure</button></li>
              <li><button onClick={() => onOpenLegalDoc('community-guidelines')} className="hover:text-cyan-300">Community Guidelines</button></li>
              <li><button onClick={() => onOpenLegalDoc('accessibility')} className="hover:text-cyan-300">Accessibility Statement</button></li>
            </ul>
          </div>

          {/* Col 3: Hardware & Commerce Policies */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-cyan-400" /> Hardware & Orders
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li><button onClick={() => onOpenLegalDoc('refund')} className="hover:text-cyan-300">Refund Policy (30-Day)</button></li>
              <li><button onClick={() => onOpenLegalDoc('cancellation')} className="hover:text-cyan-300">Cancellation Policy</button></li>
              <li><button onClick={() => onOpenLegalDoc('shipping')} className="hover:text-cyan-300">Shipping & Sensor Logistics</button></li>
              <li><button onClick={() => onOpenLegalDoc('return-exchange')} className="hover:text-cyan-300">Return & Wear Trial Policy</button></li>
              <li><button onClick={() => onOpenLifecycle('billing')} className="hover:text-cyan-300">Invoice History</button></li>
              <li><button onClick={() => onOpenLifecycle('upgrade')} className="hover:text-cyan-300">Pro & Clinical Pricing</button></li>
            </ul>
          </div>

          {/* Col 4: Customer Lifecycle & Auth */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-cyan-400" /> Account Lifecycle
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li><button onClick={() => onOpenLifecycle('login')} className="hover:text-cyan-300">Login</button></li>
              <li><button onClick={() => onOpenLifecycle('register')} className="hover:text-cyan-300">Register</button></li>
              <li><button onClick={() => onOpenLifecycle('email-verification')} className="hover:text-cyan-300">Email Verification</button></li>
              <li><button onClick={() => onOpenLifecycle('forgot-password')} className="hover:text-cyan-300">Forgot Password</button></li>
              <li><button onClick={() => onOpenLifecycle('reset-password')} className="hover:text-cyan-300">Reset Password</button></li>
              <li><button onClick={() => onOpenLifecycle('onboarding')} className="hover:text-cyan-300">4-Step Onboarding</button></li>
              <li><button onClick={() => onOpenLifecycle('account-settings')} className="hover:text-cyan-300">Account Settings</button></li>
              <li><button onClick={() => onOpenLifecycle('cancel-subscription')} className="hover:text-cyan-300">Cancel / Pause Plan</button></li>
              <li><button onClick={onOpenHelpCenter} className="hover:text-cyan-300">Help Center & Support</button></li>
            </ul>
          </div>

          {/* Col 5: UX Edge States Audit */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-cyan-400" /> UX States Directory
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li><button onClick={() => onOpenUXState('404')} className="hover:text-cyan-300">404 Not Found</button></li>
              <li><button onClick={() => onOpenUXState('403')} className="hover:text-cyan-300">403 Forbidden</button></li>
              <li><button onClick={() => onOpenUXState('500')} className="hover:text-cyan-300">500 Server Error</button></li>
              <li><button onClick={() => onOpenUXState('maintenance')} className="hover:text-cyan-300">Maintenance Window</button></li>
              <li><button onClick={() => onOpenUXState('offline')} className="hover:text-cyan-300">Offline Queue State</button></li>
              <li><button onClick={() => onOpenUXState('empty-state')} className="hover:text-cyan-300">Empty Telemetry</button></li>
              <li><button onClick={() => onOpenUXState('no-search-results')} className="hover:text-cyan-300">No Search Results</button></li>
              <li><button onClick={() => onOpenUXState('loading-state')} className="hover:text-cyan-300">Skeleton Loader</button></li>
              <li><button onClick={() => onOpenUXState('error-state')} className="hover:text-cyan-300">Component Error State</button></li>
              <li><button onClick={() => onOpenUXState('success-state')} className="hover:text-cyan-300">Sync Success State</button></li>
              <li><button onClick={() => onOpenUXState('session-expired')} className="hover:text-cyan-300">Session Expired</button></li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright & Disclaimer */}
        <div className="border-t border-slate-900 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} VITALOS Health Intelligence Inc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => onOpenLegalDoc('disclaimer')} className="hover:text-slate-300">
              Not Medical Advice
            </button>
            <span>•</span>
            <button onClick={() => onOpenLegalDoc('privacy')} className="hover:text-slate-300">
              HIPAA & GDPR Enclave
            </button>
            <span>•</span>
            <button onClick={onOpenHelpCenter} className="hover:text-slate-300">
              System Status: Operational (99.98%)
            </button>
          </div>
        </div>
      </div>

    </footer>
  );
};
