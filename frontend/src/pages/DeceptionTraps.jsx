import React, { useState, useEffect } from 'react';
import { CanaryFileManager } from '../components/deception/CanaryFileManager';
import { CanaryAlertLog } from '../components/deception/CanaryAlertLog';
import { LoadingState } from '../components/common/LoadingState';

export function DeceptionTraps() {
  const [traps, setTraps] = useState([]);
  const [hits, setHits] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [trapsRes, hitsRes] = await Promise.all([
        fetch(`http://${window.location.hostname}:8001/api/canary/files`),
        fetch(`http://${window.location.hostname}:8001/api/canary/alerts`),
      ]);
      if (trapsRes.ok) setTraps(await trapsRes.json());
      if (hitsRes.ok) setHits(await hitsRes.json());
    } catch (e) {
      console.error("Error loading canary data:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeployTrap = async (newTrap) => {
    try {
      const res = await fetch(`http://${window.location.hostname}:8001/api/canary/deploy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTrap)
      });
      if (res.ok) {
        loadData();
      }
    } catch (e) {
      console.error("Failed to deploy trap:", e);
    }
  };

  if (loading) return <LoadingState message="Inspecting deception grid and honeypots..." />;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Overview Banner */}
      <div className="bg-white border border-[#E7E5E4] rounded-xl p-5 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-[#1C1917]">Canary Deception Grid</h2>
          <p className="text-xs text-[#78716C] mt-0.5">
            Filesystem honeypots deployed on endpoints. Monitored via kernel `watchdog` to catch unauthorized discovery and harvesting.
          </p>
        </div>
        <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
          GRID ARMED
        </span>
      </div>

      {/* 2-Column Grid: Deployed Traps & Breach Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CanaryFileManager traps={traps} onDeployTrap={handleDeployTrap} />
        <CanaryAlertLog hits={hits} />
      </div>
    </div>
  );
}
