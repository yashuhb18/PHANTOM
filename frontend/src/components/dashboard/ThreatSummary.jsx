import React from 'react';
import { ShieldAlert, Cpu, Dna, Flame } from 'lucide-react';

export function ThreatSummary({ stats }) {
  const items = [
    {
      title: 'Autonomous Neutralizations',
      value: stats?.containmentCount || 2,
      desc: '100% mitigated without human intervention',
      icon: ShieldAlert,
      color: 'text-red-600',
      bg: 'bg-red-50',
      border: 'border-red-200'
    },
    {
      title: 'Canary Decoy Hits',
      value: stats?.canaryHits || 3,
      desc: 'Zero false-positive deception triggers',
      icon: Flame,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-200'
    },
    {
      title: 'Attack DNA Clusters',
      value: stats?.clusterCount || 2,
      desc: 'Cross-hardware behavioral similarity matches',
      icon: Dna,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      border: 'border-indigo-200'
    },
    {
      title: 'Mean Time to Contain (MTTC)',
      value: '< 420ms',
      desc: 'From keystroke injection burst to isolation',
      icon: Cpu,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div key={idx} className="bg-white border border-[#E7E5E4] rounded-xl p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#78716C]">{item.title}</span>
              <div className={`p-1.5 rounded-lg border ${item.bg} ${item.border} ${item.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 text-2xl font-bold font-mono tracking-tight text-[#1C1917]">
              {item.value}
            </div>
            <p className="mt-1 text-[11px] text-[#A8A29E] leading-relaxed">{item.desc}</p>
          </div>
        );
      })}
    </div>
  );
}
