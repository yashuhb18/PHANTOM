import React from 'react';
import { AlertBadge } from '../common/AlertBadge';

export function Timeline({ events, activeIndex }) {
  if (!events || events.length === 0) {
    return <div className="p-6 text-center text-xs text-[#78716C]">No timeline events recorded.</div>;
  }

  return (
    <div className="bg-white border border-[#E7E5E4] rounded-xl p-5">
      <h3 className="text-xs font-semibold text-[#1C1917] mb-4">Event Sequence</h3>
      <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E7E5E4]">
        {events.map((evt, idx) => {
          const isSelected = activeIndex === undefined || idx <= activeIndex;
          return (
            <div key={evt.event_id || idx} className={`relative transition-opacity ${isSelected ? 'opacity-100' : 'opacity-30'}`}>
              <div className={`absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full border-2 bg-white ${
                evt.severity === 'CRITICAL' ? 'border-red-600 bg-red-600' : 'border-indigo-600'
              }`} />
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#1C1917]">{evt.event_type}</span>
                <AlertBadge severity={evt.severity} />
              </div>
              <div className="flex items-center gap-2 mt-1 text-[11px] text-[#78716C]">
                <span className="font-mono">{evt.timestamp?.slice(11, 19)}</span>
                <span>•</span>
                <span>Subsystem: {evt.source}</span>
                {evt.risk_score_delta > 0 && (
                  <span className="text-red-600 font-mono font-semibold">+{evt.risk_score_delta} risk</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
