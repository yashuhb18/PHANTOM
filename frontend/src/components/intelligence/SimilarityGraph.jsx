import React from 'react';
import { GitCompare, CheckCircle, AlertTriangle } from 'lucide-react';

export function SimilarityGraph({ comparison }) {
  if (!comparison) {
    return (
      <div className="bg-white border border-[#E7E5E4] rounded-xl p-12 text-center text-xs text-[#78716C]">
        Select two sessions or run Attack #2 to compare behavioral Attack DNA fingerprints.
      </div>
    );
  }

  const percentage = Math.round(comparison.similarity_score * 100);
  const isMatch = comparison.is_match;

  return (
    <div className="bg-white border border-[#E7E5E4] rounded-xl p-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#E7E5E4]">
        <div className="flex items-center gap-2">
          <GitCompare className="w-4 h-4 text-indigo-600" />
          <h3 className="text-xs font-semibold text-[#1C1917]">Jaccard Behavioral Similarity</h3>
        </div>
        <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border ${
          isMatch ? 'bg-red-50 text-red-700 border-red-200' : 'bg-[#FAFAF9] text-[#78716C] border-[#E7E5E4]'
        }`}>
          {comparison.verdict}
        </span>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-8 my-6">
        {/* Donut similarity indicator */}
        <div className="relative w-32 h-32 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-[#E7E5E4]"
              strokeWidth="3.5"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className={isMatch ? 'text-red-600' : 'text-indigo-600'}
              strokeDasharray={`${percentage}, 100`}
              strokeWidth="3.5"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className={`text-xl font-bold font-mono ${isMatch ? 'text-red-600' : 'text-[#1C1917]'}`}>
              {percentage}%
            </span>
            <span className="text-[9px] font-mono text-[#78716C]">SIMILARITY</span>
          </div>
        </div>

        {/* Sessions compared */}
        <div className="flex-1 w-full space-y-3">
          <div className="p-3 bg-[#FAFAF9] border border-[#E7E5E4] rounded-lg text-xs">
            <span className="text-[#A8A29E] block text-[10px] font-mono">SOURCE SESSION</span>
            <span className="font-semibold text-[#1C1917] font-mono">{comparison.source_session_id}</span>
          </div>
          <div className="p-3 bg-[#FAFAF9] border border-[#E7E5E4] rounded-lg text-xs">
            <span className="text-[#A8A29E] block text-[10px] font-mono">TARGET SESSION (DIFFERENT HARDWARE)</span>
            <span className="font-semibold text-[#1C1917] font-mono">{comparison.target_session_id}</span>
          </div>
        </div>
      </div>

      {/* Common vs Divergent Behavioral Subgraphs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[#E7E5E4]">
        <div>
          <h4 className="text-xs font-semibold text-emerald-700 mb-2 flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Shared Behavioral Tokens ({comparison.common_subgraphs?.length || 0})</span>
          </h4>
          <div className="space-y-1">
            {comparison.common_subgraphs?.map((token, idx) => (
              <div key={idx} className="p-1.5 px-2 bg-emerald-50 border border-emerald-200 rounded text-[10px] font-mono text-emerald-900">
                {token}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-[#78716C] mb-2 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            <span>Divergent Tokens ({comparison.divergence_points?.length || 0})</span>
          </h4>
          <div className="space-y-1">
            {comparison.divergence_points?.map((token, idx) => (
              <div key={idx} className="p-1.5 px-2 bg-[#FAFAF9] border border-[#E7E5E4] rounded text-[10px] font-mono text-[#78716C]">
                {token}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
