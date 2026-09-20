import React from 'react';
import {
  LayoutDashboard,
  Radio,
  Workflow,
  Fingerprint,
  Radar,
  BellRing,
  FileText,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  Shield
} from 'lucide-react';
import { PageId } from '../../types';

interface SidebarProps {
  currentPage: PageId;
  onSelectPage: (page: PageId) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

interface NavItem {
  id: PageId;
  label: string;
  icon: React.ElementType;
  badge?: string | number;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'live-monitor', label: 'Live Monitor', icon: Radio, badge: 'Live' },
  { id: 'session-detail', label: 'Session Detail', icon: Workflow },
  { id: 'threat-intel', label: 'Threat Intelligence', icon: Fingerprint },
  { id: 'deception-traps', label: 'Deception Traps', icon: Radar, badge: 3 },
  { id: 'alerts', label: 'Alerts & Actions', icon: BellRing, badge: 6 },
  { id: 'incident-reports', label: 'Incident Reports', icon: FileText },
  { id: 'settings', label: 'Settings & History', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onSelectPage,
  collapsed,
  onToggleCollapse,
}) => {
  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-40 bg-surface-light dark:bg-surface-dark border-r border-border-light dark:border-border-dark flex flex-col justify-between transition-all duration-200 ${
        collapsed ? 'w-[72px]' : 'w-[260px]'
      }`}
    >
      {/* Brand & Header */}
      <div>
        <div className="h-8 flex items-center justify-between px-3 border-b border-border-light dark:border-border-dark">
          <div className="flex items-center gap-2 overflow-hidden">
            {/* Geometric brand mark */}
            <div className="w-8 h-8 rounded-lg bg-primary-light dark:bg-primary-dark text-white dark:text-base-dark flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4 text-accent fill-accent/20" strokeWidth={2.2} />
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="font-bold text-[15px] tracking-tight text-primary-light dark:text-primary-dark leading-none">
                  PHANTOM
                </span>
                <span className="text-[10px] font-mono tracking-wider text-secondary-light dark:text-secondary-dark mt-0.5">
                  PRECISION SEC-OPS
                </span>
              </div>
            )}
          </div>

          {!collapsed && (
            <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-base-light dark:bg-base-dark border border-border-light dark:border-border-dark text-secondary-light dark:text-secondary-dark">
              v2.14
            </span>
          )}
        </div>

        {/* Navigation list */}
        <nav className="p-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectPage(item.id)}
                title={collapsed ? item.label : undefined}
                className={`w-full h-[44px] flex items-center rounded-lg transition-colors text-left relative ${
                  collapsed ? 'justify-center px-0' : 'px-3'
                } ${
                  isActive
                    ? 'bg-accent-tint dark:bg-accent-darkTint text-accent font-medium'
                    : 'text-secondary-light dark:text-secondary-dark hover:text-primary-light dark:hover:text-primary-dark hover:bg-base-light dark:hover:bg-base-dark'
                }`}
              >
                {/* 3px active indicator on left */}
                {isActive && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r bg-accent" />
                )}

                <div className={`flex items-center ${collapsed ? '' : 'gap-2 flex-1 overflow-hidden'}`}>
                  <Icon className="w-5 h-5 shrink-0" strokeWidth={isActive ? 2 : 1.75} />
                  {!collapsed && (
                    <span className="text-body truncate">
                      {item.label}
                    </span>
                  )}
                </div>

                {!collapsed && item.badge && (
                  <span
                    className={`ml-auto text-[11px] font-mono px-1.5 py-0.5 rounded-full ${
                      item.badge === 'Live'
                        ? 'bg-threat/10 text-threat font-semibold animate-pulse'
                        : 'bg-base-light dark:bg-base-dark border border-border-light dark:border-border-dark text-secondary-light dark:text-secondary-dark'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer / Collapse trigger */}
      <div className="p-2 border-t border-border-light dark:border-border-dark">
        <button
          type="button"
          onClick={onToggleCollapse}
          className={`w-full h-[44px] flex items-center rounded-lg text-secondary-light dark:text-secondary-dark hover:text-primary-light dark:hover:text-primary-dark hover:bg-base-light dark:hover:bg-base-dark transition-colors ${
            collapsed ? 'justify-center' : 'px-3 gap-2'
          }`}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <PanelLeftOpen className="w-5 h-5 shrink-0" />
          ) : (
            <>
              <PanelLeftClose className="w-5 h-5 shrink-0" />
              <span className="text-body">Collapse Sidebar</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
};
