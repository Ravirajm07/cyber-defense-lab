import React, { useState } from 'react';
import { Radio, ExternalLink, Network, FileText, Shield, Database, CheckCircle, BarChart3 } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

export const SpiderFootPreview: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'dns' | 'asn' | 'whois' | 'threat'>('all');

  const categories = [
    { id: 'all', label: 'All OSINT (86)', count: 86 },
    { id: 'dns', label: 'DNS & Subdomains (14)', count: 14 },
    { id: 'asn', label: 'BGP / Routing (6)', count: 6 },
    { id: 'whois', label: 'WHOIS & Registrar (12)', count: 12 },
    { id: 'threat', label: 'Threat Reputation (8)', count: 8 }
  ];

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono">
      {/* Web UI Browser Mockup Header */}
      <div className="flex flex-wrap items-center justify-between pb-3 mb-3 border-b border-slate-800 gap-2">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-cyan-400" />
          <h4 className="text-sm font-bold text-slate-100 uppercase">
            SpiderFoot Web UI (Simulated Server :5001)
          </h4>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[10px] border-cyan-500/40 text-cyan-400 bg-cyan-950/40">
            http://127.0.0.1:5001
          </Badge>
          <Badge className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px]">
            Scan Finished: SF-20261029-8812
          </Badge>
        </div>
      </div>

      {/* SpiderFoot Dashboard Nav */}
      <div className="bg-slate-900/80 rounded-lg p-2.5 border border-slate-800 mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Target:</span>
          <span className="text-yellow-400 font-bold">scanme.nmap.org</span>
          <span className="text-slate-500">| Profile:</span>
          <span className="text-cyan-300 font-semibold">PASSIVE (100+ OSINT Modules)</span>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                activeCategory === cat.id
                  ? 'bg-cyan-600 text-white font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Discovered OSINT Elements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        {/* Card 1: DNS & Netblocks */}
        {(activeCategory === 'all' || activeCategory === 'dns') && (
          <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs pb-1 border-b border-slate-800">
              <span className="font-bold text-slate-200 flex items-center gap-1.5">
                <Network className="w-3.5 h-3.5 text-cyan-400" />
                DNS & Host Discovery
              </span>
              <span className="text-[10px] text-slate-400">sfp_dnsresolve</span>
            </div>
            <div className="space-y-1 text-xs text-slate-300">
              <div className="flex justify-between py-0.5">
                <span className="text-slate-400">A Record:</span>
                <span className="text-emerald-400 font-mono">45.33.32.156</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-400">IPv6 Record:</span>
                <span className="text-slate-300 font-mono">2600:3c01::f03c:91ff:fe18:bb2f</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-400">Discovered CNAMEs:</span>
                <span className="text-cyan-300 font-mono">svn, chat, images</span>
              </div>
            </div>
          </div>
        )}

        {/* Card 2: BGP & ASN */}
        {(activeCategory === 'all' || activeCategory === 'asn') && (
          <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs pb-1 border-b border-slate-800">
              <span className="font-bold text-slate-200 flex items-center gap-1.5">
                <BarChart3 className="w-3.5 h-3.5 text-orange-400" />
                BGP ASN & Routing Paths
              </span>
              <span className="text-[10px] text-slate-400">sfp_bgpview</span>
            </div>
            <div className="space-y-1 text-xs text-slate-300">
              <div className="flex justify-between py-0.5">
                <span className="text-slate-400">Origin Autonomous System:</span>
                <span className="text-orange-300 font-mono">AS63949 (Linode, LLC)</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-400">Announced Prefix:</span>
                <span className="text-slate-300 font-mono">45.33.32.0/20</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-400">Upstream Transit:</span>
                <span className="text-slate-300 font-mono">Telia Carrier / Arelion</span>
              </div>
            </div>
          </div>
        )}

        {/* Card 3: WHOIS Registrar */}
        {(activeCategory === 'all' || activeCategory === 'whois') && (
          <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs pb-1 border-b border-slate-800">
              <span className="font-bold text-slate-200 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-yellow-400" />
                WHOIS Registration Records
              </span>
              <span className="text-[10px] text-slate-400">sfp_whois</span>
            </div>
            <div className="space-y-1 text-xs text-slate-300">
              <div className="flex justify-between py-0.5">
                <span className="text-slate-400">Registrar:</span>
                <span className="text-slate-200 font-mono">Namecheap, Inc.</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-400">Creation Date:</span>
                <span className="text-slate-300 font-mono">1997-12-19 (29 years old)</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-400">Registrant Country:</span>
                <span className="text-slate-300 font-mono">US (United States)</span>
              </div>
            </div>
          </div>
        )}

        {/* Card 4: Threat Intelligence */}
        {(activeCategory === 'all' || activeCategory === 'threat') && (
          <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs pb-1 border-b border-slate-800">
              <span className="font-bold text-slate-200 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                Multi-Source Threat Reputation
              </span>
              <span className="text-[10px] text-slate-400">sfp_virustotal</span>
            </div>
            <div className="space-y-1 text-xs text-slate-300">
              <div className="flex justify-between py-0.5">
                <span className="text-slate-400">VirusTotal Detection:</span>
                <span className="text-emerald-400 font-bold">0 / 92 Engines (Clean)</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-400">AbuseIPDB Confidence:</span>
                <span className="text-emerald-400 font-bold">0% Malicious</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-400">Spamhaus SBL:</span>
                <span className="text-emerald-400 font-bold">Not Listed</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-2.5 bg-slate-900/40 rounded border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
        <span>Running SpiderFoot in passive mode harvested 86 intelligence records without tripping IDS alerts.</span>
        <Badge variant="outline" className="text-[9px] border-emerald-600 text-emerald-400">
          Clean Footprint
        </Badge>
      </div>
    </div>
  );
};

