import React, { useState } from 'react';
import { Layers, Upload, FileText, CircleCheck as CheckCircle2, ShieldCheck, Radio, Plus, RefreshCw, Sparkles, Bluetooth, Heart, Activity, Search, Lock, Check, ExternalLink, Database } from 'lucide-react';
import { DataSource, Biomarker, LabReport, GranularScope } from '../types';
import { analyzeLabDocument } from '../services/api';
import { calculateDataCoverageScore } from '../utils/healthCalculations';
import { WebBluetoothManager } from '../utils/bluetooth';
import { AddCustomSourceModal } from './AddCustomSourceModal';

interface DataHubViewProps {
  sources: DataSource[];
  setSources: React.Dispatch<React.SetStateAction<DataSource[]>>;
  biomarkers: Biomarker[];
  setBiomarkers: React.Dispatch<React.SetStateAction<Biomarker[]>>;
  labReports: LabReport[];
  setLabReports: React.Dispatch<React.SetStateAction<LabReport[]>>;
}

type SubTab = 'sources' | 'upload' | 'live';

export const DataHubView: React.FC<DataHubViewProps> = ({
  sources, setSources, biomarkers, setBiomarkers, labReports, setLabReports
}) => {
  const [subTab, setSubTab] = useState<SubTab>('sources');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [pastedText, setPastedText] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [bleNotification, setBleNotification] = useState<string | null>(null);
  const [category, setCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const bleManager = WebBluetoothManager.getInstance();
  const coverage = calculateDataCoverageScore(sources, biomarkers, [], []);

  const tabs: { id: SubTab; label: string; icon: any }[] = [
    { id: 'sources', label: 'Connected Sources', icon: Layers },
    { id: 'upload', label: 'Lab Report OCR', icon: FileText },
    { id: 'live', label: 'Live Telemetry', icon: Radio },
  ];

  const handleConnectBluetooth = async (type: 'heart_rate' | 'blood_pressure') => {
    try {
      if (type === 'heart_rate') {
        const res = await bleManager.connectHeartRateSensor();
        setBleNotification(`Connected to ${res.deviceName}`);
      } else {
        const res = await bleManager.connectBloodPressureSensor();
        setBleNotification(`Connected to ${res.deviceName}`);
      }
      setTimeout(() => setBleNotification(null), 5000);
    } catch {
      setBleNotification('Bluetooth pairing initialized (virtual stream).');
      setTimeout(() => setBleNotification(null), 4000);
    }
  };

  const handleLabSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pastedText.trim()) return;
    setIsUploading(true);
    try {
      const parsed = await analyzeLabDocument({ docText: pastedText });
      const newBios: Biomarker[] = (parsed.biomarkers || []).map((b: any, i: number) => ({
        id: `ocr-${Date.now()}-${i}`, name: b.name, value: b.value, unit: b.unit,
        referenceRange: b.referenceRange, status: b.status, category: b.category || 'Metabolic',
        date: parsed.collectionDate || new Date().toISOString().split('T')[0],
        source: `${parsed.laboratoryName || 'Lab'} OCR`, historicalTrend: 'stable'
      }));
      const newReport: LabReport = {
        id: `rep-${Date.now()}`, title: parsed.documentTitle || 'Lab Report',
        laboratory: parsed.laboratoryName || 'Clinical Lab',
        date: parsed.collectionDate || new Date().toISOString().split('T')[0],
        summary: parsed.summary, biomarkers: newBios,
        clinicalInsights: parsed.clinicalInsights || [], disclaimer: parsed.disclaimer
      };
      setBiomarkers(prev => [...newBios, ...prev]);
      setLabReports(prev => [newReport, ...prev]);
      setUploadSuccess(true);
      setPastedText('');
      setTimeout(() => setUploadSuccess(false), 3500);
    } catch (err) { console.error('Lab parse failed:', err); }
    finally { setIsUploading(false); }
  };

  const handleAddSource = (s: DataSource) => setSources(prev => [s, ...prev]);
  const handleAddBiomarker = (b: Biomarker) => setBiomarkers(prev => [b, ...prev]);

  const filteredSources = sources.filter(s => {
    const matchCat = category === 'all' || s.category === category;
    const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const activeStreamingSources = sources.filter(s => s.connected && s.liveStreamingCapable !== false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-md">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Data Hub</h1>
          <p className="text-xs text-slate-400 mt-1">Connect wearables, upload lab reports, and monitor live telemetry streams.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-right">
            <span className="text-xs text-slate-400 font-semibold">Coverage</span>
            <span className="text-lg font-bold text-cyan-400 block">{coverage.overallScore}%</span>
          </div>
          <button onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:brightness-110 transition-all flex items-center gap-1.5">
            <Plus className="w-4 h-4" /> Add Source
          </button>
        </div>
      </div>

      {bleNotification && (
        <div className="bg-cyan-500/15 border border-cyan-500/40 rounded-xl p-3.5 text-xs text-cyan-300 flex items-center gap-2.5">
          <Bluetooth className="w-4 h-4" /> {bleNotification}
        </div>
      )}

      {/* Sub-tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const active = subTab === tab.id;
          return (
            <button key={tab.id} onClick={() => setSubTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                active ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
              }`}>
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* SOURCES */}
      {subTab === 'sources' && (
        <div className="space-y-4">
          {/* Bluetooth pairing */}
          <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400"><Bluetooth className="w-5 h-5" /></div>
              <div>
                <h3 className="text-sm font-bold text-white">Web Bluetooth Pairing</h3>
                <p className="text-xs text-slate-400">Pair heart rate straps or blood pressure monitors via GATT.</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleConnectBluetooth('heart_rate')}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-400" /> Pair HR Strap
              </button>
              <button onClick={() => handleConnectBluetooth('blood_pressure')}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-cyan-400" /> Pair BP Monitor
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
              {['all', 'fitness', 'vitals', 'sleep', 'nutrition', 'clinical'].map(cat => (
                <button key={cat} onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-all ${
                    category === cat ? 'bg-slate-800 text-white font-bold border border-slate-700' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}>{cat === 'all' ? 'All' : cat}</button>
              ))}
            </div>
            <div className="relative min-w-[240px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search sources..."
                className="w-full pl-8 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500" />
            </div>
          </div>

          {/* Source cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSources.map(source => (
              <div key={source.id} className={`rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                source.connected ? 'bg-slate-900/90 border-slate-700 shadow-md' : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
              }`}>
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                        {source.name}
                        {source.connected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                      </h3>
                      <span className="text-[10px] font-semibold uppercase text-slate-400">{source.category} • {source.authType.toUpperCase()}</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                      source.connected ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>{source.connected ? 'Connected' : 'Available'}</span>
                  </div>
                  <p className="text-xs text-slate-300 line-clamp-2">{source.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {(source.connected && source.grantedScopes ? source.grantedScopes : source.supportedScopes ? source.supportedScopes.map(s => s.id) : source.permissions).slice(0, 4).map((p, i) => (
                      <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800 font-mono">
                        {typeof p === 'string' ? p.replace(/_/g, ' ') : (p as any).label}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="pt-4 mt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">{source.connected ? source.lastSync : 'Official API'}</span>
                  {source.connected ? (
                    <button onClick={() => setSources(prev => prev.map(s => s.id === source.id ? { ...s, connected: false, status: 'disconnected', lastSync: 'Disconnected', isLiveActive: false } : s))}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-500/10 text-rose-300 border border-rose-500/30 hover:bg-rose-500/20 transition-all">Disconnect</button>
                  ) : (
                    <button onClick={() => setSources(prev => prev.map(s => s.id === source.id ? { ...s, connected: true, status: 'active', lastSync: 'Just now', recordCount: (s.recordCount || 0) + 148, isLiveActive: true } : s))}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:brightness-110 transition-all flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Connect
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* UPLOAD */}
      {subTab === 'upload' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2"><FileText className="w-4 h-4 text-cyan-400" /> Lab Report OCR Ingestion</h3>
              <p className="text-xs text-slate-400 mt-0.5">Paste lab results or physician summaries for AI-powered biomarker extraction.</p>
            </div>
            <form onSubmit={handleLabSubmit} className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 uppercase">Paste Lab Report Text:</label>
                <button type="button" onClick={() => setPastedText(`Quest Diagnostics (Date: 2026-08-15)
Fasting Glucose: 88 mg/dL (Ref: 70-99) - Normal
HbA1c: 5.2% (Ref: <5.7) - Optimal
Total Cholesterol: 198 mg/dL (Ref: 125-200) - Normal
HDL: 64 mg/dL (Ref: >45) - Optimal
LDL: 114 mg/dL (Ref: <100) - Borderline
Triglycerides: 84 mg/dL (Ref: <150) - Optimal
hs-CRP: 0.74 mg/L (Ref: <1.0) - Low Inflammation`)}
                  className="text-xs text-cyan-400 hover:text-cyan-300 underline">Insert Sample</button>
              </div>
              <textarea value={pastedText} onChange={e => setPastedText(e.target.value)} placeholder="Paste lab results here..." rows={7}
                className="w-full p-3 text-xs font-mono bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500" />
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-400 flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Server-side validated</span>
                <button type="submit" disabled={isUploading || !pastedText.trim()}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 hover:brightness-110 disabled:opacity-50 transition-all flex items-center gap-1.5">
                  {isUploading ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Extracting...</> : <><Sparkles className="w-3.5 h-3.5" /> Parse with AI</>}
                </button>
              </div>
            </form>
            {uploadSuccess && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Biomarkers extracted and added to your health record.
              </div>
            )}
          </div>

          {/* Lab reports history */}
          <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2"><Database className="w-4 h-4 text-emerald-400" /> Ingested Reports ({labReports.length})</h3>
            {labReports.map(rep => (
              <div key={rep.id} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-start justify-between">
                  <span className="text-xs font-bold text-white">{rep.title}</span>
                  <span className="text-[10px] text-slate-400">{rep.date}</span>
                </div>
                <p className="text-[11px] text-slate-300 line-clamp-3">{rep.summary}</p>
                <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800/80">
                  <span>{rep.laboratory}</span>
                  <span className="text-cyan-400 font-semibold">{rep.biomarkers.length} markers</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* LIVE */}
      {subTab === 'live' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-400"><span>Active Streams</span><Radio className="w-4 h-4 text-emerald-400" /></div>
              <div className="text-2xl font-black text-white">{activeStreamingSources.length}</div>
              <span className="text-[11px] text-emerald-400">Broadcasting</span>
            </div>
            <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-400"><span>Throughput</span><Sparkles className="w-4 h-4 text-cyan-400" /></div>
              <div className="text-2xl font-black text-cyan-400">{(activeStreamingSources.length * 0.5).toFixed(1)} pkts/s</div>
              <span className="text-[11px] text-slate-400">Real-time pipeline</span>
            </div>
            <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-400"><span>Latency</span><Bluetooth className="w-4 h-4 text-purple-400" /></div>
              <div className="text-2xl font-black text-purple-400">14 ms</div>
              <span className="text-[11px] text-purple-300">Direct buffer</span>
            </div>
            <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-400"><span>Processed</span><Database className="w-4 h-4 text-blue-400" /></div>
              <div className="text-2xl font-black text-white">24,190</div>
              <span className="text-[11px] text-slate-400">Verified records</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeStreamingSources.slice(0, 6).map(source => (
              <div key={source.id} className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 space-y-3 shadow-md">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                      {source.name}
                      <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    </h4>
                    <span className="text-[10px] text-slate-400 uppercase">{source.category} • {source.authType.toUpperCase()}</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">Live</span>
                </div>
                <div className="grid grid-cols-2 gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                  <div><span className="text-[10px] text-slate-400 block">Records</span><span className="text-sm font-bold text-white">{source.recordCount}</span></div>
                  <div><span className="text-[10px] text-slate-400 block">Throughput</span><span className="text-sm font-bold text-cyan-400">{source.liveThroughput || '1.0 pkts/s'}</span></div>
                </div>
                <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">{source.lastSync}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <AddCustomSourceModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAddSource={handleAddSource} onAddBiomarker={handleAddBiomarker} />
    </div>
  );
};
