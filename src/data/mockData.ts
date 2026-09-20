import {
  StatMetric,
  SecurityEvent,
  AINarration,
  TimelineStep,
  GraphNode,
  GraphEdge,
  ThreatFingerprint,
  CanaryTrap,
  SecurityAlert,
  IncidentReport,
  DeviceRecord
} from '../types';

export const mockStatCards: StatMetric[] = [
  {
    id: 'active-sessions',
    label: 'ACTIVE SESSIONS',
    value: '1,284',
    change: '+14% vs last hour',
    trend: 'up',
    icon: 'Radio'
  },
  {
    id: 'threats-contained',
    label: 'THREATS CONTAINED',
    value: '42',
    change: '100% automated response',
    trend: 'neutral',
    icon: 'ShieldCheck',
    status: 'safe'
  },
  {
    id: 'fingerprint-matches',
    label: 'FINGERPRINT MATCHES',
    value: '18',
    change: '4 actor clusters identified',
    trend: 'neutral',
    icon: 'Fingerprint',
    status: 'warning'
  },
  {
    id: 'canary-trips',
    label: 'CANARY TRIPS',
    value: '3',
    change: 'Active breach interception',
    trend: 'up',
    icon: 'AlertTriangle',
    status: 'critical'
  }
];

export const mockLiveEvents: SecurityEvent[] = [
  {
    id: 'EVT-90412',
    timestamp: '17:14:02.812',
    relativeTime: '8s ago',
    severity: 'critical',
    eventCode: 'CANARY_FILE_READ',
    host: 'prod-k8s-worker-09.us-east-1',
    process: '/usr/bin/cat /opt/decoy/.aws_creds_canary',
    details: 'Unauthorized process accessed honey-token credentials. Payload contained Canary Token UUID: 8fa19e-4b.',
    sourceIp: '198.51.100.44',
    targetIp: '10.0.14.92',
    rawPayload: 'GET /opt/decoy/.aws_creds_canary HTTP/1.1\nHost: prod-k8s-worker-09\nUser-Agent: curl/7.88.1'
  },
  {
    id: 'EVT-90411',
    timestamp: '17:13:49.104',
    relativeTime: '21s ago',
    severity: 'critical',
    eventCode: 'MEM_INJECT_DETECTED',
    host: 'core-auth-db-02.internal',
    process: 'kworker/u32:4 (masqueraded)',
    details: 'Reflective DLL injection detected inside kernel worker process thread. Parent PID 1420 exited.',
    sourceIp: '10.0.8.14',
    rawPayload: 'ptrace(PTRACE_POKETEXT, 1420, 0x7fff5fbff000, 0x90909090)'
  },
  {
    id: 'EVT-90410',
    timestamp: '17:12:30.952',
    relativeTime: '1m ago',
    severity: 'warning',
    eventCode: 'TLS_JA3_ANOMALY',
    host: 'edge-ingress-gateway-01',
    process: '/usr/local/bin/envoy',
    details: 'Unrecognized TLS JA3 hash matching Lazarus group tooling (hash: 771,4865-4866-4867-49195).',
    sourceIp: '203.0.113.195',
    targetIp: '10.0.1.10'
  },
  {
    id: 'EVT-90409',
    timestamp: '17:10:14.220',
    relativeTime: '4m ago',
    severity: 'safe',
    eventCode: 'AUTO_CONTAINMENT_SUCCESS',
    host: 'prod-k8s-worker-09.us-east-1',
    process: 'phantom-daemon-v2.14',
    details: 'Firewall drop rule applied to IP 198.51.100.44. Process PID 40912 terminated and core dumped.',
    sourceIp: '127.0.0.1'
  },
  {
    id: 'EVT-90408',
    timestamp: '17:08:52.441',
    relativeTime: '5m ago',
    severity: 'investigating',
    eventCode: 'DNS_BEACON_DETECTED',
    host: 'analyst-macbook-pro-14.corp',
    process: 'osascript -e "do shell script"',
    details: 'High-frequency sub-domain DNS queries to dynamic host: a78.sync-telemetry-cdn.org.',
    sourceIp: '192.168.4.112'
  },
  {
    id: 'EVT-90407',
    timestamp: '17:05:11.008',
    relativeTime: '9m ago',
    severity: 'safe',
    eventCode: 'POLICY_EVAL_NOMINAL',
    host: 'prod-api-cluster-04',
    process: 'systemd-resolved',
    details: 'Scheduled cluster credential rotation completed. 1,480 tokens verified and refreshed.',
    sourceIp: '10.0.2.1'
  },
  {
    id: 'EVT-90406',
    timestamp: '17:01:45.670',
    relativeTime: '12m ago',
    severity: 'warning',
    eventCode: 'SUDO_ESCALATION_ATTEMPT',
    host: 'ci-runner-linux-08',
    process: '/usr/bin/sudo -u root -S /tmp/rev_shell.elf',
    details: 'Sudo invocation with non-standard tty from background docker socket.',
    sourceIp: '172.17.0.4'
  }
];

