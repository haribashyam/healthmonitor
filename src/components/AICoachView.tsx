import React, { useState } from 'react';
import { Sparkles, Zap, Send, RefreshCw, Dumbbell, Utensils, ShoppingCart, CircleCheck as CheckCircle2, FileSliders as Sliders, FileText, Radio, Play, Pause, RotateCcw, Award } from 'lucide-react';
import { AdaptivePlan } from '../types';
import { generateAdaptivePlan } from '../services/api';
import { askMyData, AskDataResponse } from '../services/api';
import { simulateLifestyleOutcome, SimulationResult } from '../services/api';

interface AICoachViewProps {
  adaptivePlan: AdaptivePlan;
  setAdaptivePlan: React.Dispatch<React.SetStateAction<AdaptivePlan>>;
  healthContext: any;
  askPrompt?: string;
  onOpenLiveWorkout: () => void;
  onOpenDoctorReport: () => void;
}

type SubTab = 'ask' | 'plan' | 'simulator';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  responseObj?: AskDataResponse;
  timestamp: string;
}

export const AICoachView: React.FC<AICoachViewProps> = ({
  adaptivePlan, setAdaptivePlan, healthContext, askPrompt, onOpenLiveWorkout, onOpenDoctorReport
}) => {
  const [subTab, setSubTab] = useState<SubTab>('ask');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-1', sender: 'assistant',
      text: 'Hello! I am your VITALOS Health Copilot. Ask me anything about your connected workouts, sleep, heart rate, biomarkers, or nutrition trends.',
      timestamp: '08:00 AM'
    }
  ]);
  const [inputQuery, setInputQuery] = useState(askPrompt || '');
  const [isLoading, setIsLoading] = useState(false);

  // Plan state
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [planTab, setPlanTab] = useState<'workouts' | 'nutrition' | 'groceries' | 'rules'>('workouts');
  const [copiedGrocery, setCopiedGrocery] = useState(false);

  // Simulator state
  const [stepDelta, setStepDelta] = useState(2500);
  const [sleepDelta, setSleepDelta] = useState(45);
  const [proteinDelta, setProteinDelta] = useState(25);
  const [timeframeWeeks, setTimeframeWeeks] = useState(8);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simResult, setSimResult] = useState<SimulationResult | null>(null);

  React.useEffect(() => {
    if (askPrompt) { setInputQuery(askPrompt); setSubTab('ask'); }
  }, [askPrompt]);

  const tabs: { id: SubTab; label: string; icon: any }[] = [
    { id: 'ask', label: 'Ask My Data', icon: Zap },
    { id: 'plan', label: 'Adaptive Plan', icon: Sparkles },
    { id: 'simulator', label: 'What-If Simulator', icon: Sliders },
  ];

  const presetQueries = [
    'Why was my recovery higher this morning?',
    'How active was I over the last 14 days?',
    'Compare my resting heart rate to baseline',
    'Summarize my latest blood biomarkers',
    'What should I eat to fuel my Zone 2 runs?'
  ];

  const handleSend = async (queryText: string) => {
    if (!queryText.trim() || isLoading) return;
    const userMsg: Message = { id: `user-${Date.now()}`, sender: 'user', text: queryText, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);
    try {
      const result = await askMyData(queryText, healthContext);
      const assistantMsg: Message = { id: `ai-${Date.now()}`, sender: 'assistant', text: result.answer, responseObj: result, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
      setMessages(prev => [...prev, assistantMsg]);
    } catch {
      const errorMsg: Message = { id: `err-${Date.now()}`, sender: 'assistant', text: 'Unable to process query. Please try again.', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
      setMessages(prev => [...prev, errorMsg]);
    } finally { setIsLoading(false); }
  };

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    try {
      const newPlan = await generateAdaptivePlan({
        goal: 'Optimize aerobic base and lean mass',
        fitnessLevel: 'Intermediate',
        dietaryPreference: 'High-protein Whole Foods',
        healthMetrics: { vo2Max: 48.6, restingHR: 59, hrvBaseline: 64, stepAvg: 10400 },
        recentRecovery: { score: 88, status: 'Optimal Recovery' }
      });
      setAdaptivePlan(newPlan);
    } catch (err) { console.error('Plan regeneration failed:', err); }
    finally { setIsRegenerating(false); }
  };

  const handleCopyGrocery = () => {
    const text = adaptivePlan.groceryEssentials.map(cat => `${cat.category.toUpperCase()}:\n${cat.items.map(i => `  • ${i}`).join('\n')}`).join('\n\n');
    navigator.clipboard.writeText(text);
    setCopiedGrocery(true);
    setTimeout(() => setCopiedGrocery(false), 2500);
  };

  const handleRunSimulation = async () => {
    setIsSimulating(true);
    try {
      const res = await simulateLifestyleOutcome({ stepDelta, sleepDelta, proteinDelta, workoutDays: 4, timeframeWeeks });
      setSimResult(res);
    } catch { console.error('Simulation failed'); }
    finally { setIsSimulating(false); }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-md">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">AI Health Coach</h1>
          <p className="text-xs text-slate-400 mt-1">Ask questions, view your adaptive plan, and simulate lifestyle changes.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={onOpenLiveWorkout} className="px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 hover:brightness-110 transition-all flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5" /> Live Workout
          </button>
          <button onClick={onOpenDoctorReport} className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 transition-all flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" /> Export PDF
          </button>
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const active = subTab === tab.id;
          return (
            <button key={tab.id} onClick={() => setSubTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                active ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
              }`}>
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ASK MY DATA */}
      {subTab === 'ask' && (
        <div className="space-y-4 max-w-4xl mx-auto">
          {/* Presets */}
          <div className="flex flex-wrap gap-2">
            {presetQueries.map((q, i) => (
              <button key={i} onClick={() => handleSend(q)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800 transition-all text-left">
                {q}
              </button>
            ))}
          </div>

          {/* Messages */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 sm:p-6 space-y-4 min-h-[400px] max-h-[560px] overflow-y-auto">
            {messages.map(msg => (
              <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`rounded-2xl p-4 max-w-2xl text-xs space-y-3 ${
                  msg.sender === 'user' ? 'bg-cyan-500 text-slate-950 font-semibold rounded-tr-none' : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none shadow-md'
                }`}>
                  <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>
                  {msg.responseObj && (
                    <div className="space-y-2.5 pt-2 border-t border-slate-800/80">
                      {msg.responseObj.citations && msg.responseObj.citations.length > 0 && (
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-bold text-cyan-400 uppercase">Data Points Cited:</span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                            {msg.responseObj.citations.map((c, i) => (
                              <div key={i} className="bg-slate-900 p-2 rounded-lg border border-slate-800 text-[11px] flex items-center justify-between">
                                <span className="text-slate-300">{c.metric}</span>
                                <span className="text-cyan-400 font-mono">{c.value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {msg.responseObj.recommendation && (
                        <div className="bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-500/30 text-emerald-300 text-[11px] flex items-start gap-2">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <div><strong>Recommended:</strong> {msg.responseObj.recommendation}</div>
                        </div>
                      )}
                      <div className="flex items-center justify-between text-[10px] text-slate-500">
                        <span>Confidence: <strong className="text-emerald-400">{msg.responseObj.confidence}</strong></span>
                        <span>{msg.timestamp}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-slate-400 p-3 bg-slate-950 rounded-xl border border-slate-800 w-fit">
                <RefreshCw className="w-4 h-4 text-cyan-400 animate-spin" />
                <span>Cross-referencing telemetry and biomarkers...</span>
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={e => { e.preventDefault(); handleSend(inputQuery); }} className="flex items-center gap-2 bg-slate-900 p-2 rounded-2xl border border-slate-800 focus-within:border-cyan-500 transition-all shadow-lg">
            <input type="text" value={inputQuery} onChange={e => setInputQuery(e.target.value)}
              placeholder="Ask about your health data..."
              className="flex-1 px-4 py-2.5 text-xs bg-transparent text-slate-200 placeholder-slate-500 focus:outline-none" />
            <button type="submit" disabled={!inputQuery.trim() || isLoading}
              className="px-5 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 hover:brightness-110 disabled:opacity-50 transition-all flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5" /> Ask
            </button>
          </form>
        </div>
      )}

      {/* ADAPTIVE PLAN */}
      {subTab === 'plan' && (
        <div className="space-y-4">
          {/* Plan header */}
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-md">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> AI-Synthesized Health Protocol
              </span>
              <h2 className="text-xl font-black text-white mt-1">{adaptivePlan.planName}</h2>
              <p className="text-xs text-slate-300 mt-1">{adaptivePlan.summary}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={handleRegenerate} disabled={isRegenerating}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700 transition-all flex items-center gap-1.5">
                {isRegenerating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />} Re-Calibrate
              </button>
              <button onClick={onOpenLiveWorkout}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 hover:brightness-110 transition-all flex items-center gap-1.5">
                <Dumbbell className="w-3.5 h-3.5" /> Start Session
              </button>
            </div>
          </div>

          {/* Plan sub-tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {[
              { id: 'workouts', label: '7-Day Split', icon: Dumbbell },
              { id: 'nutrition', label: 'Macro Targets', icon: Utensils },
              { id: 'groceries', label: 'Grocery List', icon: ShoppingCart },
              { id: 'rules', label: 'Adaptive Rules', icon: Sparkles },
            ].map(t => {
              const Icon = t.icon;
              const active = planTab === t.id;
              return (
                <button key={t.id} onClick={() => setPlanTab(t.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    active ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                  }`}>
                  <Icon className="w-3.5 h-3.5" />
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* Workouts */}
          {planTab === 'workouts' && (
            <div className="space-y-3">
              {adaptivePlan.workoutSplit.map((day, i) => (
                <div key={i} className={`rounded-2xl p-5 border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                  day.completed ? 'bg-slate-950/60 border-slate-800/80 opacity-75' : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 shadow-sm'
                }`}>
                  <div className="space-y-2 max-w-2xl flex-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="text-xs font-black text-cyan-400 uppercase">{day.day}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        day.intensity === 'High' ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                        : day.intensity === 'Moderate' ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                        : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                      }`}>{day.intensity}</span>
                      {day.completed && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Done</span>}
                    </div>
                    <h3 className="text-base font-bold text-white">{day.title}</h3>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                      <span className="flex items-center gap-1"><RefreshCw className="w-3.5 h-3.5" /> {day.duration}</span>
                      <span>❤️ Target HR: <strong className="text-slate-200">{day.targetHR}</strong></span>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                      <p className="text-slate-400">{day.sourceRationale}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Nutrition */}
          {planTab === 'nutrition' && (
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-6">
              <h3 className="text-base font-bold text-white flex items-center gap-2"><Utensils className="w-4 h-4 text-emerald-400" /> Macronutrient Targets</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                  <span className="text-xs text-slate-400 uppercase font-bold block">Daily Energy</span>
                  <span className="text-2xl font-black text-white">{adaptivePlan.nutritionTargets.dailyCalories}</span>
                  <span className="text-xs text-slate-400">kcal</span>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                  <span className="text-xs text-slate-400 uppercase font-bold block">Protein</span>
                  <span className="text-2xl font-black text-emerald-400">{adaptivePlan.nutritionTargets.proteinGrams}g</span>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                  <span className="text-xs text-slate-400 uppercase font-bold block">Carbs</span>
                  <span className="text-2xl font-black text-cyan-400">{adaptivePlan.nutritionTargets.carbGrams}g</span>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                  <span className="text-xs text-slate-400 uppercase font-bold block">Fats</span>
                  <span className="text-2xl font-black text-amber-400">{adaptivePlan.nutritionTargets.fatGrams}g</span>
                </div>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-white uppercase">Clinical Nutrition Strategy:</span>
                <p className="text-xs text-slate-300">{adaptivePlan.nutritionTargets.focusNotes}</p>
                <div className="text-xs text-slate-400 pt-2 border-t border-slate-800/80">💧 Hydration: <strong className="text-cyan-400">{adaptivePlan.nutritionTargets.hydrationLiters} Liters</strong></div>
              </div>
            </div>
          )}

          {/* Groceries */}
          {planTab === 'groceries' && (
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2"><ShoppingCart className="w-4 h-4 text-cyan-400" /> Smart Grocery List</h3>
                <button onClick={handleCopyGrocery}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-all flex items-center gap-1.5">
                  {copiedGrocery ? <><CheckCircle2 className="w-3.5 h-3.5" /> Copied!</> : <><ShoppingCart className="w-3.5 h-3.5" /> Copy List</>}
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {adaptivePlan.groceryEssentials.map((cat, i) => (
                  <div key={i} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                    <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">{cat.category}</h4>
                    <ul className="space-y-2">
                      {cat.items.map((item, j) => (
                        <li key={j} className="text-xs text-slate-200 flex items-center gap-2">
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

          {/* Rules */}
          {planTab === 'rules' && (
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2"><Sparkles className="w-4 h-4 text-amber-400" /> Bio-Adaptive Feedback Rules</h3>
              <p className="text-xs text-slate-300">VITALOS checks your sleep and autonomic markers each morning. If deviations are detected, the protocol adapts automatically:</p>
              <div className="space-y-3">
                {adaptivePlan.adaptiveRules.map((rule, i) => (
                  <div key={i} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-start gap-3">
                    <span className="p-1 rounded bg-amber-500/10 text-amber-400 text-xs font-bold">Rule {i + 1}</span>
                    <p className="text-xs text-slate-200">{rule}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* SIMULATOR */}
      {subTab === 'simulator' && (
        <div className="space-y-4">
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2"><Sliders className="w-5 h-5 text-amber-400" /> What-If Simulator</h1>
              <p className="text-xs text-slate-400 mt-1">Model how lifestyle changes affect your physiology over time.</p>
            </div>
            <button onClick={handleRunSimulation} disabled={isSimulating}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 hover:brightness-110 transition-all flex items-center gap-1.5">
              {isSimulating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              {isSimulating ? 'Simulating...' : 'Run Simulation'}
            </button>
          </div>

          {/* Sliders */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Daily Steps', value: stepDelta, min: -4000, max: 8000, step: 500, set: setStepDelta, color: 'accent-cyan-500', sub: `${stepDelta > 0 ? '+' : ''}${stepDelta.toLocaleString()}/day` },
              { label: 'Sleep Duration', value: sleepDelta, min: -90, max: 120, step: 15, set: setSleepDelta, color: 'accent-indigo-500', sub: `${sleepDelta > 0 ? '+' : ''}${sleepDelta} min/night` },
              { label: 'Protein Intake', value: proteinDelta, min: -40, max: 60, step: 5, set: setProteinDelta, color: 'accent-emerald-500', sub: `${proteinDelta > 0 ? '+' : ''}${proteinDelta}g/day` },
              { label: 'Time Horizon', value: timeframeWeeks, min: 4, max: 24, step: 4, set: setTimeframeWeeks, color: 'accent-amber-500', sub: `${timeframeWeeks} Weeks` },
            ].map(s => (
              <div key={s.label} className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 uppercase">{s.label}</span>
                  <span className="text-xs font-bold text-cyan-400">{s.sub}</span>
                </div>
                <input type="range" min={s.min} max={s.max} step={s.step} value={s.value} onChange={e => s.set(parseInt(e.target.value))} className={`w-full ${s.color}`} />
              </div>
            ))}
          </div>

          {/* Results */}
          {simResult && (
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-xs font-bold text-amber-400 uppercase">Projected Trajectory</span>
                  <h3 className="text-base font-bold text-white">Over {simResult.timeframe}</h3>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">Evidence-Based Model</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'VO2 Max', value: simResult.forecastedMetrics.vo2MaxChange, color: 'text-emerald-400' },
                  { label: 'Resting HR', value: simResult.forecastedMetrics.restingHRChange, color: 'text-cyan-400' },
                  { label: 'HRV', value: simResult.forecastedMetrics.hrvChange, color: 'text-indigo-400' },
                  { label: 'Vital Score', value: simResult.forecastedMetrics.vitalScoreChange, color: 'text-amber-400' },
                ].map(m => (
                  <div key={m.label} className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                    <span className="text-xs text-slate-400 uppercase font-bold block">{m.label}</span>
                    <span className={`text-xl font-black ${m.color}`}>{m.value}</span>
                  </div>
                ))}
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-white uppercase">Mechanism:</span>
                <p className="text-xs text-slate-300">{simResult.mechanisticRationale}</p>
              </div>
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase">Milestones:</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {simResult.keyMilestones.map((m, i) => (
                    <div key={i} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-300">{m}</div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
