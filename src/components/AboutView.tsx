import React from 'react';
import {
  Award,
  ShieldCheck,
  Activity,
  Heart,
  BookOpen,
  CheckCircle2,
  Users,
  Compass,
  FileText,
  Sparkles,
  MapPin,
  Lock,
  Globe
} from 'lucide-react';

interface AboutViewProps {
  onNavigateTab?: (tab: string) => void;
  onOpenDoctorReport?: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onNavigateTab, onOpenDoctorReport }) => {
  const leadership = [
    {
      name: 'Dr. Elena Rostova, MD, PhD',
      role: 'Chief Medical Officer & Clinical Chair',
      affiliation: 'Formerly Johns Hopkins Medicine • Stanford Longevity Fellow',
      bio: 'Board-certified cardiologist specializing in cardiorespiratory endurance, continuous autonomic monitoring, and longitudinal biomarker modeling.',
      focus: 'Autonomic HRV & Biomarker Precision'
    },
    {
      name: 'Marcus Vance, MS, CSCS*D',
      role: 'Director of Human Performance & Telemetry',
      affiliation: 'US Olympic Training Center Consultant • Ex-Garmin Science',
      bio: 'Pioneered 1Hz high-frequency Bluetooth telemetry pipelines and multi-sensor algorithmic fusion across wearable hardware.',
      focus: 'High-Frequency Sensor Ingestion'
    },
    {
      name: 'Dr. Sophia Chen, PhD, FACSM',
      role: 'Head of Metabolic & Circadian Research',
      affiliation: 'Harvard T.H. Chan School of Public Health',
      bio: 'Author of 40+ peer-reviewed papers on glucose variability, metabolic flexibility, and environmental circadian chronobiology.',
      focus: 'Circadian AQI & Metabolic DEXA'
    }
  ];

  const pillars = [
    {
      title: 'Zero Data Brokerage',
      desc: 'We never sell, rent, or syndicate physiological data to third parties, health insurers, or advertisers. Your telemetry remains your private sovereign record.'
    },
    {
      title: 'CLIA & CAP Lab Precision',
      desc: 'All lab ingestion and OCR extraction pipelines are calibrated to CLIA (Clinical Laboratory Improvement Amendments) and CAP diagnostic reference standards.'
    },
    {
      title: 'Continuous Autonomic Truth',
      desc: 'We prioritize raw, unfiltered 1Hz electrical and optical telemetry over proprietary black-box scoring algorithms.'
    },
    {
      title: 'Actionable Clinical Utility',
      desc: 'Every vital signal, biomarker shift, and adaptive plan is structured for direct clinical handoff to primary physicians and sports medicine doctors.'
    }
  ];

  const globalHubs = [
    { city: 'New York', role: 'Global Editorial & Clinical Operations', address: '450 Lexington Ave, New York, NY 10017' },
    { city: 'Zurich', role: 'Bio-Telemetry Research & European Cloud Cluster', address: 'Gotthardstrasse 26, 8002 Zürich, Switzerland' },
    { city: 'Tokyo', role: 'Asia-Pacific Sensor Integration Center', address: 'Roppongi Hills Mori Tower, Minato City, Tokyo' }
  ];

  return (
    <div
      style={{ background: 'linear-gradient(180deg, #D4D8DC 0%, #7D8288 45%, #23272A 100%)' }}
      className="p-4 sm:p-8 rounded-3xl border border-white/30 shadow-2xl space-y-12 animate-fadeIn text-slate-900 font-mono text-xs max-w-5xl mx-auto shadow-black/80"
    >
      
      {/* 1. Masthead Header */}
      <div className="border-b border-slate-600/30 pb-8 text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 text-white rounded-full text-xs font-bold uppercase shadow-sm">
          <BookOpen className="w-3.5 h-3.5 text-amber-400" />
          <span>EDITORIAL &amp; SCIENTIFIC CHARTER</span>
        </div>

        <h1 className="font-serif font-black text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-slate-950 drop-shadow-sm">
          THE VITALSYNC MANIFESTO
        </h1>

        <p className="text-xs sm:text-sm text-slate-800 font-sans max-w-2xl mx-auto leading-relaxed font-medium">
          Founded on the conviction that human health should be documented with the journalistic rigor of a daily publication and the forensic precision of a clinical laboratory.
        </p>
      </div>

      {/* 2. The Core Origin Story & Philosophy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white/70 border border-white/40 rounded-2xl p-6 sm:p-8 backdrop-blur-md text-slate-900 shadow-md">
        <div className="space-y-4 font-sans text-slate-800 text-xs sm:text-sm leading-relaxed">
          <h2 className="font-serif font-black text-xl uppercase tracking-tight text-slate-950 font-mono">
            BRIDGING CONSUMER TELEMETRY &amp; CLINICAL RIGOR
          </h2>
          <p>
            For decades, consumer wearables gave users vague 'readiness scores' without actionable medical context, while clinical medicine relied on annual blood tests that provided single snapshots months too late.
          </p>
          <p>
            <strong className="text-slate-950 font-bold">VitalSync was created to eliminate this divide.</strong> By marrying continuous 1Hz optical/electrical telemetry with deep clinical lab panels (ApoB, hs-CRP, VO2 Max, HbA1c), we deliver an uncompromised, longitudinal chronicle of personal vitality.
          </p>
          <div className="pt-2 flex items-center gap-4 text-xs font-mono font-bold text-[#CC0000]">
            <span>PULITZER-CALIBER INTEGRITY</span>
            <span>•</span>
            <span>CLINICIAN-GRADE PROOF</span>
          </div>
        </div>


        <div className="p-6 bg-[var(--bg-card-alt)] border border-[var(--border-edge)] rounded-xl space-y-4 font-mono text-xs">
          <span className="font-bold text-xs uppercase text-[var(--text-main)] block border-b border-[var(--border-edge)] pb-2">
            THE 5 PILLARS OF BIOMETRIC INTEGRITY
          </span>
          <div className="space-y-3">
            {pillars.map((p, idx) => (
              <div key={idx} className="space-y-1">
                <span className="font-bold text-[var(--text-main)] flex items-center gap-1.5 text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#CC0000]" />
                  {p.title}
                </span>
                <p className="text-[11px] text-[var(--text-muted)] font-sans leading-normal pl-5">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Scientific Advisory Board & Medical Directors */}
      <div className="space-y-6">
        <div className="border-b border-[var(--border-edge)] pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#CC0000]" />
            <h2 className="font-serif font-black text-xl uppercase text-[var(--text-main)]">
              SCIENTIFIC ADVISORY COUNCIL &amp; CLINICAL BOARD
            </h2>
          </div>
          <span className="text-[10px] text-[var(--text-muted)] uppercase">BOARD OF DIRECTORS</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {leadership.map((leader, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-edge)] space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-[var(--bg-card-alt)] border border-[var(--border-edge)] flex items-center justify-center font-bold text-sm text-[var(--text-main)] font-serif">
                  {leader.name.charAt(4)}
                </div>
                <h3 className="font-bold text-sm text-[var(--text-main)] font-serif">
                  {leader.name}
                </h3>
                <span className="text-[10px] font-bold text-[#CC0000] block uppercase">
                  {leader.role}
                </span>
                <span className="text-[10px] text-[var(--text-dim)] block font-sans italic">
                  {leader.affiliation}
                </span>
                <p className="text-[11px] text-[var(--text-muted)] font-sans leading-relaxed pt-1">
                  {leader.bio}
                </p>
              </div>

              <div className="pt-3 border-t border-[var(--border-edge)] text-[10px] text-[var(--text-main)] font-bold">
                FOCUS: {leader.focus}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Global Operations Hubs */}
      <div className="space-y-4">
        <div className="border-b border-[var(--border-edge)] pb-2 flex items-center gap-2">
          <Globe className="w-4 h-4 text-[#CC0000]" />
          <h2 className="font-serif font-black text-lg uppercase text-[var(--text-main)]">
            GLOBAL EDITORIAL &amp; BIO-TELEMETRY HUBS
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {globalHubs.map((hub, idx) => (
            <div key={idx} className="p-4 bg-[var(--bg-card)] border border-[var(--border-edge)] rounded-xl space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-serif font-bold text-sm text-[var(--text-main)] uppercase">{hub.city}</span>
                <span className="text-[10px] font-bold text-[#CC0000]">ACTIVE NODE</span>
              </div>
              <span className="text-[10px] text-[var(--text-muted)] block">{hub.role}</span>
              <span className="text-[10px] text-[var(--text-dim)] block font-mono">{hub.address}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Medical Disclaimer Card */}
      <div className="p-6 bg-[var(--bg-card-alt)] border border-[var(--border-edge)] rounded-2xl text-[11px] text-[var(--text-muted)] leading-relaxed font-sans space-y-2">
        <span className="font-bold text-xs uppercase text-[var(--text-main)] font-mono block">
          IMPORTANT CLINICAL &amp; EDITORIAL DISCLAIMER
        </span>
        <p>
          VitalSync is a biometric intelligence, continuous recording, and health optimization platform. While calibrated to clinical diagnostic references, information provided by VitalSync does not constitute formal medical diagnosis, treatment, or emergency triage. Users experiencing acute chest discomfort, shortness of breath, or emergency symptoms must contact local emergency medical services immediately.
        </p>
      </div>

    </div>
  );
};
