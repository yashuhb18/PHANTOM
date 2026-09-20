import React, { useState, useEffect } from 'react';
import { CanaryTrap } from '../types';
import { Plus, X } from 'lucide-react';
import { fetchCanaryTraps, deployCanaryTrap } from '../services/api';

export const DeceptionTrapsPage: React.FC = () => {
  const [traps, setTraps] = useState<CanaryTrap[]>([]);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState<boolean>(false);

  // New trap form state
  const [newTrapName, setNewTrapName] = useState<string>('');
  const [newTrapType, setNewTrapType] = useState<CanaryTrap['type']>('Honeytoken');
  const [newTrapLocation, setNewTrapLocation] = useState<string>('decoy_files/aws_prod_key.env');

  const loadTraps = async () => {
    try {
      const data = await fetchCanaryTraps();
      if (data && Array.isArray(data) && data.length > 0) {
        setTraps(
          data.map((t: any) => ({
            id: t.id,
            name: t.name,
            type: t.type,
            location: t.file_path,
            status: t.status,
            lastChecked: t.last_checked || 'Just now',
            trippedCount: t.trip_count || 0,
            tags: t.tags ? JSON.parse(t.tags) : ['Production']
          }))
        );
      }
    } catch (e) {
      console.error('Failed to load canary traps:', e);
    }
  };

  useEffect(() => {
    loadTraps();
  }, []);

  const handleDeployTrap = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTrapName.trim()) return;

    try {
      await deployCanaryTrap(newTrapName.trim(), newTrapType, newTrapLocation.trim());
      await loadTraps();
      setNewTrapName('');
      setIsDeployModalOpen(false);
    } catch (e) {
      console.error('Failed to deploy trap:', e);
    }
  };

  const getStatusColor = (status: CanaryTrap['status']) => {
    switch (status) {
      case 'tripped':
        return 'bg-threat';
      case 'nominal':
        return 'bg-safe';
      case 'arming':
        return 'bg-warning';
      default:
        return 'bg-secondary-light';
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Header / Action Row */}
      <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-card p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-section-header text-primary-light dark:text-primary-dark">
            Deception Traps & Honeytokens
          </h2>
          <p className="text-body text-secondary-light dark:text-secondary-dark mt-0.5">
            Real decoy files monitored on filesystem via Python watchdog. Touching any file fires an instant max alert.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsDeployModalOpen(true)}
          className="h-9 px-4 bg-accent hover:bg-accent-hover text-white rounded-md text-[13px] font-medium flex items-center gap-1.5 shrink-0 transition-colors shadow-none"
        >
          <Plus className="w-4 h-4" />
          <span>Deploy New Trap</span>
        </button>
      </div>

      {/* Traps Table with exact 56px row height */}
      <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-light dark:border-border-dark bg-base-light/50 dark:bg-base-dark/50 text-meta text-secondary-light dark:text-secondary-dark">
                <th className="py-2.5 px-3">TRAP NAME</th>
                <th className="py-2.5 px-3">TYPE</th>
                <th className="py-2.5 px-3">LOCATION / ARTIFACT</th>
                <th className="py-2.5 px-3">STATUS</th>
                <th className="py-2.5 px-3">TRIPS</th>
                <th className="py-2.5 px-3">LAST VERIFIED</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light dark:divide-border-dark">
              {traps.map((trap) => (
                <tr
                  key={trap.id}
                  className="h-[56px] hover:bg-base-light/40 dark:hover:bg-base-dark/40 transition-colors"
                >
                  <td className="px-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[13px] font-semibold text-primary-light dark:text-primary-dark">
                        {trap.name}
                      </span>
                      <span className="text-[10px] font-mono text-secondary-light dark:text-secondary-dark">
                        {trap.id}
                      </span>
                    </div>
                  </td>

                  <td className="px-3">
                    <span className="text-[12px] font-mono text-secondary-light dark:text-secondary-dark">
                      {trap.type}
                    </span>
                  </td>

                  <td className="px-3">
                    <span className="text-[12px] font-mono text-primary-light dark:text-primary-dark truncate max-w-[280px] block">
                      {trap.location}
                    </span>
                  </td>

                  <td className="px-3">
                    <div className="inline-flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${getStatusColor(trap.status)}`} />
                      <span className="text-[13px] text-primary-light dark:text-primary-dark font-medium capitalize">
                        {trap.status}
                      </span>
                    </div>
                  </td>

                  <td className="px-3">
                    <span
                      className={`font-mono text-[13px] ${
                        trap.trippedCount > 0 ? 'text-threat font-bold' : 'text-secondary-light dark:text-secondary-dark'
                      }`}
                    >
                      {trap.trippedCount}
                    </span>
                  </td>

                  <td className="px-3">
                    <span className="text-[12px] font-mono text-secondary-light dark:text-secondary-dark">
                      {trap.lastChecked}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Deploy New Trap Modal */}
      {isDeployModalOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-primary-light/20 dark:bg-black/60 transition-opacity"
            onClick={() => setIsDeployModalOpen(false)}
          />

          <div className="relative w-full max-w-md bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-card p-4 shadow-xl z-10 space-y-4">
            <div className="flex items-center justify-between border-b border-border-light dark:border-border-dark pb-3">
              <h3 className="text-section-header text-primary-light dark:text-primary-dark">
                Deploy Deception Trap
              </h3>
              <button
                type="button"
                onClick={() => setIsDeployModalOpen(false)}
                className="p-1 rounded text-secondary-light hover:text-primary-light dark:hover:text-primary-dark"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleDeployTrap} className="space-y-3">
              <div>
                <label className="text-meta text-secondary-light dark:text-secondary-dark block mb-1">
                  TRAP IDENTIFIER
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AWS_PROD_ROOT_KEY_DECOY"
                  value={newTrapName}
                  onChange={(e) => setNewTrapName(e.target.value)}
                  className="w-full h-9 px-3 bg-base-light dark:bg-base-dark border border-border-light dark:border-border-dark rounded-md text-[13px] font-mono text-primary-light dark:text-primary-dark focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="text-meta text-secondary-light dark:text-secondary-dark block mb-1">
                  DECEPTION VECTOR TYPE
                </label>
                <select
                  value={newTrapType}
                  onChange={(e) => setNewTrapType(e.target.value as CanaryTrap['type'])}
                  className="w-full h-9 px-3 bg-base-light dark:bg-base-dark border border-border-light dark:border-border-dark rounded-md text-[13px] font-mono text-primary-light dark:text-primary-dark focus:outline-none focus:border-accent"
                >
                  <option value="Honeytoken">Honeytoken (API Key / Token)</option>
                  <option value="AWS Secret">AWS Secret Credential</option>
                  <option value="Canary File">Canary File (.ssh/id_rsa, shadow.bak)</option>
                  <option value="Decoy Port">Decoy Port Honeypot Listener</option>
                  <option value="Fake AD User">Fake Active Directory Account</option>
                </select>
              </div>

              <div>
                <label className="text-meta text-secondary-light dark:text-secondary-dark block mb-1">
                  DEPLOYMENT PATH / FILENAME
                </label>
                <input
                  type="text"
                  required
                  value={newTrapLocation}
                  onChange={(e) => setNewTrapLocation(e.target.value)}
                  className="w-full h-9 px-3 bg-base-light dark:bg-base-dark border border-border-light dark:border-border-dark rounded-md text-[13px] font-mono text-primary-light dark:text-primary-dark focus:outline-none focus:border-accent"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsDeployModalOpen(false)}
                  className="h-9 px-3.5 border border-border-light dark:border-border-dark rounded-md text-[13px] font-medium text-secondary-light dark:text-secondary-dark hover:bg-base-light dark:hover:bg-base-dark"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-9 px-4 bg-accent hover:bg-accent-hover text-white rounded-md text-[13px] font-medium transition-colors"
                >
                  Deploy Trap
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
