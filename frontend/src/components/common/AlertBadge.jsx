import React from 'react';

export function AlertBadge({ severity }) {
  const styles = {
    CRITICAL: 'bg-red-50 text-red-700 border-red-200',
    HIGH: 'bg-amber-50 text-amber-700 border-amber-200',
    MEDIUM: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    LOW: 'bg-blue-50 text-blue-700 border-blue-200',
    INFO: 'bg-stone-50 text-stone-600 border-stone-200',
  };

  const level = (severity || 'INFO').toUpperCase();
  const style = styles[level] || styles.INFO;

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${style}`}>
      {level}
    </span>
  );
}
