import React, { useState } from 'react';
import { Sun, Moon, ShieldCheck, Download, FileText, Lock, CircleCheck as CheckCircle2, FileJson, FileSpreadsheet, Trash2, TriangleAlert as AlertTriangle, X, FileSliders as Sliders, Cookie, Heart, Activity } from 'lucide-react';

interface SettingsViewProps {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onOpenDoctorReport: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ theme, onToggleTheme, onOpenDoctorReport }) => {
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
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-md">
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Settings</h1>
        <p className="text-xs text-slate-400 mt-1">Manage your account, privacy, data, and preferences.</p>
      </div>

      {/* Appearance */}
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Sun className="w-4 h-4 text-amber-400" /> Appearance
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm font-bold text-white block">Theme</span>
            <span className="text-xs text-slate-400">Currently: {theme === 'dark' ? 'Dark' : 'Light'} mode</span>
          </div>
          <button onClick={onToggleTheme}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center gap-2">
            {theme === 'dark' ? <><Sun className="w-4 h-4 text-amber-400" /> Switch to Light</> : <><Moon className="w-4 h-4 text-cyan-400" /> Switch to Dark</>}
          </button>
        </div>
      </div>

      {/* Data Export */}
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Download className="w-4 h-4 text-emerald-400" /> Data Export & Portability
        </h3>
        <p className="text-xs text-slate-400">Export all your historical health data in standard formats.</p>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => handleExport('json')}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-all flex items-center gap-2">
            <FileJson className="w-4 h-4 text-cyan-400" /> Download JSON
          </button>
          <button onClick={() => handleExport('csv')}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-all flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" /> Download CSV
          </button>
          <button onClick={onOpenDoctorReport}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 transition-all flex items-center gap-2">
            <FileText className="w-4 h-4" /> Generate Doctor PDF
          </button>
        </div>
        {exportSuccess && (
          <div className="text-xs text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> Export downloaded successfully!
          </div>
        )}
      </div>

      {/* Privacy & Cookie Preferences */}
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400" /> Privacy & Cookies
        </h3>
        <div className="space-y-3">
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-start justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-white">Essential Cookies</span>
              <p className="text-[11px] text-slate-400">Required for authentication and secure sessions.</p>
            </div>
            <input type="checkbox" checked disabled className="accent-cyan-500 mt-1 cursor-not-allowed" />
          </div>
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-start justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-white">Functional & Performance</span>
              <p className="text-[11px] text-slate-400">UI preferences, simulator cache, and layout settings.</p>
            </div>
            <input type="checkbox" checked={cookiePrefs.functional} onChange={e => setCookiePrefs(p => ({ ...p, functional: e.target.checked }))} className="accent-cyan-500 mt-1 w-4 h-4 cursor-pointer" />
          </div>
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-start justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-white">Anonymous Diagnostics</span>
              <p className="text-[11px] text-slate-400">Helps improve Bluetooth reliability and OCR accuracy.</p>
            </div>
            <input type="checkbox" checked={cookiePrefs.analytics} onChange={e => setCookiePrefs(p => ({ ...p, analytics: e.target.checked }))} className="accent-cyan-500 mt-1 w-4 h-4 cursor-pointer" />
          </div>
        </div>
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
          <Lock className="w-4 h-4" /> Zero-Sale Guarantee: Your health data is never sold, licensed, or shared with third parties.
        </div>
      </div>

      {/* Account Deletion */}
      <div className="bg-slate-900 rounded-2xl p-6 border border-rose-900/40 space-y-4">
        <h3 className="text-sm font-bold text-rose-300 uppercase tracking-wider flex items-center gap-2">
          <Trash2 className="w-4 h-4" /> Danger Zone
        </h3>
        <p className="text-xs text-slate-400">Permanently delete all your health data, connected sources, and AI plans. This action is irreversible.</p>
        {!showDeleteConfirm ? (
          <button onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 transition-all flex items-center gap-1.5">
            <Trash2 className="w-3.5 h-3.5" /> Request Data Deletion
          </button>
        ) : (
          <div className="p-4 rounded-xl bg-slate-950 border border-rose-500/40 space-y-3">
            <p className="text-xs text-rose-300 font-semibold flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" /> Type <span className="font-mono text-white underline">DELETE</span> to confirm:
            </p>
            <input type="text" value={deleteText} onChange={e => setDeleteText(e.target.value)} placeholder="Type DELETE"
              className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-rose-500/50 rounded text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-rose-400" />
            <div className="flex gap-2">
              <button disabled={deleteText !== 'DELETE'}
                className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${deleteText === 'DELETE' ? 'bg-rose-600 hover:bg-rose-500 text-white' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}>
                Permanently Purge
              </button>
              <button onClick={() => { setShowDeleteConfirm(false); setDeleteText(''); }}
                className="px-3 py-1.5 rounded text-xs text-slate-400 hover:text-white">Cancel</button>
            </div>
          </div>
        )}
      </div>

      {/* About */}
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-emerald-400 p-[2px]">
            <div className="w-full h-full bg-slate-950 rounded-[6px] flex items-center justify-center">
              <Activity className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
          <span className="font-bold text-white">VITAL<span className="text-cyan-400">OS</span></span>
        </div>
        <p className="text-xs text-slate-400">Personal Health Intelligence Platform v3.4.2</p>
        <p className="text-[11px] text-slate-500">© {new Date().getFullYear()} VITALOS Health Intelligence Inc. Not a medical device. Consult your physician for clinical advice.</p>
      </div>
    </div>
  );
};
