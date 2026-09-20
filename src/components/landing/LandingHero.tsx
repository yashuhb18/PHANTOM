import React, { useState, useEffect } from 'react';
import { ArrowRight, Terminal, Play, Pause, RotateCcw } from 'lucide-react';

interface LandingHeroProps {
  onLaunchConsole: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onLaunchConsole }) => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  const heroSimulationSteps = [
    {
      time: '17:14:02.102',
      badge: 'INGRESS',
      badgeColor: 'text-warning border-warning/30 bg-warning/10',
      text: 'TLS 1.3 session established from 198.51.100.44. JA3: 771,4865-4866-4867 (Anomalous).',
      detail: 'Connection routed through edge proxy envoy-ingress-proxy (PID 812).'
    },
    {
      time: '17:14:02.419',
      badge: 'EXPLOITATION',
      badgeColor: 'text-threat border-threat/30 bg-threat/10',
      text: 'Container escape attempt detected via runc CVE-2024-21626 descriptor leak.',
      detail: 'Attacker spawned unshared namespace shell /bin/sh on prod-k8s-worker-09.'
    },
    {
      time: '17:14:02.812',
      badge: 'DECEPTION TRAP',
      badgeColor: 'text-threat border-threat/30 bg-threat/10',
      text: 'Adversary read honeytoken: /opt/decoy/.aws_creds_canary (UUID: 8fa19e-4b).',
      detail: 'Tripwire trigger verified. Target was a synthetic decoy; zero customer data exposed.'
    },
    {
      time: '17:14:02.924',
      badge: 'CONTAINMENT',
      badgeColor: 'text-safe border-safe/30 bg-safe/10',
      text: 'Autonomous eBPF socket severance executed in 112ms. Host network isolated.',
      detail: 'Processes 40912 & 41002 frozen. Forensics memory snapshot saved to cold storage.'
    }
  ];

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setActiveStep((prev) => (prev + 1) % heroSimulationSteps.length);
      }, 2400);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, heroSimulationSteps.length]);

  return (
    <section className="relative pt-12 pb-16 overflow-hidden border-b border-border-light dark:border-border-dark bg-base-light dark:bg-base-dark">
      <div className="max-w-page mx-auto px-4">
        {/* Top Announcement Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-[12px] font-mono text-secondary-light dark:text-secondary-dark shadow-sm">
            <span className="w-2 h-2 rounded-full bg-safe animate-pulse" />
            <span className="text-primary-light dark:text-primary-dark font-medium">PHANTOM 2.14 GA</span>
            <span>•</span>
            <span className="text-accent font-semibold">Autonomous eBPF Kernel Deception</span>
          </div>
        </div>

        {/* Hero Headlines */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h1 className="text-[36px] sm:text-[48px] font-bold text-primary-light dark:text-primary-dark tracking-tight leading-[1.1]">
            Autonomous Cyber Deception & Micro-Containment at Kernel Speed.
          </h1>
          <p className="text-[16px] sm:text-[18px] text-secondary-light dark:text-secondary-dark leading-relaxed font-normal">
            Stop sophisticated lateral movement in milliseconds. PHANTOM weaves synthetic honeytokens, eBPF kernel probes, and autonomous neural triage into a precision observability instrument.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={onLaunchConsole}
              className="h-11 px-6 bg-accent hover:bg-accent-hover text-white rounded-md text-[14px] font-semibold flex items-center gap-2 transition-colors shadow-sm"
            >
              <span>Launch Live Console</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="#sandbox"
              className="h-11 px-5 border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark hover:bg-base-light dark:hover:bg-base-dark text-primary-light dark:text-primary-dark rounded-md text-[14px] font-medium flex items-center gap-2 transition-colors"
            >
              <span>Explore Interactive Sandbox</span>
            </a>
          </div>

          {/* Quick Stats Banner */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-lg mx-auto pt-6 text-left">
            <div className="p-3 rounded-card bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark">
              <div className="text-[20px] font-mono font-bold text-accent">&lt; 120ms</div>
              <div className="text-[11px] text-secondary-light dark:text-secondary-dark uppercase font-mono tracking-wider mt-0.5">
                Mean Time to Contain
              </div>
            </div>
            <div className="p-3 rounded-card bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark">
              <div className="text-[20px] font-mono font-bold text-safe">0.01%</div>
              <div className="text-[11px] text-secondary-light dark:text-secondary-dark uppercase font-mono tracking-wider mt-0.5">
                False Positive Rate
              </div>
            </div>
            <div className="p-3 rounded-card bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark">
              <div className="text-[20px] font-mono font-bold text-primary-light dark:text-primary-dark">&lt; 1.2%</div>
              <div className="text-[11px] text-secondary-light dark:text-secondary-dark uppercase font-mono tracking-wider mt-0.5">
                Kernel CPU Footprint
              </div>
            </div>
          </div>
        </div>

        {/* Embedded Interactive Live Terminal Preview */}
        <div className="mt-12 max-w-4xl mx-auto bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-card shadow-lg overflow-hidden">
          {/* Terminal Window Chrome */}
          <div className="p-3 border-b border-border-light dark:border-border-dark bg-base-light/70 dark:bg-base-dark/70 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 mr-2">
                <span className="w-2.5 h-2.5 rounded-full bg-threat/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-warning/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-safe/80" />
              </div>
              <Terminal className="w-4 h-4 text-secondary-light dark:text-secondary-dark" />
              <span className="text-[12px] font-mono font-semibold text-primary-light dark:text-primary-dark">
                phantom-daemon-live // prod-k8s-worker-09
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-1 rounded text-secondary-light hover:text-primary-light dark:hover:text-primary-dark transition-colors"
                title={isPlaying ? 'Pause simulation' : 'Play simulation'}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                onClick={() => setActiveStep(0)}
                className="p-1 rounded text-secondary-light hover:text-primary-light dark:hover:text-primary-dark transition-colors"
                title="Restart simulation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] font-mono text-secondary-light dark:text-secondary-dark px-1.5 py-0.5 rounded bg-base-light dark:bg-base-dark border border-border-light dark:border-border-dark">
                STEP 0{activeStep + 1}/04
              </span>
            </div>
          </div>

          {/* Live Step Progression */}
          <div className="p-4 space-y-3 font-mono text-[12px]">
            {heroSimulationSteps.map((step, idx) => {
              const isCurrent = idx === activeStep;
              const isPast = idx < activeStep;

              return (
                <div
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  className={`p-3 rounded border transition-all cursor-pointer ${
                    isCurrent
                      ? 'border-accent bg-accent-tint/30 dark:bg-accent-darkTint/30 shadow-sm'
                      : isPast
                      ? 'border-border-light dark:border-border-dark bg-base-light/30 dark:bg-base-dark/30 opacity-75'
                      : 'border-transparent opacity-40 hover:opacity-70'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded border uppercase ${step.badgeColor}`}>
                        {step.badge}
                      </span>
                      <div>
                        <div className="text-primary-light dark:text-primary-dark font-medium">
                          {step.text}
                        </div>
                        <div className="text-secondary-light dark:text-secondary-dark text-[11px] mt-0.5 font-sans">
                          {step.detail}
                        </div>
                      </div>
                    </div>
                    <span className="text-secondary-light dark:text-secondary-dark text-[11px] shrink-0">
                      {step.time}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Terminal Footer with Action Trigger */}
          <div className="p-3 border-t border-border-light dark:border-border-dark bg-base-light/40 dark:bg-base-dark/40 flex items-center justify-between text-[12px]">
            <span className="text-secondary-light dark:text-secondary-dark font-mono text-[11px]">
              Active eBPF Ring Buffer: 64MB • Drops: 0 • Zero-Copy Kernel Socket Filter
            </span>
            <button
              type="button"
              onClick={onLaunchConsole}
              className="text-accent hover:underline font-semibold font-mono text-[12px] inline-flex items-center gap-1"
            >
              <span>Inspect Full Session Detail</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
