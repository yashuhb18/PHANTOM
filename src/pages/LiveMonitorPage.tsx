import React, { useState, useEffect } from 'react';
import { SecurityEvent, AINarration } from '../types';
import { SeverityDot } from '../components/common/SeverityDot';
import { Play, Pause, Terminal, CheckCircle2 } from 'lucide-react';
import { fetchEvents } from '../services/api';
import { socketClient } from '../services/socket';

export const LiveMonitorPage: React.FC = () => {
  const [isStreaming, setIsStreaming] = useState<boolean>(true);
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [narrations, setNarrations] = useState<AINarration[]>([
    {
      id: 'NAR-104',
      timestamp: '17:14:03',
      severity: 'critical',
      phase: 'CANARY INTERCEPTION',
      title: 'Honeytoken Decoy Tripped on prod-k8s-worker-09',
      hypothesis: 'The adversary successfully executed arbitrary code via an exposed debug endpoint and is attempting discovery. They read /.aws_creds_canary within 4 seconds of initial shell spawn.',
      recommendedAction: 'Automated network isolation triggered. Token revoked at IAM gateway. Zero real AWS assets exposed.',
      confidenceScore: 99.4
    }
  ]);
  const [selectedEvent, setSelectedEvent] = useState<SecurityEvent | null>(null);

  useEffect(() => {
    fetchEvents().then((data) => {
      if (data && Array.isArray(data) && data.length > 0) {
        setEvents(data);
        setSelectedEvent(data[0]);
      }
    });

    socketClient.connect();

    const unsubLive = socketClient.onLiveEvent((evt) => {
      if (isStreaming) {
        setEvents((prev) => [evt, ...prev.slice(0, 49)]);
        setSelectedEvent(evt);
      }
    });

    const unsubNarrator = socketClient.onNarratorMessage((nar) => {
      if (isStreaming) {
        setNarrations((prev) => [nar, ...prev.slice(0, 19)]);
      }
    });

    return () => {
      unsubLive();
      unsubNarrator();
    };
  }, [isStreaming]);

  return (
    <div className="space-y-4">
      {/* Top Status Bar */}
      <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-card p-2.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isStreaming ? 'bg-safe animate-pulse' : 'bg-secondary-light'}`} />
            <span className="text-[13px] font-medium text-primary-light dark:text-primary-dark">
              {isStreaming ? 'Live Telemetry Ingestion (WebSocket: /ws/live)' : 'Telemetry Stream Paused'}
            </span>
          </div>
          <span className="text-meta text-secondary-light dark:text-secondary-dark font-mono text-[11px] hidden sm:inline">
            CLUSTER: PROD-US-EAST-1 • INGEST: 1,420 EVT/SEC
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsStreaming(!isStreaming)}
            className="h-8 px-3 rounded border border-border-light dark:border-border-dark text-[12px] font-medium flex items-center gap-1.5 hover:bg-base-light dark:hover:bg-base-dark text-primary-light dark:text-primary-dark transition-colors"
          >
            {isStreaming ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isStreaming ? 'Pause Stream' : 'Resume Stream'}</span>
          </button>
        </div>
      </div>

      {/* Split-Screen: Raw Event Feed (55%) + AI Narrator Panel (45%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start min-h-[640px]">
        {/* Left: Raw Event Feed (55% / 7 cols) */}
        <div className="lg:col-span-7 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-card flex flex-col h-full overflow-hidden">
          <div className="p-3 border-b border-border-light dark:border-border-dark flex items-center justify-between bg-base-light/40 dark:bg-base-dark/40">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-secondary-light dark:text-secondary-dark" />
              <h2 className="text-[15px] font-semibold text-primary-light dark:text-primary-dark">
                Raw Event Stream
              </h2>
            </div>
            <span className="text-meta font-mono text-[11px] text-secondary-light dark:text-secondary-dark">
              FORMAT: RFC-5424 + EBPF
            </span>
          </div>

          <div className="divide-y divide-border-light dark:divide-border-dark overflow-y-auto max-h-[580px]">
            {events.map((evt: SecurityEvent) => {
              const isSelected = selectedEvent?.id === evt.id;
              return (
                <div
                  key={evt.id}
                  onClick={() => setSelectedEvent(evt)}
                  className={`p-3 cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-accent-tint/50 dark:bg-accent-darkTint/40 border-l-2 border-accent'
                      : 'hover:bg-base-light/50 dark:hover:bg-base-dark/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5">
                      <div className="mt-1">
                        <SeverityDot severity={evt.severity} />
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[12px] font-bold text-primary-light dark:text-primary-dark">
                            {evt.eventCode}
                          </span>
                          <span className="font-mono text-[11px] text-secondary-light dark:text-secondary-dark">
                            [{evt.id}]
                          </span>
                        </div>

                        <div className="font-mono text-[12px] text-primary-light dark:text-primary-dark break-all">
                          {evt.process}
                        </div>

                        <p className="text-[13px] text-secondary-light dark:text-secondary-dark leading-normal">
                          {evt.details}
                        </p>

                        <div className="flex items-center gap-3 pt-1 text-[11px] font-mono text-secondary-light dark:text-secondary-dark">
                          <span>HOST: {evt.host || 'prod-k8s-worker-09'}</span>
                          <span>SRC: {evt.sourceIp || '198.51.100.44'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-mono text-[11px] text-secondary-light dark:text-secondary-dark block">
                        {evt.timestamp}
                      </span>
                      <span className="text-[10px] text-secondary-light dark:text-secondary-dark">
                        {evt.relativeTime || 'Live'}
                      </span>
                    </div>
                  </div>

                  {isSelected && evt.rawPayload && (
                    <div className="mt-3 p-2.5 rounded bg-base-light dark:bg-base-dark border border-border-light dark:border-border-dark font-mono text-[11px] text-primary-light dark:text-primary-dark space-y-1">
                      <div className="text-meta text-secondary-light dark:text-secondary-dark text-[10px]">
                        PAYLOAD INSPECTION:
                      </div>
                      <pre className="whitespace-pre-wrap overflow-x-auto text-[11px] leading-relaxed">
                        {evt.rawPayload}
                      </pre>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: AI Narrator Panel (45% / 5 cols) */}
        <div className="lg:col-span-5 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-card flex flex-col h-full overflow-hidden">
          <div className="p-3 border-b border-border-light dark:border-border-dark flex items-center justify-between bg-base-light/40 dark:bg-base-dark/40">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-accent text-white flex items-center justify-center font-mono text-[11px] font-bold">
                Φ
              </div>
              <div>
                <h2 className="text-[15px] font-semibold text-primary-light dark:text-primary-dark leading-tight">
                  PHANTOM Autonomous Analyst
                </h2>
                <span className="text-[11px] text-secondary-light dark:text-secondary-dark font-mono">
                  WS: /ws/narrator • REAL-TIME COMMENTARY
                </span>
              </div>
            </div>
            <span className="w-2 h-2 rounded-full bg-safe animate-pulse" />
          </div>

          <div className="p-3 space-y-4 overflow-y-auto max-h-[580px]">
            {narrations.map((nar: AINarration) => (
              <div
                key={nar.id}
                className="p-3 rounded-card border border-border-light dark:border-border-dark bg-base-light/50 dark:bg-base-dark/50 space-y-2.5 transition-all animate-in fade-in duration-200"
              >
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="px-2 py-0.5 rounded bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-accent font-semibold tracking-wider">
                    {nar.phase}
                  </span>
                  <div className="flex items-center gap-2 text-secondary-light dark:text-secondary-dark">
                    <span>{nar.timestamp}</span>
                    <span>•</span>
                    <span className="text-safe font-semibold">{nar.confidenceScore}% conf</span>
                  </div>
                </div>

                <h4 className="text-[14px] font-semibold text-primary-light dark:text-primary-dark">
                  {nar.title}
                </h4>

                <div className="space-y-1">
                  <div className="text-meta text-secondary-light dark:text-secondary-dark text-[10px]">
                    ANALYST HYPOTHESIS:
                  </div>
                  <p className="text-[13px] text-primary-light dark:text-primary-dark leading-relaxed">
                    {nar.hypothesis}
                  </p>
                </div>

                <div className="p-2.5 rounded bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark space-y-1">
                  <div className="text-meta text-secondary-light dark:text-secondary-dark text-[10px] flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-safe" />
                    AUTONOMOUS MITIGATION:
                  </div>
                  <p className="text-[12px] text-secondary-light dark:text-secondary-dark leading-relaxed font-mono">
                    {nar.recommendedAction}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
