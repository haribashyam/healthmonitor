import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  FileText,
  BookOpen,
  Printer,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Award
} from 'lucide-react';

interface LegalComplianceViewProps {
  initialTab?: 'terms' | 'privacy' | 'hipaa' | 'biometric' | 'cookies';
  onNavigateTab?: (tab: string) => void;
}

export const LegalComplianceView: React.FC<LegalComplianceViewProps> = ({
  initialTab = 'terms',
  onNavigateTab
}) => {
  const [activeLegalTab, setActiveLegalTab] = useState<'terms' | 'privacy' | 'hipaa' | 'biometric' | 'cookies'>(initialTab);

  const tabs = [
    { id: 'terms', label: 'TERMS OF SERVICE' },
    { id: 'privacy', label: 'PRIVACY POLICY' },
    { id: 'hipaa', label: 'HIPAA NOTICE' },
    { id: 'biometric', label: 'BIOMETRIC CONSENT' },
    { id: 'cookies', label: 'COOKIE POLICY' }
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      style={{ background: 'linear-gradient(180deg, #D4D8DC 0%, #7D8288 45%, #23272A 100%)' }}
      className="p-4 sm:p-8 rounded-3xl border border-white/30 shadow-2xl space-y-8 animate-fadeIn text-slate-900 font-mono text-xs max-w-5xl mx-auto shadow-black/80"
    >
      
      {/* 1. Header Banner */}
      <div className="border-b border-slate-600/30 pb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 text-white rounded-full text-xs font-bold uppercase shadow-sm mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>LEGAL &amp; COMPLIANCE CHARTER</span>
          </div>
          <h1 className="font-serif font-black text-2xl sm:text-3xl lg:text-4xl uppercase tracking-tight text-slate-950 drop-shadow-sm">
            TERMS, PRIVACY &amp; HIPAA GOVERNANCE
          </h1>
          <p className="text-xs text-slate-800 font-sans font-medium">
            Effective Date: January 1, 2026 • Last Audited: Version 2026.4
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 border border-slate-700 rounded-xl font-bold uppercase text-xs flex items-center gap-2 transition-colors shadow-sm"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>PRINT DOCUMENT</span>
        </button>
      </div>


      {/* 2. Legal Tab Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-[var(--border-edge)] pb-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveLegalTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors border ${
              activeLegalTab === tab.id
                ? 'bg-[var(--text-main)] text-[var(--bg-canvas)] border-[var(--text-main)]'
                : 'bg-[var(--bg-card-alt)] text-[var(--text-muted)] border-[var(--border-edge)] hover:text-[var(--text-main)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3. Legal Document Body */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-edge)] rounded-2xl p-6 sm:p-10 space-y-6 font-sans text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
        
        {/* TERMS OF SERVICE */}
        {activeLegalTab === 'terms' && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="font-serif font-black text-xl text-[var(--text-main)] font-mono uppercase">
              1. VITALSYNC TERMS OF SERVICE
            </h2>

            <section className="space-y-2">
              <h3 className="font-bold text-xs uppercase font-mono text-[var(--text-main)]">
                1.1 ACCEPTANCE OF TERMS &amp; PURPOSE
              </h3>
              <p>
                By accessing, browsing, registering, or transmitting wearable or laboratory telemetry to the VitalSync platform ("Service"), you ("User" or "Subscriber") agree to be bound by these Terms of Service. If you do not accept these terms, you must refrain from using the platform.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-bold text-xs uppercase font-mono text-[var(--text-main)]">
                1.2 NON-EMERGENCY &amp; CLINICAL DISCLAIMER
              </h3>
              <p>
                VitalSync provides health intelligence, continuous physiological recording, and bio-adaptive insights for informational and performance optimization purposes only. VitalSync is not an emergency medical service and does not replace in-person consultation with licensed physicians. In the event of acute medical symptoms (such as sudden chest pain or respiratory distress), call emergency services immediately.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-bold text-xs uppercase font-mono text-[var(--text-main)]">
                1.3 SUBSCRIPTION BILLING &amp; CANCELLATION
              </h3>
              <p>
                Paid tiers (VitalSync Pro and Clinical Pro Suite) are billed in advance on a recurring monthly or annual basis. You may cancel your subscription at any time via the Account Settings portal. Cancellation takes effect at the end of the current billing cycle without penalty.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-bold text-xs uppercase font-mono text-[var(--text-main)]">
                1.4 INTELLECTUAL PROPERTY &amp; OWNERSHIP
              </h3>
              <p>
                You retain complete, exclusive ownership of all physiological data, biomarker records, and health journal logs you submit to the platform. VitalSync retains ownership of all proprietary algorithms, WhatChanged™ diagnostic models, and UI trademarks.
              </p>
            </section>
          </div>
        )}

        {/* PRIVACY POLICY */}
        {activeLegalTab === 'privacy' && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="font-serif font-black text-xl text-[var(--text-main)] font-mono uppercase">
              2. PRIVACY POLICY &amp; ZERO DATA-BROKERAGE CHARTER
            </h2>

            <section className="space-y-2">
              <h3 className="font-bold text-xs uppercase font-mono text-[var(--text-main)]">
                2.1 ZERO DATA-SALE GUARANTEE
              </h3>
              <p>
                VitalSync will NEVER sell, lease, license, or syndicate your biometric data, heart rate history, sleep metrics, or laboratory results to advertisers, insurance providers, employers, or third-party data brokers under any circumstances.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-bold text-xs uppercase font-mono text-[var(--text-main)]">
                2.2 DATA COLLECTION &amp; RETENTION
              </h3>
              <p>
                We collect only the telemetry necessary to calculate your vital scores, render longitudinal trend charts, and execute your requested AI consultations. Telemetry is stored strictly in isolated user partitions encrypted with AES-256-GCM.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-bold text-xs uppercase font-mono text-[var(--text-main)]">
                2.3 GDPR &amp; CCPA EXPORT &amp; HARD DELETION
              </h3>
              <p>
                Under GDPR Article 17 and CCPA, you have the right to request a complete machine-readable archive (JSON/CSV) of all collected metrics or trigger an irreversible purge of your entire database partition at any time.
              </p>
            </section>
          </div>
        )}

        {/* HIPAA NOTICE */}
        {activeLegalTab === 'hipaa' && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="font-serif font-black text-xl text-[var(--text-main)] font-mono uppercase">
              3. HIPAA NOTICE OF PRIVACY PRACTICES &amp; BAA GOVERNANCE
            </h2>

            <section className="space-y-2">
              <h3 className="font-bold text-xs uppercase font-mono text-[var(--text-main)]">
                3.1 PROTECTED HEALTH INFORMATION (PHI)
              </h3>
              <p>
                When utilized by clinical practices, research institutions, and certified healthcare providers under our Clinical Suite or Enterprise agreements, VitalSync operates as a HIPAA Business Associate pursuant to 45 CFR § 164.502(e) and § 164.504(e).
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-bold text-xs uppercase font-mono text-[var(--text-main)]">
                3.2 SAFEGUARDS &amp; AUDIT TRAILS
              </h3>
              <p>
                We maintain physical, technical, and administrative safeguards compliant with the HIPAA Security Rule, including continuous access logging, automatic session timeouts, and role-based access control (RBAC).
              </p>
            </section>
          </div>
        )}

        {/* BIOMETRIC CONSENT */}
        {activeLegalTab === 'biometric' && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="font-serif font-black text-xl text-[var(--text-main)] font-mono uppercase">
              4. BIOMETRIC TELEMETRY &amp; WEARABLE DATA CONSENT
            </h2>

            <section className="space-y-2">
              <p>
                By connecting a Web Bluetooth peripheral (e.g. Polar H10, Garmin, Apple Watch) or uploading laboratory panels, you explicitly grant VitalSync permission to process optical photoplethysmography (PPG), electrocardiogram (ECG), glucose variability, and clinical lab values solely to generate your personal health charts.
              </p>
            </section>
          </div>
        )}

        {/* COOKIE POLICY */}
        {activeLegalTab === 'cookies' && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="font-serif font-black text-xl text-[var(--text-main)] font-mono uppercase">
              5. COOKIE &amp; LOCAL STORAGE POLICY
            </h2>

            <section className="space-y-2">
              <p>
                VitalSync uses essential cookies and client-side session tokens strictly to authenticate active sessions and preserve your visual preferences (such as Light/Dark mode). We do not deploy third-party advertising cookies, behavioral tracking pixels, or cross-site fingerprinting scripts.
              </p>
            </section>
          </div>
        )}

      </div>

    </div>
  );
};
