import React, { useState, useEffect } from 'react';
import { TimelineStep, GraphNode, GraphEdge } from '../types';
import { AudioScrubber } from '../components/common/AudioScrubber';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Server
} from 'lucide-react';
import { fetchSession, fetchSessionTimeline, fetchSessionGraph, fetchSessionReplay } from '../services/api';

export const SessionDetailPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(4);
  const [totalSteps, setTotalSteps] = useState<number>(5);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  const [session, setSession] = useState<any>({
    id: 'SES-USB-01',
    device_name: 'USB RubberDucky Keystroke Injector',
    device_vid: '0x0483',
    device_pid: '0x5740',
    device_serial: 'SN-DUCKY-8841',
    risk_score: 94,
    status: 'contained'
  });

  const [timelineSteps, setTimelineSteps] = useState<TimelineStep[]>([]);
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);

  useEffect(() => {
    // Load session info
    fetchSession('SES-USB-01').then((data) => {
      if (data) setSession(data);
    }).catch(() => {});

    // Load timeline
    fetchSessionTimeline('SES-USB-01').then((steps) => {
      if (steps && steps.length > 0) {
        setTimelineSteps(steps);
        setTotalSteps(steps.length);
      }
    }).catch(() => {});

    // Load graph
    fetchSessionGraph('SES-USB-01').then((graph) => {
      if (graph && graph.nodes && graph.nodes.length > 0) {
        setNodes(graph.nodes);
        setEdges(graph.edges);
        setSelectedNode(graph.nodes[Math.min(3, graph.nodes.length - 1)]);
      }
    }).catch(() => {});
  }, []);

  // Update active nodes/edges when currentStep changes
  useEffect(() => {
    fetchSessionReplay('SES-USB-01', currentStep).then((replay) => {
      if (replay && replay.nodes) {
        setNodes(replay.nodes);
        setEdges(replay.edges);
      }
    }).catch(() => {});
  }, [currentStep]);

  const stepLabels = timelineSteps.map((s) => `0${s.stepNumber} ${s.title}`);

  return (
    <div className="space-y-4">
      {/* Zone 1: Top Summary Bar (Device Info as Small Pill Tags) */}
      <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-card p-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 pr-3 border-r border-border-light dark:border-border-dark">
            <span className="w-2.5 h-2.5 rounded-full bg-threat animate-pulse" />
            <span className="font-mono font-bold text-[14px] text-primary-light dark:text-primary-dark">
              {session.id || 'SES-USB-01'}
            </span>
          </div>

          <span className="px-2.5 py-1 rounded-full bg-base-light dark:bg-base-dark border border-border-light dark:border-border-dark text-[11px] font-mono text-secondary-light dark:text-secondary-dark flex items-center gap-1.5">
            <Server className="w-3.5 h-3.5" />
            DEVICE: {session.device_name || 'RubberDucky HID'}
          </span>

          <span className="px-2.5 py-1 rounded-full bg-base-light dark:bg-base-dark border border-border-light dark:border-border-dark text-[11px] font-mono text-secondary-light dark:text-secondary-dark">
            VID:PID: {session.device_vid || '0x0483'}:{session.device_pid || '0x5740'}
          </span>

          <span className="px-2.5 py-1 rounded-full bg-base-light dark:bg-base-dark border border-border-light dark:border-border-dark text-[11px] font-mono text-secondary-light dark:text-secondary-dark">
            SN: {session.device_serial || 'SN-DUCKY-8841'}
          </span>

          <span className="px-2.5 py-1 rounded-full bg-threat/10 border border-threat/20 text-[11px] font-mono font-semibold text-threat">
            RISK: {session.risk_score || 94} / 100
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[12px] font-mono text-secondary-light dark:text-secondary-dark">
            STATUS: <strong className="text-safe font-semibold uppercase">{session.status || 'CONTAINED'}</strong>
          </span>
        </div>
      </div>

      {/* Main Grid: Left Column Timeline + Right Column Attack Graph */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">
        {/* Zone 2: Left Column Timeline (4 cols) */}
        <div className="lg:col-span-4 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-card p-3">
          <div className="pb-3 border-b border-border-light dark:border-border-dark mb-4">
            <h2 className="text-section-header text-primary-light dark:text-primary-dark">
              Incident Timeline
            </h2>
            <p className="text-body text-secondary-light dark:text-secondary-dark mt-0.5">
              Chronological kill chain execution steps from NetworkX
            </p>
          </div>

          <div className="relative pl-6 space-y-6">
            <div className="absolute left-2.5 top-2 bottom-4 w-[2px] bg-accent/30 dark:bg-accent/40" />

            {timelineSteps.map((step: TimelineStep) => {
              const isPastOrCurrent = step.stepNumber <= currentStep;
              const isCurrent = step.stepNumber === currentStep;

              return (
                <div
                  key={step.id}
                  onClick={() => setCurrentStep(step.stepNumber)}
                  className={`relative cursor-pointer group transition-opacity ${
                    isPastOrCurrent ? 'opacity-100' : 'opacity-40'
                  }`}
                >
                  <div
                    className={`absolute -left-6 top-1 w-5 h-5 rounded-full flex items-center justify-center border-2 transition-all ${
                      isCurrent
                        ? 'border-accent bg-accent text-white scale-110'
                        : isPastOrCurrent
                        ? 'border-accent bg-surface-light dark:bg-surface-dark text-accent'
                        : 'border-border-light dark:border-border-dark bg-base-light dark:bg-base-dark text-secondary-light'
                    }`}
                  >
                    <span className="text-[10px] font-mono font-bold leading-none">
                      {step.stepNumber}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] text-secondary-light dark:text-secondary-dark">
                        {step.timestamp}
                      </span>
                      {step.status === 'completed' && (
                        <span className="text-[10px] font-mono text-safe font-medium">DONE</span>
                      )}
                    </div>

                    <h4 className="text-[13px] font-semibold text-primary-light dark:text-primary-dark group-hover:text-accent transition-colors">
                      {step.title}
                    </h4>

                    <p className="text-[12px] text-secondary-light dark:text-secondary-dark leading-normal">
                      {step.description}
                    </p>

                    <div className="font-mono text-[11px] text-secondary-light dark:text-secondary-dark pt-0.5">
                      proc: <span className="text-primary-light dark:text-primary-dark">{step.process}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Zone 3: Right Column Interactive Attack Graph (8 cols) */}
        <div
          className={`lg:col-span-8 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-card flex flex-col justify-between ${
            isFullscreen ? 'fixed inset-4 z-50 overflow-hidden shadow-2xl' : ''
          }`}
        >
          <div className="p-3 border-b border-border-light dark:border-border-dark flex items-center justify-between">
            <div>
              <h2 className="text-section-header text-primary-light dark:text-primary-dark">
                Attack Path Graph (NetworkX)
              </h2>
              <p className="text-body text-secondary-light dark:text-secondary-dark text-[12px]">
                Interactive process-to-network causality tree generated dynamically
              </p>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.min(2, z + 0.2))}
                title="Zoom In"
                className="p-1.5 rounded border border-border-light dark:border-border-dark text-secondary-light dark:text-secondary-dark hover:text-primary-light hover:bg-base-light dark:hover:bg-base-dark transition-colors"
              >
                <ZoomIn className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.max(0.6, z - 0.2))}
                title="Zoom Out"
                className="p-1.5 rounded border border-border-light dark:border-border-dark text-secondary-light dark:text-secondary-dark hover:text-primary-light hover:bg-base-light dark:hover:bg-base-dark transition-colors"
              >
                <ZoomOut className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setZoomLevel(1)}
                title="Reset View"
                className="p-1.5 rounded border border-border-light dark:border-border-dark text-secondary-light dark:text-secondary-dark hover:text-primary-light hover:bg-base-light dark:hover:bg-base-dark transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsFullscreen(!isFullscreen)}
                title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                className="p-1.5 rounded border border-border-light dark:border-border-dark text-secondary-light dark:text-secondary-dark hover:text-primary-light hover:bg-base-light dark:hover:bg-base-dark transition-colors"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="relative h-[380px] w-full overflow-hidden bg-base-light/30 dark:bg-base-dark/30 flex items-center justify-center p-4">
            <svg
              className="w-full h-full"
              viewBox="0 0 850 300"
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'center center',
                transition: 'transform 150ms ease-out'
              }}
            >
              <defs>
                <linearGradient id="edgeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#4F46E5" />
                  <stop offset="100%" stopColor="#6366F1" />
                </linearGradient>

                <marker
                  id="arrowhead"
                  markerWidth="8"
                  markerHeight="6"
                  refX="7"
                  refY="3"
                  orient="auto"
                >
                  <polygon points="0 0, 8 3, 0 6" fill="#6366F1" />
                </marker>
              </defs>

              {edges.map((edge) => {
                const sourceNode = nodes.find((n) => n.id === edge.source);
                const targetNode = nodes.find((n) => n.id === edge.target);
                if (!sourceNode || !targetNode) return null;

                const midX = (sourceNode.x + targetNode.x) / 2;
                const midY = (sourceNode.y + targetNode.y) / 2 - 10;

                return (
                  <g key={edge.id} className="transition-all duration-200">
                    <path
                      d={`M ${sourceNode.x + 50} ${sourceNode.y + 20} Q ${midX} ${midY} ${targetNode.x - 10} ${targetNode.y + 20}`}
                      fill="none"
                      stroke="url(#edgeGradient)"
                      strokeWidth="2"
                      markerEnd="url(#arrowhead)"
                      strokeDasharray="4 2"
                    />
                    {edge.label && (
                      <text
                        x={midX}
                        y={midY - 4}
                        textAnchor="middle"
                        className="fill-secondary-light dark:fill-secondary-dark text-[10px] font-mono font-medium"
                      >
                        {edge.label}
                      </text>
                    )}
                  </g>
                );
              })}

              {nodes.map((node, index) => {
                const isSelected = selectedNode?.id === node.id;

                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x}, ${node.y})`}
                    onClick={() => setSelectedNode(node)}
                    className="cursor-pointer group"
                    style={{
                      transition: `opacity 200ms ease-out ${index * 50}ms, transform 200ms ease-out ${index * 50}ms`
                    }}
                  >
                    <rect
                      x="0"
                      y="0"
                      width="120"
                      height="48"
                      rx="8"
                      className={`fill-surface-light dark:fill-surface-dark stroke-[1.5] transition-colors ${
                        isSelected
                          ? 'stroke-accent'
                          : node.severity === 'critical'
                          ? 'stroke-threat/70'
                          : node.severity === 'safe'
                          ? 'stroke-safe/70'
                          : 'stroke-border-light dark:border-border-dark'
                      }`}
                    />

                    <circle
                      cx="12"
                      cy="16"
                      r="3.5"
                      fill={
                        node.severity === 'critical'
                          ? '#DC2626'
                          : node.severity === 'safe'
                          ? '#059669'
                          : '#D97706'
                      }
                    />

                    <text
                      x="22"
                      y="19"
                      className="fill-primary-light dark:fill-primary-dark text-[11px] font-semibold font-mono"
                    >
                      {node.label.length > 13 ? `${node.label.substring(0, 11)}...` : node.label}
                    </text>

                    <text
                      x="12"
                      y="36"
                      className="fill-secondary-light dark:fill-secondary-dark text-[9px] font-mono"
                    >
                      {node.sublabel.length > 18 ? `${node.sublabel.substring(0, 16)}...` : node.sublabel}
                    </text>
                  </g>
                );
              })}
            </svg>

            {selectedNode && (
              <div className="absolute bottom-2 left-2 max-w-[280px] p-2.5 rounded bg-surface-light/95 dark:bg-surface-dark/95 border border-border-light dark:border-border-dark text-[11px] font-mono space-y-1 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-primary-light dark:text-primary-dark">
                    {selectedNode.label}
                  </span>
                  <span className="text-[10px] text-accent uppercase">{selectedNode.type}</span>
                </div>
                {selectedNode.details && (
                  <div className="text-secondary-light dark:text-secondary-dark space-y-0.5">
                    {Object.entries(selectedNode.details).map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-2">
                        <span>{k}:</span>
                        <span className="text-primary-light dark:text-primary-dark truncate">{v}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <AudioScrubber
            totalSteps={totalSteps}
            currentStep={currentStep}
            onStepChange={setCurrentStep}
            stepLabels={stepLabels}
          />
        </div>
      </div>
    </div>
  );
};
