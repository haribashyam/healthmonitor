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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn font-mono">
      <div className="relative w-full max-w-3xl bg-[var(--bg-card)] border-2 border-[var(--border-edge)] text-[var(--text-main)] shadow-2xl overflow-hidden my-8 transition-colors">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--border-edge)] bg-[var(--bg-card-alt)]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#CC0000] text-white border border-[#CC0000] flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-black uppercase tracking-tight text-[var(--text-main)] flex items-center gap-2">
                Patient Privacy, Trust &amp; Access Controls
              </h2>
              <p className="text-xs text-[var(--text-muted)] font-sans">
                You own 100% of your health data. Control doctor access, granular sharing, or delete all records at any time.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-edge)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-contrast)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">

          {/* Section 1: Who can see my data? */}
          <div className="p-4 bg-[var(--bg-card-alt)] border border-[var(--border-edge)] space-y-3 font-mono">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-main)] flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#CC0000]" />
              Who can see my data?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-[var(--bg-card)] border border-[var(--border-subtle)]">
                <div className="font-bold text-[var(--text-main)] flex items-center gap-1.5 mb-1 uppercase text-[11px]">
                  <span className="w-2 h-2 bg-emerald-500" />
                  You (Patient)
                </div>
                <p className="text-[var(--text-muted)] text-[11px] font-sans leading-relaxed">Full ownership and access to every biometric stream, history, and AI insights.</p>
              </div>
              <div className="p-3 bg-[var(--bg-card)] border border-[var(--border-subtle)]">
                <div className="font-bold text-[var(--text-main)] flex items-center gap-1.5 mb-1 uppercase text-[11px]">
                  <span className={`w-2 h-2 ${trustSettings.doctorAccessEnabled ? 'bg-[#CC0000]' : 'bg-[var(--text-dim)]'}`} />
                  Your Doctor ({trustSettings.doctorAccessEnabled ? 'Active' : 'Disabled'})
                </div>
                <p className="text-[var(--text-muted)] text-[11px] font-sans leading-relaxed">Only categories you explicitly share below. Access can be revoked instantly.</p>
              </div>
              <div className="p-3 bg-[var(--bg-card)] border border-[var(--border-subtle)]">
                <div className="font-bold text-[var(--text-main)] flex items-center gap-1.5 mb-1 uppercase text-[11px]">
                  <span className="w-2 h-2 bg-rose-500" />
                  Third Parties &amp; Ads (None)
                </div>
                <p className="text-[var(--text-muted)] text-[11px] font-sans leading-relaxed">Zero third-party trackers, zero data selling, and strict HIPAA/GDPR safeguards.</p>
              </div>
            </div>
          </div>

          {/* Section 2: Doctor Access Toggle */}
          <div className="p-5 bg-[var(--bg-card-alt)] border border-[var(--border-edge)] space-y-4 font-mono">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-[#CC0000] text-white border border-[#CC0000] flex-shrink-0 mt-0.5">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold uppercase tracking-tight text-[var(--text-main)]">
                      Clinician EHR Portal Sync
                    </h4>
                    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${
                      trustSettings.doctorAccessEnabled
                        ? 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30'
                        : 'bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border-subtle)]'
                    }`}>
                      {trustSettings.doctorAccessEnabled ? 'Access Granted' : 'Access Revoked'}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-main)] mt-1 font-sans">
                    Linked Physician: <strong className="text-[var(--text-main)] font-mono">{trustSettings.doctorName}</strong> (NPI: {trustSettings.doctorNpi}) • {trustSettings.clinicName}
                  </p>
                  <p className="text-[11px] text-[var(--text-muted)] mt-0.5 font-sans">
                    When enabled, Dr. Jenkins can view your clinical summary in the Clinician Portal under BAA compliance.
                  </p>
                </div>
              </div>

              {/* Toggle Switch */}
              <button
                id="doctor-access-toggle"
                onClick={() => setTrustSettings(prev => ({ ...prev, doctorAccessEnabled: !prev.doctorAccessEnabled }))}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer border-2 transition-colors duration-200 ease-in-out focus:outline-none ${
                  trustSettings.doctorAccessEnabled ? 'bg-[#CC0000] border-[#CC0000]' : 'bg-[var(--bg-card-contrast)] border-[var(--border-edge)]'
                }`}
                role="switch"
                aria-checked={trustSettings.doctorAccessEnabled}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    trustSettings.doctorAccessEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Granular per-category sharing controls */}
            {trustSettings.doctorAccessEnabled && (
              <div className="pt-3 border-t border-[var(--border-subtle)] space-y-2.5">
                <div className="flex items-center justify-between text-xs text-[var(--text-muted)] mb-2">
                  <span className="font-bold uppercase tracking-wider text-[var(--text-main)]">Granular Category Permissions for Doctor:</span>
                  <span className="font-mono text-[#CC0000]">{trustSettings.categories.filter(c => c.isShared).length} of {trustSettings.categories.length} Shared</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {trustSettings.categories.map((cat, idx) => (
                    <div
                      key={cat.category}
                      onClick={() => toggleCategory(idx)}
                      className={`p-3 border cursor-pointer transition-all flex items-start justify-between gap-3 ${
                        cat.isShared
                          ? 'bg-[var(--bg-card)] border-[var(--border-edge)] border-l-4 border-l-[#CC0000]'
                          : 'bg-[var(--bg-card-contrast)] border-[var(--border-subtle)] opacity-60 hover:opacity-100'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[var(--text-main)] uppercase">{cat.label}</span>
                          {cat.sensitivityLevel === 'strictly_confidential' && (
                            <span className="text-[9px] px-1.5 py-0.2 bg-rose-500/20 text-rose-500 border border-rose-500/30 uppercase font-bold">
                              Private
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[var(--text-muted)] mt-0.5 leading-snug font-sans">{cat.description}</p>
                      </div>

                      <div className={`p-1 ${cat.isShared ? 'text-[#CC0000]' : 'text-[var(--text-dim)]'}`}>
                        {cat.isShared ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Data Export & Archiving */}
          <div className="p-4 bg-[var(--bg-card-alt)] border border-[var(--border-edge)] space-y-3 font-mono">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-main)] flex items-center gap-2">
                  <Download className="w-4 h-4 text-emerald-500" />
                  Full Data Export &amp; Portability
                </h4>
                <p className="text-xs text-[var(--text-muted)] mt-0.5 font-sans">
                  Export all your historical workouts, lab results, sleep stages, and telemetry into standard formats.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                id="export-json-btn"
                onClick={() => handleExportAllData('json')}
                disabled={isExporting}
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold uppercase bg-[var(--bg-card)] hover:bg-[var(--bg-card-contrast)] text-[var(--text-main)] border border-[var(--border-edge)] transition-all"
              >
                <FileJson className="w-4 h-4 text-[#CC0000]" />
                {isExporting ? 'Packaging Archive...' : 'Download Full JSON Archive'}
              </button>

              <button
                id="export-csv-btn"
                onClick={() => handleExportAllData('csv')}
                disabled={isExporting}
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold uppercase bg-[var(--bg-card)] hover:bg-[var(--bg-card-contrast)] text-[var(--text-main)] border border-[var(--border-edge)] transition-all"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                Download Spreadsheet (CSV)
              </button>

              {exportSuccess && (
                <span className="text-xs text-emerald-500 flex items-center gap-1 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  Full data archive downloaded successfully!
                </span>
              )}
            </div>
          </div>

          {/* Section 4: Full Account & Data Deletion */}
          <div className="p-4 bg-rose-950/20 border border-rose-900/40 space-y-3 font-mono">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-rose-500/10 text-rose-500 border border-rose-500/30 mt-0.5 flex-shrink-0">
                <Trash2 className="w-4 h-4" />
              </div>
              <div className="space-y-1 flex-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-500">
                  Delete All Health Data &amp; Close Account
                </h4>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed font-sans">
                  Permanently erase all your telemetry, connected sources, lab records, AI plans, and doctor sharing links. This action is irreversible.
                </p>

                {!showDeleteConfirm ? (
                  <button
                    id="trigger-delete-account-btn"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase bg-rose-500/20 text-rose-500 hover:bg-rose-500/30 border border-rose-500/40 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Request Complete Data Deletion
                  </button>
                ) : (
                  <div className="mt-3 p-3.5 bg-[var(--bg-card)] border border-rose-500/40 space-y-2.5 animate-fadeIn">
                    <p className="text-xs text-rose-500 font-bold uppercase flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                      Type <span className="underline font-mono text-[var(--text-main)]">DELETE</span> below to confirm total purge:
                    </p>
                    <input
                      type="text"
                      value={deleteInputText}
                      onChange={(e) => setDeleteInputText(e.target.value)}
                      placeholder="Type DELETE"
                      className="w-full px-3 py-1.5 text-xs bg-[var(--bg-card-alt)] border border-rose-500/50 text-[var(--text-main)] font-mono placeholder:text-[var(--text-dim)] focus:outline-none focus:border-rose-400"
                    />
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        id="confirm-purge-btn"
                        disabled={deleteInputText !== 'DELETE'}
                        onClick={() => {
                          onConfirmAccountDeletion();
                          onClose();
                        }}
                        className={`px-3 py-1.5 text-xs font-bold uppercase transition-all ${
                          deleteInputText === 'DELETE'
                            ? 'bg-[#CC0000] hover:bg-red-700 text-white border border-[#CC0000]'
                            : 'bg-[var(--bg-card-alt)] text-[var(--text-dim)] border border-[var(--border-subtle)] cursor-not-allowed'
                        }`}
                      >
                        Permanently Purge Everything
                      </button>
                      <button
                        onClick={() => {
                          setShowDeleteConfirm(false);
                          setDeleteInputText('');
                        }}
                        className="px-3 py-1.5 text-xs font-bold uppercase text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-edge)] bg-[var(--bg-card-alt)]"
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
        <div className="flex items-center justify-between px-6 py-4 border-t border-[var(--border-edge)] bg-[var(--bg-card-alt)] font-mono">
          <div className="text-[11px] text-[var(--text-muted)] flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#CC0000]" />
            Last audited: {new Date().toLocaleDateString()} • HIPAA &amp; GDPR Certified
          </div>
          <div className="flex items-center gap-3">
            {saveSuccess && (
              <span className="text-xs text-emerald-500 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Preferences saved!
              </span>
            )}
            <button
              onClick={handleSaveSettings}
              className="px-4 py-2 text-xs font-bold uppercase bg-[#CC0000] hover:bg-red-700 text-white border border-[#CC0000] transition-all"
            >
              Save Preferences
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
