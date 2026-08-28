import React, { useState, useEffect } from 'react';
import {
  Award,
  Flame,
  CheckCircle2,
  Zap,
  ShieldCheck,
  TrendingUp,
  Target,
  Sparkles,
  Plus,
  Clock
} from 'lucide-react';
import { healthStorage, UserVitalsLog } from '../utils/storage';

export const AchievementsView: React.FC = () => {
  const [vitals, setVitals] = useState<UserVitalsLog[]>([]);
  const [labCount, setLabCount] = useState<number>(0);
  const [sourcesCount, setSourcesCount] = useState<number>(0);

  useEffect(() => {
    setVitals(healthStorage.getVitals());
    setLabCount(healthStorage.getLabReports().length);
    setSourcesCount(healthStorage.getDataSources().filter(s => s.connected).length);

    const handleUpdate = () => {
      setVitals(healthStorage.getVitals());
      setLabCount(healthStorage.getLabReports().length);
      setSourcesCount(healthStorage.getDataSources().filter(s => s.connected).length);
    };

    window.addEventListener('vitalsUpdated', handleUpdate);
    window.addEventListener('dataPurged', handleUpdate);

    return () => {
      window.removeEventListener('vitalsUpdated', handleUpdate);
      window.removeEventListener('dataPurged', handleUpdate);
    };
  }, []);

  const totalVitalsLogged = vitals.length;
  const bpLogged = vitals.filter(v => v.type === 'blood_pressure').length;
  const hrLogged = vitals.filter(v => v.type === 'heart_rate').length;
  const glucoseLogged = vitals.filter(v => v.type === 'glucose').length;

  const achievements = [
    {
      id: 'ach-first-vital',
      title: 'First Live Biometric Log',
      desc: 'Recorded at least 1 verified biometric reading via Web Bluetooth or manual entry.',
      tier: 'Bronze',
      unlocked: totalVitalsLogged >= 1,
      progress: `${Math.min(totalVitalsLogged, 1)}/1 Reading`,
      date: totalVitalsLogged >= 1 ? 'Unlocked' : 'In Progress'
    },
    {
      id: 'ach-cardio-cadence',
      title: 'Cardiovascular Surveillance',
      desc: 'Logged 3+ blood pressure or heart rate data points.',
      tier: 'Silver',
      unlocked: (bpLogged + hrLogged) >= 3,
      progress: `${Math.min(bpLogged + hrLogged, 3)}/3 Readings`,
      date: (bpLogged + hrLogged) >= 3 ? 'Unlocked' : 'In Progress'
    },
    {
      id: 'ach-clinical-ocr',
      title: 'Certified Pathology Fusion',
      desc: 'Uploaded and structured a certified clinical pathology lab report via AI OCR.',
      tier: 'Gold',
      unlocked: labCount >= 1,
      progress: `${Math.min(labCount, 1)}/1 Lab Reports`,
      date: labCount >= 1 ? 'Unlocked' : 'Upload Lab in Data Hub'
    },
    {
      id: 'ach-multi-node',
      title: 'Multi-Node Synchronization',
      desc: 'Connected 2+ active data feeds or Web Bluetooth sensors.',
      tier: 'Platinum',
      unlocked: sourcesCount >= 2,
      progress: `${Math.min(sourcesCount, 2)}/2 Sources`,
      date: sourcesCount >= 2 ? 'Unlocked' : 'Connect in Data Hub'
    },
    {
      id: 'ach-metabolic-mastery',
      title: 'Glycemic Target Mastery',
      desc: 'Logged fasting blood glucose readings across multiple sessions.',
      tier: 'Diamond',
      unlocked: glucoseLogged >= 2,
      progress: `${Math.min(glucoseLogged, 2)}/2 Glucose Readings`,
      date: glucoseLogged >= 2 ? 'Unlocked' : 'In Progress'
    }
  ];

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="space-y-6 animate-fadeIn font-mono">
      
      {/* Header */}
      <div className="bg-[#141414] p-6 lg:p-8 border border-[#262626] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hard-shadow">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-[#CC0000] text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
              AUTHENTIC MILESTONES
            </span>
            <h1 className="text-xl sm:text-2xl font-serif font-black text-white tracking-tight uppercase">
              BIOMETRIC ACHIEVEMENTS & COMPLIANCE
            </h1>
          </div>
          <p className="text-xs text-[#888888] font-sans">
            Real milestone progression calculated dynamically from your logged vitals, connected hardware, and lab reports.
          </p>
        </div>

        <div className="bg-[#1C1C1C] p-4 border border-[#2D2D2D] flex items-center gap-4 text-xs">
          <div>
            <span className="text-[#888888] block uppercase font-bold text-[10px]">UNLOCKED BADGES</span>
            <span className="text-2xl font-black text-white flex items-center gap-1 font-mono">
              <Award className="w-5 h-5 text-amber-400" /> {unlockedCount} / {achievements.length}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((ach) => (
          <div
            key={ach.id}
            className={`p-5 border flex flex-col justify-between transition-colors hard-shadow-sm ${
              ach.unlocked
                ? 'bg-[#151515] border-[#383838]'
                : 'bg-[#101010] border-[#222222] opacity-75'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className={`p-2 border ${
                  ach.unlocked
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    : 'bg-zinc-900 text-zinc-600 border-zinc-800'
                }`}>
                  <Award className="w-5 h-5" />
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 uppercase border ${
                  ach.unlocked
                    ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                    : 'bg-zinc-900 text-zinc-500 border-zinc-800'
                }`}>
                  {ach.tier}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-serif font-bold text-white leading-tight">
                  {ach.title}
                </h4>
                <p className="text-xs text-[#888888] mt-1 font-sans leading-relaxed">
                  {ach.desc}
                </p>
              </div>
            </div>

            <div className="pt-3 mt-4 border-t border-[#262626] flex items-center justify-between text-[11px]">
              <span className={ach.unlocked ? 'text-emerald-400 font-bold' : 'text-zinc-500'}>
                {ach.date}
              </span>
              <span className="text-white font-bold">{ach.progress}</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
