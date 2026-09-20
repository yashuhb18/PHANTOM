import React from 'react';
import { Bot, Sparkles, Terminal, ShieldAlert } from 'lucide-react';

export function NarratorPanel({ messages }) {
  return (
    <div className="bg-white border border-[#E7E5E4] rounded-xl overflow-hidden flex flex-col h-[680px]">
      <div className="p-4 border-b border-[#E7E5E4] flex items-center justify-between bg-[#FAFAF9]">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-indigo-600 flex items-center justify-center text-white">
            <Sparkles className="w-3 h-3" />
          </div>
          <span className="text-xs font-semibold text-[#1C1917]">AI Forensic Threat Narrator</span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
          AUTONOMOUS COMMENTARY
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {(!messages || messages.length === 0) ? (
          <div className="p-12 text-center text-[#78716C]">
            <Bot className="w-8 h-8 text-[#A8A29E] mx-auto mb-2" />
            <p className="text-xs">Narrator standby. Awaiting real-time attack telemetry...</p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isCritical = msg.severity === 'CRITICAL' || msg.text?.includes('MATCH') || msg.text?.includes('DECEPTION');
            return (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border text-xs leading-relaxed transition-all ${
                  isCritical
                    ? 'bg-red-50/70 border-red-200 text-red-950 font-medium shadow-xs'
                    : 'bg-[#FAFAF9] border-[#E7E5E4] text-[#1C1917]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    {isCritical ? (
                      <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
                    ) : (
                      <Terminal className="w-3.5 h-3.5 text-indigo-600" />
                    )}
                    <span className="font-mono text-[10px] text-[#78716C]">
                      {msg.timestamp ? msg.timestamp.slice(11, 19) : 'LIVE'}
                    </span>
                  </div>
                  {msg.session_id && (
                    <span className="font-mono text-[9px] px-1.5 py-0.2 rounded bg-white border border-[#E7E5E4] text-[#78716C]">
                      {msg.session_id}
                    </span>
                  )}
                </div>
                <p className="font-sans">{msg.text}</p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
