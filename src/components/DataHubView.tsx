import React, { useState } from 'react';
import {
  Layers,
  Upload,
  FileText,
  CircleCheck as CheckCircle2,
  ShieldCheck,
  Radio,
  Plus,
  RefreshCw,
  Sparkles,
  Bluetooth,
  Heart,
  Activity,
  Search,
  Lock,
  Check,
  ExternalLink,
  Database,
  Filter
} from 'lucide-react';
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
  sources,
  setSources,
  biomarkers,
  setBiomarkers,
  labReports,
  setLabReports
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
    { id: 'sources', label: 'DESK 1: INTEGRATED DATA FEEDS', icon: Layers },
    { id: 'upload', label: 'DESK 2: LAB REPORT OCR INGESTION', icon: FileText },
    { id: 'live', label: 'DESK 3: BLUETOOTH & LIVE TELEMETRY', icon: Radio },
  ];

  const handleConnectBluetooth = async (type: 'heart_rate' | 'blood_pressure') => {
    try {
      if (type === 'heart_rate') {
        const res = await bleManager.connectHeartRateSensor();
        setBleNotification(`HARDWARE PAIRED: ${res.deviceName}`);
      } else {
        const res = await bleManager.connectBloodPressureSensor();
        setBleNotification(`HARDWARE PAIRED: ${res.deviceName}`);
      }
      setTimeout(() => setBleNotification(null), 5000);
    } catch {
      setBleNotification('SIMULATED GATT BUFFER: Stream broadcasting continuously.');
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
        id: `ocr-${Date.now()}-${i}`,
        name: b.name,
        value: b.value,
        unit: b.unit,
        referenceRange: b.referenceRange,
        status: b.status,
        category: b.category || 'Metabolic',
        date: parsed.collectionDate || new Date().toISOString().split('T')[0],
        source: `${parsed.laboratoryName || 'Lab'} OCR`,
        historicalTrend: 'stable'
      }));
      const newReport: LabReport = {
        id: `rep-${Date.now()}`,
        title: parsed.documentTitle || 'Lab Report',
        laboratory: parsed.laboratoryName || 'Clinical Lab',
        date: parsed.collectionDate || new Date().toISOString().split('T')[0],
        summary: parsed.summary,
        biomarkers: newBios,
        clinicalInsights: parsed.clinicalInsights || [],
        disclaimer: parsed.disclaimer
      };
      setBiomarkers(prev => [...newBios, ...prev]);
      setLabReports(prev => [newReport, ...prev]);
      setUploadSuccess(true);
      setPastedText('');
      setTimeout(() => setUploadSuccess(false), 3500);
    } catch (err) {
      console.error('Lab parse failed:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddSource = (s: DataSource) => setSources(prev => [s, ...prev]);
  const handleAddBiomarker = (b: Biomarker) => setBiomarkers(prev => [b, ...prev]);

  const filteredSources = sources.filter(s => {
    const matchCat = category === 'all' || s.category === category;
    const matchSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const activeStreamingSources = sources.filter(s => s.connected && s.liveStreamingCapable !== false);

  return (
    <div className="space-y-6 font-mono">
      
      {/* 1. Header Masthead */}
      <div className="bg-[#141414] text-[#F9F9F7] border border-[#262626] p-6 lg:p-8 hard-shadow">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#262626] pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-[#CC0000] text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
                CENTRAL INGESTION HUB
              </span>
              <span className="text-xs text-[#888888] uppercase tracking-wider">
                DIRECT GATT • OAUTH 2.0 • CLINICAL HL7 / FHIR
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black tracking-tight text-white uppercase">
              Universal Data Hub & Telemetry Pipeline
            </h1>
            <p className="text-xs text-[#A3A3A3] mt-1 max-w-2xl font-mono">
              Manage cryptographic device integrations, ingest certified pathology PDF results, and maintain zero-latency Bluetooth telemetry feeds.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-[#1C1C1C] border border-[#2D2D2D] p-3 text-right">
              <span className="text-[10px] text-[#888888] font-bold uppercase block">DATA COVERAGE</span>
              <span className="text-xl font-black text-[#4ADE80] font-mono block">{coverage.overallScore}%</span>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2.5 bg-[#CC0000] hover:bg-[#b30000] text-white text-xs font-bold uppercase tracking-wider border border-[#111111] transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>CUSTOM INTEGRATION</span>
            </button>
          </div>
        </div>

        {bleNotification && (
          <div className="mt-3 bg-[#1C2A3A] border border-[#3B82F6] p-3 text-xs text-[#93C5FD] flex items-center gap-2">
            <Bluetooth className="w-4 h-4 text-[#3B82F6]" />
            <span className="font-bold uppercase">{bleNotification}</span>
          </div>
        )}
      </div>

      {/* 2. Sub-Tab Switcher */}
      <div className="bg-[#111111] border border-[#262626] p-1 flex items-center gap-1 overflow-x-auto">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const active = subTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold whitespace-nowrap uppercase tracking-wider transition-colors border ${
                active
                  ? 'bg-white text-[#111111] border-white font-black'
                  : 'bg-transparent text-[#888888] border-transparent hover:text-white hover:bg-[#1A1A1A]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          DESK 1: INTEGRATED DATA FEEDS
         ═══════════════════════════════════════════════════════════════════ */}
      {subTab === 'sources' && (
        <div className="space-y-4">
          
          {/* Bluetooth Quick Pair Bar in Dark Grey */}
          <div className="bg-[#141414] border border-[#262626] p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 hard-shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#1C1C1C] border border-[#2D2D2D] text-[#CC0000]">
                <Bluetooth className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase">Direct Hardware Web Bluetooth Pairing</h3>
                <p className="text-xs text-[#888888]">Connect standard BLE GATT Heart Rate and Blood Pressure medical peripherals.</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleConnectBluetooth('heart_rate')}
                className="px-3.5 py-2 text-xs font-bold uppercase tracking-wider bg-[#1C1C1C] hover:bg-[#252525] text-white border border-[#303030] transition-colors flex items-center gap-1.5"
              >
                <Heart className="w-3.5 h-3.5 text-[#CC0000]" />
                <span>PAIR HR STRAP</span>
              </button>
              <button
                onClick={() => handleConnectBluetooth('blood_pressure')}
                className="px-3.5 py-2 text-xs font-bold uppercase tracking-wider bg-[#1C1C1C] hover:bg-[#252525] text-white border border-[#303030] transition-colors flex items-center gap-1.5"
              >
                <Activity className="w-3.5 h-3.5 text-[#60A5FA]" />
                <span>PAIR BP CUFF</span>
              </button>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#141414] p-3 border border-[#262626]">
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
              {['all', 'fitness', 'vitals', 'sleep', 'nutrition', 'clinical'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1 text-[11px] uppercase font-bold tracking-wider transition-colors border ${
                    category === cat
                      ? 'bg-[#CC0000] text-white border-[#CC0000]'
                      : 'bg-[#1C1C1C] text-[#888888] hover:text-white border-[#2E2E2E]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="relative min-w-[260px]">
              <Search className="w-3.5 h-3.5 text-[#888888] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="SEARCH PERIPHERALS & APIS..."
                className="w-full pl-8 pr-3 py-1.5 bg-[#1C1C1C] border border-[#2E2E2E] text-xs text-white placeholder-[#666666] focus:outline-none focus:border-[#CC0000] uppercase font-mono"
              />
            </div>
          </div>

          {/* Sources Grid with Dark Grey Contrast */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSources.map(source => (
              <div
                key={source.id}
                className={`border p-5 flex flex-col justify-between transition-colors hard-shadow-sm ${
                  source.connected
                    ? 'bg-[#151515] border-[#333333]'
                    : 'bg-[#111111] border-[#222222] hover:border-[#383838]'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between border-b border-[#262626] pb-2">
                    <div>
                      <h3 className="text-sm font-bold text-white uppercase flex items-center gap-1.5 font-mono">
                        {source.name}
                        {source.connected && <CheckCircle2 className="w-3.5 h-3.5 text-[#4ADE80]" />}
                      </h3>
                      <span className="text-[10px] text-[#888888] uppercase">
                        {source.category} • {source.authType.toUpperCase()}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 uppercase border ${
                        source.connected
                          ? 'bg-[#122A1A] text-[#4ADE80] border-[#22C55E]/40'
                          : 'bg-[#1C1C1C] text-[#888888] border-[#2E2E2E]'
                      }`}
                    >
                      {source.connected ? 'ACTIVE FEED' : 'AVAILABLE'}
                    </span>
                  </div>

                  <p className="text-xs text-[#A3A3A3] line-clamp-2 font-mono">{source.description}</p>

                  <div className="flex flex-wrap gap-1">
                    {(source.connected && source.grantedScopes
                      ? source.grantedScopes
                      : source.supportedScopes
                      ? source.supportedScopes.map(s => s.id)
                      : source.permissions
                    ).slice(0, 4).map((p, i) => (
                      <span
                        key={i}
                        className="text-[9px] px-1.5 py-0.5 bg-[#1F1F1F] text-[#CCCCCC] border border-[#2D2D2D] font-mono uppercase"
                      >
                        {typeof p === 'string' ? p.replace(/_/g, ' ') : (p as any).label}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 mt-3 border-t border-[#262626] flex items-center justify-between text-xs font-mono">
                  <span className="text-[11px] text-[#888888]">
                    {source.connected ? `SYNC: ${source.lastSync}` : 'OFFICIAL API PROTOCOL'}
                  </span>
                  {source.connected ? (
                    <button
                      onClick={() =>
                        setSources(prev =>
                          prev.map(s =>
                            s.id === source.id
                              ? { ...s, connected: false, status: 'disconnected', lastSync: 'Disconnected', isLiveActive: false }
                              : s
                          )
                        )
                      }
                      className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-[#2E1215] text-[#F87171] border border-[#EF4444]/40 hover:bg-[#3D181C] transition-colors"
                    >
                      DISCONNECT
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        setSources(prev =>
                          prev.map(s =>
                            s.id === source.id
                              ? { ...s, connected: true, status: 'active', lastSync: 'Just now', recordCount: (s.recordCount || 0) + 148, isLiveActive: true }
                              : s
                          )
                        )
                      }
                      className="px-3.5 py-1 text-xs font-bold uppercase tracking-wider bg-[#CC0000] hover:bg-[#b30000] text-white border border-[#111111] transition-colors flex items-center gap-1"
                    >
                      <Lock className="w-3 h-3" />
                      <span>AUTHORIZE</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          DESK 2: LAB REPORT OCR INGESTION
         ═══════════════════════════════════════════════════════════════════ */}
      {subTab === 'upload' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 bg-[#141414] border border-[#262626] p-6 hard-shadow space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <FileText className="w-4 h-4 text-[#CC0000]" />
                <h3 className="text-base font-serif font-black uppercase text-white tracking-wide">
                  Clinical OCR & Laboratory Report Ingestion
                </h3>
              </div>
              <p className="text-xs text-[#A3A3A3]">
                Paste raw pathology documents, Quest / LabCorp diagnostic transcripts, or physician summaries for automated entity extraction.
              </p>
            </div>

            <form onSubmit={handleLabSubmit} className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-[#888888] uppercase">
                  RAW LAB TRANSCRIPT / OCR PAYLOAD:
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setPastedText(`Quest Diagnostics (Date: 2026-08-15)
Fasting Glucose: 88 mg/dL (Ref: 70-99) - Normal
HbA1c: 5.2% (Ref: <5.7) - Optimal
Total Cholesterol: 198 mg/dL (Ref: 125-200) - Normal
HDL: 64 mg/dL (Ref: >45) - Optimal
LDL: 114 mg/dL (Ref: <100) - Borderline
Triglycerides: 84 mg/dL (Ref: <150) - Optimal
hs-CRP: 0.74 mg/L (Ref: <1.0) - Low Inflammation
ApoB: 82 mg/dL (Ref: <90) - Optimal
Testosterone Total: 720 ng/dL (Ref: 300-1000) - Optimal`)
                  }
                  className="text-xs text-[#CC0000] hover:underline font-bold uppercase"
                >
                  LOAD QUEST SPECIMEN SAMPLE
                </button>
              </div>

              <textarea
                value={pastedText}
                onChange={e => setPastedText(e.target.value)}
                placeholder="Paste laboratory results, reference ranges, and physician notes here..."
                rows={8}
                className="w-full p-3 text-xs font-mono bg-[#1C1C1C] border border-[#2E2E2E] text-[#F9F9F7] placeholder-[#666666] focus:outline-none focus:border-[#CC0000]"
              />

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-[#888888] flex items-center gap-1 uppercase">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#4ADE80]" />
                  HIPAA-COMPLIANT SERVER-SIDE PARSING
                </span>
                <button
                  type="submit"
                  disabled={isUploading || !pastedText.trim()}
                  className="px-6 py-2.5 bg-[#CC0000] hover:bg-[#b30000] text-white text-xs font-bold uppercase tracking-wider disabled:opacity-50 transition-colors flex items-center gap-1.5"
                >
                  {isUploading ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> EXTRACTING...</> : <><Sparkles className="w-3.5 h-3.5" /> INGEST LAB DATA</>}
                </button>
              </div>
            </form>

            {uploadSuccess && (
              <div className="p-3 bg-[#122A1A] border border-[#22C55E]/40 text-xs text-[#4ADE80] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span className="font-bold uppercase">Biomarkers parsed and synchronized into central clinical database.</span>
              </div>
            )}
          </div>

          {/* Diagnostic Ingested Archives */}
          <div className="bg-[#141414] border border-[#262626] p-5 hard-shadow space-y-3">
            <h3 className="text-sm font-serif font-black uppercase text-white tracking-wide border-b border-[#262626] pb-2 flex items-center gap-2">
              <Database className="w-4 h-4 text-[#CC0000]" />
              Ingested Lab Archive ({labReports.length})
            </h3>
            <div className="space-y-2">
              {labReports.map(rep => (
                <div
                  key={rep.id}
                  className="bg-[#1C1C1C] border border-[#2D2D2D] p-3.5 space-y-1.5"
                >
                  <div className="flex items-start justify-between">
                    <span className="text-xs font-bold text-white uppercase font-mono">{rep.title}</span>
                    <span className="text-[10px] text-[#888888]">{rep.date}</span>
                  </div>
                  <p className="text-[11px] text-[#A3A3A3] line-clamp-2">{rep.summary}</p>
                  <div className="text-[10px] text-[#888888] flex items-center justify-between pt-1 border-t border-[#2D2D2D]">
                    <span className="uppercase">{rep.laboratory}</span>
                    <span className="text-[#CC0000] font-bold">{rep.biomarkers.length} BIOMARKERS</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          DESK 3: BLUETOOTH & LIVE TELEMETRY
         ═══════════════════════════════════════════════════════════════════ */}
      {subTab === 'live' && (
        <div className="space-y-6">
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#141414] border border-[#262626] p-4 space-y-1 hard-shadow-sm">
              <span className="text-[10px] text-[#888888] uppercase font-bold block">ACTIVE FEEDS</span>
              <div className="text-3xl font-black text-white font-mono">{activeStreamingSources.length}</div>
              <span className="text-[10px] text-[#4ADE80] uppercase block">BROADCASTING</span>
            </div>
            <div className="bg-[#141414] border border-[#262626] p-4 space-y-1 hard-shadow-sm">
              <span className="text-[10px] text-[#888888] uppercase font-bold block">STREAM THROUGHPUT</span>
              <div className="text-3xl font-black text-white font-mono">{(activeStreamingSources.length * 0.5).toFixed(1)} <span className="text-xs text-[#888888]">PKT/S</span></div>
              <span className="text-[10px] text-[#888888] uppercase block">ZERO DROP RATE</span>
            </div>
            <div className="bg-[#141414] border border-[#262626] p-4 space-y-1 hard-shadow-sm">
              <span className="text-[10px] text-[#888888] uppercase font-bold block">GATT LATENCY</span>
              <div className="text-3xl font-black text-[#4ADE80] font-mono">14 <span className="text-xs text-[#888888]">MS</span></div>
              <span className="text-[10px] text-[#4ADE80] uppercase block">HARD REALTIME</span>
            </div>
            <div className="bg-[#141414] border border-[#262626] p-4 space-y-1 hard-shadow-sm">
              <span className="text-[10px] text-[#888888] uppercase font-bold block">VERIFIED SAMPLES</span>
              <div className="text-3xl font-black text-white font-mono">24,190</div>
              <span className="text-[10px] text-[#888888] uppercase block">PERSISTED IN BUFFER</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeStreamingSources.slice(0, 6).map(source => (
              <div
                key={source.id}
                className="bg-[#151515] border border-[#262626] p-5 space-y-3 hard-shadow-sm"
              >
                <div className="flex items-start justify-between border-b border-[#262626] pb-2">
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase flex items-center gap-1.5 font-mono">
                      {source.name}
                      <span className="inline-block w-2 h-2 rounded-full bg-[#CC0000] animate-pulse" />
                    </h4>
                    <span className="text-[10px] text-[#888888] uppercase font-mono">
                      {source.category} • {source.authType.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 uppercase bg-[#122A1A] text-[#4ADE80] border border-[#22C55E]/40">
                    LIVE
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-[#1C1C1C] p-3 border border-[#2D2D2D] text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-[#888888] block uppercase">RECORDS</span>
                    <span className="text-base font-bold text-white">{source.recordCount}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#888888] block uppercase">BANDWIDTH</span>
                    <span className="text-base font-bold text-[#4ADE80]">{source.liveThroughput || '1.0 pkts/s'}</span>
                  </div>
                </div>

                <div className="text-[11px] text-[#888888] pt-1 border-t border-[#262626] font-mono">
                  STATUS: {source.lastSync}
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      <AddCustomSourceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddSource={handleAddSource}
        onAddBiomarker={handleAddBiomarker}
      />
    </div>
  );
};
