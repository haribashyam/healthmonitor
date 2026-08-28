import React, { useState, useEffect } from 'react';
import { Heart, Activity, Flame, ShieldCheck, TrendingUp, Sun, Radio, Zap, Moon, Droplets, Thermometer, Wind } from 'lucide-react';

interface TickerBarProps {
  liveBpm: number;
  isBleConnected: boolean;
  bleDeviceName: string;
  vitalScore?: number;
  liveSteps?: number;
  onOpenLiveWorkout?: () => void;
}

export const TickerBar: React.FC<TickerBarProps> = ({
  liveBpm,
  isBleConnected,
  bleDeviceName,
  vitalScore = 84,
  liveSteps = 11284,
  onOpenLiveWorkout
}) => {
  const [steps, setSteps] = useState(liveSteps);
  const [currentBpm, setCurrentBpm] = useState(liveBpm || 68);

  // Live real-time step counter and subtle HR physiological oscillation
  useEffect(() => {
    const stepInterval = setInterval(() => {
      // Simulate live pedestrian steps ticking periodically
      setSteps(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 3200);

    const hrInterval = setInterval(() => {
      // Subtle biological sinus variability (e.g. +/- 1-2 bpm)
      setCurrentBpm(prev => {
        const delta = (Math.random() - 0.48) * 2;
        const target = Math.round(Math.min(180, Math.max(54, prev + delta)));
        return target;
      });
    }, 2400);

    return () => {
      clearInterval(stepInterval);
      clearInterval(hrInterval);
    };
  }, []);

  useEffect(() => {
    if (liveBpm) setCurrentBpm(liveBpm);
  }, [liveBpm]);

  const rawMetrics = [
    { label: 'HR', value: `${currentBpm} BPM`, isAlert: true },
    { label: 'HRV', value: '64 MS', isAlert: false },
    { label: 'VO2 MAX', value: '48.6', isAlert: false },
    { label: 'SLEEP DEBT', value: '-0.4 H', isAlert: false },
    { label: 'BP', value: '116/74', isAlert: false },
    { label: 'STEPS', value: steps.toLocaleString(), isAlert: false },
    { label: 'TRAINING LOAD', value: 'MODERATE', isAlert: false },
    { label: 'SPO2', value: '98%', isAlert: false },
    { label: 'BODY TEMP', value: '36.7°C', isAlert: false },
    { label: 'RESPIRATION', value: '14 BRPM', isAlert: false },
    { label: 'GLUCOSE', value: '92 MG/DL', isAlert: false },
    { label: 'STRESS', value: 'LOW', isAlert: false },
    { label: 'RESTING HR', value: '59 BPM', isAlert: false },
    { label: 'VITAL SCORE', value: `${vitalScore}/100`, isAlert: false },
  ];

  // Duplicate for seamless infinite loop
  const tickerItems = [...rawMetrics, ...rawMetrics, ...rawMetrics];

  return (
    <div className="bg-[#111111] text-[#F9F9F7] border-b border-[#262626] text-xs h-9 flex items-center sticky top-0 z-50 overflow-hidden font-mono select-none">
      
      {/* Left: Solid Red LIVE WIRE Badge */}
      <div
        onClick={onOpenLiveWorkout}
        className="bg-[#CC0000] text-white px-3 h-full flex items-center gap-1.5 font-bold uppercase tracking-wider text-[11px] flex-shrink-0 z-20 cursor-pointer hover:bg-[#b30000] transition-colors border-r border-[#111111]"
      >
        <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
        <span className="whitespace-nowrap">● LIVE WIRE</span>
      </div>

      {/* Center: Seamless Infinite Scrolling Marquee */}
      <div className="flex-1 overflow-hidden relative flex items-center h-full">
        <div className="animate-news-ticker flex items-center gap-8 pl-4 whitespace-nowrap">
          {tickerItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-1.5 text-xs text-[#E5E5E5] flex-shrink-0 tracking-wide font-mono"
            >
              <span className="text-[#A3A3A3] font-medium uppercase text-[11px]">
                {item.label}
              </span>
              <span className={`font-bold ${item.isAlert ? 'text-[#CC0000]' : 'text-white'}`}>
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Right subtle live status beacon */}
      <div className="hidden lg:flex items-center gap-2 px-3 h-full bg-[#111111] border-l border-[#262626] text-[10px] text-[#A3A3A3] flex-shrink-0 z-20">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
        <span className="font-mono uppercase">{isBleConnected ? bleDeviceName : 'CONTINUOUS SYNC'}</span>
      </div>

    </div>
  );
};
