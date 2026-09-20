import React from 'react';
import { LandingNavbar } from '../components/landing/LandingNavbar';
import { LandingHero } from '../components/landing/LandingHero';
import { HowItWorks } from '../components/landing/HowItWorks';
import { MetricsBanner } from '../components/landing/MetricsBanner';
import { LandingFooter } from '../components/landing/LandingFooter';
import { ArrowRight, Shield } from 'lucide-react';

interface LandingPageProps {
  onLaunchConsole: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onLaunchConsole,
  darkMode,
  onToggleDarkMode
}) => {
  return (
    <div className="min-h-screen bg-base-light dark:bg-base-dark text-primary-light dark:text-primary-dark font-sans selection:bg-accent selection:text-white">
      {/* Top Sticky Navigation */}
      <LandingNavbar
        onLaunchConsole={onLaunchConsole}
        darkMode={darkMode}
        onToggleDarkMode={onToggleDarkMode}
      />

      {/* Hero with Sleek Live Terminal Simulation */}
      <div id="overview">
        <LandingHero onLaunchConsole={onLaunchConsole} />
      </div>

      {/* Clean 3-Pillar How It Works */}
      <HowItWorks />

      {/* Precision Metrics & Benchmarks */}
      <MetricsBanner />

      {/* Bottom Launch Callout */}
      <section className="py-16 border-b border-border-light dark:border-border-dark bg-base-light dark:bg-base-dark">
        <div className="max-w-page mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-card p-8 text-center space-y-4 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-accent text-white flex items-center justify-center mx-auto">
              <Shield className="w-5 h-5 fill-white/20" />
            </div>

            <h3 className="text-[24px] font-bold text-primary-light dark:text-primary-dark tracking-tight">
              Ready to explore live telemetry?
            </h3>

            <p className="text-[14px] text-secondary-light dark:text-secondary-dark max-w-lg mx-auto leading-relaxed">
              Step into the PHANTOM control room to inspect real-time eBPF socket events, interactive attack causality graphs, and deception traps.
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={onLaunchConsole}
                className="h-11 px-6 bg-accent hover:bg-accent-hover text-white rounded-md text-[14px] font-semibold inline-flex items-center gap-2 transition-colors shadow-sm"
              >
                <span>Launch PHANTOM Console</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Minimal Footer */}
      <LandingFooter />
    </div>
  );
};
