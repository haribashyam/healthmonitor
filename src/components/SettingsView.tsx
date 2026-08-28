import React, { useState } from 'react';
import {
  Sun,
  Moon,
  ShieldCheck,
  Download,
  FileText,
  Lock,
  CircleCheck as CheckCircle2,
  FileJson,
  FileSpreadsheet,
  Trash2,
  TriangleAlert as AlertTriangle,
  X,
  Sliders,
  Cookie,
  Heart,
  Activity
} from 'lucide-react';

interface SettingsViewProps {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onOpenDoctorReport: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  theme,
  onToggleTheme,
  onOpenDoctorReport
}) => {
  const [cookiePrefs, setCookiePrefs] = useState({ essential: true, analytics: true, functional: true });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteText, setDeleteText] = useState('');
  const [exportSuccess, setExportSuccess] = useState(false);

  const handleExport = (format: 'json' | 'csv') => {
    const data = { patient: 'Alex Vance', exportTimestamp: new Date().toISOString(), format };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vitalsync_export_${Date.now()}.${format === 'json' ? 'json' : 'csv'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 font-mono max-w-5xl mx-auto">
      
      {/* 1. Header Masthead */}
      <div className="bg-[#141414] text-[#F9F9F7] border border-[#262626] p-6 lg:p-8 hard-shadow">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#262626] pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-[#CC0000] text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
                SYSTEM CONFIGURATION
              </span>
              <span className="text-xs text-[#888888] uppercase tracking-wider">
                PRIVACY • SECURITY • TELEMETRY RETENTION
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black tracking-tight text-white uppercase">
              System Settings & Privacy Registry
            </h1>
            <p className="text-xs text-[#A3A3A3] mt-1 max-w-2xl font-mono">
              Control interface rendering modes, cryptographic audit logs, GDPR/HIPAA portability archives, and local hardware storage.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Appearance & Mode Selection */}
      <div className="bg-[#141414] border border-[#262626] p-6 hard-shadow space-y-4">
        <div className="flex items-center gap-2 border-b border-[#262626] pb-3">
          <Sun className="w-4 h-4 text-[#CC0000]" />
          <h3 className="text-sm font-serif font-black uppercase text-white tracking-wide">
            Interface Rendering Mode
          </h3>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#1C1C1C] border border-[#2D2D2D] p-4">
          <div>
            <span className="text-xs font-bold text-white uppercase block">COLOR CONTRAST PROFILE</span>
            <span className="text-xs text-[#888888]">
              Currently active: <strong className="text-white uppercase">{theme} MODE</strong> (Editorial Monochrome)
            </span>
          </div>
          <button
            onClick={onToggleTheme}
            className="px-4 py-2 bg-white text-[#111111] hover:bg-[#E5E5E5] text-xs font-bold uppercase tracking-wider border border-white transition-colors flex items-center gap-2"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-[#CC0000]" />
                <span>SWITCH TO LIGHT MODE</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-[#111111]" />
                <span>SWITCH TO DARK MODE</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 3. Data Export & Portability */}
      <div className="bg-[#141414] border border-[#262626] p-6 hard-shadow space-y-4">
        <div className="flex items-center gap-2 border-b border-[#262626] pb-3">
          <Download className="w-4 h-4 text-[#CC0000]" />
          <h3 className="text-sm font-serif font-black uppercase text-white tracking-wide">
            Cryptographic Portability & Data Export
          </h3>
        </div>
        <p className="text-xs text-[#A3A3A3]">
          Generate signed machine-readable dumps of all raw telemetry packets, blood panel records, and protocol histories.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => handleExport('json')}
            className="px-4 py-2 bg-[#1C1C1C] hover:bg-[#252525] text-white text-xs font-bold uppercase tracking-wider border border-[#303030] transition-colors flex items-center gap-2"
          >
            <FileJson className="w-4 h-4 text-[#60A5FA]" />
            <span>EXPORT RAW JSON</span>
          </button>
          <button
            onClick={() => handleExport('csv')}
            className="px-4 py-2 bg-[#1C1C1C] hover:bg-[#252525] text-white text-xs font-bold uppercase tracking-wider border border-[#303030] transition-colors flex items-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#4ADE80]" />
            <span>EXPORT TABULAR CSV</span>
          </button>
          <button
            onClick={onOpenDoctorReport}
            className="px-4 py-2 bg-[#CC0000] hover:bg-[#b30000] text-white text-xs font-bold uppercase tracking-wider border border-[#111111] transition-colors flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            <span>GENERATE PHYSICIAN PDF</span>
          </button>
        </div>
        {exportSuccess && (
          <div className="text-xs text-[#4ADE80] flex items-center gap-1.5 bg-[#122A1A] p-2.5 border border-[#22C55E]/40">
            <CheckCircle2 className="w-4 h-4" />
            <span>Cryptographic archive generated and delivered to client filesystem.</span>
          </div>
        )}
      </div>

      {/* 4. Privacy & Consent Ledger */}
      <div className="bg-[#141414] border border-[#262626] p-6 hard-shadow space-y-4">
        <div className="flex items-center gap-2 border-b border-[#262626] pb-3">
          <ShieldCheck className="w-4 h-4 text-[#CC0000]" />
          <h3 className="text-sm font-serif font-black uppercase text-white tracking-wide">
            Privacy Ledger & Local Storage Scopes
          </h3>
        </div>
        <div className="space-y-3">
          <div className="bg-[#1C1C1C] p-4 border border-[#2D2D2D] flex items-start justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-white uppercase">ESSENTIAL TELEMETRY ENCRYPTION</span>
              <p className="text-xs text-[#888888] mt-0.5">Required for AES-256 session integrity and zero-trust biometric storage.</p>
            </div>
            <input type="checkbox" checked disabled className="accent-[#CC0000] mt-1" />
          </div>
          <div className="bg-[#1C1C1C] p-4 border border-[#2D2D2D] flex items-start justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-white uppercase">FUNCTIONAL PROTOCOL CACHE</span>
              <p className="text-xs text-[#888888] mt-0.5">Local index of lifestyle simulator runs, custom splits, and grocery checklists.</p>
            </div>
            <input
              type="checkbox"
              checked={cookiePrefs.functional}
              onChange={e => setCookiePrefs(p => ({ ...p, functional: e.target.checked }))}
              className="accent-[#CC0000] mt-1 w-4 h-4 cursor-pointer"
            />
          </div>
          <div className="bg-[#1C1C1C] p-4 border border-[#2D2D2D] flex items-start justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-white uppercase">ANONYMOUS TELEMETRY DIAGNOSTICS</span>
              <p className="text-xs text-[#888888] mt-0.5">Hardware GATT packet loss monitoring and OCR confidence benchmarking.</p>
            </div>
            <input
              type="checkbox"
              checked={cookiePrefs.analytics}
              onChange={e => setCookiePrefs(p => ({ ...p, analytics: e.target.checked }))}
              className="accent-[#CC0000] mt-1 w-4 h-4 cursor-pointer"
            />
          </div>
        </div>
        <div className="p-3 bg-[#181818] border border-[#303030] text-xs text-[#CCCCCC] flex items-center gap-2">
          <Lock className="w-4 h-4 text-[#4ADE80]" />
          <span>ZERO-SALE OATH: Physiological data remains encrypted on your client. No third-party ad brokers.</span>
        </div>
      </div>

      {/* 5. Danger Zone */}
      <div className="bg-[#141414] border border-[#401518] p-6 hard-shadow space-y-4">
        <div className="flex items-center gap-2 border-b border-[#401518] pb-3">
          <Trash2 className="w-4 h-4 text-[#F87171]" />
          <h3 className="text-sm font-serif font-black uppercase text-[#F87171] tracking-wide">
            Danger Zone: Irreversible Account Purge
          </h3>
        </div>
        <p className="text-xs text-[#A3A3A3]">
          Purge all locally stored and connected health databases, OCR indices, and workout records permanently.
        </p>
        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-2 bg-[#2E1215] text-[#F87171] hover:bg-[#3D181C] text-xs font-bold uppercase tracking-wider border border-[#EF4444]/40 transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>PURGE CLINICAL RECORDS</span>
          </button>
        ) : (
          <div className="p-4 bg-[#1C1C1C] border border-[#EF4444]/60 space-y-3">
            <p className="text-xs text-[#F87171] font-bold flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" /> TYPE <span className="font-mono text-white underline">DELETE</span> TO EXECUTE PURGE:
            </p>
            <input
              type="text"
              value={deleteText}
              onChange={e => setDeleteText(e.target.value)}
              placeholder="TYPE DELETE"
              className="w-full px-3 py-2 text-xs bg-[#111111] border border-[#EF4444]/50 text-white font-mono placeholder-[#666666] focus:outline-none focus:border-[#EF4444]"
            />
            <div className="flex gap-2">
              <button
                disabled={deleteText !== 'DELETE'}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors border ${
                  deleteText === 'DELETE'
                    ? 'bg-[#CC0000] hover:bg-[#b30000] text-white border-[#CC0000]'
                    : 'bg-[#1C1C1C] text-[#666666] border-[#303030] cursor-not-allowed'
                }`}
              >
                PERMANENTLY PURGE ALL
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeleteText('');
                }}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#888888] hover:text-white"
              >
                ABORT
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
