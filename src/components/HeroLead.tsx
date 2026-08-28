import React, { useState } from 'react';
import {
  Radio,
  FileText,
  Sparkles,
  Zap,
  Info,
  ChevronRight
} from 'lucide-react';
import { VitalScore, SleepRecord } from '../types';

interface HeroLeadProps {
  vitalScore: VitalScore;
  liveBpm: number;
  latestSleep: SleepRecord;
  bleDeviceName: string;
  onOpenLiveWorkout: () => void;
  onOpenWhatChanged: () => void;
  onOpenDoctorReport: () => void;
  onOpenAsk: () => void;
  onOpenWorkspace?: () => void;
}

export const HeroLead: React.FC<HeroLeadProps> = ({
  vitalScore,
  liveBpm,
  latestSleep,
  bleDeviceName,
  onOpenLiveWorkout,
  onOpenWhatChanged,
  onOpenDoctorReport,
  onOpenAsk,
}) => {
  const [showFormulaModal, setShowFormulaModal] = useState(false);

  const scoreOverall = vitalScore?.overall || 84;
  const recoveryScore = vitalScore?.recovery || 86;
  const activityScore = vitalScore?.activity || 82;
  const sleepScore = vitalScore?.sleep || 88;

  const hrvVal = latestSleep?.hrvAvg || 64;
  const rhrVal = latestSleep?.restingHr || 59;
  const sleepScoreVal = latestSleep?.sleepScore || 88;

  return (
    <div className="bg-[#141414] border border-[#262626] p-6 sm:p-8 text-[#F9F9F7] select-none">
      
      {/* Top Badge Eyebrow */}
      <div className="flex items-center gap-3 mb-4 font-mono text-xs">
        <span className="bg-[#CC0000] text-white px-2.5 py-1 font-bold uppercase tracking-wider text-[11px]">
          OPTIMAL RECOVERY
        </span>
        <span className="text-[#888888] font-medium tracking-wide flex items-center gap-1.5 text-[11px] uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
          UPDATED JUST NOW
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Column: Large Headline, Metrics & Action Buttons */}
        <div className="lg:col-span-8 space-y-5">
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight text-white leading-none">
            Ready for<br />targeted output
          </h2>

          <div className="text-sm font-mono text-[#CCCCCC] flex flex-wrap items-center gap-2">
            <span>HRV <strong className="text-white font-bold">{hrvVal}ms</strong></span>
            <span className="text-[#555555]">•</span>
            <span>Resting HR <strong className="text-white font-bold">{rhrVal} BPM</strong></span>
            <span className="text-[#555555]">•</span>
            <span>Sleep score <strong className="text-white font-bold">{sleepScoreVal}/100</strong></span>
          </div>

          {/* 4 Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2 font-mono text-xs">
            <button
              onClick={onOpenDoctorReport}
              className="px-4 py-2.5 bg-[#202020] hover:bg-[#2A2A2A] text-[#E0E0E0] hover:text-white border border-[#383838] transition-colors font-bold uppercase tracking-wider flex items-center gap-2"
            >
              <FileText className="w-3.5 h-3.5 text-[#A3A3A3]" />
              <span>EXPORT CLINICAL PDF</span>
            </button>

            <button
              onClick={onOpenWhatChanged}
              className="px-4 py-2.5 bg-[#202020] hover:bg-[#2A2A2A] text-[#E0E0E0] hover:text-white border border-[#383838] transition-colors font-bold uppercase tracking-wider flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#CC0000]" />
              <span>WHY AM I DIFFERENT?</span>
            </button>

            <button
              onClick={onOpenLiveWorkout}
              className="px-4 py-2.5 bg-white text-[#111111] hover:bg-[#EAEAEA] border border-white transition-colors font-bold uppercase tracking-wider flex items-center gap-2"
            >
              <Radio className="w-3.5 h-3.5 text-[#CC0000]" />
              <span>START LIVE WORKOUT</span>
            </button>

            <button
              onClick={onOpenAsk}
              className="px-4 py-2.5 bg-[#202020] hover:bg-[#2A2A2A] text-[#E0E0E0] hover:text-white border border-[#383838] transition-colors font-bold uppercase tracking-wider flex items-center gap-2"
            >
              <Zap className="w-3.5 h-3.5 text-[#CC0000]" />
              <span>ASK AI</span>
            </button>
          </div>

        </div>

        {/* Right Column: Circular Score Gauge and Breakdown */}
        <div className="lg:col-span-4 flex items-center justify-start lg:justify-end gap-6 bg-[#181818] p-5 border border-[#282828]">
          
          {/* Circular Ring Gauge */}
          <div className="relative w-28 h-28 flex-shrink-0 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="#2A2A2A"
                strokeWidth="7"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="7"
                strokeDasharray="263.89"
                strokeDashoffset={263.89 - (263.89 * scoreOverall) / 100}
                strokeLinecap="round"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-serif font-black text-white leading-none">
                {scoreOverall}
              </span>
              <span className="text-[9px] font-mono text-[#888888] tracking-widest uppercase mt-0.5">
                VITAL SCORE
              </span>
            </div>
          </div>

          {/* Score Breakdown List */}
          <div className="space-y-1.5 font-mono text-xs">
            <div className="flex items-center justify-between gap-4">
              <span className="text-[#888888] uppercase text-[11px]">RECOVERY</span>
              <span className="font-bold text-white text-[11px]">{recoveryScore}/100</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-[#888888] uppercase text-[11px]">ACTIVITY</span>
              <span className="font-bold text-white text-[11px]">{activityScore}/100</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-[#888888] uppercase text-[11px]">SLEEP</span>
              <span className="font-bold text-white text-[11px]">{sleepScore}/100</span>
            </div>
            <div className="pt-1 border-t border-[#2A2A2A]">
              <button
                onClick={() => setShowFormulaModal(true)}
                className="text-[10px] text-[#CC0000] hover:underline font-bold uppercase tracking-wider"
              >
                VIEW FORMULA
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Formula Modal */}
      {showFormulaModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#181818] border border-[#333333] max-w-md w-full p-6 text-[#F9F9F7] space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-[#333333] pb-2">
              <h3 className="font-serif font-bold text-base text-white uppercase">VITAL SCORE ALGORITHM</h3>
              <button
                onClick={() => setShowFormulaModal(false)}
                className="text-[#888888] hover:text-white font-bold"
              >
                ✕
              </button>
            </div>
            <p className="text-[#AAAAAA] leading-relaxed">
              VitalScore = (Recovery × 0.40) + (Sleep Architecture × 0.35) + (Active Glycemic Tone × 0.25).
            </p>
            <div className="p-3 bg-[#111111] border border-[#262626] space-y-1">
              <div>Overnight HRV RMSSD Z-score: +0.62σ</div>
              <div>Resting Heart Rate Dip: 14% restorative</div>
              <div>Sleep Stages Quality: 88/100</div>
            </div>
            <button
              onClick={() => setShowFormulaModal(false)}
              className="w-full py-2 bg-white text-[#111111] font-bold uppercase"
            >
              CLOSE
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
