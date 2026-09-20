from fastapi import APIRouter
from typing import List, Dict, Any
from backend.core.canary_manager import canary_manager
from backend.models import CanaryTrapCreate

router = APIRouter(prefix="/api/canary", tags=["canary"])

@router.get("/files", response_model=List[Dict[str, Any]])
def list_canary_files():
    return canary_manager.list_traps()

@router.get("/alerts", response_model=List[Dict[str, Any]])
def list_canary_alerts(limit: int = 50):
    return canary_manager.list_hits(limit=limit)

@router.post("/deploy")
def deploy_canary_file(trap: CanaryTrapCreate):
    return canary_manager.deploy_trap(
        filename=trap.filename,
        file_type=trap.file_type,
        description=trap.description or "Custom honeypot trap"
    )

@router.post("/trip")
def trip_canary(filename: str):
    canary_manager.handle_trap_trip(f"decoy_files/{filename}", "WEBHOOK_TRIGGERED")
    return {"status": "SUCCESS", "message": f"Canary trap {filename} triggered."}
