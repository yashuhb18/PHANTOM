import json
import datetime
from typing import Optional, Dict, Any, List
from backend.database import get_db

class SessionManager:
    """
    Tracks USB session lifecycle: insertion, active telemetry, removal, and post-removal observation window.
    """
    def create_session(
        self,
        session_id: str,
        device_name: str,
        vendor_id: str,
        product_id: str,
        serial_number: Optional[str] = None,
        mount_point: Optional[str] = None
    ) -> Dict[str, Any]:
        conn = get_db()
        cursor = conn.cursor()
        inserted_at = datetime.datetime.utcnow().isoformat() + "Z"

        # Clean up any previous demo run events/alerts for idempotency
        cursor.execute("DELETE FROM events WHERE session_id = ?", (session_id,))
        cursor.execute("DELETE FROM alerts WHERE session_id = ?", (session_id,))

        cursor.execute("""
            INSERT OR REPLACE INTO sessions (
                session_id, device_name, vendor_id, product_id,
                serial_number, mount_point, inserted_at, status, risk_score, attack_detected, event_count
            ) VALUES (?, ?, ?, ?, ?, ?, ?, 'ACTIVE', 0, 0, 0)
        """, (session_id, device_name, vendor_id, product_id, serial_number, mount_point, inserted_at))

        # Record or update device history
        cursor.execute("""
            INSERT INTO devices (vendor_id, product_id, device_name, serial_number, trust_status, first_seen, last_seen, session_count)
            VALUES (?, ?, ?, ?, 'UNTRUSTED', ?, ?, 1)
            ON CONFLICT(vendor_id, product_id, serial_number) DO UPDATE SET
                last_seen = excluded.last_seen,
                session_count = devices.session_count + 1
        """, (vendor_id, product_id, device_name, serial_number, inserted_at, inserted_at))

        conn.commit()
        conn.close()

        return {
            "session_id": session_id,
            "device_name": device_name,
            "vendor_id": vendor_id,
            "product_id": product_id,
            "status": "ACTIVE",
            "inserted_at": inserted_at
        }

    def record_event(self, event) -> None:
        conn = get_db()
        cursor = conn.cursor()
        
        cursor.execute("""
            INSERT INTO events (event_id, session_id, timestamp, source, event_type, severity, data_json, risk_score_delta)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            event.event_id,
            event.session_id,
            event.timestamp,
            event.source,
            event.event_type,
            event.severity,
            json.dumps(event.data),
            event.risk_score_delta
        ))

        cursor.execute("""
            UPDATE sessions
            SET risk_score = MIN(100, risk_score + ?),
                event_count = event_count + 1,
                attack_detected = CASE WHEN (risk_score + ?) >= 60 THEN 1 ELSE attack_detected END
            WHERE session_id = ?
        """, (event.risk_score_delta, event.risk_score_delta, event.session_id))

        conn.commit()
        conn.close()

    def close_session(self, session_id: str) -> None:
        conn = get_db()
        cursor = conn.cursor()
        removed_at = datetime.datetime.utcnow().isoformat() + "Z"

        cursor.execute("""
            UPDATE sessions
            SET status = 'POST_REMOVAL_OBSERVATION',
                removed_at = ?
            WHERE session_id = ?
        """, (removed_at, session_id))

        conn.commit()
        conn.close()

    def get_session(self, session_id: str) -> Optional[Dict[str, Any]]:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM sessions WHERE session_id = ?", (session_id,))
        row = cursor.fetchone()
        conn.close()
        return dict(row) if row else None

    def list_sessions(self, limit: int = 50) -> List[Dict[str, Any]]:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM sessions ORDER BY inserted_at DESC LIMIT ?", (limit,))
        rows = cursor.fetchall()
        conn.close()
        return [dict(r) for r in rows]

session_manager = SessionManager()
