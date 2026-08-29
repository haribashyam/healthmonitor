import React, { useState } from 'react';
import {
  ShieldAlert,
  Users,
  QrCode,
  Heart,
  Phone,
  AlertCircle,
  CheckCircle2,
  Lock,
  Plus,
  ChevronRight,
  Sparkles,
  Pill,
  UserCheck
} from 'lucide-react';
import { EmergencyHealthCard, CaregiverProfile } from '../types';

const INITIAL_EMERGENCY_CARD: EmergencyHealthCard = {
  fullName: 'Alexander Vance',
  dob: '1989-04-12 (Age 37)',
  bloodType: 'O+',
  criticalAllergies: ['Penicillin (Anaphylactic risk)', 'Shellfish'],
  chronicConditions: ['Exercise-Induced Bronchospasm (Mild)', 'No Cardiovascular Disease'],
  activeMedications: ['Albuterol Sulfate Inhaler 90mcg (PRN)', 'Daily Magnesium Glycinate 400mg', 'Vitamin D3 5000 IU'],
  emergencyContacts: [
    { name: 'Elena Vance', relation: 'Spouse', phone: '+1 (555) 839-2041' },
    { name: 'Marcus Vance', relation: 'Brother', phone: '+1 (555) 712-9930' }
  ],
  primaryDoctor: {
    name: 'Dr. Sarah Jenkins, MD, FACC',
    clinic: 'Stanford Health Care Cardiology',
    phone: '+1 (555) 498-6000'
  },
  organDonorStatus: true,
  notes: 'Wears continuous biometric cardiac sensor. High aerobic baseline.',
  qrPayload: 'EMERGENCY-MEDICAL-ID: VANCE, ALEXANDER | BLOOD: O+ | ALLERGIES: PENICILLIN | CONTACT: +15558392041'
};

const INITIAL_PROFILES: CaregiverProfile[] = [
  {
    id: 'prof-self',
    name: 'Alexander Vance (You)',
    role: 'Self',
    avatarColor: 'bg-cyan-500',
    vitalScore: 84,
    unreadAlertsCount: 1,
    medicationAdherencePct: 96,
    emergencyContact: '+1 (555) 839-2041',
    lastActive: 'Just now'
  },
  {
    id: 'prof-mother',
    name: 'Eleanor Vance (Mother, 71)',
    role: 'Elderly Parent',
    avatarColor: 'bg-purple-500',
    vitalScore: 78,
    unreadAlertsCount: 0,
    medicationAdherencePct: 100,
    emergencyContact: '+1 (555) 839-2041',
    lastActive: '12 mins ago (Apple Watch Sync)'
  },
  {
    id: 'prof-child',
    name: 'Leo Vance (Son, 9)',
    role: 'Child',
    avatarColor: 'bg-emerald-500',
    vitalScore: 92,
    unreadAlertsCount: 0,
    medicationAdherencePct: 100,
    emergencyContact: '+1 (555) 839-2041',
    lastActive: '1 hour ago (Garmin Jr)'
  }
];

