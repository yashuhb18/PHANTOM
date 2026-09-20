import React, { useState } from 'react';
import { CheckCircle, RotateCcw } from 'lucide-react';

interface Scenario {
  id: string;
  title: string;
  actor: string;
  category: string;
  description: string;
  steps: {
    stage: string;
    command: string;
    detection: string;
    latency: string;
    status: 'detected' | 'intercepted' | 'contained';
  }[];
  mitigation: string;
}

const scenarios: Scenario[] = [
  {
    id: 'cve-2024-21626',
    title: 'CVE-2024-21626 Container Escape',
    actor: 'APT-29 SilverFish Profile',
    category: 'Container Breakout',
    description: 'Adversary leverages runc working directory file descriptor leak to break out of Kubernetes pod boundary.',
    steps: [
      {
        stage: 'Initial Pod Exec',
        command: 'kubectl exec -it pod-ingress-4a -- /bin/sh',
        detection: 'Non-interactive tty allocated with unusual parent PID 412',
        latency: '4ms',
        status: 'detected'
      },
      {
        stage: 'Descriptor Traversal',
        command: 'cd /proc/self/fd/7 && exec /bin/sh',
        detection: 'runc file descriptor leak accessed outside namespace boundary',
        latency: '18ms',
        status: 'detected'
      },
      {
        stage: 'Host Honeytoken Read',
        command: 'cat /opt/decoy/.aws_creds_canary',
        detection: 'Decoy Canary token UUID 8fa19e-4b triggered on host node',
        latency: '42ms',
        status: 'intercepted'
      },
      {
        stage: 'Micro-Containment',
        command: 'bpf_sock_ops_kill(target_pid: 40912)',
        detection: 'Zero-tolerance socket drop rule injected. Process tree sealed.',
        latency: '112ms',
        status: 'contained'
      }
    ],
    mitigation: 'Container host sealed via eBPF. 0 AWS assets compromised. Core memory dump preserved for forensics.'
  },
  {
    id: 'cobalt-strike-ja3',
    title: 'Cobalt Strike Malleable C2 Handshake',
    actor: 'APT-41 (Brass Typhoon)',
    category: 'Command & Control',
    description: 'Adversary establishes encrypted TLS channel using randomized ciphersuites matching known red-team profiles.',
    steps: [
      {
        stage: 'Client Hello Ingress',
        command: 'curl -s https://c2.sync-telemetry-cdn.org/submit.php',
        detection: 'TLS JA3 hash mismatch: 771,4865-4866-4867 (Known Cobalt profile)',
        latency: '8ms',
        status: 'detected'
      },
      {
        stage: 'Beacon Jitter Analysis',
        command: 'GET /pixel.gif?id=a94 HTTP/1.1 (every 450ms +/- 2%)',
        detection: 'Heuristic timing matches synthetic C2 beacon distribution',
        latency: '22ms',
        status: 'detected'
      },
      {
        stage: 'Synthetic Deception Proxy',
        command: 'Reroute to PHANTOM Synthetic C2 Listener (10.0.14.92)',
        detection: 'Attacker payload redirected to blackhole sandbox',
        latency: '64ms',
        status: 'intercepted'
      },
      {
        stage: 'Domain Sinkhole',
        command: 'dns_sinkhole_inject(domain: sync-telemetry-cdn.org)',
        detection: 'Local recursor cache poisoned with loopback address 127.0.0.1',
        latency: '95ms',
        status: 'contained'
      }
    ],
    mitigation: 'Adversary C2 traffic safely sinkholed. Inbound telemetry recorded in MITRE ATT&CK attribution cluster.'
  },
  {
    id: 'honeytoken-aws',
    title: 'Honeytoken AWS Root Key Harvest',
    actor: 'FIN7 Financial Crime Cluster',
    category: 'Credential Dumping',
    description: 'Adversary inspects environment variables and configuration files searching for AWS root access tokens.',
    steps: [
      {
        stage: 'Env Enumeration',
        command: 'grep -rn "AWS_SECRET" /opt/app/.env*',
        detection: 'Broad recursive search on sensitive directory tree',
        latency: '12ms',
        status: 'detected'
      },
      {
        stage: 'Canary Decoy Extraction',
        command: 'export AWS_SECRET_ACCESS_KEY=AKIA_CANARY_8841',
        detection: 'Honeytoken read from /opt/app/.env.development (TRAP-92)',
        latency: '34ms',
        status: 'intercepted'
      },
      {
        stage: 'API Probe Attempt',
        command: 'aws sts get-caller-identity --key AKIA_CANARY_8841',
        detection: 'IAM Gateway synthetic alert dispatched to PHANTOM orchestrator',
        latency: '78ms',
        status: 'intercepted'
      },
      {
        stage: 'Token Invalidation',
        command: 'iam_revoke_synthetic_key(UUID: 8fa19e-4b)',
        detection: 'Credential revoked at AWS IAM edge within 90ms of first trip',
        latency: '105ms',
        status: 'contained'
      }
    ],
    mitigation: 'Adversary IP blacklisted across Cloudflare edge. Decoy credentials rotated automatically.'
  },
  {
    id: 'reflective-dll',
    title: 'Reflective DLL Injection into kworker',
    actor: 'Lazarus Group (HIDDEN COBRA)',
    category: 'Process Masquerading',
    description: 'Adversary masquerades malicious thread under kernel worker name to evade ps aux and sysinfo.',
    steps: [
      {
        stage: 'Process Renaming',
        command: 'prctl(PR_SET_NAME, "kworker/u32:4")',
        detection: 'User-space process disguised with kernel worker nomenclature',
        latency: '6ms',
        status: 'detected'
      },
      {
        stage: 'Ptrace Memory Hook',
        command: 'ptrace(PTRACE_POKETEXT, pid: 1420, addr: 0x7fff5fbff000)',
        detection: 'Unauthorized ptrace invocation detected via eBPF ring buffer',
        latency: '28ms',
        status: 'detected'
      },
      {
        stage: 'Memory RWX Allocation',
        command: 'mprotect(0x7fff5fbff000, 4096, PROT_READ|WRITE|EXEC)',
        detection: 'Executable stack protection violation intercepted in kernel',
        latency: '52ms',
        status: 'intercepted'
      },
      {
        stage: 'Kernel Thread Freeze',
        command: 'sys_kill(1420, SIGSTOP) && dump_proc_maps(1420)',
        detection: 'Thread suspended before code execution. Memory image dumped.',
        latency: '118ms',
        status: 'contained'
      }
    ],
    mitigation: 'Adversary code never reached execution phase. Zero kernel compromise. Full core dump archived.'
  }
];

