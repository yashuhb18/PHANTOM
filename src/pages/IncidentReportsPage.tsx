import React, { useState, useEffect } from 'react';
import { IncidentReport } from '../types';
import { Download, Copy, Check } from 'lucide-react';
import { fetchIncidentReport } from '../services/api';

export const IncidentReportsPage: React.FC = () => {
  const [copied, setCopied] = useState<boolean>(false);
  const [report, setReport] = useState<IncidentReport | null>(null);

  useEffect(() => {
    fetchIncidentReport('SES-USB-01').then((data) => {
      if (data) setReport(data);
    }).catch(() => {});
  }, []);

  const handleCopyMarkdown = () => {
    if (!report) return;
    const md = `# ${report.title}\n\n**Incident ID**: ${report.id}\n**Date**: ${report.date}\n**Status**: ${report.status}\n**Rating**: ${report.riskRating}\n\n## Executive Summary\n${report.executiveSummary}\n\n## Incident Narrative\n${report.incidentNarrative.join('\n\n')}\n\n## Indicators of Compromise\n${report.indicatorsOfCompromise.map(ioc => `- [${ioc.type}] ${ioc.value} (${ioc.context})`).join('\n')}`;
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!report) {
    return <div className="p-8 text-center text-secondary-light font-mono text-[13px]">Loading incident forensics brief...</div>;
  }

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-meta text-secondary-light dark:text-secondary-dark font-mono">
            SECURITY INCIDENT RECORD
          </span>
          <span className="font-mono text-[12px] font-bold px-2 py-0.5 rounded bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-primary-light dark:text-primary-dark">
            {report.id}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyMarkdown}
            className="h-8 px-3 rounded border border-border-light dark:border-border-dark text-[12px] font-mono flex items-center gap-1.5 hover:bg-surface-light dark:hover:bg-surface-dark text-secondary-light dark:text-secondary-dark hover:text-primary-light transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-safe" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy MD'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="h-8 px-3.5 bg-accent hover:bg-accent-hover text-white rounded text-[12px] font-medium flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Brief (PDF)</span>
          </button>
        </div>
      </div>

      {/* Document-Like Layout Card with Generous 48px Internal Padding */}
      <article className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-card p-6 space-y-6 shadow-sm">
        <header className="border-b border-border-light dark:border-border-dark pb-6 space-y-3">
          <div className="flex items-center justify-between text-[12px] font-mono text-secondary-light dark:text-secondary-dark">
            <span>PHANTOM DIGITAL FORENSICS & INCIDENT RESPONSE BRIEF</span>
            <span>CLASSIFICATION: TLP:AMBER</span>
          </div>

          <h1 className="text-[26px] font-bold text-primary-light dark:text-primary-dark leading-tight">
            {report.title}
          </h1>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-border-light dark:border-border-dark text-[12px]">
            <div>
              <span className="text-meta text-secondary-light dark:text-secondary-dark block text-[10px]">
                INCIDENT ID
              </span>
              <span className="font-mono font-semibold text-primary-light dark:text-primary-dark">
                {report.id}
              </span>
            </div>
            <div>
              <span className="text-meta text-secondary-light dark:text-secondary-dark block text-[10px]">
                TIMESTAMP
              </span>
              <span className="font-mono text-primary-light dark:text-primary-dark">
                {report.date}
              </span>
            </div>
            <div>
              <span className="text-meta text-secondary-light dark:text-secondary-dark block text-[10px]">
                CONTAINMENT STATUS
              </span>
              <span className="font-mono font-semibold text-safe">
                {report.status}
              </span>
            </div>
            <div>
              <span className="text-meta text-secondary-light dark:text-secondary-dark block text-[10px]">
                RISK RATING
              </span>
              <span className="font-mono font-semibold text-threat">
                {report.riskRating}
              </span>
            </div>
          </div>
        </header>

        {/* Section 1: Executive Summary */}
        <section className="space-y-2">
          <h2 className="text-meta text-secondary-light dark:text-secondary-dark font-sans tracking-wider">
            1. EXECUTIVE SUMMARY
          </h2>
          <p className="font-serif text-[15px] leading-[1.7] text-primary-light dark:text-primary-dark">
            {report.executiveSummary}
          </p>
        </section>

        {/* Section 2: Detailed Chronological Narrative */}
        <section className="space-y-3">
          <h2 className="text-meta text-secondary-light dark:text-secondary-dark font-sans tracking-wider">
            2. FORENSIC KILL CHAIN & ATTRIBUTION ANALYSIS
          </h2>
          <div className="space-y-3">
            {report.incidentNarrative.map((paragraph, idx) => (
              <p key={idx} className="font-serif text-[15px] leading-[1.7] text-primary-light dark:text-primary-dark">
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        {/* Section 3: Compromised Assets */}
        <section className="space-y-2 pt-2 border-t border-border-light dark:border-border-dark">
          <h2 className="text-meta text-secondary-light dark:text-secondary-dark font-sans tracking-wider">
            3. IMPACTED WORKLOADS & ARTIFACTS
          </h2>
          <ul className="space-y-1.5 text-[13px] font-mono text-primary-light dark:text-primary-dark">
            {report.compromisedAssets.map((asset, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                <span>{asset}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Section 4: Indicators of Compromise (IOC) Table */}
        <section className="space-y-3 pt-2 border-t border-border-light dark:border-border-dark">
          <h2 className="text-meta text-secondary-light dark:text-secondary-dark font-sans tracking-wider">
            4. VERIFIED INDICATORS OF COMPROMISE (IOC)
          </h2>
          <div className="border border-border-light dark:border-border-dark rounded-md overflow-hidden">
            <table className="w-full text-left border-collapse text-[12px] font-mono">
              <thead>
                <tr className="bg-base-light dark:bg-base-dark border-b border-border-light dark:border-border-dark text-secondary-light dark:text-secondary-dark">
                  <th className="py-2 px-3">TYPE</th>
                  <th className="py-2 px-3">INDICATOR VALUE</th>
                  <th className="py-2 px-3">CONTEXT / TELEMETRY</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light dark:divide-border-dark">
                {report.indicatorsOfCompromise.map((ioc, idx) => (
                  <tr key={idx} className="hover:bg-base-light/30 dark:hover:bg-base-dark/30">
                    <td className="py-2 px-3 text-accent font-semibold">{ioc.type}</td>
                    <td className="py-2 px-3 text-primary-light dark:text-primary-dark break-all">{ioc.value}</td>
                    <td className="py-2 px-3 text-secondary-light dark:text-secondary-dark">{ioc.context}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 5: Mitigation Audit Trail */}
        <section className="space-y-3 pt-2 border-t border-border-light dark:border-border-dark">
          <h2 className="text-meta text-secondary-light dark:text-secondary-dark font-sans tracking-wider">
            5. MITIGATION AUDIT TRAIL
          </h2>
          <div className="space-y-2">
            {report.mitigationSteps.map((step, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded bg-base-light dark:bg-base-dark border border-border-light dark:border-border-dark flex items-center justify-between text-[12px] font-mono"
              >
                <div className="flex items-center gap-2">
                  <span className="text-safe font-semibold">✓</span>
                  <span className="text-primary-light dark:text-primary-dark">{step.action}</span>
                </div>
                <div className="text-secondary-light dark:text-secondary-dark text-[11px] shrink-0">
                  {step.completedAt} • {step.operator}
                </div>
              </div>
            ))}
          </div>
        </section>
      </article>
    </div>
  );
};
