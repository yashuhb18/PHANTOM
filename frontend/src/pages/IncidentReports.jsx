import React, { useState, useEffect } from 'react';
import { IncidentReport } from '../components/reports/IncidentReport';
import { LoadingState } from '../components/common/LoadingState';

export function IncidentReports({ initialSessionId = 'sess_demo_stage1_ducky' }) {
  const [reports, setReports] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState(initialSessionId);
  const [currentReport, setCurrentReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReports() {
      try {
        const res = await fetch(`http://${window.location.hostname}:8001/api/reports`);
        if (res.ok) {
          const data = await res.json();
          setReports(data);
        }
      } catch (e) {
        console.error("Error fetching reports:", e);
      }
    }
    loadReports();
  }, []);

  useEffect(() => {
    async function loadSingleReport() {
      if (!selectedSessionId) return;
      setLoading(true);
      try {
        const res = await fetch(`http://${window.location.hostname}:8001/api/reports/${selectedSessionId}`);
        if (res.ok) {
          setCurrentReport(await res.json());
        }
      } catch (e) {
        console.error("Error loading report detail:", e);
      } finally {
        setLoading(false);
      }
    }
    loadSingleReport();
  }, [selectedSessionId]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Session Report Selector */}
      <div className="bg-[#141414] border border-white/[0.08] rounded-[28px] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xl">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="text-xs font-bold text-white uppercase tracking-wider">Select Incident:</span>
          <select
            value={selectedSessionId}
            onChange={(e) => setSelectedSessionId(e.target.value)}
            className="text-xs bg-[#0A0A0A] border border-white/[0.1] rounded-full px-4 py-2 text-white font-mono focus:outline-none focus:border-[#FDE047]"
          >
            <option value="sess_demo_stage1_ducky">sess_demo_stage1_ducky (RubberDucky)</option>
            <option value="sess_demo_stage2_bunny">sess_demo_stage2_bunny (BashBunny)</option>
            {reports.map((r) => (
              <option key={r.session_id} value={r.session_id}>
                {r.session_id} ({r.device_name})
              </option>
            ))}
          </select>
        </div>

        <span className="text-[10px] font-mono font-bold px-3 py-1 rounded-full bg-[#FDE047]/10 text-[#FDE047] border border-[#FDE047]/30 uppercase">
          AI FORENSIC ENGINE
        </span>
      </div>

      {loading ? (
        <LoadingState message="Generating structured forensic incident report..." />
      ) : (
        <IncidentReport report={currentReport} />
      )}
    </div>
  );
}
