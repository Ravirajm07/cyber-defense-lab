import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { LevelView } from './components/LevelView';
import { BossLevel } from './components/BossLevel';
import { TelemetryMonitor } from './components/TelemetryMonitor';
import { ColabModal } from './components/ColabModal';
import { LAB_LEVELS } from './data/labData';
import { sound } from './lib/audio';
import { CheckCircle2, Lock, Brain, Shield } from 'lucide-react';

const STORAGE_KEY = 'CYBER_DEFENSE_LAB_STATE_V1';

export function App() {
  // Scroll container ref to ensure smooth scrolling on level change
  const contentScrollRef = useRef<HTMLDivElement>(null);

  // Load state from localStorage
  const [completedLevels, setCompletedLevels] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_levels`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_tasks`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [totalXp, setTotalXp] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_xp`);
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  const [instructorMode, setInstructorMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_instructor`);
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  const [activeLevelId, setActiveLevelId] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_active_level`);
      return saved ? parseInt(saved, 10) : 1;
    } catch {
      return 1;
    }
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isColabModalOpen, setIsColabModalOpen] = useState<boolean>(false);
  const [activeSpike, setActiveSpike] = useState<'NMAP' | 'FIRECOMPASS_BRUTE' | 'NONE'>('NONE');

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_levels`, JSON.stringify(completedLevels));
      localStorage.setItem(`${STORAGE_KEY}_tasks`, JSON.stringify(completedTasks));
      localStorage.setItem(`${STORAGE_KEY}_xp`, totalXp.toString());
      localStorage.setItem(`${STORAGE_KEY}_instructor`, JSON.stringify(instructorMode));
      localStorage.setItem(`${STORAGE_KEY}_active_level`, activeLevelId.toString());
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }, [completedLevels, completedTasks, totalXp, instructorMode, activeLevelId]);

  // Synchronize sound manager
  useEffect(() => {
    sound.setEnabled(soundEnabled);
  }, [soundEnabled]);

  // Smoothly scroll content container to top when level changes
  useEffect(() => {
    if (contentScrollRef.current) {
      contentScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeLevelId]);

  // Find active level data (for levels 1-10)
  const activeLevel = LAB_LEVELS.find((l) => l.id === activeLevelId) || LAB_LEVELS[0];

  // Handle task completion
  const handleCompleteTask = (taskId: string, xpEarned: number) => {
    setCompletedTasks((prev) => {
      if (prev[taskId]) return prev;
      const updated = { ...prev, [taskId]: true };

      // Check if all 3 parts of the current level are complete
      const lvlId = activeLevelId;
      const bDone = !!updated[`${lvlId}-briefing`];
      const t1Done = !!updated[`${lvlId}-task1`];
      const t2Done = !!updated[`${lvlId}-task2`];

      if (bDone && t1Done && t2Done) {
        setCompletedLevels((currLvl) => {
          if (!currLvl.includes(lvlId)) {
            return [...currLvl, lvlId];
          }
          return currLvl;
        });
      }

      return updated;
    });

    setTotalXp((prev) => Math.min(1100, prev + xpEarned));
  };

  // Handle Boss Level completion
  const handleCompleteBoss = () => {
    if (!completedLevels.includes(11)) {
      setCompletedLevels((prev) => [...prev, 11]);
      setCompletedTasks((prev) => ({ ...prev, '11-boss': true }));
      setTotalXp((prev) => Math.min(1100, prev + 100));
    }
  };

  // Advance to next level
  const handleNextLevel = () => {
    sound.playKeypress();
    if (activeLevelId < 11) {
      setActiveLevelId((prev) => prev + 1);
    }
  };

  // Reset progress handler
  const handleResetProgress = () => {
    if (window.confirm('Reset all lab progress, XP counter, and unlocked levels?')) {
      sound.playAlert();
      localStorage.removeItem(`${STORAGE_KEY}_levels`);
      localStorage.removeItem(`${STORAGE_KEY}_tasks`);
      localStorage.removeItem(`${STORAGE_KEY}_xp`);
      localStorage.removeItem(`${STORAGE_KEY}_instructor`);
      localStorage.removeItem(`${STORAGE_KEY}_active_level`);
      setCompletedLevels([]);
      setCompletedTasks({});
      setTotalXp(0);
      setActiveLevelId(1);
      setActiveSpike('NONE');
    }
  };

  // Trigger telemetry spike callback
  const handleTriggerTelemetrySpike = (type: 'NMAP' | 'FIRECOMPASS_BRUTE' | 'NONE') => {
    setActiveSpike(type);
    setTimeout(() => {
      // Revert spike after 20 seconds so telemetry returns to baseline organically
      setActiveSpike('NONE');
    }, 20000);
  };

  const isLevelUnlocked = (levelId: number) => {
    if (instructorMode) return true;
    if (levelId === 1) return true;
    return completedLevels.includes(levelId - 1);
  };

  const isBossUnlocked = instructorMode || completedLevels.includes(10);

  return (
    <div className="h-screen w-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-orange-500 selection:text-white overflow-hidden font-sans">
      {/* Top Navigation Bar (Fixed Height) */}
      <div className="flex-shrink-0 z-40">
        <Header
          totalXp={totalXp}
          instructorMode={instructorMode}
          onToggleInstructorMode={setInstructorMode}
          soundEnabled={soundEnabled}
          onToggleSound={setSoundEnabled}
          onResetProgress={handleResetProgress}
          onOpenColabModal={() => setIsColabModalOpen(true)}
          activeLevelName={activeLevelId === 11 ? 'Boss: Time-Series Ensemble Lab' : activeLevel.name}
        />
      </div>

      {/* Mobile Swipeable Level Selector Bar (< lg) */}
      <div className="lg:hidden flex-shrink-0 bg-slate-900 border-b border-slate-800 px-2 py-1.5 overflow-x-auto flex items-center gap-1.5 custom-scrollbar z-30">
        <span className="text-[10px] font-mono text-slate-400 font-bold uppercase px-1 flex-shrink-0">
          Levels:
        </span>
        {LAB_LEVELS.map((lvl) => {
          const unlocked = isLevelUnlocked(lvl.id);
          const completed = completedLevels.includes(lvl.id);
          const active = activeLevelId === lvl.id;

          return (
            <button
              key={lvl.id}
              disabled={!unlocked}
              onClick={() => {
                setActiveLevelId(lvl.id);
                sound.playKeypress();
              }}
              className={`flex-shrink-0 px-2.5 py-1 rounded text-xs font-mono font-semibold flex items-center gap-1 transition-all ${
                active
                  ? 'bg-orange-600 text-white shadow'
                  : completed
                  ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                  : unlocked
                  ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  : 'bg-slate-900 text-slate-600 opacity-50 cursor-not-allowed'
              }`}
            >
              {completed ? (
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              ) : !unlocked ? (
                <Lock className="w-3 h-3" />
              ) : null}
              <span>L{lvl.id}</span>
            </button>
          );
        })}

        {/* Mobile Boss Button */}
        <button
          disabled={!isBossUnlocked}
          onClick={() => {
            setActiveLevelId(11);
            sound.playKeypress();
          }}
          className={`flex-shrink-0 px-2.5 py-1 rounded text-xs font-mono font-bold flex items-center gap-1 transition-all ${
            activeLevelId === 11
              ? 'bg-cyan-600 text-black shadow'
              : completedLevels.includes(11)
              ? 'bg-emerald-950 text-emerald-400 border border-emerald-700'
              : isBossUnlocked
              ? 'bg-cyan-950 text-cyan-300 border border-cyan-700'
              : 'bg-slate-900 text-slate-600 opacity-50 cursor-not-allowed'
          }`}
        >
          <Brain className="w-3 h-3" />
          <span>Boss</span>
        </button>
      </div>

      {/* Main Workspace (Takes full remaining viewport height) */}
      <div className="flex-1 flex overflow-hidden min-h-0 relative">
        {/* Desktop Sidebar (Left Column) */}
        <div className="hidden lg:flex w-72 xl:w-80 h-full flex-shrink-0 flex-col border-r border-slate-800 bg-slate-950/95 overflow-hidden z-20">
          <Sidebar
            activeLevelId={activeLevelId}
            completedLevels={completedLevels}
            instructorMode={instructorMode}
            onSelectLevel={setActiveLevelId}
          />
        </div>

        {/* Central Workspace: Content Area + Bottom Telemetry Monitor */}
        <main className="flex-1 flex flex-col h-full min-h-0 min-w-0 bg-slate-950 overflow-hidden relative">
          {/* Scrollable Level Content Container - ALWAYS SCROLLS FLUIDLY */}
          <div 
            ref={contentScrollRef}
            className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-3 sm:p-5 lg:p-6"
          >
            <div className="max-w-6xl mx-auto w-full pb-8">
              {activeLevelId === 11 ? (
                <BossLevel
                  onCompleteBoss={handleCompleteBoss}
                  isBossCompleted={completedLevels.includes(11)}
                  onOpenColabModal={() => setIsColabModalOpen(true)}
                />
              ) : (
                <LevelView
                  key={activeLevel.id}
                  level={activeLevel}
                  completedTasks={completedTasks}
                  onCompleteTask={handleCompleteTask}
                  onNextLevel={handleNextLevel}
                  isLastLevel={activeLevelId === 10}
                  onTriggerTelemetrySpike={handleTriggerTelemetrySpike}
                />
              )}
            </div>
          </div>

          {/* Persistent Blue Team Live Telemetry Monitor (Docked at Bottom) */}
          <div className="flex-shrink-0 border-t border-slate-800/80 bg-slate-950/95 z-20">
            <TelemetryMonitor
              currentToolName={activeLevelId === 11 ? 'Isolation Forest ML Sensor' : activeLevel.name}
              isTriggeringSpike={activeSpike}
              activeLevelId={activeLevelId}
            />
          </div>
        </main>
      </div>

      {/* Colab Python Script Dialog Modal */}
      <ColabModal
        isOpen={isColabModalOpen}
        onClose={() => setIsColabModalOpen(false)}
      />
    </div>
  );
}

export default App;
