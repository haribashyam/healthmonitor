import React, { useState } from 'react';
import {
  Compass,
  TrendingUp,
  Flame,
  Clock,
  Heart,
  Zap,
  MapPin,
  Calendar,
  Activity as ActivityIcon,
  ChevronRight
} from 'lucide-react';
import { Activity } from '../types';

interface ActivityAnalyticsViewProps {
  activities: Activity[];
  onOpenLiveWorkout: () => void;
}

export const ActivityAnalyticsView: React.FC<ActivityAnalyticsViewProps> = ({
  activities,
  onOpenLiveWorkout
}) => {
  const [selectedType, setSelectedType] = useState<string>('all');

  const filtered = selectedType === 'all'
    ? activities
    : activities.filter(a => a.type === selectedType);

  const totalDistance = activities.reduce((acc, a) => acc + (a.distanceKm || 0), 0);
  const totalCalories = activities.reduce((acc, a) => acc + a.calories, 0);
  const totalMinutes = activities.reduce((acc, a) => acc + a.durationMinutes, 0);

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Activity & Aerobic Load Analytics</h1>
          </div>
          <p className="text-xs text-slate-300">
            Multi-source telemetry normalized from Strava, Apple Watch, Garmin, and live BLE streams.
          </p>
        </div>

        <button
          onClick={onOpenLiveWorkout}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 hover:brightness-110 shadow-md shadow-cyan-500/20 transition-all flex items-center gap-1.5"
        >
          <ActivityIcon className="w-3.5 h-3.5" /> Start Live Workout
        </button>
      </div>

      {/* Aggregate Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-center">
          <span className="text-xs text-slate-400 uppercase font-bold block">Total Workouts</span>
          <span className="text-2xl font-black text-white">{activities.length}</span>
          <span className="text-[11px] text-emerald-400">90-Day History</span>
        </div>
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-center">
          <span className="text-xs text-slate-400 uppercase font-bold block">Distance Covered</span>
          <span className="text-2xl font-black text-cyan-400">{totalDistance.toFixed(1)} km</span>
          <span className="text-[11px] text-slate-400">Runs & Rides</span>
        </div>
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-center">
          <span className="text-xs text-slate-400 uppercase font-bold block">Active Energy</span>
          <span className="text-2xl font-black text-amber-400">{totalCalories.toLocaleString()}</span>
          <span className="text-[11px] text-slate-400">kcal burned</span>
        </div>
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-center">
          <span className="text-xs text-slate-400 uppercase font-bold block">Total Time</span>
          <span className="text-2xl font-black text-indigo-400">{Math.round(totalMinutes / 60)} hrs</span>
          <span className="text-[11px] text-slate-400">{totalMinutes} active mins</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto text-xs bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        <span className="text-slate-400 font-bold">Activity Type:</span>
        {['all', 'Run', 'Ride', 'Strength', 'Zone 2 Base', 'Walk'].map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              selectedType === type
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Activity Cards Feed */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((act) => (
          <div
            key={act.id}
            className="bg-slate-900 rounded-xl p-5 border border-slate-800 space-y-3 hover:border-slate-700 transition-all shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
                  {act.type} • {act.source}
                </span>
                <h3 className="text-sm font-bold text-white mt-0.5">{act.title}</h3>
              </div>
              <span className="text-xs text-slate-400">{act.date} {act.time}</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block">Duration</span>
                <span className="font-bold text-white">{act.durationMinutes}m</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Avg Heart Rate</span>
                <span className="font-bold text-rose-400">{act.avgHeartRate} BPM</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Calories</span>
                <span className="font-bold text-amber-400">{act.calories} kcal</span>
              </div>
            </div>

            {act.heartRateZones && (
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">HR Zone Breakdown (Mins):</span>
                <div className="grid grid-cols-5 gap-1 text-[10px] text-center font-mono">
                  <div className="bg-blue-950/60 text-blue-300 p-1 rounded">Z1: {act.heartRateZones.zone1}m</div>
                  <div className="bg-emerald-950/60 text-emerald-300 p-1 rounded font-bold">Z2: {act.heartRateZones.zone2}m</div>
                  <div className="bg-amber-950/60 text-amber-300 p-1 rounded">Z3: {act.heartRateZones.zone3}m</div>
                  <div className="bg-orange-950/60 text-orange-300 p-1 rounded">Z4: {act.heartRateZones.zone4}m</div>
                  <div className="bg-rose-950/60 text-rose-300 p-1 rounded">Z5: {act.heartRateZones.zone5}m</div>
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span>TRIMP Load: <strong className="text-cyan-400">{act.trainingLoad}</strong></span>
              {act.distanceKm && <span>Distance: <strong className="text-white">{act.distanceKm} km</strong></span>}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
