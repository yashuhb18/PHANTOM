from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from backend.core.session_manager import session_manager
from backend.core.correlation_engine import correlation_engine
from backend.core.replay_engine import replay_engine

router = APIRouter(prefix="/api/sessions", tags=["sessions"])

@router.get("", response_model=List[Dict[str, Any]])
def list_sessions(limit: int = 50):
    return session_manager.list_sessions(limit=limit)

@router.get("/{session_id}")
def get_session(session_id: str):
    sess = session_manager.get_session(session_id)
    if not sess:
        raise HTTPException(status_code=404, detail="Session not found")
    return sess

@router.get("/{session_id}/graph")
def get_attack_graph(session_id: str):
    graph = correlation_engine.build_attack_graph(session_id)
    return graph

@router.get("/{session_id}/replay")
def get_session_replay(session_id: str):
    return replay_engine.get_replay_timeline(session_id)
