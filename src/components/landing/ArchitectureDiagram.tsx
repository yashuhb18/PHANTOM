import React, { useState } from 'react';
import { Cpu, Shield, Zap, Network } from 'lucide-react';

interface LayerInfo {
  id: number;
  name: string;
  subtitle: string;
  tag: string;
  icon: React.ElementType;
  description: string;
  specs: Record<string, string>;
  codeSnippet: string;
}

const architectureLayers: LayerInfo[] = [
  {
    id: 1,
    name: 'Edge & Ingress Telemetry',
    subtitle: 'TLS JA3/JA4 Fingerprint Inspector',
    tag: 'EDGE / L7',
    icon: Network,
    description: 'Inspects raw TLS handshake signatures, cipher suite sequences, and ALPN extensions at cluster ingress boundaries before application termination.',
    specs: {
      'Handshake Overhead': '< 0.08ms per connection',
      'Supported Protocols': 'TLS 1.3, TLS 1.2, HTTP/2, HTTP/3 (QUIC)',
      'Fingerprint Engine': 'JA3, JA3S, JA4, JA4S, and custom Beacon Jitter correlators',
      'Throughput': 'Up to 2.4 Million req/sec per cluster gateway'
    },
    codeSnippet: `// eBPF Ingress Probe (XDP / TC)
SEC("xdp")
int inspect_tls_ja3(struct xdp_md *ctx) {
    void *data = (void *)(long)ctx->data;
    void *data_end = (void *)(long)ctx->data_end;
    // Extract TLS Client Hello cipher suites
    return phantom_correlate_ja3(data, data_end);
}`
  },
  {
    id: 2,
    name: 'Kernel eBPF Telemetry Fabric',
    subtitle: 'Zero-Copy Ring Buffer Syscall Hooks',
    tag: 'KERNEL / RING 0',
    icon: Cpu,
    description: 'Hooks directly into the Linux kernel via eBPF kprobes and tracepoints without requiring out-of-tree kernel modules or patching system binaries.',
    specs: {
      'CPU Overhead': '< 1.2% under full production saturation',
      'Memory Overhead': '64MB fixed ring buffer per CPU core',
      'Hooked Syscalls': 'sys_execve, sys_ptrace, sys_mmap, sys_prctl, sys_connect',
      'Kernel Support': 'Linux Kernel 5.4+ (Vanilla, RHEL, Ubuntu, Amazon Linux 2023)'
    },
    codeSnippet: `SEC("tracepoint/syscalls/sys_enter_ptrace")
int trace_ptrace_inject(struct trace_event_raw_sys_enter *ctx) {
    u64 pid_tgid = bpf_get_current_pid_tgid();
    // Detect masqueraded process injection in kernel space
    bpf_ringbuf_output(&events, &event_payload, sizeof(event_payload), 0);
    return 0;
}`
  },
  {
    id: 3,
    name: 'Autonomous Deception Fabric',
    subtitle: 'Synthetic Decoys & Honeytoken Mesh',
    tag: 'DECEPTION MESH',
    icon: Shield,
    description: 'Weaves dynamic, high-fidelity synthetic credentials, canary files, decoy ports, and fake Active Directory service accounts into workload namespaces.',
    specs: {
      'Tripwire Fidelity': '100% True-Positive Deterministic Signal',
      'Decoy Types': 'AWS IAM keys, SSH private keys, K8s ServiceAccount tokens, MySQL ports',
      'Rotation Frequency': 'Configurable: 1h to 24h automated rotation',
      'Blast Radius': 'Zero (decoys are synthetic; no real privileges granted)'
    },
    codeSnippet: `// Canary File Access Listener (eBPF openat hook)
SEC("kprobe/do_sys_openat2")
int BPF_KPROBE(trace_canary_open, int dfd, const char *filename) {
    if (is_honeytoken_path(filename)) {
        bpf_send_signal(SIGSTOP); // Immediate pre-containment
        notify_orchestrator(TRIPWIRE_TRIGGERED);
    }
    return 0;
}`
  },
  {
    id: 4,
    name: 'Autonomous Neural Triage Engine',
    subtitle: 'Sub-120ms Micro-Containment Orchestrator',
    tag: 'NEURAL / TIER-1',
    icon: Zap,
    description: 'Correlates multi-source telemetry, matches behavioral fingerprints against known APT clusters, and executes micro-isolation rules with zero human latency.',
    specs: {
      'Containment Latency': '112ms (average end-to-end)',
      'Containment Mechanisms': 'eBPF socket severance, cgroup freeze, IAM token revocation',
      'Attribution Models': 'MITRE ATT&CK Enterprise v14 + Custom Neural Classifier',
      'Forensics Artifacts': 'Automated process core dump, socket pcap, and memory maps'
    },
    codeSnippet: `// Autonomous Micro-Containment Dispatch
async function executeAutonomousContainment(event: CanaryEvent) {
    await ebpfAgent.severSocketBindings(event.targetPid);
    await iamGateway.revokeSyntheticKey(event.tokenUuid);
    await k8sController.drainAndQuarantine(event.hostNode);
    return { status: "CONTAINED", latencyMs: 112 };
}`
  }
];

