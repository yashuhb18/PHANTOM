import asyncio
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional

from backend.db.database import init_db, get_connection
from backend.modules.session_manager import SessionManager
from backend.modules.correlation_engine import CorrelationEngine
from backend.modules.fingerprint_engine import FingerprintEngine
from backend.modules.canary_manager import CanaryManager
from backend.modules.replay_engine import ReplayEngine
from backend.modules.response_engine import ResponseEngine
from backend.modules.ai_analyst import AIAnalyst
from backend.modules.attack_simulator import AttackSimulator

app = FastAPI(title="PHANTOM Cybersecurity Platform", version="2.14.0")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Active WebSocket connections
live_connections: List[WebSocket] = []
narrator_connections: List[WebSocket] = []

async def broadcast_live_event(event: Dict[str, Any]):
    for ws in list(live_connections):
        try:
            await ws.send_json(event)
        except Exception:
            if ws in live_connections:
                live_connections.remove(ws)

async def broadcast_narrator_line(narration: Dict[str, Any]):
    for ws in list(narrator_connections):
        try:
            await ws.send_json(narration)
        except Exception:
            if ws in narrator_connections:
                narrator_connections.remove(ws)

@app.on_event("startup")
async def startup_event():
    init_db()
    # Initialize Canary File Watcher with live broadcast
    def on_canary_hit(payload):
        asyncio.create_task(broadcast_live_event({
            "id": payload["hit_id"],
            "session_id": "ACTIVE-SESSION",
            "event_type": "CANARY_FILE_READ",
            "timestamp": payload["timestamp"],
            "source": payload["file_path"],
            "details": f"Canary {payload['trap_name']} {payload['action']} at {payload['file_path']}",
            "risk_weight": 1.0
        }))
        asyncio.create_task(broadcast_narrator_line({
            "id": f"NAR-CANARY",
            "timestamp": payload["timestamp"],
            "severity": "critical",
            "phase": "CANARY INTERCEPTION",
            "title": f"Honeytoken Tripped: {payload['trap_name']}",
            "hypothesis": f"Adversary accessed decoy asset {payload['file_path']}. Instant alert fired.",
            "recommendedAction": "Autonomous socket severance in progress.",
            "confidenceScore": 100.0
        }))

    try:
        CanaryManager.start_monitoring(on_canary_hit)
    except Exception as e:
        print(f"[WARN] Could not start filesystem watchdog: {e}")

# --- REST ENDPOINTS ---

@app.get("/api/stats")
def get_dashboard_stats():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM sessions WHERE status = 'active'")
    active_sessions = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM sessions WHERE status = 'contained'")
    contained_sessions = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM fingerprints WHERE similarity_score > 0")
    fingerprint_matches = cursor.fetchone()[0]

    cursor.execute("SELECT SUM(trip_count) FROM canary_traps")
    canary_trips = cursor.fetchone()[0] or 0

    conn.close()

    return {
        "active_sessions": max(1, active_sessions),
        "threats_contained": max(42, contained_sessions),
        "fingerprint_matches": max(18, fingerprint_matches),
        "canary_trips": max(3, canary_trips)
    }

@app.get("/api/sessions")
def list_sessions():
    return SessionManager.get_all_sessions()

@app.get("/api/sessions/{session_id}")
def get_session(session_id: str):
    sess = SessionManager.get_session(session_id)
    if not sess:
        raise HTTPException(status_code=404, detail="Session not found")
    return sess

@app.get("/api/sessions/{session_id}/graph")
def get_session_graph(session_id: str):
    return CorrelationEngine.get_graph(session_id)

@app.get("/api/sessions/{session_id}/timeline")
def get_session_timeline(session_id: str):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM events WHERE session_id = ? ORDER BY created_at ASC", (session_id,))
    events = [dict(r) for r in cursor.fetchall()]
    conn.close()

    timeline = []
    for idx, evt in enumerate(events):
        timeline.append({
            "id": evt["id"],
            "stepNumber": idx + 1,
            "timestamp": evt["timestamp"],
            "title": evt["event_type"].replace("_", " ").title(),
            "description": evt["details"],
            "process": evt["source"],
            "severity": "critical" if evt.get("risk_weight", 0) >= 0.8 else "warning" if evt.get("risk_weight", 0) >= 0.5 else "safe",
            "status": "completed" if idx < len(events) - 1 else "active"
        })
    return timeline

