import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  Terminal, 
  ArrowRight, 
  Activity, 
  Dna, 
  Flame, 
  Lock, 
  Zap, 
  CheckCircle2, 
  ChevronRight,
  ShieldAlert,
  Cpu,
  Layers,
  GitCommit,
  Radio,
  Clock,
  Sparkles,
  FileText,
  AlertTriangle,
  Download
} from 'lucide-react';

// Smooth Scroll-Reveal Wrapper using IntersectionObserver
function Reveal({ children, delay = 0, className = "" }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.12 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function LandingPage({ onLaunchConsole }) {
  const [terminalStep, setTerminalStep] = useState(0);
  const [activeTab, setActiveTab] = useState(0);

  const terminalLogs = [
    { text: "HARDWARE_ATTACH: VID:03EB PID:2042 (RubberDucky v2.1)", color: "text-[#78716C]" },
    { text: "ANOMALY: Keystroke injection rate: 890 chars/sec (Superhuman)", color: "text-amber-600" },
    { text: "PROCESS_EXEC: powershell.exe -NoP -W Hidden -Enc SQBFAFgA...", color: "text-indigo-600" },
    { text: "CANARY_TRIP: Decoy '.aws_creds_canary' accessed by PID:4120", color: "text-red-600" },
    { text: "AUTONOMOUS_ACTION: Sockets severed. Host micro-isolated (420ms).", color: "text-emerald-600" },
    { text: "ATTACK_DNA: Extracted signature #824a-ducky -> Jaccard cataloged.", color: "text-indigo-700" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTerminalStep(prev => (prev < terminalLogs.length ? prev + 1 : 1));
    }, 1800);
    return () => clearInterval(timer);
  }, [terminalLogs.length]);

  const lifecycleSteps = [
    {
      step: "01",
      title: "Physical Ingress & Descriptor Intercept",
      time: "T+00:00",
      icon: Cpu,
      desc: "Attacker plugs in malicious USB peripheral. Kernel WMI listener intercepts hardware descriptor before the OS finishes mounting the driver.",
      tag: "WMI / PNP HOOK"
    },
    {
      step: "02",
      title: "HID Keystroke Anomaly Burst",
      time: "T+00:42",
      icon: Zap,
      desc: "Device mimics a keyboard typing at 890 characters/second. PHANTOM flags synthetic input burst exceeding human biomechanical thresholds.",
      tag: "HEURISTIC ENGINE"
    },
    {
      step: "03",
      title: "Canary Honeypot Violation",
      time: "T+01:15",
      icon: Flame,
      desc: "Injected PowerShell payload navigates filesystem and touches bait credentials (.aws_creds_canary). Filesystem watchdog fires instant zero-false-positive alert.",
      tag: "DECEPTION GRID"
    },
    {
      step: "04",
      title: "Autonomous Surgical Neutralization",
      time: "T+01:28",
      icon: Lock,
      desc: "Autonomous Response Engine severs outbound network sockets, terminates process trees, and locks hardware descriptor in under 420ms.",
      tag: "< 420ms RESPONSE"
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-[#1C1917] font-sans antialiased selection:bg-indigo-100 selection:text-indigo-900">
      {/* 1. Header / Navbar */}
      <header className="sticky top-0 z-50 bg-[#FAFAF9]/90 backdrop-blur-md border-b border-[#E7E5E4] px-6 lg:px-12 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src="/logo.png" 
            alt="PHANTOM" 
            className="w-8 h-8 rounded-lg object-contain bg-black p-0.5 shadow-xs" 
          />
          <span className="font-bold text-base tracking-tight text-[#1C1917]">PHANTOM</span>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[11px] font-mono bg-[#F5F5F4] text-[#78716C] border border-[#E7E5E4]">
            AUTONOMOUS DEFENSE
          </span>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="http://localhost:8001/api/download/app"
            download
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E7E5E4] hover:bg-[#F5F5F4] text-xs font-semibold text-[#1C1917] transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">Download App (.exe)</span>
            <span className="sm:hidden">.exe</span>
          </a>
          <button
            onClick={onLaunchConsole}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <span>Launch Console</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="px-6 lg:px-12 pt-16 pb-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Value Proposition */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#E7E5E4] bg-white text-xs font-medium text-[#78716C] shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Autonomous USB Threat Hunting & Deception</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#1C1917] leading-[1.15]">
              USB attacks don’t wait for analysts. <br />
              <span className="text-indigo-600">Neither does PHANTOM.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#78716C] leading-relaxed max-w-2xl">
              Traditional EDR misses rapid keystroke injection and physical BadUSB payloads. 
              PHANTOM deploys filesystem deception traps, extracts behavioral <strong>Attack DNA</strong> across hardware swaps, 
              and autonomously severs threats in <strong>under 420ms</strong>.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onLaunchConsole}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm transition-all"
              >
                <span>Enter Live Platform</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              <a
                href="http://localhost:8001/api/download/app"
                download
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[#E7E5E4] bg-white hover:bg-[#F5F5F4] text-sm font-semibold text-[#1C1917] shadow-xs transition-all"
              >
                <Download className="w-4 h-4 text-indigo-600" />
                <span>Download App (.exe)</span>
              </a>
            </div>

            {/* Micro proof badges */}
            <div className="pt-4 flex flex-wrap gap-6 text-xs text-[#78716C] border-t border-[#E7E5E4]">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Zero-False-Positive Honeypots</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Jaccard Attack DNA Correlation</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Time-Travel Attack Replay</span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Terminal Simulation */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-[#E7E5E4] rounded-2xl shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-[#E7E5E4] bg-[#FAFAF9] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span className="ml-2 text-xs font-mono font-medium text-[#78716C]">phantom-agent.log</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
                  LIVE INTERCEPT
                </span>
              </div>

              <div className="p-4 font-mono text-xs space-y-2.5 min-h-[260px] bg-[#FFFFFF]">
                {terminalLogs.slice(0, terminalStep).map((log, i) => (
                  <div key={i} className={`flex items-start gap-2 ${log.color} leading-relaxed animate-fade-in`}>
                    <span className="text-[#A8A29E] select-none text-[10px] pt-0.5">[{`00:${i * 2 + 10}`}]</span>
                    <span className="break-all">{log.text}</span>
                  </div>
                ))}
                {terminalStep < terminalLogs.length && (
                  <div className="flex items-center gap-1 text-[#A8A29E] text-[11px]">
                    <span className="inline-block w-1.5 h-3 bg-indigo-600 animate-pulse" />
                    <span>intercepting kernel events...</span>
                  </div>
                )}
              </div>

              <div className="px-4 py-2.5 bg-[#FAFAF9] border-t border-[#E7E5E4] flex items-center justify-between text-[11px] font-mono text-[#78716C]">
                <span>Kernel Hook: ACTIVE</span>
                <span>Containment: ARMED</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Section: The Blind Spot (Why Traditional EDR Fails) */}
      <section className="px-6 lg:px-12 py-20 bg-white border-y border-[#E7E5E4]">
        <div className="max-w-7xl mx-auto space-y-12">
          <Reveal>
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-mono font-bold text-indigo-600 tracking-wider uppercase">
                THE PHYSICAL ATTACK VECTOR
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1C1917]">
                Why enterprise EDR fails at the USB boundary
              </h2>
              <p className="text-sm sm:text-base text-[#78716C] leading-relaxed">
                Legacy endpoint tools are blind to hardware-level deception. BadUSB devices bypass driver firewalls by emulating standard keyboards.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Reveal delay={100}>
              <div className="p-8 rounded-2xl border border-red-200 bg-red-50/30 space-y-4 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-red-700 uppercase tracking-wide">
                    TRADITIONAL EDR / ANTIVIRUS
                  </span>
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-[#1C1917]">Implicit Trust in HID Peripherals</h3>
                <ul className="space-y-3 text-xs text-[#44403C] leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold shrink-0">✕</span>
                    <span><strong>Treats keystrokes as human:</strong> Any device advertising as a keyboard is trusted by Windows, allowing 900 chars/sec script injection.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold shrink-0">✕</span>
                    <span><strong>Static blocklists fail:</strong> Attackers alter VID/PID in seconds or clone legitimate Dell/Logitech hardware IDs.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold shrink-0">✕</span>
                    <span><strong>30–60 minute MTTR:</strong> Alerts are queued to a human SOC analyst while data exfiltration completes in 4 seconds.</span>
                  </li>
                </ul>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div className="p-8 rounded-2xl border border-indigo-200 bg-indigo-50/30 space-y-4 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-indigo-700 uppercase tracking-wide">
                    PHANTOM DEFENSE PLATFORM
                  </span>
                  <ShieldCheck className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-[#1C1917]">Autonomous Heuristics & Deception</h3>
                <ul className="space-y-3 text-xs text-[#1E1B4B] leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-600 font-bold shrink-0">✓</span>
                    <span><strong>Biomechanical verification:</strong> Flags inhuman typing velocity (&gt;120 cps) and hidden PowerShell stagers instantly.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-600 font-bold shrink-0">✓</span>
                    <span><strong>Canary Deception Grid:</strong> Zero-false-positive lure files catch attackers before data reaches primary storage.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-600 font-bold shrink-0">✓</span>
                    <span><strong>Sub-420ms Surgical Isolation:</strong> Severs network sockets and terminates process trees autonomously without waiting for human triage.</span>
                  </li>
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 4. Section: The 5 Core Engines (Architecture Deep-Dive) */}
      <section className="px-6 lg:px-12 py-20 max-w-7xl mx-auto space-y-12">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-mono font-bold text-indigo-600 tracking-wider uppercase">
              TECHNICAL ARCHITECTURE
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1C1917]">
              Five specialized engines in one autonomous pipeline
            </h2>
            <p className="text-sm text-[#78716C]">
              Engineered with clean separation of concerns, swappable agent schemas, and low-latency correlation.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Reveal delay={100}>
            <div className="p-6 rounded-2xl bg-white border border-[#E7E5E4] hover:border-indigo-300 transition-all space-y-3 h-full">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                <Flame className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#1C1917]">1. Canary Deception Grid</h3>
              <p className="text-xs text-[#78716C] leading-relaxed">
                Deploys physical decoy tokens (<code className="font-mono text-amber-800">.aws_creds_canary</code>, <code className="font-mono text-amber-800">passwords_2026.xlsx</code>) monitored by OS kernel <code className="font-mono">watchdog</code>. Zero false positives.
              </p>
              <div className="pt-2 text-[10px] font-mono text-amber-700 font-semibold">
                KERNEL WATCHDOG • 0% FALSE POSITIVE
              </div>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <div className="p-6 rounded-2xl bg-white border border-[#E7E5E4] hover:border-indigo-300 transition-all space-y-3 h-full">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700">
                <Dna className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#1C1917]">2. Attack DNA Fingerprinting</h3>
              <p className="text-xs text-[#78716C] leading-relaxed">
                Extracts behavioral execution tokens and computes real <strong>Jaccard graph similarity</strong>. Recognizes threat actors across physical USB hardware swaps in milliseconds.
              </p>
              <div className="pt-2 text-[10px] font-mono text-indigo-700 font-semibold">
                JACCARD SIMILARITY • CROSS-DEVICE MATCH
              </div>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div className="p-6 rounded-2xl bg-white border border-[#E7E5E4] hover:border-indigo-300 transition-all space-y-3 h-full">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                <GitCommit className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#1C1917]">3. Causal Attack Graph</h3>
              <p className="text-xs text-[#78716C] leading-relaxed">
                Constructs a directed acyclic graph (DAG) via <strong>NetworkX</strong> linking USB insertion $\rightarrow$ Keystroke $\rightarrow$ PowerShell $\rightarrow$ Canary Trip with visual SVG coordinates.
              </p>
              <div className="pt-2 text-[10px] font-mono text-emerald-700 font-semibold">
                NETWORKX DAG • TEMPORAL LINKING
              </div>
            </div>
          </Reveal>

          <Reveal delay={250}>
            <div className="p-6 rounded-2xl bg-white border border-[#E7E5E4] hover:border-indigo-300 transition-all space-y-3 h-full">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#1C1917]">4. Time-Travel Replay Engine</h3>
              <p className="text-xs text-[#78716C] leading-relaxed">
                Stores state snapshots for audio-style video scrubbing. Analysts can drag the scrubber back and forth to inspect exact incident frames and risk escalation.
              </p>
              <div className="pt-2 text-[10px] font-mono text-blue-700 font-semibold">
                AUDIO-STYLE SCRUBBER • FRAME SNAPSHOTS
              </div>
            </div>
          </Reveal>

          <Reveal delay={300}>
            <div className="p-6 rounded-2xl bg-white border border-[#E7E5E4] hover:border-indigo-300 transition-all space-y-3 h-full">
              <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#1C1917]">5. AI Threat Narrator & Reports</h3>
              <p className="text-xs text-[#78716C] leading-relaxed">
                Streams real-time natural language commentary over WebSockets (<code className="font-mono">/ws/narrator</code>) and compiles executive forensic reports with MITRE ATT&CK mappings.
              </p>
              <div className="pt-2 text-[10px] font-mono text-purple-700 font-semibold">
                WEBSOCKETS • MITRE ATT&CK MAPPING
              </div>
            </div>
          </Reveal>

          <Reveal delay={350}>
            <div className="p-6 rounded-2xl bg-white border border-[#E7E5E4] hover:border-indigo-300 transition-all space-y-3 h-full">
              <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-700">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#1C1917]">Autonomous Containment</h3>
              <p className="text-xs text-[#78716C] leading-relaxed">
                Executes surgical socket severance and host micro-isolation in &lt;420ms without cutting telemetry. Permanently blacklists malicious peripheral descriptors.
              </p>
              <div className="pt-2 text-[10px] font-mono text-red-700 font-semibold">
                &lt; 420ms MTTC • SOCKET SEVERANCE
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 5. Section: Live Attack Lifecycle Walkthrough */}
      <section className="px-6 lg:px-12 py-20 bg-white border-y border-[#E7E5E4]">
        <div className="max-w-7xl mx-auto space-y-12">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-mono font-bold text-indigo-600 tracking-wider uppercase">
                ATTACK LIFECYCLE
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1C1917]">
                From physical insertion to autonomous isolation
              </h2>
              <p className="text-sm text-[#78716C]">
                Watch how PHANTOM intercepts, correlates, and kills the attack sequence in sub-second time.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {lifecycleSteps.map((s, idx) => {
              const Icon = s.icon;
              return (
                <Reveal key={idx} delay={idx * 100}>
                  <div className="p-6 rounded-2xl border border-[#E7E5E4] bg-[#FAFAF9] hover:bg-white hover:border-indigo-300 transition-all space-y-3 h-full flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-mono font-bold text-indigo-600">{s.time}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white border border-[#E7E5E4] text-[#78716C] font-semibold">
                          STEP {s.step}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white border border-[#E7E5E4] w-fit text-[#1C1917] mb-3">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h4 className="text-sm font-bold text-[#1C1917] mb-2">{s.title}</h4>
                      <p className="text-xs text-[#78716C] leading-relaxed">{s.desc}</p>
                    </div>
                    <div className="pt-4 border-t border-[#E7E5E4]">
                      <span className="text-[10px] font-mono text-indigo-700 font-semibold">{s.tag}</span>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Section: Attack DNA Cross-Device Match Proof Card */}
      <section className="px-6 lg:px-12 py-20 max-w-7xl mx-auto space-y-12">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-mono font-bold text-indigo-600 tracking-wider uppercase">
              THE KILLER DIFFERENTIATOR
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1C1917]">
              Attack DNA: Beating hardware spoofing with behavioral Jaccard graph similarity
            </h2>
            <p className="text-sm text-[#78716C]">
              Attackers change physical USBs to bypass serial filters. PHANTOM matches their behavioral DNA regardless of VID/PID.
            </p>
          </div>
        </Reveal>

        <Reveal delay={150}>
          <div className="p-8 rounded-2xl bg-white border border-[#E7E5E4] shadow-xs">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Device Comparison */}
              <div className="lg:col-span-8 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-[#FAFAF9] border border-[#E7E5E4]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-[#1C1917]">USB Device #1 (RubberDucky)</span>
                      <span className="text-[10px] font-mono bg-white px-1.5 py-0.2 rounded border border-[#E7E5E4]">VID: 03EB</span>
                    </div>
                    <p className="text-[11px] text-[#78716C] leading-relaxed">
                      Initial attack payload delivering hidden PowerShell stager and credential discovery.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#FAFAF9] border border-[#E7E5E4]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-[#1C1917]">USB Device #2 (BashBunny)</span>
                      <span className="text-[10px] font-mono bg-white px-1.5 py-0.2 rounded border border-[#E7E5E4]">VID: 1FC9</span>
                    </div>
                    <p className="text-[11px] text-[#78716C] leading-relaxed">
                      Different physical peripheral, same toolset and behavioral sequence.
                    </p>
                  </div>
                </div>

                {/* Shared Tokens */}
                <div>
                  <span className="text-[11px] font-semibold text-emerald-800 block mb-2">
                    Identified Common Behavioral Subgraphs (Jaccard Match):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {["VECTOR:HID_KEYSTROKE_INJECTION", "EXEC:POWERSHELL_PAYLOAD", "DECEPTION:CANARY_FILE_TOUCHED", "TARGET:CLOUD_CREDENTIALS", "EVASION:HIDDEN_WINDOW"].map((t, idx) => (
                      <span key={idx} className="px-2 py-1 rounded text-[10px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Donut Match Indicator */}
              <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 border-t lg:border-t-0 lg:border-l border-[#E7E5E4]">
                <div className="relative w-36 h-36 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-[#E7E5E4]"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-indigo-600"
                      strokeDasharray="82.4, 100"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="text-2xl font-bold font-mono text-indigo-600">82.4%</span>
                    <span className="text-[9px] font-mono text-[#78716C] uppercase font-bold">DNA MATCH</span>
                  </div>
                </div>
                <span className="mt-3 text-xs font-semibold text-indigo-900 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-full">
                  HIGH CONFIDENCE ATTRIBUTION
                </span>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* 7. Section: Platform Benchmarks */}
      <section className="px-6 lg:px-12 py-16 bg-white border-y border-[#E7E5E4]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <Reveal delay={100}>
              <div className="p-6 rounded-xl bg-[#FAFAF9] border border-[#E7E5E4]">
                <div className="text-3xl font-extrabold font-mono text-indigo-600">&lt; 420ms</div>
                <div className="text-xs text-[#78716C] mt-1 font-medium">Autonomous Response</div>
              </div>
            </Reveal>
            <Reveal delay={200}>
              <div className="p-6 rounded-xl bg-[#FAFAF9] border border-[#E7E5E4]">
                <div className="text-3xl font-extrabold font-mono text-[#1C1917]">0.00%</div>
                <div className="text-xs text-[#78716C] mt-1 font-medium">Canary False Positives</div>
              </div>
            </Reveal>
            <Reveal delay={300}>
              <div className="p-6 rounded-xl bg-[#FAFAF9] border border-[#E7E5E4]">
                <div className="text-3xl font-extrabold font-mono text-emerald-600">82.4%</div>
                <div className="text-xs text-[#78716C] mt-1 font-medium">Cross-Device DNA Match</div>
              </div>
            </Reveal>
            <Reveal delay={400}>
              <div className="p-6 rounded-xl bg-[#FAFAF9] border border-[#E7E5E4]">
                <div className="text-3xl font-extrabold font-mono text-[#1C1917]">100%</div>
                <div className="text-xs text-[#78716C] mt-1 font-medium">Autonomous Containment</div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 8. Call to Action Banner */}
      <section className="px-6 lg:px-12 py-20 max-w-7xl mx-auto">
        <Reveal>
          <div className="p-10 rounded-3xl bg-indigo-600 text-white text-center space-y-6 shadow-sm relative overflow-hidden">
            <div className="max-w-2xl mx-auto space-y-3">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Ready to hunt threats before the OS even mounts the driver?
              </h2>
              <p className="text-sm sm:text-base text-indigo-100 leading-relaxed">
                Step inside the live security console. Trigger multi-stage attacks, watch the AI narrator stream in real-time, and scrub through the causal graph.
              </p>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-4">
              <button
                onClick={onLaunchConsole}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-indigo-700 text-sm font-bold shadow-md hover:bg-indigo-50 transition-all"
              >
                <span>Launch PHANTOM Console</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href="http://localhost:8001/api/download/app"
                download
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white text-sm font-bold border border-indigo-500 shadow-md transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download Desktop Agent (.exe)</span>
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      {/* 9. Footer */}
      <footer className="px-6 lg:px-12 py-8 border-t border-[#E7E5E4] text-center text-xs text-[#78716C]">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="font-bold text-[#1C1917]">PHANTOM</span>
          <span>•</span>
          <span>Autonomous USB Threat Hunting & Deception Platform</span>
        </div>
        <p className="text-[11px] text-[#A8A29E]">Designed for National Cyber Hackathon Finals. Precision Security System.</p>
      </footer>
    </div>
  );
}
