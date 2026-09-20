from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from backend.core.ai_analyst import ai_analyst
from backend.core.session_manager import session_manager

router = APIRouter(prefix="/api/reports", tags=["reports"])

@router.get("")
def list_reports():
    sessions = session_manager.list_sessions()
    reports = []
    for s in sessions:
        if s.get("risk_score", 0) >= 40:
            reports.append({
                "session_id": s["session_id"],
                "device_name": s["device_name"],
                "risk_score": s["risk_score"],
                "status": s["status"],
                "inserted_at": s["inserted_at"]
            })
    return reports

@router.get("/{session_id}")
def get_incident_report(session_id: str):
    report = ai_analyst.generate_incident_report(session_id)
    if "error" in report:
        raise HTTPException(status_code=404, detail=report["error"])
    return report
