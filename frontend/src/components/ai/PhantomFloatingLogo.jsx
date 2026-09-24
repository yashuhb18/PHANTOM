import React from 'react';
import { Sparkles } from 'lucide-react';

export function PhantomFloatingLogo({ onClick, isOpen }) {
  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center group">
      {/* Tooltip on hover */}
      <div className="mr-3 px-3.5 py-1.5 rounded-full bg-[#141414] border border-[#FDE047]/30 text-xs font-semibold text-white shadow-2xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none transform translate-x-2 group-hover:translate-x-0 hidden sm:flex items-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-[#FDE047]" />
        <span>PHANTOM Copilot</span>
        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-[#FDE047] text-black font-extrabold">
          GLM-4
        </span>
      </div>

      {/* Circular Floating Trigger */}
      <button
        onClick={onClick}
        aria-label="Toggle PHANTOM Copilot"
        className={`relative w-14 h-14 rounded-full bg-[#0D0D0D] border-2 transition-all duration-300 flex items-center justify-center cursor-pointer shadow-2xl ${
          isOpen
            ? 'border-white/30 scale-95 shadow-black'
            : 'border-[#FDE047] hover:scale-105 hover:shadow-[0_0_25px_rgba(253,224,71,0.3)] shadow-[#FDE047]/15'
        }`}
      >
        {/* Glow Ring */}
        <span className="absolute -inset-1 rounded-full bg-[#FDE047]/20 blur-sm -z-10 group-hover:opacity-100 transition-opacity" />

        {/* Circular Phantom Logo */}
        <img
          src="/phantom-icon-yellow.png"
          alt="PHANTOM AI"
          className="w-8 h-8 object-contain select-none transition-transform group-hover:scale-105"
        />

        {/* Live Yellow Status Badge (Consistent brand color) */}
        <span className="absolute top-0 right-0 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FDE047] opacity-60" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FDE047] border-2 border-[#0D0D0D]" />
        </span>
      </button>
    </div>
  );
}
