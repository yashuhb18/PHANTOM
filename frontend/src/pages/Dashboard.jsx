import React, { useState, useEffect } from 'react';
import { ThreatSummary } from '../components/dashboard/ThreatSummary';
import { ActiveSessions } from '../components/dashboard/ActiveSessions';
import { LiveTicker } from '../components/dashboard/LiveTicker';
import { SimulateButton } from '../components/common/SimulateButton';
import { useWebSocket } from '../hooks/useWebSocket';

export function Dashboard({ setTab, setSelectedSessionId }) {
  const [sessions, setSessions] = useState([]);
  const [stats, setStats] = useState({
    containmentCount: 2,
    canaryHits: 3,
    clusterCount: 2,
  });
  const { liveEvents } = useWebSocket();

  const fetchSessions = async () => {
    try {
      const res = await fetch(`http://${window.location.hostname}:8001/api/sessions`);
      const data = await res.json();
      setSessions(data);
    } catch (e) {
      console.error("Failed to fetch sessions:", e);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleSessionClick = (id) => {
    setSelectedSessionId(id);
    setTab('sessions');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner with Demo Simulation Triggers */}
      <div className="bg-white border border-[#E7E5E4] rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-[#1C1917]">Hackathon Demo Controls</h2>
          <p className="text-xs text-[#78716C] mt-0.5">
            Trigger real-time multi-stage USB attacks to demonstrate autonomous deception, correlation, and DNA fingerprinting.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <SimulateButton stage={1} onComplete={() => fetchSessions()} />
          <SimulateButton stage={2} onComplete={() => fetchSessions()} />
        </div>
      </div>

      {/* KPI Metrics */}
      <ThreatSummary stats={stats} />

      {/* 2-Column Grid: Active Sessions & Live Ticker */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ActiveSessions sessions={sessions} onSelectSession={handleSessionClick} />
        </div>
        <div className="lg:col-span-1">
          <LiveTicker events={liveEvents} />
        </div>
      </div>
    </div>
  );
}
