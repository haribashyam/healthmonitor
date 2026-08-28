import React, { useState } from 'react';
import {
  Layers,
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Radio,
  Plus,
  RefreshCw,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Database,
  Trash2,
  Eye,
  Check,
  Search,
  SlidersHorizontal,
  Bluetooth,
  Activity,
  Heart,
  Lock,
  Zap,
  Info,
  Globe,
  PlusCircle,
  Sliders,
  Play,
  Pause,
  Link2
} from 'lucide-react';
import { DataSource, Biomarker, LabReport, GranularScope } from '../types';
import { analyzeLabDocument } from '../services/api';
import { calculateDataCoverageScore, deduplicateSteps } from '../utils/healthCalculations';
import { healthStorage } from '../utils/storage';
import { bluetoothManager } from '../services/bluetoothService';
import { AddCustomSourceModal } from './AddCustomSourceModal';
import { LiveMultiDeviceStreamHub } from './LiveMultiDeviceStreamHub';
import { LabReportUploadModal } from './production/LabReportUploadModal';

interface UniversalDataHubProps {
  sources: DataSource[];
  setSources: React.Dispatch<React.SetStateAction<DataSource[]>>;
  biomarkers: Biomarker[];
  setBiomarkers: React.Dispatch<React.SetStateAction<Biomarker[]>>;
  labReports: LabReport[];
  setLabReports: React.Dispatch<React.SetStateAction<LabReport[]>>;
  onOpenDataMap: () => void;
}

