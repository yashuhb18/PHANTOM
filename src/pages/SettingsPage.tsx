import React, { useState, useEffect } from 'react';
import { DeviceRecord } from '../types';
import { ToggleSwitch } from '../components/common/ToggleSwitch';
import { Server } from 'lucide-react';
import { fetchDevices } from '../services/api';

export const SettingsPage: React.FC = () => {
  const [devices, setDevices] = useState<DeviceRecord[]>([]);

  // Policy toggle states
  const [autoContainCritical, setAutoContainCritical] = useState<boolean>(true);
  const [ebpfDeepInspection, setEbpfDeepInspection] = useState<boolean>(true);
  const [syntheticDecoyRotation, setSyntheticDecoyRotation] = useState<boolean>(true);
  const [dnsTunnelingHeuristics, setDnsTunnelingHeuristics] = useState<boolean>(true);
  const [zeroTrustMtlsEnforcement, setZeroTrustMtlsEnforcement] = useState<boolean>(false);
  const [forensicMemoryDumpOnTrip, setForensicMemoryDumpOnTrip] = useState<boolean>(true);

  useEffect(() => {
    fetchDevices().then((data) => {
      if (data && Array.isArray(data) && data.length > 0) {
        setDevices(
          data.map((d: any) => ({
            id: d.id,
            hostname: d.name,
            ip: `USB ${d.vid}:${d.pid}`,
            os: `Serial: ${d.serial}`,
            agentVersion: d.trust_status === 'trusted' ? 'Trusted Hardware' : 'Untrusted HID',
            status: d.trust_status === 'trusted' ? 'nominal' : 'investigating',
            lastHeartbeat: d.last_seen || 'Just now',
            riskScore: d.trust_status === 'trusted' ? 12 : 94,
            enrolledPolicies: d.session_count || 1
          }))
        );
      }
    }).catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      {/* Policy & Automation Controls */}
      <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-card p-3 space-y-4">
        <div className="border-b border-border-light dark:border-border-dark pb-3">
          <h2 className="text-section-header text-primary-light dark:text-primary-dark">
            Autonomous Policy Engine
          </h2>
          <p className="text-body text-secondary-light dark:text-secondary-dark mt-0.5">
            Configure automated response thresholds and containment heuristics
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ToggleSwitch
            checked={autoContainCritical}
            onChange={setAutoContainCritical}
            label="Tier-1 Autonomous Host Severance"
            description="Instantly sever socket bindings via eBPF when a honeytoken or canary credential is read."
          />

          <ToggleSwitch
            checked={ebpfDeepInspection}
            onChange={setEbpfDeepInspection}
            label="eBPF Syscall Trace Hooking"
            description="Capture ptrace, mmap, and execve arguments in ring buffers with sub-millisecond overhead."
          />

          <ToggleSwitch
            checked={syntheticDecoyRotation}
            onChange={setSyntheticDecoyRotation}
            label="Dynamic Honeytoken Rotation"
            description="Automatically invalidate and redeploy decoy AWS secrets and SSH keys every 24 hours."
          />

          <ToggleSwitch
            checked={dnsTunnelingHeuristics}
            onChange={setDnsTunnelingHeuristics}
            label="DNS Entropy & Jitter Analysis"
            description="Inspect recursive DNS queries for high Shannon entropy indicative of C2 tunneling."
          />

          <ToggleSwitch
            checked={forensicMemoryDumpOnTrip}
            onChange={setForensicMemoryDumpOnTrip}
            label="Forensic Memory Core Dump"
            description="Dump ephemeral process address space immediately prior to process termination."
          />

          <ToggleSwitch
            checked={zeroTrustMtlsEnforcement}
            onChange={setZeroTrustMtlsEnforcement}
            label="Strict mTLS Mesh Enforcement"
            description="Drop non-mutual TLS ingress connections regardless of application payload."
          />
        </div>
      </div>

      {/* Device History & Fleet Registry */}
      <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-card overflow-hidden">
        <div className="p-3 border-b border-border-light dark:border-border-dark flex items-center justify-between">
          <div>
            <h2 className="text-section-header text-primary-light dark:text-primary-dark">
              Enrolled USB Devices & Endpoints ({devices.length})
            </h2>
            <p className="text-body text-secondary-light dark:text-secondary-dark mt-0.5">
              Physical peripherals and USB controllers observed on host machine
            </p>
          </div>
          <span className="text-meta font-mono text-[11px] px-2 py-0.5 rounded bg-base-light dark:bg-base-dark border border-border-light dark:border-border-dark text-secondary-light dark:text-secondary-dark">
            ALL HARDWARE FINGERPRINTED
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[13px]">
            <thead>
              <tr className="border-b border-border-light dark:border-border-dark bg-base-light/50 dark:bg-base-dark/50 text-meta text-secondary-light dark:text-secondary-dark">
                <th className="py-2.5 px-3">DEVICE NAME</th>
                <th className="py-2.5 px-3">HARDWARE VID:PID</th>
                <th className="py-2.5 px-3">SERIAL NUMBER</th>
                <th className="py-2.5 px-3">CLASSIFICATION</th>
                <th className="py-2.5 px-3">RISK SCORE</th>
                <th className="py-2.5 px-3">LAST SEEN</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light dark:divide-border-dark font-mono">
              {devices.map((device) => (
                <tr
                  key={device.id}
                  className="h-[56px] hover:bg-base-light/40 dark:hover:bg-base-dark/40 transition-colors"
                >
                  <td className="px-3">
                    <div className="flex items-center gap-2">
                      <Server className="w-4 h-4 text-secondary-light dark:text-secondary-dark" />
                      <span className="font-semibold text-primary-light dark:text-primary-dark">
                        {device.hostname}
                      </span>
                    </div>
                  </td>

                  <td className="px-3 text-secondary-light dark:text-secondary-dark">
                    {device.ip}
                  </td>

                  <td className="px-3 text-primary-light dark:text-primary-dark font-sans text-[12px]">
                    {device.os}
                  </td>

                  <td className="px-3 text-secondary-light dark:text-secondary-dark text-[12px]">
                    {device.agentVersion}
                  </td>

                  <td className="px-3">
                    <span
                      className={`font-bold ${
                        device.riskScore > 80
                          ? 'text-threat'
                          : device.riskScore > 50
                          ? 'text-warning'
                          : 'text-safe'
                      }`}
                    >
                      {device.riskScore}
                    </span>
                    <span className="text-secondary-light dark:text-secondary-dark text-[11px]">/100</span>
                  </td>

                  <td className="px-3 text-secondary-light dark:text-secondary-dark text-[12px]">
                    <div className="inline-flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${device.riskScore > 80 ? 'bg-threat' : 'bg-safe'}`} />
                      <span>{device.lastHeartbeat}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
