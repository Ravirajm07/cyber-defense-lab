import React, { useState, useEffect } from 'react';
import { Activity, AlertTriangle, ShieldCheck, ChevronUp, ChevronDown, RefreshCw, Info } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { TelemetryPoint } from '../types';

interface TelemetryMonitorProps {
  currentToolName: string;
  isTriggeringSpike: 'NMAP' | 'FIRECOMPASS_BRUTE' | 'NONE';
  activeLevelId: number;
}

export const TelemetryMonitor: React.FC<TelemetryMonitorProps> = ({
  currentToolName,
  isTriggeringSpike,
  activeLevelId
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [history, setHistory] = useState<TelemetryPoint[]>([]);
  const [currentMetrics, setCurrentMetrics] = useState({
    requests_per_min: 30,
    unique_ports: 1,
    error_404_rate: 0.03
  });

  // Initialize rolling baseline history
  useEffect(() => {
    const initialPoints: TelemetryPoint[] = [];
    for (let i = 24; i >= 0; i--) {
      const now = new Date(Date.now() - i * 3000);
      const timeStr = now.toTimeString().split(' ')[0];
      initialPoints.push({
        time: timeStr,
        minute: i,
        requests_per_min: 28 + Math.round(Math.random() * 5),
        unique_ports: Math.random() > 0.8 ? 2 : 1,
        error_404_rate: 0.02 + Math.random() * 0.02,
        isAnomaly: false
      });
    }
    setHistory(initialPoints);
  }, []);

  // Update telemetry continuously and respond to tool spikes
  useEffect(() => {
    const timer = setInterval(() => {
      setHistory(prev => {
        let req = 28 + Math.random() * 6;
        let ports = Math.random() > 0.85 ? 2 : 1;
        let err404 = 0.02 + Math.random() * 0.02;
        let isAnomaly = false;
        let anomalyType: 'NORMAL' | 'NMAP_SCAN' | 'BRUTE_FORCE' = 'NORMAL';

        // Check active spike triggers
        if (isTriggeringSpike === 'NMAP' || activeLevelId === 7) {
          req = 310 + (Math.random() * 20 - 10);
          ports = 150 + Math.round(Math.random() * 10 - 5);
          err404 = 0.035;
          isAnomaly = true;
          anomalyType = 'NMAP_SCAN';
        } else if (isTriggeringSpike === 'FIRECOMPASS_BRUTE' || activeLevelId === 10) {
          req = 210 + (Math.random() * 15 - 7);
          ports = 2;
          err404 = 0.85 + (Math.random() * 0.04 - 0.02);
          isAnomaly = true;
          anomalyType = 'BRUTE_FORCE';
        } else if (activeLevelId === 1) {
          req = 45 + Math.random() * 10;
          ports = 4;
          err404 = 0.05;
        }

        const now = new Date();
        const timeStr = now.toTimeString().split(' ')[0];

        const newPoint: TelemetryPoint = {
          time: timeStr,
          minute: prev.length,
          requests_per_min: Math.round(req * 10) / 10,
          unique_ports: Math.round(ports),
          error_404_rate: Math.round(err404 * 1000) / 1000,
          isAnomaly,
          anomalyType
        };

        setCurrentMetrics({
          requests_per_min: newPoint.requests_per_min,
          unique_ports: newPoint.unique_ports,
          error_404_rate: newPoint.error_404_rate
        });

        return [...prev.slice(1), newPoint];
      });
    }, 2500);

    return () => clearInterval(timer);
  }, [isTriggeringSpike, activeLevelId]);

  // Derived anomaly flags
  const isNmapSpike = currentMetrics.requests_per_min > 250 && currentMetrics.unique_ports > 100;
  const isBruteSpike = currentMetrics.error_404_rate > 0.60;
  const hasAnyAnomaly = isNmapSpike || isBruteSpike;

  // Chart coordinate mapping
  const width = 600;
  const height = 110;
  const padding = { top: 10, bottom: 20, left: 35, right: 15 };

  const maxReq = 350;
  const maxPorts = 160;

  // Build SVG path for requests_per_min
  const reqPoints = history.map((pt, idx) => {
    const x = padding.left + (idx / (history.length - 1)) * (width - padding.left - padding.right);
    const y = height - padding.bottom - (pt.requests_per_min / maxReq) * (height - padding.top - padding.bottom);
    return `${x},${y}`;
  }).join(' ');

  // Build SVG path for unique_ports
  const portPoints = history.map((pt, idx) => {
    const x = padding.left + (idx / (history.length - 1)) * (width - padding.left - padding.right);
    const y = height - padding.bottom - (pt.unique_ports / maxPorts) * (height - padding.top - padding.bottom);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className={`transition-all duration-300 border-t ${
      hasAnyAnomaly 
        ? 'border-red-500/80 bg-red-950/20 shadow-[0_-4px_25px_rgba(239,68,68,0.2)]' 
        : 'border-slate-800 bg-slate-950/95'
    }`}>
      {/* Telemetry Header Bar */}
      <div className="px-4 py-2 flex items-center justify-between border-b border-slate-800/80 bg-slate-900/60">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${
              hasAnyAnomaly ? 'bg-red-500 animate-ping' : 'bg-cyan-400 animate-pulse'
            }`} />
            <Activity className={`w-4 h-4 ${hasAnyAnomaly ? 'text-red-400' : 'text-cyan-400'}`} />
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200">
              Blue Team Live Telemetry Monitor
            </span>
            <Badge variant="outline" className="text-[10px] font-mono border-slate-700 text-slate-400">
              Target: 45.33.32.156:80
            </Badge>
          </div>

          {hasAnyAnomaly ? (
            <Badge className="bg-red-600/90 text-white font-mono text-[10px] uppercase animate-bounce flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              {isNmapSpike ? 'CRITICAL: Port Sweep Signature Spiking!' : 'ALERT: Directory Brute-Force 404 Burst!'}
            </Badge>
          ) : (
            <Badge className="bg-emerald-950/80 text-emerald-400 border border-emerald-800 text-[10px] font-mono flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              Baseline Traffic (~30 req/min, 0 alerts)
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-slate-400 hidden md:inline">
            Active: <span className="text-orange-400 font-semibold">{currentToolName}</span>
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-7 w-7 p-0 text-slate-400 hover:text-slate-100"
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Expanded Telemetry Body */}
      {isExpanded && (
        <div className="p-4 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          {/* Metric Cards (Left Column) */}
          <div className="lg:col-span-4 grid grid-cols-3 gap-2">
            {/* Metric 1: requests_per_min */}
            <div className={`p-2.5 rounded-lg border transition-all ${
              currentMetrics.requests_per_min > 150 
                ? 'bg-red-950/40 border-red-500/80 ring-1 ring-red-500/50' 
                : 'bg-slate-900/80 border-slate-800'
            }`}>
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>REQ / MIN</span>
                <span className="text-cyan-400 font-bold">Base: ~30</span>
              </div>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className={`text-xl font-bold font-mono ${
                  currentMetrics.requests_per_min > 150 ? 'text-red-400 animate-pulse' : 'text-slate-100'
                }`}>
                  {Math.round(currentMetrics.requests_per_min)}
                </span>
                <span className="text-[10px] font-mono text-slate-400">req/m</span>
              </div>
              <div className="mt-1 flex items-center gap-1 text-[9px] font-mono">
                {currentMetrics.requests_per_min > 150 ? (
                  <span className="text-red-400 font-bold">▲ SPIKE (+{(currentMetrics.requests_per_min - 30).toFixed(0)})</span>
                ) : (
                  <span className="text-emerald-400">✓ In Baseline</span>
                )}
              </div>
            </div>

            {/* Metric 2: unique_ports */}
            <div className={`p-2.5 rounded-lg border transition-all ${
              currentMetrics.unique_ports > 10 
                ? 'bg-orange-950/40 border-orange-500/80 ring-1 ring-orange-500/50' 
                : 'bg-slate-900/80 border-slate-800'
            }`}>
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>PORTS HIT</span>
                <span className="text-orange-400 font-bold">Base: 1-2</span>
              </div>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className={`text-xl font-bold font-mono ${
                  currentMetrics.unique_ports > 10 ? 'text-orange-400 animate-pulse' : 'text-slate-100'
                }`}>
                  {currentMetrics.unique_ports}
                </span>
                <span className="text-[10px] font-mono text-slate-400">ports</span>
              </div>
              <div className="mt-1 flex items-center gap-1 text-[9px] font-mono">
                {currentMetrics.unique_ports > 10 ? (
                  <span className="text-orange-400 font-bold">▲ NMAP SWEEP</span>
                ) : (
                  <span className="text-emerald-400">✓ Clean</span>
                )}
              </div>
            </div>

            {/* Metric 3: error_404_rate */}
            <div className={`p-2.5 rounded-lg border transition-all ${
              currentMetrics.error_404_rate > 0.40 
                ? 'bg-red-950/40 border-red-500/80 ring-1 ring-red-500/50' 
                : 'bg-slate-900/80 border-slate-800'
            }`}>
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>404 ERROR</span>
                <span className="text-pink-400 font-bold">Base: &lt;5%</span>
              </div>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className={`text-xl font-bold font-mono ${
                  currentMetrics.error_404_rate > 0.40 ? 'text-pink-400 animate-pulse' : 'text-slate-100'
                }`}>
                  {(currentMetrics.error_404_rate * 100).toFixed(0)}%
                </span>
              </div>
              <div className="mt-1 flex items-center gap-1 text-[9px] font-mono">
                {currentMetrics.error_404_rate > 0.40 ? (
                  <span className="text-pink-400 font-bold">▲ BRUTE-FORCE</span>
                ) : (
                  <span className="text-emerald-400">✓ Normal</span>
                )}
              </div>
            </div>
          </div>

          {/* Real-time Time Series Chart (Center/Right Column) */}
          <div className="lg:col-span-8 bg-slate-900/90 rounded-lg p-2.5 border border-slate-800 relative">
            <div className="flex items-center justify-between mb-1 px-1 text-[10px] font-mono">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-cyan-400">
                  <span className="w-2.5 h-0.5 bg-cyan-400 inline-block" />
                  requests_per_min (0 - 350)
                </span>
                <span className="flex items-center gap-1 text-orange-400">
                  <span className="w-2.5 h-0.5 bg-orange-400 inline-block" />
                  unique_ports (0 - 160)
                </span>
              </div>
              <span className="text-slate-500">Live 60-second window</span>
            </div>

            {/* SVG Live Chart */}
            <div className="w-full overflow-hidden">
              <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-24 select-none">
                {/* Horizontal Grid lines */}
                <line x1={padding.left} y1={padding.top} x2={width - padding.right} y2={padding.top} stroke="#334155" strokeDasharray="3 3" opacity={0.4} />
                <line x1={padding.left} y1={height / 2} x2={width - padding.right} y2={height / 2} stroke="#334155" strokeDasharray="3 3" opacity={0.4} />
                <line x1={padding.left} y1={height - padding.bottom} x2={width - padding.right} y2={height - padding.bottom} stroke="#475569" opacity={0.8} />

                {/* Y-Axis Labels */}
                <text x={5} y={padding.top + 6} fill="#64748B" fontSize={8} fontFamily="monospace">350</text>
                <text x={5} y={height / 2 + 3} fill="#64748B" fontSize={8} fontFamily="monospace">175</text>
                <text x={5} y={height - padding.bottom} fill="#64748B" fontSize={8} fontFamily="monospace">0</text>

                {/* Shaded Anomaly Region if Active */}
                {hasAnyAnomaly && (
                  <rect
                    x={width - padding.right - 80}
                    y={padding.top}
                    width={80}
                    height={height - padding.top - padding.bottom}
                    fill="rgba(239, 68, 68, 0.15)"
                  />
                )}

                {/* Requests Polyline */}
                <polyline
                  fill="none"
                  stroke={currentMetrics.requests_per_min > 150 ? '#EF4444' : '#06B6D4'}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={reqPoints}
                />

                {/* Ports Polyline */}
                <polyline
                  fill="none"
                  stroke="#F97316"
                  strokeWidth={1.5}
                  strokeDasharray={currentMetrics.unique_ports > 10 ? undefined : '2 2'}
                  points={portPoints}
                />

                {/* Anomaly Indicator Marker on Latest Point */}
                {hasAnyAnomaly && (
                  <circle
                    cx={width - padding.right}
                    cy={height - padding.bottom - (currentMetrics.requests_per_min / maxReq) * (height - padding.top - padding.bottom)}
                    r={4.5}
                    fill="#EF4444"
                    className="animate-ping"
                  />
                )}
              </svg>
            </div>

            {/* Footprint Insight Bar */}
            <div className="mt-1 pt-1 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <Info className="w-3 h-3 text-cyan-400" />
                {activeLevelId === 3 || activeLevelId === 5 || activeLevelId === 6 ? (
                  <span className="text-emerald-400">Passive Recon Tool Active: 0 direct packets transmitted to target. Log remains at resting baseline.</span>
                ) : activeLevelId === 7 ? (
                  <span className="text-red-400 font-bold animate-pulse">Active Nmap Scan: SYN flood across 1000 ports triggers instant multi-port anomaly!</span>
                ) : activeLevelId === 10 ? (
                  <span className="text-pink-400 font-bold animate-pulse">Active Directory Fuzzing: 404 response burst triggers web crawler anomaly!</span>
                ) : (
                  <span>Continuous sensor sampling enabled. Run active tools to simulate detection telemetry.</span>
                )}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

