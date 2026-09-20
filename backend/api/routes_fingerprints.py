import json
from fastapi import APIRouter, Query, HTTPException
from typing import List, Dict, Any
from backend.database import get_db
from backend.core.fingerprint_engine import fingerprint_engine

router = APIRouter(prefix="/api/fingerprints", tags=["fingerprints"])

@router.get("", response_model=List[Dict[str, Any]])
def list_fingerprints():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT f.session_id, f.dna_hash, f.cluster_family, f.tokens_json, f.created_at,
               s.device_name, s.vendor_id, s.product_id, s.risk_score
        FROM fingerprints f
        LEFT JOIN sessions s ON f.session_id = s.session_id
        ORDER BY f.created_at DESC
    """)
    rows = cursor.fetchall()
    conn.close()

    result = []
    for r in rows:
        item = dict(r)
        item["tokens"] = json.loads(item["tokens_json"])
        result.append(item)
    return result

@router.get("/compare")
def compare_fingerprints(
    source: str = Query(..., description="Source session ID"),
    target: str = Query(..., description="Target session ID")
):
    comparison = fingerprint_engine.compare_fingerprints(source, target)
    return comparison
