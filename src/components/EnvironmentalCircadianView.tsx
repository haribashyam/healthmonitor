import React, { useState } from 'react';
import {
  Sun,
  Moon,
  CloudSun,
  Wind,
  Volume2,
  Thermometer,
  Clock,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Compass,
  Footprints
} from 'lucide-react';
import { EnvironmentalContext, CircadianRoutineMetric } from '../types';

const INITIAL_ENV: EnvironmentalContext = {
  timestamp: 'Live • 11:30 AM',
  aqi: 38,
  pm25: 7.2,
  uvIndex: 5.8,
  temperatureC: 22.4,
  humidityPercent: 46,
  ambientNoiseDb: 52,
  outdoorTrainingRecommendation: 'Ideal',
  sunExposureMinutesToday: 42
};

const INITIAL_CIRCADIAN: CircadianRoutineMetric = {
  typicalBedtime: '10:45 PM',
  typicalWakeTime: '06:30 AM',
  sleepConsistencyScore: 91,
  socialJetlagMinutes: 22,
  morningLightExposureMinutes: 35,
  eveningScreenTimeMinutes: 40,
  recommendation: 'Your circadian stability is within the top 5% percentile. Weekend vs weekday wake time variation is only 22 minutes, preventing Monday morning social jetlag.'
};

