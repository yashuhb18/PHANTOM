import React, { useState } from 'react';
import { Flame, Plus, FileText } from 'lucide-react';

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
    <div className="bg-[#141414] border border-white/[0.06] rounded-[28px] overflow-hidden shadow-2xl">
      <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between bg-[#0F0F0F]">
        <div className="flex items-center gap-2.5">
          <Flame className="w-4 h-4 text-[#FDE047]" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wide">Active Canary Decoys</h3>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#FDE047] hover:bg-[#FACC15] text-black text-xs font-bold shadow-md shadow-[#FDE047]/10 transition-all pill-button cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Deploy Trap</span>
        </button>
      </div>

      <div className="divide-y divide-white/[0.04]">
        {(!traps || traps.length === 0) ? (
          <div className="p-12 text-center text-xs text-neutral-500">
            No canary traps deployed.
          </div>
        ) : (
          traps.map((trap) => (
            <div key={trap.id} className="p-4 px-6 hover:bg-white/[0.02] transition-colors flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-neutral-900 border border-white/[0.08] text-[#FDE047] flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-white font-mono">{trap.filename}</span>
                    <span className="text-[10px] font-mono bg-neutral-900 px-2 py-0.5 rounded-full border border-white/[0.08] text-neutral-400">
                      {trap.file_type}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-0.5">{trap.description || 'Honeypot lure file'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold border ${
                  trap.hit_count > 0
                    ? 'bg-red-500/15 text-red-400 border-red-500/30'
                    : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
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
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#141414] rounded-[32px] border border-white/15 shadow-2xl max-w-md w-full p-8 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-white tracking-tight mb-5">Deploy Honeypot Canary Decoy</h3>
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1.5 font-medium">Decoy Filename</label>
                <input
                  type="text"
                  placeholder="e.g. prod_db_backup.sql, id_rsa_backup"
                  value={filename}
                  onChange={(e) => setFilename(e.target.value)}
                  className="w-full p-3 bg-[#0A0A0A] border border-white/[0.1] rounded-2xl focus:outline-none focus:border-[#FDE047] text-white placeholder-neutral-600 font-mono text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1.5 font-medium">Lure Category</label>
                <select
                  value={fileType}
                  onChange={(e) => setFileType(e.target.value)}
                  className="w-full p-3 bg-[#0A0A0A] border border-white/[0.1] rounded-2xl focus:outline-none focus:border-[#FDE047] text-white text-xs"
                >
                  <option value="AWS_CREDENTIALS">AWS Credentials (.aws/credentials)</option>
                  <option value="PASSWORDS_SPREADSHEET">Passwords Spreadsheet (.xlsx)</option>
                  <option value="SSH_KEY">SSH Private Key (id_rsa)</option>
                  <option value="KUBERNETES_CONFIG">Kubernetes Token / Config</option>
                  <option value="DATABASE_DUMP">SQL Database Dump</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1.5 font-medium">Lure Description</label>
                <input
                  type="text"
                  placeholder="e.g. Production root credential decoy with kernel tripwire"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 bg-[#0A0A0A] border border-white/[0.1] rounded-2xl focus:outline-none focus:border-[#FDE047] text-white placeholder-neutral-600 text-xs"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-full border border-white/[0.1] bg-white/[0.04] text-neutral-300 hover:text-white hover:bg-white/[0.08] transition-all pill-button cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#FDE047] hover:bg-[#FACC15] text-black font-bold shadow-md shadow-[#FDE047]/10 transition-all pill-button cursor-pointer"
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
