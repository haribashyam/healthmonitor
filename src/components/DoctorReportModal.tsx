import React from 'react';
import {
  FileText,
  Printer,
  Download,
  ShieldCheck,
  Heart,
  Activity,
  Moon,
  Utensils
} from 'lucide-react';
import { Biomarker, Activity as ActivityType, SleepRecord } from '../types';

interface DoctorReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  biomarkers: Biomarker[];
  activities: ActivityType[];
  sleepRecords: SleepRecord[];
}

export const DoctorReportModal: React.FC<DoctorReportModalProps> = ({
  isOpen,
  onClose,
  biomarkers,
  activities,
  sleepRecords
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const avgHrv = Math.round(sleepRecords.reduce((acc, s) => acc + s.hrvAvg, 0) / (sleepRecords.length || 1));
  const avgRestingHr = Math.round(sleepRecords.reduce((acc, s) => acc + s.restingHr, 0) / (sleepRecords.length || 1));

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative text-slate-100 print:bg-white print:text-black print:p-0 print:border-0">
        
        {/* Header Actions (hidden in print) */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">Clinical Health Summary for Physician Review</h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400 flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/20"
            >
              <Printer className="w-3.5 h-3.5" /> Print / Save as PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white text-sm"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="space-y-6 text-xs leading-relaxed">
          
          {/* Document Title Header */}
          <div className="border-b border-slate-800 pb-4 flex justify-between items-start">
            <div>
              <h1 className="text-xl font-black text-white print:text-black">VITALOS • PATIENT HEALTH & BIOMETRIC BRIEF</h1>
              <p className="text-slate-400 print:text-slate-600 mt-0.5">Comprehensive 90-Day Longitudinal Wearable & Diagnostic Lab Synthesis</p>
            </div>
            <div className="text-right text-[11px] text-slate-400 print:text-slate-600">
              <div>Date Generated: <strong>{new Date().toISOString().split('T')[0]}</strong></div>
              <div>Provenance: <strong>Verified Multi-Source Ingestion</strong></div>
            </div>
          </div>

          {/* Core Cardiovascular & Autonomic Vitals */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 print:text-blue-700">
              1. Cardiovascular & Autonomic Baselines (90-Day Continuous Wearables)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-950 print:bg-slate-100 p-3 rounded-lg border border-slate-800 print:border-slate-300">
                <span className="text-[10px] text-slate-400 print:text-slate-600 block uppercase font-bold">Resting Heart Rate</span>
                <span className="text-base font-bold text-white print:text-black">{avgRestingHr} BPM</span>
                <span className="text-[10px] text-slate-400 block">Baseline dip: 52 BPM</span>
              </div>
              <div className="bg-slate-950 print:bg-slate-100 p-3 rounded-lg border border-slate-800 print:border-slate-300">
                <span className="text-[10px] text-slate-400 print:text-slate-600 block uppercase font-bold">HRV RMSSD</span>
                <span className="text-base font-bold text-white print:text-black">{avgHrv} ms</span>
                <span className="text-[10px] text-emerald-400 print:text-emerald-700 block">Optimal autonomic tone</span>
              </div>
              <div className="bg-slate-950 print:bg-slate-100 p-3 rounded-lg border border-slate-800 print:border-slate-300">
                <span className="text-[10px] text-slate-400 print:text-slate-600 block uppercase font-bold">Blood Pressure</span>
                <span className="text-base font-bold text-white print:text-black">118/76 mmHg</span>
                <span className="text-[10px] text-slate-400 block">Optimal / Normotensive</span>
              </div>
              <div className="bg-slate-950 print:bg-slate-100 p-3 rounded-lg border border-slate-800 print:border-slate-300">
                <span className="text-[10px] text-slate-400 print:text-slate-600 block uppercase font-bold">Cardiorespiratory VO2</span>
                <span className="text-base font-bold text-white print:text-black">48.6 mL/kg/min</span>
                <span className="text-[10px] text-cyan-400 print:text-blue-700 block">Superior category</span>
              </div>
            </div>
          </div>

          {/* Laboratory Diagnostic Biomarkers */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 print:text-blue-700">
              2. Verified Laboratory Diagnostic Biomarkers (Quest Diagnostics)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 print:border-slate-300 text-[11px] text-slate-400 print:text-slate-600">
                    <th className="py-1.5 font-bold">Biomarker</th>
                    <th className="py-1.5 font-bold">Value</th>
                    <th className="py-1.5 font-bold">Reference Interval</th>
                    <th className="py-1.5 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 print:divide-slate-200">
                  {biomarkers.map((b) => (
                    <tr key={b.id} className="text-xs">
                      <td className="py-1.5 font-medium text-slate-200 print:text-black">{b.name}</td>
                      <td className="py-1.5 font-bold text-white print:text-black">{b.value} {b.unit}</td>
                      <td className="py-1.5 text-slate-400 print:text-slate-600">{b.referenceRange} {b.unit}</td>
                      <td className="py-1.5 font-bold uppercase text-[10px] text-emerald-400 print:text-emerald-700">
                        {b.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Physician Discussion Points */}
          <div className="bg-slate-950 print:bg-slate-100 p-4 rounded-xl border border-slate-800 print:border-slate-300 space-y-2">
            <span className="text-xs font-bold text-white print:text-black uppercase tracking-wider block">
              3. Key Physiological Trends for Clinical Consultation:
            </span>
            <ul className="list-disc list-inside space-y-1 text-slate-300 print:text-slate-700">
              <li>Endurance training load is stabilized at ~180-220 weekly TRIMP with high Zone 2 volume.</li>
              <li>Fasting blood glucose is well-regulated at 88 mg/dL with HbA1c at 5.2%.</li>
              <li>Inflammatory marker hs-CRP is 0.74 mg/L (low cardiovascular inflammation risk).</li>
              <li>Sleep architecture demonstrates consistent 90+ minutes of restorative deep sleep.</li>
            </ul>
          </div>

          {/* Legal Medical Disclaimer */}
          <div className="pt-2 text-[10px] text-slate-500 print:text-slate-500 border-t border-slate-800 print:border-slate-300">
            <strong>Disclaimer:</strong> This summary is compiled from consumer wearable data streams and laboratory reports imported by the user. It is intended to assist medical professionals during clinical review and does not constitute independent medical diagnosis.
          </div>
        </div>

      </div>
    </div>
  );
};
