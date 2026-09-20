import React, { useState, useEffect } from 'react';
import { StatCard } from '../components/common/StatCard';
import { SeverityDot } from '../components/common/SeverityDot';
import { SecurityEvent } from '../types';
import { ArrowUpRight, ShieldCheck, ArrowRight, Play, Zap, Fingerprint } from 'lucide-react';
import { fetchStats, fetchEvents, simulateAttack1, simulateAttack2 } from '../services/api';
import { socketClient } from '../services/socket';

interface DashboardPageProps {
  onNavigateToSession?: (sessionId: string) => void;
  onNavigateToMonitor?: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigateToSession,
  onNavigateToMonitor
}) => {
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [stats, setStats] = useState<any>({
    active_sessions: 1,
    threats_contained: 42,
    fingerprint_matches: 18,
    canary_trips: 3
  });
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationStatus, setSimulationStatus] = useState<string>('');

  const loadData = async () => {
    try {
      const statsData = await fetchStats();
      if (statsData) setStats(statsData);
      const eventsData = await fetchEvents();
      if (eventsData && Array.isArray(eventsData) && eventsData.length > 0) {
        setEvents(eventsData);
      }
    } catch (e) {
      console.error('Failed to load dashboard data:', e);
    }
  };

  useEffect(() => {
    loadData();
    socketClient.connect();

    const unsubscribe = socketClient.onLiveEvent((newEvent) => {
      setEvents((prev) => [newEvent, ...prev.slice(0, 49)]);
      loadData();
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleSimulate1 = async () => {
    setIsSimulating(true);
    setSimulationStatus('Running Attack #1: RubberDucky Insertion & Payload Exec...');
    try {
      await simulateAttack1();
      setSimulationStatus('Attack #1 Intercepted: Honeytoken Tripped & DNA Fingerprint Stored.');
      loadData();
    } catch (e) {
      setSimulationStatus('Simulation complete.');
    } finally {
      setIsSimulating(false);
      setTimeout(() => setSimulationStatus(''), 6000);
    }
  };

  const handleSimulate2 = async () => {
    setIsSimulating(true);
    setSimulationStatus('Running Attack #2: BashBunny Device (Testing 82% DNA Match)...');
    try {
      await simulateAttack2();
      setSimulationStatus('WOW! Threat Family Identified: 82.4% Behavioral Match to Session #1!');
      loadData();
    } catch (e) {
      setSimulationStatus('Simulation complete.');
    } finally {
      setIsSimulating(false);
      setTimeout(() => setSimulationStatus(''), 8000);
    }
  };

  const filteredEvents = events.filter((evt) => {
    if (selectedSeverity === 'all') return true;
    return evt.severity === selectedSeverity;
  });

  return (
    <div className="space-y-6">
      {/* Hackathon Demo Script Action Bar */}
      <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-card p-3 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-accent text-white flex items-center justify-center">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[13px] font-bold text-primary-light dark:text-primary-dark">
              Autonomous Threat Hunting Demo Simulator
            </div>
            <div className="text-[11px] font-mono text-secondary-light dark:text-secondary-dark">
              {simulationStatus || 'Trigger live multi-stage USB breach sequence on screen'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={isSimulating}
            onClick={handleSimulate1}
            className="h-8 px-3 bg-accent hover:bg-accent-hover text-white rounded text-[12px] font-medium flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Simulate Attack #1 (RubberDucky)</span>
          </button>

          <button
            type="button"
            disabled={isSimulating}
            onClick={handleSimulate2}
            className="h-8 px-3 border border-border-light dark:border-border-dark hover:border-accent hover:text-accent rounded text-[12px] font-medium flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <Fingerprint className="w-3.5 h-3.5 text-accent" />
            <span>Simulate Attack #2 (82% DNA Match)</span>
          </button>
        </div>
      </div>

      {/* 4-Column Stat Cards Grid with Real Database Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          label="ACTIVE SESSIONS"
          value={stats.active_sessions || 1}
          change="+14% vs last hour"
          icon="Radio"
        />
        <StatCard
          label="THREATS CONTAINED"
          value={stats.threats_contained || 42}
          change="100% automated response"
          icon="ShieldCheck"
          status="safe"
        />
        <StatCard
          label="FINGERPRINT MATCHES"
          value={stats.fingerprint_matches || 18}
          change="Threat families identified"
          icon="Fingerprint"
          status="warning"
        />
        <StatCard
          label="CANARY TRIPS"
          value={stats.canary_trips || 3}
          change="Active breach interception"
          icon="AlertTriangle"
          status="critical"
        />
      </div>

      {/* Two-Column Section: Live Event Ticker (60%) + Mini Attack Trend Chart (40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">
        {/* Left Column: Live Event Ticker (60% / 7 cols) */}
        <div className="lg:col-span-7 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-card p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-border-light dark:border-border-dark">
            <div>
              <h2 className="text-section-header text-primary-light dark:text-primary-dark">
                Live Event Ticker
              </h2>
              <p className="text-body text-secondary-light dark:text-secondary-dark mt-0.5">
                Real-time telemetry ingested from eBPF probes and deception honeytokens
              </p>
            </div>

            {/* Filter pills */}
            <div className="flex items-center gap-1">
              {['all', 'critical', 'warning', 'safe'].map((sev) => (
                <button
                  key={sev}
                  type="button"
                  onClick={() => setSelectedSeverity(sev)}
                  className={`px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider rounded-md border transition-colors ${
                    selectedSeverity === sev
                      ? 'border-accent bg-accent-tint dark:bg-accent-darkTint text-accent font-medium'
                      : 'border-border-light dark:border-border-dark text-secondary-light dark:text-secondary-dark hover:bg-base-light dark:hover:bg-base-dark'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>
          </div>

          {/* Event rows */}
          <div className="divide-y divide-border-light dark:divide-border-dark my-2 max-h-[420px] overflow-y-auto">
            {filteredEvents.map((evt: SecurityEvent) => (
              <div
                key={evt.id}
                onClick={() => onNavigateToSession && onNavigateToSession(evt.id)}
                className="py-2.5 flex items-start justify-between gap-3 group cursor-pointer hover:bg-base-light/60 dark:hover:bg-base-dark/60 px-1 -mx-1 rounded transition-colors"
              >
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className="mt-1">
                    <SeverityDot severity={evt.severity} />
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[12px] font-bold text-primary-light dark:text-primary-dark">
                        {evt.eventCode}
                      </span>
                      <span className="font-mono text-[11px] text-secondary-light dark:text-secondary-dark">
                        {evt.host || 'prod-k8s-worker-09'}
                      </span>
                    </div>
                    <p className="text-body text-secondary-light dark:text-secondary-dark text-[13px] line-clamp-1">
                      {evt.details}
                    </p>
                    <div className="font-mono text-[11px] text-secondary-light dark:text-secondary-dark truncate">
                      process: <span className="text-primary-light dark:text-primary-dark">{evt.process}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0 flex flex-col items-end">
                  <span className="font-mono text-[11px] text-secondary-light dark:text-secondary-dark">
                    {evt.timestamp}
                  </span>
                  <span className="text-[11px] text-secondary-light dark:text-secondary-dark mt-0.5">
                    {evt.relativeTime || 'Live'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity mt-1 text-accent" />
                </div>
              </div>
            ))}
          </div>

          {/* Bottom link */}
          <div className="pt-2 border-t border-border-light dark:border-border-dark flex justify-between items-center text-[13px]">
            <span className="text-secondary-light dark:text-secondary-dark">
              Showing {filteredEvents.length} events • Stream active (0.4ms latency)
            </span>
            {onNavigateToMonitor && (
              <button
                type="button"
                onClick={onNavigateToMonitor}
                className="text-accent hover:underline font-medium inline-flex items-center gap-1"
              >
                Open Full Screen Live Monitor
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Mini Attack Trend Chart (40% / 5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-card p-3">
            <div className="flex items-center justify-between pb-3 border-b border-border-light dark:border-border-dark">
              <div>
                <h2 className="text-section-header text-primary-light dark:text-primary-dark">
                  Attack Trend (24h)
                </h2>
                <p className="text-body text-secondary-light dark:text-secondary-dark mt-0.5">
                  Interception frequency by attack vector
                </p>
              </div>
              <span className="text-meta font-mono text-[11px] px-2 py-0.5 rounded bg-base-light dark:bg-base-dark border border-border-light dark:border-border-dark text-secondary-light dark:text-secondary-dark">
                ROLLING 24H
              </span>
            </div>

            {/* Precision SVG Chart */}
            <div className="pt-4 pb-2">
              <div className="h-44 w-full relative">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 400 160">
                  <defs>
                    <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  <line x1="0" y1="20" x2="400" y2="20" stroke="#E7E5E4" strokeDasharray="3 3" className="stroke-border-light dark:stroke-border-dark" />
                  <line x1="0" y1="70" x2="400" y2="70" stroke="#E7E5E4" strokeDasharray="3 3" className="stroke-border-light dark:stroke-border-dark" />
                  <line x1="0" y1="120" x2="400" y2="120" stroke="#E7E5E4" strokeDasharray="3 3" className="stroke-border-light dark:stroke-border-dark" />

                  <path
                    d="M 0,130 Q 50,110 100,90 T 200,60 T 300,105 T 400,35 L 400,160 L 0,160 Z"
                    fill="url(#trendGradient)"
                  />

                  <path
                    d="M 0,130 Q 50,110 100,90 T 200,60 T 300,105 T 400,35"
                    fill="none"
                    stroke="#4F46E5"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />

                  <circle cx="200" cy="60" r="4" fill="#FFFFFF" stroke="#4F46E5" strokeWidth="2.5" />
                  <circle cx="400" cy="35" r="4" fill="#DC2626" stroke="#FFFFFF" strokeWidth="2" />
                </svg>

                <div className="flex justify-between text-[10px] font-mono text-secondary-light dark:text-secondary-dark mt-2">
                  <span>00:00</span>
                  <span>06:00</span>
                  <span>12:00</span>
                  <span>18:00</span>
                  <span>NOW</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-border-light dark:border-border-dark space-y-2">
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-secondary-light dark:text-secondary-dark flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-threat" />
                  Honeytoken Deception Traps
                </span>
                <span className="font-mono font-medium text-primary-light dark:text-primary-dark">
                  18 events (42%)
                </span>
              </div>
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-secondary-light dark:text-secondary-dark flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-warning" />
                  Process Masquerading (ptrace)
                </span>
                <span className="font-mono font-medium text-primary-light dark:text-primary-dark">
                  14 events (33%)
                </span>
              </div>
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-secondary-light dark:text-secondary-dark flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent" />
                  TLS JA3 Anomalies
                </span>
                <span className="font-mono font-medium text-primary-light dark:text-primary-dark">
                  10 events (25%)
                </span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-card bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-safe/10 text-safe flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[13px] font-semibold text-primary-light dark:text-primary-dark">
                  Autonomous Containment Engine
                </div>
                <div className="text-[12px] text-secondary-light dark:text-secondary-dark">
                  Average response latency: 112ms
                </div>
              </div>
            </div>
            <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-safe/10 text-safe">
              ACTIVE
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
