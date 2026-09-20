import React from 'react';
import { Usb, HardDrive, Calendar, ShieldAlert } from 'lucide-react';
import { AlertBadge } from '../common/AlertBadge';

export function DeviceInfo({ session }) {
  if (!session) return null;

  return (
    <div className="bg-white border border-[#E7E5E4] rounded-xl p-5">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600">
            <Usb className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#1C1917]">{session.device_name}</h2>
            <p className="text-xs font-mono text-[#78716C]">
              VID:{session.vendor_id} • PID:{session.product_id} • S/N:{session.serial_number || 'N/A'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-[#78716C]">RISK SCORE:</span>
          <span className={`text-base font-bold font-mono ${session.risk_score >= 60 ? 'text-red-600' : 'text-[#1C1917]'}`}>
            {session.risk_score}/100
          </span>
          <AlertBadge severity={session.risk_score >= 60 ? 'CRITICAL' : session.risk_score >= 30 ? 'HIGH' : 'LOW'} />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5 pt-4 border-t border-[#E7E5E4] text-xs">
        <div>
          <span className="text-[#A8A29E] block mb-0.5">Session ID</span>
          <span className="font-mono font-medium text-[#1C1917]">{session.session_id}</span>
        </div>
        <div>
          <span className="text-[#A8A29E] block mb-0.5">Physical Mount Point</span>
          <span className="font-mono font-medium text-[#1C1917]">{session.mount_point || 'HID / Virtual CDC'}</span>
        </div>
        <div>
          <span className="text-[#A8A29E] block mb-0.5">Insertion Time</span>
          <span className="font-mono font-medium text-[#1C1917]">{session.inserted_at?.replace('T', ' ')?.slice(0, 19)}</span>
        </div>
        <div>
          <span className="text-[#A8A29E] block mb-0.5">Session Status</span>
          <span className="font-mono font-semibold text-indigo-700">{session.status}</span>
        </div>
      </div>
    </div>
  );
}
