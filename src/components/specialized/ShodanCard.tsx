import React from 'react';
import { Globe, Server, ShieldAlert, ShieldCheck, Cpu, MapPin } from 'lucide-react';
import { Badge } from '../ui/badge';

export const ShodanCard: React.FC = () => {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono">
      <div className="flex flex-wrap items-center justify-between pb-3 mb-3 border-b border-slate-800 gap-2">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-red-400" />
          <h4 className="text-sm font-bold text-slate-100 uppercase">
            Shodan Host Intelligence Profile (IP: 45.33.32.156)
          </h4>
        </div>
        <Badge variant="outline" className="text-[10px] border-emerald-500/40 text-emerald-400 bg-emerald-950/40 flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          Zero Direct Target Packets (Cached Data)
        </Badge>
      </div>

      {/* Global Banner Stat */}
      <div className="bg-gradient-to-r from-red-950/40 via-slate-900 to-slate-900 p-3 rounded-lg border border-red-900/40 mb-4 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-red-400 uppercase font-semibold block">
            Shodan Global Device Index Query
          </span>
          <span className="text-xs text-slate-300 font-mono">
            Filter: <code className="text-yellow-300 bg-slate-950 px-1 py-0.5 rounded">apache port:80</code>
          </span>
        </div>
        <div className="text-right">
          <span className="text-lg sm:text-xl font-bold text-red-400 font-mono">
            14,829,410
          </span>
          <span className="text-[10px] text-slate-400 block">Exposed Devices Worldwide</span>
        </div>
      </div>

      {/* Host Metadata Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4 text-xs">
        <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800">
          <span className="text-[10px] text-slate-500 block uppercase">Organization</span>
          <span className="text-slate-200 font-bold truncate block mt-0.5">Linode LLC</span>
        </div>
        <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800">
          <span className="text-[10px] text-slate-500 block uppercase">Location</span>
          <span className="text-slate-200 font-bold flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3 text-cyan-400" />
            Fremont, CA (US)
          </span>
        </div>
        <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800">
          <span className="text-[10px] text-slate-500 block uppercase">Autonomous System</span>
          <span className="text-slate-200 font-bold block mt-0.5">AS63949</span>
        </div>
        <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800">
          <span className="text-[10px] text-slate-500 block uppercase">Open Ports</span>
          <span className="text-orange-400 font-bold block mt-0.5">4 Ports Discovered</span>
        </div>
      </div>

      {/* Discovered Open Ports & Service Banners */}
      <div className="space-y-2 mb-4">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
          Discovered Service Banners & Protocols
        </span>

        {/* Port 22 */}
        <div className="bg-slate-900/60 p-2.5 rounded border border-slate-800 flex items-start justify-between text-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-1.5 py-0.5 rounded bg-orange-950/80 text-orange-400 border border-orange-800 font-bold text-[10px]">
                PORT 22 / TCP
              </span>
              <span className="font-bold text-slate-200">OpenSSH 6.6.1p1</span>
              <span className="text-[10px] text-slate-500">Ubuntu 2ubuntu2.13</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 font-mono">
              SSH-2.0-OpenSSH_6.6.1p1 Ubuntu-2ubuntu2.13 | Key-Type: ssh-rsa
            </p>
          </div>
          <Badge variant="outline" className="text-[9px] border-slate-700 text-slate-400">
            Encrypted Remote Login
          </Badge>
        </div>

        {/* Port 80 */}
        <div className="bg-slate-900/60 p-2.5 rounded border border-slate-800 flex items-start justify-between text-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800 font-bold text-[10px]">
                PORT 80 / TCP
              </span>
              <span className="font-bold text-slate-200">Apache httpd 2.4.7</span>
              <span className="text-[10px] text-slate-500">((Ubuntu))</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 font-mono">
              HTTP/1.1 200 OK | Title: Go ahead and ScanMe! | Server: Apache/2.4.7
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Badge variant="outline" className="text-[9px] border-red-700/80 text-red-400 bg-red-950/40">
              CVE-2017-7679
            </Badge>
          </div>
        </div>

        {/* Port 9929 */}
        <div className="bg-slate-900/60 p-2.5 rounded border border-slate-800 flex items-start justify-between text-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800 font-bold text-[10px]">
                PORT 9929 / TCP
              </span>
              <span className="font-bold text-slate-200">nping-echo</span>
              <span className="text-[10px] text-slate-500">Nping Echo Protocol</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 font-mono">
              Nping Echo Server validation daemon for network latency and packet analysis.
            </p>
          </div>
          <Badge variant="outline" className="text-[9px] border-slate-700 text-slate-400">
            Nmap Utility
          </Badge>
        </div>
      </div>

      <div className="p-2.5 bg-slate-900/40 rounded border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
        <span>
          <strong className="text-slate-300">Passive Advantage:</strong> Shodan indexed these services months prior. You have full service versions and CVE vectors without initiating a single SYN packet!
        </span>
      </div>
    </div>
  );
};

