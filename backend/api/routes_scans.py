"""
PHANTOM API Routes — File Scan Results
=========================================
REST endpoints for threat scan results from the autonomous ThreatScanner agent.
"""

import json
from fastapi import APIRouter, HTTPException
from backend.database import get_db

router = APIRouter(prefix="/api/scans", tags=["File Scans"])


@router.get("/{session_id}")
def get_scan_results(session_id: str):
    """Get all file scan results for a given session."""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT * FROM file_scans WHERE session_id = ? ORDER BY threat_score DESC, scanned_at ASC
    """, (session_id,))
    rows = cursor.fetchall()
    conn.close()

    results = []
    for row in rows:
        r = dict(row)
        # Parse threat_indicators JSON
        try:
            r["threat_indicators"] = json.loads(r.get("threat_indicators", "[]"))
        except (json.JSONDecodeError, TypeError):
            r["threat_indicators"] = []
        results.append(r)

    return results


@router.get("/{session_id}/threats")
def get_threats_only(session_id: str):
    """Get only high-threat files for a given session (threat_score >= 25)."""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT * FROM file_scans WHERE session_id = ? AND threat_score >= 25 ORDER BY threat_score DESC
    """, (session_id,))
    rows = cursor.fetchall()
    conn.close()

    results = []
    for row in rows:
        r = dict(row)
        try:
            r["threat_indicators"] = json.loads(r.get("threat_indicators", "[]"))
        except (json.JSONDecodeError, TypeError):
            r["threat_indicators"] = []
        results.append(r)

    return results


@router.get("/{session_id}/summary")
def get_scan_summary(session_id: str):
    """Get a summary of the scan results for a session."""
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute("SELECT COUNT(*) FROM file_scans WHERE session_id = ?", (session_id,))
    total = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM file_scans WHERE session_id = ? AND threat_score >= 25", (session_id,))
    high_threat = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM file_scans WHERE session_id = ? AND action_taken = 'QUARANTINED'", (session_id,))
    quarantined = cursor.fetchone()[0]
    
    cursor.execute("SELECT MAX(threat_score) FROM file_scans WHERE session_id = ?", (session_id,))
    max_score_row = cursor.fetchone()
    max_score = max_score_row[0] if max_score_row[0] is not None else 0
    
    cursor.execute("SELECT AVG(threat_score) FROM file_scans WHERE session_id = ? AND threat_score > 0", (session_id,))
    avg_score_row = cursor.fetchone()
    avg_score = round(avg_score_row[0], 1) if avg_score_row[0] is not None else 0
    
    conn.close()

    return {
        "session_id": session_id,
        "total_scanned": total,
        "high_threat_files": high_threat,
        "quarantined_files": quarantined,
        "max_threat_score": max_score,
        "avg_threat_score": avg_score,
        "verdict": "THREATS_CONTAINED" if quarantined > 0 else ("SUSPICIOUS" if high_threat > 0 else "CLEAN")
    }
