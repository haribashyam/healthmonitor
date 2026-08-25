import React, { useState } from 'react';
import {
  Heart,
  FileText,
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Filter,
  Layers,
  Sparkles
} from 'lucide-react';
import { Biomarker, LabReport } from '../types';

interface VitalsAndLabViewProps {
  biomarkers: Biomarker[];
  labReports: LabReport[];
  onOpenDataSources: () => void;
  onOpenDoctorReport?: () => void;
}

export const VitalsAndLabView: React.FC<VitalsAndLabViewProps> = ({
  biomarkers,
  labReports,
  onOpenDataSources,
  onOpenDoctorReport
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const categories = ['all', 'Cardiovascular', 'Metabolic', 'Lipids', 'Hormones', 'Inflammation', 'Vitamins'];

  const filteredBiomarkers = biomarkers.filter((b) => {
    const matchCat = selectedCategory === 'all' || b.category === selectedCategory;
    const matchStatus = selectedStatus === 'all' || b.status === selectedStatus;
    return matchCat && matchStatus;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500" />
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Clinical Biomarkers & Vitals</h1>
          </div>
          <p className="text-xs text-slate-300">
            Unified medical lab records, continuous wearable vitals, and reference interval monitoring with clinical trend detection.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {onOpenDoctorReport && (
            <button
              onClick={onOpenDoctorReport}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40 transition-all flex items-center gap-1.5 shadow-sm"
              title="Export complete biomarker panels and metrics as PDF"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-400" /> Export Doctor PDF
            </button>
          )}
          <button
            onClick={onOpenDataSources}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-md shadow-cyan-500/20 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> Ingest New Lab Panel (PDF)
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-slate-400 font-bold">Category:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg capitalize font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-bold">Status:</span>
          {['all', 'optimal', 'borderline', 'abnormal'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-2.5 py-1 rounded-md uppercase text-[10px] font-bold transition-all ${
                selectedStatus === st
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Biomarker Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBiomarkers.map((bio) => {
          const isOptimal = bio.status === 'optimal';
          const isBorderline = bio.status === 'borderline';
          const isAbnormal = bio.status === 'abnormal';

          return (
            <div
              key={bio.id}
              className="bg-slate-900 rounded-xl p-5 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between shadow-sm"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">{bio.name}</h3>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      {bio.category}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                      isOptimal
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : isBorderline
                        ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                    }`}
                  >
                    {bio.status}
                  </span>
                </div>

                <div className="my-2 flex items-baseline gap-2">
                  <span className="text-3xl font-black text-white">{bio.value}</span>
                  <span className="text-xs text-slate-400 font-medium">{bio.unit}</span>
                  
                  <span className="ml-auto text-xs text-slate-400 flex items-center gap-1">
                    {bio.historicalTrend === 'improving' && (
                      <span className="text-emerald-400 flex items-center gap-0.5">
                        <TrendingUp className="w-3.5 h-3.5" /> Improving
                      </span>
                    )}
                    {bio.historicalTrend === 'declining' && (
                      <span className="text-rose-400 flex items-center gap-0.5">
                        <TrendingDown className="w-3.5 h-3.5" /> Warning
                      </span>
                    )}
                    {bio.historicalTrend === 'stable' && (
                      <span className="text-slate-400 flex items-center gap-0.5">
                        <Minus className="w-3.5 h-3.5" /> Stable
                      </span>
                    )}
                  </span>
                </div>

                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 text-xs space-y-1">
                  <div className="flex justify-between text-slate-400">
                    <span>Clinical Reference Interval:</span>
                    <span className="font-mono text-slate-200">{bio.referenceRange} {bio.unit}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 mt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span>{bio.date}</span>
                <span className="text-slate-400">{bio.source}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Ingested Lab Reports Summary Section */}
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <FileText className="w-4 h-4 text-cyan-400" />
          Verified Diagnostic Lab Reports
        </h3>

        <div className="space-y-3">
          {labReports.map((rep) => (
            <div key={rep.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white">{rep.title}</span>
                <span className="text-xs text-slate-400">{rep.date} • {rep.laboratory}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{rep.summary}</p>
              {rep.clinicalInsights && (
                <div className="text-xs text-cyan-300 bg-cyan-500/10 p-2.5 rounded-lg border border-cyan-500/20">
                  <strong>Clinical Focus:</strong> {rep.clinicalInsights}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
