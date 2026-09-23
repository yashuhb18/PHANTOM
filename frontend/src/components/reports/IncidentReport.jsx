import React from 'react';
import { Download, FileText } from 'lucide-react';

export function IncidentReport({ report }) {
  if (!report) {
    return (
      <div className="bg-[#141414] border border-white/[0.06] rounded-[28px] p-12 text-center text-xs text-neutral-500">
        Select an incident to view its executive forensic brief.
      </div>
    );
  }

  const handleDownload = () => {
    const blob = new Blob([report.markdown || ''], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `incident_report_${report.session_id}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-[#141414] border border-white/[0.06] rounded-[28px] overflow-hidden shadow-2xl">
      {/* Header Bar */}
      <div className="p-5 px-8 border-b border-white/[0.06] flex items-center justify-between bg-[#0F0F0F]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-neutral-900 border border-white/[0.08] flex items-center justify-center text-[#FDE047]">
            <FileText className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">{report.title}</h3>
        </div>
        <button
          onClick={handleDownload}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#FDE047] hover:bg-[#FACC15] text-black text-xs font-bold shadow-md shadow-[#FDE047]/10 transition-all pill-button cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Markdown</span>
        </button>
      </div>

      {/* Forensic Report Content */}
      <div className="p-8 md:p-10 max-w-4xl mx-auto text-sm leading-relaxed">
        <div className="border-b border-white/[0.08] pb-6 mb-8">
          <h1 className="text-2xl md:text-3xl font-black text-white mb-3 tracking-tight">{report.title}</h1>
          <div className="flex flex-wrap gap-4 text-xs font-sans text-neutral-400">
            <span><strong>Session:</strong> <code className="font-mono text-white bg-neutral-900 px-2 py-0.5 rounded-lg border border-white/[0.06]">{report.session_id}</code></span>
            <span><strong>Classification:</strong> <span className="text-red-400 font-bold font-mono">CRITICAL</span></span>
            <span><strong>Status:</strong> <span className="text-emerald-400 font-bold font-mono">CONTAINED</span></span>
            <span><strong>Cluster Family:</strong> <code className="font-mono text-[#FDE047] font-bold">{report.cluster_family}</code></span>
          </div>
        </div>

        <div className="whitespace-pre-wrap font-mono text-xs text-neutral-300 leading-relaxed bg-[#0A0A0A] p-8 rounded-[24px] border border-white/[0.06] shadow-inner">
          {report.markdown}
        </div>
      </div>
    </div>
  );
}
