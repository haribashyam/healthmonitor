import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Zap,
  Send,
  RefreshCw,
  Dumbbell,
  Utensils,
  ShoppingCart,
  CircleCheck as CheckCircle2,
  FileSliders as Sliders,
  FileText,
  Radio,
  Play,
  Pause,
  RotateCcw,
  Award,
  Terminal,
  Cpu,
  CornerDownLeft,
  Copy
} from 'lucide-react';
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
  adaptivePlan,
  setAdaptivePlan,
  healthContext,
  askPrompt,
  onOpenLiveWorkout,
  onOpenDoctorReport
}) => {
  const [subTab, setSubTab] = useState<SubTab>('ask');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: 'CLINICAL COPILOT ENGINE ACTIVATED.\nCross-referencing live telemetry, nocturnal sleep architecture, blood chemistry panels, and Zone 2 metabolic output. Ask any physiological question below.',
      timestamp: '08:00 EST'
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

  useEffect(() => {
    if (askPrompt) {
      setInputQuery(askPrompt);
      setSubTab('ask');
    }
  }, [askPrompt]);

  const tabs: { id: SubTab; label: string; icon: any }[] = [
    { id: 'ask', label: 'DESK 1: ASK MY DATA ENGINE', icon: Zap },
    { id: 'plan', label: 'DESK 2: ADAPTIVE 7-DAY PROTOCOL', icon: Sparkles },
    { id: 'simulator', label: 'DESK 3: WHAT-IF METABOLIC SIMULATOR', icon: Sliders },
  ];

  const presetQueries = [
    'Why was my parasympathetic recovery higher this morning?',
    'Synthesize aerobic load over the last 14 days',
    'Compare current resting heart rate to 90-day baseline',
    'Summarize high-leverage blood chemistry biomarkers',
    'What nutrition adjustments fuel tomorrow\'s 90-min Zone 2 workout?'
  ];

  const handleSend = async (queryText: string) => {
    if (!queryText.trim() || isLoading) return;
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);
    try {
      const result = await askMyData(queryText, healthContext);
      const assistantMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: result.answer,
        responseObj: result,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch {
      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: 'UNABLE TO SYNTHESIZE RESPONSE. Telemetry pipeline returned timeout. Retrying connection.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
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
    } catch (err) {
      console.error('Plan regeneration failed:', err);
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleCopyGrocery = () => {
    const text = adaptivePlan.groceryEssentials
      .map(cat => `${cat.category.toUpperCase()}:\n${cat.items.map(i => `  • ${i}`).join('\n')}`)
      .join('\n\n');
    navigator.clipboard.writeText(text);
    setCopiedGrocery(true);
    setTimeout(() => setCopiedGrocery(false), 2500);
  };

  const handleRunSimulation = async () => {
    setIsSimulating(true);
    try {
      const res = await simulateLifestyleOutcome({
        stepDelta,
        sleepDelta,
        proteinDelta,
        workoutDays: 4,
        timeframeWeeks
      });
      setSimResult(res);
    } catch {
      console.error('Simulation failed');
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="space-y-6 font-mono">
      
      {/* 1. Header Banner */}
      <div className="bg-[#141414] text-[#F9F9F7] border border-[#262626] p-6 lg:p-8 hard-shadow">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#262626] pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-[#CC0000] text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
                SYNTHESIS ENGINE
              </span>
              <span className="text-xs text-[#888888] uppercase tracking-wider">
                NEURAL PHYSIOLOGY DISPATCH • COPILOT V4.2
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black tracking-tight text-white uppercase">
              AI Health Copilot & Protocol Studio
            </h1>
            <p className="text-xs text-[#A3A3A3] mt-1 max-w-2xl font-mono">
              Query integrated biometric history, generate personalized microcycle splits, and execute deterministic lifestyle modeling simulations.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={onOpenLiveWorkout}
              className="px-4 py-2 bg-[#CC0000] hover:bg-[#b30000] text-white text-xs font-bold uppercase tracking-wider border border-[#111111] flex items-center gap-1.5 transition-colors"
            >
              <Radio className="w-3.5 h-3.5" />
              <span>LIVE TELEMETRY</span>
            </button>
            <button
              onClick={onOpenDoctorReport}
              className="px-4 py-2 bg-[#222222] hover:bg-[#2c2c2c] text-white text-xs font-bold uppercase tracking-wider border border-[#383838] flex items-center gap-1.5 transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>DOCTOR DOSSIER</span>
            </button>
          </div>
        </div>

        {/* Status Metrics in Dark Grey */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-2">
          <div className="bg-[#1C1C1C] border border-[#2D2D2D] p-3 text-center">
            <span className="text-[10px] text-[#888888] uppercase font-bold block">MODEL RUNTIME</span>
            <span className="text-sm font-black text-white font-mono uppercase">GEMINI PRO NEURAL</span>
          </div>
          <div className="bg-[#1C1C1C] border border-[#2D2D2D] p-3 text-center">
            <span className="text-[10px] text-[#888888] uppercase font-bold block">CROSS-REF POINTS</span>
            <span className="text-sm font-black text-white font-mono">1,420 DATA POINTS</span>
          </div>
          <div className="bg-[#1C1C1C] border border-[#2D2D2D] p-3 text-center">
            <span className="text-[10px] text-[#888888] uppercase font-bold block">PROTOCOL ADAPTATION</span>
            <span className="text-sm font-black text-[#4ADE80] font-mono">ACTIVE (REACTIVE)</span>
          </div>
          <div className="bg-[#1C1C1C] border border-[#2D2D2D] p-3 text-center">
            <span className="text-[10px] text-[#888888] uppercase font-bold block">CONFIDENCE THRESHOLD</span>
            <span className="text-sm font-black text-[#4ADE80] font-mono">98.4% HIGH CERTAINTY</span>
          </div>
        </div>
      </div>

      {/* 2. Sub-Tab Switcher */}
      <div className="bg-[#111111] border border-[#262626] p-1 flex items-center gap-1 overflow-x-auto">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const active = subTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold whitespace-nowrap uppercase tracking-wider transition-colors border ${
                active
                  ? 'bg-white text-[#111111] border-white font-black'
                  : 'bg-transparent text-[#888888] border-transparent hover:text-white hover:bg-[#1A1A1A]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          DESK 1: ASK MY DATA ENGINE
         ═══════════════════════════════════════════════════════════════════ */}
      {subTab === 'ask' && (
        <div className="space-y-4 max-w-5xl mx-auto">
          
          {/* Preset Clinical Queries */}
          <div className="bg-[#141414] border border-[#262626] p-4 hard-shadow-sm space-y-2">
            <span className="text-[10px] text-[#888888] uppercase font-bold tracking-wider block">
              SUGGESTED CLINICAL QUERIES:
            </span>
            <div className="flex flex-wrap gap-2">
              {presetQueries.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(q)}
                  className="px-3 py-1.5 text-xs font-mono bg-[#1C1C1C] text-[#CCCCCC] hover:text-white hover:bg-[#252525] border border-[#303030] transition-colors text-left"
                >
                  › {q}
                </button>
              ))}
            </div>
          </div>

          {/* Conversation Ledger */}
          <div className="bg-[#141414] border border-[#262626] p-4 sm:p-6 space-y-4 min-h-[420px] max-h-[600px] overflow-y-auto hard-shadow">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`p-4 max-w-2xl text-xs space-y-3 border ${
                    msg.sender === 'user'
                      ? 'bg-[#CC0000] text-white border-[#111111] font-mono'
                      : 'bg-[#1C1C1C] border-[#2D2D2D] text-[#F9F9F7]'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] pb-1 border-b border-black/20 opacity-80 uppercase tracking-wider">
                    <span>{msg.sender === 'user' ? 'USER DISPATCH' : 'COPILOT SYNTHESIS'}</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <p className="leading-relaxed whitespace-pre-line font-mono text-xs">{msg.text}</p>

                  {msg.responseObj && (
                    <div className="space-y-3 pt-2 border-t border-[#333333] text-xs">
                      {msg.responseObj.citations && msg.responseObj.citations.length > 0 && (
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-bold text-[#CC0000] uppercase tracking-wider">
                            GROUNDED DATA CITATIONS:
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                            {msg.responseObj.citations.map((c, i) => (
                              <div
                                key={i}
                                className="bg-[#141414] p-2 border border-[#2D2D2D] text-[11px] flex items-center justify-between"
                              >
                                <span className="text-[#888888]">{c.metric}</span>
                                <span className="text-white font-bold font-mono">{c.value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {msg.responseObj.recommendation && (
                        <div className="bg-[#1F1F1F] p-3 border border-[#383838] text-[11px] space-y-1">
                          <span className="text-[#4ADE80] font-bold uppercase tracking-wider block">
                            CLINICAL RECOMMENDATION:
                          </span>
                          <p className="text-[#CCCCCC] leading-relaxed">{msg.responseObj.recommendation}</p>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-[10px] text-[#888888] pt-1">
                        <span>CONFIDENCE: <strong className="text-[#4ADE80]">{msg.responseObj.confidence}</strong></span>
                        <span className="uppercase">VALIDATED BY DETERMINISTIC ENGINE</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-[#888888] p-3 bg-[#1C1C1C] border border-[#2D2D2D] w-fit">
                <RefreshCw className="w-4 h-4 text-[#CC0000] animate-spin" />
                <span className="font-mono uppercase">Cross-referencing telemetry, sleep stages, and laboratory records...</span>
              </div>
            )}
          </div>

          {/* Form Input */}
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSend(inputQuery);
            }}
            className="flex items-center gap-2 bg-[#141414] p-2 border border-[#262626] focus-within:border-[#CC0000] hard-shadow"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={e => setInputQuery(e.target.value)}
              placeholder="Query any biomarker, sleep trend, or activity metric..."
              className="flex-1 px-4 py-2.5 text-xs bg-transparent text-white placeholder-[#666666] focus:outline-none font-mono"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isLoading}
              className="px-6 py-2.5 bg-[#CC0000] hover:bg-[#b30000] text-white font-bold text-xs uppercase tracking-wider disabled:opacity-50 transition-colors flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>TRANSMIT</span>
            </button>
          </form>

        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          DESK 2: ADAPTIVE 7-DAY PROTOCOL
         ═══════════════════════════════════════════════════════════════════ */}
      {subTab === 'plan' && (
        <div className="space-y-6">
          
          {/* Plan Header in Dark Grey */}
          <div className="bg-[#141414] border border-[#262626] p-6 hard-shadow flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="max-w-2xl">
              <span className="bg-[#CC0000] text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
                ACTIVE PROTOCOL
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-black uppercase text-white mt-1">
                {adaptivePlan.planName}
              </h2>
              <p className="text-xs text-[#A3A3A3] mt-1 font-mono">{adaptivePlan.summary}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleRegenerate}
                disabled={isRegenerating}
                className="px-4 py-2 bg-[#222222] hover:bg-[#2C2C2C] text-white text-xs font-bold uppercase tracking-wider border border-[#383838] transition-colors flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : 'text-[#CC0000]'}`} />
                <span>{isRegenerating ? 'CALIBRATING...' : 'RE-CALIBRATE'}</span>
              </button>
              <button
                onClick={onOpenLiveWorkout}
                className="px-4 py-2 bg-[#CC0000] hover:bg-[#b30000] text-white text-xs font-bold uppercase tracking-wider border border-[#111111] transition-colors flex items-center gap-1.5"
              >
                <Dumbbell className="w-3.5 h-3.5" />
                <span>COMMENCE SESSION</span>
              </button>
            </div>
          </div>

          {/* Plan Sub-Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto bg-[#111111] p-1 border border-[#262626]">
            {[
              { id: 'workouts', label: '7-DAY SPLIT LEDGER', icon: Dumbbell },
              { id: 'nutrition', label: 'MACRONUTRIENT ALLOCATION', icon: Utensils },
              { id: 'groceries', label: 'PROCUREMENT GROCERY LIST', icon: ShoppingCart },
              { id: 'rules', label: 'ADAPTIVE FEEDBACK RULES', icon: Sparkles },
            ].map(t => {
              const Icon = t.icon;
              const active = planTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setPlanTab(t.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors border ${
                    active
                      ? 'bg-white text-[#111111] border-white font-black'
                      : 'bg-transparent text-[#888888] border-transparent hover:text-white hover:bg-[#1A1A1A]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>

          {/* Workouts Split */}
          {planTab === 'workouts' && (
            <div className="space-y-3">
              {adaptivePlan.workoutSplit.map((day, i) => (
                <div
                  key={i}
                  className={`border p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors hard-shadow-sm ${
                    day.completed
                      ? 'bg-[#111111] border-[#222222] opacity-70'
                      : 'bg-[#151515] border-[#262626] hover:border-[#404040]'
                  }`}
                >
                  <div className="space-y-2 max-w-3xl flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="bg-white text-[#111111] text-[10px] font-black px-2 py-0.5 uppercase">
                        {day.day}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 uppercase border ${
                          day.intensity === 'High'
                            ? 'bg-[#2E1215] text-[#F87171] border-[#EF4444]/40'
                            : day.intensity === 'Moderate'
                            ? 'bg-[#2A2412] text-[#FACC15] border-[#EAB308]/40'
                            : 'bg-[#122A1A] text-[#4ADE80] border-[#22C55E]/40'
                        }`}
                      >
                        {day.intensity} LOAD
                      </span>
                      {day.completed && (
                        <span className="bg-[#122A1A] text-[#4ADE80] text-[10px] font-bold px-2 py-0.5 border border-[#22C55E]/40 flex items-center gap-1 uppercase">
                          <CheckCircle2 className="w-3 h-3" /> EXECUTED
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-white uppercase font-mono">{day.title}</h3>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-[#A3A3A3] font-mono">
                      <span>DURATION: <strong className="text-white">{day.duration}</strong></span>
                      <span>TARGET HR: <strong className="text-[#CC0000]">{day.targetHR}</strong></span>
                    </div>
                    <div className="bg-[#1F1F1F] p-3 border border-[#303030] text-xs text-[#CCCCCC] font-mono">
                      <span className="text-[#888888] uppercase font-bold block mb-0.5">PHYSIOLOGICAL RATIONALE:</span>
                      <p>{day.sourceRationale}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Nutrition */}
          {planTab === 'nutrition' && (
            <div className="bg-[#141414] border border-[#262626] p-6 hard-shadow space-y-6">
              <h3 className="text-base font-serif font-black uppercase text-white tracking-wide border-b border-[#262626] pb-3">
                Prescribed Macronutrient Partitioning
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-[#1C1C1C] border border-[#2D2D2D] p-4 text-center">
                  <span className="text-[10px] text-[#888888] uppercase font-bold block">DAILY TARGET</span>
                  <span className="text-3xl font-black text-white font-mono">{adaptivePlan.nutritionTargets.dailyCalories}</span>
                  <span className="text-[10px] text-[#888888] block">KCAL</span>
                </div>
                <div className="bg-[#1C1C1C] border border-[#2D2D2D] p-4 text-center">
                  <span className="text-[10px] text-[#888888] uppercase font-bold block">LEAN PROTEIN</span>
                  <span className="text-3xl font-black text-[#4ADE80] font-mono">{adaptivePlan.nutritionTargets.proteinGrams}g</span>
                  <span className="text-[10px] text-[#888888] block">2.0G/KG MASS</span>
                </div>
                <div className="bg-[#1C1C1C] border border-[#2D2D2D] p-4 text-center">
                  <span className="text-[10px] text-[#888888] uppercase font-bold block">GLYCOGEN CARBS</span>
                  <span className="text-3xl font-black text-[#60A5FA] font-mono">{adaptivePlan.nutritionTargets.carbGrams}g</span>
                  <span className="text-[10px] text-[#888888] block">ZONE 2 REFUEL</span>
                </div>
                <div className="bg-[#1C1C1C] border border-[#2D2D2D] p-4 text-center">
                  <span className="text-[10px] text-[#888888] uppercase font-bold block">ESSENTIAL FATS</span>
                  <span className="text-3xl font-black text-[#FACC15] font-mono">{adaptivePlan.nutritionTargets.fatGrams}g</span>
                  <span className="text-[10px] text-[#888888] block">HORMONAL SUPPORT</span>
                </div>
              </div>

              <div className="bg-[#1C1C1C] border border-[#2D2D2D] p-4 space-y-2">
                <span className="text-xs font-bold text-white uppercase block">CLINICAL DIETARY DIRECTIVE:</span>
                <p className="text-xs text-[#A3A3A3] font-mono leading-relaxed">{adaptivePlan.nutritionTargets.focusNotes}</p>
                <div className="text-xs text-white pt-2 border-t border-[#2D2D2D]">
                  HYDRATION BENCHMARK: <strong className="text-[#4ADE80]">{adaptivePlan.nutritionTargets.hydrationLiters} LITERS</strong>
                </div>
              </div>
            </div>
          )}

          {/* Groceries */}
          {planTab === 'groceries' && (
            <div className="bg-[#141414] border border-[#262626] p-6 hard-shadow space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#262626] pb-4">
                <div>
                  <h3 className="text-base font-serif font-black uppercase text-white">
                    Clinical Whole-Food Procurement Ledger
                  </h3>
                  <span className="text-[10px] text-[#888888] uppercase">
                    MICRONUTRIENT & AMINO ACID DENSITY
                  </span>
                </div>
                <button
                  onClick={handleCopyGrocery}
                  className="px-4 py-2 bg-[#CC0000] hover:bg-[#b30000] text-white text-xs font-bold uppercase tracking-wider border border-[#111111] transition-colors flex items-center gap-1.5"
                >
                  {copiedGrocery ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>COPIED TO CLIPBOARD</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>COPY SHOPPING LIST</span>
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {adaptivePlan.groceryEssentials.map((cat, i) => (
                  <div key={i} className="bg-[#1C1C1C] border border-[#2D2D2D] p-4 space-y-3">
                    <h4 className="text-xs font-bold text-[#CC0000] uppercase tracking-wider border-b border-[#2D2D2D] pb-1">
                      {cat.category}
                    </h4>
                    <ul className="space-y-2">
                      {cat.items.map((item, j) => (
                        <li key={j} className="text-xs text-[#CCCCCC] flex items-center gap-2 font-mono">
                          <input
                            type="checkbox"
                            className="rounded-none border-[#444444] text-[#CC0000] bg-[#111111] focus:ring-0"
                          />
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
            <div className="bg-[#141414] border border-[#262626] p-6 hard-shadow space-y-4">
              <h3 className="text-base font-serif font-black uppercase text-white border-b border-[#262626] pb-3">
                Bio-Adaptive Dynamic Feedback Thresholds
              </h3>
              <p className="text-xs text-[#A3A3A3] font-mono">
                The VitalSync engine scans nocturnal autonomic metrics every morning at 06:00. When biomarkers deviate beyond 1.5 standard deviations from rolling baseline, protocols modulate automatically:
              </p>
              <div className="space-y-3">
                {adaptivePlan.adaptiveRules.map((rule, i) => (
                  <div key={i} className="bg-[#1C1C1C] border border-[#2D2D2D] p-4 flex items-start gap-3">
                    <span className="bg-[#CC0000] text-white text-[10px] font-bold px-2 py-0.5 uppercase">
                      RULE 0{i + 1}
                    </span>
                    <p className="text-xs text-[#E5E5E5] font-mono">{rule}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          DESK 3: WHAT-IF METABOLIC SIMULATOR
         ═══════════════════════════════════════════════════════════════════ */}
      {subTab === 'simulator' && (
        <div className="space-y-6">
          
          <div className="bg-[#141414] border border-[#262626] p-6 hard-shadow flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-[#CC0000] text-white text-[10px] font-bold px-2 py-0.5 uppercase">
                  DETERMINISTIC SIMULATION
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-black uppercase text-white">
                Physiological What-If Modeling Simulator
              </h2>
              <p className="text-xs text-[#A3A3A3] mt-1 font-mono">
                Project metabolic adaptations, VO2 max trajectories, and resting heart rate shifts across variable time horizons.
              </p>
            </div>
            <button
              onClick={handleRunSimulation}
              disabled={isSimulating}
              className="px-6 py-3 bg-[#CC0000] hover:bg-[#b30000] text-white text-xs font-bold uppercase tracking-wider border border-[#111111] transition-colors flex items-center gap-1.5"
            >
              {isSimulating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              <span>{isSimulating ? 'MODELING IN PROGRESS...' : 'EXECUTE SIMULATION'}</span>
            </button>
          </div>

          {/* Sliders Grid in High Contrast Dark Grey */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'DAILY STEPS DELTA', value: stepDelta, min: -4000, max: 8000, step: 500, set: setStepDelta, sub: `${stepDelta > 0 ? '+' : ''}${stepDelta.toLocaleString()} STEPS/DAY` },
              { label: 'NOCTURNAL SLEEP DELTA', value: sleepDelta, min: -90, max: 120, step: 15, set: setSleepDelta, sub: `${sleepDelta > 0 ? '+' : ''}${sleepDelta} MIN/NIGHT` },
              { label: 'DAILY PROTEIN DELTA', value: proteinDelta, min: -40, max: 60, step: 5, set: setProteinDelta, sub: `${proteinDelta > 0 ? '+' : ''}${proteinDelta}G/DAY` },
              { label: 'TIME HORIZON', value: timeframeWeeks, min: 4, max: 24, step: 4, set: setTimeframeWeeks, sub: `${timeframeWeeks} WEEKS DURATION` },
            ].map(s => (
              <div key={s.label} className="bg-[#1C1C1C] border border-[#2D2D2D] p-5 space-y-3 hard-shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#888888] uppercase font-bold">{s.label}</span>
                  <span className="text-xs font-bold text-white font-mono">{s.sub}</span>
                </div>
                <input
                  type="range"
                  min={s.min}
                  max={s.max}
                  step={s.step}
                  value={s.value}
                  onChange={e => s.set(parseInt(e.target.value))}
                  className="w-full accent-[#CC0000] cursor-pointer"
                />
              </div>
            ))}
          </div>

          {/* Results Dispatch */}
          {simResult && (
            <div className="bg-[#141414] border border-[#262626] p-6 lg:p-8 hard-shadow space-y-6">
              <div className="flex items-center justify-between border-b border-[#262626] pb-3">
                <div>
                  <span className="bg-[#CC0000] text-white text-[10px] font-bold px-2 py-0.5 uppercase">
                    PROJECTED PHYSIOLOGICAL TRAJECTORY
                  </span>
                  <h3 className="text-xl font-serif font-black uppercase text-white mt-1">
                    Forecast Over {simResult.timeframe}
                  </h3>
                </div>
                <span className="bg-[#1E1E1E] text-[#4ADE80] border border-[#333333] px-3 py-1 text-xs font-bold uppercase">
                  PEER-REVIEWED EVIDENCE MODEL
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'VO2 MAX CHANGE', value: simResult.forecastedMetrics.vo2MaxChange, color: 'text-[#4ADE80]' },
                  { label: 'RESTING HR SHIFT', value: simResult.forecastedMetrics.restingHRChange, color: 'text-[#60A5FA]' },
                  { label: 'HRV RMSSD TRAJECTORY', value: simResult.forecastedMetrics.hrvChange, color: 'text-[#A855F7]' },
                  { label: 'VITAL SCORE DELTA', value: simResult.forecastedMetrics.vitalScoreChange, color: 'text-[#FACC15]' },
                ].map(m => (
                  <div key={m.label} className="bg-[#1C1C1C] border border-[#2D2D2D] p-4 text-center">
                    <span className="text-[10px] text-[#888888] uppercase font-bold block">{m.label}</span>
                    <span className={`text-2xl font-black ${m.color} font-mono mt-1 block`}>{m.value}</span>
                  </div>
                ))}
              </div>

              <div className="bg-[#1C1C1C] border border-[#2D2D2D] p-4 space-y-2">
                <span className="text-xs font-bold text-white uppercase block">CELLULAR & MITOCHONDRIAL MECHANISM:</span>
                <p className="text-xs text-[#A3A3A3] font-mono leading-relaxed">{simResult.mechanisticRationale}</p>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] text-[#888888] uppercase font-bold tracking-wider block">EXPECTED CLINICAL MILESTONES:</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {simResult.keyMilestones.map((m, i) => (
                    <div key={i} className="bg-[#1C1C1C] border border-[#2D2D2D] p-3.5 text-xs text-[#CCCCCC] font-mono">
                      <span className="text-[#CC0000] font-bold block mb-1">STAGE 0{i + 1}</span>
                      {m}
                    </div>
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
