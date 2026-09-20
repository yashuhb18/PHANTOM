import React from 'react';

interface BenchmarkRow {
  metric: string;
  category: string;
  phantom: string;
  legacyEdr: string;
  traditionalSiem: string;
  genericHoneypot: string;
  isHighlight?: boolean;
}

const benchmarkData: BenchmarkRow[] = [
  {
    metric: 'Mean Time to Detect (MTTD)',
    category: 'Response Speed',
    phantom: '< 15 milliseconds',
    legacyEdr: '12 – 45 minutes',
    traditionalSiem: '2 – 8 hours',
    genericHoneypot: '1 – 5 minutes',
    isHighlight: true
  },
  {
    metric: 'Mean Time to Contain (MTTC)',
    category: 'Response Speed',
    phantom: '< 120 milliseconds (Autonomous)',
    legacyEdr: '24 – 72 hours (Human-in-loop)',
    traditionalSiem: 'Days / Weeks',
    genericHoneypot: 'Manual (Alert only)',
    isHighlight: true
  },
  {
    metric: 'False Positive Rate',
    category: 'Signal Quality',
    phantom: '0.01% (Deterministic Tripwire)',
    legacyEdr: '14 – 28% (Heuristic Fatigue)',
    traditionalSiem: '35 – 60% (Rule Noise)',
    genericHoneypot: '< 1.0%',
    isHighlight: true
  },
  {
    metric: 'Kernel CPU Footprint',
    category: 'Resource Efficiency',
    phantom: '< 1.2% (Zero-copy eBPF)',
    legacyEdr: '8 – 22% (User-space polling)',
    traditionalSiem: 'N/A (Agentless / Log shippers)',
    genericHoneypot: '< 2.0%'
  },
  {
    metric: 'Micro-Quarantine Granularity',
    category: 'Containment',
    phantom: 'Single socket / PID level',
    legacyEdr: 'Entire host network disconnect',
    traditionalSiem: 'None (Alerts only)',
    genericHoneypot: 'None'
  },
  {
    metric: 'Zero-Day Vulnerability Defense',
    category: 'Efficacy',
    phantom: 'Deterministic (Decoys are target-agnostic)',
    legacyEdr: 'Signature / Behavior dependent',
    traditionalSiem: 'Log correlation dependent',
    genericHoneypot: 'Limited to exposed decoy'
  },
  {
    metric: 'Automated Forensics Core Dump',
    category: 'Observability',
    phantom: 'Instantaneous memory snapshot',
    legacyEdr: 'Requires SOC triage request',
    traditionalSiem: 'Not supported',
    genericHoneypot: 'Pcap capture only'
  }
];

export const BenchmarkComparison: React.FC = () => {
  return (
    <section id="benchmarks" className="py-16 border-b border-border-light dark:border-border-dark bg-base-light dark:bg-base-dark">
      <div className="max-w-page mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="text-meta text-accent font-mono">EMPIRICAL BENCHMARKS</div>
          <h2 className="text-[28px] sm:text-[34px] font-bold text-primary-light dark:text-primary-dark tracking-tight">
            How PHANTOM Compares to Industry Standards
          </h2>
          <p className="text-body text-secondary-light dark:text-secondary-dark text-[15px]">
            Quantitative head-to-head metrics against legacy endpoint detection and traditional security logging.
          </p>
        </div>

        {/* Benchmark Comparison Table */}
        <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-card overflow-hidden max-w-5xl mx-auto shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border-light dark:border-border-dark bg-base-light/70 dark:bg-base-dark/70 text-meta text-secondary-light dark:text-secondary-dark">
                  <th className="py-3.5 px-4 font-mono">BENCHMARK METRIC</th>
                  <th className="py-3.5 px-4 font-mono text-accent font-bold bg-accent-tint/40 dark:bg-accent-darkTint/40">
                    PHANTOM v2.14
                  </th>
                  <th className="py-3.5 px-4 font-mono">LEGACY EDR</th>
                  <th className="py-3.5 px-4 font-mono">TRADITIONAL SIEM</th>
                  <th className="py-3.5 px-4 font-mono">GENERIC HONEYPOTS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light dark:divide-border-dark text-[13px]">
                {benchmarkData.map((row, idx) => (
                  <tr
                    key={idx}
                    className={`hover:bg-base-light/40 dark:hover:bg-base-dark/40 transition-colors ${
                      row.isHighlight ? 'font-medium' : ''
                    }`}
                  >
                    <td className="py-3 px-4">
                      <div className="font-semibold text-primary-light dark:text-primary-dark">
                        {row.metric}
                      </div>
                      <div className="text-[11px] text-secondary-light dark:text-secondary-dark font-mono mt-0.5">
                        {row.category}
                      </div>
                    </td>

                    {/* PHANTOM Column (Accentuated) */}
                    <td className="py-3 px-4 font-mono font-bold text-accent bg-accent-tint/20 dark:bg-accent-darkTint/20">
                      {row.phantom}
                    </td>

                    <td className="py-3 px-4 font-mono text-secondary-light dark:text-secondary-dark">
                      {row.legacyEdr}
                    </td>

                    <td className="py-3 px-4 font-mono text-secondary-light dark:text-secondary-dark">
                      {row.traditionalSiem}
                    </td>

                    <td className="py-3 px-4 font-mono text-secondary-light dark:text-secondary-dark">
                      {row.genericHoneypot}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};
