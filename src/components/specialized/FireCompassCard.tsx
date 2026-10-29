import React from 'react';
import { Flame, ShieldAlert, Database, Key, Cloud, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Badge } from '../ui/badge';

export const FireCompassCard: React.FC = () => {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono">
      <div className="flex flex-wrap items-center justify-between pb-3 mb-3 border-b border-slate-800 gap-2">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-orange-400" />
          <h4 className="text-sm font-bold text-slate-100 uppercase">
            FireCompass Attack Surface & Attack Path Simulation
          </h4>
        </div>
        <Badge className="bg-red-950/80 text-red-400 border border-red-800/80 text-[10px]">
          1 Critical Attack Path Chained
        </Badge>
      </div>

      {/* Discovered Shadow IT Assets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        {/* Asset 1: S3 Bucket */}
        <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-400 font-semibold flex items-center gap-1.5">
              <Cloud className="w-3.5 h-3.5 text-blue-400" />
              Exposed Storage
            </span>
            <Badge variant="outline" className="text-[9px] border-amber-600/60 text-amber-400">
              Public Read
            </Badge>
          </div>
          <div className="text-xs font-bold text-slate-200 truncate mt-1">
            s3://example-corp-dev-backups
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            Contains 14 database backups, `.env` config dumps, and developer workstation logs.
          </p>
        </div>

        {/* Asset 2: Leaked GitHub Key */}
        <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-400 font-semibold flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-yellow-400" />
              Leaked Secret
            </span>
            <Badge variant="outline" className="text-[9px] border-red-600/60 text-red-400">
              High Severity
            </Badge>
          </div>
          <div className="text-xs font-bold text-slate-200 truncate mt-1">
            ghp_9284ksm... (GitHub PAT)
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            Unredacted personal access token found in public commit history of legacy frontend repo.
          </p>
        </div>

        {/* Asset 3: Exposed MySQL DB */}
        <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-400 font-semibold flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-red-400" />
              Production DB
            </span>
            <Badge variant="outline" className="text-[9px] border-red-600/60 text-red-400">
              Port 3306 Open
            </Badge>
          </div>
          <div className="text-xs font-bold text-slate-200 truncate mt-1">
            45.33.32.156:3306 (MySQL 8.0)
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            Database listener bound to public interface without firewall subnet restrictions.
          </p>
        </div>
      </div>

      {/* Chained Attack Path Flow Diagram */}
      <div className="bg-slate-900/90 rounded-lg p-3.5 border border-red-950/80 mb-4">
        <span className="text-xs font-bold text-red-400 uppercase tracking-wider block mb-2">
          Autonomous Attack Path Simulation (Crown Jewel Target: MySQL Production DB)
        </span>
        <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-xs">
          <div className="bg-slate-950 p-2.5 rounded border border-slate-800 text-center flex-1 w-full">
            <span className="text-[10px] text-slate-500 block">STEP 1</span>
            <span className="text-slate-200 font-semibold">Public Internet</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Automated Recon Sweep</span>
          </div>

          <ArrowRight className="w-4 h-4 text-orange-400 flex-shrink-0 rotate-90 md:rotate-0" />

          <div className="bg-slate-950 p-2.5 rounded border border-amber-800/60 text-center flex-1 w-full">
            <span className="text-[10px] text-amber-500 block">STEP 2</span>
            <span className="text-amber-300 font-semibold">Exposed S3 Bucket</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Read staging credentials</span>
          </div>

          <ArrowRight className="w-4 h-4 text-orange-400 flex-shrink-0 rotate-90 md:rotate-0" />

          <div className="bg-slate-950 p-2.5 rounded border border-orange-800/60 text-center flex-1 w-full">
            <span className="text-[10px] text-orange-500 block">STEP 3</span>
            <span className="text-orange-300 font-semibold">GitHub Token Pivot</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Cloned private repo configs</span>
          </div>

          <ArrowRight className="w-4 h-4 text-red-500 flex-shrink-0 rotate-90 md:rotate-0" />

          <div className="bg-red-950/60 p-2.5 rounded border border-red-600 text-center flex-1 w-full">
            <span className="text-[10px] text-red-400 block font-bold">COMPROMISE</span>
            <span className="text-red-200 font-bold">MySQL Database</span>
            <span className="text-[10px] text-red-300 block mt-0.5">Full Crown Jewel Access</span>
          </div>
        </div>
      </div>

      {/* Prioritized Remediation Guidance */}
      <div className="bg-slate-900/60 rounded-lg p-3 border border-slate-800 text-xs">
        <span className="font-bold text-slate-200 block mb-2 text-xs flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          Prioritized Remediation Guidance:
        </span>
        <ul className="space-y-1.5 text-slate-300">
          <li className="flex items-start gap-2">
            <span className="text-orange-400 font-bold">1.</span>
            <span>Revoke GitHub Personal Access Token <code className="text-yellow-300 bg-slate-950 px-1 py-0.5 rounded">ghp_9284ksm...</code> immediately and rotate production DB credentials.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-400 font-bold">2.</span>
            <span>Enable AWS S3 "Block Public Access" policy on <code className="text-cyan-300 bg-slate-950 px-1 py-0.5 rounded">s3://example-corp-dev-backups</code>.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-400 font-bold">3.</span>
            <span>Update cloud security group rules to restrict MySQL port 3306 behind internal VPN gateway.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

