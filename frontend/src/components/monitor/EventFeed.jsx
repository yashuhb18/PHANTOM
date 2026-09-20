import React, { useState } from 'react';
import { AlertBadge } from '../common/AlertBadge';
import { Filter, Trash2 } from 'lucide-react';

export function EventFeed({ events, onClear }) {
  const [filter, setFilter] = useState('ALL');

  const filtered = (events || []).filter((e) => {
    if (filter === 'ALL') return true;
    if (filter === 'CRITICAL') return e.severity === 'CRITICAL' || e.severity === 'HIGH';
    return e.source === filter;
  });

  return (
    <div className="bg-white border border-[#E7E5E4] rounded-xl overflow-hidden flex flex-col h-[680px]">
      <div className="p-4 border-b border-[#E7E5E4] flex items-center justify-between bg-[#FAFAF9]">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#1C1917]">Raw Telemetry Feed</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white text-[#78716C] border border-[#E7E5E4]">
            {filtered.length} events
          </span>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="text-xs bg-white border border-[#E7E5E4] rounded-lg px-2.5 py-1 text-[#78716C] focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">All Subsystems</option>
            <option value="CRITICAL">High/Critical Only</option>
            <option value="USB">USB Subsystem</option>
            <option value="KEYSTROKE">Keystroke Subsystem</option>
            <option value="PROCESS">Process Subsystem</option>
            <option value="CANARY_DECEPTION">Deception Layer</option>
          </select>
          {onClear && (
            <button
              onClick={onClear}
              title="Clear feed"
              className="p-1.5 text-[#A8A29E] hover:text-[#1C1917] rounded-lg hover:bg-white border border-transparent hover:border-[#E7E5E4]"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-[#E7E5E4] font-mono text-xs">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-[#78716C]">
            No telemetry events match current filter.
          </div>
        ) : (
          filtered.map((evt, idx) => (
            <div key={evt.event_id || idx} className="p-3.5 hover:bg-[#FAFAF9] transition-colors">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-[#A8A29E] text-[11px]">{evt.timestamp?.slice(11, 23)}</span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] bg-[#F5F5F4] text-[#78716C] border border-[#E7E5E4]">
                    {evt.source}
                  </span>
                  <span className="font-semibold text-[#1C1917]">{evt.event_type}</span>
                </div>
                <AlertBadge severity={evt.severity} />
              </div>

              {evt.data && (
                <div className="bg-[#FAFAF9] border border-[#E7E5E4] rounded p-2 text-[11px] text-[#44403C] overflow-x-auto">
                  <pre className="whitespace-pre-wrap">{JSON.stringify(evt.data, null, 2)}</pre>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
