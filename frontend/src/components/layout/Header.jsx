import React from 'react';
import { Shield, Radio, Terminal, ExternalLink } from 'lucide-react';
import { useWebSocket } from '../../hooks/useWebSocket';

export function Header({ currentTab, setTab }) {
  const { isLiveConnected, isNarratorConnected } = useWebSocket();

  const titleMap = {
    dashboard: 'Security Overview',
    live: 'Live Telemetry & AI Threat Narrator',
    sessions: 'Session Forensics & Time-Travel Replay',
    'threat-intel': 'Attack DNA Fingerprinting & Threat Intelligence',
    deception: 'Canary Deception Grid',
    alerts: 'Alerts & Autonomous Containment',
    reports: 'Forensic Incident Reports',
    settings: 'Hardware Settings & USB Inventory',
  };

  return (
    <header className="h-16 bg-white border-b border-[#E7E5E4] px-8 flex items-center justify-between shrink-0 sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <h1 className="text-base font-semibold text-[#1C1917] tracking-tight">
          {titleMap[currentTab] || 'PHANTOM Security'}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Status Indicators */}
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full border border-[#E7E5E4] bg-[#FAFAF9] text-[11px] font-mono">
          <span className={`w-2 h-2 rounded-full ${isLiveConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
          <span className="text-[#78716C]">
            SOCKET: <strong className={isLiveConnected ? 'text-emerald-700' : 'text-red-700'}>{isLiveConnected ? 'ONLINE' : 'CONNECTING'}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full border border-[#E7E5E4] bg-[#FAFAF9] text-[11px] font-mono">
          <span className={`w-2 h-2 rounded-full ${isNarratorConnected ? 'bg-indigo-500' : 'bg-[#A8A29E]'}`} />
          <span className="text-[#78716C]">
            AI NARRATOR: <strong className={isNarratorConnected ? 'text-indigo-700' : 'text-[#78716C]'}>{isNarratorConnected ? 'ACTIVE' : 'IDLE'}</strong>
          </span>
        </div>

        {/* Back to landing page button */}
        <button
          onClick={() => setTab('landing')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E7E5E4] hover:bg-[#F5F5F4] text-xs font-medium text-[#78716C] transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Product Overview</span>
        </button>
      </div>
    </header>
  );
}