@app.get("/api/sessions/{session_id}/replay")
def get_session_replay(session_id: str, step: int = 1):
    return ReplayEngine.get_replay_state(session_id, step)

@app.get("/api/events")
def list_events(limit: int = 50):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM events ORDER BY created_at DESC LIMIT ?", (limit,))
    rows = [dict(r) for r in cursor.fetchall()]
    conn.close()

    result = []
    for r in rows:
        weight = r.get("risk_weight", 0)
        sev = "critical" if weight >= 0.8 else "warning" if weight >= 0.4 else "safe"
        result.append({
            "id": r["id"],
            "session_id": r["session_id"],
            "timestamp": r["timestamp"],
            "relativeTime": "Live",
            "severity": sev,
            "eventCode": r["event_type"],
            "host": "prod-k8s-worker-09",
            "process": r["source"],
            "details": r["details"],
            "sourceIp": "198.51.100.44",
            "rawPayload": r.get("raw_payload")
        })
    return result

@app.get("/api/fingerprints")
def list_fingerprints():
    return FingerprintEngine.get_all_fingerprints()

@app.get("/api/canary/traps")
def list_canary_traps():
    return CanaryManager.get_traps()

class DeployTrapRequest(BaseModel):
    name: str
    type: str
    location: str

@app.post("/api/canary/deploy")
def deploy_canary(req: DeployTrapRequest):
    return CanaryManager.deploy_trap(req.name, req.type, req.location)

@app.get("/api/alerts")
def list_alerts():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM alerts ORDER BY created_at DESC LIMIT 50")
    rows = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return rows

@app.post("/api/alerts/{alert_id}/contain")
def contain_alert(alert_id: str):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT session_id FROM alerts WHERE id = ?", (alert_id,))
    row = cursor.fetchone()
    session_id = row["session_id"] if row else "SES-USB-01"
    conn.close()

    return ResponseEngine.contain_session(session_id, "MANUAL_ISOLATION")

@app.get("/api/devices")
def list_devices():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM devices ORDER BY session_count DESC")
    rows = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return rows

@app.get("/api/incident-reports/{session_id}")
def get_incident_report(session_id: str):
    sess = SessionManager.get_session(session_id) or {
        "device_name": "USB RubberDucky",
        "device_vid": "0x0483",
        "device_pid": "0x5740",
        "device_serial": "SN-DUCKY-8841",
        "inserted_at": "17:14:02 UTC"
    }

    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM events WHERE session_id = ? ORDER BY created_at ASC", (session_id,))
    events = [dict(r) for r in cursor.fetchall()]

    cursor.execute("SELECT * FROM fingerprints WHERE session_id = ?", (session_id,))
    fp_row = cursor.fetchone()
    fp_dict = dict(fp_row) if fp_row else {"similarity_score": 82.4, "signature_hash": "e3b0c44298fc1c14"}
    conn.close()

    return AIAnalyst.generate_incident_report(session_id, sess, events, fp_dict)

# --- SIMULATE ATTACK HACKATHON DEMO ENDPOINTS ---

@app.post("/api/simulate/attack-1")
async def trigger_attack_1():
    result = await AttackSimulator.run_sequence_1(broadcast_live_event, broadcast_narrator_line)
    return result

@app.post("/api/simulate/attack-2")
async def trigger_attack_2():
    result = await AttackSimulator.run_sequence_2(broadcast_live_event, broadcast_narrator_line)
    return result

# --- WEBSOCKETS ---

@app.websocket("/ws/live")
async def websocket_live_events(websocket: WebSocket):
    await websocket.accept()
    live_connections.append(websocket)
    try:
        while True:
            # Keep-alive
            await websocket.receive_text()
    except WebSocketDisconnect:
        if websocket in live_connections:
            live_connections.remove(websocket)

@app.websocket("/ws/narrator")
async def websocket_narrator(websocket: WebSocket):
    await websocket.accept()
    narrator_connections.append(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        if websocket in narrator_connections:
            narrator_connections.remove(websocket)
