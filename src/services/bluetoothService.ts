// bluetoothService.ts - Production-Grade Web Bluetooth Architecture

export interface BLELogEntry {
  id: string;
  timestamp: number;
  timeString: string;
  level: 'info' | 'warn' | 'error' | 'data' | 'success';
  message: string;
}

export interface LiveHardwareReading {
  deviceName: string;
  serviceUuid?: string;
  characteristicUuid?: string;
  rawBytes: number[];
  heartRate?: number;
  systolic?: number;
  diastolic?: number;
  spo2?: number;
  batteryLevel?: number;
  contactDetected?: boolean;
  rrIntervals?: number[];
  timestamp: number;
  isSimulated?: boolean;
}

export interface BLEConnectionState {
  connected: boolean;
  deviceName: string;
  isDemo: boolean;
  isConnecting?: boolean;
}

export class BluetoothManager {
  private static instance: BluetoothManager;
  public device: any = null;
  public server: any = null;
  public characteristics: Map<string, any> = new Map();
  public isConnecting: boolean = false;
  public isConnected: boolean = false;
  public isDemoMode: boolean = false;
  
  private listeners: ((reading: LiveHardwareReading) => void)[] = [];
  private connectionListeners: ((state: BLEConnectionState) => void)[] = [];
  private logListeners: ((log: BLELogEntry) => void)[] = [];
  private logs: BLELogEntry[] = [];
  private demoInterval: any = null;

  public static getInstance(): BluetoothManager {
    if (!BluetoothManager.instance) {
      BluetoothManager.instance = new BluetoothManager();
    }
    return BluetoothManager.instance;
  }

  constructor() {
    this.addLog('info', 'Bluetooth Service Initialized. Ready for hardware pairing.');
  }

  // Check if browser/environment supports Web Bluetooth
  public isSupported(): boolean {
    return typeof window !== 'undefined' && window.isSecureContext && typeof navigator !== 'undefined' && 'bluetooth' in navigator;
  }

  public getCompatibilityDetails(): { supported: boolean; reason?: string } {
    if (typeof window === 'undefined') {
      return { supported: false, reason: 'Non-browser environment detected.' };
    }
    if (!window.isSecureContext) {
      return { supported: false, reason: 'Web Bluetooth requires a Secure Context (HTTPS or localhost).' };
    }
    if (!('bluetooth' in navigator)) {
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      if (isSafari || isIOS) {
        return {
          supported: false,
          reason: 'Apple WebKit (Safari on macOS / iOS) does not support Web Bluetooth. Please use Google Chrome, Microsoft Edge, or Opera on Desktop or Android.'
        };
      }
      return {
        supported: false,
        reason: 'Web Bluetooth API is not available in this browser. Please use Chrome or Edge on Desktop / Android over HTTPS.'
      };
    }
    return { supported: true };
  }

  public getLogs(): BLELogEntry[] {
    return [...this.logs];
  }

