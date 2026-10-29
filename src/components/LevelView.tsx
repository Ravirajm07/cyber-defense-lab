import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  FileText, 
  Terminal as TerminalIcon, 
  Play, 
  CheckCircle2, 
  Check, 
  X, 
  Info, 
  ArrowRight, 
  ChevronRight, 
  ShieldAlert, 
  Zap, 
  Sparkles 
} from 'lucide-react';
import { LevelData, FootprintLevel } from '../types';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Terminal } from './Terminal';
import { MaltegoGraph } from './specialized/MaltegoGraph';
import { GoogleDorkSimulator } from './specialized/GoogleDorkSimulator';
import { FireCompassCard } from './specialized/FireCompassCard';
import { ShodanCard } from './specialized/ShodanCard';
import { SpiderFootPreview } from './specialized/SpiderFootPreview';
import { AquatoneGallery } from './specialized/AquatoneGallery';
import { sound } from '../lib/audio';

interface LevelViewProps {
  level: LevelData;
  completedTasks: Record<string, boolean>;
  onCompleteTask: (taskId: string, xpEarned: number) => void;
  onNextLevel: () => void;
  isLastLevel: boolean;
  onTriggerTelemetrySpike: (type: 'NMAP' | 'FIRECOMPASS_BRUTE' | 'NONE') => void;
}

