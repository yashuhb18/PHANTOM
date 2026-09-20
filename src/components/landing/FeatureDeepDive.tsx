import React from 'react';
import {
  ShieldAlert,
  Zap,
  Radio,
  FileCheck2,
  Server,
  Cpu
} from 'lucide-react';

interface FeatureCard {
  title: string;
  category: string;
  description: string;
  icon: React.ElementType;
  specs: string[];
}

const features: FeatureCard[] = [
  {
    title: 'eBPF Micro-Quarantine & Socket Severance',
    category: 'CONTAINMENT',
    description: 'Sever malicious connections at the kernel layer with microsecond precision without taking entire production hosts or clusters offline.',
    icon: Zap,
    specs: ['Sub-120ms execution', 'Zero host reboots', 'Preserves unaffected workloads']
  },
  {
    title: 'Dynamic Honeytoken & Decoy Mesh',
    category: 'DECEPTION',
    description: 'Weave high-fidelity decoy credentials, synthetic AWS root keys, and canary files across your Kubernetes namespaces with automated daily rotation.',
    icon: ShieldAlert,
    specs: ['100% True-positive signal', 'Automated IAM rotation', 'Zero real asset exposure']
  },
  {
    title: 'TLS JA3/JA4 & ALPN Fingerprinting',
    category: 'NETWORK INSPECTION',
    description: 'Attribute inbound adversary C2 traffic before payload decryption using client hello cipher suites and beaconing jitter correlation algorithms.',
    icon: Radio,
    specs: ['TLS 1.3 & QUIC support', 'Known APT cluster attribution', '<0.08ms overhead']
  },
  {
    title: 'Autonomous Neural Analyst Commentary',
    category: 'INTELLIGENCE',
    description: 'Continuous AI narration synthesizes raw telemetry into clear hypotheses, blast radius models, and recommended actions for human oversight.',
    icon: Cpu,
    specs: ['Natural language triage', 'MITRE ATT&CK mapping', 'Audit-ready reports']
  },
  {
    title: 'Zero-Downtime DaemonSet Deployment',
    category: 'INFRASTRUCTURE',
    description: 'Deploys as a standard Kubernetes DaemonSet or lightweight systemd daemon in under 3 minutes with zero kernel reboots or binary recompilations.',
    icon: Server,
    specs: ['Linux Kernel 5.4+ compatible', '<1.2% CPU overhead', '64MB fixed memory']
  },
  {
    title: 'Continuous Compliance & Forensics',
    category: 'GOVERNANCE',
    description: 'Generate timestamped, tamper-evident forensic memory images and executive incident briefs aligned with SOC 2 Type II, ISO 27001, and HIPAA.',
    icon: FileCheck2,
    specs: ['Automated PDF/JSON briefs', 'Cryptographic hashing (SHA-256)', 'Cold storage archiving']
  }
];

export const FeatureDeepDive: React.FC = () => {
  return (
    <section id="features" className="py-16 border-b border-border-light dark:border-border-dark bg-base-light dark:bg-base-dark">
      <div className="max-w-page mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="text-meta text-accent font-mono">ENTERPRISE CAPABILITIES</div>
          <h2 className="text-[28px] sm:text-[34px] font-bold text-primary-light dark:text-primary-dark tracking-tight">
            Built for Extreme Production Resilience
          </h2>
          <p className="text-body text-secondary-light dark:text-secondary-dark text-[15px]">
            Engineered to replace bloated endpoint agents and alert fatigue with deterministic deception.
          </p>
        </div>

        {/* 6-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-card p-5 flex flex-col justify-between hover:border-accent/40 transition-colors shadow-sm"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-lg bg-base-light dark:bg-base-dark border border-border-light dark:border-border-dark flex items-center justify-center text-accent">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono text-secondary-light dark:text-secondary-dark uppercase tracking-wider">
                      {feat.category}
                    </span>
                  </div>

                  <h3 className="text-[16px] font-bold text-primary-light dark:text-primary-dark leading-snug">
                    {feat.title}
                  </h3>

                  <p className="text-[13px] text-secondary-light dark:text-secondary-dark leading-relaxed">
                    {feat.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-border-light dark:border-border-dark space-y-1 text-[11px] font-mono text-secondary-light dark:text-secondary-dark">
                  {feat.specs.map((sp, sIdx) => (
                    <div key={sIdx} className="flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-accent" />
                      <span>{sp}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