export const mockAINarrations: AINarration[] = [
  {
    id: 'NAR-104',
    timestamp: '17:14:03',
    severity: 'critical',
    phase: 'CANARY INTERCEPTION',
    title: 'Honeytoken Decoy Tripped on prod-k8s-worker-09',
    hypothesis: 'The adversary successfully executed arbitrary code in container #4c1a via an exposed debug endpoint and is attempting discovery. They read /.aws_creds_canary within 4 seconds of initial shell spawn.',
    recommendedAction: 'Automated network isolation triggered. Token revoked at IAM gateway. Zero real AWS assets exposed.',
    confidenceScore: 99.4
  },
  {
    id: 'NAR-103',
    timestamp: '17:13:51',
    severity: 'critical',
    phase: 'LATERAL MOVEMENT',
    title: 'Process Masquerading via kworker injection',
    hypothesis: 'Process injection targeting core-auth-db-02 matches signature of APT-29 SilverFish lateral traversal framework. Adversary is attempting to read LSASS equivalents in memory.',
    recommendedAction: 'Process PID 1420 frozen. Memory state snapshot saved to /var/log/phantom/forensics/dump_1420.bin.',
    confidenceScore: 96.8
  },
  {
    id: 'NAR-102',
    timestamp: '17:12:32',
    severity: 'warning',
    phase: 'INITIAL INGRESS',
    title: 'Suspicious JA3 TLS Fingerprint Observed',
    hypothesis: 'TLS handshake client hello cipher suites mismatch known browser or standard curl clients. High correlation with custom Cobalt Strike Malleable C2 profile.',
    recommendedAction: 'Traffic routed through deep-packet synthetic deception proxy for payload analysis.',
    confidenceScore: 88.2
  },
  {
    id: 'NAR-101',
    timestamp: '17:08:55',
    severity: 'investigating',
    phase: 'C2 BEACONING',
    title: 'DNS Tunneling Investigation',
    hypothesis: 'Low-throughput base64 encoded TXT records queried every 450ms +/- 12ms jitter. Probable C2 beacon.',
    recommendedAction: 'Sinkhole domain applied at local recursor. Monitoring for secondary fallback domains.',
    confidenceScore: 91.0
  }
];

export const mockTimelineSteps: TimelineStep[] = [
  {
    id: 'step-1',
    stepNumber: 1,
    timestamp: '17:09:12.110',
    title: 'Initial Ingress via Ingress Gateway',
    description: 'External connection established from 198.51.100.44 via TLS 1.3 with anomalous JA3 signature.',
    process: 'envoy-ingress-proxy (PID 812)',
    severity: 'warning',
    status: 'completed'
  },
  {
    id: 'step-2',
    stepNumber: 2,
    timestamp: '17:10:44.821',
    title: 'Container Breakout Exploitation',
    description: 'Exploited CVE-2024-21626 to escape container namespace onto host worker node.',
    process: '/usr/local/bin/runc (PID 1804)',
    severity: 'critical',
    status: 'completed',
    hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
  },
  {
    id: 'step-3',
    stepNumber: 3,
    timestamp: '17:11:30.402',
    title: 'Process Masquerading & Hooking',
    description: 'Spawned fake kworker thread and hooked ptrace syscalls to hide from ps aux.',
    process: 'kworker/u32:4 (masqueraded PID 40912)',
    severity: 'critical',
    status: 'completed'
  },
  {
    id: 'step-4',
    stepNumber: 4,
    timestamp: '17:14:02.812',
    title: 'Canary Trap Tripped',
    description: 'Adversary accessed /opt/decoy/.aws_creds_canary. Real-time alert dispatched to containment orchestrator.',
    process: '/usr/bin/cat (PID 41002)',
    severity: 'critical',
    status: 'active'
  },
  {
    id: 'step-5',
    stepNumber: 5,
    timestamp: '17:14:03.010',
    title: 'Autonomous Host Isolation & Containment',
    description: 'EBPF network socket teardown completed. Host sealed. Digital forensics artifacts dumped.',
    process: 'phantom-agent (PID 601)',
    severity: 'safe',
    status: 'completed'
  }
];

