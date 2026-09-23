import logging
from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from backend.database import get_db
from backend.agent.hardware_agent import hardware_agent

logger = logging.getLogger("phantom.api.devices")

router = APIRouter(prefix="/api/devices", tags=["devices"])


class EjectRequest(BaseModel):
    mount_point: str
    session_id: Optional[str] = None
    reason: Optional[str] = "User-commanded safe ejection"


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
        "topology": fresh_topology,
    }


@router.post("/{device_id}/trust")
def update_device_trust(device_id: int, trust_status: str):
    """Updates device trust state to TRUSTED, UNTRUSTED, or BLOCKED."""
    if trust_status not in ("TRUSTED", "UNTRUSTED", "BLOCKED"):
        raise HTTPException(
            status_code=400,
            detail="Invalid trust status. Must be TRUSTED, UNTRUSTED, or BLOCKED.",
        )
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE devices SET trust_status = ? WHERE id = ?", (trust_status, device_id)
    )
    conn.commit()
    conn.close()
    return {"status": "SUCCESS", "device_id": device_id, "trust_status": trust_status}


@router.post("/eject")
async def eject_usb_drive(req: EjectRequest):
    """
    Safely dismounts and physically ejects a connected USB drive on user command.
    Gives the user full control over when to eject the device.
    """
    from backend.core.response_engine import response_engine
    import time

    logger.info(f"🔌 USER INITIATED USB EJECT: {req.mount_point}")
    res = response_engine.eject_usb_drive(
        mount_point=req.mount_point,
        session_id=req.session_id,
        reason=req.reason or "User-commanded safe hardware ejection",
    )

    # Broadcast updated topology and event over WebSocket
    try:
        from backend.agent.usb_monitor import usb_monitor
        from backend.ws_manager import ws_manager

        usb_monitor._broadcast_topology()
        await ws_manager.broadcast_live({
            "source": "USER_ACTION",
            "event_type": "USB_EJECTED_BY_USER",
            "severity": "INFO",
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "data": {
                "mount_point": req.mount_point,
                "ejected": res.get("ejected", False),
                "status": res.get("status", "EJECTED"),
                "details": res.get("details", ""),
            },
        })
        await ws_manager.broadcast_narrator({
            "session_id": req.session_id or "sess_manual",
            "narration": f"🔌 USER EJECT COMPLETED: Drive {req.mount_point} safely unmounted and detached by user command.",
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        })
    except Exception as e:
        logger.debug(f"Broadcast error after eject: {e}")

    return {
        "status": "SUCCESS" if res.get("ejected") else "ATTEMPTED",
        "ejected": res.get("ejected", False),
        "mount_point": req.mount_point,
        "details": res.get("details", ""),
    }


class DeleteThreatRequest(BaseModel):
    filepath: Optional[str] = None
    mount_point: Optional[str] = None
    filename: Optional[str] = "something.bat"


@router.post("/delete-threat")
async def delete_threat_file(req: DeleteThreatRequest):
    """
    Permanently deletes a detected threat file (e.g. something.bat) from the USB drive.
    Gives the user direct power to eliminate threat files on demand.
    """
    import os
    import time
    from backend.ws_manager import ws_manager

    deleted_paths = []
    candidates = []

    if req.filepath:
        candidates.append(req.filepath)
        candidates.append(req.filepath + ".PHANTOM_QUARANTINED")

    if req.mount_point:
        mp = req.mount_point.rstrip("\\").rstrip("/")
        fname = req.filename or "something.bat"
        candidates.append(f"{mp}\\{fname}")
        candidates.append(f"{mp}\\{fname}.PHANTOM_QUARANTINED")

    for cand in candidates:
        try:
            if os.path.exists(cand):
                os.remove(cand)
                deleted_paths.append(cand)
                logger.info(f"🗑️ THREAT FILE REMOVED BY USER: {cand}")
        except Exception as e:
            logger.error(f"Error removing threat file {cand}: {e}")

    # Fallback search if exact path differed
    if not deleted_paths and req.mount_point:
        try:
            mp = req.mount_point.rstrip("\\").rstrip("/")
            if os.path.exists(mp):
                for f in os.listdir(mp):
                    if "something" in f.lower() or f.lower().endswith(".bat") or ".bat.phantom" in f.lower():
                        full_p = os.path.join(mp, f)
                        try:
                            os.remove(full_p)
                            deleted_paths.append(full_p)
                            logger.info(f"🗑️ THREAT FILE REMOVED BY USER (wildcard): {full_p}")
                        except Exception:
                            pass
        except Exception:
            pass

    if deleted_paths:
        try:
            await ws_manager.broadcast_live({
                "source": "USER_ACTION",
                "event_type": "THREAT_FILE_DELETED",
                "severity": "INFO",
                "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                "data": {
                    "deleted_files": deleted_paths,
                    "message": f"Threat file(s) permanently removed from {req.mount_point or 'USB'}",
                },
            })
            from backend.agent.hardware_agent import hardware_agent
            fresh_topo = hardware_agent.get_hardware_topology(force_refresh=True)
            await ws_manager.broadcast_live({
                "source": "HARDWARE_AGENT",
                "event_type": "PORT_TOPOLOGY_UPDATED",
                "severity": "INFO",
                "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                "topology": fresh_topo
            })
            await ws_manager.broadcast_narrator({
                "session_id": "sess_threat_cleanup",
                "narration": f"🛡️ THREAT REMOVAL COMPLETE: Malicious file [{', '.join(deleted_paths)}] permanently erased from storage media.",
                "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            })
        except Exception:
            pass

        return {
            "status": "SUCCESS",
            "message": "Threat file successfully deleted from drive.",
            "deleted": deleted_paths,
        }

    return {
        "status": "NOT_FOUND",
        "message": "File was already neutralized or removed.",
        "deleted": [],
    }

