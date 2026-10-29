import React, { useState } from 'react';
import { Code2, Copy, Check, X, ExternalLink, Terminal } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { GOOGLE_COLAB_SCRIPT } from '../data/labData';
import { sound } from '../lib/audio';

interface ColabModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ColabModal: React.FC<ColabModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(GOOGLE_COLAB_SCRIPT);
    setCopied(true);
    sound.playSuccess();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[85vh] bg-slate-950 border border-slate-800 text-slate-100 flex flex-col p-0 overflow-hidden font-mono">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-400">
              <Code2 className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <DialogTitle className="text-sm sm:text-base font-bold text-slate-100 uppercase tracking-tight">
                Google Colab Python Script: 100-Tree Isolation Forest
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-400">
                Self-contained, production-grade scikit-learn anomaly detection code for student notebooks.
              </DialogDescription>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={handleCopy}
              className="h-8 bg-cyan-600 hover:bg-cyan-500 text-black font-bold text-xs gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Entire Script'}</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Code Content */}
        <div className="flex-1 p-4 overflow-y-auto bg-slate-950 text-xs text-emerald-400 leading-relaxed select-text font-mono">
          <pre className="whitespace-pre-wrap">{GOOGLE_COLAB_SCRIPT}</pre>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between text-xs text-slate-400">
          <span>Requires: numpy, pandas, matplotlib, scikit-learn</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open('https://colab.research.google.com/', '_blank')}
            className="h-7 text-xs bg-slate-800 border-slate-700 text-cyan-300 hover:bg-slate-700 gap-1.5"
          >
            <span>Open Google Colab</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

