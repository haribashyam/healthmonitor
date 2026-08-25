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
  Terminal
} from 'lucide-react';
import { DataSource, LiveTelemetryPacket } from '../types';
import { liveTelemetryService } from '../services/liveTelemetryService';

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

  const activeStreamingSources = sources.filter((s) => s.connected && s.liveStreamingCapable !== false);

  useEffect(() => {
    // Generate packets periodically for all active sources
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

    return () => clearInterval(interval);
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
    setTimeout(() => setWebhookStatus(null), 4000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Live Stream Telemetry Overview Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 rounded-3xl p-6 border border-slate-800 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <div className="relative flex h-3.5 w-3.5">
              {isStreaming && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              )}
              <span
                className={`relative inline-flex rounded-full h-3.5 w-3.5 ${
                  isStreaming ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              ></span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              Live Multi-Device Telemetry Bridge & Ingestion Engine
            </h2>
          </div>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Continuously aggregates and normalizes real-time biometric feeds from all connected wearables, CGMs, smart scales, Bluetooth GATT sensors, and cloud webhooks into a unified live data stream.
          </p>
        </div>

        {/* Stream Controls */}
        <div className="flex items-center gap-3 bg-slate-950/80 p-2.5 rounded-2xl border border-slate-800">
          <button
            onClick={handleToggleStreaming}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md ${
              isStreaming
                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/25'
                : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
            }`}
          >
            {isStreaming ? (
              <>
                <Pause className="w-3.5 h-3.5" /> Pause Live Feed
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" /> Resume Live Feed
              </>
            )}
          </button>

          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-[11px] font-bold">
            {[
              { ms: 1000, label: '1s Ultra' },
              { ms: 2000, label: '2s Standard' },
              { ms: 5000, label: '5s Balanced' }
            ].map((freq) => (
              <button
                key={freq.ms}
                onClick={() => handleFrequencyChange(freq.ms)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  streamFrequency === freq.ms
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {freq.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4 Ingestion Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Active Live Streams</span>
            <Radio className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">{activeStreamingSources.length} Devices</div>
          <span className="text-[11px] text-emerald-400 font-medium">Broadcasting live telemetry</span>
        </div>

        <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Ingest Throughput</span>
            <Zap className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-400">
            {isStreaming ? (activeStreamingSources.length * (1000 / streamFrequency)).toFixed(1) : '0.0'} pkts/s
          </div>
          <span className="text-[11px] text-slate-400">Real-time socket pipeline</span>
        </div>

        <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Pipeline Latency</span>
            <Wifi className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-purple-400">14 ms</div>
          <span className="text-[11px] text-purple-300">Direct memory buffer</span>
        </div>

        <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Processed Telemetry</span>
            <Database className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white">{packetsProcessed.toLocaleString()}</div>
          <span className="text-[11px] text-slate-400">Verified biometric records</span>
        </div>
      </div>

      {/* Grid of Live Connected Device Feeds */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            Live Device Telemetry Feeds ({activeStreamingSources.length})
          </h3>
          <span className="text-xs text-slate-400">
            Auto-refreshing every {(streamFrequency / 1000).toFixed(1)}s
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeStreamingSources.map((source) => {
            const samplePkt = liveTelemetryService.generateTelemetryPacket(source);
            return (
              <div
                key={source.id}
                className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 space-y-3 shadow-md hover:border-slate-700 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                      {source.name}
                      <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    </h4>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">
                      {source.category} • {source.authType.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    Live Streaming
                  </span>
                </div>

                {/* Live Metrics Strips */}
                <div className="grid grid-cols-2 gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                  {samplePkt.metrics.slice(0, 4).map((m, idx) => (
                    <div key={idx} className="space-y-0.5">
                      <span className="text-[10px] text-slate-400 font-medium block truncate">
                        {m.label}
                      </span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-sm font-black text-white font-mono">{m.value}</span>
                        {m.unit && (
                          <span className="text-[10px] text-cyan-400 font-semibold">{m.unit}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                  <span>Packet ID: {samplePkt.id.slice(0, 16)}...</span>
                  <span className="text-emerald-400 font-medium">{samplePkt.timeString}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Webhook & Telemetry Ingestion Simulator Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Ingest Packet Simulator */}
        <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 space-y-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Send className="w-4 h-4 text-cyan-400" />
              Incoming Live Webhook & API Tester
            </h3>
            <p className="text-xs text-slate-400">
              Simulate external REST webhook payloads or hardware sensor data broadcast into VitalSync's real-time ingestion pipeline.
            </p>
          </div>

          <form onSubmit={handleSendTestWebhook} className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Source Device / App Identifier
              </label>
              <input
                type="text"
                value={testWebhookDevice}
                onChange={(e) => setTestWebhookDevice(e.target.value)}
                placeholder="e.g. Strava Live Webhook, Garmin Push, Dexcom Follow"
                required
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Metric Value
                </label>
                <input
                  type="text"
                  value={testMetricValue}
                  onChange={(e) => setTestMetricValue(e.target.value)}
                  placeholder="e.g. 152 or 104"
                  required
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Unit</label>
                <input
                  type="text"
                  value={testMetricUnit}
                  onChange={(e) => setTestMetricUnit(e.target.value)}
                  placeholder="e.g. bpm, mg/dL, W"
                  required
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:brightness-110 shadow-md shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5" /> Inject Live Ingestion Packet
            </button>
          </form>

          {webhookStatus && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
              <span>{webhookStatus}</span>
            </div>
          )}
        </div>

        {/* Live Packet Ingestion Terminal Log */}
        <div className="bg-slate-950 rounded-3xl p-6 border border-slate-800 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 font-sans">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">Live Ingest Packet Stream</h3>
            </div>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
              Socket 200 OK
            </span>
          </div>

          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
            {recentPackets.map((pkt) => (
              <div
                key={pkt.id}
                className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800/80 space-y-1"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-cyan-400 font-bold">{pkt.sourceName}</span>
                  <span className="text-slate-400 text-[10px]">{pkt.timeString}</span>
                </div>
                <div className="text-[11px] text-slate-300 flex flex-wrap gap-x-3 gap-y-1">
                  {pkt.metrics.map((m, i) => (
                    <span key={i} className="text-slate-300">
                      {m.label}: <strong className="text-white">{m.value}</strong> {m.unit}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
