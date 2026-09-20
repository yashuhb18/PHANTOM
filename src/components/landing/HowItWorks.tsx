import React from 'react';
import { ShieldAlert, Cpu, Zap } from 'lucide-react';

const pillars = [
  {
    step: '01',
    title: 'Deploy High-Fidelity Decoys',
    category: 'SYNTHETIC DECEPTION',
    icon: ShieldAlert,
    description: 'Inject synthetic AWS credentials, SSH canary keys, and decoy files into container namespaces. Legitimate services never access them, guaranteeing a 100% deterministic signal.'
  },
  {
    step: '02',
    title: 'Kernel eBPF Telemetry',
    category: 'RING-0 MONITORING',
    icon: Cpu,
    description: 'Hook directly into syscall ring buffers (openat, ptrace, connect) with <1.2% CPU overhead. Zero user-space polling, zero false-positive alert fatigue.'
  },
  {
    step: '03',
    title: 'Autonomous Micro-Containment',
    category: 'SUB-120MS SEVERANCE',
    icon: Zap,
    description: 'When a canary is touched, eBPF terminates the adversary socket and freezes the process tree in 112ms. Neighboring production workloads continue unaffected.'
  }
];

export const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-16 border-b border-border-light dark:border-border-dark bg-base-light dark:bg-base-dark">
      <div className="max-w-page mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <div className="text-meta text-accent font-mono">HOW IT WORKS</div>
          <h2 className="text-[28px] sm:text-[34px] font-bold text-primary-light dark:text-primary-dark tracking-tight">
            Precision Deception in Three Deterministic Steps
          </h2>
          <p className="text-body text-secondary-light dark:text-secondary-dark text-[15px]">
            Replace noisy heuristic alert queues with immediate kernel-level interception.
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.step}
                className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-card p-6 flex flex-col justify-between shadow-sm space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[12px] font-bold text-accent">
                      STEP {pillar.step}
                    </span>
                    <span className="text-[10px] font-mono text-secondary-light dark:text-secondary-dark uppercase tracking-wider">
                      {pillar.category}
                    </span>
                  </div>

                  <div className="w-10 h-10 rounded-lg bg-base-light dark:bg-base-dark border border-border-light dark:border-border-dark flex items-center justify-center text-accent">
                    <Icon className="w-5 h-5" />
                  </div>

                  <h3 className="text-[17px] font-bold text-primary-light dark:text-primary-dark leading-snug">
                    {pillar.title}
                  </h3>

                  <p className="text-[13px] text-secondary-light dark:text-secondary-dark leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
