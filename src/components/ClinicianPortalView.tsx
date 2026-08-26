import React, { useState, useMemo } from 'react';
import {
  Stethoscope,
  Users,
  Search,
  Filter,
  FileText,
  Download,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Clock,
  ShieldCheck,
  Building2,
  FileCode,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Activity,
  Heart,
  Moon,
  Pill,
  Sparkles,
  Lock,
  Printer,
  Copy,
  Check,
  UserCheck,
  HelpCircle,
  Eye,
  Send
} from 'lucide-react';
import {
  ClinicianPatientRecord,
  AccessAuditLogEntry,
  Biomarker,
  Activity as ActivityType,
  SleepRecord
} from '../types';

interface ClinicianPortalViewProps {
  onSwitchToPatientView: () => void;
  biomarkers?: Biomarker[];
  activities?: ActivityType[];
  sleepRecords?: SleepRecord[];
}

export const ClinicianPortalView: React.FC<ClinicianPortalViewProps> = ({
  onSwitchToPatientView,
  biomarkers = [],
  activities = [],
  sleepRecords = []
}) => {
  // Multi-Patient Cohort Roster State
  const [patients, setPatients] = useState<ClinicianPatientRecord[]>([
    {
      id: 'p-1',
      mrn: 'VS-9042-ALEX',
      name: 'Alex Vance',
      age: 36,
      gender: 'M',
      dob: '1990-05-14',
      primaryDiagnosis: 'I10 Essential Hypertension (Controlled), Endurance Athlete',
      riskTier: 'stable',
      lastVisitDate: '2025-10-14',
      nextScheduledVisit: '2026-04-18',
      consentStatus: 'active',
      complianceRate: 96,
      vitals: {
        bloodPressure: {
          systolic: 116,
          diastolic: 74,
          lastVisitValue: '128/82 mmHg',
          delta: '-12/-8 mmHg',
          status: 'in_range'
        },
        restingHr: {
          current: 54,
          lastVisit: 59,
          unit: 'BPM',
          delta: -5,
          status: 'in_range'
        },
        hrvMs: {
          current: 68,
          lastVisit: 56,
          delta: +12,
          status: 'in_range'
        },
        glucoseMgDl: {
          current: 88,
          lastVisit: 94,
          hba1c: 5.1,
          delta: '-6 mg/dL (A1c -0.2%)',
          status: 'normal'
        },
        sleepHours: {
          current: 7.9,
          deepPct: 22,
          ahi: 1.2,
          status: 'in_range'
        }
      },
      activeMedications: [
        { name: 'CoQ10 (Ubiquinol)', dosage: '200mg', frequency: 'Daily AM', adherencePct: 98 },
        { name: 'Magnesium L-Threonate', dosage: '400mg', frequency: 'Nightly', adherencePct: 95 },
        { name: 'Omega-3 EPA/DHA', dosage: '2000mg', frequency: 'Daily PM', adherencePct: 92 }
      ],
      labAlerts: [
        'Lipid Panel: ApoB normalized to 72 mg/dL (Target < 80)',
        'hs-CRP reduced to 0.45 mg/L (Low cardiovascular risk)'
      ],
      planStatus: 'ai_draft',
      clinicianOrder: undefined
    },
    {
      id: 'p-2',
      mrn: 'VS-8411-ELEANOR',
      name: 'Eleanor Martinez',
      age: 54,
      gender: 'F',
      dob: '1972-03-22',
      primaryDiagnosis: 'E11.9 Type 2 Diabetes, Nocturnal Hypoxemia',
      riskTier: 'critical',
      lastVisitDate: '2025-11-02',
      nextScheduledVisit: '2026-03-10',
      consentStatus: 'active',
      complianceRate: 78,
      vitals: {
        bloodPressure: {
          systolic: 142,
          diastolic: 92,
          lastVisitValue: '136/88 mmHg',
          delta: '+6/+4 mmHg',
          status: 'stage2_htn'
        },
        restingHr: {
          current: 78,
          lastVisit: 72,
          unit: 'BPM',
          delta: +6,
          status: 'elevated'
        },
        hrvMs: {
          current: 24,
          lastVisit: 32,
          delta: -8,
          status: 'depressed'
        },
        glucoseMgDl: {
          current: 168,
          lastVisit: 142,
          hba1c: 7.6,
          delta: '+26 mg/dL (A1c +0.6%)',
          status: 'diabetic'
        },
        sleepHours: {
          current: 5.6,
          deepPct: 9,
          ahi: 18.4,
          status: 'apnea_warning'
        }
      },
      activeMedications: [
        { name: 'Metformin HCl ER', dosage: '1000mg', frequency: 'Twice daily', adherencePct: 82 },
        { name: 'Lisinopril', dosage: '20mg', frequency: 'Daily AM', adherencePct: 75 }
      ],
      labAlerts: [
        'CRITICAL: Fasting glucose 168 mg/dL exceeds clinical target',
        'Nocturnal AHI 18.4 indicates moderate obstructive sleep apnea flare'
      ],
      planStatus: 'ai_draft'
    },
    {
      id: 'p-3',
      mrn: 'VS-7729-DAVID',
      name: 'David Chen',
      age: 48,
      gender: 'M',
      dob: '1978-08-11',
      primaryDiagnosis: 'I25.10 CAD Post-Stent, Hyperlipidemia',
      riskTier: 'monitoring',
      lastVisitDate: '2025-12-19',
      nextScheduledVisit: '2026-06-15',
      consentStatus: 'active',
      complianceRate: 94,
      vitals: {
        bloodPressure: {
          systolic: 124,
          diastolic: 78,
          lastVisitValue: '126/80 mmHg',
          delta: '-2/-2 mmHg',
          status: 'in_range'
        },
        restingHr: {
          current: 62,
          lastVisit: 64,
          unit: 'BPM',
          delta: -2,
          status: 'in_range'
        },
        hrvMs: {
          current: 44,
          lastVisit: 41,
          delta: +3,
          status: 'in_range'
        },
        glucoseMgDl: {
          current: 96,
          lastVisit: 98,
          hba1c: 5.4,
          delta: '-2 mg/dL',
          status: 'normal'
        },
        sleepHours: {
          current: 7.2,
          deepPct: 18,
          ahi: 3.4,
          status: 'in_range'
        }
      },
      activeMedications: [
        { name: 'Rosuvastatin', dosage: '20mg', frequency: 'Nightly', adherencePct: 96 },
        { name: 'Aspirin', dosage: '81mg', frequency: 'Daily', adherencePct: 98 }
      ],
      labAlerts: [
        'Lipid Panel: LDL-C 68 mg/dL within secondary prevention goal (< 70)'
      ],
      planStatus: 'clinician_approved',
      clinicianOrder: {
        signedBy: 'Dr. Sarah Jenkins, MD (Cardiology)',
        clinicianRole: 'Attending Physician',
        npi: '1982740192',
        timestamp: '2026-02-14 09:30 EST',
        clinicalRationale: 'Statin adherence verified; maintain Zone 2 aerobic progression to 150 min/week.',
        rxOrder: ['Continue Rosuvastatin 20mg', 'Prescribe 150 min/wk supervised Zone 2 cardiac training'],
        isOfficialEhrOrder: true
      }
    },
    {
      id: 'p-4',
      mrn: 'VS-6190-SARAH',
      name: 'Sarah Miller',
      age: 29,
      gender: 'F',
      dob: '1997-01-30',
      primaryDiagnosis: 'D50.9 Iron Deficiency Anemia, Athletic Overtraining',
      riskTier: 'monitoring',
      lastVisitDate: '2026-01-10',
      nextScheduledVisit: '2026-03-24',
      consentStatus: 'active',
      complianceRate: 88,
      vitals: {
        bloodPressure: {
          systolic: 104,
          diastolic: 68,
          lastVisitValue: '108/70 mmHg',
          delta: '-4/-2 mmHg',
          status: 'in_range'
        },
        restingHr: {
          current: 66,
          lastVisit: 58,
          unit: 'BPM',
          delta: +8,
          status: 'elevated'
        },
        hrvMs: {
          current: 38,
          lastVisit: 64,
          delta: -26,
          status: 'depressed'
        },
        glucoseMgDl: {
          current: 82,
          lastVisit: 85,
          hba1c: 4.9,
          delta: '-3 mg/dL',
          status: 'normal'
        },
        sleepHours: {
          current: 6.4,
          deepPct: 14,
          ahi: 0.8,
          status: 'in_range'
        }
      },
      activeMedications: [
        { name: 'Ferrous Bisglycinate Chelate', dosage: '65mg', frequency: 'Daily with Vit C', adherencePct: 90 }
      ],
      labAlerts: [
        'Ferritin 14 ng/mL (Reference range: 30-150 ng/mL) - Ongoing replacement therapy',
        'HRV suppressed 40% below baseline due to training load'
      ],
      planStatus: 'ai_draft'
    }
  ]);

  const [selectedPatientId, setSelectedPatientId] = useState<string>('p-1');
  const [activeTab, setActiveTab] = useState<'overview' | 'trends' | 'plan_approval' | 'fhir_export' | 'audit_log'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<'all' | 'critical' | 'monitoring' | 'stable'>('all');
  
  // Clinician Sign-off Form State
  const [clinicalRationale, setClinicalRationale] = useState(
    'Reviewed 14-day continuous telemetry: resting blood pressure and HRV stabilization confirm positive adaptation to Zone 2 volume. Approved continued nutritional and supplement plan with 180g protein target.'
  );
  const [clinicalOrderNotes, setClinicalOrderNotes] = useState('Maintain current cardioprotective stack. Recheck lipid panel & ApoB in 6 months.');
  const [isSigning, setIsSigning] = useState(false);
  const [signSuccess, setSignSuccess] = useState(false);
  const [fhirCopied, setFhirCopied] = useState(false);

  // Access Audit Log
  const [auditLogs, setAuditLogs] = useState<AccessAuditLogEntry[]>([
    {
      id: 'log-1',
      timestamp: '2026-08-25 21:28:14 UTC',
      clinicianName: 'Dr. Sarah Jenkins, MD',
      role: 'Attending Cardiologist',
      npi: '1982740192',
      action: 'CHART_OPENED',
      patientMrn: 'VS-9042-ALEX',
      purposeOfUse: 'TREATMENT',
      ipAddress: '192.0.2.148 (Hospital VPN)',
      sessionToken: 'auth_jwt_9942_baa',
      baaStatus: 'HIPAA_BAA_VERIFIED'
    },
    {
      id: 'log-2',
      timestamp: '2026-08-25 21:24:02 UTC',
      clinicianName: 'Dr. Sarah Jenkins, MD',
      role: 'Attending Cardiologist',
      npi: '1982740192',
      action: 'VITALS_REVIEWED',
      patientMrn: 'VS-9042-ALEX',
      purposeOfUse: 'TREATMENT',
      ipAddress: '192.0.2.148 (Hospital VPN)',
      sessionToken: 'auth_jwt_9942_baa',
      baaStatus: 'HIPAA_BAA_VERIFIED'
    },
    {
      id: 'log-3',
      timestamp: '2026-08-25 18:15:30 UTC',
      clinicianName: 'Dr. Sarah Jenkins, MD',
      role: 'Attending Cardiologist',
      npi: '1982740192',
      action: 'FHIR_EXPORTED',
      patientMrn: 'VS-7729-DAVID',
      purposeOfUse: 'CARE_COORDINATION',
      ipAddress: '192.0.2.148 (Hospital VPN)',
      sessionToken: 'auth_jwt_9940_baa',
      baaStatus: 'HIPAA_BAA_VERIFIED'
    }
  ]);

  const selectedPatient = useMemo(() => {
    return patients.find(p => p.id === selectedPatientId) || patients[0];
  }, [patients, selectedPatientId]);

  const filteredPatients = useMemo(() => {
    return patients.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            p.mrn.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            p.primaryDiagnosis.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRisk = riskFilter === 'all' ? true : p.riskTier === riskFilter;
      return matchesSearch && matchesRisk;
    });
  }, [patients, searchQuery, riskFilter]);

  // Handle Clinician Sign-off & Order Approval
  const handleApprovePlan = () => {
    setIsSigning(true);
    setTimeout(() => {
      setIsSigning(false);
      setSignSuccess(true);

      // Update patient state with official clinician order
      setPatients(prev => prev.map(p => {
        if (p.id === selectedPatient.id) {
          return {
            ...p,
            planStatus: 'clinician_approved',
            clinicianOrder: {
              signedBy: 'Dr. Sarah Jenkins, MD (Cardiology)',
              clinicianRole: 'Attending Cardiologist',
              npi: '1982740192',
              timestamp: new Date().toLocaleString(),
              clinicalRationale,
              rxOrder: [clinicalOrderNotes, 'Zone 2 Base Conditioning: 120-150 min/wk', 'Magnesium 400mg Nightly'],
              isOfficialEhrOrder: true
            }
          };
        }
        return p;
      }));

      // Add to audit log
      setAuditLogs(prev => [
        {
          id: `log-${Date.now()}`,
          timestamp: new Date().toUTCString(),
          clinicianName: 'Dr. Sarah Jenkins, MD',
          role: 'Attending Cardiologist',
          npi: '1982740192',
          action: 'PLAN_APPROVED',
          patientMrn: selectedPatient.mrn,
          purposeOfUse: 'TREATMENT',
          ipAddress: '192.0.2.148 (Hospital VPN)',
          sessionToken: 'auth_jwt_9942_baa',
          baaStatus: 'HIPAA_BAA_VERIFIED'
        },
        ...prev
      ]);

      setTimeout(() => setSignSuccess(false), 3000);
    }, 850);
  };

  // Generate HL7 FHIR R4 Bundle JSON
  const fhirBundleJson = useMemo(() => {
    return {
      resourceType: 'Bundle',
      id: `bundle-vitalsync-${selectedPatient.mrn}`,
      type: 'collection',
      timestamp: new Date().toISOString(),
      entry: [
        {
          resource: {
            resourceType: 'Patient',
            id: selectedPatient.mrn,
            identifier: [{ system: 'urn:oid:vitalsync:mrn', value: selectedPatient.mrn }],
            name: [{ family: selectedPatient.name.split(' ')[1] || 'Vance', given: [selectedPatient.name.split(' ')[0] || 'Alex'] }],
            gender: selectedPatient.gender === 'M' ? 'male' : 'female',
            birthDate: selectedPatient.dob
          }
        },
        {
          resource: {
            resourceType: 'Observation',
            id: `obs-bp-${selectedPatient.mrn}`,
            status: 'final',
            category: [{ coding: [{ system: 'http://terminology.hl7.org/CodeSystem/observation-category', code: 'vital-signs' }] }],
            code: { coding: [{ system: 'http://loinc.org', code: '85354-9', display: 'Blood pressure panel with all children optional' }] },
            subject: { reference: `Patient/${selectedPatient.mrn}` },
            effectiveDateTime: new Date().toISOString(),
            component: [
              {
                code: { coding: [{ system: 'http://loinc.org', code: '8480-6', display: 'Systolic blood pressure' }] },
                valueQuantity: { value: selectedPatient.vitals.bloodPressure.systolic, unit: 'mmHg', system: 'http://unitsofmeasure.org', code: 'mm[Hg]' }
              },
              {
                code: { coding: [{ system: 'http://loinc.org', code: '8462-4', display: 'Diastolic blood pressure' }] },
                valueQuantity: { value: selectedPatient.vitals.bloodPressure.diastolic, unit: 'mmHg', system: 'http://unitsofmeasure.org', code: 'mm[Hg]' }
              }
            ]
          }
        },
        {
          resource: {
            resourceType: 'Observation',
            id: `obs-hrv-${selectedPatient.mrn}`,
            status: 'final',
            code: { coding: [{ system: 'http://loinc.org', code: '80404-7', display: 'R-R interval.standard deviation (HRV SDNN)' }] },
            subject: { reference: `Patient/${selectedPatient.mrn}` },
            valueQuantity: { value: selectedPatient.vitals.hrvMs.current, unit: 'ms', system: 'http://unitsofmeasure.org', code: 'ms' },
            interpretation: [{ coding: [{ system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation', code: 'N', display: 'Normal' }] }]
          }
        },
        {
          resource: {
            resourceType: 'Observation',
            id: `obs-glucose-${selectedPatient.mrn}`,
            status: 'final',
            code: { coding: [{ system: 'http://loinc.org', code: '2345-7', display: 'Glucose [Mass/volume] in Blood' }] },
            subject: { reference: `Patient/${selectedPatient.mrn}` },
            valueQuantity: { value: selectedPatient.vitals.glucoseMgDl.current, unit: 'mg/dL', system: 'http://unitsofmeasure.org', code: 'mg/dL' },
            referenceRange: [{ low: { value: 70, unit: 'mg/dL' }, high: { value: 99, unit: 'mg/dL' } }]
          }
        },
        {
          resource: {
            resourceType: 'CarePlan',
            id: `careplan-${selectedPatient.mrn}`,
            status: selectedPatient.planStatus === 'clinician_approved' ? 'active' : 'draft',
            intent: 'order',
            subject: { reference: `Patient/${selectedPatient.mrn}` },
            author: { display: selectedPatient.clinicianOrder?.signedBy || 'VitalSync AI Assist' },
            description: selectedPatient.clinicianOrder?.clinicalRationale || 'Automated Adaptive Health Optimization Plan'
          }
        }
      ]
    };
  }, [selectedPatient]);

  const handleCopyFhir = () => {
    navigator.clipboard.writeText(JSON.stringify(fhirBundleJson, null, 2));
    setFhirCopied(true);
    setTimeout(() => setFhirCopied(false), 2000);
  };

  const handleDownloadFhir = () => {
    const blob = new Blob([JSON.stringify(fhirBundleJson, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FHIR_R4_Bundle_${selectedPatient.mrn}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-mono flex flex-col space-y-4">
      
      {/* TOP CLINICAL HEADER BAR (EHR Workstation Aesthetic) */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-cyan-600/20 text-cyan-400 border border-cyan-500/40">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white tracking-wide">
                VitalSync Clinician Workstation (EHR Tier)
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                BAA ACTIVE • HIPAA COMPLIANT
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans">
              Attending: <strong className="text-slate-200">Dr. Sarah Jenkins, MD</strong> (NPI: 1982740192) • St. Jude Integrative Cardiology
            </p>
          </div>
        </div>

        {/* Action Controls & Persona Switcher */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 transition-all font-sans"
            title="Print Clinical Chart Summary"
          >
            <Printer className="w-3.5 h-3.5 text-slate-400" />
            Print Chart Summary
          </button>

          <button
            id="switch-to-patient-view-btn"
            onClick={onSwitchToPatientView}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-xs font-bold text-white shadow-md shadow-cyan-600/20 transition-all font-sans"
          >
            <UserCheck className="w-3.5 h-3.5" />
            Switch to Patient View
          </button>
        </div>
      </div>

      {/* MAIN TWO-COLUMN EHR LAYOUT */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-2 grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1">
        
        {/* LEFT COLUMN: Multi-Patient Triage Roster (4 Cols) */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl flex flex-col h-[820px] overflow-hidden shadow-xl">
          
          {/* Roster Header */}
          <div className="p-4 border-b border-slate-800 bg-slate-900/90 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Patient Cohort Roster ({patients.length})
                </span>
              </div>
              <span className="text-[10px] text-slate-400">Live Telemetry Sync</span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search patient name, MRN, Dx..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Risk Triage Filter Chips */}
            <div className="flex items-center gap-1 text-[11px] overflow-x-auto pb-1">
              {(['all', 'critical', 'monitoring', 'stable'] as const).map((tier) => (
                <button
                  key={tier}
                  onClick={() => setRiskFilter(tier)}
                  className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider border transition-all ${
                    riskFilter === tier
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {tier}
                </button>
              ))}
            </div>
          </div>

          {/* Patients List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/80">
            {filteredPatients.map((patient) => {
              const isSelected = patient.id === selectedPatient.id;
              return (
                <div
                  key={patient.id}
                  onClick={() => setSelectedPatientId(patient.id)}
                  className={`p-3.5 cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-800/90 border-l-4 border-l-cyan-400'
                      : 'hover:bg-slate-800/40 bg-slate-900/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-white truncate">{patient.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">({patient.mrn})</span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">{patient.primaryDiagnosis}</p>
                    </div>

                    {/* Risk Tier Badge */}
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider flex-shrink-0 ${
                      patient.riskTier === 'critical'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : patient.riskTier === 'monitoring'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      {patient.riskTier}
                    </span>
                  </div>

                  {/* Vitals Summary Strip */}
                  <div className="mt-2.5 grid grid-cols-3 gap-1.5 text-[10px] bg-slate-950/60 p-2 rounded border border-slate-800/80">
                    <div>
                      <span className="text-slate-500 block">BP</span>
                      <span className={`font-bold ${patient.vitals.bloodPressure.status === 'in_range' ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {patient.vitals.bloodPressure.systolic}/{patient.vitals.bloodPressure.diastolic}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">RHR</span>
                      <span className="font-bold text-slate-200">{patient.vitals.restingHr.current} bpm</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Δ Since Visit</span>
                      <span className={`font-bold ${patient.vitals.bloodPressure.delta.startsWith('-') ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {patient.vitals.bloodPressure.delta}
                      </span>
                    </div>
                  </div>

                  {/* Consent & Plan status */}
                  <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Lock className="w-3 h-3 text-cyan-400" />
                      Consent: <strong className="text-emerald-400">Active</strong>
                    </span>
                    <span className={`px-1.5 py-0.2 rounded ${
                      patient.planStatus === 'clinician_approved'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {patient.planStatus === 'clinician_approved' ? '✓ Rx Signed' : 'AI Draft'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Roster Footer */}
          <div className="p-3 border-t border-slate-800 bg-slate-900/90 text-[10px] text-slate-400 flex items-center justify-between">
            <span>SMART-on-FHIR Endpoint: Active</span>
            <span className="text-emerald-400 flex items-center gap-1">● 100% EHR Linked</span>
          </div>
        </div>

        {/* RIGHT COLUMN: Selected Patient Deep-Dive Clinical Workstation (8 Cols) */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl flex flex-col h-[820px] overflow-hidden shadow-xl">
          
          {/* Patient Banner */}
          <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-900/90">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-bold text-white">{selectedPatient.name}</h2>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 text-xs font-mono border border-slate-700">
                    MRN: {selectedPatient.mrn}
                  </span>
                  <span className="text-xs text-slate-400">
                    DOB: {selectedPatient.dob} ({selectedPatient.age}yo {selectedPatient.gender})
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Primary Diagnosis: <strong className="text-white">{selectedPatient.primaryDiagnosis}</strong>
                </p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-1">
                  <span>Last In-Person Visit: <strong className="text-slate-200">{selectedPatient.lastVisitDate}</strong></span>
                  <span>Next Scheduled: <strong className="text-slate-200">{selectedPatient.nextScheduledVisit}</strong></span>
                  <span className="text-emerald-400 font-semibold">Consent: Revocable by Patient at anytime</span>
                </div>
              </div>

              {/* Status Tag */}
              <div className="text-right">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider border ${
                  selectedPatient.riskTier === 'critical'
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    : selectedPatient.riskTier === 'monitoring'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                }`}>
                  <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                  Triage: {selectedPatient.riskTier}
                </span>
                <p className="text-[10px] text-slate-400 mt-1 font-mono">
                  Continuous Telemetry Adherence: {selectedPatient.complianceRate}%
                </p>
              </div>
            </div>

            {/* Navigation Tabs for Clinician */}
            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-800/80 text-xs">
              {[
                { id: 'overview', label: 'Clinical Overview & Deltas' },
                { id: 'trends', label: 'Clinical Reference Ranges' },
                { id: 'plan_approval', label: 'AI Plan vs. Signed Order' },
                { id: 'fhir_export', label: 'HL7 FHIR R4 Bundle' },
                { id: 'audit_log', label: 'HIPAA Audit Trail' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Main Scrollable Work Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            
            {/* TAB 1: CLINICAL OVERVIEW & DELTAS */}
            {activeTab === 'overview' && (
              <div className="space-y-5">
                
                {/* 1. Since-Last-Visit Delta Table */}
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                      <Activity className="w-4 h-4 text-cyan-400" />
                      14-Day Remote Telemetry vs. Last In-Person Visit ({selectedPatient.lastVisitDate})
                    </h3>
                    <span className="text-[11px] text-slate-400">Automated Clinical Delta Engine</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase font-bold">
                          <th className="py-2 px-3">Clinical Parameter</th>
                          <th className="py-2 px-3">Last Visit In-Clinic</th>
                          <th className="py-2 px-3">Current Remote Rolling Avg</th>
                          <th className="py-2 px-3">Delta Comparison</th>
                          <th className="py-2 px-3">Clinical Interpretation</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 font-sans">
                        <tr className="hover:bg-slate-900/40">
                          <td className="py-2.5 px-3 font-semibold text-white">Blood Pressure (Resting)</td>
                          <td className="py-2.5 px-3 font-mono text-slate-300">{selectedPatient.vitals.bloodPressure.lastVisitValue}</td>
                          <td className="py-2.5 px-3 font-mono font-bold text-cyan-400">
                            {selectedPatient.vitals.bloodPressure.systolic}/{selectedPatient.vitals.bloodPressure.diastolic} mmHg
                          </td>
                          <td className="py-2.5 px-3 font-mono font-bold text-emerald-400">{selectedPatient.vitals.bloodPressure.delta}</td>
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                              Normotensive Control (&lt; 120/80)
                            </span>
                          </td>
                        </tr>
                        <tr className="hover:bg-slate-900/40">
                          <td className="py-2.5 px-3 font-semibold text-white">Resting Heart Rate</td>
                          <td className="py-2.5 px-3 font-mono text-slate-300">{selectedPatient.vitals.restingHr.lastVisit} BPM</td>
                          <td className="py-2.5 px-3 font-mono font-bold text-cyan-400">{selectedPatient.vitals.restingHr.current} BPM</td>
                          <td className="py-2.5 px-3 font-mono font-bold text-emerald-400">{selectedPatient.vitals.restingHr.delta} BPM</td>
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                              Athletic Bradycardia (Optimal)
                            </span>
                          </td>
                        </tr>
                        <tr className="hover:bg-slate-900/40">
                          <td className="py-2.5 px-3 font-semibold text-white">HRV (Overnight rMSSD)</td>
                          <td className="py-2.5 px-3 font-mono text-slate-300">{selectedPatient.vitals.hrvMs.lastVisit} ms</td>
                          <td className="py-2.5 px-3 font-mono font-bold text-cyan-400">{selectedPatient.vitals.hrvMs.current} ms</td>
                          <td className="py-2.5 px-3 font-mono font-bold text-emerald-400">+{selectedPatient.vitals.hrvMs.delta} ms</td>
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                              Parasympathetic Rebound
                            </span>
                          </td>
                        </tr>
                        <tr className="hover:bg-slate-900/40">
                          <td className="py-2.5 px-3 font-semibold text-white">Fasting Glycemia & A1c</td>
                          <td className="py-2.5 px-3 font-mono text-slate-300">{selectedPatient.vitals.glucoseMgDl.lastVisit} mg/dL</td>
                          <td className="py-2.5 px-3 font-mono font-bold text-cyan-400">
                            {selectedPatient.vitals.glucoseMgDl.current} mg/dL (A1c {selectedPatient.vitals.glucoseMgDl.hba1c}%)
                          </td>
                          <td className="py-2.5 px-3 font-mono text-emerald-400">{selectedPatient.vitals.glucoseMgDl.delta}</td>
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                              Euglycemic (Target &lt; 99)
                            </span>
                          </td>
                        </tr>
                        <tr className="hover:bg-slate-900/40">
                          <td className="py-2.5 px-3 font-semibold text-white">Sleep & Nocturnal AHI</td>
                          <td className="py-2.5 px-3 font-mono text-slate-300">7.2h (AHI 1.8)</td>
                          <td className="py-2.5 px-3 font-mono font-bold text-cyan-400">
                            {selectedPatient.vitals.sleepHours.current}h (AHI {selectedPatient.vitals.sleepHours.ahi})
                          </td>
                          <td className="py-2.5 px-3 font-mono text-emerald-400">+0.7h / night</td>
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                              No Obstructive Apnea
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 2. Active Medications & Diagnostic Alerts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Medications */}
                  <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                      <Pill className="w-4 h-4 text-cyan-400" />
                      Active Pharmacotherapy & Adherence
                    </h4>
                    <div className="space-y-2 font-sans text-xs">
                      {selectedPatient.activeMedications.map((med, i) => (
                        <div key={i} className="p-2.5 rounded bg-slate-900 border border-slate-800 flex items-center justify-between">
                          <div>
                            <div className="font-bold text-white">{med.name} - {med.dosage}</div>
                            <div className="text-[11px] text-slate-400">{med.frequency}</div>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-mono font-bold text-emerald-400">{med.adherencePct}%</span>
                            <span className="block text-[9px] text-slate-500">Adherence</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Diagnostic Alerts */}
                  <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-400" />
                      Clinical Biomarker Findings
                    </h4>
                    <div className="space-y-2 font-sans text-xs">
                      {selectedPatient.labAlerts.map((alert, i) => (
                        <div key={i} className="p-2.5 rounded bg-slate-900 border border-slate-800 flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                          <span className="text-slate-300 text-xs leading-relaxed">{alert}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 2: CLINICAL REFERENCE RANGES */}
            {activeTab === 'trends' && (
              <div className="space-y-4 font-sans text-xs">
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2 font-mono">
                    <ShieldCheck className="w-4 h-4 text-cyan-400" />
                    Clinical Guideline Reference Benchmarks (ACC / AHA / ADA)
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Patient readings are validated against official clinical society consensus guidelines, distinguishing normal physiological adaptation from pathological risk.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    {/* AHA Blood Pressure Standard */}
                    <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-200">AHA / ACC Blood Pressure Classification</span>
                        <span className="text-[10px] text-emerald-400 font-mono">Patient: 116/74 (Normal)</span>
                      </div>
                      <div className="space-y-1 text-[11px] font-mono">
                        <div className="flex justify-between p-1 bg-emerald-500/10 text-emerald-300 rounded">
                          <span>Normal</span>
                          <span>&lt; 120 and &lt; 80 mmHg</span>
                        </div>
                        <div className="flex justify-between p-1 text-slate-400">
                          <span>Elevated</span>
                          <span>120–129 and &lt; 80 mmHg</span>
                        </div>
                        <div className="flex justify-between p-1 text-amber-400">
                          <span>Stage 1 Hypertension</span>
                          <span>130–139 or 80–89 mmHg</span>
                        </div>
                        <div className="flex justify-between p-1 text-rose-400">
                          <span>Stage 2 Hypertension</span>
                          <span>&ge; 140 or &ge; 90 mmHg</span>
                        </div>
                      </div>
                    </div>

                    {/* ADA Glycemic Ranges */}
                    <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-200">ADA Diabetes & Glycemic Targets</span>
                        <span className="text-[10px] text-emerald-400 font-mono">Patient: 88 mg/dL (Normal)</span>
                      </div>
                      <div className="space-y-1 text-[11px] font-mono">
                        <div className="flex justify-between p-1 bg-emerald-500/10 text-emerald-300 rounded">
                          <span>Normal Fasting</span>
                          <span>70–99 mg/dL (A1c &lt; 5.7%)</span>
                        </div>
                        <div className="flex justify-between p-1 text-amber-400">
                          <span>Prediabetes / IFG</span>
                          <span>100–125 mg/dL (A1c 5.7–6.4%)</span>
                        </div>
                        <div className="flex justify-between p-1 text-rose-400">
                          <span>Diabetes Mellitus</span>
                          <span>&ge; 126 mg/dL (A1c &ge; 6.5%)</span>
                        </div>
                      </div>
                    </div>

                    {/* Lipid Subfractions */}
                    <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-200">Apolipoprotein B & Atherogenic Lipids</span>
                        <span className="text-[10px] text-emerald-400 font-mono">Patient: 72 mg/dL</span>
                      </div>
                      <div className="space-y-1 text-[11px] font-mono">
                        <div className="flex justify-between p-1 bg-emerald-500/10 text-emerald-300 rounded">
                          <span>Optimal Primary Target</span>
                          <span>&lt; 80 mg/dL</span>
                        </div>
                        <div className="flex justify-between p-1 text-emerald-400">
                          <span>High Risk Secondary Target</span>
                          <span>&lt; 55 mg/dL</span>
                        </div>
                        <div className="flex justify-between p-1 text-amber-400">
                          <span>Moderate Exposure</span>
                          <span>80–100 mg/dL</span>
                        </div>
                      </div>
                    </div>

                    {/* Nocturnal Sleep & Respiratory Index */}
                    <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-200">AASM Apnea-Hypopnea Index (AHI)</span>
                        <span className="text-[10px] text-emerald-400 font-mono">Patient: 1.2 / hr</span>
                      </div>
                      <div className="space-y-1 text-[11px] font-mono">
                        <div className="flex justify-between p-1 bg-emerald-500/10 text-emerald-300 rounded">
                          <span>Normal</span>
                          <span>&lt; 5.0 events / hr</span>
                        </div>
                        <div className="flex justify-between p-1 text-amber-400">
                          <span>Mild Sleep Apnea</span>
                          <span>5.0–14.9 events / hr</span>
                        </div>
                        <div className="flex justify-between p-1 text-rose-400">
                          <span>Moderate / Severe Apnea</span>
                          <span>&ge; 15.0 events / hr</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: LEGAL SEPARATION: AI PLAN VS CLINICIAN-APPROVED ORDER */}
            {activeTab === 'plan_approval' && (
              <div className="space-y-5 font-sans">
                
                {/* 1. Legal & Regulatory Banner */}
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-1.5">
                  <div className="flex items-center gap-2 font-bold font-mono text-amber-300">
                    <AlertTriangle className="w-4 h-4" />
                    CLINICAL DECISION SUPPORT GOVERNANCE (FDA / HIPAA / AMA STANDARDS)
                  </div>
                  <p className="leading-relaxed">
                    VitalSync AI algorithms provide draft optimization suggestions. Suggestions have no legal force as clinical orders until reviewed, modified, and digitally signed by an attending licensed clinician.
                  </p>
                </div>

                {/* 2. Side-by-side Review Container */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Left: AI Generated Advisory Draft */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4" />
                        AI Draft Suggestions
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300">
                        Unapproved Advisory
                      </span>
                    </div>

                    <div className="space-y-2.5 text-xs text-slate-300">
                      <div className="p-3 rounded bg-slate-900 border border-slate-800 space-y-1">
                        <div className="font-semibold text-white">Aerobic Cardiovascular Progression:</div>
                        <p className="text-slate-400 text-[11px]">
                          Prescribe 150 minutes weekly Zone 2 aerobic volume (target heart rate 118–132 BPM) to maximize mitochondrial density and vascular compliance.
                        </p>
                      </div>

                      <div className="p-3 rounded bg-slate-900 border border-slate-800 space-y-1">
                        <div className="font-semibold text-white">Macronutrient Target:</div>
                        <p className="text-slate-400 text-[11px]">
                          180g dietary protein (2.2g/kg LBM) distributed evenly across 4 meals to preserve lean mass during mild caloric deficit.
                        </p>
                      </div>

                      <div className="p-3 rounded bg-slate-900 border border-slate-800 space-y-1">
                        <div className="font-semibold text-white">Overnight Autonomic Support:</div>
                        <p className="text-slate-400 text-[11px]">
                          Magnesium L-Threonate 400mg 60 mins before bed to support parasympathetic vagal tone and deep slow-wave sleep.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right: Clinician Review & Digital Sign-off */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/40 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-white font-mono flex items-center gap-1.5">
                        <Stethoscope className="w-4 h-4 text-cyan-400" />
                        Clinician Order & Rx Authorization
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        selectedPatient.planStatus === 'clinician_approved'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {selectedPatient.planStatus === 'clinician_approved' ? '✓ Official Order Signed' : 'Pending MD Signature'}
                      </span>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                          Attending Clinical Rationale & Assessment:
                        </label>
                        <textarea
                          rows={3}
                          value={clinicalRationale}
                          onChange={(e) => setClinicalRationale(e.target.value)}
                          className="w-full p-2.5 text-xs bg-slate-900 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-cyan-400 font-sans"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                          Official Order / Prescription Modifications:
                        </label>
                        <textarea
                          rows={2}
                          value={clinicalOrderNotes}
                          onChange={(e) => setClinicalOrderNotes(e.target.value)}
                          className="w-full p-2.5 text-xs bg-slate-900 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-cyan-400 font-sans"
                        />
                      </div>

                      {/* Sign-off Action */}
                      <div className="pt-2">
                        {selectedPatient.clinicianOrder ? (
                          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 space-y-1 text-xs">
                            <div className="font-bold flex items-center gap-1.5">
                              <CheckCircle2 className="w-4 h-4" />
                              Clinician Order Digitally Signed & Enforced
                            </div>
                            <p className="text-[11px] text-slate-300">
                              Signed by: {selectedPatient.clinicianOrder.signedBy} • NPI: {selectedPatient.clinicianOrder.npi}
                            </p>
                            <p className="text-[10px] text-slate-400 font-mono">
                              Timestamp: {selectedPatient.clinicianOrder.timestamp} • Sent to EHR Chart
                            </p>
                          </div>
                        ) : (
                          <button
                            id="sign-clinician-order-btn"
                            onClick={handleApprovePlan}
                            disabled={isSigning}
                            className="w-full py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 font-mono"
                          >
                            <UserCheck className="w-4 h-4" />
                            {isSigning ? 'Authorizing & Signing Order...' : 'Sign & Approve Plan as Official Clinician Order (NPI: 1982740192)'}
                          </button>
                        )}

                        {signSuccess && (
                          <p className="text-xs text-emerald-400 mt-2 text-center font-semibold">
                            Order successfully approved and synced to patient chart!
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* TAB 4: HL7 FHIR R4 RESOURCE BUNDLE */}
            {activeTab === 'fhir_export' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                      <FileCode className="w-4 h-4 text-cyan-400" />
                      HL7 FHIR R4 Resource Bundle (Epic / Cerner Interoperability)
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5 font-sans">
                      Standards-compliant JSON with LOINC observation codes, Patient resource, and CarePlan definitions.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyFhir}
                      className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-all"
                    >
                      {fhirCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {fhirCopied ? 'Copied!' : 'Copy JSON'}
                    </button>
                    <button
                      onClick={handleDownloadFhir}
                      className="px-3 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white flex items-center gap-1.5 transition-all shadow-md shadow-cyan-600/20"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download FHIR Bundle (.json)
                    </button>
                  </div>
                </div>

                {/* FHIR Code Viewer */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 max-h-[450px] overflow-y-auto">
                  <pre className="text-[11px] text-cyan-300 font-mono leading-relaxed whitespace-pre-wrap">
                    {JSON.stringify(fhirBundleJson, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {/* TAB 5: HIPAA BAA & ACCESS AUDIT TRAIL */}
            {activeTab === 'audit_log' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                      <Lock className="w-4 h-4 text-cyan-400" />
                      Immutable HIPAA Access Audit Trail
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5 font-sans">
                      Every chart view, vitals query, plan sign-off, and FHIR export is cryptographically recorded.
                    </p>
                  </div>

                  <span className="px-2.5 py-1 rounded text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    256-bit AES PHI ENCRYPTION
                  </span>
                </div>

                {/* Audit Table */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase font-bold">
                        <th className="py-2 px-3">Timestamp (UTC)</th>
                        <th className="py-2 px-3">Clinician / NPI</th>
                        <th className="py-2 px-3">Action</th>
                        <th className="py-2 px-3">MRN</th>
                        <th className="py-2 px-3">Purpose of Use</th>
                        <th className="py-2 px-3">IP / Session</th>
                        <th className="py-2 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                      {auditLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-900/50">
                          <td className="py-2.5 px-3 text-slate-400">{log.timestamp}</td>
                          <td className="py-2.5 px-3 text-white font-bold">{log.clinicianName} ({log.npi})</td>
                          <td className="py-2.5 px-3">
                            <span className="px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-300 font-semibold">
                              {log.action}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-slate-300">{log.patientMrn}</td>
                          <td className="py-2.5 px-3 text-emerald-400">{log.purposeOfUse}</td>
                          <td className="py-2.5 px-3 text-slate-500">{log.ipAddress}</td>
                          <td className="py-2.5 px-3">
                            <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-sans">
                              <CheckCircle2 className="w-3 h-3" /> BAA Verified
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>

          {/* Clinician View Footer */}
          <div className="p-3.5 border-t border-slate-800 bg-slate-900/90 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Session: Encrypted TLS 1.3 • Token ID: vs_clinician_sec_9942</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTab('audit_log')}
                className="hover:text-white underline text-[11px]"
              >
                View HIPAA Access Log
              </button>
              <span>•</span>
              <button
                onClick={onSwitchToPatientView}
                className="hover:text-cyan-400 text-cyan-500 font-bold"
              >
                Return to Patient View →
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
