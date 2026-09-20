import json
from typing import Dict, Any, List
from backend.database import get_db

class ReplayEngine:
    """
    Reconstructs time-travel attack snapshots for scrubber playback.
    """
    def get_replay_timeline(self, session_id: str) -> Dict[str, Any]:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT event_id, timestamp, source, event_type, severity, data_json, risk_score_delta
            FROM events
            WHERE session_id = ?
            ORDER BY timestamp ASC
        """, (session_id,))
        rows = cursor.fetchall()
        conn.close()

        timeline = []
        cumulative_risk = 0
        for idx, r in enumerate(rows):
            evt = dict(r)
            evt["data"] = json.loads(evt["data_json"])
            cumulative_risk = min(100, cumulative_risk + evt["risk_score_delta"])
            evt["cumulative_risk"] = cumulative_risk
            evt["frame_index"] = idx
            timeline.append(evt)

        return {
            "session_id": session_id,
            "total_frames": len(timeline),
            "timeline": timeline
        }

replay_engine = ReplayEngine()
