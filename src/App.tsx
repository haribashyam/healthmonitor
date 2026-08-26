import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { HealthView } from './components/HealthView';
import { AICoachView } from './components/AICoachView';
import { DataHubView } from './components/DataHubView';
import { SettingsView } from './components/SettingsView';
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

export type TabId = 'dashboard' | 'health' | 'coach' | 'data' | 'settings';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const [askPrompt, setAskPrompt] = useState<string | undefined>(undefined);

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

  const [isLiveWorkoutOpen, setIsLiveWorkoutOpen] = useState(false);
  const [isWhatChangedOpen, setIsWhatChangedOpen] = useState(false);
  const [isDoctorReportOpen, setIsDoctorReportOpen] = useState(false);

  const [vitalScore] = useState(initialVitalScore);
  const [sources, setSources] = useState(initialDataSources);
  const [biomarkers, setBiomarkers] = useState(initialBiomarkers);
  const [labReports, setLabReports] = useState(initialLabReports);
  const [activities, setActivities] = useState<ActivityType[]>(initialActivities);
  const [sleepRecords] = useState(initialSleepRecords);
  const [nutritionDays] = useState(initialNutritionDays);
  const [adaptivePlan, setAdaptivePlan] = useState(initialAdaptivePlan);
  const [, setHealthJournal] = useState<HealthJournalEntry[]>(initialHealthJournal);

  const [liveBpm, setLiveBpm] = useState(72);
  const [isBleConnected, setIsBleConnected] = useState(false);
  const [bleDeviceName] = useState('Apple Watch Live Pulse');

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
      title: w.title, type: w.type, durationMinutes: w.durationMinutes,
      avgHeartRate: w.avgHeartRate, maxHeartRate: w.maxHeartRate,
      calories: w.calories, trainingLoad: w.trainingLoad,
      date: w.date, time: w.time, source: w.source,
      heartRateZones: { zone1: 5, zone2: Math.max(1, w.durationMinutes - 10), zone3: 4, zone4: 1, zone5: 0 }
    };
    setActivities(prev => [act, ...prev]);
  };

  const openAskWithPrompt = (prompt: string) => {
    setAskPrompt(prompt);
    setActiveTab('coach');
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
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenLiveWorkout={() => setIsLiveWorkoutOpen(true)}
        onOpenWhatChanged={() => setIsWhatChangedOpen(true)}
        onOpenDoctorReport={() => setIsDoctorReportOpen(true)}
        onOpenGlobalSearch={() => setIsGlobalSearchOpen(true)}
        liveBpm={liveBpm}
        isBleConnected={isBleConnected}
        bleDeviceName={bleDeviceName}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full flex-1">
        {activeTab === 'dashboard' && (
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
            onOpenAsk={() => setActiveTab('coach')}
            onOpenAskWithPrompt={openAskWithPrompt}
            onNavigateTab={(t) => setActiveTab(t as TabId)}
          />
        )}

        {activeTab === 'health' && (
          <HealthView
            biomarkers={biomarkers}
            labReports={labReports}
            activities={activities}
            sleepRecords={sleepRecords}
            nutritionDays={nutritionDays}
            adaptivePlan={adaptivePlan}
            onOpenDoctorReport={() => setIsDoctorReportOpen(true)}
            onOpenDataHub={() => setActiveTab('data')}
          />
        )}

        {activeTab === 'coach' && (
          <AICoachView
            adaptivePlan={adaptivePlan}
            setAdaptivePlan={setAdaptivePlan}
            healthContext={currentHealthContext}
            askPrompt={askPrompt}
            onOpenLiveWorkout={() => setIsLiveWorkoutOpen(true)}
            onOpenDoctorReport={() => setIsDoctorReportOpen(true)}
          />
        )}

        {activeTab === 'data' && (
          <DataHubView
            sources={sources}
            setSources={setSources}
            biomarkers={biomarkers}
            setBiomarkers={setBiomarkers}
            labReports={labReports}
            setLabReports={setLabReports}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            theme={theme}
            onToggleTheme={toggleTheme}
            onOpenDoctorReport={() => setIsDoctorReportOpen(true)}
          />
        )}
      </main>

      <Footer onNavigateTab={(t) => { setActiveTab(t as TabId); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />

      <LiveWorkoutModal isOpen={isLiveWorkoutOpen} onClose={() => setIsLiveWorkoutOpen(false)} onSaveWorkout={handleSaveWorkout} />
      <WhatChangedModal isOpen={isWhatChangedOpen} onClose={() => setIsWhatChangedOpen(false)} healthContext={currentHealthContext} />
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

      <GlobalSearchModal
        isOpen={isGlobalSearchOpen}
        onClose={() => setIsGlobalSearchOpen(false)}
        onSelectTab={(t) => { setActiveTab(t as TabId); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
      />

      <BackToTopButton />
    </div>
  );
}
