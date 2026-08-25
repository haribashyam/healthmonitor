import React, { useState } from 'react';
import {
  ShieldCheck,
  Activity,
  Layers,
  Sparkles,
  TrendingUp,
  RefreshCw,
  Clock,
  Compass
} from 'lucide-react';

export const DigitalTwinAndRadarView: React.FC = () => {
  const [timelineDay, setTimelineDay] = useState(90);

  // 8-Axis Metrics
  const axes = [
    { label: 'Sleep Quality', current: 88, baseline: 74, goal: 95 },
    { label: 'Autonomic HRV', current: 85, baseline: 70, goal: 90 },
    { label: 'Aerobic Base (VO2)', current: 82, baseline: 65, goal: 90 },
    { label: 'Activity & Movement', current: 90, baseline: 68, goal: 95 },
    { label: 'Nutrition Adherence', current: 84, baseline: 60, goal: 90 },
    { label: 'Metabolic Glucose', current: 89, baseline: 75, goal: 95 },
    { label: 'Lipid Cardiovascular', current: 80, baseline: 72, goal: 90 },
    { label: 'Habit Consistency', current: 92, baseline: 64, goal: 95 }
  ];

  // Calculate polygon points for SVG Radar
  const size = 320;
  const center = size / 2;
  const radius = center - 40;
  const totalAxes = axes.length;

  const getCoordinates = (value: number, index: number) => {
    const angle = (Math.PI * 2 / totalAxes) * index - Math.PI / 2;
    const r = (value / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  const currentPoints = axes.map((a, i) => {
    const { x, y } = getCoordinates(a.current, i);
    return `${x},${y}`;
  }).join(' ');

  const baselinePoints = axes.map((a, i) => {
    const { x, y } = getCoordinates(a.baseline, i);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Digital Twin & 8-Axis Health Radar</h1>
          </div>
          <p className="text-xs text-slate-300">
            Multi-dimensional physiological model mapping current status against historical baseline and long-term targets.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5 text-cyan-400">
            <span className="w-3 h-3 rounded-full bg-cyan-400/80" /> Current (Day 90)
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <span className="w-3 h-3 rounded-full bg-slate-600" /> Day 1 Baseline
          </div>
        </div>
      </div>

      {/* Main Radar & Health Dimension Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* SVG Radar Visualization */}
        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 flex flex-col items-center justify-center relative shadow-md">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            8-Axis Physiological Equilibrium
          </h3>

          <div className="relative w-full max-w-xs sm:max-w-sm aspect-square flex items-center justify-center">
            <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full">
              {/* Concentric grid webs (25%, 50%, 75%, 100%) */}
              {[0.25, 0.5, 0.75, 1].map((scale, sIdx) => {
                const webPoints = axes.map((_, i) => {
                  const angle = (Math.PI * 2 / totalAxes) * i - Math.PI / 2;
                  const r = scale * radius;
                  const x = center + r * Math.cos(angle);
                  const y = center + r * Math.sin(angle);
                  return `${x},${y}`;
                }).join(' ');
                return (
                  <polygon
                    key={sIdx}
                    points={webPoints}
                    fill="none"
                    stroke="#334155"
                    strokeWidth="1"
                    strokeDasharray={sIdx < 3 ? "3 3" : undefined}
                  />
                );
              })}

              {/* Radial Axis Spokes */}
              {axes.map((_, i) => {
                const angle = (Math.PI * 2 / totalAxes) * i - Math.PI / 2;
                const x2 = center + radius * Math.cos(angle);
                const y2 = center + radius * Math.sin(angle);
                return (
                  <line
                    key={i}
                    x1={center}
                    y1={center}
                    x2={x2}
                    y2={y2}
                    stroke="#1e293b"
                    strokeWidth="1.5"
                  />
                );
              })}

              {/* Baseline Polygon (Gray) */}
              <polygon
                points={baselinePoints}
                fill="rgba(100, 116, 139, 0.15)"
                stroke="#64748b"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />

              {/* Current Status Polygon (Cyan) */}
              <polygon
                points={currentPoints}
                fill="rgba(6, 182, 212, 0.25)"
                stroke="#06b6d4"
                strokeWidth="2.5"
              />

              {/* Data Point Dots */}
              {axes.map((a, i) => {
                const { x, y } = getCoordinates(a.current, i);
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r="4"
                    fill="#06b6d4"
                    stroke="#0f172a"
                    strokeWidth="2"
                  />
                );
              })}
            </svg>
          </div>

          <span className="text-[11px] text-slate-400 mt-3 text-center">
            Overall Health Equilibrium Index: <strong className="text-emerald-400">86.2 / 100 (+18.4% since Day 1)</strong>
          </span>
        </div>

        {/* Dimension Table & Scores */}
        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-3 shadow-md">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Dimension Progression</h3>

          <div className="space-y-2.5">
            {axes.map((item, idx) => (
              <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-white block">{item.label}</span>
                  <span className="text-[11px] text-slate-400">Day 1: {item.baseline}/100 → Target: {item.goal}/100</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="font-mono font-black text-cyan-400 text-sm">{item.current}</span>
                    <span className="text-[10px] text-emerald-400 block">+{item.current - item.baseline} pts</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 90-Day Health Journey Time-Machine Scrubber */}
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-4 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">90-Day Health Evolution Scrubber</h3>
          </div>
          <span className="text-xs font-bold text-cyan-400">Viewing: Day {timelineDay} of 90</span>
        </div>

        <input
          type="range"
          min="1"
          max="90"
          value={timelineDay}
          onChange={(e) => setTimelineDay(parseInt(e.target.value))}
          className="w-full accent-cyan-500"
        />

        <div className="flex justify-between text-xs text-slate-400">
          <span>Day 1 (Initial Setup & Baseline)</span>
          <span>Day 45 (Mid-cycle Adaptation)</span>
          <span>Day 90 (Peak Physiological Form)</span>
        </div>
      </div>

    </div>
  );
};
