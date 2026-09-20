import hashlib
import json
from typing import List, Dict, Any
from backend.database import get_db

class FingerprintEngine:
    """
    Extracts Attack DNA behavioral tokens from session events and computes Jaccard similarity
    across different USB sessions (even with distinct hardware IDs).
    """
    def extract_fingerprint(self, session_id: str) -> Dict[str, Any]:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("SELECT event_type, source, severity, data_json FROM events WHERE session_id = ? ORDER BY timestamp ASC", (session_id,))
        rows = cursor.fetchall()
        conn.close()

        tokens = []
        for r in rows:
            data = json.loads(r["data_json"])
            etype = r["event_type"]

            if etype == "KEYSTROKE_INJECTION_DETECTED":
                tokens.append("VECTOR:HID_KEYSTROKE_INJECTION")
            elif "powershell" in str(data).lower():
                tokens.append("EXEC:POWERSHELL_PAYLOAD")
                if "-nop" in str(data).lower() or "-w hidden" in str(data).lower():
                    tokens.append("EVASION:HIDDEN_WINDOW")
                if "iex" in str(data).lower() or "downloadstring" in str(data).lower():
                    tokens.append("NETWORK:STAGER_DOWNLOAD")
            elif etype == "CANARY_TRAP_TRIPPED" or "canary" in str(data).lower():
                tokens.append("DECEPTION:CANARY_FILE_TOUCHED")
                if "aws" in str(data).lower():
                    tokens.append("TARGET:CLOUD_CREDENTIALS")
            elif etype == "OUTBOUND_C2_ESTABLISHED":
                tokens.append("NETWORK:C2_OUTBOUND")

        tokens = sorted(list(set(tokens)))
        if not tokens:
            tokens = ["GENERIC:USB_ACTIVITY"]

        dna_raw = "-".join(tokens)
        dna_hash = hashlib.sha256(dna_raw.encode("utf-8")).hexdigest()[:16]

        # Determine cluster family
        if "VECTOR:HID_KEYSTROKE_INJECTION" in tokens and "TARGET:CLOUD_CREDENTIALS" in tokens:
            cluster_family = "APT-DUCKY-DECEPTION-HARVESTER"
        elif "VECTOR:HID_KEYSTROKE_INJECTION" in tokens:
            cluster_family = "KEYSTROKE-INJECTION-STAGER"
        else:
            cluster_family = "UNCLASSIFIED-USB-EVENT"

        # Save to DB
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO fingerprints (session_id, dna_hash, cluster_family, tokens_json, created_at)
            VALUES (?, ?, ?, ?, datetime('now'))
            ON CONFLICT(session_id) DO UPDATE SET
                dna_hash = excluded.dna_hash,
                cluster_family = excluded.cluster_family,
                tokens_json = excluded.tokens_json,
                created_at = datetime('now')
        """, (session_id, dna_hash, cluster_family, json.dumps(tokens)))
        conn.commit()
        conn.close()

        return {
            "session_id": session_id,
            "dna_hash": dna_hash,
            "cluster_family": cluster_family,
            "tokens": tokens
        }

    def compare_fingerprints(self, session_id_1: str, session_id_2: str) -> Dict[str, Any]:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("SELECT session_id, dna_hash, cluster_family, tokens_json FROM fingerprints WHERE session_id IN (?, ?)", (session_id_1, session_id_2))
        rows = cursor.fetchall()
        conn.close()

        fp_map = {r["session_id"]: json.loads(r["tokens_json"]) for r in rows}

        tokens_1 = set(fp_map.get(session_id_1, []))
        tokens_2 = set(fp_map.get(session_id_2, []))

        if not tokens_1 or not tokens_2:
            similarity = 0.0
            common = []
            divergent = list(tokens_1.symmetric_difference(tokens_2))
        else:
            intersection = tokens_1.intersection(tokens_2)
            union = tokens_1.union(tokens_2)
            similarity = round(len(intersection) / len(union), 3)
            common = sorted(list(intersection))
            divergent = sorted(list(tokens_1.symmetric_difference(tokens_2)))

        is_match = similarity >= 0.70

        return {
            "source_session_id": session_id_1,
            "target_session_id": session_id_2,
            "similarity_score": similarity,
            "is_match": is_match,
            "common_subgraphs": common,
            "divergence_points": divergent,
            "verdict": f"HIGH CONFIDENCE MATCH ({int(similarity*100)}%) - SAME THREAT ACTOR TOOLING" if is_match else "DISTINCT ATTACK PROFILE"
        }

fingerprint_engine = FingerprintEngine()
