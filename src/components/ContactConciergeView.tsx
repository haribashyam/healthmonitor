import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  Globe,
  ShieldAlert,
  MessageSquare,
  Building,
  Headphones,
  RefreshCw,
  Award
} from 'lucide-react';

interface ContactConciergeViewProps {
  onNavigateTab?: (tab: string) => void;
}

export const ContactConciergeView: React.FC<ContactConciergeViewProps> = ({ onNavigateTab }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [inquiryType, setInquiryType] = useState<'clinical' | 'enterprise' | 'support' | 'media' | 'security'>('clinical');
  const [organization, setOrganization] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setErrorMsg('Please complete all required fields.');
      return;
    }
    setErrorMsg(null);
    setIsSubmitting(true);

    // Simulate concierge dispatch
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1200);
  };

  const offices = [
    {
      city: 'New York (Global HQ)',
      address: '450 Lexington Ave, 18th Floor, New York, NY 10017',
      hours: 'Mon – Fri: 08:00 – 19:00 EST',
      phone: '+1 (212) 555-8482',
      email: 'hq@vitalos.health'
    },
    {
      city: 'Zurich (Bio-Telemetry Lab)',
      address: 'Gotthardstrasse 26, 8002 Zürich, Switzerland',
      hours: 'Mon – Fri: 09:00 – 18:00 CET',
      phone: '+41 44 555 1920',
      email: 'zurich@vitalos.health'
    },
    {
      city: 'Singapore (APAC Desk)',
      address: '10 Marina Boulevard, Marina Bay Financial Centre, Singapore',
      hours: 'Mon – Fri: 09:00 – 18:00 SGT',
      phone: '+65 6789 0123',
      email: 'apac@vitalos.health'
    }
  ];

  return (
    <div
      style={{ background: 'linear-gradient(180deg, #D4D8DC 0%, #7D8288 45%, #23272A 100%)' }}
      className="p-4 sm:p-8 rounded-3xl border border-white/30 shadow-2xl space-y-12 animate-fadeIn text-slate-900 font-mono text-xs max-w-5xl mx-auto shadow-black/80"
    >
      
      {/* 1. Header Banner */}
      <div className="border-b border-slate-600/30 pb-8 text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 text-white rounded-full text-xs font-bold uppercase shadow-sm">
          <Headphones className="w-3.5 h-3.5 text-cyan-400" />
          <span>CLINICAL CONCIERGE &amp; ENTERPRISE DESK</span>
        </div>

        <h1 className="font-serif font-black text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-slate-950 drop-shadow-sm">
          DIRECT LINE TO EDITORIAL &amp; CLINICAL TEAMS
        </h1>

        <p className="text-xs sm:text-sm text-slate-800 font-sans max-w-2xl mx-auto leading-relaxed font-medium">
          Whether you need assistance interpreting a biomarker differential, ordering enterprise clinical trials, or securing custom HIPAA BAA terms, our dedicated concierge team is on call.
        </p>
      </div>


      {/* 2. Emergency Medical Disclaimer Ticker */}
      <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-start gap-3 text-rose-400 font-sans text-xs">
        <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold font-mono uppercase tracking-wider block">
            IMPORTANT EMERGENCY TRIAGE NOTICE:
          </strong>
          <span className="text-[11px] leading-relaxed">
            This contact channel is not monitored for acute medical emergencies. If you or someone in your care is experiencing acute chest pain, shortness of breath, sudden numbness, or life-threatening symptoms, immediately dial 911 (US) or your local emergency emergency response service.
          </span>
        </div>
      </div>

      {/* 3. Main Form & Office Hubs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Contact Form */}
        <div className="lg:col-span-7 bg-[var(--bg-card)] border border-[var(--border-edge)] rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-[var(--border-edge)] pb-4 space-y-1">
            <h2 className="font-serif font-black text-xl uppercase text-[var(--text-main)]">
              DISPATCH INQUIRY TO CONCIERGE DESK
            </h2>
            <p className="text-[11px] text-[var(--text-muted)] font-sans">
              All inquiries routed according to clinical priority and enterprise SLA
            </p>
          </div>

          {submitted ? (
            <div className="py-12 text-center space-y-4 animate-scaleUp">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="font-serif font-black text-xl text-[var(--text-main)] uppercase">
                INQUIRY LOGGED &amp; DISPATCHED
              </h3>
              <p className="text-xs text-[var(--text-muted)] max-w-md mx-auto font-sans leading-relaxed">
                Thank you, <strong className="text-[var(--text-main)]">{name}</strong>. Your ticket has been assigned to our clinical concierge team. Expect a response at <strong className="text-[var(--text-main)]">{email}</strong> within 4 business hours.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setName('');
                  setEmail('');
                  setMessage('');
                  setSubject('');
                }}
                className="px-6 py-2.5 bg-[var(--bg-card-alt)] hover:bg-[var(--bg-card-contrast)] text-[var(--text-main)] border border-[var(--border-edge)] rounded-xl font-bold uppercase text-xs"
              >
                SUBMIT ANOTHER INQUIRY
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
              {errorMsg && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Inquiry Type Radio / Buttons */}
              <div className="space-y-1.5">
                <label className="font-bold text-[11px] uppercase text-[var(--text-muted)]">
                  SELECT INQUIRY CATEGORY
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'clinical', label: 'Clinical Concierge' },
                    { id: 'enterprise', label: 'Enterprise / BAA' },
                    { id: 'support', label: 'Hardware Support' },
                    { id: 'media', label: 'Press & Media' },
                    { id: 'security', label: 'Security / Bug Bounty' },
                  ].map(t => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setInquiryType(t.id as any)}
                      className={`p-2.5 rounded-xl border text-left text-[10px] font-bold uppercase transition-colors ${
                        inquiryType === t.id
                          ? 'border-[var(--text-main)] bg-[var(--bg-card-contrast)] text-[var(--text-main)]'
                          : 'border-[var(--border-edge)] bg-[var(--bg-card-alt)] text-[var(--text-muted)]'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-[11px] uppercase text-[var(--text-muted)]">
                    YOUR FULL NAME *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Vance"
                    className="w-full p-3 bg-[var(--bg-card-alt)] border border-[var(--border-edge)] rounded-xl text-[var(--text-main)] placeholder:text-[var(--text-dim)] focus:outline-none focus:border-[var(--text-main)]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[11px] uppercase text-[var(--text-muted)]">
                    WORK / PERSONAL EMAIL *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@example.com"
                    className="w-full p-3 bg-[var(--bg-card-alt)] border border-[var(--border-edge)] rounded-xl text-[var(--text-main)] placeholder:text-[var(--text-dim)] focus:outline-none focus:border-[var(--text-main)]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[11px] uppercase text-[var(--text-muted)]">
                  ORGANIZATION / CLINICAL PRACTICE (OPTIONAL)
                </label>
                <input
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="e.g. Stanford Sports Performance Lab, or Private Athlete"
                  className="w-full p-3 bg-[var(--bg-card-alt)] border border-[var(--border-edge)] rounded-xl text-[var(--text-main)] placeholder:text-[var(--text-dim)] focus:outline-none focus:border-[var(--text-main)]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[11px] uppercase text-[var(--text-muted)]">
                  SUBJECT LINE
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Inquiry regarding multi-patient EHR integration and BAA terms"
                  className="w-full p-3 bg-[var(--bg-card-alt)] border border-[var(--border-edge)] rounded-xl text-[var(--text-main)] placeholder:text-[var(--text-dim)] focus:outline-none focus:border-[var(--text-main)]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[11px] uppercase text-[var(--text-muted)]">
                  DETAILED MESSAGE *
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your inquiry, telemetry needs, or clinical parameters..."
                  className="w-full p-3 bg-[var(--bg-card-alt)] border border-[var(--border-edge)] rounded-xl text-[var(--text-main)] placeholder:text-[var(--text-dim)] focus:outline-none focus:border-[var(--text-main)] font-sans"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-[var(--text-main)] text-[var(--bg-canvas)] hover:opacity-90 rounded-xl font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-opacity disabled:opacity-50"
              >
                {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>{isSubmitting ? 'DISPATCHING INQUIRY...' : 'DISPATCH MESSAGE TO CONCIERGE'}</span>
              </button>
            </form>
          )}
        </div>

        {/* Right: Global Desks & Direct Channels */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[var(--bg-card)] border border-[var(--border-edge)] rounded-2xl p-6 space-y-4">
            <h3 className="font-serif font-black text-lg uppercase text-[var(--text-main)] border-b border-[var(--border-edge)] pb-3">
              DIRECT TELEPHONE &amp; WIRE
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[var(--bg-card-alt)] border border-[var(--border-edge)] text-[#CC0000]">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-xs text-[var(--text-main)] block">Toll-Free Concierge Hotline</span>
                  <span className="text-[11px] text-[var(--text-muted)] font-mono">+1 (800) 848-2597</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[var(--bg-card-alt)] border border-[var(--border-edge)] text-emerald-400">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-xs text-[var(--text-main)] block">Clinical Priority Email</span>
                  <span className="text-[11px] text-[var(--text-muted)] font-mono">concierge@vitalos.health</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[var(--bg-card-alt)] border border-[var(--border-edge)] text-cyan-400">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-xs text-[var(--text-main)] block">Standard Concierge Hours</span>
                  <span className="text-[11px] text-[var(--text-muted)]">24/7 Priority for Clinical Suite</span>
                </div>
              </div>
            </div>
          </div>

          {/* Regional Bureau Offices */}
          <div className="space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] block">
              REGIONAL BUREAUS &amp; CLINICAL LABS
            </span>
            {offices.map((office, idx) => (
              <div
                key={idx}
                className="p-4 bg-[var(--bg-card)] border border-[var(--border-edge)] rounded-xl space-y-1"
              >
                <span className="font-serif font-bold text-xs text-[var(--text-main)] uppercase block">
                  {office.city}
                </span>
                <span className="text-[10px] text-[var(--text-muted)] block font-sans">{office.address}</span>
                <div className="flex items-center justify-between text-[10px] text-[var(--text-dim)] font-mono pt-1">
                  <span>{office.hours}</span>
                  <span className="text-[var(--text-main)]">{office.phone}</span>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
};