export const mockGraphNodes: GraphNode[] = [
  {
    id: 'node-c2',
    label: '198.51.100.44',
    sublabel: 'Adversary C2 (RU)',
    type: 'socket',
    severity: 'critical',
    x: 60,
    y: 140,
    stepIndex: 1,
    details: { 'ASN': 'AS48123 (VastNetworks)', 'Port': '443 (TLS 1.3)', 'JA3': '771,4865-4866-4867' }
  },
  {
    id: 'node-ingress',
    label: 'envoy-ingress-proxy',
    sublabel: 'PID 812 • Port 443',
    type: 'process',
    severity: 'warning',
    x: 230,
    y: 140,
    stepIndex: 1,
    details: { 'Path': '/usr/local/bin/envoy', 'User': 'envoy-daemon' }
  },
  {
    id: 'node-runc',
    label: 'runc container escape',
    sublabel: 'PID 1804 • CVE-2024-21626',
    type: 'process',
    severity: 'critical',
    x: 400,
    y: 90,
    stepIndex: 2,
    details: { 'Exploit': 'File descriptor leak via /proc/self/fd', 'Privileges': 'root' }
  },
  {
    id: 'node-kworker',
    label: 'kworker/u32:4',
    sublabel: 'Masqueraded PID 40912',
    type: 'shell',
    severity: 'critical',
    x: 570,
    y: 140,
    stepIndex: 3,
    details: { 'Target': 'Memory Injection', 'Syscall': 'ptrace' }
  },
  {
    id: 'node-canary',
    label: '.aws_creds_canary',
    sublabel: 'Deception Trap #TRAP-88',
    type: 'canary',
    severity: 'safe',
    x: 740,
    y: 80,
    stepIndex: 4,
    details: { 'Token UUID': '8fa19e-4b92-411a', 'Type': 'Honeytoken Credential' }
  },
  {
    id: 'node-containment',
    label: 'eBPF Host Isolation',
    sublabel: 'PHANTOM Shield Nominal',
    type: 'process',
    severity: 'safe',
    x: 740,
    y: 210,
    stepIndex: 5,
    details: { 'Drop Rules': '100% applied', 'Host Status': 'Contained' }
  }
];

export const mockGraphEdges: GraphEdge[] = [
  { id: 'e1', source: 'node-c2', target: 'node-ingress', label: 'TLS Handshake', stepIndex: 1 },
  { id: 'e2', source: 'node-ingress', target: 'node-runc', label: 'Namespace Escape', stepIndex: 2 },
  { id: 'e3', source: 'node-runc', target: 'node-kworker', label: 'Masqueraded Exec', stepIndex: 3 },
  { id: 'e4', source: 'node-kworker', target: 'node-canary', label: 'Honeytoken Read', stepIndex: 4 },
  { id: 'e5', source: 'node-kworker', target: 'node-containment', label: 'Autonomous Sever', stepIndex: 5 }
];

