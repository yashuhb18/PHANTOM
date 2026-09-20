import React from 'react';
import { Dna, ShieldAlert, Layers } from 'lucide-react';
import { AlertBadge } from '../common/AlertBadge';

export function FingerprintList({ fingerprints, selectedId, onSelect }) {
  if (!fingerprints || fingerprints.length === 0) {
    return (
      <div className="bg-white border border-[#E7E5E4] rounded-xl p-8 text-center text-xs text-[#78716C]">
        No Attack DNA fingerprints cataloged yet.
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E7E5E4] rounded-xl overflow-hidden">
      <div className="p-4 border-b border-[#E7E5E4] flex items-center justify-between bg-[#FAFAF9]">
        <div className="flex items-center gap-2">
          <Dna className="w-4 h-4 text-indigo-600" />
          <h3 className="text-xs font-semibold text-[#1C1917]">Cataloged Attack DNA Fingerprints</h3>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-[#78716C] border border-[#E7E5E4]">
          {fingerprints.length} Signatures
        </span>
      </div>

      <div className="divide-y divide-[#E7E5E4]">
        {fingerprints.map((fp) => {
          const isSelected = selectedId === fp.session_id;
          return (
            <div
              key={fp.session_id}
              onClick={() => onSelect && onSelect(fp)}
              className={`p-4 cursor-pointer transition-colors ${
                isSelected ? 'bg-indigo-50/70 border-l-4 border-indigo-600' : 'hover:bg-[#FAFAF9]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs text-[#1C1917]">{fp.cluster_family}</span>
                  <span className="text-[10px] font-mono bg-[#F5F5F4] px-1.5 py-0.2 rounded border border-[#E7E5E4] text-[#78716C]">
                    DNA: {fp.dna_hash}
                  </span>
                </div>
                <AlertBadge severity={fp.risk_score >= 60 ? 'CRITICAL' : 'HIGH'} />
              </div>

              <div className="flex items-center gap-2 mt-2 text-[11px] text-[#78716C]">
                <span className="font-mono text-[#A8A29E]">{fp.session_id}</span>
                <span>•</span>
                <span>{fp.device_name || 'USB Peripheral'}</span>
              </div>

              {fp.tokens && (
                <div className="flex flex-wrap gap-1 mt-2.5">
                  {fp.tokens.map((token, idx) => (
                    <span
                      key={idx}
                      className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-white text-[#44403C] border border-[#E7E5E4]"
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
