import React, { useState, useEffect } from 'react';
import {
  Radio,
  FileText,
  Sparkles,
  Zap,
  Info,
  ChevronRight,
  Bluetooth,
  Loader2,
  CheckCircle2,
  Check,
  X
} from 'lucide-react';
import { VitalScore, SleepRecord } from '../types';
import { bluetoothManager, BLEConnectionState } from '../services/bluetoothService';

interface HeroLeadProps {
  vitalScore: VitalScore;
  liveBpm: number;
  latestSleep: SleepRecord;
  bleDeviceName: string;
  isBleConnected?: boolean;
  isConnecting?: boolean;
  onOpenLiveWorkout: () => void;
  onOpenWhatChanged: () => void;
  onOpenDoctorReport: () => void;
  onOpenAsk: () => void;
  onOpenWorkspace?: () => void;
  theme?: 'dark' | 'light';
}

export const HeroLead: React.FC<HeroLeadProps> = ({
  vitalScore,
  liveBpm,
  latestSleep,
  bleDeviceName: initialBleDeviceName,
  isBleConnected: initialBleConnected = false,
  isConnecting: initialIsConnecting = false,
  onOpenLiveWorkout,
  onOpenWhatChanged,
  onOpenDoctorReport,
  onOpenAsk,
  theme = 'dark'
}) => {
  const [showFormulaModal, setShowFormulaModal] = useState(false);
  const [isBleConnected, setIsBleConnected] = useState(initialBleConnected);
  const [isConnecting, setIsConnecting] = useState(initialIsConnecting);
  const [bleDeviceName, setBleDeviceName] = useState(initialBleDeviceName);

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
    const unsub = bluetoothManager.onConnectionChange((state: BLEConnectionState) => {
      setIsBleConnected(state.connected);
      if (state.deviceName) setBleDeviceName(state.deviceName);
      setIsConnecting(!!state.isConnecting);
    });
    return () => unsub();
  }, []);

  const handleBluetoothToggle = async () => {
    if (isConnecting) return;
    if (isBleConnected) {
      onOpenLiveWorkout();
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

  const scoreOverall = vitalScore?.overall || 84;
  const recoveryScore = vitalScore?.recovery || 86;
  const activityScore = vitalScore?.activity || 82;
  const sleepScore = vitalScore?.sleep || 88;

  const hrvVal = latestSleep?.hrvAvg || 64;
  const rhrVal = latestSleep?.restingHr || 59;
  const sleepScoreVal = latestSleep?.sleepScore || 88;

  return (
    <div className={`${
      isDark
        ? 'bg-[#141414] border-[#262626] text-[#F9F9F7]'
        : 'bg-[#FFFFFF] border-[#111111] text-[#111111] hard-shadow-sm'
    } border-2 p-6 sm:p-8 select-none transition-colors`}>
      
      {/* Top Badge Eyebrow & Live Bluetooth Pill */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 font-mono text-xs">
        <div className="flex items-center gap-3">
          <span className="bg-[#CC0000] text-white px-2.5 py-1 font-bold uppercase tracking-wider text-[11px]">
            OPTIMAL RECOVERY
          </span>
          <span className={`${isDark ? 'text-[#888888]' : 'text-[#666666]'} font-medium tracking-wide flex items-center gap-1.5 text-[11px] uppercase`}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
            UPDATED JUST NOW
          </span>
        </div>

        {/* Dynamic Bluetooth Feedback Badge / Action Button */}
        <button
          type="button"
          onClick={handleBluetoothToggle}
          disabled={isConnecting}
          title={
            isConnecting
              ? 'Web Bluetooth GATT handshake in progress...'
              : isBleConnected
              ? `Active Sensor: ${bleDeviceName} (Click to launch live HUD)`
              : 'Click to pair Web Bluetooth Sensor'
          }
          className={`flex items-center gap-2 px-3 py-1 border transition-all text-[11px] font-mono font-bold uppercase tracking-wider ${
            isConnecting
              ? 'bg-amber-950/30 border-amber-500/50 text-amber-400 cursor-wait'
              : isBleConnected
              ? isDark
                ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-400 hover:bg-emerald-900/40 cursor-pointer'
                : 'bg-emerald-50 border-emerald-600 text-emerald-700 hover:bg-emerald-100 cursor-pointer'
              : isDark
              ? 'bg-[#1C1C1C] border-[#383838] text-[#AAAAAA] hover:text-white hover:border-zinc-500 cursor-pointer'
              : 'bg-[#F2F2EC] border-[#CCCCCC] text-[#444444] hover:text-black hover:border-black cursor-pointer'
          }`}
        >
          {isConnecting ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
              <span className="text-amber-400 animate-pulse">CONNECTING SENSOR...</span>
            </>
          ) : isBleConnected ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 stroke-[2.5]" />
              <span className="font-bold truncate max-w-[180px]">
                {bleDeviceName || 'BLE SENSOR LINKED'}
              </span>
            </>
          ) : (
            <>
              <Bluetooth className={`w-3.5 h-3.5 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`} />
              <span>PAIR BLE SENSOR</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Column: Large Headline, Metrics & Action Buttons */}
        <div className="lg:col-span-8 space-y-5">
          
          <h2 className={`text-4xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight leading-none ${isDark ? 'text-white' : 'text-[#111111]'}`}>
            Ready for<br />targeted output
          </h2>

          <div className={`text-sm font-mono flex flex-wrap items-center gap-2 ${isDark ? 'text-[#CCCCCC]' : 'text-[#444444]'}`}>
            <span>HRV <strong className={isDark ? 'text-white' : 'text-black'}>{hrvVal}ms</strong></span>
            <span className={isDark ? 'text-[#555555]' : 'text-[#AAAAAA]'}>•</span>
            <span>Resting HR <strong className={isDark ? 'text-white' : 'text-black'}>{rhrVal} BPM</strong></span>
            <span className={isDark ? 'text-[#555555]' : 'text-[#AAAAAA]'}>•</span>
            <span>Sleep score <strong className={isDark ? 'text-white' : 'text-black'}>{sleepScoreVal}/100</strong></span>
          </div>

          {/* 4 Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2 font-mono text-xs">
            <button
              onClick={onOpenDoctorReport}
              className={`px-4 py-2.5 transition-colors font-bold uppercase tracking-wider flex items-center gap-2 border ${
                isDark
                  ? 'bg-[#202020] hover:bg-[#2A2A2A] text-[#E0E0E0] hover:text-white border-[#383838]'
                  : 'bg-[#F2F2EC] hover:bg-[#EAEAE4] text-[#111111] border-[#CCCCCC]'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-[#CC0000]" />
              <span>EXPORT CLINICAL PDF</span>
            </button>

            <button
              onClick={onOpenWhatChanged}
              className={`px-4 py-2.5 transition-colors font-bold uppercase tracking-wider flex items-center gap-2 border ${
                isDark
                  ? 'bg-[#202020] hover:bg-[#2A2A2A] text-[#E0E0E0] hover:text-white border-[#383838]'
                  : 'bg-[#F2F2EC] hover:bg-[#EAEAE4] text-[#111111] border-[#CCCCCC]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#CC0000]" />
              <span>WHY AM I DIFFERENT?</span>
            </button>

            <button
              onClick={onOpenLiveWorkout}
              className={`px-4 py-2.5 transition-colors font-bold uppercase tracking-wider flex items-center gap-2 border ${
                isDark
                  ? 'bg-white text-[#111111] hover:bg-[#EAEAEA] border-white'
                  : 'bg-[#111111] text-white hover:bg-[#222222] border-[#111111]'
              }`}
            >
              <Radio className="w-3.5 h-3.5 text-[#CC0000]" />
              <span>START LIVE WORKOUT</span>
            </button>

            <button
              onClick={onOpenAsk}
              className={`px-4 py-2.5 transition-colors font-bold uppercase tracking-wider flex items-center gap-2 border ${
                isDark
                  ? 'bg-[#202020] hover:bg-[#2A2A2A] text-[#E0E0E0] hover:text-white border-[#383838]'
                  : 'bg-[#F2F2EC] hover:bg-[#EAEAE4] text-[#111111] border-[#CCCCCC]'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-[#CC0000]" />
              <span>ASK AI</span>
            </button>
          </div>

        </div>

        {/* Right Column: Circular Score Gauge and Breakdown */}
        <div className={`lg:col-span-4 flex items-center justify-start lg:justify-end gap-6 p-5 border ${
          isDark
            ? 'bg-[#181818] border-[#282828]'
            : 'bg-[#F9F9F6] border-[#D4D4CE]'
        }`}>
          
          {/* Circular Ring Gauge */}
          <div className="relative w-28 h-28 flex-shrink-0 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke={isDark ? '#2A2A2A' : '#E2E2DC'}
                strokeWidth="7"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke={isDark ? '#FFFFFF' : '#111111'}
                strokeWidth="7"
                strokeDasharray="263.89"
                strokeDashoffset={263.89 - (263.89 * scoreOverall) / 100}
                strokeLinecap="round"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className={`text-3xl font-serif font-black leading-none ${isDark ? 'text-white' : 'text-[#111111]'}`}>
                {scoreOverall}
              </span>
              <span className={`text-[9px] font-mono tracking-widest uppercase mt-0.5 ${isDark ? 'text-[#888888]' : 'text-[#666666]'}`}>
                VITAL SCORE
              </span>
            </div>
          </div>

          {/* Score Breakdown List */}
          <div className="space-y-1.5 font-mono text-xs">
            <div className="flex items-center justify-between gap-4">
              <span className={`uppercase text-[11px] ${isDark ? 'text-[#888888]' : 'text-[#666666]'}`}>RECOVERY</span>
              <span className={`font-bold text-[11px] ${isDark ? 'text-white' : 'text-black'}`}>{recoveryScore}/100</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className={`uppercase text-[11px] ${isDark ? 'text-[#888888]' : 'text-[#666666]'}`}>ACTIVITY</span>
              <span className={`font-bold text-[11px] ${isDark ? 'text-white' : 'text-black'}`}>{activityScore}/100</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className={`uppercase text-[11px] ${isDark ? 'text-[#888888]' : 'text-[#666666]'}`}>SLEEP</span>
              <span className={`font-bold text-[11px] ${isDark ? 'text-white' : 'text-black'}`}>{sleepScore}/100</span>
            </div>
            <div className={`pt-1 border-t ${isDark ? 'border-[#2A2A2A]' : 'border-[#D4D4CE]'}`}>
              <button
                onClick={() => setShowFormulaModal(true)}
                className="text-[10px] text-[#CC0000] hover:underline font-bold uppercase tracking-wider"
              >
                VIEW FORMULA
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Formula Modal */}
      {showFormulaModal && (
        <div className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4">
          <div className={`${isDark ? 'bg-[#181818] border-[#333333] text-[#F9F9F7]' : 'bg-[#FFFFFF] border-[#111111] text-[#111111]'} border-2 max-w-md w-full p-6 space-y-4 font-mono text-xs hard-shadow`}>
            <div className={`flex items-center justify-between border-b pb-2 ${isDark ? 'border-[#333333]' : 'border-[#CCCCCC]'}`}>
              <h3 className="font-serif font-bold text-base uppercase">VITAL SCORE ALGORITHM</h3>
              <button
                onClick={() => setShowFormulaModal(false)}
                className={`${isDark ? 'text-[#888888] hover:text-white' : 'text-[#666666] hover:text-black'} font-bold p-1`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className={`leading-relaxed ${isDark ? 'text-[#AAAAAA]' : 'text-[#555555]'}`}>
              VitalScore = (Recovery × 0.40) + (Sleep Architecture × 0.35) + (Active Glycemic Tone × 0.25).
            </p>
            <div className={`p-3 border space-y-1 ${isDark ? 'bg-[#111111] border-[#262626]' : 'bg-[#F4F4EE] border-[#D4D4CE]'}`}>
              <div>Overnight HRV RMSSD Z-score: +0.62σ</div>
              <div>Resting Heart Rate Dip: 14% restorative</div>
              <div>Sleep Stages Quality: 88/100</div>
            </div>
            <button
              onClick={() => setShowFormulaModal(false)}
              className={`w-full py-2 font-bold uppercase ${isDark ? 'bg-white text-[#111111]' : 'bg-[#111111] text-white'}`}
            >
              CLOSE
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