export const LevelView: React.FC<LevelViewProps> = ({
  level,
  completedTasks,
  onCompleteTask,
  onNextLevel,
  isLastLevel,
  onTriggerTelemetrySpike
}) => {
  const [activeTab, setActiveTab] = useState<'briefing' | 'task1' | 'task2'>('briefing');

  const briefingTaskId = `${level.id}-briefing`;
  const task1Id = `${level.id}-task1`;
  const task2Id = `${level.id}-task2`;

  const isBriefingDone = !!completedTasks[briefingTaskId];
  const isTask1Done = !!completedTasks[task1Id];
  const isTask2Done = !!completedTasks[task2Id];
  const isLevelFullyDone = isBriefingDone && isTask1Done && isTask2Done;

  // Reset active tab to briefing when level changes
  useEffect(() => {
    if (isBriefingDone && !isTask1Done) {
      setActiveTab('task1');
    } else if (isTask1Done && !isTask2Done) {
      setActiveTab('task2');
    } else {
      setActiveTab('briefing');
    }
  }, [level.id]);

  const handleMarkBriefingDone = () => {
    if (!isBriefingDone) {
      onCompleteTask(briefingTaskId, 25);
      sound.playSuccess();
    }
    setActiveTab('task1');
  };

  const handleTask1Success = () => {
    if (!isTask1Done) {
      onCompleteTask(task1Id, 25);
    }
    // Auto advance to Task 2 after a moment
    setTimeout(() => {
      setActiveTab('task2');
    }, 1200);
  };

  const handleTask2Success = () => {
    if (!isTask2Done) {
      onCompleteTask(task2Id, 50);
      sound.playLevelUp();
      // Trigger festive cyber confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    // Trigger telemetry spike if Nmap or FireCompass Explorer
    if (level.slug === 'nmap') {
      onTriggerTelemetrySpike('NMAP');
    } else if (level.slug === 'firecompass-explorer') {
      onTriggerTelemetrySpike('FIRECOMPASS_BRUTE');
    }
  };

  const getFootprintColor = (footprint: FootprintLevel) => {
    switch (footprint) {
      case 'ZERO': return 'bg-emerald-950/80 text-emerald-400 border-emerald-800';
      case 'LOW': return 'bg-cyan-950/80 text-cyan-400 border-cyan-800';
      case 'MEDIUM': return 'bg-yellow-950/80 text-yellow-400 border-yellow-800';
      case 'HIGH':
      case 'EXTREME': return 'bg-red-950/90 text-red-400 border-red-700 animate-pulse';
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Level Header Banner */}
      <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-800 shadow-lg relative overflow-hidden">
        {/* Cyber corner accent */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-orange-500/10 to-transparent pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="font-mono text-[10px] text-orange-400 border-orange-500/40 bg-orange-950/20">
                LEVEL {level.id} OF 10
              </Badge>
              <Badge variant="outline" className="font-mono text-[10px] text-cyan-400 border-cyan-500/40 bg-cyan-950/20">
                {level.bucket}
              </Badge>
              <Badge className={`font-mono text-[10px] border ${getFootprintColor(level.footprintLevel)}`}>
                Server Log Footprint: {level.logImpactBadge}
              </Badge>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
              {level.name}
              {isLevelFullyDone && (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 inline-block" />
              )}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              {level.intro}
            </p>
          </div>

          {/* Level Completion Status Badge */}
          <div className="flex flex-col items-end gap-1.5 self-start">
            <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 font-mono text-xs">
              <Zap className="w-3.5 h-3.5 text-yellow-400" />
              <span className="text-slate-400">Total XP:</span>
              <span className="text-yellow-300 font-bold">
                {(isBriefingDone ? 25 : 0) + (isTask1Done ? 25 : 0) + (isTask2Done ? 50 : 0)} / 100 XP
              </span>
            </div>
            {isLevelFullyDone && (
              <Button
                size="sm"
                onClick={onNextLevel}
                className="bg-orange-600 hover:bg-orange-500 text-white text-xs font-mono font-bold h-7 gap-1 shadow"
              >
                <span>{isLastLevel ? 'Enter Final Boss' : 'Next Level'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs Container */}
      <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as any)} className="w-full">
        {/* Custom Tab Bar */}
        <TabsList className="bg-slate-900 border border-slate-800 p-1 w-full justify-start h-auto rounded-lg grid grid-cols-3 gap-1">
          {/* Tab 1 Trigger */}
          <TabsTrigger
            value="briefing"
            className="data-[state=active]:bg-slate-950 data-[state=active]:text-orange-300 data-[state=active]:border-orange-500/50 border border-transparent font-mono text-xs py-2 flex items-center justify-center gap-2"
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">1. Intel Briefing</span>
            <span className="sm:hidden">1. Briefing</span>
            {isBriefingDone ? (
              <Check className="w-3.5 h-3.5 text-emerald-400 ml-1" />
            ) : (
              <span className="text-[10px] text-yellow-400">+25 XP</span>
            )}
          </TabsTrigger>

          {/* Tab 2 Trigger */}
          <TabsTrigger
            value="task1"
            className="data-[state=active]:bg-slate-950 data-[state=active]:text-orange-300 data-[state=active]:border-orange-500/50 border border-transparent font-mono text-xs py-2 flex items-center justify-center gap-2"
          >
            <TerminalIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">2. Install & Setup</span>
            <span className="sm:hidden">2. Setup</span>
            {isTask1Done ? (
              <Check className="w-3.5 h-3.5 text-emerald-400 ml-1" />
            ) : (
              <span className="text-[10px] text-yellow-400">+25 XP</span>
            )}
          </TabsTrigger>

          {/* Tab 3 Trigger */}
          <TabsTrigger
            value="task2"
            className="data-[state=active]:bg-slate-950 data-[state=active]:text-orange-300 data-[state=active]:border-orange-500/50 border border-transparent font-mono text-xs py-2 flex items-center justify-center gap-2"
          >
            <Play className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">3. Execute Recon Demo</span>
            <span className="sm:hidden">3. Demo</span>
            {isTask2Done ? (
              <Check className="w-3.5 h-3.5 text-emerald-400 ml-1" />
            ) : (
              <span className="text-[10px] text-yellow-400">+50 XP</span>
            )}
          </TabsTrigger>
        </TabsList>

        {/* ========================================================================= */}
        {/* TAB 1: INTEL BRIEFING */}
        {/* ========================================================================= */}
        <TabsContent value="briefing" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Primary Use Case Card */}
            <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase font-bold tracking-wider">
                <Info className="w-4 h-4 text-cyan-400" />
                Operational Use Case
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                {level.useCase}
              </p>

              {/* Server Log Footprint Deep Dive */}
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80 space-y-1.5 mt-2">
                <span className="text-[10px] font-mono uppercase font-bold text-orange-400 block">
                  Server Log Footprint Analysis
                </span>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  {level.footprintDetails}
                </p>
              </div>
            </div>

            {/* Pros & Cons Grid Card */}
            <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800 space-y-3">
              <span className="text-xs font-mono uppercase font-bold tracking-wider text-slate-300 block">
                Technical Trade-Offs (Pros & Cons)
              </span>

              <div className="space-y-2 text-xs">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider block">
                    Advantages & Strengths:
                  </span>
                  {level.pros.map((pro, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-slate-300">
                      <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{pro}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-800">
                  <span className="text-[10px] font-mono text-red-400 font-bold uppercase tracking-wider block">
                    Limitations & Detection Risks:
                  </span>
                  {level.cons.map((con, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-slate-300">
                      <X className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
                      <span>{con}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action Footer: Mark Read */}
          <div className="flex items-center justify-between bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <span className="text-xs font-mono text-slate-400">
              Read the briefing and understand the detection footprint before launching simulated commands.
            </span>
            <Button
              onClick={handleMarkBriefingDone}
              className="bg-orange-600 hover:bg-orange-500 text-white font-mono text-xs font-bold gap-1.5 shadow"
            >
              <span>{isBriefingDone ? 'Proceed to Setup (Task 1)' : 'Mark Read & Proceed (+25 XP)'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </TabsContent>

        {/* ========================================================================= */}
        {/* TAB 2: TASK 1 - INSTALL & SETUP */}
        {/* ========================================================================= */}
        <TabsContent value="task1" className="mt-4 space-y-4">
          <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase font-bold text-orange-400 flex items-center gap-1.5">
                <TerminalIcon className="w-3.5 h-3.5 text-orange-400" />
                Task 1: {level.task1.title}
              </span>
              <Badge variant="outline" className="text-[10px] font-mono border-yellow-500/40 text-yellow-300">
                Reward: 25 XP
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 font-sans">
              {level.task1.description}
            </p>
            {level.task1.helpExplanation && (
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800/80 text-xs text-slate-400 font-sans">
                <strong className="text-slate-300">Instructor Note: </strong>
                {level.task1.helpExplanation}
              </div>
            )}
          </div>

          {/* Interactive Bash Terminal */}
          <Terminal
            taskTitle={`SETUP: ${level.name.toUpperCase()}`}
            expectedCommand={level.task1.command}
            autoTypeHint={level.task1.autoTypeHint}
            expectedOutput={level.task1.expectedOutput}
            onSuccess={handleTask1Success}
            isCompleted={isTask1Done}
            promptPrefix={level.task1.taskType === 'cloud' ? 'cloud-shell:~$ ' : 'student@cyberlab:~$ '}
          />
        </TabsContent>

        {/* ========================================================================= */}
        {/* TAB 3: TASK 2 - EXECUTE RECON DEMO */}
        {/* ========================================================================= */}
        <TabsContent value="task2" className="mt-4 space-y-4">
          <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase font-bold text-cyan-400 flex items-center gap-1.5">
                <Play className="w-3.5 h-3.5 text-cyan-400" />
                Task 2: {level.task2.title}
              </span>
              <Badge variant="outline" className="text-[10px] font-mono border-yellow-500/40 text-yellow-300">
                Reward: 50 XP
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 font-sans">
              {level.task2.description}
            </p>
            {level.task2.helpExplanation && (
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800/80 text-xs text-slate-400 font-sans">
                <strong className="text-cyan-400">Classroom Insight: </strong>
                {level.task2.helpExplanation}
              </div>
            )}
          </div>

          {/* Specialized Interactive Visual Simulators */}
          {(level.specialDemoType === 'maltego' || level.task2.specialDemoType === 'maltego') && <MaltegoGraph />}
          {(level.specialDemoType === 'dorking' || level.task2.specialDemoType === 'dorking') && <GoogleDorkSimulator />}
          {(level.specialDemoType === 'firecompass_assets' || level.task2.specialDemoType === 'firecompass_assets') && <FireCompassCard />}
          {(level.specialDemoType === 'shodan' || level.task2.specialDemoType === 'shodan') && <ShodanCard />}
          {(level.specialDemoType === 'spiderfoot' || level.task2.specialDemoType === 'spiderfoot') && <SpiderFootPreview />}
          {(level.specialDemoType === 'aquatone' || level.task2.specialDemoType === 'aquatone') && <AquatoneGallery />}

          {/* Interactive Terminal for Demo Execution */}
          <Terminal
            taskTitle={`RECON EXECUTION: ${level.name.toUpperCase()}`}
            expectedCommand={level.task2.command}
            autoTypeHint={level.task2.autoTypeHint}
            expectedOutput={level.task2.expectedOutput}
            onSuccess={handleTask2Success}
            isCompleted={isTask2Done}
            promptPrefix={level.slug === 'recon-ng' ? '[recon-ng][default] > ' : 'student@cyberlab:~$ '}
          />

          {/* Next Level Call to Action Banner */}
          {isTask2Done && (
            <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 p-4 rounded-xl border border-emerald-500/40 flex flex-wrap items-center justify-between gap-3 shadow-lg">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-emerald-950 border border-emerald-500/60 text-emerald-400">
                  <Sparkles className="w-5 h-5 text-emerald-400 animate-spin" style={{ animationDuration: '6s' }} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-100">
                    Level {level.id} Mastery Achieved! (+100 XP Earned)
                  </h4>
                  <p className="text-xs text-slate-400">
                    Target telemetry captured. Proceed to the next reconnaissance tool in your sequence.
                  </p>
                </div>
              </div>

              <Button
                onClick={onNextLevel}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs gap-1.5 shadow"
              >
                <span>{isLastLevel ? 'Advance to Final ML Boss Level' : 'Next Level'}</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
