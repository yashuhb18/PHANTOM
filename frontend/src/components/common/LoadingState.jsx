import React from 'react';
import { Loader2 } from 'lucide-react';

export function LoadingState({ message = 'Loading telemetry...' }) {
  return (
    <div className="flex flex-col items-center justify-center p-16 text-neutral-400">
      <Loader2 className="w-7 h-7 animate-spin text-[#FDE047] mb-3" />
      <span className="text-xs font-mono tracking-wider uppercase text-neutral-300">{message}</span>
    </div>
  );
}
