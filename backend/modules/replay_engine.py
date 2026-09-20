import json
from typing import Dict, Any, List
from backend.db.database import get_connection

class ReplayEngine:
    """
    Time-Travel Replay: Stores events with timestamps, allowing frontend
    scrubber to reconstruct graph state node-by-node at any point in time.
    """

    @staticmethod
    def get_replay_state(session_id: str, step: int) -> Dict[str, Any]:
        conn = get_connection()
        cursor = conn.cursor()

        # Query all events for session
        cursor.execute("SELECT * FROM events WHERE session_id = ? ORDER BY created_at ASC", (session_id,))
        events = [dict(r) for r in cursor.fetchall()]

        # Query full graph
        cursor.execute("SELECT graph_json FROM attack_chains WHERE session_id = ?", (session_id,))
        row = cursor.fetchone()
        conn.close()

        total_steps = len(events)
        if total_steps == 0:
            return {"session_id": session_id, "current_step": 1, "total_steps": 1, "nodes": [], "edges": []}

        clamped_step = max(1, min(step, total_steps))

        if row and row["graph_json"]:
            full_graph = json.loads(row["graph_json"])
            active_nodes = [n for n in full_graph.get("nodes", []) if n.get("stepIndex", 1) <= clamped_step]
            active_edges = [e for e in full_graph.get("edges", []) if e.get("stepIndex", 1) <= clamped_step]

            return {
                "session_id": session_id,
                "current_step": clamped_step,
                "total_steps": total_steps,
                "nodes": active_nodes,
                "edges": active_edges,
                "current_event": events[clamped_step - 1] if clamped_step <= len(events) else None
            }

        return {"session_id": session_id, "current_step": clamped_step, "total_steps": total_steps, "nodes": [], "edges": []}
