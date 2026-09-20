import React from 'react';
import { Shield, ArrowRight, Sun, Moon } from 'lucide-react';

interface LandingNavbarProps {
  onLaunchConsole: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const LandingNavbar: React.FC<LandingNavbarProps> = ({
  onLaunchConsole,
  darkMode,
  onToggleDarkMode
}) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-surface-light/90 dark:bg-surface-dark/90 backdrop-blur-md border-b border-border-light dark:border-border-dark">
      <div className="max-w-page mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand Logo & Version */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary-light dark:bg-primary-dark text-white dark:text-base-dark flex items-center justify-center shrink-0">
            <Shield className="w-4 h-4 text-accent fill-accent/20" strokeWidth={2.2} />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-[16px] tracking-tight text-primary-light dark:text-primary-dark leading-none">
              PHANTOM
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-base-light dark:bg-base-dark border border-border-light dark:border-border-dark text-secondary-light dark:text-secondary-dark">
              v2.14
            </span>
          </div>
        </div>

        {/* Minimal Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-[13px] font-medium text-secondary-light dark:text-secondary-dark">
          <a href="#overview" className="hover:text-primary-light dark:hover:text-primary-dark transition-colors">
            Overview
          </a>
          <a href="#how-it-works" className="hover:text-primary-light dark:hover:text-primary-dark transition-colors">
            How It Works
          </a>
          <a href="#metrics" className="hover:text-primary-light dark:hover:text-primary-dark transition-colors">
            Performance
          </a>
        </nav>

        {/* Actions: Theme Toggle & Launch Console */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onToggleDarkMode}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="w-9 h-9 flex items-center justify-center rounded-md border border-border-light dark:border-border-dark text-secondary-light dark:text-secondary-dark hover:text-primary-light dark:hover:text-primary-dark hover:bg-base-light dark:hover:bg-base-dark transition-colors"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={onLaunchConsole}
            className="h-9 px-4 bg-accent hover:bg-accent-hover text-white rounded-md text-[13px] font-medium flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <span>Launch Console</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
