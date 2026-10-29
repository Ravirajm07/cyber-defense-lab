import React from 'react';
import { Camera, ExternalLink, Globe, Server, CheckCircle2, Shield } from 'lucide-react';
import { Badge } from '../ui/badge';

export const AquatoneGallery: React.FC = () => {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono">
      <div className="flex flex-wrap items-center justify-between pb-3 mb-3 border-b border-slate-800 gap-2">
        <div className="flex items-center gap-2">
          <Camera className="w-4 h-4 text-teal-400" />
          <h4 className="text-sm font-bold text-slate-100 uppercase">
            Aquatone Visual Screenshot Report & DataSploit OSINT
          </h4>
        </div>
        <Badge variant="outline" className="text-[10px] border-teal-500/40 text-teal-300 bg-teal-950/30">
          Headless Chromium Engine
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Visual Flyover Screenshot Preview (Left Column) */}
        <div className="lg:col-span-7 bg-slate-900 rounded-lg border border-slate-800 overflow-hidden shadow-lg">
          {/* Browser Window Header Bar */}
          <div className="bg-slate-800/90 px-3 py-1.5 flex items-center justify-between border-b border-slate-700/80">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
              <span className="text-[10px] text-slate-300 font-mono ml-2">
                http://scanme.nmap.org:80
              </span>
            </div>
            <Badge className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[9px]">
              HTTP 200 OK
            </Badge>
          </div>

          {/* Rendered HTML Webpage Preview */}
          <div className="p-4 bg-slate-950/90 text-slate-200 font-sans border-b border-slate-800/80">
            <h3 className="text-base font-bold text-slate-100 mb-1">
              Go ahead and ScanMe!
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Hello, and welcome to Scanme.nmap.org, a service provided by the Nmap Security Scanner Project and Fyodor.
            </p>
            <div className="bg-slate-900 p-2.5 rounded text-[11px] text-slate-300 border border-slate-800 font-mono space-y-1">
              <div className="text-cyan-400 font-semibold">Authorized Scanning Rules:</div>
              <div>• You are authorized to scan this machine with Nmap or other port scanners.</div>
              <div>• Please do not spam or attempt denial-of-service against this host.</div>
            </div>
          </div>

          {/* Screenshot Metadata Bar */}
          <div className="bg-slate-900/60 p-2 px-3 text-[10px] font-mono text-slate-400 flex items-center justify-between">
            <span>Rendered at 1440x900 • 24bpp</span>
            <span className="text-teal-400">Similarity Hash: 88f2a9c1</span>
          </div>
        </div>

        {/* HTTP Headers & DataSploit Summary (Right Column) */}
        <div className="lg:col-span-5 space-y-3">
          {/* HTTP Response Headers Card */}
          <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 text-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Probed HTTP Response Headers
            </span>
            <div className="bg-slate-950 p-2 rounded border border-slate-800/80 space-y-1 text-[11px] font-mono text-slate-300">
              <div><span className="text-cyan-400">HTTP/1.1</span> 200 OK</div>
              <div><span className="text-cyan-400">Date:</span> Thu, 29 Oct 2026 08:30:12 GMT</div>
              <div><span className="text-cyan-400">Server:</span> Apache/2.4.7 (Ubuntu)</div>
              <div><span className="text-cyan-400">Content-Type:</span> text/html; charset=UTF-8</div>
              <div><span className="text-cyan-400">Content-Length:</span> 158</div>
              <div><span className="text-cyan-400">Connection:</span> close</div>
            </div>
          </div>

          {/* DataSploit Aggregated Intelligence Card */}
          <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 text-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-orange-400" />
              DataSploit Domain Profiler
            </span>
            <div className="space-y-1.5 text-[11px] text-slate-300">
              <div className="flex justify-between py-0.5 border-b border-slate-800">
                <span className="text-slate-400">Registrar:</span>
                <span className="font-mono text-slate-200">Namecheap Inc.</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-slate-800">
                <span className="text-slate-400">Admin Email:</span>
                <span className="font-mono text-orange-300">fyodor@insecure.org</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-slate-800">
                <span className="text-slate-400">Nameservers:</span>
                <span className="font-mono text-cyan-300">ns1.linode.com, ns2.linode.com</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-400">Web Technology:</span>
                <span className="font-mono text-emerald-400">Apache 2.4.7 on Linux Ubuntu</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

