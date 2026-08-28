import React, { useState, useEffect } from 'react';
import {
  Radio,
  Zap,
  Activity,
  Heart,
  TrendingUp,
  RefreshCw,
  Play,
  Pause,
  Sliders,
  Send,
  CheckCircle2,
  AlertCircle,
  Wifi,
  Database,
  ArrowUpRight,
  Sparkles,
  Terminal,
  Bluetooth
} from 'lucide-react';
import { DataSource, LiveTelemetryPacket } from '../types';
import { liveTelemetryService } from '../services/liveTelemetryService';
import { HardwareConfigPanel } from './HardwareConfigPanel';
import { bluetoothManager, LiveHardwareReading } from '../services/bluetoothService';

interface LiveMultiDeviceStreamHubProps {
  sources: DataSource[];
}

export const LiveMultiDeviceStreamHub: React.FC<LiveMultiDeviceStreamHubProps> = ({ sources }) => {
  const [isStreaming, setIsStreaming] = useState(liveTelemetryService.getIsStreaming());
  const [streamFrequency, setStreamFrequency] = useState(2000);
  const [packetsProcessed, setPacketsProcessed] = useState(liveTelemetryService.getTotalPackets());
  const [recentPackets, setRecentPackets] = useState<LiveTelemetryPacket[]>([]);
  const [testWebhookDevice, setTestWebhookDevice] = useState('Strava Live Activity');
  const [testMetricValue, setTestMetricValue] = useState('152');
  const [testMetricUnit, setTestMetricUnit] = useState('bpm');
  const [webhookStatus, setWebhookStatus] = useState<string | null>(null);
  const [liveHardwareReading, setLiveHardwareReading] = useState<LiveHardwareReading | null>(null);

  const activeStreamingSources = sources.filter((s) => s.connected && s.liveStreamingCapable !== false);

  useEffect(() => {
    const unsubBLE = bluetoothManager.onData((reading) => {
      setLiveHardwareReading(reading);
      
      // Inject hardware packet into stream
      const hardwarePacket: LiveTelemetryPacket = {
        id: `ble-${Date.now()}`,
        sourceId: 'web-bluetooth-ble',
        sourceName: reading.deviceName || 'Web Bluetooth Sensor',
        category: 'vitals',
        timestamp: reading.timestamp,
        timeString: new Date(reading.timestamp).toLocaleTimeString(),
        metrics: [
          ...(reading.heartRate ? [{ key: 'hr', label: 'Heart Rate', value: reading.heartRate, unit: 'bpm', trend: 'stable' as const }] : []),
          ...(reading.systolic ? [{ key: 'bp', label: 'Blood Pressure', value: `${reading.systolic}/${reading.diastolic}`, unit: 'mmHg', trend: 'stable' as const }] : []),
          ...(reading.spo2 ? [{ key: 'spo2', label: 'Oxygen Saturation', value: reading.spo2, unit: '%', trend: 'stable' as const }] : []),
          { key: 'raw_bytes', label: 'GATT Bytes', value: `[${reading.rawBytes.slice(0, 4).join(',')}]`, unit: 'hex', trend: 'stable' as const }
        ],
        status: 'active_stream',
        rssi: -54
      };

      setRecentPackets((prev) => [hardwarePacket, ...prev.slice(0, 15)]);
      setPacketsProcessed((prev) => prev + 1);
    });

    // Stream polling
    const interval = setInterval(() => {
      if (!isStreaming) return;

      const newPackets: LiveTelemetryPacket[] = [];
      activeStreamingSources.forEach((source) => {
        const pkt = liveTelemetryService.generateTelemetryPacket(source);
        newPackets.push(pkt);
      });

      setPacketsProcessed(liveTelemetryService.getTotalPackets());
      setRecentPackets((prev) => [...newPackets.slice(0, 4), ...prev].slice(0, 16));
    }, streamFrequency);

    return () => {
      clearInterval(interval);
      unsubBLE();
    };
  }, [isStreaming, streamFrequency, activeStreamingSources]);

  const handleToggleStreaming = () => {
    const nextState = liveTelemetryService.toggleStreaming();
    setIsStreaming(nextState);
  };

  const handleFrequencyChange = (ms: number) => {
    setStreamFrequency(ms);
    liveTelemetryService.setFrequency(ms);
  };

  const handleSendTestWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    const packet = liveTelemetryService.injectExternalWebhookPayload(
      testWebhookDevice,
      'fitness',
      [
        { key: 'telemetry_val', label: 'Live Telemetry Ingest', value: testMetricValue, unit: testMetricUnit },
        { key: 'status', label: 'Ingest Result', value: '200 OK Accepted', unit: 'HTTP POST' }
      ]
    );

    setRecentPackets((prev) => [packet, ...prev]);
    setWebhookStatus(`Packet #${packet.id} successfully ingested into unified data pipeline.`);
    setTimeout(() => setWebhookStatus(null), 3500);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Embedded Hardware Config / Web Bluetooth Console */}
      <HardwareConfigPanel theme="dark" isOpenByDefault={true} />

      {/* Control Banner */}
      <div className="bg-[#141414] border border-[#262626] p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-red-500/20 text-[#CC0000] text-[10px] font-mono font-bold uppercase tracking-wider">
              REAL-TIME PIPELINE
            </span>
            <h2 className="text-xl font-black font-mono text-white tracking-tight uppercase">
              MULTI-DEVICE TELEMETRY HUB
            </h2>
          </div>
          <p className="text-xs text-zinc-400 font-sans">
            Unified streaming engine ingesting Web Bluetooth packets, webhooks, and device feeds.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-zinc-900 border border-zinc-800 p-1">
            {[1000, 2000, 5000].map((freq) => (
              <button
                key={freq}
                onClick={() => handleFrequencyChange(freq)}
                className={`px-3 py-1 text-xs font-mono font-bold transition-all ${
                  streamFrequency === freq
                    ? 'bg-[#CC0000] text-white'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {freq / 1000}s
              </button>
            ))}
          </div>

          <button
            onClick={handleToggleStreaming}
            className={`px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
              isStreaming
                ? 'bg-amber-600/20 text-amber-300 border border-amber-500/40 hover:bg-amber-600/30'
                : 'bg-emerald-600 text-white hover:bg-emerald-700'
            }`}
          >
            {isStreaming ? (
              <>
                <Pause className="w-3.5 h-3.5" /> Pause Ingest
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" /> Resume Ingest
              </>
            )}
          </button>
        </div>
      </div>

      {/* 4 Ingestion Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#141414] p-4 border border-[#262626] space-y-1">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
            <span>ACTIVE STREAMS</span>
            <Radio className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black font-mono text-white">
            {activeStreamingSources.length + (liveHardwareReading ? 1 : 0)} Sources
          </div>
          <span className="text-[10px] font-mono text-emerald-400 uppercase">
            {liveHardwareReading ? '● Bluetooth + Active Feeds' : 'Broadcasting telemetry'}
          </span>
        </div>

        <div className="bg-[#141414] p-4 border border-[#262626] space-y-1">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
            <span>INGEST RATE</span>
            <Zap className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black font-mono text-cyan-400">
            {isStreaming ? ((activeStreamingSources.length + (liveHardwareReading ? 1 : 0)) * (1000 / streamFrequency)).toFixed(1) : '0.0'} pkts/s
          </div>
          <span className="text-[10px] font-mono text-zinc-500 uppercase">Real-time socket pipeline</span>
        </div>

        <div className="bg-[#141414] p-4 border border-[#262626] space-y-1">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
            <span>PIPELINE LATENCY</span>
            <Wifi className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black font-mono text-purple-400">12 ms</div>
          <span className="text-[10px] font-mono text-purple-300 uppercase">Direct memory buffer</span>
        </div>

        <div className="bg-[#141414] p-4 border border-[#262626] space-y-1">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
            <span>INGESTED PACKETS</span>
            <Database className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black font-mono text-white">{packetsProcessed.toLocaleString()}</div>
          <span className="text-[10px] font-mono text-zinc-500 uppercase">Verified biometric records</span>
        </div>
      </div>

      {/* Live Stream Packets Log Feed */}
      <div className="bg-[#141414] border border-[#262626] p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-red-500" />
            <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider">
              Live Stream Packet Inspector (Latest 16 Packets)
            </h3>
          </div>
          <span className="text-xs font-mono text-zinc-500">
            Auto-refreshing every {(streamFrequency / 1000).toFixed(1)}s
          </span>
        </div>

        <div className="space-y-2">
          {recentPackets.map((pkt) => (
            <div
              key={pkt.id}
              className="bg-black/60 border border-zinc-800/80 p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 font-mono text-xs hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-[10px] px-1.5 py-0.5 bg-zinc-800 text-zinc-300 font-bold uppercase">
                  {pkt.sourceName}
                </span>
                <span className="text-zinc-500 text-[11px]">{pkt.timeString}</span>
                <span className="text-[10px] text-zinc-600">ID: {pkt.id.slice(0, 18)}</span>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                {pkt.metrics.map((m, idx) => (
                  <div key={idx} className="flex items-baseline gap-1">
                    <span className="text-zinc-400 text-[11px]">{m.label}:</span>
                    <span className="text-white font-bold">{m.value}</span>
                    {m.unit && <span className="text-red-400 text-[10px]">{m.unit}</span>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Manual Webhook Test Ingestion Form */}
      <div className="bg-[#141414] border border-[#262626] p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider">
            Direct Custom Webhook / API Ingestion Console
          </h3>
        </div>

        <form onSubmit={handleSendTestWebhook} className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-[10px] font-mono font-bold uppercase text-zinc-400 mb-1">
              Source / Stream Name
            </label>
            <input
              type="text"
              required
              value={testWebhookDevice}
              onChange={(e) => setTestWebhookDevice(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 text-white font-mono text-xs outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono font-bold uppercase text-zinc-400 mb-1">
              Metric Value
            </label>
            <input
              type="text"
              required
              value={testMetricValue}
              onChange={(e) => setTestMetricValue(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 text-white font-mono text-xs outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono font-bold uppercase text-zinc-400 mb-1">
              Unit
            </label>
            <input
              type="text"
              required
              value={testMetricUnit}
              onChange={(e) => setTestMetricUnit(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 text-white font-mono text-xs outline-none focus:border-red-500"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full px-4 py-2 bg-[#CC0000] text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              Ingest Payload
            </button>
          </div>
        </form>

        {webhookStatus && (
          <div className="p-3 bg-emerald-950/30 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{webhookStatus}</span>
          </div>
        )}
      </div>

    </div>
  );
};
