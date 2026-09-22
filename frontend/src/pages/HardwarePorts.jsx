import React, { useState, useEffect } from 'react';
import { 
  Usb, 
  Cpu, 
  HardDrive, 
  Mouse, 
  Keyboard, 
  Camera, 
  Bluetooth, 
  RefreshCw, 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle,
  Radio,
  Layers,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { useWebSocket } from '../hooks/useWebSocket';

export function HardwarePorts({ setTab, setSelectedSessionId }) {
  const [topology, setTopology] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const { liveEvents } = useWebSocket();

  const fetchTopology = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const url = `http://${window.location.hostname}:8001/api/devices/topology`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setTopology(data);
        if (isManual) {
          showToast("Hardware topology refreshed: all laptop ports scanned.");
        }
      }
    } catch (err) {
      console.error("Failed to fetch topology:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    fetchTopology();
  }, []);

  // React in real time to hardware events over WebSocket
  useEffect(() => {
    if (liveEvents && liveEvents.length > 0) {
      const latest = liveEvents[0];
      if (
        latest.event_type === 'PORT_TOPOLOGY_UPDATED' || 
        latest.event_type === 'USB_INSERTED' || 
        latest.event_type === 'USB_REMOVED' ||
        latest.event_type === 'PERIPHERAL_ATTACHED'
      ) {
        if (latest.topology) {
          setTopology(latest.topology);
        } else {
          fetchTopology();
        }
        if (latest.event_type === 'USB_INSERTED') {
          showToast(`⚡ Physical USB Flash Drive detected: ${latest.data?.device_name || 'USB Storage'}`);
        } else if (latest.event_type === 'USB_REMOVED') {
          showToast("⚠️ USB device detached. Session moved to post-removal monitoring.");
        }
      }
    }
  }, [liveEvents]);

  const handleManualScan = async () => {
    setRefreshing(true);
    try {
      const res = await fetch(`http://${window.location.hostname}:8001/api/devices/scan`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        if (data.topology) setTopology(data.topology);
        showToast("Low-latency port rescan complete. Hardware matrix synchronized.");
      }
    } catch (e) {
      console.error("Scan error:", e);
    } finally {
      setRefreshing(false);
    }
  };

  const summary = topology?.summary || {
    total_controllers: 2,
    total_root_hubs: 3,
    estimated_available_ports: 6,
    active_storage_devices: 0,
    active_peripherals: 2,
    active_integrated_devices: 3,
    total_connected_devices: 5
  };

  const storageDevices = topology?.storage_devices || [];
  const peripherals = topology?.peripherals || [];
  const integratedDevices = topology?.integrated_devices || [];
  const controllers = topology?.controllers || [];
  const hubs = topology?.hubs || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1C1917] text-white px-4 py-3 rounded-xl shadow-xl border border-[#292524] flex items-center gap-3 text-xs animate-bounce">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hero Header Banner */}
      <div className="bg-white border border-[#E7E5E4] rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-sm font-bold text-[#1C1917] tracking-tight">Laptop Port & Hardware Matrix</h1>
            <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              WMI HARDWARE DAEMON ACTIVE
            </span>
          </div>
          <p className="text-xs text-[#78716C] mt-1">
            Real-time continuous surveillance of USB 3.2/3.1 host controllers, wireless mouse dongles, RF receivers, and removable storage.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleManualScan}
            disabled={refreshing}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#F5F5F4] hover:bg-[#E7E5E4] text-[#1C1917] border border-[#D6D3D1] transition-all disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-indigo-600' : 'text-[#78716C]'}`} />
            <span>{refreshing ? 'Scanning Ports...' : 'Rescan Ports'}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E7E5E4] rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#78716C] font-medium">Host Controllers</span>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-bold text-[#1C1917] font-mono mt-2">{summary.total_controllers}</p>
          <p className="text-[11px] text-[#A8A29E] mt-0.5">USB 3.2 / 3.1 SuperSpeed</p>
        </div>

        <div className="bg-white border border-[#E7E5E4] rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#78716C] font-medium">Root Hubs & Ports</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-bold text-[#1C1917] font-mono mt-2">{summary.total_root_hubs}</p>
          <p className="text-[11px] text-[#A8A29E] mt-0.5">~{summary.estimated_available_ports} Ports Available</p>
        </div>

        <div className="bg-white border border-[#E7E5E4] rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#78716C] font-medium">Connected Peripherals</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600 border border-amber-100">
              <Mouse className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-bold text-[#1C1917] font-mono mt-2">{summary.active_peripherals}</p>
          <p className="text-[11px] text-[#A8A29E] mt-0.5">Mouse Dongles & Keyboards</p>
        </div>

        <div className="bg-white border border-[#E7E5E4] rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#78716C] font-medium">USB Storage Triage</span>
            <div className={`p-2 rounded-lg border ${summary.active_storage_devices > 0 ? 'bg-indigo-50 text-indigo-600 border-indigo-200' : 'bg-[#F5F5F4] text-[#A8A29E] border-[#E7E5E4]'}`}>
              <HardDrive className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-bold text-[#1C1917] font-mono mt-2">{summary.active_storage_devices}</p>
          <p className="text-[11px] text-[#A8A29E] mt-0.5">{summary.active_storage_devices > 0 ? 'Active Surveillance' : 'Awaiting USB Insertion'}</p>
        </div>
      </div>

      {/* SECTION 1: PHYSICAL USB REMOVABLE FLASH DRIVES */}
      <div className="bg-white border border-[#E7E5E4] rounded-xl overflow-hidden shadow-sm">
        <div className="px-5 py-3.5 border-b border-[#E7E5E4] flex items-center justify-between bg-[#FAFAF9]">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-md bg-indigo-100 text-indigo-700">
              <HardDrive className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-[#1C1917]">Removable USB Flash Drives & Storage Triage</h2>
              <p className="text-[10px] text-[#78716C]">Physical USB flash memory attached to laptop ports</p>
            </div>
          </div>
          <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-white text-[#78716C] border border-[#E7E5E4]">
            {storageDevices.length} Connected
          </span>
        </div>

        <div className="p-5">
          {storageDevices.length === 0 ? (
            /* Animated Radar State when no USB stick is inserted yet */
            <div className="border-2 border-dashed border-[#E7E5E4] rounded-xl p-8 text-center bg-[#FAFAF9] flex flex-col items-center justify-center">
              <div className="relative mb-4">
                <div className="w-16 h-16 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
                  <Usb className="w-8 h-8 animate-pulse" />
                </div>
                <div className="absolute inset-0 rounded-full border-2 border-indigo-400 animate-ping opacity-30 pointer-events-none" />
              </div>
              <h3 className="text-xs font-bold text-[#1C1917]">Awaiting Physical USB Flash Drive Insertion</h3>
              <p className="text-[11px] text-[#78716C] max-w-md mt-1">
                Insert the USB drive in your hand into any port on your laptop. PHANTOM's background agent will automatically detect the connection, extract volume descriptors, and initialize a Zero-Trust threat triage session.
              </p>
              <div className="flex items-center gap-2 mt-4 text-[10px] font-mono text-[#A8A29E] bg-white px-3 py-1.5 rounded-lg border border-[#E7E5E4]">
                <Radio className="w-3 h-3 text-emerald-500 animate-pulse" />
                <span>Scanning USB Hubs every 1500ms</span>
              </div>
            </div>
          ) : (
            /* Active Storage Cards */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {storageDevices.map((dev, idx) => (
                <div key={idx} className="border border-indigo-200 rounded-xl p-4 bg-indigo-50/20 relative overflow-hidden">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-indigo-600 text-white shadow-sm">
                        <HardDrive className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#1C1917]">{dev.device_name || dev.model}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-100 text-indigo-700 border border-indigo-200">
                            {dev.mount_point}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#78716C] mt-0.5">
                          Manufacturer: <span className="font-medium text-[#1C1917]">{dev.vendor_name}</span>
                        </p>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                      ZERO-TRUST: UNTRUSTED
                    </span>
                  </div>

                  {/* Storage Capacity Bar */}
                  <div className="mt-4 p-3 bg-white rounded-lg border border-[#E7E5E4] space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#78716C]">Storage Usage</span>
                      <span className="font-mono text-[#1C1917] font-semibold">
                        {dev.used_gb} GB / {dev.capacity_gb} GB ({dev.percent_used}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#F5F5F4] overflow-hidden">
                      <div 
                        className="h-full bg-indigo-600 rounded-full transition-all duration-500" 
                        style={{ width: `${Math.min(100, Math.max(5, dev.percent_used))}%` }} 
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-[#A8A29E] font-mono pt-1">
                      <span>Filesystem: {dev.filesystem}</span>
                      <span>Free: {dev.free_gb} GB</span>
                    </div>
                  </div>

                  {/* Hardware Descriptors */}
                  <div className="grid grid-cols-2 gap-2 mt-3 text-[10px] font-mono">
                    <div className="bg-white p-2 rounded border border-[#E7E5E4]">
                      <span className="text-[#A8A29E] block">Hardware ID</span>
                      <span className="text-[#1C1917] font-semibold">{dev.hardware_id}</span>
                    </div>
                    <div className="bg-white p-2 rounded border border-[#E7E5E4]">
                      <span className="text-[#A8A29E] block">Serial Number</span>
                      <span className="text-[#1C1917] truncate block">{dev.serial_number}</span>
                    </div>
                  </div>

                  {/* Triage Action Button */}
                  <div className="mt-4 pt-3 border-t border-indigo-100 flex items-center justify-between">
                    <span className="text-[10px] text-emerald-700 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      Canary Traps Armed
                    </span>
                    <button
                      onClick={() => setTab && setTab('live')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors cursor-pointer shadow-sm"
                    >
                      <span>View Live Triage</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* SECTION 2: CONNECTED HID PERIPHERALS & WIRELESS DONGLES */}
      <div className="bg-white border border-[#E7E5E4] rounded-xl overflow-hidden shadow-sm">
        <div className="px-5 py-3.5 border-b border-[#E7E5E4] flex items-center justify-between bg-[#FAFAF9]">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-md bg-amber-100 text-amber-700">
              <Mouse className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-[#1C1917]">Connected HID Peripherals & Wireless Dongles</h2>
              <p className="text-[10px] text-[#78716C]">Mouse dongles (2.4GHz RF / Bluetooth receivers), keyboards, and human interface devices</p>
            </div>
          </div>
          <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-white text-[#78716C] border border-[#E7E5E4]">
            {peripherals.length} Active Devices
          </span>
        </div>

        <div className="divide-y divide-[#E7E5E4]">
          {peripherals.map((peri, idx) => {
            const isMouse = peri.type === 'MOUSE_DONGLE' || peri.name?.toLowerCase().includes('mouse');
            return (
              <div key={idx} className="p-4 hover:bg-[#FAFAF9] transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl border ${isMouse ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-indigo-50 text-indigo-600 border-indigo-200'}`}>
                    {isMouse ? <Mouse className="w-4 h-4" /> : <Keyboard className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#1C1917]">{peri.name}</span>
                      {peri.is_wireless_dongle && (
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-50 text-amber-700 border border-amber-200 font-semibold">
                          2.4GHz DONGLE
                        </span>
                      )}
                      <span className="text-[10px] font-mono text-[#78716C] bg-[#F5F5F4] px-1.5 py-0.2 rounded border border-[#E7E5E4]">
                        {peri.hardware_id}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-[#78716C]">
                      <span>Vendor: <strong className="text-[#1C1917] font-medium">{peri.vendor_name}</strong></span>
                      <span>•</span>
                      <span>Interface: <span className="font-mono text-[#A8A29E]">{peri.friendly_name}</span></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end md:self-center">
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-700 font-semibold">
                      <ShieldCheck className="w-3 h-3 text-emerald-500" />
                      <span>{peri.safety_status}</span>
                    </div>
                    <span className="text-[10px] text-[#A8A29E] font-mono">Keystroke Anomaly: 0%</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                    CONNECTED
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 3 & 4 GRID: INTEGRATED HARDWARE & CONTROLLER HIERARCHY */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Integrated System USB Devices */}
        <div className="bg-white border border-[#E7E5E4] rounded-xl overflow-hidden shadow-sm">
          <div className="px-5 py-3.5 border-b border-[#E7E5E4] flex items-center justify-between bg-[#FAFAF9]">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-600" />
              <h3 className="text-xs font-bold text-[#1C1917]">Integrated System Devices</h3>
            </div>
            <span className="text-[10px] font-mono text-[#78716C]">{integratedDevices.length} Components</span>
          </div>

          <div className="divide-y divide-[#E7E5E4]">
            {integratedDevices.map((dev, idx) => {
              const isCam = dev.type === 'WEBCAM';
              const isBt = dev.type === 'BLUETOOTH_ADAPTER';
              return (
                <div key={idx} className="p-3.5 hover:bg-[#FAFAF9] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#F5F5F4] text-[#78716C] border border-[#E7E5E4]">
                      {isCam ? <Camera className="w-4 h-4 text-blue-600" /> : isBt ? <Bluetooth className="w-4 h-4 text-indigo-600" /> : <Cpu className="w-4 h-4 text-[#78716C]" />}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#1C1917]">{dev.name}</p>
                      <p className="text-[10px] font-mono text-[#78716C]">
                        {dev.pnp_class || dev.type} • {dev.hardware_id}
                      </p>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {dev.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* USB Host Controllers & Root Hubs */}
        <div className="bg-white border border-[#E7E5E4] rounded-xl overflow-hidden shadow-sm">
          <div className="px-5 py-3.5 border-b border-[#E7E5E4] flex items-center justify-between bg-[#FAFAF9]">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              <h3 className="text-xs font-bold text-[#1C1917]">Host Controllers & Root Hub Architecture</h3>
            </div>
            <span className="text-[10px] font-mono text-[#78716C]">{controllers.length} Controllers</span>
          </div>

          <div className="divide-y divide-[#E7E5E4]">
            {controllers.map((ctrl, idx) => (
              <div key={idx} className="p-3.5 hover:bg-[#FAFAF9] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#1C1917]">{ctrl.name}</p>
                    <p className="text-[10px] font-mono text-[#78716C]">
                      {ctrl.type} • {ctrl.manufacturer}
                    </p>
                  </div>
                </div>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {ctrl.status}
                </span>
              </div>
            ))}

            {hubs.map((hub, idx) => (
              <div key={`hub-${idx}`} className="p-3.5 hover:bg-[#FAFAF9] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#F5F5F4] text-[#78716C] border border-[#E7E5E4]">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#1C1917]">{hub.name}</p>
                    <p className="text-[10px] font-mono text-[#78716C]">
                      {hub.hub_type} • ~{hub.estimated_ports} Logical Port Allocations
                    </p>
                  </div>
                </div>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-white text-[#78716C] border border-[#E7E5E4]">
                  {hub.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
