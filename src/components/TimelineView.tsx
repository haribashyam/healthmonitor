import React, { useState } from 'react';
import {
  FileText,
  Activity,
  Heart,
  Moon,
  Utensils,
  Search,
  Filter,
  Layers,
  Sparkles
} from 'lucide-react';
import { TimelineEvent } from '../types';

interface TimelineViewProps {
  events: TimelineEvent[];
}

export const TimelineView: React.FC<TimelineViewProps> = ({ events }) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = events.filter((e) => {
    const matchType = filterType === 'all' || e.type === filterType;
    const matchSearch = searchTerm === '' ||
      e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.source.toLowerCase().includes(searchTerm.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Unified Health Timeline</h1>
          </div>
          <p className="text-xs text-slate-300">
            Chronological multi-stream record fusing continuous biometric syncs, workout telemetry, sleep analyses, and medical reports.
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search timeline events..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto text-xs bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        <span className="text-slate-400 font-bold">Event Type:</span>
        {['all', 'workout', 'sleep', 'vital', 'nutrition', 'lab', 'note'].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-3 py-1 rounded-lg capitalize font-medium transition-all ${
              filterType === type
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Timeline Stream */}
      <div className="space-y-4 relative before:absolute before:inset-0 before:left-6 before:w-0.5 before:bg-slate-800">
        {filtered.map((event) => {
          const getIcon = () => {
            switch (event.type) {
              case 'workout': return <Activity className="w-4 h-4 text-cyan-400" />;
              case 'sleep': return <Moon className="w-4 h-4 text-indigo-400" />;
              case 'nutrition': return <Utensils className="w-4 h-4 text-emerald-400" />;
              case 'lab': return <FileText className="w-4 h-4 text-amber-400" />;
              default: return <Heart className="w-4 h-4 text-rose-400" />;
            }
          };

          return (
            <div key={event.id} className="relative flex items-start gap-4 pl-2">
              <div className="w-9 h-9 rounded-full bg-slate-950 border-2 border-slate-800 flex items-center justify-center flex-shrink-0 z-10 shadow-sm">
                {getIcon()}
              </div>

              <div className="flex-1 bg-slate-900 rounded-xl p-4 border border-slate-800 hover:border-slate-700 transition-all space-y-2 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">{event.title}</h3>
                    <span className="text-[11px] text-slate-400 font-mono">{event.timestamp}</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
                    {event.source}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {event.description}
                </p>

                {event.metrics && Object.keys(event.metrics).length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800/80">
                    {Object.entries(event.metrics).map(([k, v]) => (
                      <span key={k} className="text-[11px] px-2 py-0.5 rounded bg-slate-950 text-cyan-300 border border-slate-800/60 font-mono">
                        {k}: <strong>{String(v)}</strong>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
