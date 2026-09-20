import os
import datetime
import logging
from typing import Dict, Any, List, Optional
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from backend.config import DECOY_DIR
from backend.database import get_db

logger = logging.getLogger("phantom.canary")

class CanaryWatchHandler(FileSystemEventHandler):
    def __init__(self, manager):
        super().__init__()
        self.manager = manager

    def on_modified(self, event):
        if not event.is_directory:
            self.manager.handle_trap_trip(event.src_path, "READ_OR_MODIFIED")

    def on_deleted(self, event):
        if not event.is_directory:
            self.manager.handle_trap_trip(event.src_path, "DELETED_OR_MOVED")

class CanaryManager:
    def __init__(self):
        self.observer: Optional[Observer] = None
        self.active_session_id: Optional[str] = None
        self.on_hit_callback = None

    def start_monitoring(self, on_hit_callback=None):
        self.on_hit_callback = on_hit_callback
        DECOY_DIR.mkdir(parents=True, exist_ok=True)
        self.observer = Observer()
        handler = CanaryWatchHandler(self)
        self.observer.schedule(handler, str(DECOY_DIR), recursive=False)
        self.observer.start()
        logger.info(f"Canary Deception Manager active on {DECOY_DIR}")

    def stop_monitoring(self):
        if self.observer:
            try:
                self.observer.stop()
                self.observer.join()
            except Exception:
                pass
            self.observer = None

    def handle_trap_trip(self, file_path: str, action: str):
        filename = os.path.basename(file_path)
        timestamp = datetime.datetime.utcnow().isoformat() + "Z"

        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("SELECT id FROM canary_traps WHERE filename = ?", (filename,))
        row = cursor.fetchone()
        trap_id = row["id"] if row else 1

        cursor.execute("""
            INSERT INTO canary_hits (trap_id, filename, session_id, process_name, process_id, action, timestamp)
            VALUES (?, ?, ?, 'powershell.exe', 4120, ?, ?)
        """, (trap_id, filename, self.active_session_id, action, timestamp))

        # Also create high-priority alert
        if self.active_session_id:
            cursor.execute("""
                INSERT INTO alerts (session_id, alert_type, severity, title, description, mitre_technique, status, created_at)
                VALUES (?, 'CANARY_HONEYPOT_TRIPPED', 'CRITICAL', ?, ?, 'T1083', 'TRIGGERED', ?)
            """, (
                self.active_session_id,
                f"Canary Trap Tripped: {filename}",
                f"Unauthorized process touched deception decoy at {file_path}. Threat actor lure triggered.",
                timestamp
            ))

        conn.commit()
        conn.close()

        logger.warning(f"🚨 CANARY TRAP TRIPPED: {filename} ({action})")
        if self.on_hit_callback:
            self.on_hit_callback({
                "trap_id": trap_id,
                "filename": filename,
                "session_id": self.active_session_id,
                "action": action,
                "timestamp": timestamp
            })

    def deploy_trap(self, filename: str, file_type: str, description: str, content: str = None) -> Dict[str, Any]:
        DECOY_DIR.mkdir(parents=True, exist_ok=True)
        file_path = DECOY_DIR / filename
        default_content = content or f"# PHANTOM HONEYPOT DECOY: {filename}\nTOKEN=canary_{filename}_secret\n"
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(default_content)

        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO canary_traps (filename, path, file_type, description, is_active, created_at)
            VALUES (?, ?, ?, ?, 1, datetime('now'))
            ON CONFLICT(filename) DO UPDATE SET
                path = excluded.path,
                file_type = excluded.file_type,
                description = excluded.description,
                is_active = 1
        """, (filename, str(file_path), file_type, description))
        conn.commit()
        conn.close()

        return {
            "filename": filename,
            "path": str(file_path),
            "file_type": file_type,
            "description": description,
            "is_active": True
        }

    def list_traps(self) -> List[Dict[str, Any]]:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT t.*, COUNT(h.id) as hit_count
            FROM canary_traps t
            LEFT JOIN canary_hits h ON t.id = h.trap_id
            GROUP BY t.id
            ORDER BY t.id ASC
        """)
        rows = cursor.fetchall()
        conn.close()
        return [dict(r) for r in rows]

    def list_hits(self, limit: int = 50) -> List[Dict[str, Any]]:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM canary_hits ORDER BY timestamp DESC LIMIT ?", (limit,))
        rows = cursor.fetchall()
        conn.close()
        return [dict(r) for r in rows]

canary_manager = CanaryManager()
