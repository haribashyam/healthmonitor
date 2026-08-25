import React, { useState } from 'react';
import {
  FlaskConical,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Calendar,
  CheckCircle2,
  HelpCircle,
  Search,
  ChevronRight,
  Plus,
  BarChart3,
  Layers,
  Info
} from 'lucide-react';
import { HealthExperiment } from '../types';

const INITIAL_EXPERIMENTS: HealthExperiment[] = [
  {
    id: 'exp-1',
    title: '+30 Minutes Nightly Sleep Extension',
    hypothesis: 'Extending sleep opportunity from 7.2h to 7.8h will raise autonomic resting HRV and reduce next-day cognitive fatigue.',
    durationDays: 14,
    startDate: '2026-08-01',
    endDate: '2026-08-15',
    status: 'completed',
    targetMetric: 'Resting HRV Baseline (rMSSD)',
    baselineValue: 58,
    experimentValue: 67,
    percentageChange: 15.5,
    statisticalConfidence: 'High (p < 0.01)',
    sampleSizeDays: 14,
    confoundingFactors: ['Work travel on Day 8', 'Slightly reduced caffeine intake'],
    verdict: 'Statistically significant elevation in nocturnal HRV (+9 ms) and 18% improvement in self-reported morning energy.'
  },
  {
    id: 'exp-2',
    title: '400mg Magnesium Glycinate at Bedtime',
    hypothesis: 'Evening magnesium supplementation will shorten sleep latency and increase deep slow-wave sleep duration.',
    durationDays: 14,
    startDate: '2026-08-16',
    endDate: '2026-08-30',
    status: 'active',
    targetMetric: 'Deep Slow-Wave Sleep (Minutes)',
    baselineValue: 74,
    experimentValue: 92,
    percentageChange: 24.3,
    statisticalConfidence: 'Moderate (p < 0.05)',
    sampleSizeDays: 10,
    confoundingFactors: ['Cooler bedroom ambient temp (67°F)'],
    verdict: 'Interim data shows +18 mins average deep sleep per night. Night awakenings dropped from 2.4 to 0.8 per night.'
  },
  {
    id: 'exp-3',
    title: 'Strict 02:00 PM Caffeine Curfew',
    hypothesis: 'Eliminating adenosine receptor antagonism post-14:00 will reduce nocturnal resting heart rate by 3-5 BPM.',
    durationDays: 21,
    startDate: '2026-07-05',
    endDate: '2026-07-26',
    status: 'completed',
    targetMetric: 'Resting Heart Rate (BPM)',
    baselineValue: 56,
    experimentValue: 52,
    percentageChange: -7.1,
    statisticalConfidence: 'High (p < 0.01)',
    sampleSizeDays: 21,
    confoundingFactors: ['None identified'],
    verdict: 'Confirmed 4 BPM lower nocturnal heart rate nadir and earlier sleep onset latency by 16 minutes.'
  }
];

