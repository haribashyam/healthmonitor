import React from 'react';
import {
  Award,
  Flame,
  CheckCircle2,
  Zap,
  ShieldCheck,
  TrendingUp,
  Target,
  Sparkles
} from 'lucide-react';

export const AchievementsView: React.FC = () => {
  const achievements = [
    { title: 'Zone 2 Endurance Master', desc: 'Accumulated 120+ minutes in Zone 2 aerobic base in a single week.', tier: 'Gold', progress: '100%', date: 'Unlocked Aug 20' },
    { title: 'Autonomic Stabilizer', desc: 'Maintained 7 consecutive days with sleep score > 85 and HRV > 60ms.', tier: 'Diamond', progress: '100%', date: 'Unlocked Aug 22' },
    { title: '10,000 Step Daily Streak', desc: '28 consecutive days hitting or exceeding verified 10,000 steps.', tier: 'Platinum', progress: '28/30 Days', date: 'Active' },
    { title: 'Lab Record Fusion', desc: 'Ingested comprehensive metabolic & lipid panel with zero gaps.', tier: 'Silver', progress: '100%', date: 'Unlocked Aug 15' },
    { title: 'Hydration Consistency', desc: 'Logged 3.0L+ daily water intake across 14 training days.', tier: 'Bronze', progress: '100%', date: 'Unlocked Aug 10' }
  ];

  const weeklyChallenges = [
    { title: 'Aerobic Mitochondria Push', goal: '180 mins Zone 2', current: '145 mins', pct: 80, reward: '+50 XP & Badge' },
    { title: 'Circadian Regularity', goal: 'Sleep before 11:15 PM 5x', current: '4/5 nights', pct: 80, reward: 'Circadian Badge' },
    { title: 'Protein Threshold', goal: '160g+ daily for 7 days', current: '6/7 days', pct: 85, reward: 'Nutrition Mastery' }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Achievements & Consistency Streaks</h1>
          </div>
          <p className="text-xs text-slate-300">
            Privacy-safe milestone tracking reinforcing long-term biological adaptations without toxic vanity metrics.
          </p>
        </div>

        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center gap-4 text-xs">
          <div>
            <span className="text-slate-400 block uppercase font-bold text-[10px]">Active Streak</span>
            <span className="text-xl font-black text-amber-400 flex items-center gap-1">
              <Flame className="w-4 h-4" /> 28 Days
            </span>
          </div>
        </div>
      </div>

      {/* Weekly Challenges */}
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-4 shadow-md">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Target className="w-4 h-4 text-cyan-400" /> Active Weekly Challenges
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {weeklyChallenges.map((ch, idx) => (
            <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5">
              <div className="flex items-start justify-between">
                <span className="text-xs font-bold text-white">{ch.title}</span>
                <span className="text-[10px] text-cyan-400 font-mono">{ch.current}</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${ch.pct}%` }} />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 pt-1">
                <span>Goal: {ch.goal}</span>
                <span className="text-emerald-400 font-semibold">{ch.reward}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Unlocked Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((ach, idx) => (
          <div key={idx} className="bg-slate-900 rounded-xl p-5 border border-slate-800 space-y-2 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Award className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-950 text-amber-300 border border-amber-500/30 uppercase">
                {ach.tier}
              </span>
            </div>

            <h4 className="text-sm font-bold text-white pt-1">{ach.title}</h4>
            <p className="text-xs text-slate-300 leading-relaxed">{ach.desc}</p>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span>{ach.date}</span>
              <span className="text-emerald-400 font-bold">{ach.progress}</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
