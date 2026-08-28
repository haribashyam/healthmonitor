import React, { useState, useEffect } from 'react';
import {
  Heart,
  Activity,
  Flame,
  ShieldCheck,
  TrendingUp,
  Sun,
  Radio,
  Zap,
  Moon,
  Droplets,
  Thermometer,
  Wind,
  Bluetooth,
  Loader2,
  CheckCircle2,
  Check
} from 'lucide-react';
import { bluetoothManager, BLEConnectionState } from '../services/bluetoothService';

interface TickerBarProps {
  liveBpm: number;
  isBleConnected: boolean;
  bleDeviceName: string;
  isConnecting?: boolean;
  vitalScore?: number;
  liveSteps?: number;
  onOpenLiveWorkout?: () => void;
  onConnectBle?: () => void;
}

export const TickerBar: React.FC<TickerBarProps> = ({
  liveBpm,
  isBleConnected: initialBleConnected,
  bleDeviceName: initialBleDeviceName,
  isConnecting: initialIsConnecting = false,
  vitalScore = 84,
  liveSteps = 11284,
  onOpenLiveWorkout,
  onConnectBle
}) => {
  const [steps, setSteps] = useState(liveSteps);
  const [currentBpm, setCurrentBpm] = useState(liveBpm || 68);
  const [isBleConnected, setIsBleConnected] = useState(initialBleConnected);
  const [isConnecting, setIsConnecting] = useState(initialIsConnecting);
  const [bleDeviceName, setBleDeviceName] = useState(initialBleDeviceName);

  // Sync with prop changes
  useEffect(() => {
    setIsBleConnected(initialBleConnected);
  }, [initialBleConnected]);

  useEffect(() => {
    if (initialIsConnecting !== undefined) {
      setIsConnecting(initialIsConnecting);
    }
  }, [initialIsConnecting]);

  useEffect(() => {
    if (initialBleDeviceName) {
      setBleDeviceName(initialBleDeviceName);
    }
  }, [initialBleDeviceName]);

  // Direct Bluetooth Manager subscription
  useEffect(() => {
    const unsub = bluetoothManager.onConnectionChange((state: BLEConnectionState) => {
      setIsBleConnected(state.connected);
      setBleDeviceName(state.deviceName);
      setIsConnecting(!!state.isConnecting);
    });

    const handleGlobalState = (e: any) => {
      if (e.detail) {
        setIsBleConnected(e.detail.connected);
        if (e.detail.deviceName) setBleDeviceName(e.detail.deviceName);
        setIsConnecting(!!e.detail.isConnecting);
      }
    };

    window.addEventListener('bluetoothStateChanged', handleGlobalState);
    return () => {
      unsub();
      window.removeEventListener('bluetoothStateChanged', handleGlobalState);
    };
  }, []);

  // Live real-time step counter and subtle HR physiological oscillation
  useEffect(() => {
    const stepInterval = setInterval(() => {
      // Simulate live pedestrian steps ticking periodically
      setSteps(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 3200);

    const hrInterval = setInterval(() => {
      // Subtle biological sinus variability (e.g. +/- 1-2 bpm)
      setCurrentBpm(prev => {
        const delta = (Math.random() - 0.48) * 2;
        const target = Math.round(Math.min(180, Math.max(54, prev + delta)));
        return target;
      });
    }, 2400);

    return () => {
      clearInterval(stepInterval);
      clearInterval(hrInterval);
    };
  }, []);

  useEffect(() => {
    if (liveBpm) setCurrentBpm(liveBpm);
  }, [liveBpm]);

  const handleBluetoothAction = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isConnecting) return;

    if (onConnectBle) {
      onConnectBle();
      return;
    }

    if (isBleConnected) {
      // Toggle or open workout
      if (onOpenLiveWorkout) onOpenLiveWorkout();
    } else {
      setIsConnecting(true);
      try {
        await bluetoothManager.connectDevice('heart_rate');
      } catch (err) {
        // Handled in service logs
      } finally {
        setIsConnecting(false);
      }
    }
  };

  const rawMetrics = [
    { label: 'HR', value: `${currentBpm} BPM`, isAlert: true },
    { label: 'HRV', value: '64 MS', isAlert: false },
    { label: 'VO2 MAX', value: '48.6', isAlert: false },
    { label: 'SLEEP DEBT', value: '-0.4 H', isAlert: false },
    { label: 'BP', value: '116/74', isAlert: false },
    { label: 'STEPS', value: steps.toLocaleString(), isAlert: false },
    { label: 'TRAINING LOAD', value: 'MODERATE', isAlert: false },
    { label: 'SPO2', value: '98%', isAlert: false },
    { label: 'BODY TEMP', value: '36.7°C', isAlert: false },
    { label: 'RESPIRATION', value: '14 BRPM', isAlert: false },
    { label: 'GLUCOSE', value: '92 MG/DL', isAlert: false },
    { label: 'STRESS', value: 'LOW', isAlert: false },
    { label: 'RESTING HR', value: '59 BPM', isAlert: false },
    { label: 'VITAL SCORE', value: `${vitalScore}/100`, isAlert: false },
  ];

  // Duplicate for seamless infinite loop
  const tickerItems = [...rawMetrics, ...rawMetrics, ...rawMetrics];

  return (
    <div className="bg-[var(--bg-canvas)] text-[var(--text-main)] border-b border-[var(--border-edge)] text-xs h-9 flex items-center sticky top-0 z-50 overflow-hidden font-mono select-none transition-colors">
      
      {/* Left: Solid Red LIVE WIRE Badge */}
      <div
        onClick={onOpenLiveWorkout}
        className="bg-[#CC0000] text-white px-3 h-full flex items-center gap-1.5 font-bold uppercase tracking-wider text-[11px] flex-shrink-0 z-20 cursor-pointer hover:bg-[#b30000] transition-colors border-r border-[var(--border-edge)]"
      >
        <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
        <span className="whitespace-nowrap">● LIVE WIRE</span>
      </div>

      {/* Center: Seamless Infinite Scrolling Marquee */}
      <div className="flex-1 overflow-hidden relative flex items-center h-full">
        <div className="animate-news-ticker flex items-center gap-8 pl-4 whitespace-nowrap">
          {tickerItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-1.5 text-xs text-[var(--text-main)] flex-shrink-0 tracking-wide font-mono"
            >
              <span className="text-[var(--text-muted)] font-medium uppercase text-[11px]">
                {item.label}
              </span>
              <span className={`font-bold ${item.isAlert ? 'text-[#CC0000]' : 'text-[var(--text-main)]'}`}>
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Bluetooth Button & Live Status Beacon */}
      <button
        type="button"
        onClick={handleBluetoothAction}
        disabled={isConnecting}
        title={
          isConnecting
            ? 'Scanning & pairing with Web Bluetooth sensor...'
            : isBleConnected
            ? `Connected: ${bleDeviceName} (Click to open live stream)`
            : 'Click to pair Web Bluetooth heart rate or pulse monitor'
        }
        className={`flex items-center gap-2 px-3.5 h-full border-l border-[var(--border-edge)] transition-all select-none text-[10px] font-mono font-bold uppercase tracking-wider flex-shrink-0 z-20 ${
          isConnecting
            ? 'bg-amber-950/40 text-amber-300 border-amber-600/40 cursor-wait'
            : isBleConnected
            ? 'bg-[var(--bg-card)] text-emerald-400 hover:bg-[var(--bg-card-contrast)] cursor-pointer'
            : 'bg-[var(--bg-card-alt)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card-contrast)] cursor-pointer'
        }`}
      >
        {isConnecting ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
            <span className="text-amber-300 font-bold animate-pulse">CONNECTING...</span>
          </>
        ) : isBleConnected ? (
          <>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[2.5]" />
            <span className="text-[var(--text-main)] font-bold truncate max-w-[140px] sm:max-w-[200px]">
              {bleDeviceName || 'BLE ACTIVE'}
            </span>
          </>
        ) : (
          <>
            <Bluetooth className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            <span className="text-[var(--text-muted)]">PAIR BLUETOOTH</span>
          </>
        )}
      </button>

    </div>
  );
};