export const InteractiveSandbox: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<Scenario>(scenarios[0]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(3);

  const handleSelectScenario = (sc: Scenario) => {
    setSelectedScenario(sc);
    setCurrentStepIndex(sc.steps.length - 1);
  };

  return (
    <section id="sandbox" className="py-16 border-b border-border-light dark:border-border-dark bg-base-light dark:bg-base-dark">
      <div className="max-w-page mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="text-meta text-accent font-mono">LIVE INTERACTIVE LAB</div>
          <h2 className="text-[28px] sm:text-[34px] font-bold text-primary-light dark:text-primary-dark tracking-tight">
            Test Autonomous Deception in the Sandbox
          </h2>
          <p className="text-body text-secondary-light dark:text-secondary-dark text-[15px]">
            Choose a realistic breach scenario below to see how PHANTOM intercepts the kill chain at kernel speed.
          </p>
        </div>

        {/* Scenario Selection Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {scenarios.map((sc) => (
            <button
              key={sc.id}
              type="button"
              onClick={() => handleSelectScenario(sc)}
              className={`px-3.5 py-2 rounded-md text-[13px] font-medium border transition-colors ${
                selectedScenario.id === sc.id
                  ? 'border-accent bg-accent-tint dark:bg-accent-darkTint text-accent font-semibold'
                  : 'border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-secondary-light dark:text-secondary-dark hover:bg-base-light dark:hover:bg-base-dark hover:text-primary-light'
              }`}
            >
              {sc.title}
            </button>
          ))}
        </div>

        {/* Interactive Simulation Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 max-w-5xl mx-auto">
          {/* Left Column: Kill Chain Stepper (7 cols) */}
          <div className="lg:col-span-7 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-light rounded-card p-4 flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-border-light dark:border-border-dark">
                <div>
                  <div className="text-meta text-secondary-light dark:text-secondary-dark text-[11px]">
                    TARGET SCENARIO
                  </div>
                  <h3 className="text-[16px] font-bold text-primary-light dark:text-primary-dark mt-0.5">
                    {selectedScenario.title}
                  </h3>
                  <div className="text-[12px] font-mono text-accent mt-0.5">
                    Actor Profile: {selectedScenario.actor}
                  </div>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-base-light dark:bg-base-dark border border-border-light dark:border-border-dark text-secondary-light dark:text-secondary-dark">
                  {selectedScenario.category}
                </span>
              </div>

              {/* Step Sequence */}
              <div className="mt-4 space-y-3">
                {selectedScenario.steps.map((step, idx) => {
                  const isReached = idx <= currentStepIndex;
                  const isCurrent = idx === currentStepIndex;

                  return (
                    <div
                      key={idx}
                      onClick={() => setCurrentStepIndex(idx)}
                      className={`p-3 rounded border transition-all cursor-pointer ${
                        isCurrent
                          ? 'border-accent bg-accent-tint/30 dark:bg-accent-darkTint/30 shadow-sm'
                          : isReached
                          ? 'border-border-light dark:border-border-dark bg-base-light/30 dark:bg-base-dark/30'
                          : 'border-transparent opacity-40'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2.5">
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold mt-0.5 shrink-0 ${
                              step.status === 'contained'
                                ? 'bg-safe text-white'
                                : step.status === 'intercepted'
                                ? 'bg-threat text-white'
                                : 'bg-warning text-white'
                            }`}
                          >
                            {idx + 1}
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[12px] font-semibold text-primary-light dark:text-primary-dark">
                                {step.stage}
                              </span>
                              <span className="font-mono text-[10px] text-secondary-light dark:text-secondary-dark">
                                (+{step.latency})
                              </span>
                            </div>
                            <div className="font-mono text-[11px] text-secondary-light dark:text-secondary-dark bg-base-light dark:bg-base-dark p-1 rounded border border-border-light dark:border-border-dark mt-1 truncate max-w-[380px]">
                              $ {step.command}
                            </div>
                            <div className="text-[12px] text-primary-light dark:text-primary-dark mt-1 font-sans">
                              {step.detection}
                            </div>
                          </div>
                        </div>

                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.5 rounded uppercase font-semibold shrink-0 ${
                            step.status === 'contained'
                              ? 'text-safe bg-safe/10'
                              : step.status === 'intercepted'
                              ? 'text-threat bg-threat/10'
                              : 'text-warning bg-warning/10'
                          }`}
                        >
                          {step.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Stepper controls */}
            <div className="pt-4 border-t border-border-light dark:border-border-dark flex items-center justify-between mt-4">
              <span className="text-[12px] font-mono text-secondary-light dark:text-secondary-dark">
                STEP {currentStepIndex + 1} OF {selectedScenario.steps.length}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setCurrentStepIndex(0)}
                  className="p-1.5 rounded border border-border-light dark:border-border-dark text-secondary-light hover:text-primary-light hover:bg-base-light dark:hover:bg-base-dark"
                  title="Reset to step 1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStepIndex(Math.max(0, currentStepIndex - 1))}
                  disabled={currentStepIndex <= 0}
                  className="px-2.5 py-1 rounded border border-border-light dark:border-border-dark text-[12px] disabled:opacity-30 hover:bg-base-light dark:hover:bg-base-dark"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStepIndex(Math.min(selectedScenario.steps.length - 1, currentStepIndex + 1))}
                  disabled={currentStepIndex >= selectedScenario.steps.length - 1}
                  className="px-3 py-1 bg-accent text-white rounded text-[12px] font-medium disabled:opacity-30 hover:bg-accent-hover"
                >
                  Next Step
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Deception Outcome & Mitigation Brief (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Mitigation Card */}
            <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-card p-4 space-y-3">
              <div className="flex items-center gap-2 text-safe">
                <CheckCircle className="w-5 h-5" />
                <h4 className="text-[15px] font-bold text-primary-light dark:text-primary-dark">
                  Autonomous Containment Verified
                </h4>
              </div>

              <p className="text-[13px] text-secondary-light dark:text-secondary-dark leading-relaxed">
                {selectedScenario.mitigation}
              </p>

              <div className="p-3 rounded bg-base-light dark:bg-base-dark border border-border-light dark:border-border-dark space-y-2 text-[12px] font-mono">
                <div className="flex justify-between">
                  <span className="text-secondary-light dark:text-secondary-dark">Total Response Latency:</span>
                  <span className="font-bold text-safe">112ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-light dark:text-secondary-dark">Real Customer Assets Exposed:</span>
                  <span className="font-bold text-safe">0% (Synthetic)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-light dark:text-secondary-dark">Human Intervention Required:</span>
                  <span className="font-bold text-primary-light dark:text-primary-dark">Zero Latency</span>
                </div>
              </div>
            </div>

            {/* Why This Beats Traditional EDR */}
            <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-card p-4 space-y-2">
              <div className="text-meta text-secondary-light dark:text-secondary-dark text-[11px]">
                THE DECEPTION ADVANTAGE
              </div>
              <h4 className="text-[14px] font-semibold text-primary-light dark:text-primary-dark">
                Deterministic Signal, Zero Heuristic Noise
              </h4>
              <p className="text-[13px] text-secondary-light dark:text-secondary-dark leading-normal">
                Because legitimate users and services never touch canary tokens or honey files, any tripwire trigger represents a 100% true-positive breach attempt. Containment can be fully automated without fear of false-positive production outages.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
