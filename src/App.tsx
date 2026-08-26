import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { CommandCenter } from './components/CommandCenter';
import { LiveWorkoutModal } from './components/LiveWorkoutModal';
import { UniversalDataHub } from './components/UniversalDataHub';
import { AIPlanView } from './components/AIPlanView';
import { AskMyDataView } from './components/AskMyDataView';
import { VitalsAndLabView } from './components/VitalsAndLabView';
import { ActivityAnalyticsView } from './components/ActivityAnalyticsView';
import { SleepAndRecoveryView } from './components/SleepAndRecoveryView';
import { NutritionView } from './components/NutritionView';
import { WhatIfSimulatorView } from './components/WhatIfSimulatorView';
import { DigitalTwinAndRadarView } from './components/DigitalTwinAndRadarView';
import { TimelineView } from './components/TimelineView';
import { CalendarView } from './components/CalendarView';
import { AchievementsView } from './components/AchievementsView';
import { HealthJournalView } from './components/HealthJournalView';
import { DoctorReportModal } from './components/DoctorReportModal';
import { WhatChangedModal } from './components/WhatChangedModal';
import { DataMapModal } from './components/DataMapModal';
import { GoogleWorkspaceModal } from './components/GoogleWorkspaceModal';
import { ClinicianPortalView } from './components/ClinicianPortalView';
import { PatientTrustModal } from './components/production/PatientTrustModal';
import { HistoricalDataImportModal } from './components/production/HistoricalDataImportModal';

// VITALOS Advanced 100-Feature Engines
import { StrengthTrainingView } from './components/StrengthTrainingView';
import { MedicationSupplementView } from './components/MedicationSupplementView';
import { BodyMetabolicView } from './components/BodyMetabolicView';
import { HealthExperimentsLabView } from './components/HealthExperimentsLabView';
import { EnvironmentalCircadianView } from './components/EnvironmentalCircadianView';
import { InjuryMobilityRecoveryView } from './components/InjuryMobilityRecoveryView';
import { FamilyEmergencyCareView } from './components/FamilyEmergencyCareView';
import { CognitiveDigitalWellnessView } from './components/CognitiveDigitalWellnessView';
import { AIModelLabView } from './components/AIModelLabView';
import { SocialClubsChallengesView } from './components/SocialClubsChallengesView';
import { DataQualityAuditView } from './components/DataQualityAuditView';

// Production-Grade Pages & Compliance Suites
import { LegalPagesView, LegalDocType } from './components/production/LegalPagesView';
import { CustomerLifecycleView, LifecycleViewType } from './components/production/CustomerLifecycleView';
import { HelpCenterView } from './components/production/HelpCenterView';
import { UXStatesView, UXStateType } from './components/production/UXStatesView';
import { Footer } from './components/Footer';
import { CookieBanner } from './components/CookieBanner';
import { ScrollProgressBar } from './components/production/ScrollProgressBar';
import { BackToTopButton } from './components/production/BackToTopButton';
import { FloatingSupportBubble } from './components/production/FloatingSupportBubble';
import { GlobalSearchModal } from './components/production/GlobalSearchModal';
import { initUTMTracking } from './utils/utmTracker';

