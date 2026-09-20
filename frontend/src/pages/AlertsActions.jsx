import React, { useState, useEffect } from 'react';
import { ShieldAlert, ShieldCheck, Zap, Lock, Radio } from 'lucide-react';
import { AlertBadge } from '../components/common/AlertBadge';
import { LoadingState } from '../components/common/LoadingState';

export function AlertsActions() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionStatus, setActionStatus] = useState(null);

  const loadAlerts = async () => {
    try {
      const res = await fetch(`http://${window.location.hostname}:8001/api/alerts`);
      if (res.ok) setAlerts(await res.json());
    } catch (e) {
      console.error("Failed to load alerts:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  const triggerAction = async (actionType) => {
    try {
      const res = await fetch(`http://${window.location.hostname}:8001/api/actions/isolate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: 'sess_demo_stage1_ducky',
          action_type: actionType,
          target: 'PRIMARY_NIC'
        })
      });
      if (res.ok) {
        setActionStatus(`Executed ${actionType} successfully.`);
        loadAlerts();
        setTimeout(() => setActionStatus(null), 4000);
      }
    } catch (e) {
      console.error("Action error:", e);
    }
  };

  if (loading) return <LoadingState message="Loading security alerts and incident actions..." />;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Containment Actions Card */}
      <div className="bg-white border border-[#E7E5E4] rounded-xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-[#1C1917]">Autonomous Containment Actions</h2>
          <p className="text-xs text-[#78716C] mt-0.5">
            Surgical endpoint defense triggers. Sever outbound network sockets or isolate host while keeping telemetry open.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => triggerAction('SOCKET_SEVER')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-medium shadow-xs transition-colors"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Sever Outbound Sockets</span>
          </button>
          <button
            onClick={() => triggerAction('MICRO_ISOLATE')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E7E5E4] hover:bg-[#F5F5F4] text-[#1C1917] text-xs font-medium transition-colors"
          >
            <Lock className="w-3.5 h-3.5 text-indigo-600" />
            <span>Micro-Isolate Host</span>
          </button>
        </div>
      </div>

      {actionStatus && (
        <div className="p-3 px-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg font-medium flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" />
          <span>{actionStatus}</span>
        </div>
      )}

      {/* Alerts Table with left-border stripes */}
      <div className="bg-white border border-[#E7E5E4] rounded-xl overflow-hidden">
        <div className="p-4 border-b border-[#E7E5E4] flex items-center justify-between bg-[#FAFAF9]">
          <h3 className="text-xs font-semibold text-[#1C1917]">Triggered Incident Alerts</h3>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-[#78716C] border border-[#E7E5E4]">
            {alerts.length} ALERTS
          </span>
        </div>

        <div className="divide-y divide-[#E7E5E4]">
          {alerts.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#78716C]">
              No active security alerts recorded.
            </div>
          ) : (
            alerts.map((alert) => {
              const isCrit = alert.severity === 'CRITICAL';
              const stripeColor = isCrit ? 'border-l-red-600' : 'border-l-amber-500';
              return (
                <div
                  key={alert.id}
                  className={`p-4 hover:bg-[#FAFAF9] transition-colors border-l-4 ${stripeColor} flex items-center justify-between`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-[#1C1917]">{alert.title}</span>
                      {alert.mitre_technique && (
                        <span className="text-[10px] font-mono bg-indigo-50 text-indigo-700 px-1.5 py-0.2 rounded border border-indigo-200">
                          MITRE: {alert.mitre_technique}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#78716C] mt-1">{alert.description}</p>
                    <div className="flex items-center gap-2 mt-2 text-[11px] text-[#A8A29E] font-mono">
                      <span>{alert.created_at?.slice(0, 19).replace('T', ' ')} UTC</span>
                      <span>•</span>
                      <span>Target: {alert.session_id}</span>
                      <span>•</span>
                      <span className="text-emerald-700 font-semibold">{alert.status}</span>
                    </div>
                  </div>

                  <AlertBadge severity={alert.severity} />
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