export const HealthExperimentsLabView: React.FC = () => {
  const [experiments, setExperiments] = useState<HealthExperiment[]>(INITIAL_EXPERIMENTS);
  const [activeExperiment, setActiveExperiment] = useState<HealthExperiment>(INITIAL_EXPERIMENTS[0]);
  
  // Research Query Mode State
  const [searchQuery, setSearchQuery] = useState<string>('Does my sleep duration affect my 5K running pace?');
  const [queryResult, setQueryResult] = useState<{
    correlation: string;
    sampleSize: string;
    pValue: string;
    interpretation: string;
    caveat: string;
  } | null>({
    correlation: 'r = -0.74 (Strong Negative Correlation)',
    sampleSize: 'N = 42 running sessions across 90 days',
    pValue: 'p = 0.003 (Statistically Significant)',
    interpretation: 'On nights where total sleep exceeded 7.5 hours, average 5K tempo pace was 14 seconds/km faster (4:42/km vs 4:56/km) at identical heart rate strain (158 BPM).',
    caveat: 'Observational correlation does not establish absolute causation; concurrent factors such as carbohydrate fueling and weather temperature also modulate performance.'
  });

  const handleRunQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;
    setQueryResult({
      correlation: 'r = +0.68 (Moderate Positive Correlation)',
      sampleSize: 'N = 64 days of paired telemetry',
      pValue: 'p = 0.012 (Significant)',
      interpretation: `Analysis of your dataset reveals a notable relationship between "${searchQuery}" and autonomic recovery status. Days matching positive protocols showed +11% higher readiness score.`,
      caveat: 'Evaluated on your personal observational N=1 data stream with multi-device validation.'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-purple-950/70 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/30 mb-2">
              <FlaskConical className="w-3.5 h-3.5" />
              <span>Systems 19 & 20 • N=1 Personal Health Experiments & Research Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              Health Experiments Lab & Research
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Conduct structured 14 to 21-day N=1 scientific protocols, benchmark against historical baselines, compute statistical p-values, and query personal telemetry correlations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 block font-mono uppercase">Active Trials</span>
              <span className="text-lg font-extrabold text-purple-400 font-mono">1 Active</span>
            </div>
            <div className="px-4 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 block font-mono uppercase">Completed Protocols</span>
              <span className="text-lg font-extrabold text-emerald-400 font-mono">2 Verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Health Research Mode (System 20) */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              Personal Health Research Query Engine
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Ask questions of your multi-source telemetry without confusing correlation with causation.
            </p>
          </div>
        </div>

        <form onSubmit={handleRunQuery} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g. 'Does bedtime consistency correlate with morning HRV?'"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-purple-500"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-600/30 flex items-center gap-2"
          >
            <BarChart3 className="w-4 h-4" />
            Compute Correlation
          </button>
        </form>

        {queryResult && (
          <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-800/40 text-xs space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 font-mono font-bold">
                {queryResult.correlation}
              </span>
              <span className="text-slate-400 font-mono">{queryResult.sampleSize}</span>
              <span className="text-emerald-400 font-mono font-bold">{queryResult.pValue}</span>
            </div>
            <p className="text-slate-200 leading-relaxed font-medium">
              {queryResult.interpretation}
            </p>
            <div className="text-[11px] text-slate-400 flex items-start gap-1.5 pt-1 border-t border-purple-900/40">
              <Info className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span>{queryResult.caveat}</span>
            </div>
          </div>
        )}
      </div>

      {/* 2-Column: Experiment List & Selected Protocol Inspection */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Experiments List (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <FlaskConical className="w-4 h-4 text-purple-400" />
            N=1 Experiment Ledger ({experiments.length})
          </h3>

          <div className="space-y-2.5">
            {experiments.map(exp => (
              <div
                key={exp.id}
                onClick={() => setActiveExperiment(exp)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  activeExperiment.id === exp.id
                    ? 'bg-purple-950/30 border-purple-500/50 shadow-md shadow-purple-500/10'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                    exp.status === 'active' 
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {exp.status}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">{exp.durationDays} Days</span>
                </div>
                <h4 className="text-xs font-bold text-white">{exp.title}</h4>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                  <span>Target: {exp.targetMetric}</span>
                  <span className={`font-mono font-bold ${exp.percentageChange >= 0 ? 'text-emerald-400' : 'text-cyan-400'}`}>
                    {exp.percentageChange > 0 ? `+${exp.percentageChange}%` : `${exp.percentageChange}%`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Deep Protocol Evaluation (7 Cols) */}
        <div className="lg:col-span-7">
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider block">
                  Protocol Review • {activeExperiment.startDate} to {activeExperiment.endDate}
                </span>
                <h3 className="text-xl font-bold text-white mt-1">{activeExperiment.title}</h3>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                {activeExperiment.statisticalConfidence}
              </span>
            </div>

            {/* Hypothesis Box */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
              <span className="font-bold text-slate-400 block mb-1">Scientific Hypothesis:</span>
              <p className="italic">"{activeExperiment.hypothesis}"</p>
            </div>

            {/* Metric Comparison Card */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[11px] text-slate-500 font-mono block">Pre-Trial Baseline</span>
                <div className="text-2xl font-extrabold font-mono text-slate-300 mt-1">
                  {activeExperiment.baselineValue}
                </div>
                <span className="text-[10px] text-slate-500 block mt-0.5">Historical 30-day average</span>
              </div>

              <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-800/40">
                <span className="text-[11px] text-purple-400 font-mono block">Intervention Average</span>
                <div className="text-2xl font-extrabold font-mono text-emerald-400 mt-1">
                  {activeExperiment.experimentValue}
                </div>
                <span className="text-[10px] text-emerald-400 font-mono block mt-0.5">
                  {activeExperiment.percentageChange > 0 ? `+${activeExperiment.percentageChange}% improvement` : `${activeExperiment.percentageChange}% reduction`}
                </span>
              </div>
            </div>

            {/* Verdict Box */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5">
              <span className="font-bold text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Empirical Outcome & Biological Verdict
              </span>
              <p className="text-slate-300 leading-relaxed">
                {activeExperiment.verdict}
              </p>
            </div>

            {/* Confounding Factors */}
            <div className="text-xs text-slate-400">
              <span className="font-bold text-slate-300 block mb-1">Logged Confounders:</span>
              <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                {activeExperiment.confoundingFactors.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
