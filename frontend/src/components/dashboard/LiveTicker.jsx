import React from 'react';
import { Activity } from 'lucide-react';
import { AlertBadge } from '../common/AlertBadge';

export function LiveTicker({ events }) {
  const displayEvents = events?.slice(0, 6) || [];

  return (
    <div className="bg-white border border-[#E7E5E4] rounded-xl overflow-hidden">
      <div className="px-5 py-3.5 border-b border-[#E7E5E4] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-indigo-600" />
          <h3 className="text-xs font-semibold text-[#1C1917]">Live Telemetry Stream</h3>
        </div>
        <span className="text-[10px] font-mono text-[#78716C] bg-[#FAFAF9] px-2 py-0.5 rounded border border-[#E7E5E4]">
          WEBSOCKET BUFFER
        </span>
      </div>

      <div className="divide-y divide-[#E7E5E4]">
        {displayEvents.length === 0 ? (
          <div className="p-6 text-center text-xs text-[#78716C]">
            Awaiting endpoint telemetry. Run a simulation or attach a device.
          </div>
        ) : (
          displayEvents.map((evt, idx) => (
            <div key={evt.event_id || idx} className="p-3.5 px-5 flex items-center justify-between text-xs hover:bg-[#FAFAF9] transition-colors">
              <div className="flex items-center gap-3 overflow-hidden">
                <span className="text-[11px] font-mono text-[#A8A29E] shrink-0">
                  {evt.timestamp ? evt.timestamp.slice(11, 19) : '00:00:00'}
                </span>
                <span className="px-1.5 py-0.5 rounded font-mono text-[10px] bg-[#F5F5F4] text-[#78716C] border border-[#E7E5E4] shrink-0">
                  {evt.source}
                </span>
                <span className="font-medium text-[#1C1917] truncate">{evt.event_type}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-4">
                {evt.risk_score_delta > 0 && (
                  <span className="text-[10px] font-mono text-red-600 font-bold">
                    +{evt.risk_score_delta}
                  </span>
                )}
                <AlertBadge severity={evt.severity} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
