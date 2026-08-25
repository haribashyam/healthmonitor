import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Download,
  ShieldCheck,
  Heart,
  Activity,
  Moon,
  Utensils,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Eye,
  SlidersHorizontal,
  User,
  Calendar,
  Sparkles,
  Stethoscope,
  Pill,
  Dumbbell,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Mail,
  FileSpreadsheet
} from 'lucide-react';
import {
  Biomarker,
  Activity as ActivityType,
  SleepRecord,
  AdaptivePlan,
  VitalScore,
  DataSource,
  LabReport
} from '../types';

interface DoctorReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  biomarkers: Biomarker[];
  activities: ActivityType[];
  sleepRecords: SleepRecord[];
  adaptivePlan?: AdaptivePlan;
  vitalScore?: VitalScore;
  sources?: DataSource[];
  labReports?: LabReport[];
  onOpenWorkspace?: (tab: 'gmail' | 'sheets' | 'picker' | 'firebase') => void;
}

export const DoctorReportModal: React.FC<DoctorReportModalProps> = ({
  isOpen,
  onClose,
  biomarkers,
  activities,
  sleepRecords,
  adaptivePlan,
  vitalScore,
  sources = [],
  labReports = [],
  onOpenWorkspace
}) => {
  const [copiedEhr, setCopiedEhr] = useState(false);
  const [downloadingHtml, setDownloadingHtml] = useState(false);
  const [previewTheme, setPreviewTheme] = useState<'paper' | 'dark'>('dark');
  const [patientName, setPatientName] = useState('Alex Vance');
  const [patientDob, setPatientDob] = useState('1990-05-14 (Age 36)');
  const [physicianName, setPhysicianName] = useState('Dr. Sarah Jenkins, MD (Cardiology)');
  const [patientConsultationNotes, setPatientConsultationNotes] = useState(
    'Discuss recent resting heart rate trend improvement, Zone 2 aerobic volume tolerance, and review lipid panel subfractions alongside current nutrition prescription.'
  );

  // Section visibility toggles
  const [includeVitals, setIncludeVitals] = useState(true);
  const [includeBiomarkers, setIncludeBiomarkers] = useState(true);
  const [includeSleep, setIncludeSleep] = useState(true);
  const [includeActivities, setIncludeActivities] = useState(true);
  const [includeGeneratedPlan, setIncludeGeneratedPlan] = useState(true);
  const [includeNutritionSupplements, setIncludeNutritionSupplements] = useState(true);
  const [includeClinicalDiscussion, setIncludeClinicalDiscussion] = useState(true);
  const [includeDoctorNotes, setIncludeDoctorNotes] = useState(true);
  const [includeSignOff, setIncludeSignOff] = useState(true);
  const [showOptions, setShowOptions] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const avgHrv = Math.round(
    sleepRecords.reduce((acc, s) => acc + s.hrvAvg, 0) / (sleepRecords.length || 1)
  );
  const avgRestingHr = Math.round(
    sleepRecords.reduce((acc, s) => acc + s.restingHr, 0) / (sleepRecords.length || 1)
  );
  const avgSleepMins = Math.round(
    sleepRecords.reduce((acc, s) => acc + s.totalMinutes, 0) / (sleepRecords.length || 1)
  );
  const avgDeepMins = Math.round(
    sleepRecords.reduce((acc, s) => acc + s.deepMinutes, 0) / (sleepRecords.length || 1)
  );
  const avgRemMins = Math.round(
    sleepRecords.reduce((acc, s) => acc + s.remMinutes, 0) / (sleepRecords.length || 1)
  );
  const avgSleepScore = Math.round(
    sleepRecords.reduce((acc, s) => acc + s.sleepScore, 0) / (sleepRecords.length || 1)
  );

  const totalTrainingLoad = activities.reduce((acc, a) => acc + a.trainingLoad, 0);
  const totalWeeklyCalories = activities.reduce((acc, a) => acc + a.calories, 0);
  const runActivities = activities.filter((a) => a.type === 'Run');
  const totalRunKm = runActivities.reduce((acc, a) => acc + (a.distanceKm || 0), 0);

  const reportDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const reportTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });
  const reportId = `VTL-MED-${Math.floor(100000 + Math.random() * 900000)}`;

  // Default fallback adaptive plan if not provided
  const plan: AdaptivePlan = adaptivePlan || {
    planName: 'Mitochondrial Aerobic Capacity & Longevity Phase II',
    vitalScoreTarget: 92,
    timelineWeeks: 8,
    summary:
      'Targeted 8-week mesocycle combining Zone 2 cardiac remodeling, progressive compound resistance loading, and precision anti-inflammatory glycemic regulation.',
    workoutSplit: [
      {
        day: 'Monday',
        title: 'Zone 2 Base Aerobic Building',
        duration: '50 mins',
        targetHR: '130 - 142 BPM',
        intensity: 'Moderate',
        sourceRationale: 'Stimulates mitochondrial density and capillary growth in slow-twitch muscle fibers.'
      },
      {
        day: 'Tuesday',
        title: 'Hypertrophy & Posterior Chain Strength',
        duration: '45 mins',
        targetHR: '115 - 150 BPM',
        intensity: 'High',
        sourceRationale: 'Progressive overload for bone mineral density and insulin sensitivity.'
      },
      {
        day: 'Wednesday',
        title: 'Active Parasympathetic Recovery & Mobility',
        duration: '30 mins',
        targetHR: '< 110 BPM',
        intensity: 'Recovery',
        sourceRationale: 'Reduces sympathetic tone, facilitates lymphatic clearance, and stabilizes HRV.'
      },
      {
        day: 'Thursday',
        title: 'Threshold Interval Micro-bursts (4x4)',
        duration: '40 mins',
        targetHR: '162 - 175 BPM',
        intensity: 'High',
        sourceRationale: 'Expands stroke volume and boosts cardiorespiratory VO2 Max capacity.'
      },
      {
        day: 'Friday',
        title: 'Zone 2 Steady-State Aerobic Maintenance',
        duration: '60 mins',
        targetHR: '130 - 142 BPM',
        intensity: 'Moderate',
        sourceRationale: 'Fatty acid oxidation efficiency and metabolic flexibility consolidation.'
      },
      {
        day: 'Saturday',
        title: 'Full Body Functional Resistance & Core',
        duration: '45 mins',
        targetHR: '120 - 155 BPM',
        intensity: 'Moderate',
        sourceRationale: 'Neuromuscular recruitment and spinal stability reinforcement.'
      },
      {
        day: 'Sunday',
        title: 'Complete Rest & Circadian Reset',
        duration: '0 mins',
        targetHR: '< 100 BPM',
        intensity: 'Recovery',
        sourceRationale: 'Full central nervous system decompression and deep tissue repair.'
      }
    ],
    nutritionTargets: {
      dailyCalories: 2450,
      proteinGrams: 165,
      carbGrams: 260,
      fatGrams: 75,
      hydrationLiters: 3.5,
      focusNotes:
        'Whole-food Mediterranean-DASH hybrid with 1.8g/kg protein, complex low-glycemic carbohydrates timed around training windows, and omega-3 enrichment.'
    },
    groceryEssentials: [],
    adaptiveRules: [
      'If overnight HRV drops > 15% below baseline, downgrade High intensity days to Zone 1 active recovery.',
      'If resting heart rate elevates > 5 BPM above 14-day median, reduce training volume by 25%.'
    ]
  };

  // Copy plain structured text for EHR/EMR (Epic, Cerner)
  const handleCopyEhr = () => {
    const text = `=====================================================
CLINICAL HEALTH REPORT & ADAPTIVE PLAN BRIEF
VitalSync Health Intelligence • Report ID: ${reportId}
Date: ${reportDate} | Time: ${reportTime}
Patient: ${patientName} | DOB/Age: ${patientDob}
Attending Physician: ${physicianName}
=====================================================

1. CARDIOVASCULAR & AUTONOMIC BASELINES (90-Day Continuous Wearables):
- Resting Heart Rate (Mean): ${avgRestingHr} BPM (Historical low: 52 BPM)
- HRV RMSSD (Mean): ${avgHrv} ms (Autonomic Status: Normal / Parasympathetic Dominant)
- Blood Pressure: 118/76 mmHg (Normotensive)
- Estimated VO2 Max: 48.6 mL/kg/min (Superior / Top 10th Percentile for age)
- 7-Day Training Load (TRIMP): ${totalTrainingLoad} pts across ${activities.length} sessions

2. SLEEP ARCHITECTURE (Longitudinal Sleep Tracking):
- Total Sleep Time (Avg): ${Math.floor(avgSleepMins / 60)}h ${avgSleepMins % 60}m
- Deep Sleep (Avg): ${avgDeepMins} mins (${Math.round((avgDeepMins / avgSleepMins) * 100)}% of total)
- REM Sleep (Avg): ${avgRemMins} mins (${Math.round((avgRemMins / avgSleepMins) * 100)}% of total)
- Mean Sleep Efficiency: 91%
- Mean SpO2: 98.2% | Overnight Respiratory Rate: 13.8 br/min

3. VERIFIED LABORATORY DIAGNOSTIC BIOMARKERS (Quest Diagnostics):
${biomarkers.map((b) => `- ${b.name}: ${b.value} ${b.unit} [Ref: ${b.referenceRange} ${b.unit}] (Status: ${b.status.toUpperCase()})`).join('\n')}

4. GENERATED ADAPTIVE HEALTH & TRAINING PLAN:
Plan Name: ${plan.planName} (${plan.timelineWeeks}-Week Mesocycle)
Clinical Target: Vital Readiness Score ${plan.vitalScoreTarget}/100
Workout Split:
${plan.workoutSplit.map((w) => `  * ${w.day}: ${w.title} (${w.duration}, Target HR: ${w.targetHR}, Intensity: ${w.intensity})`).join('\n')}
Nutrition Prescription: ${plan.nutritionTargets.dailyCalories} kcal (Protein: ${plan.nutritionTargets.proteinGrams}g, Carbs: ${plan.nutritionTargets.carbGrams}g, Fats: ${plan.nutritionTargets.fatGrams}g, Hydration: ${plan.nutritionTargets.hydrationLiters}L)

5. PATIENT CONSULTATION NOTES & QUESTIONS:
"${patientConsultationNotes}"

=====================================================
DISCLAIMER: This report synthesizes consumer biometric wearables and user-imported certified diagnostic lab reports. It is prepared for physician review and clinical consultation.
=====================================================`;

    navigator.clipboard.writeText(text);
    setCopiedEhr(true);
    setTimeout(() => setCopiedEhr(false), 2500);
  };

  // Generate downloadable standalone HTML report
  const handleDownloadReport = () => {
    setDownloadingHtml(true);
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>VitalSync Medical Brief - ${patientName}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a; background: #ffffff; margin: 0; padding: 40px; line-height: 1.5; font-size: 13px; }
    .header { border-bottom: 2px solid #0f172a; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-start; }
    .title { font-size: 20px; font-weight: 900; letter-spacing: -0.5px; margin: 0; color: #0f172a; }
    .subtitle { color: #475569; font-size: 12px; margin-top: 4px; }
    .meta-box { text-align: right; font-size: 11px; color: #475569; }
    .section-title { font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #0284c7; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; margin-top: 24px; margin-bottom: 12px; }
    .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 16px; }
    .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; }
    .card-label { font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; }
    .card-value { font-size: 16px; font-weight: 800; color: #0f172a; margin: 4px 0; }
    .card-sub { font-size: 10px; color: #0284c7; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 12px; }
    th { background: #f1f5f9; text-align: left; padding: 8px 10px; font-weight: 700; border-bottom: 1px solid #cbd5e1; color: #334155; }
    td { padding: 8px 10px; border-bottom: 1px solid #e2e8f0; color: #1e293b; }
    .badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 700; text-transform: uppercase; background: #dcfce7; color: #166534; }
    .badge-warn { background: #fef3c7; color: #92400e; }
    .callout { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 12px; margin-bottom: 16px; }
    .sign-box { border-top: 1px dashed #94a3b8; padding-top: 16px; margin-top: 32px; display: flex; justify-content: space-between; font-size: 11px; color: #475569; }
    .disclaimer { font-size: 10px; color: #94a3b8; margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 12px; }
    @media print { body { padding: 0; } }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1 class="title">VITALSYNC CLINICAL HEALTH BRIEF & PLAN</h1>
      <div class="subtitle">Multi-Device Biometric Synthesis & Adaptive Prescription for Medical Consultation</div>
      <div style="margin-top: 6px; font-size: 11px;">
        <strong>Patient:</strong> ${patientName} &nbsp;|&nbsp; <strong>DOB/Age:</strong> ${patientDob} &nbsp;|&nbsp; <strong>Attending:</strong> ${physicianName}
      </div>
    </div>
    <div class="meta-box">
      <div><strong>Report ID:</strong> ${reportId}</div>
      <div><strong>Date Generated:</strong> ${reportDate}</div>
      <div><strong>Data Provenance:</strong> Multi-Device Live Stream (Verified)</div>
    </div>
  </div>

  <div class="section-title">1. Cardiovascular & Autonomic Wearable Baselines</div>
  <div class="grid">
    <div class="card">
      <div class="card-label">Resting Heart Rate</div>
      <div class="card-value">${avgRestingHr} BPM</div>
      <div class="card-sub">Baseline dip: 52 BPM</div>
    </div>
    <div class="card">
      <div class="card-label">HRV RMSSD</div>
      <div class="card-value">${avgHrv} ms</div>
      <div class="card-sub">Optimal autonomic tone</div>
    </div>
    <div class="card">
      <div class="card-label">Blood Pressure</div>
      <div class="card-value">118/76 mmHg</div>
      <div class="card-sub">Normotensive</div>
    </div>
    <div class="card">
      <div class="card-label">Cardiorespiratory VO2</div>
      <div class="card-value">48.6 mL/kg/min</div>
      <div class="card-sub">Top 10th Percentile</div>
    </div>
  </div>

  <div class="section-title">2. Verified Laboratory Diagnostic Panels</div>
  <table>
    <thead>
      <tr>
        <th>Biomarker</th>
        <th>Category</th>
        <th>Measured Value</th>
        <th>Reference Interval</th>
        <th>Clinical Status</th>
      </tr>
    </thead>
    <tbody>
      ${biomarkers
        .map(
          (b) => `
        <tr>
          <td><strong>${b.name}</strong></td>
          <td>${b.category}</td>
          <td><strong>${b.value} ${b.unit}</strong></td>
          <td>${b.referenceRange} ${b.unit}</td>
          <td><span class="badge ${b.status === 'optimal' ? '' : 'badge-warn'}">${b.status}</span></td>
        </tr>
      `
        )
        .join('')}
    </tbody>
  </table>

  <div class="section-title">3. Generated Adaptive Health & Training Plan</div>
  <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; margin-bottom: 12px;">
    <strong>Plan Phase:</strong> ${plan.planName} (${plan.timelineWeeks} Weeks) &nbsp;|&nbsp; <strong>Target Vital Score:</strong> ${plan.vitalScoreTarget}/100<br>
    <span style="color: #475569; font-size: 11px;">${plan.summary}</span>
  </div>
  <table>
    <thead>
      <tr>
        <th>Day</th>
        <th>Protocol / Workout Title</th>
        <th>Duration</th>
        <th>Target Heart Rate</th>
        <th>Intensity</th>
        <th>Scientific Rationale</th>
      </tr>
    </thead>
    <tbody>
      ${plan.workoutSplit
        .map(
          (w) => `
        <tr>
          <td><strong>${w.day}</strong></td>
          <td><strong>${w.title}</strong></td>
          <td>${w.duration}</td>
          <td>${w.targetHR}</td>
          <td>${w.intensity}</td>
          <td style="font-size: 11px; color: #475569;">${w.sourceRationale}</td>
        </tr>
      `
        )
        .join('')}
    </tbody>
  </table>

  <div class="section-title">4. Precision Nutrition & Metabolic Protocol</div>
  <div class="grid">
    <div class="card">
      <div class="card-label">Daily Calories</div>
      <div class="card-value">${plan.nutritionTargets.dailyCalories} kcal</div>
      <div class="card-sub">Adherence: 98%</div>
    </div>
    <div class="card">
      <div class="card-label">Daily Protein</div>
      <div class="card-value">${plan.nutritionTargets.proteinGrams}g</div>
      <div class="card-sub">1.8g/kg Target</div>
    </div>
    <div class="card">
      <div class="card-label">Carbohydrates</div>
      <div class="card-value">${plan.nutritionTargets.carbGrams}g</div>
      <div class="card-sub">Timed around workouts</div>
    </div>
    <div class="card">
      <div class="card-label">Hydration Target</div>
      <div class="card-value">${plan.nutritionTargets.hydrationLiters} L/day</div>
      <div class="card-sub">Electrolyte enriched</div>
    </div>
  </div>

  <div class="section-title">5. Patient Consultation Notes & Specific Discussion Items</div>
  <div class="callout">
    ${patientConsultationNotes}
  </div>

  <div class="sign-box">
    <div>
      <div><strong>Attending Clinician Signature:</strong> ________________________________</div>
      <div style="margin-top: 6px;">Name: ${physicianName}</div>
      <div>NPI Number: _____________________</div>
    </div>
    <div>
      <div><strong>Date of Review:</strong> ________________________</div>
      <div style="margin-top: 6px;">[ ] Cleared for Full Training Load</div>
      <div>[ ] Follow-up Diagnostic Panel Ordered</div>
    </div>
  </div>

  <div class="disclaimer">
    <strong>Medical Legal Disclaimer:</strong> This clinical health summary is generated automatically from consumer wearable telemetry streams, Bluetooth sensor data, and certified laboratory reports imported by the patient. It is designed to assist healthcare professionals in structured clinical reviews and does not constitute independent medical diagnoses.
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `VitalSync_Clinical_Report_${patientName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setTimeout(() => setDownloadingHtml(false), 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto print:bg-white print:p-0 print:m-0 print:static print:overflow-visible">
      
      {/* Container Box */}
      <div
        className={`w-full max-w-4xl rounded-2xl border transition-all my-4 shadow-2xl relative ${
          previewTheme === 'paper'
            ? 'bg-white text-slate-900 border-slate-300'
            : 'bg-slate-900 text-slate-100 border-slate-800'
        } print:border-0 print:shadow-none print:max-w-none print:w-full print:m-0 print:p-0 print:bg-white print:text-black`}
      >
        
        {/* TOP TOOLBAR & CONTROLS (Hidden during print) */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/80 rounded-t-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white">
                  Clinical Health Report & Plan PDF Export
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
                  Doctor Ready
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Comprehensive 90-day multi-device telemetry, verified biomarkers, and AI-adapted plan for medical review.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
            {onOpenWorkspace && (
              <>
                <button
                  id="doctor-report-gmail-btn"
                  onClick={() => onOpenWorkspace('gmail')}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-800/60 flex items-center gap-1.5 transition-all shadow-sm"
                  title="Send directly to doctor via Gmail API"
                >
                  <Mail className="w-3.5 h-3.5 text-red-400" />
                  <span>Email via Gmail</span>
                </button>

                <button
                  id="doctor-report-sheets-btn"
                  onClick={() => onOpenWorkspace('sheets')}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-800/60 flex items-center gap-1.5 transition-all shadow-sm"
                  title="Export biomarkers and vitals to Google Sheets"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Export to Sheets</span>
                </button>
              </>
            )}

            <button
              onClick={() => setShowOptions(!showOptions)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700 flex items-center gap-1.5 transition-all"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Customize Sections
              {showOptions ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={handleCopyEhr}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700 flex items-center gap-1.5 transition-all"
              title="Copy formatted text for Epic/Cerner/MyChart EHR"
            >
              {copiedEhr ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied EHR</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy EHR Text</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownloadReport}
              disabled={downloadingHtml}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700 border border-slate-700 flex items-center gap-1.5 transition-all"
              title="Download standalone HTML/PDF document"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>{downloadingHtml ? 'Generating...' : 'Download Brief'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 hover:from-cyan-400 hover:to-emerald-400 flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/25"
            >
              <Printer className="w-4 h-4" /> Print / Save PDF
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white text-base hover:bg-slate-800 transition-all ml-1"
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>
        </div>

        {/* CUSTOMIZATION DRAWER (Hidden during print) */}
        {showOptions && (
          <div className="p-4 sm:p-5 bg-slate-950/95 border-b border-slate-800 space-y-4 print:hidden text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
                Report Section Toggles & Patient Profile
              </span>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-[11px]">Preview Mode:</span>
                <button
                  onClick={() => setPreviewTheme('dark')}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    previewTheme === 'dark' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  Dark UI
                </button>
                <button
                  onClick={() => setPreviewTheme('paper')}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    previewTheme === 'paper' ? 'bg-white text-slate-950 font-black' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  Paper Preview
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Patient Name</label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-100 focus:outline-none focus:border-cyan-500 text-xs"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">DOB / Age</label>
                <input
                  type="text"
                  value={patientDob}
                  onChange={(e) => setPatientDob(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-100 focus:outline-none focus:border-cyan-500 text-xs"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Attending Physician / Clinic</label>
                <input
                  type="text"
                  value={physicianName}
                  onChange={(e) => setPhysicianName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-100 focus:outline-none focus:border-cyan-500 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                Patient Questions & Consultation Notes for Doctor
              </label>
              <textarea
                value={patientConsultationNotes}
                onChange={(e) => setPatientConsultationNotes(e.target.value)}
                rows={2}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-cyan-500 text-xs"
                placeholder="Type specific questions or symptoms to discuss with your doctor..."
              />
            </div>

            <div className="pt-2 border-t border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold block mb-2">Include in Generated PDF:</span>
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 hover:text-white">
                  <input
                    type="checkbox"
                    checked={includeVitals}
                    onChange={(e) => setIncludeVitals(e.target.checked)}
                    className="accent-cyan-500 rounded"
                  />
                  <span>Cardiovascular Vitals</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 hover:text-white">
                  <input
                    type="checkbox"
                    checked={includeBiomarkers}
                    onChange={(e) => setIncludeBiomarkers(e.target.checked)}
                    className="accent-cyan-500 rounded"
                  />
                  <span>Quest Lab Diagnostic Panels</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 hover:text-white">
                  <input
                    type="checkbox"
                    checked={includeSleep}
                    onChange={(e) => setIncludeSleep(e.target.checked)}
                    className="accent-cyan-500 rounded"
                  />
                  <span>Sleep Staging & Architecture</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 hover:text-white">
                  <input
                    type="checkbox"
                    checked={includeActivities}
                    onChange={(e) => setIncludeActivities(e.target.checked)}
                    className="accent-cyan-500 rounded"
                  />
                  <span>Training Load & Workouts</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 hover:text-white">
                  <input
                    type="checkbox"
                    checked={includeGeneratedPlan}
                    onChange={(e) => setIncludeGeneratedPlan(e.target.checked)}
                    className="accent-cyan-500 rounded"
                  />
                  <span>AI Adaptive Plan & Split</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 hover:text-white">
                  <input
                    type="checkbox"
                    checked={includeNutritionSupplements}
                    onChange={(e) => setIncludeNutritionSupplements(e.target.checked)}
                    className="accent-cyan-500 rounded"
                  />
                  <span>Nutrition Targets</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 hover:text-white">
                  <input
                    type="checkbox"
                    checked={includeClinicalDiscussion}
                    onChange={(e) => setIncludeClinicalDiscussion(e.target.checked)}
                    className="accent-cyan-500 rounded"
                  />
                  <span>Clinical Discussion Points</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 hover:text-white">
                  <input
                    type="checkbox"
                    checked={includeDoctorNotes}
                    onChange={(e) => setIncludeDoctorNotes(e.target.checked)}
                    className="accent-cyan-500 rounded"
                  />
                  <span>Patient Notes</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 hover:text-white">
                  <input
                    type="checkbox"
                    checked={includeSignOff}
                    onChange={(e) => setIncludeSignOff(e.target.checked)}
                    className="accent-cyan-500 rounded"
                  />
                  <span>Physician Signature Block</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* PRINTABLE DOCUMENT CANVAS */}
        <div
          id="clinical-report-content"
          className={`p-6 sm:p-8 space-y-6 text-xs leading-relaxed max-h-[80vh] overflow-y-auto print:max-h-none print:overflow-visible print:p-0 print:space-y-4 ${
            previewTheme === 'paper' ? 'bg-white text-slate-900' : 'text-slate-100'
          }`}
        >
          
          {/* HEADER / CLINICAL IDENTIFIER */}
          <div className="border-b-2 border-slate-700 pb-4 flex flex-col sm:flex-row justify-between items-start gap-4 print:border-black print:pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xl tracking-tight text-white print:text-black">
                  VITALSYNC • CLINICAL HEALTH BRIEF & PLAN
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 print:border-black print:text-black print:bg-slate-100">
                  OFFICIAL SUMMARY
                </span>
              </div>
              <p className="text-slate-400 print:text-slate-700 text-xs mt-1">
                Longitudinal Multi-Device Biometric Synthesis & Adaptive Training Protocol for Attending Physician
              </p>
              
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-300 print:text-black">
                <span><strong>Patient:</strong> {patientName}</span>
                <span><strong>DOB/Age:</strong> {patientDob}</span>
                <span><strong>Sex:</strong> Male</span>
                <span><strong>Attending:</strong> {physicianName}</span>
              </div>
            </div>

            <div className="text-left sm:text-right text-[11px] text-slate-400 print:text-slate-800 space-y-0.5 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
              <div><strong>Report ID:</strong> <span className="font-mono">{reportId}</span></div>
              <div><strong>Date Generated:</strong> {reportDate} ({reportTime})</div>
              <div><strong>Provenance:</strong> Multi-Source Verified Stream</div>
              <div className="text-emerald-400 print:text-emerald-800 font-semibold flex items-center sm:justify-end gap-1">
                <ShieldCheck className="w-3 h-3" /> HIPAA Compliant Client-Export
              </div>
            </div>
          </div>

          {/* SECTION 1: CARDIOVASCULAR & AUTONOMIC VITALS */}
          {includeVitals && (
            <div className="space-y-2.5 print:break-inside-avoid">
              <div className="flex items-center justify-between border-b border-slate-800 print:border-slate-300 pb-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 print:text-black flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5" />
                  1. Cardiovascular & Autonomic Wearable Baselines (90-Day Continuous Ingestion)
                </h3>
                <span className="text-[10px] text-slate-400 print:text-slate-600">Garmin • Apple Watch • Oura • Dexcom</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-950/80 print:bg-slate-50 p-3 rounded-lg border border-slate-800 print:border-slate-300">
                  <span className="text-[10px] text-slate-400 print:text-slate-600 uppercase font-bold block">
                    Resting Heart Rate
                  </span>
                  <span className="text-base font-black text-white print:text-black">{avgRestingHr} BPM</span>
                  <span className="text-[10px] text-emerald-400 print:text-emerald-700 block font-medium">
                    Historical dip: 52 BPM (Athletic)
                  </span>
                </div>

                <div className="bg-slate-950/80 print:bg-slate-50 p-3 rounded-lg border border-slate-800 print:border-slate-300">
                  <span className="text-[10px] text-slate-400 print:text-slate-600 uppercase font-bold block">
                    HRV RMSSD (Overnight)
                  </span>
                  <span className="text-base font-black text-white print:text-black">{avgHrv} ms</span>
                  <span className="text-[10px] text-emerald-400 print:text-emerald-700 block font-medium">
                    Sympathovagal balance optimal
                  </span>
                </div>

                <div className="bg-slate-950/80 print:bg-slate-50 p-3 rounded-lg border border-slate-800 print:border-slate-300">
                  <span className="text-[10px] text-slate-400 print:text-slate-600 uppercase font-bold block">
                    Blood Pressure
                  </span>
                  <span className="text-base font-black text-white print:text-black">118/76 mmHg</span>
                  <span className="text-[10px] text-cyan-400 print:text-blue-700 block font-medium">
                    Optimal / Normotensive
                  </span>
                </div>

                <div className="bg-slate-950/80 print:bg-slate-50 p-3 rounded-lg border border-slate-800 print:border-slate-300">
                  <span className="text-[10px] text-slate-400 print:text-slate-600 uppercase font-bold block">
                    Estimated VO2 Max
                  </span>
                  <span className="text-base font-black text-white print:text-black">48.6 mL/kg/min</span>
                  <span className="text-[10px] text-cyan-400 print:text-blue-700 block font-medium">
                    Top 10th Percentile
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: VERIFIED LABORATORY DIAGNOSTIC BIOMARKERS */}
          {includeBiomarkers && (
            <div className="space-y-2.5 print:break-inside-avoid">
              <div className="flex items-center justify-between border-b border-slate-800 print:border-slate-300 pb-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 print:text-black flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" />
                  2. Verified Laboratory Diagnostic Biomarkers (Quest Diagnostics / Lab OCR)
                </h3>
                <span className="text-[10px] text-slate-400 print:text-slate-600">Sample Date: Aug 15, 2026</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 print:border-slate-300 text-[11px] text-slate-400 print:text-slate-700">
                      <th className="py-2 font-bold">Biomarker</th>
                      <th className="py-2 font-bold">Category</th>
                      <th className="py-2 font-bold">Measured Value</th>
                      <th className="py-2 font-bold">Reference Interval</th>
                      <th className="py-2 font-bold">Clinical Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 print:divide-slate-200">
                    {biomarkers.map((b) => (
                      <tr key={b.id} className="text-xs">
                        <td className="py-2 font-semibold text-slate-200 print:text-black">{b.name}</td>
                        <td className="py-2 text-slate-400 print:text-slate-600">{b.category}</td>
                        <td className="py-2 font-bold text-white print:text-black">
                          {b.value} {b.unit}
                        </td>
                        <td className="py-2 text-slate-400 print:text-slate-600">
                          {b.referenceRange} {b.unit}
                        </td>
                        <td className="py-2">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              b.status === 'optimal'
                                ? 'bg-emerald-500/20 text-emerald-400 print:bg-emerald-100 print:text-emerald-800'
                                : b.status === 'normal'
                                ? 'bg-cyan-500/20 text-cyan-400 print:bg-cyan-100 print:text-cyan-800'
                                : 'bg-amber-500/20 text-amber-400 print:bg-amber-100 print:text-amber-800'
                            }`}
                          >
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SECTION 3: SLEEP ARCHITECTURE & RESTORATIVE CYCLES */}
          {includeSleep && (
            <div className="space-y-2.5 print:break-inside-avoid">
              <div className="flex items-center justify-between border-b border-slate-800 print:border-slate-300 pb-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 print:text-black flex items-center gap-1.5">
                  <Moon className="w-3.5 h-3.5" />
                  3. Sleep Architecture & Restorative Staging (30-Day Aggregation)
                </h3>
                <span className="text-[10px] text-slate-400 print:text-slate-600">Oura Ring Gen 3 & Apple Sleep</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-950/80 print:bg-slate-50 p-3 rounded-lg border border-slate-800 print:border-slate-300">
                  <span className="text-[10px] text-slate-400 print:text-slate-600 uppercase font-bold block">
                    Mean Total Sleep
                  </span>
                  <span className="text-base font-black text-white print:text-black">
                    {Math.floor(avgSleepMins / 60)}h {avgSleepMins % 60}m
                  </span>
                  <span className="text-[10px] text-slate-400 print:text-slate-600 block">Efficiency: 91%</span>
                </div>

                <div className="bg-slate-950/80 print:bg-slate-50 p-3 rounded-lg border border-slate-800 print:border-slate-300">
                  <span className="text-[10px] text-slate-400 print:text-slate-600 uppercase font-bold block">
                    Deep Restorative Sleep
                  </span>
                  <span className="text-base font-black text-white print:text-black">{avgDeepMins} mins</span>
                  <span className="text-[10px] text-emerald-400 print:text-emerald-700 block font-medium">
                    {Math.round((avgDeepMins / avgSleepMins) * 100)}% (Superior)
                  </span>
                </div>

                <div className="bg-slate-950/80 print:bg-slate-50 p-3 rounded-lg border border-slate-800 print:border-slate-300">
                  <span className="text-[10px] text-slate-400 print:text-slate-600 uppercase font-bold block">
                    REM Cognitive Sleep
                  </span>
                  <span className="text-base font-black text-white print:text-black">{avgRemMins} mins</span>
                  <span className="text-[10px] text-indigo-400 print:text-indigo-700 block font-medium">
                    {Math.round((avgRemMins / avgSleepMins) * 100)}% (Normal)
                  </span>
                </div>

                <div className="bg-slate-950/80 print:bg-slate-50 p-3 rounded-lg border border-slate-800 print:border-slate-300">
                  <span className="text-[10px] text-slate-400 print:text-slate-600 uppercase font-bold block">
                    Respiratory Rate & SpO2
                  </span>
                  <span className="text-base font-black text-white print:text-black">13.8 br/m • 98.2%</span>
                  <span className="text-[10px] text-slate-400 print:text-slate-600 block">No apnea signatures</span>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: TRAINING LOAD & RECENT ACTIVITIES */}
          {includeActivities && (
            <div className="space-y-2.5 print:break-inside-avoid">
              <div className="flex items-center justify-between border-b border-slate-800 print:border-slate-300 pb-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 print:text-black flex items-center gap-1.5">
                  <Dumbbell className="w-3.5 h-3.5" />
                  4. Cardiorespiratory Endurance Load & Training Workload
                </h3>
                <span className="text-[10px] text-slate-400 print:text-slate-600">Strava & Polar HR Ingestion</span>
              </div>

              <div className="bg-slate-950/80 print:bg-slate-50 p-3.5 rounded-lg border border-slate-800 print:border-slate-300 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div>
                  <span className="text-slate-400 print:text-slate-600 block text-[10px] uppercase font-bold">Weekly TRIMP Load</span>
                  <span className="text-sm font-bold text-white print:text-black">{totalTrainingLoad} Points (Optimal Base)</span>
                </div>
                <div>
                  <span className="text-slate-400 print:text-slate-600 block text-[10px] uppercase font-bold">Total Running Mileage</span>
                  <span className="text-sm font-bold text-white print:text-black">{totalRunKm.toFixed(1)} km (Zone 2 dominant)</span>
                </div>
                <div>
                  <span className="text-slate-400 print:text-slate-600 block text-[10px] uppercase font-bold">Active Caloric Expenditure</span>
                  <span className="text-sm font-bold text-white print:text-black">{totalWeeklyCalories.toLocaleString()} kcal/wk</span>
                </div>
                <div>
                  <span className="text-slate-400 print:text-slate-600 block text-[10px] uppercase font-bold">Acute:Chronic Workload</span>
                  <span className="text-sm font-bold text-emerald-400 print:text-emerald-700">1.08 (Sweet Spot)</span>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 5: GENERATED ADAPTIVE HEALTH & TRAINING PLAN */}
          {includeGeneratedPlan && (
            <div className="space-y-3 print:break-inside-avoid">
              <div className="flex items-center justify-between border-b border-slate-800 print:border-slate-300 pb-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 print:text-black flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  5. AI-Generated Adaptive Health & Training Prescription
                </h3>
                <span className="text-[10px] text-slate-400 print:text-slate-600">VitalSync Evidence Engine</span>
              </div>

              <div className="bg-slate-950/90 print:bg-slate-50 p-3.5 rounded-lg border border-slate-800 print:border-slate-300 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold text-white print:text-black">{plan.planName}</span>
                    <span className="text-[10px] text-slate-400 print:text-slate-600 ml-2">
                      ({plan.timelineWeeks}-Week Mesocycle • Target Readiness: {plan.vitalScoreTarget}/100)
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 print:bg-slate-200 print:text-black">
                    Auto-Adjusts to Overnight HRV
                  </span>
                </div>
                <p className="text-xs text-slate-300 print:text-slate-700 leading-relaxed">{plan.summary}</p>
              </div>

              {/* Workout Split Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 print:border-slate-300 text-[11px] text-slate-400 print:text-slate-700">
                      <th className="py-2 font-bold">Day</th>
                      <th className="py-2 font-bold">Protocol / Workout Title</th>
                      <th className="py-2 font-bold">Duration</th>
                      <th className="py-2 font-bold">Target HR Zone</th>
                      <th className="py-2 font-bold">Intensity</th>
                      <th className="py-2 font-bold">Scientific Rationale</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 print:divide-slate-200 text-xs">
                    {plan.workoutSplit.map((w, idx) => (
                      <tr key={idx}>
                        <td className="py-2 font-bold text-slate-200 print:text-black">{w.day}</td>
                        <td className="py-2 font-semibold text-white print:text-black">{w.title}</td>
                        <td className="py-2 text-slate-400 print:text-slate-600">{w.duration}</td>
                        <td className="py-2 text-cyan-400 print:text-blue-700 font-mono text-[11px]">{w.targetHR}</td>
                        <td className="py-2">
                          <span
                            className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                              w.intensity === 'Recovery'
                                ? 'bg-emerald-500/20 text-emerald-400 print:bg-emerald-100 print:text-emerald-800'
                                : w.intensity === 'High'
                                ? 'bg-rose-500/20 text-rose-400 print:bg-rose-100 print:text-rose-800'
                                : 'bg-slate-800 text-slate-300 print:bg-slate-100 print:text-black'
                            }`}
                          >
                            {w.intensity}
                          </span>
                        </td>
                        <td className="py-2 text-slate-400 print:text-slate-600 text-[11px] leading-snug">
                          {w.sourceRationale}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SECTION 6: PRECISION NUTRITION TARGETS */}
          {includeNutritionSupplements && (
            <div className="space-y-2.5 print:break-inside-avoid">
              <div className="flex items-center justify-between border-b border-slate-800 print:border-slate-300 pb-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 print:text-black flex items-center gap-1.5">
                  <Utensils className="w-3.5 h-3.5" />
                  6. Precision Nutrition & Metabolic Protocol
                </h3>
                <span className="text-[10px] text-slate-400 print:text-slate-600">Target: {plan.nutritionTargets.dailyCalories} kcal</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-slate-950/80 print:bg-slate-50 p-2.5 rounded-lg border border-slate-800 print:border-slate-300">
                  <span className="text-[10px] text-slate-400 print:text-slate-600 uppercase font-bold block">Caloric Ceiling</span>
                  <span className="text-sm font-bold text-white print:text-black">{plan.nutritionTargets.dailyCalories} kcal</span>
                  <span className="text-[10px] text-emerald-400 print:text-emerald-700 block">Adherence: 98%</span>
                </div>
                <div className="bg-slate-950/80 print:bg-slate-50 p-2.5 rounded-lg border border-slate-800 print:border-slate-300">
                  <span className="text-[10px] text-slate-400 print:text-slate-600 uppercase font-bold block">Daily Protein</span>
                  <span className="text-sm font-bold text-white print:text-black">{plan.nutritionTargets.proteinGrams}g</span>
                  <span className="text-[10px] text-slate-400 print:text-slate-600 block">1.8g/kg body weight</span>
                </div>
                <div className="bg-slate-950/80 print:bg-slate-50 p-2.5 rounded-lg border border-slate-800 print:border-slate-300">
                  <span className="text-[10px] text-slate-400 print:text-slate-600 uppercase font-bold block">Carbohydrates / Fats</span>
                  <span className="text-sm font-bold text-white print:text-black">
                    {plan.nutritionTargets.carbGrams}g C / {plan.nutritionTargets.fatGrams}g F
                  </span>
                  <span className="text-[10px] text-slate-400 print:text-slate-600 block">Glycemic balanced</span>
                </div>
                <div className="bg-slate-950/80 print:bg-slate-50 p-2.5 rounded-lg border border-slate-800 print:border-slate-300">
                  <span className="text-[10px] text-slate-400 print:text-slate-600 uppercase font-bold block">Hydration Target</span>
                  <span className="text-sm font-bold text-white print:text-black">{plan.nutritionTargets.hydrationLiters} Liters/day</span>
                  <span className="text-[10px] text-cyan-400 print:text-blue-700 block">Electrolyte optimized</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 print:text-slate-600 italic">
                <strong>Focus Notes:</strong> {plan.nutritionTargets.focusNotes}
              </p>
            </div>
          )}

          {/* SECTION 7: CLINICAL DISCUSSION POINTS & AI RATIONALE */}
          {includeClinicalDiscussion && (
            <div className="bg-slate-950/90 print:bg-slate-50 p-4 rounded-xl border border-slate-800 print:border-slate-300 space-y-2.5 print:break-inside-avoid">
              <span className="text-xs font-bold text-white print:text-black uppercase tracking-wider block flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 print:text-emerald-700" />
                7. Key Physiological Trends & Physician Discussion Points:
              </span>
              <ul className="list-disc list-inside space-y-1 text-slate-300 print:text-slate-700 text-xs">
                <li>
                  <strong>Autonomic Reserve:</strong> Overnight HRV RMSSD average of {avgHrv}ms and resting heart rate of {avgRestingHr} BPM reflect robust parasympathetic tone and adequate recovery between high-load sessions.
                </li>
                <li>
                  <strong>Metabolic & Glycemic Balance:</strong> Fasting blood glucose (88 mg/dL) and HbA1c (5.2%) remain strictly optimal with low postprandial glycemic excursions.
                </li>
                <li>
                  <strong>Systemic Inflammation:</strong> High-sensitivity CRP is 0.74 mg/L, indicating low cardiovascular inflammatory risk under current endurance training volume.
                </li>
                <li>
                  <strong>Cardiopulmonary Adaptation:</strong> Zone 2 training distribution has stabilized stroke volume with minimal cardiac drift across 60-minute aerobic sessions.
                </li>
              </ul>
            </div>
          )}

          {/* SECTION 8: PATIENT CONSULTATION NOTES */}
          {includeDoctorNotes && patientConsultationNotes && (
            <div className="bg-slate-950/80 print:bg-slate-50 p-4 rounded-xl border border-slate-800 print:border-slate-300 space-y-1.5 print:break-inside-avoid">
              <span className="text-xs font-bold text-cyan-400 print:text-blue-800 uppercase tracking-wider block">
                8. Patient Consultation Questions & Self-Reported Observations:
              </span>
              <p className="text-slate-200 print:text-black text-xs leading-relaxed italic">
                "{patientConsultationNotes}"
              </p>
            </div>
          )}

          {/* SECTION 9: PHYSICIAN ATTESTATION & SIGNATURE BLOCK */}
          {includeSignOff && (
            <div className="pt-4 border-t-2 border-dashed border-slate-800 print:border-slate-400 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 print:break-inside-avoid text-xs text-slate-300 print:text-black">
              <div className="space-y-4 w-full sm:w-1/2">
                <div>
                  <div className="border-b border-slate-700 print:border-black h-8 w-64"></div>
                  <div className="text-[11px] text-slate-400 print:text-slate-700 mt-1 font-semibold">
                    Attending Physician Signature
                  </div>
                </div>
                <div className="text-[11px]">
                  <div><strong>Physician:</strong> {physicianName}</div>
                  <div><strong>NPI / License:</strong> ____________________________________</div>
                </div>
              </div>

              <div className="space-y-2 w-full sm:w-1/2 text-left sm:text-right text-[11px]">
                <div><strong>Date of Clinical Review:</strong> ________________________</div>
                <div className="space-y-1 pt-1">
                  <label className="flex items-center gap-1.5 sm:justify-end">
                    <input type="checkbox" className="accent-cyan-500 rounded" />
                    <span>Cleared for current training mesocycle load</span>
                  </label>
                  <label className="flex items-center gap-1.5 sm:justify-end">
                    <input type="checkbox" className="accent-cyan-500 rounded" />
                    <span>Follow-up lipid / metabolic lab order requested</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* LEGAL DISCLAIMER */}
          <div className="pt-3 text-[10px] text-slate-500 print:text-slate-600 border-t border-slate-800 print:border-slate-300 print:break-inside-avoid">
            <strong>Medical Disclaimer:</strong> This summary is synthesized from consumer health sensors, wearable telemetry streams, and verified diagnostic laboratory results imported into VitalSync. It is intended to assist medical professionals during clinical consultation and does not constitute independent medical diagnoses.
          </div>

        </div>

      </div>

    </div>
  );
};
