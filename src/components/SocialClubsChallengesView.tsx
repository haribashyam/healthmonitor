import React, { useState } from 'react';
import {
  Users,
  Flame,
  Award,
  Trophy,
  ShieldCheck,
  Lock,
  ThumbsUp,
  MessageSquare,
  Share2,
  ChevronRight,
  Compass,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export const SocialClubsChallengesView: React.FC = () => {
  const [kudosCount, setKudosCount] = useState<Record<string, number>>({
    'post-1': 14,
    'post-2': 28
  });

  const [hasKudoed, setHasKudoed] = useState<Record<string, boolean>>({});

  const toggleKudos = (id: string) => {
    setHasKudoed(prev => {
      const active = !prev[id];
      setKudosCount(kc => ({
        ...kc,
        [id]: active ? (kc[id] || 0) + 1 : Math.max(0, (kc[id] || 0) - 1)
      }));
      return { ...prev, [id]: active };
    });
  };

  const challenges = [
    {
      id: 'ch-1',
      title: '100k Steps August Endurance Challenge',
      category: 'Walking & Running',
      progress: 74200,
      target: 100000,
      unit: 'steps',
      daysLeft: 6,
      joined: true
    },
    {
      id: 'ch-2',
      title: '30-Day Sleep Regularity Challenge',
      category: 'Sleep Consistency',
      progress: 24,
      target: 30,
      unit: 'consistent nights',
      daysLeft: 6,
      joined: true
    },
    {
      id: 'ch-3',
      title: 'Sub-25 5K Summer Benchmark',
      category: 'Running Pace',
      progress: 1,
      target: 1,
      unit: 'achievement',
      daysLeft: 12,
      joined: true,
      completed: true
    }
  ];

  const personalRecords = [
    { name: 'Hawk Hill 2.4km Cycling Ascent', time: '07:18', date: '2026-08-14', badge: 'KOM Top 5%' },
    { name: '5,000m Road Time Trial', time: '21:44', date: '2026-08-02', badge: 'All-Time PR' },
    { name: 'Bench Press 1RM Estimated', time: '112 kg', date: '2026-08-20', badge: 'Gold Tier' },
    { name: 'Longest Sleep Recovery Streak', time: '14 Days >85', date: '2026-08-18', badge: 'Elite Form' }
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-orange-950/70 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/30 mb-2">
              <Users className="w-3.5 h-3.5" />
              <span>Systems 17, 36 & 37 • Strava-Style Social Clubs, Segments & Community Challenges</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              Clubs, Segments & Challenges
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Connect with fellow athletes, track segment PRs and leaderboards, join endurance challenges, with zero medical data exposure.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 block font-mono uppercase">Segment PRs</span>
              <span className="text-lg font-extrabold text-orange-400 font-mono">4 Unlocked</span>
            </div>
            <div className="px-4 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 block font-mono uppercase">Active Challenges</span>
              <span className="text-lg font-extrabold text-emerald-400 font-mono">3 Enrolled</span>
            </div>
          </div>
        </div>
      </div>

      {/* Privacy Guarantee Card */}
      <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span><strong>Privacy Lock:</strong> Only public fitness activities (Runs, Rides) are visible to clubs. Blood biomarkers and medical records are permanently shielded.</span>
        </div>
        <span className="text-[11px] font-mono text-emerald-400 font-semibold">HIPAA & GDPR Enforced</span>
      </div>

      {/* Grid: Activity Feed (7 Cols) & Challenges/PRs (5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Social Feed */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-400" />
            Athletic Community Feed
          </h3>

          {/* Post 1 */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-orange-500 text-slate-950 font-bold flex items-center justify-center text-xs">
                  AV
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">Alexander Vance (You)</span>
                  <span className="text-[10px] text-slate-400">Today at 07:15 AM • Morning Threshold Run</span>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-orange-500/20 text-orange-300 border border-orange-500/30">
                Segment PR 🏆
              </span>
            </div>

            <p className="text-xs text-slate-200">
              Crisp 12°C morning on the Presidio Coastal Trail. Locked in Zone 4 for the final 3km ascent.
            </p>

            <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800 text-center font-mono">
              <div>
                <span className="text-[10px] text-slate-500 block">Distance</span>
                <span className="text-sm font-bold text-white">10.2 km</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Avg Pace</span>
                <span className="text-sm font-bold text-orange-400">4:44 /km</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Elevation</span>
                <span className="text-sm font-bold text-white">+184 m</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
              <button
                onClick={() => toggleKudos('post-1')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                  hasKudoed['post-1']
                    ? 'bg-orange-500 text-slate-950'
                    : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>{kudosCount['post-1']} Kudos</span>
              </button>

              <div className="flex items-center gap-3 text-slate-400">
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5" /> 3 Comments
                </span>
                <Share2 className="w-3.5 h-3.5 cursor-pointer hover:text-white" />
              </div>
            </div>
          </div>

          {/* Post 2 */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-cyan-500 text-slate-950 font-bold flex items-center justify-center text-xs">
                  SC
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">Dr. Sarah Chen</span>
                  <span className="text-[10px] text-slate-400">Yesterday • Zone 2 Recovery Ride</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-200">
              Smooth aerobic base builder through Marin Headlands. Maintained nasal breathing and steady 175 watts.
            </p>

            <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800 text-center font-mono">
              <div>
                <span className="text-[10px] text-slate-500 block">Distance</span>
                <span className="text-sm font-bold text-white">42.5 km</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Avg Power</span>
                <span className="text-sm font-bold text-cyan-400">178 W</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Avg HR</span>
                <span className="text-sm font-bold text-white">126 BPM</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
              <button
                onClick={() => toggleKudos('post-2')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                  hasKudoed['post-2']
                    ? 'bg-orange-500 text-slate-950'
                    : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>{kudosCount['post-2']} Kudos</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Challenges & Personal Records */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Active Challenges */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              Community Challenges ({challenges.length})
            </h3>

            <div className="space-y-3">
              {challenges.map(ch => (
                <div key={ch.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{ch.title}</span>
                    <span className="text-[10px] font-mono text-amber-400">{ch.daysLeft}d left</span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full transition-all"
                      style={{ width: `${Math.min(100, Math.round((ch.progress / ch.target) * 100))}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>{ch.progress.toLocaleString()} / {ch.target.toLocaleString()} {ch.unit}</span>
                    <span className="text-emerald-400 font-bold">{Math.round((ch.progress / ch.target) * 100)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Personal Records Trophy Shelf */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-orange-400" />
              Verified Personal Records
            </h3>

            <div className="space-y-2">
              {personalRecords.map((pr, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white block">{pr.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{pr.date}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-black text-orange-400 text-sm block">{pr.time}</span>
                    <span className="text-[10px] font-bold text-emerald-400 uppercase">{pr.badge}</span>
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
