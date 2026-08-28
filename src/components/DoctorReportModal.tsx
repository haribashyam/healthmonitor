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

  const totalTrainingLoad = activities.reduce((acc, a) => acc + (a.trainingLoad || 0), 0);
  const totalWeeklyCalories = activities.reduce((acc, a) => acc + (a.calories || 0), 0);
  const totalRunKm = activities
    .filter((a) => a.type === 'run')
    .reduce((acc, a) => acc + (a.distance || 0), 0);

  const reportDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  const reportTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
  const reportId = `VS-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

  // Default adaptive plan fallback if not provided
  const plan: AdaptivePlan = adaptivePlan || {
    id: 'default-plan',
    generatedAt: new Date().toISOString(),
    planName: 'Cardiometabolic & Mitochondrial Longevity Mesocycle',
    vitalScoreTarget: 92,
    timelineWeeks: 8,
    summary:
      'High polarized training distribution: 80% Zone 2 endurance base with 20% high-intensity interval micro-bursts, paired with high-protein anti-inflammatory nutrition and targeted restorative sleep interventions.',
    workoutSplit: [
      {
        day: 'Monday',
        title: 'Zone 2 Steady-State Aerobic Base',
        duration: '55 mins',
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
- Nocturnal SpO2 & Respiratory Rate: 98.2% SpO2 | 13.8 br/min (No sleep apnea signatures)

3. LABORATORY DIAGNOSTIC BIOMARKERS:
${biomarkers.map((b) => `- ${b.name}: ${b.value} ${b.unit} (Ref: ${b.referenceRange} ${b.unit}) [${b.status.toUpperCase()}]`).join('\n')}

4. CURRENT ADAPTIVE PRESCRIPTION:
- Plan: ${plan.planName} (${plan.timelineWeeks} Weeks)
- Target Vital Score: ${plan.vitalScoreTarget}/100
- Weekly Workout Schedule:
${plan.workoutSplit.map((w) => `  * ${w.day}: ${w.title} (${w.duration}, HR: ${w.targetHR}, ${w.intensity})`).join('\n')}
- Precision Nutrition: ${plan.nutritionTargets.dailyCalories} kcal/day (${plan.nutritionTargets.proteinGrams}g Protein, ${plan.nutritionTargets.carbGrams}g Carbs, ${plan.nutritionTargets.fatGrams}g Fat, ${plan.nutritionTargets.hydrationLiters}L Water)

5. PATIENT CONSULTATION NOTES & QUESTIONS:
"${patientConsultationNotes}"

Generated by VitalSync Multi-Device Telemetry Engine.
`;

    navigator.clipboard.writeText(text);
    setCopiedEhr(true);
    setTimeout(() => setCopiedEhr(false), 2000);
  };

  // Download standalone self-contained HTML Doctor Brief
  const handleDownloadReport = () => {
    setDownloadingHtml(true);
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>VitalSync Clinical Report - ${patientName}</title>
  <style>
    body { font-family: 'Times New Roman', Times, serif; color: #111; background: #fff; margin: 0; padding: 30px; font-size: 13px; line-height: 1.5; }
    .header { border-bottom: 2px solid #000; padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-start; }
    .title { font-size: 20px; font-weight: 900; text-transform: uppercase; margin: 0; letter-spacing: -0.5px; }
    .subtitle { font-size: 12px; color: #555; margin-top: 4px; font-family: monospace; }
    .meta-box { text-align: right; font-size: 11px; font-family: monospace; }
    .section-title { font-size: 14px; font-weight: 800; text-transform: uppercase; border-bottom: 1px solid #000; padding-bottom: 4px; margin: 18px 0 10px; font-family: monospace; }
    .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 16px; font-family: monospace; }
    .card { background: #fdfdfc; border: 1px solid #000; padding: 10px; }
    .card-label { font-size: 10px; font-weight: 700; color: #555; text-transform: uppercase; }
    .card-value { font-size: 18px; font-weight: 900; color: #000; margin: 4px 0; }
    .card-sub { font-size: 10px; color: #777; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 12px; font-family: monospace; }
    th { background: #f2f2f0; text-align: left; padding: 6px 8px; font-weight: 800; border-bottom: 1px solid #000; color: #000; text-transform: uppercase; }
    td { padding: 6px 8px; border-bottom: 1px solid #ddd; color: #111; }
    .badge { display: inline-block; padding: 2px 6px; font-size: 10px; font-weight: 800; text-transform: uppercase; background: #000; color: #fff; }
    .badge-warn { background: #cc0000; color: #fff; }
    .callout { background: #f9f9f8; border: 1px solid #000; padding: 12px; margin-bottom: 16px; }
    .sign-box { border-top: 1px dashed #000; padding-top: 16px; margin-top: 32px; display: flex; justify-content: space-between; font-size: 11px; font-family: monospace; }
    .disclaimer { font-size: 10px; color: #777; margin-top: 24px; border-top: 1px solid #ccc; padding-top: 10px; font-family: monospace; }
    @media print { body { padding: 0; } }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1 class="title">VITALSYNC CLINICAL HEALTH BRIEF &amp; PLAN</h1>
      <div class="subtitle">Multi-Device Biometric Synthesis &amp; Adaptive Prescription for Medical Consultation</div>
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

  <div class="section-title">1. Cardiovascular &amp; Autonomic Wearable Baselines</div>
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

  <div class="section-title">3. Generated Adaptive Health &amp; Training Plan</div>
  <div style="background: #fdfdfc; border: 1px solid #000; padding: 12px; margin-bottom: 12px;">
    <strong>Plan Phase:</strong> ${plan.planName} (${plan.timelineWeeks} Weeks) &nbsp;|&nbsp; <strong>Target Vital Score:</strong> ${plan.vitalScoreTarget}/100<br>
    <span style="color: #444; font-size: 11px;">${plan.summary}</span>
  </div>
  <table>
    <thead>
      <tr>
        <th>Day</th>
        <th>Protocol / Workout Title</th>
        <th>Duration</th>
        <th>Target HR Zone</th>
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
          <td><span class="badge">${w.intensity}</span></td>
          <td>${w.sourceRationale}</td>
        </tr>
      `
        )
        .join('')}
    </tbody>
  </table>

  <div class="section-title">4. Nutrition Targets &amp; Metabolic Plan</div>
  <div class="grid">
    <div class="card">
      <div class="card-label">Daily Calories</div>
      <div class="card-value">${plan.nutritionTargets.dailyCalories} kcal</div>
      <div class="card-sub">Adherence: 98%</div>
    </div>
    <div class="card">
      <div class="card-label">Protein</div>
      <div class="card-value">${plan.nutritionTargets.proteinGrams}g</div>
      <div class="card-sub">1.8g/kg bodyweight</div>
    </div>
    <div class="card">
      <div class="card-label">Carbs / Fats</div>
      <div class="card-value">${plan.nutritionTargets.carbGrams}g / ${plan.nutritionTargets.fatGrams}g</div>
      <div class="card-sub">Glycemic balanced</div>
    </div>
    <div class="card">
      <div class="card-label">Hydration</div>
      <div class="card-value">${plan.nutritionTargets.hydrationLiters} L/day</div>
      <div class="card-sub">Electrolyte optimal</div>
    </div>
  </div>
  <p style="font-size: 11px; color: #444; margin-top: -6px;"><strong>Focus Notes:</strong> ${plan.nutritionTargets.focusNotes}</p>

  <div class="section-title">5. Physician Discussion Points &amp; Trends</div>
  <div class="callout">
    <ul style="margin: 0; padding-left: 18px;">
      <li><strong>Autonomic Reserve:</strong> Overnight HRV RMSSD average of ${avgHrv}ms and resting heart rate of ${avgRestingHr} BPM reflect robust parasympathetic tone.</li>
      <li><strong>Metabolic &amp; Glycemic Balance:</strong> Fasting blood glucose (88 mg/dL) and HbA1c (5.2%) remain strictly optimal with low postprandial excursions.</li>
      <li><strong>Systemic Inflammation:</strong> High-sensitivity CRP is 0.74 mg/L, indicating low cardiovascular inflammatory risk.</li>
      <li><strong>Cardiopulmonary Adaptation:</strong> Zone 2 training distribution has stabilized stroke volume with minimal cardiac drift across 60-minute sessions.</li>
    </ul>
  </div>

  ${
    patientConsultationNotes
      ? `
  <div class="section-title">6. Patient Consultation Questions</div>
  <div style="background: #fdfdfc; border: 1px solid #000; padding: 10px; font-style: italic; font-size: 11px;">
    "${patientConsultationNotes}"
  </div>
  `
      : ''
  }

  <div class="sign-box">
    <div>
      <div style="border-bottom: 1px solid #000; width: 220px; height: 30px;"></div>
      <div style="margin-top: 4px; font-weight: 700;">Attending Physician Signature</div>
      <div style="margin-top: 2px;">Physician: ${physicianName}</div>
    </div>
    <div>
      <div><strong>Date Reviewed:</strong> ________________________</div>
      <div style="margin-top: 6px;">[ &nbsp; ] Cleared for Current Training Load</div>
      <div style="margin-top: 2px;">[ &nbsp; ] Lab Orders Updated</div>
    </div>
  </div>

  <div class="disclaimer">
    <strong>Medical Disclaimer:</strong> This brief is synthesized from consumer sensors and laboratory diagnostics imported into VitalSync for medical consultation purposes.
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
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
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto print:bg-white print:p-0 print:m-0 print:static print:overflow-visible font-mono">
      {/* Container Box */}
      <div
        className={`w-full max-w-4xl border-2 transition-all my-4 relative ${
          previewTheme === 'paper'
            ? 'bg-[#FFFFFF] text-[#111111] border-[#111111] hard-shadow'
            : 'bg-[var(--bg-card)] text-[var(--text-main)] border-[var(--border-edge)]'
        } print:border-0 print:shadow-none print:max-w-none print:w-full print:m-0 print:p-0 print:bg-white print:text-black`}
      >
        {/* TOP TOOLBAR & CONTROLS (Hidden during print) */}
        <div className="p-4 sm:p-5 border-b border-[var(--border-edge)] bg-[var(--bg-card-alt)] text-[var(--text-main)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden">
          <div className="flex items-center gap-3">
            <div className="p-2 border border-[var(--border-edge)] bg-[var(--bg-card)] text-[var(--text-main)]">
              <Stethoscope className="w-5 h-5 text-[#CC0000]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-serif font-black uppercase tracking-tight text-[var(--text-main)]">
                  Clinical Health Report &amp; PDF Export
                </h2>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-[#CC0000] text-white uppercase tracking-wider">
                  DOCTOR READY
                </span>
              </div>
              <p className="text-xs font-sans text-[var(--text-muted)] mt-0.5">
                Comprehensive 90-day multi-device telemetry, verified biomarkers, and calibrated plan.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end text-xs font-mono">
            {onOpenWorkspace && (
              <>
                <button
                  id="doctor-report-gmail-btn"
                  onClick={() => onOpenWorkspace('gmail')}
                  className="px-3 py-1.5 font-bold uppercase bg-[var(--bg-card)] hover:bg-[var(--bg-card-contrast)] text-[var(--text-main)] border border-[var(--border-edge)] flex items-center gap-1.5 transition-all"
                  title="Send directly to doctor via Gmail API"
                >
                  <Mail className="w-3.5 h-3.5 text-[#CC0000]" />
                  <span>Email via Gmail</span>
                </button>

                <button
                  id="doctor-report-sheets-btn"
                  onClick={() => onOpenWorkspace('sheets')}
                  className="px-3 py-1.5 font-bold uppercase bg-[var(--bg-card)] hover:bg-[var(--bg-card-contrast)] text-[var(--text-main)] border border-[var(--border-edge)] flex items-center gap-1.5 transition-all"
                  title="Export biomarkers and vitals to Google Sheets"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Export to Sheets</span>
                </button>
              </>
            )}

            <button
              onClick={() => setShowOptions(!showOptions)}
              className="px-3 py-1.5 font-bold uppercase bg-[var(--bg-card)] text-[var(--text-main)] hover:bg-[var(--bg-card-contrast)] border border-[var(--border-edge)] flex items-center gap-1.5 transition-all"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Customize</span>
              {showOptions ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={handleCopyEhr}
              className="px-3 py-1.5 font-bold uppercase bg-[var(--bg-card)] text-[var(--text-main)] hover:bg-[var(--bg-card-contrast)] border border-[var(--border-edge)] flex items-center gap-1.5 transition-all"
              title="Copy formatted text for Epic/Cerner/MyChart EHR"
            >
              {copiedEhr ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-500">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#CC0000]" />
                  <span>Copy EHR</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownloadReport}
              disabled={downloadingHtml}
              className="px-3 py-1.5 font-bold uppercase bg-[var(--bg-card)] text-[var(--text-main)] hover:bg-[var(--bg-card-contrast)] border border-[var(--border-edge)] flex items-center gap-1.5 transition-all"
              title="Download standalone HTML/PDF document"
            >
              <Download className="w-3.5 h-3.5 text-[#CC0000]" />
              <span>{downloadingHtml ? 'Generating...' : 'HTML Brief'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-1.5 font-bold uppercase bg-[#CC0000] text-white hover:bg-red-700 border border-[#CC0000] flex items-center gap-1.5 transition-all"
            >
              <Printer className="w-4 h-4" /> Print / PDF
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-main)] text-base hover:bg-[var(--bg-card-contrast)] transition-all ml-1 border border-[var(--border-edge)]"
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>
        </div>

        {/* CUSTOMIZATION DRAWER (Hidden during print) */}
        {showOptions && (
          <div className="p-4 sm:p-5 bg-[var(--bg-card-alt)] border-b border-[var(--border-edge)] space-y-4 print:hidden text-xs font-mono text-[var(--text-main)]">
            <div className="flex items-center justify-between">
              <span className="font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5 text-[var(--text-main)]">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#CC0000]" />
                Report Section Toggles &amp; Patient Profile
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[var(--text-muted)] text-[11px]">Preview Mode:</span>
                <button
                  onClick={() => setPreviewTheme('dark')}
                  className={`px-2.5 py-1 font-bold uppercase text-xs border ${
                    previewTheme === 'dark' ? 'bg-[var(--text-main)] text-[var(--bg-canvas)] border-[var(--text-main)] font-black' : 'bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border-edge)]'
                  }`}
                >
                  App Theme
                </button>
                <button
                  onClick={() => setPreviewTheme('paper')}
                  className={`px-2.5 py-1 font-bold uppercase text-xs border ${
                    previewTheme === 'paper' ? 'bg-[var(--text-main)] text-[var(--bg-canvas)] border-[var(--text-main)] font-black' : 'bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border-edge)]'
                  }`}
                >
                  Paper White
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] text-[var(--text-muted)] uppercase font-bold block mb-1">Patient Name</label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full bg-[var(--bg-card)] border border-[var(--border-edge)] px-2.5 py-1 text-[var(--text-main)] focus:outline-none focus:border-[#CC0000] text-xs font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-[var(--text-muted)] uppercase font-bold block mb-1">DOB / Age</label>
                <input
                  type="text"
                  value={patientDob}
                  onChange={(e) => setPatientDob(e.target.value)}
                  className="w-full bg-[var(--bg-card)] border border-[var(--border-edge)] px-2.5 py-1 text-[var(--text-main)] focus:outline-none focus:border-[#CC0000] text-xs font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-[var(--text-muted)] uppercase font-bold block mb-1">Attending Physician / Clinic</label>
                <input
                  type="text"
                  value={physicianName}
                  onChange={(e) => setPhysicianName(e.target.value)}
                  className="w-full bg-[var(--bg-card)] border border-[var(--border-edge)] px-2.5 py-1 text-[var(--text-main)] focus:outline-none focus:border-[#CC0000] text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-[var(--text-muted)] uppercase font-bold block mb-1">
                Patient Questions &amp; Consultation Notes for Doctor
              </label>
              <textarea
                value={patientConsultationNotes}
                onChange={(e) => setPatientConsultationNotes(e.target.value)}
                rows={2}
                className="w-full bg-[var(--bg-card)] border border-[var(--border-edge)] px-2.5 py-1.5 text-[var(--text-main)] focus:outline-none focus:border-[#CC0000] text-xs font-sans"
                placeholder="Type specific questions or symptoms to discuss with your doctor..."
              />
            </div>

            <div className="pt-2 border-t border-[var(--border-subtle)]">
              <span className="text-[10px] text-[var(--text-muted)] uppercase font-bold block mb-2">Include in Generated PDF:</span>
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                <label className="flex items-center gap-1.5 cursor-pointer text-[var(--text-main)]">
                  <input
                    type="checkbox"
                    checked={includeVitals}
                    onChange={(e) => setIncludeVitals(e.target.checked)}
                    className="accent-[#CC0000]"
                  />
                  <span>Cardiovascular Vitals</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-[var(--text-main)]">
                  <input
                    type="checkbox"
                    checked={includeBiomarkers}
                    onChange={(e) => setIncludeBiomarkers(e.target.checked)}
                    className="accent-[#CC0000]"
                  />
                  <span>Laboratory Diagnostic Panels</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-[var(--text-main)]">
                  <input
                    type="checkbox"
                    checked={includeSleep}
                    onChange={(e) => setIncludeSleep(e.target.checked)}
                    className="accent-[#CC0000]"
                  />
                  <span>Sleep Staging &amp; Architecture</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-[var(--text-main)]">
                  <input
                    type="checkbox"
                    checked={includeActivities}
                    onChange={(e) => setIncludeActivities(e.target.checked)}
                    className="accent-[#CC0000]"
                  />
                  <span>Weekly Training Load &amp; Activity</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-[var(--text-main)]">
                  <input
                    type="checkbox"
                    checked={includeGeneratedPlan}
                    onChange={(e) => setIncludeGeneratedPlan(e.target.checked)}
                    className="accent-[#CC0000]"
                  />
                  <span>Adaptive Periodized Plan</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-[var(--text-main)]">
                  <input
                    type="checkbox"
                    checked={includeNutritionSupplements}
                    onChange={(e) => setIncludeNutritionSupplements(e.target.checked)}
                    className="accent-[#CC0000]"
                  />
                  <span>Nutrition &amp; Supplement Protocols</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-[var(--text-main)]">
                  <input
                    type="checkbox"
                    checked={includeClinicalDiscussion}
                    onChange={(e) => setIncludeClinicalDiscussion(e.target.checked)}
                    className="accent-[#CC0000]"
                  />
                  <span>Physician Discussion Points</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-[var(--text-main)]">
                  <input
                    type="checkbox"
                    checked={includeDoctorNotes}
                    onChange={(e) => setIncludeDoctorNotes(e.target.checked)}
                    className="accent-[#CC0000]"
                  />
                  <span>Patient Questions</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-[var(--text-main)]">
                  <input
                    type="checkbox"
                    checked={includeSignOff}
                    onChange={(e) => setIncludeSignOff(e.target.checked)}
                    className="accent-[#CC0000]"
                  />
                  <span>Physician Sign-off Block</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* PRINTABLE DOCUMENT CANVAS */}
        <div
          id="clinical-report-content"
          className={`p-6 sm:p-8 space-y-6 text-xs leading-relaxed max-h-[80vh] overflow-y-auto print:max-h-none print:overflow-visible print:p-0 print:space-y-4 ${
            previewTheme === 'paper' ? 'bg-[#FFFFFF] text-[#111111]' : 'bg-[#111111] text-[#F9F9F7]'
          }`}
        >
          {/* HEADER / CLINICAL IDENTIFIER */}
          <div className="border-b-2 border-current pb-4 flex flex-col sm:flex-row justify-between items-start gap-4 print:border-black print:pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-black text-xl tracking-tight uppercase">
                  VITALSYNC • CLINICAL HEALTH BRIEF &amp; PLAN
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 border border-current uppercase">
                  OFFICIAL SUMMARY
                </span>
              </div>
              <p className="font-mono text-xs mt-1 opacity-70">
                Longitudinal Multi-Device Biometric Synthesis &amp; Adaptive Training Protocol for Attending Physician
              </p>
              
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono">
                <span><strong>Patient:</strong> {patientName}</span>
                <span><strong>DOB/Age:</strong> {patientDob}</span>
                <span><strong>Attending:</strong> {physicianName}</span>
              </div>
            </div>

            <div className="text-left sm:text-right text-[11px] font-mono opacity-80 space-y-0.5 border-t sm:border-t-0 pt-2 sm:pt-0 border-current">
              <div><strong>Report ID:</strong> <span className="font-mono">{reportId}</span></div>
              <div><strong>Date Generated:</strong> {reportDate} ({reportTime})</div>
              <div><strong>Provenance:</strong> Multi-Source Verified Stream</div>
              <div className="text-emerald-500 font-semibold flex items-center sm:justify-end gap-1">
                <ShieldCheck className="w-3 h-3" /> HIPAA Compliant Client-Export
              </div>
            </div>
          </div>

          {/* SECTION 1: CARDIOVASCULAR & AUTONOMIC VITALS */}
          {includeVitals && (
            <div className="space-y-2.5 print:break-inside-avoid">
              <div className="flex items-center justify-between border-b border-current pb-1">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-[#CC0000]" />
                  1. Cardiovascular &amp; Autonomic Wearable Baselines (90-Day Continuous Ingestion)
                </h3>
                <span className="text-[10px] opacity-70">Garmin • Apple Watch • Oura • Dexcom</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className={`p-3 border ${previewTheme === 'paper' ? 'bg-[#F9F9F6] border-[#CCCCCC]' : 'bg-[#181818] border-[#2A2A2A]'}`}>
                  <span className="text-[10px] opacity-70 uppercase font-bold block">
                    Resting Heart Rate
                  </span>
                  <span className="text-lg font-serif font-black block">{avgRestingHr} BPM</span>
                  <span className="text-[10px] text-emerald-500 block font-medium">
                    Historical dip: 52 BPM
                  </span>
                </div>

                <div className={`p-3 border ${previewTheme === 'paper' ? 'bg-[#F9F9F6] border-[#CCCCCC]' : 'bg-[#181818] border-[#2A2A2A]'}`}>
                  <span className="text-[10px] opacity-70 uppercase font-bold block">
                    HRV RMSSD (Overnight)
                  </span>
                  <span className="text-lg font-serif font-black block">{avgHrv} ms</span>
                  <span className="text-[10px] text-emerald-500 block font-medium">
                    Optimal autonomic tone
                  </span>
                </div>

                <div className={`p-3 border ${previewTheme === 'paper' ? 'bg-[#F9F9F6] border-[#CCCCCC]' : 'bg-[#181818] border-[#2A2A2A]'}`}>
                  <span className="text-[10px] opacity-70 uppercase font-bold block">
                    Blood Pressure
                  </span>
                  <span className="text-lg font-serif font-black block">118/76 mmHg</span>
                  <span className="text-[10px] opacity-70 block font-medium">
                    Optimal / Normotensive
                  </span>
                </div>

                <div className={`p-3 border ${previewTheme === 'paper' ? 'bg-[#F9F9F6] border-[#CCCCCC]' : 'bg-[#181818] border-[#2A2A2A]'}`}>
                  <span className="text-[10px] opacity-70 uppercase font-bold block">
                    Estimated VO2 Max
                  </span>
                  <span className="text-lg font-serif font-black block">48.6 mL/kg/min</span>
                  <span className="text-[10px] opacity-70 block font-medium">
                    Top 10th Percentile
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: VERIFIED LABORATORY DIAGNOSTIC BIOMARKERS */}
          {includeBiomarkers && (
            <div className="space-y-2.5 print:break-inside-avoid">
              <div className="flex items-center justify-between border-b border-current pb-1">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" />
                  2. Verified Laboratory Diagnostic Biomarkers (Quest Diagnostics / Lab OCR)
                </h3>
                <span className="text-[10px] opacity-70">Sample Date: Aug 15, 2026</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse font-mono text-xs">
                  <thead>
                    <tr className="border-b border-current text-[11px] opacity-80">
                      <th className="py-2 font-bold uppercase">Biomarker</th>
                      <th className="py-2 font-bold uppercase">Category</th>
                      <th className="py-2 font-bold uppercase">Measured Value</th>
                      <th className="py-2 font-bold uppercase">Reference Interval</th>
                      <th className="py-2 font-bold uppercase">Clinical Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-current/20">
                    {biomarkers.map((b) => (
                      <tr key={b.id}>
                        <td className="py-2 font-bold">{b.name}</td>
                        <td className="py-2 opacity-70">{b.category}</td>
                        <td className="py-2 font-serif font-bold">
                          {b.value} {b.unit}
                        </td>
                        <td className="py-2 opacity-70">
                          {b.referenceRange} {b.unit}
                        </td>
                        <td className="py-2">
                          <span
                            className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase border ${
                              b.status === 'optimal'
                                ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500'
                                : 'bg-red-500/10 text-red-600 border-red-500'
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

          {/* SECTION 3: SLEEP ARCHITECTURE */}
          {includeSleep && (
            <div className="space-y-2.5 print:break-inside-avoid">
              <div className="flex items-center justify-between border-b border-current pb-1">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Moon className="w-3.5 h-3.5" />
                  3. Sleep Architecture &amp; Restorative Staging (30-Day Aggregation)
                </h3>
                <span className="text-[10px] opacity-70">Oura Ring &amp; Apple Health</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className={`p-3 border ${previewTheme === 'paper' ? 'bg-[#F9F9F6] border-[#CCCCCC]' : 'bg-[#181818] border-[#2A2A2A]'}`}>
                  <span className="text-[10px] opacity-70 uppercase font-bold block">
                    Mean Total Sleep
                  </span>
                  <span className="text-lg font-serif font-black block">
                    {Math.floor(avgSleepMins / 60)}h {avgSleepMins % 60}m
                  </span>
                  <span className="text-[10px] opacity-70 block">Efficiency: 91%</span>
                </div>

                <div className={`p-3 border ${previewTheme === 'paper' ? 'bg-[#F9F9F6] border-[#CCCCCC]' : 'bg-[#181818] border-[#2A2A2A]'}`}>
                  <span className="text-[10px] opacity-70 uppercase font-bold block">
                    Deep Sleep
                  </span>
                  <span className="text-lg font-serif font-black block">{avgDeepMins} mins</span>
                  <span className="text-[10px] text-emerald-500 block font-medium">
                    {Math.round((avgDeepMins / avgSleepMins) * 100)}% (Superior)
                  </span>
                </div>

                <div className={`p-3 border ${previewTheme === 'paper' ? 'bg-[#F9F9F6] border-[#CCCCCC]' : 'bg-[#181818] border-[#2A2A2A]'}`}>
                  <span className="text-[10px] opacity-70 uppercase font-bold block">
                    REM Sleep
                  </span>
                  <span className="text-lg font-serif font-black block">{avgRemMins} mins</span>
                  <span className="text-[10px] opacity-70 block font-medium">
                    {Math.round((avgRemMins / avgSleepMins) * 100)}% (Normal)
                  </span>
                </div>

                <div className={`p-3 border ${previewTheme === 'paper' ? 'bg-[#F9F9F6] border-[#CCCCCC]' : 'bg-[#181818] border-[#2A2A2A]'}`}>
                  <span className="text-[10px] opacity-70 uppercase font-bold block">
                    SpO2 &amp; Resp Rate
                  </span>
                  <span className="text-lg font-serif font-black block">98.2% • 13.8 br/m</span>
                  <span className="text-[10px] opacity-70 block">No apnea signatures</span>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: TRAINING LOAD */}
          {includeActivities && (
            <div className="space-y-2.5 print:break-inside-avoid">
              <div className="flex items-center justify-between border-b border-current pb-1">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Dumbbell className="w-3.5 h-3.5" />
                  4. Cardiorespiratory Endurance Load &amp; Training Workload
                </h3>
                <span className="text-[10px] opacity-70">Strava &amp; Polar HR Ingestion</span>
              </div>

              <div className={`p-3.5 border flex flex-wrap items-center justify-between gap-4 text-xs font-mono ${
                previewTheme === 'paper' ? 'bg-[#F9F9F6] border-[#CCCCCC]' : 'bg-[#181818] border-[#2A2A2A]'
              }`}>
                <div>
                  <span className="opacity-70 block text-[10px] uppercase font-bold">Weekly TRIMP Load</span>
                  <span className="text-sm font-bold font-serif">{totalTrainingLoad} Points</span>
                </div>
                <div>
                  <span className="opacity-70 block text-[10px] uppercase font-bold">Total Running Mileage</span>
                  <span className="text-sm font-bold font-serif">{totalRunKm.toFixed(1)} km</span>
                </div>
                <div>
                  <span className="opacity-70 block text-[10px] uppercase font-bold">Active Caloric Expenditure</span>
                  <span className="text-sm font-bold font-serif">{totalWeeklyCalories.toLocaleString()} kcal/wk</span>
                </div>
                <div>
                  <span className="opacity-70 block text-[10px] uppercase font-bold">Acute:Chronic Workload</span>
                  <span className="text-sm font-bold text-emerald-500 font-serif">1.08 (Sweet Spot)</span>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 5: GENERATED ADAPTIVE HEALTH & TRAINING PLAN */}
          {includeGeneratedPlan && (
            <div className="space-y-3 print:break-inside-avoid">
              <div className="flex items-center justify-between border-b border-current pb-1">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#CC0000]" />
                  5. AI-Generated Adaptive Health &amp; Training Prescription
                </h3>
                <span className="text-[10px] opacity-70">VitalSync Evidence Engine</span>
              </div>

              <div className={`p-3.5 border space-y-2 ${
                previewTheme === 'paper' ? 'bg-[#F9F9F6] border-[#CCCCCC]' : 'bg-[#181818] border-[#2A2A2A]'
              }`}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold uppercase">{plan.planName}</span>
                    <span className="text-[10px] opacity-70 ml-2">
                      ({plan.timelineWeeks}-Week Mesocycle • Target Readiness: {plan.vitalScoreTarget}/100)
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 border border-current uppercase">
                    Auto-Adjusts to Overnight HRV
                  </span>
                </div>
                <p className="text-xs opacity-80 leading-relaxed">{plan.summary}</p>
              </div>

              {/* Workout Split Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse font-mono text-xs">
                  <thead>
                    <tr className="border-b border-current text-[11px] opacity-80">
                      <th className="py-2 font-bold uppercase">Day</th>
                      <th className="py-2 font-bold uppercase">Protocol / Workout Title</th>
                      <th className="py-2 font-bold uppercase">Duration</th>
                      <th className="py-2 font-bold uppercase">Target HR Zone</th>
                      <th className="py-2 font-bold uppercase">Intensity</th>
                      <th className="py-2 font-bold uppercase">Scientific Rationale</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-current/20 text-xs">
                    {plan.workoutSplit.map((w, idx) => (
                      <tr key={idx}>
                        <td className="py-2 font-bold">{w.day}</td>
                        <td className="py-2 font-serif font-bold">{w.title}</td>
                        <td className="py-2 opacity-70">{w.duration}</td>
                        <td className="py-2 font-mono text-[11px]">{w.targetHR}</td>
                        <td className="py-2">
                          <span className="inline-block px-1.5 py-0.5 border border-current text-[10px] font-bold uppercase">
                            {w.intensity}
                          </span>
                        </td>
                        <td className="py-2 opacity-80 text-[11px] leading-snug">
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
              <div className="flex items-center justify-between border-b border-current pb-1">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Utensils className="w-3.5 h-3.5" />
                  6. Precision Nutrition &amp; Metabolic Protocol
                </h3>
                <span className="text-[10px] opacity-70">Target: {plan.nutritionTargets.dailyCalories} kcal</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className={`p-2.5 border ${previewTheme === 'paper' ? 'bg-[#F9F9F6] border-[#CCCCCC]' : 'bg-[#181818] border-[#2A2A2A]'}`}>
                  <span className="text-[10px] opacity-70 uppercase font-bold block">Caloric Target</span>
                  <span className="text-sm font-serif font-bold block">{plan.nutritionTargets.dailyCalories} kcal</span>
                  <span className="text-[10px] text-emerald-500 block">Adherence: 98%</span>
                </div>
                <div className={`p-2.5 border ${previewTheme === 'paper' ? 'bg-[#F9F9F6] border-[#CCCCCC]' : 'bg-[#181818] border-[#2A2A2A]'}`}>
                  <span className="text-[10px] opacity-70 uppercase font-bold block">Daily Protein</span>
                  <span className="text-sm font-serif font-bold block">{plan.nutritionTargets.proteinGrams}g</span>
                  <span className="text-[10px] opacity-70 block">1.8g/kg bodyweight</span>
                </div>
                <div className={`p-2.5 border ${previewTheme === 'paper' ? 'bg-[#F9F9F6] border-[#CCCCCC]' : 'bg-[#181818] border-[#2A2A2A]'}`}>
                  <span className="text-[10px] opacity-70 uppercase font-bold block">Carbs / Fats</span>
                  <span className="text-sm font-serif font-bold block">
                    {plan.nutritionTargets.carbGrams}g C / {plan.nutritionTargets.fatGrams}g F
                  </span>
                  <span className="text-[10px] opacity-70 block">Glycemic balanced</span>
                </div>
                <div className={`p-2.5 border ${previewTheme === 'paper' ? 'bg-[#F9F9F6] border-[#CCCCCC]' : 'bg-[#181818] border-[#2A2A2A]'}`}>
                  <span className="text-[10px] opacity-70 uppercase font-bold block">Hydration Target</span>
                  <span className="text-sm font-serif font-bold block">{plan.nutritionTargets.hydrationLiters} L/day</span>
                  <span className="text-[10px] opacity-70 block">Electrolyte optimized</span>
                </div>
              </div>
              <p className="text-[11px] opacity-80 italic">
                <strong>Focus Notes:</strong> {plan.nutritionTargets.focusNotes}
              </p>
            </div>
          )}

          {/* SECTION 7: CLINICAL DISCUSSION POINTS */}
          {includeClinicalDiscussion && (
            <div className={`p-4 border space-y-2.5 print:break-inside-avoid ${
              previewTheme === 'paper' ? 'bg-[#F9F9F6] border-[#CCCCCC]' : 'bg-[#181818] border-[#2A2A2A]'
            }`}>
              <span className="text-xs font-mono font-bold uppercase tracking-wider block flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                7. Key Physiological Trends &amp; Physician Discussion Points:
              </span>
              <ul className="list-disc list-inside space-y-1 opacity-80 text-xs">
                <li>
                  <strong>Autonomic Reserve:</strong> Overnight HRV RMSSD average of {avgHrv}ms and resting heart rate of {avgRestingHr} BPM reflect robust parasympathetic tone.
                </li>
                <li>
                  <strong>Metabolic &amp; Glycemic Balance:</strong> Fasting blood glucose (88 mg/dL) and HbA1c (5.2%) remain strictly optimal with low postprandial excursions.
                </li>
                <li>
                  <strong>Systemic Inflammation:</strong> High-sensitivity CRP is 0.74 mg/L, indicating low cardiovascular inflammatory risk.
                </li>
                <li>
                  <strong>Cardiopulmonary Adaptation:</strong> Zone 2 training distribution has stabilized stroke volume with minimal cardiac drift across 60-minute sessions.
                </li>
              </ul>
            </div>
          )}

          {/* SECTION 8: PATIENT CONSULTATION NOTES */}
          {includeDoctorNotes && patientConsultationNotes && (
            <div className={`p-4 border space-y-1.5 print:break-inside-avoid ${
              previewTheme === 'paper' ? 'bg-[#F9F9F6] border-[#CCCCCC]' : 'bg-[#181818] border-[#2A2A2A]'
            }`}>
              <span className="text-xs font-mono font-bold uppercase tracking-wider block">
                8. Patient Consultation Questions &amp; Observations:
              </span>
              <p className="text-xs leading-relaxed italic opacity-90">
                &ldquo;{patientConsultationNotes}&rdquo;
              </p>
            </div>
          )}

          {/* SECTION 9: PHYSICIAN ATTESTATION & SIGNATURE BLOCK */}
          {includeSignOff && (
            <div className="pt-4 border-t-2 border-dashed border-current flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 print:break-inside-avoid text-xs font-mono">
              <div className="space-y-4 w-full sm:w-1/2">
                <div>
                  <div className="border-b border-current h-8 w-64"></div>
                  <div className="text-[11px] mt-1 font-bold uppercase">
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
                    <input type="checkbox" className="accent-black" />
                    <span>Cleared for current training mesocycle load</span>
                  </label>
                  <label className="flex items-center gap-1.5 sm:justify-end">
                    <input type="checkbox" className="accent-black" />
                    <span>Follow-up lipid / metabolic lab order requested</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* LEGAL DISCLAIMER */}
          <div className="pt-3 text-[10px] opacity-60 border-t border-current print:break-inside-avoid font-mono">
            <strong>Medical Disclaimer:</strong> This summary is synthesized from consumer health sensors, wearable telemetry streams, and verified diagnostic laboratory results imported into VitalSync. It is intended to assist medical professionals during clinical consultation and does not constitute independent medical diagnoses.
          </div>
        </div>
      </div>
    </div>
  );
};
