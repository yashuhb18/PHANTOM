import React from 'react';

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
  category: string;
}

const testimonials: Testimonial[] = [
  {
    quote: "PHANTOM changed our entire SOC calculus. We went from burning 160 hours a week wading through noisy EDR alerts to having zero false positives. When a canary trips, we know with 100% mathematical certainty that an adversary is inside, and eBPF isolates the socket before they can run a second command.",
    author: "David Chen",
    role: "Chief Information Security Officer",
    company: "Apex Global Clearing (Fintech)",
    category: "FINANCIAL SERVICES"
  },
  {
    quote: "During a recent red-team exercise, the adversary attempted a container breakout via CVE-2024-21626. PHANTOM intercepted the descriptor leak and severed the socket in 112 milliseconds. Our on-call team received the completed incident brief before PagerDuty even triggered.",
    author: "Sarah Lindqvist",
    role: "VP of Cloud Infrastructure & DevSecOps",
    company: "Nordic Health Data Mesh",
    category: "HEALTHCARE TECH"
  },
  {
    quote: "The kernel-level eBPF implementation is pure engineering mastery. Under full production load across 3,000 Kubernetes nodes, PHANTOM's CPU footprint stayed under 1.1%. Legacy agents were eating 15% of our compute budget.",
    author: "Tariq Mansoor",
    role: "Principal Infrastructure Architect",
    company: "AetherScale Cloud Systems",
    category: "CLOUD INFRASTRUCTURE"
  }
];

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-16 border-b border-border-light dark:border-border-dark bg-base-light dark:bg-base-dark">
      <div className="max-w-page mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="text-meta text-accent font-mono">PRODUCTION TESTIMONIALS</div>
          <h2 className="text-[28px] sm:text-[34px] font-bold text-primary-light dark:text-primary-dark tracking-tight">
            Trusted by Mission-Critical Engineering Teams
          </h2>
          <p className="text-body text-secondary-light dark:text-secondary-dark text-[15px]">
            Here is how leading infrastructure and security teams operate with deterministic deception.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-card p-5 flex flex-col justify-between shadow-sm"
            >
              <div className="space-y-3">
                <span className="text-[10px] font-mono text-accent font-semibold uppercase tracking-wider">
                  {t.category}
                </span>
                <p className="text-[13px] text-primary-light dark:text-primary-dark leading-relaxed italic">
                  "{t.quote}"
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-border-light dark:border-border-dark">
                <div className="text-[13px] font-bold text-primary-light dark:text-primary-dark">
                  {t.author}
                </div>
                <div className="text-[11px] text-secondary-light dark:text-secondary-dark">
                  {t.role}
                </div>
                <div className="text-[11px] font-mono text-secondary-light dark:text-secondary-dark mt-0.5">
                  {t.company}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
