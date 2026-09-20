from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from backend.database import get_db

router = APIRouter(prefix="/api/devices", tags=["devices"])

@router.get("", response_model=List[Dict[str, Any]])
def list_devices():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM devices ORDER BY last_seen DESC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

@router.post("/{device_id}/trust")
def update_device_trust(device_id: int, trust_status: str):
    if trust_status not in ("TRUSTED", "UNTRUSTED", "BLOCKED"):
        raise HTTPException(status_code=400, detail="Invalid trust status")
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("UPDATE devices SET trust_status = ? WHERE id = ?", (trust_status, device_id))
    conn.commit()
    conn.close()
    return {"status": "SUCCESS", "device_id": device_id, "trust_status": trust_status}
