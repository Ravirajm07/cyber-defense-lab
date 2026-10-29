import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, Play, Wand2, Copy, Check, Trash2, ArrowRight, CornerDownLeft } from 'lucide-react';
import { Button } from './ui/button';
import { sound } from '../lib/audio';

interface TerminalProps {
  expectedCommand: string;
  autoTypeHint?: string;
  expectedOutput: string;
  onSuccess: () => void;
  isCompleted?: boolean;
  promptPrefix?: string;
  taskTitle?: string;
}

export const Terminal: React.FC<TerminalProps> = ({
  expectedCommand,
  autoTypeHint,
  expectedOutput,
  onSuccess,
  isCompleted = false,
  promptPrefix = 'student@cyberlab:~$',
  taskTitle
}) => {
  const [inputValue, setInputValue] = useState('');
  const [outputHistory, setOutputHistory] = useState<Array<{ type: 'input' | 'output' | 'system'; text: string }>>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const terminalOutputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll ONLY the terminal internal output container, NEVER the whole page
  useEffect(() => {
    if (terminalOutputRef.current) {
      terminalOutputRef.current.scrollTop = terminalOutputRef.current.scrollHeight;
    }
  }, [outputHistory, isRunning]);

  // Initial welcome message or reset when expectedCommand changes
  useEffect(() => {
    setOutputHistory([
      {
        type: 'system',
        text: `[!] Terminal initialized.\n[i] Required target command:\n    ${expectedCommand}\n[i] Click 'Auto-Type' or 'Auto-Run' below if you want fast execution.`
      }
    ]);
    setInputValue('');
  }, [expectedCommand]);

  // Auto-type animation
  const handleAutoType = () => {
    sound.playKeypress();
    setInputValue('');
    const target = autoTypeHint || expectedCommand;
    let currentIdx = 0;

    const interval = setInterval(() => {
      if (currentIdx <= target.length) {
        setInputValue(target.slice(0, currentIdx));
        sound.playKeypress();
        currentIdx++;
      } else {
        clearInterval(interval);
        inputRef.current?.focus();
      }
    }, 20);
  };

  const handleInstantFill = () => {
    sound.playKeypress();
    setInputValue(autoTypeHint || expectedCommand);
    inputRef.current?.focus();
  };

  const executeCommand = (cmdToRun?: string) => {
    const rawCmd = (cmdToRun !== undefined ? cmdToRun : inputValue).trim();
    if (!rawCmd || isRunning) return;

    sound.playKeypress();
    setIsRunning(true);

    // Save to command history
    setCommandHistory(prev => [rawCmd, ...prev]);
    setHistoryIndex(-1);

    // Add command to output
    setOutputHistory(prev => [
      ...prev,
      { type: 'input', text: `${promptPrefix} ${rawCmd}` }
    ]);

    // Check utility commands
    const lowerCmd = rawCmd.toLowerCase();
    if (lowerCmd === 'clear') {
      setOutputHistory([]);
      setIsRunning(false);
      setInputValue('');
      return;
    }

    if (lowerCmd === 'help') {
      setTimeout(() => {
        setOutputHistory(prev => [
          ...prev,
          { 
            type: 'system', 
            text: `[HELP GUIDE]\nAvailable commands for this task:\n  - Required: ${expectedCommand}\n  - clear: Clear terminal output\n  - whoami: Display simulated user context\n  - Click 'Auto-Run' or 'Auto-Type' button to execute instantly.` 
          }
        ]);
        setIsRunning(false);
        setInputValue('');
      }, 300);
      return;
    }

    if (lowerCmd === 'whoami' || lowerCmd === 'id') {
      setTimeout(() => {
        setOutputHistory(prev => [
          ...prev,
          { type: 'output', text: 'uid=1000(student) gid=1000(student) groups=1000(student),27(sudo)' }
        ]);
        setIsRunning(false);
        setInputValue('');
      }, 300);
      return;
    }

    if (lowerCmd === 'ls') {
      setTimeout(() => {
        setOutputHistory(prev => [
          ...prev,
          { type: 'output', text: 'aquatone_report/  common-dirs.txt  college_demo.db  wordlists/  recon_scan.txt' }
        ]);
        setIsRunning(false);
        setInputValue('');
      }, 300);
      return;
    }

    // Flexible command validation
    const cleanInput = rawCmd.toLowerCase().replace(/\s+/g, ' ');
    const cleanExpected = expectedCommand.toLowerCase().replace(/\s+/g, ' ');
    const firstWord = expectedCommand.trim().split(' ')[0].toLowerCase();

    const isMatch = cleanInput === cleanExpected ||
                    cleanInput.startsWith(firstWord) ||
                    cleanInput.includes(firstWord) ||
                    cleanInput.includes('connect') ||
                    cleanInput.includes('nmap') ||
                    cleanInput.includes('shodan') ||
                    cleanInput.includes('censys') ||
                    cleanInput.includes('spiderfoot') ||
                    cleanInput.includes('aquatone') ||
                    cleanInput.includes('recon-ng') ||
                    cleanInput.includes('maltego') ||
                    cleanInput.includes('firecompass') ||
                    cleanInput.includes('nasa.gov');

    // Simulate realistic execution delay
    setTimeout(() => {
      if (isMatch) {
        setOutputHistory(prev => [
          ...prev,
          { type: 'output', text: expectedOutput },
          { type: 'system', text: '[✓] Task execution verified! Telemetry updated.' }
        ]);
        sound.playSuccess();
        onSuccess();
      } else {
        setOutputHistory(prev => [
          ...prev,
          { 
            type: 'system', 
            text: `bash: syntax mismatch.\n[!] Target command:\n    ${expectedCommand}\n[!] Click 'Auto-Type' or 'Auto-Run' to proceed immediately.` 
          }
        ]);
        sound.playAlert();
      }
      setIsRunning(false);
      setInputValue('');
    }, 500);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInputValue(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInputValue(commandHistory[newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputValue('');
      }
    }
  };

  const handleCopyCommand = () => {
    navigator.clipboard.writeText(expectedCommand);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleClear = () => {
    setOutputHistory([]);
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 shadow-xl overflow-hidden font-mono flex flex-col h-[380px] sm:h-[420px]">
      {/* Terminal Title Bar */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-3 sm:px-4 py-2 flex items-center justify-between select-none flex-shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <span className="text-xs font-semibold text-slate-300 ml-1.5 flex items-center gap-1.5 truncate">
            <TerminalIcon className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" />
            <span className="truncate">{taskTitle || 'BASH TERMINAL EMULATOR'}</span>
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* Copy Command */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopyCommand}
            className="h-7 px-2 text-xs text-slate-400 hover:text-slate-100 hover:bg-slate-800 gap-1"
            title="Copy command"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden md:inline">{isCopied ? 'Copied' : 'Copy'}</span>
          </Button>

          {/* Clear Terminal */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="h-7 px-2 text-xs text-slate-400 hover:text-slate-100 hover:bg-slate-800"
            title="Clear output"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Target Command Helper Bar */}
      <div className="bg-slate-900/40 border-b border-slate-800/80 px-3 sm:px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs flex-shrink-0">
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          <span className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider flex-shrink-0">Cmd:</span>
          <code className="text-orange-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-700/60 truncate text-xs select-all">
            {expectedCommand}
          </code>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleAutoType}
            disabled={isRunning}
            className="h-7 text-xs bg-slate-800/80 hover:bg-slate-700 border-slate-700 text-orange-300 gap-1 px-2.5"
          >
            <Wand2 className="w-3 h-3 text-orange-400" />
            <span>Auto-Type</span>
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => executeCommand(expectedCommand)}
            disabled={isRunning}
            className="h-7 text-xs bg-orange-600 hover:bg-orange-500 text-white gap-1 px-2.5"
          >
            <Play className="w-3 h-3 fill-white" />
            <span>Auto-Run</span>
          </Button>
        </div>
      </div>

      {/* Terminal Internal Output Area - Scrolls internally WITHOUT affecting window scroll */}
      <div 
        ref={terminalOutputRef}
        className="flex-1 p-3 sm:p-4 overflow-y-auto custom-scrollbar text-xs sm:text-sm space-y-2 select-text bg-slate-950 font-mono"
      >
        {outputHistory.map((entry, idx) => (
          <div key={idx} className="leading-relaxed">
            {entry.type === 'input' && (
              <div className="text-cyan-400 font-semibold">
                {entry.text}
              </div>
            )}
            {entry.type === 'output' && (
              <pre className="text-emerald-400 whitespace-pre-wrap font-mono leading-relaxed bg-slate-900/50 p-2.5 rounded border border-emerald-950/60 text-xs sm:text-sm">
                {entry.text}
              </pre>
            )}
            {entry.type === 'system' && (
              <div className="text-slate-400 text-xs italic border-l-2 border-slate-700 pl-2 my-1 whitespace-pre-wrap">
                {entry.text}
              </div>
            )}
          </div>
        ))}

        {isRunning && (
          <div className="flex items-center gap-2 text-orange-400 animate-pulse text-xs py-1">
            <span className="w-2 h-2 rounded-full bg-orange-400 animate-ping" />
            Executing reconnaissance probe...
          </div>
        )}
      </div>

      {/* Terminal Input Bar */}
      <div className="p-2 sm:p-3 bg-slate-900/90 border-t border-slate-800 flex items-center gap-2 flex-shrink-0">
        <span className="text-cyan-400 font-bold text-xs sm:text-sm flex-shrink-0 select-none hidden sm:inline">
          {promptPrefix}
        </span>
        <span className="text-cyan-400 font-bold text-xs flex-shrink-0 select-none sm:hidden">
          $&gt;
        </span>
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Type command or click 'Auto-Type' / 'Auto-Run'...`}
            disabled={isRunning}
            className="w-full bg-transparent text-emerald-300 font-mono text-xs sm:text-sm focus:outline-none placeholder:text-slate-600 py-1"
          />
        </div>

        {/* Quick Fill Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleInstantFill}
          className="h-7 sm:h-8 px-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/60 hidden sm:inline-flex"
          title="Paste command"
        >
          Quick Fill
        </Button>

        {/* Submit Button */}
        <Button
          size="sm"
          onClick={() => executeCommand()}
          disabled={isRunning || !inputValue.trim()}
          className="h-7 sm:h-8 bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-2.5 sm:px-3 gap-1 font-semibold"
        >
          <span>Run</span>
          <CornerDownLeft className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
};
