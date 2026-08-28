import React, { useState } from 'react';
import {
  X,
  Search,
  ChevronRight,
  Maximize2,
  Stethoscope,
  Dumbbell,
  Scale,
  Pill,
  Sun,
  Brain,
  FlaskConical,
  Cpu,
  BookOpen,
  MapPin,
  FileSpreadsheet,
  Clock,
  Award,
  ShieldAlert,
  Layers,
  Sparkles,
  Heart,
  Radio,
  ExternalLink,
  Users
} from 'lucide-react';

interface SpecialDesksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: string) => void;
  onOpenLiveWorkout?: () => void;
  onOpenWorkspace?: () => void;
  onOpenDoctorReport?: () => void;
  theme?: 'dark' | 'light';
}

interface DeskCategory {
  title: string;
  badge: string;
  desks: {
    id: string;
    title: string;
    description: string;
    icon: any;
    tag: string;
    customAction?: () => void;
  }[];
}

export const SpecialDesksModal: React.FC<SpecialDesksModalProps> = ({
  isOpen,
  onClose,
  onSelectTab,
  onOpenLiveWorkout,
  onOpenWorkspace,
  onOpenDoctorReport,
  theme = 'dark'
}) => {
  const [filterQuery, setFilterQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  if (!isOpen) return null;

  const isDark = theme === 'dark';

  const categories: DeskCategory[] = [
    {
      title: 'CLINICAL & MEDICAL INFORMATICS',
      badge: 'EHR & LABS',
      desks: [
        {
          id: 'clinician',
          title: 'CLINICIAN EHR & PATIENT AUDIT',
          description: 'Physician EHR workspace with longitudinal trend analysis, patient consultation notes, and FHIR export.',
          icon: Stethoscope,
          tag: 'CLINICAL GRADE'
        },
        {
          id: 'workspace',
          title: 'GOOGLE WORKSPACE & EHR CLOUD',
          description: 'OAuth integration with Gmail, Google Sheets biomarker export, Drive document vault, and Firebase.',
          icon: FileSpreadsheet,
          tag: 'WORKSPACE OAUTH',
          customAction: onOpenWorkspace
        },
        {
          id: 'doctor-report',
          title: 'OFFICIAL DOCTOR REPORT EXPORT',
          description: 'Generate and print clinical PDF/paper summaries for cardiologist or primary care physician consults.',
          icon: Heart,
          tag: 'PDF / PRINT',
          customAction: onOpenDoctorReport
        },
        {
          id: 'data-quality',
          title: 'DATA QUALITY & AUDIT DESK',
          description: 'Automated signal validation, sensor confidence scores, missing telemetry interpolation, and artifact detection.',
          icon: Layers,
          tag: 'QUALITY ASSURANCE'
        }
      ]
    },
    {
      title: 'BIOMECHANICAL & PHYSICAL PERFORMANCE',
      badge: 'FORCE & TISSUE',
      desks: [
        {
          id: 'strength',
          title: 'STRENGTH TRAINING & 1RM ARCHIVE',
          description: 'Barbell velocity tracking, 1-Rep Max hypertrophy tables, neuromuscular fatigue modeling, and volume tonnage.',
          icon: Dumbbell,
          tag: '1RM PROGRESSION'
        },
        {
          id: 'metabolic',
          title: 'BODY COMPOSITION & DEXA MATRIX',
          description: 'DEXA scan analysis: Visceral adipose tissue, appendicular lean mass index, bone density, and BMR calculation.',
          icon: Scale,
          tag: 'DEXA COMPARTMENTS'
        },
        {
          id: 'injury',
          title: 'INJURY & MOBILITY RECOVERY HUB',
          description: 'Kinetic chain mobility drills, soft-tissue recovery protocols, and post-strain rehabilitation timelines.',
          icon: ShieldAlert,
          tag: 'REHABILITATION'
        },
        {
          id: 'live-workout',
          title: 'LIVE WORKOUT TELEMETRY HUD',
          description: 'Full-screen real-time Web Bluetooth HUD monitoring instantaneous HR, R-R intervals, and training load.',
          icon: Radio,
          tag: 'LIVE SENSOR',
          customAction: onOpenLiveWorkout
        }
      ]
    },
    {
      title: 'BIOCHEMICAL & PHARMACOKINETICS',
      badge: 'NUTRITION & RX',
      desks: [
        {
          id: 'supplements',
          title: 'MEDICATION & SUPPLEMENT MATRIX',
          description: 'Half-life pharmacokinetics, morning/evening dosing schedules, and drug-nutrient interaction audits.',
          icon: Pill,
          tag: 'PHARMACOKINETICS'
        },
        {
          id: 'experiments',
          title: 'HEALTH EXPERIMENTS N=1 LAB',
          description: 'Scientific self-experimentation lab: Cold water immersion, infrared sauna, and fasting protocols with statistical tests.',
          icon: FlaskConical,
          tag: 'N=1 CLINICAL'
        },
        {
          id: 'vitals',
          title: 'BIOMARKER & LAB INGESTION ARCHIVE',
          description: 'Deep-dive blood panel subfractions: ApoB, hs-CRP, fasting insulin, HbA1c, testosterone, and lipid profiles.',
          icon: Heart,
          tag: 'BIOCHEMICAL'
        }
      ]
    },
    {
      title: 'CIRCADIAN & NEURO-WELLNESS',
      badge: 'BRAIN & LIGHT',
      desks: [
        {
          id: 'circadian',
          title: 'CIRCADIAN & ENVIRONMENTAL AQI',
          description: 'Natural lux sunlight exposure timing, nocturnal blue light suppression, and real-time PM2.5 air quality indexing.',
          icon: Sun,
          tag: 'ENVIRONMENTAL'
        },
        {
          id: 'focus',
          title: 'COGNITIVE & NEURO-WELLNESS DESK',
          description: 'Autonomic nervous system stress tracking, cognitive endurance scoring, and deep work focus sessions.',
          icon: Brain,
          tag: 'NEURO-COGNITIVE'
        },
        {
          id: 'journal',
          title: 'HEALTH JOURNAL CHRONICLE',
          description: 'Qualitative health journal correlating subjective mood, energy, and symptoms against quantitative telemetry.',
          icon: BookOpen,
          tag: 'CHRONICLE'
        }
      ]
    },
    {
      title: 'LOCATION & PREDICTIVE SYSTEMS',
      badge: 'GEO & SIMULATION',
      desks: [
        {
          id: 'maps',
          title: 'MAPS & CLINICAL FACILITIES GPS',
          description: 'Google Maps health portal: Immediate geolocation to cardiology centers, urgent clinics, and outdoor running tracks.',
          icon: MapPin,
          tag: 'MAPS GPS'
        },
        {
          id: 'twin',
          title: 'DIGITAL TWIN & RADAR ENGINE',
          description: 'Dynamic biological age estimation and predictive cardiometabolic modeling over 10-year horizon.',
          icon: Cpu,
          tag: 'PREDICTIVE'
        },
        {
          id: 'timeline',
          title: 'LONGITUDINAL CHRONO TIMELINE',
          description: 'Multi-year chronological archive of medical scans, physical milestones, and physiological breakthroughs.',
          icon: Clock,
          tag: 'CHRONOLOGY'
        },
        {
          id: 'social',
          title: 'ACHIEVEMENTS & CLUBS DIRECTORY',
          description: 'Vitality streaks, certified physiological milestone medals, and community endurance challenges.',
          icon: Award,
          tag: 'MILESTONES'
        }
      ]
    }
  ];

  const handleLaunchDesk = (desk: any) => {
    if (desk.customAction) {
      desk.customAction();
    } else {
      onSelectTab(desk.id);
    }
    onClose();
  };

  const filteredCategories = categories.map(cat => {
    const filteredDesks = cat.desks.filter(d => {
      const q = filterQuery.toLowerCase();
      return (
        d.title.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q) ||
        d.tag.toLowerCase().includes(q) ||
        cat.title.toLowerCase().includes(q)
      );
    });
    return { ...cat, desks: filteredDesks };
  }).filter(cat => activeCategory === 'ALL' || cat.title === activeCategory ? cat.desks.length > 0 : false);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto font-mono select-none animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`w-full max-w-5xl ${
          isDark
            ? 'bg-[#141414] text-[#F9F9F7] border-2 border-[#333333]'
            : 'bg-[#FFFFFF] text-[#111111] border-2 border-[#111111] hard-shadow'
        } max-h-[92vh] flex flex-col overflow-hidden transition-colors`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Masthead */}
        <div className={`p-4 sm:p-6 border-b ${isDark ? 'border-[#262626] bg-[#0E0E0E]' : 'border-[#E2E2DC] bg-[#F7F7F4]'} flex flex-col sm:flex-row sm:items-center justify-between gap-3`}>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-[#CC0000] text-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider font-mono">
                SPECIAL EDITIONS DIRECTORY
              </span>
              <span className={`text-[10px] uppercase font-bold tracking-wider ${isDark ? 'text-[#888888]' : 'text-[#666666]'}`}>
                16+ INTELLIGENCE HUBS
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-black uppercase tracking-tight">
              Specialized Health & Clinical Desks
            </h2>
            <p className={`text-xs font-mono ${isDark ? 'text-[#888888]' : 'text-[#666666]'}`}>
              Comprehensive diagnostic, biomechanical, pharmacokinetics, and predictive intelligence modules.
            </p>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={onClose}
              className={`p-2 border ${isDark ? 'border-[#333333] hover:bg-[#222222] text-[#888888] hover:text-white' : 'border-[#CCCCCC] hover:bg-[#E5E5DE] text-[#666666] hover:text-black'} text-xs font-bold uppercase tracking-wider flex items-center gap-1.5`}
            >
              <span>CLOSE [ESC]</span>
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className={`p-3 sm:p-4 border-b ${isDark ? 'border-[#262626] bg-[#181818]' : 'border-[#D4D4CE] bg-[#FDFDFB]'} flex flex-col sm:flex-row sm:items-center justify-between gap-3`}>
          <div className="relative flex-1">
            <Search className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-[#888888]' : 'text-[#666666]'}`} />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Search specialized desk by name, biomarker, or domain (e.g., '1RM', 'DEXA', 'OAuth', 'GPS')..."
              className={`w-full pl-9 pr-4 py-2 text-xs font-mono bg-transparent border ${
                isDark ? 'border-[#333333] text-white placeholder-[#666666] focus:border-white' : 'border-[#CCCCCC] text-[#111111] placeholder-[#888888] focus:border-[#111111]'
              } focus:outline-none`}
            />
          </div>

          {/* Category Quick Select */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar text-[10px] font-mono font-bold uppercase">
            <button
              onClick={() => setActiveCategory('ALL')}
              className={`px-2.5 py-1.5 border whitespace-nowrap transition-colors ${
                activeCategory === 'ALL'
                  ? isDark ? 'bg-white text-black border-white' : 'bg-[#111111] text-white border-[#111111]'
                  : isDark ? 'bg-[#141414] text-[#888888] border-[#2A2A2A] hover:text-white' : 'bg-[#F2F2EC] text-[#666666] border-[#D0D0C8] hover:text-black'
              }`}
            >
              ALL HUBS
            </button>
            {categories.map((c) => (
              <button
                key={c.title}
                onClick={() => setActiveCategory(c.title)}
                className={`px-2.5 py-1.5 border whitespace-nowrap transition-colors ${
                  activeCategory === c.title
                    ? isDark ? 'bg-white text-black border-white' : 'bg-[#111111] text-white border-[#111111]'
                    : isDark ? 'bg-[#141414] text-[#888888] border-[#2A2A2A] hover:text-white' : 'bg-[#F2F2EC] text-[#666666] border-[#D0D0C8] hover:text-black'
                }`}
              >
                {c.badge}
              </button>
            ))}
          </div>
        </div>

        {/* Directory Content Body */}
        <div className={`p-4 sm:p-6 overflow-y-auto flex-1 space-y-8 ${isDark ? 'bg-[#111111]' : 'bg-[#F9F9F6]'}`}>
          {filteredCategories.length === 0 ? (
            <div className="p-12 text-center space-y-2">
              <Search className={`w-8 h-8 mx-auto ${isDark ? 'text-[#444444]' : 'text-[#AAAAAA]'}`} />
              <p className={`text-sm font-bold uppercase ${isDark ? 'text-[#888888]' : 'text-[#666666]'}`}>
                No specialized desks matched &ldquo;{filterQuery}&rdquo;
              </p>
            </div>
          ) : (
            filteredCategories.map((category) => (
              <div key={category.title} className="space-y-3">
                {/* Category Header */}
                <div className={`flex items-center justify-between border-b pb-2 ${isDark ? 'border-[#262626]' : 'border-[#D4D4CE]'}`}>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#CC0000] inline-block" />
                    <h3 className={`text-xs font-mono font-bold uppercase tracking-wider ${isDark ? 'text-[#CCCCCC]' : 'text-[#333333]'}`}>
                      {category.title}
                    </h3>
                  </div>
                  <span className={`text-[10px] font-mono font-semibold uppercase px-1.5 py-0.5 border ${
                    isDark ? 'bg-[#181818] border-[#333333] text-[#888888]' : 'bg-[#EAEAE4] border-[#CCCCCC] text-[#555555]'
                  }`}>
                    {category.desks.length} DESKS
                  </span>
                </div>

                {/* Desk Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  {category.desks.map((desk) => {
                    const Icon = desk.icon;
                    return (
                      <div
                        key={desk.id}
                        onClick={() => handleLaunchDesk(desk)}
                        className={`p-4 border transition-all cursor-pointer flex flex-col justify-between space-y-3 group ${
                          isDark
                            ? 'bg-[#181818] border-[#2A2A2A] hover:border-white hover:bg-[#1E1E1E]'
                            : 'bg-[#FFFFFF] border-[#D4D4CE] hover:border-[#111111] hover:bg-[#F4F4EE] hard-shadow-sm'
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className={`w-8 h-8 border flex items-center justify-center flex-shrink-0 transition-colors ${
                                isDark
                                  ? 'bg-[#141414] text-white border-[#333333] group-hover:bg-[#CC0000] group-hover:border-[#CC0000]'
                                  : 'bg-[#F2F2EC] text-[#111111] border-[#CCCCCC] group-hover:bg-[#CC0000] group-hover:text-white group-hover:border-[#CC0000]'
                              }`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <h4 className={`text-xs font-mono font-bold uppercase truncate ${
                                isDark ? 'text-white group-hover:text-[#F0F0ED]' : 'text-[#111111] group-hover:text-black'
                              }`}>
                                {desk.title}
                              </h4>
                            </div>

                            <span className="text-[9px] font-mono px-1.5 py-0.5 border border-[#CC0000]/40 bg-[#CC0000]/10 text-[#CC0000] font-bold uppercase flex-shrink-0">
                              {desk.tag}
                            </span>
                          </div>

                          <p className={`text-xs font-sans leading-relaxed ${isDark ? 'text-[#888888]' : 'text-[#666666]'}`}>
                            {desk.description}
                          </p>
                        </div>

                        <div className={`pt-2 border-t flex items-center justify-between text-[11px] font-mono font-bold uppercase ${
                          isDark ? 'border-[#262626] text-[#AAAAAA] group-hover:text-white' : 'border-[#EAEAE4] text-[#555555] group-hover:text-black'
                        }`}>
                          <span className="flex items-center gap-1">
                            <span>LAUNCH DESK</span>
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 text-[#CC0000] group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className={`p-3 sm:p-4 border-t ${isDark ? 'border-[#262626] bg-[#0E0E0E] text-[#888888]' : 'border-[#E2E2DC] bg-[#F7F7F4] text-[#666666]'} flex items-center justify-between text-xs font-mono`}>
          <span>CLICK ANY CARD TO ENLARGE AND SWITCH TO THAT DESK</span>
          <span className="font-bold text-[#CC0000]">VITALOS INTELLIGENCE DESKS</span>
        </div>

      </div>
    </div>
  );
};
