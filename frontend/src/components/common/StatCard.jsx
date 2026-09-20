import React from 'react';

export function StatCard({ title, value, subtitle, icon: Icon, trend, variant = 'default' }) {
  const variantStyles = {
    default: 'text-[#1C1917]',
    critical: 'text-red-600',
    warning: 'text-amber-600',
    success: 'text-emerald-600',
    indigo: 'text-indigo-600',
  };

  return (
    <div className="bg-white border border-[#E7E5E4] rounded-xl p-5 hover:border-[#D6D3D1] transition-colors">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-[#78716C]">{title}</span>
        {Icon && (
          <div className="p-2 rounded-lg bg-[#FAFAF9] border border-[#E7E5E4] text-[#78716C]">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className={`text-2xl font-semibold tracking-tight ${variantStyles[variant] || variantStyles.default}`}>
          {value}
        </span>
        {trend && (
          <span className="text-[11px] font-mono text-[#78716C]">
            {trend}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-1 text-xs text-[#A8A29E] truncate">{subtitle}</p>
      )}
    </div>
  );
}
