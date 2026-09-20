import React from 'react';
import { Severity } from '../../types';

interface SeverityDotProps {
  severity: Severity;
  label?: string;
  className?: string;
}

export const SeverityDot: React.FC<SeverityDotProps> = ({ severity, label, className = '' }) => {
  const getColor = () => {
    switch (severity) {
      case 'critical':
        return 'bg-threat';
      case 'safe':
        return 'bg-safe';
      case 'warning':
      case 'investigating':
        return 'bg-warning';
      default:
        return 'bg-secondary-light dark:bg-secondary-dark';
    }
  };

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <span className={`w-2 h-2 rounded-full shrink-0 ${getColor()}`} />
      {label && (
        <span className="text-body text-primary-light dark:text-primary-dark font-medium capitalize">
          {label}
        </span>
      )}
    </div>
  );
};
