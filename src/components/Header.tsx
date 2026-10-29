import React from 'react';
import { Shield, Terminal, Volume2, VolumeX, RotateCcw, Code2, Unlock, Lock, Zap } from 'lucide-react';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { sound } from '../lib/audio';

interface HeaderProps {
  totalXp: number;
  instructorMode: boolean;
  onToggleInstructorMode: (val: boolean) => void;
  soundEnabled: boolean;
  onToggleSound: (val: boolean) => void;
  onResetProgress: () => void;
  onOpenColabModal: () => void;
  activeLevelName: string;
}

export const Header: React.FC<HeaderProps> = ({
  totalXp,
  instructorMode,
  onToggleInstructorMode,
  soundEnabled,
  onToggleSound,
  onResetProgress,
  onOpenColabModal,
  activeLevelName
}) => {
  // Rank calculation based on XP
  const getRank = (xp: number) => {
    if (xp >= 1000) return { title: 'Cyber AI Sentinel', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' };
    if (xp >= 700) return { title: 'Senior SOC Defender', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40' };
    if (xp >= 400) return { title: 'Red Team Specialist', color: 'bg-orange-500/20 text-orange-400 border-orange-500/40' };
    if (xp >= 200) return { title: 'Recon Analyst', color: 'bg-purple-500/20 text-purple-400 border-purple-500/40' };
    return { title: 'Security Trainee', color: 'bg-slate-700/50 text-slate-300 border-slate-600' };
  };

  const rank = getRank(totalXp);
  const progressPercent = Math.min(100, Math.round((totalXp / 1100) * 100));

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md px-4 py-2.5">
      <div className="flex flex-wrap items-center justify-between gap-3 max-w-[1920px] mx-auto">
        {/* Left: Brand & Target Indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-400 shadow-inner">
            <Shield className="w-5 h-5 text-orange-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold tracking-wider uppercase text-cyan-400">
                NovaTech Cyber Defense Academy
              </span>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                SIMULATION LIVE
              </span>
            </div>
            <h1 className="text-sm sm:text-base font-bold text-slate-100 tracking-tight flex items-center gap-2">
              CYBER DEFENSE LAB
              <span className="text-xs font-normal text-slate-400 hidden md:inline">
                | Top 10 Pentest Tools & Time-Series ML Ensemble
              </span>
            </h1>
          </div>
        </div>

        {/* Center: Target Server & Current Module Indicator */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-900/90 border border-slate-800 text-xs font-mono">
          <Terminal className="w-3.5 h-3.5 text-orange-400" />
          <span className="text-slate-400">Target:</span>
          <span className="text-orange-300 font-semibold">scanme.nmap.org</span>
          <span className="text-slate-500">[45.33.32.156]</span>
          <span className="mx-1.5 text-slate-700">|</span>
          <span className="text-slate-400">Active Module:</span>
          <span className="text-cyan-300 font-medium truncate max-w-[200px]">{activeLevelName}</span>
        </div>

        {/* Right: XP Counter, Instructor Mode, Actions */}
        <div className="flex items-center gap-3 ml-auto">
          {/* XP Progress Card */}
          <div className="flex items-center gap-3 bg-slate-900/80 border border-slate-800 rounded-lg px-3 py-1.5">
            <div className="flex flex-col text-right">
              <div className="flex items-center justify-end gap-1.5">
                <Zap className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                <span className="font-mono font-bold text-xs sm:text-sm text-yellow-300">
                  {totalXp} <span className="text-slate-500 font-normal">/ 1100 XP</span>
                </span>
              </div>
              <div className="w-24 sm:w-28 bg-slate-800 h-1.5 rounded-full overflow-hidden mt-0.5">
                <div 
                  className="bg-gradient-to-r from-orange-500 to-cyan-400 h-full transition-all duration-500 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
            <Badge variant="outline" className={`text-[10px] font-mono uppercase px-2 py-0.5 border ${rank.color}`}>
              {rank.title}
            </Badge>
          </div>

          {/* Instructor Mode Toggle */}
          <div className="hidden sm:flex items-center gap-2 bg-slate-900/60 border border-slate-800 rounded-lg px-2.5 py-1.5">
            {instructorMode ? (
              <Unlock className="w-3.5 h-3.5 text-orange-400" />
            ) : (
              <Lock className="w-3.5 h-3.5 text-slate-500" />
            )}
            <div className="flex flex-col">
              <span className="text-[10px] font-mono uppercase font-semibold text-slate-300">
                Instructor Mode
              </span>
              <span className="text-[9px] text-slate-500 -mt-0.5">Unlock All</span>
            </div>
            <Switch
              checked={instructorMode}
              onCheckedChange={(checked) => {
                onToggleInstructorMode(checked);
                sound.playKeypress();
              }}
              className="data-[state=checked]:bg-orange-600 scale-90"
            />
          </div>

          {/* Python Colab Code Quick-Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenColabModal}
            className="hidden xl:inline-flex items-center gap-1.5 bg-slate-900 border-slate-700 hover:border-cyan-500/50 hover:bg-slate-800 text-cyan-300 text-xs font-mono h-8"
          >
            <Code2 className="w-3.5 h-3.5 text-cyan-400" />
            Colab Python Lab
          </Button>

          {/* Sound Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onToggleSound(!soundEnabled)}
            className="w-8 h-8 text-slate-400 hover:text-slate-100 hover:bg-slate-800"
            title={soundEnabled ? 'Mute Sounds' : 'Enable Cyber Sounds'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </Button>

          {/* Reset Progress Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onResetProgress}
            className="w-8 h-8 text-slate-400 hover:text-red-400 hover:bg-red-950/30"
            title="Reset Lab Progress"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

