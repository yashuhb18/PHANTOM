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
      <div className="bg-white border border-[#E7E5E4] rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-[#1C1917]">Select Incident:</span>
          <select
            value={selectedSessionId}
            onChange={(e) => setSelectedSessionId(e.target.value)}
            className="text-xs bg-[#FAFAF9] border border-[#E7E5E4] rounded-lg px-3 py-1.5 text-[#1C1917] font-mono focus:outline-none focus:border-indigo-500"
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

        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
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
