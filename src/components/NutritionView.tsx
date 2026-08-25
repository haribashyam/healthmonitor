import React, { useState } from 'react';
import {
  Utensils,
  Plus,
  Flame,
  CheckCircle2,
  PieChart,
  Layers,
  Sparkles,
  Droplets,
  Trash2,
  Clock,
  Zap,
  TrendingUp,
  AlertCircle,
  Check,
  ChevronRight
} from 'lucide-react';
import { NutritionDay, MealItem, AdaptivePlan } from '../types';

interface NutritionViewProps {
  nutritionDays: NutritionDay[];
  onOpenDataSources: () => void;
  adaptivePlan?: AdaptivePlan;
}

export const NutritionView: React.FC<NutritionViewProps> = ({
  nutritionDays,
  onOpenDataSources,
  adaptivePlan
}) => {
  // Plan Targets (dynamically derived from AI adaptive plan if provided, or default)
  const planTargets = adaptivePlan?.nutritionTargets || {
    dailyCalories: 2450,
    proteinGrams: 165,
    carbGrams: 280,
    fatGrams: 75,
    hydrationLiters: 3.4,
    focusNotes: 'High bioavailability protein post-workout and slow-release complex carbohydrates.'
  };

  const initialMeals: MealItem[] = [
    {
      id: 'm1',
      name: 'Post-Run Recovery Oats & Whey',
      type: 'breakfast',
      calories: 650,
      protein: 48,
      carbs: 80,
      fats: 14,
      time: '08:30 AM',
      verifiedSource: 'VitalSync Log'
    },
    {
      id: 'm2',
      name: 'Wild Atlantic Salmon & Quinoa Bowl',
      type: 'lunch',
      calories: 820,
      protein: 56,
      carbs: 90,
      fats: 24,
      time: '01:15 PM',
      verifiedSource: 'VitalSync Log'
    },
    {
      id: 'm3',
      name: 'Grass-Fed Sirloin & Roasted Sweet Potato',
      type: 'dinner',
      calories: 880,
      protein: 62,
      carbs: 95,
      fats: 28,
      time: '07:45 PM',
      verifiedSource: 'VitalSync Log'
    }
  ];

  const [meals, setMeals] = useState<MealItem[]>(initialMeals);
  const [waterCount, setWaterCount] = useState<number>(3.2);

  // Form State for Logging New Meal
  const [mealCategory, setMealCategory] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('snack');
  const [mealName, setMealName] = useState('');
  const [caloriesInput, setCaloriesInput] = useState('');
  const [proteinInput, setProteinInput] = useState('');
  const [carbsInput, setCarbsInput] = useState('');
  const [fatsInput, setFatsInput] = useState('');
  const [timeInput, setTimeInput] = useState(
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  );
  const [showSuccessBadge, setShowSuccessBadge] = useState(false);
  const [selectedQuickPreset, setSelectedQuickPreset] = useState<string | null>(null);

  // Quick Preset Food Items for Rapid Logging
  const quickPresets = [
    { name: 'Whey Isolate Shake & Banana', cat: 'snack', cal: 320, p: 35, c: 38, f: 3 },
    { name: 'Greek Yogurt 0% with Blueberries & Honey', cat: 'snack', cal: 240, p: 25, c: 28, f: 2 },
    { name: 'Grilled Chicken Breast & White Rice (200g)', cat: 'lunch', cal: 580, p: 52, c: 68, f: 8 },
    { name: '3 Scrambled Eggs & Avocado Sourdough Toast', cat: 'breakfast', cal: 540, p: 28, c: 42, f: 28 },
    { name: 'Almonds (30g) & Apple', cat: 'snack', cal: 260, p: 6, c: 28, f: 15 },
    { name: 'Electrolyte Amino Hydration Drink', cat: 'snack', cal: 40, p: 8, c: 2, f: 0 }
  ];

  const handleApplyPreset = (preset: typeof quickPresets[0]) => {
    setSelectedQuickPreset(preset.name);
    setMealName(preset.name);
    setMealCategory(preset.cat as any);
    setCaloriesInput(preset.cal.toString());
    setProteinInput(preset.p.toString());
    setCarbsInput(preset.c.toString());
    setFatsInput(preset.f.toString());
  };

  // Aggregated totals
  const totalCaloriesLogged = meals.reduce((acc, m) => acc + (m.calories || 0), 0);
  const totalProteinLogged = meals.reduce((acc, m) => acc + (m.protein || 0), 0);
  const totalCarbsLogged = meals.reduce((acc, m) => acc + (m.carbs || 0), 0);
  const totalFatsLogged = meals.reduce((acc, m) => acc + (m.fats || 0), 0);

  const calorieDiff = totalCaloriesLogged - planTargets.dailyCalories;
  const adherenceScore = Math.min(100, Math.round((totalCaloriesLogged / planTargets.dailyCalories) * 100));

  const handleAddMeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mealName.trim() || !caloriesInput) return;

    const newMeal: MealItem = {
      id: `meal-${Date.now()}`,
      name: mealName.trim(),
      type: mealCategory,
      calories: parseInt(caloriesInput, 10) || 0,
      protein: parseInt(proteinInput, 10) || 0,
      carbs: parseInt(carbsInput, 10) || 0,
      fats: parseInt(fatsInput, 10) || 0,
      time: timeInput || 'Now',
      verifiedSource: 'Manual VitalSync Entry'
    };

    setMeals((prev) => [newMeal, ...prev]);
    setMealName('');
    setCaloriesInput('');
    setProteinInput('');
    setCarbsInput('');
    setFatsInput('');
    setSelectedQuickPreset(null);
    setShowSuccessBadge(true);
    setTimeout(() => setShowSuccessBadge(false), 3500);
  };

  const handleDeleteMeal = (id: string) => {
    setMeals((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Utensils className="w-5 h-5 text-emerald-400" />
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Nutrition & Fueling Intelligence</h1>
          </div>
          <p className="text-xs text-slate-300">
            Log daily meals, track macronutrient adherence in real-time, and align fueling with your adaptive workout plan.
          </p>
        </div>

        <button
          onClick={onOpenDataSources}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 text-slate-200 hover:text-white border border-slate-700 transition-all flex items-center gap-1.5"
        >
          <Layers className="w-3.5 h-3.5 text-cyan-400" /> Sync MyFitnessPal / Cronometer
        </button>
      </div>

      {/* TARGET VS ACTUAL MACRO CONNECTION HERO */}
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-6 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Target vs Actual Adherence</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <h3 className="text-2xl font-black text-white">{totalCaloriesLogged} / {planTargets.dailyCalories}</h3>
              <span className="text-xs text-slate-400 font-medium">kcal logged</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${
              adherenceScore >= 90 && adherenceScore <= 110
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                : adherenceScore < 90
                ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
            }`}>
              {adherenceScore}% Plan Target ({calorieDiff >= 0 ? `+${calorieDiff}` : `${calorieDiff}`} kcal)
            </span>
          </div>
        </div>

        {/* 4 Macro Progress Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          
          {/* Calorie Intake Tile */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center space-y-2">
            <span className="text-[11px] text-slate-400 uppercase font-bold block">Calories</span>
            <span className="text-2xl font-black text-white">{totalCaloriesLogged}</span>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (totalCaloriesLogged / planTargets.dailyCalories) * 100)}%` }}
              />
            </div>
            <span className="text-[11px] text-slate-400 block">Target: {planTargets.dailyCalories} kcal</span>
          </div>

          {/* Protein Tile */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center space-y-2">
            <span className="text-[11px] text-slate-400 uppercase font-bold block">Protein</span>
            <span className="text-2xl font-black text-emerald-400">{totalProteinLogged}g</span>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (totalProteinLogged / planTargets.proteinGrams) * 100)}%` }}
              />
            </div>
            <span className="text-[11px] text-slate-400 block">Target: {planTargets.proteinGrams}g</span>
          </div>

          {/* Carbohydrates Tile */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center space-y-2">
            <span className="text-[11px] text-slate-400 uppercase font-bold block">Carbohydrates</span>
            <span className="text-2xl font-black text-cyan-400">{totalCarbsLogged}g</span>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-cyan-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (totalCarbsLogged / planTargets.carbGrams) * 100)}%` }}
              />
            </div>
            <span className="text-[11px] text-slate-400 block">Target: {planTargets.carbGrams}g</span>
          </div>

          {/* Fats Tile */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center space-y-2">
            <span className="text-[11px] text-slate-400 uppercase font-bold block">Healthy Fats</span>
            <span className="text-2xl font-black text-amber-400">{totalFatsLogged}g</span>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (totalFatsLogged / planTargets.fatGrams) * 100)}%` }}
              />
            </div>
            <span className="text-[11px] text-slate-400 block">Target: {planTargets.fatGrams}g</span>
          </div>

        </div>

        {/* Water Hydration Quick Logger */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Daily Hydration: {waterCount.toFixed(1)} Liters</span>
              <span className="text-[11px] text-slate-400">Plan Target: {planTargets.hydrationLiters}L for cellular recovery</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setWaterCount((w) => Number((w + 0.25).toFixed(2)))}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 transition-all"
            >
              + 250ml Glass
            </button>
            <button
              onClick={() => setWaterCount((w) => Number((w + 0.5).toFixed(2)))}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-cyan-500/30 text-cyan-200 border border-cyan-500/50 hover:bg-cyan-500/40 transition-all"
            >
              + 500ml Bottle
            </button>
          </div>
        </div>
      </div>

      {/* TWO COLUMN GRID: LOGGING FORM + LOGGED MEALS FEED */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: MEAL & CALORIE LOGGING FORM (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-4 shadow-md">
          <div className="border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-400" />
              <h3 className="text-base font-bold text-white">Log Meal & Macro Intake</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Record meals to update your real-time adherence progress immediately.
            </p>
          </div>

          {showSuccessBadge && (
            <div className="bg-emerald-500/15 border border-emerald-500/40 rounded-xl p-3 text-xs text-emerald-300 flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>Meal logged successfully and connected to plan targets!</span>
            </div>
          )}

          {/* Quick Presets Picker */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Quick Smart Presets
            </span>
            <div className="flex flex-wrap gap-1.5">
              {quickPresets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                    selectedQuickPreset === preset.name
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-semibold'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {preset.name.split(' ')[0]} {preset.name.split(' ')[1] || ''} ({preset.cal} kcal)
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleAddMeal} className="space-y-4 pt-1">
            {/* Meal Category */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Meal Type</label>
              <div className="grid grid-cols-4 gap-1.5">
                {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setMealCategory(cat)}
                    className={`py-1.5 text-xs font-bold rounded-lg capitalize border transition-all ${
                      mealCategory === cat
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Meal Name */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Meal Description / Food Items</label>
              <input
                type="text"
                required
                value={mealName}
                onChange={(e) => setMealName(e.target.value)}
                placeholder="e.g., Grilled Chicken Breast with Brown Rice & Broccoli"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Macro Breakdown Inputs */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Calories (kcal)</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={caloriesInput}
                  onChange={(e) => setCaloriesInput(e.target.value)}
                  placeholder="e.g., 650"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Protein (g)</label>
                <input
                  type="number"
                  min="0"
                  value={proteinInput}
                  onChange={(e) => setProteinInput(e.target.value)}
                  placeholder="e.g., 45"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-emerald-400 font-mono placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Carbs (g)</label>
                <input
                  type="number"
                  min="0"
                  value={carbsInput}
                  onChange={(e) => setCarbsInput(e.target.value)}
                  placeholder="e.g., 75"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-cyan-400 font-mono placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Fats (g)</label>
                <input
                  type="number"
                  min="0"
                  value={fatsInput}
                  onChange={(e) => setFatsInput(e.target.value)}
                  placeholder="e.g., 18"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-amber-400 font-mono placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Time input */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Time of Ingestion</label>
              <input
                type="text"
                value={timeInput}
                onChange={(e) => setTimeInput(e.target.value)}
                placeholder="e.g., 12:45 PM"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Log Meal to Plan
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: TODAY'S LOGGED MEALS FEED (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-4 shadow-md flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Today's Ingestion Timeline</h3>
                <p className="text-xs text-slate-400">Total {meals.length} logged records</p>
              </div>
              <span className="text-xs font-bold text-emerald-400 font-mono">
                {totalCaloriesLogged} kcal
              </span>
            </div>

            {meals.length === 0 ? (
              <div className="text-center py-10 text-slate-500 text-xs">
                No meals logged today yet. Use the form on the left to record your nutrition.
              </div>
            ) : (
              <div className="space-y-3">
                {meals.map((meal) => (
                  <div
                    key={meal.id}
                    className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80 hover:border-slate-700 transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase px-2 py-0.5 rounded bg-slate-900 text-emerald-400 border border-slate-800">
                          {meal.type}
                        </span>
                        <h4 className="text-sm font-bold text-white">{meal.name}</h4>
                        <span className="text-xs text-slate-400">({meal.time})</span>
                      </div>
                      <button
                        onClick={() => handleDeleteMeal(meal.id)}
                        className="text-slate-500 hover:text-rose-400 p-1 rounded transition-colors"
                        title="Remove meal entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-xs font-mono">
                      <span className="font-bold text-white">{meal.calories} kcal</span>
                      <div className="flex items-center gap-3">
                        <span className="text-emerald-400">P: {meal.protein}g</span>
                        <span className="text-cyan-400">C: {meal.carbs}g</span>
                        <span className="text-amber-400">F: {meal.fats}g</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* AI Plan Nutrition Timing Rationale */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs flex items-start gap-2.5 mt-4">
            <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold text-slate-200">AI Plan Fueling Strategy:</span>
              <p className="text-slate-400 leading-relaxed">
                {planTargets.focusNotes}
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
