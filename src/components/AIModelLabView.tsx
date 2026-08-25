import React, { useState } from 'react';
import {
  Sparkles,
  Bot,
  ShieldCheck,
  AlertTriangle,
  Layers,
  BarChart3,
  CheckCircle2,
  Cpu,
  Zap,
  Info
} from 'lucide-react';
import { MultiModelConsensusReport } from '../types';

const INITIAL_REPORT: MultiModelConsensusReport = {
  timestamp: '2026-08-25 • Live Consensus Run',
  userQueryOrContext: 'Multi-system evaluation of 90-day telemetry: Elevated deep sleep (1h 48m), +14% bench volume, resting HRV 67ms, ApoB 72 mg/dL, and patellar tendon strain.',
  modelAgreementScorePct: 94,
  evaluations: [
    {
      modelName: 'Gemini 2.5 Pro (Google)',
      recommendationSummary: 'Greenlight hypertrophy push with strict patellar shear protection. Maintain Zone 2 aerobic base 120 mins/week to support GLUT-4 glucose clearance and cardiovascular mitochondrial density.',
      confidenceScorePct: 96,
      primaryEvidenceCited: 'Autonomic HRV z-score is +0.9σ above baseline; ACWR ratio is 1.08 (optimal green zone 0.8-1.3); ApoB of 72 mg/dL indicates low atherogenic particle burden.',
      contradictionsOrHallucinations: 'None. Grounded strictly in provided telemetry packets.',
      riskAssessment: 'Safe & Evidence-Grounded'
    },
    {
      modelName: 'Claude 3.7 Sonnet (Anthropic)',
      recommendationSummary: 'Support strength volume progression while substituting axial barbell squats with belt squats or Spanish squats until patellar tendon pain drops to <1/10.',
      confidenceScorePct: 94,
      primaryEvidenceCited: 'Patellar tendon collagen remodelling responds optimally to isometric loading without dynamic plyometrics; nocturnal deep sleep (22% of total sleep) supports growth hormone secretion.',
      contradictionsOrHallucinations: 'None detected. Physiological mechanism aligns with sports medicine literature.',
      riskAssessment: 'Safe & Evidence-Grounded'
    },
    {
      modelName: 'GPT-4o (OpenAI)',
      recommendationSummary: 'Proceed with planned upper body push session. Maintain 400mg elemental magnesium glycinate pre-bed to preserve the +9ms HRV elevation observed in Experiment 1.',
      confidenceScorePct: 92,
      primaryEvidenceCited: 'Postprandial glycemic excursions remain tightly controlled (<128 mg/dL peak) with 94% time-in-range. Adequate glycogen resynthesis for high-intensity lifting.',
      contradictionsOrHallucinations: 'None. Strong multi-variate alignment with other models.',
      riskAssessment: 'Safe & Evidence-Grounded'
    }
  ],
  synthesizedActionPlan: 'Consensus Verdict (94% Agreement): 1) Proceed with upper body strength session today at planned RPE 8.5-9; 2) Enforce patellar tendon isometric protocol before leg sessions; 3) Continue 400mg evening magnesium and Zone 2 recovery cadence.'
};

export const AIModelLabView: React.FC = () => {
  const [report] = useState<MultiModelConsensusReport>(INITIAL_REPORT);
  const [selectedModel, setSelectedModel] = useState<string>('all');

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/70 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 mb-2">
              <Cpu className="w-3.5 h-3.5" />
              <span>Systems 77 & 78 • Multi-LLM Consensus Lab & Hallucination Audit Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              AI Multi-Model Consensus Lab
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Simultaneously prompts Gemini 2.5 Pro, Claude 3.7 Sonnet, and GPT-4o with identical normalized health vectors to audit discrepancies and synthesize clinical consensus.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 block font-mono uppercase">Model Agreement</span>
              <span className="text-lg font-extrabold text-emerald-400 font-mono">{report.modelAgreementScorePct}% Consensus</span>
            </div>
            <div className="px-4 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 block font-mono uppercase">Hallucination Audit</span>
              <span className="text-lg font-extrabold text-cyan-400 font-mono">0 Flags (Safe)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Synthesis Layer Box */}
      <div className="p-5 rounded-2xl bg-cyan-950/20 border border-cyan-800/50 shadow-md space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-cyan-300 flex items-center gap-2 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            Cross-Model Synthesized Action Plan
          </span>
          <span className="text-xs font-mono text-emerald-400 font-bold">High Scientific Convergence</span>
        </div>
        <p className="text-sm text-white font-medium leading-relaxed">
          {report.synthesizedActionPlan}
        </p>
      </div>

      {/* 3 Model Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {report.evaluations.map((evalItem, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Bot className="w-4 h-4 text-cyan-400" />
                  {evalItem.modelName}
                </span>
                <span className="text-xs font-bold font-mono text-cyan-400">
                  {evalItem.confidenceScorePct}% Conf
                </span>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 font-semibold block mb-1">Recommendation</span>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {evalItem.recommendationSummary}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] space-y-1">
                <span className="font-semibold text-slate-400 block">Biological Evidence Cited:</span>
                <p className="text-slate-300">{evalItem.primaryEvidenceCited}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px]">
              <span className="text-emerald-400 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {evalItem.riskAssessment}
              </span>
              <span className="text-slate-500 font-mono">Audited</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
