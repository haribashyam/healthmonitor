import React, { useState } from 'react';
import {
  Check,
  Zap,
  Shield,
  CreditCard,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Award,
  Activity,
  Heart,
  ChevronDown,
  ChevronUp,
  Clock,
  ShieldCheck,
  FileText,
  DollarSign,
  Layers,
  Smartphone
} from 'lucide-react';

interface PricingViewProps {
  onSelectPlan?: (planId: string) => void;
  onOpenAuth?: (mode: 'login' | 'register') => void;
  onNavigateTab?: (tab: string) => void;
}

export const PricingView: React.FC<PricingViewProps> = ({
  onSelectPlan,
  onOpenAuth,
  onNavigateTab
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [selectedPlanModal, setSelectedPlanModal] = useState<string | null>(null);

  // ROI Calculator states
  const [clinicVisitsPerYear, setClinicVisitsPerYear] = useState(3);
  const [labTestsPerYear, setLabTestsPerYear] = useState(2);
  const [wearablesCount, setWearablesCount] = useState(2);

  const estimatedSavedAnnualCost = Math.round(
    clinicVisitsPerYear * 180 + labTestsPerYear * 220 + wearablesCount * 60
  );

  const tiers = [
    {
      id: 'free',
      name: 'DAILY DISPATCH',
      subtitle: 'Essential biometric overview & basic morning trend wire',
      monthlyPrice: 0,
      annualPrice: 0,
      badge: 'FREE FOREVER',
      ctaText: 'GET STARTED FREE',
      ctaHighlight: false,
      features: [
        'Daily morning vital score calculation',
        'Single wearable connection (Bluetooth HR or Apple Health)',
        'Basic 7-day retrospective timeline',
        'Standard newsprint health summary',
        'Community social challenges & leaderboards',
        'Standard email support (48-hour SLA)'
      ],
      omitted: [
        'Real-time continuous 1Hz BLE streaming',
        'AI Diagnostics & Adaptive Copilot',
        'Unlimited Clinical Lab OCR ingestion',
        'Doctor-facing Clinical PDF dossier generator',
        'Google Workspace (Sheets/Calendar/Gmail) live sync',
        'HIPAA Business Associate Agreement (BAA)'
      ]
    },
    {
      id: 'pro',
      name: 'VITALSYNC PRO',
      subtitle: 'Complete telemetric suite for serious athletes & biohackers',
      monthlyPrice: 29,
      annualPrice: 24, // $288 billed annually (save 20%)
      badge: 'MOST POPULAR • 30-DAY TRIAL',
      ctaText: 'START 30-DAY FREE TRIAL',
      ctaHighlight: true,
      features: [
        'All Daily Dispatch features included',
        'Continuous 1Hz BLE telemetry streaming (Polar, Garmin, Apple Watch, Oura)',
        'Gemini-powered 24/7 AI Health Copilot & adaptive training plans',
        'Unlimited Clinical Lab Report OCR & biomarker differential analysis',
        'WhatChanged™ overnight root-cause diagnostics engine',
        'Google Workspace bi-directional sync (Drive, Calendar, Sheets, Tasks)',
        'Digital Twin & 6-Axis Physiological Radar modeling',
        'Custom biomarker tracking & 1RM strength matrix',
        'Priority concierge support (< 4-hour SLA)'
      ],
      omitted: [
        'Multi-patient / athlete clinical EHR panel',
        'HIPAA Business Associate Agreement (BAA) signing'
      ]
    },
    {
      id: 'clinical',
      name: 'CLINICAL PRO SUITE',
      subtitle: 'Hospital-grade oversight for clinicians, sports scientists & MDs',
      monthlyPrice: 79,
      annualPrice: 64, // $768 billed annually
      badge: 'CLINICIAN READY',
      ctaText: 'ACTIVATE CLINICAL SUITE',
      ctaHighlight: false,
      features: [
        'All VitalSync Pro features included',
        'Multi-patient EHR panel with real-time patient status flags',
        'CLIA/CAP calibrated clinical PDF export with doctor signatures',
        'Longitudinal laboratory trend curves & custom reference ranges',
        'HIPAA BAA signed agreement & dedicated audit compliance logs',
        'Raw CSV/JSON telemetry telemetry export API access',
        'EHR integration hooks (FHIR / HL7 standard bridges)',
        '24/7 Clinical concierge hotline & onboarding specialist'
      ],
      omitted: []
    },
    {
      id: 'enterprise',
      name: 'ENTERPRISE LAB',
      subtitle: 'Custom cloud clusters for research institutions & Olympic squads',
      monthlyPrice: null,
      annualPrice: null,
      badge: 'CUSTOM DEPLOYMENT',
      ctaText: 'CONTACT ENTERPRISE DESK',
      ctaHighlight: false,
      features: [
        'Dedicated isolated Firestore & PostgreSQL relational cluster',
        'Custom physiological AI model fine-tuning & local weights',
        'Custom single sign-on (SSO / SAML 2.0 / Okta / Azure AD)',
        'Institutional BAA & 99.99% uptime financial SLA guarantee',
        'Unlimited clinician and athlete seats',
        'Dedicated Solutions Architect & 1-on-1 biometrics training',
        'On-premise / hybrid cloud container deployment options'
      ],
      omitted: []
    }
  ];

  const comparisonCategories = [
    {
      category: 'Telemetry & Ingestion',
      rows: [
        { name: 'Wearable Connections', free: '1 Device', pro: 'Unlimited Multi-Device', clinical: 'Unlimited Multi-Device', ent: 'Custom API Feeds' },
        { name: 'Live 1Hz Bluetooth Streaming', free: '—', pro: '✓ Included', clinical: '✓ Included', ent: '✓ Included' },
        { name: 'Historical Telemetry Retention', free: '30 Days', pro: 'Unlimited Lifetime', clinical: 'Unlimited Lifetime', ent: 'Unlimited / Encrypted' },
        { name: 'Clinical Lab OCR Ingestion', free: '1 Report / mo', pro: 'Unlimited', clinical: 'Unlimited + Batch', ent: 'Automated Lab Feed' }
      ]
    },
    {
      category: 'AI & Analytical Intelligence',
      rows: [
        { name: 'AI Health Copilot (Gemini Pro)', free: 'Basic Queries', pro: 'Full Adaptive Copilot', clinical: 'Clinical Diagnostics', ent: 'Custom Models' },
        { name: 'WhatChanged™ Overnight Diagnostics', free: '—', pro: '✓ Daily', clinical: '✓ Daily', ent: '✓ Continuous' },
        { name: 'Digital Twin Radar Modeling', free: '—', pro: '✓ Included', clinical: '✓ Included', ent: '✓ Advanced Biomechanics' },
        { name: 'What-If Simulation Engine', free: '—', pro: '✓ Included', clinical: '✓ Included', ent: '✓ Included' }
      ]
    },
    {
      category: 'Clinical & Medical Integrations',
      rows: [
        { name: 'Doctor Clinical PDF Export', free: 'Watermarked', pro: 'Standard High-Res', clinical: 'CLIA Verified + Sign-off', ent: 'White-Labeled' },
        { name: 'Multi-Patient EHR Portal', free: '—', pro: '—', clinical: '✓ Up to 100 Patients', ent: 'Unlimited Patients' },
        { name: 'Google Workspace Cloud Sync', free: '—', pro: '✓ Full Suite', clinical: '✓ Full Suite', ent: '✓ Enterprise IAM' },
        { name: 'HIPAA BAA & SOC 2 Compliance', free: 'Standard', pro: 'Standard', clinical: '✓ BAA Signed', ent: '✓ Custom Legal BAA' }
      ]
    }
  ];

  const faqs = [
    {
      q: 'Can I use HSA or FSA funds to pay for VitalSync Pro or Clinical Suite?',
      a: 'Yes! VitalSync meets the criteria for biometric health monitoring and preventive health tracking under most HSA and FSA plans. You will receive an itemized receipt with medical diagnostic codes (CPT/ICD-10 category) upon subscription confirmation.'
    },
    {
      q: 'How does the 30-Day Free Pro Trial work?',
      a: 'You can test the entire VitalSync Pro feature suite free for 30 days. No mandatory credit card lock-in is required for basic setup. If you choose to upgrade, you will not be billed until day 31, and you can cancel anytime with one click.'
    },
    {
      q: 'Does VitalSync sell or monetize my physiological telemetry?',
      a: 'Never. Under our strict Zero Data-Brokerage Charter, all biomarker, heart rate, sleep, and lab data remains your private sovereign property. We never sell, rent, or share personal health telemetry with advertisers, insurers, or data brokers.'
    },
    {
      q: 'What hardware devices and clinical labs are compatible?',
      a: 'VitalSync natively integrates with Apple Watch Ultra, Oura Ring Gen 3/4, Whoop 4.0, Garmin Connect, Polar H10, Eight Sleep, Dexcom G7/Stelo CGM, Abbott Freestyle Libre, and standard PDF lab panels from Quest Diagnostics, LabCorp, and Function Health.'
    },
    {
      q: 'What if I need to cancel or pause my membership?',
      a: 'You can cancel or pause your subscription at any time directly from the Account Settings & Billing desk. Your telemetry history will remain securely archived in your encrypted partition.'
    }
  ];

  const handlePlanCta = (tier: any) => {
    if (tier.id === 'enterprise') {
      if (onNavigateTab) onNavigateTab('contact');
      return;
    }
    if (onOpenAuth) {
      onOpenAuth('register');
    }
  };

  return (
    <div
      style={{ background: 'linear-gradient(180deg, #D4D8DC 0%, #7D8288 45%, #23272A 100%)' }}
      className="p-4 sm:p-8 rounded-3xl border border-white/30 shadow-2xl space-y-12 animate-fadeIn text-slate-900 font-mono text-xs shadow-black/80"
    >
      
      {/* 1. Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4 pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 text-white rounded-full font-bold text-[11px] uppercase tracking-wider shadow-sm">
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span>TRANSPARENT COMMERCIAL PRICING • ZERO DATA BROKERAGE</span>
        </div>
        
        <h1 className="font-serif font-black text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-slate-950 drop-shadow-sm">
          INVEST IN BIOMETRIC TRUTH
        </h1>
        
        <p className="text-xs sm:text-sm text-slate-800 leading-relaxed max-w-2xl mx-auto font-sans font-medium">
          Whether you are an individual athlete tuning for personal bests or a clinician supervising Olympic squads, VitalSync provides hospital-grade physiological intelligence.
        </p>


        {/* Monthly / Annual Toggle Switch */}
        <div className="flex items-center justify-center gap-4 pt-4">
          <span className={`text-xs font-bold uppercase ${billingCycle === 'monthly' ? 'text-[var(--text-main)]' : 'text-[var(--text-muted)]'}`}>
            MONTHLY BILLING
          </span>
          <button
            onClick={() => setBillingCycle(b => b === 'monthly' ? 'annual' : 'monthly')}
            className="w-14 h-7 bg-[var(--bg-card-alt)] border border-[var(--border-edge)] rounded-full p-1 relative transition-colors"
            title="Toggle annual discount"
          >
            <div
              className={`w-5 h-5 bg-[#CC0000] rounded-full transition-transform ${
                billingCycle === 'annual' ? 'translate-x-7' : 'translate-x-0'
              }`}
            />
          </button>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold uppercase ${billingCycle === 'annual' ? 'text-[var(--text-main)]' : 'text-[var(--text-muted)]'}`}>
              ANNUAL BILLING
            </span>
            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded text-[10px] font-bold uppercase">
              SAVE 20% + 2 MO FREE
            </span>
          </div>
        </div>
      </div>

      {/* 2. Pricing Tiers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {tiers.map((tier) => {
          const price = billingCycle === 'annual' ? tier.annualPrice : tier.monthlyPrice;
          const isHighlight = tier.ctaHighlight;

          return (
            <div
              key={tier.id}
              className={`relative rounded-2xl border p-6 flex flex-col justify-between transition-all bg-[var(--bg-card)] ${
                isHighlight
                  ? 'border-[var(--editorial-red)] shadow-xl ring-2 ring-[var(--editorial-red)]/20'
                  : 'border-[var(--border-edge)] hover:border-[var(--text-main)]'
              }`}
            >
              {/* Badge */}
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border-edge)]">
                <span className="font-serif font-black text-base uppercase text-[var(--text-main)]">
                  {tier.name}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                    isHighlight
                      ? 'bg-[var(--editorial-red)] text-white'
                      : 'bg-[var(--bg-card-alt)] text-[var(--text-muted)] border border-[var(--border-edge)]'
                  }`}
                >
                  {tier.badge}
                </span>
              </div>

              {/* Pricing Display */}
              <div className="py-5 space-y-1">
                {price !== null ? (
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-serif font-black text-[var(--text-main)]">
                      ${price}
                    </span>
                    <span className="text-xs text-[var(--text-muted)] font-mono">
                      / month {billingCycle === 'annual' && '(billed annually)'}
                    </span>
                  </div>
                ) : (
                  <div className="text-2xl sm:text-3xl font-serif font-black text-[var(--text-main)]">
                    CUSTOM QUOTE
                  </div>
                )}
                <p className="text-[11px] text-[var(--text-muted)] font-sans leading-relaxed pt-1">
                  {tier.subtitle}
                </p>
              </div>

              {/* CTA Button */}
              <button
                onClick={() => handlePlanCta(tier)}
                className={`w-full py-3 rounded-xl font-bold uppercase tracking-wider text-xs transition-colors flex items-center justify-center gap-2 mb-6 ${
                  isHighlight
                    ? 'bg-[var(--editorial-red)] hover:bg-[var(--editorial-red)]/90 text-white shadow-lg shadow-[var(--editorial-red)]/20'
                    : 'bg-[var(--text-main)] text-[var(--bg-canvas)] hover:opacity-90'
                }`}
              >
                <span>{tier.ctaText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {/* Feature Checklist */}
              <div className="space-y-3 pt-4 border-t border-[var(--border-edge)] flex-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] block">
                  INCLUDED CAPABILITIES
                </span>
                <ul className="space-y-2.5">
                  {tier.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-[11px] leading-tight">
                      <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span className="text-[var(--text-main)]">{feat}</span>
                    </li>
                  ))}
                  {tier.omitted.map((omit, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-[11px] leading-tight opacity-40">
                      <span className="text-[var(--text-dim)] flex-shrink-0">—</span>
                      <span className="text-[var(--text-muted)] line-through">{omit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Interactive Health & Financial ROI Calculator */}
      <div className="max-w-4xl mx-auto p-6 sm:p-8 bg-[var(--bg-card)] border border-[var(--border-edge)] rounded-2xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[var(--border-edge)] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-black text-lg sm:text-xl uppercase text-[var(--text-main)]">
                HEALTH SPAN &amp; COST RECOVERY CALCULATOR
              </h2>
              <p className="text-[11px] text-[var(--text-muted)]">
                Quantify your annual savings on unnecessary clinic visits and duplicate lab orders
              </p>
            </div>
          </div>
          <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-xs font-mono">
            EST. SAVINGS: ${estimatedSavedAnnualCost} / YR
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase text-[var(--text-muted)] block">
              Annual Clinic Visits: <strong className="text-[var(--text-main)]">{clinicVisitsPerYear}</strong>
            </label>
            <input
              type="range"
              min="0"
              max="10"
              value={clinicVisitsPerYear}
              onChange={(e) => setClinicVisitsPerYear(Number(e.target.value))}
              className="w-full accent-[#CC0000]"
            />
            <span className="text-[10px] text-[var(--text-dim)]">Avg. co-pay + specialist time ($180/visit)</span>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase text-[var(--text-muted)] block">
              Blood / Lab Panels: <strong className="text-[var(--text-main)]">{labTestsPerYear}</strong>
            </label>
            <input
              type="range"
              min="1"
              max="8"
              value={labTestsPerYear}
              onChange={(e) => setLabTestsPerYear(Number(e.target.value))}
              className="w-full accent-[#CC0000]"
            />
            <span className="text-[10px] text-[var(--text-dim)]">Prevent duplicate blood draws ($220/panel)</span>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase text-[var(--text-muted)] block">
              Connected Wearables: <strong className="text-[var(--text-main)]">{wearablesCount}</strong>
            </label>
            <input
              type="range"
              min="1"
              max="6"
              value={wearablesCount}
              onChange={(e) => setWearablesCount(Number(e.target.value))}
              className="w-full accent-[#CC0000]"
            />
            <span className="text-[10px] text-[var(--text-dim)]">Consolidated app subscription savings</span>
          </div>
        </div>
      </div>

      {/* 4. Deep Feature Comparison Table */}
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="text-center space-y-1 pb-4">
          <h2 className="font-serif font-black text-2xl uppercase tracking-tight text-[var(--text-main)]">
            COMPLETE FEATURE MATRIX
          </h2>
          <p className="text-xs text-[var(--text-muted)]">
            Side-by-side technical specification across membership tiers
          </p>
        </div>

        <div className="overflow-x-auto border border-[var(--border-edge)] rounded-2xl bg-[var(--bg-card)]">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[var(--border-edge)] bg-[var(--bg-card-alt)]">
                <th className="p-4 font-bold uppercase text-[var(--text-muted)]">FEATURE CAPABILITY</th>
                <th className="p-4 font-bold uppercase text-[var(--text-muted)]">DAILY DISPATCH</th>
                <th className="p-4 font-bold uppercase text-[#CC0000]">VITALSYNC PRO</th>
                <th className="p-4 font-bold uppercase text-[var(--text-muted)]">CLINICAL SUITE</th>
                <th className="p-4 font-bold uppercase text-[var(--text-muted)]">ENTERPRISE</th>
              </tr>
            </thead>
            <tbody>
              {comparisonCategories.map((cat, cIdx) => (
                <React.Fragment key={cIdx}>
                  <tr className="bg-[var(--bg-card-contrast)] border-b border-[var(--border-edge)]">
                    <td colSpan={5} className="p-3 font-serif font-black uppercase text-[var(--text-main)] text-xs">
                      {cat.category}
                    </td>
                  </tr>
                  {cat.rows.map((row, rIdx) => (
                    <tr key={rIdx} className="border-b border-[var(--border-edge)] hover:bg-[var(--bg-card-alt)] transition-colors">
                      <td className="p-4 font-bold text-[var(--text-main)]">{row.name}</td>
                      <td className="p-4 text-[var(--text-muted)]">{row.free}</td>
                      <td className="p-4 font-bold text-[#CC0000]">{row.pro}</td>
                      <td className="p-4 text-[var(--text-main)]">{row.clinical}</td>
                      <td className="p-4 text-[var(--text-muted)]">{row.ent}</td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Frequently Asked Questions Accordion */}
      <div className="max-w-4xl mx-auto space-y-4 pt-6">
        <div className="text-center space-y-1 pb-4">
          <h2 className="font-serif font-black text-2xl uppercase tracking-tight text-[var(--text-main)]">
            FREQUENTLY ASKED QUESTIONS
          </h2>
          <p className="text-xs text-[var(--text-muted)]">
            Everything you need to know about subscriptions, HSA/FSA eligibility, and data privacy
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="border border-[var(--border-edge)] rounded-xl bg-[var(--bg-card)] overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 hover:bg-[var(--bg-card-alt)] transition-colors"
                >
                  <span className="font-bold text-xs text-[var(--text-main)]">{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#CC0000] flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[var(--text-dim)] flex-shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="p-4 pt-0 text-[11px] text-[var(--text-muted)] leading-relaxed font-sans border-t border-[var(--border-edge)] bg-[var(--bg-card-alt)]">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. Institutional / Enterprise Banner */}
      <div className="max-w-4xl mx-auto p-8 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-edge)] text-center space-y-4 shadow-md">
        <div className="w-12 h-12 rounded-2xl bg-[#CC0000]/10 text-[#CC0000] border border-[#CC0000]/20 flex items-center justify-center mx-auto">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h3 className="font-serif font-black text-xl uppercase text-[var(--text-main)]">
          NEED CLINICAL TRIAL OR TEAM LICENSING?
        </h3>
        <p className="text-xs text-[var(--text-muted)] max-w-xl mx-auto font-sans">
          We provision custom HIPAA BAA agreements, isolated Cloud SQL / Firestore database partitions, and dedicated clinical support for research institutions, sports academies, and executive wellness programs.
        </p>
        <button
          onClick={() => {
            if (onNavigateTab) onNavigateTab('contact');
          }}
          className="px-6 py-3 bg-[var(--text-main)] text-[var(--bg-canvas)] hover:opacity-90 rounded-xl font-bold uppercase tracking-wider text-xs transition-opacity"
        >
          CONTACT CLINICAL CONCIERGE DESK
        </button>
      </div>

    </div>
  );
};
