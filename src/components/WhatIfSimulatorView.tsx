import React, { useState } from 'react';
import {
  Sliders,
  Sparkles,
  TrendingUp,
  Activity,
  Heart,
  Moon,
  Utensils,
  RefreshCw,
  Zap,
  ArrowRight
} from 'lucide-react';
import { simulateLifestyleOutcome, SimulationResult } from '../services/api';

export const WhatIfSimulatorView: React.FC = () => {
  const [stepDelta, setStepDelta] = useState(2500);
  const [sleepDelta, setSleepDelta] = useState(45);
  const [proteinDelta, setProteinDelta] = useState(25);
  const [workoutDays, setWorkoutDays] = useState(4);
  const [timeframeWeeks, setTimeframeWeeks] = useState(8);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simResult, setSimResult] = useState<SimulationResult | null>({
    timeframe: '8 Weeks',
    forecastedMetrics: {
      vo2MaxChange: '+2.4 mL/kg/min (Projected: 51.0)',
      restingHRChange: '-3 BPM (Projected: 56 BPM)',
      hrvChange: '+8 ms (Projected: 72 ms)',
      vitalScoreChange: '+6 pts (Projected: 90/100)'
    },
    mechanisticRationale: 'Sustained daily steps (+2,500) and +45 min sleep duration compound over 8 weeks to improve endothelial nitric oxide synthesis and parasympathetic vagal recovery.',
    riskFactors: ['Ensure gradual progression to avoid tendon overload if adding high impact running.'],
    keyMilestones: [
      'Week 2: Enhanced daytime alertness and deeper sleep cycle efficiency.',
      'Week 4: Noticeable drop in resting heart rate and +1.2 VO2 max increase.',
      'Week 8: 90+ Vital Score readiness with stabilized metabolic profile.'
    ]
  });

  const handleRunSimulation = async () => {
    setIsSimulating(true);
    try {
      const res = await simulateLifestyleOutcome({
        stepDelta,
        sleepDelta,
        proteinDelta,
        workoutDays,
        timeframeWeeks
      });
      setSimResult(res);
    } catch (err) {
      console.error('Simulation failed:', err);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-amber-400" />
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">"What-If" Health & Performance Simulator</h1>
          </div>
          <p className="text-xs text-slate-300">
            Model forward-looking physiological changes in VO2 max, resting heart rate, and autonomic recovery based on lifestyle adjustments.
          </p>
        </div>

        <button
          onClick={handleRunSimulation}
          disabled={isSimulating}
          className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 hover:brightness-110 shadow-md shadow-amber-500/20 transition-all flex items-center gap-1.5"
        >
          {isSimulating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
          Run Simulation Engine
        </button>
      </div>

      {/* Control Panel: Interactive Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Slider 1: Daily Steps */}
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase">Daily Steps</span>
            <span className="text-xs font-bold text-cyan-400">
              {stepDelta > 0 ? `+${stepDelta.toLocaleString()}` : `${stepDelta.toLocaleString()}`} / day
            </span>
          </div>
          <input
            type="range"
            min="-4000"
            max="8000"
            step="500"
            value={stepDelta}
            onChange={(e) => setStepDelta(parseInt(e.target.value))}
            className="w-full accent-cyan-500"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>-4k</span>
            <span>Current (11.4k)</span>
            <span>+8k</span>
          </div>
        </div>

        {/* Slider 2: Sleep Duration */}
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase">Sleep Duration</span>
            <span className="text-xs font-bold text-indigo-400">
              {sleepDelta > 0 ? `+${sleepDelta} mins` : `${sleepDelta} mins`} / night
            </span>
          </div>
          <input
            type="range"
            min="-90"
            max="120"
            step="15"
            value={sleepDelta}
            onChange={(e) => setSleepDelta(parseInt(e.target.value))}
            className="w-full accent-indigo-500"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>-90m</span>
            <span>Current (7h42m)</span>
            <span>+2 hrs</span>
          </div>
        </div>

        {/* Slider 3: Daily Protein Intake */}
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase">Protein Intake</span>
            <span className="text-xs font-bold text-emerald-400">
              {proteinDelta > 0 ? `+${proteinDelta}g` : `${proteinDelta}g`} / day
            </span>
          </div>
          <input
            type="range"
            min="-40"
            max="60"
            step="5"
            value={proteinDelta}
            onChange={(e) => setProteinDelta(parseInt(e.target.value))}
            className="w-full accent-emerald-500"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>-40g</span>
            <span>Current (168g)</span>
            <span>+60g</span>
          </div>
        </div>

        {/* Slider 4: Time Horizon */}
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase">Time Horizon</span>
            <span className="text-xs font-bold text-amber-400">{timeframeWeeks} Weeks</span>
          </div>
          <input
            type="range"
            min="4"
            max="24"
            step="4"
            value={timeframeWeeks}
            onChange={(e) => setTimeframeWeeks(parseInt(e.target.value))}
            className="w-full accent-amber-500"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>4 Weeks</span>
            <span>12 Weeks</span>
            <span>24 Weeks</span>
          </div>
        </div>

      </div>

      {/* Forecasted Outcomes Display */}
      {simResult && (
        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Projected Trajectory</span>
              <h3 className="text-base font-bold text-white">Physiological Adaptations Over {simResult.timeframe}</h3>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
              Evidence-Based Physiological Model
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
              <span className="text-xs text-slate-400 uppercase font-bold block">VO2 Max Change</span>
              <span className="text-xl sm:text-2xl font-black text-emerald-400">{simResult.forecastedMetrics.vo2MaxChange}</span>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
              <span className="text-xs text-slate-400 uppercase font-bold block">Resting Heart Rate</span>
              <span className="text-xl sm:text-2xl font-black text-cyan-400">{simResult.forecastedMetrics.restingHRChange}</span>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
              <span className="text-xs text-slate-400 uppercase font-bold block">Overnight HRV</span>
              <span className="text-xl sm:text-2xl font-black text-indigo-400">{simResult.forecastedMetrics.hrvChange}</span>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
              <span className="text-xs text-slate-400 uppercase font-bold block">Vital Score</span>
              <span className="text-xl sm:text-2xl font-black text-amber-400">{simResult.forecastedMetrics.vitalScoreChange}</span>
            </div>
          </div>

          {/* Mechanistic Rationale */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider block">Mechanistic Physiological Pathway:</span>
            <p className="text-xs text-slate-300 leading-relaxed">
              {simResult.mechanisticRationale}
            </p>
          </div>

          {/* Timeline Milestones */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Key Physiological Milestones:</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {simResult.keyMilestones.map((m, idx) => (
                <div key={idx} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-300">
                  {m}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
