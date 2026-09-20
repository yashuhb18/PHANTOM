import React from 'react';
import { Loader2 } from 'lucide-react';

export function LoadingState({ message = 'Loading telemetry...' }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-[#78716C]">
      <Loader2 className="w-6 h-6 animate-spin text-indigo-600 mb-2" />
      <span className="text-xs font-mono">{message}</span>
    </div>
  );
}
