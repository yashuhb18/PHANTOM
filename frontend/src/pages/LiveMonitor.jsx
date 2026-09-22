import React from 'react';
import { EventFeed } from '../components/monitor/EventFeed';
import { NarratorPanel } from '../components/monitor/NarratorPanel';
import { SimulateButton } from '../components/common/SimulateButton';
import { useWebSocket } from '../hooks/useWebSocket';

export function LiveMonitor() {
  const { liveEvents, narratorMessages, clearEvents } = useWebSocket();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Live Surveillance Banner */}
      <div className="bg-white border border-[#E7E5E4] rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-bold text-[#1C1917] tracking-tight">Live Threat Hunting Console</h2>
            <span className="flex items-center gap-1 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              PHYSICAL HARDWARE LISTENER ACTIVE
            </span>
          </div>
          <p className="text-[11px] text-[#78716C] mt-0.5">
            Observing physical USB insertions, hardware descriptors, keystroke bursts, process spawns, and canary traps in real time.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={clearEvents}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#78716C] hover:text-[#1C1917] hover:bg-[#F5F5F4] border border-[#E7E5E4] transition-colors cursor-pointer"
          >
            Clear Telemetry Feed
          </button>
        </div>
      </div>

      {/* Split Screen Telemetry & Narrator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EventFeed events={liveEvents} onClear={clearEvents} />
        <NarratorPanel messages={narratorMessages} />
      </div>
    </div>
  );
}
