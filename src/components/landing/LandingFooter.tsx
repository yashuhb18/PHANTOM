import React from 'react';
import { Shield } from 'lucide-react';

export const LandingFooter: React.FC = () => {
  return (
    <footer className="bg-surface-light dark:bg-surface-dark border-t border-border-light dark:border-border-dark py-8">
      <div className="max-w-page mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand & Tagline */}
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-md bg-primary-light dark:bg-primary-dark text-white dark:text-base-dark flex items-center justify-center">
            <Shield className="w-3.5 h-3.5 text-accent fill-accent/20" strokeWidth={2.2} />
          </div>
          <span className="font-bold text-[15px] text-primary-light dark:text-primary-dark tracking-tight">
            PHANTOM
          </span>
          <span className="text-secondary-light dark:text-secondary-dark text-[12px]">
            • Precision Cyber Deception & Micro-Containment
          </span>
        </div>

        {/* Status indicator & Copyright */}
        <div className="flex items-center gap-4 text-[12px] font-mono text-secondary-light dark:text-secondary-dark">
          <div className="inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-safe" />
            <span>All Probes Nominal</span>
          </div>
          <span>•</span>
          <span>&copy; 2026 PHANTOM Technologies</span>
        </div>
      </div>
    </footer>
  );
};
