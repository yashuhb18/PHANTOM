import React from 'react';
import { Zap, ShieldCheck, Cpu, Radio } from 'lucide-react';

export const MetricsBanner: React.FC = () => {
  const metrics = [
    {
      value: '< 120ms',
      label: 'MEAN TIME TO CONTAIN',
      description: 'Autonomous eBPF socket termination',
      icon: Zap,
      color: 'text-safe'
    },
    {
      value: '0.01%',
      label: 'FALSE POSITIVE NOISE',
      description: 'Zero heuristic alert fatigue',
      icon: ShieldCheck,
      color: 'text-accent'
    },
    {
      value: '< 1.2%',
      label: 'KERNEL CPU FOOTPRINT',
      description: 'Zero-copy ring buffer telemetry',
      icon: Cpu,
      color: 'text-primary-light dark:text-primary-dark'
    },
    {
      value: '100%',
      label: 'DETERMINISTIC SIGNAL',
      description: 'Decoys never accessed by valid users',
      icon: Radio,
      color: 'text-accent'
    }
  ];

  return (
    <section id="metrics" className="py-16 border-b border-border-light dark:border-border-dark bg-base-light dark:bg-base-dark">
      <div className="max-w-page mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="text-meta text-accent font-mono">BENCHMARKS & EFFICACY</div>
          <h2 className="text-[28px] sm:text-[34px] font-bold text-primary-light dark:text-primary-dark tracking-tight">
            Engineered for Precision Performance
          </h2>
          <p className="text-body text-secondary-light dark:text-secondary-dark text-[15px]">
            Quantitative metrics verified across production Kubernetes clusters.
          </p>
        </div>

        {/* 4 Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {metrics.map((m, idx) => {
            const Icon = m.icon;
            return (
              <div
                key={idx}
                className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-card p-5 space-y-3 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded bg-base-light dark:bg-base-dark border border-border-light dark:border-border-dark text-accent">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="w-2 h-2 rounded-full bg-safe" />
                </div>

                <div>
                  <div className={`text-[32px] font-bold font-mono tracking-tight ${m.color}`}>
                    {m.value}
                  </div>
                  <div className="text-meta text-secondary-light dark:text-secondary-dark text-[11px] mt-1 font-mono">
                    {m.label}
                  </div>
                  <div className="text-[12px] text-secondary-light dark:text-secondary-dark mt-1 font-sans">
                    {m.description}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
