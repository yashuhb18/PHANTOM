import React from 'react';
import { Download } from 'lucide-react';

export const WhitepaperExcerpt: React.FC = () => {
  return (
    <section id="whitepaper" className="py-16 border-b border-border-light dark:border-border-dark bg-base-light dark:bg-base-dark">
      <div className="max-w-page mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="text-meta text-accent font-mono">PEER-REVIEWED RESEARCH</div>
          <h2 className="text-[28px] sm:text-[34px] font-bold text-primary-light dark:text-primary-dark tracking-tight">
            The Engineering Whitepaper
          </h2>
          <p className="text-body text-secondary-light dark:text-secondary-dark text-[15px]">
            Read the mathematical and systems-level foundations powering our deterministic deception architecture.
          </p>
        </div>

        {/* Document-Like Whitepaper Card in Source Serif 4 */}
        <div className="max-w-4xl mx-auto bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-card p-6 sm:p-10 shadow-sm space-y-6">
          <div className="border-b border-border-light dark:border-border-dark pb-6 space-y-3">
            <div className="flex items-center justify-between text-[11px] font-mono text-secondary-light dark:text-secondary-dark">
              <span>PHANTOM RESEARCH LABS // TECHNICAL REPORT #2026-4</span>
              <span>IEEE S&amp;P PRE-PRINT ARCHIVE</span>
            </div>

            <h3 className="text-[24px] sm:text-[28px] font-bold text-primary-light dark:text-primary-dark leading-tight">
              Deterministic Micro-Containment in Multi-Tenant Kubernetes via Zero-Copy eBPF Ring Buffers
            </h3>

            <div className="flex flex-wrap items-center gap-4 text-[12px] font-mono text-secondary-light dark:text-secondary-dark pt-1">
              <span>Dr. Elena Vance, PhD</span>
              <span>•</span>
              <span>Marcus Sterling, Lead Systems Architect</span>
              <span>•</span>
              <span>Kernel Version: Linux 6.8 LTS</span>
            </div>
          </div>

          {/* Abstract in Source Serif 4 */}
          <div className="space-y-3">
            <h4 className="text-meta text-secondary-light dark:text-secondary-dark tracking-wider font-sans text-[11px]">
              ABSTRACT
            </h4>
            <p className="font-serif text-[15px] sm:text-[16px] leading-[1.75] text-primary-light dark:text-primary-dark">
              Traditional Endpoint Detection and Response (EDR) agents rely on user-space heuristic correlation, introducing high CPU overhead (8–22%) and catastrophic false-positive fatigue (14–28%). In this paper, we present PHANTOM, an autonomous deception mesh operating entirely within the Linux kernel via eBPF kprobes and ring buffer primitives. By placing synthetic honeytokens inside container namespaces, any read invocation yields a 100% true-positive deterministic signal. We prove that socket severance executed via <code>bpf_sock_ops</code> completes in a mean time of 112ms—three orders of magnitude faster than conventional human-in-the-loop triage.
            </p>
          </div>

          {/* Mathematical Formulation for DNS Beaconing Entropy */}
          <div className="p-4 rounded-card bg-base-light dark:bg-base-dark border border-border-light dark:border-border-dark space-y-2">
            <div className="text-meta text-secondary-light dark:text-secondary-dark font-sans text-[10px]">
              EQUATION 1: SHANNON ENTROPY CORRELATION FOR EXFILTRATION CHANNELS
            </div>
            <div className="font-mono text-[13px] text-center py-2 text-primary-light dark:text-primary-dark">
              {"H(X) = -∑ [ P(x_i) · log₂(P(x_i)) ]    where    H(X) > 4.85 bits/char  ⟹  Adversary C2 Beacon"}
            </div>
            <p className="text-[12px] text-secondary-light dark:text-secondary-dark leading-normal">
              Subdomain queries exceeding Shannon entropy thresholds combined with low-variance jitter (&plusmn;3%) trigger synthetic DNS sinkholing before second-stage payload retrieval.
            </p>
          </div>

          {/* Footer with Download */}
          <div className="pt-4 border-t border-border-light dark:border-border-dark flex items-center justify-between">
            <span className="text-[12px] font-mono text-secondary-light dark:text-secondary-dark">
              Full Paper: 24 Pages • 14 Figures • Published September 2026
            </span>
            <button
              type="button"
              onClick={() => alert('Downloading PHANTOM-Technical-Whitepaper-2026.pdf (Pre-print)...')}
              className="h-8 px-3.5 bg-accent hover:bg-accent-hover text-white rounded text-[12px] font-medium flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF (2.4MB)</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
