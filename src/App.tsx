import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { LevelView } from './components/LevelView';
import { BossLevel } from './components/BossLevel';
import { TelemetryMonitor } from './components/TelemetryMonitor';
import { ColabModal } from './components/ColabModal';
import { LAB_LEVELS } from './data/labData';
import { sound } from './lib/audio';

const STORAGE_KEY = 'CYBER_DEFENSE_LAB_STATE_V1';

export function App() {
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-orange-500 selection:text-white">
      {/* Top Navigation Bar */}
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

      {/* Main Workspace: Left Sidebar + Central Level Workspace */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
        {/* Left Sidebar Level Map */}
        <Sidebar
          activeLevelId={activeLevelId}
          completedLevels={completedLevels}
          instructorMode={instructorMode}
          onSelectLevel={setActiveLevelId}
        />

        {/* Central Content Area */}
        <main className="flex-1 flex flex-col overflow-hidden bg-slate-950">
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

          {/* Persistent Blue Team Live Telemetry Monitor */}
          <TelemetryMonitor
            currentToolName={activeLevelId === 11 ? 'Isolation Forest ML Sensor' : activeLevel.name}
            isTriggeringSpike={activeSpike}
            activeLevelId={activeLevelId}
          />
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
