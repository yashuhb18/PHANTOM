import sqlite3
from datetime import datetime
from typing import Optional, Dict, Any, List
from backend.db.database import get_connection

class SessionManager:
    """
    Manages USB session lifecycle: creates session upon device insertion
    (VID/PID/serial fingerprint), persists post-removal hunting window.
    """

    @staticmethod
    def create_session(
        session_id: str,
        vid: str,
        pid: str,
        serial: str,
        name: str
    ) -> Dict[str, Any]:
        conn = get_connection()
        cursor = conn.cursor()
        inserted_at = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")

        cursor.execute("""
        INSERT OR REPLACE INTO sessions (id, device_vid, device_pid, device_serial, device_name, inserted_at, status, risk_score)
        VALUES (?, ?, ?, ?, ?, ?, 'active', 0)
        """, (session_id, vid, pid, serial, name, inserted_at))

        # Update or insert into devices table
        cursor.execute("""
        INSERT INTO devices (id, vid, pid, serial, name, trust_status, last_seen, session_count)
        VALUES (?, ?, ?, ?, ?, 'untrusted', ?, 1)
        ON CONFLICT(id) DO UPDATE SET
            session_count = session_count + 1,
            last_seen = excluded.last_seen
        """, (f"DEV-{vid[-4:]}-{pid[-4:]}", vid, pid, serial, name, inserted_at))

        conn.commit()
        conn.close()

        return {
            "session_id": session_id,
            "vid": vid,
            "pid": pid,
            "serial": serial,
            "name": name,
            "inserted_at": inserted_at,
            "status": "active",
            "risk_score": 0
        }

    @staticmethod
    def mark_removed(session_id: str) -> None:
        conn = get_connection()
        cursor = conn.cursor()
        removed_at = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")

        cursor.execute("""
        UPDATE sessions SET removed_at = ?, status = 'removed_hunting'
        WHERE id = ?
        """, (removed_at, session_id))

        conn.commit()
        conn.close()

    @staticmethod
    def update_risk_score(session_id: str, score: int, status: Optional[str] = None) -> None:
        conn = get_connection()
        cursor = conn.cursor()
        if status:
            cursor.execute("UPDATE sessions SET risk_score = ?, status = ? WHERE id = ?", (score, status, session_id))
        else:
            cursor.execute("UPDATE sessions SET risk_score = ? WHERE id = ?", (score, session_id))
        conn.commit()
        conn.close()

    @staticmethod
    def get_all_sessions() -> List[Dict[str, Any]]:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM sessions ORDER BY created_at DESC")
        rows = [dict(r) for r in cursor.fetchall()]
        conn.close()
        return rows

    @staticmethod
    def get_session(session_id: str) -> Optional[Dict[str, Any]]:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM sessions WHERE id = ?", (session_id,))
        row = cursor.fetchone()
        conn.close()
        return dict(row) if row else None
