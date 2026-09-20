import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: 'How does PHANTOM guarantee zero kernel crashes when using eBPF?',
    answer: 'eBPF programs are statically verified by the Linux kernel verifier before execution. The verifier proves that programs terminate within bounded instruction limits, never dereference uninitialized or out-of-bounds pointers, and cannot cause kernel panic. PHANTOM uses standard kernel tracepoints and kprobes without introducing proprietary out-of-tree kernel modules.'
  },
  {
    question: 'Why is deception considered 100% deterministic compared to heuristic ML models?',
    answer: 'Machine learning heuristics inherently suffer from false positives because legitimate developer activities (e.g. debugging, high load) often resemble malicious patterns. In contrast, PHANTOM deploys synthetic honeytokens and canary files that no legitimate production service or engineer ever needs to access. Touching a canary is a mathematically deterministic proof of breach reconnaissance.'
  },
  {
    question: 'How does micro-containment differ from traditional host isolation?',
    answer: 'When legacy EDR detects a threat, it severs the entire physical network interface of the host, killing hundreds of innocent customer containers sharing that node. PHANTOM utilizes eBPF socket-level termination (bpf_sock_ops) and cgroup process freezing. Only the adversary’s specific process tree and TCP/UDP socket are severed, allowing all neighboring workloads to continue uninterrupted.'
  },
  {
    question: 'What Linux kernel versions and distributions are supported?',
    answer: 'PHANTOM supports all Linux distributions running kernel 5.4 or higher with BPF CO-RE (Compile Once, Run Everywhere) enabled. This includes Ubuntu 20.04/22.04/24.04, Debian 11/12, RHEL 8/9, Amazon Linux 2023, and AWS Bottlerocket.'
  },
  {
    question: 'Can sophisticated adversaries detect that the tokens are synthetic decoys?',
    answer: 'No. PHANTOM generates canary credentials with valid format structures, realistic Shannon entropy, and authentic file metadata. For example, AWS canary keys are structurally indistinguishable from genuine IAM access keys until verified against the AWS authentication gateway.'
  },
  {
    question: 'How does PHANTOM export incident data to our existing SIEM / SOC tools?',
    answer: 'PHANTOM provides native OpenTelemetry (OTel) exporters, standard RFC-5424 syslog streams, and encrypted webhook triggers compatible with Splunk, Datadog, AWS Security Hub, and PagerDuty.'
  }
];

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First item open by default

  const toggleFaq = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-16 border-b border-border-light dark:border-border-dark bg-base-light dark:bg-base-dark">
      <div className="max-w-page mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="text-meta text-accent font-mono">TECHNICAL ARCHITECTURE FAQ</div>
          <h2 className="text-[28px] sm:text-[34px] font-bold text-primary-light dark:text-primary-dark tracking-tight">
            Frequently Asked Engineering Questions
          </h2>
          <p className="text-body text-secondary-light dark:text-secondary-dark text-[15px]">
            Key technical details regarding safety, performance overhead, and multi-tenant containment.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="max-w-3xl mx-auto space-y-2">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={idx}
                className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-card overflow-hidden shadow-sm transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 select-none hover:bg-base-light/30 dark:hover:bg-base-dark/30 transition-colors"
                >
                  <span className="text-[14px] font-semibold text-primary-light dark:text-primary-dark">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-secondary-light shrink-0 transition-transform duration-200 ${
                      isOpen ? 'transform rotate-180 text-accent' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-[13px] text-secondary-light dark:text-secondary-dark leading-relaxed border-t border-border-light dark:border-border-dark bg-base-light/10 dark:bg-base-dark/10">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