  public addLog(level: BLELogEntry['level'], message: string) {
    const entry: BLELogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      timestamp: Date.now(),
      timeString: new Date().toLocaleTimeString(),
      level,
      message
    };
    this.logs.unshift(entry);
    if (this.logs.length > 100) this.logs.pop();
    this.logListeners.forEach(fn => fn(entry));
  }

  public onLog(callback: (log: BLELogEntry) => void) {
    this.logListeners.push(callback);
    return () => {
      this.logListeners = this.logListeners.filter(fn => fn !== callback);
    };
  }

  public onData(callback: (reading: LiveHardwareReading) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(fn => fn !== callback);
    };
  }

  public onConnectionChange(callback: (state: BLEConnectionState) => void) {
    this.connectionListeners.push(callback);
    return () => {
      this.connectionListeners = this.connectionListeners.filter(fn => fn !== callback);
    };
  }

  public notifyStateChange() {
    const state: BLEConnectionState = {
      connected: this.isConnected,
      deviceName: this.device?.name || (this.isConnected ? (this.isDemoMode ? 'Demo Polar H10 (Virtual)' : 'Bluetooth Sensor') : 'Disconnected'),
      isDemo: this.isDemoMode,
      isConnecting: this.isConnecting
    };
    this.connectionListeners.forEach(fn => fn(state));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('bluetoothStateChanged', { detail: state }));
    }
  }

  private notifyConnection(connected: boolean, deviceName: string, isDemo: boolean = false) {
    this.isConnected = connected;
    this.isConnecting = false;
    const state: BLEConnectionState = { connected, deviceName, isDemo, isConnecting: false };
    this.connectionListeners.forEach(fn => fn(state));
    
    // Global CustomEvents
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(connected ? 'deviceConnected' : 'deviceDisconnected', {
        detail: { name: deviceName, isDemo }
      }));
      window.dispatchEvent(new CustomEvent('bluetoothStateChanged', {
        detail: state
      }));
    }
  }

  /**
   * Connect to real Bluetooth hardware using standard GATT services or open fallback
   */
  public async connectDevice(customServiceUuid?: string, customCharUuid?: string, namePrefix?: string): Promise<{ success: boolean; deviceName: string; error?: string }> {
    const check = this.getCompatibilityDetails();
    if (!check.supported) {
      const err = check.reason || 'Web Bluetooth unsupported in this browser environment.';
      this.addLog('error', `[Pairing Blocked] ${err}`);
      throw new Error(err);
    }

    if (this.isConnecting) {
      return { success: false, deviceName: '', error: 'Connection already in progress.' };
    }

    this.isConnecting = true;
    this.notifyStateChange();
    this.stopDemoMode();
    this.addLog('info', '[Scanning] Requesting native browser Bluetooth pairing popup...');

    try {
      const nav = navigator as any;

      // Primary standardized medical + generic service UUIDs
      const standardOptionalServices = [
        'heart_rate',
        'blood_pressure',
        'pulse_oximeter',
        'battery_service',
        'device_information',
        'cycling_speed_and_cadence',
        'running_speed_and_cadence',
        'generic_access'
      ];

      if (customServiceUuid && !standardOptionalServices.includes(customServiceUuid)) {
        standardOptionalServices.push(customServiceUuid);
      }

      let requestOptions: any;

      if (namePrefix && namePrefix.trim().length > 0) {
        requestOptions = {
          filters: [{ namePrefix: namePrefix.trim() }],
          optionalServices: standardOptionalServices
        };
      } else if (customServiceUuid) {
        requestOptions = {
          filters: [{ services: [customServiceUuid] }],
          optionalServices: standardOptionalServices
        };
      } else {
        // Open/generic scanner: shows all available BLE peripherals in radio range
        requestOptions = {
          acceptAllDevices: true,
          optionalServices: standardOptionalServices
        };
      }

      this.addLog('info', `[Filters] Request options: ${JSON.stringify(requestOptions)}`);

      // 1. Request device (Opens native browser pairing popup)
      this.device = await nav.bluetooth.requestDevice(requestOptions);
      const devName = this.device.name || 'Unnamed Bluetooth Peripheral';
      this.addLog('success', `[Device Selected] User paired with: ${devName} (ID: ${this.device.id || 'N/A'})`);

      // Handle accidental disconnection
      this.device.addEventListener('gattserverdisconnected', this.onDisconnected.bind(this));

      // 2. Connect to GATT Server
      this.addLog('info', `[GATT Connect] Establishing server connection to ${devName}...`);
      this.server = await this.device.gatt.connect();
      this.addLog('success', `[GATT Connected] Successfully connected to ${devName}.`);

      // 3. Discover primary services and characteristics
      let subscribedCount = 0;

      // A. Try Heart Rate Service (0x180D -> 0x2A37)
      try {
        const hrService = await this.server.getPrimaryService('heart_rate');
        const hrChar = await hrService.getCharacteristic('heart_rate_measurement');
        await hrChar.startNotifications();
        hrChar.addEventListener('characteristicvaluechanged', (e: any) => this.handleHeartRateData(e, devName));
        this.characteristics.set('heart_rate', hrChar);
        subscribedCount++;
        this.addLog('success', '[Service Hooked] Heart Rate Measurement (0x2A37) stream active.');
      } catch (e: any) {
        // Not a heart rate device, continue discovering
      }

      // B. Try Blood Pressure Service (0x1810 -> 0x2A35 / 0x2A36)
      try {
        const bpService = await this.server.getPrimaryService('blood_pressure');
        const bpChar = await bpService.getCharacteristic('intermediate_cuff_pressure');
        await bpChar.startNotifications();
        bpChar.addEventListener('characteristicvaluechanged', (e: any) => this.handleBloodPressureData(e, devName));
        this.characteristics.set('blood_pressure', bpChar);
        subscribedCount++;
        this.addLog('success', '[Service Hooked] Blood Pressure Measurement stream active.');
      } catch (e: any) {
        // Not a BP device, continue
      }

      // C. Try Custom User-Supplied Service & Characteristic
      if (customServiceUuid && customCharUuid) {
        try {
          const customService = await this.server.getPrimaryService(customServiceUuid);
          const customChar = await customService.getCharacteristic(customCharUuid);
          await customChar.startNotifications();
          customChar.addEventListener('characteristicvaluechanged', (e: any) => this.handleGenericData(e, devName, customServiceUuid, customCharUuid));
          this.characteristics.set(customCharUuid, customChar);
          subscribedCount++;
          this.addLog('success', `[Service Hooked] Custom Characteristic ${customCharUuid} stream active.`);
        } catch (err: any) {
          this.addLog('warn', `[Custom GATT Warning] Could not bind ${customCharUuid}: ${err.message}`);
        }
      }

      // D. Try Battery Service (0x180F -> 0x2A19)
      try {
        const batService = await this.server.getPrimaryService('battery_service');
        const batChar = await batService.getCharacteristic('battery_level');
        const batVal = await batChar.readValue();
        const batPct = batVal.getUint8(0);
        this.addLog('info', `[Battery Level] Device battery reporting at ${batPct}%`);
      } catch (e: any) {
        // Optional
      }

      this.isConnecting = false;
      this.notifyConnection(true, devName, false);
      return { success: true, deviceName: devName };

    } catch (error: any) {
      this.isConnecting = false;
      this.notifyStateChange();
      if (error.name === 'NotFoundError') {
        this.addLog('warn', '[User Cancelled] Native Bluetooth pairing popup was cancelled by user.');
        return { success: false, deviceName: '', error: 'Pairing cancelled by user.' };
      }
      this.addLog('error', `[Bluetooth Error] ${error.message || error}`);
      throw error;
    }
  }

  // Handle standard Heart Rate GATT DataView (IEEE 11073 format)
  private handleHeartRateData(event: any, devName: string) {
    const value: DataView = event.target.value;
    const flags = value.getUint8(0);
    const rate16Bits = flags & 0x1;
    let heartRate: number;

    if (rate16Bits) {
      heartRate = value.getUint16(1, /*littleEndian=*/true);
    } else {
      heartRate = value.getUint8(1);
    }

    const contactDetected = (flags & 0x6) === 0x6;
    let offset = rate16Bits ? 3 : 2;
    let energyExpended: number | undefined;
    if (flags & 0x8) {
      energyExpended = value.getUint16(offset, true);
      offset += 2;
    }

    const rrIntervals: number[] = [];
    if (flags & 0x10) {
      while (offset + 1 < value.byteLength) {
        const rr = value.getUint16(offset, true);
        rrIntervals.push(Math.round((rr / 1024) * 1000));
        offset += 2;
      }
    }

    const rawBytes: number[] = [];
    for (let i = 0; i < value.byteLength; i++) {
      rawBytes.push(value.getUint8(i));
    }

    const reading: LiveHardwareReading = {
      deviceName: devName,
      serviceUuid: '0x180D',
      characteristicUuid: '0x2A37',
      rawBytes,
      heartRate,
      contactDetected,
      rrIntervals,
      timestamp: Date.now(),
      isSimulated: false
    };

    this.addLog('data', `[Live HR Packet] ${devName}: ${heartRate} BPM (RR: ${rrIntervals.join(', ') || 'N/A'}ms)`);
    this.broadcastReading(reading);
  }

  // Handle standard Blood Pressure GATT DataView
  private handleBloodPressureData(event: any, devName: string) {
    const value: DataView = event.target.value;
    const systolic = Math.round(value.getFloat32(1, true) || value.getUint8(1));
    const diastolic = Math.round(value.getFloat32(5, true) || value.getUint8(3));

    const rawBytes: number[] = [];
    for (let i = 0; i < value.byteLength; i++) {
      rawBytes.push(value.getUint8(i));
    }

    const reading: LiveHardwareReading = {
      deviceName: devName,
      serviceUuid: '0x1810',
      characteristicUuid: '0x2A35',
      rawBytes,
      systolic,
      diastolic,
      timestamp: Date.now(),
      isSimulated: false
    };

    this.addLog('data', `[Live BP Packet] ${devName}: ${systolic}/${diastolic} mmHg`);
    this.broadcastReading(reading);
  }

  // Handle generic characteristic data stream
  private handleGenericData(event: any, devName: string, serviceUuid: string, charUuid: string) {
    const value: DataView = event.target.value;
    const rawBytes: number[] = [];
    for (let i = 0; i < value.byteLength; i++) {
      rawBytes.push(value.getUint8(i));
    }
    const firstByte = value.getUint8(0);

    const reading: LiveHardwareReading = {
      deviceName: devName,
      serviceUuid,
      characteristicUuid: charUuid,
      rawBytes,
      heartRate: firstByte > 40 && firstByte < 220 ? firstByte : undefined,
      timestamp: Date.now(),
      isSimulated: false
    };

    this.addLog('data', `[Custom GATT Packet] ${charUuid} -> Byte0: ${firstByte} (Length: ${value.byteLength} bytes)`);
    this.broadcastReading(reading);
  }

  private broadcastReading(reading: LiveHardwareReading) {
    this.listeners.forEach(fn => fn(reading));
    
    // Dispatch window event for standalone listeners
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('realDeviceData', { detail: reading }));
    }
  }

  private onDisconnected(event: any) {
    const dev = event.target;
    const name = dev?.name || 'Bluetooth Device';
    this.addLog('warn', `[Disconnected] Hardware disconnected: ${name}`);
    this.notifyConnection(false, name, false);
    this.device = null;
    this.server = null;
    this.characteristics.clear();
  }

  public async disconnect() {
    this.stopDemoMode();
    if (this.device && this.device.gatt?.connected) {
      this.addLog('info', `[Disconnecting] Terminating connection to ${this.device.name}...`);
      this.device.gatt.disconnect();
    }
    this.device = null;
    this.server = null;
    this.characteristics.clear();
    this.notifyConnection(false, 'Disconnected', false);
    this.addLog('info', '[Disconnected] Hardware offline.');
  }

  /**
   * Explicit Demo Mode (clearly flagged as SIMULATED so user can test UI if no physical BLE device is present)
   */
  public startDemoMode(deviceName: string = 'Demo Polar H10 (Virtual)'): void {
    this.disconnect();
    this.isDemoMode = true;
    this.addLog('info', `[DEMO MODE ACTIVATED] Initializing virtual telemetry stream for UI verification (${deviceName}).`);
    this.notifyConnection(true, deviceName, true);

    let step = 0;
    this.demoInterval = setInterval(() => {
      step++;
      const hr = Math.round(135 + Math.sin(step * 0.3) * 8 + (Math.random() * 2 - 1));
      const systolic = Math.round(118 + Math.sin(step * 0.1) * 3);
      const diastolic = Math.round(76 + Math.cos(step * 0.1) * 2);

      const reading: LiveHardwareReading = {
        deviceName,
        rawBytes: [0x10, hr, 0x03, 0x20],
        heartRate: hr,
        systolic,
        diastolic,
        spo2: 98,
        contactDetected: true,
        rrIntervals: [Math.round(60000 / hr)],
        timestamp: Date.now(),
        isSimulated: true
      };

      this.broadcastReading(reading);
    }, 1500);
  }

  public stopDemoMode(): void {
    if (this.demoInterval) {
      clearInterval(this.demoInterval);
      this.demoInterval = null;
    }
    this.isDemoMode = false;
  }
}

export const bluetoothManager = BluetoothManager.getInstance();
