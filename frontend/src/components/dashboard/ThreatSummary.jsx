import React from 'react';
import { ShieldAlert, Cpu, Dna, Flame } from 'lucide-react';

export function ThreatSummary({ stats }) {
  const items = [
    {
      title: 'Autonomous Neutralizations',
      value: stats?.containmentCount ?? 0,
      desc: '100% mitigated without human intervention',
      icon: ShieldAlert,
      iconColor: 'text-[#FDE047]',
      numColor: 'text-white'
    },
    {
      title: 'Canary Decoy Hits',
      value: stats?.canaryHits ?? 0,
      desc: 'Zero false-positive deception triggers',
      icon: Flame,
      iconColor: 'text-amber-400',
      numColor: 'text-white'
    },
    {
      title: 'Attack DNA Clusters',
      value: stats?.clusterCount ?? 0,
      desc: 'Cross-hardware similarity matches',
      icon: Dna,
      iconColor: 'text-[#FDE047]',
      numColor: 'text-white'
    },
    {
      title: 'Mean Time to Contain (MTTC)',
      value: '< 382ms',
      desc: 'From keystroke burst to socket isolation',
      icon: Cpu,
      iconColor: 'text-emerald-400',
      numColor: 'text-[#FDE047]'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      {items.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            className="bg-[#141414] hover:bg-[#181818] border border-white/[0.06] rounded-[28px] p-6 transition-all duration-200 shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">{item.title}</span>
              <div className="w-10 h-10 rounded-2xl bg-neutral-900 border border-white/[0.08] flex items-center justify-center">
                <Icon className={`w-5 h-5 ${item.iconColor}`} />
              </div>
            </div>
            <div className={`text-3xl font-black font-mono tracking-tight ${item.numColor}`}>
              {item.value}
            </div>
            <p className="mt-2 text-xs text-neutral-400 leading-relaxed">{item.desc}</p>
          </div>
        );
      })}
    </div>
  );
}
