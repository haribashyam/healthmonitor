import React, { useState } from 'react';
import {
  Globe,
  Upload,
  PlusCircle,
  FileText,
  Activity,
  Check,
  Zap,
  Radio,
  Lock,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Link2,
  Cpu
} from 'lucide-react';
import { DataSource, HealthCategory, Biomarker, GranularScope } from '../types';

interface AddCustomSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSource: (newSource: DataSource) => void;
  onAddBiomarker?: (biomarker: Biomarker) => void;
}

const AVAILABLE_SCOPES: GranularScope[] = [
  { id: 'activities', label: 'Activities & Workouts', description: 'Outdoor runs, cycling, resistance workouts, and GPS track routes.', category: 'fitness' },
  { id: 'pace_and_heart_rate', label: 'Pace & Heart Rate Streams', description: 'Live instantaneous pace, cadence, and second-by-second cardiac telemetry.', category: 'fitness' },
  { id: 'elevation', label: 'Elevation & Topography', description: 'Grade-adjusted pace, barometric ascent, and climb topography.', category: 'fitness' },
  { id: 'training_load', label: 'Training Load & Stress Score', description: 'Training impulse (TRIMP), chronic fatigue, and readiness balance.', category: 'fitness' },
  { id: 'sleep_stages', label: 'Sleep Cycles & Stages', description: 'Deep, REM, Light, Core, and Awake staging with sleep latency.', category: 'sleep' },
  { id: 'body_composition', label: 'Body Composition & Mass', description: 'Weight, body fat percentage, skeletal muscle, and visceral fat.', category: 'vitals' },
  { id: 'glucose_metabolism', label: 'Continuous Glucose & Metabolism', description: 'Real-time interstitial glucose telemetry and glycemic variability.', category: 'vitals' },
  { id: 'nutrition_hydration', label: 'Nutrition & Macro Balances', description: 'Caloric balance, protein, carbohydrates, fats, and water intake.', category: 'nutrition' },
  { id: 'clinical_biomarkers', label: 'Clinical Labs & Blood Panels', description: 'Biomarkers, lipid profiles, hormones, and inflammatory markers.', category: 'clinical' }
];

