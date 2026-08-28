import React, { useState, useEffect, useRef } from 'react';
import {
  bluetoothManager,
  BLELogEntry,
  LiveHardwareReading
} from '../services/bluetoothService';
import {
  Bluetooth,
  Terminal,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Play,
  Square,
  RefreshCw,
  Sliders,
  ChevronDown,
  ChevronUp,
  Cpu,
  Layers,
  Info,
  Radio,
  Zap
} from 'lucide-react';

interface HardwareConfigPanelProps {
  theme?: 'dark' | 'light';
  isOpenByDefault?: boolean;
}

export const HardwareConfigPanel: React.FC<HardwareConfigPanelProps> = ({
  theme = 'dark',
  isOpenByDefault = false
}) => {
  const isDark = theme === 'dark';
  const [isExpanded, setIsExpanded] = useState<boolean>(isOpenByDefault);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [activeDeviceName, setActiveDeviceName] = useState<string>('');
  const [isDemoActive, setIsDemoActive] = useState<boolean>(false);

  // Custom GATT scan parameters
  const [customServiceUuid, setCustomServiceUuid] = useState<string>('');
  const [customCharUuid, setCustomCharUuid] = useState<string>('');
  const [namePrefix, setNamePrefix] = useState<string>('');

  // Terminal logs & live bytes
  const [logs, setLogs] = useState<BLELogEntry[]>([]);
  const [lastReading, setLastReading] = useState<LiveHardwareReading | null>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Browser check
  const compat = bluetoothManager.getCompatibilityDetails();

  useEffect(() => {
    setLogs(bluetoothManager.getLogs());

    const unsubLogs = bluetoothManager.onLog((newLog) => {
      setLogs((prev) => [newLog, ...prev.slice(0, 99)]);
    });

    const unsubConn = bluetoothManager.onConnectionChange(({ connected, deviceName, isDemo }) => {
      setIsConnected(connected);
      setActiveDeviceName(deviceName);
      setIsDemoActive(isDemo);
      setIsConnecting(false);
    });

    const unsubData = bluetoothManager.onData((reading) => {
      setLastReading(reading);
    });

    return () => {
      unsubLogs();
      unsubConn();
      unsubData();
    };
  }, []);

  // Auto scroll terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = 0;
    }
  }, [logs]);

  const handleOpenScan = async () => {
    setIsConnecting(true);
    try {
      await bluetoothManager.connectDevice(
        customServiceUuid.trim() || undefined,
        customCharUuid.trim() || undefined,
        namePrefix.trim() || undefined
      );
    } catch (err: any) {
      // Handled in service logs
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    await bluetoothManager.disconnect();
  };

  const handleToggleDemo = () => {
    if (isDemoActive) {
      bluetoothManager.stopDemoMode();
      bluetoothManager.disconnect();
    } else {
      bluetoothManager.startDemoMode('Demo Polar H10 Chest Strap');
    }
  };

  return (
    <div className={`border rounded-none ${isDark ? 'bg-[#141414] border-[#262626]' : 'bg-[#FFFFFF] border-[#D4D4CE]'} shadow-sm overflow-hidden font-mono text-xs`}>
      {/* Header Bar / Collapsible Trigger */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className={`px-4 py-3 cursor-pointer flex items-center justify-between transition-colors border-b ${
          isDark ? 'border-zinc-800 hover:bg-zinc-900/60' : 'border-zinc-200 hover:bg-zinc-50'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div className={`p-1.5 rounded-none ${isConnected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-[#CC0000]/20 text-[#CC0000]'}`}>
            <Bluetooth className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`font-bold tracking-wider uppercase ${isDark ? 'text-zinc-100' : 'text-zinc-900'}`}>
                Web Bluetooth Hardware Console & GATT Debugger
              </span>
              {isConnected && (
                <span className={`text-[10px] px-2 py-0.2 font-bold uppercase tracking-wider ${
                  isDemoActive
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                }`}>
                  {isDemoActive ? '● SIMULATED DEMO' : `● CONNECTED: ${activeDeviceName}`}
                </span>
              )}
              {!isConnected && (
                <span className="text-[10px] px-2 py-0.2 font-bold uppercase tracking-wider bg-zinc-800 text-zinc-400 border border-zinc-700">
                  ○ STANDBY / READY
                </span>
              )}
            </div>
            <p className={`text-[11px] font-sans ${isDark ? 'text-zinc-400' : 'text-zinc-600'} mt-0.5`}>
              Native GATT Services (0x180D HR, 0x1810 BP, Battery) • Real DataView byte parsing
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className={`p-1 text-zinc-400 hover:text-zinc-200`}
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-4 space-y-4">
          
          {/* Compatibility Alert if unsupported */}
          {!compat.supported && (
            <div className="p-3 bg-amber-950/30 border border-amber-500/40 text-amber-300 font-sans text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 text-amber-400 mt-0.5" />
              <div>
                <strong className="font-bold font-mono uppercase block">Browser Web Bluetooth Limitation:</strong>
                <p className="mt-0.5">{compat.reason}</p>
                <p className="mt-1 text-[11px] text-amber-400/80">
                  Tip: You can still click <strong>"Test UI with Demo Stream"</strong> below to safely test charts and telemetry processing without physical hardware.
                </p>
              </div>
            </div>
          )}

          {/* Controls & Configuration Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-sans">
            <div>
              <label className="block text-[10px] font-mono font-semibold uppercase text-zinc-400 mb-1">
                Custom Service UUID (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. 0x180D or heart_rate"
                value={customServiceUuid}
                onChange={(e) => setCustomServiceUuid(e.target.value)}
                className={`w-full px-2.5 py-1.5 text-xs font-mono border ${
                  isDark ? 'bg-zinc-900 border-zinc-700 text-zinc-100' : 'bg-zinc-50 border-zinc-300 text-zinc-900'
                } outline-none focus:border-red-500`}
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono font-semibold uppercase text-zinc-400 mb-1">
                Custom Characteristic UUID
              </label>
              <input
                type="text"
                placeholder="e.g. 0x2A37 (heart_rate_measurement)"
                value={customCharUuid}
                onChange={(e) => setCustomCharUuid(e.target.value)}
                className={`w-full px-2.5 py-1.5 text-xs font-mono border ${
                  isDark ? 'bg-zinc-900 border-zinc-700 text-zinc-100' : 'bg-zinc-50 border-zinc-300 text-zinc-900'
                } outline-none focus:border-red-500`}
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono font-semibold uppercase text-zinc-400 mb-1">
                Device Name Filter Prefix
              </label>
              <input
                type="text"
                placeholder="e.g. Polar, Garmin, Wahoo"
                value={namePrefix}
                onChange={(e) => setNamePrefix(e.target.value)}
                className={`w-full px-2.5 py-1.5 text-xs font-mono border ${
                  isDark ? 'bg-zinc-900 border-zinc-700 text-zinc-100' : 'bg-zinc-50 border-zinc-300 text-zinc-900'
                } outline-none focus:border-red-500`}
              />
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-zinc-800">
            <div className="flex flex-wrap items-center gap-2">
              {!isConnected ? (
                <button
                  type="button"
                  onClick={handleOpenScan}
                  disabled={isConnecting || !compat.supported}
                  className={`px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
                    !compat.supported
                      ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700'
                      : isConnecting
                      ? 'bg-zinc-700 text-white cursor-wait'
                      : 'bg-[#CC0000] text-white hover:bg-red-700 shadow-sm'
                  }`}
                >
                  {isConnecting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Scanning for Devices...
                    </>
                  ) : (
                    <>
                      <Radio className="w-3.5 h-3.5" />
                      Pair Hardware (Web Bluetooth)
                    </>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleDisconnect}
                  className="px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider bg-zinc-800 text-red-400 border border-red-500/40 hover:bg-zinc-700 flex items-center gap-1.5"
                >
                  <Square className="w-3.5 h-3.5" />
                  Disconnect {activeDeviceName}
                </button>
              )}

              {/* Demo Mode Toggle Button */}
              <button
                type="button"
                onClick={handleToggleDemo}
                className={`px-3 py-2 text-xs font-mono font-semibold border flex items-center gap-1.5 transition-colors ${
                  isDemoActive
                    ? 'bg-amber-950/40 border-amber-500/50 text-amber-300 hover:bg-amber-900/50'
                    : isDark ? 'border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800' : 'border-zinc-300 bg-zinc-100 text-zinc-800 hover:bg-zinc-200'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                {isDemoActive ? 'Stop Demo Stream' : 'Test UI with Demo Stream'}
              </button>
            </div>

            {/* Quick Live Telemetry Stamp */}
            {lastReading && (
              <div className="flex items-center gap-3 text-[11px] font-mono">
                {lastReading.heartRate && (
                  <span className="flex items-center gap-1 text-red-400 font-bold">
                    <Activity className="w-3.5 h-3.5" />
                    {lastReading.heartRate} BPM
                  </span>
                )}
                {lastReading.systolic && (
                  <span className="text-zinc-300 font-bold">
                    {lastReading.systolic}/{lastReading.diastolic} mmHg
                  </span>
                )}
                <span className="text-zinc-500 text-[10px]">
                  Raw: [{lastReading.rawBytes.slice(0, 4).join(', ')}]
                </span>
              </div>
            )}
          </div>

          {/* Terminal Log Box */}
          <div className="space-y-1.5 pt-2">
            <div className="flex items-center justify-between text-[10px] text-zinc-400">
              <span className="flex items-center gap-1 font-bold uppercase tracking-wider text-zinc-300">
                <Terminal className="w-3 h-3 text-red-500" />
                Live Hardware Diagnostic Stream
              </span>
              <span>{logs.length} events logged</span>
            </div>

            <div
              ref={terminalRef}
              className={`h-36 overflow-y-auto p-2.5 border font-mono text-[11px] leading-relaxed space-y-1 ${
                isDark ? 'bg-black/90 border-zinc-800 text-zinc-300' : 'bg-zinc-900 border-zinc-800 text-zinc-200'
              }`}
            >
              {logs.length === 0 ? (
                <div className="text-zinc-600 italic">No hardware events recorded yet. Click "Pair Hardware" or "Test UI" to begin.</div>
              ) : (
                logs.map((log) => {
                  let color = 'text-zinc-300';
                  if (log.level === 'error') color = 'text-red-400 font-bold';
                  if (log.level === 'warn') color = 'text-amber-400';
                  if (log.level === 'success') color = 'text-emerald-400 font-bold';
                  if (log.level === 'data') color = 'text-cyan-300';

                  return (
                    <div key={log.id} className="flex items-start gap-2">
                      <span className="text-zinc-500 text-[10px] flex-shrink-0">[{log.timeString}]</span>
                      <span className={color}>{log.message}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