export const ArchitectureDiagram: React.FC = () => {
  const [activeLayer, setActiveLayer] = useState<LayerInfo>(architectureLayers[1]); // Default to eBPF

  return (
    <section id="architecture" className="py-16 border-b border-border-light dark:border-border-dark bg-base-light dark:bg-base-dark">
      <div className="max-w-page mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="text-meta text-accent font-mono">INTERNAL MECHANICS</div>
          <h2 className="text-[28px] sm:text-[34px] font-bold text-primary-light dark:text-primary-dark tracking-tight">
            The 4-Layer Kernel Architecture
          </h2>
          <p className="text-body text-secondary-light dark:text-secondary-dark text-[15px]">
            Engineered from the ground up for sub-millisecond telemetry capture with zero kernel destabilization.
          </p>
        </div>

        {/* 4 Layers Visual Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 max-w-5xl mx-auto">
          {/* Left Column: The 4 Layer Cards (5 cols) */}
          <div className="lg:col-span-5 space-y-2.5">
            {architectureLayers.map((layer) => {
              const Icon = layer.icon;
              const isSelected = activeLayer.id === layer.id;

              return (
                <div
                  key={layer.id}
                  onClick={() => setActiveLayer(layer)}
                  className={`p-3.5 rounded-card border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-accent bg-surface-light dark:bg-surface-dark shadow-sm ring-1 ring-accent'
                      : 'border-border-light dark:border-border-dark bg-surface-light/60 dark:bg-surface-dark/60 hover:bg-surface-light dark:hover:bg-surface-dark'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                          isSelected
                            ? 'bg-accent text-white'
                            : 'bg-base-light dark:bg-base-dark text-secondary-light border border-border-light dark:border-border-dark'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[14px] font-bold text-primary-light dark:text-primary-dark">
                          {layer.name}
                        </div>
                        <div className="text-[11px] font-mono text-secondary-light dark:text-secondary-dark">
                          {layer.subtitle}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-base-light dark:bg-base-dark border border-border-light dark:border-border-dark text-secondary-light dark:text-secondary-dark">
                      {layer.tag}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Detailed Layer Specifications & Code (7 cols) */}
          <div className="lg:col-span-7 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-card p-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border-light dark:border-border-dark">
                <div>
                  <span className="text-meta text-accent font-mono text-[11px]">
                    LAYER 0{activeLayer.id} SPECIFICATIONS
                  </span>
                  <h3 className="text-[18px] font-bold text-primary-light dark:text-primary-dark mt-0.5">
                    {activeLayer.name}
                  </h3>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-accent-tint dark:bg-accent-darkTint text-accent font-semibold">
                  {activeLayer.tag}
                </span>
              </div>

              <p className="text-[13px] text-secondary-light dark:text-secondary-dark leading-relaxed">
                {activeLayer.description}
              </p>

              {/* Technical Specs Grid */}
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(activeLayer.specs).map(([key, val]) => (
                  <div
                    key={key}
                    className="p-2.5 rounded bg-base-light dark:bg-base-dark border border-border-light dark:border-border-dark"
                  >
                    <div className="text-meta text-secondary-light dark:text-secondary-dark text-[10px]">
                      {key.toUpperCase()}
                    </div>
                    <div className="text-[12px] font-mono font-medium text-primary-light dark:text-primary-dark mt-0.5">
                      {val}
                    </div>
                  </div>
                ))}
              </div>

              {/* Code Snippet */}
              <div className="space-y-1">
                <div className="text-meta text-secondary-light dark:text-secondary-dark text-[10px]">
                  KERNEL HOOK IMPLEMENTATION
                </div>
                <pre className="p-3 rounded bg-base-light dark:bg-base-dark border border-border-light dark:border-border-dark font-mono text-[11px] leading-relaxed text-primary-light dark:text-primary-dark overflow-x-auto">
                  {activeLayer.codeSnippet}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
