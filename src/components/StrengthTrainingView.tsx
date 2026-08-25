import React, { useState } from 'react';
import {
  Dumbbell,
  TrendingUp,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Timer,
  ChevronRight,
  Flame,
  Award,
  Layers,
  Sparkles,
  Info,
  Calendar
} from 'lucide-react';
import { StrengthExercise, StrengthExerciseSet, StrengthWorkoutSession } from '../types';

interface StrengthTrainingViewProps {
  onLogWorkout?: (workout: any) => void;
}

const INITIAL_EXERCISES: StrengthExercise[] = [
  {
    id: 'ex-bench',
    name: 'Barbell Bench Press',
    primaryMuscle: 'Chest',
    secondaryMuscles: ['Triceps', 'Shoulders'],
    equipment: 'Barbell',
    estimatedOneRepMaxKg: 112,
    personalRecord: { weightKg: 105, reps: 3, date: '2026-08-14' },
    fourWeekVolumeProgressionPct: 14.2,
    substitutions: [
      { name: 'Dumbbell Flat Press', rationale: 'Greater shoulder joint freedom & unilateral balance' },
      { name: 'Converging Chest Press Machine', rationale: 'Joint-friendly stabilizer deload for shoulder rehab' }
    ],
    contraindications: ['Active anterior shoulder impingement', 'Rotator cuff inflammation'],
    historySets: [
      { setNumber: 1, type: 'warmup', weightKg: 60, reps: 10, rpe: 5, isCompleted: true },
      { setNumber: 2, type: 'working', weightKg: 85, reps: 8, rpe: 7.5, isCompleted: true },
      { setNumber: 3, type: 'working', weightKg: 90, reps: 6, rpe: 8.5, isCompleted: true },
      { setNumber: 4, type: 'working', weightKg: 92.5, reps: 5, rpe: 9, isCompleted: true }
    ]
  },
  {
    id: 'ex-squat',
    name: 'Barbell Back Squat',
    primaryMuscle: 'Quads',
    secondaryMuscles: ['Glutes', 'Hamstrings', 'Core'],
    equipment: 'Barbell',
    estimatedOneRepMaxKg: 148,
    personalRecord: { weightKg: 135, reps: 4, date: '2026-08-10' },
    fourWeekVolumeProgressionPct: 9.8,
    substitutions: [
      { name: 'Belt Squat Machine', rationale: 'Zero axial spine loading if lower back is fatigued' },
      { name: 'Goblet Squat (Heavy DB)', rationale: 'Upright torso angle with reduced knee shear force' }
    ],
    contraindications: ['Acute patellar tendinopathy', 'L4-L5 disc flare-up'],
    historySets: [
      { setNumber: 1, type: 'warmup', weightKg: 70, reps: 8, rpe: 5, isCompleted: true },
      { setNumber: 2, type: 'working', weightKg: 110, reps: 6, rpe: 8, isCompleted: true },
      { setNumber: 3, type: 'working', weightKg: 120, reps: 5, rpe: 8.5, isCompleted: true }
    ]
  },
  {
    id: 'ex-deadlift',
    name: 'Romanian Deadlift (RDL)',
    primaryMuscle: 'Hamstrings',
    secondaryMuscles: ['Glutes', 'Lower Back', 'Forearms'],
    equipment: 'Barbell',
    estimatedOneRepMaxKg: 140,
    personalRecord: { weightKg: 125, reps: 6, date: '2026-08-18' },
    fourWeekVolumeProgressionPct: 11.5,
    substitutions: [
      { name: 'Dumbbell Single-Leg RDL', rationale: 'Reduced lumbar shear while targeting unilateral hamstring balance' },
      { name: 'Seated Hamstring Leg Curl', rationale: 'Pure knee flexion isolation without spinal compression' }
    ],
    contraindications: ['Acute hamstring pull', 'Lower back spinal disc herniation'],
    historySets: [
      { setNumber: 1, type: 'warmup', weightKg: 60, reps: 10, rpe: 5, isCompleted: true },
      { setNumber: 2, type: 'working', weightKg: 95, reps: 8, rpe: 7.5, isCompleted: true },
      { setNumber: 3, type: 'working', weightKg: 105, reps: 8, rpe: 8.5, isCompleted: true }
    ]
  },
  {
    id: 'ex-pullup',
    name: 'Weighted Pull-Up',
    primaryMuscle: 'Back',
    secondaryMuscles: ['Biceps', 'Forearms'],
    equipment: 'Bodyweight',
    estimatedOneRepMaxKg: 108, // Bodyweight + added
    personalRecord: { weightKg: 20, reps: 5, date: '2026-08-08' },
    fourWeekVolumeProgressionPct: 16.0,
    substitutions: [
      { name: 'Lat Pulldown (Neutral Grip)', rationale: 'Fine-grained weight control and elbow friendly' },
      { name: 'Chest Supported Incline DB Row', rationale: 'Upper lat & rhomboid recruitment without lower back fatigue' }
    ],
    contraindications: ['Medial epicondylitis (Golfer elbow)'],
    historySets: [
      { setNumber: 1, type: 'working', weightKg: 0, reps: 10, rpe: 6, isCompleted: true },
      { setNumber: 2, type: 'working', weightKg: 10, reps: 6, rpe: 8, isCompleted: true },
      { setNumber: 3, type: 'working', weightKg: 15, reps: 5, rpe: 9, isCompleted: true }
    ]
  }
];