export const mockThreatFingerprints: ThreatFingerprint[] = [
  {
    id: 'FP-APT-29',
    name: 'SilverFish / Nobelium Ingress Profile',
    actor: 'APT-29 (Cozy Bear)',
    category: 'State-Sponsored Espionage',
    similarity: 94.2,
    matchedSessions: ['SES-8921-X', 'SES-8841-B', 'SES-8710-F'],
    lastSeen: '14 mins ago',
    confidence: 'High (0.942)',
    signatures: [
      {
        rule: 'TLS Ciphersuite Handshake Order',
        targetMatch: 'TLS_AES_128_GCM_SHA256, TLS_AES_256_GCM_SHA384, TLS_CHACHA20_POLY1305_SHA256',
        baselineMatch: 'TLS_AES_128_GCM_SHA256, TLS_AES_256_GCM_SHA384, TLS_CHACHA20_POLY1305_SHA256'
      },
      {
        rule: 'Syscall Sequence Pattern',
        targetMatch: 'sys_prctl(PR_SET_NAME, "kworker/u32") -> sys_ptrace -> sys_mmap(0x7fff...)',
        baselineMatch: 'sys_prctl(PR_SET_NAME, "kworker/*") -> sys_ptrace -> sys_mmap(RWX)'
      },
      {
        rule: 'DNS Beaconing Frequency & Jitter',
        targetMatch: 'Interval: 450ms, Jitter: 2.6%, Subdomain Entropy: 4.88 bits',
        baselineMatch: 'Interval: 440ms-460ms, Jitter: 2-3%, Subdomain Entropy: >4.8 bits'
      }
    ],
    syscallProfile: [
      { call: 'sys_prctl', observedFreq: 98, baselineFreq: 95 },
      { call: 'sys_ptrace', observedFreq: 87, baselineFreq: 90 },
      { call: 'sys_mmap', observedFreq: 92, baselineFreq: 88 },
      { call: 'sys_socket', observedFreq: 64, baselineFreq: 65 }
    ]
  },
  {
    id: 'FP-APT-41',
    name: 'ShadowPad Winnti Behavioral Cluster',
    actor: 'APT-41 (Brass Typhoon)',
    category: 'Cyber Espionage & Financially Motivated',
    similarity: 88.7,
    matchedSessions: ['SES-7612-K'],
    lastSeen: '2 hours ago',
    confidence: 'Medium-High (0.887)',
    signatures: [
      {
        rule: 'Memory Payload Staging',
        targetMatch: 'VirtualAllocEx(0x00400000, MEM_COMMIT, PAGE_EXECUTE_READWRITE)',
        baselineMatch: 'VirtualAllocEx(*, MEM_COMMIT, PAGE_EXECUTE_READWRITE)'
      },
      {
        rule: 'Persistence Mechanism',
        targetMatch: 'Registry RunKey: HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Run',
        baselineMatch: 'Registry RunKey: HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Run'
      }
    ],
    syscallProfile: [
      { call: 'sys_openat', observedFreq: 84, baselineFreq: 82 },
      { call: 'sys_clone', observedFreq: 79, baselineFreq: 85 },
      { call: 'sys_connect', observedFreq: 91, baselineFreq: 90 }
    ]
  },
  {
    id: 'FP-FIN-7',
    name: 'Carbanak Financial Exfiltration Pattern',
    actor: 'FIN7 (Carbanak)',
    category: 'Targeted Ransomware / Financial Crime',
    similarity: 76.4,
    matchedSessions: ['SES-5019-M', 'SES-4991-A'],
    lastSeen: '1 day ago',
    confidence: 'Medium (0.764)',
    signatures: [
      {
        rule: 'PowerShell Obfuscation Matrix',
        targetMatch: 'powershell.exe -NoP -NonI -W Hidden -Exec Bypass -Enc JAB',
        baselineMatch: 'powershell.exe -NoP -NonI -W Hidden -Exec Bypass -Enc'
      }
    ],
    syscallProfile: [
      { call: 'sys_execve', observedFreq: 76, baselineFreq: 80 },
      { call: 'sys_read', observedFreq: 88, baselineFreq: 75 }
    ]
  },
  {
    id: 'FP-LAZARUS',
    name: 'HermeticWiper Subversion Profile',
    actor: 'Lazarus Group (HIDDEN COBRA)',
    category: 'Sabotage & Destructive Wiper',
    similarity: 62.1,
    matchedSessions: ['SES-3310-Z'],
    lastSeen: '3 days ago',
    confidence: 'Low-Medium (0.621)',
    signatures: [
      {
        rule: 'Raw Disk Sector Write Attempts',
        targetMatch: 'CreateFileW(\"\\\\.\\PhysicalDrive0\", GENERIC_READ|WRITE)',
        baselineMatch: 'CreateFileW(\"\\\\.\\PhysicalDrive*\", GENERIC_READ|WRITE)'
      }
    ],
    syscallProfile: [
      { call: 'sys_ioctl', observedFreq: 60, baselineFreq: 62 },
      { call: 'sys_write', observedFreq: 58, baselineFreq: 65 }
    ]
  }
];

