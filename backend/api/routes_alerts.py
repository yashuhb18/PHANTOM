from fastapi import APIRouter
from typing import List, Dict, Any
from backend.database import get_db
from backend.core.response_engine import response_engine
from backend.models import ContainmentActionRequest, ContainmentActionResponse

router = APIRouter(prefix="/api", tags=["alerts"])

@router.get("/alerts", response_model=List[Dict[str, Any]])
def list_alerts(limit: int = 50):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM alerts ORDER BY created_at DESC LIMIT ?", (limit,))
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

@router.post("/actions/isolate", response_model=ContainmentActionResponse)
def micro_isolate_host(req: ContainmentActionRequest):
    result = response_engine.execute_containment(req.session_id, "MICRO_ISOLATE", req.target)
    return {
        "status": "SUCCESS",
        "action_type": "MICRO_ISOLATE",
        "session_id": req.session_id,
        "timestamp": result["timestamp"],
        "details": result
    }

@router.post("/actions/block", response_model=ContainmentActionResponse)
def block_device(req: ContainmentActionRequest):
    result = response_engine.execute_containment(req.session_id, "BLOCK_DEVICE", req.target)
    return {
        "status": "SUCCESS",
        "action_type": "BLOCK_DEVICE",
        "session_id": req.session_id,
        "timestamp": result["timestamp"],
        "details": result
    }
