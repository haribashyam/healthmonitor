import React, { useState } from 'react';
import {
  Sparkles,
  Dumbbell,
  Utensils,
  ShoppingCart,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Copy,
  Check,
  ChevronDown,
  Info,
  Layers,
  ArrowRight,
  Flame,
  Clock,
  Heart,
  ListTodo,
  ExternalLink,
  FileText
} from 'lucide-react';
import { AdaptivePlan, WorkoutPlanDay, GroceryItemCategory } from '../types';
import { generateAdaptivePlan } from '../services/api';
import { syncAllWorkoutsToGoogleWorkspace, addWorkoutToGoogleCalendar, addWorkoutToGoogleTasks } from '../services/googleWorkspaceService';

interface AIPlanViewProps {
  adaptivePlan: AdaptivePlan;
  setAdaptivePlan: React.Dispatch<React.SetStateAction<AdaptivePlan>>;
  onOpenLiveWorkout: () => void;
  onOpenDoctorReport?: () => void;
}

export const AIPlanView: React.FC<AIPlanViewProps> = ({
  adaptivePlan,
  setAdaptivePlan,
  onOpenLiveWorkout,
  onOpenDoctorReport
}) => {
  const [activePlanTab, setActivePlanTab] = useState<'workouts' | 'nutrition' | 'groceries' | 'rules'>('workouts');
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [copiedGrocery, setCopiedGrocery] = useState(false);

  // Customization Prompt State
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [userGoal, setUserGoal] = useState('Optimize aerobic base (Zone 2) and lean mass');
  const [fitnessLevel, setFitnessLevel] = useState('Intermediate');
  const [dietaryPref, setDietaryPref] = useState('High-protein Anti-inflammatory Whole Foods');

  const toggleWorkoutCompleted = (dayIndex: number) => {
    setAdaptivePlan((prev) => {
      const nextSplit = [...prev.workoutSplit];
      nextSplit[dayIndex] = {
        ...nextSplit[dayIndex],
        completed: !nextSplit[dayIndex].completed
      };
      return { ...prev, workoutSplit: nextSplit };
    });
  };

  const toggleWorkoutDowngraded = (dayIndex: number) => {
    setAdaptivePlan((prev) => {
      const nextSplit = [...prev.workoutSplit];
      const current = nextSplit[dayIndex];
      const isNowDowngraded = !current.isDowngraded;

      nextSplit[dayIndex] = {
        ...current,
        isDowngraded: isNowDowngraded,
        title: isNowDowngraded ? `Active Recovery & Gentle Mobility (Adapted)` : current.title,
        intensity: isNowDowngraded ? 'Recovery' : current.intensity,
        targetHR: isNowDowngraded ? '< 110 BPM' : current.targetHR,
        downgradeReason: isNowDowngraded ? 'Adapted due to elevated fatigue or lower morning HRV score.' : undefined
      };
      return { ...prev, workoutSplit: nextSplit };
    });
  };

  const handleRegeneratePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegenerating(true);
    try {
      const newPlan = await generateAdaptivePlan({
        goal: userGoal,
        fitnessLevel,
        dietaryPreference: dietaryPref,
        healthMetrics: { vo2Max: 48.6, restingHR: 59, hrvBaseline: 64, stepAvg: 10400 },
        recentRecovery: { score: 88, status: 'Optimal Recovery' }
      });
      setAdaptivePlan(newPlan);
      setShowConfigModal(false);
    } catch (err) {
      console.error('Failed to regenerate plan:', err);
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleCopyGroceryList = () => {
    const text = adaptivePlan.groceryEssentials
      .map((cat) => `${cat.category.toUpperCase()}:\n${cat.items.map(i => `  • ${i}`).join('\n')}`)
      .join('\n\n');
    navigator.clipboard.writeText(text);
    setCopiedGrocery(true);
    setTimeout(() => setCopiedGrocery(false), 2500);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Hero Header */}
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-md">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              AI-Synthesized Health Protocol
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {adaptivePlan.planName}
          </h1>
          <p className="text-xs text-slate-300 leading-relaxed">
            {adaptivePlan.summary}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {onOpenDoctorReport && (
            <button
              onClick={onOpenDoctorReport}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40 transition-all flex items-center justify-center gap-1.5 shadow-sm"
              title="Export complete plan and metrics for doctor or physical therapist"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-400" /> Export Plan PDF
            </button>
          )}
          <button
            onClick={() => setShowConfigModal(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700 border border-slate-700 transition-all flex items-center justify-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5 text-cyan-400" /> Re-Calibrate Protocol
          </button>
          <button
            onClick={onOpenLiveWorkout}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 hover:brightness-110 shadow-md shadow-cyan-500/20 transition-all flex items-center justify-center gap-1.5"
          >
            <Dumbbell className="w-3.5 h-3.5" /> Start Today's Session in HUD
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        {[
          { id: 'workouts', label: '7-Day Workout Split', icon: Dumbbell },
          { id: 'nutrition', label: 'Nutrition & Macro Targets', icon: Utensils },
          { id: 'groceries', label: 'Smart Grocery Checklist', icon: ShoppingCart },
          { id: 'rules', label: 'Bio-Adaptive Feedback Rules', icon: Sparkles }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActivePlanTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                activePlanTab === tab.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: 7-Day Workout Split */}
      {activePlanTab === 'workouts' && (
        <div className="space-y-4">
          {/* Google Calendar & Tasks Integration Bar */}
          <div className="bg-slate-900/90 rounded-2xl p-4 sm:p-5 border border-blue-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
                <ListTodo className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  Google Calendar & Google Tasks Integration
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                    Live Sync Ready
                  </span>
                </h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  Automatically schedules your 7-day adaptive split into Google Calendar with target heart rate zones and task notifications.
                </p>
              </div>
            </div>

            <button
              onClick={async () => {
                await syncAllWorkoutsToGoogleWorkspace(adaptivePlan.workoutSplit);
                alert('All 7 workouts successfully synchronized to your Google Calendar and Tasks!');
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 whitespace-nowrap"
            >
              <Calendar className="w-3.5 h-3.5" />
              Sync 7 Days to Google Calendar
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3.5">
            {adaptivePlan.workoutSplit.map((day, idx) => (
              <div
                key={idx}
                className={`rounded-2xl p-5 border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                  day.completed
                    ? 'bg-slate-950/60 border-slate-800/80 opacity-75'
                    : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 shadow-sm'
                }`}
              >
                <div className="space-y-2 max-w-2xl flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="text-xs font-black text-cyan-400 uppercase tracking-wider">
                      {day.day}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        day.intensity === 'High'
                          ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                          : day.intensity === 'Moderate'
                          ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                          : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                      }`}
                    >
                      {day.intensity} Intensity
                    </span>
                    {day.completed && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Completed
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-white">
                    {day.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                    <span className="flex items-center gap-1 text-slate-400">
                      <Clock className="w-3.5 h-3.5" /> Duration: <strong className="text-slate-200">{day.duration}</strong>
                    </span>
                    <span className="flex items-center gap-1 text-slate-400">
                      <Heart className="w-3.5 h-3.5 text-rose-400" /> Target HR: <strong className="text-slate-200">{day.targetHR}</strong>
                    </span>
                  </div>

                  {/* Why this recommendation? Data citation badge */}
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2">
                    <Info className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-200 uppercase text-[10px] block">Physiological Rationale:</span>
                      <p className="text-slate-400 leading-relaxed">{day.sourceRationale}</p>
                    </div>
                  </div>

                  {/* Exercises Details if present */}
                  {day.exercises && day.exercises.length > 0 && (
                    <div className="pt-2">
                      <span className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Structured Sets & Prescriptions:</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {day.exercises.map((ex, exIdx) => (
                          <div key={exIdx} className="bg-slate-950/70 p-2 rounded-lg border border-slate-800/60 text-xs flex items-center justify-between">
                            <span className="text-slate-200 font-medium">{ex.name}</span>
                            <span className="text-[11px] text-cyan-400 font-mono">{ex.sets} × {ex.reps}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex md:flex-col items-center justify-end gap-2 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-slate-800">
                  <button
                    onClick={() => toggleWorkoutCompleted(idx)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 w-full justify-center ${
                      day.completed
                        ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {day.completed ? 'Mark Incomplete' : 'Mark Completed'}
                  </button>

                  <div className="flex items-center gap-1.5 w-full">
                    <button
                      onClick={async () => {
                        await addWorkoutToGoogleCalendar(day);
                        alert(`Scheduled "${day.title}" in Google Calendar!`);
                      }}
                      title="Add to Google Calendar"
                      className="flex-1 px-2 py-1.5 rounded-lg text-[11px] font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center gap-1"
                    >
                      <Calendar className="w-3 h-3 text-cyan-400" /> Cal
                    </button>
                    <button
                      onClick={async () => {
                        await addWorkoutToGoogleTasks(day);
                        alert(`Added "${day.title}" to Google Tasks!`);
                      }}
                      title="Add to Google Tasks"
                      className="flex-1 px-2 py-1.5 rounded-lg text-[11px] font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center gap-1"
                    >
                      <ListTodo className="w-3 h-3 text-blue-400" /> Task
                    </button>
                  </div>

                  <button
                    onClick={() => toggleWorkoutDowngraded(idx)}
                    className="px-3 py-1 rounded-lg text-[11px] font-semibold text-slate-400 hover:text-slate-200 underline w-full text-center"
                  >
                    {day.isDowngraded ? 'Revert to Original' : 'Downgrade for Fatigue'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Nutrition & Macro Targets */}
      {activePlanTab === 'nutrition' && (
        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-6">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Utensils className="w-4 h-4 text-emerald-400" />
              Macronutrient Targets & Metabolic Fueling Protocol
            </h3>
            <p className="text-xs text-slate-400">
              Calibrated to match your training load, basal metabolic rate, and muscle recovery needs.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
              <span className="text-xs text-slate-400 uppercase font-bold block">Daily Energy</span>
              <span className="text-2xl font-black text-white">{adaptivePlan.nutritionTargets.dailyCalories}</span>
              <span className="text-xs text-slate-400">kcal / day</span>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
              <span className="text-xs text-slate-400 uppercase font-bold block">Protein</span>
              <span className="text-2xl font-black text-emerald-400">{adaptivePlan.nutritionTargets.proteinGrams}g</span>
              <span className="text-xs text-slate-400">2.0g / kg bodyweight</span>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
              <span className="text-xs text-slate-400 uppercase font-bold block">Carbohydrates</span>
              <span className="text-2xl font-black text-cyan-400">{adaptivePlan.nutritionTargets.carbGrams}g</span>
              <span className="text-xs text-slate-400">Glycogen Replenishment</span>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
              <span className="text-xs text-slate-400 uppercase font-bold block">Healthy Fats</span>
              <span className="text-2xl font-black text-amber-400">{adaptivePlan.nutritionTargets.fatGrams}g</span>
              <span className="text-xs text-slate-400">Hormone Optimization</span>
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider block">Clinical Nutrition Strategy:</span>
            <p className="text-xs text-slate-300 leading-relaxed">
              {adaptivePlan.nutritionTargets.focusNotes}
            </p>
            <div className="text-xs text-slate-400 pt-2 border-t border-slate-800/80">
              💧 Daily Hydration Requirement: <strong className="text-cyan-400">{adaptivePlan.nutritionTargets.hydrationLiters} Liters</strong>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Smart Grocery Checklist */}
      {activePlanTab === 'groceries' && (
        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-cyan-400" />
                AI-Compiled Supermarket Grocery List
              </h3>
              <p className="text-xs text-slate-400">
                Directly translated from your 7-day adaptive nutrition split by grocery store aisles.
              </p>
            </div>

            <button
              onClick={handleCopyGroceryList}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-all flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
            >
              {copiedGrocery ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Copied to Clipboard!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copy Grocery Checklist
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {adaptivePlan.groceryEssentials.map((cat, idx) => (
              <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  {cat.category}
                </h4>
                <ul className="space-y-2">
                  {cat.items.map((item, iIdx) => (
                    <li key={iIdx} className="text-xs text-slate-200 flex items-center gap-2">
                      <input type="checkbox" className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-500 bg-slate-900" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Bio-Adaptive Rules */}
      {activePlanTab === 'rules' && (
        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Active Bio-Adaptive Feedback Triggers
          </h3>
          <p className="text-xs text-slate-300">
            VITALOS continuously checks your sleep and autonomic markers each morning. If any deviation is detected, the protocol automatically adapts:
          </p>

          <div className="space-y-3 pt-2">
            {adaptivePlan.adaptiveRules.map((rule, idx) => (
              <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-start gap-3">
                <span className="p-1 rounded bg-amber-500/10 text-amber-400 text-xs font-bold">
                  Rule {idx + 1}
                </span>
                <p className="text-xs text-slate-200 leading-relaxed">{rule}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Re-Calibration Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-cyan-400" /> Re-Calibrate Health Protocol
              </h3>
              <button onClick={() => setShowConfigModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleRegeneratePlan} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Primary Goal</label>
                <input
                  type="text"
                  value={userGoal}
                  onChange={(e) => setUserGoal(e.target.value)}
                  className="w-full p-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Dietary Preference</label>
                <select
                  value={dietaryPref}
                  onChange={(e) => setDietaryPref(e.target.value)}
                  className="w-full p-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                >
                  <option value="High-protein Anti-inflammatory Whole Foods">High-protein Whole Foods</option>
                  <option value="Plant-Based Athletic (High Protein)">Plant-Based / Vegan</option>
                  <option value="Mediterranean Anti-inflammatory">Mediterranean</option>
                  <option value="Low Carbohydrate / Ketogenic">Low Carb / Keto</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Fitness Level</label>
                <select
                  value={fitnessLevel}
                  onChange={(e) => setFitnessLevel(e.target.value)}
                  className="w-full p-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced Endurance">Advanced Endurance</option>
                  <option value="Elite Competitive">Elite Competitive</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowConfigModal(false)}
                  className="px-4 py-2 rounded-lg text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isRegenerating}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400 disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isRegenerating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  Generate Adaptive Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
