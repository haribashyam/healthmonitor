import { DataSource, LiveTelemetryPacket, LiveTelemetryMetric } from '../types';

type PacketListener = (packet: LiveTelemetryPacket) => void;

class LiveTelemetryService {
  private static instance: LiveTelemetryService;
  private listeners: Set<PacketListener> = new Set();
  private intervalId: any = null;
  private isStreaming: boolean = true;
  private tickCount: number = 0;
  private totalPacketsProcessed: number = 24190;
  private streamingFrequencyMs: number = 2000;
  private customInjectedPackets: LiveTelemetryPacket[] = [];

  private constructor() {
    this.startStreaming();
  }

  public static getInstance(): LiveTelemetryService {
    if (!LiveTelemetryService.instance) {
      LiveTelemetryService.instance = new LiveTelemetryService();
    }
    return LiveTelemetryService.instance;
  }

  public subscribe(listener: PacketListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public startStreaming(frequencyMs: number = 2000): void {
    this.streamingFrequencyMs = frequencyMs;
    this.isStreaming = true;
    if (this.intervalId) clearInterval(this.intervalId);

    this.intervalId = setInterval(() => {
      if (!this.isStreaming) return;
      this.tickCount++;
      this.totalPacketsProcessed++;
    }, this.streamingFrequencyMs);
  }

  public stopStreaming(): void {
    this.isStreaming = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  public toggleStreaming(): boolean {
    if (this.isStreaming) {
      this.stopStreaming();
      return false;
    } else {
      this.startStreaming(this.streamingFrequencyMs);
      return true;
    }
  }

  public setFrequency(ms: number): void {
    this.streamingFrequencyMs = ms;
    if (this.isStreaming) {
      this.startStreaming(ms);
    }
  }

  public getIsStreaming(): boolean {
    return this.isStreaming;
  }

  public getTotalPackets(): number {
    return this.totalPacketsProcessed;
  }

  public generateTelemetryPacket(source: DataSource): LiveTelemetryPacket {
    const now = Date.now();
    const timeString = new Date(now).toLocaleTimeString();
    const t = this.tickCount;

    let metrics: LiveTelemetryMetric[] = [];

    switch (source.id) {
      case 'strava': {
        const paceSec = 270 + Math.floor(Math.sin(t * 0.4) * 15);
        const mins = Math.floor(paceSec / 60);
        const secs = paceSec % 60;
        const hr = 142 + Math.floor(Math.sin(t * 0.3) * 10);
        metrics = [
          { key: 'pace', label: 'Instant Pace', value: `${mins}:${secs < 10 ? '0' : ''}${secs}`, unit: 'min/km', trend: 'stable' },
          { key: 'hr', label: 'Live Pulse', value: hr, unit: 'bpm', zone: hr > 150 ? 'Zone 3 Aerobic' : 'Zone 2 Base', trend: 'up' },
          { key: 'cadence', label: 'Cadence', value: 174 + (t % 5), unit: 'spm', trend: 'stable' },
          { key: 'elevation', label: 'Ascent Gain', value: 184 + (t % 3), unit: 'm', trend: 'up' }
        ];
        break;
      }
      case 'dexcom_cgm': {
        const baseGluc = 104 + Math.floor(Math.sin(t * 0.2) * 6);
        metrics = [
          { key: 'glucose', label: 'Interstitial Glucose', value: baseGluc, unit: 'mg/dL', delta: '+1.4 mg/dL/min', trend: 'up' },
          { key: 'trend_arrow', label: 'Trend Velocity', value: '↗ Steady Rise', unit: '', trend: 'up' },
          { key: 'time_in_range', label: 'Time In Range (TIR)', value: '96.4%', unit: 'target: >70%', trend: 'stable' },
          { key: 'gmi', label: 'Projected GMI', value: '5.3%', unit: 'HbA1c equiv', trend: 'stable' }
        ];
        break;
      }
      case 'apple_health': {
        const hr = 72 + Math.floor(Math.sin(t * 0.5) * 4);
        metrics = [
          { key: 'hr', label: 'Apple Watch Pulse', value: hr, unit: 'bpm', trend: 'stable' },
          { key: 'steps', label: 'Active Steps', value: 11420 + (t * 2), unit: 'steps', trend: 'up' },
          { key: 'active_cal', label: 'Active Calories', value: 642 + Math.floor(t * 0.5), unit: 'kcal', trend: 'up' },
          { key: 'hrv', label: 'SDNN HRV', value: 58 + (t % 4), unit: 'ms', trend: 'stable' }
        ];
        break;
      }
      case 'garmin': {
        const bodyBat = Math.max(20, 84 - Math.floor(t * 0.1));
        metrics = [
          { key: 'body_battery', label: 'Body Battery', value: bodyBat, unit: '/100', trend: 'down' },
          { key: 'stress', label: 'Live Stress', value: 18 + (t % 8), unit: 'Low Stress', trend: 'stable' },
          { key: 'respiration', label: 'Breathing Rate', value: 14.2, unit: 'brpm', trend: 'stable' },
          { key: 'vo2max', label: 'Estimated VO2 Max', value: 53.8, unit: 'mL/kg/min', trend: 'stable' }
        ];
        break;
      }
      case 'oura': {
        metrics = [
          { key: 'readiness', label: 'Readiness Score', value: 89, unit: '/100', trend: 'stable' },
          { key: 'hrv_rmssd', label: 'Overnight RMSSD', value: 68, unit: 'ms', trend: 'up' },
          { key: 'skin_temp', label: 'Skin Temp Deviation', value: '+0.08', unit: '°C', trend: 'stable' },
          { key: 'rhr', label: 'Lowest Nightly HR', value: 48, unit: 'bpm', trend: 'stable' }
        ];
        break;
      }
      case 'whoop': {
        metrics = [
          { key: 'strain', label: 'Day Strain', value: (14.2 + (t * 0.05)).toFixed(1), unit: '/21', trend: 'up' },
          { key: 'recovery', label: 'Recovery Score', value: '84%', unit: 'Green Zone', trend: 'stable' },
          { key: 'sleep_perf', label: 'Sleep Need', value: '100%', unit: 'Optimal', trend: 'stable' }
        ];
        break;
      }
      case 'eight_sleep': {
        metrics = [
          { key: 'bed_temp', label: 'Pod Temperature', value: '68°F (Level -2)', unit: 'Thermal Auto', trend: 'stable' },
          { key: 'bed_presence', label: 'Bed Presence', value: 'Active', unit: 'Piezo Sensor', trend: 'stable' },
          { key: 'sleep_fitness', label: 'Sleep Fitness Score', value: '94%', unit: 'Optimal', trend: 'up' }
        ];
        break;
      }
      case 'ble_hrm': {
        const hr = 76 + Math.floor(Math.sin(t * 0.8) * 8);
        metrics = [
          { key: 'ecg_hr', label: 'Polar H10 ECG HR', value: hr, unit: 'bpm', trend: 'stable' },
          { key: 'rr_interval', label: 'Instantaneous R-R', value: 812 + (t % 30), unit: 'ms', trend: 'stable' },
          { key: 'battery', label: 'Strap Battery', value: '94%', unit: 'GATT BLE', trend: 'stable' }
        ];
        break;
      }
      case 'withings': {
        metrics = [
          { key: 'weight', label: 'Latest Weight', value: '74.2', unit: 'kg', trend: 'stable' },
          { key: 'body_fat', label: 'Body Fat %', value: '14.6%', unit: 'BIA scan', trend: 'down' },
          { key: 'vascular_age', label: 'Vascular Age', value: '28-32', unit: 'Optimal PWV', trend: 'stable' }
        ];
        break;
      }
      default: {
        // Generic or Custom App/Device
        metrics = [
          { key: 'status', label: 'Data Feed Status', value: 'Active Live Stream', unit: '200 OK', trend: 'stable' },
          { key: 'records', label: 'Telemetry Records', value: source.recordCount + (t % 10), unit: 'items', trend: 'up' },
          { key: 'latency', label: 'Ingest Latency', value: '18ms', unit: 'Cloud Proxy', trend: 'stable' }
        ];
      }
    }

    const packet: LiveTelemetryPacket = {
      id: `pkt-${source.id}-${now}-${t}`,
      sourceId: source.id,
      sourceName: source.name,
      category: source.category,
      timestamp: now,
      timeString,
      metrics,
      status: 'active_stream',
      rssi: -58,
      batteryPct: 88
    };

    // Broadcast to listeners
    this.listeners.forEach((fn) => fn(packet));
    return packet;
  }

  public injectExternalWebhookPayload(
    sourceName: string,
    category: any,
    customMetrics: { key: string; label: string; value: string | number; unit: string }[]
  ): LiveTelemetryPacket {
    const now = Date.now();
    const packet: LiveTelemetryPacket = {
      id: `webhook-${now}`,
      sourceId: `custom-webhook-${now}`,
      sourceName: sourceName || 'Custom API Webhook Stream',
      category: category || 'vitals',
      timestamp: now,
      timeString: new Date(now).toLocaleTimeString(),
      metrics: customMetrics.map((m) => ({
        key: m.key || 'custom_metric',
        label: m.label || 'Metric',
        value: m.value,
        unit: m.unit || '',
        trend: 'stable'
      })),
      status: 'active_stream'
    };

    this.totalPacketsProcessed++;
    this.customInjectedPackets.unshift(packet);
    this.listeners.forEach((fn) => fn(packet));
    return packet;
  }

  public getInjectedPackets(): LiveTelemetryPacket[] {
    return this.customInjectedPackets;
  }
}

export const liveTelemetryService = LiveTelemetryService.getInstance();