export const mockCanaryTraps: CanaryTrap[] = [
  {
    id: 'TRAP-88',
    name: 'AWS_PROD_ROOT_KEY_DECOY',
    type: 'AWS Secret',
    location: '/opt/decoy/.aws_creds_canary',
    status: 'tripped',
    lastChecked: '2 mins ago',
    trippedCount: 1,
    tags: ['Production', 'Kubernetes', 'K8s-Worker-09']
  },
  {
    id: 'TRAP-89',
    name: 'id_rsa_backup_decoy',
    type: 'Canary File',
    location: '/home/ubuntu/.ssh/id_rsa_backup',
    status: 'nominal',
    lastChecked: '4 mins ago',
    trippedCount: 0,
    tags: ['SSH', 'Bastion', 'Core-Gateway']
  },
  {
    id: 'TRAP-90',
    name: 'admin_audit_service_account',
    type: 'Fake AD User',
    location: 'CORP.INTERNAL\\svc_audit_canary',
    status: 'nominal',
    lastChecked: '1 min ago',
    trippedCount: 0,
    tags: ['ActiveDirectory', 'Kerberos', 'DC-01']
  },
  {
    id: 'TRAP-91',
    name: 'MYSQL_PORT_3307_HONEYPOT',
    type: 'Decoy Port',
    location: '10.0.14.92:3307 (Decoy DB Listener)',
    status: 'nominal',
    lastChecked: 'Just now',
    trippedCount: 0,
    tags: ['Database', 'Honeypot', 'Network']
  },
  {
    id: 'TRAP-92',
    name: 'GITHUB_PERSONAL_ACCESS_TOKEN',
    type: 'Honeytoken',
    location: '/opt/frontend/.env.development',
    status: 'tripped',
    lastChecked: '18 mins ago',
    trippedCount: 2,
    tags: ['API Tokens', 'GitHub', 'CI/CD']
  },
  {
    id: 'TRAP-93',
    name: 'STRIPE_RESTRICTED_API_KEY',
    type: 'Honeytoken',
    location: 'Vault: secret/finance/stripe_canary',
    status: 'arming',
    lastChecked: '5 mins ago',
    trippedCount: 0,
    tags: ['Finance', 'HashiCorp Vault']
  }
];

export const mockAlerts: SecurityAlert[] = [
  {
    id: 'ALT-8821',
    severity: 'critical',
    timestamp: '17:14:02.812',
    host: 'prod-k8s-worker-09.us-east-1',
    vector: 'Canary Credential Access (/opt/decoy/.aws_creds_canary)',
    detectionEngine: 'PHANTOM Deception Fabric v4',
    mitigationStatus: 'Contained',
    processId: 40912,
    score: 98
  },
  {
    id: 'ALT-8820',
    severity: 'critical',
    timestamp: '17:13:49.104',
    host: 'core-auth-db-02.internal',
    vector: 'Kernel Worker Process Masquerading (ptrace inject)',
    detectionEngine: 'eBPF Syscall Monitor',
    mitigationStatus: 'Active',
    processId: 1420,
    score: 95
  },
  {
    id: 'ALT-8819',
    severity: 'warning',
    timestamp: '17:12:30.952',
    host: 'edge-ingress-gateway-01',
    vector: 'TLS JA3 Signature Discrepancy (Lazarus Tooling)',
    detectionEngine: 'Edge Ingress AI Inspector',
    mitigationStatus: 'Investigating',
    processId: 812,
    score: 84
  },
  {
    id: 'ALT-8818',
    severity: 'warning',
    timestamp: '17:08:52.441',
    host: 'analyst-macbook-pro-14.corp',
    vector: 'DNS Exfiltration Beacon (sync-telemetry-cdn.org)',
    detectionEngine: 'DNS Flow Correlator',
    mitigationStatus: 'Investigating',
    processId: 2198,
    score: 79
  },
  {
    id: 'ALT-8817',
    severity: 'safe',
    timestamp: '17:01:45.670',
    host: 'ci-runner-linux-08',
    vector: 'Sudo Privileged Invocation from Container Namespace',
    detectionEngine: 'Host Audit Daemon',
    mitigationStatus: 'Contained',
    processId: 3014,
    score: 68
  },
  {
    id: 'ALT-8816',
    severity: 'safe',
    timestamp: '16:45:10.119',
    host: 'staging-redis-cache-01',
    vector: 'Unauthorized CONFIG GET * Execution Attempt',
    detectionEngine: 'Database Command Guard',
    mitigationStatus: 'Dismissed',
    processId: 1980,
    score: 45
  }
];

