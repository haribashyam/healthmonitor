import React, { useState, useEffect } from 'react';
import {
  Heart,
  Moon,
  Activity,
  Flame,
  ShieldCheck,
  Zap,
  TrendingUp,
  Radio,
  Sparkles,
  ChevronRight,
  Plus,
  Bluetooth,
  HelpCircle,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Check
} from 'lucide-react';
import { SleepRecord, Activity as ActivityType, Biomarker } from '../types';
import { healthStorage, UserVitalsLog } from '../utils/storage';
import { ManualVitalEntryModal } from './ManualVitalEntryModal';
import { bluetoothManager, LiveHardwareReading, BLEConnectionState } from '../services/bluetoothService';

interface VitalSignalsProps {
  liveBpm: number;
  latestSleep?: SleepRecord;
  activities?: ActivityType[];
  biomarkers?: Biomarker[];
  bleDeviceName: string;
  isBleConnected?: boolean;
  isConnecting?: boolean;
  onNavigateTab: (tab: string) => void;
  onOpenLiveWorkout?: () => void;
  theme?: 'dark' | 'light';
}

export const VitalSignals: React.FC<VitalSignalsProps> = ({
  liveBpm,
  latestSleep,
  activities = [],
  biomarkers = [],
  bleDeviceName: initialBleDeviceName,
  isBleConnected: initialBleConnected = false,
  isConnecting: initialIsConnecting = false,
  onNavigateTab,
  onOpenLiveWorkout,
  theme = 'dark'
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'cardio' | 'recovery' | 'metabolic' | 'blood'>('all');
  const [isLogModalOpen, setIsLogModalOpen] = useState<boolean>(false);
  const [selectedLogType, setSelectedLogType] = useState<UserVitalsLog['type']>('heart_rate');
  const [userVitals, setUserVitals] = useState<UserVitalsLog[]>([]);
  const [latestHardwareReading, setLatestHardwareReading] = useState<LiveHardwareReading | null>(null);
  
  const [isBleConnected, setIsBleConnected] = useState<boolean>(initialBleConnected);
  const [isConnecting, setIsConnecting] = useState<boolean>(initialIsConnecting);
  const [bleDeviceName, setBleDeviceName] = useState<string>(initialBleDeviceName);

  const isDark = theme === 'dark';

  useEffect(() => {
    setIsBleConnected(initialBleConnected);
  }, [initialBleConnected]);

  useEffect(() => {
    setIsConnecting(initialIsConnecting);
  }, [initialIsConnecting]);

  useEffect(() => {
    setBleDeviceName(initialBleDeviceName);
  }, [initialBleDeviceName]);

  useEffect(() => {
    setUserVitals(healthStorage.getVitals());

    const handleVitalsUpdate = () => {
      setUserVitals(healthStorage.getVitals());
    };

    const unsubBLE = bluetoothManager.onData((reading) => {
      setLatestHardwareReading(reading);
    });

    const unsubConn = bluetoothManager.onConnectionChange((state: BLEConnectionState) => {
      setIsBleConnected(state.connected);
      if (state.deviceName) setBleDeviceName(state.deviceName);
      setIsConnecting(!!state.isConnecting);
    });

    window.addEventListener('vitalsUpdated', handleVitalsUpdate);
    window.addEventListener('dataPurged', handleVitalsUpdate);

    return () => {
      window.removeEventListener('vitalsUpdated', handleVitalsUpdate);
      window.removeEventListener('dataPurged', handleVitalsUpdate);
      unsubBLE();
      unsubConn();
    };
  }, []);

  const handleBluetoothAction = async () => {
    if (isConnecting) return;
    if (isBleConnected) {
      if (onOpenLiveWorkout) onOpenLiveWorkout();
    } else {
      setIsConnecting(true);
      try {
        await bluetoothManager.connectDevice('heart_rate');
      } catch (err) {
        // Handled
      } finally {
        setIsConnecting(false);
      }
    }
  };

  // Find latest user entries for each type
  const latestBP = userVitals.find(v => v.type === 'blood_pressure');
  const latestGlucose = userVitals.find(v => v.type === 'glucose');
  const latestHR = userVitals.find(v => v.type === 'heart_rate');
  const latestHRV = userVitals.find(v => v.type === 'hrv');
  const latestSpO2 = userVitals.find(v => v.type === 'spo2');

  const liveHRValue = latestHardwareReading?.heartRate || (liveBpm > 0 ? liveBpm : (latestHR ? latestHR.value : null));
  const isBLEActive = Boolean(latestHardwareReading && !latestHardwareReading.isSimulated);
  const isDemoActive = Boolean(latestHardwareReading?.isSimulated);

  const signalCards = [
    {
      id: 'hr',
      title: 'Real-Time Heart Rate',
      value: liveHRValue !== null ? `${liveHRValue}` : '--',
      unit: 'BPM',
      subtext: liveHRValue !== null 
        ? (isBLEActive ? `● Live GATT Stream: ${bleDeviceName || 'BLE Monitor'}` : isDemoActive ? `● Demo Stream Active` : `Logged: ${latestHR?.source || 'Manual entry'}`)
        : 'No sensor or log connected',
      status: liveHRValue !== null ? 'LIVE STREAM' : 'NO DATA YET',
      device: isBLEActive ? (bleDeviceName || 'BLE Sensor') : (latestHR?.source || 'Web Bluetooth / Manual Entry'),
      category: 'cardio',
      icon: Heart,
      hasData: liveHRValue !== null,
      isEstimated: Boolean(latestHR?.isEstimated),
      type: 'heart_rate' as const
    },
    {
      id: 'bp',
      title: 'Blood Pressure',
      value: latestBP ? `${latestBP.value}/${latestBP.secondaryValue || 80}` : (latestHardwareReading?.systolic ? `${latestHardwareReading.systolic}/${latestHardwareReading.diastolic}` : '--'),
      unit: 'MMHG',
      subtext: latestBP ? `Logged: ${new Date(latestBP.timestamp).toLocaleDateString()}` : (latestHardwareReading?.systolic ? '● Live GATT Cuff Stream' : 'No blood pressure reading recorded'),
      status: latestBP || latestHardwareReading?.systolic ? 'NORMOTENSIVE' : 'AWAITING ENTRY',
      device: latestBP?.source || (latestHardwareReading?.systolic ? bleDeviceName : 'Manual Log / Cuff'),
      category: 'cardio',
      icon: ShieldCheck,
      hasData: Boolean(latestBP || latestHardwareReading?.systolic),
      isEstimated: Boolean(latestBP?.isEstimated),
      type: 'blood_pressure' as const
    },
    {
      id: 'hrv',
      title: 'Heart Rate Variability',
      value: latestHRV ? `${latestHRV.value}` : (latestSleep?.hrvAvg ? `${latestSleep.hrvAvg}` : (latestHardwareReading?.rrIntervals?.[0] ? `${latestHardwareReading.rrIntervals[0]}` : '--')),
      unit: 'MS',
      subtext: latestHRV ? `Logged: ${latestHRV.source}` : (latestSleep?.hrvAvg ? 'From Sleep Tracker' : 'No HRV record available'),
      status: latestHRV || latestSleep?.hrvAvg ? 'AUTONOMIC TONE' : 'NO DATA',
      device: latestHRV?.source || (latestSleep ? 'Oura / Apple Health' : 'Manual / BLE'),
      category: 'recovery',
      icon: Activity,
      hasData: Boolean(latestHRV || latestSleep?.hrvAvg || latestHardwareReading?.rrIntervals?.length),
      isEstimated: Boolean(latestHRV?.isEstimated),
      type: 'hrv' as const
    },
    {
      id: 'cgm',
      title: 'Blood Glucose',
      value: latestGlucose ? `${latestGlucose.value}` : '--',
      unit: 'MG/DL',
      subtext: latestGlucose ? `Logged: ${latestGlucose.notes || new Date(latestGlucose.timestamp).toLocaleDateString()}` : 'Connect CGM or log fasting reading',
      status: latestGlucose ? 'GLYCEMIC INDEX' : 'NO READINGS',
      device: latestGlucose?.source || 'Dexcom / Fingerprick Log',
      category: 'metabolic',
      icon: Flame,
      hasData: Boolean(latestGlucose),
      isEstimated: Boolean(latestGlucose?.isEstimated),
      type: 'glucose' as const
    },
    {
      id: 'spo2',
      title: 'Oxygen Saturation',
      value: latestSpO2 ? `${latestSpO2.value}` : (latestHardwareReading?.spo2 ? `${latestHardwareReading.spo2}` : '--'),
      unit: '%',
      subtext: latestSpO2 ? `Recorded via ${latestSpO2.source}` : (latestHardwareReading?.spo2 ? '● BLE Pulse Oximeter' : 'No SpO2 reading logged'),
      status: latestSpO2 || latestHardwareReading?.spo2 ? 'OPTIMAL' : 'NO DATA',
      device: latestSpO2?.source || (latestHardwareReading?.spo2 ? bleDeviceName : 'Pulse Oximeter Log'),
      category: 'cardio',
      icon: ShieldCheck,
      hasData: Boolean(latestSpO2 || latestHardwareReading?.spo2),
      isEstimated: Boolean(latestSpO2?.isEstimated),
      type: 'spo2' as const
    },
    {
      id: 'sleep',
      title: 'Sleep Duration',
      value: latestSleep ? `${Math.floor(latestSleep.totalMinutes / 60)}h ${latestSleep.totalMinutes % 60}m` : '--',
      unit: '',
      subtext: latestSleep ? `Deep: ${latestSleep.deepMinutes}m • REM: ${latestSleep.remMinutes}m` : 'Connect wearable or sleep tracker',
      status: latestSleep ? `SCORE ${latestSleep.sleepScore}/100` : 'NO SLEEP DATA',
      device: latestSleep ? 'Sleep Sensor / Wearable' : 'Oura / Apple Health',
      category: 'recovery',
      icon: Moon,
      hasData: Boolean(latestSleep),
      isEstimated: false,
      type: 'heart_rate' as const
    },
    {
      id: 'crp',
      title: 'Pathology hs-CRP',
      value: biomarkers.find(b => b.name.toLowerCase().includes('crp'))?.value?.toString() || '--',
      unit: 'MG/L',
      subtext: biomarkers.find(b => b.name.toLowerCase().includes('crp')) ? 'Extracted from clinical lab report' : 'Upload pathology lab PDF in Clinician portal',
      status: biomarkers.find(b => b.name.toLowerCase().includes('crp')) ? 'VERIFIED LAB' : 'NO LAB UPLOADED',
      device: 'Clinical Lab OCR (Gemini)',
      category: 'blood',
      icon: Sparkles,
      hasData: Boolean(biomarkers.find(b => b.name.toLowerCase().includes('crp'))),
      isEstimated: false,
      type: 'heart_rate' as const
    },
    {
      id: 'trimp',
      title: 'Workout Volume',
      value: activities.length > 0 ? `${activities.reduce((acc, a) => acc + (a.calories || 0), 0)}` : '--',
      unit: 'KCAL',
      subtext: activities.length > 0 ? `${activities.length} workouts completed` : 'Start live session or log workout',
      status: activities.length > 0 ? 'ACTIVE' : 'NO SESSIONS',
      device: 'Live BLE Workout / Strava',
      category: 'metabolic',
      icon: Zap,
      hasData: activities.length > 0,
      isEstimated: true,
      type: 'heart_rate' as const
    }
  ];

  const filteredCards = signalCards.filter((c) => {
    if (selectedFilter === 'all') return true;
    return c.category === selectedFilter;
  });

  const handleOpenLogModal = (type: UserVitalsLog['type']) => {
    setSelectedLogType(type);
    setIsLogModalOpen(true);
  };

  return (
    <div className="space-y-4 select-none">
      
      {/* Section Header */}
      <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b ${isDark ? 'border-[#262626]' : 'border-[#D4D4CE]'} pb-3`}>
        <div>
          <div className="flex items-center gap-2">
            <span className={`${isDark ? 'bg-white text-[#111111]' : 'bg-[#111111] text-white'} px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest`}>
              AUTHENTIC TELEMETRY
            </span>
            <h3 className={`text-xl sm:text-2xl font-serif font-black uppercase tracking-tight ${isDark ? 'text-white' : 'text-[#111111]'}`}>
              LIVE &amp; LOGGED VITAL SIGNALS
            </h3>
          </div>
          <p className={`text-xs font-mono mt-0.5 ${isDark ? 'text-[#888888]' : 'text-[#666666]'}`}>
            Real biometric feeds from Web Bluetooth hardware, verified lab reports, and direct user health entries.
          </p>
        </div>

        {/* Action Controls & Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Bluetooth Hardware Action Button with Loading & Success States */}
          <button
            type="button"
            onClick={handleBluetoothAction}
            disabled={isConnecting}
            title={
              isConnecting
                ? 'Web Bluetooth connection in progress...'
                : isBleConnected
                ? `Linked: ${bleDeviceName} (Click to open live stream)`
                : 'Pair Web Bluetooth Sensor'
            }
            className={`px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 border ${
              isConnecting
                ? 'bg-amber-950/40 text-amber-400 border-amber-500/50 cursor-wait'
                : isBleConnected
                ? isDark
                  ? 'bg-emerald-950/30 text-emerald-400 border-emerald-500/40 hover:bg-emerald-900/40 cursor-pointer'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-500 hover:bg-emerald-100 cursor-pointer'
                : isDark
                ? 'bg-[#1E1E1E] text-zinc-300 border-[#333333] hover:text-white hover:border-zinc-500 cursor-pointer'
                : 'bg-[#F2F2EC] text-[#333333] border-[#CCCCCC] hover:text-black hover:border-black cursor-pointer'
            }`}
          >
            {isConnecting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                <span className="text-amber-400 animate-pulse">CONNECTING BLE...</span>
              </>
            ) : isBleConnected ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 stroke-[2.5]" />
                <span className="truncate max-w-[150px]">
                  {bleDeviceName || 'BLE ACTIVE'}
                </span>
              </>
            ) : (
              <>
                <Bluetooth className={`w-3.5 h-3.5 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`} />
                <span>PAIR BLE</span>
              </>
            )}
          </button>

          {/* Quick Manual Log Button */}
          <button
            type="button"
            onClick={() => handleOpenLogModal('heart_rate')}
            className="px-3 py-1.5 bg-[#CC0000] text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-red-700 transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            + Log Real Reading
          </button>

          {/* Filter Bar */}
          <div className={`flex items-center border ${isDark ? 'border-[#333333] bg-[#141414]' : 'border-[#CCCCCC] bg-[#F2F2EC]'} text-xs font-mono`}>
            {[
              { id: 'all', label: 'ALL' },
              { id: 'cardio', label: 'CARDIO' },
              { id: 'recovery', label: 'RECOVERY' },
              { id: 'metabolic', label: 'METABOLIC' },
              { id: 'blood', label: 'LABS' }
            ].map((f, idx) => (
              <button
                key={f.id}
                onClick={() => setSelectedFilter(f.id as any)}
                className={`px-2.5 py-1.5 font-bold uppercase transition-colors ${idx !== 0 ? (isDark ? 'border-l border-[#333333]' : 'border-l border-[#CCCCCC]') : ''} ${
                  selectedFilter === f.id
                    ? isDark ? 'bg-white text-[#111111]' : 'bg-[#111111] text-white'
                    : isDark ? 'bg-transparent text-[#888888] hover:text-white' : 'bg-transparent text-[#666666] hover:text-black'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4-Column Grid */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border ${
        isDark
          ? 'border-[#262626] bg-[#141414] divide-[#262626]'
          : 'border-[#111111] bg-[#FFFFFF] divide-[#D4D4CE] hard-shadow-sm'
      } divide-y sm:divide-y-0 sm:divide-x`}>
        {filteredCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              className={`p-5 flex flex-col justify-between space-y-4 ${
                isDark ? 'hover:bg-[#1A1A1A]' : 'hover:bg-[#F9F9F6]'
              } transition-colors group ${
                idx >= 4 ? (isDark ? 'border-t sm:border-t border-[#262626]' : 'border-t sm:border-t border-[#D4D4CE]') : ''
              }`}
            >
              {/* Header inside Card */}
              <div className={`flex items-start justify-between gap-2 border-b ${isDark ? 'border-[#222222]' : 'border-[#EAEAE4]'} pb-2`}>
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 border flex items-center justify-center ${
                    isDark
                      ? card.hasData ? 'border-[#333333] bg-[#1A1A1A] text-white group-hover:bg-white group-hover:text-black' : 'border-[#222222] bg-zinc-900 text-zinc-600'
                      : card.hasData ? 'border-[#CCCCCC] bg-[#F2F2EC] text-[#111111] group-hover:bg-[#111111] group-hover:text-white' : 'border-[#EAEAE4] bg-zinc-100 text-zinc-400'
                  } transition-colors`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className={`font-mono text-[9px] uppercase font-bold ${isDark ? 'text-[#666666]' : 'text-[#888888]'} block`}>
                      FIG. 1.{idx + 1}
                    </span>
                    <h4 className={`font-serif font-bold text-sm leading-tight ${isDark ? 'text-white' : 'text-[#111111]'}`}>
                      {card.title}
                    </h4>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span className={`px-1.5 py-0.5 border text-[9px] font-mono font-bold uppercase ${
                    isDark ? 'bg-[#1E1E1E] border-[#333333] text-[#AAAAAA]' : 'bg-[#F2F2EC] border-[#CCCCCC] text-[#555555]'
                  }`}>
                    {card.category}
                  </span>
                  {card.isEstimated && (
                    <span className="text-[8px] font-mono uppercase bg-amber-950/30 border border-amber-500/40 text-amber-500 px-1 py-0.2">
                      ESTIMATED
                    </span>
                  )}
                </div>
              </div>

              {/* Central Value */}
              <div>
                {card.hasData ? (
                  <div className="flex items-baseline gap-1.5 font-mono">
                    <span className={`text-3xl sm:text-4xl font-black font-serif tracking-tight ${isDark ? 'text-white' : 'text-[#111111]'}`}>
                      {card.value}
                    </span>
                    <span className={`text-xs font-bold uppercase ${isDark ? 'text-[#888888]' : 'text-[#666666]'}`}>
                      {card.unit}
                    </span>
                  </div>
                ) : (
                  <div className="py-2">
                    <span className={`text-2xl font-mono font-bold ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>--</span>
                    <p className={`text-[11px] font-mono mt-1 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                      No data yet — click below to log or connect.
                    </p>
                  </div>
                )}
                <p className={`text-[11px] font-mono mt-0.5 truncate ${isDark ? 'text-[#888888]' : 'text-[#666666]'}`}>
                  {card.subtext}
                </p>
              </div>

              {/* Footer Actions */}
              <div className={`pt-2 border-t ${isDark ? 'border-[#222222]' : 'border-[#EAEAE4]'} text-[10px] font-mono flex items-center justify-between`}>
                <span className={`truncate max-w-[120px] ${isDark ? 'text-[#777777]' : 'text-[#666666]'}`}>
                  SRC: {card.device.toUpperCase()}
                </span>
                
                {card.hasData ? (
                  <button
                    type="button"
                    onClick={() => handleOpenLogModal(card.type)}
                    className="font-bold text-[#CC0000] hover:text-red-700 flex items-center gap-0.5 transition-colors"
                  >
                    + UPDATE <ChevronRight className="w-3 h-3" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleOpenLogModal(card.type)}
                    className={`font-bold px-2 py-0.5 border flex items-center gap-1 transition-colors ${
                      isDark
                        ? 'text-white bg-zinc-800 hover:bg-zinc-700 border-zinc-700'
                        : 'text-black bg-[#EAEAE4] hover:bg-[#DCDCD4] border-[#CCCCCC]'
                    }`}
                  >
                    <Plus className="w-3 h-3 text-[#CC0000]" />
                    LOG DATA
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Manual Vital Entry Modal */}
      <ManualVitalEntryModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        defaultType={selectedLogType}
        onVitalSaved={() => {
          setUserVitals(healthStorage.getVitals());
        }}
      />

    </div>
  );
};
