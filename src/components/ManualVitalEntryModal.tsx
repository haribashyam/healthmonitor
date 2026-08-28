import React, { useState } from 'react';
import { healthStorage, UserVitalsLog } from '../utils/storage';
import {
  Heart,
  Activity,
  Droplet,
  Wind,
  Scale,
  Moon,
  X,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  Calendar,
  Clock,
  FileText
} from 'lucide-react';

interface ManualVitalEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: UserVitalsLog['type'];
  theme?: 'dark' | 'light';
  onVitalSaved?: (vital: UserVitalsLog) => void;
}

export const ManualVitalEntryModal: React.FC<ManualVitalEntryModalProps> = ({
  isOpen,
  onClose,
  defaultType = 'heart_rate',
  theme = 'dark',
  onVitalSaved
}) => {
  const isDark = theme === 'dark';
  const [vitalType, setVitalType] = useState<UserVitalsLog['type']>(defaultType);
  const [value, setValue] = useState<string>('');
  const [secondaryValue, setSecondaryValue] = useState<string>(''); // For BP diastolic
  const [notes, setNotes] = useState<string>('');
  const [isEstimated, setIsEstimated] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const vitalTypes: { id: UserVitalsLog['type']; label: string; icon: any; unit: string; placeholder: string; isDual?: boolean }[] = [
    { id: 'heart_rate', label: 'Heart Rate', icon: Heart, unit: 'BPM', placeholder: 'e.g. 68' },
    { id: 'blood_pressure', label: 'Blood Pressure', icon: Activity, unit: 'mmHg', placeholder: 'Systolic (e.g. 118)', isDual: true },
    { id: 'glucose', label: 'Blood Glucose', icon: Droplet, unit: 'mg/dL', placeholder: 'e.g. 92' },
    { id: 'spo2', label: 'Oxygen Saturation (SpO2)', icon: Wind, unit: '%', placeholder: 'e.g. 98' },
    { id: 'weight', label: 'Body Weight', icon: Scale, unit: 'kg', placeholder: 'e.g. 74.5' },
    { id: 'hrv', label: 'Heart Rate Variability (rMSSD)', icon: Activity, unit: 'ms', placeholder: 'e.g. 62' }
  ];

  const currentConfig = vitalTypes.find(t => t.id === vitalType) || vitalTypes[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const numVal = parseFloat(value);
    if (isNaN(numVal) || numVal <= 0) {
      setError(`Please enter a valid numeric value for ${currentConfig.label}.`);
      return;
    }

    let numSecVal: number | undefined;
    if (currentConfig.isDual) {
      numSecVal = parseFloat(secondaryValue);
      if (isNaN(numSecVal) || numSecVal <= 0) {
        setError('Please enter a valid diastolic blood pressure value (e.g. 78).');
        return;
      }
    }

    try {
      const saved = healthStorage.saveVital({
        type: vitalType,
        value: numVal,
        secondaryValue: numSecVal,
        unit: currentConfig.unit,
        notes: notes.trim() || undefined,
        source: 'Manual Patient Entry',
        isEstimated
      });

      setSuccess(true);
      if (onVitalSaved) onVitalSaved(saved);

      setTimeout(() => {
        setSuccess(false);
        setValue('');
        setSecondaryValue('');
        setNotes('');
        onClose();
      }, 900);
    } catch (err: any) {
      setError(err.message || 'Failed to record vital sign.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className={`w-full max-w-lg border rounded-none ${isDark ? 'bg-[#141414] border-[#262626] text-zinc-100' : 'bg-[#FFFFFF] border-[#D4D4CE] text-zinc-900'} shadow-2xl overflow-hidden`}>
        {/* Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between ${isDark ? 'border-zinc-800 bg-zinc-900/50' : 'border-zinc-200 bg-zinc-50'}`}>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#CC0000]/10 text-[#CC0000]">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base tracking-tight uppercase font-mono">Log Authentic Health Reading</h3>
              <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>Direct user data input stored securely in local database</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-zinc-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Select Vital Type */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase text-zinc-400 mb-2">
              Select Metric Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {vitalTypes.map((item) => {
                const Icon = item.icon;
                const isSelected = vitalType === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setVitalType(item.id);
                      setValue('');
                      setSecondaryValue('');
                      setError(null);
                    }}
                    className={`p-2.5 text-left border flex flex-col gap-1.5 transition-all text-xs ${
                      isSelected
                        ? 'border-[#CC0000] bg-[#CC0000]/10 text-white font-bold'
                        : isDark ? 'border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:bg-zinc-800' : 'border-zinc-200 bg-zinc-50 text-zinc-600 hover:bg-zinc-100'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-[#CC0000]' : 'text-zinc-400'}`} />
                    <span className="font-mono truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Value Input */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-mono font-bold uppercase text-zinc-400">
                {currentConfig.label} Value ({currentConfig.unit})
              </label>
              <label className="flex items-center gap-1.5 text-xs font-sans text-zinc-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isEstimated}
                  onChange={(e) => setIsEstimated(e.target.checked)}
                  className="rounded-none border-zinc-700 text-red-600 focus:ring-0"
                />
                <span>Mark as Estimated Reading</span>
              </label>
            </div>

            {!currentConfig.isDual ? (
              <div className="relative">
                <input
                  type="number"
                  step="any"
                  required
                  placeholder={currentConfig.placeholder}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className={`w-full px-3.5 py-2.5 text-base font-mono border ${
                    isDark ? 'bg-zinc-900 border-zinc-700 text-zinc-100' : 'bg-zinc-50 border-zinc-300 text-zinc-900'
                  } outline-none focus:border-red-500`}
                />
                <span className="absolute right-3.5 top-3 text-xs font-mono text-zinc-500 uppercase">
                  {currentConfig.unit}
                </span>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[11px] text-zinc-400 block mb-1 font-mono">Systolic (Top)</span>
                  <input
                    type="number"
                    step="any"
                    required
                    placeholder="118"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className={`w-full px-3 py-2 text-base font-mono border ${
                      isDark ? 'bg-zinc-900 border-zinc-700 text-zinc-100' : 'bg-zinc-50 border-zinc-300 text-zinc-900'
                    } outline-none focus:border-red-500`}
                  />
                </div>
                <div>
                  <span className="text-[11px] text-zinc-400 block mb-1 font-mono">Diastolic (Bottom)</span>
                  <input
                    type="number"
                    step="any"
                    required
                    placeholder="78"
                    value={secondaryValue}
                    onChange={(e) => setSecondaryValue(e.target.value)}
                    className={`w-full px-3 py-2 text-base font-mono border ${
                      isDark ? 'bg-zinc-900 border-zinc-700 text-zinc-100' : 'bg-zinc-50 border-zinc-300 text-zinc-900'
                    } outline-none focus:border-red-500`}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Notes / Clinical Context */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase text-zinc-400 mb-1">
              Context Notes (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Fasting 12h, Post-workout, Resting on couch"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className={`w-full px-3 py-2 text-xs font-sans border ${
                isDark ? 'bg-zinc-900 border-zinc-700 text-zinc-100' : 'bg-zinc-50 border-zinc-300 text-zinc-900'
              } outline-none focus:border-red-500`}
            />
          </div>

          {/* Error / Success alert */}
          {error && (
            <div className="p-3 bg-red-950/30 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 bg-emerald-950/30 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
              <span>Reading stored successfully in patient database!</span>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 text-xs font-mono font-semibold uppercase ${
                isDark ? 'text-zinc-400 hover:text-zinc-200' : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-mono font-bold uppercase tracking-wider bg-[#CC0000] text-white hover:bg-red-700 transition-colors shadow-sm flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              Save Reading
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
