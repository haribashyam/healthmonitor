import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Stethoscope,
  Trash2,
  Download,
  CheckCircle2,
  AlertTriangle,
  X,
  Eye,
  EyeOff,
  UserCheck,
  RefreshCw,
  FileSpreadsheet,
  FileJson,
  Info,
  Clock
} from 'lucide-react';
import { PatientTrustSettings } from '../../types';

interface PatientTrustModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmAccountDeletion: () => void;
}

export const PatientTrustModal: React.FC<PatientTrustModalProps> = ({
  isOpen,
  onClose,
  onConfirmAccountDeletion
}) => {
  const [trustSettings, setTrustSettings] = useState<PatientTrustSettings>({
    doctorAccessEnabled: true,
    doctorName: 'Dr. Sarah Jenkins, MD',
    doctorNpi: '1982740192',
    clinicName: 'St. Jude Center for Integrative Cardiology',
    allowHistoricalSync: true,
    canRevokeAnytime: true,
    categories: [
      {
        category: 'cardiovascular',
        label: 'Cardiovascular & Vitals',
        description: 'Resting HR, blood pressure readings, HRV trend, and SpO2',
        isShared: true,
        sensitivityLevel: 'standard'
      },
      {
        category: 'biomarkers',
        label: 'Lab Biomarkers & Panels',
        description: 'Lipid subfractions, HbA1c, fasting insulin, hs-CRP, and hormone panels',
        isShared: true,
        sensitivityLevel: 'sensitive'
      },
      {
        category: 'sleep',
        label: 'Sleep Architecture & Apnea Index',
        description: 'Sleep stages, deep sleep duration, and nocturnal respiratory rate',
        isShared: true,
        sensitivityLevel: 'standard'
      },
      {
        category: 'activity',
        label: 'Workout & Activity Logs',
        description: 'Zone 2 aerobic minutes, weekly training volume, and strength logs',
        isShared: true,
        sensitivityLevel: 'standard'
      },
      {
        category: 'nutrition',
        label: 'Nutrition & Supplement Logs',
        description: 'Macronutrient targets, caloric balance, and active supplement stack',
        isShared: false,
        sensitivityLevel: 'standard'
      },
      {
        category: 'gps_location',
        label: 'Exact GPS Workout Routes',
        description: 'Outdoor cycling and running route map coordinates',
        isShared: false,
        sensitivityLevel: 'strictly_confidential'
      }
    ]
  });

  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteInputText, setDeleteInputText] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const toggleCategory = (index: number) => {
    setTrustSettings(prev => {
      const newCats = [...prev.categories];
      newCats[index] = { ...newCats[index], isShared: !newCats[index].isShared };
      return { ...prev, categories: newCats };
    });
  };

  const handleSaveSettings = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleExportAllData = (format: 'json' | 'csv') => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setExportSuccess(true);
      
      // Generate synthetic patient export bundle
      const exportData = {
        patient: 'Alex Vance',
        dob: '1990-05-14',
        exportTimestamp: new Date().toISOString(),
        format,
        connectedSources: ['Apple Health', 'Garmin Connect', 'Oura Ring Gen 3', 'Whoop 4.0', 'Dexcom G7'],
        totalRecords: 14820,
        sharingSettings: trustSettings
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `vitalsync_full_archive_${Date.now()}.${format === 'json' ? 'json' : 'csv'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setTimeout(() => setExportSuccess(false), 3500);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Patient Privacy, Trust & Access Controls
              </h2>
              <p className="text-xs text-slate-400">
                You own 100% of your health data. Control doctor access, granular sharing, or delete all records at any time.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">

          {/* Section 1: Who can see my data? */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Lock className="w-4 h-4 text-cyan-400" />
              Who can see my data?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800/80">
                <div className="font-semibold text-white flex items-center gap-1.5 mb-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  You (Patient)
                </div>
                <p className="text-slate-400 leading-relaxed">Full ownership and access to every biometric stream, history, and AI insights.</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800/80">
                <div className="font-semibold text-white flex items-center gap-1.5 mb-1">
                  <span className={`w-2 h-2 rounded-full ${trustSettings.doctorAccessEnabled ? 'bg-cyan-400' : 'bg-slate-600'}`} />
                  Your Doctor ({trustSettings.doctorAccessEnabled ? 'Active' : 'Disabled'})
                </div>
                <p className="text-slate-400 leading-relaxed">Only categories you explicitly share below. Access can be revoked instantly.</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800/80">
                <div className="font-semibold text-white flex items-center gap-1.5 mb-1">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  Third Parties & Ads (None)
                </div>
                <p className="text-slate-400 leading-relaxed">Zero third-party trackers, zero data selling, and strict HIPAA/GDPR safeguards.</p>
              </div>
            </div>
          </div>

          {/* Section 2: Doctor Access Toggle */}
          <div className="p-5 rounded-xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mt-0.5">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white">
                      Clinician EHR Portal Sync
                    </h4>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      trustSettings.doctorAccessEnabled
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {trustSettings.doctorAccessEnabled ? 'Access Granted' : 'Access Revoked'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    Linked Physician: <strong className="text-white">{trustSettings.doctorName}</strong> (NPI: {trustSettings.doctorNpi}) • {trustSettings.clinicName}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    When enabled, Dr. Jenkins can view your clinical summary in the Clinician Portal under BAA compliance.
                  </p>
                </div>
              </div>

              {/* Toggle Switch */}
              <button
                id="doctor-access-toggle"
                onClick={() => setTrustSettings(prev => ({ ...prev, doctorAccessEnabled: !prev.doctorAccessEnabled }))}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  trustSettings.doctorAccessEnabled ? 'bg-cyan-500' : 'bg-slate-700'
                }`}
                role="switch"
                aria-checked={trustSettings.doctorAccessEnabled}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    trustSettings.doctorAccessEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Granular per-category sharing controls */}
            {trustSettings.doctorAccessEnabled && (
              <div className="pt-3 border-t border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="font-semibold text-slate-300">Granular Category Permissions for Doctor:</span>
                  <span>{trustSettings.categories.filter(c => c.isShared).length} of {trustSettings.categories.length} Shared</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {trustSettings.categories.map((cat, idx) => (
                    <div
                      key={cat.category}
                      onClick={() => toggleCategory(idx)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all flex items-start justify-between gap-3 ${
                        cat.isShared
                          ? 'bg-slate-900/90 border-cyan-500/30 hover:border-cyan-500/60'
                          : 'bg-slate-950/40 border-slate-800/80 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{cat.label}</span>
                          {cat.sensitivityLevel === 'strictly_confidential' && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
                              Private
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{cat.description}</p>
                      </div>

                      <div className={`p-1 rounded ${cat.isShared ? 'text-cyan-400' : 'text-slate-600'}`}>
                        {cat.isShared ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Data Export & Archiving */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Download className="w-4 h-4 text-emerald-400" />
                  Full Data Export & Portability
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Export all your historical workouts, lab results, sleep stages, and telemetry into standard formats.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                id="export-json-btn"
                onClick={() => handleExportAllData('json')}
                disabled={isExporting}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-all"
              >
                <FileJson className="w-4 h-4 text-cyan-400" />
                {isExporting ? 'Packaging Archive...' : 'Download Full JSON Archive'}
              </button>

              <button
                id="export-csv-btn"
                onClick={() => handleExportAllData('csv')}
                disabled={isExporting}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-all"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                Download Spreadsheet (CSV)
              </button>

              {exportSuccess && (
                <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  Full data archive downloaded successfully!
                </span>
              )}
            </div>
          </div>

          {/* Section 4: Full Account & Data Deletion */}
          <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/40 space-y-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 mt-0.5">
                <Trash2 className="w-4 h-4" />
              </div>
              <div className="space-y-1 flex-1">
                <h4 className="text-sm font-bold text-rose-300">
                  Delete All Health Data & Close Account
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Permanently erase all your telemetry, connected sources, lab records, AI plans, and doctor sharing links. This action is irreversible.
                </p>

                {!showDeleteConfirm ? (
                  <button
                    id="trigger-delete-account-btn"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/40 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Request Complete Data Deletion
                  </button>
                ) : (
                  <div className="mt-3 p-3.5 rounded-lg bg-slate-950 border border-rose-500/40 space-y-2.5 animate-fadeIn">
                    <p className="text-xs text-rose-300 font-semibold flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                      Type <span className="underline font-mono text-white">DELETE</span> below to confirm total purge:
                    </p>
                    <input
                      type="text"
                      value={deleteInputText}
                      onChange={(e) => setDeleteInputText(e.target.value)}
                      placeholder="Type DELETE"
                      className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-rose-500/50 rounded text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-rose-400"
                    />
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        id="confirm-purge-btn"
                        disabled={deleteInputText !== 'DELETE'}
                        onClick={() => {
                          onConfirmAccountDeletion();
                          onClose();
                        }}
                        className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${
                          deleteInputText === 'DELETE'
                            ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30'
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        Permanently Purge Everything
                      </button>
                      <button
                        onClick={() => {
                          setShowDeleteConfirm(false);
                          setDeleteInputText('');
                        }}
                        className="px-3 py-1.5 rounded text-xs text-slate-400 hover:text-white"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-900/90">
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            Last audited: {new Date().toLocaleDateString()} • HIPAA & GDPR Certified
          </div>
          <div className="flex items-center gap-3">
            {saveSuccess && (
              <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Preferences saved!
              </span>
            )}
            <button
              onClick={handleSaveSettings}
              className="px-4 py-2 rounded-lg text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-md shadow-cyan-500/20 transition-all"
            >
              Save Preferences
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