export const StrengthTrainingView: React.FC<StrengthTrainingViewProps> = ({ onLogWorkout }) => {
  const [exercises, setExercises] = useState<StrengthExercise[]>(INITIAL_EXERCISES);
  const [selectedMuscle, setSelectedMuscle] = useState<string>('All');
  const [activeExercise, setActiveExercise] = useState<StrengthExercise>(INITIAL_EXERCISES[0]);
  
  // Active Workout Logger State
  const [activeSets, setActiveSets] = useState<StrengthExerciseSet[]>([
    { setNumber: 1, type: 'warmup', weightKg: 60, reps: 10, rpe: 5, isCompleted: true },
    { setNumber: 2, type: 'working', weightKg: 85, reps: 8, rpe: 7.5, isCompleted: true },
    { setNumber: 3, type: 'working', weightKg: 90, reps: 6, rpe: 8.5, isCompleted: false },
    { setNumber: 4, type: 'working', weightKg: 92.5, reps: 5, rpe: 9, isCompleted: false }
  ]);

  // Rest Timer State
  const [restSeconds, setRestSeconds] = useState<number>(90);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [timerLeft, setTimerLeft] = useState<number>(90);

  // 1RM Calculator State
  const [calcWeight, setCalcWeight] = useState<number>(90);
  const [calcReps, setCalcReps] = useState<number>(6);

  // Calculate 1RM using Epley and Brzycki
  const epley1RM = Math.round(calcWeight * (1 + calcReps / 30));
  const brzycki1RM = Math.round(calcWeight * (36 / (37 - calcReps)));
  const avg1RM = Math.round((epley1RM + brzycki1RM) / 2);

  // Progressive Overload Total Volume
  const totalVolumeKg = activeSets
    .filter(s => s.isCompleted)
    .reduce((sum, s) => sum + (s.weightKg * s.reps), 0);

  const muscles = ['All', 'Chest', 'Back', 'Quads', 'Hamstrings', 'Shoulders', 'Biceps', 'Triceps', 'Core'];

  const filteredExercises = selectedMuscle === 'All' 
    ? exercises 
    : exercises.filter(e => e.primaryMuscle === selectedMuscle || e.secondaryMuscles.includes(selectedMuscle));

  const toggleSetComplete = (index: number) => {
    setActiveSets(prev => prev.map((s, idx) => {
      if (idx === index) {
        const nextState = !s.isCompleted;
        if (nextState) {
          // Trigger rest timer
          setTimerLeft(restSeconds);
          setIsTimerRunning(true);
        }
        return { ...s, isCompleted: nextState };
      }
      return s;
    }));
  };

  const addSet = () => {
    const lastSet = activeSets[activeSets.length - 1];
    const newSetNumber = activeSets.length + 1;
    setActiveSets(prev => [
      ...prev,
      {
        setNumber: newSetNumber,
        type: 'working',
        weightKg: lastSet ? lastSet.weightKg : 80,
        reps: lastSet ? lastSet.reps : 8,
        rpe: 8,
        isCompleted: false
      }
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/70 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 mb-2">
              <Dumbbell className="w-3.5 h-3.5" />
              <span>System 3 • Strength Intelligence & Progressive Overload Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              Hypertrophy & Strength Command
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Tracks exercise library, 1RM trajectories, RPE fatigue, working volume, and automated injury contraindication substitutions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 block font-mono uppercase">Current Session Volume</span>
              <span className="text-lg font-extrabold text-indigo-400 font-mono">{totalVolumeKg.toLocaleString()} kg</span>
            </div>
            <div className="px-4 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 block font-mono uppercase">4-Wk Volume Trajectory</span>
              <span className="text-lg font-extrabold text-emerald-400 font-mono">+14.2% ↗</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Progressive Overload Insight Callout */}
      <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-800/60 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
        <div className="text-xs">
          <span className="font-bold text-indigo-300 block mb-0.5">AI Progressive Overload Feedback</span>
          <p className="text-slate-300 leading-relaxed">
            “Your bench press volume has increased <strong className="text-indigo-200">14.2%</strong> over the last 4 weeks. With last night's elevated deep sleep (1h 48m) and positive HRV (+7 ms above baseline), your recovery permits today's planned intensity of <strong className="text-white">92.5 kg × 5 @ RPE 9</strong>.”
          </p>
        </div>
      </div>

      {/* Muscle Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {muscles.map(m => (
          <button
            key={m}
            onClick={() => setSelectedMuscle(m)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              selectedMuscle === m
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-900/90 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* 2-Column Grid: Active Set Logger & Exercise Library */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Active Exercise & Set Logger (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {activeExercise.primaryMuscle}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-400">
                    {activeExercise.equipment}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white mt-1.5">{activeExercise.name}</h2>
                <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                  <span>PR: <strong className="text-slate-200">{activeExercise.personalRecord.weightKg} kg × {activeExercise.personalRecord.reps}</strong></span>
                  <span>•</span>
                  <span>Est 1RM: <strong className="text-indigo-400 font-mono">{activeExercise.estimatedOneRepMaxKg} kg</strong></span>
                </div>
              </div>

              {/* Rest Timer Widget */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-right">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1 justify-end">
                  <Timer className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Rest Timer</span>
                </div>
                <div className="text-lg font-bold font-mono text-cyan-400">
                  {Math.floor(timerLeft / 60)}:{(timerLeft % 60).toString().padStart(2, '0')}
                </div>
                <div className="flex items-center gap-1 mt-1 justify-end">
                  <button
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    className="px-2 py-0.5 rounded text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-200"
                  >
                    {isTimerRunning ? 'Pause' : 'Start'}
                  </button>
                  <button
                    onClick={() => { setTimerLeft(restSeconds); setIsTimerRunning(false); }}
                    className="p-1 rounded text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200"
                  >
                    <RotateCcw className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* Set Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-2.5 px-3">Set</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Weight (kg)</th>
                    <th className="py-2.5 px-3">Reps</th>
                    <th className="py-2.5 px-3">RPE</th>
                    <th className="py-2.5 px-3 text-right">Done</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {activeSets.map((s, idx) => (
                    <tr
                      key={idx}
                      className={`transition-colors ${s.isCompleted ? 'bg-indigo-950/20 text-slate-200' : 'text-slate-300 hover:bg-slate-800/40'}`}
                    >
                      <td className="py-3 px-3 font-bold text-slate-400">{s.setNumber}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-sans font-bold ${
                          s.type === 'warmup' ? 'bg-slate-800 text-slate-400' : 'bg-indigo-500/20 text-indigo-300'
                        }`}>
                          {s.type}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <input
                          type="number"
                          value={s.weightKg}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value) || 0;
                            setActiveSets(prev => prev.map((item, i) => i === idx ? { ...item, weightKg: val } : item));
                          }}
                          className="w-16 px-2 py-1 rounded bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:border-indigo-500 focus:outline-none"
                        />
                      </td>
                      <td className="py-3 px-3">
                        <input
                          type="number"
                          value={s.reps}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0;
                            setActiveSets(prev => prev.map((item, i) => i === idx ? { ...item, reps: val } : item));
                          }}
                          className="w-14 px-2 py-1 rounded bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:border-indigo-500 focus:outline-none"
                        />
                      </td>
                      <td className="py-3 px-3">
                        <input
                          type="number"
                          step="0.5"
                          max="10"
                          min="1"
                          value={s.rpe || 8}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value) || 8;
                            setActiveSets(prev => prev.map((item, i) => i === idx ? { ...item, rpe: val } : item));
                          }}
                          className="w-14 px-2 py-1 rounded bg-slate-950 border border-slate-800 text-indigo-300 text-xs font-mono focus:border-indigo-500 focus:outline-none"
                        />
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => toggleSetComplete(idx)}
                          className={`p-1.5 rounded-lg transition-all ${
                            s.isCompleted 
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                              : 'bg-slate-800 text-slate-500 hover:text-slate-300 border border-slate-700'
                          }`}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={addSet}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-all"
              >
                <Plus className="w-3.5 h-3.5 text-indigo-400" />
                Add Set
              </button>

              <button
                onClick={() => {
                  if (onLogWorkout) {
                    onLogWorkout({
                      title: `Strength: ${activeExercise.name}`,
                      type: 'Strength',
                      durationMinutes: 45,
                      avgHeartRate: 128,
                      maxHeartRate: 156,
                      calories: 380,
                      trainingLoad: 68,
                      date: new Date().toISOString().split('T')[0],
                      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                      source: 'VITALOS Strength Engine'
                    });
                  }
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                Log Completed Workout Session
              </button>
            </div>

            {/* Smart Substitutions & Injury Guard */}
            {activeExercise.substitutions && activeExercise.substitutions.length > 0 && (
              <div className="pt-4 border-t border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                  Biomechanically Verified Substitutions
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeExercise.substitutions.map((sub, sIdx) => (
                    <div key={sIdx} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs">
                      <span className="font-semibold text-cyan-300 block">{sub.name}</span>
                      <span className="text-[11px] text-slate-400">{sub.rationale}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: 1RM Calculator & Exercise Library (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* 1RM Estimator Card */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                One-Rep Max (1RM) Estimator
              </h3>
              <span className="text-[10px] text-slate-500 font-mono">Epley & Brzycki</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Weight Lifted (kg)</label>
                <input
                  type="number"
                  value={calcWeight}
                  onChange={(e) => setCalcWeight(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Reps Performed</label>
                <input
                  type="number"
                  value={calcReps}
                  onChange={(e) => setCalcReps(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 block">Estimated 1RM Target</span>
                <span className="text-xl font-extrabold text-amber-400 font-mono">{avg1RM} kg</span>
              </div>
              <div className="text-right text-[11px] text-slate-400 space-y-0.5">
                <div>80% 1RM (Hypertrophy): <strong className="text-slate-200 font-mono">{Math.round(avg1RM * 0.8)} kg</strong></div>
                <div>70% 1RM (Endurance): <strong className="text-slate-200 font-mono">{Math.round(avg1RM * 0.7)} kg</strong></div>
              </div>
            </div>
          </div>

          {/* Exercise Library Selection List */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              Exercise Library ({filteredExercises.length})
            </h3>
            
            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {filteredExercises.map((ex) => (
                <div
                  key={ex.id}
                  onClick={() => {
                    setActiveExercise(ex);
                    setActiveSets(ex.historySets);
                  }}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    activeExercise.id === ex.id
                      ? 'bg-indigo-950/40 border-indigo-500/50 shadow-md shadow-indigo-500/10'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-950'
                  }`}
                >
                  <div>
                    <span className="text-xs font-bold text-white block">{ex.name}</span>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                      <span>{ex.primaryMuscle}</span>
                      <span>•</span>
                      <span className="text-indigo-400 font-mono">1RM: {ex.estimatedOneRepMaxKg} kg</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      +{ex.fourWeekVolumeProgressionPct}%
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-600" />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
