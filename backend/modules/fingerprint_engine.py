import json
import hashlib
from typing import List, Dict, Any, Tuple
from backend.db.database import get_connection

class FingerprintEngine:
    """
    Attack DNA Engine: Extracts behavioral signatures per session
    (sequence of event types, touched paths, process tree),
    computes Jaccard/Cosine similarity against past sessions,
    and attributes attacks to threat families.
    """

    @staticmethod
    def extract_features(events: List[Dict[str, Any]]) -> Dict[str, Any]:
        event_types = set()
        touched_paths = set()
        commands = set()

        for evt in events:
            event_types.add(evt.get("event_type", ""))
            details = evt.get("details", "")
            raw = evt.get("raw_payload", "")

            # Extract realistic paths from details
            for word in (details + " " + (raw or "")).split():
                if "/" in word or "\\" in word:
                    cleaned = word.strip(" '\"`(),;:")
                    if len(cleaned) > 3:
                        touched_paths.add(cleaned)

            source = evt.get("source", "")
            if source:
                commands.add(source)

        feature_dict = {
            "event_types": sorted(list(event_types)),
            "touched_paths": sorted(list(touched_paths)),
            "commands": sorted(list(commands))
        }

        # Compute deterministic SHA-256 signature hash
        feature_str = json.dumps(feature_dict, sort_keys=True)
        signature_hash = hashlib.sha256(feature_str.encode()).hexdigest()

        return {
            "signature_hash": signature_hash,
            "features": feature_dict
        }

    @staticmethod
    def compute_jaccard_similarity(set_a: set, set_b: set) -> float:
        if not set_a and not set_b:
            return 1.0
        intersection = len(set_a.intersection(set_b))
        union = len(set_a.union(set_b))
        return intersection / union if union > 0 else 0.0

    @staticmethod
    def compare_sessions(features_a: Dict[str, Any], features_b: Dict[str, Any]) -> float:
        # Weighted composite similarity
        sim_types = FingerprintEngine.compute_jaccard_similarity(
            set(features_a.get("event_types", [])),
            set(features_b.get("event_types", []))
        )
        sim_paths = FingerprintEngine.compute_jaccard_similarity(
            set(features_a.get("touched_paths", [])),
            set(features_b.get("touched_paths", []))
        )
        sim_cmds = FingerprintEngine.compute_jaccard_similarity(
            set(features_a.get("commands", [])),
            set(features_b.get("commands", []))
        )

        # 45% event types, 35% paths, 20% commands
        score = (sim_types * 0.45) + (sim_paths * 0.35) + (sim_cmds * 0.20)
        return round(score * 100, 1)

    @staticmethod
    def save_and_attribute(session_id: str, events: List[Dict[str, Any]]) -> Dict[str, Any]:
        extracted = FingerprintEngine.extract_features(events)
        features = extracted["features"]
        sig_hash = extracted["signature_hash"]

        conn = get_connection()
        cursor = conn.cursor()

        # Query all existing fingerprints
        cursor.execute("SELECT session_id, vector_json FROM fingerprints WHERE session_id != ?", (session_id,))
        existing_fps = cursor.fetchall()

        best_match_session = None
        best_similarity = 0.0

        for row in existing_fps:
            prev_session = row["session_id"]
            prev_features = json.loads(row["vector_json"])
            sim = FingerprintEngine.compare_sessions(features, prev_features)
            if sim > best_similarity:
                best_similarity = sim
                best_match_session = prev_session

        # Save to database
        fp_id = f"FP-{session_id}"
        cursor.execute("""
        INSERT OR REPLACE INTO fingerprints (
            id, session_id, signature_hash, event_types, touched_paths, process_tree, vector_json, similarity_score, matched_session_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            fp_id,
            session_id,
            sig_hash,
            json.dumps(features["event_types"]),
            json.dumps(features["touched_paths"]),
            json.dumps(features["commands"]),
            json.dumps(features),
            best_similarity,
            best_match_session
        ))

        conn.commit()
        conn.close()

        return {
            "fingerprint_id": fp_id,
            "signature_hash": sig_hash,
            "similarity_score": best_similarity,
            "matched_session": best_match_session,
            "is_threat_family": best_similarity >= 75.0
        }

    @staticmethod
    def get_all_fingerprints() -> List[Dict[str, Any]]:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM fingerprints ORDER BY created_at DESC")
        rows = [dict(r) for r in cursor.fetchall()]
        conn.close()

        result = []
        for r in rows:
            vector = json.loads(r.get("vector_json") or "{}")
            result.append({
                "id": r["id"],
                "session_id": r["session_id"],
                "signature_hash": r["signature_hash"][:16] + "...",
                "similarity_score": r["similarity_score"],
                "matched_session_id": r["matched_session_id"],
                "created_at": r["created_at"],
                "event_types": vector.get("event_types", []),
                "touched_paths": vector.get("touched_paths", [])
            })
        return result