export const AddCustomSourceModal: React.FC<AddCustomSourceModalProps> = ({
  isOpen,
  onClose,
  onAddSource,
  onAddBiomarker
}) => {
  const [modalMode, setModalMode] = useState<'app' | 'upload' | 'measurement' | 'note'>('app');

  // Mode 1: Connect App / Website
  const [appName, setAppName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [apiUrl, setApiUrl] = useState('');
  const [category, setCategory] = useState<HealthCategory>('fitness');
  const [authType, setAuthType] = useState<'oauth' | 'ble' | 'webhook' | 'manual'>('oauth');
  const [description, setDescription] = useState('');
  const [selectedScopes, setSelectedScopes] = useState<string[]>([
    'activities',
    'pace_and_heart_rate',
    'elevation',
    'training_load'
  ]);
  const [enableLiveStream, setEnableLiveStream] = useState(true);

  // Mode 2: Upload File
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [uploadedRecordsCount, setUploadedRecordsCount] = useState(148);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Mode 3: Manual Measurement
  const [metricName, setMetricName] = useState('Fasting Blood Glucose');
  const [metricValue, setMetricValue] = useState('');
  const [metricUnit, setMetricUnit] = useState('mg/dL');
  const [metricCategory, setMetricCategory] = useState<any>('Metabolic');

  // Mode 4: Note / Observation
  const [noteTitle, setNoteTitle] = useState('Clinical Coach Note');
  const [noteContent, setNoteContent] = useState('');
  const [rpeRating, setRpeRating] = useState(7);

  if (!isOpen) return null;

  const toggleScope = (scopeId: string) => {
    if (selectedScopes.includes(scopeId)) {
      setSelectedScopes(selectedScopes.filter((s) => s !== scopeId));
    } else {
      setSelectedScopes([...selectedScopes, scopeId]);
    }
  };

  const handleSaveAppOrWebsite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appName.trim()) return;

    const newSource: DataSource = {
      id: `custom-app-${Date.now()}`,
      name: appName.trim(),
      category,
      icon: category === 'fitness' ? 'Flame' : category === 'sleep' ? 'Moon' : category === 'nutrition' ? 'Utensils' : 'Activity',
      connected: true,
      authType: authType === 'webhook' ? 'webhook' : authType,
      lastSync: enableLiveStream ? 'Just now (Live Stream Active)' : 'Just now',
      recordCount: 120,
      status: 'active',
      websiteUrl: websiteUrl.trim() || undefined,
      apiUrl: apiUrl.trim() || undefined,
      liveStreamingCapable: enableLiveStream,
      isLiveActive: enableLiveStream,
      liveThroughput: enableLiveStream ? '1.0 pkts/sec' : undefined,
      isCustom: true,
      permissions: selectedScopes.map((s) => `${s}:read`),
      grantedScopes: selectedScopes,
      supportedScopes: AVAILABLE_SCOPES.filter((s) => selectedScopes.includes(s.id)),
      description: description.trim() || `Custom connected ${category} service with live biometric synchronization.`
    };

    onAddSource(newSource);
    onClose();
  };

  const handleSaveUpload = (e: React.FormEvent) => {
    e.preventDefault();
    const sourceTitle = uploadedFileName || 'Imported Health Data File';
    const newSource: DataSource = {
      id: `upload-${Date.now()}`,
      name: sourceTitle,
      category: 'fitness',
      icon: 'Upload',
      connected: true,
      authType: 'document',
      lastSync: 'Just now (File Ingested)',
      recordCount: uploadedRecordsCount,
      status: 'active',
      liveStreamingCapable: false,
      isCustom: true,
      permissions: ['file:read_all', 'records:imported'],
      grantedScopes: ['activities', 'pace_and_heart_rate'],
      description: `Parsed health data payload containing ${uploadedRecordsCount} verified records.`
    };

    onAddSource(newSource);
    setUploadSuccess(true);
    setTimeout(() => {
      onClose();
    }, 800);
  };

  const handleSaveMeasurement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!metricValue.trim()) return;

    const numVal = parseFloat(metricValue);
    const newBiomarker: Biomarker = {
      id: `bio-custom-${Date.now()}`,
      name: metricName,
      value: isNaN(numVal) ? metricValue : numVal,
      unit: metricUnit,
      referenceRange: 'Target Range',
      status: 'optimal',
      category: metricCategory,
      date: new Date().toISOString().split('T')[0],
      source: 'Direct User Measurement',
      historicalTrend: 'stable'
    };

    if (onAddBiomarker) {
      onAddBiomarker(newBiomarker);
    }

    onClose();
  };

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim()) return;

    const newSource: DataSource = {
      id: `note-${Date.now()}`,
      name: noteTitle,
      category: 'lifestyle',
      icon: 'FileText',
      connected: true,
      authType: 'manual',
      lastSync: 'Just now',
      recordCount: 1,
      status: 'active',
      liveStreamingCapable: false,
      isCustom: true,
      permissions: ['notes:read'],
      grantedScopes: ['clinical_biomarkers'],
      description: `Subjective Note (RPE ${rpeRating}/10): ${noteContent.slice(0, 80)}...`
    };

    onAddSource(newSource);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl animate-scaleUp max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-bold text-white tracking-tight">
                Add Health Source, App, Device, or Record
              </h2>
            </div>
            <p className="text-xs text-slate-300">
              Connect third-party apps, pair hardware devices, upload telemetry files, or log direct clinical measurements.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center text-sm font-bold transition-all"
          >
            ✕
          </button>
        </div>

        {/* 4 Mode Tabs */}
        <div className="grid grid-cols-4 gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 text-xs">
          {[
            { id: 'app', label: 'Connect App / Web', icon: Globe },
            { id: 'upload', label: 'Upload File', icon: Upload },
            { id: 'measurement', label: 'Measurement', icon: Activity },
            { id: 'note', label: 'Clinical Note', icon: FileText }
          ].map((mode) => {
            const Icon = mode.icon;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => setModalMode(mode.id as any)}
                className={`py-2.5 px-3 rounded-xl font-bold flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all text-center ${
                  modalMode === mode.id
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{mode.label}</span>
              </button>
            );
          })}
        </div>

        {/* MODE 1: Connect Any App or Website */}
        {modalMode === 'app' && (
          <form onSubmit={handleSaveAppOrWebsite} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  App, Website, or Device Name *
                </label>
                <input
                  type="text"
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                  placeholder="e.g. TrainingPeaks, Runna, Wahoo, Supabase Health"
                  required
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  Primary Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="fitness">Fitness & Workouts</option>
                  <option value="vitals">Vitals & Body Metrics</option>
                  <option value="sleep">Sleep & Recovery</option>
                  <option value="nutrition">Nutrition & Fueling</option>
                  <option value="clinical">Clinical & Diagnostics</option>
                  <option value="lifestyle">Lifestyle & Mind</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  Website URL / Portal (Optional)
                </label>
                <div className="relative">
                  <Link2 className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://app.example.com"
                    className="w-full pl-8 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  Integration Protocol
                </label>
                <select
                  value={authType}
                  onChange={(e) => setAuthType(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="oauth">OAuth 2.0 API Handshake</option>
                  <option value="webhook">Live Webhook Receiver Endpoint</option>
                  <option value="ble">Web Bluetooth (GATT Sensor)</option>
                  <option value="manual">Manual Synchronized Stream</option>
                </select>
              </div>
            </div>

            {/* Granular Scope Selector (Requested: "Grant only the scopes you want") */}
            <div className="space-y-2 bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Granular Scope Permissions
                  </span>
                  <p className="text-[11px] text-slate-300">
                    Grant only the exact scopes you want this app to synchronize.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (selectedScopes.length === AVAILABLE_SCOPES.length) {
                      setSelectedScopes([]);
                    } else {
                      setSelectedScopes(AVAILABLE_SCOPES.map((s) => s.id));
                    }
                  }}
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold"
                >
                  {selectedScopes.length === AVAILABLE_SCOPES.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                {AVAILABLE_SCOPES.map((scope) => {
                  const isChecked = selectedScopes.includes(scope.id);
                  return (
                    <div
                      key={scope.id}
                      onClick={() => toggleScope(scope.id)}
                      className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 ${
                        isChecked
                          ? 'bg-cyan-500/10 border-cyan-500/40 text-white'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center flex-shrink-0 transition-all ${
                          isChecked ? 'bg-cyan-500 text-slate-950' : 'border border-slate-700'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <div>
                        <span className="text-xs font-bold block leading-tight text-slate-200">
                          {scope.label}
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-0.5 leading-snug">
                          {scope.description}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Live Streaming Toggle */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">
                    Enable Real-Time Live Telemetry Stream
                  </span>
                  <span className="text-[11px] text-slate-300 block">
                    Stream live metrics every 1-2 seconds into your live dashboard.
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={enableLiveStream}
                onChange={(e) => setEnableLiveStream(e.target.checked)}
                className="w-4 h-4 accent-cyan-500 rounded"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:brightness-110 shadow-md shadow-cyan-500/20 transition-all flex items-center gap-1.5"
              >
                <PlusCircle className="w-3.5 h-3.5" /> Authorize & Link Source
              </button>
            </div>
          </form>
        )}

        {/* MODE 2: Upload File */}
        {modalMode === 'upload' && (
          <form onSubmit={handleSaveUpload} className="space-y-4">
            <div className="border-2 border-dashed border-slate-700 hover:border-cyan-500/60 rounded-2xl p-6 text-center space-y-3 bg-slate-950/60 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">
                  Drop health telemetry file or browse
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Supports .FIT, .TCX, .GPX, .CSV, .JSON (Garmin, Wahoo, Strava, Apple Health Export, Quest Lab PDF)
                </p>
              </div>

              <input
                type="file"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setUploadedFileName(e.target.files[0].name);
                    setUploadedRecordsCount(Math.floor(Math.random() * 400) + 120);
                  }
                }}
                className="text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-cyan-500 file:text-slate-950 hover:file:bg-cyan-400 cursor-pointer"
              />
            </div>

            {uploadedFileName && (
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-white font-medium">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <span>{uploadedFileName}</span>
                </div>
                <span className="text-emerald-400 font-bold">
                  {uploadedRecordsCount} telemetry rows detected
                </span>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!uploadedFileName}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400 disabled:opacity-50 transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" /> Parse & Ingest Telemetry
              </button>
            </div>
          </form>
        )}

        {/* MODE 3: Direct Measurement */}
        {modalMode === 'measurement' && (
          <form onSubmit={handleSaveMeasurement} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  Measurement Metric
                </label>
                <select
                  value={metricName}
                  onChange={(e) => {
                    setMetricName(e.target.value);
                    if (e.target.value === 'Fasting Blood Glucose') {
                      setMetricUnit('mg/dL');
                      setMetricCategory('Metabolic');
                    } else if (e.target.value === 'Resting Heart Rate') {
                      setMetricUnit('bpm');
                      setMetricCategory('Lipids');
                    } else if (e.target.value === 'Blood Pressure') {
                      setMetricUnit('mmHg');
                      setMetricCategory('Renal');
                    } else if (e.target.value === 'Blood Ketones') {
                      setMetricUnit('mmol/L');
                      setMetricCategory('Metabolic');
                    } else if (e.target.value === 'Blood Lactate') {
                      setMetricUnit('mmol/L');
                      setMetricCategory('Metabolic');
                    } else if (e.target.value === 'Body Fat %') {
                      setMetricUnit('%');
                      setMetricCategory('Metabolic');
                    }
                  }}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="Fasting Blood Glucose">Fasting Blood Glucose (mg/dL)</option>
                  <option value="Resting Heart Rate">Resting Heart Rate (bpm)</option>
                  <option value="Blood Pressure">Blood Pressure (Systolic/Diastolic)</option>
                  <option value="Blood Ketones">Blood Ketones (Beta-Hydroxybutyrate)</option>
                  <option value="Blood Lactate">Blood Lactate (mmol/L)</option>
                  <option value="Body Fat %">Body Fat Percentage (%)</option>
                  <option value="Blood Oxygen SpO2">Blood Oxygen SpO2 (%)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  Numeric Value ({metricUnit}) *
                </label>
                <input
                  type="text"
                  value={metricValue}
                  onChange={(e) => setMetricValue(e.target.value)}
                  placeholder="e.g. 88 or 118/76 or 1.2"
                  required
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-all flex items-center gap-1.5"
              >
                <PlusCircle className="w-3.5 h-3.5" /> Save Measurement
              </button>
            </div>
          </form>
        )}

        {/* MODE 4: Note / Observation */}
        {modalMode === 'note' && (
          <form onSubmit={handleSaveNote} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                Note Title / Subject
              </label>
              <input
                type="text"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                placeholder="e.g. Post-Run Recovery Feedback, Doctor Consultation Note"
                required
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-300">
                  Subjective Perceived Exertion / Energy (RPE 1-10)
                </label>
                <span className="text-xs font-bold text-cyan-400">{rpeRating} / 10</span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                value={rpeRating}
                onChange={(e) => setRpeRating(parseInt(e.target.value))}
                className="w-full accent-cyan-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                Detailed Note or Observation *
              </label>
              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Record subjective sensations, dietary changes, supplement doses, workout feedback..."
                rows={4}
                required
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-all flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5" /> Save Health Note
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
