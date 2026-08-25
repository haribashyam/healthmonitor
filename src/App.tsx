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

// Production-Grade Pages & Compliance Suites
import { LegalPagesView, LegalDocType } from './components/production/LegalPagesView';
import { CustomerLifecycleView, LifecycleViewType } from './components/production/CustomerLifecycleView';
import { HelpCenterView } from './components/production/HelpCenterView';
import { UXStatesView, UXStateType } from './components/production/UXStatesView';
import { Footer } from './components/Footer';
import { CookieBanner } from './components/CookieBanner';

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

  // Sub-routes for Production Pages
  const [activeLegalDoc, setActiveLegalDoc] = useState<LegalDocType>('privacy');
  const [activeLifecycleView, setActiveLifecycleView] = useState<LifecycleViewType>('account-settings');
  const [activeUXState, setActiveUXState] = useState<UXStateType>('404');

  // Modals state
  const [isLiveWorkoutOpen, setIsLiveWorkoutOpen] = useState<boolean>(false);
  const [isWhatChangedOpen, setIsWhatChangedOpen] = useState<boolean>(false);
  const [isDoctorReportOpen, setIsDoctorReportOpen] = useState<boolean>(false);
  const [isDataMapOpen, setIsDataMapOpen] = useState<boolean>(false);

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
      
      <div>
        {/* Top Main Navigation & Command Bar */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenLiveWorkout={() => setIsLiveWorkoutOpen(true)}
          onOpenWhatChanged={() => setIsWhatChangedOpen(true)}
          onOpenDoctorReport={() => setIsDoctorReportOpen(true)}
          onOpenDataMap={() => setIsDataMapOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          liveBpm={liveBpm}
          isBleConnected={isBleConnected}
          bleDeviceName={bleDeviceName}
          onOpenLifecycle={handleOpenLifecycle}
        />

        {/* Main View Container */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
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
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'plan' && (
            <AIPlanView
              adaptivePlan={adaptivePlan}
              setAdaptivePlan={setAdaptivePlan}
              onOpenLiveWorkout={() => setIsLiveWorkoutOpen(true)}
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
      />

      {/* Modal: My Data Map & Provenance Ledger */}
      <DataMapModal
        isOpen={isDataMapOpen}
        onClose={() => setIsDataMapOpen(false)}
        sources={sources}
      />

    </div>
  );
}

