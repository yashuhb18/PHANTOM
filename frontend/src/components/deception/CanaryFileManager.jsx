import React, { useState } from 'react';
import { Flame, Plus, ShieldCheck, FileText, CheckCircle } from 'lucide-react';

export function CanaryFileManager({ traps, onDeployTrap }) {
  const [showModal, setShowModal] = useState(false);
  const [filename, setFilename] = useState('');
  const [fileType, setFileType] = useState('AWS_CREDENTIALS');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!filename) return;
    onDeployTrap && onDeployTrap({ filename, file_type: fileType, description });
    setFilename('');
    setDescription('');
    setShowModal(false);
  };

  return (
    <div className="bg-white border border-[#E7E5E4] rounded-xl overflow-hidden">
      <div className="p-4 border-b border-[#E7E5E4] flex items-center justify-between bg-[#FAFAF9]">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-amber-500" />
          <h3 className="text-xs font-semibold text-[#1C1917]">Active Deception Decoy Traps</h3>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium shadow-xs transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Deploy Trap</span>
        </button>
      </div>

      <div className="divide-y divide-[#E7E5E4]">
        {(!traps || traps.length === 0) ? (
          <div className="p-8 text-center text-xs text-[#78716C]">
            No canary traps deployed.
          </div>
        ) : (
          traps.map((trap) => (
            <div key={trap.id} className="p-4 hover:bg-[#FAFAF9] transition-colors flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-700">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-[#1C1917] font-mono">{trap.filename}</span>
                    <span className="text-[10px] font-mono bg-[#F5F5F4] px-1.5 py-0.2 rounded border border-[#E7E5E4] text-[#78716C]">
                      {trap.file_type}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#78716C] mt-0.5">{trap.description || 'Honeypot lure file'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border ${
                  trap.hit_count > 0 ? 'bg-red-50 text-red-700 border-red-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}>
                  {trap.hit_count > 0 ? `${trap.hit_count} HITS TRIPPED` : 'ARMED / UNTOUCHED'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Deploy Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#E7E5E4] shadow-xl max-w-md w-full p-6">
            <h3 className="text-sm font-bold text-[#1C1917] mb-3">Deploy New Honeypot Canary Decoy</h3>
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#78716C] mb-1 font-medium">Decoy Filename</label>
                <input
                  type="text"
                  placeholder="e.g. prod_db_backup.sql, id_rsa_backup"
                  value={filename}
                  onChange={(e) => setFilename(e.target.value)}
                  className="w-full p-2 border border-[#E7E5E4] rounded-lg focus:outline-none focus:border-indigo-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-[#78716C] mb-1 font-medium">Lure Category</label>
                <select
                  value={fileType}
                  onChange={(e) => setFileType(e.target.value)}
                  className="w-full p-2 border border-[#E7E5E4] rounded-lg focus:outline-none focus:border-indigo-500"
                >
                  <option value="AWS_CREDENTIALS">AWS Credentials</option>
                  <option value="PASSWORDS_SPREADSHEET">Passwords Spreadsheet (.xlsx)</option>
                  <option value="SSH_KEY">SSH Private Key</option>
                  <option value="KUBERNETES_CONFIG">Kubernetes Token / Config</option>
                  <option value="DATABASE_DUMP">SQL Database Dump</option>
                </select>
              </div>

              <div>
                <label className="block text-[#78716C] mb-1 font-medium">Lure Description</label>
                <input
                  type="text"
                  placeholder="e.g. Production root credential decoy with tripwire"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 border border-[#E7E5E4] rounded-lg focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E7E5E4]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-[#E7E5E4] text-[#78716C] hover:bg-[#F5F5F4]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
                >
                  Deploy to Filesystem
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
