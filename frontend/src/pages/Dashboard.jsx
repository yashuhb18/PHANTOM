import React, { useState, useEffect } from 'react';
import { ThreatSummary } from '../components/dashboard/ThreatSummary';
import { ActiveSessions } from '../components/dashboard/ActiveSessions';
import { LiveTicker } from '../components/dashboard/LiveTicker';
import { SimulateButton } from '../components/common/SimulateButton';
import { useWebSocket } from '../hooks/useWebSocket';

export function Dashboard({ setTab, setSelectedSessionId }) {
  const [sessions, setSessions] = useState([]);
  const [stats, setStats] = useState({
    containmentCount: 0,
    canaryHits: 0,
    clusterCount: 0,
  });
  const { liveEvents } = useWebSocket();

  const fetchStats = async () => {
    try {
      const res = await fetch(`http://${window.location.hostname}:8001/api/stats`);
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (e) {
      console.error("Stats fetch error:", e);
    }
  };

  const fetchSessions = async () => {
    try {
      const res = await fetch(`http://${window.location.hostname}:8001/api/sessions`);
      const data = await res.json();
      setSessions(data);
    } catch (e) {
      console.error("Failed to fetch sessions:", e);
    }
  };

  const [topology, setTopology] = useState(null);

  const fetchTopology = async () => {
    try {
      const res = await fetch(`http://${window.location.hostname}:8001/api/devices/topology`);
      if (res.ok) {
        const data = await res.json();
        setTopology(data);
      }
    } catch (e) {
      console.error("Topology fetch error:", e);
    }
  };

  useEffect(() => {
    fetchSessions();
    fetchTopology();
    fetchStats();
  }, []);

  // Update topology and stats on live events
  useEffect(() => {
    if (liveEvents && liveEvents.length > 0) {
      const latest = liveEvents[0];
      if (['PORT_TOPOLOGY_UPDATED', 'USB_INSERTED', 'USB_REMOVED', 'CANARY_TRAP_TRIPPED', 'CONTAINMENT_TRIGGERED'].includes(latest.event_type)) {
        fetchTopology();
        fetchSessions();
        fetchStats();
      }
    }
  }, [liveEvents]);

  const handleSessionClick = (id) => {
    setSelectedSessionId(id);
    setTab('sessions');
  };

  const storageCount = topology?.summary?.active_storage_devices || 0;
  const periCount = topology?.summary?.active_peripherals || 0;
  const storageDevices = topology?.storage_devices || [];
  const peripherals = topology?.peripherals || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Real-time Hardware & Port Status Overview Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-900/50 rounded-xl p-4 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 rounded-lg bg-indigo-500/20 border border-indigo-400/30 text-indigo-300">
            <span className="text-base font-mono">⚡</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold tracking-tight text-white">Laptop Hardware & Port Sentinel</h3>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                LIVE AGENT
              </span>
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5">
              {periCount} Peripherals Attached (e.g. {peripherals[0]?.name || 'Wireless Mouse Dongle'}) • {storageCount > 0 ? `${storageCount} Flash Storage Active` : 'Awaiting USB Flash Drive Insertion'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setTab('ports')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors cursor-pointer border border-indigo-400/30 shadow-sm shrink-0"
        >
          <span>View Port Topology</span>
          <span className="text-xs">→</span>
        </button>
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
