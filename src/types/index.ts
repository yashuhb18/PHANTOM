export type PageId =
  | 'dashboard'
  | 'live-monitor'
  | 'session-detail'
  | 'threat-intel'
  | 'deception-traps'
  | 'alerts'
  | 'incident-reports'
  | 'settings';

export type Severity = 'critical' | 'warning' | 'safe' | 'investigating';

export interface StatMetric {
  id: string;
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: string;
  status?: Severity;
}

export interface SecurityEvent {
  id: string;
  timestamp: string;
  relativeTime: string;
  severity: Severity;
  eventCode: string;
  host: string;
  process: string;
  details: string;
  sourceIp: string;
  targetIp?: string;
  rawPayload?: string;
}

export interface AINarration {
  id: string;
  timestamp: string;
  severity: Severity;
  phase: string;
  title: string;
  hypothesis: string;
  recommendedAction: string;
  confidenceScore: number;
}

export interface TimelineStep {
  id: string;
  stepNumber: number;
  timestamp: string;
  title: string;
  description: string;
  process: string;
  severity: Severity;
  status: 'completed' | 'active' | 'pending';
  hash?: string;
}

export interface GraphNode {
  id: string;
  label: string;
  sublabel: string;
  type: 'process' | 'socket' | 'canary' | 'shell' | 'user';
  severity: Severity;
  x: number;
  y: number;
  stepIndex: number;
  details?: Record<string, string>;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  stepIndex: number;
}

export interface ThreatFingerprint {
  id: string;
  name: string;
  actor: string;
  category: string;
  similarity: number; // 0 to 100
  matchedSessions: string[];
  lastSeen: string;
  confidence: string;
  signatures: {
    rule: string;
    targetMatch: string;
    baselineMatch: string;
  }[];
  syscallProfile: {
    call: string;
    observedFreq: number;
    baselineFreq: number;
  }[];
}

export interface CanaryTrap {
  id: string;
  name: string;
  type: 'Honeytoken' | 'Decoy Port' | 'Fake AD User' | 'Canary File' | 'AWS Secret';
  location: string;
  status: 'nominal' | 'tripped' | 'arming';
  lastChecked: string;
  trippedCount: number;
  tags: string[];
}

export interface SecurityAlert {
  id: string;
  severity: Severity;
  timestamp: string;
  host: string;
  vector: string;
  detectionEngine: string;
  mitigationStatus: 'Active' | 'Contained' | 'Investigating' | 'Dismissed';
  processId: number;
  score: number;
}

export interface IncidentReport {
  id: string;
  title: string;
  status: 'Closed' | 'Contained' | 'Under Forensics';
  date: string;
  leadAnalyst: string;
  riskRating: 'Severe' | 'Elevated' | 'Low';
  executiveSummary: string;
  incidentNarrative: string[];
  compromisedAssets: string[];
  indicatorsOfCompromise: {
    type: 'SHA256' | 'IP' | 'JA3' | 'Domain';
    value: string;
    context: string;
  }[];
  mitigationSteps: {
    action: string;
    completedAt: string;
    operator: string;
  }[];
}

export interface DeviceRecord {
  id: string;
  hostname: string;
  ip: string;
  os: string;
  agentVersion: string;
  status: 'nominal' | 'investigating' | 'offline';
  lastHeartbeat: string;
  riskScore: number;
  enrolledPolicies: number;
}
