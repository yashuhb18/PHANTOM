import React, { useState } from 'react';
import { Clock, ShieldCheck, Zap } from 'lucide-react';

export const RoiCalculator: React.FC = () => {
  const [nodeCount, setNodeCount] = useState<number>(250);
  const [teamSize, setTeamSize] = useState<number>(8);
  const [cloudSpend, setCloudSpend] = useState<number>(120); // in thousands ($120k/mo)

  // Dynamic calculations
  // Average SOC analyst spends ~15 hours/month per 50 nodes chasing false positives
  const falsePositiveHoursSaved = Math.round((nodeCount / 50) * 14);
  // Average hourly SOC cost ~$85/hr
  const monthlyCostSavings = Math.round(falsePositiveHoursSaved * 85 + (cloudSpend * 1000 * 0.04));
  const annualSavings = monthlyCostSavings * 12;

  return (
    <section id="calculator" className="py-16 border-b border-border-light dark:border-border-dark bg-base-light dark:bg-base-dark">
      <div className="max-w-page mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="text-meta text-accent font-mono">FINANCIAL & OPERATIONAL VALUE</div>
          <h2 className="text-[28px] sm:text-[34px] font-bold text-primary-light dark:text-primary-dark tracking-tight">
            Interactive SOC ROI & Blast Radius Calculator
          </h2>
          <p className="text-body text-secondary-light dark:text-secondary-dark text-[15px]">
            Estimate your team's labor savings and risk reduction by eliminating false-positive alert fatigue.
          </p>
        </div>

        {/* Calculator Widget Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-5xl mx-auto bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-card p-6 shadow-sm">
          {/* Sliders Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Slider 1: Node Count */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[13px]">
                <span className="font-semibold text-primary-light dark:text-primary-dark">
                  Cluster & Host Node Fleet Size
                </span>
                <span className="font-mono font-bold text-accent text-[15px]">
                  {nodeCount.toLocaleString()} nodes
                </span>
              </div>
              <input
                type="range"
                min={20}
                max={2000}
                step={20}
                value={nodeCount}
                onChange={(e) => setNodeCount(Number(e.target.value))}
                className="w-full h-1.5 bg-border-light dark:border-border-dark rounded-lg appearance-none cursor-pointer accent-accent"
              />
              <div className="flex justify-between text-[11px] font-mono text-secondary-light dark:text-secondary-dark">
                <span>20 nodes</span>
                <span>1,000 nodes</span>
                <span>2,000+ nodes</span>
              </div>
            </div>

            {/* Slider 2: Team Size */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[13px]">
                <span className="font-semibold text-primary-light dark:text-primary-dark">
                  SecOps / SOC Engineering Team
                </span>
                <span className="font-mono font-bold text-accent text-[15px]">
                  {teamSize} analysts
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={50}
                step={1}
                value={teamSize}
                onChange={(e) => setTeamSize(Number(e.target.value))}
                className="w-full h-1.5 bg-border-light dark:border-border-dark rounded-lg appearance-none cursor-pointer accent-accent"
              />
              <div className="flex justify-between text-[11px] font-mono text-secondary-light dark:text-secondary-dark">
                <span>1 analyst</span>
                <span>25 analysts</span>
                <span>50+ analysts</span>
              </div>
            </div>

            {/* Slider 3: Cloud Spend */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[13px]">
                <span className="font-semibold text-primary-light dark:text-primary-dark">
                  Monthly Cloud Infrastructure Spend
                </span>
                <span className="font-mono font-bold text-accent text-[15px]">
                  ${cloudSpend}k / month
                </span>
              </div>
              <input
                type="range"
                min={10}
                max={500}
                step={10}
                value={cloudSpend}
                onChange={(e) => setCloudSpend(Number(e.target.value))}
                className="w-full h-1.5 bg-border-light dark:border-border-dark rounded-lg appearance-none cursor-pointer accent-accent"
              />
              <div className="flex justify-between text-[11px] font-mono text-secondary-light dark:text-secondary-dark">
                <span>$10k/mo</span>
                <span>$250k/mo</span>
                <span>$500k+/mo</span>
              </div>
            </div>
          </div>

          {/* Output Metrics Column (5 cols) */}
          <div className="lg:col-span-5 bg-base-light/60 dark:bg-base-dark/60 border border-border-light dark:border-border-dark rounded-card p-5 flex flex-col justify-between space-y-4">
            <div>
              <div className="text-meta text-secondary-light dark:text-secondary-dark text-[11px]">
                PROJECTED OPERATIONAL RETURN
              </div>
              <div className="text-[32px] font-bold font-mono text-primary-light dark:text-primary-dark tracking-tight mt-1">
                ${annualSavings.toLocaleString()}
                <span className="text-[14px] text-secondary-light dark:text-secondary-dark font-sans font-normal ml-1">
                  / year
                </span>
              </div>
              <p className="text-[12px] text-secondary-light dark:text-secondary-dark mt-1">
                Calculated based on SOC alert noise elimination and automated breach interception.
              </p>
            </div>

            <div className="space-y-3 pt-3 border-t border-border-light dark:border-border-dark text-[12px] font-mono">
              <div className="flex items-center justify-between">
                <span className="text-secondary-light dark:text-secondary-dark flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-accent" />
                  Monthly Hours Saved:
                </span>
                <span className="font-bold text-primary-light dark:text-primary-dark">
                  {falsePositiveHoursSaved.toLocaleString()} hrs / mo
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-secondary-light dark:text-secondary-dark flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-safe" />
                  MTTC Acceleration:
                </span>
                <span className="font-bold text-safe">
                  99.8% Faster
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-secondary-light dark:text-secondary-dark flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                  Signal Fidelity:
                </span>
                <span className="font-bold text-primary-light dark:text-primary-dark">
                  100% Deterministic
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
