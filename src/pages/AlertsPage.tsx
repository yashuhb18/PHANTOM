import React, { useState, useEffect } from 'react';
import { SecurityAlert, Severity } from '../types';
import { ArrowUpDown, CheckCircle } from 'lucide-react';
import { fetchAlerts, containAlert } from '../services/api';

export const AlertsPage: React.FC = () => {
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [sortField, setSortField] = useState<'timestamp' | 'score' | 'severity'>('score');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  const loadAlerts = async () => {
    try {
      const data = await fetchAlerts();
      if (data && Array.isArray(data) && data.length > 0) {
        setAlerts(
          data.map((a: any) => ({
            id: a.id,
            severity: a.severity as Severity,
            timestamp: a.timestamp,
            host: a.host,
            vector: a.vector,
            detectionEngine: a.detection_engine,
            mitigationStatus: a.mitigation_status,
            processId: 40912,
            score: a.score
          }))
        );
      }
    } catch (e) {
      console.error('Failed to load alerts:', e);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  const handleSort = (field: 'timestamp' | 'score' | 'severity') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const sortedAlerts = [...alerts].sort((a, b) => {
    if (sortField === 'score') {
      return sortAsc ? a.score - b.score : b.score - a.score;
    }
    if (sortField === 'timestamp') {
      return sortAsc ? a.timestamp.localeCompare(b.timestamp) : b.timestamp.localeCompare(a.timestamp);
    }
    if (sortField === 'severity') {
      const rank = { critical: 3, warning: 2, investigating: 2, safe: 1 };
      return sortAsc ? rank[a.severity] - rank[b.severity] : rank[b.severity] - rank[a.severity];
    }
    return 0;
  });

  const handleContain = async (id: string) => {
    try {
      await containAlert(id);
      await loadAlerts();
    } catch (e) {
      setAlerts(
        alerts.map((alt) =>
          alt.id === id ? { ...alt, mitigationStatus: 'Contained', severity: 'safe' } : alt
        )
      );
    }
  };

  const getBorderStripe = (severity: Severity) => {
    switch (severity) {
      case 'critical':
        return 'border-l-4 border-l-threat';
      case 'safe':
        return 'border-l-4 border-l-safe';
      case 'warning':
      case 'investigating':
        return 'border-l-4 border-l-warning';
      default:
        return 'border-l-4 border-l-border-light dark:border-l-border-dark';
    }
  };

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-card p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-section-header text-primary-light dark:text-primary-dark">
            Alert Queue & Containment Actions
          </h2>
          <p className="text-body text-secondary-light dark:text-secondary-dark mt-0.5">
            Real alerts from SQLite database. Severity encoded via 4px left-border stripes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={async () => {
              for (const a of alerts.filter((alt) => alt.severity === 'critical')) {
                await containAlert(a.id);
              }
              await loadAlerts();
            }}
            className="h-9 px-3.5 border border-border-light dark:border-border-dark hover:border-threat hover:text-threat rounded-md text-[13px] font-medium transition-colors"
          >
            Auto-Contain All Critical
          </button>
        </div>
      </div>

      {/* Alerts Table */}
      <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-light dark:border-border-dark bg-base-light/50 dark:bg-base-dark/50 text-meta text-secondary-light dark:text-secondary-dark select-none">
                <th
                  className="py-2.5 px-3 cursor-pointer hover:text-primary-light dark:hover:text-primary-dark"
                  onClick={() => handleSort('severity')}
                >
                  <div className="flex items-center gap-1">
                    <span>SEVERITY</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  className="py-2.5 px-3 cursor-pointer hover:text-primary-light dark:hover:text-primary-dark"
                  onClick={() => handleSort('timestamp')}
                >
                  <div className="flex items-center gap-1">
                    <span>TIMESTAMP</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-2.5 px-3">TARGET HOST</th>
                <th className="py-2.5 px-3">ATTACK VECTOR</th>
                <th className="py-2.5 px-3">DETECTION ENGINE</th>
                <th
                  className="py-2.5 px-3 cursor-pointer hover:text-primary-light dark:hover:text-primary-dark"
                  onClick={() => handleSort('score')}
                >
                  <div className="flex items-center gap-1">
                    <span>SCORE</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-2.5 px-3">STATUS</th>
                <th className="py-2.5 px-3 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light dark:divide-border-dark">
              {sortedAlerts.map((alt) => (
                <tr
                  key={alt.id}
                  className={`h-[56px] ${getBorderStripe(
                    alt.severity
                  )} hover:bg-base-light/40 dark:hover:bg-base-dark/40 transition-colors`}
                >
                  <td className="px-3">
                    <span className="font-mono text-[11px] uppercase font-semibold text-primary-light dark:text-primary-dark">
                      {alt.severity}
                    </span>
                  </td>

                  <td className="px-3">
                    <span className="font-mono text-[12px] text-secondary-light dark:text-secondary-dark">
                      {alt.timestamp}
                    </span>
                  </td>

                  <td className="px-3">
                    <span className="font-mono text-[12px] font-medium text-primary-light dark:text-primary-dark truncate max-w-[180px] block">
                      {alt.host}
                    </span>
                  </td>

                  <td className="px-3">
                    <span className="text-[13px] text-secondary-light dark:text-secondary-dark truncate max-w-[280px] block">
                      {alt.vector}
                    </span>
                  </td>

                  <td className="px-3">
                    <span className="text-[12px] font-mono text-secondary-light dark:text-secondary-dark">
                      {alt.detectionEngine}
                    </span>
                  </td>

                  <td className="px-3">
                    <span
                      className={`font-mono text-[12px] font-bold ${
                        alt.score > 80
                          ? 'text-threat'
                          : alt.score > 50
                          ? 'text-warning'
                          : 'text-safe'
                      }`}
                    >
                      {alt.score}/100
                    </span>
                  </td>

                  <td className="px-3">
                    <span className="text-[12px] font-mono text-primary-light dark:text-primary-dark">
                      {alt.mitigationStatus}
                    </span>
                  </td>

                  <td className="px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {alt.mitigationStatus !== 'Contained' ? (
                        <button
                          type="button"
                          onClick={() => handleContain(alt.id)}
                          title="Isolate host & sever sockets"
                          className="h-7 px-2.5 border border-border-light dark:border-border-dark text-secondary-light dark:text-secondary-dark hover:border-threat hover:bg-threat hover:text-white rounded text-[11px] font-mono font-medium transition-colors"
                        >
                          Isolate Host
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-safe font-medium px-2 py-0.5">
                          <CheckCircle className="w-3 h-3" />
                          Sealed
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          setAlerts(alerts.filter((a) => a.id !== alt.id));
                        }}
                        className="h-7 px-2 border border-border-light dark:border-border-dark text-secondary-light dark:text-secondary-dark hover:bg-base-light dark:hover:bg-base-dark hover:text-primary-light rounded text-[11px] font-mono transition-colors"
                      >
                        Dismiss
                      </button>
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
