from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from backend.database import get_db
from backend.agent.hardware_agent import hardware_agent

router = APIRouter(prefix="/api/devices", tags=["devices"])

@router.get("", response_model=List[Dict[str, Any]])
def list_devices():
    """Returns database record of all historical and current devices."""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM devices ORDER BY last_seen DESC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

@router.get("/topology")
def get_hardware_topology():
    """
    Returns full real-time laptop port and device topology:
    - USB Host Controllers (USB 3.2 / 3.1)
    - USB Root Hubs and estimated ports
    - Removable Flash Drives (active storage triage)
    - Connected HID Peripherals (Mouse dongles, keyboards)
    - Integrated System Devices (Webcams, Bluetooth adapters)
    """
    return hardware_agent.get_hardware_topology(force_refresh=False)

@router.post("/scan")
def trigger_hardware_scan():
    """Forces an immediate low-latency hardware rescan of all laptop USB ports."""
    fresh_topology = hardware_agent.get_hardware_topology(force_refresh=True)
    return {
        "status": "SUCCESS",
        "message": "Hardware rescan completed successfully.",
        "topology": fresh_topology
    }

@router.post("/{device_id}/trust")
def update_device_trust(device_id: int, trust_status: str):
    """Updates device trust state to TRUSTED, UNTRUSTED, or BLOCKED."""
    if trust_status not in ("TRUSTED", "UNTRUSTED", "BLOCKED"):
        raise HTTPException(status_code=400, detail="Invalid trust status. Must be TRUSTED, UNTRUSTED, or BLOCKED.")
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("UPDATE devices SET trust_status = ? WHERE id = ?", (trust_status, device_id))
    conn.commit()
    conn.close()
    return {"status": "SUCCESS", "device_id": device_id, "trust_status": trust_status}
