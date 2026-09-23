import React from 'react';

export function AlertBadge({ severity }) {
  const styles = {
    CRITICAL: 'bg-red-500/15 text-red-400 border-red-500/30',
    HIGH: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    MEDIUM: 'bg-[#FDE047]/15 text-[#FDE047] border-[#FDE047]/30',
    LOW: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    INFO: 'bg-white/10 text-neutral-300 border-white/15',
  };

  const level = (severity || 'INFO').toUpperCase();
  const style = styles[level] || styles.INFO;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider border ${style}`}>
      {level}
    </span>
  );
}
