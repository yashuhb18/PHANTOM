import os
import time
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Any, Callable, Optional
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from backend.db.database import get_connection

class CanaryFileHandler(FileSystemEventHandler):
    def __init__(self, on_hit_callback: Callable[[str, str], None]):
        self.on_hit_callback = on_hit_callback

    def on_modified(self, event):
        if not event.is_directory:
            self.on_hit_callback(event.src_path, "MODIFIED")

    def on_opened(self, event):
        if not event.is_directory:
            self.on_hit_callback(event.src_path, "ACCESSED")

class CanaryManager:
    """
    Deception Layer: Seeds realistic decoy files and monitors them with watchdog.
    Fires instant max-severity alerts on any file touch—no correlation delay needed.
    """

    _observer: Optional[Observer] = None
    _decoy_dir: Path = Path(__file__).parent.parent / "decoy_files"

    @classmethod
    def start_monitoring(cls, alert_callback: Optional[Callable[[Dict[str, Any]], None]] = None):
        cls._decoy_dir.mkdir(exist_ok=True)
        event_handler = CanaryFileHandler(lambda path, action: cls.handle_canary_hit(path, action, alert_callback))

        cls._observer = Observer()
        cls._observer.schedule(event_handler, str(cls._decoy_dir), recursive=False)
        cls._observer.start()
        print(f"[CANARY] Monitoring active on {cls._decoy_dir}")

    @classmethod
    def handle_canary_hit(cls, file_path: str, action: str, alert_callback: Optional[Callable] = None):
        conn = get_connection()
        cursor = conn.cursor()

        # Find matching trap
        cursor.execute("SELECT * FROM canary_traps WHERE file_path = ? OR file_path LIKE ?", (file_path, f"%{Path(file_path).name}%"))
        trap = cursor.fetchone()

        trap_id = trap["id"] if trap else "TRAP-UNKNOWN"
        trap_name = trap["name"] if trap else Path(file_path).name
        now = datetime.utcnow().strftime("%H:%M:%S.%f")[:-3]

        hit_id = f"HIT-{os.urandom(3).hex().upper()}"
        alert_id = f"ALT-CANARY-{os.urandom(3).hex().upper()}"

        # Update trap status
        cursor.execute("""
        UPDATE canary_traps SET status = 'tripped', trip_count = trip_count + 1, last_checked = 'Just now'
        WHERE id = ?
        """, (trap_id,))

        # Record hit
        cursor.execute("""
        INSERT INTO canary_hits (id, trap_id, session_id, timestamp, process_name, process_pid, details)
        VALUES (?, ?, 'ACTIVE-SESSION', ?, 'unauthorized_reader', 41002, ?)
        """, (hit_id, trap_id, now, f"Canary {trap_name} {action} at {file_path}"))

        # Create instant max-severity alert
        cursor.execute("""
        INSERT INTO alerts (id, session_id, severity, timestamp, host, vector, detection_engine, mitigation_status, score)
        VALUES (?, 'ACTIVE-SESSION', 'critical', ?, 'prod-k8s-worker-09', ?, 'PHANTOM Deception Fabric v4', 'Active', 99)
        """, (alert_id, now, f"Canary Decoy Tripped: {trap_name} ({file_path})"))

        conn.commit()
        conn.close()

        payload = {
            "hit_id": hit_id,
            "trap_id": trap_id,
            "trap_name": trap_name,
            "file_path": file_path,
            "action": action,
            "timestamp": now,
            "severity": "critical"
        }

        if alert_callback:
            alert_callback(payload)

        return payload

    @classmethod
    def get_traps(cls) -> List[Dict[str, Any]]:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM canary_traps ORDER BY trip_count DESC, id ASC")
        rows = [dict(r) for r in cursor.fetchall()]
        conn.close()
        return rows

    @classmethod
    def deploy_trap(cls, name: str, trap_type: str, location: str) -> Dict[str, Any]:
        conn = get_connection()
        cursor = conn.cursor()

        trap_id = f"TRAP-{os.urandom(2).hex().upper()}"
        now = datetime.utcnow().isoformat()

        # Create physical file if it's a file trap
        file_path = location
        if "/" in location or "\\" in location:
            p = Path(location)
            try:
                p.parent.mkdir(parents=True, exist_ok=True)
                p.write_text(f"# PHANTOM SYNTHETIC DECOY ARTIFACT\n# TRAP_ID: {trap_id}\n")
            except Exception:
                # Fallback to decoy dir
                p = cls._decoy_dir / Path(location).name
                p.write_text(f"# PHANTOM SYNTHETIC DECOY ARTIFACT\n# TRAP_ID: {trap_id}\n")
                file_path = str(p)

        cursor.execute("""
        INSERT INTO canary_traps (id, name, type, file_path, status, created_at, last_checked, trip_count, tags)
        VALUES (?, ?, ?, ?, 'nominal', ?, 'Just now', 0, '["Autonomous Deploy", "Production"]')
        """, (trap_id, name.upper(), trap_type, file_path, now))

        conn.commit()
        conn.close()

        return {
            "id": trap_id,
            "name": name.upper(),
            "type": trap_type,
            "location": file_path,
            "status": "nominal",
            "lastChecked": "Just now",
            "trippedCount": 0,
            "tags": ["Autonomous Deploy", "Production"]
        }
