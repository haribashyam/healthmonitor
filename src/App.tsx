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
import { GoogleMapsHealthPortalView } from './components/GoogleMapsHealthPortalView';
import { CustomerLifecycleView, LifecycleViewType } from './components/production/CustomerLifecycleView';
import { PricingView } from './components/PricingView';
import { AboutView } from './components/AboutView';
import { SecurityTrustCenterView } from './components/SecurityTrustCenterView';
import { ContactConciergeView } from './components/ContactConciergeView';
import { LegalComplianceView } from './components/LegalComplianceView';
import { AuthPortalView } from './components/AuthPortalView';
import { AuthModal } from './components/AuthModal';
import { FirebaseUserProfile } from './services/Auth';
import { GoogleWorkspaceModal } from './components/GoogleWorkspaceModal';
import { DataMapModal } from './components/DataMapModal';
import { Footer } from './components/Footer';
import { LiveWorkoutModal } from './components/LiveWorkoutModal';
import { WhatChangedModal } from './components/WhatChangedModal';
import { DoctorReportModal } from './components/DoctorReportModal';
import { SpecialDesksModal } from './components/SpecialDesksModal';
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
import { bluetoothManager } from './services/bluetoothService';
import { Activity as ActivityType, HealthJournalEntry } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('command');
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const [isSpecialDesksOpen, setIsSpecialDesksOpen] = useState(false);
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

  // Commercial Auth Gateway state - App defaults to full screen Apple UI Auth Portal
  const [isGatewayUnlocked, setIsGatewayUnlocked] = useState(false);
  const [currentUserProfile, setCurrentUserProfile] = useState<FirebaseUserProfile | null>(null);

  const handleEnterDashboard = (user?: FirebaseUserProfile) => {
    if (user) setCurrentUserProfile(user);
    setIsGatewayUnlocked(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateFromGateway = (tab: string) => {
    setActiveTab(tab);
    setIsGatewayUnlocked(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Modals state
  const [isLiveWorkoutOpen, setIsLiveWorkoutOpen] = useState(false);
  const [isWhatChangedOpen, setIsWhatChangedOpen] = useState(false);
  const [isDoctorReportOpen, setIsDoctorReportOpen] = useState(false);
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);
  const [isDataMapOpen, setIsDataMapOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'profile' | 'forgot'>('login');
  const [lifecycleInitialView, setLifecycleInitialView] = useState<LifecycleViewType>('account-settings');

  const handleOpenAuthModal = (mode: 'login' | 'register' | 'profile' | 'forgot' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

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
  const [isConnecting, setIsConnecting] = useState(false);
  const [bleDeviceName, setBleDeviceName] = useState('Apple Watch Ultra 2');

  useEffect(() => { initUTMTracking(); }, []);

  // Web Bluetooth service listener
  useEffect(() => {
    const unsubData = bluetoothManager.onData((reading) => {
      if (reading.heartRate) {
        setLiveBpm(reading.heartRate);
      }
    });

    const unsubConn = bluetoothManager.onConnectionChange((state) => {
      setIsBleConnected(state.connected);
      if (state.deviceName) setBleDeviceName(state.deviceName);
      setIsConnecting(!!state.isConnecting);
    });

    return () => {
      unsubData();
      unsubConn();
    };
  }, []);

  // Heartbeat pulse simulation if not connected to live sensor
  useEffect(() => {
    if (isBleConnected) return;

    const interval = setInterval(() => {
      setLiveBpm(prev => {
        const delta = Math.floor(Math.random() * 5) - 2;
        const next = prev + delta;
        return Math.min(Math.max(next, 62), 86);
      });
    }, 2800);

    return () => clearInterval(interval);
  }, [isBleConnected]);

  // Handle saved live workout
  const handleSaveWorkout = (newAct: ActivityType) => {
    setActivities(prev => [newAct, ...prev]);
  };

  const openLifecycleView = (view: LifecycleViewType) => {
    setLifecycleInitialView(view);
    setActiveTab('lifecycle');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openAskWithPrompt = (prompt: string) => {
    setAskPrompt(prompt);
    setActiveTab('coach');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentHealthContext = {
    vitalScore: vitalScore.current,
    restingHr: sleepRecords[0]?.restingHr || 59,
    hrv: sleepRecords[0]?.hrvAvg || 64,
    sleepDuration: sleepRecords[0] ? `${Math.floor(sleepRecords[0].totalMinutes / 60)}h ${sleepRecords[0].totalMinutes % 60}m` : '7h 42m',
    recentActivity: activities[0]?.title || 'Interval Running',
    criticalBiomarkers: biomarkers.filter(b => b.status === 'attention' || b.status === 'warning').map(b => `${b.name}: ${b.value} ${b.unit}`)
  };

  // 0. Full-Screen Commercial Auth Gateway (Apple UI Dark Mode & Liquid Glass)
  if (!isGatewayUnlocked) {
    return (
      <AuthPortalView
        onEnterDashboard={handleEnterDashboard}
        onNavigateTab={handleNavigateFromGateway}
        initialMode="login"
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-canvas)] text-[var(--text-main)] transition-colors duration-200">
      {/* 1. Real-time Telemetry & Global Status Ticker */}
      <TickerBar
        liveBpm={liveBpm}
        isBleConnected={isBleConnected}
        bleDeviceName={bleDeviceName}
        isConnecting={isConnecting}
        onOpenLiveWorkout={() => setIsLiveWorkoutOpen(true)}
        onOpenWhatChanged={() => setIsWhatChangedOpen(true)}
        onOpenDoctorReport={() => setIsDoctorReportOpen(true)}
        onOpenWorkspace={() => setIsWorkspaceOpen(true)}
        onOpenSearch={() => setIsGlobalSearchOpen(true)}
        onNavigateTab={(t) => setActiveTab(t)}
        onOpenLifecycle={openLifecycleView}
      />

      {/* 2. Primary Masthead & Newspaper Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(t) => {
          setActiveTab(t);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenLiveWorkout={() => setIsLiveWorkoutOpen(true)}
        onOpenWhatChanged={() => setIsWhatChangedOpen(true)}
        onOpenDoctorReport={() => setIsDoctorReportOpen(true)}
        onOpenWorkspace={() => setIsWorkspaceOpen(true)}
        onOpenGlobalSearch={() => setIsGlobalSearchOpen(true)}
        onOpenSpecialDesks={() => setIsSpecialDesksOpen(true)}
        onOpenAuthModal={handleOpenAuthModal}
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
            isConnecting={isConnecting}
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
            onOpenSpecialDesks={() => setIsSpecialDesksOpen(true)}
            theme={theme}
          />
        )}

        {/* Commercial Pages */}
        {activeTab === 'pricing' && (
          <PricingView
            onOpenAuth={handleOpenAuthModal}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'about' && (
          <AboutView
            onNavigateTab={setActiveTab}
            onOpenDoctorReport={() => setIsDoctorReportOpen(true)}
          />
        )}

        {activeTab === 'security' && (
          <SecurityTrustCenterView
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'contact' && (
          <ContactConciergeView
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'legal' && (
          <LegalComplianceView
            onNavigateTab={setActiveTab}
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

        {/* Google Maps Platform - Clinical Facilities & Workout GPS */}
        {activeTab === 'maps' && (
          <GoogleMapsHealthPortalView
            theme={theme}
            onOpenLiveWorkout={() => setIsLiveWorkoutOpen(true)}
            onOpenDoctorReport={() => setIsDoctorReportOpen(true)}
            onNavigateTab={(t) => setActiveTab(t)}
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
        theme={theme}
      />

      {/* 5. Modals & Overlays */}
      <LiveWorkoutModal
        isOpen={isLiveWorkoutOpen}
        onClose={() => setIsLiveWorkoutOpen(false)}
        onSaveWorkout={handleSaveWorkout}
        theme={theme}
      />

      <WhatChangedModal
        isOpen={isWhatChangedOpen}
        onClose={() => setIsWhatChangedOpen(false)}
        healthContext={currentHealthContext}
        theme={theme}
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

      <SpecialDesksModal
        isOpen={isSpecialDesksOpen}
        onClose={() => setIsSpecialDesksOpen(false)}
        onSelectTab={(t) => {
          setActiveTab(t);
          setIsSpecialDesksOpen(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenLiveWorkout={() => {
          setIsSpecialDesksOpen(false);
          setIsLiveWorkoutOpen(true);
        }}
        onOpenWorkspace={() => {
          setIsSpecialDesksOpen(false);
          setIsWorkspaceOpen(true);
        }}
        onOpenDoctorReport={() => {
          setIsSpecialDesksOpen(false);
          setIsDoctorReportOpen(true);
        }}
        theme={theme}
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
        theme={theme}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
        onNavigateTab={(t) => {
          setActiveTab(t);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        theme={theme}
      />

      <BackToTopButton />
    </div>
  );
}
