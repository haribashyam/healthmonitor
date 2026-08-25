import React from 'react';
import {
  ShieldCheck,
  Database,
  Lock,
  CheckCircle2,
  Trash2,
  ExternalLink,
  Layers,
  FileText
} from 'lucide-react';
import { DataSource } from '../types';

interface DataMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  sources: DataSource[];
}

export const DataMapModal: React.FC<DataMapModalProps> = ({
  isOpen,
  onClose,
  sources
}) => {
  if (!isOpen) return null;

  const connectedSources = sources.filter(s => s.connected);
  const totalRecords = sources.reduce((acc, s) => acc + (s.recordCount || 0), 0);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative text-slate-100 animate-scaleUp">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">My Data Map & Provenance Ledger</h2>
              <p className="text-xs text-slate-400">Complete transparency on what VITALOS stores, syncs, and computes</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            ✕
          </button>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Connected Ecosystems</span>
            <span className="text-2xl font-black text-white">{connectedSources.length}</span>
            <span className="text-[10px] text-emerald-400">Granular OAuth 2.0</span>
          </div>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Normalized Data Points</span>
            <span className="text-2xl font-black text-cyan-400">{totalRecords.toLocaleString()}</span>
            <span className="text-[10px] text-slate-400">De-duplicated & Reconciled</span>
          </div>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Privacy Architecture</span>
            <span className="text-2xl font-black text-emerald-400">Zero-Sale</span>
            <span className="text-[10px] text-slate-400">Self-Sovereign Health</span>
          </div>
        </div>

        {/* Source Stream Ledger */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Authorized Integration Streams:
          </span>

          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {sources.map((s) => (
              <div
                key={s.id}
                className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{s.name}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${s.connected ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'}`}>
                      {s.connected ? 'Active Sync' : 'Not Connected'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Permissions: <span className="font-mono text-slate-300">{s.permissions.join(', ')}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono text-cyan-400 font-bold block">{s.recordCount || 0} records</span>
                  <span className="text-[10px] text-slate-500">{s.lastSync}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Data Rights & Export Action */}
        <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-2">
          <span className="font-bold text-white block">Your Data Rights:</span>
          <p className="leading-relaxed">
            VITALOS never scrapes accounts or sells health data to advertisers or insurers. You can disconnect any service or wipe local records at any moment.
          </p>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-all"
          >
            Close Data Ledger
          </button>
        </div>

      </div>
    </div>
  );
};
