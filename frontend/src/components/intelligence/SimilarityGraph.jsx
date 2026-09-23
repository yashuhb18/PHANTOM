import React from 'react';
import { GitCompare, CheckCircle, AlertTriangle } from 'lucide-react';

export function SimilarityGraph({ comparison }) {
  if (!comparison) {
    return (
      <div className="bg-[#141414] border border-white/[0.06] rounded-[28px] p-12 text-center text-xs text-neutral-500">
        Select two sessions or run Attack #2 to compare behavioral Attack DNA fingerprints.
      </div>
    );
  }

  const percentage = Math.round(comparison.similarity_score * 100);
  const isMatch = comparison.is_match;

  return (
    <div className="bg-[#141414] border border-white/[0.06] rounded-[28px] p-6 shadow-2xl">
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <GitCompare className="w-4 h-4 text-[#FDE047]" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wide">Jaccard Behavioral Similarity</h3>
        </div>
        <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold border ${
          isMatch
            ? 'bg-red-500/15 text-red-400 border-red-500/30'
            : 'bg-white/[0.04] text-neutral-300 border-white/[0.08]'
        }`}>
          {comparison.verdict}
        </span>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-8 my-8">
        {/* Donut similarity indicator */}
        <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-neutral-900"
              strokeWidth="3.5"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className={isMatch ? 'text-[#FDE047]' : 'text-neutral-400'}
              strokeDasharray={`${percentage}, 100`}
              strokeWidth="3.5"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className={`text-3xl font-black font-mono tracking-tight ${isMatch ? 'text-[#FDE047]' : 'text-white'}`}>
              {percentage}%
            </span>
            <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest mt-0.5">SIMILARITY</span>
          </div>
        </div>

        {/* Sessions compared */}
        <div className="flex-1 w-full space-y-3">
          <div className="p-3.5 bg-[#0A0A0A] border border-white/[0.06] rounded-2xl text-xs">
            <span className="text-neutral-500 block text-[10px] font-mono uppercase mb-0.5">SOURCE SESSION</span>
            <span className="font-mono font-bold text-white">{comparison.source_session_id}</span>
          </div>
          <div className="p-3.5 bg-[#0A0A0A] border border-white/[0.06] rounded-2xl text-xs">
            <span className="text-neutral-500 block text-[10px] font-mono uppercase mb-0.5">TARGET SESSION (DIFFERENT HARDWARE)</span>
            <span className="font-mono font-bold text-white">{comparison.target_session_id}</span>
          </div>
        </div>
      </div>

      {/* Common vs Divergent Behavioral Subgraphs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-5 border-t border-white/[0.06]">
        <div>
          <h4 className="text-xs font-bold text-emerald-400 mb-2.5 flex items-center gap-1.5 uppercase">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Shared Behavioral Tokens ({comparison.common_subgraphs?.length || 0})</span>
          </h4>
          <div className="space-y-1.5">
            {comparison.common_subgraphs?.map((token, idx) => (
              <div key={idx} className="p-2 px-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[10px] font-mono text-emerald-300">
                {token}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold text-neutral-400 mb-2.5 flex items-center gap-1.5 uppercase">
            <AlertTriangle className="w-3.5 h-3.5 text-[#FDE047]" />
            <span>Divergent Tokens ({comparison.divergence_points?.length || 0})</span>
          </h4>
          <div className="space-y-1.5">
            {comparison.divergence_points?.map((token, idx) => (
              <div key={idx} className="p-2 px-3 bg-neutral-900 border border-white/[0.06] rounded-xl text-[10px] font-mono text-neutral-400">
                {token}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
