import json
import networkx as nx
from typing import Dict, Any, List
from backend.database import get_db

class CorrelationEngine:
    """
    Constructs a directed NetworkX graph linking events causally and temporally.
    Emits nodes and edges with coordinates suitable for frontend SVG visualization.
    """
    def build_attack_graph(self, session_id: str) -> Dict[str, Any]:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT event_id, timestamp, source, event_type, severity, data_json, risk_score_delta
            FROM events
            WHERE session_id = ?
            ORDER BY timestamp ASC
        """, (session_id,))
        rows = cursor.fetchall()
        conn.close()

        if not rows:
            return {"nodes": [], "edges": [], "root_cause": None, "critical_path": []}

        G = nx.DiGraph()
        events = []
        for r in rows:
            evt = dict(r)
            evt["data"] = json.loads(evt["data_json"])
            events.append(evt)

        # Build nodes
        for idx, evt in enumerate(events):
            G.add_node(
                evt["event_id"],
                label=evt["event_type"],
                source=evt["source"],
                severity=evt["severity"],
                timestamp=evt["timestamp"],
                risk_delta=evt["risk_score_delta"],
                step=idx + 1
            )

        # Causal & temporal edge linking
        for i in range(len(events) - 1):
            src = events[i]
            dst = events[i + 1]
            relation = "PRECEDES"

            # Check for causal relationships
            if src["source"] == "USB" and dst["source"] == "KEYSTROKE":
                relation = "TRIGGERS_INJECTION"
            elif src["source"] == "KEYSTROKE" and dst["source"] == "PROCESS":
                relation = "EXECUTES_PAYLOAD"
            elif src["source"] == "PROCESS" and dst["source"] == "FILE_MONITOR":
                relation = "TOUCHES_FILESYSTEM"
            elif src["source"] == "CANARY_DECEPTION":
                relation = "TRIPPED_HONEYPOT"

            G.add_edge(src["event_id"], dst["event_id"], relation=relation)

        # Layout computation (linear DAG progression with level distribution)
        nodes_output = []
        x_spacing = 180
        for idx, (node_id, data) in enumerate(G.nodes(data=True)):
            y_offset = 120 + (idx % 2) * 50
            nodes_output.append({
                "id": node_id,
                "label": data.get("label", ""),
                "source": data.get("source", ""),
                "severity": data.get("severity", "INFO"),
                "timestamp": data.get("timestamp", ""),
                "risk_delta": data.get("risk_delta", 0),
                "step": data.get("step", idx + 1),
                "x": 60 + idx * x_spacing,
                "y": y_offset
            })

        edges_output = []
        for u, v, data in G.edges(data=True):
            edges_output.append({
                "source": u,
                "target": v,
                "relation": data.get("relation", "FOLLOWS")
            })

        critical_path = [e["event_id"] for e in events if e["severity"] in ("HIGH", "CRITICAL")]
        root_cause = events[0]["event_id"] if events else None

        # Store in DB
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO attack_chains (session_id, nodes_json, edges_json, root_cause, critical_path_json, updated_at)
            VALUES (?, ?, ?, ?, ?, datetime('now'))
            ON CONFLICT(session_id) DO UPDATE SET
                nodes_json = excluded.nodes_json,
                edges_json = excluded.edges_json,
                root_cause = excluded.root_cause,
                critical_path_json = excluded.critical_path_json,
                updated_at = datetime('now')
        """, (session_id, json.dumps(nodes_output), json.dumps(edges_output), root_cause, json.dumps(critical_path)))
        conn.commit()
        conn.close()

        return {
            "session_id": session_id,
            "nodes": nodes_output,
            "edges": edges_output,
            "root_cause": root_cause,
            "critical_path": critical_path
        }

correlation_engine = CorrelationEngine()