export const EnvironmentalCircadianView: React.FC = () => {
  const [env] = useState<EnvironmentalContext>(INITIAL_ENV);
  const [circadian] = useState<CircadianRoutineMetric>(INITIAL_CIRCADIAN);

  const hourlyMovement = [
    { hour: '7 AM', active: true, steps: 1240 },
    { hour: '8 AM', active: true, steps: 2100 },
    { hour: '9 AM', active: false, steps: 240 },
    { hour: '10 AM', active: false, steps: 180 },
    { hour: '11 AM', active: true, steps: 890 },
    { hour: '12 PM', active: true, steps: 1450 },
    { hour: '1 PM', active: true, steps: 1600 },
    { hour: '2 PM', active: false, steps: 320 },
    { hour: '3 PM', active: true, steps: 950 },
    { hour: '4 PM', active: true, steps: 1100 },
    { hour: '5 PM', active: true, steps: 3400 },
    { hour: '6 PM', active: true, steps: 1800 }
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/70 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 mb-2">
              <Sun className="w-3.5 h-3.5" />
              <span>Systems 21-25 & 45-47 • Circadian Rhythm, Environmental Context & Noise Exposure</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              Circadian & Environmental Hub
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Cross-references ambient air quality (AQI, PM2.5), solar UV index, ambient sound noise (dB), and circadian timing regularity with training output.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 block font-mono uppercase">Air Quality (AQI)</span>
              <span className="text-lg font-extrabold text-emerald-400 font-mono">{env.aqi} • Clean</span>
            </div>
            <div className="px-4 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 block font-mono uppercase">Circadian Score</span>
              <span className="text-lg font-extrabold text-amber-400 font-mono">{circadian.sleepConsistencyScore}/100</span>
            </div>
          </div>
        </div>
      </div>

      {/* Environmental Context Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-sm">
          <span className="text-[11px] text-slate-400 flex items-center gap-1 mb-1">
            <Wind className="w-3.5 h-3.5 text-emerald-400" />
            AQI / PM2.5
          </span>
          <div className="text-xl font-bold font-mono text-emerald-400">
            {env.aqi} <span className="text-xs text-slate-400 font-normal">({env.pm25} µg)</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-medium block mt-0.5">Optimal for Running</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-sm">
          <span className="text-[11px] text-slate-400 flex items-center gap-1 mb-1">
            <Sun className="w-3.5 h-3.5 text-amber-400" />
            UV Index
          </span>
          <div className="text-xl font-bold font-mono text-amber-400">
            {env.uvIndex} <span className="text-xs text-slate-400 font-normal">/ 11</span>
          </div>
          <span className="text-[10px] text-amber-300 font-medium block mt-0.5">SPF 30+ Advised</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-sm">
          <span className="text-[11px] text-slate-400 flex items-center gap-1 mb-1">
            <Thermometer className="w-3.5 h-3.5 text-cyan-400" />
            Temperature
          </span>
          <div className="text-xl font-bold font-mono text-white">
            {env.temperatureC}°C <span className="text-xs text-slate-400 font-normal">({Math.round(env.temperatureC * 9/5 + 32)}°F)</span>
          </div>
          <span className="text-[10px] text-slate-400 font-medium block mt-0.5">{env.humidityPercent}% Humidity</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-sm">
          <span className="text-[11px] text-slate-400 flex items-center gap-1 mb-1">
            <Volume2 className="w-3.5 h-3.5 text-purple-400" />
            Ambient Noise
          </span>
          <div className="text-xl font-bold font-mono text-purple-300">
            {env.ambientNoiseDb} <span className="text-xs text-slate-400 font-normal">dB</span>
          </div>
          <span className="text-[10px] text-slate-400 font-medium block mt-0.5">Auditory Safe (&lt;70dB)</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-sm">
          <span className="text-[11px] text-slate-400 flex items-center gap-1 mb-1">
            <Sun className="w-3.5 h-3.5 text-amber-300" />
            Sunlight Exposure
          </span>
          <div className="text-xl font-bold font-mono text-amber-300">
            {env.sunExposureMinutesToday} <span className="text-xs text-slate-400 font-normal">min</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-medium block mt-0.5">Vitamin D synthesis ✓</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-sm">
          <span className="text-[11px] text-slate-400 flex items-center gap-1 mb-1">
            <Compass className="w-3.5 h-3.5 text-emerald-400" />
            Training Rec
          </span>
          <div className="text-base font-bold text-emerald-400">
            {env.outdoorTrainingRecommendation}
          </div>
          <span className="text-[10px] text-slate-400 font-medium block mt-0.5">Outdoor Track / Trail</span>
        </div>
      </div>

      {/* Circadian Schedule & Social Jetlag Analyzer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Circadian Regularity (7 Cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" />
              Circadian Entrainment & Social Jetlag Ledger
            </h3>
            <span className="text-xs font-bold font-mono text-emerald-400">
              {circadian.socialJetlagMinutes}m Jetlag (Optimal &lt; 30m)
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500 block mb-1">Avg Bedtime</span>
              <span className="text-base font-bold text-white font-mono">{circadian.typicalBedtime}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500 block mb-1">Avg Wake Time</span>
              <span className="text-base font-bold text-white font-mono">{circadian.typicalWakeTime}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500 block mb-1">Morning Light</span>
              <span className="text-base font-bold text-amber-400 font-mono">{circadian.morningLightExposureMinutes} mins</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500 block mb-1">Night Screen</span>
              <span className="text-base font-bold text-cyan-400 font-mono">{circadian.eveningScreenTimeMinutes} mins</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/40 text-xs text-slate-300">
            <span className="font-bold text-amber-300 block mb-1">Circadian Rhythm Analysis</span>
            <p className="leading-relaxed">{circadian.recommendation}</p>
          </div>
        </div>

        {/* Movement Frequency & Sedentary Pattern (5 Cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Footprints className="w-5 h-5 text-cyan-400" />
            Hourly Movement Profile & Active Breaks
          </h3>

          <div className="grid grid-cols-6 gap-1.5 pt-2">
            {hourlyMovement.map((hm, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-lg text-center text-xs transition-all ${
                  hm.active 
                    ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300'
                    : 'bg-slate-950 border border-slate-800 text-slate-500'
                }`}
              >
                <div className="text-[10px] font-mono">{hm.hour}</div>
                <div className="text-xs font-bold font-mono mt-1">{hm.steps}</div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400">
            <strong className="text-white">9 / 12</strong> active hours achieved today. Low sedentary accumulation protects insulin sensitivity.
          </div>
        </div>

      </div>
    </div>
  );
};
