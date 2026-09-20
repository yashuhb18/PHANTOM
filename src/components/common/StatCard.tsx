import React from 'react';
import * as LucideIcons from 'lucide-react';
import { Severity } from '../../types';

interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  icon: string;
  status?: Severity;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  change,
  icon,
  status
}) => {
  // Dynamically grab Lucide icon
  const IconComponent = (LucideIcons as unknown as Record<string, React.ElementType>)[icon] || LucideIcons.Activity;

  const getStatusColor = () => {
    switch (status) {
      case 'critical':
        return 'text-threat';
      case 'safe':
        return 'text-safe';
      case 'warning':
      case 'investigating':
        return 'text-warning';
      default:
        return 'text-secondary-light dark:text-secondary-dark';
    }
  };

  return (
    <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-card p-3 flex flex-col justify-between transition-colors">
      <div className="flex items-center justify-between mb-2">
        <div className={`p-1.5 rounded-md bg-base-light dark:bg-base-dark border border-border-light dark:border-border-dark ${getStatusColor()}`}>
          <IconComponent className="w-5 h-5" strokeWidth={1.75} />
        </div>
        {status && (
          <span className={`w-2 h-2 rounded-full ${status === 'critical' ? 'bg-threat' : status === 'safe' ? 'bg-safe' : 'bg-warning'}`} />
        )}
      </div>
      <div>
        <div className="text-[32px] font-bold leading-tight text-primary-light dark:text-primary-dark tracking-tight">
          {value}
        </div>
        <div className="text-meta text-secondary-light dark:text-secondary-dark mt-1">
          {label}
        </div>
        {change && (
          <div className="text-[12px] font-normal text-secondary-light dark:text-secondary-dark mt-2">
            {change}
          </div>
        )}
      </div>
    </div>
  );
};
