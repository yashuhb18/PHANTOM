import React, { useState } from 'react';
import { Check } from 'lucide-react';

interface PricingSectionProps {
  onLaunchConsole: () => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onLaunchConsole }) => {
  const [annualBilling, setAnnualBilling] = useState<boolean>(true);

  return (
    <section id="pricing" className="py-16 border-b border-border-light dark:border-border-dark bg-base-light dark:bg-base-dark">
      <div className="max-w-page mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="text-meta text-accent font-mono">TRANSPARENT DEPLOYMENT</div>
          <h2 className="text-[28px] sm:text-[34px] font-bold text-primary-light dark:text-primary-dark tracking-tight">
            Predictable Pricing for High-Stakes Infrastructure
          </h2>
          <p className="text-body text-secondary-light dark:text-secondary-dark text-[15px]">
            Deploy into your cloud VPC or on-prem bare-metal clusters in minutes.
          </p>

          {/* Billing Switch */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <span className={`text-[13px] font-medium ${!annualBilling ? 'text-primary-light dark:text-primary-dark' : 'text-secondary-light dark:text-secondary-dark'}`}>
              Monthly
            </span>
            <button
              type="button"
              onClick={() => setAnnualBilling(!annualBilling)}
              className="w-10 h-5 rounded-full bg-border-light dark:bg-border-dark p-0.5 relative transition-colors"
            >
              <div
                className={`w-4 h-4 rounded-full bg-accent transition-transform ${
                  annualBilling ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={`text-[13px] font-medium flex items-center gap-1.5 ${annualBilling ? 'text-primary-light dark:text-primary-dark' : 'text-secondary-light dark:text-secondary-dark'}`}>
              Annual
              <span className="px-1.5 py-0.5 rounded-full bg-safe/10 text-safe text-[10px] font-mono font-semibold">
                SAVE 20%
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Card 1: Developer / Research */}
          <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-card p-6 flex flex-col justify-between shadow-sm">
            <div className="space-y-4">
              <div>
                <span className="text-meta text-secondary-light dark:text-secondary-dark text-[11px]">
                  COMMUNITY & DEV
                </span>
                <h3 className="text-[20px] font-bold text-primary-light dark:text-primary-dark mt-1">
                  Developer
                </h3>
                <p className="text-[13px] text-secondary-light dark:text-secondary-dark mt-1">
                  Ideal for research labs, testing eBPF probes, and staging clusters.
                </p>
              </div>

              <div className="pt-2">
                <div className="text-[32px] font-bold font-mono text-primary-light dark:text-primary-dark">
                  $0
                  <span className="text-[14px] text-secondary-light dark:text-secondary-dark font-sans font-normal ml-1">
                    / forever
                  </span>
                </div>
              </div>

              <ul className="space-y-2.5 pt-4 border-t border-border-light dark:border-border-dark text-[13px]">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-accent shrink-0" />
                  <span>Up to 5 host nodes</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-accent shrink-0" />
                  <span>Standard honeytoken decoys</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-accent shrink-0" />
                  <span>Kernel eBPF tracepoints</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-accent shrink-0" />
                  <span>Community Slack support</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={onLaunchConsole}
              className="mt-6 w-full h-10 rounded border border-border-light dark:border-border-dark hover:bg-base-light dark:hover:bg-base-dark text-primary-light dark:text-primary-dark font-medium text-[13px] transition-colors"
            >
              Start Free
            </button>
          </div>

          {/* Card 2: Production Cluster (Highlighted) */}
          <div className="bg-surface-light dark:bg-surface-dark border-2 border-accent rounded-card p-6 flex flex-col justify-between shadow-md relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-accent text-white text-[11px] font-mono font-semibold uppercase tracking-wider">
              MOST POPULAR
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-meta text-accent text-[11px]">
                  GROWTH & CLOUD SCALE
                </span>
                <h3 className="text-[20px] font-bold text-primary-light dark:text-primary-dark mt-1">
                  Production Pro
                </h3>
                <p className="text-[13px] text-secondary-light dark:text-secondary-dark mt-1">
                  Full autonomous containment and deception mesh for production Kubernetes.
                </p>
              </div>

              <div className="pt-2">
                <div className="text-[32px] font-bold font-mono text-primary-light dark:text-primary-dark">
                  ${annualBilling ? '384' : '480'}
                  <span className="text-[14px] text-secondary-light dark:text-secondary-dark font-sans font-normal ml-1">
                    / month
                  </span>
                </div>
              </div>

              <ul className="space-y-2.5 pt-4 border-t border-border-light dark:border-border-dark text-[13px]">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-accent shrink-0" />
                  <span>Up to 100 host nodes</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-accent shrink-0" />
                  <span>Sub-120ms autonomous micro-isolation</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-accent shrink-0" />
                  <span>Daily automated honeytoken rotation</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-accent shrink-0" />
                  <span>JA3/JA4 TLS handshake attribution</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-accent shrink-0" />
                  <span>Priority 24/7 SecOps response</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={onLaunchConsole}
              className="mt-6 w-full h-10 rounded bg-accent hover:bg-accent-hover text-white font-medium text-[13px] transition-colors"
            >
              Launch Live Console
            </button>
          </div>

          {/* Card 3: Sovereign Enterprise */}
          <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-card p-6 flex flex-col justify-between shadow-sm">
            <div className="space-y-4">
              <div>
                <span className="text-meta text-secondary-light dark:text-secondary-dark text-[11px]">
                  AIR-GAPPED & COMPLIANCE
                </span>
                <h3 className="text-[20px] font-bold text-primary-light dark:text-primary-dark mt-1">
                  Enterprise Sovereign
                </h3>
                <p className="text-[13px] text-secondary-light dark:text-secondary-dark mt-1">
                  Air-gapped VPC deployment with dedicated cryptographic key custodianship.
                </p>
              </div>

              <div className="pt-2">
                <div className="text-[32px] font-bold font-mono text-primary-light dark:text-primary-dark">
                  Custom
                  <span className="text-[14px] text-secondary-light dark:text-secondary-dark font-sans font-normal ml-1">
                    / annual contract
                  </span>
                </div>
              </div>

              <ul className="space-y-2.5 pt-4 border-t border-border-light dark:border-border-dark text-[13px]">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-accent shrink-0" />
                  <span>Unlimited nodes & clusters</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-accent shrink-0" />
                  <span>100% On-prem / Air-gapped VPC</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-accent shrink-0" />
                  <span>Custom adversary attribution models</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-accent shrink-0" />
                  <span>Dedicated SecOps incident handler</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-accent shrink-0" />
                  <span>99.999% SLA uptime guarantee</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => alert('Contacting PHANTOM Enterprise Security Architects...')}
              className="mt-6 w-full h-10 rounded border border-border-light dark:border-border-dark hover:bg-base-light dark:hover:bg-base-dark text-primary-light dark:text-primary-dark font-medium text-[13px] transition-colors"
            >
              Contact Enterprise Sales
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
