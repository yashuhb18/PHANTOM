import React from 'react';
import { Sun, Moon, Search, Plus, ArrowLeft } from 'lucide-react';
import { PageId } from '../../types';

interface HeaderProps {
  currentPage: PageId;
  collapsed: boolean;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onPrimaryAction?: () => void;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  onBackToLanding?: () => void;
}

const pageTitles: Record<PageId, { title: string; actionLabel?: string; subtitle?: string }> = {
  'dashboard': {
    title: 'Security Operations Dashboard',
    actionLabel: 'Export Telemetry',
    subtitle: 'Autonomous perimeter surveillance and live event triage'
  },
  'live-monitor': {
    title: 'Live Event Monitor',
    actionLabel: 'Pause Stream',
    subtitle: 'Raw socket and syscall telemetry paired with autonomous AI analysis'
  },
  'session-detail': {
    title: 'Session Forensics & Attack Graph',
    actionLabel: 'Isolate Host',
    subtitle: 'Deep-dive session SES-8841-B on prod-k8s-worker-09'
  },
  'threat-intel': {
    title: 'Threat Intelligence & Fingerprints',
    actionLabel: 'Sync Actor Baselines',
    subtitle: 'Cluster attribution and behavioral similarity matching'
  },
  'deception-traps': {
    title: 'Deception Traps & Honeytokens',
    actionLabel: 'Deploy New Trap',
    subtitle: 'Active decoy assets and breach-interception canaries'
  },
  'alerts': {
    title: 'Security Alerts & Actions',
    actionLabel: 'Contain All Critical',
    subtitle: 'Sortable alert queue with automated containment triggers'
  },
  'incident-reports': {
    title: 'Forensic Incident Reports',
    actionLabel: 'Export Brief (PDF)',
    subtitle: 'Executive documentation and breach investigation briefs'
  },
  'settings': {
    title: 'Settings & Device Fleet History',
    actionLabel: 'Save Policies',
    subtitle: 'Autonomous response parameters and fleet telemetry rules'
  }
};

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  collapsed,
  darkMode,
  onToggleDarkMode,
  onPrimaryAction,
  searchQuery = '',
  onSearchChange,
  onBackToLanding
}) => {
  const pageInfo = pageTitles[currentPage];

  return (
    <header
      className={`sticky top-0 z-30 h-8 bg-surface-light/95 dark:bg-surface-dark/95 backdrop-blur-sm border-b border-border-light dark:border-border-dark flex items-center justify-between px-4 transition-all duration-200 ${
        collapsed ? 'ml-[72px]' : 'ml-[260px]'
      }`}
    >
      {/* Page Title (Left) */}
      <div className="flex items-center gap-3 overflow-hidden">
        {onBackToLanding && (
          <button
            type="button"
            onClick={onBackToLanding}
            title="Return to Product Landing Page"
            className="h-8 px-2.5 rounded border border-border-light dark:border-border-dark text-[12px] font-medium text-secondary-light dark:text-secondary-dark hover:text-primary-light dark:hover:text-primary-dark hover:bg-base-light dark:hover:bg-base-dark flex items-center gap-1.5 transition-colors shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Landing</span>
          </button>
        )}

        <div className="flex items-baseline gap-3 overflow-hidden">
          <h1 className="text-page-title text-primary-light dark:text-primary-dark tracking-tight truncate">
            {pageInfo.title}
          </h1>
          <span className="hidden lg:inline-block text-[12px] text-secondary-light dark:text-secondary-dark font-mono truncate">
            {pageInfo.subtitle}
          </span>
        </div>
      </div>

      {/* Right Controls: Search, Theme Toggle, Primary Action */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Quick Search */}
        {onSearchChange && (
          <div className="relative hidden md:flex items-center">
            <Search className="w-4 h-4 text-secondary-light dark:text-secondary-dark absolute left-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search sessions, IPs, hashes..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-56 h-9 pl-8 pr-3 bg-base-light dark:bg-base-dark border border-border-light dark:border-border-dark rounded-md text-[13px] text-primary-light dark:text-primary-dark placeholder-secondary-light dark:placeholder-secondary-dark focus:outline-none focus:border-accent"
            />
          </div>
        )}

        {/* Dark/Light mode toggle */}
        <button
          type="button"
          onClick={onToggleDarkMode}
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="w-9 h-9 flex items-center justify-center rounded-md border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-secondary-light dark:text-secondary-dark hover:text-primary-light dark:hover:text-primary-dark hover:bg-base-light dark:hover:bg-base-dark transition-colors"
        >
          {darkMode ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </button>

        {/* Primary Action Button */}
        {pageInfo.actionLabel && (
          <button
            type="button"
            onClick={onPrimaryAction}
            className="h-9 px-3.5 bg-accent hover:bg-accent-hover text-white rounded-md text-[13px] font-medium flex items-center gap-1.5 transition-colors"
          >
            {currentPage === 'deception-traps' && <Plus className="w-4 h-4" />}
            <span>{pageInfo.actionLabel}</span>
          </button>
        )}
      </div>
    </header>
  );
};
