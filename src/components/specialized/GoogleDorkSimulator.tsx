import React, { useState } from 'react';
import { Search, Globe, FileText, FolderOpen, FileCode, CheckCircle, ExternalLink, ShieldCheck } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { sound } from '../../lib/audio';

export const GoogleDorkSimulator: React.FC = () => {
  const [selectedDorkIndex, setSelectedDorkIndex] = useState(0);
  const [queryInput, setQueryInput] = useState('site:nasa.gov filetype:pdf "assessment"');
  const [isSearching, setIsSearching] = useState(false);

  const dorkPresets = [
    {
      id: 1,
      title: 'Dork 1: Government Assessment PDFs',
      query: 'site:nasa.gov filetype:pdf "assessment"',
      icon: <FileText className="w-3.5 h-3.5 text-blue-400" />,
      tag: 'filetype:pdf',
      description: 'Filters for confidential audit reports and risk evaluations indexed by Google web crawlers.',
      results: [
        {
          title: 'NASA Cybersecurity Architecture & Threat Assessment (Final).pdf',
          url: 'https://www.nasa.gov/reports/cyber_risk_assessment_2024.pdf',
          snippet: '...confidential vulnerability assessment of JPL flight software telemetry interfaces. Identifies perimeter firewall rules, unauthenticated API endpoints, and internal jump-hosts...',
          meta: 'PDF • 4.2 MB • Indexed: 3 weeks ago'
        },
        {
          title: 'NASA Goddard Space Center Critical Infrastructure Risk Audit.pdf',
          url: 'https://science.nasa.gov/docs/goddard_assessment_unredacted.pdf',
          snippet: '...third-party security audit identifying legacy SCADA subnets and unpatched Apache Tomcat servers within Goddard research labs...',
          meta: 'PDF • 1.8 MB • Indexed: 1 month ago'
        }
      ]
    },
    {
      id: 2,
      title: 'Dork 2: Open Directory Listings',
      query: 'intitle:"index of" "parent directory"',
      icon: <FolderOpen className="w-3.5 h-3.5 text-yellow-400" />,
      tag: 'intitle:index of',
      description: 'Finds misconfigured web servers where directory browsing is enabled, exposing raw file trees.',
      results: [
        {
          title: 'Index of /backup/database',
          url: 'https://target-portal.example.com/backup/database/',
          snippet: 'Parent Directory | dump_prod_2026.sql.gz (142MB) | config.json.bak (12KB) | staging_users.csv (4.1MB) - Apache/2.4.7 Server at target-portal.example.com Port 80...',
          meta: 'Open Directory • Raw Files • Indexed: 2 days ago'
        },
        {
          title: 'Index of /internal/uploads/contracts',
          url: 'https://partner-portal.example.com/internal/uploads/',
          snippet: 'Parent Directory | vendor_agreements.zip | employee_vpn_profiles.ovpn | private_keys.tar.gz - Apache Server at partner-portal.example.com...',
          meta: 'Open Directory • Sensitive Assets • Indexed: 5 days ago'
        }
      ]
    },
    {
      id: 3,
      title: 'Dork 3: Exposed Logs & Config Files',
      query: 'intitle:"index of" ext:log OR ext:cfg',
      icon: <FileCode className="w-3.5 h-3.5 text-red-400" />,
      tag: 'ext:log OR ext:cfg',
      description: 'Discovers active error logs, debug traces, and configuration files containing plaintext credentials.',
      results: [
        {
          title: 'Index of /logs/auth.log',
          url: 'https://auth-gateway.example.com/logs/access.log',
          snippet: '...[2026-10-28 14:12:02] Failed login for user admin from IP 192.168.1.10. DB_PASS=SecretAdminPass9921! DB_HOST=prod-db.internal...',
          meta: 'Server Log • Credential Leak • Indexed: 12 hours ago'
        },
        {
          title: 'application.cfg / database.cfg preview',
          url: 'https://api-service.example.com/config/database.cfg',
          snippet: '[database] host=10.0.1.50 port=3306 user=root password=P@ssw0rd2026! ssl_mode=disabled [aws] s3_bucket=company-internal-assets...',
          meta: 'Config File • High Severity • Indexed: 1 day ago'
        }
      ]
    }
  ];

  const handleSelectDork = (index: number) => {
    sound.playKeypress();
    setSelectedDorkIndex(index);
    setQueryInput(dorkPresets[index].query);
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      sound.playSuccess();
    }, 400);
  };

  const currentDork = dorkPresets[selectedDorkIndex];

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between pb-3 mb-3 border-b border-slate-800 gap-2">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-yellow-400" />
          <h4 className="text-sm font-bold text-slate-100 uppercase">
            Google Dorking (GHDB) Engine Simulator
          </h4>
          <Badge variant="outline" className="text-[10px] border-emerald-500/40 text-emerald-400 bg-emerald-950/40 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            100% Passive (0 Target Packets)
          </Badge>
        </div>
        <span className="text-xs text-slate-400">
          Source: Google Hacking Database Operators
        </span>
      </div>

      {/* Preset Dork Selector Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4">
        {dorkPresets.map((preset, idx) => (
          <button
            key={preset.id}
            onClick={() => handleSelectDork(idx)}
            className={`p-2.5 rounded-lg border text-left transition-all text-xs ${
              selectedDorkIndex === idx
                ? 'bg-slate-900 border-yellow-500/60 ring-1 ring-yellow-500/40 text-slate-100'
                : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:bg-slate-900 hover:text-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold flex items-center gap-1.5 text-xs text-yellow-300">
                {preset.icon}
                {preset.title.split(':')[0]}
              </span>
              <Badge variant="outline" className="text-[9px] border-slate-700 text-slate-400">
                {preset.tag}
              </Badge>
            </div>
            <p className="text-[11px] text-slate-400 truncate">
              {preset.query}
            </p>
          </button>
        ))}
      </div>

      {/* Simulated Search Bar */}
      <div className="bg-slate-900 rounded-lg p-2.5 border border-slate-800 mb-4 flex items-center gap-2">
        <Search className="w-4 h-4 text-slate-400 ml-1 flex-shrink-0" />
        <input
          type="text"
          value={queryInput}
          onChange={(e) => setQueryInput(e.target.value)}
          className="flex-1 bg-transparent text-xs sm:text-sm text-yellow-300 font-mono focus:outline-none"
          placeholder="Enter search dork..."
        />
        <Button
          size="sm"
          onClick={() => {
            sound.playKeypress();
            setIsSearching(true);
            setTimeout(() => {
              setIsSearching(false);
              sound.playSuccess();
            }, 300);
          }}
          disabled={isSearching}
          className="h-8 text-xs bg-yellow-600 hover:bg-yellow-500 text-black font-bold"
        >
          {isSearching ? 'Searching Cache...' : 'Search Google Cache'}
        </Button>
      </div>

      {/* Simulated Search Results */}
      <div className="bg-slate-900/60 rounded-lg p-4 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs text-slate-400">
          <span>About {currentDork.results.length} indexed results (0.18 seconds)</span>
          <span className="text-emerald-400 text-[11px] flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-emerald-400" />
            Zero target packets transmitted
          </span>
        </div>

        {isSearching ? (
          <div className="py-8 text-center text-xs text-slate-400 animate-pulse">
            Querying Google Search index and cached document repositories...
          </div>
        ) : (
          <div className="space-y-4">
            {currentDork.results.map((res, idx) => (
              <div key={idx} className="space-y-1 bg-slate-950/70 p-3 rounded-lg border border-slate-800/80 hover:border-slate-700 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-cyan-400 truncate flex items-center gap-1">
                    <Globe className="w-3 h-3 text-cyan-400" />
                    {res.url}
                  </span>
                  <Badge variant="outline" className="text-[9px] border-slate-700 text-slate-400">
                    {res.meta}
                  </Badge>
                </div>
                <h5 className="text-xs sm:text-sm font-bold text-yellow-300 hover:underline cursor-pointer flex items-center gap-1">
                  {res.title}
                </h5>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {res.snippet}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Informative Note */}
        <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-800">
          <strong className="text-slate-300">Pentester Takeaway:</strong> Because Google has already crawled these web servers during routine indexing, inspecting these results leaves <span className="text-emerald-400 font-semibold">zero footprint</span> on the target organization\'s firewall or server logs.
        </div>
      </div>
    </div>
  );
};

