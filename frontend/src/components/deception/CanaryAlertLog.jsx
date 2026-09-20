import React from 'react';
import { AlertOctagon, Terminal } from 'lucide-react';
import { AlertBadge } from '../common/AlertBadge';

export function CanaryAlertLog({ hits }) {
  return (
    <div className="bg-white border border-[#E7E5E4] rounded-xl overflow-hidden">
      <div className="p-4 border-b border-[#E7E5E4] flex items-center justify-between bg-[#FAFAF9]">
        <div className="flex items-center gap-2">
          <AlertOctagon className="w-4 h-4 text-red-600" />
          <h3 className="text-xs font-semibold text-[#1C1917]">Canary Tripwire Audit Log</h3>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200">
          ZERO FALSE POSITIVE
        </span>
      </div>

      <div className="divide-y divide-[#E7E5E4]">
        {(!hits || hits.length === 0) ? (
          <div className="p-8 text-center text-xs text-[#78716C]">
            No canary tripwire breaches recorded. Deception perimeter secure.
          </div>
        ) : (
          hits.map((hit) => (
            <div key={hit.id} className="p-4 hover:bg-[#FAFAF9] transition-colors flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-red-600 font-mono">TRIP: {hit.filename}</span>
                  <span className="text-[10px] font-mono bg-red-50 text-red-700 px-1.5 py-0.2 rounded border border-red-200 font-bold">
                    {hit.action}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1 text-[11px] text-[#78716C]">
                  <span className="font-mono">{hit.timestamp?.slice(11, 19)} UTC</span>
                  <span>•</span>
                  <span>Process: <code>{hit.process_name} (PID:{hit.process_id})</code></span>
                  {hit.session_id && (
                    <>
                      <span>•</span>
                      <span className="font-mono text-indigo-600">{hit.session_id}</span>
                    </>
                  )}
                </div>
              </div>

              <AlertBadge severity="CRITICAL" />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
