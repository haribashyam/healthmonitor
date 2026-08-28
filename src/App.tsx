import React, { useState, useEffect } from 'react';
import { TickerBar } from './components/TickerBar';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { HealthView } from './components/HealthView';
import { AICoachView } from './components/AICoachView';
import { DataHubView } from './components/DataHubView';
import { SettingsView } from './components/SettingsView';
import { ClinicianPortalView } from './components/ClinicianPortalView';
import { StrengthTrainingView } from './components/StrengthTrainingView';
import { BodyMetabolicView } from './components/BodyMetabolicView';
import { MedicationSupplementView } from './components/MedicationSupplementView';
import { HealthExperimentsLabView } from './components/HealthExperimentsLabView';
import { EnvironmentalCircadianView } from './components/EnvironmentalCircadianView';
import { InjuryMobilityRecoveryView } from './components/InjuryMobilityRecoveryView';
import { FamilyEmergencyCareView } from './components/FamilyEmergencyCareView';
import { CognitiveDigitalWellnessView } from './components/CognitiveDigitalWellnessView';
import { AIModelLabView } from './components/AIModelLabView';
import { SocialClubsChallengesView } from './components/SocialClubsChallengesView';
import { DataQualityAuditView } from './components/DataQualityAuditView';
import { DigitalTwinAndRadarView } from './components/DigitalTwinAndRadarView';
import { TimelineView } from './components/TimelineView';
import { CalendarView } from './components/CalendarView';
import { AchievementsView } from './components/AchievementsView';
import { HealthJournalView } from './components/HealthJournalView';
import { CustomerLifecycleView, LifecycleViewType } from './components/production/CustomerLifecycleView';
import { GoogleWorkspaceModal } from './components/GoogleWorkspaceModal';
import { DataMapModal } from './components/DataMapModal';
import { Footer } from './components/Footer';
import { LiveWorkoutModal } from './components/LiveWorkoutModal';
import { WhatChangedModal } from './components/WhatChangedModal';
import { DoctorReportModal } from './components/DoctorReportModal';
import { GlobalSearchModal } from './components/production/GlobalSearchModal';
import { BackToTopButton } from './components/production/BackToTopButton';
import { initUTMTracking } from './utils/utmTracker';
import {
  initialDataSources,
  initialBiomarkers,
  initialLabReports,
  initialActivities,
  initialSleepRecords,
  initialNutritionDays,
  initialVitalScore,
  initialAdaptivePlan,
  initialHealthJournal
} from './data/initialHealthData';
import { WebBluetoothManager } from './utils/bluetooth';
import { Activity as ActivityType, HealthJournalEntry } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('command');
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const [askPrompt, setAskPrompt] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem('vitalos_theme');
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {}
    return 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
    try { localStorage.setItem('vitalos_theme', theme); } catch {}
  }, [theme]);

  const toggleTheme = () => setTheme(p => p === 'dark' ? 'light' : 'dark');

  // Modals state
  const [isLiveWorkoutOpen, setIsLiveWorkoutOpen] = useState(false);
  const [isWhatChangedOpen, setIsWhatChangedOpen] = useState(false);
  const [isDoctorReportOpen, setIsDoctorReportOpen] = useState(false);
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);
  const [isDataMapOpen, setIsDataMapOpen] = useState(false);
  const [lifecycleInitialView, setLifecycleInitialView] = useState<LifecycleViewType>('account-settings');

  // Health data state
  const [vitalScore] = useState(initialVitalScore);
  const [sources, setSources] = useState(initialDataSources);
  const [biomarkers, setBiomarkers] = useState(initialBiomarkers);
  const [labReports, setLabReports] = useState(initialLabReports);
  const [activities, setActivities] = useState<ActivityType[]>(initialActivities);
  const [sleepRecords] = useState(initialSleepRecords);
  const [nutritionDays] = useState(initialNutritionDays);
  const [adaptivePlan, setAdaptivePlan] = useState(initialAdaptivePlan);
  const [healthJournal, setHealthJournal] = useState<HealthJournalEntry[]>(initialHealthJournal);

  // Live Bluetooth simulation state
  const [liveBpm, setLiveBpm] = useState(72);
  const [isBleConnected, setIsBleConnected] = useState(false);
  const [bleDeviceName] = useState('Apple Watch Ultra 2');

  useEffect(() => { initUTMTracking(); }, []);

  useEffect(() => {
    const ble = WebBluetoothManager.getInstance();
    const unsub = ble.onHeartRateData(d => setLiveBpm(d.heartRate));
    ble.startSimulation('Apple Watch Ultra 2');
    setIsBleConnected(true);
    return () => { unsub(); ble.stopSimulation(); };
  }, []);

  const handleSaveWorkout = (w: any) => {
    const act: ActivityType = {
      id: `act-${Date.now()}`,
      title: w.title,
      type: w.type,
      durationMinutes: w.durationMinutes,
      avgHeartRate: w.avgHeartRate,
      maxHeartRate: w.maxHeartRate,
      calories: w.calories,
      trainingLoad: w.trainingLoad,
      date: w.date,
      time: w.time,
      source: w.source,
      heartRateZones: { zone1: 5, zone2: Math.max(1, w.durationMinutes - 10), zone3: 4, zone4: 1, zone5: 0 }
    };
    setActivities(prev => [act, ...prev]);
  };

  const openAskWithPrompt = (prompt: string) => {
    setAskPrompt(prompt);
    setActiveTab('ask');
  };

  const openLifecycleView = (view: string) => {
    setLifecycleInitialView(view as LifecycleViewType);
    setActiveTab('lifecycle');
  };

  const currentHealthContext = {
    vitalScore,
    latestSleep: sleepRecords[0],
    latestVitals: { restingHR: 59, hrvRMSSD: 64, bloodPressure: '116/74', vo2Max: 48.6 },
    recentActivities: activities.slice(0, 5),
    biomarkers: biomarkers.slice(0, 8),
    nutrition: nutritionDays[0]
  };

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-[#F9F9F7] font-mono flex flex-col selection:bg-[#CC0000] selection:text-white">
      
      {/* 1. Live Streaming Biometric Ticker Bar */}
      <TickerBar
        liveBpm={liveBpm}
        isBleConnected={isBleConnected}
        bleDeviceName={bleDeviceName}
        vitalScore={vitalScore.overall}
        onOpenLiveWorkout={() => setIsLiveWorkoutOpen(true)}
      />

      {/* 2. Sleek Top Navigation Bar & Masthead */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenLiveWorkout={() => setIsLiveWorkoutOpen(true)}
        onOpenWhatChanged={() => setIsWhatChangedOpen(true)}
        onOpenDoctorReport={() => setIsDoctorReportOpen(true)}
        onOpenDataMap={() => setIsDataMapOpen(true)}
        onOpenWorkspace={() => setIsWorkspaceOpen(true)}
        onOpenGlobalSearch={() => setIsGlobalSearchOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        liveBpm={liveBpm}
        isBleConnected={isBleConnected}
        bleDeviceName={bleDeviceName}
        onOpenLifecycle={openLifecycleView}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* 3. Main Dynamic Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full flex-1">
        
        {/* Core Dashboard / Command Center */}
        {(activeTab === 'command' || activeTab === 'dashboard') && (
          <DashboardView
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
            onOpenDoctorReport={() => setIsDoctorReportOpen(true)}
            onOpenAsk={() => setActiveTab('ask')}
            onOpenAskWithPrompt={openAskWithPrompt}
            onNavigateTab={(t) => setActiveTab(t)}
            onOpenWorkspace={() => setIsWorkspaceOpen(true)}
          />
        )}

        {/* Health & Vitals Section */}
        {(activeTab === 'vitals' || activeTab === 'health' || activeTab === 'activity' || activeTab === 'sleep' || activeTab === 'nutrition') && (
          <HealthView
            biomarkers={biomarkers}
            labReports={labReports}
            activities={activities}
            sleepRecords={sleepRecords}
            nutritionDays={nutritionDays}
            adaptivePlan={adaptivePlan}
            onOpenDoctorReport={() => setIsDoctorReportOpen(true)}
            onOpenDataHub={() => setActiveTab('sources')}
          />
        )}

        {/* AI Health Copilot & Adaptive Plan */}
        {(activeTab === 'coach' || activeTab === 'plan' || activeTab === 'ask' || activeTab === 'simulator') && (
          <AICoachView
            adaptivePlan={adaptivePlan}
            setAdaptivePlan={setAdaptivePlan}
            healthContext={currentHealthContext}
            askPrompt={askPrompt}
            onOpenLiveWorkout={() => setIsLiveWorkoutOpen(true)}
            onOpenDoctorReport={() => setIsDoctorReportOpen(true)}
          />
        )}

        {/* Data Hub, Bluetooth & Lab OCR */}
        {(activeTab === 'sources' || activeTab === 'data') && (
          <DataHubView
            sources={sources}
            setSources={setSources}
            biomarkers={biomarkers}
            setBiomarkers={setBiomarkers}
            labReports={labReports}
            setLabReports={setLabReports}
          />
        )}

        {/* Clinician Portal (EHR) */}
        {activeTab === 'clinician' && (
          <ClinicianPortalView
            onSwitchToPatientView={() => setActiveTab('command')}
            biomarkers={biomarkers}
            activities={activities}
            sleepRecords={sleepRecords}
            onOpenReportExport={() => setIsDoctorReportOpen(true)}
          />
        )}

        {/* Specialized Modules */}
        {activeTab === 'strength' && (
          <StrengthTrainingView onNavigateTab={setActiveTab} />
        )}

        {activeTab === 'metabolic' && (
          <BodyMetabolicView onNavigateTab={setActiveTab} />
        )}

        {activeTab === 'supplements' && (
          <MedicationSupplementView onNavigateTab={setActiveTab} />
        )}

        {activeTab === 'experiments' && (
          <HealthExperimentsLabView onNavigateTab={setActiveTab} />
        )}

        {activeTab === 'circadian' && (
          <EnvironmentalCircadianView onNavigateTab={setActiveTab} />
        )}

        {activeTab === 'injury' && (
          <InjuryMobilityRecoveryView onNavigateTab={setActiveTab} />
        )}

        {activeTab === 'family' && (
          <FamilyEmergencyCareView onNavigateTab={setActiveTab} />
        )}

        {activeTab === 'focus' && (
          <CognitiveDigitalWellnessView onNavigateTab={setActiveTab} />
        )}

        {activeTab === 'ai-lab' && (
          <AIModelLabView onNavigateTab={setActiveTab} />
        )}

        {activeTab === 'clubs' && (
          <SocialClubsChallengesView onNavigateTab={setActiveTab} />
        )}

        {activeTab === 'data-quality' && (
          <DataQualityAuditView onNavigateTab={setActiveTab} />
        )}

        {activeTab === 'twin' && (
          <DigitalTwinAndRadarView onNavigateTab={setActiveTab} />
        )}

        {activeTab === 'timeline' && (
          <TimelineView onNavigateTab={setActiveTab} />
        )}

        {activeTab === 'calendar' && (
          <CalendarView onNavigateTab={setActiveTab} />
        )}

        {activeTab === 'social' && (
          <AchievementsView onNavigateTab={setActiveTab} />
        )}

        {activeTab === 'journal' && (
          <HealthJournalView onNavigateTab={setActiveTab} />
        )}

        {activeTab === 'lifecycle' && (
          <CustomerLifecycleView
            initialView={lifecycleInitialView}
            onNavigateToTab={setActiveTab}
          />
        )}

        {(activeTab === 'settings' || activeTab === 'legal' || activeTab === 'help' || activeTab === 'ux-states') && (
          <SettingsView
            theme={theme}
            onToggleTheme={toggleTheme}
            onOpenDoctorReport={() => setIsDoctorReportOpen(true)}
          />
        )}

      </main>

      {/* 4. Sleek Footer */}
      <Footer
        onNavigateTab={(t) => {
          setActiveTab(t);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* 5. Modals & Overlays */}
      <LiveWorkoutModal
        isOpen={isLiveWorkoutOpen}
        onClose={() => setIsLiveWorkoutOpen(false)}
        onSaveWorkout={handleSaveWorkout}
      />

      <WhatChangedModal
        isOpen={isWhatChangedOpen}
        onClose={() => setIsWhatChangedOpen(false)}
        healthContext={currentHealthContext}
      />

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
      />

      <GoogleWorkspaceModal
        isOpen={isWorkspaceOpen}
        onClose={() => setIsWorkspaceOpen(false)}
        metrics={activities}
        biomarkers={biomarkers}
        activePlan={adaptivePlan}
        activeReport={labReports[0]}
      />

      <DataMapModal
        isOpen={isDataMapOpen}
        onClose={() => setIsDataMapOpen(false)}
        sources={sources}
      />

      <GlobalSearchModal
        isOpen={isGlobalSearchOpen}
        onClose={() => setIsGlobalSearchOpen(false)}
        onSelectTab={(t) => {
          setActiveTab(t);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      <BackToTopButton />
    </div>
  );
}
