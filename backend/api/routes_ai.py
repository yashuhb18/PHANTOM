import json
import logging
from typing import Dict, Any, List, Optional
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from backend.core.glm_client import glm_client
from backend.core.ai_analyst import ai_analyst
from backend.database import get_db

logger = logging.getLogger("phantom.api.ai")

router = APIRouter(prefix="/api/ai", tags=["ai"])

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None
    history: Optional[List[ChatMessage]] = []

class ScriptAnalysisRequest(BaseModel):
    filename: str
    content: str

def _build_system_prompt(session_id: Optional[str] = None) -> str:
    """Builds a lean, targeted system prompt for GLM-4 to minimize prompt evaluation time."""
    prompt = (
        "You are PHANTOM Copilot, an elite, dignified, and highly respectful AI cybersecurity intelligence specialist embedded inside the PHANTOM Autonomous Threat Hunting Platform.\n"
        "CORE IDENTITY & DEMEANOR:\n"
        "- Tone: Professional, courteous, precise, and authoritative. Treat the user with utmost respect, addressing them as Investigator or Analyst.\n"
        "- Scope: Exclusively endpoint and hardware security: USB threat hunting, BadUSB / RubberDucky / BashBunny keystroke injection, "
        "hardware descriptors (VID/PID), canary deception traps, suspicious process termination, malware payloads, and MITRE ATT&CK mapping.\n"
        "- NEVER discuss project management, kanban/Trello boards, HR, or non-security software.\n"
        "- SPEED & BREVITY: Jump directly into the technical explanation without conversational preamble or filler (do not start with 'Certainly, Investigator', 'Sure', or echoing the prompt). State facts directly and cleanly in 1-2 sharp sentences or crisp bullet points so answers finish fast.\n"
        "- Always complete your explanations cleanly and thoroughly with professional formatting.\n"
    )




    if session_id:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("SELECT session_id, device_name, vendor_id, product_id, risk_score, status FROM sessions WHERE session_id = ?", (session_id,))
        s_row = cursor.fetchone()
        if s_row:
            s_dict = dict(s_row)
            cursor.execute("SELECT alert_type, title, severity FROM alerts WHERE session_id = ? LIMIT 3", (session_id,))
            s_dict["alerts"] = [dict(r) for r in cursor.fetchall()]
            prompt += f"\nFocused Session: {json.dumps(s_dict)}\n"
        conn.close()

    return prompt

@router.get("/status")
async def get_ai_status():
    """Returns the operational status, latency, and model info of GLM-4 / Ollama."""
    health = await glm_client.acheck_health()
    return health

@router.post("/chat/stream")
async def copilot_chat_stream(req: ChatRequest):
    """
    Streaming SecOps Copilot endpoint.
    Tokens stream directly to the client as generated (starts in ~1.5s).
    """
    system_prompt = _build_system_prompt(req.session_id)
    messages = [{"role": "system", "content": system_prompt}]
    
    if req.history:
        for h in req.history[-4:]:
            messages.append({"role": h.role, "content": h.content})
    messages.append({"role": "user", "content": req.message})

    async def token_generator():
        async for chunk in glm_client.astream_chat(messages=messages, temperature=0.2):
            yield chunk

    return StreamingResponse(token_generator(), media_type="text/plain")

@router.post("/chat")
async def copilot_chat(req: ChatRequest):
    """
    Non-streaming fallback for SecOps Copilot interactive chat powered by GLM-4.
    """
    system_prompt = _build_system_prompt(req.session_id)
    messages = [{"role": "system", "content": system_prompt}]
    if req.history:
        for h in req.history[-4:]:
            messages.append({"role": h.role, "content": h.content})
    messages.append({"role": "user", "content": req.message})

    assistant_reply = await glm_client.achat(messages=messages, temperature=0.2)

    return {
        "reply": assistant_reply,
        "model": glm_client.model,
        "session_id": req.session_id
    }

@router.post("/analyze-script")
async def analyze_script(req: ScriptAnalysisRequest):
    """Deep analysis and de-obfuscation of a suspicious script or command line via GLM-4."""
    if not req.content.strip():
        raise HTTPException(status_code=400, detail="Script content is empty")

    analysis = await glm_client.analyze_script(script_content=req.content, filename=req.filename)
    return analysis

@router.post("/regenerate-report/{session_id}")
def regenerate_report(session_id: str):
    """Forces GLM-4 to re-analyze and regenerate the executive forensic report for a session."""
    report = ai_analyst.generate_incident_report(session_id=session_id, force_regenerate=True)
    if "error" in report:
        raise HTTPException(status_code=404, detail=report["error"])
    return report