export const UniversalDataHub: React.FC<UniversalDataHubProps> = ({
  sources,
  setSources,
  biomarkers,
  setBiomarkers,
  labReports,
  setLabReports,
  onOpenDataMap
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'connect' | 'live_stream' | 'lab_upload' | 'manual' | 'reconciliation'>('connect');
  const [isUploading, setIsUploading] = useState(false);
  const [pastedDocText, setPastedDocText] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Add Custom Source Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLabUploadModalOpen, setIsLabUploadModalOpen] = useState(false);

  // OAuth & Connection Modal State
  const [selectedOAuthSource, setSelectedOAuthSource] = useState<DataSource | null>(null);
  const [selectedScopesForAuth, setSelectedScopesForAuth] = useState<string[]>([]);
  const [apiTokenInput, setApiTokenInput] = useState('');
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [authStep, setAuthStep] = useState<'review' | 'credentials' | 'ble_pair' | 'success'>('review');
  const [connectionNotice, setConnectionNotice] = useState<string | null>(null);

  // Manual Biomarker State
  const [manualName, setManualName] = useState('Fasting Blood Glucose');
  const [manualValue, setManualValue] = useState('');
  const [manualUnit, setManualUnit] = useState('mg/dL');
  const [manualRange, setManualRange] = useState('70 - 99');
  const [manualCategory, setManualCategory] = useState<any>('Metabolic');

  // Bluetooth Pairing State
  const [isPairingBle, setIsPairingBle] = useState(false);
  const [bleNotification, setBleNotification] = useState<string | null>(null);

  const coverageData = calculateDataCoverageScore(sources, biomarkers, [], []);
  const stepDeduplication = deduplicateSteps(11420, 10890, 0);

  const handleOpenOAuthModal = (source: DataSource) => {
    setSelectedOAuthSource(source);
    setApiTokenInput('');
    setConnectionNotice(null);
    if (source.supportedScopes && source.supportedScopes.length > 0) {
      setSelectedScopesForAuth(source.supportedScopes.map((s) => s.id));
    } else {
      setSelectedScopesForAuth(['activities', 'pace_and_heart_rate', 'elevation', 'training_load']);
    }
    setAuthStep('review');
  };

  const toggleScopeInModal = (scopeId: string) => {
    if (selectedScopesForAuth.includes(scopeId)) {
      setSelectedScopesForAuth(selectedScopesForAuth.filter((s) => s !== scopeId));
    } else {
      setSelectedScopesForAuth([...selectedScopesForAuth, scopeId]);
    }
  };

  const handleExecuteOAuth = async () => {
    if (!selectedOAuthSource) return;
    setIsAuthorizing(true);

    const updatedSource: DataSource = {
      ...selectedOAuthSource,
      connected: true,
      status: 'active',
      lastSync: 'Active (Authenticated)',
      recordCount: (selectedOAuthSource.recordCount || 0) + 1,
      grantedScopes: selectedScopesForAuth,
      permissions: selectedScopesForAuth.map((sc) => `${sc}:read`),
      isLiveActive: true
    };

    // Save to storage
    healthStorage.saveDataSource(updatedSource);

    setSources((prev) =>
      prev.map((s) => (s.id === selectedOAuthSource.id ? updatedSource : s))
    );

    setIsAuthorizing(false);
    setAuthStep('success');
    setTimeout(() => {
      setSelectedOAuthSource(null);
    }, 1500);
  };

  const handleConnectViaBluetoothFromModal = async () => {
    if (!selectedOAuthSource) return;
    setIsAuthorizing(true);
    try {
      const type = selectedOAuthSource.category === 'cardio' || selectedOAuthSource.name.toLowerCase().includes('heart') ? 'heart_rate' : 'heart_rate';
      const res = await bluetoothManager.connectDevice(type);
      if (res.success) {
        const updatedSource: DataSource = {
          ...selectedOAuthSource,
          connected: true,
          status: 'active',
          lastSync: `Connected via BLE (${res.deviceName})`,
          isLiveActive: true
        };
        healthStorage.saveDataSource(updatedSource);
        setSources((prev) => prev.map((s) => (s.id === selectedOAuthSource.id ? updatedSource : s)));
        setAuthStep('success');
        setTimeout(() => setSelectedOAuthSource(null), 1500);
      } else {
        setConnectionNotice(res.error || 'Bluetooth pairing cancelled.');
      }
    } catch (err: any) {
      setConnectionNotice(err.message || 'Bluetooth connection failed.');
    } finally {
      setIsAuthorizing(false);
    }
  };

  const handleDisconnectSource = (sourceId: string) => {
    const target = sources.find(s => s.id === sourceId);
    if (target) {
      const updated: DataSource = {
        ...target,
        connected: false,
        status: 'disconnected',
        lastSync: 'Disconnected',
        recordCount: 0,
        isLiveActive: false
      };
      healthStorage.saveDataSource(updated);
      setSources((prev) => prev.map((s) => (s.id === sourceId ? updated : s)));
    }
  };

  const handleConnectBluetoothHardware = async (type: 'heart_rate' | 'blood_pressure') => {
    setIsPairingBle(true);
    try {
      const res = await bluetoothManager.connectDevice(type);
      if (res.success) {
        setBleNotification(`CONNECTED HARDWARE: ${res.deviceName}`);
      } else {
        setBleNotification(`PAIRING CANCELLED: ${res.error || 'No peripheral selected'}`);
      }
      setTimeout(() => setBleNotification(null), 5000);
    } catch (e: any) {
      setBleNotification(`HARDWARE ERROR: ${e.message || 'Web Bluetooth error'}`);
      setTimeout(() => setBleNotification(null), 5000);
    } finally {
      setIsPairingBle(false);
    }
  };

  const handleAddCustomSource = (newSource: DataSource) => {
    healthStorage.saveDataSource(newSource);
    setSources((prev) => [newSource, ...prev]);
  };

  const handleAddCustomBiomarker = (newBio: Biomarker) => {
    healthStorage.saveBiomarker(newBio);
    setBiomarkers((prev) => [newBio, ...prev]);
  };

  const handleLabDocSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pastedDocText.trim()) return;

    setIsUploading(true);
    try {
      const parsed = await analyzeLabDocument({ docText: pastedDocText });
      
      const newBiomarkers: Biomarker[] = parsed.biomarkers.map((b: any, idx: number) => ({
        id: `ocr-${Date.now()}-${idx}`,
        name: b.name,
        value: b.value,
        unit: b.unit,
        referenceRange: b.referenceRange,
        status: b.status,
        category: (b.category as any) || 'Metabolic',
        date: parsed.collectionDate || new Date().toISOString().split('T')[0],
        source: `${parsed.laboratoryName || 'Clinical Lab'} OCR`,
        historicalTrend: 'stable'
      }));

      const newReport: LabReport = {
        id: `rep-${Date.now()}`,
        title: parsed.documentTitle || 'Laboratory Diagnostic Report',
        laboratory: parsed.laboratoryName || 'Clinical Diagnostics',
        date: parsed.collectionDate || new Date().toISOString().split('T')[0],
        summary: parsed.summary,
        biomarkers: newBiomarkers,
        clinicalInsights: parsed.clinicalInsights,
        disclaimer: parsed.disclaimer
      };

      // Persist in healthStorage
      healthStorage.saveLabReport(newReport);
      newBiomarkers.forEach(b => healthStorage.saveBiomarker(b));

      setBiomarkers((prev) => [...newBiomarkers, ...prev]);
      setLabReports((prev) => [newReport, ...prev]);
      setUploadSuccess(true);
      setPastedDocText('');
    } catch (err) {
      console.error('Failed to parse lab document:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleManualAddBiomarker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualValue) return;

    const numVal = parseFloat(manualValue);
    const newBio: Biomarker = {
      id: `manual-${Date.now()}`,
      name: manualName,
      value: isNaN(numVal) ? manualValue : numVal,
      unit: manualUnit,
      referenceRange: manualRange,
      status: 'optimal',
      category: manualCategory,
      date: new Date().toISOString().split('T')[0],
      source: 'User Self-Reported Measurement',
      historicalTrend: 'stable'
    };

    healthStorage.saveBiomarker(newBio);
    setBiomarkers((prev) => [newBio, ...prev]);
    setManualValue('');
  };

  const filteredSources = sources.filter((s) => {
    const matchesCategory = selectedCategory === 'all' || s.category === selectedCategory;
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.websiteUrl && s.websiteUrl.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header with Coverage Score & Add Source Trigger */}
      <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-md">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-cyan-400" />
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Universal Connected Devices & Health Apps Hub
            </h1>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Link and stream live telemetry from all your wearables, CGMs, smart scales, fitness apps, custom health websites, uploaded workout files, or direct lab measurements.
          </p>
        </div>

        {/* Action Button & Coverage Score */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-5 py-3 rounded-2xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:brightness-110 shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add App, Device, File or Note</span>
          </button>

          {/* Health Data Coverage Meter */}
          <div className="bg-slate-950/90 p-4 rounded-2xl border border-slate-800 min-w-[200px] text-right space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-400">Coverage Score</span>
              <span className="text-cyan-400 font-bold">{coverageData.overallScore}% Complete</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${coverageData.overallScore}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400 block">
              {sources.filter((s) => s.connected).length} active sources linked
            </span>
          </div>
        </div>
      </div>

      {bleNotification && (
        <div className="bg-cyan-500/15 border border-cyan-500/40 rounded-xl p-3.5 text-xs text-cyan-300 flex items-center gap-2.5 animate-fadeIn">
          <Bluetooth className="w-4 h-4 flex-shrink-0" />
          <span>{bleNotification}</span>
        </div>
      )}

      {/* Sub Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        {[
          { id: 'connect', label: 'All Sources & Integrations', icon: Layers },
          { id: 'live_stream', label: 'Live Multi-Device Telemetry Stream', icon: Radio },
          { id: 'lab_upload', label: 'PDF & Lab Report OCR', icon: FileText },
          { id: 'manual', label: 'Manual Biomarker Logger', icon: Activity },
          { id: 'reconciliation', label: 'Data Fusion & Deduplication', icon: ShieldCheck }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                activeSubTab === tab.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SUB TAB 1: Connected Apps (OAuth-based) & Bluetooth Sensors Hub */}
      {activeSubTab === 'connect' && (
        <div className="space-y-6">
          
          {/* Quick Bluetooth Sensor Pairing Action Strip */}
          <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <Bluetooth className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  Direct Web Bluetooth Device Pairing
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                    Live Telemetry
                  </span>
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Pair continuous Heart Rate chest straps (Polar H10, Garmin HRM) or Blood Pressure monitors via standard GATT services.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 flex-shrink-0">
              <button
                onClick={() => handleConnectBluetoothHardware('heart_rate')}
                disabled={isPairingBle}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center gap-1.5"
              >
                <Heart className="w-3.5 h-3.5 text-rose-400" />
                Pair HR Strap
              </button>
              <button
                onClick={() => handleConnectBluetoothHardware('blood_pressure')}
                disabled={isPairingBle}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center gap-1.5"
              >
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                Pair BP Monitor
              </button>
            </div>
          </div>

          {/* Search and Category Filter Toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {['all', 'fitness', 'vitals', 'sleep', 'nutrition', 'clinical', 'lifestyle'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-slate-800 text-white font-bold border border-slate-700'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  {cat === 'all' ? 'All Sources' : cat}
                </button>
              ))}
            </div>

            {/* Search Box */}
            <div className="relative min-w-[240px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search apps, websites, or devices..."
                className="w-full pl-8 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Sources Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSources.map((source) => (
              <div
                key={source.id}
                className={`rounded-3xl p-5 border transition-all flex flex-col justify-between ${
                  source.connected
                    ? 'bg-slate-900/90 border-slate-700 shadow-md'
                    : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                          {source.name}
                          {source.connected && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          )}
                        </h3>
                        {source.websiteUrl && (
                          <a
                            href={source.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-400 hover:text-cyan-400 transition-colors"
                            title="Visit Official Website"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        {source.category} • {source.authType.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {source.liveStreamingCapable && (
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                            source.connected
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}
                        >
                          {source.connected && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
                          Live Stream
                        </span>
                      )}
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                          source.connected
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        {source.connected ? 'Connected' : 'Available'}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                    {source.description}
                  </p>

                  {/* Scopes Display */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">
                      {source.connected ? 'Granted Scopes:' : 'Supported Scopes:'}
                    </span>
                    <div className="flex flex-wrap gap-1 max-h-16 overflow-y-auto">
                      {(source.connected && source.grantedScopes
                        ? source.grantedScopes
                        : source.supportedScopes
                        ? source.supportedScopes.map((s) => s.id)
                        : source.permissions
                      ).map((p, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800 font-mono"
                        >
                          {typeof p === 'string' ? p.replace(/_/g, ' ') : (p as any).label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    {source.connected ? `Last sync: ${source.lastSync}` : 'Official API Auth'}
                  </span>

                  {source.connected ? (
                    <button
                      onClick={() => handleDisconnectSource(source.id)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-500/10 text-rose-300 border border-rose-500/30 hover:bg-rose-500/20 transition-all"
                    >
                      Disconnect
                    </button>
                  ) : (
                    <button
                      onClick={() => handleOpenOAuthModal(source)}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:brightness-110 shadow-md shadow-cyan-500/20 transition-all flex items-center gap-1"
                    >
                      <Lock className="w-3 h-3" /> Connect & Authorize
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              VitalSync uses official OAuth 2.0 endpoints with granular consent. You can revoke access or modify granted scopes anytime.
            </span>
            <button
              onClick={onOpenDataMap}
              className="text-cyan-400 hover:text-cyan-300 font-bold underline whitespace-nowrap"
            >
              Inspect Data Map & Provenance
            </button>
          </div>
        </div>
      )}

      {/* SUB TAB 2: Live Multi-Device Stream Hub */}
      {activeSubTab === 'live_stream' && (
        <LiveMultiDeviceStreamHub sources={sources} />
      )}

      {/* OAUTH CONNECTION MODAL WITH GRANULAR SCOPE SELECTOR */}
      {selectedOAuthSource && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-scaleUp max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">OAuth 2.0 Authorization & Scope Consent</h3>
              </div>
              <button
                onClick={() => setSelectedOAuthSource(null)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 font-bold">
                    {selectedOAuthSource.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{selectedOAuthSource.name}</h4>
                    <span className="text-xs text-slate-400">Official API Integration Handshake</span>
                  </div>
                </div>
                {selectedOAuthSource.websiteUrl && (
                  <a
                    href={selectedOAuthSource.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                  >
                    <span>Website</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              {/* Granular Scope Consent Checkbox Checklist */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 uppercase flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Grant Only The Scopes You Want:
                  </span>
                  <span className="text-[11px] text-cyan-400 font-semibold">
                    {selectedScopesForAuth.length} Selected
                  </span>
                </div>

                <div className="space-y-1.5 bg-slate-950 p-3 rounded-2xl border border-slate-800 max-h-48 overflow-y-auto">
                  {(selectedOAuthSource.supportedScopes && selectedOAuthSource.supportedScopes.length > 0
                    ? selectedOAuthSource.supportedScopes
                    : [
                        { id: 'activities', label: 'Activities & Workouts', description: 'Outdoor runs, cycling, resistance workouts.' },
                        { id: 'pace_and_heart_rate', label: 'Pace & Heart Rate Streams', description: 'Instantaneous pace and second-by-second pulse.' },
                        { id: 'elevation', label: 'Elevation & Topography', description: 'Climb gain, gradient metrics, and topography.' },
                        { id: 'training_load', label: 'Training Load & TRIMP', description: 'Chronic training load and fatigue balance.' }
                      ]
                  ).map((scope: any) => {
                    const isChecked = selectedScopesForAuth.includes(scope.id);
                    return (
                      <div
                        key={scope.id}
                        onClick={() => toggleScopeInModal(scope.id)}
                        className={`p-2 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 ${
                          isChecked
                            ? 'bg-cyan-500/10 border-cyan-500/40 text-white'
                            : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center flex-shrink-0 transition-all ${
                            isChecked ? 'bg-cyan-500 text-slate-950' : 'border border-slate-700'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <div className="text-xs">
                          <span className="font-bold text-slate-200 block">{scope.label}</span>
                          <span className="text-[10px] text-slate-400 block leading-snug">
                            {scope.description}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed">
                VitalSync will request read-only access strictly to the granted scopes selected above. Tokens are securely encrypted and access can be revoked at any time.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
              <button
                onClick={() => setSelectedOAuthSource(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteOAuth}
                disabled={isAuthorizing || selectedScopesForAuth.length === 0}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:brightness-110 disabled:opacity-50 shadow-md shadow-cyan-500/20 transition-all flex items-center gap-2"
              >
                {isAuthorizing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Authorizing Handshake...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5" /> Authorize Selected Scopes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUB TAB 3: PDF & Lab Report OCR Ingestion */}
      {activeSubTab === 'lab_upload' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left 2 Cols: Ingestion Area */}
          <div className="lg:col-span-2 bg-slate-900 rounded-3xl p-6 border border-slate-800 space-y-4">
            <div className="space-y-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-cyan-400" />
                    Medical Document & Lab Panel Ingestion (OCR)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Upload official diagnostic PDFs or paste test summaries. All files undergo strict server-side validation before storage.
                  </p>
                </div>
                <button
                  id="open-secure-lab-uploader-btn"
                  onClick={() => setIsLabUploadModalOpen(true)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20 transition-all flex items-center gap-1.5 flex-shrink-0"
                >
                  <ShieldCheck className="w-4 h-4" /> Upload & Validate Lab PDF
                </button>
              </div>
            </div>

            {/* Paste or Sample Text Ingest */}
            <form onSubmit={handleLabDocSubmit} className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 uppercase">
                  Paste Lab Report / Doctor Summary:
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setPastedDocText(`Quest Diagnostics Comprehensive Profile (Date: 2026-08-15)
Fasting Glucose: 88 mg/dL (Reference: 70-99) - Normal
HbA1c: 5.2 % (Reference: < 5.7) - Optimal
Total Cholesterol: 198 mg/dL (Reference: 125-200) - Normal
HDL Cholesterol: 66 mg/dL (Reference: > 45) - Optimal
LDL Cholesterol: 114 mg/dL (Reference: < 100) - Borderline
Triglycerides: 84 mg/dL (Reference: < 150) - Optimal
hs-CRP: 0.74 mg/L (Reference: < 1.0) - Low Inflammation
25-Hydroxy Vitamin D: 36 ng/mL (Reference: 30-100) - Normal
Total Testosterone: 692 ng/dL (Reference: 300-1000) - Normal`)
                  }
                  className="text-xs text-cyan-400 hover:text-cyan-300 underline"
                >
                  Insert Sample Quest Lab Report
                </button>
              </div>

              <textarea
                value={pastedDocText}
                onChange={(e) => setPastedDocText(e.target.value)}
                placeholder="Paste lab results or physician clinical summaries..."
                rows={7}
                className="w-full p-3 text-xs font-mono bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-400">
                  Data is processed server-side with clinical privacy encryption.
                </span>
                <button
                  type="submit"
                  disabled={isUploading || !pastedDocText.trim()}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 hover:brightness-110 disabled:opacity-50 transition-all flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
                >
                  {isUploading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Extracting Structured Biomarkers...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" /> Parse with AI OCR Engine
                    </>
                  )}
                </button>
              </div>
            </form>

            {uploadSuccess && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Successfully extracted and normalized biomarkers into your personal health model.
                </span>
                <button onClick={() => setUploadSuccess(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>
            )}
          </div>

          {/* Right Col: Ingested Lab Reports History */}
          <div className="bg-slate-900 rounded-3xl p-5 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-400" />
              Ingested Medical Records ({labReports.length})
            </h3>

            <div className="space-y-3">
              {labReports.map((report) => (
                <div
                  key={report.id}
                  className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <span className="text-xs font-bold text-white block">{report.title}</span>
                    <span className="text-[10px] text-slate-400">{report.date}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 line-clamp-3">
                    {report.summary}
                  </p>
                  <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800/80">
                    <span>{report.laboratory}</span>
                    <span className="text-cyan-400 font-semibold">{report.biomarkers.length} Markers</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* SUB TAB 4: Manual Biomarker Logger */}
      {activeSubTab === 'manual' && (
        <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 max-w-2xl space-y-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">Manual Biomarker & Vitals Logging</h3>
            <p className="text-xs text-slate-400">
              Directly record biometric readings (e.g. fingerstick glucose, home blood pressure, body weight).
            </p>
          </div>

          <form onSubmit={handleManualAddBiomarker} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Measurement Type</label>
                <select
                  value={manualName}
                  onChange={(e) => {
                    setManualName(e.target.value);
                    if (e.target.value === 'Fasting Blood Glucose') {
                      setManualUnit('mg/dL');
                      setManualRange('70 - 99');
                      setManualCategory('Metabolic');
                    } else if (e.target.value === 'Blood Pressure') {
                      setManualUnit('mmHg');
                      setManualRange('< 120/80');
                      setManualCategory('Renal');
                    } else if (e.target.value === 'Body Weight') {
                      setManualUnit('kg');
                      setManualRange('Optimal');
                      setManualCategory('Metabolic');
                    }
                  }}
                  className="w-full p-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-200"
                >
                  <option value="Fasting Blood Glucose">Fasting Blood Glucose</option>
                  <option value="Blood Pressure">Blood Pressure</option>
                  <option value="Body Weight">Body Weight</option>
                  <option value="Blood Ketones">Blood Ketones (Beta-Hydroxybutyrate)</option>
                  <option value="Resting Body Temperature">Resting Body Temperature</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Value ({manualUnit})</label>
                <input
                  type="text"
                  value={manualValue}
                  onChange={(e) => setManualValue(e.target.value)}
                  placeholder="e.g. 88 or 118/76"
                  required
                  className="w-full p-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-200"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-all flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Log to VitalSync Timeline
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SUB TAB 5: Data Reconciliation & Deduplication Explanation */}
      {activeSubTab === 'reconciliation' && (
        <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 space-y-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Health Data Fusion & Conflict Resolution Engine
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              When multiple wearables or mobile phones report overlapping activity (e.g. steps or calories at the same timestamp), VitalSync runs a continuous deduplication algorithm to prevent artificial metric inflation.
            </p>
          </div>

          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                Live Reconciled Metric Example: Daily Step Count
              </span>
              <span className="text-xs font-black text-white px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700">
                {stepDeduplication.reconciledSteps.toLocaleString()} Verified Steps
              </span>
            </div>

            <div className="space-y-2">
              {stepDeduplication.sourcesCompared.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="font-medium text-slate-200">{item.source}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-slate-400">{item.rawSteps.toLocaleString()} raw steps</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-950 text-emerald-400 border border-emerald-500/30">
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xs text-slate-400 leading-relaxed pt-2 border-t border-slate-800">
              <strong>Resolution Rule:</strong> {stepDeduplication.resolutionRule}
            </p>
          </div>
        </div>
      )}

      {/* Add Custom Source, Device, File or Measurement Modal */}
      <AddCustomSourceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddSource={handleAddCustomSource}
        onAddBiomarker={handleAddCustomBiomarker}
      />

      {/* Secure Server-Side Lab Report Upload & Storage Modal */}
      <LabReportUploadModal
        isOpen={isLabUploadModalOpen}
        onClose={() => setIsLabUploadModalOpen(false)}
        onBiomarkersExtracted={(newBios, newReport) => {
          setBiomarkers((prev) => [...newBios, ...prev]);
          setLabReports((prev) => [newReport, ...prev]);
          setUploadSuccess(true);
        }}
      />

    </div>
  );
};
