import React from 'react';
import { Bot, Sparkles, Terminal, ShieldAlert } from 'lucide-react';

export function NarratorPanel({ messages }) {
  return (
    <div className="bg-[#141414] border border-white/[0.06] rounded-[28px] overflow-hidden flex flex-col h-[680px] shadow-2xl">
      <div className="p-4 px-6 border-b border-white/[0.06] flex items-center justify-between bg-[#0F0F0F]">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-[#FDE047] flex items-center justify-center text-black">
            <Sparkles className="w-3.5 h-3.5 fill-current" />
          </div>
          <span className="text-xs font-bold text-white uppercase tracking-wide">AI Forensic Threat Narrator</span>
        </div>
        <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#FDE047]/10 text-[#FDE047] border border-[#FDE047]/30">
          AUTONOMOUS COMMENTARY
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-3">
        {(!messages || messages.length === 0) ? (
          <div className="p-16 text-center text-neutral-500">
            <Bot className="w-10 h-10 text-neutral-700 mx-auto mb-3" />
            <p className="text-xs">Narrator standby. Awaiting real-time attack telemetry...</p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isCritical = msg.severity === 'CRITICAL' || msg.text?.includes('MATCH') || msg.text?.includes('DECEPTION') || msg.text?.includes('ISOLATION');
            return (
              <div
                key={idx}
                className={`p-4 rounded-[20px] border text-xs leading-relaxed transition-all ${
                  isCritical
                    ? 'bg-red-950/30 border-red-500/30 text-red-200'
                    : 'bg-[#0A0A0A] border-white/[0.06] text-neutral-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {isCritical ? (
                      <ShieldAlert className="w-4 h-4 text-red-400" />
                    ) : (
                      <Terminal className="w-4 h-4 text-[#FDE047]" />
                    )}
                    <span className="font-mono text-[10px] text-neutral-500">
                      {msg.timestamp ? msg.timestamp.slice(11, 19) : 'LIVE'}
                    </span>
                  </div>
                  {msg.session_id && (
                    <span className="font-mono text-[9px] px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-neutral-400">
                      {msg.session_id}
                    </span>
                  )}
                </div>
                <p className="font-sans text-xs leading-relaxed">{msg.text}</p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
