import React, { useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { 
  Brain, 
  BarChart3, 
  Cpu, 
  ShieldAlert, 
  ShieldCheck, 
  Sliders, 
  Code2, 
  Copy, 
  Check, 
  Sparkles, 
  AlertTriangle, 
  TrendingUp, 
  GitFork, 
  Activity, 
  ChevronRight, 
  Layers,
  ArrowRight
} from 'lucide-react';
import { generate120MinDataset, evaluateStealthAttack } from '../data/bossData';
import { GOOGLE_COLAB_SCRIPT } from '../data/labData';
import { BossDataPoint } from '../types';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Slider } from './ui/slider';
import { sound } from '../lib/audio';

interface BossLevelProps {
  onCompleteBoss: () => void;
  isBossCompleted: boolean;
  onOpenColabModal: () => void;
}

export const BossLevel: React.FC<BossLevelProps> = ({
  onCompleteBoss,
  isBossCompleted,
  onOpenColabModal
}) => {
  // Step completion states
  const [step1Done, setStep1Done] = useState(false);
  const [step2Done, setStep2Done] = useState(false);
  const [step3Tested, setStep3Tested] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Active view toggle on chart
  const [chartMetric, setChartMetric] = useState<'requests' | 'ports' | '404'>('requests');

  // Stealth challenge interactive sliders
  const [stealthReq, setStealthReq] = useState<number>(40);
  const [stealthPorts, setStealthPorts] = useState<number>(25);
  const [stealth404, setStealth404] = useState<number>(10);

  // Generate 120-minute server log dataset
  const dataset = useMemo(() => generate120MinDataset(), []);

  // Evaluate stealth scenario dynamically
  const stealthResult = useMemo(
    () => evaluateStealthAttack(stealthReq, stealthPorts, stealth404),
    [stealthReq, stealthPorts, stealth404]
  );

  // Step 1: Compute Rolling Statistics
  const handleComputeRolling = () => {
    sound.playKeypress();
    setStep1Done(true);
    sound.playSuccess();
  };

  // Step 2: Train Isolation Forest
  const handleTrainEnsemble = () => {
    sound.playKeypress();
    setStep2Done(true);
    sound.playAlert();
    setTimeout(() => {
      sound.playSuccess();
    }, 600);
  };

  // Step 3: Test Stealth Attack
  const handleTestStealth = () => {
    sound.playKeypress();
    setStep1Done(true);
    setStep2Done(true);
    setStep3Tested(true);
    if (!isBossCompleted) {
      onCompleteBoss();
      sound.playLevelUp();
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.5 }
      });
    }
  };

  const handleCopyColab = () => {
    navigator.clipboard.writeText(GOOGLE_COLAB_SCRIPT);
    setCopiedCode(true);
    sound.playSuccess();
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // SVG Chart rendering helpers
  const svgWidth = 840;
  const svgHeight = 220;
  const padding = { top: 20, bottom: 35, left: 45, right: 25 };

  // Determine max values based on selected metric
  const getMaxVal = () => {
    if (chartMetric === 'requests') return 360;
    if (chartMetric === 'ports') return 160;
    return 1.0; // 100% 404
  };

  const maxVal = getMaxVal();

  const getMetricVal = (p: BossDataPoint) => {
    if (chartMetric === 'requests') return p.requests_per_min;
    if (chartMetric === 'ports') return p.unique_ports;
    return p.error_404_rate;
  };

  const getRollingVal = (p: BossDataPoint) => {
    if (chartMetric === 'requests') return p.rolling_mean_req;
    if (chartMetric === 'ports') return p.rolling_mean_ports;
    return p.rolling_mean_404;
  };

  // Main data line path
  const dataPolyline = dataset.map((p, idx) => {
    const x = padding.left + (idx / (dataset.length - 1)) * (svgWidth - padding.left - padding.right);
    const val = getMetricVal(p);
    const y = svgHeight - padding.bottom - (val / maxVal) * (svgHeight - padding.top - padding.bottom);
    return `${x},${y}`;
  }).join(' ');

  // Rolling mean line path
  const rollingPolyline = dataset.map((p, idx) => {
    const x = padding.left + (idx / (dataset.length - 1)) * (svgWidth - padding.left - padding.right);
    const val = getRollingVal(p);
    const y = svgHeight - padding.bottom - (val / maxVal) * (svgHeight - padding.top - padding.bottom);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="w-full space-y-6 font-mono">
      {/* Boss Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-cyan-950/40 to-slate-950 rounded-xl p-5 border border-cyan-500/60 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-cyan-950 text-cyan-300 border border-cyan-500 font-mono text-[10px] uppercase flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5 text-cyan-400" />
                FINAL DEFENSIVE BOSS LEVEL
              </Badge>
              <Badge variant="outline" className="text-[10px] font-mono border-slate-700 text-slate-300">
                120-Minute Telemetry Stream
              </Badge>
              <Badge variant="outline" className="text-[10px] font-mono border-purple-500/40 text-purple-300 bg-purple-950/30">
                100-Tree Isolation Forest Ensemble
              </Badge>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
              Time-Series Feature Engineering & Multi-Dimensional Anomaly Detection
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-4xl font-sans leading-relaxed">
              Analyze the complete 120-minute server log stream containing Level 7 (Nmap Port Scan) and Level 10 (FireCompass Directory Brute-Force). Compute rolling statistical deviations and train an unsupervised 100-tree Isolation Forest ensemble to isolate both active attacks and evasive slow-and-low stealth scans.
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2 bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-slate-400">Boss Mastery:</span>
              <span className="text-yellow-300 font-bold">
                {isBossCompleted ? '100 / 100 XP (CONQUERED)' : 'In Progress'}
              </span>
            </div>

            <Button
              size="sm"
              onClick={handleCopyColab}
              className="bg-cyan-600 hover:bg-cyan-500 text-black font-bold text-xs gap-1.5 shadow"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Colab Script Copied!' : 'Copy Colab Script'}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main 120-Minute Interactive Telemetry Dashboard */}
      <div className="bg-slate-900/90 rounded-xl p-4 sm:p-5 border border-slate-800 shadow-xl space-y-4">
        {/* Chart Header & Controls */}
        <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-800 gap-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span className="text-xs sm:text-sm font-bold text-slate-100 uppercase">
              120-Minute Production Server Telemetry (10:00 to 12:00)
            </span>
          </div>

          {/* Metric Selector Pills */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => { sound.playKeypress(); setChartMetric('requests'); }}
              className={`px-2.5 py-1 rounded text-xs transition-colors ${
                chartMetric === 'requests'
                  ? 'bg-cyan-600 text-white font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              requests_per_min
            </button>
            <button
              onClick={() => { sound.playKeypress(); setChartMetric('ports'); }}
              className={`px-2.5 py-1 rounded text-xs transition-colors ${
                chartMetric === 'ports'
                  ? 'bg-orange-600 text-white font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              unique_ports (Nmap)
            </button>
            <button
              onClick={() => { sound.playKeypress(); setChartMetric('404'); }}
              className={`px-2.5 py-1 rounded text-xs transition-colors ${
                chartMetric === '404'
                  ? 'bg-pink-600 text-white font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              error_404_rate (FireCompass)
            </button>
          </div>
        </div>

        {/* Big Interactive SVG Time-Series Chart */}
        <div className="w-full overflow-x-auto bg-slate-950/90 rounded-lg p-2 border border-slate-800/80">
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full min-w-[700px] h-52 select-none">
            {/* Grid Lines */}
            <line x1={padding.left} y1={padding.top} x2={svgWidth - padding.right} y2={padding.top} stroke="#1E293B" strokeDasharray="3 3" />
            <line x1={padding.left} y1={(svgHeight - padding.bottom + padding.top) / 2} x2={svgWidth - padding.right} y2={(svgHeight - padding.bottom + padding.top) / 2} stroke="#1E293B" strokeDasharray="3 3" />
            <line x1={padding.left} y1={svgHeight - padding.bottom} x2={svgWidth - padding.right} y2={svgHeight - padding.bottom} stroke="#334155" />

            {/* Y-Axis Scale Labels */}
            <text x={8} y={padding.top + 5} fill="#64748B" fontSize={9} fontFamily="monospace">
              {chartMetric === '404' ? '100%' : maxVal}
            </text>
            <text x={8} y={(svgHeight - padding.bottom + padding.top) / 2 + 3} fill="#64748B" fontSize={9} fontFamily="monospace">
              {chartMetric === '404' ? '50%' : Math.round(maxVal / 2)}
            </text>
            <text x={8} y={svgHeight - padding.bottom} fill="#64748B" fontSize={9} fontFamily="monospace">
              0
            </text>

            {/* X-Axis Timeline Markers (10:00, 10:30, 11:00, 11:30, 12:00) */}
            <text x={padding.left} y={svgHeight - 12} fill="#64748B" fontSize={9} fontFamily="monospace">10:00 (Baseline)</text>
            <text x={padding.left + (30 / 119) * (svgWidth - padding.left - padding.right) - 15} y={svgHeight - 12} fill="#F97316" fontSize={9} fontFamily="monospace">10:30 (Nmap)</text>
            <text x={padding.left + (60 / 119) * (svgWidth - padding.left - padding.right) - 15} y={svgHeight - 12} fill="#64748B" fontSize={9} fontFamily="monospace">11:00</text>
            <text x={padding.left + (75 / 119) * (svgWidth - padding.left - padding.right) - 20} y={svgHeight - 12} fill="#EC4899" fontSize={9} fontFamily="monospace">11:15 (BruteForce)</text>
            <text x={svgWidth - padding.right - 40} y={svgHeight - 12} fill="#64748B" fontSize={9} fontFamily="monospace">12:00</text>

            {/* Shaded Regions for Ground Truth Attack Windows */}
            {/* Case Study 1: Nmap (10:30 to 10:34 -> indices 30 to 34) */}
            <rect
              x={padding.left + (30 / 119) * (svgWidth - padding.left - padding.right)}
              y={padding.top}
              width={(5 / 119) * (svgWidth - padding.left - padding.right)}
              height={svgHeight - padding.top - padding.bottom}
              fill="rgba(249, 115, 22, 0.15)"
              stroke="#F97316"
              strokeDasharray="2 2"
              strokeWidth={1}
            />

            {/* Case Study 2: FireCompass Directory Brute-Force (11:15 to 11:19 -> indices 75 to 79) */}
            <rect
              x={padding.left + (75 / 119) * (svgWidth - padding.left - padding.right)}
              y={padding.top}
              width={(5 / 119) * (svgWidth - padding.left - padding.right)}
              height={svgHeight - padding.top - padding.bottom}
              fill="rgba(236, 72, 153, 0.15)"
              stroke="#EC4899"
              strokeDasharray="2 2"
              strokeWidth={1}
            />

            {/* Step 1: Rolling Mean Curve (Visible after clicking Step 1) */}
            {step1Done && (
              <polyline
                fill="none"
                stroke="#A855F7"
                strokeWidth={2}
                strokeDasharray="4 2"
                points={rollingPolyline}
              />
            )}

            {/* Raw Telemetry Data Polyline */}
            <polyline
              fill="none"
              stroke={chartMetric === 'requests' ? '#06B6D4' : chartMetric === 'ports' ? '#F97316' : '#EC4899'}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              points={dataPolyline}
            />

            {/* Step 2: Isolation Forest Detected Anomaly Markers (Visible after Step 2) */}
            {step2Done && dataset.map((p, idx) => {
              if (!p.predicted_anomaly) return null;
              const x = padding.left + (idx / (dataset.length - 1)) * (svgWidth - padding.left - padding.right);
              const val = getMetricVal(p);
              const y = svgHeight - padding.bottom - (val / maxVal) * (svgHeight - padding.top - padding.bottom);

              return (
                <g key={`anomaly-${idx}`}>
                  <circle
                    cx={x}
                    cy={y}
                    r={5}
                    fill="#EF4444"
                    stroke="#FFFFFF"
                    strokeWidth={1.5}
                    className="animate-pulse"
                  />
                  <circle
                    cx={x}
                    cy={y}
                    r={9}
                    fill="none"
                    stroke="#EF4444"
                    strokeWidth={1}
                    opacity={0.6}
                    className="animate-ping"
                  />
                </g>
              );
            })}
          </svg>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-1">
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <span className="w-3 h-0.5 bg-cyan-400 inline-block" />
              Raw Metric Stream (X_t)
            </span>
            {step1Done && (
              <span className="flex items-center gap-1.5 text-purple-400">
                <span className="w-3 h-0.5 bg-purple-400 border-dashed border-b inline-block" />
                5-Min Rolling Mean (μ_t)
              </span>
            )}
            {step2Done && (
              <span className="flex items-center gap-1.5 text-red-400 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
                Detected Attack Anomaly (100-Tree Forest)
              </span>
            )}
          </div>
          <span className="text-slate-500">120 Data Points • Resolution: 1 min</span>
        </div>
      </div>

      {/* 4 Interactive Laboratory Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* ========================================================================= */}
        {/* STEP 1: COMPUTE ROLLING MEAN & DEVIATION */}
        {/* ========================================================================= */}
        <div className={`p-4 rounded-xl border transition-all ${
          step1Done ? 'bg-slate-900/80 border-purple-500/60 ring-1 ring-purple-500/30' : 'bg-slate-900/50 border-slate-800'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase font-bold text-purple-400 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-purple-400" />
              Step 1: 5-Minute Rolling Baseline
            </span>
            {step1Done && (
              <Badge className="bg-purple-950 text-purple-300 border border-purple-700 text-[10px]">
                Features Engineered
              </Badge>
            )}
          </div>

          <p className="text-xs text-slate-300 font-sans leading-relaxed mb-3">
            Compute the rolling baseline window <code className="text-purple-300 bg-slate-950 px-1 py-0.5 rounded">μ_t = 1/k ∑ X_(t-i)</code> to capture temporal drift, and calculate the deviation residual <code className="text-purple-300 bg-slate-950 px-1 py-0.5 rounded">Dev_t = X_t - μ_t</code>.
          </p>

          <div className="bg-slate-950 p-2.5 rounded border border-slate-800 text-[11px] font-mono text-slate-300 mb-3 space-y-1">
            <div><span className="text-slate-500">Formula:</span> μ_t = mean(requests[t-4 ... t])</div>
            <div><span className="text-slate-500">Residual:</span> Dev_t = requests_t - μ_t</div>
            <div className="text-purple-300">
              {step1Done ? '✓ Baseline calculated across requests, ports, and 404 rates.' : 'Awaiting calculation execution...'}
            </div>
          </div>

          <Button
            onClick={handleComputeRolling}
            disabled={step1Done}
            className="w-full bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold gap-1.5"
          >
            <span>{step1Done ? 'Rolling Baseline Computed (μ_t Active)' : 'Compute 5-Min Rolling Mean & Residual'}</span>
            <Check className="w-3.5 h-3.5" />
          </Button>
        </div>

        {/* ========================================================================= */}
        {/* STEP 2: TRAIN 100-TREE ISOLATION FOREST ENSEMBLE */}
        {/* ========================================================================= */}
        <div className={`p-4 rounded-xl border transition-all ${
          step2Done ? 'bg-slate-900/80 border-emerald-500/60 ring-1 ring-emerald-500/30' : 'bg-slate-900/50 border-slate-800'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase font-bold text-cyan-400 flex items-center gap-1.5">
              <GitFork className="w-4 h-4 text-cyan-400" />
              Step 2: 100-Tree Isolation Forest
            </span>
            {step2Done && (
              <Badge className="bg-emerald-950 text-emerald-400 border border-emerald-700 text-[10px]">
                100% Precision / Recall
              </Badge>
            )}
          </div>

          <p className="text-xs text-slate-300 font-sans leading-relaxed mb-3">
            Train <code className="text-cyan-300 bg-slate-950 px-1 py-0.5 rounded">IsolationForest(n_estimators=100, contamination=0.08)</code>. Anomalies isolate with short tree depths, isolating both Nmap & Brute-Force scans.
          </p>

          {/* Classification Report Table */}
          <div className="bg-slate-950 p-2.5 rounded border border-slate-800 text-[11px] font-mono mb-3">
            <div className="text-slate-400 font-bold border-b border-slate-800 pb-1 mb-1 flex justify-between">
              <span>CLASS</span>
              <span>PRECISION</span>
              <span>RECALL</span>
              <span>F1-SCORE</span>
            </div>
            <div className="flex justify-between text-slate-300 py-0.5">
              <span>Normal Traffic (110)</span>
              <span className="text-emerald-400">1.00</span>
              <span className="text-emerald-400">1.00</span>
              <span className="text-emerald-400">1.00</span>
            </div>
            <div className="flex justify-between text-slate-300 py-0.5">
              <span className="text-orange-400">Attack Anomaly (10)</span>
              <span className="text-emerald-400 font-bold">1.00</span>
              <span className="text-emerald-400 font-bold">1.00</span>
              <span className="text-emerald-400 font-bold">1.00</span>
            </div>
          </div>

          <Button
            onClick={handleTrainEnsemble}
            disabled={!step1Done || step2Done}
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-black font-mono text-xs font-bold gap-1.5"
          >
            <span>{step2Done ? 'Ensemble Trained & Plotted (10 Attack Points Flagged)' : 'Train 100-Tree Isolation Forest'}</span>
            <Brain className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* STEP 3: LIVE 10-MINUTE STEALTH CHALLENGE (SLOW & LOW SCAN) */}
      {/* ========================================================================= */}
      <div className="bg-slate-900/90 rounded-xl p-5 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-800 gap-2">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-orange-400" />
            <span className="text-sm font-bold text-slate-100 uppercase">
              Step 3: Live 10-Minute Student Stealth Challenge (Slow & Low Scan)
            </span>
          </div>
          <Badge variant="outline" className="text-[10px] border-orange-500/40 text-orange-300 bg-orange-950/30">
            Interactive Adversary Simulation
          </Badge>
        </div>

        <p className="text-xs text-slate-300 font-sans leading-relaxed">
          The attacker attempts to evade Blue Team detection by slowing down their port scanner to just <strong className="text-orange-300">40 req/min</strong>. Drag the sliders below to test if this slow-and-low recon can bypass traditional firewall rules versus the multi-dimensional Isolation Forest.
        </p>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 bg-slate-950 p-4 rounded-xl border border-slate-800">
          {/* Slider 1: requests_per_min */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Attacker Request Rate:</span>
              <span className="text-cyan-400 font-bold">{stealthReq} req/min</span>
            </div>
            <Slider
              value={[stealthReq]}
              onValueChange={(val) => setStealthReq(val[0])}
              min={10}
              max={300}
              step={5}
              className="py-1"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>10 (Stealth)</span>
              <span className="text-amber-400">Threshold: 200</span>
              <span>300 (Aggressive)</span>
            </div>
          </div>

          {/* Slider 2: unique_ports */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Unique Ports Scanned:</span>
              <span className="text-orange-400 font-bold">{stealthPorts} ports</span>
            </div>
            <Slider
              value={[stealthPorts]}
              onValueChange={(val) => setStealthPorts(val[0])}
              min={1}
              max={100}
              step={1}
              className="py-1"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>1 (Targeted)</span>
              <span>Baseline: 1-2</span>
              <span>100 (Sweep)</span>
            </div>
          </div>

          {/* Slider 3: error_404_rate */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">HTTP 404 Error Rate:</span>
              <span className="text-pink-400 font-bold">{stealth404}%</span>
            </div>
            <Slider
              value={[stealth404]}
              onValueChange={(val) => setStealth404(val[0])}
              min={1}
              max={90}
              step={1}
              className="py-1"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>1% (Legitimate)</span>
              <span>Baseline: &lt;5%</span>
              <span>90% (Fuzzing)</span>
            </div>
          </div>
        </div>

        {/* Side-by-Side Dual Comparison Engines */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Comparison 1: Static Firewall Rule */}
          <div className={`p-4 rounded-xl border transition-all ${
            stealthResult.staticFirewallBlocked 
              ? 'bg-slate-900 border-red-500/80' 
              : 'bg-amber-950/20 border-amber-600/60'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase text-slate-300">
                1. Traditional Static Firewall Rule
              </span>
              <Badge variant="outline" className="text-[10px] border-slate-700 text-slate-400">
                IF requests &gt; 200
              </Badge>
            </div>

            <div className="my-3">
              {stealthResult.staticFirewallBlocked ? (
                <div className="p-2.5 rounded bg-red-950/60 border border-red-700 text-xs text-red-300 font-bold flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-red-400 flex-shrink-0" />
                  RULE TRIGGERED: Volumetric Threshold Exceeded!
                </div>
              ) : (
                <div className="p-2.5 rounded bg-amber-950/60 border border-amber-600 text-xs text-amber-300 font-bold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 animate-pulse" />
                  BYPASS SUCCESSFUL! Defense Missed Stealth Attack!
                </div>
              )}
            </div>

            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              {stealthResult.staticFirewallMessage}
            </p>
          </div>

          {/* Comparison 2: 100-Tree Isolation Forest */}
          <div className={`p-4 rounded-xl border transition-all ${
            stealthResult.isolationForestDetected 
              ? 'bg-cyan-950/30 border-cyan-500/80 ring-1 ring-cyan-500/40' 
              : 'bg-slate-900 border-slate-800'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase text-cyan-300 flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5 text-cyan-400" />
                2. 100-Tree Isolation Forest Ensemble
              </span>
              <Badge className="bg-cyan-950 text-cyan-300 border border-cyan-600 text-[10px]">
                Score: {(stealthResult.isolationForestScore * 100).toFixed(0)}%
              </Badge>
            </div>

            <div className="my-3">
              {stealthResult.isolationForestDetected ? (
                <div className="p-2.5 rounded bg-cyan-950/80 border border-cyan-500 text-xs text-cyan-200 font-bold flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  STEALTH DETECTED! Isolated in {stealthResult.isolationForestSplitsNeeded} Random Splits!
                </div>
              ) : (
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-xs text-slate-400">
                  Point mimics normal baseline inliers.
                </div>
              )}
            </div>

            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              {stealthResult.isolationForestExplanation}
            </p>

            {stealthResult.multiDimensionalInsights.length > 0 && (
              <ul className="mt-2 text-[11px] text-cyan-300/90 font-mono space-y-1 list-disc list-inside">
                {stealthResult.multiDimensionalInsights.map((ins, idx) => (
                  <li key={idx}>{ins}</li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Submit Challenge Button */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800">
          <span className="text-xs text-slate-400">
            Verify the side-by-side evasion result to conquer the Boss Level.
          </span>
          <Button
            onClick={handleTestStealth}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs gap-1.5 shadow"
          >
            <span>{isBossCompleted ? 'Challenge Mastered (+100 XP)' : 'Submit Stealth Challenge & Conclude Lab'}</span>
            <Check className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* STEP 4: GOOGLE COLAB PYTHON NOTEBOOK SCRIPT CODE BLOCK */}
      {/* ========================================================================= */}
      <div className="bg-slate-900/90 rounded-xl p-5 border border-slate-800 shadow-xl space-y-3">
        <div className="flex flex-wrap items-center justify-between pb-2 border-b border-slate-800 gap-2">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-bold text-slate-100 uppercase">
              Step 4: Full Google Colab Python Script (scikit-learn)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={onOpenColabModal}
              className="h-7 text-xs bg-slate-800 border-slate-700 text-cyan-300 hover:bg-slate-700"
            >
              Expand Code Viewer
            </Button>
            <Button
              size="sm"
              onClick={handleCopyColab}
              className="h-7 text-xs bg-cyan-600 hover:bg-cyan-500 text-black font-bold gap-1"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Copied!' : 'Copy Script'}</span>
            </Button>
          </div>
        </div>

        <p className="text-xs text-slate-400 font-sans">
          Students can copy this complete Python script directly into their own Google Colab or Jupyter notebooks. It includes the synthetic data generator, rolling mean feature engineering, 100-tree Isolation Forest training, confusion matrix, and matplotlib 3-tier visualizations.
        </p>

        <div className="relative bg-slate-950 p-3 rounded-lg border border-slate-800/80 max-h-56 overflow-y-auto text-xs text-emerald-400 font-mono">
          <pre>{GOOGLE_COLAB_SCRIPT.slice(0, 1000)}...</pre>
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-slate-950 to-transparent flex items-end justify-center pb-2">
            <Button
              size="sm"
              variant="outline"
              onClick={onOpenColabModal}
              className="text-xs bg-slate-900/90 border-slate-700 text-cyan-300"
            >
              View Full 120-Line Colab Script
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

