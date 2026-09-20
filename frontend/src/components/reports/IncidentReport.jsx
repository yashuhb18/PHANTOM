import React from 'react';
import { Download, FileText, CheckCircle, ShieldCheck } from 'lucide-react';

export function IncidentReport({ report }) {
  if (!report) {
    return (
      <div className="bg-white border border-[#E7E5E4] rounded-xl p-12 text-center text-xs text-[#78716C]">
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
    <div className="bg-white border border-[#E7E5E4] rounded-xl overflow-hidden">
      {/* Header Bar */}
      <div className="p-4 px-6 border-b border-[#E7E5E4] flex items-center justify-between bg-[#FAFAF9]">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-indigo-600" />
          <h3 className="text-xs font-semibold text-[#1C1917]">{report.title}</h3>
        </div>
        <button
          onClick={handleDownload}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E7E5E4] hover:bg-white text-xs font-medium text-[#78716C] transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Markdown</span>
        </button>
      </div>

      {/* Forensic Report Content in Source Serif 4 */}
      <div className="p-8 max-w-4xl mx-auto font-serif text-sm leading-relaxed text-[#1C1917]">
        <div className="prose prose-stone max-w-none">
          <div className="border-b border-[#E7E5E4] pb-4 mb-6">
            <h1 className="text-xl font-bold font-serif text-[#1C1917] mb-2">{report.title}</h1>
            <div className="flex flex-wrap gap-4 text-xs font-sans text-[#78716C]">
              <span><strong>Session:</strong> <code className="font-mono">{report.session_id}</code></span>
              <span><strong>Classification:</strong> <span className="text-red-600 font-semibold font-mono">CRITICAL</span></span>
              <span><strong>Status:</strong> <span className="text-emerald-600 font-semibold font-mono">CONTAINED</span></span>
              <span><strong>Cluster Family:</strong> <code className="font-mono text-indigo-600">{report.cluster_family}</code></span>
            </div>
          </div>

          <div className="whitespace-pre-wrap font-sans text-xs text-[#292524] leading-6 bg-[#FAFAF9] p-6 rounded-xl border border-[#E7E5E4]">
            {report.markdown}
          </div>
        </div>
      </div>
    </div>
  );
}
