import React, { useState, useEffect } from 'react';
import {
  Brain,
  Eye,
  Smartphone,
  Play,
  Pause,
  RotateCcw,
  Clock,
  Sparkles,
  Zap,
  ShieldCheck,
  BarChart3,
  Moon,
  Info
} from 'lucide-react';

export const CognitiveDigitalWellnessView: React.FC = () => {
  // Focus Timer State
  const [timerSeconds, setTimerSeconds] = useState<number>(25 * 60);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const [sessionsCompleted, setSessionsCompleted] = useState<number>(3);

  // Screen & Digital Wellness Data
  const screenTimeToday = '4h 18m';
  const bedtimeScreenDelta = '+31% increase in pre-bed phone usage this week';
  const eyeBreaksCompleted = 6;

  useEffect(() => {
    let interval: any = null;
    if (isActive && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(sec => sec - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      if (mode === 'focus') {
        setMode('break');
        setTimerSeconds(5 * 60);
        setSessionsCompleted(prev => prev + 1);
      } else {
        setMode('focus');
        setTimerSeconds(25 * 60);
      }
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timerSeconds, mode]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimerSeconds(mode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const minutes = Math.floor(timerSeconds / 60);
  const seconds = timerSeconds % 60;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-sky-950/70 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/30 mb-2">
              <Brain className="w-3.5 h-3.5" />
              <span>Systems 49, 53 & 54 • Cognitive Focus, Eye Health & Digital Wellness</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              Cognitive & Digital Wellness
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Pomodoro deep focus timer, blue-light screen exposure monitoring, 20-20-20 eye strain mitigation, and cognitive fatigue correlation with sleep latency.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 block font-mono uppercase">Focus Blocks</span>
              <span className="text-lg font-extrabold text-sky-400 font-mono">{sessionsCompleted} Done</span>
            </div>
            <div className="px-4 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 block font-mono uppercase">Screen Time</span>
              <span className="text-lg font-extrabold text-slate-200 font-mono">{screenTimeToday}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Focus Timer (6 Cols) & Digital Wellness Audit (6 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Pomodoro Focus Engine */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg space-y-6 text-center">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Brain className="w-4 h-4 text-sky-400" />
              Deep Cognitive Focus Engine
            </h3>
            <span className="px-2.5 py-0.5 rounded text-[10px] uppercase font-bold bg-sky-500/20 text-sky-300">
              {mode === 'focus' ? '25-Min Deep Work' : '5-Min Parasympathetic Break'}
            </span>
          </div>

          {/* Large Circular Time Display */}
          <div className="my-4">
            <div className="w-48 h-48 mx-auto rounded-full bg-slate-950 border-4 border-sky-500/30 flex flex-col items-center justify-center shadow-2xl shadow-sky-500/10 relative">
              <span className="text-4xl sm:text-5xl font-black font-mono text-white tracking-wider">
                {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
              </span>
              <span className="text-[11px] text-slate-400 mt-1 uppercase font-semibold">
                {mode === 'focus' ? 'High Focus State' : 'Resting'}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={toggleTimer}
              className="px-6 py-2.5 rounded-xl font-bold text-xs bg-sky-600 hover:bg-sky-500 text-white shadow-lg shadow-sky-600/30 flex items-center gap-2 transition-all"
            >
              {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              {isActive ? 'Pause Session' : 'Start Focus Block'}
            </button>
            <button
              onClick={resetTimer}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all border border-slate-700"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column: Screen Time & Eye Health */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Eye Health Card */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Eye className="w-4 h-4 text-emerald-400" />
                20-20-20 Eye Health Strain Protocol
              </h3>
              <span className="text-xs font-mono text-emerald-400">{eyeBreaksCompleted} Breaks Taken</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every 20 minutes, look at an object 20 feet away for 20 seconds to relax ciliary muscle spasm and prevent digital eye fatigue.
            </p>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Next Eye Break Scheduled:</span>
              <span className="text-emerald-400 font-mono font-bold">in 14 mins</span>
            </div>
          </div>

          {/* Digital Wellness & Bedtime Phone Usage */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-red-400" />
                Pre-Bed Screen Time Impact
              </h3>
              <span className="text-xs font-mono text-red-400 font-bold">Sleep Latency Risk</span>
            </div>
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-600/50 text-xs text-slate-200">
              <span className="font-bold text-red-400 block mb-0.5">Behavioral Correlation Detected</span>
              Your phone screen exposure in the 60 minutes before bed increased 31% this week, correlating with a <strong className="text-white">+16 minute increase</strong> in nocturnal sleep latency.
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
