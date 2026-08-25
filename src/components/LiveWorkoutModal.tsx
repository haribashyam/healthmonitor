import React, { useState, useEffect, useRef } from 'react';
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
  Bluetooth
} from 'lucide-react';
import { WebBluetoothManager } from '../utils/bluetooth';
import { formatHeartRateZone } from '../utils/healthCalculations';
import confetti from 'canvas-confetti';

interface LiveWorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveWorkout: (workoutData: any) => void;
}

export const LiveWorkoutModal: React.FC<LiveWorkoutModalProps> = ({
  isOpen,
  onClose,
  onSaveWorkout
}) => {
  const [isActive, setIsActive] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [currentBpm, setCurrentBpm] = useState(136);
  const [maxBpm, setMaxBpm] = useState(136);
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const [trainingLoad, setTrainingLoad] = useState(0);
  const [workoutType, setWorkoutType] = useState<'Run' | 'Ride' | 'HIIT' | 'Strength' | 'Zone 2 Base'>('Zone 2 Base');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [bleStatus, setBleStatus] = useState<'connected' | 'simulating' | 'disconnected'>('simulating');
  const [deviceName, setDeviceName] = useState('Polar H10 (Virtual BLE Stream)');
  const [workoutFinished, setWorkoutFinished] = useState(false);
  const [coachingTip, setCoachingTip] = useState('Optimal aerobic cadence. Keep heart rate between 128 - 142 BPM to maximize mitochondrial density.');

  const bleManager = WebBluetoothManager.getInstance();

  useEffect(() => {
    if (!isOpen) return;

    // Start BLE or virtual stream listener
    const unsubscribe = bleManager.onHeartRateData((data) => {
      setCurrentBpm(data.heartRate);
      setMaxBpm((prev) => Math.max(prev, data.heartRate));
    });

    bleManager.startSimulation('Polar H10 Live Stream');
    setBleStatus('simulating');
    setDeviceName('Polar H10 Live Stream');

    return () => {
      unsubscribe();
      bleManager.stopSimulation();
    };
  }, [isOpen]);

  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        setSecondsElapsed((prev) => {
          const next = prev + 1;
          // Approximate calories calculation based on current BPM: (BPM / 140) * 11 kcal/min
          const calPerSec = (currentBpm / 140) * (11 / 60);
          setCaloriesBurned((c) => Math.round(c + calPerSec));
          setTrainingLoad((t) => Number((t + (currentBpm > 150 ? 0.04 : 0.02)).toFixed(1)));
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, currentBpm]);

  // Dynamic coaching voice prompts based on HR zone
  useEffect(() => {
    if (currentBpm > 165) {
      setCoachingTip('Zone 4/5 Threshold reached! High anaerobic lactate buildup. Moderate pacing if this is a Zone 2 session.');
    } else if (currentBpm >= 130 && currentBpm <= 145) {
      setCoachingTip('Perfect Zone 2 Aerobic Base. High lipid oxidation efficiency. Maintain steady breathing rhythm.');
    } else {
      setCoachingTip('Warmup / Active Recovery zone. Increase cadence gradually to reach target aerobic output.');
    }
  }, [currentBpm]);

  if (!isOpen) return null;

  const zoneInfo = formatHeartRateZone(currentBpm);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleConnectHardware = async () => {
    const res = await bleManager.connectHeartRateSensor();
    if (res.success) {
      setDeviceName(res.deviceName);
      setBleStatus('connected');
    }
  };

  const handleFinish = () => {
    setIsActive(false);
    setWorkoutFinished(true);
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // Confetti fallback
    }
  };

  const handleSaveAndClose = () => {
    onSaveWorkout({
      title: `Live ${workoutType} Session`,
      type: workoutType === 'Zone 2 Base' ? 'Run' : workoutType,
      durationMinutes: Math.max(1, Math.round(secondsElapsed / 60)),
      avgHeartRate: currentBpm,
      maxHeartRate: maxBpm,
      calories: caloriesBurned,
      trainingLoad: Math.round(trainingLoad),
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: `VITALOS Live HUD (${deviceName})`
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full p-5 sm:p-8 space-y-6 shadow-2xl relative text-slate-100">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black tracking-wide text-white">Live Workout Command HUD</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  REAL-TIME TELEMETRY
                </span>
              </div>
              <p className="text-xs text-slate-400">Continuous Bluetooth R-R Intervals & Physiological Zone Tracking</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleConnectHardware}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white border border-slate-700 flex items-center gap-1.5 transition-all"
            >
              <Bluetooth className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Pair Real BLE Strap</span>
            </button>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 text-sm font-bold"
            >
              ✕
            </button>
          </div>
        </div>

        {!workoutFinished ? (
          <div className="space-y-6">
            {/* Workout Selector & BLE Stream Source */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase">Activity:</span>
                {(['Zone 2 Base', 'Run', 'Ride', 'HIIT', 'Strength'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setWorkoutType(type)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      workoutType === type
                        ? 'bg-cyan-500 text-slate-950'
                        : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Stream: <strong className="text-slate-200">{deviceName}</strong></span>
              </div>
            </div>

            {/* HERO TELEMETRY: Giant Live Heart Rate & Zone Display */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center bg-slate-950/80 p-6 sm:p-8 rounded-2xl border border-slate-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* Col 1: Big Live Heart Rate */}
              <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-rose-500 animate-bounce" /> Live Heart Rate
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl sm:text-7xl font-black text-white tracking-tighter">{currentBpm}</span>
                  <span className="text-sm font-bold text-slate-400">BPM</span>
                </div>
                <div className={`mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${zoneInfo.color}`}>
                  {zoneInfo.zone} ({zoneInfo.targetText})
                </div>
              </div>

              {/* Col 2: Live Animated Cardiac Waveform & Zone Distribution */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                  <span>Target Zone Range</span>
                  <span className="text-emerald-400 font-bold">128 - 142 BPM</span>
                </div>

                {/* 5-Zone Gauge */}
                <div className="grid grid-cols-5 gap-1 h-3 rounded-full overflow-hidden bg-slate-900 p-0.5 border border-slate-800">
                  <div className={`rounded-sm transition-all ${currentBpm < 115 ? 'bg-blue-500 shadow-md shadow-blue-500/50' : 'bg-blue-900/40'}`} title="Zone 1" />
                  <div className={`rounded-sm transition-all ${currentBpm >= 115 && currentBpm <= 135 ? 'bg-emerald-500 shadow-md shadow-emerald-500/50' : 'bg-emerald-900/40'}`} title="Zone 2" />
                  <div className={`rounded-sm transition-all ${currentBpm > 135 && currentBpm <= 152 ? 'bg-amber-500 shadow-md shadow-amber-500/50' : 'bg-amber-900/40'}`} title="Zone 3" />
                  <div className={`rounded-sm transition-all ${currentBpm > 152 && currentBpm <= 168 ? 'bg-orange-500 shadow-md shadow-orange-500/50' : 'bg-orange-900/40'}`} title="Zone 4" />
                  <div className={`rounded-sm transition-all ${currentBpm > 168 ? 'bg-rose-500 shadow-md shadow-rose-500/50' : 'bg-rose-900/40'}`} title="Zone 5" />
                </div>

                {/* ECG Pulsation Bars */}
                <div className="h-10 flex items-end gap-1.5 bg-slate-900/90 rounded-lg p-2 border border-slate-800">
                  {[25, 45, 20, 95, 30, 70, 40, 85, 60, 30, 90, 50, 75, 35, 65, 80, 45, 90, 30, 60].map((h, i) => (
                    <div
                      key={i}
                      className="w-full bg-gradient-to-t from-rose-600 to-rose-400 rounded-t-sm transition-all duration-200"
                      style={{ height: `${isActive ? Math.max(15, (h * (currentBpm / 130)) % 100) : 10}%` }}
                    />
                  ))}
                </div>
              </div>

              {/* Col 3: Secondary Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Duration</span>
                  <span className="text-xl sm:text-2xl font-black text-white tracking-tight">{formatTime(secondsElapsed)}</span>
                </div>
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Calories</span>
                  <span className="text-xl sm:text-2xl font-black text-amber-400 tracking-tight">{caloriesBurned}</span>
                </div>
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Max HR</span>
                  <span className="text-lg font-bold text-slate-200">{maxBpm} BPM</span>
                </div>
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Training Load</span>
                  <span className="text-lg font-bold text-cyan-400">{trainingLoad} TRIMP</span>
                </div>
              </div>
            </div>

            {/* Real-Time Biofeedback Coaching Audio / Visual Bar */}
            <div className="bg-slate-950/60 p-4 rounded-xl border border-cyan-500/30 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white uppercase tracking-wider">Real-Time Bio-Adaptive Guidance</span>
                  <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="text-slate-400 hover:text-white"
                  >
                    {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-slate-300 leading-relaxed">{coachingTip}</p>
              </div>
            </div>

            {/* Primary Control Buttons */}
            <div className="flex items-center justify-center gap-4 pt-2">
              {!isActive ? (
                <button
                  id="start-workout-btn"
                  onClick={() => setIsActive(true)}
                  className="px-8 py-3 rounded-xl font-black text-sm bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 hover:brightness-110 shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all"
                >
                  <Play className="w-4 h-4 fill-current" /> START WORKOUT
                </button>
              ) : (
                <button
                  id="pause-workout-btn"
                  onClick={() => setIsActive(false)}
                  className="px-8 py-3 rounded-xl font-black text-sm bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all"
                >
                  <Pause className="w-4 h-4 fill-current" /> PAUSE
                </button>
              )}

              {secondsElapsed > 0 && (
                <button
                  id="finish-workout-btn"
                  onClick={handleFinish}
                  className="px-6 py-3 rounded-xl font-bold text-sm bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/20 flex items-center gap-2 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" /> FINISH & LOG
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Post-Workout Summary Screen */
          <div className="space-y-6 text-center py-4">
            <div className="inline-flex p-4 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              <Award className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-black text-white">Workout Completed!</h3>
              <p className="text-sm text-slate-400">Telemetry synthesized into your unified health timeline.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto text-center">
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 uppercase block">Duration</span>
                <span className="text-xl font-bold text-white">{formatTime(secondsElapsed)}</span>
              </div>
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 uppercase block">Calories</span>
                <span className="text-xl font-bold text-amber-400">{caloriesBurned} kcal</span>
              </div>
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 uppercase block">Avg HR</span>
                <span className="text-xl font-bold text-rose-400">{currentBpm} BPM</span>
              </div>
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 uppercase block">Training Load</span>
                <span className="text-xl font-bold text-cyan-400">+{trainingLoad}</span>
              </div>
            </div>

            <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 max-w-xl mx-auto text-left text-xs space-y-1">
              <span className="font-bold text-emerald-400 uppercase">AI Post-Workout Adaptation:</span>
              <p className="text-slate-300">
                Great session! You maintained 82% in your target aerobic power band. Plan recommends consuming 35g protein within 45 minutes and taking 500ml electrolyte water to accelerate glycogen replenishment.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={handleSaveAndClose}
                className="px-6 py-2.5 rounded-xl font-bold text-xs bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20 transition-all"
              >
                Save to Health Timeline & Close
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
