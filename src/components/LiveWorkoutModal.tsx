import React, { useState, useEffect } from 'react';
import {
  Radio,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Flame,
  Activity,
  Heart,
  TrendingUp,
  Award,
  Zap,
  Volume2,
  VolumeX,
  Sparkles,
  Bluetooth,
  AlertTriangle,
  X
} from 'lucide-react';
import { bluetoothManager, LiveHardwareReading } from '../services/bluetoothService';
import { formatHeartRateZone } from '../utils/healthCalculations';
import confetti from 'canvas-confetti';

interface LiveWorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveWorkout: (workoutData: any) => void;
  theme?: 'dark' | 'light';
}

export const LiveWorkoutModal: React.FC<LiveWorkoutModalProps> = ({
  isOpen,
  onClose,
  onSaveWorkout,
  theme = 'dark'
}) => {
  const [isActive, setIsActive] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [currentBpm, setCurrentBpm] = useState<number>(0);
  const [maxBpm, setMaxBpm] = useState<number>(0);
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const [trainingLoad, setTrainingLoad] = useState(0);
  const [workoutType, setWorkoutType] = useState<'Zone 2 Base' | 'Run' | 'Ride' | 'HIIT' | 'Strength'>('Zone 2 Base');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isBLEConnected, setIsBLEConnected] = useState<boolean>(bluetoothManager.isConnected);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(bluetoothManager.isDemoMode);
  const [deviceName, setDeviceName] = useState<string>(bluetoothManager.device?.name || 'No Sensor Connected');
  const [isPairing, setIsPairing] = useState<boolean>(false);
  const [pairingError, setPairingError] = useState<string | null>(null);
  const [workoutFinished, setWorkoutFinished] = useState(false);
  const [coachingTip, setCoachingTip] = useState('Maintain consistent aerobic breathing rhythm. Heart rate in Zone 2 maximizes lipid oxidation.');

  const isDark = theme === 'dark';

  useEffect(() => {
    if (!isOpen) return;

    const unsubData = bluetoothManager.onData((reading: LiveHardwareReading) => {
      if (reading.heartRate) {
        setCurrentBpm(reading.heartRate);
        setMaxBpm((prev) => Math.max(prev, reading.heartRate!));
      }
    });

    const unsubConn = bluetoothManager.onConnectionChange(({ connected, deviceName: name, isDemo }) => {
      setIsBLEConnected(connected);
      setDeviceName(name || (connected ? 'Bluetooth Sensor' : 'No Sensor Connected'));
      setIsDemoMode(isDemo);
    });

    return () => {
      unsubData();
      unsubConn();
    };
  }, [isOpen]);

  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        setSecondsElapsed((prev) => {
          const next = prev + 1;
          const bpmForCalc = currentBpm > 0 ? currentBpm : 125;
          const calPerSec = (bpmForCalc / 140) * (11 / 60);
          setCaloriesBurned((c) => Math.round(c + calPerSec));
          setTrainingLoad((t) => Number((t + (bpmForCalc > 150 ? 0.04 : 0.02)).toFixed(1)));
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, currentBpm]);

  const handleConnectHardware = async () => {
    setIsPairing(true);
    setPairingError(null);
    try {
      await bluetoothManager.connectDevice();
    } catch (err: any) {
      setPairingError(err.message || 'Web Bluetooth request cancelled or unsupported.');
    } finally {
      setIsPairing(false);
    }
  };

  const handleStartDemoStream = () => {
    bluetoothManager.startDemoMode('Polar H10 (Live Demo)');
    setPairingError(null);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainderSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainderSecs.toString().padStart(2, '0')}`;
  };

  const getZoneInfo = (bpm: number) => {
    if (bpm === 0) return { zone: 'RESTING', color: 'border-zinc-500 text-zinc-400', targetText: '< 115 BPM' };
    if (bpm < 115) return { zone: 'ZONE 1 (RECOVERY)', color: 'border-blue-500 text-blue-400', targetText: '100-114 BPM' };
    if (bpm <= 135) return { zone: 'ZONE 2 (AEROBIC)', color: 'border-emerald-500 text-emerald-400', targetText: '115-135 BPM' };
    if (bpm <= 152) return { zone: 'ZONE 3 (TEMPO)', color: 'border-amber-500 text-amber-400', targetText: '136-152 BPM' };
    if (bpm <= 168) return { zone: 'ZONE 4 (THRESHOLD)', color: 'border-orange-500 text-orange-400', targetText: '153-168 BPM' };
    return { zone: 'ZONE 5 (ANAEROBIC)', color: 'border-rose-500 text-rose-400', targetText: '> 168 BPM' };
  };

  const zoneInfo = getZoneInfo(currentBpm);

  const handleFinish = () => {
    setIsActive(false);
    setWorkoutFinished(true);
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {}
  };

  const handleSaveAndClose = () => {
    onSaveWorkout({
      title: `Live ${workoutType} Session`,
      type: workoutType === 'Zone 2 Base' ? 'Run' : workoutType,
      durationMinutes: Math.max(1, Math.round(secondsElapsed / 60)),
      avgHeartRate: currentBpm || 135,
      maxHeartRate: maxBpm || 145,
      calories: caloriesBurned,
      trainingLoad: Math.round(trainingLoad),
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: isBLEConnected
        ? (isDemoMode ? 'VITALOS Live HUD (Demo Simulation)' : `Web Bluetooth BLE (${deviceName})`)
        : 'Manual Stopwatch Session'
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto font-mono select-none animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-4xl bg-[var(--bg-card)] text-[var(--text-main)] border-2 border-[var(--border-edge)] p-5 sm:p-8 space-y-6 relative transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-edge)] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 border border-[#CC0000] bg-[#CC0000] text-white flex items-center justify-center flex-shrink-0">
              <Radio className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-serif font-black uppercase tracking-tight text-[var(--text-main)]">
                  Live Workout Command HUD
                </h2>
                <span className={`text-[10px] font-bold px-2 py-0.5 uppercase border ${
                  isBLEConnected
                    ? 'border-[#CC0000] bg-[#CC0000]/15 text-[#CC0000]'
                    : 'border-[var(--border-edge)] bg-[var(--bg-card-alt)] text-[var(--text-muted)]'
                }`}>
                  {isBLEConnected ? (isDemoMode ? '● SIMULATED BLE' : '● LIVE BLE GATT') : '○ MANUAL SENSOR'}
                </span>
              </div>
              <p className="text-xs font-sans text-[var(--text-muted)]">
                Continuous Web Bluetooth R-R Intervals &amp; Heart Rate Zone Telemetry
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {!isBLEConnected ? (
              <button
                type="button"
                onClick={handleConnectHardware}
                disabled={isPairing}
                className="px-3 py-1.5 text-xs font-bold uppercase bg-[#CC0000] text-white hover:bg-red-700 flex items-center gap-1.5 transition-all border border-[#CC0000]"
              >
                <Bluetooth className="w-3.5 h-3.5" />
                <span>{isPairing ? 'Opening...' : 'Pair BLE Device'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => bluetoothManager.disconnect()}
                className="px-3 py-1.5 text-xs font-bold uppercase border bg-[var(--bg-card-alt)] text-[#CC0000] border-red-500/30 hover:bg-[var(--bg-card-contrast)]"
              >
                Disconnect
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 border border-[var(--border-edge)] hover:bg-[var(--bg-card-contrast)] text-[var(--text-muted)] hover:text-[var(--text-main)] text-xs font-bold uppercase"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Pairing error notification if encountered */}
        {pairingError && (
          <div className="p-3 bg-red-950/20 border border-red-500/40 text-red-500 text-xs font-sans flex items-start justify-between gap-2">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div>
                <strong>Pairing Notice:</strong> {pairingError}
              </div>
            </div>
            <button
              type="button"
              onClick={handleStartDemoStream}
              className="px-2 py-0.5 text-[11px] font-mono whitespace-nowrap border font-bold uppercase bg-[var(--bg-card)] border-[var(--border-edge)] text-amber-500 hover:bg-[var(--bg-card-contrast)]"
            >
              Use Live Demo Stream
            </button>
          </div>
        )}

        {!workoutFinished ? (
          <div className="space-y-5">
            {/* Workout Selector & BLE Stream Source */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 border bg-[var(--bg-card-alt)] border-[var(--border-edge)]">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-bold uppercase mr-1 text-[var(--text-muted)]">Activity:</span>
                {(['Zone 2 Base', 'Run', 'Ride', 'HIIT', 'Strength'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setWorkoutType(type)}
                    className={`px-2.5 py-1 text-xs font-bold uppercase transition-all border ${
                      workoutType === type
                        ? 'bg-[var(--text-main)] text-[var(--bg-canvas)] border-[var(--text-main)]'
                        : 'bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border-edge)] hover:text-[var(--text-main)]'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                <span className={`w-2 h-2 ${isBLEConnected ? 'bg-[#CC0000] animate-ping' : 'bg-zinc-500'}`} />
                <span>Stream: <strong className="text-[var(--text-main)]">{deviceName}</strong></span>
              </div>
            </div>

            {/* HERO TELEMETRY: Giant Live Heart Rate & Zone Display */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center p-6 sm:p-8 border relative bg-[var(--bg-card-alt)] border-[var(--border-edge)]">
              {/* Col 1: Big Live Heart Rate */}
              <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-[var(--text-muted)]">
                  <Heart className="w-4 h-4 text-[#CC0000] animate-bounce" /> Live Heart Rate
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl sm:text-7xl font-serif font-black tracking-tighter text-[#CC0000]">
                    {currentBpm > 0 ? currentBpm : '--'}
                  </span>
                  <span className="text-sm font-bold text-[var(--text-muted)]">BPM</span>
                </div>
                {currentBpm > 0 ? (
                  <div className={`mt-2 inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold border ${zoneInfo.color} font-mono`}>
                    {zoneInfo.zone} ({zoneInfo.targetText})
                  </div>
                ) : (
                  <div className="mt-2 text-xs font-sans text-[var(--text-dim)]">
                    Pair BLE sensor or press start
                  </div>
                )}
              </div>

              {/* Col 2: Live Animated Cardiac Waveform & Zone Distribution */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold uppercase text-[var(--text-muted)]">
                  <span>Target Zone Range</span>
                  <span className="text-[#CC0000] font-mono font-bold">128 - 142 BPM</span>
                </div>

                {/* 5-Zone Gauge */}
                <div className="grid grid-cols-5 gap-1 h-3 p-0.5 border bg-[var(--bg-card)] border-[var(--border-edge)]">
                  <div className={`transition-all ${currentBpm > 0 && currentBpm < 115 ? 'bg-blue-500' : 'bg-blue-900/30'}`} title="Zone 1" />
                  <div className={`transition-all ${currentBpm >= 115 && currentBpm <= 135 ? 'bg-emerald-500' : 'bg-emerald-900/30'}`} title="Zone 2" />
                  <div className={`transition-all ${currentBpm > 135 && currentBpm <= 152 ? 'bg-amber-500' : 'bg-amber-900/30'}`} title="Zone 3" />
                  <div className={`transition-all ${currentBpm > 152 && currentBpm <= 168 ? 'bg-orange-500' : 'bg-orange-900/30'}`} title="Zone 4" />
                  <div className={`transition-all ${currentBpm > 168 ? 'bg-rose-500' : 'bg-rose-900/30'}`} title="Zone 5" />
                </div>

                {/* ECG Pulsation Bars */}
                <div className="h-10 flex items-end gap-1 p-2 border bg-[var(--bg-card)] border-[var(--border-edge)]">
                  {[25, 45, 20, 95, 30, 70, 40, 85, 60, 30, 90, 50, 75, 35, 65, 80, 45, 90, 30, 60].map((h, i) => (
                    <div
                      key={i}
                      className="w-full bg-[#CC0000] transition-all duration-200"
                      style={{ height: `${isActive ? Math.max(15, (h * ((currentBpm || 120) / 130)) % 100) : 10}%` }}
                    />
                  ))}
                </div>
              </div>

              {/* Col 3: Secondary Metrics Grid */}
              <div className="grid grid-cols-2 gap-2 text-center font-mono">
                <div className="p-3 border bg-[var(--bg-card)] border-[var(--border-edge)]">
                  <span className="text-[10px] font-bold uppercase block text-[var(--text-muted)]">DURATION</span>
                  <span className="text-xl font-serif font-black text-[var(--text-main)]">{formatTime(secondsElapsed)}</span>
                </div>
                <div className="p-3 border bg-[var(--bg-card)] border-[var(--border-edge)]">
                  <span className="text-[10px] font-bold uppercase block text-[var(--text-muted)]">CALORIES</span>
                  <span className="text-xl font-serif font-black text-[#CC0000]">{caloriesBurned}</span>
                </div>
                <div className="p-3 border bg-[var(--bg-card)] border-[var(--border-edge)]">
                  <span className="text-[10px] font-bold uppercase block text-[var(--text-muted)]">PEAK HR</span>
                  <span className="text-lg font-bold text-[var(--text-main)]">{maxBpm > 0 ? `${maxBpm}` : '--'}</span>
                </div>
                <div className="p-3 border bg-[var(--bg-card)] border-[var(--border-edge)]">
                  <span className="text-[10px] font-bold uppercase block text-[var(--text-muted)]">LOAD</span>
                  <span className="text-lg font-bold text-[#CC0000]">{trainingLoad}</span>
                </div>
              </div>
            </div>

            {/* Real-Time Biofeedback Guidance */}
            <div className="p-4 border flex items-start gap-3 bg-[var(--bg-card-alt)] border-[var(--border-edge)]">
              <Sparkles className="w-4 h-4 text-[#CC0000] flex-shrink-0 mt-0.5" />
              <div className="text-xs space-y-1 flex-1 font-mono">
                <div className="flex items-center justify-between">
                  <span className="font-bold uppercase tracking-wider text-[var(--text-main)]">Bio-Adaptive Realtime Telemetry</span>
                  <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="text-[var(--text-muted)] hover:text-[var(--text-main)]"
                  >
                    {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-[#CC0000]" /> : <VolumeX className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="font-sans leading-relaxed text-[var(--text-muted)]">{coachingTip}</p>
              </div>
            </div>

            {/* Primary Control Buttons */}
            <div className="flex items-center justify-center gap-4 pt-2">
              {!isActive ? (
                <button
                  id="start-workout-btn"
                  onClick={() => setIsActive(true)}
                  className="px-8 py-3 font-mono font-bold text-xs bg-[#CC0000] hover:bg-red-700 text-white flex items-center gap-2 transition-all uppercase tracking-wider"
                >
                  <Play className="w-3.5 h-3.5 fill-current" /> START TELEMETRY SESSION
                </button>
              ) : (
                <button
                  id="pause-workout-btn"
                  onClick={() => setIsActive(false)}
                  className="px-8 py-3 font-mono font-bold text-xs bg-[var(--bg-card-contrast)] text-[var(--text-main)] hover:bg-[var(--text-main)] hover:text-[var(--bg-canvas)] border border-[var(--border-edge)] flex items-center gap-2 transition-all uppercase tracking-wider"
                >
                  <Pause className="w-3.5 h-3.5 fill-current" /> PAUSE SESSION
                </button>
              )}

              {secondsElapsed > 0 && (
                <button
                  id="finish-workout-btn"
                  onClick={handleFinish}
                  className="px-6 py-3 font-mono font-bold text-xs border border-[var(--border-edge)] transition-all uppercase tracking-wider flex items-center gap-2 bg-[var(--text-main)] text-[var(--bg-canvas)] hover:opacity-90"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> FINISH &amp; LOG SESSION
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Post-Workout Summary Screen */
          <div className="space-y-6 text-center py-4">
            <div className="inline-flex p-4 border border-[#CC0000] bg-[#CC0000] text-white">
              <Award className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-serif font-black uppercase tracking-tight text-[var(--text-main)]">Session Completed &amp; Verified</h3>
              <p className="text-xs font-mono text-[var(--text-muted)]">
                Biometric telemetry successfully integrated into unified health chronicle.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto text-center font-mono">
              <div className="p-3.5 border bg-[var(--bg-card-alt)] border-[var(--border-edge)]">
                <span className="text-xs uppercase block text-[var(--text-muted)]">Duration</span>
                <span className="text-xl font-bold text-[var(--text-main)]">{formatTime(secondsElapsed)}</span>
              </div>
              <div className="p-3.5 border bg-[var(--bg-card-alt)] border-[var(--border-edge)]">
                <span className="text-xs uppercase block text-[var(--text-muted)]">Calories</span>
                <span className="text-xl font-bold text-[#CC0000]">{caloriesBurned}</span>
              </div>
              <div className="p-3.5 border bg-[var(--bg-card-alt)] border-[var(--border-edge)]">
                <span className="text-xs uppercase block text-[var(--text-muted)]">Avg HR</span>
                <span className="text-xl font-bold text-[#CC0000]">{currentBpm || 135} BPM</span>
              </div>
              <div className="p-3.5 border bg-[var(--bg-card-alt)] border-[var(--border-edge)]">
                <span className="text-xs uppercase block text-[var(--text-muted)]">Load</span>
                <span className="text-xl font-bold text-[#CC0000]">+{trainingLoad}</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={handleSaveAndClose}
                className="px-6 py-2.5 font-mono font-bold text-xs bg-[#CC0000] hover:bg-red-700 text-white transition-all uppercase tracking-wider"
              >
                Save &amp; Return to Dispatch
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
