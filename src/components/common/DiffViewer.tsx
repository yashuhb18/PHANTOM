import React from 'react';
import { ThreatFingerprint } from '../../types';

interface DiffViewerProps {
  fingerprint: ThreatFingerprint;
  selectedSessionId: string;
}

export const DiffViewer: React.FC<DiffViewerProps> = ({
  fingerprint,
  selectedSessionId
}) => {
  return (
    <div className="space-y-4">
      {/* Session Header Card */}
      <div className="p-2.5 rounded-card bg-base-light dark:bg-base-dark border border-border-light dark:border-border-dark flex items-center justify-between">
        <div>
          <div className="text-meta text-secondary-light dark:text-secondary-dark">
            TARGET SESSION
          </div>
          <div className="text-body font-mono font-semibold text-primary-light dark:text-primary-dark">
            {selectedSessionId}
          </div>
        </div>
        <div className="text-right">
          <div className="text-meta text-secondary-light dark:text-secondary-dark">
            SIMILARITY SCORE
          </div>
          <div className="text-body font-mono font-bold text-accent">
            {fingerprint.similarity}%
          </div>
        </div>
      </div>

      {/* Signature Diff Sections */}
      <div>
        <h4 className="text-meta text-secondary-light dark:text-secondary-dark mb-2">
          BEHAVIORAL SIGNATURE ALIGNMENT
        </h4>
        <div className="space-y-2">
          {fingerprint.signatures.map((sig, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-card border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark space-y-2"
            >
              <div className="text-[12px] font-medium text-primary-light dark:text-primary-dark flex items-center justify-between">
                <span>{sig.rule}</span>
                <span className="text-safe text-[11px] font-mono">MATCH</span>
              </div>

              {/* Side-by-side comparison */}
              <div className="grid grid-cols-1 gap-2 pt-1 border-t border-border-light dark:border-border-dark">
                <div className="p-2 rounded bg-base-light dark:bg-base-dark font-mono text-[11px] leading-relaxed">
                  <span className="text-secondary-light dark:text-secondary-dark block text-[10px] uppercase tracking-wider mb-0.5">
                    Observed in {selectedSessionId}:
                  </span>
                  <span className="text-threat break-all">{sig.targetMatch}</span>
                </div>
                <div className="p-2 rounded bg-base-light dark:bg-base-dark font-mono text-[11px] leading-relaxed">
                  <span className="text-secondary-light dark:text-secondary-dark block text-[10px] uppercase tracking-wider mb-0.5">
                    Actor Baseline ({fingerprint.actor}):
                  </span>
                  <span className="text-accent break-all">{sig.baselineMatch}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Syscall Frequency Distribution */}
      <div>
        <h4 className="text-meta text-secondary-light dark:text-secondary-dark mb-2">
          SYSCALL FREQUENCY PROFILE (%)
        </h4>
        <div className="p-2.5 rounded-card border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark space-y-3">
          {fingerprint.syscallProfile.map((sys, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-primary-light dark:text-primary-dark font-semibold">
                  {sys.call}
                </span>
                <span className="text-secondary-light dark:text-secondary-dark">
                  Obs: <strong className="text-primary-light dark:text-primary-dark">{sys.observedFreq}%</strong> / Base: {sys.baselineFreq}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-base-light dark:bg-base-dark rounded-full overflow-hidden flex">
                <div
                  className="h-full bg-accent"
                  style={{ width: `${sys.observedFreq}%` }}
                  title={`Observed: ${sys.observedFreq}%`}
                />
                <div
                  className="h-full bg-secondary-light/40 dark:bg-secondary-dark/40"
                  style={{ width: `${Math.max(0, sys.baselineFreq - sys.observedFreq)}%` }}
                  title={`Baseline: ${sys.baselineFreq}%`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
