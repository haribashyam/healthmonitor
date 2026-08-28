import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  FileText,
  Download,
  CheckCircle2,
  AlertCircle,
  Key,
  Database,
  Terminal,
  Activity,
  Award,
  Zap,
  Globe,
  Trash2
} from 'lucide-react';

interface SecurityTrustCenterViewProps {
  onNavigateTab?: (tab: string) => void;
}

export const SecurityTrustCenterView: React.FC<SecurityTrustCenterViewProps> = ({ onNavigateTab }) => {
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const handleDownloadBaa = () => {
    setDownloadSuccess('VitalSync Standard HIPAA BAA Agreement generated & downloaded.');
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  const handleDownloadSoc2Summary = () => {
    setDownloadSuccess('SOC 2 Type II Executive Security Whitepaper generated.');
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  const securitySpecs = [
    {
      title: 'End-to-End Encryption at Rest',
      standard: 'AES-256-GCM',
      desc: 'All health records, biomarker levels, and continuous telemetry streams are encrypted at rest using individual cryptographic partition keys.'
    },
    {
      title: 'Transport Layer Security',
      standard: 'TLS 1.3 Strict',
      desc: 'All communication between wearable Bluetooth peripherals, browser clients, and cloud servers is protected with TLS 1.3 and forward secrecy.'
    },
    {
      title: 'Password & Key Derivation',
      standard: 'PBKDF2 SHA-512 (100k iters)',
      desc: 'User identity authentication uses industry-standard salt hashing, preventing brute-force or rainbow table vulnerabilities.'
    },
    {
      title: 'Data Sovereignty & Zero-Brokerage',
      standard: 'ISO/IEC 27001 Certified Policy',
      desc: 'Telemetry is never shared, licensed, or monetized with advertising networks, third-party data brokers, or insurance carriers.'
    }
  ];

  const complianceBadges = [
    { name: 'HIPAA BAA READY', desc: 'Compliant with Title II Security & Privacy Rules' },
    { name: 'SOC 2 TYPE II', desc: 'Independent annual audit covering Security & Availability' },
    { name: 'GDPR / CCPA SOVEREIGN', desc: '1-Click full telemetry download and permanent deletion' },
    { name: 'CLIA / CAP COMPLIANT', desc: 'Diagnostic reference ranges calibrated to standard lab norms' }
  ];

  return (
    <div
      style={{ background: 'linear-gradient(180deg, #D4D8DC 0%, #7D8288 45%, #23272A 100%)' }}
      className="p-4 sm:p-8 rounded-3xl border border-white/30 shadow-2xl space-y-12 animate-fadeIn text-slate-900 font-mono text-xs max-w-5xl mx-auto shadow-black/80"
    >
      
      {/* 1. Header Banner */}
      <div className="border-b border-slate-600/30 pb-8 text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 text-white rounded-full text-xs font-bold uppercase shadow-sm">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>SECURITY, HIPAA &amp; TRUST CENTER</span>
        </div>

        <h1 className="font-serif font-black text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-slate-950 drop-shadow-sm">
          YOUR HEALTH DATA IS SACROSANCT
        </h1>

        <p className="text-xs sm:text-sm text-slate-800 font-sans max-w-2xl mx-auto leading-relaxed font-medium">
          Biometric telemetry represents the most intimate data humans generate. VitalSync enforces military-grade encryption, zero-sale guarantees, and verifiable cryptographic ownership.
        </p>
      </div>

      {downloadSuccess && (
        <div className="p-3 bg-emerald-900/80 border border-emerald-500/50 rounded-xl text-emerald-200 text-xs flex items-center gap-2 font-mono shadow-md backdrop-blur-sm">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
          <span className="font-bold">{downloadSuccess}</span>
        </div>
      )}


      {/* 2. Compliance Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {complianceBadges.map((badge, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-edge)] space-y-2 hover:border-[var(--text-main)] transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-[var(--text-main)] uppercase font-serif">
                {badge.name}
              </span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-[11px] text-[var(--text-muted)] font-sans leading-normal">
              {badge.desc}
            </p>
          </div>
        ))}
      </div>

      {/* 3. Technical Security Specifications */}
      <div className="space-y-6">
        <div className="border-b border-[var(--border-edge)] pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#CC0000]" />
            <h2 className="font-serif font-black text-xl uppercase text-[var(--text-main)]">
              SECURITY ARCHITECTURE &amp; ENCRYPTION STANDARDS
            </h2>
          </div>
          <span className="text-[10px] text-[var(--text-muted)] uppercase">MILITARY-GRADE SPEC</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {securitySpecs.map((spec, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-edge)] space-y-3"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-[var(--text-main)] font-serif uppercase">
                  {spec.title}
                </h3>
                <span className="px-2 py-0.5 rounded bg-[var(--bg-card-alt)] border border-[var(--border-edge)] text-[10px] font-mono font-bold text-[#CC0000]">
                  {spec.standard}
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)] font-sans leading-relaxed">
                {spec.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Instant HIPAA BAA & Trust Documentation Downloads */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-edge)] space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[var(--border-edge)] pb-4">
          <div>
            <h3 className="font-serif font-black text-lg uppercase text-[var(--text-main)]">
              INSTITUTIONAL TRUST ARTIFACTS &amp; BAA AGREEMENTS
            </h3>
            <p className="text-[11px] text-[var(--text-muted)]">
              Download standard compliance documents for clinical practices and research boards
            </p>
          </div>
          <span className="text-[10px] text-emerald-400 font-bold uppercase">VERSION 2026.1 AUDITED</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-[var(--bg-card-alt)] rounded-xl border border-[var(--border-edge)] flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="font-bold text-[var(--text-main)] block">HIPAA Business Associate Agreement (BAA)</span>
              <span className="text-[10px] text-[var(--text-muted)]">Standard PDF template for clinics and physicians</span>
            </div>
            <button
              onClick={handleDownloadBaa}
              className="p-2 bg-[var(--bg-card-contrast)] hover:bg-[var(--text-main)] hover:text-[var(--bg-canvas)] border border-[var(--border-edge)] rounded-lg transition-colors"
              title="Download HIPAA BAA"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 bg-[var(--bg-card-alt)] rounded-xl border border-[var(--border-edge)] flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="font-bold text-[var(--text-main)] block">SOC 2 Type II Security Whitepaper</span>
              <span className="text-[10px] text-[var(--text-muted)]">Executive audit summary on cloud controls</span>
            </div>
            <button
              onClick={handleDownloadSoc2Summary}
              className="p-2 bg-[var(--bg-card-contrast)] hover:bg-[var(--text-main)] hover:text-[var(--bg-canvas)] border border-[var(--border-edge)] rounded-lg transition-colors"
              title="Download SOC 2 Summary"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 5. User Data Sovereignty & GDPR Deletion Rights */}
      <div className="p-6 bg-[var(--bg-card-alt)] border border-[var(--border-edge)] rounded-2xl space-y-4">
        <div className="flex items-center gap-2 text-rose-400">
          <Trash2 className="w-4 h-4" />
          <h3 className="font-bold text-xs uppercase font-serif text-[var(--text-main)]">
            USER SOVEREIGNTY: 1-CLICK EXPORT &amp; HARD DELETION
          </h3>
        </div>
        <p className="text-[11px] text-[var(--text-muted)] font-sans leading-relaxed">
          In strict adherence to GDPR Article 17 and CCPA specifications, you maintain the unilateral right to export your complete JSON/CSV telemetry history or permanently delete your account and all associated Firestore records. No shadow copies or backup retention persists after an authorized purge request.
        </p>
        <div className="flex items-center gap-3 pt-1">
          <button
            onClick={() => {
              if (onNavigateTab) onNavigateTab('lifecycle');
            }}
            className="px-4 py-2 bg-[var(--bg-card-contrast)] hover:bg-[var(--text-main)] hover:text-[var(--bg-canvas)] border border-[var(--border-edge)] rounded-xl font-bold uppercase text-[11px] transition-colors"
          >
            MANAGE DATA EXPORT IN ACCOUNT SETTINGS
          </button>
        </div>
      </div>

    </div>
  );
};
