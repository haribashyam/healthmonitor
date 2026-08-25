import React, { useState } from 'react';
import {
  ShieldCheck,
  FileText,
  Lock,
  Cookie,
  RefreshCw,
  Truck,
  RotateCcw,
  AlertTriangle,
  Eye,
  Server,
  FileCheck,
  Award,
  Users,
  Search,
  Printer,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Sliders,
  X
} from 'lucide-react';

export type LegalDocType =
  | 'privacy'
  | 'terms'
  | 'cookie-policy'
  | 'refund'
  | 'cancellation'
  | 'shipping'
  | 'return-exchange'
  | 'disclaimer'
  | 'accessibility'
  | 'dpa'
  | 'acceptable-use'
  | 'security'
  | 'responsible-disclosure'
  | 'community-guidelines';

interface LegalPagesViewProps {
  initialDoc?: LegalDocType;
  onOpenCookiePreferences?: () => void;
}

export const LegalPagesView: React.FC<LegalPagesViewProps> = ({
  initialDoc = 'privacy',
  onOpenCookiePreferences
}) => {
  const [activeDoc, setActiveDoc] = useState<LegalDocType>(initialDoc);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);

  // Cookie Preferences State
  const [cookiePrefs, setCookiePrefs] = useState({
    essential: true, // always required
    analytics: true,
    functional: true,
    advertising: false
  });
  const [prefsSavedMessage, setPrefsSavedMessage] = useState(false);

  const handleSaveCookiePreferences = () => {
    setPrefsSavedMessage(true);
    setTimeout(() => {
      setPrefsSavedMessage(false);
      setShowPreferencesModal(false);
    }, 1200);
  };

  const legalNavItems: { id: LegalDocType; title: string; category: string; icon: any }[] = [
    { id: 'privacy', title: 'Privacy Policy', category: 'Core Compliance', icon: ShieldCheck },
    { id: 'terms', title: 'Terms of Service', category: 'Core Compliance', icon: FileText },
    { id: 'disclaimer', title: 'Medical & AI Disclaimer', category: 'Clinical Safety', icon: AlertTriangle },
    { id: 'cookie-policy', title: 'Cookie Policy', category: 'Data & Tracking', icon: Cookie },
    { id: 'dpa', title: 'Data Processing Agreement (DPA)', category: 'Enterprise & GDPR', icon: Server },
    { id: 'security', title: 'Security & Architecture Policy', category: 'Enterprise & GDPR', icon: Lock },
    { id: 'acceptable-use', title: 'Acceptable Use Policy', category: 'Platform Rules', icon: FileCheck },
    { id: 'responsible-disclosure', title: 'Responsible Disclosure & Bounty', category: 'Security Ops', icon: Award },
    { id: 'community-guidelines', title: 'Community Guidelines', category: 'Platform Rules', icon: Users },
    { id: 'accessibility', title: 'Accessibility Statement (WCAG 2.1)', category: 'Inclusion', icon: Eye },
    { id: 'refund', title: 'Refund Policy', category: 'Commerce & Orders', icon: RotateCcw },
    { id: 'cancellation', title: 'Cancellation Policy', category: 'Commerce & Orders', icon: RefreshCw },
    { id: 'shipping', title: 'Shipping Policy (Sensors & Bands)', category: 'Hardware Logistics', icon: Truck },
    { id: 'return-exchange', title: 'Return & Exchange Policy', category: 'Hardware Logistics', icon: RotateCcw },
  ];

  const filteredNavItems = legalNavItems.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fadeIn text-slate-100">
      
      {/* Header Banner */}
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Legal, Compliance & Trust Center</h1>
              <p className="text-xs text-slate-400">
                Self-sovereign biometric privacy, HIPAA/GDPR standards, hardware logistics, and verified terms.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPreferencesModal(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-950 border border-slate-700 hover:border-cyan-500/50 text-cyan-300 flex items-center gap-2 transition-all shadow-sm"
          >
            <Sliders className="w-3.5 h-3.5" /> Manage Cookie Preferences
          </button>
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-2 transition-all"
          >
            <Printer className="w-3.5 h-3.5" /> Print Document
          </button>
        </div>
      </div>

      {/* Main Grid: Nav Sidebar & Content Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Navigation Sidebar */}
        <div className="lg:col-span-4 bg-slate-900 rounded-2xl p-4 border border-slate-800 space-y-4 shadow-md h-fit">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search legal documents..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-1 max-h-[620px] overflow-y-auto pr-1">
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeDoc === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveDoc(item.id)}
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

        {/* Right Document Content */}
        <div className="lg:col-span-8 bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-md space-y-6 leading-relaxed text-slate-300 text-xs">
          
          {/* Document Header */}
          <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">Official Policy Document</span>
              <h2 className="text-xl font-black text-white mt-0.5">
                {legalNavItems.find((i) => i.id === activeDoc)?.title}
              </h2>
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              Last Updated: August 24, 2026 • Version 3.4
            </div>
          </div>

          {/* Privacy Policy */}
          {activeDoc === 'privacy' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                <strong>Zero-Sale Privacy Guarantee:</strong> VITALOS will never monetize, broker, sell, or license your continuous biometric streams, sleep metrics, or laboratory results to insurance providers, data brokers, or advertisers.
              </div>

              <h3 className="text-sm font-bold text-white uppercase tracking-wider">1. Scope and Covered Biometric Telemetry</h3>
              <p>
                This Privacy Policy describes how VITALOS Inc. ("VITALOS", "we", "our") collects, uses, encrypts, and processes physiological telemetry when you connect consumer wearables (including Apple HealthKit, Oura Ring, Garmin Connect, Whoop, Strava, and Withings) and clinical diagnostic laboratory results.
              </p>

              <h3 className="text-sm font-bold text-white uppercase tracking-wider">2. Zero-Knowledge & Local-First Processing</h3>
              <p>
                Where supported, continuous high-frequency raw ECG and PPG streams are analyzed on-device or via ephemeral, cryptographically isolated server enclaves. We apply AES-256-GCM encryption at rest and TLS 1.3 in transit with per-user data sharding keys.
              </p>

              <h3 className="text-sm font-bold text-white uppercase tracking-wider">3. User Data Rights (GDPR / CCPA / HIPAA BAA)</h3>
              <p>
                You retain full sovereign ownership over your health dossier. At any point, you may:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-2 text-slate-300">
                <li>Export your complete normalized raw telemetry in standard JSON / CSV or HL7 FHIR formats.</li>
                <li>Permanently purge your entire account and synced biometrics with zero retention after 72 hours.</li>
                <li>Revoke individual third-party OAuth integrations without losing historical local records.</li>
              </ul>
            </div>
          )}

          {/* Terms of Service */}
          {activeDoc === 'terms' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">1. Agreement to Terms</h3>
              <p>
                By accessing or using the VITALOS platform, connected hardware sensors, or AI health intelligence tools, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you must terminate your account and discontinue use immediately.
              </p>

              <h3 className="text-sm font-bold text-white uppercase tracking-wider">2. Eligibility & Biometric Consent</h3>
              <p>
                You must be at least 18 years of age (or the age of majority in your jurisdiction) to use VITALOS. You expressly authorize VITALOS to ingest physiological telemetry from authorized integrations on your behalf.
              </p>

              <h3 className="text-sm font-bold text-white uppercase tracking-wider">3. Intellectual Property & AI Models</h3>
              <p>
                All software algorithms, physiological regression models, and digital twin radar architectures are the proprietary property of VITALOS Inc. Your personal health metrics remain your exclusive intellectual property.
              </p>
            </div>
          )}

          {/* Medical & AI Disclaimer */}
          {activeDoc === 'disclaimer' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 space-y-1">
                <span className="font-bold block uppercase text-[11px]">Critical Clinical Notice</span>
                <p>
                  VITALOS IS NOT A LICENSED MEDICAL HEALTHCARE PROVIDER AND DOES NOT OFFER MEDICAL ADVICE, CLINICAL DIAGNOSIS, OR THERAPEUTIC PRESCRIPTION.
                </p>
              </div>

              <h3 className="text-sm font-bold text-white uppercase tracking-wider">1. Informational & Wellness Purpose Only</h3>
              <p>
                All insights generated by VITALOS—including the "Why Am I Different Today?" diagnostic engine, the What-If Lifestyle Simulator, and the Adaptive Workout Split—are intended solely for personal athletic optimization, recovery tracking, and general wellness education.
              </p>

              <h3 className="text-sm font-bold text-white uppercase tracking-wider">2. Emergency Medical Situations</h3>
              <p>
                If you suspect you are experiencing an acute cardiovascular event, stroke, severe arrhythmia, hypoglycemia, or any medical emergency, call your local emergency services (e.g. 911 or 112) immediately. Never ignore professional clinical guidance based on wearable sensor algorithms.
              </p>

              <h3 className="text-sm font-bold text-white uppercase tracking-wider">3. AI Probabilistic Nature</h3>
              <p>
                Our AI models (including Gemini-powered OCR and multivariable simulations) synthesize complex physiological relationships. While trained on sports science and clinical endocrinology literature, outputs are probabilistic and may contain edge-case discrepancies.
              </p>
            </div>
          )}

          {/* Cookie Policy */}
          {activeDoc === 'cookie-policy' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">1. What Are Cookies and Local Storage?</h3>
              <p>
                VITALOS utilizes HTTP cookies, session tokens, and HTML5 Web Storage (localStorage/IndexedDB) to maintain secure authenticated sessions, persist your dark-mode preference, and store encrypted offline telemetry caches.
              </p>

              <h3 className="text-sm font-bold text-white uppercase tracking-wider">2. Categories of Cookies We Use</h3>
              <div className="space-y-2">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="font-bold text-white block">Strictly Essential Cookies:</span>
                  <span className="text-slate-400">Required for authentication token exchange, CSRF protection, and Bluetooth socket state. Cannot be disabled.</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="font-bold text-white block">Functional & Performance Cookies:</span>
                  <span className="text-slate-400">Retains UI layout preferences, selected heart rate zones, and simulator baseline configurations.</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="font-bold text-white block">Anonymous Telemetry & Crash Reporting:</span>
                  <span className="text-slate-400">Collects aggregated latency statistics on Web Bluetooth packet dropping without associating personal identity.</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setShowPreferencesModal(true)}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
                >
                  Configure Cookie Preferences Now
                </button>
              </div>
            </div>
          )}

          {/* Data Processing Agreement (DPA) */}
          {activeDoc === 'dpa' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">1. Data Processing Addendum (DPA)</h3>
              <p>
                This Data Processing Agreement ("DPA") supplements the VITALOS Enterprise & Team Agreement when enterprise sports teams, coaching clinics, or clinical researchers process user health data subject to GDPR (Article 28) or CCPA/CPRA.
              </p>

              <h3 className="text-sm font-bold text-white uppercase tracking-wider">2. Roles of the Parties</h3>
              <p>
                The Customer acts as the Data Controller, and VITALOS Inc. acts as the Data Processor. VITALOS processes health data solely on documented instructions from the Controller.
              </p>

              <h3 className="text-sm font-bold text-white uppercase tracking-wider">3. Technical and Organizational Security Measures (TOMs)</h3>
              <ul className="list-disc list-inside space-y-1 pl-2 text-slate-300">
                <li>SOC 2 Type II certified infrastructure with continuous vulnerability scanning.</li>
                <li>End-to-end transport layer encryption with TLS 1.3 and forward secrecy.</li>
                <li>Strict Role-Based Access Control (RBAC) with MFA enforced across all internal staff.</li>
                <li>Formal sub-processor audit log available upon written request.</li>
              </ul>
            </div>
          )}

          {/* Security Policy */}
          {activeDoc === 'security' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">1. Defense-in-Depth Security Framework</h3>
              <p>
                VITALOS is engineered from the ground up for high-sensitivity physiological data protection. We implement zero-trust network boundaries, automated container isolation, and rigorous secret management.
              </p>

              <h3 className="text-sm font-bold text-white uppercase tracking-wider">2. Encryption Standards</h3>
              <p>
                All data stores (PostgreSQL / Firestore) utilize AES-256 block-level encryption with Google Cloud Key Management Service (KMS) annual key rotation. In-flight API queries are strictly forced to HTTPS with HSTS preloaded headers.
              </p>

              <h3 className="text-sm font-bold text-white uppercase tracking-wider">3. Independent Penetration Testing</h3>
              <p>
                Annual third-party black-box and white-box penetration testing is performed by accredited security audit firms. Executive summaries are available to Enterprise customers under NDA.
              </p>
            </div>
          )}

          {/* Acceptable Use Policy */}
          {activeDoc === 'acceptable-use' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">1. Purpose and Scope</h3>
              <p>
                This Acceptable Use Policy specifies prohibited activities when utilizing the VITALOS API, Web Bluetooth ingestion bridges, and community leaderboards.
              </p>

              <h3 className="text-sm font-bold text-white uppercase tracking-wider">2. Prohibited Activities</h3>
              <ul className="list-disc list-inside space-y-1 pl-2 text-slate-300">
                <li>Automated spoofing, fabricating, or forging synthetic biometrics to manipulate insurance rebates or competitive challenges.</li>
                <li>Attempting to reverse-engineer, decompile, or extract proprietary physiological neural weights.</li>
                <li>Executing denial-of-service (DoS) or rate-limit saturation attacks against VITALOS endpoints.</li>
                <li>Uploading malicious payloads or weaponized PDF/TIFF lab reports into the OCR parser.</li>
              </ul>
            </div>
          )}

          {/* Responsible Disclosure */}
          {activeDoc === 'responsible-disclosure' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">1. Bug Bounty & Vulnerability Disclosure Program</h3>
              <p>
                We welcome reports from independent security researchers and ethical hackers. If you discover a security vulnerability in any VITALOS domain, API, or connected firmware, please report it responsibly.
              </p>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-cyan-300">
                Contact: security@vitalos.health • PGP Key ID: 0x9B4E21FC7A82
              </div>

              <h3 className="text-sm font-bold text-white uppercase tracking-wider">2. Safe Harbor Commitment</h3>
              <p>
                We will not initiate legal action against researchers who adhere to good-faith security research, avoid privacy violations, do not destroy data, and provide reasonable time for remediation prior to public disclosure.
              </p>
            </div>
          )}

          {/* Community Guidelines */}
          {activeDoc === 'community-guidelines' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">1. Athlete & Biohacker Community Standards</h3>
              <p>
                VITALOS features community streak leaderboards, verified training protocol sharing, and recovery discussions. Our platform is built on mutual respect, scientific integrity, and constructive peer support.
              </p>

              <h3 className="text-sm font-bold text-white uppercase tracking-wider">2. Harassment & Toxicity Zero-Tolerance</h3>
              <p>
                Body shaming, harassment, promotion of dangerous starvation diets, prescription drug trafficking, or unverified medical cure-alls will result in immediate permanent account termination.
              </p>
            </div>
          )}

          {/* Accessibility Statement */}
          {activeDoc === 'accessibility' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">1. Commitment to Digital Accessibility</h3>
              <p>
                VITALOS is dedicated to ensuring digital accessibility for individuals with disabilities. We actively conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA specifications.
              </p>

              <h3 className="text-sm font-bold text-white uppercase tracking-wider">2. Implemented Accessibility Features</h3>
              <ul className="list-disc list-inside space-y-1 pl-2 text-slate-300">
                <li>High-contrast visual palettes with minimum 4.5:1 text-to-background contrast ratios.</li>
                <li>Full keyboard navigation across all menus, interactive radar charts, and data tables.</li>
                <li>Semantic HTML elements with explicit ARIA roles and labels for screen readers.</li>
                <li>Support for reduced-motion operating system preferences during live pulse animations.</li>
              </ul>
            </div>
          )}

          {/* Refund Policy */}
          {activeDoc === 'refund' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">1. 30-Day Money-Back Guarantee (Software Subscriptions)</h3>
              <p>
                We want you to be completely satisfied with VITALOS Pro and Clinical plans. If you are not satisfied within your first 30 days of subscribing, contact billing@vitalos.health for a 100% full refund with no questions asked.
              </p>

              <h3 className="text-sm font-bold text-white uppercase tracking-wider">2. Hardware Sensor Refunds</h3>
              <p>
                Hardware sensors (such as the VITALOS Continuous ECG Chest Strap or Sensor Band) are eligible for a full refund within 30 days of delivery when returned in original condition with all accessories.
              </p>
            </div>
          )}

          {/* Cancellation Policy */}
          {activeDoc === 'cancellation' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">1. Instant Self-Serve Cancellation</h3>
              <p>
                You can cancel your subscription at any time directly from the Account & Billing settings page with one click. We never require phone calls or complicated cancellation hoops.
              </p>

              <h3 className="text-sm font-bold text-white uppercase tracking-wider">2. Access Until End of Billing Cycle</h3>
              <p>
                Upon cancellation, you will continue to enjoy uninterrupted access to all Pro analytics, Gemini AI chat, and continuous sync until your current prepaid billing cycle concludes.
              </p>
            </div>
          )}

          {/* Shipping Policy */}
          {activeDoc === 'shipping' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">1. Hardware Sensor Delivery & Fulfillment</h3>
              <p>
                All VITALOS hardware items (ECG bands, blood-oxygen sensors, charging docks) are fulfilled from our certified logistics centers within 24–48 hours of order confirmation.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="font-bold text-white block">Domestic US Shipping</span>
                  <span className="text-slate-400">2–4 business days via FedEx / UPS Priority. Free on all Pro annual memberships.</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="font-bold text-white block">International Express</span>
                  <span className="text-slate-400">5–8 business days with duty-paid tracking across 120+ supported countries.</span>
                </div>
              </div>
            </div>
          )}

          {/* Return & Exchange Policy */}
          {activeDoc === 'return-exchange' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">1. Sensor Wear Trial & Hassle-Free Returns</h3>
              <p>
                We offer a 30-day wear trial on all sensor bands. If the sizing or fit is unsuitable, we provide prepaid exchange labels for alternative strap sizes at zero extra cost.
              </p>

              <h3 className="text-sm font-bold text-white uppercase tracking-wider">2. 2-Year Hardware Manufacturer Warranty</h3>
              <p>
                All VITALOS hardware carries a comprehensive 2-year warranty covering manufacturing defects, Bluetooth radio failure, and battery degradation exceeding normal specifications.
              </p>
            </div>
          )}

        </div>

      </div>

      {/* Interactive Cookie Preferences Modal */}
      {showPreferencesModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative text-slate-100 animate-scaleUp">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  <Cookie className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Cookie & Tracking Preferences</h2>
                  <p className="text-xs text-slate-400">Manage how VITALOS stores data in your browser</p>
                </div>
              </div>

              <button
                onClick={() => setShowPreferencesModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              
              {/* Essential */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">Strictly Necessary</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold uppercase">Always Active</span>
                  </div>
                  <p className="text-slate-400">Essential for authentication, secure BLE socket transport, and encrypted session state.</p>
                </div>
                <input type="checkbox" checked disabled className="accent-cyan-500 mt-1 cursor-not-allowed" />
              </div>

              {/* Performance */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className="font-bold text-white">Performance & Simulator Cache</span>
                  <p className="text-slate-400">Stores pre-computed multivariable physiological regressions in local memory for instant rendering.</p>
                </div>
                <input
                  type="checkbox"
                  checked={cookiePrefs.functional}
                  onChange={(e) => setCookiePrefs({ ...cookiePrefs, functional: e.target.checked })}
                  className="accent-cyan-500 mt-1 cursor-pointer w-4 h-4"
                />
              </div>

              {/* Analytics */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className="font-bold text-white">Anonymous Telemetry Diagnostics</span>
                  <p className="text-slate-400">Helps us detect dropped Bluetooth packets and improve OCR parser accuracy without identifying you.</p>
                </div>
                <input
                  type="checkbox"
                  checked={cookiePrefs.analytics}
                  onChange={(e) => setCookiePrefs({ ...cookiePrefs, analytics: e.target.checked })}
                  className="accent-cyan-500 mt-1 cursor-pointer w-4 h-4"
                />
              </div>

              {/* Advertising */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-start justify-between gap-4 opacity-75">
                <div className="space-y-1">
                  <span className="font-bold text-white">Targeted Advertising & Commercial Trackers</span>
                  <p className="text-slate-400">VITALOS maintains a zero-advertising policy. No third-party ad pixels or tracking beacons are permitted.</p>
                </div>
                <input type="checkbox" checked={false} disabled className="accent-cyan-500 mt-1 cursor-not-allowed" />
              </div>

            </div>

            {prefsSavedMessage && (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs text-center font-bold flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Preferences saved and applied to current session!
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowPreferencesModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCookiePreferences}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20 transition-all"
              >
                Save Preferences
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
