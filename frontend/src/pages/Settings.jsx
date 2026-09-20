import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Usb, ShieldCheck, ShieldAlert, Ban } from 'lucide-react';
import { LoadingState } from '../components/common/LoadingState';

export function Settings() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDevices = async () => {
    try {
      const res = await fetch(`http://${window.location.hostname}:8001/api/devices`);
      if (res.ok) setDevices(await res.json());
    } catch (e) {
      console.error("Error loading devices:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDevices();
  }, []);

  const handleTrustChange = async (deviceId, status) => {
    try {
      const res = await fetch(`http://${window.location.hostname}:8001/api/devices/${deviceId}/trust?trust_status=${status}`, {
        method: 'POST'
      });
      if (res.ok) {
        loadDevices();
      }
    } catch (e) {
      console.error("Error updating device trust:", e);
    }
  };

  if (loading) return <LoadingState message="Querying USB hardware registry inventory..." />;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Overview Banner */}
      <div className="bg-white border border-[#E7E5E4] rounded-xl p-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600">
            <SettingsIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#1C1917]">Hardware & Peripheral Allowlist</h2>
            <p className="text-xs text-[#78716C] mt-0.5">
              Manage trusted hardware descriptors. Untrusted or blocked devices trigger automated micro-isolation upon connection.
            </p>
          </div>
        </div>
      </div>

      {/* Device Hardware Inventory */}
      <div className="bg-white border border-[#E7E5E4] rounded-xl overflow-hidden">
        <div className="p-4 border-b border-[#E7E5E4] flex items-center justify-between bg-[#FAFAF9]">
          <h3 className="text-xs font-semibold text-[#1C1917]">Known Peripheral Hardware Registry</h3>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-[#78716C] border border-[#E7E5E4]">
            {devices.length} Devices Registered
          </span>
        </div>

        <div className="divide-y divide-[#E7E5E4]">
          {devices.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#78716C]">
              No USB devices registered yet. Attach a USB device or run a demo simulation.
            </div>
          ) : (
            devices.map((dev) => (
              <div key={dev.id} className="p-4 hover:bg-[#FAFAF9] transition-colors flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#F5F5F4] border border-[#E7E5E4] text-[#78716C]">
                    <Usb className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-[#1C1917]">{dev.device_name}</span>
                      <span className="text-[10px] font-mono bg-[#F5F5F4] px-1.5 py-0.2 rounded border border-[#E7E5E4] text-[#78716C]">
                        VID:{dev.vendor_id} PID:{dev.product_id}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-[#78716C]">
                      <span>First seen: {dev.first_seen?.slice(0, 10)}</span>
                      <span>•</span>
                      <span>Total sessions: {dev.session_count}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleTrustChange(dev.id, 'TRUSTED')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                      dev.trust_status === 'TRUSTED'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300 font-semibold'
                        : 'bg-white text-[#78716C] border-[#E7E5E4] hover:bg-[#F5F5F4]'
                    }`}
                  >
                    Trusted
                  </button>
                  <button
                    onClick={() => handleTrustChange(dev.id, 'UNTRUSTED')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                      dev.trust_status === 'UNTRUSTED'
                        ? 'bg-amber-50 text-amber-700 border-amber-300 font-semibold'
                        : 'bg-white text-[#78716C] border-[#E7E5E4] hover:bg-[#F5F5F4]'
                    }`}
                  >
                    Untrusted
                  </button>
                  <button
                    onClick={() => handleTrustChange(dev.id, 'BLOCKED')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                      dev.trust_status === 'BLOCKED'
                        ? 'bg-red-50 text-red-700 border-red-300 font-semibold'
                        : 'bg-white text-[#78716C] border-[#E7E5E4] hover:bg-[#F5F5F4]'
                    }`}
                  >
                    Blocked
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