import {
  initialDataSources,
  initialBiomarkers,
  initialLabReports,
  initialActivities,
  initialSleepRecords,
  initialNutritionDays,
  initialTimelineEvents,
  initialVitalScore,
  initialAdaptivePlan,
  initialHealthJournal
} from './data/initialHealthData';
import { WebBluetoothManager } from './utils/bluetooth';
import { Activity as ActivityType, HealthJournalEntry } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('command');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState<boolean>(false);

  // Theme Management (Light / Dark)
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const savedTheme = localStorage.getItem('vitalos_theme');
      if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme;
      }
      if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        return 'light';
      }
    } catch (e) {
      console.debug('Theme initialization error:', e);
    }
    return 'dark';
  });

  // Synchronize 'data-theme' attribute to the root html element and save to localStorage
  useEffect(() => {
    try {
      document.documentElement.setAttribute('data-theme', theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('vitalos_theme', theme);
    } catch (e) {
      console.debug('Failed to set theme attribute/storage:', e);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Sub-routes for Production Pages
  const [activeLegalDoc, setActiveLegalDoc] = useState<LegalDocType>('privacy');
  const [activeLifecycleView, setActiveLifecycleView] = useState<LifecycleViewType>('account-settings');
  const [activeUXState, setActiveUXState] = useState<UXStateType>('404');

  // Modals state
  const [isLiveWorkoutOpen, setIsLiveWorkoutOpen] = useState<boolean>(false);
  const [isWhatChangedOpen, setIsWhatChangedOpen] = useState<boolean>(false);
  const [isDoctorReportOpen, setIsDoctorReportOpen] = useState<boolean>(false);
  const [isDataMapOpen, setIsDataMapOpen] = useState<boolean>(false);
  const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState<boolean>(false);
  const [workspaceInitialTab, setWorkspaceInitialTab] = useState<'gmail' | 'sheets' | 'picker' | 'firebase'>('gmail');
  const [isPatientTrustOpen, setIsPatientTrustOpen] = useState<boolean>(false);
  const [isHistoricalImportOpen, setIsHistoricalImportOpen] = useState<boolean>(false);

  // Core Unified Health State
  const [vitalScore, setVitalScore] = useState(initialVitalScore);
  const [sources, setSources] = useState(initialDataSources);
  const [biomarkers, setBiomarkers] = useState(initialBiomarkers);
  const [labReports, setLabReports] = useState(initialLabReports);
  const [activities, setActivities] = useState<ActivityType[]>(initialActivities);
  const [sleepRecords, setSleepRecords] = useState(initialSleepRecords);
  const [nutritionDays, setNutritionDays] = useState(initialNutritionDays);
  const [timelineEvents, setTimelineEvents] = useState(initialTimelineEvents);
  const [adaptivePlan, setAdaptivePlan] = useState(initialAdaptivePlan);
  const [healthJournal, setHealthJournal] = useState<HealthJournalEntry[]>(initialHealthJournal);

  // Live Bluetooth Stream State
  const [liveBpm, setLiveBpm] = useState<number>(72);
  const [isBleConnected, setIsBleConnected] = useState<boolean>(false);
  const [bleDeviceName, setBleDeviceName] = useState<string>('Apple Watch Live Pulse');

  useEffect(() => {
    initUTMTracking();
  }, []);

  useEffect(() => {
    const ble = WebBluetoothManager.getInstance();
    
    // Subscribe to heart rate events
    const unsub = ble.onHeartRateData((data) => {
      setLiveBpm(data.heartRate);
    });

    // Start virtual background pulse so the command center has a live waveform
    ble.startSimulation('Apple Watch Ultra 2');
    setIsBleConnected(true);
    setBleDeviceName('Apple Watch Ultra 2');

    return () => {
      unsub();
      ble.stopSimulation();
    };
  }, []);

  const handleSaveWorkout = (newWorkout: any) => {
    const act: ActivityType = {
      id: `act-${Date.now()}`,
      title: newWorkout.title,
      type: newWorkout.type,
      durationMinutes: newWorkout.durationMinutes,
      avgHeartRate: newWorkout.avgHeartRate,
      maxHeartRate: newWorkout.maxHeartRate,
      calories: newWorkout.calories,
      trainingLoad: newWorkout.trainingLoad,
      date: newWorkout.date,
      time: newWorkout.time,
      source: newWorkout.source,
      heartRateZones: {
        zone1: 5,
        zone2: Math.max(1, newWorkout.durationMinutes - 10),
        zone3: 4,
        zone4: 1,
        zone5: 0
      }
    };

    setActivities((prev) => [act, ...prev]);

    // Also push to timeline
    setTimelineEvents((prev) => [
      {
        id: `tl-${Date.now()}`,
        timestamp: `${newWorkout.date} • ${newWorkout.time}`,
        title: `Workout Logged: ${newWorkout.title}`,
        type: 'workout',
        source: newWorkout.source,
        description: `Completed ${newWorkout.durationMinutes} mins with avg HR ${newWorkout.avgHeartRate} BPM (${newWorkout.calories} kcal burned).`,
        metrics: {
          Duration: `${newWorkout.durationMinutes}m`,
          AvgHR: `${newWorkout.avgHeartRate} BPM`,
          TRIMP: `+${newWorkout.trainingLoad}`
        }
      },
      ...prev
    ]);
  };

  const handleOpenLegalDoc = (doc: LegalDocType) => {
    setActiveLegalDoc(doc);
    setActiveTab('legal');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenLifecycle = (view: LifecycleViewType) => {
    setActiveLifecycleView(view);
    setActiveTab('lifecycle');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenUXState = (state: UXStateType) => {
    setActiveUXState(state);
    setActiveTab('ux-states');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenHelpCenter = () => {
    setActiveTab('help');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentHealthContext = {
    vitalScore,
    latestSleep: sleepRecords[0],
    latestVitals: { restingHR: 59, hrvRMSSD: 64, bloodPressure: '118/76', vo2Max: 48.6 },
    recentActivities: activities.slice(0, 5),
    biomarkers: biomarkers.slice(0, 8),
    nutrition: nutritionDays[0]
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950 flex flex-col justify-between">
      {/* Accessibility Skip-to-content Link (Part 2 Item 12) */}
      <a href="#main-content" className="skip-link">
        Skip to main health content
      </a>

      {/* Global Scroll Depth Indicator (Part 2 Item 8) */}
      <ScrollProgressBar />

      <div>
        {/* Top Main Navigation & Command Bar */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenLiveWorkout={() => setIsLiveWorkoutOpen(true)}
          onOpenWhatChanged={() => setIsWhatChangedOpen(true)}
          onOpenDoctorReport={() => setIsDoctorReportOpen(true)}
          onOpenDataMap={() => setIsDataMapOpen(true)}
          onOpenGlobalSearch={() => setIsGlobalSearchOpen(true)}
          onOpenWorkspace={(tab) => {
            setWorkspaceInitialTab(tab || 'gmail');
            setIsWorkspaceModalOpen(true);
          }}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          liveBpm={liveBpm}
          isBleConnected={isBleConnected}
          bleDeviceName={bleDeviceName}
          onOpenLifecycle={handleOpenLifecycle}
          theme={theme}
          onToggleTheme={toggleTheme}
        />

        {/* Main View Container */}
        <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

          {activeTab === 'command' && (
            <CommandCenter
              vitalScore={vitalScore}
              liveBpm={liveBpm}
              isBleConnected={isBleConnected}
              bleDeviceName={bleDeviceName}
              activities={activities}
              sleepRecords={sleepRecords}
              biomarkers={biomarkers}
              adaptivePlan={adaptivePlan}
              onOpenLiveWorkout={() => setIsLiveWorkoutOpen(true)}
              onOpenWhatChanged={() => setIsWhatChangedOpen(true)}
              onOpenAskData={() => setActiveTab('ask')}
              onOpenDataSources={() => setActiveTab('sources')}
              onOpenSimulator={() => setActiveTab('simulator')}
              onOpenDoctorReport={() => setIsDoctorReportOpen(true)}
              onOpenWorkspace={(tab) => {
                setWorkspaceInitialTab(tab || 'gmail');
                setIsWorkspaceModalOpen(true);
              }}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onOpenPatientTrust={() => setIsPatientTrustOpen(true)}
              onOpenHistoricalImport={() => setIsHistoricalImportOpen(true)}
              onSwitchToClinician={() => setActiveTab('clinician')}
            />
          )}

          {/* Clinician / Doctor EHR Workstation View */}
          {activeTab === 'clinician' && (
            <ClinicianPortalView
              patientBiomarkers={biomarkers}
              patientActivities={activities}
              patientSleepRecords={sleepRecords}
              onSwitchToPatientView={() => setActiveTab('command')}
            />
          )}

          {/* VITALOS Advanced Systems */}
          {activeTab === 'strength' && (
            <StrengthTrainingView />
          )}

          {activeTab === 'supplements' && (
            <MedicationSupplementView />
          )}

          {activeTab === 'metabolic' && (
            <BodyMetabolicView />
          )}

          {activeTab === 'experiments' && (
            <HealthExperimentsLabView />
          )}

          {activeTab === 'circadian' && (
            <EnvironmentalCircadianView />
          )}

          {activeTab === 'injury' && (
            <InjuryMobilityRecoveryView />
          )}

          {activeTab === 'family' && (
            <FamilyEmergencyCareView />
          )}

          {activeTab === 'focus' && (
            <CognitiveDigitalWellnessView />
          )}

          {activeTab === 'ai-lab' && (
            <AIModelLabView />
          )}

          {activeTab === 'clubs' && (
            <SocialClubsChallengesView />
          )}

          {activeTab === 'data-quality' && (
            <DataQualityAuditView />
          )}

          {activeTab === 'plan' && (
            <AIPlanView
              adaptivePlan={adaptivePlan}
              setAdaptivePlan={setAdaptivePlan}
              onOpenLiveWorkout={() => setIsLiveWorkoutOpen(true)}
              onOpenDoctorReport={() => setIsDoctorReportOpen(true)}
            />
          )}

          {activeTab === 'ask' && (
            <AskMyDataView healthContext={currentHealthContext} />
          )}

          {activeTab === 'sources' && (
            <UniversalDataHub
              sources={sources}
              setSources={setSources}
              biomarkers={biomarkers}
              setBiomarkers={setBiomarkers}
              labReports={labReports}
              setLabReports={setLabReports}
              onOpenDataMap={() => setIsDataMapOpen(true)}
            />
          )}

          {activeTab === 'vitals' && (
            <VitalsAndLabView
              biomarkers={biomarkers}
              labReports={labReports}
              onOpenDataSources={() => setActiveTab('sources')}
              onOpenDoctorReport={() => setIsDoctorReportOpen(true)}
            />
          )}

          {activeTab === 'activity' && (
            <ActivityAnalyticsView
              activities={activities}
              onOpenLiveWorkout={() => setIsLiveWorkoutOpen(true)}
            />
          )}

          {activeTab === 'sleep' && (
            <SleepAndRecoveryView sleepRecords={sleepRecords} />
          )}

          {activeTab === 'nutrition' && (
            <NutritionView
              nutritionDays={nutritionDays}
              adaptivePlan={adaptivePlan}
              onOpenDataSources={() => setActiveTab('sources')}
            />
          )}

          {activeTab === 'simulator' && (
            <WhatIfSimulatorView />
          )}

          {activeTab === 'twin' && (
            <DigitalTwinAndRadarView />
          )}

          {activeTab === 'timeline' && (
            <TimelineView events={timelineEvents} />
          )}

          {activeTab === 'calendar' && (
            <CalendarView
              workoutSplit={adaptivePlan.workoutSplit}
              onOpenLiveWorkout={() => setIsLiveWorkoutOpen(true)}
            />
          )}

          {activeTab === 'social' && (
            <AchievementsView />
          )}

          {activeTab === 'journal' && (
            <HealthJournalView
              entries={healthJournal}
              setEntries={setHealthJournal}
            />
          )}

          {/* Legal, Trust & Compliance Hub */}
          {activeTab === 'legal' && (
            <LegalPagesView
              initialDoc={activeLegalDoc}
              onOpenCookiePreferences={() => handleOpenLegalDoc('cookie-policy')}
            />
          )}

          {/* Customer Lifecycle Hub (Auth, Onboarding, Billing, Invoices, Payment States) */}
          {activeTab === 'lifecycle' && (
            <CustomerLifecycleView
              initialView={activeLifecycleView}
              onNavigateToTab={setActiveTab}
            />
          )}

          {/* Help Center & Support Knowledge Base */}
          {activeTab === 'help' && (
            <HelpCenterView />
          )}

          {/* UX Edge States Catalog (404, 403, 500, Maintenance, Offline, Loaders, Session Timeout) */}
          {activeTab === 'ux-states' && (
            <UXStatesView
              initialState={activeUXState}
              onNavigateToTab={setActiveTab}
            />
          )}
        </main>
      </div>

      {/* Production-Grade Global Footer */}
      <Footer
        onOpenLegalDoc={handleOpenLegalDoc}
        onOpenLifecycle={handleOpenLifecycle}
        onOpenHelpCenter={handleOpenHelpCenter}
        onOpenUXState={handleOpenUXState}
        onOpenCookiePreferences={() => handleOpenLegalDoc('cookie-policy')}
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Persistent Self-Sovereign Cookie Banner */}
      <CookieBanner
        onOpenPreferences={() => handleOpenLegalDoc('cookie-policy')}
      />

      {/* Hero Modal: Live Workout HUD with Bluetooth Stream */}
      <LiveWorkoutModal
        isOpen={isLiveWorkoutOpen}
        onClose={() => setIsLiveWorkoutOpen(false)}
        onSaveWorkout={handleSaveWorkout}
      />

      {/* Modal: "Why Am I Different Today?" Root Cause Diagnostic */}
      <WhatChangedModal
        isOpen={isWhatChangedOpen}
        onClose={() => setIsWhatChangedOpen(false)}
        healthContext={currentHealthContext}
      />

      {/* Modal: Doctor Clinical Brief & PDF Export */}
      <DoctorReportModal
        isOpen={isDoctorReportOpen}
        onClose={() => setIsDoctorReportOpen(false)}
        biomarkers={biomarkers}
        activities={activities}
        sleepRecords={sleepRecords}
        adaptivePlan={adaptivePlan}
        vitalScore={vitalScore}
        sources={sources}
        labReports={labReports}
        onOpenWorkspace={(tab) => {
          setWorkspaceInitialTab(tab || 'gmail');
          setIsWorkspaceModalOpen(true);
        }}
      />

      {/* Modal: My Data Map & Provenance Ledger */}
      <DataMapModal
        isOpen={isDataMapOpen}
        onClose={() => setIsDataMapOpen(false)}
        sources={sources}
      />

      {/* Modal: Google Workspace (Gmail, Sheets, Drive) & Firebase Integration Hub */}
      <GoogleWorkspaceModal
        isOpen={isWorkspaceModalOpen}
        onClose={() => setIsWorkspaceModalOpen(false)}
        initialTab={workspaceInitialTab}
        biomarkers={biomarkers}
        activities={activities}
        sleepRecords={sleepRecords}
        adaptivePlan={adaptivePlan}
        vitalScore={vitalScore}
      />

      {/* Global Instant Search (Part 2 Item 3 - Cmd+K) */}
      <GlobalSearchModal
        isOpen={isGlobalSearchOpen}
        onClose={() => setIsGlobalSearchOpen(false)}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Back to Top Floating Button (Part 2 Item 4) */}
      <BackToTopButton />

      {/* Floating Quick Support & AI Copilot Bubble (Part 2 Item 20) */}
      <FloatingSupportBubble
        onOpenAskData={() => setActiveTab('ask')}
        onOpenHelpCenter={() => setActiveTab('help')}
      />

      {/* Patient Privacy, Sharing Controls & Account Deletion Modal */}
      <PatientTrustModal
        isOpen={isPatientTrustOpen}
        onClose={() => setIsPatientTrustOpen(false)}
        onOpenDoctorReport={() => {
          setIsPatientTrustOpen(false);
          setIsDoctorReportOpen(true);
        }}
      />

      {/* Historical Data Archive Ingestion Modal (Apple Health, Garmin, Oura, Dexcom) */}
      <HistoricalDataImportModal
        isOpen={isHistoricalImportOpen}
        onClose={() => setIsHistoricalImportOpen(false)}
        onImportSuccess={() => {
          // Re-trigger sync or update status
          console.debug('Historical archive ingested successfully');
        }}
      />

    </div>
  );
}


