import React from 'react';
import { ExternalLink } from 'lucide-react';
import { useWebSocket } from '../../hooks/useWebSocket';

export function Header({ currentTab, setTab }) {
  const { isLiveConnected, isNarratorConnected } = useWebSocket();

  const titleMap = {
    dashboard: 'Security Overview',
    ports: 'Hardware & USB Ports Topology',
    live: 'Live Telemetry & AI Threat Narrator',
    sessions: 'Session Forensics & Time-Travel Replay',
    'threat-intel': 'Attack DNA Fingerprinting & Threat Intelligence',
    deception: 'Canary Deception Grid',
    alerts: 'Alerts & Autonomous Containment',
    reports: 'Forensic Incident Reports',
    settings: 'Hardware Settings & USB Inventory',
  };

  return (
    <header className="h-16 bg-[#0A0A0A]/90 backdrop-blur-xl border-b border-white/[0.08] px-6 lg:px-8 flex items-center justify-between shrink-0 sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <h1 className="text-sm font-bold text-white tracking-tight">
          {titleMap[currentTab] || 'PHANTOM Security'}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Status Indicators (Pills) */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/[0.08] bg-[#141414] text-[11px] font-mono select-none">
          <span className={`w-2 h-2 rounded-full ${isLiveConnected ? 'bg-emerald-400 animate-pulse' : 'bg-red-500'}`} />
          <span className="text-neutral-400">
            SOCKET: <strong className={isLiveConnected ? 'text-emerald-400' : 'text-red-400'}>{isLiveConnected ? 'ONLINE' : 'CONNECTING'}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/[0.08] bg-[#141414] text-[11px] font-mono select-none">
          <span className={`w-2 h-2 rounded-full ${isNarratorConnected ? 'bg-[#FDE047]' : 'bg-neutral-600'}`} />
          <span className="text-neutral-400">
            NARRATOR: <strong className={isNarratorConnected ? 'text-[#FDE047]' : 'text-neutral-500'}>{isNarratorConnected ? 'ACTIVE' : 'IDLE'}</strong>
          </span>
        </div>

        {/* Back to product website pill button */}
        <button
          onClick={() => setTab('landing')}
          className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-semibold text-white transition-all cursor-pointer pill-button shrink-0"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Product Website</span>
        </button>
      </div>
    </header>
  );
}
