import { Biomarker, LabReport, Activity, SleepRecord, DataSource } from '../types';
import { INITIAL_DATA_SOURCES, INITIAL_LAB_REPORTS, INITIAL_BIOMARKERS } from '../data/initialHealthData';

export interface UserVitalsLog {
  id: string;
  type: 'heart_rate' | 'blood_pressure' | 'glucose' | 'spo2' | 'weight' | 'hrv' | 'temperature';
  value: number;
  secondaryValue?: number; // e.g. Diastolic for BP
  unit: string;
  notes?: string;
  source: string; // 'Manual User Input', 'Web Bluetooth BLE', 'OCR Pathology Scan', etc.
  timestamp: number;
  dateString: string;
  isEstimated?: boolean;
}

export interface UserHealthProfile {
  name: string;
  mrn?: string;
  birthDate?: string;
  gender?: string;
  bloodType?: string;
  units: 'metric' | 'imperial';
  notes?: string;
}

const STORAGE_KEYS = {
  VITALS: 'vitalsync_user_vitals',
  BIOMARKERS: 'vitalsync_biomarkers',
  LAB_REPORTS: 'vitalsync_lab_reports',
  ACTIVITIES: 'vitalsync_activities',
  SLEEP: 'vitalsync_sleep',
  SOURCES: 'vitalsync_data_sources',
  PROFILE: 'vitalsync_user_profile',
  PREFERENCES: 'vitalsync_preferences'
};

export class HealthStorageService {
  private static instance: HealthStorageService;

  public static getInstance(): HealthStorageService {
    if (!HealthStorageService.instance) {
      HealthStorageService.instance = new HealthStorageService();
    }
    return HealthStorageService.instance;
  }

  // Vitals logs
  public getVitals(): UserVitalsLog[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.VITALS);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.warn('Failed to parse vitals from storage:', e);
    }
    return [];
  }

  public saveVital(vital: Omit<UserVitalsLog, 'id' | 'timestamp' | 'dateString'>): UserVitalsLog {
    const vitals = this.getVitals();
    const newVital: UserVitalsLog = {
      ...vital,
      id: `vital-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      timestamp: Date.now(),
      dateString: new Date().toISOString()
    };
    vitals.unshift(newVital);
    localStorage.setItem(STORAGE_KEYS.VITALS, JSON.stringify(vitals));
    window.dispatchEvent(new CustomEvent('vitalsUpdated', { detail: newVital }));
    return newVital;
  }

  public deleteVital(id: string): void {
    const vitals = this.getVitals().filter(v => v.id !== id);
    localStorage.setItem(STORAGE_KEYS.VITALS, JSON.stringify(vitals));
    window.dispatchEvent(new CustomEvent('vitalsUpdated', { detail: { deletedId: id } }));
  }

  // Biomarkers
  public getBiomarkers(): Biomarker[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.BIOMARKERS);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.warn('Failed to parse biomarkers from storage:', e);
    }
    return INITIAL_BIOMARKERS;
  }

  public saveBiomarker(bio: Biomarker): void {
    const list = this.getBiomarkers();
    const existingIndex = list.findIndex(b => b.id === bio.id || b.name.toLowerCase() === bio.name.toLowerCase());
    if (existingIndex >= 0) {
      list[existingIndex] = bio;
    } else {
      list.unshift(bio);
    }
    localStorage.setItem(STORAGE_KEYS.BIOMARKERS, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('biomarkersUpdated', { detail: list }));
  }

  // Lab Reports
  public getLabReports(): LabReport[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.LAB_REPORTS);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.warn('Failed to parse lab reports from storage:', e);
    }
    return INITIAL_LAB_REPORTS;
  }

  public saveLabReport(report: LabReport): void {
    const list = this.getLabReports();
    list.unshift(report);
    localStorage.setItem(STORAGE_KEYS.LAB_REPORTS, JSON.stringify(list));
    
    // Also merge all contained biomarkers into user's biomarker store
    if (report.biomarkers && report.biomarkers.length > 0) {
      report.biomarkers.forEach(b => this.saveBiomarker(b));
    }
    window.dispatchEvent(new CustomEvent('labReportsUpdated', { detail: list }));
  }

  // Data Sources
  public getDataSources(): DataSource[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.SOURCES);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.warn('Failed to parse data sources from storage:', e);
    }
    return INITIAL_DATA_SOURCES;
  }

  public updateDataSource(updatedSource: DataSource): void {
    const sources = this.getDataSources();
    const idx = sources.findIndex(s => s.id === updatedSource.id);
    if (idx >= 0) {
      sources[idx] = updatedSource;
    } else {
      sources.push(updatedSource);
    }
    localStorage.setItem(STORAGE_KEYS.SOURCES, JSON.stringify(sources));
    window.dispatchEvent(new CustomEvent('dataSourcesUpdated', { detail: sources }));
  }

  public saveDataSource(source: DataSource): void {
    this.updateDataSource(source);
  }

  // User Profile
  public getProfile(): UserHealthProfile {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.warn('Failed to parse profile from storage:', e);
    }
    return {
      name: 'Alex Vance',
      mrn: 'VS-849204',
      birthDate: '1988-04-12',
      gender: 'Male',
      bloodType: 'O+',
      units: 'metric'
    };
  }

  public saveProfile(profile: Partial<UserHealthProfile>): UserHealthProfile {
    const current = this.getProfile();
    const updated = { ...current, ...profile };
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('profileUpdated', { detail: updated }));
    return updated;
  }

  // Purge / Reset Everything
  public purgeAllData(): void {
    localStorage.removeItem(STORAGE_KEYS.VITALS);
    localStorage.removeItem(STORAGE_KEYS.BIOMARKERS);
    localStorage.removeItem(STORAGE_KEYS.LAB_REPORTS);
    localStorage.removeItem(STORAGE_KEYS.ACTIVITIES);
    localStorage.removeItem(STORAGE_KEYS.SLEEP);
    localStorage.removeItem(STORAGE_KEYS.SOURCES);
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
    localStorage.removeItem(STORAGE_KEYS.PREFERENCES);
    window.dispatchEvent(new CustomEvent('dataPurged'));
  }
}

export const healthStorage = HealthStorageService.getInstance();
