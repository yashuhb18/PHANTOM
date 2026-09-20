import React from 'react';
import { EventFeed } from '../components/monitor/EventFeed';
import { NarratorPanel } from '../components/monitor/NarratorPanel';
import { SimulateButton } from '../components/common/SimulateButton';
import { useWebSocket } from '../hooks/useWebSocket';

export function LiveMonitor() {
  const { liveEvents, narratorMessages, clearEvents } = useWebSocket();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Simulation Controls Banner */}
      <div className="bg-white border border-[#E7E5E4] rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xs font-bold text-[#1C1917] tracking-tight">Live Threat Hunting Console</h2>
          <p className="text-[11px] text-[#78716C]">
            Observing incoming hardware descriptors, keystroke bursts, process spawns, and canary traps in real time.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <SimulateButton stage={1} />
          <SimulateButton stage={2} />
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