export const FamilyEmergencyCareView: React.FC = () => {
  const [card, setCard] = useState<EmergencyHealthCard>(INITIAL_EMERGENCY_CARD);
  const [profiles, setProfiles] = useState<CaregiverProfile[]>(INITIAL_PROFILES);
  const [activeProfileId, setActiveProfileId] = useState<string>('prof-self');
  const [showQrModal, setShowQrModal] = useState<boolean>(false);

  const activeProfile = profiles.find(p => p.id === activeProfileId) || profiles[0];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-red-950/70 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/30 mb-2">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Systems 43 & 44 • Family / Caregiver Mode & Emergency Health Profile Card</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              Emergency Card & Caregiver Hub
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Maintain instant lockscreen-accessible medical cards with blood type, anaphylaxis alerts, and physician contacts. Switch between dependent and parent health dashboards.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowQrModal(true)}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/30 flex items-center gap-2 transition-all"
            >
              <QrCode className="w-4 h-4" />
              Emergency QR Card
            </button>
          </div>
        </div>
      </div>

      {/* Caregiver Multi-Profile Switcher (System 43) */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-cyan-400" />
            Family & Dependent Caregiver Switcher ({profiles.length})
          </h3>
          <span className="text-xs text-slate-400">Strict Role-Based Data Isolation Active</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {profiles.map(prof => (
            <div
              key={prof.id}
              onClick={() => setActiveProfileId(prof.id)}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                activeProfileId === prof.id
                  ? 'bg-red-950/20 border-red-500/50 shadow-md shadow-red-500/10'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${prof.avatarColor} text-white font-bold flex items-center justify-center text-sm shadow-md`}>
                  {prof.name.charAt(0)}
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">{prof.name}</span>
                  <span className="text-[11px] text-slate-400">{prof.role}</span>
                </div>
              </div>

              <div className="text-right font-mono">
                <span className="text-xs font-bold text-emerald-400 block">{prof.vitalScore} VitalScore</span>
                <span className="text-[10px] text-slate-500">{prof.lastActive}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Medical Card Display (System 44) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 8 Cols: Medical Emergency Card */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-red-500/20 text-red-400 border border-red-500/30">
                  Universal Emergency Medical ID
                </span>
                {card.organDonorStatus && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-400">
                    Organ Donor ✓
                  </span>
                )}
              </div>
              <h2 className="text-2xl font-black text-white mt-1">{card.fullName}</h2>
              <span className="text-xs text-slate-400 font-mono">DOB: {card.dob}</span>
            </div>

            <div className="p-3 rounded-2xl bg-red-950/40 border-2 border-red-500/60 text-center min-w-[90px] shadow-sm">
              <span className="text-[10px] text-red-400 uppercase font-mono font-bold block">Blood Type</span>
              <span className="text-3xl font-black font-mono text-red-500">{card.bloodType}</span>
            </div>
          </div>

          {/* Critical Allergies & Conditions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-red-950/40 border border-red-600/50 space-y-2">
              <span className="text-xs font-bold text-red-400 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-red-500" />
                Critical Allergies & Anaphylaxis Risk
              </span>
              <div className="space-y-1">
                {card.criticalAllergies.map((all, idx) => (
                  <div key={idx} className="text-xs text-white font-medium flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    {all}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-cyan-400" />
                Medical Conditions & Notes
              </span>
              <div className="space-y-1">
                {card.chronicConditions.map((cond, idx) => (
                  <div key={idx} className="text-xs text-slate-300 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    {cond}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Active Medications List */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Pill className="w-4 h-4 text-teal-400" />
              Active Daily & Emergency Medications
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {card.activeMedications.map((med, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200">
                  {med}
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Contacts & Physician */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400 block">Emergency Contacts (Next of Kin)</span>
              {card.emergencyContacts.map((c, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white block">{c.name} ({c.relation})</span>
                    <span className="text-slate-400 font-mono">{c.phone}</span>
                  </div>
                  <a
                    href={`tel:${c.phone}`}
                    className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400 block">Primary Care Physician</span>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-white block">{card.primaryDoctor.name}</span>
                  <span className="text-slate-400 block">{card.primaryDoctor.clinic}</span>
                  <span className="text-cyan-400 font-mono">{card.primaryDoctor.phone}</span>
                </div>
                <a
                  href={`tel:${card.primaryDoctor.phone}`}
                  className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30"
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: QR Lockscreen Quick Preview */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4 text-center">
          <h3 className="text-sm font-bold text-white flex items-center justify-center gap-2">
            <QrCode className="w-4 h-4 text-red-400" />
            Lockscreen QR Medical ID
          </h3>
          <p className="text-xs text-slate-400">
            Emergency responders scan this code to access your critical blood group, allergies, and emergency phone numbers instantly without unlocking your device.
          </p>

          <div className="p-6 rounded-2xl bg-white text-slate-950 mx-auto max-w-[200px] shadow-2xl space-y-2">
            {/* Visual SVG QR Code Mockup */}
            <div className="aspect-square flex items-center justify-center">
              <QrCode className="w-36 h-36 text-slate-950" />
            </div>
            <span className="text-[10px] font-bold font-mono uppercase tracking-widest text-slate-800 block">
              SCAN MEDICAL ID
            </span>
          </div>

          <button
            onClick={() => alert('Emergency Medical Card exported to Apple Wallet / Google Wallet pass format.')}
            className="w-full py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-all"
          >
            Add to Apple / Google Wallet
          </button>
        </div>

      </div>
    </div>
  );
};
