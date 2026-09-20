import React from 'react';
import { ShieldAlert } from 'lucide-react';

export function EmptyState({ title = 'No records found', description = 'No activity matching your criteria has been logged.', icon: Icon = ShieldAlert }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white border border-[#E7E5E4] rounded-xl">
      <div className="w-10 h-10 rounded-full bg-[#F5F5F4] flex items-center justify-center text-[#78716C] mb-3">
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="text-sm font-semibold text-[#1C1917]">{title}</h3>
      <p className="mt-1 text-xs text-[#78716C] max-w-sm">{description}</p>
    </div>
  );
}
