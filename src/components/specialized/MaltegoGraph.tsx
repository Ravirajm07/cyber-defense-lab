import React, { useState } from 'react';
import { Layers, Globe, Server, Mail, Code, ExternalLink, Shield } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { sound } from '../../lib/audio';

interface NodeEntity {
  id: string;
  label: string;
  type: 'domain' | 'ipv4' | 'dns' | 'mx' | 'subdomain';
  x: number;
  y: number;
  details: string;
  icon: React.ReactNode;
}

export const MaltegoGraph: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<string>('nmap.org');
  const [activeTransform, setActiveTransform] = useState<string | null>(null);

  const nodes: NodeEntity[] = [
    {
      id: 'nmap.org',
      label: 'nmap.org',
      type: 'domain',
      x: 320,
      y: 160,
      details: 'Root Domain Entity. Registered via Namecheap, Inc. Authoritative nameservers hosted on Linode.',
      icon: <Globe className="w-5 h-5 text-yellow-400" />
    },
    {
      id: 'scanme.nmap.org',
      label: 'scanme.nmap.org\n[45.33.32.156]',
      type: 'ipv4',
      x: 120,
      y: 60,
      details: 'Official test server authorized by Gordon Lyon (Fyodor) for Nmap scanner validation. Open ports: 22, 80, 9929.',
      icon: <Server className="w-4 h-4 text-orange-400" />
    },
    {
      id: 'ns1.linode.com',
      label: 'ns1.linode.com\n[DNS Authoritative]',
      type: 'dns',
      x: 520,
      y: 70,
      details: 'Primary authoritative nameserver resolving all nmap.org zone records. High-availability Anycast DNS cluster.',
      icon: <Shield className="w-4 h-4 text-cyan-400" />
    },
    {
      id: 'mx.nmap.org',
      label: 'mx.nmap.org\n[Mail Exchanger]',
      type: 'mx',
      x: 140,
      y: 260,
      details: 'Priority 10 Mail Transfer Agent. Accepts inbound SMTP email for Gordon Lyon and Nmap development team.',
      icon: <Mail className="w-4 h-4 text-purple-400" />
    },
    {
      id: 'svn.nmap.org',
      label: 'svn.nmap.org\n[Code Repository]',
      type: 'subdomain',
      x: 500,
      y: 250,
      details: 'Legacy Subversion source code repository server hosting Nmap, Ncat, Nping and Zenmap public codebases.',
      icon: <Code className="w-4 h-4 text-emerald-400" />
    }
  ];

  const handleNodeClick = (nodeId: string) => {
    sound.playKeypress();
    setSelectedNode(nodeId);
  };

  const selectedData = nodes.find(n => n.id === selectedNode) || nodes[0];

  const triggerTransform = (transformName: string) => {
    sound.playKeypress();
    setActiveTransform(transformName);
    setTimeout(() => {
      setActiveTransform(null);
      sound.playSuccess();
    }, 1200);
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono">
      <div className="flex flex-wrap items-center justify-between pb-3 mb-3 border-b border-slate-800 gap-2">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-400" />
          <h4 className="text-sm font-bold text-slate-100 uppercase">
            Maltego CE Interactive Entity Graph
          </h4>
          <Badge variant="outline" className="text-[10px] border-blue-500/40 text-blue-400">
            5 Entities Mapped
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => triggerTransform('Enumerate Subdomains')}
            disabled={!!activeTransform}
            className="h-7 text-xs bg-slate-900 border-slate-700 text-cyan-300 hover:bg-slate-800"
          >
            {activeTransform ? 'Running Transform...' : 'Run DNS Transform'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Interactive SVG Graph Area */}
        <div className="lg:col-span-8 bg-slate-900/80 rounded-lg border border-slate-800/80 relative overflow-hidden min-h-[320px] flex items-center justify-center p-2">
          {/* Background Grid Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

          <svg viewBox="0 0 640 320" className="w-full h-full max-h-[320px] select-none">
            {/* Connecting Links */}
            {nodes.slice(1).map((node) => {
              const root = nodes[0];
              const isLinkedToSelected = selectedNode === 'nmap.org' || selectedNode === node.id;

              return (
                <g key={`link-${node.id}`}>
                  <line
                    x1={root.x}
                    y1={root.y}
                    x2={node.x}
                    y2={node.y}
                    stroke={isLinkedToSelected ? '#06B6D4' : '#334155'}
                    strokeWidth={isLinkedToSelected ? 2 : 1}
                    strokeDasharray={isLinkedToSelected ? undefined : '3 3'}
                  />
                  {/* Animated pulse dot along the link */}
                  <circle
                    r={2.5}
                    fill={isLinkedToSelected ? '#22D3EE' : '#64748B'}
                  >
                    <animateMotion
                      path={`M${root.x},${root.y} L${node.x},${node.y}`}
                      dur="3s"
                      repeatCount="indefinite"
                    />
                  </circle>
                </g>
              );
            })}

            {/* Render Nodes */}
            {nodes.map((node) => {
              const isSelected = selectedNode === node.id;
              const isRoot = node.id === 'nmap.org';

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  onClick={() => handleNodeClick(node.id)}
                  className="cursor-pointer group"
                >
                  {/* Halo glow if selected */}
                  {isSelected && (
                    <circle
                      r={isRoot ? 34 : 26}
                      fill="none"
                      stroke="#06B6D4"
                      strokeWidth={2}
                      className="animate-pulse"
                      opacity={0.7}
                    />
                  )}

                  {/* Node Circle */}
                  <circle
                    r={isRoot ? 28 : 20}
                    fill={isRoot ? '#1E293B' : '#0F172A'}
                    stroke={isSelected ? '#22D3EE' : isRoot ? '#F97316' : '#475569'}
                    strokeWidth={isSelected ? 2.5 : 1.5}
                    className="transition-all duration-200 group-hover:stroke-cyan-400"
                  />

                  {/* Node Label Text */}
                  <text
                    y={isRoot ? 42 : 32}
                    textAnchor="middle"
                    fill={isSelected ? '#38BDF8' : '#CBD5E1'}
                    fontSize={isRoot ? 11 : 9}
                    fontWeight={isRoot ? 'bold' : 'normal'}
                    fontFamily="monospace"
                  >
                    {node.id}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Legend Overlay */}
          <div className="absolute bottom-2 left-2 bg-slate-950/80 backdrop-blur border border-slate-800 rounded px-2 py-1 text-[9px] text-slate-400 flex items-center gap-2">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500" /> Domain</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-500" /> Infrastructure</span>
            <span className="text-slate-500">| Click node to inspect</span>
          </div>
        </div>

        {/* Selected Entity Inspector Panel */}
        <div className="lg:col-span-4 bg-slate-900/60 rounded-lg p-3.5 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400">
                Entity Inspector
              </span>
              <Badge variant="outline" className="text-[9px] border-slate-700 text-cyan-400 uppercase">
                {selectedData.type}
              </Badge>
            </div>

            <div className="flex items-center gap-2.5 mb-2">
              <div className="p-2 rounded bg-slate-800/80 border border-slate-700">
                {selectedData.icon}
              </div>
              <div>
                <h5 className="text-sm font-bold text-slate-100 truncate">
                  {selectedData.id}
                </h5>
                <span className="text-[10px] text-slate-400">Paterva Entity Model</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-2.5 rounded border border-slate-800/80 mb-3">
              {selectedData.details}
            </p>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800/60 text-slate-400">
                <span>Discovery Weight:</span>
                <span className="text-slate-200 font-semibold">100% Verified</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60 text-slate-400">
                <span>Direct Target Traffic:</span>
                <span className="text-emerald-400 font-semibold">0 Bytes (Passive Transform)</span>
              </div>
              <div className="flex justify-between py-1 text-slate-400">
                <span>Transform Provider:</span>
                <span className="text-cyan-400">Paterva Public Hub</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800">
            <span className="text-[10px] text-slate-400 block mb-1.5">Available Entity Actions:</span>
            <div className="flex gap-1.5">
              <Button
                size="sm"
                variant="outline"
                onClick={() => triggerTransform('Resolve IP')}
                className="flex-1 text-[10px] h-7 bg-slate-800/60 border-slate-700 hover:bg-slate-700 text-slate-200"
              >
                Resolve A Record
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => triggerTransform('Whois Transform')}
                className="flex-1 text-[10px] h-7 bg-slate-800/60 border-slate-700 hover:bg-slate-700 text-slate-200"
              >
                Query WHOIS
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