export const mockIncidentReport: IncidentReport = {
  id: 'INC-2026-8841',
  title: 'Targeted Lateral Movement & Honeytoken Exfiltration Attempt',
  status: 'Contained',
  date: 'September 19, 2026 — 17:15 UTC',
  leadAnalyst: 'Autonomous PHANTOM Core Agent (Supervised by SecOps Tier 3)',
  riskRating: 'Severe',
  executiveSummary: 'At 17:09:12 UTC, PHANTOM detected an initial ingress anomaly originating from IP 198.51.100.44 targeting an ingress proxy on cluster us-east-1. Within 1 minute and 32 seconds, the adversary leveraged CVE-2024-21626 to escape the container boundary and initiated process masquerading under the guise of kworker/u32:4. Deception traps deployed in /opt/decoy intercepted the attacker before any customer data or production credentials were compromised. The host was autonomously isolated at 17:14:03 UTC with zero human latency.',
  incidentNarrative: [
    'Initial reconnaissance commenced at 17:09 UTC via TLS 1.3 probes originating from an AS48123 proxy node. The client handshake exhibited a JA3 signature with an 88.2% correlation to known Cobalt Strike Malleable C2 profiles.',
    'Upon gaining initial container shell access, the attacker attempted to enumerate local privileges and subsequently executed runc namespace escapes. The binary payload was verified against SHA-256 hash e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855.',
    'At 17:14:02 UTC, the adversary attempted to harvest AWS root credentials from /opt/decoy/.aws_creds_canary. Because this file is a high-fidelity synthetic honeytoken, PHANTOM initiated automated tier-1 containment instantly.',
    'The affected host prod-k8s-worker-09 was sealed via kernel-level eBPF socket termination. Forensics memory dumps and socket telemetry were archived for threat intelligence attribution.'
  ],
  compromisedAssets: [
    'prod-k8s-worker-09.us-east-1 (Isolated & Re-imaged)',
    'Container sandbox #4c1a-edge (Terminated)',
    'Synthetic Honeytoken #TRAP-88 (Revoked & Rotated)'
  ],
  indicatorsOfCompromise: [
    { type: 'IP', value: '198.51.100.44', context: 'Adversary Command & Control Ingress IP' },
    { type: 'SHA256', value: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', context: 'Malicious runc exploitation helper' },
    { type: 'JA3', value: '771,4865-4866-4867-49195-49199-49196-49200-52393', context: 'Cobalt Strike custom TLS fingerprint' },
    { type: 'Domain', value: 'sync-telemetry-cdn.org', context: 'Exfiltration DNS tunneling domain' }
  ],
  mitigationSteps: [
    { action: 'Autonomous eBPF socket severance for 198.51.100.44', completedAt: '17:14:03.010', operator: 'PHANTOM eBPF Agent' },
    { action: 'Honeytoken UUID 8fa19e-4b revoked at AWS IAM Gateway', completedAt: '17:14:03.420', operator: 'IAM Security Sync' },
    { action: 'Container #4c1a drained and worker node placed in quarantine', completedAt: '17:14:04.100', operator: 'Kubernetes Controller' },
    { action: 'Forensic memory snapshot dumped to secure S3 cold storage', completedAt: '17:14:15.890', operator: 'Forensics Orchestrator' }
  ]
};

export const mockDevices: DeviceRecord[] = [
  {
    id: 'DEV-101',
    hostname: 'prod-k8s-worker-09.us-east-1',
    ip: '10.0.14.92',
    os: 'Ubuntu 22.04 LTS (Kernel 5.15.0)',
    agentVersion: 'v2.14.8-core',
    status: 'nominal',
    lastHeartbeat: '4s ago',
    riskScore: 94,
    enrolledPolicies: 18
  },
  {
    id: 'DEV-102',
    hostname: 'core-auth-db-02.internal',
    ip: '10.0.8.14',
    os: 'Debian GNU/Linux 12 (bookworm)',
    agentVersion: 'v2.14.8-core',
    status: 'investigating',
    lastHeartbeat: '12s ago',
    riskScore: 82,
    enrolledPolicies: 22
  },
  {
    id: 'DEV-103',
    hostname: 'edge-ingress-gateway-01',
    ip: '10.0.1.10',
    os: 'Alpine Linux 3.19 (musl)',
    agentVersion: 'v2.14.6-edge',
    status: 'nominal',
    lastHeartbeat: '1s ago',
    riskScore: 41,
    enrolledPolicies: 14
  },
  {
    id: 'DEV-104',
    hostname: 'ci-runner-linux-08',
    ip: '172.17.0.4',
    os: 'Ubuntu 24.04 LTS',
    agentVersion: 'v2.14.8-core',
    status: 'nominal',
    lastHeartbeat: '8s ago',
    riskScore: 18,
    enrolledPolicies: 12
  },
  {
    id: 'DEV-105',
    hostname: 'analyst-macbook-pro-14.corp',
    ip: '192.168.4.112',
    os: 'macOS Sonoma 14.4 (ARM64)',
    agentVersion: 'v2.14.8-darwin',
    status: 'investigating',
    lastHeartbeat: '25s ago',
    riskScore: 78,
    enrolledPolicies: 16
  }
];
