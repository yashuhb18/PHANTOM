import React from 'react';
import { Usb, AlertTriangle, ShieldCheck, ArrowRight } from 'lucide-react';
import { AlertBadge } from '../common/AlertBadge';

export function ActiveSessions({ sessions, onSelectSession }) {
  if (!sessions || sessions.length === 0) {
    return (
      <div className="bg-white border border-[#E7E5E4] rounded-xl p-6 text-center text-[#78716C]">
        <Usb className="w-8 h-8 text-[#A8A29E] mx-auto mb-2" />
        <p className="text-xs">No active USB peripheral sessions registered.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E7E5E4] rounded-xl overflow-hidden">
      <div className="px-5 py-3.5 border-b border-[#E7E5E4] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-semibold text-[#1C1917]">Monitored USB Sessions</h3>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#F5F5F4] text-[#78716C] border border-[#E7E5E4]">
            {sessions.length}
          </span>
        </div>
      </div>

      <div className="divide-y divide-[#E7E5E4]">
        {sessions.map((sess) => {
          const isCritical = sess.risk_score >= 60;
          return (
            <div
              key={sess.session_id}
              onClick={() => onSelectSession && onSelectSession(sess.session_id)}
              className="p-4 hover:bg-[#FAFAF9] transition-colors cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg border ${isCritical ? 'bg-red-50 border-red-200 text-red-600' : 'bg-[#FAFAF9] border-[#E7E5E4] text-[#78716C]'}`}>
                  <Usb className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#1C1917]">{sess.device_name}</span>
                    <span className="text-[10px] font-mono text-[#78716C] bg-[#F5F5F4] px-1.5 py-0.2 rounded border border-[#E7E5E4]">
                      VID:{sess.vendor_id} PID:{sess.product_id}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] font-mono text-[#A8A29E]">{sess.session_id}</span>
                    <span className="text-[11px] text-[#A8A29E]">•</span>
                    <span className="text-[11px] text-[#78716C]">{sess.inserted_at?.slice(11, 19)} UTC</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <span className={`text-xs font-mono font-bold ${isCritical ? 'text-red-600' : 'text-[#1C1917]'}`}>
                      {sess.risk_score}/100
                    </span>
                    <AlertBadge severity={isCritical ? 'CRITICAL' : sess.risk_score >= 30 ? 'HIGH' : 'LOW'} />
                  </div>
                  <span className="text-[10px] font-mono text-[#A8A29E]">
                    {sess.event_count || 0} events
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-[#A8A29E]" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
