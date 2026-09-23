import React from 'react';
import { Dna } from 'lucide-react';
import { AlertBadge } from '../common/AlertBadge';

export function FingerprintList({ fingerprints, selectedId, onSelect }) {
  if (!fingerprints || fingerprints.length === 0) {
    return (
      <div className="bg-[#141414] border border-white/[0.06] rounded-[28px] p-8 text-center text-xs text-neutral-500">
        No Attack DNA fingerprints cataloged yet.
      </div>
    );
  }

  return (
    <div className="bg-[#141414] border border-white/[0.06] rounded-[28px] overflow-hidden shadow-2xl">
      <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between bg-[#0F0F0F]">
        <div className="flex items-center gap-2.5">
          <Dna className="w-4 h-4 text-[#FDE047]" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wide">Cataloged Attack DNA</h3>
        </div>
        <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-white/[0.04] text-neutral-300 border border-white/[0.08]">
          {fingerprints.length} Signatures
        </span>
      </div>

      <div className="divide-y divide-white/[0.04]">
        {fingerprints.map((fp) => {
          const isSelected = selectedId === fp.session_id;
          return (
            <div
              key={fp.session_id}
              onClick={() => onSelect && onSelect(fp)}
              className={`p-5 px-6 cursor-pointer transition-colors ${
                isSelected ? 'bg-[#FDE047]/10 border-l-4 border-[#FDE047]' : 'hover:bg-white/[0.02]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="font-bold text-xs text-white">{fp.cluster_family}</span>
                  <span className="text-[10px] font-mono bg-neutral-900 px-2 py-0.5 rounded-full border border-white/[0.08] text-neutral-400">
                    DNA: {fp.dna_hash}
                  </span>
                </div>
                <AlertBadge severity={fp.risk_score >= 60 ? 'CRITICAL' : 'HIGH'} />
              </div>

              <div className="flex items-center gap-2 mt-2 text-[11px] text-neutral-400">
                <span className="font-mono text-neutral-500">{fp.session_id}</span>
                <span>•</span>
                <span>{fp.device_name || 'USB Peripheral'}</span>
              </div>

              {fp.tokens && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {fp.tokens.map((token, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-neutral-900 text-neutral-300 border border-white/[0.06]"
                    >
                      {token}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
