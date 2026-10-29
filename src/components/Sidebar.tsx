import React from 'react';
import { 
  CheckCircle2, 
  Lock, 
  ChevronRight, 
  Flame, 
  Activity, 
  Brain, 
  Globe, 
  Search, 
  Terminal, 
  Radio, 
  Server, 
  Radar, 
  Layers, 
  Camera, 
  ShieldAlert
} from 'lucide-react';
import { LAB_LEVELS } from '../data/labData';
import { LevelData, FootprintLevel } from '../types';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { sound } from '../lib/audio';

interface SidebarProps {
  activeLevelId: number;
  completedLevels: number[];
  instructorMode: boolean;
  onSelectLevel: (levelId: number) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeLevelId,
  completedLevels,
  instructorMode,
  onSelectLevel
}) => {
  const getToolIcon = (slug: string) => {
    switch (slug) {
      case 'firecompass-ai': return <Flame className="w-4 h-4 text-orange-400" />;
      case 'maltego-ce': return <Layers className="w-4 h-4 text-blue-400" />;
      case 'google-dorking': return <Search className="w-4 h-4 text-yellow-400" />;
      case 'recon-ng': return <Terminal className="w-4 h-4 text-emerald-400" />;
      case 'shodan': return <Globe className="w-4 h-4 text-red-400" />;
      case 'censys': return <Server className="w-4 h-4 text-indigo-400" />;
      case 'nmap': return <Radar className="w-4 h-4 text-orange-500 animate-spin" style={{ animationDuration: '6s' }} />;
      case 'spiderfoot': return <Radio className="w-4 h-4 text-cyan-400" />;
      case 'aquatone': return <Camera className="w-4 h-4 text-teal-400" />;
      case 'firecompass-explorer': return <ShieldAlert className="w-4 h-4 text-amber-400" />;
      default: return <Terminal className="w-4 h-4 text-slate-400" />;
    }
  };

  const getFootprintBadge = (level: FootprintLevel) => {
    switch (level) {
      case 'ZERO':
        return <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20" title="Zero Direct Target Traffic" />;
      case 'LOW':
        return <span className="inline-block w-2 h-2 rounded-full bg-cyan-500 ring-2 ring-cyan-500/20" title="Low / Indirect OSINT Traffic" />;
      case 'MEDIUM':
        return <span className="inline-block w-2 h-2 rounded-full bg-yellow-500 ring-2 ring-yellow-500/20" title="Medium Traffic Burst" />;
      case 'HIGH':
      case 'EXTREME':
        return <span className="inline-block w-2 h-2 rounded-full bg-red-500 ring-2 ring-red-500/30 animate-pulse" title="High / Extreme Telemetry Spike!" />;
    }
  };

  const isLevelUnlocked = (levelId: number) => {
    if (instructorMode) return true;
    if (levelId === 1) return true;
    // Level is unlocked if previous level is completed
    return completedLevels.includes(levelId - 1);
  };

  const isBossUnlocked = instructorMode || completedLevels.includes(10);
  const isBossCompleted = completedLevels.includes(11);

  return (
    <aside className="w-full lg:w-80 flex-shrink-0 border-r border-slate-800 bg-slate-950/80 flex flex-col h-full select-none">
      {/* Sidebar Header */}
      <div className="p-3.5 border-b border-slate-800/80 bg-slate-900/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-orange-400" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200">
              MISSION MAP & ROADMAP
            </span>
          </div>
          <Badge variant="outline" className="text-[10px] font-mono border-slate-700 text-slate-400">
            {completedLevels.length} / 11 Done
          </Badge>
        </div>
        <p className="text-[11px] text-slate-400 mt-1 font-mono">
          Progress through 10 Recon Tools to unlock the AI Defense Boss Lab.
        </p>
      </div>

      {/* Levels Scroll Area */}
      <ScrollArea className="flex-1 p-2 space-y-1 overflow-y-auto">
        <div className="space-y-1.5 pb-2">
          {LAB_LEVELS.map((level: LevelData) => {
            const unlocked = isLevelUnlocked(level.id);
            const completed = completedLevels.includes(level.id);
            const active = activeLevelId === level.id;

            return (
              <button
                key={level.id}
                disabled={!unlocked}
                onClick={() => {
                  onSelectLevel(level.id);
                  sound.playKeypress();
                }}
                className={`w-full text-left p-2.5 rounded-lg border transition-all duration-200 flex items-start gap-3 relative group ${
                  active
                    ? 'bg-slate-900 border-orange-500/60 shadow-lg shadow-orange-950/20 ring-1 ring-orange-500/30'
                    : unlocked
                    ? 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700'
                    : 'bg-slate-950/40 border-slate-900 opacity-50 cursor-not-allowed'
                }`}
              >
                {/* Level Number / Status Icon */}
                <div className="flex-shrink-0 mt-0.5">
                  {completed ? (
                    <div className="w-7 h-7 rounded-md bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </div>
                  ) : unlocked ? (
                    <div className={`w-7 h-7 rounded-md border flex items-center justify-center text-xs font-mono font-bold ${
                      active 
                        ? 'bg-orange-500/20 border-orange-500 text-orange-300' 
                        : 'bg-slate-800 border-slate-700 text-slate-300 group-hover:border-slate-600'
                    }`}>
                      {level.id}
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-md bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>

                {/* Level Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      {getToolIcon(level.slug)}
                      Level {level.id}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {getFootprintBadge(level.footprintLevel)}
                      {completed && (
                        <span className="text-[10px] font-mono text-emerald-400 font-semibold">
                          +100 XP
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className={`text-xs font-semibold truncate mt-0.5 ${
                    active ? 'text-orange-200' : unlocked ? 'text-slate-200' : 'text-slate-500'
                  }`}>
                    {level.name}
                  </h3>

                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-400 truncate max-w-[170px]">
                      {level.categoryBadge}
                    </span>
                  </div>
                </div>

                {/* Right Arrow on Active */}
                {active && (
                  <div className="flex-shrink-0 self-center">
                    <ChevronRight className="w-4 h-4 text-orange-400 animate-pulse" />
                  </div>
                )}
              </button>
            );
          })}

          {/* FINAL BOSS LEVEL 11 */}
          <div className="pt-2">
            <div className="px-2 py-1 flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase font-bold text-cyan-400 flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5 text-cyan-400" />
                FINAL DEFENSIVE BOSS
              </span>
              <span className="text-[9px] font-mono text-cyan-500/80">ML Ensemble</span>
            </div>

            <button
              disabled={!isBossUnlocked}
              onClick={() => {
                onSelectLevel(11);
                sound.playKeypress();
              }}
              className={`w-full text-left p-3 rounded-lg border transition-all duration-200 flex items-start gap-3 mt-1 relative group ${
                activeLevelId === 11
                  ? 'bg-cyan-950/40 border-cyan-500 shadow-lg shadow-cyan-950/30 ring-1 ring-cyan-500/50'
                  : isBossUnlocked
                  ? 'bg-gradient-to-r from-slate-900 to-cyan-950/30 border-cyan-900/60 hover:border-cyan-700'
                  : 'bg-slate-950/40 border-slate-900 opacity-50 cursor-not-allowed'
              }`}
            >
              <div className="flex-shrink-0 mt-0.5">
                {isBossCompleted ? (
                  <div className="w-8 h-8 rounded-md bg-emerald-950 border border-emerald-500 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  </div>
                ) : isBossUnlocked ? (
                  <div className="w-8 h-8 rounded-md bg-cyan-950 border border-cyan-500/60 flex items-center justify-center text-cyan-300 font-bold font-mono">
                    <Brain className="w-4 h-4 text-cyan-300 animate-pulse" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-md bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600">
                    <Lock className="w-4 h-4" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold tracking-wider text-cyan-400 uppercase">
                    BOSS LEVEL 11
                  </span>
                  <Badge variant="outline" className="text-[9px] font-mono border-cyan-700/60 text-cyan-300 bg-cyan-950/50">
                    100-Tree ML
                  </Badge>
                </div>

                <h3 className="text-xs font-bold text-slate-100 mt-0.5 truncate">
                  Time-Series & Isolation Forest
                </h3>

                <p className="text-[10px] text-cyan-400/80 font-mono mt-0.5">
                  Detect Nmap, Brute-Force & Stealth Scans
                </p>
              </div>

              {activeLevelId === 11 && (
                <div className="flex-shrink-0 self-center">
                  <ChevronRight className="w-4 h-4 text-cyan-400 animate-pulse" />
                </div>
              )}
            </button>
          </div>
        </div>
      </ScrollArea>

      {/* Sidebar Footer: Footprint Legend */}
      <div className="p-3 border-t border-slate-800 bg-slate-900/60 text-[10px] font-mono text-slate-400">
        <span className="text-slate-300 font-semibold block mb-1">Server Log Footprint Legend:</span>
        <div className="grid grid-cols-2 gap-1.5">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Zero (Passive)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-500" />
            <span>Low (APIs)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-yellow-500" />
            <span>Medium (HTTP)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span>Extreme Spike</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

