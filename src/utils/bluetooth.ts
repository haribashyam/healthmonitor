import { bluetoothManager, LiveHardwareReading, BluetoothManager } from '../services/bluetoothService';

export interface BLEHeartRateData {
  heartRate: number;
  contactDetected?: boolean;
  energyExpended?: number;
  rrIntervals?: number[];
  systolic?: number;
  diastolic?: number;
  spo2?: number;
  timestamp: number;
  isSimulated?: boolean;
}

export interface BLEConnectionState {
  connected: boolean;
  deviceName: string;
  deviceType: 'heart_rate' | 'blood_pressure' | 'pulse_oximeter' | 'multi_sensor';
  batteryLevel?: number;
  isDemo?: boolean;
}

export class WebBluetoothManager {
  private static instance: WebBluetoothManager;
  private listeners: ((data: BLEHeartRateData) => void)[] = [];
  private connectionListeners: ((state: BLEConnectionState) => void)[] = [];
  private manager: BluetoothManager;

  public static getInstance(): WebBluetoothManager {
    if (!WebBluetoothManager.instance) {
      WebBluetoothManager.instance = new WebBluetoothManager();
    }
    return WebBluetoothManager.instance;
  }

  constructor() {
    this.manager = bluetoothManager;
    
    // Wire live hardware data streams
    this.manager.onData((reading: LiveHardwareReading) => {
      const data: BLEHeartRateData = {
        heartRate: reading.heartRate || 0,
        contactDetected: reading.contactDetected,
        rrIntervals: reading.rrIntervals,
        systolic: reading.systolic,
        diastolic: reading.diastolic,
        spo2: reading.spo2,
        timestamp: reading.timestamp,
        isSimulated: reading.isSimulated
      };
      this.listeners.forEach(fn => fn(data));
    });

    this.manager.onConnectionChange(({ connected, deviceName, isDemo }) => {
      const state: BLEConnectionState = {
        connected,
        deviceName: deviceName || 'Bluetooth Sensor',
        deviceType: 'heart_rate',
        isDemo
      };
      this.connectionListeners.forEach(fn => fn(state));
    });
  }

  public isBluetoothSupported(): boolean {
    return this.manager.isSupported();
  }

  public getCompatibilityDetails() {
    return this.manager.getCompatibilityDetails();
  }

  public onHeartRateData(callback: (data: BLEHeartRateData) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  public onConnectionChange(callback: (state: BLEConnectionState) => void) {
    this.connectionListeners.push(callback);
    return () => {
      this.connectionListeners = this.connectionListeners.filter(l => l !== callback);
    };
  }

  public async connectHeartRateSensor(): Promise<{ success: boolean; deviceName: string; error?: string }> {
    return this.manager.connectDevice('heart_rate', 'heart_rate_measurement');
  }

  public async connectBloodPressureSensor(): Promise<{ success: boolean; deviceName: string; error?: string }> {
    return this.manager.connectDevice('blood_pressure', 'intermediate_cuff_pressure');
  }

  public startSimulation(deviceName: string = 'Demo Polar H10 (Virtual Stream)'): { success: boolean; deviceName: string } {
    this.manager.startDemoMode(deviceName);
    return { success: true, deviceName };
  }

  public stopSimulation() {
    this.manager.stopDemoMode();
  }

  public disconnect() {
    this.manager.disconnect();
  }
}

export const bleManager = WebBluetoothManager.getInstance();
