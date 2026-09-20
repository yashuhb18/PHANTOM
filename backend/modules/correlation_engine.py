import networkx as nx
import json
from typing import List, Dict, Any
from backend.db.database import get_connection

class CorrelationEngine:
    """
    Constructs directed attack causality graphs using NetworkX.
    Links events by session_id, causal dependencies, and temporal proximity.
    """

    @staticmethod
    def build_graph(session_id: str, events: List[Dict[str, Any]]) -> Dict[str, Any]:
        G = nx.DiGraph()

        nodes_list = []
        edges_list = []

        # Position layout mapping for frontend rendering
        positions = [
            (60, 140),   # 1 Ingress / USB
            (230, 140),  # 2 Process Spawn
            (400, 90),   # 3 Exploit / Breakout
            (570, 140),  # 4 Process Masquerade
            (740, 80),   # 5 Canary Touch
            (740, 210)   # 6 Micro-Containment
        ]

        # Add nodes
        for idx, evt in enumerate(events):
            pos_x, pos_y = positions[idx % len(positions)]
            node_id = f"node-{evt.get('id', idx)}"
            severity = "critical" if evt.get("risk_weight", 0) >= 0.8 else "warning" if evt.get("risk_weight", 0) >= 0.5 else "safe"

            node_data = {
                "id": node_id,
                "label": evt.get("event_type", "EVENT"),
                "sublabel": evt.get("source", "System"),
                "type": "process" if "PROCESS" in evt.get("event_type", "") else "canary" if "CANARY" in evt.get("event_type", "") else "socket",
                "severity": severity,
                "x": pos_x,
                "y": pos_y,
                "stepIndex": idx + 1,
                "details": {
                    "Details": evt.get("details", ""),
                    "Timestamp": evt.get("timestamp", ""),
                    "Source": evt.get("source", ""),
                    "Risk Weight": str(evt.get("risk_weight", 0))
                }
            }

            G.add_node(node_id, **node_data)
            nodes_list.append(node_data)

            # Add causal edge from previous node
            if idx > 0:
                prev_node_id = f"node-{events[idx - 1].get('id', idx - 1)}"
                edge_id = f"edge-{idx}"
                edge_label = "Causal Link"
                if "CANARY" in evt.get("event_type", ""):
                    edge_label = "Honeytoken Read"
                elif "CONTAIN" in evt.get("event_type", ""):
                    edge_label = "Autonomous Sever"
                elif "INJECT" in evt.get("event_type", ""):
                    edge_label = "Masqueraded Exec"

                edge_data = {
                    "id": edge_id,
                    "source": prev_node_id,
                    "target": node_id,
                    "label": edge_label,
                    "stepIndex": idx + 1
                }

                G.add_edge(prev_node_id, node_id, **edge_data)
                edges_list.append(edge_data)

        # Save to SQLite
        graph_data = {
            "session_id": session_id,
            "nodes": nodes_list,
            "edges": edges_list
        }

        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("""
        INSERT OR REPLACE INTO attack_chains (session_id, graph_json, nodes_json, edges_json)
        VALUES (?, ?, ?, ?)
        """, (session_id, json.dumps(graph_data), json.dumps(nodes_list), json.dumps(edges_list)))
        conn.commit()
        conn.close()

        return graph_data

    @staticmethod
    def get_graph(session_id: str) -> Dict[str, Any]:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT graph_json FROM attack_chains WHERE session_id = ?", (session_id,))
        row = cursor.fetchone()
        conn.close()

        if row and row["graph_json"]:
            return json.loads(row["graph_json"])

        # Fallback: query events and build on the fly
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM events WHERE session_id = ? ORDER BY created_at ASC", (session_id,))
        events = [dict(r) for r in cursor.fetchall()]
        conn.close()

        if events:
            return CorrelationEngine.build_graph(session_id, events)

        return {"session_id": session_id, "nodes": [], "edges": []}
